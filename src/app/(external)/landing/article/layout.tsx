import type { ReactNode } from "react";
import { cookies } from "next/headers";

// Autentikasi
import { auth } from "@/lib/auth/auth"; 

// --- Komponen untuk User yang BELUM Login ---
import { Navbar } from "./_components/nav-bar";

// --- Komponen untuk User yang SUDAH Login ---
import { AppSidebar } from "./_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { UserMenu } from "./_components/user-menu";
import { LayoutControls } from "./_components/layout-controls";
import { SearchDialog } from "./_components/search-dialog";
import { ThemeSwitcher } from "./_components/theme-switcher";

export default async function DocsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // 1. Cek status login user
  const session = await auth();

  // =========================================================================
  // KONDISI 1: JIKA USER BELUM LOGIN (Gunakan Layout Navbar Lama)
  // =========================================================================
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-start pt-20 md:pt-24">
          <div className="mx-auto w-full min-w-0 px-6 py-8 md:px-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // KONDISI 2: JIKA USER SUDAH LOGIN (Gunakan Layout Sidebar Dashboard)
  // =========================================================================
  
  // Ambil preferensi layout dari Cookies HANYA jika user sudah login
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
  ]);

  // Petakan ulang tipe data agar sesuai dengan UserProps di UserMenu
  const loggedInUser = {
    name: session.user.name || "User",
    email: session.user.email || "No email",
    image: session.user.image || undefined,
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