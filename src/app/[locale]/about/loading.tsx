import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="page-shell">
      <div className="flex flex-col items-start gap-6 xl:flex-row xl:gap-8">
        <Skeleton className="size-40 shrink-0 rounded-none md:size-52 xl:size-56" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-[calc(clamp(2rem,7vw,4.5rem)*0.95)] w-72 md:w-96" />
          <Skeleton className="h-[calc(clamp(2rem,7vw,4.5rem)*0.95)] w-80 md:w-104" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="mt-12 flex flex-col items-start gap-6">
        <Skeleton className="h-7 w-full max-w-xl" />
        <Skeleton className="h-7 w-3/4 max-w-xl" />
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
