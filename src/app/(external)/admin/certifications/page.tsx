import { listCertificationsForAdmin } from "@/lib/certificate/admin-certification-actions";
import { CertificationAdminPanel } from "./_components/certification-admin-panel";

export default async function CertificationsAdminPage() {
  const certifications = await listCertificationsForAdmin();
  return (
    <div className="p-6">
      <CertificationAdminPanel initialCertifications={certifications} />
    </div>
  );
}
