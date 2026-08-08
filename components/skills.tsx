"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/data";
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiExpress,
  SiMongodb, SiShopify, SiWebflow, SiPostgresql, SiPrisma,
  SiDocker, SiGit, SiPython, SiCplusplus, SiWordpress, SiSocketdotio,
  SiTailwindcss, SiMysql, SiGithub, SiPostman,
} from "react-icons/si";

import { FaJava } from "react-icons/fa";

import type { IconType } from "react-icons";
import { fadeUp, viewport } from "@/lib/motion";

const ICONS: Record<string, IconType> = {
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
  "Shopify": SiShopify,
  "Webflow": SiWebflow,
  "PostgreSQL": SiPostgresql,
  "Prisma": SiPrisma,
  "WebSockets": SiSocketdotio,
  "Docker": SiDocker,
  "Git": SiGit,
  "Python": SiPython,
  "C++": SiCplusplus,
  "Java": FaJava,
  "WordPress": SiWordpress,
  "Tailwind CSS": SiTailwindcss,
  "MySQL": SiMysql,
  "GitHub": SiGithub,
  "Postman": SiPostman,
};

export const Skills = () => {
  const groups = Object.entries(DATA.skills);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={fadeUp}
      className="w-full space-y-4"
    >
      <h2 className="font-mono text-[11px] tracking-widest text-brand">skills</h2>
      <div className="space-y-3">
        {groups.map(([group, items], gi) => {
          const repeatCount = Math.max(2, Math.ceil(10 / items.length));
          const unit = Array(repeatCount).fill(items).flat();
          return (
          <div
            key={group}
            className="relative overflow-hidden liquid-glass rounded-lg flex items-center gap-2 py-1 pl-3 group"
          >
            <span className="shrink-0 font-mono text-[9px] tracking-widest text-muted-foreground/30">
              {group}
            </span>
            <div className="relative overflow-hidden flex-1 [mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)]">
              <div
                className={`flex w-max will-change-transform [transform:translateZ(0)] ${gi % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse"} group-hover:[animation-play-state:paused]`}
              >
                {[...unit, ...unit].map((skill, i) => {
                  const Icon = ICONS[skill];
                  return (
                    <span
                      key={`${skill}-${i}`}
                      className="flex items-center gap-1.5 shrink-0 mr-2 font-mono text-xs px-2.5 py-0.5 rounded-lg border border-transparent bg-background/60 text-muted-foreground hover:text-brand hover:border-brand/40 transition-colors"
                    >
                      {Icon && <Icon className="size-3 shrink-0" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </motion.div>
  );
};
