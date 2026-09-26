"use client"

import { memo, useMemo } from "react"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai/conversation"
import { MessageBranch, MessageBranchContent } from "@/components/ai/message"
import { MessageItem } from "./messages-item"
import { usePanelContext } from "./chat-context"
import type { MessageType } from "../_lib/types"

interface MessageListProps {
  messages: MessageType[]
}

function MessageListImpl({ messages }: MessageListProps) {
  const { artifactFiles } = usePanelContext()

  const filesByMessage = useMemo(() => {
    const map = new Map<string, typeof artifactFiles>()
    for (const file of artifactFiles) {
      const bucket = map.get(file.messageKey) ?? []
      bucket.push(file)
      map.set(file.messageKey, bucket)
    }
    return map
  }, [artifactFiles])

  return (
    // FIX 1: Hapus pt-14 dan pb-[140px] agar tinggi tidak melebihi panel (mengatasi double scroll)
    // Pastikan menggunakan overflow-hidden agar scrollbar hanya muncul dari komponen Conversation
    <div className="flex-1 relative w-full h-full overflow-hidden">
      
      <Conversation className="absolute inset-0 size-full overflow-y-auto overflow-x-hidden">
        
        {/* FIX 2: Pindahkan padding ke dalam container isi pesan */}
        {/* pt-20 menghindari tertimpa Header, pb-48 menghindari tertimpa PromptInputBar */}
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 pt-20 pb-48">
          
          {messages.map((message) => (
            <MessageBranch defaultBranch={0} key={message.key}>
              <MessageBranchContent>
                {message.versions.map((version) => (
                  <MessageItem
                    key={`${message.key}-${version.id}`}
                    message={message}
                    version={version}
                    files={filesByMessage.get(message.key) ?? []}
                  />
                ))}
              </MessageBranchContent>
            </MessageBranch>
          ))}

        </ConversationContent>

        {/* FIX 3: Naikkan posisi tombol Scroll To Bottom agar tidak tertutup input bar */}
        <ConversationScrollButton className="bottom-44" />
      </Conversation>
      
    </div>
  )
}

export const MessageList = memo(MessageListImpl)