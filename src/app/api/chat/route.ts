import { streamText } from "ai"; 
import { openai, createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { auth } from "@/lib/auth/auth";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// MCP Server URL
const MCP_SERVER_URL = process.env.MCP_SERVER_URL;

// Configure Hugging Face Open-AI compatible provider instance
const huggingface = createOpenAI({
  baseURL: process.env.HUGGINGFACE_BASE_URL || "https://api-inference.huggingface.co/v1/",
  apiKey: process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || "",
});

/**
 * Helper function to select the appropriate AI Model based on modelId
 */
function getSelectedModel(modelId?: string) {
  if (!modelId) return openai("gpt-4o-mini");

  const cleanId = modelId.toLowerCase();

  // 1. Anthropic Claude Models
  if (cleanId.includes("claude") || cleanId.startsWith("anthropic/")) {
    const model = modelId.replace(/^anthropic\//, "");
    return anthropic(model);
  }

  // 2. Google Gemini Models
  if (cleanId.includes("gemini") || cleanId.startsWith("google/")) {
    const model = modelId.replace(/^google\//, "");
    return google(model);
  }

  // 3. Hugging Face Models
  if (
    cleanId.startsWith("hf/") || 
    cleanId.startsWith("huggingface/") || 
    cleanId.includes("llama") || 
    cleanId.includes("mistral")
  ) {
    const model = modelId.replace(/^(hf\/|huggingface\/)/, "");
    return huggingface(model);
  }

  // 4. OpenAI Models (Default)
  const model = modelId.replace(/^openai\//, "");
  return openai(model);
}

export async function POST(req: Request) {
  const { messages, id: sessionId, modelId } = await req.json();
  
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 1. Get User License Key for MCP Server Authentication
  const userLicense = await prisma.license.findFirst({
    where: { userId: session.user.id, isActive: true }
  });

  const mcpToken = userLicense?.licenseKey || "fallback_token_if_needed";

  // 2. Connect Next.js to MCP Server using SSE Client Transport
  let mcpClient: Client | null = null;
  if (MCP_SERVER_URL) {
    const transport = new SSEClientTransport(new URL(`${MCP_SERVER_URL}/mcp?token=${mcpToken}`));
    mcpClient = new Client({ name: "japatek-nextjs", version: "1.0.0" }, { capabilities: {} });
    
    try {
      await mcpClient.connect(transport);
    } catch (error) {
      console.error("Failed to connect to MCP Server:", error);
      mcpClient = null; // Proceed without tools if MCP server is offline
    }
  }

  // 3. Persist the latest user message to PostgreSQL via Prisma
  const lastMessage = messages[messages.length - 1];
  if (sessionId && lastMessage) {
    await prisma.chatMessage.create({
      data: { 
        sessionId, 
        role: lastMessage.role, 
        content: typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content) 
      }
    });
  }

  // 4. Resolve the target model
  const aiModel = getSelectedModel(modelId);

  // 5. Execute streaming response using Vercel AI SDK v6
  const result = await streamText({
    model: aiModel as any,
    messages: messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    })),
    system: "You are a helpful engineering AI assistant from JaPaTek. Use the provided tools to teach users how to create and review engineering 2D Drawings, 3D CAD, CAM, CAE, CFD, Shop Drawings, P&ID, MEP Drawings, BIM, and other Engineering Documentation.",
    
    // Tools definition with direct inputSchema for AI SDK v6 / MCP compatibility
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
            arguments: args 
          });
          return { success: true, result: res.content };
        }
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
            arguments: args 
          });
          return { success: true, result: res.content };
        }
      }
    },

    async onFinish({ text }) {
      // 6. Persist the AI assistant's response back to PostgreSQL
      if (sessionId && text) {
        await prisma.chatMessage.create({
          data: { sessionId, role: "assistant", content: text }
        });
      }
    }
  });

  return result.toTextStreamResponse();
}