import { authenticateWithPassword } from '@/http/auth/authenticate-with-password';
import { createAccount } from '@/http/auth/create-account';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const app = new Hono();
export type AppType = typeof app;

app.use('/', cors());

app.route('/', authenticateWithPassword);
app.route('/users', createAccount);
app.route('/auth', authenticateWithPassword)
