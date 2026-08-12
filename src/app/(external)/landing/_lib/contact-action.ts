"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";

export interface ContactFormState {
  error: string | null;
  success: boolean;
}

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // 1. Extract Fields
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const file = formData.get("file") as File | null;
  const turnstileToken = formData.get("turnstile-token") as string | null;

  // 2. Basic Validation
  if (!name || !email || !message) {
    return { error: "Name, email, and message are required.", success: false };
  }
  
  if (file && file.size > 0) {
    if (file.size > 1024 * 1024) {
      return { error: "PDF file must be less than 1MB.", success: false };
    }
    if (file.type !== "application/pdf") {
      return { error: "Only PDF files are allowed.", success: false };
    }
  }

  // 3. Strict Cloudflare Turnstile Verification (Spin Standard)
  if (!turnstileToken) {
    return { error: "Please complete the security verification.", success: false };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
  );

  if (!secretKey || expectedHostnames.size === 0) {
    console.error("[Contact] Missing Turnstile Env variables.");
    return { error: "Server configuration error.", success: false };
  }

  const headersList = await headers();
  const clientIp = headersList.get("x-forwarded-for") ?? "";

  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
        remoteip: clientIp,
      }),
    });

    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    const result = await r.json();

    if (!result.success || result.action !== "contact" || !expectedHostnames.has(result.hostname)) {
      return { error: "Security check failed or expired. Please try again.", success: false };
    }
  } catch (error) {
    console.error("[Contact] Turnstile fetch error:", error);
    return { error: "Security service unavailable.", success: false };
  }

  // 4. Process File Attachment
  const attachments = [];
  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    attachments.push({
      filename: file.name,
      content: buffer,
      contentType: file.type,
    });
  }

  // 5. Send Email via Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || "dev@japatek.space",
      to: "riefkyiqbalm@gmail.com",
      cc: "",
      subject: name, // User's name as the subject
      replyTo: email, // Allows you to reply directly to the user
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0080cc;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone (WA):</strong> ${phone || "<em>Not provided</em>"}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    return { error: null, success: true };
  } catch (error) {
    console.error("[Contact] Email send error:", error);
    return { error: "Failed to send message. Please try again later.", success: false };
  }
}