import type { ReactNode } from "react";
import { cookies } from "next/headers";

// Komponen Sidebar & Layout UI
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

// Komponen Header
import { UserMenu } from "./_components/user-menu";
import { LayoutControls } from "./_components/layout-controls";
import { SearchDialog } from "./_components/search-dialog";
import { ThemeSwitcher } from "./_components/theme-switcher";

// Autentikasi (Menggunakan session asli Next-Auth, bukan data dummy)
import { auth } from "@/lib/auth/auth"; 

export default async function DocsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // 1. Ambil preferensi layout dari Cookies
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
  ]);

// 2. Ambil data user yang sedang login menggunakan auth()
  const session = await auth();
  
  // Petakan ulang agar tipenya secara ketat menjadi { name: string; email: string; image: string | undefined }
  const loggedInUser = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "No email",
    image: session?.user?.image || undefined,
  };

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
        } as React.CSSProperties
      }
    >
      {/* SIDEBAR */}
      <AppSidebar variant={variant} collapsible={collapsible} />
      
      {/* KONTEN UTAMA */}
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-1xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
        )}
      >
        {/* HEADER TOP-BAR */}
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls />
              <ThemeSwitcher />
              <UserMenu user={loggedInUser} />
            </div>
          </div>
        </header>
        
        {/* HALAMAN ANAK (CHILDREN) */}
        <div className="h-full has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}