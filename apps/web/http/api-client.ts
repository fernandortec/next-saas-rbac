import { getCookie } from 'cookies-next';
import type { CookiesFn } from 'cookies-next/lib/types';
import ky from 'ky';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const api = ky.create({
	prefixUrl: 'http://localhost:3333',
	hooks: {
		beforeRequest: [
			async (request) => {
				let token: string | undefined;

				if (typeof window === 'undefined') {
					const { cookies: serverCookies } = await import('next/headers');
					const cookies = await serverCookies();
					token = cookies.get('token')?.value;
				}

				if (!token) token = getCookie('token');

				if (token) request.headers.set('authorization', `Bearer ${token}`);
			},
		],
	},
});
