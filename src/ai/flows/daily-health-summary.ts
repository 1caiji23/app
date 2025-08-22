'use server';
/**
 * @fileOverview Provides a daily health summary based on user data.
 *
 * - getDailyHealthSummary - A function that generates a daily health summary.
 * - DailyHealthSummaryInput - The input type for the getDailyHealthSummary function.
 * - DailyHealthSummaryOutput - The return type for the getDailyHealthSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 定义输入数据结构 - 用户今天的健康数据
const DailyHealthSummaryInputSchema = z.object({
  eyeUsage: z.object({
    duration: z.number().describe('今天用眼时长，单位分钟'),
    reminders: z.number().describe('今天眼部提醒次数'),
    distance: z.number().describe('今天平均屏幕距离，单位厘米'),
  }),
  posture: z.object({
    reminders: z.number().describe('今天姿势提醒次数'),
    status: z.string().describe('今天主要姿势状态'),
    focus: z.number().describe('今天专注时长，单位分钟'),
  }),
  emotion: z.string().describe('今天主要情绪状态'),
});

// 导出输入类型，方便其他文件使用
export type DailyHealthSummaryInput = z.infer<
  typeof DailyHealthSummaryInputSchema
>;

// 定义输出数据结构 - AI生成的健康总结
const DailyHealthSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('友好且有见地的今日健康总结'),
  title: z
    .string()
    .describe('每日健康总结的标题'),
});

// 导出输出类型，方便其他文件使用
export type DailyHealthSummaryOutput = z.infer<
  typeof DailyHealthSummaryOutputSchema
>;

// 主函数：获取每日健康总结
export async function getDailyHealthSummary(
  input: DailyHealthSummaryInput
): Promise<DailyHealthSummaryOutput> {
  try {
    // 验证输入数据格式
    const validatedInput = DailyHealthSummaryInputSchema.parse(input);
    
    // 构建发送给Moonshot AI的提示词
    const prompt = `你是一位充满智慧和关怀的健康助手"猫头鹰博士"。所有回答请使用中文。

你的任务是根据用户今天的健康数据，生成一份友好、有见地且鼓励人心的每日健康总结。总结应该像一位智慧的长者给出的建议，温暖而鼓舞人心。

使用以下今日数据：
- 用眼数据:
  - 时长: ${validatedInput.eyeUsage.duration} 分钟
  - 提醒次数: ${validatedInput.eyeUsage.reminders} 次
  - 平均距离: ${validatedInput.eyeUsage.distance} 厘米
- 姿势数据:
  - 提醒次数: ${validatedInput.posture.reminders} 次
  - 主要状态: '${validatedInput.posture.status}'
  - 专注时长: ${validatedInput.posture.focus} 分钟
- 情绪数据:
  - 今日心情: '${validatedInput.emotion}'

请完成以下任务:
1. **生成一个引人注意的标题 (title)**：例如"今日健康速写"或"猫头鹰博士的每日观察"。
2. **撰写总结 (summary)**：
   - 以"你好，我是猫头鹰博士。"开头
   - 综合所有数据，点出今天做得好的地方，并给予鼓励
   - 对需要注意的地方，用温和、积极的方式提出1-2条具体、可行的建议
   - 总结应简洁，不超过150字
   - 保持积极和支持的语气

请以JSON格式返回结果，包含title和summary字段。`;

    // 调用Moonshot AI API
    const response = await ai.chat([
      { role: 'system', content: '你是一位健康分析专家，请用中文提供专业的健康建议。' },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.7,
      max_tokens: 500,
    });

    // 解析AI响应
    const aiResponse = response;
    if (!aiResponse) {
      throw new Error('AI响应为空');
    }

    // 尝试从响应中提取JSON
    let result: DailyHealthSummaryOutput;
    try {
      // 清理可能的markdown格式
      const jsonString = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      result = DailyHealthSummaryOutputSchema.parse(JSON.parse(jsonString));
    } catch {
      // 如果无法解析JSON，创建默认响应
      result = {
        title: '今日健康总结',
        summary: aiResponse,
      };
    }

    return result;
    
  } catch (error) {
    console.error('获取每日健康总结失败:', error);
    
    // 返回友好的错误信息
    return {
      title: '今日健康总结',
      summary: '你好，我是猫头鹰博士。今天获取您的健康总结时遇到了一些技术问题，但请不要担心！继续保持良好的用眼习惯、正确的坐姿和积极的心态，您已经在健康之路上做得很好了！',
    };
  }
}
