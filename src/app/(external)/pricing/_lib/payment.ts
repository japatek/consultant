import crypto from "crypto";

interface IpaymuTransactionParams {
  orderId: string;
  grossAmountIDR: number;
  itemName: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function createIpaymuTransaction({
  orderId,
  grossAmountIDR,
  itemName,
  customer,
}: IpaymuTransactionParams) {
  const va = process.env.IPAYMU_VA!;
  const apiKey = process.env.IPAYMU_API_KEY!;
  const isProd = process.env.NODE_ENV === "production";
  
  const ipaymuUrl = isProd 
    ? "https://my.ipaymu.com/api/v2/payment" 
    : "https://sandbox.ipaymu.com/api/v2/payment";

  const body = {
    product: [itemName],
    qty: ["1"],
    price: [grossAmountIDR.toString()],
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success`,
    notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ipaymu`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/cancel`,
    referenceId: orderId,
    buyerName: customer.name,
    buyerEmail: customer.email,
    buyerPhone: customer.phone,
  };

  const bodyString = JSON.stringify(body);
  const signatureString = crypto.createHash('sha256').update(bodyString).digest('hex');
  const stringToSign = `POST:${va}:${bodyString}:${apiKey}`;
  const signature = crypto.createHmac('sha256', apiKey).update(stringToSign).digest('hex');

  const response = await fetch(ipaymuUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "va": va,
      "signature": signature,
      "timestamp": new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14) // Format: YYYYMMDDHHMMSS
    },
    body: bodyString,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`iPaymu Error: ${errorText}`);
  }

  const result = await response.json();

  if (result.Status !== 200) {
    throw new Error(`iPaymu API Error: ${result.Message}`);
  }

  return {
    sessionId: result.Data.SessionId,
    redirectUrl: result.Data.Url,
  };
}