import { BadRequestError } from '@/http/_errors/bad-request-error';
import { jwtPlugin } from '@/http/plugins/jwt';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt-ts';
import Elysia, { t } from 'elysia';

export const authenticateWithPassword = new Elysia().use(jwtPlugin).post(
	'/auth/login',
	async ({ body, set, jwt }) => {
		const { email, password } = body;

		const userFromEmail = await prisma.user.findUnique({ where: { email } });

		if (!userFromEmail) {
			set.status = 400;
			throw new BadRequestError('Invalid credentials');
		}

		if (userFromEmail.passwordHash === null) {
			set.status = 400;
			throw new BadRequestError(
				'User does not have a password, use social login'
			);
		}

		const isPasswordValid = await compare(password, userFromEmail.passwordHash);

		if (!isPasswordValid) {
			set.status = 400;
			throw new BadRequestError('Invalid credentials');
		}

		const token = await jwt.sign({
			sub: userFromEmail.id,
			exp: 1000 * 60 * 60 * 24 * 7, // 7 days
		});

		return { token };
	},
	{
		body: t.Object({
			email: t.String({ format: 'email' }),
			password: t.String(),
		}),
		detail: {
			summary: 'Login with password',
			tags: ['auth'],
		},
		response: t.Object({
			message: t.Optional(t.String()),
			token: t.Optional(t.String()),
		}),
	}
);
