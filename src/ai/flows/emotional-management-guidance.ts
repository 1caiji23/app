'use server';

/**
 * @fileOverview Provides tailored emotional management suggestions based on emotional changes.
 *
 * - getEmotionalManagementGuidance - A function that generates emotional management suggestions.
 * - EmotionalManagementInput - The input type for the getEmotionalManagementGuidance function.
 * - EmotionalManagementOutput - The return type for the getEmotionalManagementGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionalManagementInputSchema = z.object({
  emotionalChangeIndicators: z
    .string()
    .describe('Indicators of emotional changes experienced by the user.'),
  emotionalChangeTimePeriods: z
    .string()
    .describe('Time periods during which emotional changes occurred.'),
});
export type EmotionalManagementInput = z.infer<typeof EmotionalManagementInputSchema>;

const EmotionalManagementOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Tailored suggestions for emotional management based on the user data.'),
});
export type EmotionalManagementOutput = z.infer<typeof EmotionalManagementOutputSchema>;

export async function getEmotionalManagementGuidance(
  input: EmotionalManagementInput
): Promise<EmotionalManagementOutput> {
  return emotionalManagementGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionalManagementPrompt',
  input: {schema: EmotionalManagementInputSchema},
  output: {schema: EmotionalManagementOutputSchema},
  prompt: `You are an AI assistant specializing in emotional management.

  Based on the user's emotional change indicators and the time periods during which these changes occurred, provide tailored suggestions for managing their emotions.

  Emotional Change Indicators: {{{emotionalChangeIndicators}}}
  Emotional Change Time Periods: {{{emotionalChangeTimePeriods}}}

  Provide actionable and practical advice.
  The suggestions should be easy to follow.
  Make sure that the suggestions are tailored to the time periods when emotional changes were detected.
  If the time periods are work hours, make suggestions for office; otherwise provide tips for personal life.
  Suggestions:
  `,
});

const emotionalManagementGuidanceFlow = ai.defineFlow(
  {
    name: 'emotionalManagementGuidanceFlow',
    inputSchema: EmotionalManagementInputSchema,
    outputSchema: EmotionalManagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
