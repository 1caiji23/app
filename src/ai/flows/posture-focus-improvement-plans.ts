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
  totalReminderCount: z
    .number()
    .describe('The total number of posture reminders triggered over the week.'),
  mostFrequentStatus: z
    .string()
    .describe('The most frequent posture status observed during the week.'),
  longestCorrectDuration: z
    .number()
    .describe('The longest single-day duration of correct posture in minutes.'),
  dailyData: z
    .string()
    .describe('JSON string of daily posture data (reminders, status, focus duration).'),
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

  请考虑以下每周摘要和每日详细信息：

  每周摘要：
  - 本周姿势提醒总次数：{{{totalReminderCount}}}
  - 本周最频繁的姿势状态：'{{{mostFrequentStatus}}}'
  - 单日最长正确姿势（专注）时长：{{{longestCorrectDuration}}} 分钟

  每日详细数据 (JSON格式):
  \`\`\`json
  {{{dailyData}}}
  \`\`\`

  为姿势和专注力两方面提供具体且可操作的建议。
  - 基于最频繁的姿势状态和提醒次数，提供有助于纠正姿势的技巧。
  - 基于专注时长数据和每日趋势，提供有助于用户更好地专注的技巧。
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
