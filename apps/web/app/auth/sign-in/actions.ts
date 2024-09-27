'use server';
import { SignInWithPassword } from '@/http/sign-in-with-password';
import { HTTPError } from 'ky';
import { z } from 'zod';

const signInSchema = z.object({
	email: z.string().email({ message: 'Please provide a valid email' }),
	password: z.string().min(3, { message: 'Please provide your password' }),
});

interface SignInWithPasswordActionResponse {
	success: boolean;
	message: string | null;
	errors: Record<string, string[]> | null;
}

export async function SignInWithPasswordAction(
	_: unknown,
	data: FormData
): Promise<SignInWithPasswordActionResponse> {
	const result = signInSchema.safeParse(Object.fromEntries(data));
	if (!result.success) {
		return {
			success: false,
			message: null,
			errors: result.error.flatten().fieldErrors,
		};
	}

	const { email, password } = result.data;

	try {
		const response = await SignInWithPassword({
			email: email,
			password: password,
		});
	} catch (error) {
		if (error instanceof HTTPError) {
			const { message } = await error.response.json();
			return { success: false, errors: null, message: message };
		}
	}

	return { success: true, errors: null, message: null };
}
