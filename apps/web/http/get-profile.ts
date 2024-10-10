import { api } from '@/http/api-client';

export interface User {
	name: string | null;
	id: string;
	email: string;
	avatarUrl: string | null;
}

type GetProfileResponse = {
	user: User | null;
};

export async function GetProfile(): Promise<GetProfileResponse> {
	const result = await api.get<GetProfileResponse>('me').json();
	return result;
}
