import { getMyCertificationDashboard } from "@/actions/certification-actions";
import { CertificationDashboard } from "./_components/certification-dashboard";
export default async function Page() {
  const { certifications } = await getMyCertificationDashboard();
  // fetch totalPoints/questsCompleted/currentStreakDays from prisma.userProgress
  // and merge them into the `data` prop shape CertificationDashboard expects.
  return <CertificationDashboard data={{ ...progress, certifications }} />;
}
