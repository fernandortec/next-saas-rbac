'use server';
import { SignInWithPassword } from '@/http/sign-in-with-password';

export async function SignInWithPasswordAction(data: FormData): Promise<void> {
	const { email, password } = Object.fromEntries(data);

	const result = await SignInWithPassword({
		email: String(email),
		password: String(password),
	});

	console.log(result);
}
