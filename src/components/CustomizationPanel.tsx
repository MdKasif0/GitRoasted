import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';
import { TwitterIcon, Instagram as InstagramIcon } from './icons';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardFormat, CardTheme, BackgroundStyle, LayoutStyle } from './ShareableCardDialog';

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
  onShare: () => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4">
        {children}
    </h3>
);

// Custom Wireframe Icons for Layout
const CompactLayoutIcon = () => (
    <div className="flex flex-col gap-1 items-center w-full max-w-[40px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
        <div className="h-2.5 w-full border border-current rounded-[2px]" />
        <div className="h-6 w-full border border-current rounded-[2px]" />
    </div>
);

const BalancedLayoutIcon = () => (
    <div className="flex flex-col gap-1 items-center w-full max-w-[40px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
        <div className="h-2 w-full border border-current rounded-[2px]" />
        <div className="h-8 w-full border border-current rounded-[2px]" />
        <div className="h-2 w-full border border-current rounded-[2px]" />
    </div>
);

const SpaciousLayoutIcon = () => (
    <div className="flex flex-col gap-1 items-center w-full max-w-[40px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
        <div className="h-3 w-full border border-current rounded-[2px]" />
        <div className="h-10 w-full border border-current rounded-[2px]" />
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
}: CustomizationPanelProps) {

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border-l border-white/5 relative">
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-12">
            
            {/* Header */}
            <div>
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Customize</h3>
            </div>

            {/* FORMAT */}
            <div className="space-y-4">
                <SectionTitle>Format</SectionTitle>
                <RadioGroup
                    value={format}
                    onValueChange={(value: string) => setFormat(value as CardFormat)}
                    className="grid grid-cols-3 gap-3"
                >
                    {[
                        { value: 'instagram', label: 'Instagram Post', icon: <InstagramIcon className="w-5 h-5 mb-3 mx-auto" /> , ratio: '1:1', dim: '1080 × 1080' },
                        { value: 'twitter', label: 'X / Twitter', icon: <TwitterIcon className="w-5 h-5 mb-3 mx-auto fill-current" />, ratio: '16:9', dim: '1200 × 675' },
                        { value: 'portrait', label: 'Portrait', icon: <div className="w-4 h-6 mb-3 mx-auto border-2 rounded-[3px] border-current" />, ratio: '3:4', dim: '1080 × 1440' },
                    ].map(({ value, label, icon, ratio, dim }) => {
                        const isActive = format === value;
                        return (
                            <Label
                                key={value}
                                htmlFor={`format-${value}`}
                                className={cn(
                                    "relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group h-32",
                                    isActive 
                                    ? 'border-orange-500 bg-orange-500/5 text-orange-500' 
                                    : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/10'
                                )}
                            >
                                <RadioGroupItem value={value} id={`format-${value}`} className="sr-only" />
                                
                                {isActive && (
                                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-[#050505] stroke-[3]" />
                                    </div>
                                )}

                                {icon}
                                <span className={cn("text-xs font-semibold text-center mb-1", isActive ? "text-orange-500" : "text-white")}>{label}</span>
                                <span className={cn("text-[10px] mb-0.5 font-medium", isActive ? "text-orange-500/80" : "text-muted-foreground")}>{ratio}</span>
                                <span className={cn("text-[9px] font-mono", isActive ? "text-orange-500/60" : "text-muted-foreground/60")}>{dim}</span>
                            </Label>
                        )
                    })}
                </RadioGroup>
            </div>

            {/* THEME */}
            <div className="space-y-4">
                <SectionTitle>Theme</SectionTitle>
                <RadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as CardTheme)}
                    className="flex bg-white/5 p-1 rounded-lg border border-white/10"
                >
                    {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => {
                        const isActive = theme === value;
                        return (
                             <Label
                                key={value}
                                htmlFor={`theme-${value}`}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-all text-sm font-medium",
                                    isActive
                                    ? "bg-[#0A0A0A] text-orange-500 border border-orange-500/50 shadow-sm"
                                    : "text-muted-foreground hover:text-white"
                                )}
                             >
                                 <RadioGroupItem value={value} id={`theme-${value}`} className="sr-only" />
                                 <Icon className="w-4 h-4" />
                                 {label}
                             </Label>
                        )
                    })}
                </RadioGroup>
            </div>

            {/* LAYOUT */}
            <div className="space-y-4">
                <SectionTitle>Layout</SectionTitle>
                <RadioGroup
                    value={layout}
                    onValueChange={(value) => setLayout(value as LayoutStyle)}
                    className="grid grid-cols-3 gap-3"
                >
                    {[
                        { value: 'compact', label: 'Compact', icon: CompactLayoutIcon },
                        { value: 'balanced', label: 'Balanced', icon: BalancedLayoutIcon },
                        { value: 'spacious', label: 'Spacious', icon: SpaciousLayoutIcon },
                    ].map(({ value, label, icon: Icon }) => {
                        const isActive = layout === value;
                        return (
                            <Label
                                key={value}
                                htmlFor={`layout-${value}`}
                                className={cn(
                                    "relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group h-24",
                                    isActive 
                                    ? 'border-orange-500 bg-orange-500/5 text-orange-500' 
                                    : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/10'
                                )}
                            >
                                <RadioGroupItem value={value} id={`layout-${value}`} className="sr-only" />
                                
                                {isActive && (
                                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-2 h-2 text-[#050505] stroke-[3]" />
                                    </div>
                                )}

                                <Icon />
                                <span className={cn("text-xs font-semibold text-center mt-3", isActive ? "text-orange-500" : "text-white")}>{label}</span>
                            </Label>
                        )
                    })}
                </RadioGroup>
            </div>

            {/* CONTENT */}
            <div className="space-y-4">
                <SectionTitle>Content</SectionTitle>
                <div className="space-y-5 bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center justify-between group">
                        <Label htmlFor="show-roast" className="text-sm text-white/90 cursor-pointer group-hover:text-white flex items-center gap-3">
                             <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-muted-foreground"><span className="text-[10px] font-serif italic">“ ”</span></div>
                             Show roast
                        </Label>
                        <Switch 
                            id="show-roast" 
                            checked={showRoast} 
                            onCheckedChange={setShowRoast} 
                            className="data-[state=checked]:bg-orange-500"
                        />
                    </div>
                    <div className="flex items-center justify-between group">
                        <Label htmlFor="show-stats" className="text-sm text-white/90 cursor-pointer group-hover:text-white flex items-center gap-3">
                             <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-muted-foreground"><span className="text-[10px] font-mono block translate-y-0.5"><div className="w-2 h-2 border-b-2 border-l-2 border-current rounded-bl-[1px]" /></span></div>
                             Show stats
                        </Label>
                        <Switch 
                            id="show-stats" 
                            checked={showStats} 
                            onCheckedChange={setShowStats}
                            className="data-[state=checked]:bg-orange-500"
                        />
                    </div>
                    <div className="flex items-center justify-between group">
                        <Label htmlFor="show-logo" className="text-sm text-white/90 cursor-pointer group-hover:text-white flex items-center gap-3">
                             <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-muted-foreground"><span className="text-[10px] font-bold pb-1">b</span></div>
                             Show GitRoasted logo
                        </Label>
                        <Switch 
                            id="show-logo" 
                            checked={showLogo} 
                            onCheckedChange={setShowLogo}
                            className="data-[state=checked]:bg-orange-500"
                        />
                    </div>
                </div>
            </div>

            {/* EXTRA SETTINGS (Hidden under an accordion or just cleanly appended) */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="watermark" className="text-sm text-muted-foreground cursor-pointer hover:text-white transition-colors">Watermark "GitRoasted.app"</Label>
                    <Switch id="watermark" checked={watermark} onCheckedChange={setWatermark} className="scale-75 data-[state=checked]:bg-orange-500" />
                </div>
                <div>
                    <Input 
                        placeholder="Add a custom message (optional)..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="bg-transparent border-white/10 text-sm focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                </div>
            </div>

        </div>
      </ScrollArea>
    </div>
  );
}
