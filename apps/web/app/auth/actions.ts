'use server';

import { actionClient } from '@/lib/next-safe-action';
import { env } from '@saas/env';
import { redirect } from 'next/navigation';
import { zfd } from 'zod-form-data';

export const signInWithGithubAction = actionClient
	.schema(zfd.formData({}))
	.action(async (): Promise<void> => {
		const githubSignInURL = new URL(
			'login/oauth/authorize',
			'https://github.com'
		);

		githubSignInURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
		githubSignInURL.searchParams.set(
			'redirect_uri',
			env.GITHUB_OAUTH_REDIRECT_URL
		);
		githubSignInURL.searchParams.set('scope', 'user');
		redirect(githubSignInURL.toString());
	});
