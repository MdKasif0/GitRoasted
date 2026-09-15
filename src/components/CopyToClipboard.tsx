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
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#080808] border border-white/[0.10] max-w-md mx-auto">
      <span className="flex-1 text-left font-mono text-sm sm:text-base text-white px-2 truncate select-all">
        {textToCopy}
      </span>
      <Button
        onClick={handleCopy}
        size="sm"
        variant="ghost"
        className="shrink-0 h-9 px-3 text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors rounded-md"
        aria-label="Copy UPI ID"
      >
        {isCopied ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5" />
            Copied
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs">
            <Copy className="w-3.5 h-3.5" />
            Copy
          </span>
        )}
      </Button>
    </div>
  );
}
