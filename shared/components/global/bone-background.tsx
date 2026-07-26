"use client";

import { Bone, Cat, Dog, PawPrint, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * Decorative background: a few icons (bone, dog, cat, paw) that move at different
 * speeds (parallax) while scrolling. Lightweight and non-blocking; disabled on mobile
 * and when prefers-reduced-motion is set.
 */

type IconSpec = {
  Icon: LucideIcon;
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  /** Parallax factor: larger = more movement while scrolling */
  speed: number;
  opacity: number;
};

const ICONS: IconSpec[] = [
  {
    Icon: Bone,
    top: "8%",
    left: "14%",
    size: 56,
    rotate: -25,
    speed: 0.03,
    opacity: 0.1,
  },
  {
    Icon: Dog,
    top: "16%",
    right: "26%",
    size: 84,
    rotate: 12,
    speed: 0.04,
    opacity: 0.08,
  },
  {
    Icon: PawPrint,
    top: "30%",
    left: "28%",
    size: 40,
    rotate: -10,
    speed: 0.05,
    opacity: 0.09,
  },
  {
    Icon: Cat,
    top: "40%",
    right: "40%",
    size: 72,
    rotate: 18,
    speed: 0.055,
    opacity: 0.08,
  },
  {
    Icon: Bone,
    top: "52%",
    left: "32%",
    size: 48,
    rotate: 30,
    speed: 0.06,
    opacity: 0.09,
  },
  {
    Icon: PawPrint,
    top: "62%",
    right: "44%",
    size: 36,
    rotate: 25,
    speed: 0.065,
    opacity: 0.1,
  },
  {
    Icon: Dog,
    top: "74%",
    left: "6%",
    size: 68,
    rotate: -18,
    speed: 0.075,
    opacity: 0.07,
  },
  {
    Icon: Cat,
    top: "84%",
    right: "18%",
    size: 60,
    rotate: -22,
    speed: 0.08,
    opacity: 0.09,
  },
  {
    Icon: PawPrint,
    top: "92%",
    left: "66%",
    size: 44,
    rotate: 8,
    speed: 0.085,
    opacity: 0.08,
  },
];

export function BoneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-speed]"));

    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      for (const item of items) {
        const speed = Number(item.dataset.speed);
        const rot = Number(item.dataset.rotate);
        item.style.transform = `translate3d(0, ${y * speed}px, 0) rotate(${rot}deg)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden "
    >
      {ICONS.map((b, i) => (
        <b.Icon
          key={i}
          data-speed={b.speed}
          data-rotate={b.rotate}
          className="absolute text-secondary will-change-transform"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            transform: `rotate(${b.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
