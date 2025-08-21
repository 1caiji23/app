import { Eye, Activity, HeartPulse } from 'lucide-react';
import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EyeUsageAnalysis } from '@/components/analysis/EyeUsageAnalysis';
import { PostureAnalysis } from '@/components/analysis/PostureAnalysis';
import { EmotionalAnalysis } from '@/components/analysis/EmotionalAnalysis';
import { DailySummary } from '@/components/analysis/DailySummary';

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
          <Accordion type="single" collapsible defaultValue="eye" className="mb-8 w-full wavy-border">
            <AccordionItem value="eye">
              <AccordionTrigger className="text-base font-medium hover:no-underline">
                <div className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  眼部健康
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <EyeUsageAnalysis />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="posture">
              <AccordionTrigger className="text-base font-medium hover:no-underline">
                <div className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  姿势与专注力
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <PostureAnalysis />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="emotion">
              <AccordionTrigger className="text-base font-medium hover:no-underline">
                 <div className="flex items-center">
                  <HeartPulse className="mr-2 h-4 w-4" />
                  情绪健康
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <EmotionalAnalysis />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <DailySummary />
          
        </div>
      </main>
    </div>
  );
}
