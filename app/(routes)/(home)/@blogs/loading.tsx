export default function BlogsLoading() {
  return (
    <section className="px-4 py-6 mx-auto">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-1 h-5 bg-gray-200 animate-pulse" />
        <div className="h-7 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="ml-auto h-5 w-20 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-[200px]" />
        ))}
      </div>
    </section>
  );
}
