import Link from "next/link";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="flex flex-col items-center">
        <div className="bg-primary/20 rounded-full p-6 mb-6 animate-bounce">
          <Heart className="w-16 h-16 text-secondary" />
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-secondary mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">صفحه پیدا نشد</h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 text-center max-w-md">
          متاسفانه صفحه‌ای که به دنبال آن بودید پیدا نشد یا ممکن است حذف شده باشد.
        </p>
        <Link
          href="/"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-lg font-semibold text-lg shadow transition-colors"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
