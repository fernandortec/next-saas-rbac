import { createOrganizationAction } from '@/app/(app)/create-organization/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import type { ReactElement } from 'react';

export function OrganizationForm(): ReactElement {
	const {
		execute,
		result: { data, validationErrors },
		isPending,
	} = useAction(createOrganizationAction);

	return (
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
					<AlertTitle>Save organization failed failed!</AlertTitle>
					<AlertDescription>
						<p>{data.message}</p>
					</AlertDescription>
				</Alert>
			)}

			{data?.success === true && data?.message && (
				<Alert variant="success">
					<AlertTitle>{data.message}</AlertTitle>
					<AlertDescription>
						<p>{data.message}</p>
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-1">
				<Label htmlFor="name">Organization name</Label>
				<Input name="name" id="name" />

				{validationErrors?.name && (
					<p className="text-xs font-medium text-red-500 dark:text-red-400">
						{validationErrors.name[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="domain">E-mail domain</Label>
				<Input
					name="domain"
					type="text"
					id="domain"
					inputMode="url"
					placeholder="example.com"
				/>

				{validationErrors?.domain && (
					<p className="text-xs font-medium text-red-500 dark:text-red-400">
						{validationErrors.domain[0]}
					</p>
				)}
			</div>

			<div className="space-y-1">
				<div className="flex items-baseline space-x-2">
					<Checkbox
						name="shouldAttachUsersByDomain"
						id="shouldAttachUsersByDomain"
					/>

					<label htmlFor="shouldAttachUsersByDomain" className="space-y-1 ">
						<span className="text-sm font-medium leading-none">
							Auto join new members
						</span>
						<p className="text-sm text-muted-foreground">
							This will automatically invite all members with same e-mail domain
							to this organization.
						</p>
					</label>
				</div>

				{validationErrors?.shouldAttachUsersByDomain && (
					<p className="text-xs font-medium text-red-500 dark:text-red-400">
						{validationErrors.shouldAttachUsersByDomain[0]}
					</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isPending}>
				Save organization
			</Button>
		</form>
	);
}
