import { BadRequestError } from '@/http/_errors/bad-request-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getProfile = new Elysia().use(auth).get(
	'/me',
	async ({ getCurrentUserId }) => {
		const { userId } = await getCurrentUserId();

		const user = await prisma.user.findUnique({
			select: { id: true, name: true, email: true, avatarUrl: true },
			where: { id: userId },
		});

		if (!user) throw new BadRequestError('User not found');

		return { user };
	},
	{
		detail: {
			summary: 'Get logged-in profile',
			tags: ['user'],
		},
		headers: t.Object({ authorization: t.String() }),
		response: t.Object({
			user: t.Object({
				name: t.Nullable(t.String()),
				id: t.String(),
				email: t.String(),
				avatarUrl: t.Nullable(t.String()),
			}),
		}),
	}
);
