"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "intro" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "skills", label: "skills" },
  { id: "education", label: "education" },
  { id: "work", label: "work" },
  { id: "contact", label: "contact" },
];

export const ScrollProgress = () => {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[998] flex-col items-end gap-3">
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-2 group"
            aria-label={label}
          >
            {/* label */}
            <span
              className={`font-mono text-[10px] tracking-widest transition-all duration-200 ${
                hovered === id ? "opacity-60" : "opacity-0"
              } ${isActive ? "text-brand" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {/* dot */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2 h-2 bg-brand"
                  : "w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
