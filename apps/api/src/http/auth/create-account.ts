import { prisma } from '@/lib/prisma';
import { zValidator } from '@hono/zod-validator';
import { hash } from 'bcrypt-ts';
import { Hono } from 'hono';
import { z } from 'zod';

export const createAccount = new Hono().post(
	'/',
	zValidator(
		'json',
		z.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string().min(6),
		})
	),
	async (c): Promise<Response> => {
		const { name, email, password } = c.req.valid('json');

		const userWithSameEmail = await prisma.user.findUnique({
			where: { email },
		});

		if (userWithSameEmail) {
			return c.json({ message: 'User with same e-mail already exists' }, 400);
		}

		const passwordHash = await hash(password, 6);

		const user = await prisma.user.create({
			data: { email, name, passwordHash },
		});

		return c.json({ user }, 204);
	}
);
