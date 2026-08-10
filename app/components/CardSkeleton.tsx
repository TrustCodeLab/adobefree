export default function CardSkeleton() {
  return (
    <div className="space-y-10 sm:space-y-12">
      {[1, 2].map((catIndex) => (
        <section key={catIndex} className="space-y-4">
          {/* Category Title Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 sm:w-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="hidden sm:flex gap-1.5">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
            </div>
          </div>

          {/* Cards Row Skeleton */}
          <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-hidden pt-3 sm:pt-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {[1, 2, 3, 4].map((cardIndex) => (
              <div
                key={cardIndex}
                className="min-w-[16.25rem] sm:min-w-[18.75rem] md:min-w-[21.25rem] bg-card rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-card-border p-1.5 sm:p-2 space-y-4 animate-pulse"
              >
                <div className="aspect-[5/3] rounded-t-[1.3rem] sm:rounded-t-[1.8rem] lg:rounded-t-[2.3rem] rounded-b-[1rem] sm:rounded-b-[1.25rem] bg-white/5" />
                <div className="px-3 sm:px-4 pb-3 space-y-3">
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-32 bg-white/10 rounded" />
                    <div className="h-5 w-12 bg-emerald-500/20 rounded-full" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-9 rounded-full bg-white/5 border border-white/5" />
                    <div className="flex-1 h-9 rounded-full bg-white/15" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
