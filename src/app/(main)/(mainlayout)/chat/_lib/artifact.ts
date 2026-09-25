import type { ArtifactFile } from "./types"

export const EXT_MAP: Record<string, string> = {
  typescript: "ts", ts: "ts", tsx: "tsx",
  javascript: "js", js: "js", jsx: "jsx",
  python: "py", py: "py",
  bash: "sh", sh: "sh", shell: "sh",
  json: "json", yaml: "yaml", yml: "yaml",
  html: "html", css: "css", scss: "scss",
  sql: "sql", go: "go", rust: "rs",
  java: "java", c: "c", cpp: "cpp", "c++": "cpp",
  markdown: "md", md: "md",
}

function parseFenceInfo(info: string): { language: string; filename?: string } {
  const t = info.trim()
  if (!t) return { language: "text" }
  const colonMatch = t.match(/^([\w-]+):(.+)$/)
  if (colonMatch) return { language: colonMatch[1].toLowerCase(), filename: colonMatch[2].trim() }
  const titleMatch = t.match(/^([\w-]+)\s+title=["']?([^"'\s]+)["']?/)
  if (titleMatch) return { language: titleMatch[1].toLowerCase(), filename: titleMatch[2] }
  const langMatch = t.match(/^([\w-]+)/)
  return { language: (langMatch?.[1] || "text").toLowerCase() }
}

export function extractCodeBlocks(
  content: string,
): Array<{ language: string; filename?: string; code: string }> {
  const out: Array<{ language: string; filename?: string; code: string }> = []
  const re = /```([^\n`]*)\n([\s\S]*?)```/g
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    const { language, filename } = parseFenceInfo(m[1] ?? "")
    out.push({ language, filename, code: m[2].trim() })
  }
  return out
}

export function filesFromMessage(messageKey: string, content: string): ArtifactFile[] {
  return extractCodeBlocks(content).map((b, idx) => ({
    id: `${messageKey}-file-${idx}`,
    filename: b.filename ?? `file-${idx + 1}.${EXT_MAP[b.language] ?? "txt"}`,
    language: b.language,
    code: b.code,
    messageKey,
  }))
}