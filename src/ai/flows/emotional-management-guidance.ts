'use server';

/**
 * @fileOverview Provides tailored emotional management suggestions based on emotional changes.
 *
 * - getEmotionalManagementGuidance - A function that generates emotional management suggestions.
 * - EmotionalManagementInput - The input type for the getEmotionalManagementGuidance function.
 * - EmotionalManagementOutput - The return type for the getEmotionalManagementGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 情绪管理输入数据结构
const EmotionalManagementInputSchema = z.object({
  emotionalChangeIndicators: z
    .string()
    .describe('用户经历的情绪变化指标'),
  emotionalChangeTimePeriods: z
    .string()
    .describe('情绪变化发生的时间段'),
});
export type EmotionalManagementInput = z.infer<typeof EmotionalManagementInputSchema>;

// 情绪管理输出数据结构
const EmotionalManagementOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('基于用户数据的情绪管理建议'),
});
export type EmotionalManagementOutput = z.infer<typeof EmotionalManagementOutputSchema>;

// 主函数：获取情绪管理指导
export async function getEmotionalManagementGuidance(
  input: EmotionalManagementInput
): Promise<EmotionalManagementOutput> {
  try {
    const validatedInput = EmotionalManagementInputSchema.parse(input);
    
    const prompt = `你是一位专注于情绪管理的AI助手。所有回答请使用中文。

根据用户的情绪变化指标和这些变化发生的时间段，为他们的情绪管理提供量身定制的建议。

情绪变化指标：${validatedInput.emotionalChangeIndicators}
情绪变化时间段：${validatedInput.emotionalChangeTimePeriods}

提供可操作和实用的建议：
- 建议应易于遵循
- 确保建议是根据检测到情绪变化的时间段量身定制的
- 如果时间段是工作时间，请提出办公室建议；否则，请提供个人生活中的提示
- 保持积极和支持的语气

请直接返回建议文本，不要包含其他格式。`;

    const response = await ai.chat([
      { role: 'system', content: '你是一位情绪管理专家，请用中文提供专业的情绪管理建议。' },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 200,
    });

    const suggestions = response || '暂时无法提供建议，请稍后再试。';

    return { suggestions };
    
  } catch (error) {
    console.error('获取情绪管理建议失败:', error);
    return {
      suggestions: '获取情绪管理建议时遇到问题。建议：尝试深呼吸放松、短暂休息、与同事朋友交流，或进行简单的伸展运动来缓解压力。',
    };
  }
}
