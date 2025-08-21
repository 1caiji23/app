'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { postureData } from '@/lib/data';
import { getPostureFocusPlan } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { PostureFocusOutput } from '@/ai/flows/posture-focus-improvement-plans';

export function PostureAnalysis() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PostureFocusOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setPlan(null);
    const postureStatusCounts = postureData.daily.reduce((acc, cur) => {
      acc[cur.status] = (acc[cur.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantPosture = Object.keys(postureStatusCounts).reduce((a, b) =>
      postureStatusCounts[a] > postureStatusCounts[b] ? a : b
    );

    const input = {
      postureReminderCount: postureData.daily.reduce((sum, d) => sum + d.reminders, 0),
      postureStatus: dominantPosture,
      focusDuration: postureData.totalFocusDuration,
      focusTimePeriods: postureData.focusTimePeriods,
    };
    
    const result = await getPostureFocusPlan(input);
    if (result.success && result.data) {
      setPlan(result.data);
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
    focus: { label: "专注 (分钟)", color: "hsl(var(--primary))" },
    reminders: { label: "提醒", color: "hsl(var(--accent))" },
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">每周姿势与专注力报告</CardTitle>
          <CardDescription>您一周内的专注时长和姿势提醒。</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={postureData.daily}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" fontSize={12} />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="focus" name="专注 (分钟)" fill="hsl(var(--primary))" yAxisId="left" radius={4} />
                <Bar dataKey="reminders" name="提醒" fill="hsl(var(--accent))" yAxisId="right" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI 驱动的改进计划</CardTitle>
          <CardDescription>针对姿势和专注力提升的个性化建议。</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading ? (
            <div className="flex h-full min-h-[150px] items-center justify-center md:col-span-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : plan ? (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">姿势建议</h3>
                <p className="rounded-lg border bg-secondary/50 p-4 text-sm">{plan.postureRecommendations}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">专注力建议</h3>
                <p className="rounded-lg border bg-secondary/50 p-4 text-sm">{plan.focusRecommendations}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed p-4 md:col-span-2">
              <p className="text-center text-sm text-muted-foreground">
                点击下方按钮生成您的个性化计划。
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalysis} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在生成计划...
              </>
            ) : (
              '生成我的改进计划'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
