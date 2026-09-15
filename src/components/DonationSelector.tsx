'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DonationSelectorProps {
  upiId: string;
  developerName: string;
}

const suggestedAmounts = [
  { amount: 50, label: 'One Coffee' },
  { amount: 100, label: 'Two Coffees' },
  { amount: 200, label: 'Coffee Date' },
  { amount: 500, label: 'Generous Supporter' },
];

export function DonationSelector({ upiId, developerName }: DonationSelectorProps) {
  const [amount, setAmount] = useState<number | string>(100);
  const [isCustom, setIsCustom] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleAmountClick = (newAmount: number) => {
    setAmount(newAmount);
    setIsCustom(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (!isCustom) setIsCustom(true);
  };

  const handlePayClick = () => {
    const finalAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to proceed.',
      });
      return;
    }
    const safeDevName = encodeURIComponent(developerName);
    const upiLink = `upi://pay?pa=${upiId}&pn=${safeDevName}&am=${finalAmount.toFixed(
      2
    )}&cu=INR&tn=Support%20for%20GitRoasted`;

    window.location.href = upiLink;
  };

  return (
    <div className="w-full bg-[#0B0B0B] border border-white/[0.08] rounded-xl p-5 sm:p-7 mb-6">
      <div className="mb-4">
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold block mb-1">
          SUPPORT WITH A COFFEE
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Choose an Amount
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {suggestedAmounts.map(({ amount: suggestedAmount, label }) => {
          const isSelected = amount === suggestedAmount && !isCustom;
          return (
            <button
              key={suggestedAmount}
              type="button"
              onClick={() => handleAmountClick(suggestedAmount)}
              className={cn(
                'p-3.5 rounded-lg text-left transition-all border',
                isSelected
                  ? 'bg-[#FF8A00]/[0.08] border-[#FF8A00]'
                  : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.18]'
              )}
            >
              <p className="text-lg font-bold text-white">
                ₹{suggestedAmount}
              </p>
              <p className="text-xs text-neutral-400 mt-1 font-normal">
                {label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="custom-amount" className="text-xs text-neutral-400 block">
          Custom Amount
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-neutral-400 text-base font-medium select-none pointer-events-none">
            ₹
          </span>
          <Input
            id="custom-amount"
            type="number"
            min="1"
            placeholder="100"
            value={amount}
            onChange={handleCustomAmountChange}
            className="pl-8 h-12 text-base text-white bg-[#080808] border-white/[0.10] focus-visible:ring-1 focus-visible:ring-[#FF8A00] focus-visible:border-[#FF8A00] rounded-lg"
          />
        </div>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-3.5">
        These are suggestions — feel free to enter any amount you&apos;d like!
      </p>

      {isMobile && (
        <div className="mt-4 pt-1">
          <Button
            onClick={handlePayClick}
            className="w-full h-12 text-sm font-semibold bg-[#FF8A00] hover:bg-[#FF9F1C] text-[#050505] rounded-lg transition-colors"
          >
            Open UPI App
          </Button>
        </div>
      )}
    </div>
  );
}
