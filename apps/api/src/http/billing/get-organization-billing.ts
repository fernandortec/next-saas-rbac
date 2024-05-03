import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getOrganizationBillings = new Elysia().use(auth).get(
	'/organizations/:slug/billing',
	async ({ getCurrentUserId, getUserMembership, params }) => {
		const { slug } = params;

		const { userId } = await getCurrentUserId();
		const { organization, membership } = await getUserMembership(slug, userId);
		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'Billing')) {
			throw new UnauthorizedError(
				"You're not allowed to get billing details from this organization"
			);
		}

		const [amountOfMembers, amountOfProjects] = await Promise.all([
			prisma.member.count({
				where: { organizationId: organization.id, role: { not: 'billing' } },
			}),
			prisma.project.count({ where: { organizationId: organization.id } }),
		]);

		return {
			billing: {
				seats: {
					amount: amountOfMembers,
					unit: 10,
					price: amountOfMembers * 10,
				},
				projects: {
					amount: amountOfProjects,
					unit: 20,
					price: amountOfProjects * 20,
				},
				total: amountOfMembers * 10 + amountOfProjects * 20,
			},
		};
	},
	{
		params: t.Object({ slug: t.String() }),
		detail: {
			tags: ['billings'],
			summary: 'Get billing information from an organization',
		},
		response: t.Object({
			billing: t.Object({
				seats: t.Object({
					amount: t.Number(),
					unit: t.Number(),
					price: t.Number(),
				}),
				projects: t.Object({
					amount: t.Number(),
					unit: t.Number(),
					price: t.Number(),
				}),
				total: t.Number(),
			}),
		}),
	}
);
