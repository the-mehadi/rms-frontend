"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

const COLORS = ["#FF6B35", "#6366F1", "#10B981", "#F59E0B", "#EF4444"];

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong lux-card p-3 text-xs">
      <div className="font-semibold">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="mt-1 text-muted-foreground">
          {p.name ?? p.dataKey}: {String(p.value)}
        </div>
      ))}
    </div>
  );
}

export function ReportsCharts({ sales, categories, payments }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="glass lux-card p-6 lg:col-span-2">
        <div className="text-sm font-semibold">Sales trend</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Smooth area • responsive stacking
        </div>
        <div className="mt-6 h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sales} margin={{ left: 4, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="reportSalesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#F7931E" stopOpacity={0.03} />
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
                content={<TooltipBox />}
                labelFormatter={(d) => format(new Date(d), "EEE, MMM d")}
              />
              <Area
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#FF6B35"
                strokeWidth={2}
                fill="url(#reportSalesFill)"
              />
            </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted/40" />
          )}
        </div>
      </div>

      <div className="glass lux-card p-6">
        <div className="text-sm font-semibold">Category breakdown</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Donut chart • legend
        </div>
        <div className="mt-6 h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<TooltipBox />} />
              <Legend verticalAlign="bottom" height={36} />
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={92}
                paddingAngle={3}
              >
                {categories.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted/40" />
          )}
        </div>
      </div>

      <div className="glass lux-card p-6 lg:col-span-3">
        <div className="text-sm font-semibold">Payment methods</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Horizontal bars • quick comparison
        </div>
        <div className="mt-6 h-[220px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={payments}
              layout="vertical"
              margin={{ left: 34, right: 14, top: 10, bottom: 10 }}
            >
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 6" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<TooltipBox />} />
              <Bar dataKey="value" name="Share (%)" radius={[10, 10, 10, 10]}>
                {payments.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} opacity={0.85} />
                ))}
              </Bar>
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

