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
  prompt: `You are an expert in eye health and provide personalized recommendations based on user data.

  Based on the following data, provide actionable and specific recommendations for improving eye health:

  Eye Usage Duration: {{eyeUsageDuration}} minutes
  Eye Usage Reminder Count: {{eyeUsageReminderCount}}
  Eye Usage Distance: {{eyeUsageDistance}} cm

  Focus on recommending specific changes to habits or environment to reduce eye strain and improve overall eye health. The recommendations should be no more than 3 sentences.
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
