import { env } from '@saas/env';
import { getCookie } from 'cookies-next';
import ky from 'ky';

export const api = ky.create({
	prefixUrl: env.NEXT_PUBLIC_API_URL,
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
