import { z } from 'zod';

const envSchema = z.object({
	PRISMA_URL: z.string().url(),
	PRISMA_URL_NON_POOLING: z.string().url(),
	SECRET_JWT: z.string(),
	NODE_ENV: z.enum(['dev', 'prod', 'test'])
});

export const env = envSchema.parse(process.env);
