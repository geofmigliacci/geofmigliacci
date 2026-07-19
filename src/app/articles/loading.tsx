import { BlueprintCorners } from "@/components/decorative/blueprint-corners";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesLoading() {
  return (
    <div className="mx-auto max-w-240 px-6 py-16 md:py-24 2xl:max-w-300">
      <div className="relative rounded-xl bg-card/60 p-6 ring-1 ring-foreground/10 backdrop-blur-[2px] md:p-10">
        <BlueprintCorners />
        <Skeleton className="h-9 w-48 md:h-10" />
        <Skeleton className="mt-4 h-6 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-6 w-2/3 max-w-xl" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-8 w-20 rounded-4xl" />
          <Skeleton className="h-8 w-20 rounded-4xl" />
          <Skeleton className="h-8 w-20 rounded-4xl" />
        </div>
      </div>
      <div className="mt-12 grid gap-6">
        {["a", "b"].map((key) => (
          <div key={key} className="relative">
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
        ))}
      </div>
    </div>
  );
}
