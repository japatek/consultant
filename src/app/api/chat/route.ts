// 1. TAMBAHKAN IMPORT 'tool' DARI "ai"
import { streamText, tool } from "ai"; 
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai"; 
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { auth } from "@/lib/auth/auth";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { NextResponse } from "next/server";

const MCP_SERVER_URL = process.env.MCP_SERVER_URL;

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
      // Pastikan MCP_SERVER_URL tidak berakhiran slash '/'
      const cleanMcpUrl = MCP_SERVER_URL.replace(/\/$/, "");
      const transport = new SSEClientTransport(new URL(`${cleanMcpUrl}/mcp?token=${mcpToken}`));
      mcpClient = new Client({ name: "japatek-nextjs", version: "1.0.0" }, { capabilities: {} });
      
      try {
        await mcpClient.connect(transport);
      } catch (error) {
        console.error("Failed to connect to MCP Server (404/Offline). Tools disabled.", error);
        mcpClient = null;
      }
    }

    // 2. FIX KRUSIAL: Mengekstrak Teks dari format Array 'parts'
    const normalizedMessages = messages.map((m: any) => {
      let content = m.content;
      // Jika content undefined, cari di dalam property parts (format baru AI SDK)
      if (typeof content === "undefined" && m.parts) {
        content = m.parts.map((p: any) => p.text || "").join("");
      }
      return {
        role: m.role,
        content: content || "",
      };
    });

    const lastMessage = normalizedMessages[normalizedMessages.length - 1];
    if (sessionId && lastMessage && lastMessage.role === "user") {
      await prisma.chatMessage.create({
        data: { 
          sessionId, 
          role: lastMessage.role, 
          content: lastMessage.content
        }
      });
    }

    const aiModel = getSelectedModel(modelId);

    const result = await streamText({
      model: aiModel as any,
      messages: normalizedMessages, // Menggunakan pesan yang sudah dinormalisasi
      system: "You are a helpful engineering AI assistant from JaPaTek. Use the provided tools to teach users how to create and review engineering 2D Drawings, 3D CAD, CAM, CAE, CFD, Shop Drawings, P&ID, MEP Drawings, BIM, and other Engineering Documentation.",
      
      tools: {
        // 3. FIX: Bungkus definisi tool dengan fungsi tool() untuk mengatasi masalah type 'parameters'
        calculate_area: tool({
          description: "Calculates the area of geometric shapes (rectangle, circle, or triangle).",
          parameters: z.object({
            shape: z.enum(["rectangle", "circle", "triangle"]),
            length: z.number().optional(),
            width: z.number().optional(),
            radius: z.number().optional(),
            base: z.number().optional(),
            height: z.number().optional(),
          }),
          execute: async (args) => {
            if (!mcpClient) return { success: false, error: "MCP Server offline" };
            const res = mcpClient.callTool({ name: "calculate_area", arguments: args });
            return { success: true, result: (await res).content };
          }
        }),
        
        calculate_beam_load: tool({
          description: "Calculates structural beam load parameters.",
          parameters: z.object({
            length: z.number().describe("Length of the beam in meters"),
            load: z.number().describe("Uniformly distributed load in kN/m"),
          }),
          execute: async (args) => {
            if (!mcpClient) return { success: false, error: "MCP Server offline" };
            const res = mcpClient.callTool({ name: "calculate_beam_load", arguments: args });
            return { success: true, result: (await res).content };
          }
        })
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

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("API Chat Processing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}