'use server';

import { CreateOrganization } from '@/http/create-organization';
import { type ActionResponse, actionClient } from '@/lib/next-safe-action';
import { HTTPError } from 'ky';
import { flattenValidationErrors } from 'next-safe-action';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const createOrganizationSchema = zfd
	.formData({
		name: z.string(),
		domain: z
			.string()
			.nullable()
			.refine((value) => {
				if (!value) return true;
				const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
				return domainRegex.test(value);
			}, 'Domain is invalid!'),
		shouldAttachUsersByDomain: z
			.union([z.literal('on'), z.literal('off'), z.boolean()])
			.transform((value) => value === true || value === 'on')
			.default(false),
	})
	.refine(
		(data) => {
			if (data.shouldAttachUsersByDomain && !data.domain) return false;
			return false;
		},
		{
			message: 'Domain is required when auto-join is enabled',
			path: ['domain'],
		}
	);

export const createOrganizationAction = actionClient
	.schema(createOrganizationSchema, {
		handleValidationErrorsShape: async (ve) =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(
		async ({
			parsedInput: { name, domain, shouldAttachUsersByDomain },
		}): Promise<ActionResponse> => {
			try {
				await CreateOrganization({
					name,
					domain,
					shouldAttachUsersByDomain,
				});
			} catch (error) {
				if (error instanceof HTTPError) {
					const { message } = await error.response.json();
					return { success: false, errors: null, message: message };
				}
			}

			return {
				success: true,
				errors: null,
				message: 'Successfully saved the organization',
			};
		}
	);
