"use client";

import * as React from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { HoverLift } from "@/components/motion/HoverLift";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CATEGORIES, MENU_ITEMS } from "@/lib/mock/orders";
import { tablesAPI } from "@/lib/api/table";
import { categoriesAPI } from "@/lib/api/categories";
import { formatCurrency } from "@/lib/format";
import {
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";

const TABLE_STYLES = {
  available: {
    label: "Available",
    badge: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
    ring: "ring-emerald-400/25",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(16,185,129,0.35)_0%,transparent_60%)]",
  },
  occupied: {
    label: "Occupied",
    badge: "bg-orange-500/12 text-orange-900 dark:text-orange-300",
    ring: "ring-orange-400/25",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(255,107,53,0.35)_0%,transparent_60%)]",
  },
  reserved: {
    label: "Reserved",
    badge: "bg-indigo-500/12 text-indigo-900 dark:text-indigo-300",
    ring: "ring-indigo-400/25",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(99,102,241,0.35)_0%,transparent_60%)]",
  },
};

function MenuItemCard({ item, onAdd }) {
  return (
    <HoverLift lift={3} className="h-full">
      <div className="group relative h-full overflow-hidden rounded-3xl border bg-background/40">
        <div className="aspect-4/3 w-full overflow-hidden">
          <div className="h-full w-full bg-[radial-gradient(220px_140px_at_25%_0%,rgba(255,107,53,0.32)_0%,transparent_60%),radial-gradient(220px_140px_at_95%_20%,rgba(99,102,241,0.20)_0%,transparent_55%)] transition-transform duration-300 group-hover:scale-[1.03]" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/25 opacity-70 transition-opacity group-hover:opacity-90" />
        </div>

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full bg-background/70 backdrop-blur">{item.category}</Badge>
          <Badge className="rounded-full bg-amber-500/12 text-amber-900 dark:text-amber-300">
            {item.tag}
          </Badge>
        </div>

        <div className="flex items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{item.name}</div>
            <div className="mt-1 text-sm font-semibold text-rms-gradient">
              {formatCurrency(item.price, "BDT")}
            </div>
          </div>

          <Button
            onClick={() => onAdd(item)}
            size="icon"
            className="size-11 rounded-2xl bg-rms-gradient text-white shadow-glow transition group-hover:scale-[1.02]"
          >
            <PlusIcon className="size-5" />
          </Button>
        </div>
      </div>
    </HoverLift>
  );
}

function QuantityStepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border bg-background/50 p-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-4" />
      </Button>
      <div className="min-w-10 text-center text-sm font-semibold tabular-nums">
        {value}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
}

