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
        title: 'Error',
        description: result.error,
      });
    }
    setLoading(false);
  };
  
  const chartConfig = {
    focus: { label: "Focus (min)", color: "hsl(var(--primary))" },
    reminders: { label: "Reminders", color: "hsl(var(--accent))" },
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Weekly Posture & Focus Report</CardTitle>
          <CardDescription>Your focus duration and posture reminders throughout the week.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={postureData.daily}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="focus" name="Focus (min)" fill="hsl(var(--primary))" yAxisId="left" radius={4} />
                <Bar dataKey="reminders" name="Reminders" fill="hsl(var(--accent))" yAxisId="right" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI-Powered Improvement Plan</CardTitle>
          <CardDescription>Personalized recommendations for posture and focus enhancement.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="flex h-full min-h-[150px] items-center justify-center md:col-span-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : plan ? (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Posture Recommendations</h3>
                <p className="rounded-lg border bg-secondary/50 p-4 text-sm">{plan.postureRecommendations}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Focus Recommendations</h3>
                <p className="rounded-lg border bg-secondary/50 p-4 text-sm">{plan.focusRecommendations}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-dashed md:col-span-2">
              <p className="text-center text-sm text-muted-foreground">
                Click the button below to generate your personalized plan.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalysis} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              'Generate My Improvement Plan'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
