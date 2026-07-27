import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})


export async function POST(req: Request) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey) {
      return NextResponse.json({ error: "Missing license key" }, { status: 400 });
    }

    // 1. Find active licenses matching the key
    const userLicense = await prisma.license.findUnique({
      where: { licenseKey },
      include: { tool: true }, // Fetch the specific tool they bought
    });

    if (!userLicense || !userLicense.isActive) {
      return NextResponse.json({ error: "Invalid or expired license" }, { status: 403 });
    }

    // Return the allowed tool schema to the MCP server
    const allowedTools = [{
      id: userLicense.tool.id,
      name: userLicense.tool.name,
      slug: userLicense.tool.slug,
    }];

    return NextResponse.json({ valid: true, tools: allowedTools });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}