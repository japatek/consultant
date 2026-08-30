/**
 * src/lib/auth/auth.ts
 *
 * Full Auth.js v5 configuration (Node.js runtime only).
 *
 * DO NOT import this file from middleware.ts — use auth.config.ts there.
 */

import NextAuth                     from "next-auth";
import { PrismaAdapter }            from "@auth/prisma-adapter";
import Credentials                  from "next-auth/providers/credentials";
import type { DefaultSession }      from "next-auth";
import type { JWT }                 from "next-auth/jwt";
import type { AdapterUser }         from "next-auth/adapters";
import type { NextAuthConfig }      from "next-auth";

import { authConfig }               from "../proxy-helper";
import { prisma }                   from "@/lib/database/prisma";

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

// ── HARDCODED ADMIN DICTIONARY ───────────────────────────────────────────
const ADMIN_DATA: Record<string, string> = {
  "writer": "iqbalm"
};

// ---------------------------------------------------------------------------
// Core config (merged with edge-safe authConfig)
// ---------------------------------------------------------------------------

const config: NextAuthConfig = {
  ...authConfig,

  // Force Auth.js to trust reverse proxies (Nginx Ingress / Docker)
  trustHost: true,

  pages: {
    signIn:        "/auth/v4/login",
    error:         "/auth/v4/login",
  },

  adapter: PrismaAdapter(prisma),

  session: {
    strategy:  "jwt",
    maxAge:    30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,       
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;

        if (!username || !password) return null;

        // Verify against the hardcoded dictionary
        if (ADMIN_DATA[username] === password) {
          // Return a constructed user object for the JWT session
          return {
            id: `admin-${username}`,
            name: username,
            email: `${username}@japatek.space`,
            role: "ADMIN" // Assign admin privileges automatically
          };
        }
        
        // Return null if validation fails
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
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(config);

export { auth, signIn, signOut, unstable_update };
export const { GET, POST } = handlers;