"use client";

import * as React from "react";

export function ThemeTransition() {
  React.useEffect(() => {
    const el = document.documentElement;
    el.classList.add("theme-transition");
    const t = window.setTimeout(() => el.classList.remove("theme-transition"), 260);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
