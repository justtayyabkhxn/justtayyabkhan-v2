"use client";

import { motion } from "framer-motion";
import { ChessStats } from "./chess-stats";
import { fadeUp, viewport } from "@/lib/motion";

export const Aboutsection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={fadeUp}
      className="relative w-full liquid-glass rounded-2xl p-5 sm:p-6 space-y-3"
    >
      <span className="font-mono text-[11px] tracking-widest text-brand">about</span>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        Physics major who pivoted to web. I build full-stack apps, Shopify stores, and Webflow sites — mostly for people who care about the details, mostly at ungodly hours.
      </p>
      <ChessStats compact />
    </motion.div>
  );
};
