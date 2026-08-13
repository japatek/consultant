"use server";

import {prisma} from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";

// 1. Ambil semua artikel (untuk tabel admin & navbar)
export async function getArticles() {
  try {
    return await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    return [];
  }
}

// 2. Simpan artikel (Buat baru atau Update jika ID sudah ada)
export async function saveArticle(data: {
  id?: string;
  slug: string;
  title: string;
  desc: string;
  content: string;
  id_title: string;
  id_desc: string;
  id_content: string;
  imageUrl: string;
}) {
  try {
    if (data.id) {
      // Update
      await prisma.article.update({
        where: { id: data.id },
        data: { ...data },
      });
    } else {
      // Create
      await prisma.article.create({
        data: { ...data },
      });
    }

    // Bersihkan cache agar website langsung terupdate
    revalidatePath("/");
    revalidatePath("/landing/article");
    revalidatePath("/(external)/(admin)/articles", "page");

    return { success: true };
  } catch (error: any) {
    console.error("Gagal menyimpan artikel:", error);
    return { success: false, error: error.message };
  }
}

// 3. Hapus artikel
export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/landing/article");
    revalidatePath("/(external)/(admin)/articles", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal menghapus artikel:", error);
    return { success: false, error: error.message };
  }
}