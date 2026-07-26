"use client";

import type React from "react";
import { useState } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@/shared/store/store";
import { PersistGate } from "redux-persist/integration/react";
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

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {/* PersistGate with loading={null} manages client hydration;
              the tree is no longer gated on isMounted so SSR yields real content. */}
          <PersistGate loading={null} persistor={persistor}>
            {children}
            <Toaster position="top-center" richColors />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
