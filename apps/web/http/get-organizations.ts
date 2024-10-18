import { api } from '@/http/api-client';

export interface Organizations {
	id: string;
	name: string;
	slug: string;
	avatarUrl: string | null;
}

type GetOrganizationsResponse = {
	organizations: Organizations[]
};

export async function GetOrganizations(): Promise<GetOrganizationsResponse> {
	const result = await api
		.get<GetOrganizationsResponse>('organizations')
		.json();
	return result;
}
