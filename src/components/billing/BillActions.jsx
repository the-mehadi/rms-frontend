import { Button } from "@/components/ui/button";
import { PrinterIcon, MailIcon, Trash2Icon, Loader2Icon } from "lucide-react";

export default function BillActions({
  onPrint,
  onEmail,
  onClear,
  processing,
  hasOrders,
  paymentComplete = false,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <Button 
        onClick={onPrint} 
        disabled={processing || !hasOrders}
        className="h-12 rounded-2xl bg-rms-gradient text-white shadow-glow hover:opacity-90 transition-opacity"
      >
        {processing ? (
          <Loader2Icon className="mr-2 size-4 animate-spin" />
        ) : (
          <PrinterIcon className="mr-2 size-4" />
        )}
        {paymentComplete ? "Print receipt" : "Pay & print receipt"}
      </Button>

      <Button 
        variant="secondary" 
        onClick={onEmail}
        disabled={processing || !hasOrders || !paymentComplete}
        className="h-12 rounded-2xl"
      >
        <MailIcon className="mr-2 size-4" />
        Send via email
      </Button>

      <Button 
        variant="ghost" 
        onClick={onClear}
        disabled={processing}
        className="h-12 rounded-2xl text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
      >
        <Trash2Icon className="mr-2 size-4" />
        Clear
      </Button>
    </div>
  );
}
