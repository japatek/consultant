"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"
import { Sparkles } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import { ResizablePanel, ResizablePanelGroup } from "../../../../../components/ui/resizable"
import { filesFromMessage } from "../_lib/artifact"
import { models } from "../_lib/constants"
import type { ChatSession, ChatStatus, MessageType } from "../_lib/types"
import { PanelProvider, usePanelContext } from "./chat-context"
import { SidebarDrawer } from "./sidebar-chatlist"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./messages-list"
import { PromptInputBar } from "./prompt-input"
import { ArtifactPanel } from "./artifact"
import { createChatSession } from "../_lib/actions"

const CodePanel = dynamic(() => import("./code-block").then((m) => m.CodePanel), { ssr: false })

interface ChatShellProps {
  initialSessions: ChatSession[]
  initialModel: string
  initialActiveSessionId: string | null
  initialArtifactOpen: boolean
  initialMessages?: any[]
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
  initialMessages = [],
  welcomeTitle = "Welcome",
  welcomeDesc = "Start a new conversation",
  lang = "en",
}: ChatShellProps) {
  const router = useRouter()
  const { isArtifactOpen, isCodePanelOpen, setArtifactFiles, setCodePanelTab, openCodePanel } = usePanelContext()

  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions || [])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(initialActiveSessionId)
  const [model, setModel] = useState(initialModel)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const lastCodeMessageKeyRef = useRef<string | null>(null)

  const activeSessionRef = useRef(activeSessionId)
  activeSessionRef.current = activeSessionId

  const modelRef = useRef(model)
  modelRef.current = model

  const chat = useChat({
    id: activeSessionId || "new-chat",
    messages: initialMessages || [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          id: activeSessionRef.current,
          modelId: modelRef.current,
        },
      }),
    }),
    onError: (err: Error) => {
      toast.error(`AI Connection Failed: ${err.message}`)
    },
  })

  // Destrukturisasi properti tambahan dari useChat untuk edit & reload
  const { messages: aiMessages, sendMessage, status, stop } = chat
  
  const isLoading = status === "streaming" || status === "submitted"
  const chatStatus: ChatStatus = isLoading ? "streaming" : "ready"

  const mappedMessages: MessageType[] = aiMessages.map((m: any) => {
    const textContent = m.content || (m.parts ? m.parts.map((p: any) => p.text).join("") : "")
    
    const reasoningText = m.reasoning || 
      (m.parts?.find((p: any) => p.type === "reasoning")?.reasoning) || 
      undefined;

    const toolCalls = m.toolInvocations?.map((t: any) => ({
      id: t.toolCallId,
      name: t.toolName,
      input: t.args,
      result: t.result,
    })) || [];

    return {
      key: m.id || Math.random().toString(),
      from: m.role === "user" ? "user" : "assistant",
      versions: [{ id: m.id || Math.random().toString(), content: textContent }],
      reasoning: reasoningText,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    }
  })

  useEffect(() => {
    if (mappedMessages.length === 0) return

    const last = mappedMessages[mappedMessages.length - 1]
    if (!last || last.from !== "assistant") return

    if (lastCodeMessageKeyRef.current === null) {
      const allFiles = mappedMessages
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
  }, [mappedMessages, setArtifactFiles, setCodePanelTab, openCodePanel])

  const addUserMessage = useCallback(
    async (content: string) => {
      let currentSessionId = activeSessionId

      if (!currentSessionId) {
        try {
          const title = content.length > 30 ? content.slice(0, 30) + "..." : content
          const newSession = await createChatSession(title)

          currentSessionId = newSession.id
          setActiveSessionId(currentSessionId)
          activeSessionRef.current = currentSessionId

          setSessions((prev) => [newSession, ...(prev || [])])
          window.history.replaceState(null, "", `/chat/${currentSessionId}`)
        } catch (error) {
          toast.error("Failed Create Session in Database")
          return
        }
      }

      try {
        sendMessage({ text: content })
      } catch (err: any) {
        toast.error("Failed Send Messages: " + err.message)
      }
    },
    [activeSessionId, sendMessage],
  )

  // ── LOGIKA EDIT DAN RELOAD ──
const handleReload = useCallback(() => {
    // Gunakan 'as any' untuk mem-bypass error typing jika SDK menyembunyikan fungsi reload
    if ('reload' in chat) {
      (chat as any).reload();
    }
  }, [chat]);

  const handleEdit = useCallback((messageId: string, newContent: string) => {
    const index = chat.messages.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      // Tambahkan properti 'parts' agar lolos validasi tipe Vercel AI SDK v6
      const updatedMessages = [
        ...chat.messages.slice(0, index),
        { 
          id: messageId, 
          role: "user" as const, 
          content: newContent,
          parts: [{ type: "text", text: newContent }]
        } as any // Bypass strict typing 
      ];
      chat.setMessages(updatedMessages);
      
      // Beri jeda sejenak agar state messages terbarui sebelum diproses ulang
      setTimeout(() => {
        if ('reload' in chat) {
          (chat as any).reload();
        } else if (chat.sendMessage) {
           // Fallback jika benar-benar tidak ada fungsi reload
           chat.sendMessage({ text: newContent });
        }
      }, 50); 
    }
  }, [chat]);


  const handleNewSession = useCallback(
    (session: ChatSession) => {
      setSessions((prev) => [session, ...(prev || [])])
      setActiveSessionId(session.id)
      router.push(`/chat/${session.id}`)
    },
    [router],
  )

  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id)
      router.push(`/chat/${id}`)
    },
    [router],
  )

  const handleDeleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => (prev || []).filter((s) => s.id !== id))
      if (activeSessionId === id) {
        setActiveSessionId(null)
        router.push("/chat/new")
      }
    },
    [activeSessionId, router],
  )

  const handleModelChange = useCallback((id: string) => setModel(id), [])
  
  return (
    <div className="flex h-full flex-1 w-full select-none relative overflow-hidden bg-background">
      <Toaster />

      <SidebarDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        sessions={sessions || []}
        activeSessionId={activeSessionId || ""}
        onSessionCreated={handleNewSession}
        onSessionSelected={handleSelectSession}
        onSessionDeleted={handleDeleteSession}
      />

      <div
        className="flex flex-1 flex-col bg-background min-w-0 h-full relative overflow-hidden transition-all duration-500"
        style={{ marginRight: isArtifactOpen ? "600px" : "0px" }}
      >
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={isCodePanelOpen && !isArtifactOpen ? 52 : 100} minSize={30} className="relative h-full flex flex-col overflow-hidden">
            <ChatHeader onMenuClick={() => setIsDrawerOpen(true)} />

            {mappedMessages.length === 0 ? (
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
              // ── TERUSKAN PROPS KE MESSAGE LIST ──
              <MessageList 
                messages={mappedMessages} 
                onReload={handleReload}
                onEdit={handleEdit}
              />
            )}

            <PromptInputBar
              models={models || []}
              model={model}
              onModelChange={handleModelChange}
              status={chatStatus}
              showSuggestions={mappedMessages.length === 0}
              onSubmit={addUserMessage}
              onStop={stop}
              lang={lang}
            />
          </ResizablePanel>

          {isCodePanelOpen && !isArtifactOpen && <CodePanel />}
        </ResizablePanelGroup>
      </div>

      <ArtifactPanel />
    </div>
  )
}