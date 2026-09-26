import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { auth } from "@/lib/auth/auth";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { NextResponse } from "next/server";

// MCP Server URL
const MCP_SERVER_URL = process.env.MCP_SERVER_URL;

// Configure Hugging Face Open-AI compatible provider instance
const huggingface = createOpenAI({
  baseURL: process.env.HUGGINGFACE_BASE_URL || "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || "",
});

// Gemini 2.5 (and everything older) is scheduled for shutdown 2026-10-16.
// Point bare/unversioned aliases at the Gemini 3 line so this doesn't need
// revisiting again right after the 2.5 line goes away.
const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite"; // stable, no shutdown date yet
const GEMINI_ALIASES: Record<string, string> = {
  gemini: DEFAULT_GEMINI_MODEL,
  "gemini-pro": "gemini-3.1-pro-preview",
  "gemini-flash": DEFAULT_GEMINI_MODEL,
};

function getSelectedModel(modelId?: string) {
  if (!modelId) return google(DEFAULT_GEMINI_MODEL);

  const cleanId = modelId.toLowerCase();

  if (cleanId.includes("gemini") || cleanId.startsWith("google/")) {
    const stripped = modelId.replace(/^google\//, "");
    // A real Gemini model id always has a version number in it
    // (gemini-2.5-flash, gemini-3.1-flash-lite, ...). A bare "gemini"
    // or unversioned alias isn't a real model id — map it instead of
    // passing it straight through to the API.
    const resolved = /\d/.test(stripped) ? stripped : GEMINI_ALIASES[cleanId] ?? DEFAULT_GEMINI_MODEL;
    return google(resolved);
  }

  if (
    cleanId.startsWith("hf/") ||
    cleanId.startsWith("huggingface/") ||
    cleanId.includes("llama") ||
    cleanId.includes("mistral")
  ) {
    const model = modelId.replace(/^(hf\/|huggingface\/)/, "");
    return huggingface(model);
  }

  return google(DEFAULT_GEMINI_MODEL);
}

// v6: text lives in message.parts, not message.content.
function extractText(message: UIMessage | any): string {
  if (typeof message?.content === "string") return message.content;
  if (Array.isArray(message?.parts)) {
    return message.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return typeof message?.content !== "undefined" ? JSON.stringify(message.content) : "";
}

// Coerces any message into the { parts: [...] } shape convertToModelMessages
// expects. Needed because sessions can contain a mix of rows saved before
// the parts-based migration (old { role, content } shape) and rows saved
// after (correct { role, parts } shape) — convertToModelMessages throws
// ("reading 'map'") the moment it hits a content-only row with no `parts`.
function toUIMessage(m: any): UIMessage {
  if (Array.isArray(m?.parts)) return m as UIMessage;
  return {
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: typeof m.content === "string" ? m.content : "" }],
  } as UIMessage;
}

export async function POST(req: Request) {
  try {
    const { messages, id: sessionId, modelId } = await req.json();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLicense = await prisma.license.findFirst({
      where: { userId: session.user.id, isActive: true },
    });

    const mcpToken = userLicense?.licenseKey || "fallback_token_if_needed";

    let mcpClient: Client | null = null;
    if (MCP_SERVER_URL) {
      const transport = new SSEClientTransport(new URL(`${MCP_SERVER_URL}/mcp?token=${mcpToken}`));
      mcpClient = new Client({ name: "japatek-nextjs", version: "1.0.0" }, { capabilities: {} });

      try {
        await mcpClient.connect(transport);
      } catch (error) {
        console.error("Failed to connect to MCP Server:", error);
        mcpClient = null;
      }
    }

    // Persist the latest user message
    const lastMessage = messages[messages.length - 1];
    if (sessionId && lastMessage && lastMessage.role === "user") {
      await prisma.chatMessage.create({
        data: {
          sessionId,
          role: lastMessage.role,
          content: extractText(lastMessage),
        },
      });
    }

    const aiModel = getSelectedModel(modelId);
    const normalizedMessages = (messages as any[]).map(toUIMessage);

    const result = streamText({
      model: aiModel as any,
      messages: await convertToModelMessages(normalizedMessages),
      system:
        "You are a helpful engineering AI assistant from JaPaTek. Use the provided tools to teach users how to create and review engineering 2D Drawings, 3D CAD, CAM, CAE, CFD, Shop Drawings, P&ID, MEP Drawings, BIM, and other Engineering Documentation.",

      tools: {
        calculate_area: {
          description: "Calculates the area of geometric shapes (rectangle, circle, or triangle).",
          inputSchema: z.object({
            shape: z.enum(["rectangle", "circle", "triangle"]),
            length: z.number().optional(),
            width: z.number().optional(),
            radius: z.number().optional(),
            base: z.number().optional(),
            height: z.number().optional(),
          }),
          execute: async (args: any) => {
            if (!mcpClient) return { success: false, error: "MCP Server offline" };
            const res = await mcpClient.callTool({
              name: "calculate_area",
              arguments: args,
            });
            return { success: true, result: res.content };
          },
        },

        calculate_beam_load: {
          description: "Calculates structural beam load parameters.",
          inputSchema: z.object({
            length: z.number().describe("Length of the beam in meters"),
            load: z.number().describe("Uniformly distributed load in kN/m"),
          }),
          execute: async (args: any) => {
            if (!mcpClient) return { success: false, error: "MCP Server offline" };
            const res = await mcpClient.callTool({
              name: "calculate_beam_load",
              arguments: args,
            });
            return { success: true, result: res.content };
          },
        },
      },

      async onFinish({ text }) {
        if (sessionId && text) {
          try {
            await prisma.chatMessage.create({
              data: { sessionId, role: "assistant", content: text },
            });
          } catch (dbError) {
            console.error("Gagal simpan balasan AI ke DB:", dbError);
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API Chat Processing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}