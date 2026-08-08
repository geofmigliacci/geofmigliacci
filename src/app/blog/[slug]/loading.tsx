import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <article className="page-shell">
      <Skeleton className="h-9 w-3/4 md:h-10" />
      <div className="mt-4 flex items-center gap-2">
        <Skeleton className="size-7 shrink-0 rounded-none" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-4xl" />
        <Skeleton className="h-5 w-16 rounded-4xl" />
      </div>
      {/* A cover band, not the separator that used to stand here: every post
          has a cover now, so the separator would collapse a 384px block to a
          hairline and jump the page when the post arrived. */}
      <Skeleton className="my-8 aspect-2/1 w-full rounded-none md:aspect-3/1" />
      {/* Same utility and measure as the post, so the lines land on the prose's
          edges and the rail does not pop in when it arrives. */}
      <div className="post-columns">
        <div className="flex max-w-3xl flex-col gap-3">
          {["a", "b", "c", "d", "e"].map((key) => (
            <Skeleton key={key} className="h-4 w-full" />
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          <Skeleton className="h-3 w-20" />
          <div className="flex flex-col gap-2">
            {["h-4 w-28", "h-4 w-36", "h-4 w-24", "h-4 w-32"].map((line) => (
              <Skeleton key={line} className={line} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
