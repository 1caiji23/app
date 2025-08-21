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
  prompt: `你是一位专注于情绪管理的AI助手。所有回答请使用中文。

  根据用户的情绪变化指标和这些变化发生的时间段，为他们的情绪管理提供量身定制的建议。

  情绪变化指标：{{{emotionalChangeIndicators}}}
  情绪变化时间段：{{{emotionalChangeTimePeriods}}}

  提供可操作和实用的建议。
  建议应易于遵循。
  确保建议是根据检测到情绪变化的时间段量身定制的。
  如果时间段是工作时间，请提出办公室建议；否则，请提供个人生活中的提示。
  建议：
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
