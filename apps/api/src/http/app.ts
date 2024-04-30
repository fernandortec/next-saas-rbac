import { authenticateWithPassword } from '@/http/auth/authenticate-with-password';
import { createAccount } from '@/http/auth/create-account';
import { getProfile } from '@/http/auth/get-profile';
import { requestpasswordRecover, requestpasswordRecover } from '@/http/auth/request-password-recover';
import { resetPassword } from '@/http/auth/reset-password';
import { errorHandler } from '@/http/error-handler';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';

export const app = new Elysia();
export type App = typeof app;

app
	.use(cors())
	.use(swagger())
	.onError((ctx) => errorHandler(ctx))
	.use(authenticateWithPassword)
	.use(createAccount)
	.use(getProfile)
	.use(requestpasswordRecover).use(resetPassword)
