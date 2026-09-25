import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Ambil file dari form data (pastikan nama field di frontend adalah "file")
    const file = formData.get("file") as File; 
    const folder = formData.get("folder");
    
    // Tentukan target folder sesuai logika Anda sebelumnya
    const targetFolder = folder === "answer-files" ? "answer-files" : "quest-media";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Eksekusi upload langsung ke Vercel Blob
    const blob = await put(`${targetFolder}/${file.name}`, file, {
      access: 'public', // Wajib public agar gambar bisa ditampilkan di web
      addRandomSuffix: true // Opsional: Mencegah nama file bentrok
    });

    // Sesuaikan format kembalian JSON dengan apa yang diharapkan editor Markdown Anda
    // blob.url berisi link gambar baru, misal: https://[hash].public.blob.vercel-storage.com/quest-media/gambar.png
    return NextResponse.json({ url: blob.url }, { status: 201 });

  } catch (error) {
    return toErrorResponse(error);
  }
}