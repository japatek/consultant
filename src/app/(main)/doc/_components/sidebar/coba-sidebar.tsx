// components/app-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Your documentation structure
const navGroups = [
  {
    title: "Get started",
    links: [
      { name: "Quickstart", href: "/docs/quickstart" },
      { name: "Customization", href: "/docs/customization" },
      { name: "Models", href: "/docs/models" },
    ],
  },
  {
    title: "Execution environment",
    links: [
      { name: "Tools", href: "/docs/tools" },
      { name: "Backends", href: "/docs/backends" },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((link) => {
                  const isActive = pathname === link.href
                  
                  return (
                    <SidebarMenuItem key={link.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={link.href}>{link.name}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}