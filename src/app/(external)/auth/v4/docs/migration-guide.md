# Auth.js v5 Migration — Complete Runbook

## 1. Package Changes

```bash
# Remove v4 packages
npm uninstall next-auth @prisma/client

# Install v5 packages
npm install next-auth@beta @auth/prisma-adapter

# Email (keep Resend for dev)
npm install resend @react-email/components @react-email/render

# Production SMTP
npm install nodemailer
npm install --save-dev @types/nodemailer

# GoCaptcha React widget
npm install go-captcha-react
```

---

## 2. Files to DELETE from your old system

These are superseded entirely by the new files in this package:

```
src/lib/auth/auth-server.ts            ← replaced by auth.ts + auth.config.ts
app/api/auth/[...nextauth]/route.ts    ← replaced (content changed to 2 lines)
app/auth/v3/google-oauth-popup/        ← DELETE (popup flow removed)
app/auth/verify-email/page.tsx         ← DELETE (Auth.js handles callback internally)
app/register-confirmation/             ← DELETE (no more custom OTP registration)
app/api/auth/send-login-link/          ← DELETE (Auth.js email provider replaces this)
app/api/auth/send-register-code/       ← DELETE (OTP registration removed entirely)
app/api/auth/verify-register-code/     ← DELETE (OTP registration removed entirely)
app/api/auth/verify-login-link/        ← DELETE (Auth.js handles token verification)
context/auth-context.tsx               ← REPLACE (Auth.js v5 useSession replaces this)
```

---

## 3. Auth Context — Replacing the Custom AuthProvider

With Auth.js v5, **you no longer need a custom AuthProvider or cookie management**.
Auth.js manages the session cookie (`HttpOnly`, `Secure`, `SameSite=Lax`) automatically.

**Replace your existing `AuthProvider` wrapper with Auth.js's `SessionProvider`:**

```tsx
// src/app/layout.tsx  (or your root layout)
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

**Reading the session in a Client Component:**
```tsx
"use client";
import { useSession } from "next-auth/react";

export function UserAvatar() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Spinner />;
  if (!session) return null;
  return <img src={session.user.image ?? ""} alt={session.user.name ?? ""} />;
}
```

**Reading the session in a Server Component:**
```tsx
// No "use client" — this runs on the server
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <h1>Hello, {session.user.name}</h1>;
}
```

**Logout button (Client Component):**
```tsx
"use client";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign out
    </button>
  );
}
```

---

## 4. Prisma Migration

```bash
# Merge prisma/auth-schema.prisma into your existing schema.prisma, then:
npx prisma migrate dev --name add_authjs_v5_models
npx prisma generate
```

If you have existing users in the old custom tables, write a data migration script
to move them into the new `users` / `accounts` / `verification_tokens` tables.

---

## 5. Email Templates to Create

You need two React Email components (not included here — use your existing design):

```
src/components/emails/MagicLinkEmail.tsx
  Props: { magicLinkUrl: string; appName: string }

src/components/emails/ChangeEmailTemplate.tsx
  Props: { newEmail: string; currentEmail: string; verificationUrl: string; appName: string }
```

---

## 6. Change Email — Client Usage

```tsx
// In a settings Server Action or Client Component:
const res = await fetch("/api/user/change-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  // Auth.js session cookie is sent automatically (same-origin)
  body: JSON.stringify({ newEmail: "new@example.com" }),
});
const data = await res.json();
// data.message = "A confirmation link has been sent to your new email address."
```

---

## 7. GoCaptcha — Quick-Start

1. Run the Go captcha server (see https://github.com/wenlng/go-captcha).
2. Set `GOCAPTCHA_API_URL` and `GOCAPTCHA_SECRET` in `.env.local`.
3. The `/api/captcha/get` proxy route fetches challenges server-side.
4. `GoCaptchaSlide.tsx` renders the widget.  
   Adjust `config.width` / `config.height` to match your design.

---

## 8. Security Summary — What Changed

| Concern                    | Before (v4)                        | After (v5)                          |
|----------------------------|------------------------------------|-------------------------------------|
| Session cookie             | SameSite=None, no Secure           | SameSite=Lax, Secure in production  |
| Cookie prefix              | none                               | `__Secure-` / `__Host-` in prod     |
| Magic-link token in DB     | Raw hex string                     | SHA-256 hash (built-in to Auth.js)  |
| Token invalidation         | Manual, inconsistent               | deleteMany before every new request |
| CSRF protection            | None on custom routes              | Auth.js built-in CSRF token         |
| Registration               | Separate OTP flow + custom APIs    | Unified with magic-link (auto-create)|
| Middleware DB access       | Hit DB on every request            | Edge JWT — no DB hit in middleware  |
| User enumeration           | Different responses per email      | Identical "check inbox" for all     |
| Brute-force protection     | None                               | GoCaptcha Slide puzzle (server-side)|
