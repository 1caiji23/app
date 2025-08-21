'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { postureData } from '@/lib/data';
import { getPostureFocusPlan } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltipContent, ChartLegend } from '@/components/ui/chart';
import type { PostureFocusOutput } from '@/ai/flows/posture-focus-improvement-plans';

function StatCard({ label, value, unit }: { label: string; value: string | number; unit: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/50 p-4 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-primary">
        {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

export function PostureAnalysis() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PostureFocusOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setPlan(null);
    const input = {
      totalReminderCount: postureData.totalReminders,
      mostFrequentStatus: postureData.mostFrequentStatus,
      longestCorrectDuration: postureData.longestCorrectDuration,
      dailyData: JSON.stringify(postureData.daily),
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
          <CardTitle className="font-headline">每周姿势数据概览</CardTitle>
          <CardDescription>以下是您每周的详细姿势指标。</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="总提醒次数" value={postureData.totalReminders} unit="次/周" />
          <StatCard label="高频坐姿状态" value={postureData.mostFrequentStatus} unit="" />
          <StatCard label="最长正确专注" value={postureData.longestCorrectDuration} unit="分钟" />
          <StatCard label="总专注时长" value={postureData.totalFocusDuration} unit="分钟" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">每日姿势与专注力报告</CardTitle>
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
                <ChartLegend content={<ChartTooltipContent />} />
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
                <p className="whitespace-pre-wrap rounded-lg border bg-secondary/50 p-4 text-sm">{plan.postureRecommendations}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">专注力建议</h3>
                <p className="whitespace-pre-wrap rounded-lg border bg-secondary/50 p-4 text-sm">{plan.focusRecommendations}</p>
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
