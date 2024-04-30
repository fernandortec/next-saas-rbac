import { jwtPlugin } from '@/http/plugins/jwt';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getProfile = new Elysia().use(jwtPlugin).get(
	'/me',
	async ({ jwtVerify, headers }) => {
		const { sub } = await jwtVerify(headers.authorization);
		const user = await prisma.user.findUnique({
			select: { id: true, name: true, email: true, avatarUrl: true },
			where: { id: sub },
		});

		if (!user) throw new Error('User not found');

		return user;
	},
	{
		detail: {
			summary: 'Get logged-in profile',
			tags: ['user'],
		},
		headers: t.Object({ authorization: t.String() }),
		response: t.Object({
			name: t.Nullable(t.String()),
			id: t.String(),
			email: t.String(),
			avatarUrl: t.Nullable(t.String()),
		}),
	}
);
