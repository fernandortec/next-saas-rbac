import { authenticateWithPassword } from '@/http/auth/authenticate-with-password';
import { createAccount } from '@/http/auth/create-account';
import cors from '@elysiajs/cors';
import Elysia from 'elysia';

export const app = new Elysia();
export type App = typeof app;

app.use(cors()).use(authenticateWithPassword).use(createAccount)
