import { Skeleton } from "@/components/ui/skeleton";

const PREVIOUS_POST_ROWS = [0, 1, 2, 3];

export default function HomeLoading() {
  return (
    <div className="page-shell">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Skeleton className="size-20 shrink-0 rounded-none md:size-24" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-56 md:h-10" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-4 w-40" />
        <div className="mt-6 divide-y divide-border border-t border-b border-border">
          <div className="py-8">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-8 w-3/4 md:h-9" />
            <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-4xl" />
              <Skeleton className="h-5 w-16 rounded-4xl" />
              <Skeleton className="h-5 w-16 rounded-4xl" />
            </div>
            <Skeleton className="mt-6 h-5 w-32" />
          </div>
          {PREVIOUS_POST_ROWS.map((row) => (
            <div
              key={row}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <Skeleton className="h-4 w-32 sm:w-40 sm:shrink-0" />
              <Skeleton className="h-5 w-3/4 sm:flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
