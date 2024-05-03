import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const listInvites = new Elysia().use(auth).post(
	'/organizations/:slug/invites',
	async ({ body, getCurrentUserId, getUserMembership, params, set }) => {
		const { userId } = await getCurrentUserId();
		const { slug } = params;

		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'Project')) {
			throw new UnauthorizedError(
				"You're not allowed to get organization invites"
			);
		}

		const invites = await prisma.invite.findMany({
			where: { organizationId: organization.id },
			select: {
				id: true,
				email: true,
				role: true,
				createdAt: true,
				author: { select: { id: true, name: true } },
			},
			orderBy: { createdAt: 'desc' },
		});

		return { invites };
	},
	{
		params: t.Object({ slug: t.String() }),
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
						})
					),
				})
			),
		}),
		detail: {
			summary: 'Get all organization invites',
			tags: ['invites'],
		},
	}
);
