/**
 * Storage adapter — AWS S3 (upload target) + CloudFront (public URL/CDN).
 * Nothing else in this codebase should import the AWS SDK directly;
 * everything calls `uploadFile` / `deleteFile` from here.
 *
 *   npm install @aws-sdk/client-s3
 *
 * Required env vars (all separate from each other — the CDN domain alone
 * is not enough to upload anything):
 *   AWS_REGION
 *   AWS_ACCESS_KEY_ID
 *   AWS_SECRET_ACCESS_KEY
 *   AWS_S3_BUCKET_NAME               <-- Telah diubah
 *   NEXT_PUBLIC_CLOUDFRONT_URL <-- Telah diubah
 *
 * Optional:
 *   AWS_S3_KEY_PREFIX        Only set this if your bucket path (e.g.
 *                            "folder_a/subfolder") is a literal prefix that
 *                            must be part of the S3 key. If instead that
 *                            path is configured as the CloudFront
 *                            distribution's *Origin Path*, leave this unset —
 *                            CloudFront strips it automatically and your
 *                            keys should stay as plain "quest/...".
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name} (see src/lib/storage.ts)`);
  }
  return value;
}

let s3Client: S3Client | null = null;
function getClient(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: requireEnv("AWS_REGION"),
      credentials: {
        accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }
  return s3Client;
}

const KEY_PREFIX = (process.env.AWS_S3_KEY_PREFIX ?? "").replace(/^\/+|\/+$/g, "");

export type UploadedFile = {
  url: string;
  fileName: string;
  sizeBytes: number;
};

function sanitizeFileName(fileName: string): string {
  return fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function uploadFile(file: File, folder: string): Promise<UploadedFile> {
  const bucket = requireEnv("AWS_S3_BUCKET_NAME");
  
  let cdnDomain = requireEnv("NEXT_PUBLIC_CLOUDFRONT_URL");
  cdnDomain = cdnDomain.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');

  const bytes = Buffer.from(await file.arrayBuffer());
  const uniqueName = `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
  
  // 1. S3 KEY: Jalur asli untuk menyimpan file ke AWS S3 (MENGGUNAKAN Consultant)
  const s3Key = [KEY_PREFIX, "Consultant", "quest", folder, uniqueName].filter(Boolean).join("/");
  
  // 2. PUBLIC PATH: Jalur URL yang akan dirender web & database (TANPA Consultant)
  const publicPath = [KEY_PREFIX, "quest", folder, uniqueName].filter(Boolean).join("/");

  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key, // S3 akan menyimpannya di folder Consultant/quest/...
        Body: bytes,
        ContentType: file.type || "application/octet-stream",
      })
    );
  } catch (error) {
    throw new Error(`S3 upload failed for key "${s3Key}": ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    // URL dirender bersih tanpa "Consultant"
    url: `https://${cdnDomain}/${publicPath}`, 
    fileName: file.name,
    sizeBytes: bytes.byteLength,
  };
}

export async function deleteFile(urlOrKey: string): Promise<void> {
  const bucket = requireEnv("AWS_S3_BUCKET_NAME");
  let key = urlOrKey.startsWith("http") ? new URL(urlOrKey).pathname.replace(/^\/+/, "") : urlOrKey;
  
  // Saat web mengirim perintah hapus, URL tidak punya awalan "Consultant/".
  // Kita harus menambahkannya kembali agar S3 bisa menemukan file aslinya.
  if (!key.startsWith("Consultant/")) {
    key = `Consultant/${key}`;
  }
  
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export function assertAllowedExtension(fileName: string, allowed: readonly string[]) {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) {
    throw new Error(`"${ext}" isn't allowed here — expected one of: ${allowed.join(", ")}`);
  }
}