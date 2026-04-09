"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TABS } from "@/lib/app-nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="glass-strong mx-3 mb-3 rounded-3xl px-1.5 py-1.5 shadow-lux-md">
        <div className="grid grid-cols-5 gap-1">
          {MOBILE_TABS.map((tab) => {
            const active = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-2xl ring-1 transition",
                    active
                      ? "bg-rms-gradient text-white ring-transparent shadow-glow"
                      : "bg-background/40 text-foreground ring-border/60"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="leading-none">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

