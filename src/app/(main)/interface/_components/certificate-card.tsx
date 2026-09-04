import { Award, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { translations } from "@/translate/language-data";

type T = (typeof translations)["en"];

export type CertificationCardData = {
  id: string;
  title: string;
  description: string;
  badgeUrl: string | null;
  requiredCount: number;
  completedCount: number;
  percent: number;
  unlockedAt: string | Date | null;
  certificateUrl: string | null;
  verificationCode: string | null;
};

export function CertificateCard({ cert, t }: { cert: CertificationCardData; t: T }) {
  const unlocked = cert.unlockedAt !== null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-5 transition-shadow",
        unlocked ? "border-primary/30 bg-primary/[0.03]" : "border-border bg-muted/20"
      )}
    >
      {/* Corner tick marks — a small nod to a technical-drawing border,
          only drawn once a certificate is actually earned. */}
      {unlocked && (
        <>
          <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-primary/40" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-primary/40" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-primary/40" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-primary/40" />
        </>
      )}

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2",
            unlocked
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted-foreground/30 text-muted-foreground/50"
          )}
        >
          {unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-tight">{cert.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{cert.description}</p>

          {!unlocked && (
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${cert.percent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {cert.completedCount}/{cert.requiredCount} · {cert.requiredCount - cert.completedCount}{" "}
                {t.dashQuestsLeft}
              </p>
            </div>
          )}

          {unlocked && cert.verificationCode && (
            <p className="mt-2 font-mono text-xs tracking-wide text-muted-foreground">
              {t.dashVerificationCode}: {cert.verificationCode}
            </p>
          )}

          {unlocked && (
            <div className="mt-3 flex gap-2">
              {cert.certificateUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={cert.certificateUrl} target="_blank" rel="noreferrer">
                    {t.dashViewCertificate}
                  </a>
                </Button>
              )}
              {cert.certificateUrl && (
                <Button asChild size="sm">
                  <a href={cert.certificateUrl} download>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    {t.dashDownload}
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
