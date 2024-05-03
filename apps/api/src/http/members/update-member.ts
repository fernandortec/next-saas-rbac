import { getUserPermissions } from '@/helpers/get-user-permissions';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const updateMember = new Elysia().use(auth).put(
	'/organizations/:slug/members/:memberId',
	async ({ getCurrentUserId, getUserMembership, params, body }) => {
		const { userId } = await getCurrentUserId();
		const { slug, memberId } = params;

		const { membership } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('get', 'User')) {
			throw new UnauthorizedError(
				"You're not allowed to see update this member members"
			);
		}

		const { role } = body;

		await prisma.member.update({ where: { id: memberId }, data: { role } });
	},
	{
		body: t.Object({
			role: t.Union([
				t.Literal('admin'),
				t.Literal('member'),
				t.Literal('billing'),
			]),
		}),
		params: t.Object({ slug: t.String(), memberId: t.String() }),
		response: t.Void(),
		detail: {
			summary: 'Update a member',
			tags: ['members'],
		},
	}
);
