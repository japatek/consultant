"use server";

import { prisma } from "@/lib/database/prisma";
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
    const { id, ...payload } = data;

    if (id) {
      await prisma.article.update({
        where: { id: id },
        data: payload,
      });
    } else {
      await prisma.article.create({
        data: payload,
      });
    }

    revalidatePath("/");
    revalidatePath("/landing/article");
    revalidatePath("/(external)/(admin)/articles", "page");

    return { success: true };
  } catch (error: any) {
    console.error("Gagal menyimpan artikel:", error);
    
    // TAMBAHKAN PENGECEKAN ERROR PRISMA DI SINI
    // P2002 adalah kode unik dari Prisma jika ada data duplikat (Unique constraint)
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: "Gagal menyimpan: URL Slug tersebut sudah digunakan oleh artikel lain. Silakan ganti dengan URL Slug yang berbeda." 
      };
    }

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