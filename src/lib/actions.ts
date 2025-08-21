'use server';

import { personalizedEyeHealthTips, EyeHealthInput } from '@/ai/flows/personalized-eye-health-tips';
import { postureFocusImprovementPlans, PostureFocusInput } from '@/ai/flows/posture-focus-improvement-plans';
import { getEmotionalManagementGuidance, EmotionalManagementInput } from '@/ai/flows/emotional-management-guidance';

export async function getEyeHealthTips(input: EyeHealthInput) {
  try {
    const result = await personalizedEyeHealthTips(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: '获取眼部健康提示失败。' };
  }
}

export async function getPostureFocusPlan(input: PostureFocusInput) {
  try {
    const result = await postureFocusImprovementPlans(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: '获取姿势和专注力计划失败。' };
  }
}

export async function getEmotionalGuidance(input: EmotionalManagementInput) {
  try {
    const result = await getEmotionalManagementGuidance(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: '获取情绪指导失败。' };
  }
}
