"use client"

import { memo, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../../../components/ui/collapsible"
import { MessageContent, MessageResponse } from "../../../../../components/ai/message"

function UserMessageBubble({ content }: { content: string }) {
  const [open, setOpen] = useState(false)

  return (
    <MessageContent>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="relative">
          <CollapsibleContent
            forceMount
            className={cn("transition-all duration-300 ease-in-out", !open && "max-h-[6rem] overflow-hidden")}
          >
            <MessageResponse>{content}</MessageResponse>
          </CollapsibleContent>
          {!open && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
          )}
        </div>

        <CollapsibleTrigger asChild>
          <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            {open ? (<><ChevronUpIcon className="size-3" /> Show less</>) : (<><ChevronDownIcon className="size-3" /> Show more</>)}
          </button>
        </CollapsibleTrigger>
      </Collapsible>
    </MessageContent>
  )
}

export const CollapsibleUserMessage = memo(UserMessageBubble)