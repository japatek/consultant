import { NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;
    
    // 1. Verify Midtrans Signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto.createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
    }

    // 2. Unlock Tool on Success
    if (transaction_status === "capture" || transaction_status === "settlement") {
      const generatedLicenseKey = `KEY-${crypto.randomUUID()}`;

      await prisma.license.update({
        where: { orderId: order_id },
        data: {
          isActive: true,
          licenseKey: generatedLicenseKey,
        },
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}