import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const revokeInvite = new Elysia().use(auth).delete(
	'/organizations/:slug/invites/:inviteId',
	async ({ getCurrentUserId, getUserMembership, params }) => {
		const { userId } = await getCurrentUserId();
		const { slug, inviteId } = params;

		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('delete', 'Project')) {
			throw new UnauthorizedError("You're not delete an invite");
		}

		const invite = await prisma.invite.findUnique({
			where: {
				id: inviteId,
				organizationId: organization.id,
			},
		});

		if (!invite) {
			throw new BadRequestError('Invite not found');
		}

		await prisma.invite.delete({
			where: {
				id: inviteId,
			},
		});
	},
	{
		params: t.Object({ slug: t.String(), inviteId: t.String() }),
		response: t.Void(),
		detail: {
			summary: 'Revoke an invite',
			tags: ['invites'],
		},
	}
);
