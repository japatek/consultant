"use client";

import { useLanguage } from "../../../../hooks/use-language";
import Link from "next/link";
import { cn } from "../../../../lib/utils";
import { 
  Network, 
  Database, 
  PenTool, 
  Hexagon, 
  Code2, 
  Hand 
} from "lucide-react";

export type DashboardData = {
  totalPoints: number;
  questsCompleted: number;
  currentStreakDays: number;
  certifications: any[]; // Sesuaikan dengan tipe data riil Anda
};

export function CertificationDashboard({ data }: { data: DashboardData }) {
  const { t } = useLanguage();

  // Opsi warna dan ikon untuk memberi variasi pada setiap kartu
  const visualPresets = [
    { icon: Network, color: "text-[#3b82f6]" },   // Biru
    { icon: Database, color: "text-[#10b981]" },  // Hijau
    { icon: PenTool, color: "text-[#f472b6]" },   // Pink
    { icon: Hexagon, color: "text-[#a855f7]" },   // Ungu
    { icon: Code2, color: "text-[#f59e0b]" },     // Kuning
  ];

  return (
    <div className="w-full bg-[#111111] text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mt-8">
          <div className="relative mb-4">
            {/* Ilustrasi Gunung/Bendera sederhana menggunakan Emoji (Bisa diganti image SVG nanti) */}
            <div className="w-32 h-32 flex items-center justify-center select-none">
              <div className="relative text-7xl">
                ⛰️
                <div className="absolute -top-2 -right-4 text-4xl animate-bounce">🚩</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Japatek Quest</h1>
          <p className="text-gray-400 text-sm">Turn practice into progress</p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.certifications.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              Belum ada quest yang tersedia.
            </div>
          ) : (
            data.certifications.map((cert, index) => {
              // Ambil ikon secara bergantian berdasarkan index
              const visual = visualPresets[index % visualPresets.length];
              const IconComponent = visual.icon;

              return (
                <div 
                  key={cert.id}
                  className="group relative flex items-center justify-between p-6 rounded-2xl bg-[#262626] hover:bg-[#2f2f2f] transition-all duration-200 border border-transparent hover:border-gray-700"
                >
                  {/* Bagian Kiri (Teks & Tombol) */}
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-semibold text-[17px] text-white line-clamp-1">
                        {cert.title}
                      </h3>
                      {/* Menggunakan requiredCount sebagai 'Levels' */}
                      <p className="text-gray-400 text-sm mt-1">
                        {cert.requiredCount || 0} Levels
                      </p>
                    </div>
                    
                    <Link href={`/quests/${cert.slug || cert.id}`} className="inline-block">
                      <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#363636] hover:bg-[#454545] transition-colors text-[#f59e0b] text-sm font-medium">
                        <Hand className="w-4 h-4" />
                        Start
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
  );
}