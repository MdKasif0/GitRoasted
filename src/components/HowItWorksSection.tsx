
// src/components/HowItWorksSection.tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FlameIcon, BotMessageSquare, Trophy, GithubIcon, BookUser, GitCommitVertical } from '@/components/icons';
import { BarChart, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

const faqData = [
    {
      question: "Is my data safe?",
      answer: "Yes, absolutely. GitRoasted only accesses publicly available data from GitHub profiles and does not require any special permissions or store your credentials."
    },
    {
      question: "How often can I get roasted?",
      answer: "To prevent API rate-limiting and ensure our service remains available to everyone, you can roast a specific user once every 5 minutes. The data is cached to ensure fast subsequent requests."
    },
    {
      question: "What if I don't have a GitHub account?",
      answer: "No problem! You can enter any public GitHub username to see their roast. Try some famous developers like 'torvalds' or 'gaearon'."
    },
    {
      question: "Can I see other people's roasts?",
      answer: "Yes! Check out the \"Hall of Flame\" leaderboard on the homepage to see the top-roasted developers."
    }
];

export function HowItWorksSection() {
    return (
        <section className="w-full max-w-5xl mx-auto py-16">
            <header className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-purple-500 mb-4">
                How GitRoasted Works
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From data crunching to savage roasts, here's a peek under the hood.
                </p>
            </header>

            <div className="space-y-24">
                <StepCard
                    num="1"
                    title="Enter GitHub Username"
                    description="Simply input any public GitHub username. We'll begin fetching their public data immediately."
                    imageSrc="/enter-github-username.png"
                    imageAlt="Screenshot of entering a GitHub username"
                />
                <StepCard
                    num="2"
                    title="Analyze & Fetch Data"
                    description="Our engine dives deep into public commits, pull requests, and more, gathering data to understand coding habits."
                    imageSrc="/fetch-data.png"
                    imageAlt="Visualization of data analysis"
                    reverse
                />
                <StepCard
                    num="3"
                    title="Generate Your Roast"
                    description="Using advanced AI, we craft a personalized, savage roast based on your unique coding habits. It's all in good fun!"
                    imageSrc="/generate-your-roast.png"
                    imageAlt="Example of an AI-generated roast"
                />
                <StepCard
                    num="4"
                    title="Calculate Your Score"
                    description="Your score is a weighted average of your code quality, impact, and community engagement. A lower score is better!"
                    imageSrc="/calculate-your-score.png"
                    imageAlt="The final score card"
                    reverse
                />
                <StepCard
                    num="5"
                    title="Share Your Results"
                    description="Flaunt your roast by sharing your custom card on social media or climbing the leaderboard."
                    imageSrc="/share-your-results.png"
                    imageAlt="Sharing the result card"
                />
            </div>

            <div className="max-w-3xl mx-auto py-24">
                <h3 className="text-4xl font-bold text-center mb-12">Scoring Methodology</h3>
                <Card className="p-8 bg-white/5 border-white/10 space-y-8">
                    <ScoringBar title="Star Power & Popularity" percentage={35} description="Measures total stars, follower count, and follower/following ratio." color="#FF7B00" />
                    <ScoringBar title="Consistency & Work Ethic" percentage={40} description="Analyzes contribution frequency and total number of commits over time." color="#A855F7" />
                    <ScoringBar title="Veteran Status" percentage={25} description="Evaluates account age to recognize long-term members of the community." color="#EC4899" />
                </Card>
            </div>

            <div className="max-w-3xl mx-auto">
                <h3 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                    <AccordionItem value={`item-${index + 1}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-lg text-muted-foreground">
                        {item.answer}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        </section>
    )
}
