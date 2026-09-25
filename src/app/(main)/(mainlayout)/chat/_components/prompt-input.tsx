"use client"

import { memo, useEffect, useState } from "react"
import { toast } from "sonner"
import { GlobeIcon, MicIcon, SquareIcon } from "lucide-react"
import {
  PromptInput, PromptInputHeader, PromptInputBody, PromptInputFooter,
  PromptInputTools, PromptInputButton, PromptInputTextarea,
  PromptInputActionMenu, PromptInputActionMenuTrigger,
  PromptInputActionMenuContent, PromptInputActionAddAttachments,
  usePromptInputAttachments, type PromptInputMessage, PromptInputSubmit,
} from "../../../../../components/ai/prompt-input"
import { Attachments, Attachment, AttachmentPreview, AttachmentRemove } from "../../../../../components/ai/attachments"
import { AudioVisualizer } from "../../../../../components/ai/audio-visualizer"
import { Suggestion, Suggestions } from "../../../../../components/ai/suggestion"
import {
  ModelSelector, ModelSelectorTrigger, ModelSelectorContent,
  ModelSelectorInput, ModelSelectorList, ModelSelectorGroup,
  ModelSelectorItem, ModelSelectorLogo, ModelSelectorLogoGroup,
  ModelSelectorName, ModelSelectorEmpty,
} from "../../../../../components/ai/model-selector"
import { saveChatPreferences } from "../_lib/actions"
import { suggestions } from "../_lib/constants"
import type { ChatStatus, ModelOption } from "../_lib/types"

const AttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments()
  if (attachments.files.length === 0) return null
  return (
    <Attachments variant="inline">
      {attachments.files.map((a) => (
        <Attachment data={a} key={a.id} onRemove={() => attachments.remove(a.id)}>
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  )
}

interface PromptInputBarProps {
  models: ModelOption[]
  model: string
  onModelChange: (id: string) => void
  status: ChatStatus
  showSuggestions: boolean
  onSubmit: (content: string) => void
  onStop?: () => void
}

function PromptInputBarImpl({ models, model, onModelChange, status, showSuggestions, onSubmit, onStop }: PromptInputBarProps) {
  const [text, setText] = useState("")
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [useMicrophone, setUseMicrophone] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)

  const selectedModelData = models.find((m) => m.id === model)

  useEffect(() => {
    if (useMicrophone) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(setAudioStream)
        .catch(() => {
          setUseMicrophone(false)
          toast.error("Microphone access denied")
        })
    } else if (audioStream) {
      audioStream.getTracks().forEach((t) => t.stop())
      setAudioStream(null)
    }
  }, [useMicrophone, audioStream])

  const handleSubmit = (msg: PromptInputMessage) => {
    if (!msg.text?.trim() && !msg.files?.length) return
    onSubmit(msg.text ?? "Sent with attachments")
    setText("") // Reset input setelah dikirim
  }

  const handleSuggestion = (s: string) => onSubmit(s)

  const handleModelSelect = (id: string) => {
    onModelChange(id)
    setModelSelectorOpen(false)
    void saveChatPreferences({ model: id })
  }

  return (
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-4 pb-8 px-4 z-20">
      <div className="mx-auto w-full max-w-3xl relative">

        {showSuggestions && (
          <Suggestions className="mb-4">
            {suggestions.map((s) => <Suggestion key={s} suggestion={s} onClick={() => handleSuggestion(s)} />)}
          </Suggestions>
        )}

        {useMicrophone && (
          <div className="absolute inset-0 z-50 rounded-xl overflow-hidden shadow-lg border border-border">
            <AudioVisualizer stream={audioStream} isRecording={useMicrophone} onClick={() => setUseMicrophone(false)} />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
              <span className="bg-destructive text-destructive-foreground text-xs px-3 py-1 rounded-full animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white block" />
                Recording... Click to stop
              </span>
            </div>
          </div>
        )}

        <PromptInput
          globalDrop multiple onSubmit={handleSubmit}
          className="border-border/60 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all bg-card"
        >
          <PromptInputHeader>
            <AttachmentsDisplay />
          </PromptInputHeader>

          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Ask anything, type '/' for commands..."
              className="min-h-[40px]"
            />
          </PromptInputBody>

          <PromptInputFooter className="pt-2">
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent
                  side="top" align="start" sideOffset={10}
                  className="min-w-[200px] rounded-xl border bg-popover/95 p-1.5 shadow-xl animate-in fade-in-0 slide-in-from-bottom-2"
                >
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              <PromptInputButton onClick={() => setUseMicrophone(true)} variant="ghost" className="hover:bg-primary/10 hover:text-primary cursor-pointer">
                <MicIcon size={16} />
              </PromptInputButton>

              <PromptInputButton onClick={() => setUseWebSearch((v) => !v)} variant={useWebSearch ? "default" : "ghost"} className="cursor-pointer">
                <GlobeIcon size={16} />
                {useWebSearch && <span className="ml-1 text-xs font-medium">Search ON</span>}
              </PromptInputButton>

              <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="bg-muted/50">
                    {selectedModelData?.chefSlug && <ModelSelectorLogo provider={selectedModelData.chefSlug} />}
                    {selectedModelData?.name && <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorGroup heading="Models">
                      {models.map((m) => (
                        <ModelSelectorItem key={m.id} onSelect={() => handleModelSelect(m.id)} value={m.id}>
                          <ModelSelectorLogoGroup>
                            <ModelSelectorLogo provider={m.chefSlug} />
                          </ModelSelectorLogoGroup>
                          <ModelSelectorName>{m.name}</ModelSelectorName>
                        </ModelSelectorItem>
                      ))}
                    </ModelSelectorGroup>
                  </ModelSelectorList>
                  <ModelSelectorEmpty>No models found</ModelSelectorEmpty>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>

            {status === "streaming" && onStop ? (
              <PromptInputButton onClick={onStop} className="ml-auto bg-destructive text-destructive-foreground hover:bg-destructive/90">
                <SquareIcon size={14} className="fill-current" />
              </PromptInputButton>
            ) : (
              <PromptInputSubmit disabled={!text.trim()} status={status} />
            )}
          </PromptInputFooter>
        </PromptInput>

        <p className="text-center text-[11px] text-muted-foreground mt-3 font-medium tracking-wide">
          AI can make mistakes. Consider verifying critical information.
        </p>
      </div>
    </div>
  )
}

export const PromptInputBar = memo(PromptInputBarImpl)