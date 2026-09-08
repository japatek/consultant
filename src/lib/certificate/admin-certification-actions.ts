// No "use server" here — same reasoning as admin-pricing-actions.ts:
// listCertificationsForAdmin is a plain read called from a Server Component
// page; upsertCertification/setCertificationActive are called through the
// thin routes under app/api/admin/certifications.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { uploadFile } from "@/lib/storage";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (session.user.role !== "ADMIN") throw new Error("Admin access required");
  return session.user;
}

export const certificationFormSchema = z.object({
  id: z.string().optional(), // present when editing, absent when creating
  slug: z.string().trim().min(2),
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  badgeUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().default(true),
});
export type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export type CertificationRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeUrl: string | null;
  isActive: boolean;
};
export type AdminCertificationRow = CertificationRecord & {
  _count: { requiredQuests: number; unlockedBy: number };
};

/** Every certification, including retired ones — this is the admin view.
 *  listCertifications() in certification-actions.ts (active-only) is what
 *  the Quest Builder's checklist reads from instead. */
export async function listCertificationsForAdmin(): Promise<AdminCertificationRow[]> {
  await requireAdmin();
  return prisma.certification.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { requiredQuests: true, unlockedBy: true } } },
  });
}

/** Returns the plain record — no `_count`, since create/update don't run
 *  that aggregate. The caller (CertificationForm) merges in the `_count`
 *  it already has (0 for a new row, or whatever it last read for an edit). */
export async function upsertCertification(values: CertificationFormValues): Promise<CertificationRecord> {
  await requireAdmin();
  const data = certificationFormSchema.parse(values);
  const { id, ...fields } = data;

  const certification = id
    ? await prisma.certification.update({ where: { id }, data: fields })
    : await prisma.certification.create({ data: fields });

  revalidatePath("/admin/certifications");
  revalidatePath("/admin/quests"); // the checklist there reads the active list
  return certification;
}

/** Retire/restore instead of delete — CertificationQuest and
 *  UserCertification rows reference this certification. */
export async function setCertificationActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.certification.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/certifications");
  revalidatePath("/admin/quests");
}

/** Badge image upload for the certification form — same S3/CloudFront
 *  adapter as quest media, just its own folder. */
export async function uploadCertificationBadge(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");
  return uploadFile(file, "certification-badges");
}
