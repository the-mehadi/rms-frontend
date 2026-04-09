"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  React.useEffect(() => {
    const el = document.documentElement;
    el.classList.add("theme-transition");
    const t = window.setTimeout(() => el.classList.remove("theme-transition"), 260);
    return () => window.clearTimeout(t);
  });

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

