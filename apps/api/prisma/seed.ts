import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt-ts';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

await prisma.organization.deleteMany();
await prisma.user.deleteMany();

const passwordHash = await hash('123456', 1);
const user = await prisma.user.create({
	data: {
		name: 'John Doe',
		email: 'john@doe.com',
		avatarUrl: 'https://github.com/fernandortec.png',
		passwordHash: passwordHash,
	},
});

const secondUser = await prisma.user.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		avatarUrl: faker.image.avatarGitHub(),
		passwordHash: passwordHash,
	},
});

const thirdUser = await prisma.user.create({
	data: {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		avatarUrl: faker.image.avatarGitHub(),
		passwordHash: passwordHash,
	},
});

await prisma.organization.create({
	data: {
		name: 'Acme Inc (Admin)',
		domain: 'acme.com',
		slug: 'acme-admin',
		avatarUrl: faker.image.avatarGitHub(),
		shouldAttachUsersByDomain: true,
		ownerId: user.id,
		projects: {
			createMany: {
				data: [
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
				],
			},
		},
		members: {
			createMany: {
				data: [
					{
						userId: user.id,
						role: 'admin',
					},
					{
						userId: secondUser.id,
						role: 'member',
					},
					{
						userId: thirdUser.id,
						role: 'member',
					},
				],
			},
		},
	},
});

await prisma.organization.create({
	data: {
		name: 'Acme Inc (Member)',
		slug: 'acme-member',
		avatarUrl: faker.image.avatarGitHub(),
		ownerId: user.id,
		projects: {
			createMany: {
				data: [
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
				],
			},
		},
		members: {
			createMany: {
				data: [
					{
						userId: user.id,
						role: 'member',
					},
					{
						userId: secondUser.id,
						role: 'admin',
					},
					{
						userId: thirdUser.id,
						role: 'member',
					},
				],
			},
		},
	},
});

await prisma.organization.create({
	data: {
		name: 'Acme Inc (Billing)',
		slug: 'acme-billing',
		avatarUrl: faker.image.avatarGitHub(),
		ownerId: user.id,
		projects: {
			createMany: {
				data: [
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
					{
						name: faker.lorem.words(5),
						slug: faker.lorem.slug(),
						description: faker.lorem.paragraph(),
						avatarUrl: faker.image.avatarGitHub(),
						ownerId: faker.helpers.arrayElement([
							user.id,
							secondUser.id,
							thirdUser.id,
						]),
					},
				],
			},
		},
		members: {
			createMany: {
				data: [
					{
						userId: user.id,
						role: 'billing',
					},
					{
						userId: secondUser.id,
						role: 'admin',
					},
					{
						userId: thirdUser.id,
						role: 'member',
					},
				],
			},
		},
	},
});

console.log("✓ Database seeded sucessfully")