import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Eye,
  Smile,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/Header';
import {
  eyeUsageData,
  postureData,
  emotionalData,
} from '@/lib/data';

export default function Home() {
  const averageEyeUsage =
    eyeUsageData.daily.reduce((acc, cur) => acc + cur.duration, 0) /
    eyeUsageData.daily.length;
  const totalPostureReminders = postureData.daily.reduce(
    (acc, cur) => acc + cur.reminders,
    0
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tighter">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground">
              Here's a summary of your well-being status.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Button asChild>
              <Link href="/analysis">
                Behavior Data Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eye Usage</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageEyeUsage.toFixed(0)} min
              </div>
              <p className="text-xs text-muted-foreground">
                Average daily screen time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posture</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{totalPostureReminders}
              </div>
              <p className="text-xs text-muted-foreground">
                Posture reminders this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {postureData.totalFocusDuration} min
              </div>
              <p className="text-xs text-muted-foreground">
                Total focus duration this week
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Detailed Analysis</CardTitle>
              <CardDescription>
                Dive deeper into your well-being data and get personalized AI-powered insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our analysis reports cover your eye health, posture, focus, and emotional well-being. By understanding your patterns, you can make informed decisions to improve your daily life.
              </p>
              <Button asChild>
                <Link href="/analysis">
                  View Full Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
