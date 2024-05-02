import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import { organizationSchema } from '@saas/auth';
import Elysia, { t } from 'elysia';

export const updateOrganization = new Elysia().use(auth).put(
	'/organizations/:slug',
	async ({ getCurrentUserId, getUserMembership, body, params, set }) => {
		const { slug } = params;
		const { name, domain, shouldAttachUsersByDomain } = body;

		const { userId } = await getCurrentUserId();
		const { membership, organization } = await getUserMembership(slug, userId);

		const authOrganization = organizationSchema.parse(organization);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('update', authOrganization)) {
			throw new UnauthorizedError(
				"You're not allowed to update this organization"
			);
		}

		if (domain) {
			const organizationByDomain = await prisma.organization.findFirst({
				where: { domain, slug: { not: slug } },
			});

			if (organizationByDomain) {
				throw new BadRequestError(
					'Another organzation with same domain already exists'
				);
			}
		}

		await prisma.organization.update({
			where: { id: organization.id },
			data: { name, domain, shouldAttachUsersByDomain },
		});

		set.status = 204;
	},
	{
		body: t.Object({
			name: t.String(),
			domain: t.Optional(t.Nullable(t.String())),
			shouldAttachUsersByDomain: t.Optional(t.Boolean()),
		}),
		detail: {
			tags: ['organizations'],
			summary: 'Updat Organization',
		},
		params: t.Object({ slug: t.String() }),
	}
);
