import { generateSlug } from '@/helpers/create-slug';
import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const createProject = new Elysia().use(auth).post(
	'/organizations/:slug/projects',
	async ({ body, getCurrentUserId, getUserMembership, params, set }) => {
		const { userId } = await getCurrentUserId();
		const { slug } = params;
		const { description, name } = body;

		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('create', 'Project')) {
			throw new UnauthorizedError("You're not allowed to create a project");
		}

		const project = await prisma.project.create({
			data: {
				name,
				description,
				slug: generateSlug(name),
				organizationId: organization.id,
				ownerId: userId,
			},
		});

		set.status = 201;

		return { projectId: project.id };
	},
	{
		body: t.Object({ name: t.String(), description: t.String() }),
		params: t.Object({ slug: t.String() }),
		response: t.Object({ projectId: t.String() }),
		detail: {
			summary: 'Create a project',
			tags: ['projects'],
		},
	}
);
