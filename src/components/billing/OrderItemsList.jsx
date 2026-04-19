import { formatCurrency } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export default function OrderItemsList({ items, loading }) {
  if (loading) {
    return (
      <div className="space-y-4 py-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center animate-pulse">
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="h-4 w-12 bg-muted rounded"></div>
            <div className="h-4 w-20 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground italic">
        No items in this order
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_52px_96px] gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        <div>Item</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Total</div>
      </div>

      {items.map((it) => (
        <div
          key={it.id}
          className="grid grid-cols-[1fr_52px_96px] items-center gap-2 rounded-2xl px-2 py-2 hover:bg-muted/40 transition-colors"
        >
          <div className="truncate text-sm font-medium">{it.menu_item?.name || it.item_name}</div>
          <div className="text-right text-sm tabular-nums text-muted-foreground">
            {it.quantity}
          </div>
          <div className="text-right text-sm font-semibold tabular-nums">
            {formatCurrency(it.subtotal || it.total, "BDT")}
          </div>
        </div>
      ))}
    </div>
  );
}
