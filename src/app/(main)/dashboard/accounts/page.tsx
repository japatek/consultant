import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ProfileEditor } from "./_components/profile";
import { WelcomeDate } from "@/components/ui/welcomedate";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // `auth()` already verified the session and carries the profile fields
  // that matter for display in the JWT — there's no need for a separate
  // `prisma.user.findUnique` just to render the form. The database is
  // only touched when the profile is actually mutated (see
  // `_components/action.ts`), which is the "verification" step.
  const currentUser = {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-2xl p-6 ">
      <WelcomeDate
        name={
          session.user.name
            ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1)
            : "How Are You?"
        }
      />
      <ProfileEditor user={currentUser} />
    </div>
  );
}
