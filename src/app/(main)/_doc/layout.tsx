// app/docs/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/sidebar/coba-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* 1. Shadcn Left Sidebar */}
      <AppSidebar />

      {/* 2. Main Content Area */}
      <main className="flex min-h-screen w-full flex-1 flex-col">
        {/* Mobile trigger (hidden on desktop) */}
        <div className="flex h-14 items-center border-b px-4 md:hidden">
          <SidebarTrigger />
          <span className="ml-4 font-semibold">Documentation</span>
        </div>

        <div className="flex flex-1 items-start">
          {/* Center Content */}
          <div className="mx-auto w-full min-w-0 max-w-3xl px-6 py-8 md:px-8">
            {children}
          </div>

          {/* 3. Right Sidebar (On this page) - Hidden on smaller screens */}
          <aside className="hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-l py-6 pr-6 xl:block">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">On this page</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#quickstart" className="hover:text-foreground">Quickstart</a>
                  </li>
                  <li>
                    <a href="#core-capabilities" className="hover:text-foreground">Core capabilities</a>
                  </li>
                  {/* Map your dynamic page headings here */}
                </ul>
              </div>
            </ScrollArea>
          </aside>
        </div>
      </main>
    </SidebarProvider>
  )
}