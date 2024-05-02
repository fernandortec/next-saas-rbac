import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { jwtHandler } from '@/http/plugins/jwt';
import { prisma } from '@/lib/prisma';
import type { Member, Organization } from '@prisma/client';
import Elysia from 'elysia';

export const auth = new Elysia()
	.use(jwtHandler)
	.derive({ as: 'scoped' }, ({ jwtVerify, headers }) => ({
		getCurrentUserId: async (): Promise<{ userId: string }> => {
			try {
				if (!headers.authorization)
					throw new UnauthorizedError('No auth token is provided');

				const { sub } = await jwtVerify(headers.authorization);
				if (!sub) throw new UnauthorizedError('User does not exists in token');

				return { userId: sub };
			} catch (error) {
				throw new UnauthorizedError('Could not authenticate user, login again');
			}
		},

		async getUserMembership(
			organizationSlug: string,
			userId: string
		): Promise<{ organization: Organization; membership: Member }> {
			const member = await prisma.member.findFirst({
				where: { userId, organization: { slug: organizationSlug } },
				include: { organization: true },
			});

			if (!member) {
				throw new UnauthorizedError(
					'You are not a member of this organization.'
				);
			}

			const { organization, ...membership } = member;

			return { organization, membership };
		},
	}));
