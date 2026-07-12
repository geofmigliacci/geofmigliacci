import { BlueprintCorners } from "@/components/blueprint-corners";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesLoading() {
  return (
    <div className="mx-auto max-w-[60rem] px-6 py-16 md:py-24 2xl:max-w-[75rem]">
      <div className="relative rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] md:p-10">
        <BlueprintCorners />
        <Skeleton className="h-10 w-48 md:h-12" />
        <Skeleton className="mt-4 h-6 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-6 w-2/3 max-w-xl" />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {["a", "b", "c", "d"].map((key) => (
          <div key={key} className="relative">
            <BlueprintCorners />
            <Card className="h-48">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
