export interface ReasoningStep {
  label: string
  status: "complete" | "active" | "pending"
  desc?: string
}

export interface PlanStepData {
  label: string
  status: "complete" | "active" | "pending"
}

export interface ToolCallData {
  id: string
  name: string
  input?: unknown
  result?: unknown
}

export interface TaskData {
  title: string
  description?: string
  status: "complete" | "active" | "pending"
}

export interface EnvVar {
  name: string
  value: string
}

export interface Citation {
  href: string
  title: string
}

export interface SandboxData {
  title?: string
  state?: "running" | "completed" | "error"
  code?: string
  output?: string
}

export interface MessageType {
  key: string
  from: "user" | "assistant"
  versions: { id: string; content: string }[]
  reasoningSteps?: ReasoningStep[]
  reasoning?: string
  plan?: { title: string; steps: PlanStepData[] }
  toolCalls?: ToolCallData[]
  tasks?: TaskData[]
  terminalOutput?: string
  sandbox?: SandboxData
  testResults?: number
  stackTrace?: string
  envVars?: EnvVar[]
  schema?: unknown
  queue?: Record<string, unknown>
  imageUrl?: string
  filePreview?: File
  sources?: { href: string; title: string }[]
  citations?: Citation[]
  pinned?: boolean
}

export type ChatStatus = "ready" | "submitted" | "streaming" | "error"

export interface ArtifactFile {
  id: string
  filename: string
  language: string
  code: string
  messageKey: string
}

export interface ChatSession {
  id: string
  title: string
  pinned: boolean
}

export interface ModelOption {
  id: string
  name: string
  chef: string
  chefSlug: string
}

export interface ChatPreferences {
  model: string
  activeSessionId: string
  isArtifactOpen: boolean
}