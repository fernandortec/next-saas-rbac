import z from 'zod';

export const inviteSubject = z.tuple([
	z.union([
		z.literal('create'),
		z.literal('delete'),
		z.literal('manage'),
		z.literal('get'),
	]),
	z.literal('invite'),
]);

export type InviteSubject = z.infer<typeof inviteSubject>;
