import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt-ts';
import Elysia, { t } from 'elysia';
import { sign } from 'hono/jwt';

export const authenticateWithPassword = new Elysia().post(
	'/auth/login',
	async ({ body, set }) => {
		const { email, password } = body;

		const userFromEmail = await prisma.user.findUnique({ where: { email } });

		if (!userFromEmail) {
			set.status = 400;
			return { message: 'Invalid credentials' };
		}

		if (userFromEmail.passwordHash === null) {
			set.status = 400;
			return { message: 'User does not have a password, use social login' };
		}

		const isPasswordValid = await compare(password, userFromEmail.passwordHash);

		if (!isPasswordValid) {
			set.status = 400;
			return { message: 'Invalid credentials' };
		}

		const token = await sign({ sub: userFromEmail.id, exp: '7d' }, '123456789');

		return { token };
	},
	{
		body: t.Object({
			email: t.String({ format: 'email' }),
			password: t.String(),
		}),
	}
);
