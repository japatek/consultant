import type { ModelOption } from "./types"


export const models: ModelOption[] = [
  // OpenAI Models
  // { id: "gpt-4o", name: "GPT-4o", chef: "OpenAI", chefSlug: "openai" },
  // { id: "gpt-4o-mini", name: "GPT-4o Mini", chef: "OpenAI", chefSlug: "openai" },

  // // Anthropic Models
  // { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", chef: "Anthropic", chefSlug: "anthropic" },
  // { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", chef: "Anthropic", chefSlug: "anthropic" },

  // Google Gemini Models
  { id: "gemini", name: "Gemini 1.5 Pro", chef: "Google", chefSlug: "google" },
  // { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", chef: "Google", chefSlug: "google" },

  // Hugging Face Open Source Models
  { id: "hf/meta-llama/Meta-Llama-3-8B-Instruct", name: "Llama 3 8B", chef: "Hugging Face", chefSlug: "huggingface" },
  // { id: "hf/mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B", chef: "Hugging Face", chefSlug: "huggingface" },
];

export const suggestions = {
  en: [
    "What are the standard line weights for ISO 128 technical drawings?",
    "Explain the differences between PFD and P&ID.",
    "Best practices for creating MEP coordination drawings.",
    "How to correctly apply GD&T symbols?",
  ],
  id: [
    "Apa standar ketebalan garis untuk gambar teknik ISO 128?",
    "Jelaskan perbedaan antara PFD dan P&ID.",
    "Praktik terbaik untuk menyusun gambar koordinasi MEP.",
    "Bagaimana cara menerapkan simbol GD&T dengan benar?",
  ]
};