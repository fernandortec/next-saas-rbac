import { api } from '@/http/api-client';

interface SignInWithGithubRequest {
	code: string;
}

interface SignInWithGithubResponse {
	token: string;
}

export async function SignInWithGithub({
	code,
}: SignInWithGithubRequest): Promise<SignInWithGithubResponse> {
	const result = await api
		.post<SignInWithGithubResponse>('auth/github', {
			json: { code },
		})
		.json();

	return result;
}
