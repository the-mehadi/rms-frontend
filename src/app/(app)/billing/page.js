"use client";

import * as React from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { cn } from "@/lib/utils";
import { BILL } from "@/lib/mock/billing";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  BanknoteIcon,
  CreditCardIcon,
  MailIcon,
  PercentIcon,
  PrinterIcon,
  SmartphoneIcon,
  Trash2Icon,
} from "lucide-react";

const METHODS = [
  { key: "cash", label: "Cash", icon: BanknoteIcon },
  { key: "bkash", label: "bKash", icon: SmartphoneIcon },
  { key: "card", label: "Card", icon: CreditCardIcon },
];

export default function BillingPage() {
  const [method, setMethod] = React.useState("cash");
  const [discountPct, setDiscountPct] = React.useState(0);
  const [usePercent, setUsePercent] = React.useState(true);

  const subtotal = BILL.items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const discount = usePercent
    ? (subtotal * Math.min(100, Math.max(0, Number(discountPct) || 0))) / 100
    : Math.min(subtotal, Math.max(0, Number(discountPct) || 0));
  const afterDiscount = Math.max(0, subtotal - discount);
  const vat = afterDiscount * BILL.vatRate;
  const total = afterDiscount + vat;

  return (
    <PageTransition className="space-y-6">
      <div className="mx-auto max-w-[900px]">
        <div className="glass lux-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Billing & Payment</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Receipt preview • payment selection • discount & VAT
              </div>
            </div>
            <Badge className="rounded-full bg-muted text-muted-foreground">
              Table {BILL.meta.table} • {BILL.meta.receiptNo}
            </Badge>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="rounded-3xl border bg-background p-6 shadow-lux-sm">
              <div className="text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-rms-gradient text-white shadow-glow">
                  <span className="text-lg font-semibold">R</span>
                </div>
                <div className="mt-4 font-heading text-lg font-semibold tracking-tight">
                  {BILL.restaurant.name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {BILL.restaurant.address} • {BILL.restaurant.phone}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground">
                    RECEIPT
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Receipt</div>
                <div className="text-right font-medium text-foreground">
                  {BILL.meta.receiptNo}
                </div>
                <div>Cashier</div>
                <div className="text-right font-medium text-foreground">
                  {BILL.meta.cashier}
                </div>
                <div>Table</div>
                <div className="text-right font-medium text-foreground">
                  {BILL.meta.table}
                </div>
              </div>

              <Separator className="my-5" />

              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_52px_96px] gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
                  <div>Item</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Total</div>
                </div>

                {BILL.items.map((it) => (
                  <div
                    key={it.id}
                    className="grid grid-cols-[1fr_52px_96px] items-center gap-2 rounded-2xl px-2 py-2 hover:bg-muted/40"
                  >
                    <div className="truncate text-sm font-medium">{it.name}</div>
                    <div className="text-right text-sm tabular-nums text-muted-foreground">
                      {it.qty}
                    </div>
                    <div className="text-right text-sm font-semibold tabular-nums">
                      {formatCurrency(it.qty * it.price, "BDT")}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatCurrency(subtotal, "BDT")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    - {formatCurrency(discount, "BDT")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>VAT ({Math.round(BILL.vatRate * 100)}%)</span>
                  <span className="tabular-nums">{formatCurrency(vat, "BDT")}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Grand total</span>
                  <span className="tabular-nums text-rms-gradient">
                    {formatCurrency(total, "BDT")}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_120px] items-center gap-4 rounded-3xl border bg-muted/20 p-4">
                <div>
                  <div className="text-sm font-semibold">Digital receipt</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    QR placeholder (connect to backend later)
                  </div>
                </div>
                <div className="grid aspect-square w-full place-items-center rounded-2xl bg-background ring-1 ring-border">
                  <div className="grid size-16 place-items-center rounded-xl border bg-muted/30 text-[10px] font-semibold text-muted-foreground">
                    QR
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="glass-strong lux-card p-6">
                <div className="text-sm font-semibold">Payment method</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Select one to continue
                </div>

                <div className="mt-5 grid gap-3">
                  {METHODS.map((m) => {
                    const active = method === m.key;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.key}
                        onClick={() => setMethod(m.key)}
                        className={cn(
                          "flex items-center gap-3 rounded-3xl border bg-background/40 p-4 text-left transition",
                          active
                            ? "ring-4 ring-ring/25 shadow-glow border-transparent"
                            : "hover:bg-muted/40"
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-11 place-items-center rounded-2xl ring-1 transition",
                            active
                              ? "bg-rms-gradient text-white ring-transparent"
                              : "bg-background text-foreground ring-border"
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{m.label}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Smooth selection state
                          </div>
                        </div>
                        <span
                          className={cn(
                            "size-4 rounded-full border",
                            active ? "bg-rms-gradient border-transparent" : "bg-background"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="glass-strong lux-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Discount</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Toggle % or fixed
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border bg-background/40 px-3 py-2">
                    <PercentIcon className="size-4 text-muted-foreground" />
                    <Switch checked={usePercent} onCheckedChange={setUsePercent} />
                  </div>
                </div>

                <div className="mt-5">
                  <Input
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                    inputMode="decimal"
                    placeholder={usePercent ? "Discount %" : "Discount amount"}
                    className="h-11 rounded-2xl focus-lux"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {usePercent ? "Applied to subtotal" : "Fixed amount (BDT)"}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button className="h-12 rounded-2xl bg-rms-gradient text-white shadow-glow">
                  <PrinterIcon className="mr-2 size-4" />
                  Print receipt
                </Button>
                <Button variant="secondary" className="h-12 rounded-2xl">
                  <MailIcon className="mr-2 size-4" />
                  Send via email
                </Button>
                <Button variant="ghost" className="h-12 rounded-2xl text-rose-600 hover:bg-rose-500/10">
                  <Trash2Icon className="mr-2 size-4" />
                  Clear
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

