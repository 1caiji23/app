
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

export function EyeUsageAnalysis() {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setTips(null);
    const input = {
      averageDuration: eyeUsageData.averageDuration,
      longestDuration: eyeUsageData.longestDuration,
      totalReminders: eyeUsageData.totalReminders,
      averageDistance: eyeUsageData.averageDistance,
      nearestDistance: eyeUsageData.nearestDistance,
      farthestDistance: eyeUsageData.farthestDistance,
      dailyData: JSON.stringify(eyeUsageData.daily),
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
    <div className="grid grid-cols-1 gap-6">
      <Card className="wavy-border">
        <CardHeader>
          <CardTitle className="font-headline">每周用眼数据概览</CardTitle>
          <CardDescription>以下是您每周的详细用眼指标。</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatCard label="平均用眼时长" value={eyeUsageData.averageDuration.toFixed(0)} unit="分钟/天" />
            <StatCard label="最长用眼时长" value={eyeUsageData.longestDuration} unit="分钟/天" />
            <StatCard label="总提醒次数" value={eyeUsageData.totalReminders} unit="次/周" />
            <StatCard label="平均用眼距离" value={eyeUsageData.averageDistance.toFixed(0)} unit="厘米" />
            <StatCard label="最近用眼距离" value={eyeUsageData.nearestDistance} unit="厘米" />
            <StatCard label="最远用眼距离" value={eyeUsageData.farthestDistance} unit="厘米" />
        </CardContent>
      </Card>

      <Card className="wavy-border">
        <CardHeader>
          <CardTitle className="font-headline">每日用眼趋势</CardTitle>
          <CardDescription>过去一周的屏幕时间和提醒频率。</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={eyeUsageData.daily}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" fontSize={12} />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="duration" name="时长 (分钟)" fill="hsl(var(--primary))" yAxisId="left" radius={4} />
                <Bar dataKey="reminders" name="提醒次数" fill="hsl(var(--accent))" yAxisId="right" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="wavy-border flex h-full flex-col">
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
            <div className="whitespace-pre-wrap rounded-lg border bg-secondary/50 p-4 text-sm">{tips}</div>
          )}
          {!tips && !loading && (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed p-4">
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
  );
}
