"use client";

import { Bone } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * پس‌زمینه‌ی تزئینی: چند استخوان که هنگام اسکرول با سرعت‌های متفاوت
 * (parallax) حرکت می‌کنند. سبک و غیرمسدودکننده؛ روی موبایل و
 * در حالت prefers-reduced-motion غیرفعال می‌شود.
 */

type BoneSpec = {
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  /** ضریب parallax: بزرگ‌تر = حرکت بیشتر با اسکرول */
  speed: number;
  opacity: number;
};

const BONES: BoneSpec[] = [
  { top: "8%", left: "4%", size: 56, rotate: -25, speed: 0.18, opacity: 0.1 },
  { top: "22%", right: "6%", size: 80, rotate: 35, speed: 0.32, opacity: 0.08 },
  { top: "45%", left: "10%", size: 44, rotate: 15, speed: 0.5, opacity: 0.09 },
  { top: "60%", right: "12%", size: 64, rotate: -15, speed: 0.24, opacity: 0.1 },
  { top: "78%", left: "6%", size: 72, rotate: 45, speed: 0.4, opacity: 0.07 },
  { top: "90%", right: "8%", size: 50, rotate: -40, speed: 0.6, opacity: 0.09 },
];

export function BoneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-speed]")
    );

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
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden hidden md:block"
    >
      {BONES.map((b, i) => (
        <Bone
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
