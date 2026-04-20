import { cn } from "@/lib/utils";
import { BanknoteIcon, CreditCardIcon, SmartphoneIcon } from "lucide-react";

const METHODS = [
  { key: "cash", label: "Cash", icon: BanknoteIcon, description: "Standard cash payment" },
  { key: "bkash", label: "bKash", icon: SmartphoneIcon, description: "Mobile financial service" },
  { key: "card", label: "Card", icon: CreditCardIcon, description: "Credit or Debit card" },
];

export default function PaymentMethodSelector({ selectedMethod, onSelect, disabled = false }) {
  return (
    <div className="glass-strong lux-card p-6">
      <div className="text-sm font-semibold">Payment method</div>
      <div className="mt-1 text-xs text-muted-foreground">
        {disabled ? "Locked after payment" : "Select one to continue"}
      </div>

      <div className="mt-5 grid gap-3">
        {METHODS.map((m) => {
          const active = selectedMethod === m.key;
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onSelect(m.key)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-3 rounded-3xl border bg-background/40 p-4 text-left transition-all duration-300",
                active
                  ? "ring-4 ring-ring/25 shadow-glow border-transparent bg-background"
                  : "hover:bg-muted/40",
                disabled && "cursor-not-allowed opacity-60 hover:bg-background/40"
              )}
            >
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-2xl ring-1 transition-all",
                  active
                    ? "bg-rms-gradient text-white ring-transparent"
                    : "bg-background text-foreground ring-border"
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{m.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {m.description}
                </div>
              </div>
              <span
                className={cn(
                  "size-4 rounded-full border transition-all duration-300",
                  active ? "bg-rms-gradient border-transparent scale-110" : "bg-background"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
