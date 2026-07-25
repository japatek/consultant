# `database/local/` — Shared local-storage foundation

This module is the **single source of truth** for the on-device data
layer used by every JaPaTek client surface. It implements the design
in [DOCUMENT/Database-Local-Architecture.md](../../DOCUMENT/Database-Local-Architecture.md).

| File | Purpose | Used by |
|---|---|---|
| [sqlite-schema.sql](sqlite-schema.sql) | DDL for the SQLite database (sessions, messages, attachments, artifacts, sync_outbox, schema_version) | Desktop, CLI, Office-VSTO, CAD, Mobile |
| [idb-schema.ts](idb-schema.ts)         | IndexedDB object-store types + `openJaPaTekDB()` helper                                                | Browser ext, Office WebView, Web app |
| [sync-payload.ts](sync-payload.ts)     | JSON wire-format for the `sync_outbox` queue                                                          | All surfaces |
| [local-paths.ts](local-paths.ts)       | Per-surface artifact-root resolver                                                                    | Filesystem surfaces |

## Per-surface adoption

### Desktop hybrid (Tauri)

1. Copy [sqlite-schema.sql](sqlite-schema.sql) into [src-tauri/migrations/001_init.sql](../../src-tauri/migrations/001_init.sql).
2. In `main.rs`, resolve the DB path with the `desktop` surface:
   ```ts
   import { resolveLocalPaths } from "@JaPaTek/local/local-paths";
   const paths = resolveLocalPaths("desktop");
   ```
3. Open the SQLite file with `rusqlite::Connection::open(paths.sqliteFile)` and run all `migrations/*.sql` in order; bump `schema_version` after each.
4. Wire `sync-payload.ts` types into the Tauri `commands` module so the JS side can `await invoke("enqueue_sync", payload)`.

### Terminal CLI (`terminal-chat/`)

1. Bundle `sqlite-schema.sql` into the npm package under `dist/migrations/001_init.sql`.
2. On boot:
   ```ts
   import { resolveLocalPaths } from "../../database/local/local-paths";
   const paths = resolveLocalPaths("cli");
   // paths.root === ~/.config/JaPaTek-cli
   ```
3. Reuse the existing `history.json` writer until SQLite is wired; then migrate by inserting the JSON entries into `sessions` / `messages`.

### Browser extension (`wxt-browser-extension/`)

1. `pnpm add idb`
2. Call `openJaPaTekDB("JaPaTekDB")` from the background service worker on install.
3. Store the auth token in `chrome.storage.session` (memory-only); never in IDB.
4. Drain `syncOutbox` with `chrome.alarms.create("JaPa-sync", { periodInMinutes: 1 })`.

### IDE extension (`vscode-ext/`)

1. The host gives you a sandboxed path:
   ```ts
   const root = ctx.globalStorageUri.fsPath;
   const paths = resolveLocalPaths("ide", root);
   ```
2. Use [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) and apply `migrations/001_init.sql`.
3. Reuse the existing `chatOpts.thinking` plumbing — the new `messages.reasoning` column is where `<think>...</think>` bodies persist.

### Office add-in (`office-extension/`)

* **VSTO build (Windows desktop Office)**: filesystem-backed — use `resolveLocalPaths("office")`, ship the SQLite migrations like Desktop.
* **Office-web / Mac**: WebView-only — use [`openJaPaTekDB("JaPaOffice")`](idb-schema.ts) instead.

### CAD add-in (`cad-extension/`)

1. `resolveLocalPaths("cad")` resolves to `%APPDATA%/JaPa/CAD`.
2. SolidWorks/Inventor parts produced from chat go under `paths.artifacts/<sessionId>/`, with the `artifacts.kind` set to `cad-part` or `cad-asm`.
3. The cloud upload step uses the `upload-artifact` sync op.

### Mobile (Capacitor — `mobile-app/`)

1. `pnpm add @capacitor-community/sqlite`
2. Resolve the platform path:
   ```ts
   import { Capacitor } from "@capacitor/core";
   const surface = Capacitor.getPlatform() === "ios" ? "mobile-ios" : "mobile-and";
   const paths   = resolveLocalPaths(surface);
   ```
3. Cap the local cache aggressively (50 sessions) and let the rest live in the cloud.

## Sync worker contract

Every surface ships a background worker that:

1. `SELECT * FROM sync_outbox ORDER BY id LIMIT 16;`
2. For each row, `POST` the `payload` to `SYNC_ENDPOINTS[op]` on the Flask backend.
3. On `2xx` → `DELETE FROM sync_outbox WHERE id = ?`.
4. On `409 conflict` → adopt server row (last-writer-wins by `updatedAt`) then delete the outbox row.
5. On `5xx` → bump `attempts`, persist `last_err`, sleep `RETRY_BACKOFF_MS[attempts]` ms.

## Schema migrations

Forward-only, numbered files:

```
migrations/
  001_init.sql           ← copy of sqlite-schema.sql
  002_add_pinned.sql     ← future
  003_add_vector.sql     ← future (Qdrant local index pointer)
```

The migrator reads `schema_version` and replays every file whose numeric prefix is `> schema_version.version`, then bumps the row. Every migration runs in a transaction.

## What this module does **not** own

- **Auth tokens** — stored in the OS keychain via each surface's native plugin (DPAPI / Keychain / GNOME Keyring / Android Keystore).
- **The cloud Prisma schema** — that lives under [website/prisma/schema.prisma](../../website/prisma/schema.prisma) and is the source of truth for the server.
- **Embedding / vector storage** — staged for Qdrant; see [DOCUMENT/Database-Local-Architecture.md §6](../../DOCUMENT/Database-Local-Architecture.md).
