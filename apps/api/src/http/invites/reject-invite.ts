import { BadRequestError } from '@/http/_errors/bad-request-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const rejectInvite = new Elysia().use(auth).post(
	'/invites/:inviteId/reject',
	async (request) => {
		const { userId } = await request.getCurrentUserId();
		const { inviteId } = request.params;

		const invite = await prisma.invite.findUnique({
			where: { id: inviteId },
			include: {
				organization: true,
			},
		});

		if (!invite) throw new BadRequestError('Invite not found or expired');

		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			throw new BadRequestError('User not found');
		}

		if (invite.email !== user.email) {
			throw new BadRequestError('This invite belongs to another user');
		}

		await prisma.invite.delete({ where: { id: inviteId } });
	},
	{
		params: t.Object({ inviteId: t.String() }),
		response: t.Void(),
		detail: {
			summary: 'Reject an invite',
			tags: ['invites'],
		},
	}
);
