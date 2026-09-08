/**
 * iPaymu callback (webhook) signature verification, per iPaymu's official
 * docs: https://docs.ipaymu.com/en/docs/callback
 *
 * We're using a static iPaymu Payment Link (created by hand in the iPaymu
 * dashboard, one per plan — see PricingPlan.paymentLinkUrl), not the
 * dynamic Redirect/Direct API, so this file only covers verifying inbound
 * callbacks — there's no outbound signed request to build.
 *
 * Env var:
 *   IPAYMU_VA   — your iPaymu account VA number (Dashboard > Integration >
 *                 API Key). This is the callback signing secret — NOT the
 *                 API key itself.
 */
import crypto from "node:crypto";

/** Raw fields as iPaymu sends them — everything arrives as a string over
 *  x-www-form-urlencoded, and mostly as strings even over JSON. */
export type IpaymuCallbackRaw = Record<string, string | undefined>;

export type IpaymuCallbackData = {
  trx_id: number;
  sid?: string;
  reference_id?: string;
  status?: string; // "berhasil" | "pending" | "expired"
  status_code: number; // 1 success, 0 pending, -2 expired
  sub_total?: string;
  total?: string;
  amount?: string;
  fee?: string;
  paid_off?: number;
  transaction_status_code?: number;
  is_escrow?: boolean;
  via?: string;
  channel?: string;
  payment_no?: string;
  va?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  product?: string;
  additional_info: unknown[];
  [key: string]: unknown;
};

/** Mirrors iPaymu's documented `normalizeData` step exactly. */
export function normalizeIpaymuCallback(raw: IpaymuCallbackRaw): IpaymuCallbackData {
  const intFields = new Set(["trx_id", "status_code", "transaction_status_code", "paid_off"]);
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(raw)) {
    const val = raw[key];
    if (val === undefined) continue;

    if (key === "is_escrow") {
      result[key] = val === "true" || val === "1";
    } else if (intFields.has(key)) {
      result[key] = parseInt(val, 10);
    } else if (key === "additional_info") {
      result[key] = val === "[]" ? [] : val;
    } else {
      result[key] = val;
    }
  }

  if (!("additional_info" in result)) result.additional_info = [];

  return result as IpaymuCallbackData;
}

/** `Object.keys().sort()` is NOT the same as PHP's ksort for this purpose —
 *  iPaymu's algorithm needs plain ascending, case-sensitive string sort. */
function phpKsort<T extends Record<string, unknown>>(obj: T): T {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
    sorted[key] = obj[key];
  }
  return sorted as T;
}

/**
 * Verifies the `X-Signature` header against the normalized callback body.
 * Secret key is the merchant VA number (per iPaymu's docs — not the API key).
 */
export function verifyIpaymuSignature(normalized: IpaymuCallbackData, signatureHeader: string): boolean {
  const va = process.env.IPAYMU_VA!;
  const { signature: _drop, ...withoutSignature } = normalized as Record<string, unknown>;
  const sorted = phpKsort(withoutSignature);

  // iPaymu's reference implementation escapes "/" the way PHP's json_encode
  // does by default (json_encode does NOT escape "/" unless
  // JSON_UNESCAPED_SLASHES is *absent* — their example manually re-escapes
  // it, so we match that exactly rather than relying on JS's stringify).
  const jsonBody = JSON.stringify(sorted).replace(/\//g, "\\/");

  const expected = crypto.createHmac("sha256", va).update(jsonBody).digest("hex");
  return expected === signatureHeader;
}
