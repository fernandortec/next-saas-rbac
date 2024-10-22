import { api } from '@/http/api-client';

interface CreateOrganizationRequest {
	name: string;
	domain: string | null;
	shouldAttachUsersByDomain: boolean;
}

type CreateOrganizationResponse = Promise<void>;

export async function CreateOrganization({
	domain,
	name,
	shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
	const result = await api
		.post<CreateOrganizationResponse>('organizations', {
			json: { name, domain, shouldAttachUsersByDomain },
		})
		.json();

	return result;
}
