import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth/auth";
import { CertificationDashboard } from "./_components/certification-dashboard";
import { getMyCertificationDashboard, getPublishedQuests } from "./_lib/actions"; // <-- Import fungsi baru

export const metadata = {
    title: "Dashboard | Japatek Consultant",
    description: "Track your learning progress and certifications.",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth");
    }

    // Ambil data secara paralel agar loading lebih cepat
    const [dashboard, quests] = await Promise.all([
        getMyCertificationDashboard(),
        getPublishedQuests(), // <-- Panggil datanya di sini
    ]);

    const dashboardData = {
        totalPoints: 0,
        questsCompleted: 0,
        currentStreakDays: 0,
        certifications: dashboard.certifications,
        quests: quests, // <-- Masukkan data quest ke dalam object ini
    };

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <CertificationDashboard data={dashboardData} />
        </main>
    );
}