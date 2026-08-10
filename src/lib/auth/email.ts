/**
 * src/lib/auth/email.ts
 *
 * Email transport layer.
 * Uses Nodemailer (AWS SES / SMTP) exclusively for all environments,
 * sharing a single React Email template.
 *
 * Usage:
 * import { sendMagicLinkEmail, sendChangeEmailVerification, sendOTPEmail } from "@/lib/auth/email";
 */

import nodemailer      from "nodemailer";
import { render }      from "@react-email/render";
import MagicLinkEmail  from "@/components/template-email/login-link-email";
import ChangeEmailTemplate from "@/components/template-email/EmailChanges";
import RegisterCodeEmail   from "@/components/template-email/register-code-email";

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

const FROM     = process.env.EMAIL_FROM    ?? "JaPaTek <dev@japatek.space>";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "JaPaTek";

// ---------------------------------------------------------------------------
// Transport factory
// ---------------------------------------------------------------------------

/**
 * Lazy-initialised Nodemailer transporter.
 */
function getNodemailerTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST!,
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

// ---------------------------------------------------------------------------
// Core send utility
// ---------------------------------------------------------------------------

interface SendOptions {
  to:      string;
  subject: string;
  html:    string;
  text:    string;
}

async function send(opts: SendOptions): Promise<void> {
  // ── Always use Nodemailer for both Dev and Prod ─────────────────────────
  const transporter = getNodemailerTransporter();
  await transporter.sendMail({
    from:    FROM,
    to:      opts.to,
    subject: opts.subject,
    html:    opts.html,
    text:    opts.text,
  });
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Sends the Auth.js magic-link verification email.
 * Called by the Resend/Nodemailer provider's `sendVerificationRequest`.
 */
export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to:  string;
  url: string;
}): Promise<void> {
  const element = MagicLinkEmail({ name: to, loginUrl: url, appName: APP_NAME });
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  await send({
    to,
    subject: `Your ${APP_NAME} sign-in link`,
    html,
    text,
  });
}

/**
 * Sends a verification email to the NEW address when a user requests
 * an email change. The link points to our custom verify-email-change endpoint.
 */
export async function sendChangeEmailVerification({
  name,
  to,
  currentEmail,
  verifyUrl,
}: {
  name:            string;
  to:              string;
  currentEmail:    string;
  verifyUrl:       string;
}): Promise<void> {
  const element = ChangeEmailTemplate({
    name: name,
    newEmail:        to,
    currentEmail,
    verifyUrl,
    appName:         APP_NAME,
  });
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  await send({
    to,
    subject: `Confirm your new ${APP_NAME} email address`,
    html,
    text,
  });
}

/**
 * Sends a 6-digit OTP code to the user's email.
 * Used for email changes, registration, or 2FA.
 */
export async function sendOTPEmail(to: string, code: string): Promise<void> {
  const element = RegisterCodeEmail({ code });
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  await send({
    to,
    subject: `Your ${APP_NAME} verification code: ${code}`,
    html,
    text,
  });
}