import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth"; // Sesuaikan jika path auth Anda berbeda (misal: "@/lib/auth/auth")
import { CertificationDashboard } from "./_components/certification-dashboard"; // Sesuaikan dengan nama file komponen di atas
import { getMyCertificationDashboard, getMyProgress } from "./_lib/actions"; // Sesuaikan path action Anda

export const metadata = {
  title: "Dashboard | JAPA Consultant",
  description: "Track your learning progress and certifications.",
};

export default async function DashboardPage() {
  // 1. Verifikasi autentikasi user
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth"); // Lempar ke halaman login jika belum masuk
  }

  // 2. Ambil data dari database secara paralel agar lebih cepat
  const [dashboard, progress] = await Promise.all([
    getMyCertificationDashboard(),
    getMyProgress(),
  ]);

  // 3. Format data sesuai dengan DashboardData type yang diminta oleh komponen
  // (Memberikan nilai default fallback 0/array kosong jika user baru pertama kali login)
  const dashboardData = {
    totalPoints: progress?.totalPoints ?? 0,
    questsCompleted: progress?.questsCompleted ?? 0,
    currentStreakDays: progress?.currentStreakDays ?? 0,
    certifications: dashboard?.certifications ?? [],
  };

  // 4. Render komponen klien
  return (
    <main className="container mx-auto px-4 py-8 sm:py-12">
      <CertificationDashboard data={dashboardData} />
    </main>
  );
}