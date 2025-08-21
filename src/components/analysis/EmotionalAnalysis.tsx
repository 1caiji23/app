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
  Relaxed: 5,
  Calm: 4,
  Neutral: 3,
  Tired: 2,
  Anxious: 1,
  Stressed: 0,
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
        title: 'Error',
        description: result.error,
      });
    }
    setLoading(false);
  };
  
  const chartConfig = {
    level: { label: "Emotional State", color: "hsl(var(--primary))" },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Daily Emotional Trends</CardTitle>
            <CardDescription>A visualization of your emotional state throughout the day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart
                  data={emotionalChartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis 
                    tickFormatter={(value) => Object.keys(emotionalValueMap).find(key => emotionalValueMap[key] === value) || ''}
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
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
      <div className="lg:col-span-2">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="font-headline">AI-Powered Emotional Guidance</CardTitle>
            <CardDescription>Receive tailored suggestions for managing your emotions.</CardDescription>
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
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-sm text-muted-foreground">
                  Click the button below to get your personalized guidance.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalysis} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Emotional Guidance'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
