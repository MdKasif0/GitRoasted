
'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (isOnline) {
      toast({
        title: 'Back Online!',
        description: 'Your connection has been restored.',
      });
    } else {
       toast({
        title: 'You are offline',
        description: 'Some features may be unavailable.',
        variant: 'destructive'
      });
    }
  }, [isOnline, toast])


  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-3 bg-destructive text-destructive-foreground">
      <WifiOff className="mr-2 h-5 w-5" />
      <p className="font-semibold">You are currently offline. Some features may be unavailable.</p>
    </div>
  );
}
