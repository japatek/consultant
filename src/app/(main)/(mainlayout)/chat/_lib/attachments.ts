import type { FileUIPart, UIMessage } from "ai"

/* ───────────────────────────── limits ───────────────────────────── */

export const MAX_FILES = 6
/**
 * Raw bytes of attachments per message. Vercel Functions reject request bodies
 * over 4.5 MB, and base64 inflates data by ~33%, so stay well under that.
 */
export const MAX_TOTAL_BYTES = Math.floor(2.8 * 1024 * 1024)
export const MAX_TEXT_FILE_BYTES = 200 * 1024
export const MAX_VOICE_SECONDS = 60

const MAX_IMAGE_SIDE = 1600
const KEEP_ORIGINAL_IMAGE_BELOW = 400 * 1024

/* ───────────────────────── classification ───────────────────────── */

export type AttachmentKind = "image" | "audio" | "pdf" | "text" | "unsupported"

// Read as plain text and inlined into the prompt. Checked BEFORE the MIME type
// because browsers mislabel some of them (e.g. .ts is reported as video/mp2t).
const TEXT_EXTENSIONS = new Set([
  "txt", "md", "markdown", "csv", "tsv", "json", "jsonc", "xml", "yaml", "yml", "toml", "ini", "env", "log",
  "js", "jsx", "mjs", "cjs", "ts", "tsx", "py", "java", "kt", "c", "h", "cpp", "hpp", "cs", "go", "rs", "rb",
  "php", "swift", "scala", "sh", "bash", "zsh", "ps1", "sql", "html", "htm", "css", "scss", "less", "svg",
  "vue", "svelte", "prisma", "graphql", "gql", "gitignore",
])
const TEXT_FILENAMES = new Set(["dockerfile", "makefile"])
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif", "heic", "heif", "bmp", "avif"])
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "m4a", "aac", "ogg", "oga", "opus", "flac", "aiff", "weba"])

const EXTENSION_LANGUAGE: Record<string, string> = {
  js: "javascript", jsx: "jsx", mjs: "javascript", cjs: "javascript", ts: "typescript", tsx: "tsx",
  py: "python", java: "java", kt: "kotlin", c: "c", h: "c", cpp: "cpp", hpp: "cpp", cs: "csharp", go: "go",
  rs: "rust", rb: "ruby", php: "php", swift: "swift", scala: "scala", sh: "bash", bash: "bash", zsh: "bash",
  ps1: "powershell", sql: "sql", html: "html", htm: "html", css: "css", scss: "scss", less: "less",
  svg: "xml", xml: "xml", json: "json", jsonc: "json", yaml: "yaml", yml: "yaml", toml: "toml",
  md: "markdown", markdown: "markdown", vue: "vue", svelte: "svelte", prisma: "prisma", graphql: "graphql",
  gql: "graphql", csv: "csv", tsv: "tsv", ini: "ini", env: "bash",
}

export function extensionOf(name = ""): string {
  const match = /\.([a-z0-9]+)$/i.exec(name)
  return match ? match[1].toLowerCase() : ""
}

export function normalizeMime(type = ""): string {
  const base = type.split(";")[0].trim().toLowerCase()
  if (base === "audio/x-wav" || base === "audio/wave") return "audio/wav"
  if (base === "audio/x-m4a") return "audio/m4a"
  return base
}

export function classifyAttachment(file: { filename?: string; mediaType?: string }): AttachmentKind {
  const name = (file.filename ?? "").toLowerCase()
  const ext = extensionOf(name)
  const type = normalizeMime(file.mediaType)

  if (TEXT_EXTENSIONS.has(ext) || TEXT_FILENAMES.has(name)) return "text"
  if (type === "application/pdf" || ext === "pdf") return "pdf"
  if (type.startsWith("image/") || (!type && IMAGE_EXTENSIONS.has(ext))) return "image"
  if (type.startsWith("audio/") || (!type && AUDIO_EXTENSIONS.has(ext))) return "audio"
  if (type.startsWith("text/") || type === "application/json" || type === "application/xml") return "text"
  return "unsupported"
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ─────────────────────────── low-level IO ─────────────────────────── */

export class AttachmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AttachmentError"
  }
}

async function fetchBlob(url: string, name: string): Promise<Blob> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    return await res.blob()
  } catch {
    throw new AttachmentError(`Couldn't read "${name}". Please attach it again.`)
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error("read failed"))
    reader.readAsDataURL(blob)
  })
}

function withExtension(name: string, ext: string): string {
  return /\.[a-z0-9]+$/i.test(name) ? name.replace(/\.[a-z0-9]+$/i, `.${ext}`) : `${name}.${ext}`
}

/** Downscale big images and flatten them to JPEG so they fit the request budget. */
async function compressImage(blob: Blob): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(blob)
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
    const type = normalizeMime(blob.type)
    const small = blob.size <= KEEP_ORIGINAL_IMAGE_BELOW && ["image/png", "image/jpeg", "image/webp"].includes(type)
    if (scale === 1 && small) {
      bitmap.close()
      return blob
    }
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      bitmap.close()
      return blob
    }
    ctx.fillStyle = "#ffffff" // flatten transparency for JPEG
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85))
    return out && (scale < 1 || out.size < blob.size) ? out : blob
  } catch {
    return blob // e.g. HEIC the browser can't decode: send as-is
  }
}

