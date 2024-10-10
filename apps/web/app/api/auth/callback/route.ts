import { SignInWithGithub } from '@/http/sign-in-with-github';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
	const searchParams = new URLSearchParams(request.nextUrl.searchParams);
	const code = searchParams.get('code');
	const cookiesClient = await cookies();

	if (!code) {
		return NextResponse.json({ message: 'No code provided' }, { status: 400 });
	}

	const { token } = await SignInWithGithub({ code });

	cookiesClient.set('token', token, {
		maxAge: 60 * 60 * 24 * 30, // 7 days
		path: '/',
	});

	const redirectUrl = request.nextUrl.clone();
	redirectUrl.pathname = '/';
	redirectUrl.search = '';

	return NextResponse.redirect(redirectUrl);
}
