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
  eyeUsageDuration: z.number().describe('Daily eye usage duration in minutes.'),
  eyeUsageReminderCount: z.number().describe('Number of eye usage reminders triggered daily.'),
  eyeUsageDistance: z.number().describe('Average distance from screen in centimeters.'),
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

  根据以下数据，为改善眼部健康提供可操作的具体建议：

  眼部使用时长：{{eyeUsageDuration}} 分钟
  眼部使用提醒次数：{{eyeUsageReminderCount}}
  与屏幕的平均距离：{{eyeUsageDistance}} 厘米

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
