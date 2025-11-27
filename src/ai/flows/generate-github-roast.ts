
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
  prompt: `You are a savage, brutal, and dark-humored roastmaster. Your job is to generate a painfully funny roast of a GitHub user that hits them right in the soul. Forget being friendly.

You need to generate TWO things:
1.  'roast': A 2-3 line soul-crushing roast.
2.  'leaderboardRoast': A separate, single, savage one-line zinger for the leaderboard.

Follow this structure for the main 'roast':
1.  **Line 1 (The Deep Cut):** Go straight for the jugular. Target their absolute weakest metric from the score breakdown. Be brutally specific. If 'community' is low, say something like "Your GitHub profile has the social life of a hermit crab, and at least the crab has a home." If 'impact' is low, mock them with "Your projects have gathered less starlight than a black hole."
2.  **Line 2 (The Twist of the Knife):** Find their strongest score category and turn it into another insult. If their 'experience' is high, say "All those years on GitHub and *this* is all you have to show for it?" If their 'consistency' is high, try "Ah, consistent...ly average. The beige of developers."
3.  **Line 3 (The Final Blow):** Deliver a final, dark, and funny sign-off that leaves them questioning their life choices. No compliments. No encouragement.

For the 'leaderboardRoast', make it even more concise and brutal. A single line that perfectly encapsulates their failure.

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
