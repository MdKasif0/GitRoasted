
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FlameIcon } from '@/components/icons';
import { GitCommitVertical, BotMessageSquare, Trophy, Share2, Github, BookUser, BarChart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How It Works',
    description: 'Learn how GitRoasted analyzes your GitHub profile, calculates your score, and generates a savage AI roast. From data fetching to the final score breakdown.',
    alternates: {
        canonical: '/how-it-works',
    },
};

const GlassCard = ({ icon, title, description, className }: { icon: React.ElementType, title: string, description: string, className?: string }) => {
  const Icon = icon;
  return (
    <div className={`bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg ${className}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-lg border border-white/20">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};


const StepCard = ({ num, title, description, imageSrc, imageAlt, reverse = false }: { num: string, title: string, description: string, imageSrc: string, imageAlt: string, reverse?: boolean }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
        <div className={`flex flex-col gap-4 ${reverse ? 'md:col-start-2' : ''}`}>
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 text-2xl font-bold rounded-full bg-primary text-primary-foreground">
                    {num}
                </div>
                <h3 className="text-3xl font-bold">{title}</h3>
            </div>
            <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <Image src={imageSrc} alt={imageAlt} width={1200} height={600} className="rounded-lg shadow-2xl" />
        </div>
    </div>
);


const ScoringBar = ({ title, percentage, description, color }: { title: string, percentage: number, description: string, color: string }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">{title}</span>
            <span className="text-primary font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
            <div className="h-3 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <header className="max-w-5xl mx-auto text-center py-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500 mb-4">
          How GitRoasted Works
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          From data crunching to savage roasts, here's a peek under the hood of our AI-powered analysis engine.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <GlassCard icon={Github} title="Data Fetching" description="Connect to GitHub" />
            <GlassCard icon={BarChart} title="Analysis Engine" description="Analyze your profile" />
            <GlassCard icon={BotMessageSquare} title="Roast Generation" description="AI crafts your fate" />
            <GlassCard icon={Trophy} title="Score & Share" description="Get your score & card" />
        </div>
         <div className="text-center mt-8">
          <Button asChild size="lg" className="hover:scale-105 transition-transform bg-gradient-to-r from-purple-600 to-pink-500">
            <Link href="/">Get Your Roast Now</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto space-y-24">
        <StepCard 
            num="1"
            title="Enter GitHub Username"
            description="Simply input any public GitHub username to start the roasting process. We'll begin fetching their public data immediately, so make sure you've spelled it right!"
            imageSrc="https://picsum.photos/seed/step1/1200/600"
            imageAlt="Screenshot of entering a GitHub username"
        />
         <StepCard 
            num="2"
            title="Analyze & Fetch Data"
            description="Our engine dives deep into public commits, pull requests, issue comments, and more, gathering thousands of data points to understand coding habits and repository interactions."
            imageSrc="https://picsum.photos/seed/step2/1200/600"
            imageAlt="Visualization of data analysis"
            reverse
        />
        <StepCard 
            num="3"
            title="Generate Your Roast"
            description="Using advanced AI, we craft a personalized, savage roast based on your unique coding habits and interactions. It's all in good fun!"
            imageSrc="https://picsum.photos/seed/step3/1200/600"
            imageAlt="Example of an AI-generated roast"
        />
        <StepCard 
            num="4"
            title="Calculate Your Score"
            description="Your overall score is a weighted average based on your code quality, review impact, and community engagement. A lower score is better, but a higher score is more roastable!"
            imageSrc="https://picsum.photos/seed/step4/1200/600"
            imageAlt="The final score card"
            reverse
        />
         <StepCard 
            num="5"
            title="Share Your Results"
            description="Flaunt your roast (or hide your shame) by sharing your custom card on social media or climbing the leaderboard. See how you stack up against the legends."
            imageSrc="https://picsum.photos/seed/step5/1200/600"
            imageAlt="Sharing the result card"
        />
      </section>

      <section className="max-w-3xl mx-auto py-24">
        <h2 className="text-4xl font-bold text-center mb-12">Scoring Methodology</h2>
        <Card className="p-8 bg-white/5 border-white/10 space-y-8">
            <ScoringBar title="Star Power & Popularity" percentage={35} description="Measures total stars, follower count, and follower/following ratio." color="#FF7B00" />
            <ScoringBar title="Consistency & Work Ethic" percentage={40} description="Analyzes contribution frequency and total number of commits over time." color="#A855F7" />
            <ScoringBar title="Veteran Status" percentage={25} description="Evaluates account age to recognize long-term members of the community." color="#EC4899" />
        </Card>
      </section>

       <section className="max-w-3xl mx-auto py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
         <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">Is my data safe?</AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground">
              Yes, absolutely. GitRoasted only accesses publicly available data from GitHub profiles and does not require any special permissions or store your credentials.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">How often can I get roasted?</AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground">
              To prevent API rate-limiting and ensure our service remains available to everyone, you can roast a specific user once every 5 minutes. The data is cached to ensure fast subsequent requests.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">What if I don't have a GitHub account?</AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground">
              No problem! You can enter any public GitHub username to see their roast. Try some famous developers like 'torvalds' or 'gaearon'.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold">Can I see other people's roasts?</AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground">
              Yes! Check out the "Hall of Flame" leaderboard on the homepage to see the top-roasted developers.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <footer className="text-center text-muted-foreground mt-24">
        <p>
            <Link href="/" className="hover:text-primary">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
