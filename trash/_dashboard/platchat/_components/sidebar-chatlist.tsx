"use client"

import { memo, useTransition } from "react"
import { PlusIcon, MessageSquareIcon, PinIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { createChatSession, saveChatPreferences } from "../_lib/actions"
import type { ChatSession } from "../_lib/types"

interface SidebarChatList {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessions: ChatSession[]
  activeSessionId: string
  onSessionCreated: (session: ChatSession) => void
  onSessionSelected: (id: string) => void
}

function SidebarChatListImpl({
  open, onOpenChange, sessions, activeSessionId, onSessionCreated, onSessionSelected,
}: SidebarChatList) {
  const [, startTransition] = useTransition()

  const handleNewChat = () => {
    startTransition(async () => {
      const session = await createChatSession("New Chat")
      onSessionCreated(session)
      void saveChatPreferences({ activeSessionId: session.id })
    })
  }

  const handleSelect = (id: string) => {
    onSessionSelected(id)
    onOpenChange(false)
    void saveChatPreferences({ activeSessionId: id })
  }

  return (
    <Drawer direction="left" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed top-14 bottom-0 left-0 z-50 flex w-[280px] flex-col border-r border-border/50 bg-background p-0 rounded-r-xl shadow-xl">
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 pb-1 border-b border-border/40">
            <DrawerTitle className="text-sm font-semibold text-foreground px-1">Chat History</DrawerTitle>
            <DrawerDescription className="sr-only">Previous chat sessions.</DrawerDescription>
            <DrawerClose asChild>
              <button className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors">
                <XIcon className="size-4 cursor-pointer" />
              </button>
            </DrawerClose>
          </div>

          <div className="p-3 pt-4">
            <button
              onClick={handleNewChat}
              className="flex w-full items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <PlusIcon className="size-4" /> Start New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent/40",
                  activeSessionId === session.id ? "bg-accent/20 font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                <MessageSquareIcon className="size-4 shrink-0" />
                <div className="flex-1 truncate pr-6">{session.title}</div>
                {session.pinned && <PinIcon className="absolute right-9 size-3.5 opacity-60 text-primary" />}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export const SidebarDrawer = memo(SidebarChatListImpl)