"use client";

import { PageTransition } from "@/components/motion/PageTransition";
import { CountUp } from "@/components/motion/CountUp";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_KPIS, ORDERS_BY_HOUR, RECENT_ACTIVITY, SALES_TREND } from "@/lib/mock/dashboard";
import { formatCurrency } from "@/lib/format";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  CoinsIcon,
  CreditCardIcon,
  LayoutGridIcon,
  ReceiptTextIcon,
} from "lucide-react";

const KPI_ICONS = {
  orders: ReceiptTextIcon,
  revenue: CoinsIcon,
  tables: LayoutGridIcon,
  aov: CreditCardIcon,
};

export default function DashboardPage() {
  return (
    <PageTransition className="space-y-6">
      <DashboardHero name="Mehadi" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_KPIS.map((kpi) => {
          const Icon = KPI_ICONS[kpi.icon] ?? ReceiptTextIcon;
          return (
            <div key={kpi.key} className="glass lux-card lux-card-hover p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{kpi.label}</div>
                <div
                  className={`grid size-11 place-items-center rounded-2xl bg-linear-to-br ${kpi.accent} text-white shadow-lux-sm`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div className="text-3xl font-semibold tracking-tight">
                  {kpi.isMoney ? (
                    <CountUp
                      value={kpi.value}
                      duration={0.9}
                      format={(n) => formatCurrency(n, "BDT")}
                    />
                  ) : (
                    <CountUp value={kpi.value} duration={0.9} />
                  )}
                </div>
                <Badge className="rounded-full bg-muted text-muted-foreground">
                  Today
                </Badge>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                Hover to lift • smooth micro-interactions
              </div>
            </div>
          );
        })}
      </section>

      <DashboardCharts salesTrend={SALES_TREND} ordersByHour={ORDERS_BY_HOUR} />

      <section className="grid gap-4 lg:grid-cols-[1fr_440px]">
        <div className="glass lux-card p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Service snapshot</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Quick operational highlights
              </div>
            </div>
            <Badge className="rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300">
              Premium
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { t: "Peak hour", v: "7pm – 8pm", d: "Highest ticket velocity" },
              { t: "Top category", v: "Grill & Seafood", d: "Best-performing today" },
              { t: "Avg prep time", v: "11m", d: "Kitchen is on track" },
              { t: "Payment mix", v: "Cash 48%", d: "Cards trending upward" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border bg-background/50 p-4">
                <div className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {x.t}
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight">
                  {x.v}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{x.d}</div>
              </div>
            ))}
          </div>
        </div>

        <RecentActivity items={RECENT_ACTIVITY} />
      </section>
    </PageTransition>
  );
}

