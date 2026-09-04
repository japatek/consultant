"use client";

import { Flame, Trophy, ListChecks, Award } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { CertificateCard, type CertificationCardData } from "./certificate-card";

export type DashboardData = {
  totalPoints: number;
  questsCompleted: number;
  currentStreakDays: number;
  certifications: CertificationCardData[];
};

/**
 * Pure presentation — fetch the data in a Server Component (page or layout)
 * with getMyCertificationDashboard() + getMyProgress(), then render this:
 *
 *   const dashboard = await getMyCertificationDashboard();
 *   const progress = await getMyProgress();
 *   return <CertificationDashboard data={{ ...progress, certifications: dashboard.certifications }} />;
 */
export function CertificationDashboard({ data }: { data: DashboardData }) {
  const { t } = useLanguage();

  const stats = [
    { icon: Trophy, label: t.dashPoints, value: data.totalPoints.toLocaleString() },
    { icon: ListChecks, label: t.dashQuestsCompleted, value: data.questsCompleted.toLocaleString() },
    { icon: Flame, label: t.dashStreak, value: data.currentStreakDays.toLocaleString() },
    {
      icon: Award,
      label: t.dashCertifications,
      value: data.certifications.filter((c) => c.unlockedAt).length.toLocaleString(),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.dashTitle}</h1>
        <p className="text-muted-foreground">{t.dashSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border p-4">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">{t.dashCertifications}</h2>
        {data.certifications.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t.dashNoCertifications}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.certifications.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
