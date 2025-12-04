
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
import { Coffee, Lightbulb, User, Menu as MenuIcon, X, Users, LayoutDashboard, ArrowLeft, Contact, ChevronRight, Swords } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';


type MenuState = 'main' | 'dashboard' | 'quick-wins';

export function NavMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuState, setMenuState] = React.useState<MenuState>('main');
  const [availableUsers, setAvailableUsers] = React.useState<string[]>([]);
  const searchParams = useSearchParams();
  const currentUsername = searchParams.get('username');
  const router = useRouter();


  React.useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);
        const userKeys = keys
          .filter(key => key.startsWith('gitroasted_data_'))
          .map(key => key.replace('gitroasted_data_', ''));
        setAvailableUsers(userKeys);
      }
    } else {
      // Reset to main menu when closed
      setTimeout(() => setMenuState('main'), 150);
    }
  }, [isOpen]);

  const hasUsers = availableUsers.length > 0;
  const hasMultipleUsers = availableUsers.length > 1;

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  }

  const renderContent = () => {
    if (menuState === 'dashboard' || menuState === 'quick-wins') {
      const targetPage = menuState;
      return (
        <div className="animate-in slide-in-from-right-5">
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setMenuState('main');
                }}
                className="flex items-center gap-2 p-2 text-sm font-semibold rounded-md transition-colors hover:bg-white/10 cursor-pointer mb-2"
            >
                <ArrowLeft className="w-4 h-4 text-primary" />
                Back
            </DropdownMenuItem>
             <DropdownMenuSeparator className="bg-purple-500/20" />
             <div className="mt-2 space-y-1">
                {availableUsers.map(uName => (
                    <DropdownMenuItem asChild key={uName}>
                    <Link
                        href={`/${targetPage}?username=${uName}`}
                        className="flex items-center gap-3 p-2 text-sm rounded-md transition-colors hover:bg-white/10"
                    >
                        <User className="w-4 h-4" />
                        {uName}
                    </Link>
                    </DropdownMenuItem>
                ))}
             </div>
        </div>
      );
    }

    // Main Menu
    return (
      <DropdownMenuGroup className="animate-in slide-in-from-left-5 space-y-1">
         <DropdownMenuItem
            onSelect={(e) => {
                e.preventDefault();
                if (!hasUsers && !currentUsername) return;
                
                if (hasMultipleUsers) {
                    setMenuState('dashboard');
                } else {
                    const user = availableUsers[0] || currentUsername;
                    handleNavigation(`/dashboard?username=${user}`);
                }
            }}
            disabled={!hasUsers && !currentUsername}
            className="flex items-center justify-between gap-3 p-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className='flex items-center gap-3'>
                <LayoutDashboard className="w-4 h-4 text-primary" />
                Dashboard
            </div>
            {hasMultipleUsers && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </DropdownMenuItem>
          
           <DropdownMenuItem
             onSelect={(e) => {
                e.preventDefault();
                if (!hasUsers && !currentUsername) return;

                if (hasMultipleUsers) {
                    setMenuState('quick-wins');
                } else {
                    const user = availableUsers[0] || currentUsername;
                    handleNavigation(`/quick-wins?username=${user}`);
                }
            }}
            disabled={!hasUsers && !currentUsername}
            className="flex items-center justify-between gap-3 p-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <div className='flex items-center gap-3'>
                <Lightbulb className="w-4 h-4 text-primary" />
                Quick Wins
            </div>
             {hasMultipleUsers && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-purple-500/20 my-1" />
            
            <DropdownMenuItem asChild>
                <Link
                    href="/compare"
                    className="flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10"
                >
                    <Swords className="w-4 h-4 text-primary" />
                    Battle
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link
                    href="/contact"
                    className="flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10"
                >
                    <Contact className="w-4 h-4 text-primary" />
                    Contact Us
                </Link>
            </DropdownMenuItem>

           <DropdownMenuItem asChild>
            <Link
              href="/support"
              className="flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10"
            >
              <Coffee className="w-4 h-4 text-primary" />
              Buy me a Coffee
            </Link>
          </DropdownMenuItem>
      </DropdownMenuGroup>
    );
  };


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full bg-white/5 border-white/10 backdrop-blur-sm text-foreground font-semibold px-4 py-2 text-sm h-auto"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Close
            </>
          ) : (
            <>
              <MenuIcon className="w-4 h-4 mr-2" />
              Menu
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
            "w-64 bg-black/80 backdrop-blur-lg border-purple-500/30 text-white mt-2 p-2 rounded-2xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
      >
        {renderContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
