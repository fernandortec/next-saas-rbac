'use client';

import { signInWithPasswordAction } from '@/app/auth/sign-in/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GithubLogo, Spinner } from '@phosphor-icons/react';
import { AlertTriangle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';

export function SignInForm(): JSX.Element {
	const {
		execute,
		result: { data },
		isPending,
	} = useAction(signInWithPasswordAction);
	return (
		<form className="space-y-4" action={execute}>
			{data?.success === false && data?.message && (
				<Alert variant="destructive">
					<AlertTriangle className="size-4" />
					<AlertTitle>Sign in failed!</AlertTitle>
					<AlertDescription>
						<p>{data.message}</p>
					</AlertDescription>
				</Alert>
			)}
			<div className="space-y-1">
				<Label htmlFor="email">E-mail</Label>
				<Input name="email" type="email" id="email" />

				{data?.errors?.email && (
					<p className="text-xs font-medium text-red-500 dark:text-red-400">
						{data?.errors.email[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="password">Password</Label>
				<Input name="password" type="password" id="password" />

				{data?.errors?.password && (
					<p className="text-xs font-medium text-red-500 dark:text-red-400">
						{data?.errors.password[0]}
					</p>
				)}

				<Link
					href="/auth/forgot-password"
					className="text-xs font-medium text-foreground hover:underline"
				>
					Forgot your password?
				</Link>
			</div>

			<Button type="submit" className="w-full" disabled={isPending}>
				{isPending ? <Spinner /> : 'Sign in with e-mail'}
			</Button>

			<Separator />

			<Button type="button" variant="outline" className="w-full">
				Sign in Github
				<GithubLogo className="ml-2 size-4" />
			</Button>
		</form>
	);
}
