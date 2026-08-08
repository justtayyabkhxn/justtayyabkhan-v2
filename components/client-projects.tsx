"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DATA } from "@/data/data";
import { ProjectCard } from "./project-card";
import { Lock } from "lucide-react";

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=918279961679&text=Hey%20Tayyab%2C%20I%27d%20like%20to%20request%20the%20password%20for%20your%20Client%20Projects%20section.";

export const ClientProjectsSection = () => {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleUnlock = async () => {
    const res = await fetch("/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    const { ok } = await res.json();
    if (ok) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div layout className="w-full space-y-4">
      <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest flex items-center gap-1.5">
        client {!unlocked && <Lock className="size-3" />}
      </p>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="locked"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 liquid-glass"
          >
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Client work under NDA. Enter the password to view, or{" "}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline underline-offset-2"
              >
                request access ↗
              </a>
            </p>

            <motion.div
              className="flex gap-2 w-full max-w-xs"
              animate={shake ? { x: [-5, 5, -3, 3, 0] } : {}}
              transition={{ duration: 0.35 }}
            >
              <input
                type="password"
                placeholder="Password"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                className={`flex-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors bg-background placeholder:text-muted-foreground/40 focus:outline-none ${
                  error ? "border-destructive/60" : "border-transparent focus:border-brand"
                }`}
              />
              <button
                onClick={handleUnlock}
                className="px-3 py-1.5 text-xs rounded-lg border border-transparent text-muted-foreground hover:text-brand hover:border-brand/50 transition-colors"
              >
                Unlock
              </button>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-destructive/80"
              >
                Incorrect password.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {DATA.ClientProjects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="h-full"
              >
                <ProjectCard
                  href={project.href}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
