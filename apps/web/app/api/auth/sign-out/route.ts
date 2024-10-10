import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {

	const redirectUrl = request.nextUrl.clone();
	redirectUrl.pathname = '/auth/sign-in';

	const cookie = await cookies();
  cookie.delete('token')

	return NextResponse.redirect(redirectUrl);
}
