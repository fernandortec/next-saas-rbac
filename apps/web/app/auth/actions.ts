'use server'

import { actionClient } from "@/lib/next-safe-action";
import { zfd } from "zod-form-data";
import { redirect } from "next/navigation";

export const signInWithGithubAction = actionClient
  .schema(zfd.formData({}))
  .action(async () : Promise<void> => {
    const githubSignInURL = new URL(
      'login/oauth/authorize',
      'https://github.com'
    );

    githubSignInURL.searchParams.set('client_id', '611d6698a8186d1fac38');
    githubSignInURL.searchParams.set(
      'redirect_uri',
      'http://localhost:3000/api/auth/callback'
    );
    githubSignInURL.searchParams.set('scope', 'user');
    redirect(githubSignInURL.toString());
  });