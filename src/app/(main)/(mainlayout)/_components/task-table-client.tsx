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
} from "../../../../components/ui/table";
import { useLanguage } from "../../../../hooks/use-language";

type QuestData = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
};

// Styling badge untuk Difficulty agar lebih hidup dan tidak flat
const getDifficultyBadge = (diff: string) => {
  const upperDiff = diff.toUpperCase();
  switch (upperDiff) {
    case "ADVANCED":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "INTERMEDIATE":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "BEGINNER":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export function TaskTableClient({ quests }: { quests: QuestData[] }) {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center p-4 md:p-8">
      {/* Kontainer utama dengan background kartu yang bersih & shadow elegan */}
      <div className="w-full max-w-5xl overflow-hidden rounded-xl border bg-card text-card-foreground shadow-md">
        
        {quests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide text-foreground">
              {t.notReady || "No Tasks Available"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t.notReadyDesc || "There are currently no tasks or quests available in the database. Please check back later."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                  <TableHead className="w-16 text-center font-semibold text-muted-foreground">#</TableHead>
                  <TableHead className="font-semibold text-foreground">
                    {t.questFieldTitle || "TASK NAME"}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    {t.questFieldDifficulty || "DIFFICULTY"}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    {t.questFieldCategory || "CATEGORY"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quests.map((quest, index) => (
                  <TableRow 
                    key={quest.id} 
                    onClick={() => router.push(`/quest/${quest.id}`)}
                    className="cursor-pointer transition-colors hover:bg-muted/60 border-b last:border-0"
                  >
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {quest.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getDifficultyBadge(quest.difficulty)}`}>
                        {quest.difficulty}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm text-muted-foreground">
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