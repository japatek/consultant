import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth"; // Mengikuti import auth yang ada di action Anda
import { CertificationDashboard } from "./_components/certification-dashboard"; 
import { getMyCertificationDashboard } from "./_lib/actions"; 

export const metadata = {
  title: "Dashboard | Japatek Consultant",
  description: "Track your learning progress and certifications.",
};

export default async function DashboardPage() {
  // 1. Verifikasi autentikasi user
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth"); // Sesuaikan URL login jika berbeda
  }

  // 2. Ambil data sertifikasi dari action yang Anda buat
  const dashboard = await getMyCertificationDashboard();

  // 3. Format data sesuai dengan DashboardData type
  const dashboardData = {
    // TODO: Karena fungsi getMyProgress belum ada di actions.ts Anda,
    // kita set nilainya ke 0 untuk sementara. 
    // Anda bisa menggantinya jika tabel poin/streak di database sudah siap.
    totalPoints: 0, 
    questsCompleted: 0,
    currentStreakDays: 0, 
    
    // Ini adalah data riil yang diambil dari getMyCertificationDashboard()
    certifications: dashboard.certifications,
  };

  // 4. Render komponen klien
  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <CertificationDashboard data={dashboardData} />
    </main>
  );
}