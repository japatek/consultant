"use client"

import { memo, useRef, useState } from "react"
import { AudioLinesIcon, FileCodeIcon, FileIcon, FileTextIcon, PauseIcon, PlayIcon, XIcon } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { usePromptInputAttachments } from "../../../../../components/ai/prompt-input"
import { classifyAttachment, extensionOf, type AttachmentKind } from "../_lib/attachments"

type TrayFile = ReturnType<typeof usePromptInputAttachments>["files"][number]

function RemoveButton({ onClick, name }: { onClick: () => void; name: string }) {
  return (
    <button
      type="button" // the prompt bar is a <form>: never submit it
      onClick={onClick}
      aria-label={`Remove ${name}`}
      className="absolute -right-2 -top-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <XIcon className="size-3.5" />
    </button>
  )
}

function kindLabel(kind: AttachmentKind, name: string): string {
  const ext = extensionOf(name).toUpperCase()
  if (kind === "pdf") return "PDF document"
  if (kind === "audio") return "Audio"
  if (kind === "image") return ext ? `${ext} image` : "Image"
  return ext ? `${ext} file` : "Text file"
}

function KindIcon({ kind, className }: { kind: AttachmentKind; className?: string }) {
  if (kind === "audio") return <AudioLinesIcon className={className} />
  if (kind === "pdf") return <FileTextIcon className={className} />
  if (kind === "text") return <FileCodeIcon className={className} />
  return <FileIcon className={className} />
}

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function ImageTile({ file, onRemove, onBroken }: { file: TrayFile; onRemove: () => void; onBroken: () => void }) {
  const name = file.filename || "image"
  return (
    <div className="group relative shrink-0">
      <div className="size-20 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm sm:size-24">
        <img src={file.url} alt={name} onError={onBroken} className="size-full object-cover" draggable={false} />
      </div>
      <RemoveButton onClick={onRemove} name={name} />
    </div>
  )
}

function FileTile({ file, kind, onRemove }: { file: TrayFile; kind: AttachmentKind; onRemove: () => void }) {
  const name = file.filename || "attachment"
  const unsupported = kind === "unsupported"
  return (
    <div className="group relative shrink-0">
      <div
        className={cn(
          "flex h-20 w-60 items-center gap-3 rounded-xl border bg-muted/40 px-3 shadow-sm sm:h-24",
          unsupported ? "border-destructive/60 bg-destructive/5" : "border-border/60",
        )}
      >
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg",
            unsupported ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
          )}
        >
          <KindIcon kind={kind} className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground" title={name}>
            {name}
          </p>
          <p className={cn("text-xs", unsupported ? "text-destructive" : "text-muted-foreground")}>
            {unsupported ? "Unsupported file type" : kindLabel(kind, name)}
          </p>
        </div>
      </div>
      <RemoveButton onClick={onRemove} name={name} />
    </div>
  )
}

function AudioTile({ file, onRemove }: { file: TrayFile; onRemove: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const isVoice = /^voice-message/i.test(file.filename ?? "")
  const name = isVoice ? "Voice message" : file.filename || "Audio"

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  return (
    <div className="group relative shrink-0">
      <div className="flex h-20 w-60 items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-3 shadow-sm sm:h-24">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5 translate-x-px" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground" title={name}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground">
            {duration && Number.isFinite(duration) ? formatClock(duration) : "Audio"}
          </p>
        </div>
        <audio
          ref={audioRef}
          src={file.url}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      </div>
      <RemoveButton onClick={onRemove} name={name} />
    </div>
  )
}

function TrayItem({ file, onRemove }: { file: TrayFile; onRemove: () => void }) {
  const kind = classifyAttachment(file)
  const [imageBroken, setImageBroken] = useState(false) // e.g. HEIC in a browser that can't draw it

  if (kind === "image" && !imageBroken) {
    return <ImageTile file={file} onRemove={onRemove} onBroken={() => setImageBroken(true)} />
  }
  if (kind === "audio") return <AudioTile file={file} onRemove={onRemove} />
  return <FileTile file={file} kind={kind === "image" ? "image" : kind} onRemove={onRemove} />
}

function AttachmentTrayImpl() {
  const { files, remove } = usePromptInputAttachments()
  if (files.length === 0) return null

  return (
    <div
      role="list"
      aria-label="Attached files"
      className="flex w-full gap-3 overflow-x-auto pb-1 pl-1 pr-3 pt-3"
    >
      {files.map((file) => (
        <div role="listitem" key={file.id} className="shrink-0">
          <TrayItem file={file} onRemove={() => remove(file.id)} />
        </div>
      ))}
    </div>
  )
}

export const AttachmentTray = memo(AttachmentTrayImpl)