export default function Loading() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
      <div className="h-12 bg-gray-200 animate-pulse rounded-full"></div>
    </div>
  )
}
