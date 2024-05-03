import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt-ts';
import Elysia, { t } from 'elysia';

export const resetPassword = new Elysia().post(
	'/password/reset',
	async ({ body, set }) => {
		const { code, newPassword } = body;

		const tokenFromCode = await prisma.token.findUnique({
			where: { id: code },
		});

		if (!tokenFromCode) {
			throw new UnauthorizedError();
		}

		const passwordHash = await hash(newPassword, 6);

		await prisma.$transaction([
			prisma.user.update({
				where: { id: tokenFromCode.userId },
				data: { passwordHash: passwordHash },
			}),
			prisma.token.delete({ where: { id: code } }),
		]);

		set.status = 204;
	},
	{
		detail: {
			summary: 'Reset password',
			tags: ['auth'],
		},
		body: t.Object({
			code: t.String(),
			newPassword: t.String({ minLength: 6 }),
		}),
		response: t.Void(),
	}
);
