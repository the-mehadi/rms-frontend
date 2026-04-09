import { subDays } from "date-fns";

export const REPORT_KPIS = [
  { key: "sales", label: "Total Sales", value: 1289450, delta: 12.4, accent: "from-orange-400 to-rose-500" },
  { key: "orders", label: "Orders", value: 2864, delta: 6.8, accent: "from-indigo-400 to-indigo-600" },
  { key: "customers", label: "Customers", value: 2041, delta: -2.1, accent: "from-emerald-400 to-emerald-600" },
  { key: "aov", label: "Avg Order Value", value: 450, delta: 4.2, accent: "from-amber-300 to-amber-500" },
];

export const REPORT_SALES = Array.from({ length: 14 }).map((_, i) => {
  const d = subDays(new Date(), 13 - i);
  const base = 86000 + i * 1800;
  const wave = Math.sin(i / 2) * 14000;
  return { date: d.toISOString(), sales: Math.max(52000, Math.round(base + wave)) };
});

export const REPORT_CATEGORY_BREAKDOWN = [
  { name: "Mains", value: 38 },
  { name: "Grill", value: 22 },
  { name: "Seafood", value: 14 },
  { name: "Desserts", value: 11 },
  { name: "Drinks", value: 15 },
];

export const REPORT_PAYMENT_METHODS = [
  { name: "Cash", value: 48 },
  { name: "Card", value: 31 },
  { name: "bKash", value: 21 },
];

export const TOP_ITEMS = [
  { id: "t1", name: "Charcoal Ribeye (250g)", category: "Grill", sold: 188, revenue: 355320 },
  { id: "t2", name: "Truffle Pasta", category: "Mains", sold: 242, revenue: 239580 },
  { id: "t3", name: "Crispy Calamari", category: "Starters", sold: 276, revenue: 190440 },
  { id: "t4", name: "Smoked Salmon Bowl", category: "Seafood", sold: 112, revenue: 140000 },
  { id: "t5", name: "Vanilla Crème Brûlée", category: "Desserts", sold: 198, revenue: 102960 },
];

