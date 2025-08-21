import { Eye, Activity, HeartPulse } from 'lucide-react';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EyeUsageAnalysis } from '@/components/analysis/EyeUsageAnalysis';
import { PostureAnalysis } from '@/components/analysis/PostureAnalysis';
import { EmotionalAnalysis } from '@/components/analysis/EmotionalAnalysis';

export default function AnalysisPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              行为数据分析
            </h1>
            <p className="mt-2 text-muted-foreground">
              探索您的健康指标并获得 AI 驱动的建议。
            </p>
          </div>
          <Tabs defaultValue="eye" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="eye">
                <Eye className="mr-2 h-4 w-4" />
                眼部健康
              </TabsTrigger>
              <TabsTrigger value="posture">
                <Activity className="mr-2 h-4 w-4" />
                姿势与专注力
              </TabsTrigger>
              <TabsTrigger value="emotion">
                <HeartPulse className="mr-2 h-4 w-4" />
                情绪健康
              </TabsTrigger>
            </TabsList>
            <TabsContent value="eye" className="mt-6">
              <EyeUsageAnalysis />
            </TabsContent>
            <TabsContent value="posture" className="mt-6">
              <PostureAnalysis />
            </TabsContent>
            <TabsContent value="emotion" className="mt-6">
              <EmotionalAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
