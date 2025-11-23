'use server';

/**
 * @fileOverview Generates a humorous roast of a GitHub user based on their commit history.
 *
 * - generateGitHubRoast - A function that generates the roast.
 * - GenerateGitHubRoastInput - The input type for the generateGitHubRoast function.
 * - GenerateGitHubRoastOutput - The return type for the generateGitHubRoast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGitHubRoastInputSchema = z.object({
  username: z.string().describe('The GitHub username to roast.'),
  commitHistory: z.string().describe('The commit history of the user.'),
});
export type GenerateGitHubRoastInput = z.infer<typeof GenerateGitHubRoastInputSchema>;

const GenerateGitHubRoastOutputSchema = z.object({
  roast: z.string().describe('The AI-generated roast of the GitHub user.'),
});
export type GenerateGitHubRoastOutput = z.infer<typeof GenerateGitHubRoastOutputSchema>;

export async function generateGitHubRoast(input: GenerateGitHubRoastInput): Promise<GenerateGitHubRoastOutput> {
  return generateGitHubRoastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGitHubRoastPrompt',
  input: {schema: GenerateGitHubRoastInputSchema},
  output: {schema: GenerateGitHubRoastOutputSchema},
  prompt: `You are a roastmaster. Generate a humorous roast of the GitHub user based on their commit history.

GitHub Username: {{{username}}}
Commit History: {{{commitHistory}}}

Roast:
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
