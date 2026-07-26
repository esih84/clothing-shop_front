"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "fade";

const hiddenByDir: Record<Direction, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  fade: "",
};

/**
 * A lightweight wrapper that animates its children into view when they enter
 * the viewport. Based on IntersectionObserver (no heavy library)
 * and compatible with prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  direction?: Direction;
  /** Delay in milliseconds */
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", hiddenByDir[direction]),
        className
      )}
    >
      {children}
    </Tag>
  );
}
