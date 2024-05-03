import { generateSlug } from '@/helpers/create-slug';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const createOrganization = new Elysia().use(auth).post(
	'/organizations',
	async ({ body, getCurrentUserId, set }) => {
		const { name, domain, shouldAttachUsersByDomain } = body;
		const { userId } = await getCurrentUserId();

		if (domain) {
			const organizationByDomain = await prisma.organization.findUnique({
				where: { domain },
			});

			if (organizationByDomain) {
				throw new BadRequestError(
					'Another organzation with same domain already exists'
				);
			}
		}

		const organization = await prisma.organization.create({
			data: {
				name,
				slug: generateSlug(name),
				domain,
				shouldAttachUsersByDomain,
				ownerId: userId,
				members: { create: { userId, role: 'member' } },
			},
		});
		set.status = 201;

		return { organzationId: organization.id };
	},
	{
		body: t.Object({
			name: t.String(),
			domain: t.Optional(t.Nullable(t.String())),
			shouldAttachUsersByDomain: t.Optional(t.Boolean()),
		}),
		response: t.Object({ organzationId: t.String() }),
		detail: { tags: ['organization'], summary: 'Create a new organization' },
	}
);
