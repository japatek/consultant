import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai"; 
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { auth } from "@/lib/auth/auth";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Ganti dengan URL hosting MCP Server Anda (misal dari Railway/Render)
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "https://your-mcp-server.up.railway.app";

export async function POST(req: Request) {
  const { messages, id: sessionId, modelId } = await req.json();
  
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 1. Ambil License Key user dari database untuk autentikasi ke MCP Server
  const userLicense = await prisma.license.findFirst({
    where: { userId: session.user.id, isActive: true }
  });

  const mcpToken = userLicense?.licenseKey || "fallback_token_if_needed";

  // 2. Hubungkan Next.js ke MCP Server menggunakan SSE Client Transport
  const transport = new SSEClientTransport(new URL(`${MCP_SERVER_URL}/mcp?token=${mcpToken}`));
  const mcpClient = new Client({ name: "japatek-nextjs", version: "1.0.0" }, { capabilities: {} });
  
  try {
    await mcpClient.connect(transport);
  } catch (error) {
    console.error("Gagal terhubung ke MCP Server:", error);
    // Lanjutkan chat tanpa tools jika server MCP mati
  }

  // Simpan pesan User
  const lastMessage = messages[messages.length - 1];
  if (sessionId) {
    await prisma.chatMessage.create({
      data: { sessionId, role: lastMessage.role, content: lastMessage.content }
    });
  }

  const isAnthropic = modelId?.includes("claude");
  const aiModel = isAnthropic ? anthropic(modelId) : openai(modelId || "gpt-4o");

  const result = await streamText({
    model: aiModel as any,
    // Lakukan mapping manual agar sesuai dengan CoreMessage Vercel AI SDK
    messages: messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    })),
    system: "You are a helpful engineering AI assistant from JaPaTek. Use the provided tools to teach user create and review engineering 2D Drawing, 3D CAD, CAM, CAE, CFD, Shop Drawing, PI&Drawing, MEP Drawing, BIM, and Other Engineering Documentation .",
    
    // 3. Deklarasikan Tools untuk Vercel AI SDK dan teruskan ke MCP Server
// 3. Deklarasikan Tools tanpa pembungkus 'tool()' untuk menghindari error TypeScript
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
          const res = await mcpClient.callTool({ 
            name: "calculate_area", 
            arguments: args 
          });
          
          return {
            success: true,
            result: res.content
          };
        }
      },
      
      calculate_beam_load: {
        description: "Calculates structural beam load parameters.",
        inputSchema: z.object({
          length: z.number().describe("Length of the beam in meters"),
          load: z.number().describe("Uniformly distributed load in kN/m"),
        }),
        execute: async (args: any) => {
          const res = await mcpClient.callTool({ 
            name: "calculate_beam_load", 
            arguments: args 
          });
          
          return {
            success: true,
            result: res.content
          };
        }
      }
    },

    async onFinish({ text }) {
      if (sessionId) {
        await prisma.chatMessage.create({
          data: { sessionId, role: "assistant", content: text }
        });
      }
    }
  });

  return result.toTextStreamResponse();
}