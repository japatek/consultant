"use client";

import Link from "next/link";

import { CircleHelp, ClipboardList, Database, File, Search, Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import Cookies from "js-cookie";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarSupportCard } from "./sidebar-support-card";
import { useSession } from "next-auth/react";

const _data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 
  const { data: session } = useSession();
  
  const id = session?.user?.id;
  
 
  const currentUser = React.useMemo(() => {
    return {
      name: session?.user?.name || "User",
      email: session?.user?.email || "No email",
      image: session?.user?.image || undefined, 
    };
  }, [session]);

  const sidebarData = React.useMemo(() => {
    if (!id) return [];
    return sidebarItems(id);
  }, [id]);

  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-2">
            <SidebarMenuButton asChild className="group-data-[collapsible=icon]:hidden">
              <Link prefetch={false} href="/dashboard/platoverview">
                <span className="font-semibold text-base">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
            <div className="group-data-[collapsible=icon]:mx-auto">
              <SidebarTrigger className="h-8 w-8 hover:bg-sidebar-accent" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={sidebarData} />
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarSupportCard />
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}