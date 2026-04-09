import { format } from "date-fns";

export function formatCurrency(amount, currency = "BDT") {
  const n = Number(amount ?? 0);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n.toLocaleString()} ${currency}`;
  }
}

export function formatDateTime(d) {
  try {
    return format(d instanceof Date ? d : new Date(d), "EEE, MMM d • p");
  } catch {
    return String(d);
  }
}

