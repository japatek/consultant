import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth/auth";
import { CertificationDashboard } from "./_components/certification-dashboard"; 
import { getMyCertificationDashboard } from "./_lib/actions"; 

export const metadata = {
  title: "Dashboard | Japatek Consultant",
  description: "Track your learning progress and certifications.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth"); 
  }

  const dashboard = await getMyCertificationDashboard();

  const dashboardData = {
    totalPoints: 0, 
    questsCompleted: 0,
    currentStreakDays: 0, 
    certifications: dashboard.certifications,
  };

  // UBAH BAGIAN INI: Hapus class container agar background gelap bisa full screen
  return (
    <main className="min-h-screen bg-[#111111]">
      <CertificationDashboard data={dashboardData} />
    </main>
  );
}