"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Image as ImageIcon, MapPin, User } from "lucide-react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const GALLERY_PREVIEWS = [
  "/imgs/IMG_20260403_170012727_HDR.jpg",
  "/imgs/IMG_20260404_083919225_HDR.jpg",
  "/imgs/IMG_20260405_150517743.jpg",
  "/imgs/IMG_20260406_103315810_HDR.jpg",
  "/imgs/IMG_20241101_133830037.jpg",
];

const ALL_LINKS = [
  { href: "/", label: "home", icon: Home },
  { href: "/gallery", label: "gallery", icon: ImageIcon },
  { href: "/places", label: "places", icon: MapPin },
  { href: "/about", label: "about", icon: User },
];

export const Nav = ({ current }: { current?: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [galleryHover, setGalleryHover] = useState(false);
  const previewImg = useRef(GALLERY_PREVIEWS[0]);
  const lastY = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      if (y <= 60) {
        setCollapsed((prev) => (prev ? false : prev));
      } else if (y > lastY.current + 4) {
        setCollapsed((prev) => (prev ? prev : true));
      } else if (y < lastY.current - 4) {
        setCollapsed((prev) => (prev ? false : prev));
      }
      lastY.current = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inlineLinks = ALL_LINKS;

  return (
    <>
      {/* Gallery cursor preview */}
      <AnimatePresence>
        {galleryHover && (
          <motion.div
            key="gallery-preview"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[9997] pointer-events-none rounded-xl overflow-hidden shadow-2xl"
            style={{ top: cursor.y + 16, left: cursor.x + 16, width: 180 }}
          >
            <img src={previewImg.current} alt="" className="w-full h-auto block" draggable={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-[1002]">
        <AnimatedThemeToggler className="liquid-glass relative p-2.5 rounded-full hover:text-brand transition-colors" />
      </div>

      {/* ── Desktop ── */}
      <div className="flex fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[999]">
        <motion.nav
          layout
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.8 }, opacity: { duration: 0.5 }, y: { duration: 0.5 } }}
          className="liquid-glass relative flex items-center gap-1 rounded-full px-1 py-1 sm:px-1.5 sm:py-1.5"
        >
          {inlineLinks.map((link) => {
            const isActive = link.href === (current ?? "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                title={collapsed ? link.label : undefined}
                className={`relative flex items-center font-mono text-xs rounded-full transition-colors ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
                onMouseEnter={() => {
                  if (link.href === "/gallery") {
                    previewImg.current = GALLERY_PREVIEWS[Math.floor(Math.random() * GALLERY_PREVIEWS.length)];
                    setGalleryHover(true);
                  }
                }}
                onMouseLeave={() => setGalleryHover(false)}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="liquid-glass-active absolute inset-0 rounded-full -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 24, mass: 0.7 }}
                  />
                )}
                <motion.span layout="position" className="relative flex items-center px-3.5 py-1.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {collapsed ? (
                      <motion.span
                        key="icon"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center"
                      >
                        <Icon className="size-3.5 shrink-0" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="label"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="whitespace-nowrap"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              </Link>
            );
          })}
        </motion.nav>
      </div>
    </>
  );
};
