"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation" // Ditambahkan untuk routing
import { Toaster } from "sonner"
import { Sparkles } from "lucide-react" // Icon untuk layar Welcome
import { ResizablePanel, ResizablePanelGroup } from "../../../../../components/ui/resizable"
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

// PROPS DIPERBARUI: Menambahkan dukungan untuk null session dan terjemahan
interface ChatShellProps {
  initialSessions: ChatSession[]
  initialModel: string
  initialActiveSessionId: string | null 
  initialArtifactOpen: boolean
  lang?: string
  welcomeTitle?: string
  welcomeDesc?: string
}

export function ChatShell(props: ChatShellProps) {
  return (
    <PanelProvider initialArtifactOpen={props.initialArtifactOpen}>
      <ChatShellInner {...props} />
    </PanelProvider>
  )
}

function ChatShellInner({ 
  initialSessions, 
  initialModel, 
  initialActiveSessionId,
  welcomeTitle = "Welcome",
  welcomeDesc = "Start a new conversation"
}: ChatShellProps) {
  const router = useRouter()
  const { isArtifactOpen, isCodePanelOpen, setArtifactFiles, setCodePanelTab, openCodePanel } = usePanelContext()

  // STATE DIPERBARUI: Jika tidak ada session (New Chat), kosongkan daftar pesan
  const [messages, setMessages] = useState<MessageType[]>(
    initialActiveSessionId ? initialMessages : []
  )
  
  const [status, setStatus] = useState<ChatStatus>("ready")
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(initialActiveSessionId)
  const [model, setModel] = useState(initialModel)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const lastCodeMessageKeyRef = useRef<string | null>(null)

  // Two-pass guard for artifacts
  useEffect(() => {
    if (messages.length === 0) return // Skip jika pesan kosong

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

  // FUNGSI DIPERBARUI: Menangani logika jika itu adalah pesan pertama (New Chat)
  const addUserMessage = useCallback(async (content: string) => {
    const userMsg: MessageType = {
      key: `user-${Date.now()}`,
      from: "user",
      versions: [{ id: `u-${Date.now()}`, content }],
    }
    
    setMessages((prev) => [...prev, userMsg])
    setStatus("submitted")

    // LOGIKA DATABASE & ROUTING UNTUK NEW CHAT
    if (!activeSessionId) {
      // 1. Panggil server action Anda di sini untuk membuat chat di database
      // const newSessionId = await createNewChatSession(content)
      
      // 2. Set active session di state
      // setActiveSessionId(newSessionId)

      // 3. Ubah URL ke /chat/[id] secara diam-diam (tanpa hard reload)
      // router.push(`/chat/${newSessionId}`)
      
      console.log("New chat initiated! (Replace this block with DB call & router.push)")
    }

    // Mock response dari AI (Ganti ini dengan stream/fetch ke API AI yang sebenarnya)
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
  }, [activeSessionId, router])

  const handleNewSession = useCallback((session: ChatSession) => {
    setSessions((prev) => [session, ...prev])
    setActiveSessionId(session.id)
  }, [])

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id)
    // Jangan lupa setMessages dengan riwayat chat dari ID tersebut jika memuat dari sidebar
  }, [])

  const handleModelChange = useCallback((id: string) => setModel(id), [])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full select-none relative overflow-hidden bg-background">
      <Toaster />

      <SidebarDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        sessions={sessions}
        activeSessionId={activeSessionId || ""}
        onSessionCreated={handleNewSession}
        onSessionSelected={handleSelectSession}
      />

      <div
        className="flex flex-1 flex-col bg-background min-w-0 h-[calc(100vh-3.5rem)] relative overflow-hidden transition-all duration-500"
        style={{ marginRight: isArtifactOpen ? "600px" : "0px" }}
      >
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={isCodePanelOpen && !isArtifactOpen ? 52 : 100} minSize={30} className="relative h-full flex flex-col">
            <ChatHeader onMenuClick={() => setIsDrawerOpen(true)} />
            
            {/* LAYAR WELCOME: Muncul jika tidak ada pesan */}
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                <div className="bg-primary/10 p-4 rounded-full mb-6 border border-primary/20 shadow-sm shadow-primary/10">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground tracking-tight mb-3">
                  {welcomeTitle}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-md leading-relaxed">
                  {welcomeDesc}
                </p>
              </div>
            ) : (
              <MessageList messages={messages} />
            )}

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