"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/data";
import { HorizontalCard } from "./horizaontal-card";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

export const Experience = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerContainer(0.08)}
      className="flex flex-col gap-3 w-full"
    >
      <motion.h2 variants={fadeUp} className="font-mono text-[11px] tracking-widest text-brand">
        experience
      </motion.h2>
      <div className="flex flex-col gap-2">
        {DATA.experience.map((experience, key) => (
          <motion.div key={key} variants={fadeUp}>
            <HorizontalCard
              logoUrl={experience.logoUrl}
              altText={experience.company}
              href={experience.href}
              location={experience.location}
              title={experience.company}
              subtitle={experience.role}
              period={`${experience.start} - ${experience.end}`}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
