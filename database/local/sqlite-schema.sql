-- database/local/sqlite-schema.sql
--
-- Canonical SQLite schema for every JaPa client that has OS filesystem
-- access (Desktop hybrid, Mobile via Capacitor, Office-VSTO, CAD ext).
-- Spec: DOCUMENT/Database-Local-Architecture.md §4.1.
--
-- This file is the source of truth. Each surface ships it under its own
-- migration path:
--
--   Desktop  (Tauri)       :  src-tauri/migrations/001_init.sql
--   Mobile   (Android/Room):  android/.../assets/migrations/001_init.sql
--   Mobile   (iOS / GRDB)  :  ios/Migrations/V1__init.sql
--   Office   (VSTO)        :  %APPDATA%/Microsoft/AddIns/JaPa/migrations/001_init.sql
--   CAD      (Win)         :  %APPDATA%/JaPa/CAD/migrations/001_init.sql
--
-- The schema is identical across surfaces; only the on-disk DB path
-- differs (see ./local-paths.ts).
--
-- Migration policy:
--   * Forward-only; numbered files (`002_*`, `003_*`).
--   * Every migration runs in its own transaction.
--   * Schema_version row is updated by the migrator after a successful run.

PRAGMA journal_mode = WAL;          -- crash-safe + concurrent reads
PRAGMA foreign_keys = ON;
PRAGMA synchronous  = NORMAL;       -- WAL + NORMAL = best perf/safety mix


--  sessions
--  Mirrors the cloud `ChatSession_*` row for the user's recent N sessions.
--  Eviction policy is per-surface (Desktop caps at 200; Mobile at 50).
CREATE TABLE IF NOT EXISTS sessions (
    id              TEXT    PRIMARY KEY,           -- ChatSession_*.id from PG (cuid)
    platform        TEXT    NOT NULL,              -- 'WEBSITE' | 'VSCODE_EXT' | ...
    title           TEXT    NOT NULL,
    pinned_at       INTEGER,                       -- unix ms; null = not pinned
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,              -- LWW timestamp for sync
    cloud_synced_at INTEGER                        -- last successful cloud sync; null = dirty
);
CREATE INDEX IF NOT EXISTS sessions_updated_idx
    ON sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS sessions_dirty_idx
    ON sessions(cloud_synced_at) WHERE cloud_synced_at IS NULL;


--  messages
--  One row per turn. `reasoning` is the optional <think>...</think>
--  body  see DOCUMENT/COT_Architecture.md for the contract.
CREATE TABLE IF NOT EXISTS messages (
    id              TEXT    PRIMARY KEY,           -- Message_*.id from PG
    session_id      TEXT    NOT NULL
                            REFERENCES sessions(id) ON DELETE CASCADE,
    role            TEXT    NOT NULL
                            CHECK (role IN ('USER','ASSISTANT')),
    text            TEXT    NOT NULL,
    reasoning       TEXT,                          -- nullable
    created_at      INTEGER NOT NULL,
    cloud_synced_at INTEGER
);
CREATE INDEX IF NOT EXISTS messages_session_created_idx
    ON messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS messages_dirty_idx
    ON messages(cloud_synced_at) WHERE cloud_synced_at IS NULL;


--  attachments
--  Files the user attached to a prompt (PDF, image, code dump, etc.).
--  Bytes live in artifact_root/<session-id>/attachments/<filename>;
--  this row only stores metadata + the SHA-256 hash for cloud de-dup.
CREATE TABLE IF NOT EXISTS attachments (
    id           TEXT    PRIMARY KEY,
    session_id   TEXT    NOT NULL
                         REFERENCES sessions(id) ON DELETE CASCADE,
    file_path    TEXT    NOT NULL,                 -- relative to artifact_root
    mime_type    TEXT,
    size_bytes   INTEGER NOT NULL,
    content_hash TEXT    NOT NULL,                 -- sha256(content)
    created_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS attachments_session_idx
    ON attachments(session_id);


--  artifacts
--  AI-generated outputs (code blocks ripped from replies, images,
--  CAD parts, etc.). Same path scheme as attachments but a separate
--  table so eviction can run on a different TTL.
CREATE TABLE IF NOT EXISTS artifacts (
    id           TEXT    PRIMARY KEY,
    session_id   TEXT    NOT NULL
                         REFERENCES sessions(id) ON DELETE CASCADE,
    kind         TEXT    NOT NULL
                         CHECK (kind IN ('code','image','file','cad-part','cad-asm','script')),
    file_path    TEXT    NOT NULL,                 -- relative to artifact_root
    language     TEXT,                             -- nullable, for `kind = 'code'`
    content_hash TEXT    NOT NULL,
    created_at   INTEGER NOT NULL,
    ttl_at       INTEGER                           -- unix ms; null = never expire
);
CREATE INDEX IF NOT EXISTS artifacts_session_idx
    ON artifacts(session_id);
CREATE INDEX IF NOT EXISTS artifacts_ttl_idx
    ON artifacts(ttl_at) WHERE ttl_at IS NOT NULL;


--  sync_outbox
--  Eventual-consistency queue. Every local mutation that must reach
--  PostgreSQL gets a row; a background worker drains it with retry.
--  `payload` is the JSON shape defined in ./sync-payload.ts.
CREATE TABLE IF NOT EXISTS sync_outbox (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    op        TEXT    NOT NULL
                      CHECK (op IN (
                          'upsert-session',
                          'upsert-message',
                          'delete-session',
                          'delete-message',
                          'upload-artifact'
                      )),
    payload   TEXT    NOT NULL,                    -- JSON
    enqueued  INTEGER NOT NULL,
    attempts  INTEGER NOT NULL DEFAULT 0,
    last_err  TEXT
);


--  schema_version
--  Bumped by the migrator after each forward migration. Read on boot
--  to decide which migrations to apply.
CREATE TABLE IF NOT EXISTS schema_version (
    version       INTEGER PRIMARY KEY,
    applied_at    INTEGER NOT NULL
);
INSERT OR IGNORE INTO schema_version(version, applied_at)
    VALUES (1, strftime('%s','now') * 1000);
