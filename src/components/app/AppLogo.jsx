"use client";

import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href="/dashboard"
      className="group flex h-20 w-full items-center gap-3 px-5"
    >
      <div className="grid size-11 place-items-center rounded-2xl bg-rms-gradient shadow-(--shadow-glow) transition-transform duration-200 group-hover:scale-[1.03]">
        <span className="font-semibold tracking-tight text-white">R</span>
      </div>
      <div className="leading-tight">
        <div className="text-base font-semibold tracking-tight text-white">
          RMS Luxe
        </div>
        <div className="text-xs text-white/70">Restaurant Management</div>
      </div>
    </Link>
  );
}

