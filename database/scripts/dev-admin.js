// Wrapper that boots a SECOND `next dev` instance for the admin host.
//
// Why this exists: Next.js 16 enforces one dev server per project via a PID
// lock under .next/dev/. Running `next dev -p 3001` after `next dev -p 3000`
// fails with "Another next dev server is already running". We sidestep that
// by giving the admin instance its own distDir, which moves the lock to a
// different path. next.config.ts reads NEXT_DIST_DIR  set it here.
//
// Stays in pure Node so we don't add a cross-env dependency. The repo's
// package.json has a pre-existing typo (`@JaPa/ui` invalid casing) that
// breaks `npm install`, so any new dep is a maintenance hazard.

const { spawn } = require("node:child_process");

const PORT     = process.env.ADMIN_DEV_PORT   ?? "3001";
const DIST_DIR = process.env.NEXT_DIST_DIR    ?? ".next-admin";

const child = spawn("npx", ["next", "dev", "-p", PORT], {
  stdio: "inherit",
  shell: true,
  env:   { ...process.env, NEXT_DIST_DIR: DIST_DIR },
});

child.on("exit", (code) => process.exit(code ?? 0));
