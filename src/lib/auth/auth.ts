/**
 * src/lib/auth/auth.ts
 *
 * Full Auth.js v5 configuration (Node.js runtime only).
 *
 * DO NOT import this file from middleware.ts — use auth.config.ts there.
 */

import NextAuth                     from "next-auth";
import { PrismaAdapter }            from "@auth/prisma-adapter";
import Google                       from "next-auth/providers/google";
import Resend                       from "next-auth/providers/resend";
import Nodemailer                   from "next-auth/providers/nodemailer";
import type { DefaultSession }      from "next-auth";
import type { JWT }                 from "next-auth/jwt";
import type { AdapterUser }         from "next-auth/adapters";
import type { NextAuthConfig }      from "next-auth";

import { authConfig }               from "../proxy-helper";
import { prisma }                   from "@/lib/database/prisma";
import { sendMagicLinkEmail }       from "./email";

// ---------------------------------------------------------------------------
// Re-export types used across the codebase (convenience)
// ---------------------------------------------------------------------------

export type { Session }   from "next-auth";
export type { JWT }       from "next-auth/jwt";

// ---------------------------------------------------------------------------
// Email provider — switches between Resend (dev) and Nodemailer (prod)
// ---------------------------------------------------------------------------

async function sendVerificationRequest({
  identifier: email,
  url,
}: {
  identifier: string;
  url: string;
  provider: unknown;
  theme: unknown;
  request: unknown;
  token: string;
  expires: Date;
}): Promise<void> {
  await sendMagicLinkEmail({ to: email, url });
}

const emailProvider =
  process.env.NODE_ENV === "production"
    ? Nodemailer({
        server: {
          host:   process.env.SMTP_HOST!,
          port:   Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === "false",
          auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
          },
        },
        from:                     process.env.EMAIL_FROM!,
        sendVerificationRequest,
      })
    : Resend({
        apiKey:                   process.env.RESEND_API_KEY!,
        from:                     process.env.EMAIL_FROM!,
        sendVerificationRequest,
      });

// ---------------------------------------------------------------------------
// Core config (merged with edge-safe authConfig)
// ---------------------------------------------------------------------------

const config: NextAuthConfig = {
  ...authConfig,

  pages: {
    signIn:        "/auth/v4/login",
    verifyRequest: "/auth/v4/login",
    error:         "/auth/v4/login",
  },

  adapter: PrismaAdapter(prisma),

  session: {
    strategy:  "jwt",
    maxAge:    30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,       
  },

  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "select_account", access_type: "offline" },
      },
    }),
    emailProvider,
  ],

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.callback-url"
        : "authjs.callback-url",
      options: {
        sameSite: "lax",
        path:     "/",
        secure:   process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Host-authjs.csrf-token"
        : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    authorized: authConfig.callbacks!.authorized!,

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = user as AdapterUser & { role?: string };
        token.id   = dbUser.id;
        token.role = dbUser.role ?? "USER";
        token.email = dbUser.email; // Simpan email ke dalam token
        token.name = dbUser.name;   // Simpan nama ke dalam token
      }

      // Memastikan cookie session (JWT) ikut terupdate jika dipanggil dari klien
      if (trigger === "update" && session?.user) {
        const updated = session.user as { id?: string; role?: string; image?: string; email?: string; name?: string };
        
        if (updated.id)    token.id    = updated.id;
        if (updated.role)  token.role  = updated.role;
        if (updated.email) token.email = updated.email; // Update email di cookie
        if (updated.name)  token.name  = updated.name;  // Update nama di cookie
        
        // Mencegah Base64 masuk saat user mengupdate profile via session.update()
        if (updated.image) {
          token.picture = updated.image.startsWith("data:image") ? null : updated.image;
        }
      }

      // ==========================================================
      // FIX HTTP 431 ERROR: FILTERING GAMBAR BASE64
      // ==========================================================
      if (token.picture && typeof token.picture === "string" && token.picture.startsWith("data:image")) {
        token.picture = null; 
      }

      return token;
    },

    async session({ session, token }: { session: DefaultSession & { user: { id: string; role: string } }; token: JWT }) {
      session.user.id    = token.id    as string ?? "";
      session.user.role  = token.role  as string ?? "USER";
      
      // Sinkronisasi data utama kembali ke session
      if (token.email) session.user.email = token.email;
      if (token.name)  session.user.name  = token.name;
      
      if (token.picture) {
        session.user.image = token.picture;
      }
      
      return session;
    },

    async signIn({ user, account }) {
      if (!user.email) return false;
      if (account?.provider === "google") return true;
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      if (user.id && !user.name && user.email) {
        const localPart = user.email.split("@")[0] ?? "user";
        const displayName = localPart
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        await prisma.user.update({
          where: { id: user.id },
          data:  { name: displayName },
        });
      }
    },
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(config);

export { auth, signIn, signOut, unstable_update };
export const { GET, POST } = handlers;