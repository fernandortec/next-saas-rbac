import z from 'zod';

export const projectSchema = z.object({
	__typename: z.literal('project').default('project'),
	id: z.string().cuid(),
	ownerId: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
