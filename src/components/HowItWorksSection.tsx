import { User, Code2, Flame } from 'lucide-react';

export function HowItWorksSection() {
    return (
        <section className="w-full max-w-5xl mx-auto py-16 px-4">
            <div className="flex flex-col items-center mb-12">
                <div className="text-primary font-bold text-xs tracking-widest uppercase mb-4 drop-shadow-[0_0_8px_rgba(255,138,0,0.3)]">
                   HOW IT WORKS
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                    Three steps to get roasted
                </h2>
            </div>

            <div className="relative flex flex-col md:flex-row items-start justify-center gap-6 md:gap-8 mt-10">
                {/* Connector line (desktop) */}
                <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-transparent border-t border-dashed border-primary/20 z-0" />
                
                {/* Connector line (mobile) */}
                <div className="md:hidden absolute top-[10%] bottom-[10%] left-[28px] w-[1px] bg-transparent border-l border-dashed border-primary/20 z-0" />

                <div className="relative z-10 flex-1 flex flex-row md:flex-col items-center gap-6 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(255,138,0,0.05)] w-full group">
                    <div className="absolute -top-4 -left-4 md:-top-4 md:left-4 w-10 h-10 rounded-full bg-[#151515] border border-primary/50 text-primary font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,138,0,0.2)] group-hover:bg-primary group-hover:text-black transition-colors">
                        01
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors md:mb-2">
                        <User className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-left md:text-center">
                        <h3 className="text-lg font-bold text-white mb-2">Enter username</h3>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed">
                            Type any GitHub username you want to roast.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-row md:flex-col items-center gap-6 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(255,138,0,0.05)] w-full group">
                    <div className="absolute -top-4 -left-4 md:-top-4 md:left-4 w-10 h-10 rounded-full bg-[#151515] border border-primary/50 text-primary font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,138,0,0.2)] group-hover:bg-primary group-hover:text-black transition-colors">
                        02
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors md:mb-2">
                        <Code2 className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-left md:text-center">
                        <h3 className="text-lg font-bold text-white mb-2">We analyze GitHub</h3>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed">
                            AI scans their commits, repos, and developer habits.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-row md:flex-col items-center gap-6 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(255,138,0,0.05)] w-full group">
                    <div className="absolute -top-4 -left-4 md:-top-4 md:left-4 w-10 h-10 rounded-full bg-[#151515] border border-primary/50 text-primary font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,138,0,0.2)] group-hover:bg-primary group-hover:text-black transition-colors">
                        03
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors md:mb-2">
                        <Flame className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-left md:text-center">
                        <h3 className="text-lg font-bold text-white mb-2">Get roasted</h3>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed">
                            Receive a savage roast with a seriousness score.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
