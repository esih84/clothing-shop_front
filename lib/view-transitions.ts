"use client"

import { useRouter, usePathname } from "next/navigation"
import { startViewTransition } from "next/navigation"

export function useViewTransition() {
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (url: string) => {
    if (document.startViewTransition) {
      startViewTransition(() => {
        router.push(url)
      })
    } else {
      router.push(url)
    }
  }

  return { navigate, pathname }
}
