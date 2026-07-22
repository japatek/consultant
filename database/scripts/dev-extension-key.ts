// website/scripts/dev-extension-key.ts
//
// DEV ONLY. Generates the unified `JaPa_pk_*` API key used by every
// JaPa extension (WXT browser, VSCode, Office, Solidworks, Inventor)
// and prints the plain value to the terminal so you can paste it into
// each extension's auth prompt during local testing.
//
// Bypasses the website's Pro-tier gate that the production POST
// /api/extension-key endpoint enforces  this script writes directly via
// Prisma. Don't ship this anywhere outside a dev machine.
//
//   npm run key:dev                 use the first User in the DB
//   npm run key:dev -- test@x.com   pick by email
//   npm run key:dev -- --user-id=ckxyz
//
// Paste the printed key into:
//   * WXT browser extension  options page  "API key" input
//   * VSCode extension       Cmd Palette  "JaPa: Open Chat"  paste when prompted
//   * Office / SW / Inventor settings dialog  "API key" field

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateExtensionKey } from "../src/lib/extension-key";

async function resolveUserId(arg: string | undefined): Promise<string> {
  if (arg?.startsWith("--user-id=")) {
    const id = arg.slice("--user-id=".length).trim();
    const u = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
    if (!u) throw new Error(`No user with id ${id}`);
    console.log(`  user: ${u.email} (${u.id})`);
    return u.id;
  }
  if (arg && arg.includes("@")) {
    const u = await prisma.user.findUnique({ where: { email: arg.trim() }, select: { id: true, email: true } });
    if (!u) throw new Error(`No user with email ${arg}`);
    console.log(`  user: ${u.email} (${u.id})`);
    return u.id;
  }
  // Default: pick the most-recently-created user. Stable for a fresh `db:reset:seed`.
  const u = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
    select:  { id: true, email: true },
  });
  if (!u) throw new Error("No users in the database. Run `npm run db:init` first.");
  console.log(`  user: ${u.email} (${u.id})  [default: most recent]`);
  return u.id;
}

async function main() {
  const arg = process.argv[2];
  const userId = await resolveUserId(arg);
  const gen = await generateExtensionKey(userId);

  console.log("");
  console.log("  Generated extension API key");
  console.log("  ----------------------------------------------------------");
  console.log(`  ${gen.plain}`);
  console.log("  ----------------------------------------------------------");
  console.log(`  display:    ${gen.display}`);
  console.log(`  createdAt:  ${gen.createdAt.toISOString()}`);
  console.log("");
  console.log("  This key works for ALL JaPa extensions (browser, VSCode,");
  console.log("  Office, Solidworks, Inventor). Paste it into each extension's");
  console.log("  API key input. Regenerating invalidates the previous key.");
  console.log("");
}

main()
  .catch((err) => {
    console.error("  Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
