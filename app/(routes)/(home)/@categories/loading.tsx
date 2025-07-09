export default function CategoriesLoading() {
  return (
    <div className="px-4 mb-6">
      <div className="flex space-x-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-20 h-10 bg-gray-200 animate-pulse rounded-full"></div>
        ))}
      </div>
    </div>
  )
}
