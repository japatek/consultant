import { Skeleton } from "../../../components/ui/skeleton";

export default function WireframeSkeleton() {
  return (
    <div className="mx-auto flex h-screen w-full flex-col items-center overflow-hidden border-2 border-border bg-background shadow-lg">

      {/* Main Content Area */}
      <div className="mt-20 flex w-full max-w-6xl flex-col gap-6 p-6 sm:p-8">
        
        {/* Hero Section */}
        <div className="flex w-full flex-col gap-4 rounded-xl bg-muted/40 p-6 sm:p-8">
          <Skeleton className="h-6 w-[60%] sm:h-6 sm:w-[45%]" />
          <Skeleton className="h-6 w-[90%] sm:h-6 sm:w-[75%]" />
          <Skeleton className="h-6 w-[70%] sm:h-6 sm:w-[60%]" />
        </div>

        {/* Tags / Sub-nav Row */}
        <div className="flex w-full items-center gap-4 overflow-hidden rounded-xl bg-muted/40 p-4 sm:p-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-12 shrink-0 sm:h-5 sm:w-16" />
          ))}
        </div>

        {/* Cards Grid */}
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-[2rem] bg-muted/40 p-5 sm:p-6"
            >
              {/* Card Title */}
              <Skeleton className="h-5 w-24 rounded-md" />
              {/* Card Body/Image */}
              <Skeleton className="h-32 w-full rounded-xl sm:h-40" />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}