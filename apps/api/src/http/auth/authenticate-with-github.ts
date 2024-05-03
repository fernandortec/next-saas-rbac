import { jwtHandler } from '@/http/plugins/jwt';
import Elysia, { t } from 'elysia';
import { Value } from '@sinclair/typebox/value';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { prisma } from '@/lib/prisma';
import { env } from '@saas/env';

export const authenticateWithGithub = new Elysia().use(jwtHandler).post(
	'/auth/github',
	async ({ body, set, jwt }) => {
		const { code } = body;

		const githubOauthURL = new URL(
			'https://github.com/login/oauth/access_token'
		);
		githubOauthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
		githubOauthURL.searchParams.set('code', code);
		githubOauthURL.searchParams.set(
			'client_secret',
			env.GITHUB_OAUTH_CLIENT_SECRET
		);
		githubOauthURL.searchParams.set(
			'redirect_url',
			env.GITHUB_OAUTH_REDIRECT_URL
		);

		const githubAccessTokenResponse = await fetch(githubOauthURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
		});

		const githubAccessToken = await githubAccessTokenResponse.json();

		const { access_token } = Value.Decode(
			t.Object({
				access_token: t.String(),
				token_type: t.Literal('bearer'),
				scope: t.String(),
			}),
			githubAccessToken
		);

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: { Authorization: `Bearer ${access_token}` },
		});

		const githubUser = await githubUserResponse.json();

		const {
			id: githubId,
			avatar_url,
			email,
			name,
		} = Value.Decode(
			t.Object({
				id: t.Integer(),
				avatar_url: t.Nullable(t.String()),
				name: t.Nullable(t.String()),
				email: t.Nullable(t.String({ format: 'email' })),
			}),
			githubUser
		);
		if (email === null) {
			throw new BadRequestError('Github account must have an email');
		}

		let user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			user = await prisma.user.create({
				data: { name, email, avatarUrl: avatar_url },
			});
		}

		let account = await prisma.account.findUnique({
			where: {
				provider_userId: {
					provider: 'GITHUB',
					userId: user.id,
				},
			},
		});

		if (!account) {
			account = await prisma.account.create({
				data: {
					provider: 'GITHUB',
					providerAccountId: String(githubId),
					userId: user.id,
				},
			});
		}
		const token = await jwt.sign({
			sub: user.id,
			exp: 1000 * 60 * 60 * 24 * 7, // 7 days
		});

		return { token };
	},

	{
		body: t.Object({
			code: t.String(),
		}),
		response: t.Object({ token: t.String() }),
		detail: {
			summary: 'Login with github',
			tags: ['auth'],
		},
	}
); //https://github.com/login/oauth/authorize?client_id=611d6698a8186d1fac38&redirect_url=http://localhost:3333
