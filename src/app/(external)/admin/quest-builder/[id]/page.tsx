import { notFound } from "next/navigation";
import { getQuestById } from "../_lib/actions";
import { listCertifications } from "@/lib/certificate/certification-actions";
import { QuestBuilderForm } from "../_components/quest-builder-form";

export default async function EditQuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quest, certifications] = await Promise.all([getQuestById(id), listCertifications()]);

  if (!quest) notFound();

  return (
    <div className="p-6">
      <QuestBuilderForm
        questId={quest.id}
        initialValues={quest.initialValues}
        certifications={certifications}
      />
    </div>
  );
}
