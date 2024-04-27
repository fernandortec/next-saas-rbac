import { organizationSchema } from '@/models/organization';
import z from 'zod';

export const organizationSubject = z.tuple([
	z.union([
		z.literal('delete'),
		z.literal('manage'),
		z.literal('update'),
		z.literal('transfer_ownership'),
	]),
	z.union([z.literal('organization'), organizationSchema]),
]);

export type OrganizationSubject = z.infer<typeof organizationSubject>;
