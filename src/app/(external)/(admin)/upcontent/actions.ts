"use server";

import { prisma } from "@/lib/database/prisma"; // Adjust this path if your prisma instance is elsewhere
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourse(formData: FormData) {
  // Extract data from the form
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const duration = formData.get("duration") as string;
  const level = formData.get("level") as string;
  const content = formData.get("content") as string;

  // Save to the database
  await prisma.courseMaterial.create({
    data: {
      title,
      description,
      category,
      duration,
      level,
      content,
    },
  });

  // Tell Next.js to refresh the page showing the courses so the new one appears immediately
  revalidatePath("/dashboard/learning"); // Change this to the URL where your list lives
  
  // Redirect the user back to the courses list
  redirect("/dashboard/learning"); 
}