// database/local/idb-schema.ts
//
// Canonical IndexedDB schema for JaPa clients that run inside a
// browser / Office WebView sandbox (no filesystem access). Spec:
// DOCUMENT/Database-Local-Architecture.md §4.2.
//
// Consumers:
//   * wxt-browser-extension/   → opens DB name "JaPaDB"
//   * office-extension/        → opens DB name "JaPaOffice"
//   * web app (offline cache)  → opens DB name "JaPaWeb"
//
// Backed by the `idb` library (https://github.com/jakearchibald/idb).
// Each surface installs `idb` itself; this module only describes the
// shape + provides the typed `openJaPaDB()` boot helper.
//
//   import { openJaPaDB } from "@JaPa/local/idb-schema";
//   const db = await openJaPaDB("JaPaDB");
//   await db.put("sessions", { id: "...", ... });
//
// Code blocks and Base64 images larger than 50 KB live in the
// `caches` API keyed by `contentHash`; this module stores the cache
// URL in `artifacts.blobRef` and provides a `putArtifactBlob()` helper
// that handles the cache + IDB write atomically.

import { type DBSchema, type IDBPDatabase, openDB } from "idb";


//  Schema version
//  Bumping this triggers the migration in `upgrade(db, oldVersion)` below.
//  Forward-only  every bump must add a `case oldVersion + 1` branch.
const SCHEMA_VERSION = 1;

const BLOB_INLINE_THRESHOLD_BYTES = 50 * 1024;     // 50 KB  bigger goes to Cache API


//  Object-store types  shared by browser-ext, office-ext, web.

export interface IdbSession {
  id:           string;                       // ChatSession_*.id from cloud (cuid)
  platform:     "WEBSITE" | "BROWSER_EXT" | "VSCODE_EXT" | "OFFICE_EXT"
              | "SOLIDWORKS_EXT" | "INVENTOR_EXT";
  title:        string;
  pinnedAt:     number | null;                // unix ms; null = not pinned
  createdAt:    number;
  updatedAt:    number;                       // LWW timestamp
  syncedAt:     number | null;                // null = dirty, not yet pushed
}

export interface IdbMessage {
  id:           string;                       // Message_*.id from cloud
  sessionId:    string;
  role:         "USER" | "ASSISTANT";
  text:         string;
  reasoning?:   string;                       // <think>...</think> body
  createdAt:    number;
  syncedAt:     number | null;
}

export interface IdbArtifact {
  id:           string;                       // local uuid; cloud assigns on upload
  sessionId:    string;
  kind:         "code" | "image" | "file";
  mimeType?:    string;
  sizeBytes:    number;
  contentHash:  string;                       // sha256 of the raw bytes
  /** Pointer into the `caches` API for blobs >50 KB. Empty string when
   *  the content sits inline in `inlineContent` instead. */
  blobRef:      string;
  /** Inline storage for small payloads (<50 KB). Avoids the
   *  caches-api round-trip cost on quick reads. */
  inlineContent?: string;
  createdAt:    number;
}

export interface IdbSyncJob {
  id?:        number;                         // autoIncrement
  op:         "upsert-session" | "upsert-message"
            | "delete-session" | "delete-message"
            | "upload-artifact";
  payload:    unknown;                        // shape lives in ./sync-payload.ts
  enqueued:   number;
  attempts:   number;
  lastErr?:   string;
}


//  DBSchema  drives the typed openDB() return value below.

export interface JaPaDBSchema extends DBSchema {
  sessions: {
    key:     string;
    value:   IdbSession;
    indexes: {
      byUpdated: number;                      // updatedAt DESC
      byDirty:   number;                      // syncedAt = null  surrogate via 0/1
    };
  };
  messages: {
    key:     string;
    value:   IdbMessage;
    indexes: {
      bySession:    [string, number];         // (sessionId, createdAt)
      byDirty:      number;
    };
  };
  artifacts: {
    key:     string;
    value:   IdbArtifact;
    indexes: {
      bySession:    string;
    };
  };
  syncOutbox: {
    key:     number;
    value:   IdbSyncJob;
    indexes: { byAttempts: number };
  };
}


/** Open (or upgrade) the JaPa IndexedDB at the given name. Repeated
 *  calls cheap-cache the connection inside the browser  the underlying
 *  `idb` library returns the same wrapper for the same db name. */
export async function openJaPaDB(
  dbName: "JaPaDB" | "JaPaOffice" | "JaPaWeb",
): Promise<IDBPDatabase<JaPaDBSchema>> {
  return openDB<JaPaDBSchema>(dbName, SCHEMA_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const sessions = db.createObjectStore("sessions", { keyPath: "id" });
        sessions.createIndex("byUpdated", "updatedAt");
        // `byDirty` is materialised as 0|1 in the put() helper below
        // because IndexedDB indexes can't directly express `null`.
        sessions.createIndex("byDirty",   "syncedAt");

        const messages = db.createObjectStore("messages", { keyPath: "id" });
        messages.createIndex("bySession", ["sessionId", "createdAt"]);
        messages.createIndex("byDirty",   "syncedAt");

        const artifacts = db.createObjectStore("artifacts", { keyPath: "id" });
        artifacts.createIndex("bySession", "sessionId");

        const outbox = db.createObjectStore("syncOutbox",
          { keyPath: "id", autoIncrement: true });
        outbox.createIndex("byAttempts", "attempts");
      }
      // Future migrations: `if (oldVersion < 2) { ... }` etc.
    },
  });
}


/** Write an artifact: small payloads go inline into IDB; large ones
 *  go into the `caches` API (faster reads for blobs >50 KB). One
 *  helper to coordinate the two stores atomically. */
export async function putArtifactBlob(
  db:       IDBPDatabase<JaPaDBSchema>,
  artifact: Omit<IdbArtifact, "blobRef" | "inlineContent" | "sizeBytes">,
  content:  Blob,
): Promise<IdbArtifact> {
  const sizeBytes = content.size;

  if (sizeBytes <= BLOB_INLINE_THRESHOLD_BYTES) {
    const inlineContent = await content.text();
    const row: IdbArtifact = { ...artifact, sizeBytes, blobRef: "", inlineContent };
    await db.put("artifacts", row);
    return row;
  }

  //  >50 KB  store in the Cache API, keep only the URL in IDB.
  const cacheName = "JaPa-artifacts-v1";
  const cache     = await caches.open(cacheName);
  const url       = `https://JaPa.local/artifact/${artifact.id}`;
  await cache.put(url, new Response(content));
  const row: IdbArtifact = { ...artifact, sizeBytes, blobRef: url };
  await db.put("artifacts", row);
  return row;
}


/** Read an artifact's bytes regardless of whether it lives inline or
 *  in the Cache API. Returns null when the artifact id is unknown. */
export async function readArtifactBlob(
  db: IDBPDatabase<JaPaDBSchema>,
  id: string,
): Promise<Blob | null> {
  const row = await db.get("artifacts", id);
  if (!row) return null;
  if (row.inlineContent !== undefined) {
    return new Blob([row.inlineContent], { type: row.mimeType ?? "text/plain" });
  }
  if (row.blobRef) {
    const cache = await caches.open("JaPa-artifacts-v1");
    const resp  = await cache.match(row.blobRef);
    if (!resp) return null;
    return await resp.blob();
  }
  return null;
}
