import { generateSlug } from '@/helpers/create-slug';
import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@saas/auth';
import Elysia, { t } from 'elysia';

export const deleteProject = new Elysia().use(auth).delete(
	'/organizations/:slug/projects/:projectId',
	async ({ getCurrentUserId, getUserMembership, params, set }) => {
		const { userId } = await getCurrentUserId();
		const { slug, projectId } = params;

		const { membership, organization } = await getUserMembership(slug, userId);

		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
				organizationId: organization.id,
			},
		});

		if (!project) {
			throw new BadRequestError('Project does not exists');
		}

		const authProject = projectSchema.parse(project);
		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('delete', authProject)) {
			throw new UnauthorizedError("You're not allowed to delete this project");
		}

		await prisma.project.delete({ where: { id: project.id } });

		set.status = 204;
	},
	{
		params: t.Object({ slug: t.String(), projectId: t.String() }),
		response: t.Void(),
		detail: {
			summary: 'Delete a project',
			tags: ['projects'],
		},
	}
);
