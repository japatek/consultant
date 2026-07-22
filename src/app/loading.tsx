/**
 * src/app/(main)/loading.tsx
 * https://nextjs.org/docs/app/api-reference/file-conventions/loading
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  ONE FILE COVERS THE ENTIRE (main) ROUTE GROUP                      │
 * │                                                                     │
 * │  Next.js hoists a loading.tsx to every route segment below it via  │
 * │  an automatic <Suspense> boundary. Placing this at the route-group  │
 * │  level means you do NOT need per-page loading files for:           │
 * │                                                                     │
 * │    /dashboard                 ← covered                             │
 * │    /dashboard/platchat        ← covered                             │
 * │    /dashboard/platchat/[id]   ← covered                             │
 * │    /unauthorized              ← covered                             │
 * │                                                                     │
 * │  To override for a specific segment (e.g. a custom chat skeleton),  │
 * │  simply add a loading.tsx inside that folder — Next.js will prefer  │
 * │  the nearest one.                                                   │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Design: mirrors the dashboard shell (sidebar + header + content) so
 * there is zero layout shift when the real page streams in.
 */

export default function MainGroupLoading(): React.JSX.Element {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        aria-hidden="true"
        className="hidden w-60 shrink-0 flex-col gap-2 border-r border-border/40 bg-card/60 px-3 py-5 md:flex"
      >
        {/* Logo placeholder */}
        <div className="mb-3 h-8 w-28 animate-pulse rounded-lg bg-muted" />

        {/* Nav items */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="size-4 shrink-0 animate-pulse rounded bg-muted" />
            <div
              className="h-3.5 animate-pulse rounded bg-muted"
              style={{ width: `${48 + (i % 4) * 14}px` }}
            />
          </div>
        ))}

        {/* Bottom user row */}
        <div className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-14 animate-pulse rounded bg-muted/60" />
          </div>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header
          aria-hidden="true"
          className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-card/40 px-5"
        >
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="size-8 animate-pulse rounded-lg bg-muted" />
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          </div>
        </header>

        {/* Content skeleton */}
        <main
          aria-busy="true"
          aria-label="Loading page content"
          className="flex-1 overflow-y-auto p-5"
        >
          {/* Row of cards */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border/30 bg-card/60"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Content rows */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl border border-border/20 bg-card/40"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}