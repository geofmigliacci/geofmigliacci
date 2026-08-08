import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoading() {
  return (
    <div className="page-shell">
      {/* Mirrors the real header in posts/page.tsx: a space-between row on
          desktop, with the RSS button on the right. */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col items-start gap-4">
          <Skeleton className="h-9 w-48 md:h-10" />
          <Skeleton className="h-7 w-full max-w-xl" />
          <Skeleton className="h-7 w-2/3 max-w-xl" />
        </div>
        <Skeleton className="size-9 shrink-0 rounded-lg" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-8 w-20 rounded-4xl" />
          <Skeleton className="h-8 w-20 rounded-4xl" />
          <Skeleton className="h-8 w-20 rounded-4xl" />
        </div>
      </div>
      <div className="mt-12 divide-y divide-border border-t border-b border-border">
        {["a", "b"].map((key) => (
          <div key={key} className="flex flex-col gap-6 py-8">
            <Skeleton className="aspect-2/1 w-full rounded-none md:aspect-3/1" />
            <div>
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
          </div>
        ))}
      </div>
    </div>
  );
}
