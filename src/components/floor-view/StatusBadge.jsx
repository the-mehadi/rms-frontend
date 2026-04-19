import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    className: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
    dot: "bg-emerald-500"
  },
  occupied: {
    label: "Occupied",
    className: "bg-orange-500/12 text-orange-900 dark:text-orange-300",
    dot: "bg-orange-500"
  },
  reserved: {
    label: "Reserved",
    className: "bg-gray-500/12 text-gray-800 dark:text-gray-300",
    dot: "bg-gray-500"
  },
  ready: {
    label: "Ready to Bill",
    className: "bg-rose-500/12 text-rose-800 dark:text-rose-300",
    dot: "bg-rose-500"
  }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available;
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
      config.className
    )}>
      <span className={cn("size-1.5 rounded-full animate-pulse", config.dot)} />
      {config.label}
    </div>
  );
}
