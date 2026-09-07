import { NextResponse } from "next/server";
import {
  handleIpaymuCallback,
  InvalidIpaymuSignatureError,
} from "@/lib/payment/handle-ipaymu-callback";
import type { IpaymuCallbackRaw } from "@/lib/payment/ipaymu";

/**
 * iPaymu calls this directly from their servers — must be a Route Handler,
 * not a server action. Configure this exact URL as the callback/notify URL
 * for the Payment Link product in the iPaymu dashboard (Settings >
 * Integration > Callback). iPaymu can send either
 * application/x-www-form-urlencoded (their default) or application/json —
 * this route accepts both. Keep this file thin: parse the body, hand it to
 * the handler, translate the result into a response. All the actual
 * decision-making lives in lib/payment/handle-ipaymu-callback.ts.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const signature = request.headers.get("x-signature");

  let raw: IpaymuCallbackRaw;
  if (contentType.includes("application/json")) {
    const body = await request.json();
    raw = Object.fromEntries(Object.entries(body).map(([k, v]) => [k, v == null ? undefined : String(v)]));
  } else {
    const form = await request.formData();
    raw = Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, String(v)]));
  }

  try {
    const result = await handleIpaymuCallback(raw, signature);
    // iPaymu only requires 200 to stop retrying — body is for our own logs.
    return NextResponse.json({ status: "OK", ...result });
  } catch (error) {
    if (error instanceof InvalidIpaymuSignatureError) {
      return NextResponse.json({ status: "Invalid Signature" }, { status: 400 });
    }
    console.error("iPaymu callback error:", error);
    // 500 so iPaymu retries — reconciliation is idempotent on trx_id.
    return NextResponse.json({ status: "Error" }, { status: 500 });
  }
}
