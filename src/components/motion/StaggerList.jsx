"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function StaggerList({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div className={className} variants={item} transition={{ duration: 0.32 }}>
      {children}
    </motion.div>
  );
}

