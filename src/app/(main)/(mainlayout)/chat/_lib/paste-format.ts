/**
 * Auto-fences code inside pasted text so that prose and code render as separate
 * blocks in the chat bubble (and reach the model with a clear structure).
 *
 * Heuristic on purpose and conservative: plain prose comes back untouched, and
 * anything that already contains a ``` fence is left alone.
 */

type LineKind = "code" | "prose" | "blank"
type Segment = { kind: "code" | "prose"; lines: string[] }

/** Lines that are almost certainly code / log output on their own. */
const STRONG_PATTERNS: RegExp[] = [
  /^\s*import\s+(?:type\s+)?(?:[\w*${}\s,]+\s+from\s+)?["'][^"']+["']\s*;?\s*$/, // import x from "y"
  /^\s*import\s+[\w.]+(?:\s+as\s+\w+)?(?:\s*,\s*[\w.]+(?:\s+as\s+\w+)?)*\s*;?\s*$/, // import os / import numpy as np
  /^\s*from\s+[\w.]+\s+import\s+\S+/, // from x import y
  /^\s*(?:export\s+(?:default\s+)?)?(?:async\s+)?function\b\s*\*?\s*[\w$]*\s*\(/, // function foo(
  /^\s*(?:export\s+(?:default\s+)?)?(?:abstract\s+)?class\s+\w+/, // class Foo
  /^\s*(?:export\s+)?(?:interface|enum)\s+\w+/,
  /^\s*(?:export\s+)?type\s+\w+\s*(?:<.*>)?\s*=/,
  /^\s*(?:export\s+)?(?:const|let|var)\s+(?:[\w$]+|[[{][^=]*)(?:\s*:\s*[^=]+)?\s*=/, // const x = / const {a} =
  /^\s*export\s*\{/,
  /^\s*(?:async\s+)?def\s+\w+\s*\(.*\)\s*(?:->\s*[^:]+)?:\s*$/, // def foo(x):
  /^\s*(?:elif\b.*|else|try|finally)\s*:\s*$/,
  /^\s*except\b.*:\s*$/,
  /^\s*(?:if|while|for|switch)\s*\(.*\)\s*\{?\s*$/, // if (x) {
  /^\s*(?:if|elif|while|for|with)\s+.+:\s*$/, // if x:
  /^\s*(?:public|private|protected|internal|static|final|abstract|override)\b.*[({;]\s*$/,
  /^\s*(?:package|namespace)\s+[\w.]+\s*[;{]?\s*$/,
  /^\s*using\s+[\w.]+\s*;\s*$/,
  /^\s*#(?:include|define|ifdef|ifndef|endif|pragma)\b/,
  /^\s*#!\//,
  /^\s*(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+(?:TABLE|INDEX|VIEW|DATABASE)|ALTER\s+TABLE|DROP\s+TABLE)\b/,
  /^\s*<\/?[A-Za-z][\w:-]*(?:\s[^<>]*)?\/?>/, // html / jsx tag at line start
  /^\s*<!DOCTYPE\b/i,
  /^\s*@\w+(?:\([^)]*\))?\s*$/, // decorators
  /^\s*\$\s+\S+/, // "$ npm install"
  /^\s*(?:sudo\s+)?(?:npm|npx|yarn|pnpm|pip3?|git|docker(?:-compose)?|kubectl|curl|wget|chmod|mkdir|python3?)\s+\S+/,
  /^\s*(?:return|throw|await|yield|raise)\b.*[;)\]}]\s*$/,
  /^\s*(?:console|System\.out|print|println|printf)\b[.\w]*\s*\(/,
  /^\s*at\s+.+:\d+(?::\d+)?\)?\s*$/, // stack frame: at foo (file.js:1:2)
  /^\s*File\s+".+",\s+line\s+\d+/, // python traceback frame
  /^\s*Traceback \(most recent call last\):/,
  /^\s*(?:[A-Za-z_.]+(?:Error|Exception)|Error|Uncaught\s.+):\s\S/, // TypeError: ... / Error: ...
]

const GLUE_LINE = /^\s*[{}()[\];,]+\s*$/ // lone braces / brackets inside a block
const INDENTED = /^(?:\s{2,}|\t)\S/

function scoreLine(line: string): number {
  const trimmed = line.trim()
  if (!trimmed) return 0
  if (GLUE_LINE.test(line)) return 3

  let score = 0
  const strong = STRONG_PATTERNS.some((re) => re.test(line))
  if (strong) score += 3
  if (INDENTED.test(line)) score += 1
  if (/[{};]\s*$/.test(trimmed)) score += 2
  if (/(?:=>|={2,3}|!==?|&&|\|\||::)/.test(trimmed)) score += 2
  if (/^\s*(?:\/\/|\/\*|\*\/)/.test(line)) score += 2
  if (/^\s*[A-Za-z_$][\w$.[\]'"]*\s*(?:[-+*/%|&^]?=)\s*\S/.test(line)) score += 1
  if (/[A-Za-z_$][\w$.]*\([^)]*\)\s*;?\s*$/.test(trimmed)) score += 1

  const symbols = (trimmed.match(/[{}()[\];=<>$|&*]/g) ?? []).length
  if (trimmed.length > 3 && symbols / trimmed.length > 0.12) score += 1

  // Ordinary sentences / list items: many words, no code punctuation.
  const words = trimmed.split(/\s+/).length
  if (!strong && words >= 6 && symbols === 0 && /^[\w“"'(*\-\d]/.test(trimmed)) score -= 3

  return score
}

function classify(lines: string[]): LineKind[] {
  const kinds: LineKind[] = lines.map((line) => {
    if (!line.trim()) return "blank"
    return scoreLine(line) >= 3 ? "code" : "prose"
  })

  // Indented lines that directly continue a code line (python bodies, wrapped args).
  let previous: LineKind = "blank"
  for (let i = 0; i < kinds.length; i++) {
    if (kinds[i] === "prose" && previous === "code" && INDENTED.test(lines[i])) kinds[i] = "code"
    if (kinds[i] !== "blank") previous = kinds[i]
  }

  // A blank line between two code lines belongs to the code block.
  for (let i = 0; i < kinds.length; i++) {
    if (kinds[i] !== "blank") continue
    let prev = i - 1
    while (prev >= 0 && kinds[prev] === "blank") prev--
    let next = i + 1
    while (next < kinds.length && kinds[next] === "blank") next++
    if (prev >= 0 && next < kinds.length && kinds[prev] === "code" && kinds[next] === "code") {
      kinds[i] = "code"
    }
  }
  return kinds
}

function detectLanguage(code: string): string {
  const t = code.trim()

  if (/^[[{]/.test(t)) {
    try {
      JSON.parse(t)
      return "json"
    } catch {
      /* not JSON */
    }
  }
  if (/^\s*(?:Traceback \(most recent|File ".+", line|at\s+.+:\d+)/m.test(t)) return "text"
  if (/^\s*(?:SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/m.test(t)) return "sql"
  if (/^\s*(?:\$\s|sudo\s|npm\s|npx\s|yarn\s|pnpm\s|pip3?\s|git\s|docker|kubectl\s|curl\s|wget\s|chmod\s|mkdir\s)/m.test(t)) return "bash"

  const python =
    /^\s*def\s+\w+\s*\(/m.test(t) ||
    /^\s*elif\b/m.test(t) ||
    /^\s*print\(/m.test(t) ||
    /\bself\./.test(t) ||
    /^\s*from\s+[\w.]+\s+import\s/m.test(t) ||
    /^\s*if\s+__name__\s*==/m.test(t) ||
    (/^\s*import\s+[\w.]+(?:\s+as\s+\w+)?\s*$/m.test(t) && !/[;{}]/.test(t))
  if (python) return "python"

  if (/\bpublic\s+(?:static\s+)?(?:class|void)\b|System\.out\./.test(t)) return "java"
  if (/\busing\s+System\b|Console\.WriteLine/.test(t)) return "csharp"
  if (/^\s*package\s+main\b|\bfunc\s+\w+\s*\(|\bfmt\./m.test(t)) return "go"
  if (/\bfn\s+\w+\s*\(|\blet\s+mut\b|println!/.test(t)) return "rust"
  if (/#include\s*[<"]/.test(t)) return "cpp"

  const jsLike = /\b(?:const|let|var)\b|=>|\bfunction\b|console\.|require\(|module\.exports|^\s*(?:import|export)\s/m.test(t)
  const jsx = /<\/?[A-Za-z][\w.]*[^>]*>/.test(t) && /className=|return\s*\(|=>/.test(t)
  const typed =
    /:\s*(?:string|number|boolean|any|void|unknown|never)\b|\binterface\s+\w+|\btype\s+\w+\s*=|\bas\s+\w+|<[A-Z]\w*>/.test(t)
  if (jsLike || jsx) {
    if (jsx) return "tsx"
    return typed ? "typescript" : "javascript"
  }

  if (/^\s*<(?:!DOCTYPE|html|head|body|div|span|section|main|ul|ol|li|table|form|a|p|script|style)\b/im.test(t)) return "html"
  if (/[^{}]+\{[^{}]*:[^{}]*;?[^{}]*\}/.test(t)) return "css"
  return ""
}

function fence(lines: string[]): string {
  const code = lines.join("\n").replace(/\s+$/, "")
  return "```" + detectLanguage(code) + "\n" + code + "\n```"
}

/** Returns `input` unchanged unless it contains recognisable code mixed in with the text. */
export function autoFenceCode(input: string): string {
  const text = input.replace(/\r\n?/g, "\n")
  if (!text.includes("\n")) return input // single line: never touch (could be pasted mid-sentence)
  if (text.includes("```")) return input // already markdown

  const trimmed = text.trim()
  if (/^[[{]/.test(trimmed)) {
    try {
      JSON.parse(trimmed)
      return "```json\n" + trimmed + "\n```"
    } catch {
      /* not JSON, fall through */
    }
  }

  const lines = text.split("\n")
  const kinds = classify(lines)
  if (!kinds.includes("code")) return input

  // Group consecutive lines of the same kind (blank lines inside code already count as code).
  const segments: Segment[] = []
  lines.forEach((line, i) => {
    const kind: "code" | "prose" = kinds[i] === "code" ? "code" : "prose"
    const last = segments[segments.length - 1]
    if (last && last.kind === kind) last.lines.push(line)
    else segments.push({ kind, lines: [line] })
  })

  // A lone code-looking line inside prose is probably not a block: demote it.
  for (const seg of segments) {
    if (seg.kind !== "code") continue
    const meaningful = seg.lines.filter((l) => l.trim())
    const strong = meaningful.length === 1 && scoreLine(meaningful[0]) >= 5
    if (meaningful.length < 2 && !strong) seg.kind = "prose"
  }

  // Merge neighbours that ended up with the same kind after demotion.
  const merged: Segment[] = []
  for (const seg of segments) {
    const last = merged[merged.length - 1]
    if (last && last.kind === seg.kind) last.lines.push(...seg.lines)
    else merged.push({ kind: seg.kind, lines: [...seg.lines] })
  }
  if (!merged.some((s) => s.kind === "code")) return input

  const parts = merged
    .map((seg) => {
      if (seg.kind === "code") {
        // keep surrounding blank lines outside the fence
        const body = [...seg.lines]
        while (body.length && !body[0].trim()) body.shift()
        while (body.length && !body[body.length - 1].trim()) body.pop()
        return fence(body)
      }
      return seg.lines.join("\n").trim()
    })
    .filter(Boolean)

  return parts.join("\n\n")
}