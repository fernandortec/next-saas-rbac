import { SignUpForm } from '@/app/auth/sign-up/sign-up-form';
import type { ReactElement } from 'react';

export default async function SignUpPage(): Promise<ReactElement> {
	return <SignUpForm />;
}
