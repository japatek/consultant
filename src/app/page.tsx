import { redirect } from "next/navigation";
import { auth }     from "@/lib/auth/auth"; // Sesuaikan dengan path file auth.js v5 Anda

export default async function LandingRootPage() {
  redirect(`/landing`);
}