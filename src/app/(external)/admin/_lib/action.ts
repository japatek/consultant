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
    // PISAHKAN 'id' DARI DATA LAINNYA
    // payload berisi semua isi 'data' KECUALI 'id'
    const { id, ...payload } = data;

    if (id) {
      // Jika ID ada: Lakukan UPDATE menggunakan payload yang sudah dibersihkan
      await prisma.article.update({
        where: { id: id },
        data: payload,
      });
    } else {
      // Jika ID kosong (""): Lakukan CREATE tanpa menyertakan field id
      // (Biarkan database men-generate ID otomatis seperti UUID/CUID)
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