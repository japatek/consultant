/**
 * Storage adapter — the one place that knows where uploaded files actually
 * live. Nothing else in this codebase should import a storage SDK directly;
 * everything calls `uploadFile` / `deleteFile` from here.
 *
 * TODO: wire this up to whatever you're using — Vercel Blob, Supabase
 * Storage, S3/R2, UploadThing, etc. Below is a Vercel Blob example (the
 * lowest-friction option if you're already deploying there); swap the body
 * of both functions and nothing else in the app needs to change.
 *
 *   npm install @vercel/blob
 *
 *   import { put, del } from "@vercel/blob";
 *
 *   export async function uploadFile(file: File, folder: string): Promise<UploadedFile> {
 *     const blob = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
 *       access: "public",
 *     });
 *     return { url: blob.url, fileName: file.name, sizeBytes: file.size };
 *   }
 *
 *   export async function deleteFile(url: string): Promise<void> {
 *     await del(url);
 *   }
 */

export type UploadedFile = {
  url: string;
  fileName: string;
  sizeBytes: number;
};

export async function uploadFile(file: File, folder: string): Promise<UploadedFile> {
  throw new Error(
    `uploadFile() is not wired up yet — see the TODO in src/lib/storage.ts. ` +
      `Tried to upload "${file.name}" into "${folder}".`
  );
}

export async function deleteFile(url: string): Promise<void> {
  throw new Error(`deleteFile() is not wired up yet — see the TODO in src/lib/storage.ts (${url}).`);
}

/** Extension guard shared by the quest-media and answer-file upload paths. */
export function assertAllowedExtension(fileName: string, allowed: readonly string[]) {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) {
    throw new Error(`"${ext}" isn't allowed here — expected one of: ${allowed.join(", ")}`);
  }
}
