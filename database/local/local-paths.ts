// database/local/local-paths.ts
//
// Per-surface artifact-root resolver.  Spec:
// DOCUMENT/Database-Local-Architecture.md §3.
//
// Each surface has a different OS-blessed location for app data; this
// module centralises the rules so the SQLite file, attachments dir,
// and artifacts dir always land in the right place.
//
// Surfaces that have no filesystem (Browser ext, Office WebView) use
// IndexedDB instead  see ./idb-schema.ts.  This file is import-safe
// in those builds because it does its OS detection lazily and never
// touches `fs` at module top-level.

export type Surface =
  | "desktop"      // Tauri  ~/.local/share/JaPaTek       /  %APPDATA%/JaPaTek
  | "cli"          // Node   ~/.config/JaPaTek-cli
  | "ide"          // VSCode globalStoragePath provided by the host
  | "office"       // VSTO   %APPDATA%/Microsoft/AddIns/JaPaTek
  | "cad"          // Win    %APPDATA%/JaPaTek/CAD
  | "mobile-and"   // Capacitor cordova.file.dataDirectory
  | "mobile-ios";  // Capacitor cordova.file.dataDirectory

export interface LocalPaths {
  /** Root directory for this surface's local-state. */
  root:         string;
  /** Path to the SQLite file (or "" for IDB-only surfaces). */
  sqliteFile:   string;
  /** Directory for attachment blobs. */
  attachments:  string;
  /** Directory for artifact blobs. */
  artifacts:    string;
  /** Directory for migration scripts (`001_*.sql`, ...). */
  migrations:   string;
}


/** Resolve OS paths for a given surface.  When `hostOverride` is
 *  supplied it wins  used by IDE extensions whose host provides a
 *  storage path (VSCode `ExtensionContext.globalStorageUri.fsPath`). */
export function resolveLocalPaths(
  surface:      Surface,
  hostOverride?: string,
): LocalPaths {
  const root = hostOverride ?? defaultRoot(surface);
  return {
    root,
    sqliteFile:  `${root}/JaPaTek.db`,
    attachments: `${root}/attachments`,
    artifacts:   `${root}/artifacts`,
    migrations:  `${root}/migrations`,
  };
}


//  Internal: per-surface default roots.
//  Lazy access to `process`/`os`/globals so this module doesn't crash
//  when imported in a browser sandbox.

function defaultRoot(surface: Surface): string {
  const proc  = (globalThis as { process?: NodeProcess }).process;
  const home  = proc?.env?.HOME ?? proc?.env?.USERPROFILE ?? "";
  const appData = proc?.env?.APPDATA
              ?? (home ? `${home}/AppData/Roaming` : "");
  const xdg   = proc?.env?.XDG_DATA_HOME
              ?? (home ? `${home}/.local/share` : "");
  const xdgCfg = proc?.env?.XDG_CONFIG_HOME
              ?? (home ? `${home}/.config` : "");
  const platform = proc?.platform ?? "linux";

  switch (surface) {
    case "desktop":
      if (platform === "win32")  return `${appData}/JaPaTek`;
      if (platform === "darwin") return `${home}/Library/Application Support/JaPaTek`;
      return `${xdg}/JaPaTek`;
    case "cli":
      return `${xdgCfg}/JaPaTek-cli`;
    case "ide":
      // Real value comes from the IDE host; this is the fallback.
      return `${xdg}/JaPaTek/ide`;
    case "office":
      return `${appData}/Microsoft/AddIns/JaPaTek`;
    case "cad":
      return `${appData}/JaPaTek/CAD`;
    case "mobile-and":
      // Capacitor injects the real path at runtime via
      // Filesystem.getUri({ directory: Directory.Data, ... }).
      return "/data/data/com.JaPaTek.app/files";
    case "mobile-ios":
      return "/var/mobile/Containers/Data/Application/JaPaTek/Documents";
  }
}


//  Minimal `NodeProcess` shape so we don't need `@types/node` in
//  non-Node consumers.  Browser surfaces just won't have `process`.
interface NodeProcess {
  env?:      Record<string, string | undefined>;
  platform?: string;
}
