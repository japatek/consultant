"use server";

import { put } from "@vercel/blob";
import crypto from "crypto";

// HAPUS SEMUA inisialisasi s3Client dan variabel AWS di sini

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File tidak ditemukan.");

    // Standar Industri Naming: Ekstensi asli + Timestamp + Random UUID
    const ext = file.name.split('.').pop() || "png";
    const fileName = `articles/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Upload langsung ke Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false, // Karena nama file sudah sangat unik dari Date + UUID
    });

    // blob.url otomatis akan berisi:
    // https://zrag0isxqbcebeen.public.blob.vercel-storage.com/articles/nama-file.png
    return { success: true, url: blob.url };
    
  } catch (error: any) {
    console.error("=== FULL BLOB UPLOAD ERROR ===");
    console.error(error); 
    return { success: false, error: error.message };
  }
}