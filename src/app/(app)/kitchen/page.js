"use client";

import * as React from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiClient from "@/lib/api/client";
import {
  BellRingIcon,
  ClockIcon,
  FlameIcon,
  MoveRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from "lucide-react";
import { motion } from "framer-motion";

const COLUMNS = [
  { key: "pending", label: "Pending", accent: "bg-orange-500/12 text-orange-900 dark:text-orange-300" },
  { key: "preparing", label: "Preparing", accent: "bg-indigo-500/12 text-indigo-900 dark:text-indigo-300" },
  { key: "ready", label: "Ready", accent: "bg-emerald-500/12 text-emerald-900 dark:text-emerald-300" },
];

function minutesSince(createdAt, now) {
  const ts = new Date(createdAt).getTime();
  return Math.max(0, Math.floor((now - ts) / 60000));
}

function elapsedMeta(mins) {
  if (mins >= 20) return { badge: "bg-rose-500/12 text-rose-700 dark:text-rose-300", label: `${mins}m` };
  if (mins >= 12) return { badge: "bg-amber-500/12 text-amber-800 dark:text-amber-300", label: `${mins}m` };
  return { badge: "bg-muted text-foreground", label: `${mins}m` };
}

function priorityMeta(p) {
  if (p === "rush") return { badge: "bg-rose-500/12 text-rose-700 dark:text-rose-300", icon: FlameIcon, label: "Rush" };
  if (p === "high") return { badge: "bg-amber-500/12 text-amber-800 dark:text-amber-300", icon: FlameIcon, label: "High" };
  return { badge: "bg-muted text-muted-foreground", icon: ClockIcon, label: "Normal" };
}

function OrderCard({ order, now, onAdvance }) {
  const [loading, setLoading] = React.useState(false);
  const mins = minutesSince(order.created_at, now);
  const elapsed = elapsedMeta(mins);
  const pr = priorityMeta(order.priority);
  const PriorityIcon = pr.icon;

  const isNew = mins <= 2 && order.status === "pending";

  const handleAdvance = async () => {
    setLoading(true);
    try {
      await onAdvance(order.id, order.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={isNew ? { boxShadow: "var(--shadow-glow)" } : { boxShadow: "var(--shadow-lux-sm)" }}
      className="relative overflow-hidden rounded-3xl border bg-background/50"
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1.5",
          order.status === "pending"
            ? "bg-rms-gradient"
            : order.status === "preparing"
              ? "bg-[linear-gradient(180deg,#6366f1,#7c7ff7)]"
              : "bg-[linear-gradient(180deg,#10b981,#34d399)]"
        )}
      />

      {isNew ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.18, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(600px 260px at 10% 0%, rgba(255,107,53,0.22) 0%, transparent 60%)",
          }}
        />
      ) : null}

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge className="rounded-full ">
              Table <span className="ml-1 font-semibold tabular-nums">{order.table?.table_number}</span>
            </Badge>
            <Badge className={`rounded-full ${elapsed.badge}`}>{elapsed.label}</Badge>
            <Badge className={`rounded-full ${pr.badge}`}>
              <PriorityIcon className="mr-1 size-3.5" />
              {pr.label}
            </Badge>
          </div>
          {isNew ? (
            <Badge className="rounded-full bg-rms-gradient text-white">
              New
            </Badge>
          ) : null}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-semibold tabular-nums">{item.quantity}x</span> {item.menu_item?.name}
            </div>
          ))}
        </div>

        {order.special_note ? (
          <div className="mt-4 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-300">
            <span className="font-semibold">Notes:</span> {order.special_note}
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-2">
          {order.status !== "ready" ? (
            <Button
              className="h-11 w-full rounded-2xl bg-rms-gradient text-white shadow-glow"
              onClick={handleAdvance}
              disabled={loading}
            >
              {loading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <>
                  {order.status === "pending" ? "Start preparing" : "Mark ready"}
                  <MoveRightIcon className="ml-2 size-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              className="h-11 w-full rounded-2xl bg-emerald-500 text-white shadow-lux-sm hover:bg-emerald-600"
              onClick={handleAdvance}
              disabled={loading}
            >
              {loading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <>
                  Complete
                  <CheckCircle2Icon className="ml-2 size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function KitchenPage() {
  const [sound, setSound] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [now, setNow] = React.useState(() => Date.now());

  const fetchOrders = React.useCallback(async () => {
    try {
      const { data } = await apiClient.get("/kitchen/orders");
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch kitchen orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10_000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  React.useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(t);
  }, []);

  const counts = React.useMemo(() => {
    const base = { pending: 0, preparing: 0, ready: 0 };
    for (const o of orders) {
      if (base.hasOwnProperty(o.status)) {
        base[o.status] += 1;
      }
    }
    return base;
  }, [orders]);

  const advance = async (id, currentStatus) => {
    let nextStatus = "preparing";
    if (currentStatus === "preparing") nextStatus = "ready";
    if (currentStatus === "ready") nextStatus = "served";

    try {
      await apiClient.patch(`/orders/${id}/status`, { status: nextStatus });
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return (
    <PageTransition className="space-y-6">
      <div className="glass lux-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Kitchen Display System</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Kanban flow • pulse on new orders • mobile horizontal scroll
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border bg-background/50 px-4 py-2">
              <BellRingIcon className="size-4 text-muted-foreground" />
              <div className="text-xs font-semibold">Sound</div>
              <Switch checked={sound} onCheckedChange={setSound} />
            </div>
          </div>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <div key={col.key} className="min-w-[320px] flex-1">
              <div className="glass lux-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{col.label}</div>
                  <Badge className={`rounded-full ${col.accent}`}>
                    {counts[col.key]}{" "}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <ScrollArea className="h-[520px] pr-3">
                  <div className="space-y-3">
                    {orders
                      .filter((o) => o.status === col.key)
                      .map((o) => (
                        <OrderCard key={o.id} order={o} now={now} onAdvance={advance} />
                      ))}
                    {orders.filter((o) => o.status === col.key).length === 0 ? (
                      <div className="grid place-items-center rounded-2xl border bg-background/40 p-6 text-center">
                        <div className="text-sm font-semibold">Nothing here</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Orders will appear automatically.
                        </div>
                      </div>
                    ) : null}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}

