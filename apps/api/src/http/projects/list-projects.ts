import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const listProjects = new Elysia().use(auth).get(
	'/organizations/:slug/projects',
	async ({ getCurrentUserId, getUserMembership, params }) => {
		const { userId } = await getCurrentUserId();
		const { slug } = params;

		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'Project')) {
			throw new UnauthorizedError(
				"You're not allowed to see this organization projects"
			);
		}

		const projects = await prisma.project.findMany({
			where: { organizationId: organization.id },
			select: {
				id: true,
				name: true,
				description: true,
				slug: true,
				avatarUrl: true,
				ownerId: true,
				organizationId: true,
				owner: { select: { id: true, name: true, avatarUrl: true } },
				createdAt: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		return { projects };
	},
	{
		params: t.Object({ slug: t.String() }),
		response: t.Object({
			projects: t.Array(
				t.Object({
					name: t.String(),
					description: t.String(),
					id: t.String(),
					slug: t.String(),
					avatarUrl: t.Nullable(t.String()),
					ownerId: t.String(),
					organizationId: t.String(),
					owner: t.Object({
						name: t.Nullable(t.String()),
						id: t.String(),
						avatarUrl: t.Nullable(t.String()),
					}),
					createdAt: t.Date(),
				})
			),
		}),
		detail: {
			summary: 'List projects',
			tags: ['projects'],
		},
	}
);
