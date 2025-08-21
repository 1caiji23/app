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
              欢迎回来！
            </h1>
            <p className="text-muted-foreground">
              这是您的健康状况摘要。
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Button asChild>
              <Link href="/analysis">
                行为数据分析
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">眼部使用情况</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageEyeUsage.toFixed(0)} 分钟
              </div>
              <p className="text-xs text-muted-foreground">
                平均每日屏幕使用时间
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">坐姿</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{totalPostureReminders}
              </div>
              <p className="text-xs text-muted-foreground">
                本周姿势提醒次数
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">专注时间</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {postureData.totalFocusDuration} 分钟
              </div>
              <p className="text-xs text-muted-foreground">
                本周总专注时长
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">详细分析</CardTitle>
              <CardDescription>
                深入研究您的健康数据并获得个性化的 AI 驱动洞察。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                我们的分析报告涵盖您的眼部健康、姿势、注意力和情绪健康。通过了解您的模式，您可以做出明智的决定来改善您的日常生活。
              </p>
              <Button asChild>
                <Link href="/analysis">
                  查看完整报告
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
