import { ability } from '@/auth/auth';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { ProfileButton } from '@/components/profile-button';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { Separator } from '@/components/ui/separator';
import { Ship, Slash } from 'lucide-react';
import type { ReactElement } from 'react';

export async function Header(): Promise<ReactElement> {
	const permissions = await ability();

	return (
		<div className="mx-auto flex max-w-[1200px] items-center justify-between">
			<div className="flex items-center gap-3">
				<Ship className="w-6 h-6" />
				<Slash className="size-3 -rotate-[24deg] text-border" />

				<OrganizationSwitcher />

				{permissions?.can('get', 'project') && <p>Projetos</p>}
			</div>

			<div className="flex items-center gap-4">
				<ThemeSwitcher />
				<Separator orientation="vertical" className="h-5" />
				<ProfileButton />
			</div>
		</div>
	);
}
