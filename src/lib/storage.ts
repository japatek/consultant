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

const KEY_PREFIX = (process.env.AWS_S3_KEY_PREFIX ?? "").replace(/^\/+|\/+$/g, ""); // trim slashes

export type UploadedFile = {
  url: string;
  fileName: string;
  sizeBytes: number;
};

function sanitizeFileName(fileName: string): string {
  return fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function buildKey(folder: string, fileName: string): string {
  const parts = [KEY_PREFIX, "Consultant","quest", folder, `${crypto.randomUUID()}-${sanitizeFileName(fileName)}`];
  return parts.filter(Boolean).join("/");
}

/**
 * Uploads under `[AWS_S3_KEY_PREFIX/]quest/{folder}/{uuid}-{filename}`, e.g.
 *   quest/media/3f9c1a2b-diagram.png
 *   folder_a/subfolder/quest/answers/7e21f0aa-bracket.step   (prefix set)
 * and returns the CloudFront URL for it — never the raw S3 URL, since the
 * bucket itself isn't meant to be public (CloudFront is the CDN in front of it).
 */
export async function uploadFile(file: File, folder: string): Promise<UploadedFile> {
  const bucket = requireEnv("AWS_S3_BUCKET_NAME");
  
  // MENGAMBIL DAN MEMBERSIHKAN NAMA DOMAIN
  let cdnDomain = requireEnv("NEXT_PUBLIC_CLOUDFRONT_URL");
  // Menghapus 'http://' atau 'https://' di awal dan '/' di akhir (jika ada)
 cdnDomain = cdnDomain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^https?\/\//i, '')
    .replace(/\/$/, '');

  const bytes = Buffer.from(await file.arrayBuffer());
  const key = buildKey(folder, file.name);

  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: file.type || "application/octet-stream",
      })
    );
  } catch (error) {
    throw new Error(
      `S3 upload failed for key "${key}" in bucket "${bucket}": ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error }
    );
  }

  return {
    url: `https://${cdnDomain}/${key}`, // Sekarang dipastikan aman tanpa double https
    fileName: file.name,
    sizeBytes: bytes.byteLength,
  };
}

/** Accepts either a full CloudFront URL or a bare S3 key. */
export async function deleteFile(urlOrKey: string): Promise<void> {
  // Telah diubah menggunakan AWS_S3_BUCKET
  const bucket = requireEnv("AWS_S3_BUCKET_NAME");
  const key = urlOrKey.startsWith("http") ? new URL(urlOrKey).pathname.replace(/^\/+/, "") : urlOrKey;
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** Extension guard shared by the quest-media and answer-file upload paths. */
export function assertAllowedExtension(fileName: string, allowed: readonly string[]) {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) {
    throw new Error(`"${ext}" isn't allowed here — expected one of: ${allowed.join(", ")}`);
  }
}