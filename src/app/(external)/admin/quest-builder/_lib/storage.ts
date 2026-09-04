/**
 * Storage adapter — S3 + CloudFront implementation.
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export type UploadedFile = {
  url: string;
  fileName: string;
  sizeBytes: number;
};

// Initialize the S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;
// Your CloudFront domain (e.g., https://d111111abcdef8.cloudfront.net)
const CLOUDFRONT_URL = (process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string)?.replace(/\/$/, ""); 

export async function uploadFile(file: File, folder: string): Promise<UploadedFile> {
  if (!BUCKET_NAME || !CLOUDFRONT_URL) {
    throw new Error("Missing S3_BUCKET_NAME or NEXT_PUBLIC_CLOUDFRONT_URL environment variables.");
  }

  // Convert the web File object to a Node Buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Sanitize filename spaces/special characters and prepend UUID
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${folder}/${crypto.randomUUID()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return the CloudFront URL instead of the raw S3 URL
  return { 
    url: `${CLOUDFRONT_URL}/${key}`, 
    fileName: file.name, 
    sizeBytes: file.size 
  };
}

export async function deleteFile(url: string): Promise<void> {
  if (!url.startsWith(CLOUDFRONT_URL)) {
    console.warn(`Attempted to delete a file not hosted on configured CloudFront domain: ${url}`);
    return;
  }

  // Extract the S3 Key from the CloudFront URL 
  // E.g. https://cdn.domain.com/folder/file.png -> folder/file.png
  const urlObj = new URL(url);
  const key = urlObj.pathname.substring(1); // Remove the leading slash

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/** Extension guard shared by the quest-media and answer-file upload paths. */
export function assertAllowedExtension(fileName: string, allowed: readonly string[]) {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) {
    throw new Error(`"${ext}" isn't allowed here — expected one of: ${allowed.join(", ")}`);
  }
}