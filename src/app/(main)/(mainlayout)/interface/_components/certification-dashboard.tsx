"use client";

import { useLanguage } from "../../../../../hooks/use-language";
import Link from "next/link";
import { cn } from "../../../../../lib/utils";
import { 
  Network, 
  Database, 
  PenTool, 
  Hexagon, 
  Code2, 
  Hand,
  Star
} from "lucide-react";
import { type CertificationCardData } from "./certificate-card";

// 1. Tambahkan tipe data Quest agar TypeScript tidak error
export type QuestData = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
};

export type DashboardData = {
  totalPoints: number;
  questsCompleted: number;
  currentStreakDays: number;
  certifications: CertificationCardData[];
  quests: QuestData[]; // <-- Tambahkan ini
};

export function CertificationDashboard({ data }: { data: DashboardData }) {
  const { t } = useLanguage();

  const visualPresets = [
    { icon: Network, color: "text-blue-500" },
    { icon: Database, color: "text-emerald-500" },
    { icon: PenTool, color: "text-pink-500" },
    { icon: Hexagon, color: "text-purple-500" },
    { icon: Code2, color: "text-amber-500" },
  ];

  return (
    <div className="w-full py-8 sm:py-12 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mt-4">
          <div className="relative mb-4">
            <div className="w-32 h-32 flex items-center justify-center select-none">
              <div className="relative text-7xl">
                ⛰️
                <div className="absolute -top-2 -right-4 text-4xl animate-bounce">🚩</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t.dashTitle || "Japatek Quest"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t.dashSubtitle || "Turn practice into progress"}
          </p>
        </div>

        {/* QUESTS GRID (Menampilkan quest dari database) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Quests</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.quests.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-10 border border-dashed rounded-2xl">
                Belum ada quest yang dipublikasikan.
              </div>
            ) : (
              // 2. Lakukan looping pada data.quests
              data.quests.map((quest, index) => {
                const visual = visualPresets[index % visualPresets.length];
                const IconComponent = visual.icon;

                return (
                  <div 
                    key={quest.id}
                    className="group relative flex items-center justify-between p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    {/* Bagian Kiri (Teks & Tombol) */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-[17px] text-foreground line-clamp-1">
                          {quest.title}
                        </h3>
                        {/* Menampilkan Difficulty & Category */}
                        <p className="text-muted-foreground text-sm mt-1">
                          {quest.difficulty} • {quest.category}
                        </p>
                        {/* Menampilkan Points */}
                        <div className="flex items-center text-amber-500 text-xs font-medium mt-2">
                          <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" />
                          {quest.points} Points
                        </div>
                      </div>
                      
                      <Link href={`/quests/${quest.id}`} className="inline-block">
                        <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-amber-600 dark:text-amber-500 text-sm font-medium mt-2">
                          <Hand className="w-4 h-4" />
                          Start Quest
                        </button>
                      </Link>
                    </div>

                    {/* Bagian Kanan (Ikon Besar) */}
                    <div className="pr-2 opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100">
                      <IconComponent className={cn("w-[72px] h-[72px]", visual.color)} strokeWidth={1.5} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}