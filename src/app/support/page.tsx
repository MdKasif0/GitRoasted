'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, ArrowLeft, Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import { DonationSelector } from '@/components/DonationSelector';
import { useToast } from '@/hooks/use-toast';

export default function SupportPage() {
  const upiId = 'mdkasifuddin@fam';
  const developerName = 'Md Kasif';
  const [copiedQrUpi, setCopiedQrUpi] = useState(false);
  const { toast } = useToast();

  const handleCopyQrUpi = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(upiId);
    setCopiedQrUpi(true);
    toast({
      title: 'UPI ID Copied!',
      description: `${upiId} copied to clipboard.`,
    });
    setTimeout(() => setCopiedQrUpi(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F5F5F5] selection:bg-[#FF8A00]/25 selection:text-[#FF8A00] flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="w-full max-w-[760px] flex flex-col">
        {/* Top Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-300 bg-[#0B0B0B] hover:bg-[#141414] hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <Coffee className="w-8 h-8 text-[#FF8A00] mb-3" />
          <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-[#FF8A00] mb-2 block">
            SUPPORT GITROASTED
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Fueling the Roasts
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
            If you enjoy GitRoasted, consider supporting its development.
            <br className="hidden sm:inline" /> Your coffee keeps the code compiling and the roasts burning!
          </p>
        </header>

        {/* Amount Selector Panel */}
        <DonationSelector upiId={upiId} developerName={developerName} />

        {/* Payment Panel */}
        <div className="w-full bg-[#0B0B0B] border border-white/[0.08] rounded-xl p-5 sm:p-7 mb-8">
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold mb-4 block">
            PAYMENT
          </span>

          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#060606] border border-white/[0.08] rounded-lg h-11 p-0 overflow-hidden">
              <TabsTrigger
                value="scan"
                className="h-full rounded-none text-xs sm:text-sm font-medium text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-transparent relative transition-colors data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#FF8A00]"
              >
                Scan QR Code
              </TabsTrigger>
              <TabsTrigger
                value="copy"
                className="h-full rounded-none text-xs sm:text-sm font-medium text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-transparent relative transition-colors data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#FF8A00]"
              >
                Copy UPI ID
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: SCAN QR CODE */}
            <TabsContent value="scan" className="mt-6 focus-visible:outline-none">
              <div className="text-center mb-6">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Scan to Support
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Use any UPI app like Google Pay, PhonePe, or Paytm.
                </p>
              </div>

              {/* QR Code Artifact */}
              <div className="w-fit mx-auto p-3.5 sm:p-4 rounded-xl bg-[#070707] border border-white/[0.08] shadow-lg mb-6">
                <div className="flex items-center justify-between gap-4 mb-2.5 px-1">
                  <span className="font-mono text-xs text-neutral-300 font-medium">
                    {upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyQrUpi}
                    aria-label="Copy UPI ID"
                    title="Copy UPI ID"
                    className="text-neutral-400 hover:text-white transition-colors p-1"
                  >
                    {copiedQrUpi ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-black">
                  <Image
                    src="/fam-qrcode.png"
                    alt="FamApp UPI QR code for GitRoasted Dev"
                    width={220}
                    height={220}
                    className="w-[200px] sm:w-[220px] h-auto object-contain block"
                    priority
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-6" />

              {/* How It Works Procedure */}
              <div className="text-left space-y-2">
                <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold block mb-3">
                  HOW IT WORKS
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FF8A00] shrink-0">
                    01
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    Open your favorite UPI app.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FF8A00] shrink-0">
                    02
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    Scan the QR code above.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FF8A00] shrink-0">
                    03
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    Enter any amount and confirm.
                  </p>
                </div>
              </div>

              {/* Security Footnote */}
              <p className="text-[11px] sm:text-xs text-neutral-500 text-center mt-6">
                Payments are sent securely and directly to the developer via FamApp UPI.
              </p>
            </TabsContent>

            {/* TAB 2: COPY UPI ID */}
            <TabsContent value="copy" className="mt-6 focus-visible:outline-none">
              <div className="text-center mb-6">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Copy UPI ID
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  For use in any UPI-enabled payment app.
                </p>
              </div>

              <div className="my-6">
                <CopyToClipboard textToCopy={upiId} />
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-6" />

              {/* How It Works Procedure */}
              <div className="text-left space-y-2">
                <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold block mb-3">
                  HOW IT WORKS
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FF8A00] shrink-0">
                    01
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    Open your favorite UPI app.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FF8A00] shrink-0">
                    02
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    Select &ldquo;Pay to UPI ID&rdquo; and paste the copied ID.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#FF8A00] shrink-0">
                    03
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    Enter any amount and confirm payment.
                  </p>
                </div>
              </div>

              {/* Security Footnote */}
              <p className="text-[11px] sm:text-xs text-neutral-500 text-center mt-6">
                Payments are sent securely and directly to the developer via FamApp UPI.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Thank You & Closing Section */}
        <div className="border-t border-white/[0.08] pt-8 sm:pt-10 pb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
            Thank you for considering!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Every contribution, big or small, is deeply appreciated.
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Alternatively, feel free to share GitRoasted with your friends!
          </p>

          <div className="w-8 h-[2px] bg-[#FF8A00] mx-auto my-5" />

          <p className="text-xs text-neutral-500 font-mono tracking-wider">
            GitRoasted
          </p>
        </div>
      </div>
    </div>
  );
}
