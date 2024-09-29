'use server';

import { SignInWithPassword } from '@/http/sign-in-with-password';
import { type ActionResponse, actionClient } from '@/lib/next-safe-action';
import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const cookiesClient = await cookies();

const signInSchema = zfd.formData({
	email: z.string().email({ message: 'Please provide a valid email' }),
	password: z.string().min(3, { message: 'Please provide your password' }),
});

export const signInWithPasswordAction = actionClient
	.schema(signInSchema)
	.action(
		async ({ parsedInput: { email, password } }): Promise<ActionResponse> => {
			try {
				const response = await SignInWithPassword({
					password,
					email,
				});

				cookiesClient.set('token', response.token, {
					maxAge: 60 * 60 * 24 * 30, // 7 days
					path: '/',
				});
			} catch (error) {
				if (error instanceof HTTPError) {
					const { message } = await error.response.json();
					return { success: false, errors: null, message: message };
				}
			}

			return redirect('/');
		}
	);

export const signInWithGithubAction = actionClient
	.schema(zfd.formData({}))
	.action(async (): Promise<void> => {
		const githubSignInURL = new URL(
			'login/oauth/authorize',
			'https://github.com'
		);

		githubSignInURL.searchParams.set('client_id', '611d6698a8186d1fac38');
		githubSignInURL.searchParams.set(
			'redirect_uri',
			'http://localhost:3000/api/auth/callback'
		);
		githubSignInURL.searchParams.set('scope', 'user');

		redirect(githubSignInURL.toString());
	});
