
// src/ai/flows/personalized-eye-health-tips.ts
'use server';
/**
 * @fileOverview Provides personalized eye health tips based on user eye usage data.
 *
 * - personalizedEyeHealthTips - A function that generates eye health recommendations.
 * - EyeHealthInput - The input type for the personalizedEyeHealthTips function.
 * - EyeHealthOutput - The return type for the personalizedEyeHealthTips function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 眼部健康输入数据结构
const EyeHealthInputSchema = z.object({
  averageDuration: z.number().describe('每日平均用眼时长，单位分钟'),
  longestDuration: z.number().describe('单日最长用眼时长，单位分钟'),
  totalReminders: z.number().describe('每周眼部提醒总数'),
  averageDistance: z.number().describe('平均用眼距离，单位厘米'),
  nearestDistance: z.number().describe('最近用眼距离，单位厘米'),
  farthestDistance: z.number().describe('最远用眼距离，单位厘米'),
  dailyData: z.string().describe('每日用眼数据的JSON字符串'),
});
export type EyeHealthInput = z.infer<typeof EyeHealthInputSchema>;

// 眼部健康输出数据结构
const EyeHealthOutputSchema = z.object({
  recommendations: z.string().describe('个性化眼部健康建议'),
});
export type EyeHealthOutput = z.infer<typeof EyeHealthOutputSchema>;

// 主函数：获取个性化眼部健康建议
export async function personalizedEyeHealthTips(input: EyeHealthInput): Promise<EyeHealthOutput> {
  try {
    // 验证输入数据
    const validatedInput = EyeHealthInputSchema.parse(input);
    
    // 构建提示词
    const prompt = `你是一位眼科健康专家，根据用户数据提供个性化的建议。所有回答请使用中文。

根据以下详细的每日和每周用眼数据，为改善眼部健康提供可操作的具体建议。请综合所有信息，特别是极端值（最长、最近、最远），给出2-3条最有针对性的建议。

每周数据摘要:
- 平均每日用眼时长: ${validatedInput.averageDuration} 分钟
- 本周最长单日用眼时长: ${validatedInput.longestDuration} 分钟
- 每周提醒总数: ${validatedInput.totalReminders}
- 平均用眼距离: ${validatedInput.averageDistance} 厘米
- 最近用眼距离: ${validatedInput.nearestDistance} 厘米
- 最远用眼距离: ${validatedInput.farthestDistance} 厘米

每日详细数据:
${validatedInput.dailyData}

专注于推荐具体的习惯或环境改变，以减少眼部疲劳，改善整体眼部健康。建议不超过3句话。

请直接返回建议文本，不要包含其他格式。`;

    // 调用Moonshot AI
    const response = await ai.chat([
      { role: 'system', content: '你是一位眼部健康专家，请用中文提供专业的眼部健康建议。' },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 200,
    });

    const recommendations = response || '暂时无法提供建议，请稍后再试。';

    return { recommendations };
    
  } catch (error) {
    console.error('获取眼部健康建议失败:', error);
    return {
      recommendations: '获取眼部健康建议时遇到问题。建议：每用眼1小时休息5-10分钟，保持与屏幕50-70厘米的距离，多眨眼保持眼部湿润。',
    };
  }
}
