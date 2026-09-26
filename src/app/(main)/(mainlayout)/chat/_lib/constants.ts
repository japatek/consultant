import { nanoid } from "nanoid"
import type { MessageType, ModelOption } from "./types"


export class Name AVAILABLE_MODELS: ModelOption[] = [
  // OpenAI Models
  { id: "gpt-4o", name: "GPT-4o (OpenAI)", chefSlug: "openai" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini (OpenAI)", chefSlug: "openai" },

  // Anthropic Models
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Anthropic)", chefSlug: "anthropic" },
  { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Anthropic)", chefSlug: "anthropic" },

  // Google Gemini Models
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Google)", chefSlug: "google" },
  { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Google)", chefSlug: "google" },

  // Hugging Face Open Source Models
  { id: "hf/meta-llama/Meta-Llama-3-8B-Instruct", name: "Llama 3 8B (Hugging Face)", chefSlug: "huggingface" },
  { id: "hf/mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B (Hugging Face)", chefSlug: "huggingface" },
];

export const suggestions = [
  "Explain Dijkstra's algorithm",
  "Show me how React hooks work",
  "Write a Python sorting algorithm",
  "What is TypeScript generics?",
]

export const models: ModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", chef: "OpenAI", chefSlug: "openai" },
  { id: "claude-sonnet-3.5", name: "Claude 3.5 Sonnet", chef: "Anthropic", chefSlug: "anthropic" },
]

export const initialMessages: MessageType[] = [
  {
    key: nanoid(),
    from: "user",
    versions: [{ id: nanoid(), content: "Can you explain Dijkstra's algorithm and show me a flowchart of how it works?" }],
  },
  {
    key: nanoid(),
    from: "assistant",
    reasoningSteps: [
      { label: "Analysing user request", status: "complete" },
      { label: "Retrieving Python implementation", status: "complete", desc: "Using standard heapq library" },
      { label: "Generating ReactFlow graph", status: "complete" },
    ],
    sources: [{ href: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm", title: "Wikipedia: Dijkstra" }],
    versions: [{
      id: nanoid(),
      content: `I've prepared a comprehensive overview of **Dijkstra's Algorithm** for you.\n\nI have created an artifact containing both the **Python implementation** and an interactive **Canvas Data Flow**.\n\nOpen the artifact on the right to switch between the code block and the canvas view!`,
    }],
  },
]