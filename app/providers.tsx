"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@/shared/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/ui/sonner";
import { ThemeProvider } from "@/shared/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Created once; defaults for better caching and faster navigation
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data is considered fresh for 1 minute
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // Rehydrate the persisted cart/wishlist only after the server HTML has been hydrated, so the
  // tree renders on the server (previously PersistGate returned null there, leaving <body> empty).
  useEffect(() => {
    persistor.persist();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
          <Toaster position="top-center" richColors />
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
