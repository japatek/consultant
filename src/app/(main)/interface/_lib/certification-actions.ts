"use server";

import { auth } from "@/lib/auth/auth-admin";
import { prisma } from "@/lib/database/prisma";
import {
  computeAllCertificationProgress,
  type CertificationRequirement,
} from "./check-eligibility";

/**
 * Everything the dashboard needs to render progress bars + unlocked
 * certificates for the current user. Kept as one call so the dashboard
 * component doesn't have to sequence multiple round trips.
 */
export async function getMyCertificationDashboard() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const userId = session.user.id;

  const [certifications, correctCompletions, unlocked] = await Promise.all([
    prisma.certification.findMany({
      include: { requiredQuests: { select: { questId: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.questCompletion.findMany({
      where: { userId, isCorrect: true },
      select: { questId: true },
      distinct: ["questId"],
    }),
    prisma.userCertification.findMany({ where: { userId } }),
  ]);

  const requirements: CertificationRequirement[] = certifications.map((c) => ({
    certificationId: c.id,
    requiredQuestIds: c.requiredQuests.map((q) => q.questId),
  }));

  const { progress } = computeAllCertificationProgress(
    requirements,
    correctCompletions.map((c) => c.questId),
    new Set(unlocked.map((u) => u.certificationId))
  );

  return {
    certifications: certifications.map((c) => {
      const p = progress.find((x) => x.certificationId === c.id)!;
      const earned = unlocked.find((u) => u.certificationId === c.id);
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        badgeUrl: c.badgeUrl,
        requiredCount: p.requiredCount,
        completedCount: p.completedCount,
        percent: p.percent,
        unlockedAt: earned?.unlockedAt ?? null,
        certificateUrl: earned?.certificateUrl ?? null,
        verificationCode: earned?.verificationCode ?? null,
      };
    }),
  };
}

/**
 * Call this right after grading a quest (see submitQuestAnswer in
 * quest-actions.ts). Re-checks every certification and issues any the user
 * has just become eligible for. Safe to call repeatedly — unlocking is
 * idempotent via the (userId, certificationId) unique constraint.
 */
export async function unlockEligibleCertifications(userId: string) {
  const [certifications, correctCompletions, alreadyUnlocked] = await Promise.all([
    prisma.certification.findMany({
      include: { requiredQuests: { select: { questId: true } } },
    }),
    prisma.questCompletion.findMany({
      where: { userId, isCorrect: true },
      select: { questId: true },
      distinct: ["questId"],
    }),
    prisma.userCertification.findMany({ where: { userId }, select: { certificationId: true } }),
  ]);

  const requirements: CertificationRequirement[] = certifications.map((c) => ({
    certificationId: c.id,
    requiredQuestIds: c.requiredQuests.map((q) => q.questId),
  }));

  const { newlyEligibleCertificationIds } = computeAllCertificationProgress(
    requirements,
    correctCompletions.map((c) => c.questId),
    new Set(alreadyUnlocked.map((u) => u.certificationId))
  );

  if (newlyEligibleCertificationIds.length === 0) return [];

  // createMany + skipDuplicates keeps this safe against a race where two
  // requests both see "not yet unlocked" and try to unlock at once.
  await prisma.userCertification.createMany({
    data: newlyEligibleCertificationIds.map((certificationId) => ({ userId, certificationId })),
    skipDuplicates: true,
  });

  return newlyEligibleCertificationIds;
}
