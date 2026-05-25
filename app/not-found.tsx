import Link from "next/link";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff0f3] to-[#ffe3e8] px-4">
      <div className="flex flex-col items-center">
        <div className="bg-[#ffbdc5]/40 rounded-full p-6 mb-6 animate-bounce">
          <Heart className="w-16 h-16 text-[#670626]" />
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#670626] mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#670626] mb-2">صفحه پیدا نشد</h2>
        <p className="text-gray-500 text-lg md:text-xl mb-8 text-center max-w-md">
          متاسفانه صفحه‌ای که به دنبال آن بودید پیدا نشد یا ممکن است حذف شده باشد.
        </p>
        <Link
          href="/"
          className="bg-[#670626] hover:bg-[#ffbdc5]/80 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition-colors"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
