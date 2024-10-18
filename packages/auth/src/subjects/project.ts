import { projectSchema } from '../models/project';
import z from 'zod';

export const projectSubject = z.tuple([
	z.union([
		z.literal('create'),
		z.literal('delete'),
		z.literal('manage'),
		z.literal('get'),
		z.literal('update'),
	]),
	z.union([z.literal('project'), projectSchema]),
]);

export type ProjectSubject = z.infer<typeof projectSubject>;
