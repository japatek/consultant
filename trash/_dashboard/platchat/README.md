# JuPut Chat — refactored structure

## File map

```
_lib/
  types.ts               shared TypeScript interfaces
  constants.ts           static demo data (models, suggestions, seed messages)
  artifact.ts            pure code-fence parsing — framework agnostic
  data.ts                server-only: cached session fetch (react cache + unstable_cache)
  cookies.ts             server-only: reads the prefs cookie (react cache, dedupes per request)
  actions.ts             "use server": writes prefs cookie, creates sessions, revalidates tag

_components/
  chat-shell.tsx         "use client" — top-level state owner
  chat-context.tsx       "use client" — PanelProvider/usePanelContext (artifact + code panel state)
  sidebar-chatlist.tsx   "use client", memoized
  chat-header.tsx        "use client", memoized, reads panel context directly
  message-list.tsx       "use client", memoized
  message-item.tsx       "use client", memoized, heavy blocks code-split
  user-bubble.tsx
  prompt-input.tsx       "use client", owns its own text/mic state
  code-panel.tsx         "use client", loaded via next/dynamic, ssr:false
  artifact.tsx           "use client", memoized
[id]/page.tsx            Server Component — entry point, no client JS of its own
```

## Server vs. client

`page.tsx` is the only Server Component. It runs on the server, awaits the
cached sessions list and the cookie-backed preferences, and passes plain
serializable props into `<ChatShell>`. Everything below that is `"use client"`
because the UI is interactive (drag handles, drawers, streaming text) — but the
data it's seeded with was already fetched and cached on the server, so there's
no client-side fetch-on-mount waterfall.

`_lib/data.ts` and `_lib/cookies.ts` import `"server-only"` so a stray
client import fails the build instead of silently shipping server code to the
browser. `_lib/actions.ts` is a Server Actions module (`"use server"`) —
it's how client components mutate cookies/DB state without an API route.

## Caching

- `getSessions` in `data.ts` wraps the data source in `unstable_cache` (tag
  `"chat-sessions"`, `revalidate: 60`) for cross-request caching, then wraps
  *that* in React's `cache()` so a single request that reads sessions from
  multiple places only fetches once.
- `createChatSession` calls `revalidateTag("chat-sessions")` so the next read
  picks up the new row immediately instead of waiting for the 60s window.
- `getChatPreferences` is wrapped in `cache()` for the same per-request dedupe
  reason (cheap here since it's just a cookie read, but it's the right pattern
  if this ever moves to a DB-backed user-preferences table).

## Cookies

Three UI preferences persist across reloads via a single JSON cookie
(`jupot-chat-prefs`): selected model, active session id, and whether the
artifact panel was left open. They're read once on the server
(`getChatPreferences`) and hydrated as initial client state — no flash of
default state on reload. Writes go through the `saveChatPreferences` server
action, called fire-and-forget from the client (model switch, session switch,
artifact toggle) so the UI updates instantly and the cookie catches up in the
background.

## Performance choices

- **State is split by concern.** Panel/artifact state lives in its own
  context (`chat-context.tsx`) instead of the top-level shell, so opening the
  artifact panel doesn't re-render the message list, and vice versa.
- **Typing never re-renders the conversation.** `text`, mic, and web-search
  toggle state live inside `PromptInputBar` itself, not in `ChatShell`. In the
  original file every keystroke re-rendered the entire tree including all
  messages.
- **Messages are memoized per item.** `MessageItem` and `MessageList` are
  wrapped in `memo`, so appending a new message doesn't re-render existing
  ones.
- **Heavy/rare blocks are code-split.** `Sandbox`, `Terminal`, `SchemaDisplay`,
  `EnvironmentVariables`, `StackTrace`, `TestResults`, and `Queue` are loaded
  with `next/dynamic` from inside `message-item.tsx` — most messages never use
  them, so most users never download that JS.
- **`CodePanel` is fully dynamic with `ssr: false`** since it pulls in the
  Shiki-based `CodeBlock`, the single heaviest dependency in this feature. It
  only loads once a message actually contains a code fence.
- **File lookup is `O(1)` per message.** `MessageList` builds a
  `Map<messageKey, ArtifactFile[]>` once via `useMemo` instead of the original
  `artifactFiles.filter(...)` running once per rendered message.
