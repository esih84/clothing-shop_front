export default function OffersLoading() {
  return (
    <div className="mb-6 px-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary animate-pulse" />
          <div className="h-5 w-28 bg-primary/20 animate-pulse" />
          <div className="h-4 w-14 bg-primary/20 animate-pulse" />
        </div>
        <div className="h-4 w-12 bg-primary/15 animate-pulse" />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: 10 }).map((_,i) => (
          <div key={i} className="w-[150px] sm:w-[170px] flex-shrink-0">
            <div className="aspect-[3/4] bg-primary/20 animate-pulse mb-2" />
            <div className="space-y-1.5">
              <div className="h-3 bg-primary/15 animate-pulse w-4/5" />
              <div className="h-4 bg-primary/20 animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
