import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Coffee, Heart, Gift, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PerkItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-muted-foreground">{text}</span>
  </div>
);

export default function SupportPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in-0 duration-500">
        <div className="absolute top-6 left-6 z-20">
            <Button asChild variant="ghost" size="icon" className="bg-white/5 backdrop-blur-sm border border-white/10 h-10 w-10">
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
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                <h3 className='text-xl font-bold mb-4'>Scan to Support via UPI</h3>
                <div className="flex justify-center">
                    <Image 
                        src="https://picsum.photos/seed/qr-code/200/200" 
                        alt="UPI QR Code" 
                        width={200} 
                        height={200}
                        className='rounded-lg border-4 border-primary'
                    />
                </div>
                <p className='mt-4 font-mono text-primary bg-background/50 px-4 py-2 rounded-lg border border-primary/20'>
                    gitroasted@fam
                </p>
                <p className="text-sm text-muted-foreground mt-2">Powered by <span className='font-bold'>FamApp</span></p>
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
