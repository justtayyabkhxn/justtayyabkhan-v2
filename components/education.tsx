"use client";

import { motion } from "framer-motion";
import { DATA } from "@/data/data";
import { HorizontalCard } from "./horizaontal-card";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

export const Education = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerContainer(0.08)}
      className="flex flex-col gap-3 w-full"
    >
      <motion.h2 variants={fadeUp} className="font-mono text-[11px] tracking-widest text-brand">
        education
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {DATA.education.map((education, key) => (
          <motion.div key={key} variants={fadeUp} className="h-full">
            <HorizontalCard
              logoUrl={education.logoUrl}
              altText={education.school}
              href={education.href}
              location={education.location}
              title={education.school}
              subtitle={education.degree}
              period={`${education.start} - ${education.end}`}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
