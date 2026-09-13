"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, UploadCloud, Image as ImageIcon } from "lucide-react";

import { useLanguage } from "../../../../../hooks/use-language";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Label } from "../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../../../../components/ui/resizable";

type Question = {
  id: string;
  prompt: string;
  answerType: "MULTIPLE_CHOICE" | "TEXT_INPUT" | "FILE_UPLOAD";
  answerConfig: any;
};

type QuestMedia = {
  id: string;
  type: string;
  url: string;
};

type Quest = {
  id: string;
  title: string;
  questions: Question[];
  media: QuestMedia[];
};

// +++ FUNGSI PEMBERSIH URL OTOMATIS +++
// Fungsi ini akan mengubah "https://https//domain.com..." menjadi "https://domain.com..."
const sanitizeImageUrl = (rawUrl: string) => {
  if (!rawUrl) return "";
  // Menghapus SEMUA variasi awalan http://, https://, http//, atau https// di awal string
  const cleanPath = rawUrl.replace(/^(https?:\/\/|https?\/\/)+/gi, "");
  // Menggabungkan kembali dengan HANYA SATU https:// yang valid
  return `https://${cleanPath}`;
};

export function QuestInteractiveClient({ quest }: { quest: Quest }) {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // MENCEGAH CRASH JIKA SOAL KOSONG
  if (!quest.questions || quest.questions.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground p-4 text-center">
        <h2 className="mb-2 text-2xl font-bold">No Questions Yet</h2>
        <p className="mb-6 text-muted-foreground">This quest has been created but no questions have been added.</p>
        <Button onClick={() => router.push("/training")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t.bck || "Go Back"}
        </Button>
      </div>
    );
  }

  const currentQuestion = quest.questions[currentIndex];
  const primaryMedia = quest.media && quest.media.length > 0 ? quest.media[0] : null;

  const handleNext = () => {
    if (currentIndex < quest.questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const renderAnswerSection = (question: Question) => {
    const config = question.answerConfig;

    switch (question.answerType) {
      case "MULTIPLE_CHOICE":
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return (
          <RadioGroup className="flex flex-col gap-4 mt-4">
            {config?.options?.map((opt: string, i: number) => (
              <div key={i} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value={opt} id={`opt-${i}`} />
                <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-medium leading-relaxed">
                  <span className="mr-2 font-bold text-primary">{alphabet[i]}.</span>
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "TEXT_INPUT":
        return (
          <div className="mt-4 space-y-3">
            <Label>{t.questExpectedValue || "Your Answer"}</Label>
            <Textarea
              placeholder={t.questExpectedValueHint || "Type your answer here..."}
              className="min-h-[150px] resize-none"
            />
          </div>
        );

      case "FILE_UPLOAD":
        return (
          <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed p-10 hover:bg-accent/30 transition-colors">
            <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
            <Label htmlFor="file-upload" className="cursor-pointer text-center">
              <span className="font-semibold text-primary hover:underline">
                {t.questUploadFile || "Click to upload"}
              </span>{" "}
              or drag and drop
              <p className="mt-1 text-xs text-muted-foreground">
                {config?.allowedExtensions?.join(", ") || "PDF, STEP, SLDPRT"} 
                {" "} (Max {config?.maxSizeMB || 50}MB)
              </p>
            </Label>
            <Input id="file-upload" type="file" className="hidden" />
          </div>
        );

      default:
        return <div>Unsupported Answer Type</div>;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-6">
        <Button variant="ghost" onClick={() => router.push("/training")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t.bck || "Back"}
        </Button>

        <div className="font-semibold tracking-wide hidden sm:block">
          {quest.title} <span className="text-muted-foreground font-normal ml-2">({currentIndex + 1} / {quest.questions.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex === quest.questions.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        
        <ResizablePanelGroup direction="horizontal" className="hidden md:flex h-full">
          
          <ResizablePanel defaultSize={40} minSize={25} className="bg-muted/10 p-6 flex flex-col">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {t.questionLabel || "Question Section"}
            </h2>
            <div className="flex-1 overflow-y-auto">
              <p className="text-lg leading-relaxed">{currentQuestion.prompt}</p>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              
              <ResizablePanel defaultSize={50} minSize={25} className="bg-muted/5 relative p-6 flex flex-col">
                 <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Task Picture
                 </h2>
                 <div className="flex-1 overflow-hidden rounded-md border bg-background flex items-center justify-center">
                    {primaryMedia ? (
                      // +++ MENGGUNAKAN SANITIZE URL DI SINI +++
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sanitizeImageUrl(primaryMedia.url)} alt="Task Reference" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                        <span className="text-sm">No reference media</span>
                      </div>
                    )}
                 </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30} className="p-6 flex flex-col bg-background">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Answer Section
                </h2>
                
                <div className="flex-1 overflow-y-auto pr-4">
                  {renderAnswerSection(currentQuestion)}
                </div>

                <div className="mt-4 flex justify-end shrink-0 pt-4 border-t">
                  <Button size="lg" className="px-8 shadow-sm">
                    Submit Answer
                  </Button>
                </div>
              </ResizablePanel>
              
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>


        <div className="flex h-full flex-col overflow-y-auto md:hidden p-4 space-y-6">
           
           <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Task Picture</h2>
              <div className="aspect-video w-full rounded-md border bg-muted/10 flex items-center justify-center overflow-hidden">
                {primaryMedia ? (
                   // +++ MENGGUNAKAN SANITIZE URL DI SINI +++
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={sanitizeImageUrl(primaryMedia.url)} alt="Task Reference" className="h-full w-full object-cover" />
                ) : (
                   <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
           </div>

           <div className="space-y-2 rounded-lg bg-muted/10 p-4 border">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t.questionLabel || "Question"}
              </h2>
              <p className="text-base leading-relaxed">{currentQuestion.prompt}</p>
           </div>

           <div className="space-y-4 pb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Answer</h2>
              {renderAnswerSection(currentQuestion)}
              
              <Button className="w-full mt-6" size="lg">
                Submit Answer
              </Button>
           </div>
        </div>
        
      </div>
    </div>
  );
}