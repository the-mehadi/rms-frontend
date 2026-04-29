export const TABLE_STATUS_COLORS = {
  available: {
    bg: "bg-white",
    border: "border-green-500",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "Available",
  },
  occupied: {
    bg: "bg-orange-50",
    border: "border-orange-500",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
    label: "Occupied",
  },
  reserved: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    label: "Reserved",
  },
  ready_to_bill: {
    bg: "bg-rose-50",
    border: "border-rose-500",
    badge: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
    label: "Ready to Bill",
  },
};

export const SUMMARY_STAT_ITEMS = [
  {
    key: "total_tables",
    label: "TOTAL TABLES",
    iconClassName: "bg-indigo-500",
  },
  {
    key: "available",
    label: "AVAILABLE",
    iconClassName: "bg-green-500",
  },
  {
    key: "occupied",
    label: "OCCUPIED",
    iconClassName: "bg-orange-500",
  },
  {
    key: "ready_to_bill",
    label: "READY TO BILL",
    iconClassName: "bg-rose-500",
  },
];
