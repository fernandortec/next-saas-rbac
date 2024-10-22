'use client';

import { OrganizationForm } from '@/app/(app)/create-organization/organization-form';
import type { ReactElement } from 'react';

export default function CreateOrganization(): ReactElement {
	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Create organization</h1>

			<OrganizationForm />
		</div>
	);
}