function Cart({ cart, setCart, notes, setNotes }) {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <div className="glass-strong lux-card p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Cart</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Sticky • glass surface
          </div>
        </div>
        <Badge className="rounded-full bg-muted text-muted-foreground">
          {items.length} items
        </Badge>
      </div>

      <Separator className="my-5" />

      <ScrollArea className="h-[280px] pr-3">
        {items.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border bg-background/40 p-6 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-rms-gradient text-white shadow-glow">
              <ShoppingBagIcon className="size-5" />
            </div>
            <div className="mt-3 text-sm font-semibold">Cart is empty</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Add items from the menu to start an order.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-3 rounded-2xl border bg-background/40 p-3"
              >
                <div className="grid size-11 place-items-center rounded-2xl bg-[radial-gradient(24px_24px_at_30%_20%,rgba(255,107,53,0.45)_0%,transparent_70%)] ring-1 ring-border">
                  <SparklesIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{it.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {formatCurrency(it.price, "BDT")}
                  </div>
                </div>
                <QuantityStepper
                  value={it.qty}
                  onChange={(qty) =>
                    setCart((c) => ({ ...c, [it.id]: { ...c[it.id], qty } }))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
                  aria-label="Remove item"
                  onClick={() =>
                    setCart((c) => {
                      const next = { ...c };
                      delete next[it.id];
                      return next;
                    })
                  }
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Separator className="my-5" />

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">Subtotal</div>
        <div className="font-semibold">{formatCurrency(subtotal, "BDT")}</div>
      </div>

      <Accordion type="single" collapsible className="mt-5">
        <AccordionItem value="notes" className="border-none">
          <AccordionTrigger className="rounded-2xl border bg-background/40 px-4 hover:no-underline">
            Special notes
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, spice level, timing…"
              className="min-h-24 rounded-2xl focus-lux"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="mt-5 h-12 w-full rounded-2xl bg-rms-gradient text-white shadow-glow"
        disabled={items.length === 0}
        onClick={() => {
          // UI-only: show toast later if desired
        }}
      >
        Submit order
      </Button>
    </div>
  );
}

export default function OrdersPage() {
  const [tables, setTables] = React.useState([]);
  const [selectedTable, setSelectedTable] = React.useState(null);
  const [categories, setCategories] = React.useState(["All"]);
  const [category, setCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [cart, setCart] = React.useState({});
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadingCategories, setLoadingCategories] = React.useState(true);

  // table fetch data from API
  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await tablesAPI.getAll();
        if (response.success) {
          const mappedTables = response.data.map((t) => ({
            ...t,
            number: t.table_number, // map table_number to number
            bill: t.bill || null, // API might not have bill yet
          }));
          setTables(mappedTables);
          if (mappedTables.length > 0) {
            setSelectedTable(mappedTables[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        if (response.success) {
          const fetchedCategories = response.data.items.map((c) => c.name);
          setCategories(["All", ...fetchedCategories]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchTables();
    fetchCategories();
  }, []);


  const filteredMenu = React.useMemo(() => {
    return MENU_ITEMS.filter((it) => {
      const inCategory = category === "All" || it.category === category;
      const inQuery =
        query.trim() === "" ||
        it.name.toLowerCase().includes(query.trim().toLowerCase());
      return inCategory && inQuery;
    });
  }, [category, query]);

  const addToCart = (item) => {
    setCart((c) => {
      const existing = c[item.id];
      return {
        ...c,
        [item.id]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { ...item, qty: 1 },
      };
    });
  };

  const cartCount = Object.values(cart).reduce((n, it) => n + it.qty, 0);

  return (
    <>
      <PageTransition className="space-y-6 pb-20 lg:pb-0">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Left Content Area */}
          <div className="space-y-8">
            {/* Table selection section */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Table selection</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Tap a table to start an order
                  </div>
                </div>
                <Badge className="rounded-full bg-muted text-muted-foreground">
                  Selected: Table {selectedTable?.number}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square w-full animate-pulse rounded-3xl border bg-muted/20"
                    />
                  ))
                ) : tables.length > 0 ? (
                  tables.map((t) => {
                    const meta = TABLE_STYLES[t.status] || TABLE_STYLES.available;
                    const active = selectedTable?.id === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTable(t)}
                        className={cn(
                          "relative aspect-square w-full overflow-hidden rounded-3xl border bg-background/40 p-4 text-left transition",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30",
                          "active:scale-[0.99]",
                          meta.ring,
                          active ? "shadow-glow" : "hover:shadow-lux-sm"
                        )}
                      >
                        <div className={cn("absolute inset-0 opacity-80", meta.bg)} />
                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between gap-2">
                            <Badge className={`rounded-full  ${meta.badge}`}>
                              {meta.label}
                            </Badge>
                            {t.bill ? (
                              <Badge className="rounded-full bg-amber-500/12 text-amber-900 dark:text-amber-300">
                                {formatCurrency(t.bill, "BDT")}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="mt-auto">
                            <div className="text-5xl font-semibold tracking-tight tabular-nums">
                              {t.number}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Tap to open
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No tables found.
                  </div>
                )}
              </div>
            </section>

            {/* Menu section with sticky categories/search bar */}
            <section className="space-y-4">
              <div className="sticky top-[96px] z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:-mx-6 sm:px-6 lg:-mx-0 lg:px-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-semibold transition",
                          category === c
                            ? "bg-rms-gradient text-white border-transparent shadow-glow"
                            : "bg-background/40 text-foreground hover:bg-muted"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search menu…"
                      className="h-11 w-full rounded-2xl pl-10 sm:w-[320px] focus-lux"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMenu.map((it) => (
                  <MenuItemCard key={it.id} item={it} onAdd={addToCart} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Content Area - Desktop Sticky Cart */}
          <div className="hidden lg:block lg:sticky lg:top-[96px] lg:self-start">
            <Cart cart={cart} setCart={setCart} notes={notes} setNotes={setNotes} />
          </div>
        </div>
      </PageTransition>

      {/* Mobile Cart Button Trigger - Always Fixed on Mobile (Placed outside PageTransition to avoid transform issues) */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed bottom-[104px] right-5 z-40 size-14 rounded-3xl bg-rms-gradient p-0 text-white shadow-glow">
              <ShoppingBagIcon className="size-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-background text-xs font-semibold text-foreground shadow-lux-sm">
                  {cartCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0">
            <SheetHeader className="p-5">
              <SheetTitle>Cart</SheetTitle>
            </SheetHeader>
            <div className="p-5 pt-0">
              <Cart cart={cart} setCart={setCart} notes={notes} setNotes={setNotes} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

