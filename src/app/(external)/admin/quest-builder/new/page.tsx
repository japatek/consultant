import { listCertifications } from "@/lib/certificate/certification-actions";
import { QuestBuilderForm } from "../_components/quest-builder-form";

export default async function NewQuestPage() {
  const certifications = await listCertifications();
  return (
    <div className="p-6">
      <QuestBuilderForm certifications={certifications} />
    </div>
  );
}
