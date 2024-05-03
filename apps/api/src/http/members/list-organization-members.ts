import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import { $Enums } from '@prisma/client';
import Elysia, { t } from 'elysia';

export const listOrganizationMembers = new Elysia().use(auth).get(
	'/organizations/:slug/members',
	async ({ getCurrentUserId, getUserMembership, params }) => {
		const { userId } = await getCurrentUserId();
		const { slug } = params;

		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'User')) {
			throw new UnauthorizedError(
				"You're not allowed to see organization members"
			);
		}

		const members = await prisma.member.findMany({
			where: { organizationId: organization.id },
			select: {
				id: true,
				role: true,
				user: {
					select: { id: true, name: true, email: true, avatarUrl: true },
				},
			},
			orderBy: { role: 'asc' },
		});

		return members;
	},
	{
		params: t.Object({ slug: t.String() }),
		response: t.Array(
			t.Object({
				id: t.String(),
				role: t.String(),
				user: t.Object({
					name: t.Nullable(t.String()),
					id: t.String(),
					email: t.String(),
					avatarUrl: t.Nullable(t.String()),
				}),
			})
		),
		detail: {
			summary: 'List all organization members',
			tags: ['members'],
		},
	}
);
