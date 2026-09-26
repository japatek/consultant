import { streamText } from "ai"; 
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

function getSelectedModel(modelId?: string) {
  if (!modelId) return google("gemini-1.5-pro");

  const cleanId = modelId.toLowerCase();

  if (cleanId.includes("gemini") || cleanId.startsWith("google/")) {
    const model = modelId.replace(/^google\//, "");
    return google(model);
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

  return google("gemini-1.5-pro");
}

export async function POST(req: Request) {
  try {
    const { messages, id: sessionId, modelId } = await req.json();
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLicense = await prisma.license.findFirst({
      where: { userId: session.user.id, isActive: true }
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

    const lastMessage = messages[messages.length - 1];
    if (sessionId && lastMessage && lastMessage.role === "user") {
      await prisma.chatMessage.create({
        data: { 
          sessionId, 
          role: lastMessage.role, 
          content: typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content) 
        }
      });
    }

    const aiModel = getSelectedModel(modelId);

    const result = await streamText({
      model: aiModel as any, // Bypass aman untuk mengatasi error LanguageModelV4 vs V2
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      system: "You are a helpful engineering AI assistant from JaPaTek. Use the provided tools to teach users how to create and review engineering 2D Drawings, 3D CAD, CAM, CAE, CFD, Shop Drawings, P&ID, MEP Drawings, BIM, and other Engineering Documentation.",
      
      tools: {
        calculate_area: {
          description: "Calculates the area of geometric shapes (rectangle, circle, or triangle).",
          // KEMBALI KE inputSchema sesuai ekspektasi versi SDK Anda
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
          // KEMBALI KE inputSchema
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
        if (sessionId && text) {
          try {
            await prisma.chatMessage.create({
              data: { sessionId, role: "assistant", content: text }
            });
          } catch (dbError) {
            console.error("Gagal simpan balasan AI ke DB:", dbError);
          }
        }
      }
    });

    // MENGGUNAKAN toTextStreamResponse() sesuai saran compiler TypeScript Anda
    return result.toTextStreamResponse();

  } catch (error) {
    console.error("API Chat Processing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}