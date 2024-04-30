import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt-ts';
import Elysia, { t } from 'elysia';

export const createAccount = new Elysia().post(
	'/users',
	async ({ body, set }) => {
		const { name, email, password } = body;

		const userWithSameEmail = await prisma.user.findUnique({
			where: { email },
		});

		if (userWithSameEmail) {
			set.status = 404;
			return { message: 'User with same e-mail already exists' };
		}

		const [, domain] = email.split('@');
		const authJoinOrganization = await prisma.organization.findFirst({
			where: { domain, shouldAttachUsersByDomain: true },
		});

		const passwordHash = await hash(password, 6);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				passwordHash,
				memberOn: authJoinOrganization
					? {
							create: {
								organizationId: authJoinOrganization.id,
							},
						}
					: undefined,
			},
		});

		return { user };
	},
	{
		body: t.Object({
			name: t.String(),
			email: t.String({ format: 'email' }),
			password: t.String({ minLength: 6 }),
		}),
	}
);
