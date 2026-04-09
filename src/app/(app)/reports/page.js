"use client";

import * as React from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";
import {
  REPORT_CATEGORY_BREAKDOWN,
  REPORT_KPIS,
  REPORT_PAYMENT_METHODS,
  REPORT_SALES,
  TOP_ITEMS,
} from "@/lib/mock/reports";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ReportsCharts } from "@/components/reports/ReportsCharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveContainer, Line, LineChart } from "recharts";
import { DownloadIcon, CalendarIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const PRESETS = ["Today", "Week", "Month", "Year"];

function KpiSparkline({ seed = 1, color = "#FF6B35" }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const data = React.useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      x: i,
      y: 12 + Math.sin((i + seed) / 2) * 6 + (i % 4) * 1.2,
    }));
  }, [seed]);

  return (
    <div className="h-10 w-[120px]">
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              dot={false}
              opacity={0.9}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full rounded-xl bg-muted/40" />
      )}
    </div>
  );
}

function rankBadge(i) {
  if (i === 0) return "bg-amber-500/15 text-amber-900 dark:text-amber-300";
  if (i === 1) return "bg-muted text-foreground";
  if (i === 2) return "bg-orange-500/12 text-orange-900 dark:text-orange-300";
  return "bg-muted text-muted-foreground";
}

export default function ReportsPage() {
  const [preset, setPreset] = React.useState("Week");
  const [custom, setCustom] = React.useState("");

  return (
    <PageTransition className="space-y-6">
      <div className="glass lux-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-semibold">Reports & Analytics</div>
            <div className="mt-1 text-xs text-muted-foreground">
              KPI cards • export • responsive charts
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {PRESETS.map((p) => {
                const active = preset === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold transition",
                      active
                        ? "bg-rms-gradient text-white border-transparent shadow-glow"
                        : "bg-background/40 hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
              <div className="relative">
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Custom range (placeholder)"
                  className="h-10 w-[220px] rounded-2xl pl-10 focus-lux"
                />
              </div>
            </div>

            <Button className="h-11 rounded-2xl bg-rms-gradient text-white shadow-glow">
              <DownloadIcon className="mr-2 size-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {REPORT_KPIS.map((k, idx) => {
          const up = k.delta >= 0;
          return (
            <div key={k.key} className="glass lux-card lux-card-hover p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                    {k.label}
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight">
                    {k.key === "sales" || k.key === "aov" ? (
                      <CountUp
                        value={k.value}
                        duration={0.9}
                        format={(n) => formatCurrency(n, "BDT")}
                      />
                    ) : (
                      <CountUp value={k.value} duration={0.9} />
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    className={cn(
                      "rounded-full",
                      up
                        ? "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-500/12 text-rose-700 dark:text-rose-300"
                    )}
                  >
                    {up ? (
                      <ArrowUpIcon className="mr-1 size-3.5" />
                    ) : (
                      <ArrowDownIcon className="mr-1 size-3.5" />
                    )}
                    {Math.abs(k.delta)}%
                  </Badge>
                  <div className="mt-2 flex justify-end">
                    <KpiSparkline
                      seed={idx + 1}
                      color={idx % 2 === 0 ? "#FF6B35" : "#6366F1"}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Compared to previous period • {preset}
              </div>
            </div>
          );
        })}
      </section>

      <ReportsCharts
        sales={REPORT_SALES}
        categories={REPORT_CATEGORY_BREAKDOWN}
        payments={REPORT_PAYMENT_METHODS}
      />

      <section className="glass lux-card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Top items</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Rank badges • right-aligned numbers
            </div>
          </div>
          <Badge className="rounded-full bg-muted text-muted-foreground">
            {preset}
          </Badge>
        </div>

        <Separator className="my-5" />

        <div className="overflow-hidden rounded-3xl border bg-background/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_ITEMS.map((it, idx) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <Badge className={cn("rounded-full", rankBadge(idx))}>
                      #{idx + 1}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-2xl bg-[radial-gradient(24px_24px_at_30%_20%,rgba(255,107,53,0.45)_0%,transparent_70%)] ring-1 ring-border">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {it.name.slice(0, 1)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {it.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Premium presentation
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-full bg-background/60">
                      {it.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {it.sold.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatCurrency(it.revenue, "BDT")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </PageTransition>
  );
}

