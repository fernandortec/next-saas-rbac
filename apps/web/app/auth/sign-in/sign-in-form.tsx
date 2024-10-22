'use client';

import { signInWithGithubAction } from '@/app/auth/actions';
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
		result: { data, validationErrors },
		isPending,
	} = useAction(signInWithPasswordAction);

	const { execute: signInWithGithubFn } = useAction(signInWithGithubAction);

	return (
		<div>
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

					{validationErrors?.email && (
						<p className="text-xs font-medium text-red-500 dark:text-red-400">
							{validationErrors.email[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input name="password" type="password" id="password" />

					{validationErrors?.password && (
						<p className="text-xs font-medium text-red-500 dark:text-red-400">
							{validationErrors.password[0]}
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
			</form>

			<Button variant="outline" className="w-full mt-2">
				<Link href="/auth/sign-up">Create new account</Link>
			</Button>

			<Separator />

			<form action={signInWithGithubFn} className="mt-4">
				<Button type="submit" variant="outline" className="w-full">
					Sign in with Github
					<GithubLogo className="ml-2 size-4" />
				</Button>
			</form>
		</div>
	);
}
