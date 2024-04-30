import { authenticateWithPassword } from '@/http/auth/authenticate-with-password';
import { createAccount } from '@/http/auth/create-account';
import { getProfile } from '@/http/auth/get-profile';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';

export const app = new Elysia();
export type App = typeof app;

app
	.use(cors())
	.use(swagger())
	.use(authenticateWithPassword)
	.use(createAccount)
	.use(getProfile);
