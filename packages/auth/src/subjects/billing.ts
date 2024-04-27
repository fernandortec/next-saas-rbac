import z from 'zod';

export const billingSubject = z.tuple([
	z.union([
		z.literal('create'),
		z.literal('get'),
		z.literal('manage'),
		z.literal('export'),
	]),
	z.literal('billing'),
]);

export type billingSubject = z.infer<typeof billingSubject>;
