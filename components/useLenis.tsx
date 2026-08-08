// hooks/useLenis.ts
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export const useLenis = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) =>
        Math.min(1, 1.001 - Math.pow(2, -12 * t)),
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      lenis.destroy();
    };
  }, [enabled]);
};