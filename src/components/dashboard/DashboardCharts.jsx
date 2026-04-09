"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

function money(n) {
  const v = Number(n ?? 0);
  return v.toLocaleString();
}

function ChartTooltip({ active, payload, label, type }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="glass-strong lux-card p-3 text-xs">
      <div className="font-semibold">
        {type === "sales"
          ? format(new Date(label), "EEE, MMM d")
          : String(label)}
      </div>
      <div className="mt-1 text-muted-foreground">
        {type === "sales" ? `৳ ${money(val)}` : `${val} orders`}
      </div>
    </div>
  );
}

export function DashboardCharts({ salesTrend, ordersByHour }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="glass lux-card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Sales trend</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Last 14 days • gradient area
            </div>
          </div>
          <div className="text-xs text-muted-foreground">BDT</div>
        </div>

        <div className="mt-6 h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend} margin={{ left: 4, right: 8, top: 10 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F7931E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 6" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(new Date(d), "MMM d")}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <Tooltip
                content={<ChartTooltip type="sales" />}
                cursor={{ stroke: "rgba(255,107,53,0.35)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#FF6B35"
                strokeWidth={2}
                fill="url(#salesFill)"
              />
            </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted/40" />
          )}
        </div>
      </div>

      <div className="glass lux-card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Orders by time</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Peak hours • bar chart
            </div>
          </div>
        </div>

        <div className="mt-6 h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersByHour} margin={{ left: 4, right: 8, top: 10 }}>
              <defs>
                <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 6" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                content={<ChartTooltip type="orders" />}
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
              />
              <Bar
                dataKey="orders"
                fill="url(#ordersFill)"
                radius={[12, 12, 12, 12]}
              />
            </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted/40" />
          )}
        </div>
      </div>
    </div>
  );
}

