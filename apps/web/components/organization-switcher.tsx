import { getCurrentOrganization } from '@/auth/auth';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GetOrganizations } from '@/http/get-organizations';
import { Avatar } from '@radix-ui/react-avatar';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';

export async function OrganizationSwitcher(): Promise<ReactElement> {
	const currentOrgSlug = await getCurrentOrganization();

	const { organizations } = await GetOrganizations();
	const currentOrganization = organizations.find(
		(org) => org.slug === currentOrgSlug
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
				{currentOrganization ? (
					<>
						<Avatar className="mr-2 size-5">
							{currentOrganization.avatarUrl && (
								<AvatarImage src={currentOrganization.avatarUrl} />
							)}
							<AvatarFallback />
						</Avatar>
						<span className="truncate text-left">
							{currentOrganization.name}
						</span>
					</>
				) : (
					<span className="text-muted-foreground">Select organization</span>
				)}
				<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				alignOffset={-16}
				className="w-[200px]"
				sideOffset={12}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Organizations</DropdownMenuLabel>
					{organizations.map((organization) => (
						<DropdownMenuItem key={organization.id} asChild>
							<Link href={`/org/${organization.slug}`}>
								<Avatar className="mr-2 size-5">
									{organization.avatarUrl && (
										<AvatarImage src={organization.avatarUrl} />
									)}
									<AvatarFallback />
								</Avatar>
								<span className="line-clamp-1">{organization.name}</span>
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/create-organization">
						<PlusCircle className="mr-2 size-4" />
						Create new
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
