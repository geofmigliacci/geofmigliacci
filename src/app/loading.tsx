import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-240 px-6 py-16 md:py-24 2xl:max-w-300">
      <div className="relative flex flex-col gap-6 rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] md:flex-row md:items-center md:justify-between md:p-10">
        <BlueprintCorners />
        <div className="flex items-center gap-5">
          <Skeleton className="size-20 shrink-0 md:size-24" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-56 md:h-9" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-10" />
          <Skeleton className="size-10" />
          <Skeleton className="size-10" />
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-4 w-40" />
        <div className="relative mt-6">
          <BlueprintCorners />
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-8 w-3/4 md:h-9" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full max-w-2xl" />
              <Skeleton className="mt-2 h-5 w-2/3 max-w-xl" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="mt-6 h-5 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
