
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Coffee, Heart, Gift, ArrowLeft, Copy, Check, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import { DonationSelector } from '@/components/DonationSelector';

const PerkItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-muted-foreground">{text}</span>
  </div>
);

export default function SupportPage() {
  const upiId = '7856943103@fam';
  const developerName = 'GitRoasted Dev';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-500">
        <div className="absolute top-6 left-6 z-20">
            <Button asChild variant="ghost" size="icon" className="bg-white/5 backdrop-blur-sm border-white/10 h-10 w-10">
                <Link href="/" aria-label="Back to Home">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
        </div>

      <Card className="w-full max-w-xl bg-black/20 backdrop-blur-lg border-purple-500/30 shadow-2xl">
        <CardHeader className="text-center items-center pt-8">
          <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/20 mb-4 transition-transform hover:scale-110">
             <Coffee className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500">
            Fueling the Roasts
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
            If you enjoy GitRoasted, consider supporting its development. Your coffee keeps the code compiling and the roasts burning!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
            <DonationSelector upiId={upiId} developerName={developerName} />

            <Tabs defaultValue="scan" className="w-full mt-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
                <TabsTrigger value="copy">Copy UPI ID</TabsTrigger>
              </TabsList>
              <TabsContent value="scan" className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-4 text-center">
                <h3 className='text-xl font-bold mb-4'>Scan to Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Use any UPI app like Google Pay, PhonePe, or Paytm.</p>
                <div className="flex justify-center">
                    <Image 
                        src="/fam-qrcode.png"
                        alt="UPI QR Code" 
                        width={250} 
                        height={250}
                        className='rounded-lg border-4 border-primary'
                    />
                </div>
                <div className="text-left mt-6 space-y-2 text-sm text-muted-foreground">
                    <p>1. Open your favorite UPI app.</p>
                    <p>2. Scan the QR code above.</p>
                    <p>3. Enter any amount and confirm.</p>
                </div>
              </TabsContent>
              <TabsContent value="copy" className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-4 text-center">
                 <h3 className='text-xl font-bold mb-4'>Copy UPI ID</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                    For use in any UPI-enabled app.
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button><Info className="w-4 h-4" /></button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Use any UPI app to send a payment to this ID.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                 <CopyToClipboard textToCopy={upiId} />
              </TabsContent>
            </Tabs>
            <div className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500"/>
                <span>Payments are sent securely and directly to the developer via FamApp UPI.</span>
            </div>

            <div className="my-8">
                 <h3 className="text-lg font-bold text-center mb-4">Perks for Supporters</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PerkItem icon={Heart} text="My eternal gratitude" />
                    <PerkItem icon={Gift} text="A warm, fuzzy feeling" />
                 </div>
            </div>

            <div className="text-center text-muted-foreground">
                <p>Thank you for helping keep GitRoasted free, open-source, and awesome!</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full mt-10">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">Why support GitRoasted?</AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground">
                  Your support helps cover server costs, API fees, and the time dedicated to developing new features and keeping the roasts fresh.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">Is this a one-time or recurring payment?</AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground">
                  This is a one-time contribution. There are no recurring subscriptions or hidden fees.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
