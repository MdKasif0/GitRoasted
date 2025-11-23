import Image from 'next/image';
import { Github, Users, UserPlus, FileCode, Star, Code, Languages } from 'lucide-react';

import type { RoastResultState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShareableCardDialog } from './ShareableCard';
import { Badge } from './ui/badge';

interface ProfileCardProps {
  result: RoastResultState;
}

export function ProfileCard({ result }: ProfileCardProps) {
  if (result.status !== 'success' || !result.user || result.roast === undefined || result.score === undefined) {
    return null;
  }

  const { user, score, roast, totalStars, topLanguages } = result;

  const stats = [
    { icon: FileCode, label: 'Repositories', value: user.public_repos },
    { icon: Star, label: 'Total Stars', value: totalStars },
    { icon: Users, label: 'Followers', value: user.followers },
  ];

  return (
    <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-500/30 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-5 duration-500">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={100}
          height={100}
          className="rounded-full border-4 border-primary"
        />
        <div className="text-center sm:text-left">
          <CardTitle className="text-3xl font-bold">{user.name || user.login}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">@{user.login}</CardDescription>
          {user.bio && <p className="mt-2 text-foreground/80">{user.bio}</p>}
          <Button asChild variant="ghost" className="mt-2 h-auto p-0 text-accent-foreground/70 hover:text-primary">
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 p-3 rounded-lg">
              <stat.icon className="mx-auto h-6 w-6 text-primary mb-1" />
              <p className="text-2xl font-bold">{(stat.value ?? 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {topLanguages && topLanguages.length > 0 && (
          <div className='mb-6'>
            <h3 className="text-center text-lg font-semibold text-muted-foreground mb-3 flex items-center justify-center gap-2"><Languages /> Top Languages</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {topLanguages.map(([language, count]) => (
                <Badge key={language} variant="secondary" className="text-base">
                  {language} <span className='ml-2 text-muted-foreground'>{count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-6 bg-purple-500/30" />

        <div className="text-center">
          <h3 className="text-xl font-semibold text-muted-foreground">Roast Score</h3>
          <p className="text-7xl font-bold text-primary my-2">{score}</p>
          <Card className="mt-4 bg-background/50 border-purple-500/50 text-left">
            <CardHeader>
              <CardTitle>The Roast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed italic">"{roast}"</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <ShareableCardDialog result={result} />
        </div>
      </CardContent>
    </Card>
  );
}
