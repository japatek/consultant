"use client"

import { memo, useState } from "react"
import dynamic from "next/dynamic"
import { RefreshCwIcon, FileCodeIcon, PencilIcon } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { Button } from "../../../../../components/ui/button"
import { Message, MessageContent, MessageResponse } from "../../../../../components/ai/message"
import { ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtContent, ChainOfThoughtStep } from "../../../../../components/ai/chain-of-thought"
import { Reasoning, ReasoningTrigger, ReasoningContent } from "../../../../../components/ai/reasoning"
import { Plan, PlanHeader, PlanContent, PlanAction } from "../../../../../components/ai/plan"
import { Tool, ToolCall, ToolResult } from "../../../../../components/ai/tool"
import { Task, TaskContent, TaskTrigger, TaskItem } from "../../../../../components/ai/task"
import { Sources, SourcesTrigger, SourcesContent, Source } from "../../../../../components/ai/sources"
import { InlineCitation, InlineCitationCard, InlineCitationCardBody, InlineCitationCardTrigger, InlineCitationSource } from "../../../../../components/ai/inline-citation"
import { CopyButton } from "../../../../../components/ai/copy-button"
import { FilePreview } from "../../../../../components/ai/file-preview"
import { CollapsibleUserMessage } from "./user-bubble"
import { usePanelContext } from "./chat-context"
import type { ArtifactFile, MessageType } from "../_lib/types"

// Rarely-used / heavy blocks are split out of the main bundle
const Terminal = dynamic(() => import("../../../../..//components/ai/terminal").then((m) => m.Terminal), { ssr: false })
const Sandbox = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.Sandbox), { ssr: false })
const SandboxHeader = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxHeader), { ssr: false })
const SandboxContent = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxContent), { ssr: false })
const SandboxTabs = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxTabs), { ssr: false })
const SandboxTabsBar = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxTabsBar), { ssr: false })
const SandboxTabsList = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxTabsList), { ssr: false })
const SandboxTabsTrigger = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxTabsTrigger), { ssr: false })
const SandboxTabContent = dynamic(() => import("../../../../..//components/ai/sandbox").then((m) => m.SandboxTabContent), { ssr: false })
const TestResults = dynamic(() => import("../../../../..//components/ai/test-results").then((m) => m.TestResults), { ssr: false })
const StackTrace = dynamic(() => import("../../../../..//components/ai/stack-trace").then((m) => m.StackTrace), { ssr: false })
const SchemaDisplay = dynamic(() => import("../../../../..//components/ai/schema-display").then((m) => m.SchemaDisplay), { ssr: false })
const Queue = dynamic(() => import("../../../../..//components/ai/queue").then((m) => m.Queue), { ssr: false })
const EnvironmentVariables = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariables), { ssr: false })
const EnvironmentVariablesHeader = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariablesHeader), { ssr: false })
const EnvironmentVariablesTitle = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariablesTitle), { ssr: false })
const EnvironmentVariablesToggle = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariablesToggle), { ssr: false })
const EnvironmentVariablesContent = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariablesContent), { ssr: false })
const EnvironmentVariable = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariable), { ssr: false })
const EnvironmentVariableGroup = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariableGroup), { ssr: false })
const EnvironmentVariableName = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariableName), { ssr: false })
const EnvironmentVariableValue = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariableValue), { ssr: false })
const EnvironmentVariableCopyButton = dynamic(() => import("../../../../..//components/ai/environment-variables").then((m) => m.EnvironmentVariableCopyButton), { ssr: false })

interface MessageItemProps {
  message: MessageType
  version: { id: string; content: string }
  files: ArtifactFile[]
  onReload?: (messageId: string) => void
  onEdit?: (messageId: string, newContent: string) => void
}

