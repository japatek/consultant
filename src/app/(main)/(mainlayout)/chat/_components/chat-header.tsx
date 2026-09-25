"use client"

import { memo } from "react"
import { PanelLeftIcon, Folder } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { usePanelContext } from "./chat-context"
import { saveChatPreferences } from "../_lib/actions"

interface ChatHeaderProps {
  onMenuClick: () => void
}

function ChatHeaderImpl({ onMenuClick }: ChatHeaderProps) {
  const { isArtifactOpen, openArtifact, closeArtifact } = usePanelContext()

  const toggleArtifact = () => {
    const next = !isArtifactOpen
    if (next) openArtifact()
    else closeArtifact()
    void saveChatPreferences({ isArtifactOpen: next })
  }

  return (
    <header className="absolute top-0 w-full flex shrink-0 items-center justify-between z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          <PanelLeftIcon className="size-5 cursor-pointer" />
        </button>
        <span className="text-sm font-semibold tracking-tight">Chat Session</span>
      </div>

      <button
        onClick={toggleArtifact}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border cursor-pointer",
          isArtifactOpen
            ? "bg-secondary hover:bg-accent text-secondary-foreground border-transparent shadow-sm"
            : "bg-background hover:bg-accent text-muted-foreground border-border",
        )}
      >
        <Folder className="size-4" />
        {isArtifactOpen ? "Close Folder" : "Open Folder"}
      </button>
    </header>
  )
}

export const ChatHeader = memo(ChatHeaderImpl)