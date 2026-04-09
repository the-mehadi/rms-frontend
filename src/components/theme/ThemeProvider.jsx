import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeTransition } from "./ThemeTransition";

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeTransition />
      {children}
    </NextThemesProvider>
  );
}

