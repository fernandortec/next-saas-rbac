import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getProject = new Elysia().use(auth).get(
	'/organizations/details/:orgSlug/projects/:projectSlug',
	async ({ body, getCurrentUserId, getUserMembership, params, set }) => {
		const { userId } = await getCurrentUserId();
		const { orgSlug, projectSlug } = params;

		const { membership, organization } = await getUserMembership(
			orgSlug,
			userId
		);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'Project')) {
			throw new UnauthorizedError("You're not allowed to see this project");
		}

		const project = await prisma.project.findUnique({
			where: { slug: projectSlug, organizationId: organization.id },
			select: {
				id: true,
				name: true,
				description: true,
				slug: true,
				avatarUrl: true,
				ownerId: true,
				organizationId: true,
				owner: { select: { id: true, name: true, avatarUrl: true } },
			},
		});

		if (!project) {
			throw new BadRequestError('Project does not exists');
		}

		return { project };
	},
	{
		params: t.Object({ orgSlug: t.String(), projectSlug: t.String() }),
		response: t.Object({
			project: t.Nullable(
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
				})
			),
		}),
		detail: {
			summary: 'Get project detail',
			tags: ['projects'],
		},
	}
);
