export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-800 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-slate-800 rounded w-96 animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 bg-slate-800 rounded w-12 animate-pulse" />
                  <div className="h-4 bg-slate-800 rounded w-20 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="h-6 bg-slate-800 rounded w-32 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-16 animate-pulse" />
                <div className="h-10 bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Service Requests Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 bg-slate-800 rounded w-32 animate-pulse" />
                    <div className="h-5 bg-slate-800 rounded w-20 animate-pulse" />
                    <div className="h-5 bg-slate-800 rounded w-16 animate-pulse" />
                  </div>
                  <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 bg-slate-800 rounded w-48 animate-pulse" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 bg-slate-800 rounded w-40 animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
