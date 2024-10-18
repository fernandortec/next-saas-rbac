import { ProfileButton } from '@/components/profile-button';
import { Ship, Slash } from 'lucide-react';
import type { ReactElement } from 'react';
import { OrganizationSwitcher } from "@/components/organization-switcher";

export function Header() : ReactElement {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Ship className="w-6 h-6"/>
        <Slash className='size-3 -rotate-[24deg] text-border'/>

        <OrganizationSwitcher/>
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton/>
      </div>
    </div>
  );
}
