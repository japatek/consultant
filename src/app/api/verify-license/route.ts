import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  // Cari lisensi yang valid dan aktif di database
  const validLicense = await prisma.license.findUnique({
    where: { licenseKey: token },
  });

  if (!validLicense || !validLicense.isActive) {
    return NextResponse.json({ error: "Invalid or inactive license" }, { status: 403 });
  }

  return NextResponse.json({ success: true, userId: validLicense.userId });
}