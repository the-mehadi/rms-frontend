import { formatCurrency } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export default function BillSummary({ subtotal, discount, vat, total, vatRate }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>Subtotal</span>
        <span className="tabular-nums">
          {formatCurrency(subtotal, "BDT")}
        </span>
      </div>
      
      {discount > 0 && (
        <div className="flex items-center justify-between text-rose-500 font-medium">
          <span>Discount</span>
          <span className="tabular-nums">
            - {formatCurrency(discount, "BDT")}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-muted-foreground">
        <span>VAT ({Math.round(vatRate * 100)}%)</span>
        <span className="tabular-nums">{formatCurrency(vat, "BDT")}</span>
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex items-center justify-between text-base font-bold">
        <span>Grand total</span>
        <span className="tabular-nums text-rms-gradient text-lg">
          {formatCurrency(total, "BDT")}
        </span>
      </div>
    </div>
  );
}
