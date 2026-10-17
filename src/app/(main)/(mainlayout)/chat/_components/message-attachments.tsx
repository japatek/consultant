"use client"

import { memo } from "react"
import { AudioLinesIcon, FileCodeIcon, FileIcon, FileTextIcon } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { classifyAttachment, extensionOf } from "../_lib/attachments"
import type { MessageAttachment } from "../_lib/types"

function FileCard({ attachment }: { attachment: MessageAttachment }) {
  const kind = classifyAttachment({ filename: attachment.name, mediaType: attachment.mediaType })
  const Icon = kind === "pdf" ? FileTextIcon : kind === "text" ? FileCodeIcon : FileIcon
  const ext = extensionOf(attachment.name).toUpperCase()
  return (
    <div className="flex h-16 w-60 items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-3 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground" title={attachment.name}>
          {attachment.name}
        </p>
        <p className="text-xs text-muted-foreground">{kind === "pdf" ? "PDF document" : ext ? `${ext} file` : "File"}</p>
      </div>
    </div>
  )
}

function MessageAttachmentsImpl({ attachments, className }: { attachments: MessageAttachment[]; className?: string }) {
  if (attachments.length === 0) return null

  return (
    <div className={cn("flex w-full flex-wrap justify-end gap-2", className)}>
      {attachments.map((attachment) => {
        const kind = classifyAttachment({ filename: attachment.name, mediaType: attachment.mediaType })

        if (kind === "image") {
          return (
            <img
              key={attachment.id}
              src={attachment.url}
              alt={attachment.name}
              loading="lazy"
              className="max-h-72 max-w-full rounded-xl border border-border/60 object-cover shadow-sm sm:max-w-sm"
            />
          )
        }

        if (kind === "audio") {
          return (
            <div
              key={attachment.id}
              className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-2 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <AudioLinesIcon className="size-5" />
              </div>
              <audio controls preload="metadata" src={attachment.url} className="h-10 min-w-0 flex-1" />
            </div>
          )
        }

        return <FileCard key={attachment.id} attachment={attachment} />
      })}
    </div>
  )
}

export const MessageAttachments = memo(MessageAttachmentsImpl)