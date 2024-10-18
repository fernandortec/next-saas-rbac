import { type Membership, getMembership } from '@/http/get-membership';
import { GetProfile, type User } from '@/http/get-profile';
import { type AppAbility, defineAbilityFor } from '@saas/auth';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function isAuthenticated(): Promise<boolean> {
	const cookiesFn = await cookies();
	return !!cookiesFn.get('token')?.value;
}

export async function getCurrentOrganization(): Promise<string | null> {
	const cookiesFn = await cookies();
	const currentOrgSlug = cookiesFn.get('org')?.value;

	return currentOrgSlug ?? null;
}

export async function getCurrentMembership(): Promise<Membership | null> {
	const org = await getCurrentOrganization();
	if (!org) return null;

	const { membership } = await getMembership(org);
	return membership;
}

export async function ability(): Promise<AppAbility | null> {
	const membership = await getCurrentMembership();
	if (!membership) return null;

	const ability = defineAbilityFor({
		id: membership.userId,
		role: membership.role,
	});

	return ability;
}

export async function auth(): Promise<{ user: User }> {
	const cookiesFn = await cookies();
	const token = cookiesFn.get('token')?.value;
	if (!token) return redirect('/auth/sign-in');

	try {
		const { user } = await GetProfile();
		if (!user) return redirect('/auth/sign-in');

		return { user };
	} catch (err) {}

	return redirect('/api/auth/sign-out');
}
