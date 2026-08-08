import React from "react";
import { motion } from "framer-motion";
import { DATA } from "@/data/data";

export const HeaderButtons = () => {
  return (
    <div className="flex flex-row gap-2">
      {DATA.socialButtons.map((button, key) => (
        <motion.a
          key={key}
          href={button.link}
          target="_blank"
          rel="noopener noreferrer"
          title={button.message}
          whileHover={{ y: -3, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="liquid-glass flex items-center justify-center size-9 rounded-full border border-transparent text-muted-foreground hover:text-brand hover:border-brand/50 transition-colors"
        >
          <button.icon className="size-4" />
        </motion.a>
      ))}
    </div>
  );
};
