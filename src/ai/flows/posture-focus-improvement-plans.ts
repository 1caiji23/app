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
  prompt: `你是一位专注于姿势矫正和专注力提升的健康专家。所有回答请使用中文。

  根据用户的姿势和专注力数据，为姿势矫正和专注力提升提供个性化建议。

  请考虑以下信息：

  姿势提醒次数：{{{postureReminderCount}}}
  姿势状态：{{{postureStatus}}}
  专注时长：{{{focusDuration}}} 分钟
  专注时间段：{{{focusTimePeriods}}}

  为姿势和专注力两方面提供具体且可操作的建议。
  提供有助于纠正姿势的技巧。
  提供有助于用户更好地专注的技巧。
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
