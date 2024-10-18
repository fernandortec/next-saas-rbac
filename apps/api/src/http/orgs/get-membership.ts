import { auth } from '@/http/plugins/auth';
import Elysia, { t } from 'elysia';

export const getMembership = new Elysia().use(auth).get(
	'/organizations/:slug/membership',
	async ({ getCurrentUserId, getUserMembership, params }) => {
		const { slug } = params;

		const { userId } = await getCurrentUserId();
		const { membership } = await getUserMembership(slug, userId);

		return {
			membership: {
				id: membership.id,
				role: membership.role,
				userId,
				organizationId: membership.organizationId,
			},
		};
	},
	{
		params: t.Object({ slug: t.String() }),
		detail: {
			tags: ['organizations'],
			summary: 'Get user membership on organization',
		},
		response: t.Object({
			membership: t.Object({
				id: t.String(),
				role: t.String(),
				userId: t.String(),
				organizationId: t.String(),
			}),
		}),
	}
);
