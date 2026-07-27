import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});
export async function POST(req: Request) {
  try {
    const { toolId, toolName, priceIDR, userEmail, userId } = await req.json();

    if (!userId || !toolId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Generate unique Order ID
    const orderId = `ORDER-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    // 2. Create pending License in DB (inactive until paid)
    await prisma.license.create({
      data: {
        userId,
        toolId,
        orderId,
        isActive: false,
      },
    });

    // 3. Request Snap Token from Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: priceIDR,
      },
      item_details: [{
        id: toolId,
        price: priceIDR,
        quantity: 1,
        name: toolName.substring(0, 50), // Midtrans limits name length
      }],
      customer_details: {
        email: userEmail,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}