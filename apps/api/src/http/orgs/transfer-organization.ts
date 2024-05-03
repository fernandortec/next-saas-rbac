import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const transferOrganization = new Elysia().use(auth).delete(
	'/organizations/:slug',
	async ({ getCurrentUserId, getUserMembership, params, set, body }) => {
		const { slug } = params;

		const { userId } = await getCurrentUserId();
		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('transfer_organization', organization)) {
			throw new UnauthorizedError(
				"You're not allowed to shutdown this organization"
			);
		}

		const { transferToUserId } = body;
		const transferToMembership = await prisma.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: organization.id,
					userId: transferToUserId,
				},
			},
		});

		if (!transferToMembership) {
			throw new BadRequestError(
				'Target user is not a member of this organization'
			);
		}

		await prisma.$transaction([
			prisma.member.update({
				where: {
					organizationId_userId: {
						organizationId: organization.id,
						userId: transferToUserId,
					},
				},
				data: { role: 'admin' },
			}),
			prisma.organization.update({
				where: { id: organization.id },
				data: { ownerId: transferToUserId },
			}),
		]);

		set.status = 204;
	},
	{
		detail: {
			tags: ['organizations'],
			summary: 'Transfer Organization',
		},
		response: t.Void(),
		body: t.Object({ transferToUserId: t.String() }),
		params: t.Object({ slug: t.String() }),
	}
);
