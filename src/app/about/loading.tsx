import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="mx-auto w-full max-w-240 px-6 pt-16 pb-8 md:pt-24 2xl:max-w-300">
      <div className="p-6">
        <div className="flex flex-col items-start gap-6 xl:flex-row xl:gap-8">
          <Skeleton className="size-40 shrink-0 md:size-52 xl:size-56" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-72 md:h-14 md:w-96" />
            <Skeleton className="h-10 w-80 md:h-14 md:w-104" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start gap-6">
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-6 w-3/4 max-w-xl" />
          <div className="flex gap-2">
            <Skeleton className="size-10" />
            <Skeleton className="size-10" />
            <Skeleton className="size-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
