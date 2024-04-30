import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const requestpasswordRecover = new Elysia().post(
	'/password/recover',
	async ({ body, set }) => {
		const { email } = body;

		const userFromEmail = await prisma.user.findUnique({ where: { email } });

		if (!userFromEmail) {
			set.status = 201;
			return;
		}

		const { id } = await prisma.token.create({
			data: { type: 'PASSWORD_RECOVER', userId: userFromEmail.id },
		});

		console.log('Recover password token', id);
	},
	{
		detail: {
			summary: 'Request password recover',
			tags: ['auth'],
		},
		body: t.Object({
			email: t.String({ format: 'email' }),
		}),
		response: t.Void(),
	}
);
