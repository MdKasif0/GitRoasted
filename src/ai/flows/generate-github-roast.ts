
'use server';

/**
 * @fileOverview Generates a humorous roast of a GitHub user based on their commit history and profile data.
 *
 * - generateGitHubRoast - A function that generates the roast.
 * - GenerateGitHubRoastInput - The input type for the generateGitHubRoast function.
 * - GenerateGitHubRoastOutput - The return type for the generateGitHubRoast function.
 */

import {ai} from '@/ai/genkit';
import type { GitHubUser, ScoreBreakdown } from '@/lib/types';
import {z} from 'genkit';

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
  return generateGitHubRoastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGitHubRoastPrompt',
  input: {schema: GenerateGitHubRoastInputSchema},
  output: {schema: GenerateGitHubRoastOutputSchema},
  prompt: `You are a savage but ultimately friendly roastmaster. Your job is to generate a humorous roast of a GitHub user based on their profile data and contribution stats.

You need to generate TWO things:
1.  'roast': A 2-3 line roast.
2.  'leaderboardRoast': A separate, single, savage one-line zinger for the leaderboard.

Follow this structure for the main 'roast':
1.  **Line 1 (The Burn):** Start with a sharp but funny roast targeting their weakest metric from the score breakdown. Be specific. For example, if 'community' is low, mock their follower count. If 'impact' is low, say something like "404 stars not found." A low score in 'consistency' means they are probably ghosting their keyboard.
2.  **Line 2 (The Compliment):** Immediately pivot to acknowledge something genuinely impressive from their profile (e.g., high commit count, interesting top language, long account age). Find their strongest score category in the breakdown.
3.  **Line 3 (The Uplift):** End with a short, genuine line of encouragement. Something like "Keep building, legend." or "Seriously, great work."

For the 'leaderboardRoast', distill the main burn into a single, punchy, and hilarious line.

Here is the data for the user:
- Username: {{{user.login}}}
- Name: {{{user.name}}}
- Bio: {{{user.bio}}}
- Followers: {{{user.followers}}}
- Following: {{{user.following}}}
- Public Repos: {{{user.public_repos}}}
- Total Stars: {{{totalStars}}}
- Account Created: {{{user.created_at}}}
- Top Languages: {{#each topLanguages}}{{this.[0]}} ({{this.[1]}} repos){{#unless @last}}, {{/unless}}{{/each}}

- Final Roast Score: {{{score}}} (out of 1000, a higher score is easier to roast because it means their profile has more flaws)
- Score Breakdown (out of 1000 total seriousness points, lower points are weaker areas to target):
  - Impact: {{{breakdown.impact}}}
  - Consistency: {{{breakdown.consistency}}}
  - Quality: {{{breakdown.quality}}}
  - Community: {{{breakdown.community}}}
  - Diversity: {{{breakdown.diversity}}}
  - Experience: {{{breakdown.experience}}}
  - Activity: {{{breakdown.activity}}}

- Recent Commit History (for context):
{{{commitHistory}}}

Generate the main 'roast' and the 'leaderboardRoast' now.
`,
});

const generateGitHubRoastFlow = ai.defineFlow(
  {
    name: 'generateGitHubRoastFlow',
    inputSchema: GenerateGitHubRoastInputSchema,
    outputSchema: GenerateGitHubRoastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
