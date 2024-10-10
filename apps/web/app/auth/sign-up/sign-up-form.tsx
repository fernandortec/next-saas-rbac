'use client';

import { signInWithGithubAction } from '@/app/auth/actions';
import { signUpAction } from '@/app/auth/sign-up/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GithubLogo, Spinner } from '@phosphor-icons/react';
import { AlertTriangle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';

export function SignUpForm(): JSX.Element {
	const {
		execute,
		result: { data, validationErrors },
		isPending,
	} = useAction(signUpAction);

	const { execute: signInWithGithubFn } = useAction(signInWithGithubAction);

	return (
		<div>
			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					execute(new FormData(e.currentTarget));
				}}
			>
				{data?.success === false && data?.message && (
					<Alert variant="destructive">
						<AlertTriangle className="size-4" />
						<AlertTitle>Sign up failed!</AlertTitle>
						<AlertDescription>
							<p>{data.message}</p>
						</AlertDescription>
					</Alert>
				)}

				<div className="space-y-1">
					<Label htmlFor="email">Name</Label>
					<Input name="name" id="name" />

					{validationErrors?.name && (
						<p className="text-xs font-medium text-red-500 dark:text-red-400">
							{validationErrors.name[0]}
						</p>
					)}
				</div>

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
				</div>

				<div className="space-y-1">
					<Label htmlFor="password">Password confirmation</Label>
					<Input
						name="passwordConfirmation"
						type="password"
						id="passwordConfirmation"
					/>

					{validationErrors?.passwordConfirmation && (
						<p className="text-xs font-medium text-red-500 dark:text-red-400">
							{validationErrors.passwordConfirmation[0]}
						</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? <Spinner /> : 'Sign up with email'}
				</Button>
			</form>

			<Button type="button" variant="outline" className="w-full mt-2">
				<Link href="/auth/sign-in">Already registered? Sign in</Link>
			</Button>

			<Separator />

			<form action={signInWithGithubFn} className="mt-4">
				<Button type="submit" variant="outline" className="w-full">
					Sign up with Github
					<GithubLogo className="ml-2 size-4" />
				</Button>
			</form>
		</div>
	);
}
