"use server";

import {prisma} from "@/lib/database/prisma"; // Sesuaikan path ini dengan lokasi instance Prisma Anda

export async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc' // Urutkan dari yang paling baru
      },
      select: {
        slug: true,
        title: true,
        desc: true,
        id_title: true,
        id_desc: true,
        imageUrl: true,
      }
    });
    return articles;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}