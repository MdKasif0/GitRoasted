
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
import { Coffee, Lightbulb, User, Menu as MenuIcon, X, Users, LayoutDashboard, ArrowLeft } from 'lucide-react';
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
                className="flex items-center gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5 text-primary" />
                Back
            </DropdownMenuItem>
             <DropdownMenuSeparator className="bg-purple-500/20" />
             {availableUsers.map(uName => (
                <DropdownMenuItem asChild key={uName}>
                  <Link
                    href={`/${targetPage}?username=${uName}`}
                    className="flex items-center gap-3 p-3 text-base normal-case tracking-wider rounded-lg transition-colors hover:bg-white/10"
                  >
                    {uName}
                  </Link>
                </DropdownMenuItem>
              ))}
        </div>
      );
    }

    // Main Menu
    return (
      <DropdownMenuGroup className="animate-in slide-in-from-left-5">
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
            className="flex items-center justify-between gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
          >
            <div className='flex items-center gap-3'>
                <LayoutDashboard className="w-5 h-5 text-primary" />
                Dashboard
            </div>
            {hasMultipleUsers && <ChevronRight className="w-5 h-5" />}
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
            className="flex items-center justify-between gap-3 p-3 text-lg font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
          >
             <div className='flex items-center gap-3'>
                <Lightbulb className="w-5 h-5 text-primary" />
                Quick Wins
            </div>
             {hasMultipleUsers && <ChevronRight className="w-5 h-5" />}
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
    );
  };


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full bg-primary/80 text-white hover:bg-primary font-bold text-base px-6 py-3 border-2 border-primary/50 transition-all duration-300"
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
        className={cn(
            "w-64 md:w-80 bg-black/80 backdrop-blur-lg border-purple-500/30 text-white mt-2 p-4 rounded-2xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
      >
        {renderContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Add ChevronRight for the sub-menu indicator
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
