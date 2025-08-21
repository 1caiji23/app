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
              Behavior Data Analysis
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore your well-being metrics and get AI-driven recommendations.
            </p>
          </div>
          <Tabs defaultValue="eye" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
              <TabsTrigger value="eye">
                <Eye className="mr-2 h-4 w-4" />
                Eye Health
              </TabsTrigger>
              <TabsTrigger value="posture">
                <Activity className="mr-2 h-4 w-4" />
                Posture & Focus
              </TabsTrigger>
              <TabsTrigger value="emotion">
                <HeartPulse className="mr-2 h-4 w-4" />
                Emotional Well-being
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
