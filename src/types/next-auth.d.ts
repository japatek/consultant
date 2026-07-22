/**
 * src/types/next-auth.d.ts
 *
 * Auth.js v5 module augmentation.
 * Extends the built-in Session, User, and JWT interfaces with
 * the custom fields we attach in our callbacks (auth.ts).
 *
 * Must be referenced by tsconfig.json:

*/
import type { DefaultSession } from "next-auth";

// ---------------------------------------------------------------------------
// next-auth — Session & User
// ---------------------------------------------------------------------------

declare module "next-auth" {
  /**
   * Returned by `auth()`, `useSession()`, and exposed to the client.
   * Only add fields that are SAFE to expose to the browser.
   */
  interface Session {
    user: {
      /** Database primary key (cuid). */
      id: string;
      /** Application role — "USER" | "ADMIN" | "MODERATOR". */
      role: string;
    } & DefaultSession["user"]; // keeps: name, email, image
  }

  /**
   * The raw user object returned by the database adapter.
   * We extend it with the `role` column we added to the Prisma schema.
   */
  interface User {
    role?: string;
  }
}

// ---------------------------------------------------------------------------
// next-auth/jwt — JWT token payload
// ---------------------------------------------------------------------------

declare module "next-auth/jwt" {
  /**
   * JWT payload stored in the encrypted session cookie.
   * Keep this minimal — it is decoded on every middleware invocation.
   */
  interface JWT {
    /** Maps to User.id from the database. */
    id?: string;
    /** Persisted role for fast route-guard checks without a DB hit. */
    role?: string;
  }
}
