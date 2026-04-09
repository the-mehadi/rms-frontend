"use client";

import * as React from "react";
import { animate, useMotionValue } from "framer-motion";

export function CountUp({
  value,
  decimals = 0,
  duration = 0.8,
  className,
  prefix = "",
  suffix = "",
  format,
}) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    const controls = animate(mv, Number(value ?? 0), {
      duration,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => {
        const num = Number(latest);
        if (format) return setDisplay(format(num));
        setDisplay(
          `${prefix}${num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${suffix}`
        );
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration, prefix, suffix]);

  return <span className={className}>{display}</span>;
}

