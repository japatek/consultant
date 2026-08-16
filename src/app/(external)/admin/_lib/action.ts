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

// 2. Simpan artikel dengan pembuatan Random ID
export async function saveArticle(data: any) {
  try {
    const articleId = data.id;
    const articleSlug = data.slug;

    // Rangkai payload utama tanpa menyertakan ID
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

    if (articleId && articleId !== "") {
      
      // === JIKA ID ADA -> UPDATE ===
      await prisma.article.update({
        where: { 
          id: articleId // Ubah menjadi Number(articleId) jika kolom id Anda bertipe Int
        },
        data: payload,
      });

    } else if (!articleId && articleSlug) {
      
      // === JIKA ID KOSONG TAPI SLUG ADA -> CREATE DENGAN RANDOM ID ===
      
      // Buat angka unik menggunakan kombinasi waktu saat ini (agar 100% unik)
      const randomIdNumber = Date.now(); 
      
      await prisma.article.create({
        data: {
          // PENTING: 
          // Jika di schema.prisma tipe id adalah String, gunakan .toString()
          // Jika tipe id adalah Int, hapus .toString() dan gunakan angkanya langsung
          id: randomIdNumber.toString(), 
          ...payload,
        },
      });

    }

    // Bersihkan cache agar website langsung terupdate
    revalidatePath("/");
    revalidatePath("/landing/article");
    revalidatePath("/(external)/(admin)/articles", "page");

    return { success: true };
  } catch (error: any) {
    console.error("Gagal menyimpan artikel:", error);
    
    // Tangkap error jika Slug Duplikat
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