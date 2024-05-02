import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const getOrganizationsByUser = new Elysia().use(auth).get(
	'/organizations',
	async ({ getCurrentUserId }) => {
		const { userId } = await getCurrentUserId();

		const organizations = await prisma.organization.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				avatarUrl: true,
				members: { select: { role: true }, where: { userId } },
			},
			where: { members: { some: { userId } } },
		});

		return { organizations };
	},
	{
		detail: {
			tags: ['organizations'],
			summary: 'Get organizations where user is member',
		},
		response: t.Object({
			organizations: t.Array(
				t.Object({
					id: t.String(),
					name: t.String(),
					slug: t.String(),
					avatarUrl: t.Nullable(t.String()),
					members: t.Array(t.Object({ role: t.String() })),
				})
			),
		}),
	}
);
