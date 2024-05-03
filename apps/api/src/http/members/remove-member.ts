import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const removeMember = new Elysia().use(auth).delete(
	'/organizations/:slug/members/:memberId',
	async ({ getCurrentUserId, getUserMembership, params, body }) => {
		const { userId } = await getCurrentUserId();
		const { slug, memberId } = params;

		const { membership } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'User')) {
			throw new UnauthorizedError(
				"You're not allowed to see remove this member from the organization"
			);
		}


		await prisma.member.delete({ where: { id: memberId } });
	},
	{
		params: t.Object({ slug: t.String(), memberId: t.String() }),
		response: t.Void(),
		detail: {
			summary: 'Remove a member from an organization',
			tags: ['members'],
		},
	}
);
