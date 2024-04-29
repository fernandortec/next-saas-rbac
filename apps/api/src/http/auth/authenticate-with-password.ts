import { prisma } from '@/lib/prisma';
import { zValidator } from '@hono/zod-validator';
import { compare } from 'bcrypt-ts';
import { Hono } from 'hono';
import { z } from 'zod';
import { sign } from 'hono/jwt';

export const authenticateWithPassword = new Hono().post(
	'/login',
	zValidator(
		'json',
		z.object({
			email: z.string().email(),
			password: z.string(),
		})
	),
	async (c): Promise<Response> => {
		const { email, password } = c.req.valid('json');

		const userFromEmail = await prisma.user.findUnique({ where: { email } });

		if (!userFromEmail) {
			return c.json({ message: 'Invalid credentials' }, 400);
		}

		if (userFromEmail.passwordHash === null) {
			return c.json({
				message: 'User does not have a password, use social login',
			});
		}

		const isPasswordValid = await compare(password, userFromEmail.passwordHash);

		if (!isPasswordValid) {
			return c.json({ message: 'Invalid credentials' });
		}

		const token = await sign({ sub: userFromEmail.id, exp: '7d' }, '123456789');

		return c.json({ token }, 201);
	}
);
