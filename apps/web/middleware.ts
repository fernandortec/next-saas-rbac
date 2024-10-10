import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
	const cookiesClient = await cookies();
	const token = cookiesClient.get('token')?.value;

	const whitelist = ['/auth/sign-in', '/api/auth/sign-out', '/api/auth/callback', '/'];

	const { pathname } = request.nextUrl;

	if (!token && !whitelist.includes(pathname)) {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
};
