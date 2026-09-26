import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: Request) {
  // 1. KEAMANAN EKSTRA: Pastikan yang memanggil endpoint ini HANYA server Railway Anda
  // (Pastikan Anda menambahkan MCP_SECRET_KEY di Environment Variables Vercel & Railway)
  const secretHeader = req.headers.get("x-mcp-secret");
  
  // Jika Anda belum mau memakai secret, Anda bisa meng-comment 3 baris di bawah ini sementara
  if (process.env.MCP_SECRET_KEY && secretHeader !== process.env.MCP_SECRET_KEY) {
    return NextResponse.json({ error: "Forbidden: Unauthorized server connection" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    // 2. Cari lisensi yang valid dan aktif di database
    const validLicense = await prisma.license.findUnique({
      where: { licenseKey: token },
    });

    if (!validLicense || !validLicense.isActive) {
      return NextResponse.json({ error: "Invalid or inactive license" }, { status: 403 });
    }

    // 3. Kembalikan respons sukses beserta ID user
    return NextResponse.json({ success: true, userId: validLicense.userId });
    
  } catch (error) {
    console.error("[Verify License Error]:", error);
    // Mencegah server crash jika database sedang bermasalah
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}