
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Coffee, Lightbulb, User, Menu as MenuIcon, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function NavMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full bg-red-500/80 text-white hover:bg-red-500 font-bold text-base px-6 py-3 border-2 border-red-500/50 transition-all duration-300"
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 mr-2" />
              Close
            </>
          ) : (
            <>
              <MenuIcon className="w-5 h-5 mr-2" />
              Menu
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-black/80 backdrop-blur-lg border-purple-500/30 text-white mt-2 p-4 rounded-2xl"
      >
        <DropdownMenuGroup>
           <DropdownMenuItem asChild>
            <Link
              href={username ? `/?username=${username}` : '/'}
              className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10"
            >
              <User className="w-5 h-5 text-primary" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={username ? `/quick-wins?username=${username}` : '/'}
              className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10"
            >
              <Lightbulb className="w-5 h-5 text-primary" />
              Quick Wins
            </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link
              href="/support"
              className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10"
            >
              <Coffee className="w-5 h-5 text-primary" />
              Buy me a Coffee
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
