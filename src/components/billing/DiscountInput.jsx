import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PercentIcon } from "lucide-react";

export default function DiscountInput({ 
  discount, 
  setDiscount, 
  usePercent, 
  setUsePercent,
  enabled,
  setEnabled,
  disabled = false,
}) {
  return (
    <div className="glass-strong lux-card p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-sm font-semibold">Apply Discount</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {disabled ? "Locked after payment" : "Enable to subtract from total"}
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={disabled} />
      </div>

      {enabled && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Discount Mode
            </div>
            <div className="flex items-center gap-2 rounded-2xl border bg-background/40 px-3 py-1.5">
              <span className={`text-[10px] font-bold ${!usePercent ? 'text-foreground' : 'text-muted-foreground'}`}>BDT</span>
              <Switch checked={usePercent} onCheckedChange={setUsePercent} disabled={disabled} />
              <PercentIcon className={`size-3 ${usePercent ? 'text-foreground' : 'text-muted-foreground'}`} />
            </div>
          </div>

          <div>
            <Input
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              type="number"
              min="0"
              max={usePercent ? "100" : undefined}
              placeholder={usePercent ? "Enter percentage (0-100)" : "Enter amount in BDT"}
              disabled={disabled}
              className="h-11 rounded-2xl focus-lux"
            />
            <div className="mt-2 text-[10px] text-muted-foreground">
              {usePercent ? "Applied to subtotal" : "Fixed amount deduction"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
