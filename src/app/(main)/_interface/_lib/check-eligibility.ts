/**
 * Pure eligibility logic. Takes plain ids in, plain results out — no Prisma
 * import here on purpose, so the actual DB fetch stays in the server action
 * (src/actions/certification-actions.ts) and this file can be unit tested
 * with plain arrays.
 */

export type CertificationRequirement = {
  certificationId: string;
  requiredQuestIds: string[];
};

export type CertificationProgress = {
  certificationId: string;
  requiredCount: number;
  completedCount: number;
  percent: number; // 0-100, rounded
  isEligible: boolean;
  missingQuestIds: string[];
};

/** Progress for one certification against a user's set of correctly-completed quest ids. */
export function computeCertificationProgress(
  requirement: CertificationRequirement,
  correctlyCompletedQuestIds: Set<string>
): CertificationProgress {
  const missingQuestIds = requirement.requiredQuestIds.filter(
    (id) => !correctlyCompletedQuestIds.has(id)
  );
  const completedCount = requirement.requiredQuestIds.length - missingQuestIds.length;
  const requiredCount = requirement.requiredQuestIds.length;

  return {
    certificationId: requirement.certificationId,
    requiredCount,
    completedCount,
    percent: requiredCount === 0 ? 0 : Math.round((completedCount / requiredCount) * 100),
    isEligible: requiredCount > 0 && missingQuestIds.length === 0,
    missingQuestIds,
  };
}

/** Progress across every certification, plus the subset the user just became eligible for. */
export function computeAllCertificationProgress(
  requirements: CertificationRequirement[],
  correctlyCompletedQuestIds: string[],
  alreadyUnlockedCertificationIds: Set<string>
): { progress: CertificationProgress[]; newlyEligibleCertificationIds: string[] } {
  const completedSet = new Set(correctlyCompletedQuestIds);
  const progress = requirements.map((r) => computeCertificationProgress(r, completedSet));

  const newlyEligibleCertificationIds = progress
    .filter((p) => p.isEligible && !alreadyUnlockedCertificationIds.has(p.certificationId))
    .map((p) => p.certificationId);

  return { progress, newlyEligibleCertificationIds };
}