function MessageItemImpl({ message, version, files, onReload, onEdit }: MessageItemProps) {
  const { isCodePanelOpen, selectedFile, openCodePanel } = usePanelContext()
  
  // State untuk mode edit prompt
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")

  const handleStartEdit = () => {
    setEditValue(version.content)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
    if (editValue.trim() !== "" && editValue !== version.content) {
      onEdit?.(message.key, editValue)
    }
  }

  return (
    <Message from={message.from} className="group">
      <div className="w-full flex flex-col gap-2">

        {message.reasoningSteps && (
          <ChainOfThought defaultOpen={false}>
            <ChainOfThoughtHeader>AI Reasoning Process</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              {message.reasoningSteps.map((step, idx) => (
                <ChainOfThoughtStep key={idx} label={step.label} status={step.status} description={step.desc} />
              ))}
            </ChainOfThoughtContent>
          </ChainOfThought>
        )}

        {message.reasoning && (
          <Reasoning>
            <ReasoningTrigger />
            <ReasoningContent>{message.reasoning}</ReasoningContent>
          </Reasoning>
        )}

        {message.plan && (
          <Plan>
            <PlanHeader>{message.plan.title}</PlanHeader>
            <PlanContent>
              {message.plan.steps.map((step, idx) => (
                <PlanAction key={idx} data-slot={step.status}>{step.label}</PlanAction>
              ))}
            </PlanContent>
          </Plan>
        )}

        {message.toolCalls?.map((tc) => (
          <Tool key={tc.id}>
            <ToolCall name={tc.name} input={typeof tc.input === "string" ? tc.input : JSON.stringify(tc.input, null, 2)} />
            {tc.result !== undefined && <ToolResult output={JSON.stringify(tc.result, null, 2)} errorText="ERROR" />}
          </Tool>
        ))}

        {message.tasks?.map((t, idx) => (
          <Task key={idx}>
            <TaskTrigger title={t.title} />
            <TaskContent>
              <TaskItem>{t.description}</TaskItem>
            </TaskContent>
          </Task>
        ))}

        {message.terminalOutput ? <Terminal output={message.terminalOutput} /> : null}

        {/* Sandbox, TestResults, StackTrace, Schema, Queue, EnvVars... */}
        {message.sandbox && (
          <Sandbox>
            <SandboxHeader
              title={String(message.sandbox.title ?? "Code Execution")}
              state={message.sandbox.state === "running" || message.sandbox.state === "error" ? message.sandbox.state : "completed"}
            />
            <SandboxContent>
              <SandboxTabs defaultValue="code">
                <SandboxTabsBar>
                  <SandboxTabsList>
                    <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
                    {!!message.sandbox.output && <SandboxTabsTrigger value="console">Console</SandboxTabsTrigger>}
                  </SandboxTabsList>
                </SandboxTabsBar>
                <SandboxTabContent value="code">
                  <pre className="overflow-auto bg-muted/30 p-4 font-mono text-xs">{String(message.sandbox.code ?? "")}</pre>
                </SandboxTabContent>
                {!!message.sandbox.output && (
                  <SandboxTabContent value="console">
                    <pre className="overflow-auto bg-muted/30 p-4 font-mono text-xs text-green-600">{String(message.sandbox.output ?? "")}</pre>
                  </SandboxTabContent>
                )}
              </SandboxTabs>
            </SandboxContent>
          </Sandbox>
        )}

        {message.testResults !== undefined && <TestResults results={message.testResults} />}
        {message.stackTrace && <StackTrace trace={message.stackTrace} />}

        {message.sources && message.sources.length > 0 && (
          <Sources>
            <SourcesTrigger count={message.sources.length} />
            <SourcesContent>
              {message.sources.map((s) => <Source href={s.href} key={s.href} title={s.title} />)}
            </SourcesContent>
          </Sources>
        )}

        {message.imageUrl ? (
          <img
            src={message.imageUrl}
            alt="Generated image"
            className="max-h-96 w-full rounded-md object-contain border border-border/50"
            width={400}
            height={400}
            loading="lazy"
          />
        ) : null}

        {message.filePreview ? <FilePreview file={message.filePreview} /> : null}

        {/* ── LOGIKA RENDER PESAN PENGGUNA (EDIT MODE) VS ASSISTANT ── */}
        {message.from === "user" ? (
          isEditing ? (
            <div className="flex flex-col gap-2 w-full mt-1">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full min-h-[160px] p-3 rounded-xl bg-background border border-primary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveEdit}>Save & Reprocess</Button>
              </div>
            </div>
          ) : version.content.length > 300 ? (
            <CollapsibleUserMessage content={version.content} />
          ) : (
            <MessageContent>
              <MessageResponse>{version.content}</MessageResponse>
            </MessageContent>
          )
        ) : (
          <MessageContent>
            <MessageResponse>{version.content}</MessageResponse>
          </MessageContent>
        )}

        {message.from === "assistant" && message.citations?.map((c, i) => (
          <InlineCitation key={i}>
            <InlineCitationCard>
              <InlineCitationCardTrigger sources={[c.href]} />
              <InlineCitationCardBody>
                <div className="p-4">
                  <InlineCitationSource index={i + 1} title={c.title} url={c.href} />
                </div>
              </InlineCitationCardBody>
            </InlineCitationCard>
          </InlineCitation>
        ))}

        {message.from === "assistant" && files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {files.map((f) => (
              <button
                key={f.id}
                onClick={() => openCodePanel(f.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                  isCodePanelOpen && selectedFile?.id === f.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground",
                )}
              >
                <FileCodeIcon className="size-3.5" />
                {f.filename}
              </button>
            ))}
          </div>
        )}

        {/* ── FOOTER ACTIONS (COPY, EDIT, REFRESH) ── */}
        {message.from === "assistant" ? (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
            <CopyButton content={version.content} />
          </div>
        ) : (
          !isEditing && (
            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity mt-1 items-center gap-1">
              <Button 
                variant="ghost" 
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={handleStartEdit}
                title="Edit Prompt"
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => onReload?.(message.key)}
                title="Reprocess Prompt"
              >
                <RefreshCwIcon className="h-3.5 w-3.5" />
              </Button>
              <CopyButton content={version.content} />
            </div>
          )
        )}

      </div>
    </Message>
  )
}

export const MessageItem = memo(MessageItemImpl)