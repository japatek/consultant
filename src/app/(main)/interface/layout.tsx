import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Link from "next/link";

import { siGithub } from "simple-icons";

import { AppSidebar } from "./_components/app-sidebar";
import { SimpleIcon } from "../../../components/simple-icon";
import { Button } from "../../../components/ui/button";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";
import { users } from "../../../data/users";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "../../../lib/preferences/layout";
import { cn } from "../../../lib/utils";
import { getPreference } from "../../../server/server-actions";

// Updated import to reflect the single-user menu component
// Note: Change the filename/path if you didn't rename the switcher file to 'user-menu'
import { UserMenu } from "./_components/user-menu";
import { LayoutControls } from "./_components/layout-controls";
import { SearchDialog } from "./_components/search-dialog";
import { ThemeSwitcher } from "./_components/theme-switcher";


export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
    getPreference("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
  ]);

  // Using the first user in the array to simulate the active logged-in session
  // (If you hook up real Next-Auth server sessions later, you can replace this with your session user)
  const loggedInUser = users[0];

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-1xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
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
              <Button asChild size="icon">
                <Link
                  prefetch={false}
                  href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub repository"
                >
                  <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
                </Link>
              </Button>
              {/* Render the single user profile menu */}
              <UserMenu user={loggedInUser} />
            </div>
          </div>
        </header>
        {/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
        <div className="h-full has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}