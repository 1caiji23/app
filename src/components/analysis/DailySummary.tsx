'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { eyeUsageData, postureData, emotionalData } from '@/lib/data';
import { getDailySummary } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { DailyHealthSummaryOutput } from '@/ai/flows/daily-health-summary';
import Image from 'next/image';

export function DailySummary() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<DailyHealthSummaryOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setSummary(null);

    const todayEyeData = eyeUsageData.daily[eyeUsageData.daily.length - 1];
    const todayPostureData = postureData.daily[postureData.daily.length - 1];
    const todayEmotionData = emotionalData.trends[emotionalData.trends.length - 1];
    
    const input = {
      eyeUsage: {
        duration: todayEyeData.duration,
        reminders: todayEyeData.reminders,
        distance: todayEyeData.distance,
      },
      posture: {
        reminders: todayPostureData.reminders,
        status: todayPostureData.status,
        focus: todayPostureData.focus,
      },
      emotion: todayEmotionData.indicator,
    };
    
    const result = await getDailySummary(input);
    if (result.success && result.data) {
      setSummary(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: '错误',
        description: result.error,
      });
    }
    setLoading(false);
  };

  return (
    <Card className="wavy-border">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">今日健康总结</CardTitle>
        <CardDescription>猫头鹰博士根据您今日的数据给出的健康速览。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center justify-center md:col-span-1">
            <Image 
              src="https://storage.googleapis.com/stabl-public-asset/insightwell/owl-2.png" 
              alt="猫头鹰博士" 
              width={200} 
              height={200}
              className="h-auto w-40"
              data-ai-hint="cartoon owl"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex h-full min-h-[200px] flex-col justify-between rounded-lg border bg-secondary/30 p-4">
              {loading ? (
                <div className="flex flex-grow items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : summary ? (
                <div className="flex-grow">
                  <h3 className="mb-2 text-lg font-semibold text-primary">{summary.title}</h3>
                  <p className="whitespace-pre-wrap text-sm">{summary.summary}</p>
                </div>
              ) : (
                <div className="flex flex-grow items-center justify-center">
                  <p className="text-center text-muted-foreground">点击按钮，让猫头鹰博士为您总结今天吧！</p>
                </div>
              )}
              <Button onClick={handleAnalysis} disabled={loading} className="mt-4 w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    分析中...
                  </>
                ) : (
                  '生成今日总结'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
