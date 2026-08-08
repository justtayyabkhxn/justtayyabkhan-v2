"use client";

import Image from "next/image";
import ProfilePic from "@/public/profile.png";
import { HeaderButtons } from "./header-buttons";
import ShinyButton from "./ui/shiny-button";
import { Magnetic } from "./ui/magnetic";
import { motion } from "framer-motion";

const NAME = "Tayyab Khan";

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};

const nameChar = {
  hidden: { y: "110%", opacity: 0, rotate: 6 },
  show: {
    y: "0%",
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const Header = () => {
  return (
    <div className="relative w-full pt-6 sm:pt-2">
      <div className="flex md:flex-row flex-col-reverse items-center md:items-end justify-between w-full gap-8">
        <div className="flex flex-col gap-4 min-w-0 items-center md:items-start text-center md:text-left">
          <h1 className="font-heading font-bold tracking-tight text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95] pb-2 overflow-visible">
            <motion.span
              variants={nameContainer}
              initial="hidden"
              animate="show"
              className="inline-flex flex-wrap justify-center md:justify-start"
            >
              {NAME.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  variants={nameChar}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground"
          >
            <span className="font-semibold text-foreground">Full-Stack Developer</span>
            <span className="opacity-40">·</span>
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-brand" />
            </span>
            <span>Freelancer</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-muted-foreground/80 leading-relaxed max-w-sm"
          >
            Physics major turned web dev. Building things that matter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <HeaderButtons />
            <Magnetic strength={0.35}>
              <ShinyButton href="#contact">Open for gigs</ShinyButton>
            </Magnetic>
          </motion.div>
        </div>

        {/* Profile pic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative group shrink-0"
        >
          <Image
            src={ProfilePic}
            width={200}
            height={200}
            alt="Tayyab Khan"
            priority
            className="relative size-40 sm:size-[200px] rounded-full object-cover"
          />
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundImage: NOISE, backgroundSize: "200px 200px", mixBlendMode: "overlay" }}
          />
        </motion.div>
      </div>
    </div>
  );
};
