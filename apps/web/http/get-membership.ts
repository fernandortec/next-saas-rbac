import { api } from '@/http/api-client';
import type { Role } from '@saas/auth';

export type Membership = {
	id: string;
	role: Role;
	userId: string;
	organizationId: string;
};

type GetMembershipResponse = {
	membership: Membership;
};

export async function getMembership(
	slug: string
): Promise<GetMembershipResponse> {
	const result = await api
		.get<GetMembershipResponse>(`organization/${slug}/membership`)
		.json();
	return result;
}
