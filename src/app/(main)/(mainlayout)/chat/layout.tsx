import { Toaster } from "../../../../components/ui/sonner"

// Lives above [id]/page.tsx on purpose. The page (and ChatShell with it) remounts
// whenever the session changes, which would destroy a Toaster that lives inside it
// and swallow any toast fired right before navigating (e.g. "Chat deleted" after
// removing the active session).
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  )
}