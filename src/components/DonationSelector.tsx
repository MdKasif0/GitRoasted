
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Coffee, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DonationSelectorProps {
  upiId: string;
  developerName: string;
}

const suggestedAmounts = [
  { amount: 50, label: 'One Coffee', iconCount: 1 },
  { amount: 100, label: 'Two Coffees', iconCount: 2 },
  { amount: 200, label: 'Coffee Date', iconCount: 3 },
  { amount: 500, label: 'Generous Supporter', iconCount: 4 },
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
    if(!isCustom) setIsCustom(true);
  }

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
    const upiLink = `upi://pay?pa=${upiId}&pn=${safeDevName}&am=${finalAmount.toFixed(2)}&cu=INR&tn=Support%20for%20GitRoasted`;
    
    window.location.href = upiLink;
  };

  return (
    <div className="w-full space-y-4 rounded-lg bg-white/5 p-6 border border-white/10">
        <h3 className="text-xl font-bold text-center">Choose an Amount</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {suggestedAmounts.map(({ amount: suggestedAmount, label, iconCount }) => (
                <button
                    key={suggestedAmount}
                    onClick={() => handleAmountClick(suggestedAmount)}
                    className={cn(
                        'p-3 rounded-lg text-left transition-all border-2',
                        amount === suggestedAmount && !isCustom ? 'bg-primary/20 border-primary' : 'bg-background/50 border-transparent hover:border-primary/50'
                    )}
                >
                    <div className="flex">
                        {Array.from({ length: iconCount }).map((_, i) => (
                           <Coffee key={i} className={cn('w-4 h-4', amount === suggestedAmount && !isCustom ? 'text-primary' : 'text-muted-foreground' )} />
                        ))}
                    </div>
                    <p className="font-bold text-lg mt-1 flex items-center"><IndianRupee className="w-4 h-4" />{suggestedAmount}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </button>
            ))}
        </div>
        <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
                type="number"
                placeholder="Or enter a custom amount"
                value={amount}
                onChange={handleCustomAmountChange}
                className="pl-10 h-14 text-lg bg-background/50"
            />
        </div>
        <p className="text-center text-xs text-muted-foreground">
            These are suggestions — feel free to enter any amount you'd like!
        </p>
        
        {isMobile && (
            <Button onClick={handlePayClick} size="lg" className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                Open UPI App
            </Button>
        )}
    </div>
  )
}
