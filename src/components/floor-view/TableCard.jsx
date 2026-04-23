import { cn } from "@/lib/utils";
import { UsersIcon, ReceiptIcon, ShoppingBagIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import StatusBadge from "./StatusBadge";
import { HoverLift } from "@/components/motion/HoverLift";

const TABLE_STYLES = {
  available: {
    ring: "ring-emerald-400/20",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(16,185,129,0.15)_0%,transparent_60%)]",
    hover: "hover:border-emerald-500/30"
  },
  occupied: {
    ring: "ring-orange-400/20",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(255,107,53,0.15)_0%,transparent_60%)]",
    hover: "hover:border-orange-500/30"
  },
  reserved: {
    ring: "ring-gray-400/20",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(156,163,175,0.15)_0%,transparent_60%)]",
    hover: "hover:border-gray-500/30"
  },
  ready: {
    ring: "ring-rose-400/20",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(239,68,68,0.15)_0%,transparent_60%)]",
    hover: "hover:border-rose-500/30"
  }
};

export default function TableCard({ table, onClick }) {
  const meta = TABLE_STYLES[table.status] || TABLE_STYLES.available;
  const isBillable = table.status === "occupied" || table.status === "ready";
  const accentTextClass = table.status === "ready" ? "text-rose-500" : "text-orange-500";

  return (
    <HoverLift className="w-full">
      <button
        type="button"
        onClick={() => onClick(table)}
        disabled={!isBillable}
        className={cn(
          "group relative aspect-square w-full overflow-hidden rounded-[2.5rem] border bg-background/40 p-6 text-left transition-all duration-300",
          meta.ring,
          meta.hover,
          isBillable
            ? "hover:shadow-lux-sm active:scale-95"
            : "cursor-not-allowed opacity-80"
        )}
      >
        <div className={cn("absolute inset-0 opacity-80 transition-opacity group-hover:opacity-100", meta.bg)} />
        
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={table.status} />
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <UsersIcon className="size-3" />
              {table.capacity}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-4xl font-bold tracking-tight tabular-nums text-foreground/90">
              {table.table_number}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Table
            </div>
          </div>

          <div className="mt-auto space-y-2">
            {isBillable && (
              <>
                <div className="flex items-center justify-between border-t border-dashed border-muted-foreground/20 pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <ShoppingBagIcon className="size-3.5" />
                    <span>{table.order_count} Items</span>
                  </div>
                  {table.order_status && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                      {table.order_status}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className={cn("flex items-center gap-1.5 text-sm font-bold", accentTextClass)}>
                    <ReceiptIcon className="size-3.5" />
                    <span>{formatCurrency(table.current_bill_amount, "BDT")}</span>
                  </div>
                </div>
              </>
            )}
            
            {table.status === 'available' && (
              <div className="flex items-center justify-center rounded-2xl bg-muted/20 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                Ready for guest
              </div>
            )}
          </div>
        </div>
      </button>
    </HoverLift>
  );
}
