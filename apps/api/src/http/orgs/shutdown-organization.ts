import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const shutdownOrganization = new Elysia().use(auth).delete(
	'/organizations/:slug',
	async ({ getCurrentUserId, getUserMembership, params, set }) => {
		const { slug } = params;

		const { userId } = await getCurrentUserId();
		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('delete', organization)) {
			throw new UnauthorizedError(
				"You're not allowed to shutdown this organization"
			);
		}
		await prisma.organization.delete({
			where: { id: organization.id },
		});

		set.status = 204;
	},
	{
		params: t.Object({ slug: t.String() }),
		response: t.Void(),
		detail: {
			tags: ['organizations'],
			summary: 'Shtudown Organization',
		},
	}
);
