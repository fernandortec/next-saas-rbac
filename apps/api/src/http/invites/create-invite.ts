import { getUserPermissions } from '@/helpers/get-user-permissions';
import { BadRequestError } from '@/http/_errors/bad-request-error';
import { UnauthorizedError } from '@/http/_errors/unauthorized-error';
import { auth } from '@/http/plugins/auth';
import { prisma } from '@/lib/prisma';
import Elysia, { t } from 'elysia';

export const createInvite = new Elysia().use(auth).post(
	'/organizations/:slug/invites',
	async ({ body, getCurrentUserId, getUserMembership, params, set }) => {
		const { userId } = await getCurrentUserId();
		const { slug } = params;

		const { membership, organization } = await getUserMembership(slug, userId);

		const { cannot } = getUserPermissions(userId, membership.role);

		if (cannot('create', 'Project')) {
			throw new UnauthorizedError("You're not allowed to create new invite");
		}
		const { email, role } = body;

		const [, domain] = email;
		if (
			organization.shouldAttachUsersByDomain &&
			organization.domain === domain
		) {
			throw new BadRequestError(
				`Users with ${domain} domain will join your organization automatically on login`
			);
		}

		const invitedBySameEmail = await prisma.invite.findUnique({
			where: {
				email_organizationId: { email, organizationId: organization.id },
			},
		});

		if (invitedBySameEmail) {
			throw new BadRequestError(
				'Another invite with same e-mail already exists'
			);
		}

		const membersWithSameEmail = await prisma.member.findFirst({
			where: { organizationId: organization.id, user: { email } },
		});

		if (membersWithSameEmail) {
			throw new BadRequestError(
				'A member with this e-mail already belongs yo your organization.'
			);
		}

		const invite = await prisma.invite.create({
			data: { organizationId: organization.id, email, role, authorId: userId },
		});

		return { inviteId: invite.id };
	},
	{
		body: t.Object({
			email: t.String({ format: 'email' }),
			role: t.Union([
				t.Literal('admin'),
				t.Literal('member'),
				t.Literal('billing'),
			]),
		}),
		params: t.Object({ slug: t.String() }),
		response: t.Object({ inviteId: t.String() }),
		detail: {
			summary: 'Create a new invite',
			tags: ['invites'],
		},
	}
);
