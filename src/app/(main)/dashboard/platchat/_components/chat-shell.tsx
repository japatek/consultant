"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "sonner"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { filesFromMessage } from "../_lib/artifact"
import { initialMessages, models } from "../_lib/constants"
import type { ChatSession, ChatStatus, MessageType } from "../_lib/types"
import { PanelProvider, usePanelContext } from "./chat-context"
import { SidebarDrawer } from "./sidebar-chatlist"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./messages-list"
import { PromptInputBar } from "./prompt-input"
import { ArtifactPanel } from "./artifact"

// Pulls in Shiki via CodeBlock - kept out of the initial bundle, only loaded when a file exists.
const CodePanel = dynamic(() => import("./code-block").then((m) => m.CodePanel), { ssr: false })

interface ChatShellProps {
  initialSessions: ChatSession[]
  initialModel: string
  initialActiveSessionId: string
  initialArtifactOpen: boolean
}

export function ChatShell(props: ChatShellProps) {
  return (
    <PanelProvider initialArtifactOpen={props.initialArtifactOpen}>
      <ChatShellInner {...props} />
    </PanelProvider>
  )
}

function ChatShellInner({ initialSessions, initialModel, initialActiveSessionId }: ChatShellProps) {
  const { isArtifactOpen, isCodePanelOpen, setArtifactFiles, setCodePanelTab, openCodePanel } = usePanelContext()

  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [status, setStatus] = useState<ChatStatus>("ready")
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions)
  const [activeSessionId, setActiveSessionId] = useState(initialActiveSessionId)
  const [model, setModel] = useState(initialModel)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const lastCodeMessageKeyRef = useRef<string | null>(null)

  // Two-pass guard: pass 1 (ref is null) silently hydrates files from history without
  // opening any panel, so refreshing the page never auto-pops the code panel open.
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.from !== "assistant") return

    if (lastCodeMessageKeyRef.current === null) {
      const allFiles = messages
        .filter((m) => m.from === "assistant")
        .flatMap((m) => filesFromMessage(m.key, m.versions[0]?.content ?? ""))
      if (allFiles.length > 0) setArtifactFiles(allFiles)
      lastCodeMessageKeyRef.current = last.key
      return
    }

    if (lastCodeMessageKeyRef.current === last.key) return

    const newFiles = filesFromMessage(last.key, last.versions[0]?.content ?? "")
    lastCodeMessageKeyRef.current = last.key
    if (newFiles.length === 0) return

    setArtifactFiles((prev) => [...prev, ...newFiles])
    setCodePanelTab("code")
    openCodePanel(newFiles[0].id)
  }, [messages, setArtifactFiles, setCodePanelTab, openCodePanel])

  const addUserMessage = useCallback((content: string) => {
    const userMsg: MessageType = {
      key: `user-${Date.now()}`,
      from: "user",
      versions: [{ id: `u-${Date.now()}`, content }],
    }
    setMessages((prev) => [...prev, userMsg])
    setStatus("submitted")

    setTimeout(() => {
      const assistantMsg: MessageType = {
        key: `asst-${Date.now()}`,
        from: "assistant",
        reasoningSteps: [{ label: "Processing your request…", status: "complete" }],
        versions: [{ id: `a-${Date.now()}`, content: "I've analysed that for you. Let me know if you need adjustments!" }],
      }
      setMessages((prev) => [...prev, assistantMsg])
      setStatus("ready")
    }, 1200)
  }, [])

  const handleNewSession = useCallback((session: ChatSession) => {
    setSessions((prev) => [session, ...prev])
    setActiveSessionId(session.id)
  }, [])

  const handleSelectSession = useCallback((id: string) => setActiveSessionId(id), [])

  const handleModelChange = useCallback((id: string) => setModel(id), [])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full select-none relative overflow-hidden bg-background">
      <Toaster />

      <SidebarDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionCreated={handleNewSession}
        onSessionSelected={handleSelectSession}
      />

      <div
        className="flex flex-1 flex-col bg-background min-w-0 h-[calc(100vh-3.5rem)] relative overflow-hidden transition-all duration-500"
        style={{ marginRight: isArtifactOpen ? "600px" : "0px" }}
      >
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={isCodePanelOpen && !isArtifactOpen ? 52 : 100} minSize={30} className="relative h-full">
            <ChatHeader onMenuClick={() => setIsDrawerOpen(true)} />
            <MessageList messages={messages} />
            <PromptInputBar
              models={models}
              model={model}
              onModelChange={handleModelChange}
              status={status}
              showSuggestions={messages.length === 0}
              onSubmit={addUserMessage}
            />
          </ResizablePanel>

          {isCodePanelOpen && !isArtifactOpen && <CodePanel />}
        </ResizablePanelGroup>
      </div>

      <ArtifactPanel />
    </div>
  )
}