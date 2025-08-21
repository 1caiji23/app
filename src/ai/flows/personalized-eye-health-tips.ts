
// src/ai/flows/personalized-eye-health-tips.ts
'use server';
/**
 * @fileOverview Provides personalized eye health tips based on user eye usage data.
 *
 * - personalizedEyeHealthTips - A function that generates eye health recommendations.
 * - EyeHealthInput - The input type for the personalizedEyeHealthTips function.
 * - EyeHealthOutput - The return type for the personalizedEyeHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EyeHealthInputSchema = z.object({
  averageDuration: z.number().describe('Daily average eye usage duration in minutes.'),
  longestDuration: z.number().describe('Longest single-day eye usage duration in minutes.'),
  totalReminders: z.number().describe('Total number of eye usage reminders triggered weekly.'),
  averageDistance: z.number().describe('Average distance from screen in centimeters.'),
  nearestDistance: z.number().describe('Nearest distance from screen in centimeters.'),
  farthestDistance: z.number().describe('Farthest distance from screen in centimeters.'),
  dailyData: z.string().describe('JSON string of daily eye usage data (duration, reminders, distance).'),
});
export type EyeHealthInput = z.infer<typeof EyeHealthInputSchema>;

const EyeHealthOutputSchema = z.object({
  recommendations: z.string().describe('Personalized recommendations for improving eye health.'),
});
export type EyeHealthOutput = z.infer<typeof EyeHealthOutputSchema>;

export async function personalizedEyeHealthTips(input: EyeHealthInput): Promise<EyeHealthOutput> {
  return personalizedEyeHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eyeHealthPrompt',
  input: {schema: EyeHealthInputSchema},
  output: {schema: EyeHealthOutputSchema},
  prompt: `你是一位眼科健康专家，根据用户数据提供个性化的建议。所有回答请使用中文。

  根据以下详细的每日和每周用眼数据，为改善眼部健康提供可操作的具体建议。请综合所有信息，特别是极端值（最长、最近、最远），给出2-3条最有针对性的建议。

  每周数据摘要:
  - 平均每日用眼时长: {{averageDuration}} 分钟
  - 本周最长单日用眼时长: {{longestDuration}} 分钟
  - 每周提醒总数: {{totalReminders}}
  - 平均用眼距离: {{averageDistance}} 厘米
  - 最近用眼距离: {{nearestDistance}} 厘米
  - 最远用眼距离: {{farthestDistance}} 厘米

  每日详细数据 (JSON格式):
  \`\`\`json
  {{{dailyData}}}
  \`\`\`

  专注于推荐具体的习惯或环境改变，以减少眼部疲劳，改善整体眼部健康。建议不超过3句话。
  `,
});

const personalizedEyeHealthTipsFlow = ai.defineFlow(
  {
    name: 'personalizedEyeHealthTipsFlow',
    inputSchema: EyeHealthInputSchema,
    outputSchema: EyeHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
