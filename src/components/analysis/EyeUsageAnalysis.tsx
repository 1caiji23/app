'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { eyeUsageData } from '@/lib/data';
import { getEyeHealthTips } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export function EyeUsageAnalysis() {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setTips(null);
    const input = {
      eyeUsageDuration: eyeUsageData.averageDuration,
      eyeUsageReminderCount: eyeUsageData.totalReminders,
      eyeUsageDistance: eyeUsageData.averageDistance,
    };
    const result = await getEyeHealthTips(input);
    if (result.success && result.data) {
      setTips(result.data.recommendations);
    } else {
      toast({
        variant: 'destructive',
        title: '错误',
        description: result.error,
      });
    }
    setLoading(false);
  };

  const chartConfig = {
    duration: { label: "时长 (分钟)", color: "hsl(var(--primary))" },
    reminders: { label: "提醒次数", color: "hsl(var(--accent))" },
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">每周眼部使用报告</CardTitle>
            <CardDescription>过去一周的屏幕时间和提醒频率。</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={eyeUsageData.daily}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                  <Tooltip cursor={false} content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="duration" name="时长 (分钟)" fill="hsl(var(--primary))" yAxisId="left" radius={4} />
                  <Bar dataKey="reminders" name="提醒次数" fill="hsl(var(--accent))" yAxisId="right" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="font-headline">AI 眼部健康提示</CardTitle>
            <CardDescription>根据您的使用模式获取个性化建议。</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {loading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {tips && !loading && (
              <div className="rounded-lg border bg-secondary/50 p-4 text-sm">{tips}</div>
            )}
            {!tips && !loading && (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-sm text-muted-foreground">
                  点击下方按钮生成您的个性化提示。
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalysis} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                '生成我的眼部健康计划'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
