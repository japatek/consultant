import { LearningMaterialsList } from "./_components/learning-materials";
import { CalendarPanel } from "./_components/calendar-panel";
import { WelcomeDate } from "@/components/ui/welcomedate";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma"; // Adjust this import based on where your prisma client is

// This is a React Server Component
export default async function CoursesPage() {
  // Fetch the data from your Prisma database
  // In a real app, you might add 'where', 'orderBy', or pagination here
  const courses = await prisma.courseMaterial.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
   const session = await auth()

  return (
    
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-9">
        <div className="flex flex-col gap-6">
        <WelcomeDate name={session?.user?.name ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1) : 'How Are You?'} />
        <LearningMaterialsList materials={courses}/>
        </div>
      </section>

      <section className="flex flex-col gap-6 lg:col-span-3">
        <CalendarPanel />
      </section>
    </div>
  );
}