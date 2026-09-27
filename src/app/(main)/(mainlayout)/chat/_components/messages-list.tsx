"use client"

import { memo, useMemo } from "react"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai/conversation"
import { MessageBranch, MessageBranchContent } from "@/components/ai/message"
import { MessageItem } from "./messages-item"
import { usePanelContext } from "./chat-context"
import type { MessageType } from "../_lib/types"

// 1. Tambahkan onReload dan onEdit di Interface
interface MessageListProps {
  messages: MessageType[]
  onReload?: (id: string) => void
  onEdit?: (id: string, content: string) => void
}

// 2. Destructure onReload dan onEdit di parameter fungsi
function MessageListImpl({ messages, onReload, onEdit }: MessageListProps) {
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
    <div className="flex-1 relative w-full h-full overflow-hidden">
      <Conversation className="absolute inset-0 size-full overflow-y-auto overflow-x-hidden">
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
                    // 3. Teruskan fungsi tersebut ke dalam MessageItem
                    onReload={onReload} 
                    onEdit={onEdit}
                  />
                ))}
              </MessageBranchContent>
            </MessageBranch>
          ))}
        </ConversationContent>
        <ConversationScrollButton className="bottom-44" />
      </Conversation>
    </div>
  )
}

export const MessageList = memo(MessageListImpl)