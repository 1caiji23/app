'use server';
/**
 * @fileOverview Provides personalized recommendations for posture correction and focus enhancement.
 *
 * - postureFocusImprovementPlans - A function that generates recommendations based on posture and focus data.
 * - PostureFocusInput - The input type for the postureFocusImprovementPlans function.
 * - PostureFocusOutput - The return type for the postureFocusImprovementPlans function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PostureFocusInputSchema = z.object({
  averageReminders: z.number().describe('平均每日姿势提醒次数'),
  longestStreak: z.number().describe('最长连续专注时间，单位分钟'),
  totalFocusTime: z.number().describe('每周总专注时间，单位分钟'),
  postureStatus: z.string().describe('主要姿势状态'),
  focusScore: z.number().describe('每周平均专注评分0-100'),
});
export type PostureFocusInput = z.infer<typeof PostureFocusInputSchema>;

const PostureFocusOutputSchema = z.object({
  plan: z.string().describe('个性化姿势和专注力改善计划'),
});
export type PostureFocusOutput = z.infer<typeof PostureFocusOutputSchema>;

export async function postureFocusImprovementPlans(input: PostureFocusInput): Promise<PostureFocusOutput> {
  try {
    const validatedInput = PostureFocusInputSchema.parse(input);
    
    const prompt = `你是一位姿势与专注力改善专家。所有回答请使用中文。

根据以下用户的姿势和专注力数据，制定一个个性化的改善计划：

数据摘要:
- 平均每日姿势提醒: ${validatedInput.averageReminders} 次
- 最长连续专注时间: ${validatedInput.longestStreak} 分钟
- 每周总专注时间: ${validatedInput.totalFocusTime} 分钟
- 主要姿势状态: ${validatedInput.postureStatus}
- 每周平均专注评分: ${validatedInput.focusScore}/100

提供一个简洁、可执行的改善计划，包括具体的练习方法和时间安排建议。计划不超过4句话。

请直接返回计划文本，不要包含其他格式。`;

    const response = await ai.chat([
      { role: 'system', content: '你是一位姿势和专注力改善专家，请用中文提供专业的改善建议。' },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 300,
    });

    const plan = response || '暂时无法提供计划，请稍后再试。';

    return { plan };
    
  } catch (error) {
    console.error('获取姿势改善计划失败:', error);
    return {
      plan: '获取姿势改善计划时遇到问题。建议：每小时起身活动2-3分钟，保持正确坐姿，使用番茄工作法提高专注力。',
    };
  }
}
