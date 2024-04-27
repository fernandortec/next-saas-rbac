import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createAccount } from './auth/create-account';

const app = new Hono();

app.use('/', cors());
app.route('/users', createAccount);

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

export default {
	port: 3333,
	fetch: app.fetch,
};
