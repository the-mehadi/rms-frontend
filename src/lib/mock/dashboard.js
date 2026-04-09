import { subDays } from "date-fns";

export const DASHBOARD_KPIS = [
  {
    key: "orders",
    label: "Total Orders",
    value: 1248,
    icon: "orders",
    accent: "from-emerald-400 to-emerald-600",
  },
  {
    key: "revenue",
    label: "Revenue",
    value: 862450,
    icon: "revenue",
    accent: "from-orange-400 to-rose-500",
    isMoney: true,
  },
  {
    key: "tables",
    label: "Active Tables",
    value: 18,
    icon: "tables",
    accent: "from-indigo-400 to-indigo-600",
  },
  {
    key: "aov",
    label: "Avg Order Value",
    value: 690,
    icon: "aov",
    accent: "from-amber-300 to-amber-500",
    isMoney: true,
  },
];

export const SALES_TREND = Array.from({ length: 14 }).map((_, i) => {
  const d = subDays(new Date(), 13 - i);
  const base = 42000 + i * 1400;
  const wave = Math.sin(i / 2) * 6000;
  return {
    date: d.toISOString(),
    sales: Math.max(22000, Math.round(base + wave)),
  };
});

export const ORDERS_BY_HOUR = [
  { hour: "10am", orders: 12 },
  { hour: "11am", orders: 18 },
  { hour: "12pm", orders: 42 },
  { hour: "1pm", orders: 38 },
  { hour: "2pm", orders: 20 },
  { hour: "3pm", orders: 14 },
  { hour: "6pm", orders: 26 },
  { hour: "7pm", orders: 44 },
  { hour: "8pm", orders: 37 },
  { hour: "9pm", orders: 21 },
];

export const RECENT_ACTIVITY = [
  {
    id: "a1",
    title: "Order #1042 marked as paid",
    time: "2m ago",
    status: "success",
  },
  {
    id: "a2",
    title: "New reservation added (Table 8)",
    time: "18m ago",
    status: "info",
  },
  {
    id: "a3",
    title: "Kitchen: Order #1039 ready for pickup",
    time: "42m ago",
    status: "warning",
  },
  {
    id: "a4",
    title: "Menu item updated: Truffle Pasta",
    time: "1h ago",
    status: "neutral",
  },
];

