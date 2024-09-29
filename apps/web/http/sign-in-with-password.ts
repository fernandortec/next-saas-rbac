import { api } from '@/http/api-client';

interface SignInWithPasswordRequest {
	email: string;
	password: string;
}

interface SignInWithPasswordResponse {
	token: string;
}

export async function SignInWithPassword({
	email,
	password,
}: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse> {
	const result = await api
		.post<SignInWithPasswordResponse>('auth/login', {
			json: { email, password },
		})
		.json();

	return result;
}
