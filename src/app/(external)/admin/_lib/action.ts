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

// 2. Simpan artikel (Sesuai logika yang Anda minta: Cek ID & Slug)
export async function saveArticle(data: any) {
  try {
    const articleId = data.id;
    const articleSlug = data.slug;

    // Rangkai payload tanpa menyertakan ID
    const payload = {
      slug: articleSlug,
      title: data.title,
      desc: data.desc,
      content: data.content,
      id_title: data.id_title,
      id_desc: data.id_desc,
      id_content: data.id_content,
      imageUrl: data.imageUrl,
    };

    // LOGIKA UTAMA: "Jika ID dan Slug ada -> UPDATE, jika tidak ada ID -> CREATE"
    if (articleId && articleSlug) {
      
      await prisma.article.update({
        where: { 
          id: articleId 
          // Catatan: Jika 'id' di database Anda berupa angka (Int), 
          // ubah baris di atas menjadi -> id: Number(articleId)
        },
        data: payload,
      });

    } else {
      
      await prisma.article.create({
        data: payload,
      });

    }

    // Bersihkan cache agar website langsung terupdate
    revalidatePath("/");
    revalidatePath("/landing/article");
    revalidatePath("/(external)/(admin)/articles", "page");

    return { success: true };
  } catch (error: any) {
    console.error("Gagal menyimpan artikel:", error);
    
    // Menangkap error jika Slug Duplikat (Unique Constraint Failed)
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