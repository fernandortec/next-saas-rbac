'use server';

import { SignInWithPassword } from '@/http/sign-in-with-password';
import { type ActionResponse, actionClient } from '@/lib/next-safe-action';
import { HTTPError } from 'ky';
import { flattenValidationErrors } from 'next-safe-action';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const signInSchema = zfd.formData({
	email: z.string().email({ message: 'Please provide a valid email' }),
	password: z.string().min(3, { message: 'Please provide your password' }),
});

export const signInWithPasswordAction = actionClient
	.schema(signInSchema, {
		handleValidationErrorsShape: async (ve, utils) =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(
		async ({ parsedInput: { email, password } }): Promise<ActionResponse> => {
			const cookiesClient = await cookies();

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
