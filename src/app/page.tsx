import { redirect } from "next/navigation";
import { auth }     from "@/lib/auth/auth"; // Sesuaikan dengan path file auth.js v5 Anda

export default async function DashboardRootPage() {
  // 1. Ambil sesi pengguna saat ini (berjalan di server)
  const session = await auth();

  // 2. Jika tidak ada sesi atau tidak ada ID (berjaga-jaga), lempar ke login
  if (!session?.user?.id) {
    redirect("/auth/v4/login");
  }

  // 3. Jika sesi ada, lempar langsung ke halaman platoverview spesifik mereka
  redirect(`/dashboard/platoverview`);
}