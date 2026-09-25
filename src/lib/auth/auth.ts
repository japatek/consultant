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
import Nodemailer                   from "next-auth/providers/nodemailer";
import Credentials                  from "next-auth/providers/credentials"; // <-- Ditambahkan
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

// Determine if connection is HTTPS (DO NOT rely solely on NODE_ENV)
const useSecureCookies =
  process.env.AUTH_URL?.startsWith("https://") ??
  process.env.NEXTAUTH_URL?.startsWith("https://") ??
  false;

const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostPrefix   = useSecureCookies ? "__Host-"   : "";

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

// Langsung gunakan Nodemailer tanpa kondisi production/development
const emailProvider = Nodemailer({
  server: {
    host:   process.env.SMTP_HOST!,
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true", // Pastikan true jika pakai port 465, false jika 587
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    logger: true,
    debug:  true
  },
  from: process.env.EMAIL_FROM!,
  sendVerificationRequest,
});
// ---------------------------------------------------------------------------
// Core config (merged with edge-safe authConfig)
// ---------------------------------------------------------------------------

const config: NextAuthConfig = {
  ...authConfig,

  // Force Auth.js to trust reverse proxies (Nginx Ingress / Docker)
  trustHost: true,

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
    
    // ── Ditambahkan: Credentials Provider untuk fungsi Bypass ──
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.email === "bypass@japatek.space") {
          // Cari user di database terlebih dahulu agar ID valid dengan relasi Prisma lainnya
          const user = await prisma.user.findUnique({
            where: { email: "bypass@japatek.space" }
          });

          if (user) {
            return {
              id: user.id,
              name: user.name || "Bypass Admin",
              email: user.email,
              role: (user as any).role || "USER", 
            };
          }

          // Jika tidak ada di database, gunakan mock user sementara
          return { 
            id: "bypass-admin-mock-id", 
            name: "Admin Bypass", 
            email: "bypass@japatek.space",
            role: "USER"
          };
        }
        return null;
      }
    })
  ],

  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        sameSite: "lax",
        path:     "/",
        secure:   useSecureCookies,
      },
    },
    csrfToken: {
      name: `${hostPrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path:     "/",
        secure:   useSecureCookies,
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
        token.email = dbUser.email;
        token.name = dbUser.name;
      }

      if (trigger === "update" && session?.user) {
        const updated = session.user as { id?: string; role?: string; image?: string; email?: string; name?: string };
        
        if (updated.id)    token.id    = updated.id;
        if (updated.role)  token.role  = updated.role;
        if (updated.email) token.email = updated.email;
        if (updated.name)  token.name  = updated.name;
        
        if (updated.image) {
          token.picture = updated.image.startsWith("data:image") ? null : updated.image;
        }
      }

      if (token.picture && typeof token.picture === "string" && token.picture.startsWith("data:image")) {
        token.picture = null; 
      }

      return token;
    },

    async session({ session, token }: { session: DefaultSession & { user: { id: string; role: string } }; token: JWT }) {
      session.user.id    = token.id    as string ?? "";
      session.user.role  = token.role  as string ?? "USER";
      
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
      if (account?.provider === "credentials") return true; // Izinkan bypass credentials
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