// src/components/CustomizationPanel.tsx
import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Copy,
  Download,
  Facebook,
  Linkedin,
  Layout,
  Palette,
  Image as ImageIcon,
  Type,
  LayoutGrid,
  LayoutPanelLeft,
  LayoutTemplate
} from 'lucide-react';
import type { CardFormat, CardTheme, BackgroundStyle, LayoutStyle } from './ShareableCardDialog';
import { ScrollArea } from './ui/scroll-area';
import { TwitterIcon, Instagram as InstagramIcon } from './icons';


interface CustomizationPanelProps {
  format: CardFormat;
  setFormat: (format: CardFormat) => void;
  theme: CardTheme;
  setTheme: (theme: CardTheme) => void;
  backgroundStyle: BackgroundStyle;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  layout: LayoutStyle;
  setLayout: (style: LayoutStyle) => void;
  showRoast: boolean;
  setShowRoast: (show: boolean) => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  showLogo: boolean;
  setShowLogo: (show: boolean) => void;
  watermark: boolean;
  setWatermark: (show: boolean) => void;
  customMessage: string;
  setCustomMessage: (message: string) => void;
  previewSize: number;
  setPreviewSize: (size: number) => void;
  onDownload: () => void;
  onCopyToClipboard: () => void;
  shareUrl: string;
  shareText: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({
  title,
  children,
  className,
}) => (
  <div className={`space-y-4 border-b border-border pb-6 ${className}`}>
    <h3 className="font-semibold text-foreground">{title}</h3>
    {children}
  </div>
);

export function CustomizationPanel({
  format,
  setFormat,
  theme,
  setTheme,
  layout,
  setLayout,
  showRoast,
  setShowRoast,
  showStats,
  setShowStats,
  showLogo,
  setShowLogo,
  watermark,
  setWatermark,
  customMessage,
  setCustomMessage,
  previewSize,
  setPreviewSize,
  onDownload,
  onCopyToClipboard,
  shareUrl,
  shareText,
}: CustomizationPanelProps) {

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Check out my GitRoasted score!')}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };


  return (
    <div className="flex flex-col h-full bg-background border-l">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-foreground">Customize Your Card</h2>
      </div>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-6 p-4">
          <Section title="Format Selection">
            <RadioGroup
              value={format}
              onValueChange={(value: string) => setFormat(value as CardFormat)}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { value: 'instagram', label: 'Instagram Post', icon: <InstagramIcon className="w-6 h-6 mb-2" /> , dim: '1080x1080px' },
                { value: 'twitter', label: 'Twitter Card', icon: <TwitterIcon className="w-6 h-6 mb-2" />, dim: '1200x675px' },
                { value: 'portrait', label: '3:4 Portrait', icon: <div className="w-6 h-6 mb-2 font-bold text-xl border-2 rounded-sm flex items-center justify-center">3:4</div>, dim: '1080x1440px' },
              ].map(({ value, label, icon, dim }) => (
                <Label
                  key={value}
                  htmlFor={`format-${value}`}
                  className={`border-2 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    format === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={value} id={`format-${value}`} className="sr-only" />
                  {icon}
                  <span className="text-sm font-semibold text-center">{label}</span>
                  <span className="text-xs text-muted-foreground">{dim}</span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section title="Theme">
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as CardTheme)}
              className="flex items-center gap-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto">Auto</Label>
                </div>
            </RadioGroup>
          </Section>

          <Section title="Layout">
            <RadioGroup
              value={layout}
              onValueChange={(value) => setLayout(value as LayoutStyle)}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { value: 'compact', label: 'Compact', icon: <LayoutPanelLeft className="w-6 h-6 mb-1" />},
                { value: 'balanced', label: 'Balanced', icon: <LayoutGrid className="w-6 h-6 mb-1" />},
                { value: 'spacious', label: 'Spacious', icon: <LayoutTemplate className="w-6 h-6 mb-1" />},
              ].map(({ value, label, icon }) => (
                 <Label
                  key={value}
                  htmlFor={`layout-${value}`}
                  className={`border-2 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    layout === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={value} id={`layout-${value}`} className="sr-only" />
                  {icon}
                  <span className="text-xs font-semibold text-center">{label}</span>
                </Label>
              ))}
            </RadioGroup>
             <div className="flex items-center justify-between pt-4">
                <Label htmlFor="show-roast">Show Roast</Label>
                <Switch id="show-roast" checked={showRoast} onCheckedChange={setShowRoast} />
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="show-stats">Show Stats</Label>
                <Switch id="show-stats" checked={showStats} onCheckedChange={setShowStats} />
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="show-logo">Show Logo</Label>
                <Switch id="show-logo" checked={showLogo} onCheckedChange={setShowLogo} />
            </div>
          </Section>

          <Section title="Branding">
             <div className="flex items-center justify-between">
                <Label htmlFor="watermark">Watermark "GitRoasted.app"</Label>
                <Switch id="watermark" checked={watermark} onCheckedChange={setWatermark} />
            </div>
            <Input 
                placeholder="Add a custom message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
            />
          </Section>

           <Section title="Preview Size" className='border-b-0'>
                <Slider
                    value={[previewSize]}
                    onValueChange={(value) => setPreviewSize(value[0])}
                    max={100}
                    min={10}
                    step={1}
                />
            </Section>

        </CardContent>
      </ScrollArea>
      <div className="p-4 border-t bg-background mt-auto space-y-3">
        <h3 className="font-semibold text-foreground">Export Options</h3>
        <Button onClick={onDownload} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
          <Download className="mr-2 h-4 w-4" /> Download Card
        </Button>
        <Button onClick={onCopyToClipboard} variant="secondary" className="w-full">
          <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
        </Button>
        <div className="text-center text-sm text-muted-foreground pt-2">Share via:</div>
         <div className="flex justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={shareOnTwitter}><TwitterIcon className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={shareOnFacebook}><Facebook className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={shareOnLinkedIn}><Linkedin className="w-5 h-5" /></Button>
        </div>
      </div>
    </div>
  );
}
