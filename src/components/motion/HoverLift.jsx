"use client";

import { motion } from "framer-motion";

export function HoverLift({ children, className, lift = 4 }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift }}
      transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

