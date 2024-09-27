'use client';

import { SignInWithPasswordAction } from '@/app/auth/sign-in/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GithubLogo } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export default function SignInPage(): JSX.Element {
	return (
		<form className="space-y-4" action={SignInWithPasswordAction}>
			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" type="email" id="email" />
			</div>

			<div className="space-y-1">
				<Label htmlFor="password">Password</Label>
				<Input name="password" type="password" id="password" />

				<Link
					href="/auth/forgot-password"
					className="text-xs font-medium text-foreground hover:underline"
				>
					Forgot your password?
				</Link>
			</div>

			<Button type="submit" className="w-full">
				Sign in with e-mail
			</Button>

			<Separator />

			<Button type="button" variant="outline" className="w-full">
				Sign in Github
				<GithubLogo className="ml-2 size-4" />
			</Button>
		</form>
	);
}
