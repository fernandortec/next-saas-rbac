import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const updateProject = new Elysia().use(auth).get(
	'/organizations/:slug/projects/:projectId',
	async ({ getCurrentUserId, getUserMembership, params, body }) => {
		const { userId } = await getCurrentUserId();
		const { orgSlug, projectId } = params;

		const { membership, organization } = await getUserMembership(
			orgSlug,
			userId
		);

		const project = await prisma.project.findUnique({
			where: { id: projectId, organizationId: organization.id },
		});

		if (!project) {
			throw new BadRequestError('Project does not exists');
		}

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('update', 'Project')) {
			throw new UnauthorizedError("You're not allowed update this project");
		}

		const { description, name } = body;

		await prisma.project.update({
			where: { id: projectId },
			data: { description, name },
		});

		return project;
	},
	{
		params: t.Object({ orgSlug: t.String(), projectId: t.String() }),
		body: t.Object({ name: t.String(), description: t.String() }),
		detail: {
			summary: 'Update project',
			tags: ['projects'],
		},
	}
);
