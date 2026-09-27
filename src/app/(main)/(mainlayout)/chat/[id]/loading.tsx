import { PanelLeftIcon } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { Shimmer } from "../../../../../components/ai/shimmer"

function MessageRowSkeleton({ from, lines }: { from: "user" | "assistant"; lines: number }) {
  return (
    <div className={cn("flex w-full", from === "user" ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col gap-2", from === "user" ? "items-end max-w-[70%]" : "items-start w-full max-w-[85%]")}>
        {Array.from({ length: lines }).map((_, i) => (
          <Shimmer
            key={i}
            className={cn("h-4 rounded-md", from === "user" ? "w-44" : i === lines - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
    </div>
  )
}

// Mirrors ChatShell's structure 1:1 (same heights/padding) so swapping the real
// page in once data resolves doesn't cause any layout shift.
export default function ChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background" role="status" aria-label="Loading chat">
      <div className="flex flex-1 flex-col relative h-full">

        <header className="absolute top-0 w-full flex shrink-0 items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="p-2">
              <PanelLeftIcon className="size-5 text-muted-foreground/30" />
            </div>
            <Shimmer className="h-4 w-32 rounded-md" />
          </div>
          <Shimmer className="h-7 w-28 rounded-lg" />
        </header>

        <div className="flex-1 pt-14 pb-[140px] h-full overflow-hidden">
          <div className="max-w-3xl mx-auto w-full px-4 pt-8 flex flex-col gap-8">
            <MessageRowSkeleton from="user" lines={1} />
            <MessageRowSkeleton from="assistant" lines={4} />
            <MessageRowSkeleton from="user" lines={1} />
            <MessageRowSkeleton from="assistant" lines={3} />
          </div>
        </div>

        <div className="absolute bottom-0 w-full pt-4 pb-8 px-4">
          <div className="mx-auto w-full max-w-3xl">
            <Shimmer className="h-[92px] w-full rounded-xl" />
            <div className="mt-3 flex justify-center">
              <Shimmer className="h-3 w-64 rounded" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}