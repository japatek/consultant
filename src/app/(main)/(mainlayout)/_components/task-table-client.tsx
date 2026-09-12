"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table"; // Adjust path if needed
import { useLanguage } from "../../../../hooks/use-language";

type QuestData = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
};

const getDifficultyColor = (diff: string) => {
  const upperDiff = diff.toUpperCase();
  switch (upperDiff) {
    case "ADVANCED": return "text-red-500/90";
    case "INTERMEDIATE": return "text-orange-500/90";
    case "BEGINNER": return "text-emerald-500/90";
    default: return "text-foreground";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Standard Drafting":
    case "General Drawing Reading (ISO/ASME)": return "text-emerald-600/90";
    case "Mechanical Drafting":
    case "Sheet Metal":
    case "Welding Annotation": return "text-teal-600/90";
    case "Construction Drafting":
    case "Architectural Drawing": return "text-cyan-600/90";
    case "3D Modeling":
    case "P&ID": return "text-blue-600/90";
    default: return "text-foreground";
  }
};

export function TaskTableClient({ quests }: { quests: QuestData[] }) {
  const { t } = useLanguage();
  const router = useRouter(); // <-- ADDED ROUTER

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-md border border-white/10 bg-black/40 shadow-sm backdrop-blur-md">
        
        {quests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Inbox className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium tracking-wide text-foreground/80">
              {t.notReady || "No Tasks Available"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground/60">
              {t.notReadyDesc || "There are currently no tasks or quests available in the database. Please check back later."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-16 text-center text-muted-foreground/50">#</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest text-muted-foreground/50">
                    {t.questFieldTitle || "TASK NAME"}
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-widest text-muted-foreground/50">
                    {t.questFieldDifficulty || "DIFFICULTY"}
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-widest text-muted-foreground/50">
                    {t.questFieldCategory || "CATEGORY"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quests.map((quest, index) => (
                  <TableRow 
                    key={quest.id} 
                    // <-- ADDED ONCLICK & CURSOR-POINTER
                    onClick={() => router.push(`/quest/${quest.id}`)}
                    className="cursor-pointer border-white/5 transition-colors hover:bg-white/5"
                  >
                    <TableCell className="text-center font-mono text-muted-foreground/50">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="font-medium text-foreground/80">
                      {quest.title}
                    </TableCell>
                    <TableCell className={`text-right text-xs font-medium uppercase tracking-wider ${getDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </TableCell>
                    <TableCell className={`text-right text-xs font-medium tracking-wider ${getCategoryColor(quest.category)}`}>
                      {quest.category}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}