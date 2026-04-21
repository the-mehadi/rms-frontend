import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function BillingLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass lux-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-2 h-3 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Receipt Preview Section Skeleton */}
            <section className="rounded-3xl border bg-background p-6">
              <div className="text-center">
                <Skeleton className="mx-auto h-12 w-12 rounded-2xl" />
                <Skeleton className="mx-auto mt-4 h-5 w-40" />
                <Skeleton className="mx-auto mt-2 h-3 w-48" />
              </div>

              <div className="mt-6 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              {/* Order items skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              {/* Bill summary skeleton */}
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-dashed text-center">
                <Skeleton className="mx-auto h-4 w-32" />
                <Skeleton className="mx-auto mt-2 h-3 w-48" />
              </div>

              <div className="mt-6 grid grid-cols-[1fr_100px] items-center gap-4 rounded-3xl border bg-muted/20 p-4">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-28" />
                </div>
                <Skeleton className="aspect-square rounded-2xl" />
              </div>
            </section>

            {/* Controls Section Skeleton */}
            <aside className="space-y-4">
              {/* Payment Method Selector Skeleton */}
              <div className="rounded-3xl border bg-background p-4">
                <Skeleton className="h-4 w-32" />
                <div className="mt-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-2xl" />
                  ))}
                </div>
              </div>

              {/* Discount Input Skeleton */}
              <div className="rounded-3xl border bg-background p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-3 h-10 w-full rounded-2xl" />
                <Skeleton className="mt-2 h-8 w-full rounded-2xl" />
              </div>

              {/* Bill Actions Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-11 w-full rounded-2xl" />
                <Skeleton className="h-11 w-full rounded-2xl" />
                <Skeleton className="h-11 w-full rounded-2xl" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
