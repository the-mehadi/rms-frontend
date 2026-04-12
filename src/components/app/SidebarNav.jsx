"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/app-nav";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, LogOutIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { AppLogo } from "@/components/app/AppLogo";
import { authAPI } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

function NavItem({ href, label, icon: Icon, active, disabled }) {
  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled ? "true" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
        disabled
          ? "cursor-not-allowed text-white/40"
          : "text-white/80 hover:text-white",
        active && !disabled && "text-white"
      )}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10 transition-all",
          !disabled && "group-hover:bg-white/14",
          active && !disabled && "bg-white/14 ring-white/20"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex-1">{label}</span>

      {active && !disabled ? (
        <>
          <span className="absolute inset-0 -z-10 rounded-2xl bg-white/10 backdrop-blur-md" />
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-rms-gradient" />
        </>
      ) : null}
    </Link>
  );
}

export function SidebarNavContent({ className, surface = "dark" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user in SidebarNav', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    router.push("/login");
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'MH';

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden",
        surface === "dark" ? "bg-[#0A0A0A]" : "bg-background",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_20%_0%,rgba(255,107,53,0.28)_0%,transparent_55%),radial-gradient(700px_500px_at_90%_20%,rgba(99,102,241,0.22)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-white/6 to-transparent" />

      <div className="relative">
        <AppLogo />
        <Separator className="bg-white/10" />
      </div>

      <nav className="relative flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <div className="px-3 text-[11px] font-semibold tracking-[0.22em] text-white/50">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  disabled={item.disabled}
                  active={pathname === item.href}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative p-4">
        <div className="glass-strong lux-card p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-10 ring-1 ring-white/15">
                <AvatarFallback className="bg-white/10 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 ring-2 ring-[#0A0A0A]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {user?.name || "Mehadi Hasan"}
              </div>
              <div className="truncate text-xs text-white/70 capitalize">{user?.role || "Admin"}</div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="grid size-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/12 transition hover:bg-white/14">
                <ChevronDownIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                >
                  {theme === "dark" ? (
                    <SunIcon className="mr-2 size-4" />
                  ) : (
                    <MoonStarIcon className="mr-2 size-4" />
                  )}
                  Toggle theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                  <LogOutIcon className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarNav() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-[280px] lg:flex-col">
      <SidebarNavContent />
    </aside>
  );
}

