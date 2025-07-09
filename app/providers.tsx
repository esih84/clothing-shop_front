"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store/store"

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <Provider store={store}>{children}</Provider>
}
