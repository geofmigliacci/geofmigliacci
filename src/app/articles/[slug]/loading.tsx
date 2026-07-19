import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <article className="mx-auto max-w-240 px-6 py-16 md:py-24 2xl:max-w-300">
      <Skeleton className="mb-6 h-8 w-36" />
      <div className="relative rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] md:p-10">
        <BlueprintCorners />
        <Skeleton className="h-9 w-3/4 md:h-10" />
        <Skeleton className="mt-4 h-5 w-40" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-3">
          {["a", "b", "c", "d", "e"].map((key) => (
            <Skeleton key={key} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </article>
  );
}
