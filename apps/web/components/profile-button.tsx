import { auth } from '@/auth/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/helpers/get-initials';
import { ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';

export async function ProfileButton() : Promise<ReactElement> {
  const { user } = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>

        <Avatar className='size-8'>
          {user.avatarUrl && (
            <AvatarImage src="https://github.com/fernandortec.png"/>
          )}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <ChevronDown className="size-4 text-muted-foreground"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4"/> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
