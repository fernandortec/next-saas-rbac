import { BadRequestError } from '@/http/_errors/bad-request-error';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getInvite = new Elysia().get(
	'/invites/:inviteId',
	async (request) => {
		const { inviteId } = request.params;

		const invite = await prisma.invite.findUnique({
			where: { id: inviteId },
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				author: { select: { id: true, name: true, avatarUrl: true } },
				organization: { select: { id: true, name: true } },
			},
		});

		if (!invite) throw new BadRequestError('Invite not found');

		return { invite };
	},
	{
		params: t.Object({ inviteId: t.String() }),
		response: t.Object({
			invite: t.Nullable(
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
			summary: 'Get an invite',
			tags: ['invites'],
		},
	}
);
