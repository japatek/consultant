import type { ReactNode }  from "react";
import type { Metadata }   from "next";
import { cookies }         from "next/headers";

import { Toaster }                  from "@/components/ui/sonner";
import { TooltipProvider }          from "@/components/ui/tooltip";
import { APP_CONFIG }               from "@/config/app-config";
import { fontVars }                 from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS }      from "@/lib/preferences/preferences-config";
import { THEME_MODE_VALUES }        from "@/lib/preferences/theme";
import { THEME_PRESET_VALUES }      from "@/lib/preferences/theme";
import { getThemeBootCode }         from "@/scripts/theme-boot";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { SessionProvider }          from "next-auth/react";


import "./globals.css";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title:       APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely cast a raw cookie string to a validated enum type.
 * Falls back to `fallback` when the value is absent or not in `allowed`.
 */
function safeEnum<T extends string>(
  raw:      string | undefined,
  allowed:  readonly T[],
  fallback: T,
): T {
  return (allowed as readonly string[]).includes(raw!) ? (raw as T) : fallback;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

// async is required to call cookies() from next/headers
export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {

  // ── Read every preference from its cookie ──────────────────────────────────
  // cookies() returns a ReadonlyRequestCookies during SSR.
  // Missing cookie → falls back to PREFERENCE_DEFAULTS.
  const jar = await cookies();

  const theme_mode = safeEnum(
    jar.get("theme_mode")?.value,
    THEME_MODE_VALUES,
    PREFERENCE_DEFAULTS.theme_mode,
  );

  const theme_preset = safeEnum(
    jar.get("theme_preset")?.value,
    THEME_PRESET_VALUES,
    PREFERENCE_DEFAULTS.theme_preset,
  );

  const {content_layout, navbar_style, font, sidebar_collapsible, sidebar_variant } =
    PREFERENCE_DEFAULTS

  // ── Compute the dark class for SSR ─────────────────────────────────────────
  // • "dark"   → add class="dark" to <html> immediately in SSR output
  // • "light"  → no class needed
  // • "system" → we cannot know the OS preference on the server;
  //              leave class="" and let the render-blocking script resolve it
  //              before the body is painted.
  const ssrDarkClass = theme_mode === "dark" ? "dark" : "";

  return (
    <html
      lang="en"
      className={ssrDarkClass}
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeBootCode() }}
        />
      </head>

      <body className={`${fontVars} min-h-screen antialiased`}>
        <TooltipProvider>
          <PreferencesStoreProvider
            themeMode={theme_mode}
            themePreset={theme_preset}
            contentLayout={content_layout}
            navbarStyle={navbar_style}
            font={font}
          >
            <SessionProvider>
              {children}
            </SessionProvider>
            <Toaster />
          </PreferencesStoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}