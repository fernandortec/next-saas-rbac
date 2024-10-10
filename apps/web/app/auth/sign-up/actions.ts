'use server';

import { SignUp } from '@/http/sign-up';
import { type ActionResponse, actionClient } from '@/lib/next-safe-action';
import { HTTPError } from 'ky';
import { flattenValidationErrors } from 'next-safe-action';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const signUpSchema = zfd
	.formData({
		name: z.string().refine((name) => name.split(' ').length >= 1, {
			message: 'Please provide your full name',
		}),
		email: z.string().email({ message: 'Please provide a valid email' }),
		password: z
			.string()
			.min(6, { message: 'Password should have at least 6 characters' }),
		passwordConfirmation: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords don't match",
		path: ['passwordConfirmation'],
	});

export const signUpAction = actionClient
	.schema(signUpSchema, {
		handleValidationErrorsShape: (ve, utils) =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(
		async ({
			parsedInput: { email, password, name },
		}): Promise<ActionResponse> => {
			try {
				await SignUp({
					name,
					email,
					password,
				});
			} catch (error) {
				if (error instanceof HTTPError) {
					const { message } = await error.response.json();
					return { success: false, errors: null, message: message };
				}
			}

			return redirect('/auth/sign-in');
		}
	);
