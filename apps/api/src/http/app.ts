import { authenticateWithGithub } from '@/http/auth/authenticate-with-github';
import { authenticateWithPassword } from '@/http/auth/authenticate-with-password';
import { createAccount } from '@/http/auth/create-account';
import { getProfile } from '@/http/auth/get-profile';
import { requestpasswordRecover } from '@/http/auth/request-password-recover';
import { resetPassword } from '@/http/auth/reset-password';
import { errorHandler } from '@/http/error-handler';
import { listOrganizationMembers } from '@/http/members/list-organization-members';
import { removeMember } from '@/http/members/remove-member';
import { updateMember } from '@/http/members/update-member';
import { createOrganization } from '@/http/orgs/create-organization';
import { getMembership } from '@/http/orgs/get-membership';
import { getOrganization } from '@/http/orgs/get-organization';
import { getOrganizationsByUser } from '@/http/orgs/get-organizations-by-user';
import { shutdownOrganization } from '@/http/orgs/shutdown-organization';
import { transferOrganization } from '@/http/orgs/transfer-organization';
import { updateOrganization } from '@/http/orgs/update-organization';
import { createProject } from '@/http/projects/create-project';
import { deleteProject } from '@/http/projects/delete-project';
import { getProject } from '@/http/projects/get-project';
import { listProjects } from '@/http/projects/list-projects';
import { updateProject } from '@/http/projects/update-project';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';

export const app = new Elysia();
export type App = typeof app;

app
	.use(cors())
	.use(
		swagger({
			documentation: {
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
			},
		})
	)
	.onError((ctx) => errorHandler(ctx))
	.use(authenticateWithPassword)
	.use(createAccount)
	.use(getProfile)
	.use(requestpasswordRecover)
	.use(resetPassword)
	.use(authenticateWithGithub)
	.use(createOrganization)
	.use(getMembership)
	.use(getOrganization)
	.use(getOrganizationsByUser)
	.use(updateOrganization)
	.use(shutdownOrganization)
	.use(transferOrganization)
	.use(createProject)
	.use(deleteProject)
	.use(getProject)
	.use(listProjects)
	.use(updateProject)
	.use(listOrganizationMembers)
	.use(updateMember)
	.use(removeMember);
