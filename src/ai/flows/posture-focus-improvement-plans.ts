'use server';
/**
 * @fileOverview Provides personalized recommendations for posture correction and focus enhancement.
 *
 * - postureFocusImprovementPlans - A function that generates recommendations based on posture and focus data.
 * - PostureFocusInput - The input type for the postureFocusImprovementPlans function.
 * - PostureFocusOutput - The return type for the postureFocusImprovementPlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PostureFocusInputSchema = z.object({
  postureReminderCount: z
    .number()
    .describe('The number of posture reminders triggered.'),
  postureStatus: z.string().describe('The current posture status of the user.'),
  focusDuration: z
    .number()
    .describe('The duration for which the user was focused (in minutes).'),
  focusTimePeriods: z
    .string()
    .describe('The time periods when the user was focused.'),
});
export type PostureFocusInput = z.infer<typeof PostureFocusInputSchema>;

const PostureFocusOutputSchema = z.object({
  postureRecommendations: z
    .string()
    .describe('Personalized recommendations for posture correction.'),
  focusRecommendations: z
    .string()
    .describe('Personalized recommendations for focus enhancement.'),
});
export type PostureFocusOutput = z.infer<typeof PostureFocusOutputSchema>;

export async function postureFocusImprovementPlans(input: PostureFocusInput): Promise<PostureFocusOutput> {
  return postureFocusImprovementPlansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postureFocusImprovementPrompt',
  input: {schema: PostureFocusInputSchema},
  output: {schema: PostureFocusOutputSchema},
  prompt: `You are a well-being expert specializing in posture correction and focus enhancement.

  Based on the user's posture and focus data, provide personalized recommendations for posture correction and focus enhancement.

  Consider the following information:

  Posture Reminder Count: {{{postureReminderCount}}}
  Posture Status: {{{postureStatus}}}
  Focus Duration: {{{focusDuration}}} minutes
  Focus Time Periods: {{{focusTimePeriods}}}

  Provide specific and actionable recommendations for both posture and focus.
  Give posture tips that helps correct posture.
  Give focus tips that helps user focus better.
  `,
});

const postureFocusImprovementPlansFlow = ai.defineFlow(
  {
    name: 'postureFocusImprovementPlansFlow',
    inputSchema: PostureFocusInputSchema,
    outputSchema: PostureFocusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
