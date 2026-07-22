import { StarsBackground } from "@/components/ui/star-background";

export default function LoginLoading() {
  return (
    <StarsBackground className="relative flex flex-col min-h-screen w-full font-sans text-foreground">
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] rounded-2xl border border-border/40 bg-card/90 px-8 py-10 shadow-xl backdrop-blur-md">
          
          {/* Skeleton Header */}
          <div className="space-y-3 text-center mb-8 flex flex-col items-center">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Skeleton Form */}
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-[70px] w-full animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          </div>

        </div>
      </main>
    </StarsBackground>
  );
}