
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Coffee, Lightbulb, User, Menu as MenuIcon, X, Users, LayoutDashboard } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function NavMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [availableUsers, setAvailableUsers] = React.useState<string[]>([]);
  const searchParams = useSearchParams();
  const currentUsername = searchParams.get('username');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);
      const userKeys = keys
        .filter(key => key.startsWith('gitroasted_data_'))
        .map(key => key.replace('gitroasted_data_', ''));
      setAvailableUsers(userKeys);
    }
  }, [isOpen]);

  const hasUsers = availableUsers.length > 0;
  const hasMultipleUsers = availableUsers.length > 1;

  const renderDashboardItem = () => {
    if (hasMultipleUsers) {
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10 cursor-pointer">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Dashboard
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64 bg-black/80 backdrop-blur-lg border-purple-500/30 text-white mt-2 p-4 rounded-2xl">
              <DropdownMenuItem className="p-3 text-lg font-bold uppercase tracking-wider rounded-lg flex items-center gap-2">
                 <Users className="w-5 h-5 text-primary" />
                 <span>Select User</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-purple-500/20" />
              {availableUsers.map(uName => (
                <DropdownMenuItem asChild key={uName}>
                  <Link
                    href={`/dashboard?username=${uName}`}
                    className="flex items-center gap-3 p-3 text-base normal-case tracking-wider rounded-lg transition-colors hover:bg-white/10"
                  >
                    {uName}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      );
    }

    const singleUsername = hasUsers ? availableUsers[0] : currentUsername;

    return (
      <DropdownMenuItem asChild disabled={!singleUsername}>
        <Link
          href={singleUsername ? `/dashboard?username=${singleUsername}` : '#'}
          className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10"
        >
          <LayoutDashboard className="w-5 h-5 text-primary" />
          Dashboard
        </Link>
      </DropdownMenuItem>
    );
  };

  const renderQuickWinsItem = () => {
    if (hasMultipleUsers) {
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10 cursor-pointer">
            <Lightbulb className="w-5 h-5 text-primary" />
            Quick Wins
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64 bg-black/80 backdrop-blur-lg border-purple-500/30 text-white mt-2 p-4 rounded-2xl">
              <DropdownMenuItem className="p-3 text-lg font-bold uppercase tracking-wider rounded-lg flex items-center gap-2">
                 <Users className="w-5 h-5 text-primary" />
                 <span>Select User</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-purple-500/20" />
              {availableUsers.map(uName => (
                <DropdownMenuItem asChild key={uName}>
                  <Link
                    href={`/quick-wins?username=${uName}`}
                    className="flex items-center gap-3 p-3 text-base normal-case tracking-wider rounded-lg transition-colors hover:bg-white/10"
                  >
                    {uName}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      );
    }

    const singleUsername = hasUsers ? availableUsers[0] : currentUsername;

    return (
      <DropdownMenuItem asChild disabled={!singleUsername}>
        <Link
          href={singleUsername ? `/quick-wins?username=${singleUsername}` : '#'}
          className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10"
        >
          <Lightbulb className="w-5 h-5 text-primary" />
          Quick Wins
        </Link>
      </DropdownMenuItem>
    );
  };


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
          {renderDashboardItem()}
          
          {renderQuickWinsItem()}

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
