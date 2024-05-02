import { auth } from '@/http/plugins/auth';
import Elysia, { t } from 'elysia';

export const getOrganization = new Elysia().use(auth).get(
	'/organizations/:slug',
	async ({ getCurrentUserId, getUserMembership, params }) => {
		const { slug } = params;

		const { userId } = await getCurrentUserId();
		const { organization } = await getUserMembership(slug, userId);

		return organization;
	},
	{
		params: t.Object({ slug: t.String() }),
		detail: {
			tags: ['organizations'],
			summary: 'Get details from an organization',
		},
		response: t.Object({
			id: t.String(),
			name: t.String(),
			slug: t.String(),
			domain: t.Nullable(t.String()),
			avatarUrl: t.Nullable(t.String()),
			shouldAttachUsersByDomain: t.Boolean(),
			createdAt: t.Date(),
			updatedAt: t.Date(),
			ownerId: t.String(),
		}),
	}
);
