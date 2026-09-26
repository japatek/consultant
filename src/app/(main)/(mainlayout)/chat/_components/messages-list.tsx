"use client"

import { memo, useMemo } from "react"
import { Conversation, ConversationContent, ConversationScrollButton } from "../../../../../components/ai/conversation"
import { MessageBranch, MessageBranchContent } from "../../../../../components/ai/message"
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
    <div className="flex-1 pt-14 pb-[140px] relative h-full">
      <Conversation className="absolute inset-0 size-full">
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 pt-8">
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
        <ConversationScrollButton className="bottom-32" />
      </Conversation>
    </div>
  )
}

export const MessageList = memo(MessageListImpl)