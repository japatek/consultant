// database/local/sync-payload.ts
//
// Wire-format types for the `sync_outbox` queue.  Spec:
// DOCUMENT/Database-Local-Architecture.md §5.
//
// Producer side (every client surface):
//   * Push one of the *Payload types into `sync_outbox.payload` as
//     JSON.stringify(...) when a local mutation happens.
//
// Consumer side (the background sync worker, also per-surface):
//   * Pop the oldest row, parse, dispatch to POST /api/sync/* on the
//     Flask backend, then DELETE the outbox row on 2xx.
//
// Server contract: every endpoint accepts the matching payload as the
// raw request body, returns 200 with `{ ok: true, cloudId?: string }`
// or 409 with `{ ok: false, reason: "conflict", winner: <full row> }`.
// On 409 the client adopts the server row (last-writer-wins by
// `updatedAt`); on 5xx the worker leaves the row in the outbox,
// increments `attempts`, and applies exponential backoff.

export type SyncOp =
  | "upsert-session"
  | "upsert-message"
  | "delete-session"
  | "delete-message"
  | "upload-artifact";


//  Per-op payload shapes  one type per `op`.

export interface UpsertSessionPayload {
  op:        "upsert-session";
  id:        string;
  platform:  "WEBSITE" | "BROWSER_EXT" | "VSCODE_EXT" | "OFFICE_EXT"
           | "SOLIDWORKS_EXT" | "INVENTOR_EXT" | "DESKTOP" | "MOBILE" | "CLI";
  title:     string;
  pinnedAt:  number | null;
  createdAt: number;
  updatedAt: number;                  // LWW key
}

export interface UpsertMessagePayload {
  op:         "upsert-message";
  id:         string;
  sessionId:  string;
  role:       "USER" | "ASSISTANT";
  text:       string;
  reasoning?: string;
  createdAt:  number;
}

export interface DeleteSessionPayload {
  op:        "delete-session";
  id:        string;
  deletedAt: number;
}

export interface DeleteMessagePayload {
  op:        "delete-message";
  id:        string;
  sessionId: string;
  deletedAt: number;
}

export interface UploadArtifactPayload {
  op:           "upload-artifact";
  id:           string;
  sessionId:    string;
  kind:         "code" | "image" | "file" | "cad-part" | "cad-asm" | "script";
  mimeType?:    string;
  contentHash:  string;                 // sha256; server may 304 if already known
  /** Base64-encoded payload. Worker decides chunking for >5MB. */
  contentB64:   string;
  createdAt:    number;
}

export type SyncPayload =
  | UpsertSessionPayload
  | UpsertMessagePayload
  | DeleteSessionPayload
  | DeleteMessagePayload
  | UploadArtifactPayload;


//  Server-side response shapes.

export interface SyncOkResponse {
  ok:       true;
  cloudId?: string;                     // server-assigned id when creating
}

export interface SyncConflictResponse {
  ok:     false;
  reason: "conflict";
  winner: UpsertSessionPayload | UpsertMessagePayload;
}

export interface SyncErrorResponse {
  ok:     false;
  reason: "auth" | "rate-limited" | "server-error" | "validation";
  detail?: string;
}

export type SyncResponse =
  | SyncOkResponse
  | SyncConflictResponse
  | SyncErrorResponse;


/** Map a `SyncOp` to its Flask endpoint. Worker uses this when
 *  draining the outbox so every surface POSTs to the same URLs. */
export const SYNC_ENDPOINTS: Record<SyncOp, string> = {
  "upsert-session":  "/api/sync/sessions",
  "upsert-message":  "/api/sync/messages",
  "delete-session":  "/api/sync/sessions/delete",
  "delete-message":  "/api/sync/messages/delete",
  "upload-artifact": "/api/sync/artifacts",
};


/** Retry schedule, in ms, indexed by `attempts`.  After the last
 *  entry the worker should hold the row indefinitely and surface
 *  the error to the user. */
export const RETRY_BACKOFF_MS: readonly number[] = [
   2_000,        //  2s
   8_000,        //  8s
  30_000,        // 30s
  120_000,       //  2m
  600_000,       // 10m
];
