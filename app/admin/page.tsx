"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Loader2, Eye, EyeOff, LogOut } from "lucide-react";
import { Particles } from "@/components/ui/particles";
import { Nav } from "@/components/nav";
import {
  TOGGLEABLE_LINKS,
  DEFAULT_NAV_CONFIG,
  NavConfig,
  NavKey,
} from "@/lib/nav-links";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function AdminPage() {
  const [isDark, setIsDark] = useState(false);
  const [quantity, setQuantity] = useState(70);

  // auth
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // config
  const [config, setConfig] = useState<NavConfig>(DEFAULT_NAV_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

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
    setQuantity(window.innerWidth < 768 ? 24 : 70);
  }, []);

  const particleColor = isDark ? "#ffffff" : "#1a1a1a";

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/nav-config", { cache: "no-store" });
      const data: NavConfig = await res.json();
      setConfig(data);
    } catch {
      setConfig(DEFAULT_NAV_CONFIG);
    } finally {
      setLoaded(true);
    }
  };

  const handleUnlock = async () => {
    const res = await fetch("/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const { ok } = await res.json();
    if (ok) {
      setUnlocked(true);
      setAuthError(false);
      loadConfig();
    } else {
      setAuthError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLogout = () => {
    setUnlocked(false);
    setPassword("");
    setAuthError(false);
    setLoaded(false);
    setSaveState("idle");
    setConfig(DEFAULT_NAV_CONFIG);
  };

  const toggle = (key: NavKey) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveState("idle");
  };

  const handleSave = async () => {
    setSaveState("saving");
    try {
      const res = await fetch("/api/nav-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, config }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setConfig(data.config);
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
      } else {
        setSaveState("error");
      }
    } catch {
      setSaveState("error");
    }
  };

  return (
    <div className="absolute inset-0 h-fit w-full">
      <Particles
        key={`${particleColor}-${quantity}`}
        className="fixed inset-0 -z-10 h-full w-full"
        quantity={quantity}
        color={particleColor}
        size={0.6}
      />

      <Nav current="/admin" />

      <div className="mx-auto max-w-lg px-4 pt-24 sm:pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* heading */}
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-mono text-[11px] tracking-widest text-brand">
              admin
            </h2>
            {unlocked && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-brand transition-colors"
              >
                <LogOut className="size-3" />
                logout
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!unlocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 liquid-glass"
              >
                <p className="text-xs text-muted-foreground text-center max-w-xs flex items-center gap-1.5">
                  <Lock className="size-3 shrink-0" />
                  Enter the admin password to continue.
                </p>

                <motion.div
                  className="flex gap-2 w-full max-w-xs"
                  animate={shake ? { x: [-5, 5, -3, 3, 0] } : {}}
                  transition={{ duration: 0.35 }}
                >
                  <div className="relative flex-1">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setAuthError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                      className={`w-full px-2.5 py-1.5 pr-8 text-xs rounded-lg border transition-colors bg-background placeholder:text-muted-foreground/40 focus:outline-none ${
                        authError
                          ? "border-destructive/60"
                          : "border-transparent focus:border-brand"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-brand transition-colors"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={handleUnlock}
                    className="px-3 py-1.5 text-xs rounded-lg border border-transparent text-muted-foreground hover:text-brand hover:border-brand/50 transition-colors"
                  >
                    Unlock
                  </button>
                </motion.div>

                {authError && (
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
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col divide-y divide-border/50 rounded-2xl liquid-glass overflow-hidden">
                  {TOGGLEABLE_LINKS.map((link) => {
                    const on = config[link.key];
                    return (
                      <div
                        key={link.key}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground font-medium capitalize">
                            {link.label}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/60">
                            {link.href}
                          </span>
                        </div>

                        <button
                          role="switch"
                          aria-checked={on}
                          aria-label={`Toggle ${link.label} link`}
                          onClick={() => toggle(link.key)}
                          disabled={!loaded}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:opacity-40 ${
                            on ? "bg-brand" : "bg-muted-foreground/25"
                          }`}
                        >
                          <motion.span
                            layout
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className={`inline-block size-5 rounded-full bg-white shadow-sm ${
                              on ? "ml-[22px]" : "ml-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground/60">
                    {loaded
                      ? "Changes apply site-wide after saving."
                      : "Loading current settings…"}
                  </p>
                  <button
                    onClick={handleSave}
                    disabled={saveState === "saving" || !loaded}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg border transition-colors disabled:opacity-50 ${
                      saveState === "saved"
                        ? "border-brand/60 text-brand"
                        : "border-transparent text-muted-foreground hover:text-brand hover:border-brand/50"
                    }`}
                  >
                    {saveState === "saving" && (
                      <Loader2 className="size-3.5 animate-spin" />
                    )}
                    {saveState === "saved" && <Check className="size-3.5" />}
                    {saveState === "saving"
                      ? "Saving…"
                      : saveState === "saved"
                      ? "Saved"
                      : "Save changes"}
                  </button>
                </div>

                {saveState === "error" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-destructive/80"
                  >
                    Could not save. Check that the server can write to the config
                    file.
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
