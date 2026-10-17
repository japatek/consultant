"use client"

import { memo, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { CheckIcon, GlobeIcon, MicIcon, SquareIcon, WrenchIcon, XIcon } from "lucide-react"
import {
  PromptInput, PromptInputHeader, PromptInputBody, PromptInputFooter,
  PromptInputTools, PromptInputButton, PromptInputTextarea,
  PromptInputActionMenu, PromptInputActionMenuTrigger,
  PromptInputActionMenuContent, PromptInputActionAddAttachments,
  usePromptInputAttachments, type PromptInputMessage, PromptInputSubmit,
} from "../../../../../components/ai/prompt-input"
import { AudioVisualizer } from "../../../../../components/ai/audio-visualizer"
import { Suggestion, Suggestions } from "../../../../../components/ai/suggestion"
import {
  ModelSelector, ModelSelectorTrigger, ModelSelectorContent,
  ModelSelectorInput, ModelSelectorList, ModelSelectorGroup,
  ModelSelectorItem, ModelSelectorLogo, ModelSelectorLogoGroup,
  ModelSelectorName, ModelSelectorEmpty,
} from "../../../../../components/ai/model-selector"
import { saveChatPreferences } from "../_lib/actions"
import { classifyAttachment, MAX_VOICE_SECONDS, prepareAttachments } from "../_lib/attachments"
import { autoFenceCode } from "../_lib/paste-format"
import { useVoiceRecorder } from "../_lib/use-voice-recorder"
import type { ChatStatus, ModelOption, UserSubmission } from "../_lib/types"
import { AttachmentTray } from "./attachment-tray"

// 1. IMPORT TRANSLATIONS
import { translations, type Language } from "../../../../../translate/language-data"

// Daftar Tool MCP Anda (Sesuaikan dengan yang ada di backend)
const MCP_TOOLS = [
  { command: "calculate_area", desc: "Hitung luas bangun datar (Persegi, Lingkaran, Segitiga)" },
  { command: "calculate_beam_load", desc: "Hitung beban balok struktural" }
]

type AttachmentsApi = ReturnType<typeof usePromptInputAttachments>

// Render-less child that lives inside <PromptInput> so the parent (recorder, paste
// handler) can reach the attachments API that is only available through context.
function AttachmentsBridge({ apiRef }: { apiRef: { current: AttachmentsApi | null } }) {
  const api = usePromptInputAttachments()
  useEffect(() => {
    apiRef.current = api
  })
  return null
}

// Send is allowed with text, with attachments only (e.g. a voice message), or both,
// but not while an unsupported file is still in the tray.
function SubmitButton({ hasText, status }: { hasText: boolean; status: ChatStatus }) {
  const { files } = usePromptInputAttachments()
  const hasUnsupported = files.some((file) => classifyAttachment(file) === "unsupported")
  const isEmpty = !hasText && files.length === 0
  return <PromptInputSubmit disabled={isEmpty || hasUnsupported} status={status} />
}

function formatClock(totalSeconds: number): string {
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`
}

interface PromptInputBarProps {
  models: ModelOption[]
  model: string
  onModelChange: (id: string) => void
  status: ChatStatus
  showSuggestions: boolean
  onSubmit: (submission: UserSubmission) => void
  onStop?: () => void
  lang?: string
}

function PromptInputBarImpl({
  models, model, onModelChange, status, showSuggestions, onSubmit, onStop, lang = "en"
}: PromptInputBarProps) {
  const [text, setText] = useState("")
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)

  // ── STATE UNTUK SLASH COMMAND ('/') ──
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashQuery, setSlashQuery] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const attachmentsRef = useRef<AttachmentsApi | null>(null)

  const selectedModelData = models.find((m) => m.id === model)

  // 2. TENTUKAN BAHASA AKTIF & AMBIL SUGGESTIONS DARI LANGUAGE DATA
  const t = translations[lang as Language] || translations.en
  const activeSuggestions = t.chatSuggestions || []

  // ── VOICE: records the microphone and attaches the clip like any other file ──
  const recorder = useVoiceRecorder({
    maxSeconds: MAX_VOICE_SECONDS,
    onRecorded: (file) => attachmentsRef.current?.add([file]),
    onError: (message) => toast.error(message),
  })

  // ── LOGIKA MENDETEKSI KETIKAN '/' ──
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)

    const words = val.split(" ")
    const lastWord = words[words.length - 1]

    if (lastWord.startsWith("/")) {
      setShowSlashMenu(true)
      setSlashQuery(lastWord.slice(1).toLowerCase())
    } else {
      setShowSlashMenu(false)
    }
  }

  // ── PASTE: screenshots become attachments, code gets fenced away from the prose ──
  // (Overrides the component's built-in paste handler, so files are handled here too.)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text/plain")

    // Copying from a spreadsheet/webpage also puts an image on the clipboard; prefer the text.
    if (!pasted) {
      const files = Array.from(e.clipboardData.files)
      if (files.length > 0) {
        e.preventDefault()
        attachmentsRef.current?.add(files)
      }
      return
    }

    const formatted = autoFenceCode(pasted)
    if (formatted === pasted) return // plain text: let the browser paste it normally

    e.preventDefault()
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const before = text.slice(0, start)
    const after = text.slice(end)
    // keep a fenced block on its own lines even when pasted mid-sentence
    const lead = formatted.startsWith("```") && before && !before.endsWith("\n") ? "\n\n" : ""
    const trail = formatted.endsWith("```") && after && !after.startsWith("\n") ? "\n\n" : ""
    const insert = lead + formatted + trail

    setText(before + insert + after)
    const caret = start + insert.length
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(caret, caret))
  }

  // ── LOGIKA SAAT TOOL DIPILIH ──
  const insertToolCommand = (toolName: string) => {
    const words = text.split(" ")
    words.pop() // Hapus sisa ketikan '/...' terakhir

    const newText = [...words, `Tolong gunakan tool /${toolName} untuk `].join(" ").trim() + " "
    setText(newText)
    setShowSlashMenu(false)

    setTimeout(() => inputRef.current?.focus(), 10)
  }

  const filteredTools = MCP_TOOLS.filter((tool) => tool.command.toLowerCase().includes(slashQuery))

  const handleSubmit = async (msg: PromptInputMessage) => {
    const typed = (msg.text ?? "").trim()
    const files = msg.files ?? []
    if (!typed && files.length === 0) return

    let prepared: Awaited<ReturnType<typeof prepareAttachments>>
    try {
      prepared = await prepareAttachments(files)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read the attached files.")
      // The form resets the textarea before this runs; put the text back.
      if (inputRef.current) inputRef.current.value = msg.text ?? ""
      // Rethrowing makes the prompt bar keep the attachments so the user can fix and resend.
      throw error
    }

    onSubmit({
      text: [typed, prepared.inlineText].filter(Boolean).join("\n\n"),
      files: prepared.fileParts,
    })
    setText("") // Reset input setelah dikirim
    setShowSlashMenu(false) // Pastikan menu tool tertutup
  }

  const handleSuggestion = (s: string) => onSubmit({ text: s, files: [] })

  const handleModelSelect = (id: string) => {
    onModelChange(id)
    setModelSelectorOpen(false)
    void saveChatPreferences({ model: id })
  }

  return (
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-4 pb-8 px-4 z-20">
      <div className="mx-auto w-full max-w-3xl relative">

        {/* 3. RENDER SUGGESTIONS BERDASARKAN BAHASA */}
        {showSuggestions && activeSuggestions.length > 0 && (
          <Suggestions className="mb-4">
            {activeSuggestions.map((s) => (
              <Suggestion key={s} suggestion={s} onClick={() => handleSuggestion(s)} />
            ))}
          </Suggestions>
        )}

        {/* ── RECORDING OVERLAY ── */}
        {recorder.isRecording && (
          <div className="absolute inset-0 z-50 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <AudioVisualizer stream={recorder.stream} isRecording onClick={() => recorder.stop(true)} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-card via-card/80 to-transparent px-4 pb-3 pt-8">
              <span className="pointer-events-auto flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                <span className="size-2 animate-pulse rounded-full bg-destructive" />
                Recording {formatClock(recorder.seconds)} / {formatClock(MAX_VOICE_SECONDS)}
              </span>
              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => recorder.stop(false)}
                  aria-label="Cancel recording"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <XIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => recorder.stop(true)}
                  aria-label="Attach recording"
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  <CheckIcon className="size-4" /> Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MENU SLASH COMMAND (FLOATING POPUP) ── */}
        {showSlashMenu && filteredTools.length > 0 && (
          <div className="absolute bottom-full mb-2 left-0 w-full max-w-sm bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 border-b border-border/50">
              Available MCP Tools
            </div>
            <ul className="max-h-48 overflow-y-auto p-1">
              {filteredTools.map((tool) => (
                <li key={tool.command}>
                  <button
                    onClick={() => insertToolCommand(tool.command)}
                    className="w-full flex flex-col text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <WrenchIcon className="size-3.5 text-primary" />
                      /{tool.command}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">{tool.desc}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <PromptInput
          globalDrop multiple onSubmit={handleSubmit}
          className="border-border/60 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all bg-card"
        >
          <PromptInputHeader>
            <AttachmentsBridge apiRef={attachmentsRef} />
            <AttachmentTray />
          </PromptInputHeader>

          <PromptInputBody>
            <PromptInputTextarea
              ref={inputRef as any} // Menyambungkan ref agar fokus bisa dikembalikan
              onChange={handleTextChange}
              onPaste={handlePaste}
              value={text}
              placeholder="Ask anything, type '/' for commands..."
              className="min-h-[40px]"
            />
          </PromptInputBody>

          <PromptInputFooter className="pt-2">
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent
                  side="top" align="start" sideOffset={10}
                  className="min-w-[200px] rounded-xl border bg-popover/95 p-1.5 shadow-xl animate-in fade-in-0 slide-in-from-bottom-2"
                >
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              <PromptInputButton
                onClick={() => void recorder.start()}
                disabled={recorder.isRecording}
                variant="ghost"
                aria-label="Record a voice message"
                className="hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                <MicIcon size={16} />
              </PromptInputButton>

              <PromptInputButton onClick={() => setUseWebSearch((v) => !v)} variant={useWebSearch ? "default" : "ghost"} className="cursor-pointer">
                <GlobeIcon size={16} />
                {useWebSearch && <span className="ml-1 text-xs font-medium">Search ON</span>}
              </PromptInputButton>

              <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="bg-muted/50 cursor-pointer">
                    {selectedModelData?.chefSlug && <ModelSelectorLogo provider={selectedModelData.chefSlug} />}
                    {selectedModelData?.name && <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorGroup heading="Models">
                      {models.map((m) => (
                        <ModelSelectorItem key={m.id} onSelect={() => handleModelSelect(m.id)} value={m.id} className="cursor-pointer">
                          <ModelSelectorLogoGroup>
                            <ModelSelectorLogo provider={m.chefSlug} />
                          </ModelSelectorLogoGroup>
                          <ModelSelectorName>{m.name}</ModelSelectorName>
                        </ModelSelectorItem>
                      ))}
                    </ModelSelectorGroup>
                  </ModelSelectorList>
                  <ModelSelectorEmpty>No models found</ModelSelectorEmpty>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>

            {status === "streaming" && onStop ? (
              <PromptInputButton onClick={onStop} className="ml-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                <SquareIcon size={14} className="fill-current" />
              </PromptInputButton>
            ) : (
              <SubmitButton hasText={!!text.trim()} status={status} />
            )}
          </PromptInputFooter>
        </PromptInput>

        <p className="text-center text-[11px] text-muted-foreground mt-3 font-medium tracking-wide">
          AI can make mistakes. Consider verifying critical information.
        </p>
      </div>
    </div>
  )
}

export const PromptInputBar = memo(PromptInputBarImpl)