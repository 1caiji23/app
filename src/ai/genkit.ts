import OpenAI from 'openai';
import {config} from 'dotenv';

config();

// 创建Moonshot AI客户端（使用官方OpenAI兼容格式）
const openai = new OpenAI({
  apiKey: 'sk-2FfZHRPRFKO773sKhPNQoTOclxc2uZaOvb50XNDtHq0A0QKw',
  baseURL: 'https://api.moonshot.cn/v1',
});

// 系统提示词（Moonshot AI的标准配置）
export const SYSTEM_PROMPT = "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。";

// 兼容Genkit API的Moonshot AI客户端
export const ai = {
  /**
   * 调用Moonshot AI进行对话（兼容Genkit chat接口）
   * @param messages 对话消息数组
   * @param options 可选参数
   * @returns AI回复内容
   */
  async chat(
    messages: Array<{role: 'system' | 'user' | 'assistant'; content: string}>,
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    } = {}
  ) {
    const {
      model = 'kimi-k2-0711-preview',
      temperature = 0.6,
      max_tokens = 2000
    } = options;

    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Moonshot AI调用失败:', error);
      throw error;
    }
  },

  /**
   * 定义提示词模板（兼容Genkit definePrompt接口）
   * @param config 提示词配置
   * @returns 提示词函数
   */
  definePrompt(config: { name?: string; prompt: string }) {
    return {
      name: config.name || 'default-prompt',
      prompt: config.prompt,
      
      /**
       * 执行提示词
       * @param input 输入参数
       * @returns AI回复
       */
      async generate(input: any) {
        const messages = [
          { role: 'system' as const, content: config.prompt },
          { role: 'user' as const, content: JSON.stringify(input) }
        ];
        
        return await ai.chat(messages);
      }
    };
  },

  /**
   * 定义工作流（兼容Genkit defineFlow接口）
   * @param config 工作流配置
   * @param handler 处理函数
   * @returns 工作流函数
   */
  defineFlow(config: { name: string }, handler: (input: any) => Promise<any>) {
    return {
      name: config.name,
      
      /**
       * 执行工作流
       * @param input 输入参数
       * @returns 处理结果
       */
      async run(input: any) {
        return await handler(input);
      }
    };
  }
};

// 示例用法
export async function testMoonshotAI() {
  const response = await ai.chat([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: '你好，我叫李雷，1+1等于多少？' }
  ]);
  
  console.log('Moonshot AI回复:', response);
  return response;
}
