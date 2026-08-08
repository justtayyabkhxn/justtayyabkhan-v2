"use client";

import { useState, useEffect, useCallback } from "react";
import { Highlighter } from "@/components/ui/highlighter";
import { Particles } from "@/components/ui/particles";
import { Nav } from "@/components/nav";
import { RouteGuard } from "@/components/route-guard";
import { PLACES } from "@/data/places";

export default function PlacesPage() {
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visited = PLACES.filter((p) => p.visited);
  const wishlist = PLACES.filter((p) => !p.visited);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);
  const [mobilePos, setMobilePos] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  const flipX =
    cursor.x > (typeof window !== "undefined" ? window.innerWidth - 460 : 9999);

  const particleColor = isDark ? "#ffffff" : "#1a1a1a";

  return (
    <div className="absolute inset-0 w-full">
      <Particles
        key={`${particleColor}-${isMobile}`}
        className="fixed inset-0 -z-10 h-full w-full"
        quantity={isMobile ? 24 : 80}
        color={particleColor}
        size={0.6}
      />
      {/* cursor-following image */}
      {hoveredImg && !isMobile && (
        <div
          className="fixed z-[9999] pointer-events-none
               rounded-md overflow-hidden shadow-lg"
          style={{
            top: cursor.y - 200,
            left: flipX ? cursor.x - 440 : cursor.x + 20,
            width: 420,
          }}
        >
          <img
            src={hoveredImg}
            alt=""
            loading="lazy"
            className="w-full h-auto block"
            draggable={false}
          />
        </div>
      )}

      {hoveredImg && isMobile && (
        <div
          className="fixed z-[9999]  pointer-events-none rounded-md overflow-hidden shadow-lg"
          style={{ top: mobilePos.y, left: mobilePos.x, width: 140 }}
        >
          <img
            src={hoveredImg}
            alt=""
            loading="lazy"
            className="w-full h-auto block"
            draggable={false}
          />
        </div>
      )}

      <RouteGuard route="/places" />
      <Nav current="/places" />

      {/* content — left aligned */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-24 sm:pt-28 pb-[40vh] ">
        <h1 className="text-xs font-medium text-muted-foreground mb-2">
          <Highlighter action="underline" color="hsl(24 95% 55%)">
            places i have been to
          </Highlighter>
        </h1>
        <p className="text-xs text-muted-foreground/50 mb-8">
          {visited.length} visited · {wishlist.length} coming up
        </p>

        {/* visited */}
        <ul className="space-y-1.5 mb-8">
          {visited.map((place) => (
            <li
              key={place.name}
              className="flex items-baseline justify-between gap-4 text-sm text-muted-foreground/40 line-through cursor-default select-none"
              onMouseEnter={() => place.image && setHoveredImg(place.image)}
              onMouseLeave={() => setHoveredImg(null)}
              onTouchStart={() => {
                if (!place.image) return;
                const imgW = 140;
                const imgH = 100;
                setMobilePos({
                  x: Math.random() * (window.innerWidth - imgW),
                  y: Math.random() * (window.innerHeight - imgH),
                });
                setHoveredImg(place.image);
              }}
              onTouchEnd={() => setHoveredImg(null)}
            >
              <span className="flex items-baseline gap-2">
                <span className="text-xs">·</span>
                {place.name}
              </span>
              {place.date && (
                <span className="text-xs tabular-nums shrink-0">
                  {place.date}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* divider */}
        <div className="h-px w-full mb-8 animate-pulse bg-brand/40" />

        {/* wishlist */}
        <h1 className="text-xs font-medium text-muted-foreground mb-2">
          <Highlighter action="underline" color="hsl(24 95% 55%)">
            upcoming
          </Highlighter>
        </h1>
        <p className="text-xs text-muted-foreground/50 mb-8">
          ones i want to visit someday.
        </p>
        <ul className="space-y-1.5">
          {wishlist.map((place) => (
            <li
              key={place.name}
              className="flex items-baseline gap-2 text-sm text-muted-foreground cursor-default select-none"
            >
              <span className="text-xs opacity-40">·</span>
              {place.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
