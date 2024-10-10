import { GetProfile, type User } from '@/http/get-profile';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function isAuthenticated(): Promise<boolean> {
	const cookiesFn = await cookies();
	return !!cookiesFn.get('token')?.value;
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
