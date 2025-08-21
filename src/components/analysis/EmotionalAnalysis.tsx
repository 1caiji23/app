'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { emotionalData } from '@/lib/data';
import { getEmotionalGuidance } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const emotionalValueMap: Record<string, number> = {
  '放松': 5,
  '平静': 4,
  '中性': 3,
  '疲惫': 2,
  '焦虑': 1,
  '紧张': 0,
};

const emotionalChartData = emotionalData.trends.map(d => ({
  time: d.time,
  level: emotionalValueMap[d.indicator],
  indicator: d.indicator,
}));

export function EmotionalAnalysis() {
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setGuidance(null);
    const input = {
      emotionalChangeIndicators: emotionalData.changeIndicators,
      emotionalChangeTimePeriods: emotionalData.timePeriods,
    };
    
    const result = await getEmotionalGuidance(input);
    if (result.success && result.data) {
      setGuidance(result.data.suggestions);
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
    level: { label: "情绪状态", color: "hsl(var(--primary))" },
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">每日情绪趋势</CardTitle>
            <CardDescription>一天中您的情绪状态的可视化。</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart
                  data={emotionalChartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <YAxis 
                    tickFormatter={(value) => Object.keys(emotionalValueMap).find(key => emotionalValueMap[key] === value) || ''}
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="font-medium">{`${payload[0].payload.time}: ${payload[0].payload.indicator}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="level" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 5, fill: "hsl(var(--primary))"}} activeDot={{ r: 8 }}/>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="font-headline">AI 情绪管理指导</CardTitle>
            <CardDescription>接收量身定制的情绪管理建议。</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {loading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {guidance && !loading && (
              <div className="whitespace-pre-wrap rounded-lg border bg-secondary/50 p-4 text-sm">{guidance}</div>
            )}
            {!guidance && !loading && (
              <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed p-4">
                <p className="text-center text-sm text-muted-foreground">
                  点击下方按钮获取您的个性化指导。
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
                '生成情绪指导'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
