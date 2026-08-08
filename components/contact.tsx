"use client";

import { motion } from "framer-motion";
import { Magnetic } from "./ui/magnetic";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

export const Contact = () => {
  return (
    <motion.div
      id="contact"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerContainer(0.08)}
      className="relative w-full py-10 sm:py-14 px-5 sm:px-10 rounded-3xl overflow-hidden liquid-glass text-center"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[260px] sm:size-[420px] rounded-full bg-brand/15 blur-[60px] sm:blur-[100px] motion-reduce:animate-none sm:animate-blob" />
      </div>

      <motion.h2 variants={fadeUp} className="font-mono text-[11px] tracking-widest text-brand">
        contact
      </motion.h2>

      <motion.h3
        variants={fadeUp}
        className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mt-3 tracking-tight text-balance"
      >
        Have something worth building?
      </motion.h3>

      <motion.p variants={fadeUp} className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-md mx-auto">
        I&apos;m probably free. Fastest response on{" "}
        <a
          target="_blank"
          href="https://api.whatsapp.com/send?phone=918279961679&text=Hey%2C%20Tayyab"
          className="text-brand hover:underline underline-offset-2"
        >
          WhatsApp ↗
        </a>{" "}
        — usually within the hour.
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
        <Magnetic strength={0.3} className="w-full sm:w-auto">
          <a
            href="mailto:tayyabkhangk4734@gmail.com"
            className="w-full sm:w-auto group flex items-center justify-center gap-1.5 font-mono text-sm px-5 py-2.5 rounded-full bg-brand text-brand-foreground hover:brightness-110 transition-all"
          >
            email
            <span className="inline-block transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        </Magnetic>
        <Magnetic strength={0.3} className="w-full sm:w-auto">
          <a
            target="_blank"
            href="https://api.whatsapp.com/send?phone=918279961679&text=Hey%2C%20Tayyab"
            className="w-full sm:w-auto flex items-center justify-center font-mono text-sm px-5 py-2.5 rounded-full border border-brand/40 text-brand hover:border-brand hover:bg-brand/10 transition-colors"
          >
            whatsapp ↗
          </a>
        </Magnetic>
        <Magnetic strength={0.3} className="w-full sm:w-auto">
          <a
            href="https://www.linkedin.com/in/justtayyabkhan/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center font-mono text-sm px-5 py-2.5 rounded-full border border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            linkedin ↗
          </a>
        </Magnetic>
      </motion.div>
    </motion.div>
  );
};
