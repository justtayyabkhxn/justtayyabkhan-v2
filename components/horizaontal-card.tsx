"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface CardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  location?: string;
}

export const HorizontalCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  period,
  description,
  location,
}: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(300px circle at ${x}% ${y}%, hsl(var(--brand) / 0.14), transparent 65%)`
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <Link
      href={href || "#"}
      className="relative block h-full group liquid-glass rounded-xl px-4 py-3 hover:border-brand/50 transition-colors overflow-hidden"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      target="_blank"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
        style={{ background: glowBg }}
      />
      <div className="relative flex items-start gap-3">
        <div className="rounded-full aspect-square bg-white shrink-0 group-hover:ring-1 group-hover:ring-brand/40 transition-all">
          <Image
            src={logoUrl}
            alt={altText}
            width={38}
            height={38}
            className="size-9 p-1.5 rounded-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium group-hover:text-brand transition-colors truncate min-w-0">
              {title}
              {description && (
                <ChevronRight
                  className={cn(
                    "inline size-3 ml-0.5 opacity-40 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              )}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground shrink-0 tabular-nums ml-auto pl-1">
              {period}
            </span>
          </div>
          {(subtitle || location) && (
            <div className="flex items-center justify-between gap-1.5 mt-0.5">
              {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
              {location && <span className="text-xs text-muted-foreground/50 ml-auto">{location}</span>}
            </div>
          )}
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? "auto" : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs text-muted-foreground mt-1.5 leading-relaxed overflow-hidden"
            >
              {description}
            </motion.div>
          )}
        </div>
      </div>
    </Link>
  );
};
