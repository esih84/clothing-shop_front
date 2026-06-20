"use client";

import type React from "react";
import { useState } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@/shared/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  // یک‌بار ساخته می‌شود؛ پیش‌فرض‌ها برای کش بهتر و جابجایی سریع‌تر
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // ۱ دقیقه داده‌ها تازه فرض می‌شوند
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {/* PersistGate با loading={null} هیدراسیون کلاینت را مدیریت می‌کند؛
            درخت دیگر روی isMounted گِیت نمی‌شود تا SSR محتوای واقعی بدهد. */}
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
