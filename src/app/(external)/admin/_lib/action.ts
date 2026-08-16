"use server";

import { prisma } from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth-admin"; // Auth.js v5 session helper — adjust this import if your auth config lives elsewhere

// 1. Ambil artikel milik admin yang sedang login saja
export async function getArticles() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.article.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    return [];
  }
}

// 2. Simpan artikel — create otomatis terikat ke admin yang login,
//    update hanya diizinkan jika artikel tersebut miliknya
export async function saveArticle(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid. Silakan login ulang." };
    }
    const authorId = session.user.id;

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

      // === JIKA ID ADA -> UPDATE (hanya jika miliknya) ===
      const existing = await prisma.article.findUnique({ where: { id: articleId } });
      if (!existing || existing.authorId !== authorId) {
        return { success: false, error: "Anda tidak memiliki izin untuk mengubah artikel ini." };
      }

      await prisma.article.update({
        where: { 
          id: articleId // Ubah menjadi Number(articleId) jika kolom id Anda bertipe Int
        },
        data: payload,
      });

    } else if (!articleId && articleSlug) {
      
      // === JIKA ID KOSONG TAPI SLUG ADA -> CREATE DENGAN RANDOM ID, TERIKAT KE ADMIN YANG LOGIN ===
      
      // Buat angka unik menggunakan kombinasi waktu saat ini (agar 100% unik)
      const randomIdNumber = Date.now(); 
      
      await prisma.article.create({
        data: {
          // PENTING: 
          // Jika di schema.prisma tipe id adalah String, gunakan .toString()
          // Jika tipe id adalah Int, hapus .toString() dan gunakan angkanya langsung
          id: randomIdNumber.toString(),
          authorId,
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

// 3. Hapus artikel — hanya jika milik admin yang login
export async function deleteArticle(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid. Silakan login ulang." };
    }

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return { success: false, error: "Anda tidak memiliki izin untuk menghapus artikel ini." };
    }

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