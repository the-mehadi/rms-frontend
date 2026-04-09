"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  MoonStarIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNavContent } from "@/components/app/SidebarNav";
import { authAPI } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

function titleFromPathname(pathname) {
  const last = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function breadcrumbsFromPathname(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return ["Dashboard"];
  return parts.map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()));
}

export function TopHeader({ className }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user in TopHeader', e);
      }
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'MH';

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const title = titleFromPathname(pathname);
  const crumbs = breadcrumbsFromPathname(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-[72px] w-full",
        scrolled ? "shadow-lux-sm" : "",
        className
      )}
    >
      <div className="glass-strong mx-3 mt-3 flex h-[60px] items-center gap-3 rounded-3xl px-3 lg:ml-[280px] lg:mr-6 lg:px-5">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarNavContent className="w-full" />
            </SheetContent>
          </Sheet>

          <div className="hidden flex-col lg:flex">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {crumbs.map((c, idx) => (
                <React.Fragment key={`${c}-${idx}`}>
                  <span className={cn(idx === crumbs.length - 1 && "text-foreground")}>
                    {c}
                  </span>
                  {idx !== crumbs.length - 1 ? (
                    <ChevronRightIcon className="size-3 opacity-60" />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
            <div className="text-lg font-semibold tracking-tight">{title}</div>
          </div>

          <div className="flex flex-col lg:hidden">
            <div className="text-sm font-semibold tracking-tight">{title}</div>
            <div className="text-[11px] text-muted-foreground">
              {crumbs.at(0)}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, tables, menu…"
              className="h-10 w-[320px] rounded-2xl pl-10 focus-lux"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <SearchIcon className="size-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <BellIcon className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-muted/50">
              <Avatar className="size-9">
                <AvatarFallback className="bg-rms-gradient text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block">
                <div className="text-sm font-semibold leading-4">{user?.name || "Mehadi"}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role || "Admin"}</div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
    </header>
  );
}

