"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { cn } from "@/lib/utils";
import { BILL } from "@/lib/mock/billing";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// API
import { ordersAPI } from "@/lib/api/orders";
import { billsAPI } from "@/lib/api/bills";
import { paymentsAPI } from "@/lib/api/payments";

// Components
import OrderItemsList from "@/components/billing/OrderItemsList";
import PaymentMethodSelector from "@/components/billing/PaymentMethodSelector";
import DiscountInput from "@/components/billing/DiscountInput";
import BillSummary from "@/components/billing/BillSummary";
import BillActions from "@/components/billing/BillActions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableIdFromUrl = searchParams.get("table_id");

  // State
  const [tableData, setTableData] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  
  const [method, setMethod] = React.useState("cash");
  const [discount, setDiscount] = React.useState(0);
  const [discountEnabled, setDiscountEnabled] = React.useState(false);
  const [usePercent, setUsePercent] = React.useState(true);
  
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [billMeta, setBillMeta] = React.useState({
    receiptNo: "---",
    cashier: "Mehadi", // This should ideally come from auth context
  });

  // Fetch orders
  const fetchOrders = React.useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await ordersAPI.getByTable(id);
      
      if (response.success && response.data) {
        const orderData = response.data;
        setOrders(orderData.items || []);
        setTableData({
          id: orderData.table?.id || orderData.table_id,
          number: orderData.table?.table_number || orderData.table_number
        });
      } else {
        // Handle case where success is false or no data
        setOrders([]);
        setTableData(null);
        toast.info(response.message || "No active order found for this table.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch orders for this table");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (tableIdFromUrl) {
      fetchOrders(tableIdFromUrl);
    } else {
      setLoading(false);
    }
  }, [tableIdFromUrl, fetchOrders]);

  // Calculations
  const subtotal = orders.reduce((sum, it) => sum + (Number(it.subtotal || it.total) || 0), 0);
  
  const discountAmount = React.useMemo(() => {
    if (!discountEnabled) return 0;
    const val = Number(discount) || 0;
    if (usePercent) {
      return (subtotal * Math.min(100, Math.max(0, val))) / 100;
    }
    return Math.min(subtotal, Math.max(0, val));
  }, [discountEnabled, usePercent, discount, subtotal]);

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const vatRate = 0.05; // 5% VAT
  const vat = afterDiscount * vatRate;
  const total = afterDiscount + vat;

  // Handlers
  const handlePrintReceipt = async () => {
    if (orders.length === 0) {
      toast.error("No orders to bill");
      return;
    }

    try {
      setProcessing(true);
      
      // 1. Create Bill
      const billData = {
        table_id: tableIdFromUrl,
        items: orders.map(it => ({
          order_item_id: it.id,
          name: it.menu_item?.name || it.item_name,
          qty: it.quantity,
          price: it.price || it.unit_price,
          total: it.subtotal || it.total
        })),
        subtotal,
        discount: discountAmount,
        vat,
        grand_total: total,
        payment_method: method
      };

      const billResponse = await billsAPI.create(billData);
      
      if (billResponse.success) {
        setBillMeta(prev => ({ ...prev, receiptNo: billResponse.bill_id }));
        
        // 2. Process Payment (In a real app, this might be separate, but following requirements)
        await paymentsAPI.process({
          bill_id: billResponse.bill_id,
          payment_method: method,
          amount: total
        });

        toast.success("Bill created and payment processed!");

        // 3. Trigger Print (Simulated for web, usually opens PDF or new window)
        // const receipt = await billsAPI.getReceipt(billResponse.bill_id);
        window.print();
      }
    } catch (error) {
      console.error("Billing error:", error);
      toast.error(error.response?.data?.message || "Failed to process billing");
    } finally {
      setProcessing(false);
    }
  };

  const handleEmailReceipt = async () => {
    if (orders.length === 0) return;
    
    try {
      setProcessing(true);
      // Implementation similar to print but calls an email endpoint if available
      // For now, simulate success
      await new Promise(r => setTimeout(r, 1000));
      toast.success("Receipt sent to customer email!");
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    setMethod("cash");
    setDiscount(0);
    setDiscountEnabled(false);
    setUsePercent(true);
    setBillMeta({
      receiptNo: "---",
      cashier: "Mehadi",
    });
    toast.info("Form cleared");
  };

  return (
    <PageTransition className="space-y-6">
      <div className="mx-auto max-w-[1000px]">
        <div className="glass lux-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Billing & Payment</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Receipt preview • payment selection • discount & VAT
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="rounded-full bg-muted text-muted-foreground">
                {tableData ? `Table ${tableData.number}` : "No Table Selected"}
              </Badge>
              <Badge className="rounded-full bg-primary/10 text-primary border-primary/20">
                {billMeta.receiptNo}
              </Badge>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Receipt Preview Section */}
            <section className="rounded-3xl border bg-background p-6 shadow-lux-sm print:shadow-none print:border-none">
              <div className="text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-rms-gradient text-white shadow-glow print:shadow-none">
                  <span className="text-lg font-semibold">R</span>
                </div>
                <div className="mt-4 font-heading text-lg font-semibold tracking-tight">
                  {BILL.restaurant.name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {BILL.restaurant.address} • {BILL.restaurant.phone}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground">
                    RECEIPT
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Receipt</div>
                <div className="text-right font-medium text-foreground">
                  {billMeta.receiptNo}
                </div>
                <div>Date</div>
                <div className="text-right font-medium text-foreground">
                  {new Date().toLocaleString()}
                </div>
                <div>Cashier</div>
                <div className="text-right font-medium text-foreground">
                  {billMeta.cashier}
                </div>
                <div>Table</div>
                <div className="text-right font-medium text-foreground">
                  {tableData?.number || "---"}
                </div>
              </div>

              <Separator className="my-5" />

              <OrderItemsList items={orders} loading={loading} />

              <Separator className="my-5" />

              <BillSummary 
                subtotal={subtotal} 
                discount={discountAmount} 
                vat={vat} 
                total={total} 
                vatRate={vatRate}
              />

              <div className="mt-8 pt-6 border-t border-dashed text-center">
                <div className="text-sm font-semibold">Payment: {method.toUpperCase()}</div>
                <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                  Thank you for dining with us!
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_100px] items-center gap-4 rounded-3xl border bg-muted/20 p-4 print:hidden">
                <div>
                  <div className="text-sm font-semibold">Digital receipt</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Scan for digital copy
                  </div>
                </div>
                <div className="grid aspect-square w-full place-items-center rounded-2xl bg-background ring-1 ring-border">
                  <div className="grid size-12 place-items-center rounded-xl border bg-muted/30 text-[10px] font-semibold text-muted-foreground">
                    QR
                  </div>
                </div>
              </div>
            </section>

            {/* Controls Section */}
            <aside className="space-y-4 print:hidden">
              <PaymentMethodSelector 
                selectedMethod={method} 
                onSelect={setMethod} 
              />

              <DiscountInput 
                discount={discount}
                setDiscount={setDiscount}
                usePercent={usePercent}
                setUsePercent={setUsePercent}
                enabled={discountEnabled}
                setEnabled={setDiscountEnabled}
              />

              <BillActions 
                onPrint={handlePrintReceipt}
                onEmail={handleEmailReceipt}
                onClear={() => setShowClearDialog(true)}
                processing={processing}
                hasOrders={orders.length > 0}
              />
            </aside>
          </div>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all billing selections and payment methods. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClear}
              className="rounded-2xl bg-rose-600 hover:bg-rose-700"
            >
              Clear Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
