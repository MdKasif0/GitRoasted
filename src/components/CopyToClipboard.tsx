
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CopyToClipboardProps {
  textToCopy: string;
}

export function CopyToClipboard({ textToCopy }: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-primary/20">
      <p className='flex-1 text-left font-mono text-primary text-lg px-2'>
        {textToCopy}
      </p>
      <Button onClick={handleCopy} size="icon" variant="ghost" className="shrink-0 h-10 w-10 text-primary hover:bg-primary/10 hover:text-primary">
        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        <span className="sr-only">Copy UPI ID</span>
      </Button>
    </div>
  );
}
