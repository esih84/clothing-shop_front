import { RefreshCw } from "lucide-react"

interface PullToRefreshIndicatorProps {
  pullDistance: number
  threshold: number
  isRefreshing: boolean
  isPulling: boolean
}

export function PullToRefreshIndicator({
  pullDistance,
  threshold,
  isRefreshing,
  isPulling,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1)
  const rotation = progress * 180
  const opacity = Math.min(progress * 2, 1)

  if (!isPulling && !isRefreshing) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-card/90 backdrop-blur-sm border-b transition-all duration-200"
      style={{
        height: `${Math.min(pullDistance, threshold)}px`,
        transform: `translateY(${isRefreshing ? 0 : -threshold + pullDistance}px)`,
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <div
          className="transition-all duration-200"
          style={{
            opacity,
            transform: `rotate(${isRefreshing ? 0 : rotation}deg)`,
          }}
        >
          <RefreshCw className={`w-6 h-6 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
        </div>

        {pullDistance >= threshold && !isRefreshing && (
          <p className="text-sm text-muted-foreground font-medium animate-fadeIn">Release to refresh</p>
        )}

        {isRefreshing && <p className="text-sm text-muted-foreground font-medium animate-fadeIn">Refreshing...</p>}

        {pullDistance < threshold && pullDistance > 20 && !isRefreshing && (
          <p className="text-sm text-muted-foreground animate-fadeIn">Pull to refresh</p>
        )}
      </div>
    </div>
  )
}
