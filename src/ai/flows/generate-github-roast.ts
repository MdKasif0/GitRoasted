'use server';

import type { GitHubUser, ScoreBreakdown } from '@/lib/types';
import { z } from 'genkit';

const GenerateGitHubRoastInputSchema = z.object({
  user: z.custom<GitHubUser>(),
  score: z.number(),
  breakdown: z.custom<ScoreBreakdown>(),
  commitHistory: z.string().describe('A summary of the recent commit messages.'),
  totalStars: z.number(),
  topLanguages: z.array(z.tuple([z.string(), z.number()])),
});
export type GenerateGitHubRoastInput = z.infer<typeof GenerateGitHubRoastInputSchema>;

const GenerateGitHubRoastOutputSchema = z.object({
  roast: z.string().describe('The AI-generated 2-3 line roast of the GitHub user.'),
  leaderboardRoast: z.string().describe('A separate, savage, one-line roast for the leaderboard.'),
});
export type GenerateGitHubRoastOutput = z.infer<typeof GenerateGitHubRoastOutputSchema>;

export async function generateGitHubRoast(input: GenerateGitHubRoastInput): Promise<GenerateGitHubRoastOutput> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is missing.');
  }

  const systemMessage = `You are a savage, brutal, and dark-humored roastmaster. Your job is to generate a painfully funny roast of a GitHub user that hits them right in the soul. Forget being friendly.

You need to output JSON with EXACTLY two fields:
1.  "roast": A 2-3 line soul-crushing roast.
2.  "leaderboardRoast": A separate, single, savage one-line zinger for the leaderboard.

Follow this structure for the main "roast":
1.  **Line 1 (The Deep Cut):** Go straight for the jugular. Target their absolute weakest metric from the score breakdown. Be brutally specific.
2.  **Line 2 (The Twist of the Knife):** Find their strongest score category and turn it into another insult.
3.  **Line 3 (The Final Blow):** Deliver a final, dark, and funny sign-off that leaves them questioning their life choices.

For the "leaderboardRoast", make it even more concise and brutal. A single line that perfectly encapsulates their failure.`;

  const topLanguagesStr = input.topLanguages.map(l => `${l[0]} (${l[1]} repos)`).join(', ');

  const userMessage = `Here is the data for the user:
- Username: ${input.user.login}
- Name: ${input.user.name || 'Unknown'}
- Bio: ${input.user.bio || 'No bio'}
- Followers: ${input.user.followers}
- Following: ${input.user.following}
- Public Repos: ${input.user.public_repos}
- Total Stars: ${input.totalStars}
- Account Created: ${input.user.created_at}
- Top Languages: ${topLanguagesStr}

- Final Roast Score: ${input.score} (out of 1000, a higher score is easier to roast)
- Score Breakdown (out of 1000 total seriousness points, lower points are weaker areas):
  - Impact: ${input.breakdown.impact}
  - Consistency: ${input.breakdown.consistency}
  - Quality: ${input.breakdown.quality}
  - Community: ${input.breakdown.community}
  - Diversity: ${input.breakdown.diversity}
  - Experience: ${input.breakdown.experience}
  - Activity: ${input.breakdown.activity}

- Recent Commit History:
${input.commitHistory}

Generate the JSON now.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'groq/compound',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Groq API error:', errText);
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Groq returned an empty response.');
  }

  try {
    const parsed = JSON.parse(rawContent);
    return {
      roast: parsed.roast || 'Could not generate roast.',
      leaderboardRoast: parsed.leaderboardRoast || 'Could not generate leaderboard roast.',
    };
  } catch (err) {
    console.error('Failed to parse Groq response as JSON:', rawContent);
    throw new Error('Failed to parse AI response.');
  }
}
