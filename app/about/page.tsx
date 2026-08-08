"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProfilePic from "@/public/profile.png";
import { Particles } from "@/components/ui/particles";
import { Nav } from "@/components/nav";
import { ChessStats } from "@/components/chess-stats";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [isDark, setIsDark] = useState(false);
  const [jokeOpen, setJokeOpen] = useState(false);
  const [quantity, setQuantity] = useState(80);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setQuantity(window.innerWidth < 768 ? 24 : 80);
  }, []);

  const particleColor = isDark ? "#ffffff" : "#1a1a1a";

  return (
    <div className="absolute inset-0 h-fit w-full">
      <Particles
        key={`${particleColor}-${quantity}`}
        className="fixed inset-0 -z-10 h-full w-full"
        quantity={quantity}
        color={particleColor}
        size={0.6}
      />

      <Nav current="/about" />

      <div className="mx-auto max-w-2xl px-4 pt-24 sm:pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-10"
        >
          {/* Photo + name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
            <Image
              src={ProfilePic}
              width={200}
              draggable="false"
              height={200}
              alt="Tayyab Khan"
              priority
              className="size-40 sm:size-[200px] rounded-2xl opacity-90 shrink-0 object-cover"
            />
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-black dark:text-white">
                Tayyab Khan
              </h1>
              <p className="text-sm text-muted-foreground">
                Full-Stack Developer · New Delhi, India
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                23 y/o · formerly: physicist (allegedly)
              </p>
            </div>
          </div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="space-y-4"
          >
            <h2 className="font-mono text-[11px] tracking-widest text-brand">
              about
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                I spent three years at Aligarh Muslim University studying the
                fundamental forces of the universe — gravity, electromagnetism,
                the works — and then decided the real unsolved problem was
                physics shedding my hairs off. Armed with a B.Sc. in Physics
                that I now use exclusively to make puns, I pivoted to web
                development and haven&apos;t looked back. Newton&apos;s third
                law, apparently, did not apply to my career trajectory.{" "}
                <button
                  onClick={() => setJokeOpen((v) => !v)}
                  className="text-brand hover:text-muted-foreground transition-colors text-xs underline underline-offset-2"
                >
                  (understand joke)
                </button>
                {jokeOpen && (
                  <span className="block mt-1 text-xs text-muted-foreground/50 italic">
                    Newton&apos;s third law: every action has an equal and
                    opposite reaction. If you push hard into physics, you&apos;d
                    expect to be pulled back. The joke is — it didn&apos;t. No
                    resistance, no bounce-back. Just a clean exit into web dev.
                  </span>
                )}
              </p>
              <p>
                These days I work as a Creative Web Developer at{" "}
                <a
                  href="https://www.volume.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline underline-offset-2"
                >
                  VOLUME Creative Agency ↗
                </a>{" "}
                in Connaught Place, New Delhi — building immersive websites and
                custom CMSes for brands that actually care about the details.
                Outside of office hours, I freelance, which is a polite way of
                saying I am always building something for someone at some
                ungodly hour.
              </p>
              <p>
                I built{" "}
                <a
                  href="https://mybudgetory.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline underline-offset-2"
                >
                  MyBudgetory ↗
                </a>{" "}
                — a personal finance tracker that not only logs your income and
                expenses but will also WhatsApp your friends when they owe you
                money. Because manually asking people to pay you back is
                awkward. Automating it is just good engineering.
              </p>
              <p>
                My Pomodoro app is a fully offline-capable PWA. Its README
                documentation is, in its entirety, just my name.
                &ldquo;Tayyab.&rdquo; I contain multitudes.
              </p>
            </div>
          </motion.div>

          {/* Currently */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="space-y-3"
          >
            <h2 className="font-mono text-[11px] tracking-widest text-brand">
              currently
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-baseline gap-2">
                <span className="text-xs opacity-40">·</span>
                Creative Web Developer @ Volume Creative Agency, New Delhi
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-xs opacity-40">·</span>
                Open to freelance — full-stack apps, Shopify, Webflow
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-xs opacity-40">·</span>
                MCA, Aligarh Muslim University (2023–2025) — because one degree
                wasn&apos;t enough of a detour
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-xs opacity-40">·</span>
                Somewhere in the Himalayas, probably (see{" "}
                <Link
                  href="/gallery"
                  className="text-foreground hover:underline underline-offset-2"
                >
                  gallery
                </Link>
                )
              </li>
            </ul>
          </motion.div>

          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
            className="space-y-3"
          >
            <h2 className="font-mono text-[11px] tracking-widest text-brand">
              stack
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              React, Next.js, TypeScript, Node.js, MongoDB, PostgreSQL, Docker,
              Prisma, WebSockets — and whatever else the project demands.
              Previously: wave equations and thermodynamics. Significant
              improvement duh.
            </p>
          </motion.div>

          {/* Chess */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4, ease: "easeOut" }}
          >
            <ChessStats />
          </motion.div>

          {/* Get in touch */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            className="space-y-3 pb-4"
          >
            <h2 className="font-mono text-[11px] tracking-widest text-brand">
              get in touch
            </h2>
            <p className="text-sm text-muted-foreground">
              Best reached on{" "}
              <a
                href="https://api.whatsapp.com/send?phone=918279961679&text=Hey%20Tayyab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-2"
              >
                WhatsApp ↗
              </a>{" "}
              or{" "}
              <a
                href="mailto:tayyabkhangk4734@gmail.com"
                className="text-foreground hover:underline underline-offset-2"
              >
                email ↗
              </a>
              . I reply fast — occupational hazard of someone who built an
              automated reminder system for their own friends.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
