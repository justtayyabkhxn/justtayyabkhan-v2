"use client";

import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ProjectCardProps {
  title: string;
  href?: string;
  description: string;
  dates?: string;
  tags?: string[];
  link?: string;
  image?: string | StaticImageData;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export const ProjectCard = ({
  title,
  href,
  description,
  dates,
  tags,
  image,
  video,
  links,
  className,
}: ProjectCardProps) => {
  const plainDesc = description.replace(/\*\*(.*?)\*\*/g, "$1");

  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(500px circle at ${x}% ${y}%, hsl(var(--brand) / 0.16), transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 8);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -6 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "relative flex flex-col h-full rounded-2xl overflow-hidden liquid-glass hover:border-brand/50 transition-colors group/card",
          className
        )}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 mix-blend-overlay"
          style={{ background: glowBg }}
        />
      <Link href={href || "#"} target="_blank" className="block overflow-hidden relative">
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[190px] sm:h-[210px] object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-110"
          />
        )}
        {!video && image && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={210}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 672px"
            className="w-full h-[190px] sm:h-[210px] object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        {dates && (
          <span className="absolute top-2.5 right-2.5 font-mono text-[10px] px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-muted-foreground tabular-nums opacity-0 group-hover/card:opacity-100 transition-opacity">
            {dates}
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={href || "#"}
            target="_blank"
            className="text-sm font-semibold font-heading hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            {title}
            <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 group-hover/card:opacity-60 group-hover/card:translate-x-0 transition-all" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">
          {plainDesc}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {links && links.length > 0 && (
          <div className="flex gap-3 mt-3 pt-3">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                target="_blank"
                className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-brand transition-colors"
              >
                <ArrowUpRight className="size-3" />
                {link.type}
              </Link>
            ))}
          </div>
        )}
      </div>
      </motion.div>
    </motion.div>
  );
};
