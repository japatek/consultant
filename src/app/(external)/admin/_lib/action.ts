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
export async function saveArticle(data: any) {
  try {
    // 1. Ambil ID secara eksplisit
    const articleId = data.slug;


    // 2. Rangkai ulang payload khusus untuk data yang boleh diubah 
    // (JANGAN PERNAH memasukkan 'id' ke dalam payload ini)
    const payload = {
      slug: data.slug,
      title: data.title,
      desc: data.desc,
      content: data.content,
      id_title: data.id_title,
      id_desc: data.id_desc,
      id_content: data.id_content,
      imageUrl: data.imageUrl,
    };

    // 3. Logika penentuan arah yang tegas
    if (articleId && articleId !== "") {
      
      // JIKA ID ADA -> UPDATE
      await prisma.article.update({
        // PENTING: Jika di schema Prisma id Anda menggunakan Int, ubah baris di bawah menjadi:
        // where: { id: Number(articleId) },
        where: { id: articleId }, 
        data: payload,
      });

    } else {
      
      // JIKA ID KOSONG -> CREATE
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
    
    // Pesan error ramah jika slug duplikat
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