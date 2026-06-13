import { Header } from "@/components/layout/header";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeleton - Desktop Only */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
            <div className="space-y-4">
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-1">
            {/* Mobile Category Nav Skeleton */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-3 mb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse shrink-0" />
              ))}
            </div>

            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-48 bg-muted rounded animate-pulse mb-4" />

            {/* Title Skeleton */}
            <div className="h-7 w-40 bg-muted rounded animate-pulse mb-6" />

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="overflow-hidden bg-card border border-white/5 rounded-lg">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-8 w-16 bg-muted rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
