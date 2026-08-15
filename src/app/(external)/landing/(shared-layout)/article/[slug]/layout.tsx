// app/docs/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../_components/coba-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navbar } from "../../../_components/nav-bar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Global Top Navbar */}
      <Navbar />

      {/* 
        2. Wrapper untuk memberikan jarak dari atas (pt-24) 
        karena Navbar memiliki posisi 'fixed top-0'.
      */}
      <div className="flex-1 pt-20 md:pt-24">
        <SidebarProvider>
          {/* Shadcn Left Sidebar */}
          <AppSidebar />

          {/* Main Content Area */}
          <main className="relative flex min-h-screen w-full flex-1 flex-col">
            
            {/* Sticky Header with Mobile Trigger & Blur Effect */}
            <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger />
              <span className="ml-4 font-semibold md:hidden">Documentation</span>
            </header>

            <div className="flex flex-1 items-start">
              
              {/* Center Content */}
              <div className="mx-auto w-full min-w-0 max-w-4xl px-6 py-8 md:px-8">
                {children}
              </div>

              {/* Right Sidebar (On this page) - Made Sticky */}
              <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-l py-6 xl:block">
                <ScrollArea className="h-full px-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">On this page</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <a href="#quickstart" className="hover:text-foreground transition-colors">
                          Quickstart
                        </a>
                      </li>
                      <li>
                        <a href="#core-capabilities" className="hover:text-foreground transition-colors">
                          Core capabilities
                        </a>
                      </li>
                      {/* Map your dynamic page headings here */}
                    </ul>
                  </div>
                </ScrollArea>
              </aside>
              
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  )
}