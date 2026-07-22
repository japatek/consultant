"use server"; // Wajib ditambahkan di baris paling atas jika menggunakan Next.js Server Actions

import { prisma } from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import type { UserRow, UserStatus, UserTeam } from "./data";

/**
 * Fungsi untuk mengubah Nama, Email, dan Foto pengguna di database Postgres.
 */
export async function updateUserProfile(
  userId: string, 
  dataToUpdate: { 
    name?: string; 
    email?: string; 
    image?: string; 
  }
) {
  try {
    // 1. Jalankan perintah update ke Prisma
    const updatedUser = await prisma.user.update({
      where: {
        id: userId, // Mencari user berdasarkan ID
      },
      data: {
        // Prisma cukup cerdas: jika nilai dikirim "undefined", dia tidak akan menimpa data aslinya
        name: dataToUpdate.name,
        email: dataToUpdate.email,
        image: dataToUpdate.image,
        
        // Opsional: Perbarui waktu aktif saat user melakukan edit profil
        updatedAt: new Date(), 
      },
    });

    // 2. Bersihkan cache Next.js agar tabel UI/Dashboard langsung menampilkan data terbaru
    // Ganti "/dashboard/users" dengan alamat URL halaman tabel Anda
    revalidatePath("/dashboard/users"); 
    revalidatePath("/dashboard/settings");

    return { 
      success: true, 
      message: "Data pengguna berhasil diperbarui!",
      user: updatedUser 
    };

  } catch (error) {
    console.error("Gagal mengupdate pengguna:", error);
    return { 
      success: false, 
      message: "Terjadi kesalahan saat memperbarui data di database." 
    };
  }
}

export async function getUsers(): Promise<UserRow[]> {
  const dbUsers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();

  return dbUsers.map((user) => {
    const lastActiveDate = user.lastActive ?? user.updatedAt;
    const lastActiveDiffMs = now.getTime() - lastActiveDate.getTime();
    const lastActiveMinutes = Math.floor(lastActiveDiffMs / (1000 * 60));

    const formattedJoinedDate = user.createdAt.toLocaleDateString("en-US", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
    });

    return {
      id: user.id,
      email: user.email,
      joinedDate: formattedJoinedDate,
      lastActive: lastActiveMinutes >= 0 ? lastActiveMinutes : 0,
      name: user.name ?? "No Name",
      role: user.role,
      emailVerified: user.emailVerified,
      image: user.image,
      status: "Active" as UserStatus,
      team: "Platform" as UserTeam, 
      workspace: ["Default Workspace"], 
    };
  });
}