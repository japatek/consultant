"use client"

import { memo, useState, useTransition } from "react"
import { PlusIcon, MessageSquareIcon, PinIcon, XIcon, MoreVertical, Trash, Pencil, PinOff } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "../../../../../components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { createChatSession, saveChatPreferences, deleteChatSession, updateChatSession } from "../_lib/actions"
import type { ChatSession } from "../_lib/types"

interface SidebarChatList {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessions: ChatSession[]
  activeSessionId: string
  onSessionCreated: (session: ChatSession) => void
  onSessionSelected: (id: string) => void
  onSessionDeleted?: (id: string) => void
  onSessionUpdated?: (session: ChatSession) => void
}

function SidebarChatListImpl({
  open, onOpenChange, sessions, activeSessionId, onSessionCreated, onSessionSelected, onSessionDeleted, onSessionUpdated
}: SidebarChatList) {
  const [, startTransition] = useTransition()

  // State untuk Modal Shadcn
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [renameSession, setRenameSession] = useState<ChatSession | null>(null)
  const [newTitle, setNewTitle] = useState("")

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

  const handleTogglePin = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation()
    startTransition(async () => {
      const updated = await updateChatSession(session.id, { pinned: !session.pinned })
      if (onSessionUpdated) onSessionUpdated(updated)
    })
  }

  // Aksi Konfirmasi Modal
  const confirmDelete = () => {
    if (!deleteSessionId) return
    startTransition(async () => {
      await deleteChatSession(deleteSessionId)
      if (onSessionDeleted) onSessionDeleted(deleteSessionId)
      setDeleteSessionId(null)
    })
  }

  const confirmRename = () => {
    if (!renameSession || !newTitle.trim() || newTitle === renameSession.title) {
      setRenameSession(null)
      return
    }
    startTransition(async () => {
      const updated = await updateChatSession(renameSession.id, { title: newTitle })
      if (onSessionUpdated) onSessionUpdated(updated)
      setRenameSession(null)
    })
  }

  return (
    <>
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
                className="flex w-full items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                <PlusIcon className="size-4" /> Start New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent/40",
                    activeSessionId === session.id ? "bg-accent/20 font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  <div 
                    className="flex flex-1 cursor-pointer items-center gap-2 overflow-hidden"
                    onClick={() => handleSelect(session.id)}
                  >
                    <MessageSquareIcon className="size-4 shrink-0" />
                    <div className="flex-1 truncate pr-2">{session.title}</div>
                    {session.pinned && <PinIcon className="size-3.5 shrink-0 opacity-60 text-primary" />}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 flex h-6 w-6 shrink-0 items-center justify-center rounded-md hover:bg-accent transition-opacity cursor-pointer"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setRenameSession(session);
                        setNewTitle(session.title || "");
                      }}>
                        <Pencil className="mr-2 size-4" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleTogglePin(e, session)}>
                        {session.pinned ? (
                          <><PinOff className="mr-2 size-4" /> Unpin</>
                        ) : (
                          <><PinIcon className="mr-2 size-4" /> Pin</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteSessionId(session.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* MODAL HAPUS */}
      <Dialog open={!!deleteSessionId} onOpenChange={(isOpen) => !isOpen && setDeleteSessionId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSessionId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL RENAME */}
      <Dialog open={!!renameSession} onOpenChange={(isOpen) => !isOpen && setRenameSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && confirmRename()}
            placeholder="Enter new title..."
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameSession(null)}>Cancel</Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const SidebarDrawer = memo(SidebarChatListImpl)