export default function AdminLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2e2e2e]">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/10 rounded-lg" />
          <div className="h-4 w-64 bg-white/5 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-[#3ecf8e]/20 rounded-lg" />
          <div className="h-10 w-32 bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2e2e2e] p-5 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="w-8 h-8 rounded-lg bg-white/5" />
            </div>
            <div className="h-8 w-16 bg-white/15 rounded" />
          </div>
        ))}
      </div>

      {/* Table / Content Skeleton */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-6 space-y-4">
        <div className="h-6 w-36 bg-white/10 rounded mb-4" />
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="h-12 w-full bg-[#141414] border border-[#2e2e2e] rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
