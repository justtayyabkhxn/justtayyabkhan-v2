"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

type Format = { rating: number; best: number; win: number; loss: number; draw: number };
type Stats = { blitz?: Format; rapid?: Format; daily?: Format; tactics?: number; lastOnline?: number; totalGames?: number };

function winRate(f: Format) {
  const total = f.win + f.loss + f.draw;
  return total > 0 ? Math.round((f.win / total) * 100) : 0;
}

export function ChessStats({ compact = false }: { compact?: boolean }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("https://api.chess.com/pub/player/justtayyabkhan/stats").then((r) => r.json()),
      fetch("https://api.chess.com/pub/player/justtayyabkhan").then((r) => r.json()),
    ])
      .then(([d, profile]) => {
        const blitz = d.chess_blitz && {
          rating: d.chess_blitz.last.rating,
          best: d.chess_blitz.best?.rating ?? d.chess_blitz.last.rating,
          win: d.chess_blitz.record.win,
          loss: d.chess_blitz.record.loss,
          draw: d.chess_blitz.record.draw,
        };
        const rapid = d.chess_rapid && {
          rating: d.chess_rapid.last.rating,
          best: d.chess_rapid.best?.rating ?? d.chess_rapid.last.rating,
          win: d.chess_rapid.record.win,
          loss: d.chess_rapid.record.loss,
          draw: d.chess_rapid.record.draw,
        };
        const daily = d.chess_daily && {
          rating: d.chess_daily.last.rating,
          best: d.chess_daily.best?.rating ?? d.chess_daily.last.rating,
          win: d.chess_daily.record.win,
          loss: d.chess_daily.record.loss,
          draw: d.chess_daily.record.draw,
        };
        const total = [blitz, rapid, daily].filter(Boolean).reduce(
          (acc, f) => acc + f!.win + f!.loss + f!.draw, 0
        );
        setStats({
          blitz, rapid, daily,
          tactics: d.tactics?.highest?.rating,
          lastOnline: profile.last_online,
          totalGames: total,
        });
      })
      .catch(() => {});
  }, []);

  if (!stats) return null;

  if (compact) {
    const lastOnlineStr = stats.lastOnline
      ? (() => {
          const diff = Math.floor((Date.now() - stats.lastOnline! * 1000) / (1000 * 60 * 60 * 24));
          if (diff === 0) return "online today";
          if (diff === 1) return "online yesterday";
          return `online ${diff} days ago`;
        })()
      : null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground/60 pt-3"
      >
        <span className="text-brand">♟</span>
        {stats.blitz && <span>blitz best: {stats.blitz.best}</span>}
        {stats.totalGames != null && <span>{stats.totalGames} games</span>}
        {lastOnlineStr && <span>last {lastOnlineStr}</span>}
        <a
          href="https://www.chess.com/member/justtayyabkhan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand transition-colors"
        >
          chess.com ↗
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerContainer(0.06)}
      className="w-full space-y-3"
    >
      <motion.h2 variants={fadeUp} className="font-mono text-[11px] tracking-widest text-brand">
        {"// chess"}
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "blitz", data: stats.blitz },
          { label: "rapid", data: stats.rapid },
          { label: "daily", data: stats.daily },
        ]
          .filter((f) => f.data)
          .map(({ label, data }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="liquid-glass rounded-xl p-4 space-y-1"
            >
              <span className="font-mono text-[10px] text-muted-foreground/50 tracking-wide">{label}</span>
              <div className="text-2xl font-heading font-semibold tabular-nums">{data!.rating}</div>
              <div className="font-mono text-[11px] text-muted-foreground/50 tabular-nums">
                {data!.win}W · {data!.loss}L · {data!.draw}D · {winRate(data!)}%
              </div>
            </motion.div>
          ))}
      </div>
      {stats.tactics && (
        <motion.div variants={fadeUp} className="font-mono text-xs text-muted-foreground/60">
          tactics rating: <span className="text-foreground font-medium">{stats.tactics}</span>
        </motion.div>
      )}
      <motion.a
        variants={fadeUp}
        href="https://www.chess.com/member/justtayyabkhan"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-mono text-xs text-muted-foreground/50 hover:text-brand transition-colors pt-1"
      >
        view on chess.com ↗
      </motion.a>
    </motion.div>
  );
}