/* ───────────────────────── voice recordings ───────────────────────── */

function pcm16ToWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i))
  }
  writeString(0, "RIFF")
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true) // PCM chunk size
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, "data")
  view.setUint32(40, samples.length * 2, true)
  let offset = 44
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return new Blob([buffer], { type: "audio/wav" })
}

async function encodeWav(blob: Blob): Promise<Blob> {
  const AudioCtx: typeof AudioContext =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioCtx()
  try {
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer())
    const targetRate = 16000 // plenty for speech, keeps 60 s under 2 MB
    const offline = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * targetRate)), targetRate)
    const source = offline.createBufferSource()
    source.buffer = decoded
    source.connect(offline.destination)
    source.start()
    const rendered = await offline.startRendering()
    return pcm16ToWav(rendered.getChannelData(0), targetRate)
  } finally {
    void ctx.close()
  }
}

/**
 * MediaRecorder output (webm/mp4/ogg depending on the browser) -> 16 kHz mono WAV,
 * which the model reads everywhere. Falls back to the raw recording if decoding fails.
 */
export async function blobToWavFile(blob: Blob, baseName: string): Promise<File> {
  try {
    const wav = await encodeWav(blob)
    return new File([wav], `${baseName}.wav`, { type: "audio/wav" })
  } catch {
    const type = normalizeMime(blob.type) || "audio/webm"
    const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm"
    return new File([blob], `${baseName}.${ext}`, { type })
  }
}

/* ───────────────────── prompt bar -> model parts ───────────────────── */

function formatTextFile(name: string, content: string): string {
  const language = EXTENSION_LANGUAGE[extensionOf(name)] ?? ""
  const fence = content.includes("```") ? "````" : "```"
  return `**Attached file: ${name}**\n${fence}${language}\n${content.replace(/\s+$/, "")}\n${fence}`
}

export interface PreparedAttachments {
  /** Binary attachments (images, PDF, audio) as data-URL file parts. */
  fileParts: FileUIPart[]
  /** Text/code files, already formatted as fenced blocks to append to the prompt. */
  inlineText: string
}

/** Throws AttachmentError with a user-facing message when something can't be sent. */
export async function prepareAttachments(files: FileUIPart[]): Promise<PreparedAttachments> {
  if (files.length > MAX_FILES) {
    throw new AttachmentError(`You can attach up to ${MAX_FILES} files per message.`)
  }

  const fileParts: FileUIPart[] = []
  const textBlocks: string[] = []
  let totalBytes = 0

  for (const file of files) {
    const name = file.filename || "attachment"
    const kind = classifyAttachment(file)
    if (kind === "unsupported") {
      throw new AttachmentError(`"${name}" isn't a supported file type. Use images, PDF, audio, or text/code files.`)
    }

    const blob = await fetchBlob(file.url, name)

    if (kind === "text") {
      if (blob.size > MAX_TEXT_FILE_BYTES) {
        throw new AttachmentError(`"${name}" is too large to read as text (max ${formatBytes(MAX_TEXT_FILE_BYTES)}).`)
      }
      textBlocks.push(formatTextFile(name, await blob.text()))
      totalBytes += blob.size
      continue
    }

    const processed = kind === "image" ? await compressImage(blob) : blob
    const fallbackType = kind === "image" ? "image/jpeg" : kind === "audio" ? "audio/wav" : "application/pdf"
    const mediaType = normalizeMime(processed.type || file.mediaType) || fallbackType
    const filename = kind === "image" && mediaType === "image/jpeg" ? withExtension(name, "jpg") : name

    totalBytes += processed.size
    fileParts.push({
      type: "file",
      mediaType,
      filename,
      url: await blobToDataUrl(new Blob([processed], { type: mediaType })),
    })
  }

  if (totalBytes > MAX_TOTAL_BYTES) {
    throw new AttachmentError(
      `Attachments are too large (${formatBytes(totalBytes)}). Keep the total under ${formatBytes(MAX_TOTAL_BYTES)}.`,
    )
  }
  return { fileParts, inlineText: textBlocks.join("\n\n") }
}

/**
 * Only the most recent message that carries files keeps them; older ones become a
 * short text note. Otherwise every follow-up would re-upload every earlier file
 * and the chat would hit the request-size limit after a few turns.
 */
export function trimOldAttachments(messages: UIMessage[]): UIMessage[] {
  let latest = -1
  messages.forEach((m, i) => {
    if (m.parts?.some((p) => p.type === "file")) latest = i
  })
  return messages.map((m, i) => {
    if (i === latest || !m.parts?.some((p) => p.type === "file")) return m
    return {
      ...m,
      parts: m.parts.map((p) =>
        p.type === "file" ? { type: "text" as const, text: `[Attached earlier: ${p.filename || p.mediaType}]` } : p,
      ) as UIMessage["parts"],
    }
  })
}