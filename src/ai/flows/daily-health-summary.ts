'use server';
/**
 * @fileOverview Provides a daily health summary based on user data.
 *
 * - getDailyHealthSummary - A function that generates a daily health summary.
 * - DailyHealthSummaryInput - The input type for the getDailyHealthSummary function.
 * - DailyHealthSummaryOutput - The return type for the getDailyHealthSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyHealthSummaryInputSchema = z.object({
  eyeUsage: z.object({
    duration: z.number().describe('Today\'s eye usage duration in minutes.'),
    reminders: z.number().describe('Number of eye usage reminders today.'),
    distance: z.number().describe('Average distance from screen today in cm.'),
  }),
  posture: z.object({
    reminders: z.number().describe('Number of posture reminders today.'),
    status: z.string().describe('Most frequent posture status today.'),
    focus: z.number().describe('Total focus duration today in minutes.'),
  }),
  emotion: z
    .string()
    .describe('The most frequent emotional indicator for today.'),
});

export type DailyHealthSummaryInput = z.infer<
  typeof DailyHealthSummaryInputSchema
>;

const DailyHealthSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A friendly and insightful summary of the user\'s health today.'),
  title: z
    .string()
    .describe('A catchy title for the daily health summary.'),
});

export type DailyHealthSummaryOutput = z.infer<
  typeof DailyHealthSummaryOutputSchema
>;

export async function getDailyHealthSummary(
  input: DailyHealthSummaryInput
): Promise<DailyHealthSummaryOutput> {
  return dailyHealthSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyHealthSummaryPrompt',
  input: {schema: DailyHealthSummaryInputSchema},
  output: {schema: DailyHealthSummaryOutputSchema},
  prompt: `你是一位充满智慧和关怀的健康助手“猫头鹰博士”。所有回答请使用中文。

  你的任务是根据用户今天的健康数据，生成一份友好、有见地且鼓励人心的每日健康总结。总结应该像一位智慧的长者给出的建议，温暖而鼓舞人心。

  使用以下今日数据：
  - 用眼数据:
    - 时长: {{eyeUsage.duration}} 分钟
    - 提醒次数: {{eyeUsage.reminders}} 次
    - 平均距离: {{eyeUsage.distance}} 厘米
  - 姿势数据:
    - 提醒次数: {{posture.reminders}} 次
    - 主要状态: '{{posture.status}}'
    - 专注时长: {{posture.focus}} 分钟
  - 情绪数据:
    - 今日心情: '{{emotion}}'

  请完成以下任务:
  1.  **生成一个引人注意的标题 (title)**：例如“今日健康速写”或“猫头鹰博士的每日观察”。
  2.  **撰写总结 (summary)**：
      - 以“你好，我是猫头鹰博士。”开头。
      - 综合所有数据，点出今天做得好的地方，并给予鼓励。
      - 对需要注意的地方，用温和、积极的方式提出1-2条具体、可行的建议。
      - 总结应简洁，不超过150字。
      - 保持积极和支持的语气。
  `,
});

const dailyHealthSummaryFlow = ai.defineFlow(
  {
    name: 'dailyHealthSummaryFlow',
    inputSchema: DailyHealthSummaryInputSchema,
    outputSchema: DailyHealthSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
