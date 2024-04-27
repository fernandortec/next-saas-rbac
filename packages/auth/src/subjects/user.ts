import z from 'zod';

export const userSubject = z.tuple([
	z.union([z.literal('delete'), z.literal('manage'), z.literal('update'), z.literal('get')]),
	z.literal('user'),
]);

export type UserSubject = z.infer<typeof userSubject>;
