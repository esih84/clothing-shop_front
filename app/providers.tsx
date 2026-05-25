"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@/lib/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider  } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
 const [queryClient] = useState(() => new QueryClient())
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
    </QueryClientProvider>
  );
}
