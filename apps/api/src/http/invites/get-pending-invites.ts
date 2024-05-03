import { BadRequestError } from '@/http/_errors/bad-request-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getPendingInvites = new Elysia().use(auth).get(
	'/pending-invites',
	async (request) => {
		const { userId } = await request.getCurrentUserId();

		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) throw new BadRequestError('User not found');

		const invites = await prisma.invite.findMany({
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				author: { select: { id: true, name: true, avatarUrl: true } },
				organization: { select: { id: true, name: true } },
			},
			where: { email: user.email },
		});

		return { invites };
	},
	{
		response: t.Object({
			invites: t.Array(
				t.Object({
					id: t.String(),
					email: t.String(),
					role: t.String(),
					createdAt: t.Date(),
					author: t.Nullable(
						t.Object({
							id: t.String(),
							name: t.Nullable(t.String()),
							avatarUrl: t.Nullable(t.String()),
						})
					),
					organization: t.Object({
						id: t.String(),
						name: t.String(),
					}),
				})
			),
		}),
		detail: {
			summary: 'Get all user pending invites',
			tags: ['invites'],
		},
	}
);
