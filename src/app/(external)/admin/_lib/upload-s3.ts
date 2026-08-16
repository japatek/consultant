"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// Inisialisasi AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadImageToS3(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File tidak ditemukan.");

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Standar Industri Naming: Ekstensi asli + Timestamp + Random UUID
    const ext = file.name.split('.').pop() || "png";
    const fileName = `articles/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      // Hapus komentar di bawah jika bucket Anda memerlukan konfigurasi ACL
      // ACL: "public-read", 
    });

    await s3Client.send(command);

    // Path URL publik dari file yang baru saja diunggah
    // const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    const url = `${process.env.MEDIA_URL}/article/${fileName}`;
    
    return { success: true, url };
  } catch (error: any) {
    console.error("Gagal upload S3:", error);
    return { success: false, error: error.message };
  }
}