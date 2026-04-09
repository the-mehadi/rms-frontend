"use client";

import * as React from "react";
import { format } from "date-fns";

export function DashboardHero({ name = "Mehadi" }) {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-4xl border bg-background/40 p-8 sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_15%_0%,rgba(255,107,53,0.22)_0%,transparent_55%),radial-gradient(700px_500px_at_90%_20%,rgba(99,102,241,0.18)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/20 to-transparent dark:from-white/6" />

      <div className="relative">
        <div className="text-sm font-semibold text-muted-foreground">
          {format(now, "EEEE, MMMM d")} • {format(now, "p")}
        </div>
        <div className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, <span className="text-rms-gradient">{name}</span>
        </div>
        <div className="mt-3 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
          Today’s service is looking great. Keep an eye on peak-hour orders, and
          move tickets through the kitchen with confidence.
        </div>
      </div>
    </div>
  );
}

