import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
      <Spinner className="size-8 text-primary" />
      <p className="text-sm text-chart-4">Loading...</p>
    </div>
  );
}