"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { BILL } from "@/lib/mock/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// API
import { ordersAPI } from "@/lib/api/orders";
import { paymentsAPI } from "@/lib/api/payments";
import { normalizeTableOrdersResponse } from "@/lib/order-utils";

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

function roundMoney(value) {
  return Number((Number(value) || 0).toFixed(2));
}

function buildReceiptNumber(responseData, tableId) {
  const candidate =
    responseData?.receipt_no ??
    responseData?.receipt_number ??
    responseData?.invoice_no ??
    responseData?.payment_id ??
    responseData?.bill_id;

  if (candidate) return String(candidate);
  return `PAY-${tableId}-${Date.now()}`;
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableIdFromUrl = searchParams.get("table_id");

  // State
  const [tableData, setTableData] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [orderIds, setOrderIds] = React.useState([]);
  const [receiptItems, setReceiptItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [paymentComplete, setPaymentComplete] = React.useState(false);
  const [receiptUrl, setReceiptUrl] = React.useState("");

  const [method, setMethod] = React.useState("cash");
  const [discount, setDiscount] = React.useState(0);
  const [discountEnabled, setDiscountEnabled] = React.useState(false);
  const [usePercent, setUsePercent] = React.useState(true);

  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [billMeta, setBillMeta] = React.useState({
    receiptNo: "---",
    cashier: "Mehadi", // This should ideally come from auth context
    paidAt: null,
    billId: null,
  });

  // Fetch orders
  const fetchOrders = React.useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await ordersAPI.getByTable(id);

      if (response?.success === false) {
        setOrders([]);
        setOrderIds([]);
        setReceiptItems([]);
        setTableData(null);
        toast.info(response.message || "No unpaid orders found for this table.");
        return;
      }

      const normalized = normalizeTableOrdersResponse(response, id);

      setOrders(normalized.orders);
      setOrderIds(normalized.orderIds);
      setReceiptItems(normalized.mergedItems);
      setPaymentComplete(false);
      setReceiptUrl("");
      setBillMeta((prev) => ({
        ...prev,
        receiptNo: "---",
        paidAt: null,
        billId: null,
      }));

      if (normalized.table?.id || normalized.table?.number) {
        setTableData({
          id: normalized.table.id,
          number: normalized.table.number,
        });
      } else {
        setTableData(null);
      }

      if (normalized.mergedItems.length === 0 || normalized.orderIds.length === 0) {
        toast.info("No unpaid orders found for this table.");
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
  const subtotal = React.useMemo(
    () => roundMoney(receiptItems.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)),
    [receiptItems]
  );

  const discountAmount = React.useMemo(() => {
    if (!discountEnabled) return 0;
    const val = Number(discount) || 0;
    if (usePercent) {
      return roundMoney((subtotal * Math.min(100, Math.max(0, val))) / 100);
    }
    return roundMoney(Math.min(subtotal, Math.max(0, val)));
  }, [discountEnabled, usePercent, discount, subtotal]);

  const afterDiscount = roundMoney(Math.max(0, subtotal - discountAmount));
  const vatRate = 0.05; // 5% VAT
  const vat = roundMoney(afterDiscount * vatRate);
  const total = roundMoney(afterDiscount + vat);

  const receiptShareText = React.useMemo(() => {
    return [
      `Restaurant: ${BILL.restaurant.name}`,
      `Table: ${tableData?.number ?? tableIdFromUrl ?? "-"}`,
      `Receipt: ${billMeta.receiptNo}`,
      `Orders: ${orderIds.length > 0 ? orderIds.join(", ") : "-"}`,
      `Status: ${paymentComplete ? "PAID" : "PENDING PAYMENT"}`,
      `Method: ${method.toUpperCase()}`,
      `Subtotal: ${subtotal}`,
      `VAT: ${vat}`,
      `Discount: ${discountAmount}`,
      `Grand Total: ${total}`,
      receiptUrl ? `Receipt URL: ${receiptUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }, [
    billMeta.receiptNo,
    discountAmount,
    method,
    orderIds,
    paymentComplete,
    receiptUrl,
    subtotal,
    tableData?.number,
    tableIdFromUrl,
    total,
    vat,
  ]);

  const qrCodeUrl = React.useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
      receiptShareText
    )}`;
  }, [receiptShareText]);

  // Handlers
  const processPayment = React.useCallback(async () => {
    if (receiptItems.length === 0 || orderIds.length === 0) {
      toast.error("No orders to bill");
      return null;
    }

    if (paymentComplete) {
      return {
        receiptNo: billMeta.receiptNo,
        billId: billMeta.billId,
      };
    }

    setProcessing(true);

    try {
      const payload = {
        table_id: Number(tableIdFromUrl) || tableIdFromUrl,
        order_ids: orderIds,
        method,
        subtotal,
        vat,
        discount: discountAmount,
        grand_total: total,
      };

      const response = await paymentsAPI.process(payload);

      if (response?.success === false) {
        throw new Error(response.message || "Failed to process payment");
      }

      const responseData = response?.data ?? response ?? {};
      const billId = responseData?.bill_id ?? null;
      const receiptNo = buildReceiptNumber(responseData, tableIdFromUrl);
      const nextReceiptUrl =
        billId && process.env.NEXT_PUBLIC_API_BASE_URL
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/bills/${billId}/receipt`
          : "";

      setPaymentComplete(true);
      setReceiptUrl(nextReceiptUrl);
      setBillMeta((prev) => ({
        ...prev,
        receiptNo,
        billId,
        paidAt: new Date().toISOString(),
      }));

      toast.success("Payment completed. Table is now free.");

      return {
        receiptNo,
        billId,
      };
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to process payment");
      return null;
    } finally {
      setProcessing(false);
    }
  }, [
    billMeta.billId,
    billMeta.receiptNo,
    discountAmount,
    method,
    orderIds,
    paymentComplete,
    receiptItems.length,
    subtotal,
    tableIdFromUrl,
    total,
    vat,
  ]);

  const handlePrintReceipt = async () => {
    const result = await processPayment();
    if (!result) return;

    window.print();
  };

  const handleEmailReceipt = async () => {
    if (!paymentComplete) {
      toast.info("Complete payment before sending the receipt.");
      return;
    }

    try {
      setProcessing(true);

      const subject = encodeURIComponent(
        `Receipt ${billMeta.receiptNo} - Table ${tableData?.number ?? tableIdFromUrl}`
      );
      const body = encodeURIComponent(
        `${receiptShareText}${receiptUrl ? `\n\nOpen receipt: ${receiptUrl}` : ""}`
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      toast.success("Receipt prepared in your email client.");
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    if (paymentComplete) {
      toast.info("Return to floor view to start a new billing session.");
      return;
    }

    setMethod("cash");
    setDiscount(0);
    setDiscountEnabled(false);
    setUsePercent(true);
    setReceiptUrl("");
    setBillMeta({
      receiptNo: "---",
      cashier: "Mehadi",
      paidAt: null,
      billId: null,
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
              <Badge className="rounded-full bg-muted text-muted-foreground">
                {orderIds.length} unpaid order{orderIds.length === 1 ? "" : "s"}
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
                <div>Status</div>
                <div className="text-right font-medium text-foreground">
                  {paymentComplete ? "Paid" : "Unpaid"}
                </div>
                <div>Table</div>
                <div className="text-right font-medium text-foreground">
                  {tableData?.number || "---"}
                </div>
              </div>

              <Separator className="my-5" />

              <OrderItemsList items={receiptItems} loading={loading} />

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
                  {paymentComplete ? "Thank you for dining with us!" : "Awaiting payment confirmation"}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_100px] items-center gap-4 rounded-3xl border bg-muted/20 p-4 print:hidden">
                <div>
                  <div className="text-sm font-semibold">Digital receipt</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {paymentComplete ? "Scan for digital copy" : "QR updates after payment"}
                  </div>
                </div>
                <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-2xl bg-background ring-1 ring-border">
                  <img
                    src={qrCodeUrl}
                    alt="Receipt QR code"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Controls Section */}
            <aside className="space-y-4 print:hidden">
              <PaymentMethodSelector 
                selectedMethod={method} 
                onSelect={setMethod} 
                disabled={paymentComplete}
              />

              <DiscountInput 
                discount={discount}
                setDiscount={setDiscount}
                usePercent={usePercent}
                setUsePercent={setUsePercent}
                enabled={discountEnabled}
                setEnabled={setDiscountEnabled}
                disabled={paymentComplete}
              />

              <BillActions 
                onPrint={handlePrintReceipt}
                onEmail={handleEmailReceipt}
                onClear={() => setShowClearDialog(true)}
                processing={processing}
                hasOrders={receiptItems.length > 0}
                paymentComplete={paymentComplete}
              />

              {paymentComplete && (
                <div className="glass-strong lux-card space-y-3 p-6">
                  <div className="text-sm font-semibold">Payment completed</div>
                  <div className="text-xs text-muted-foreground">
                    Table {tableData?.number ?? tableIdFromUrl} is released. Return to the floor
                    view to continue with the next table.
                  </div>
                  <Button
                    variant="secondary"
                    className="h-11 w-full rounded-2xl"
                    onClick={() => router.push("/floor-view")}
                  >
                    Back to Floor View
                  </Button>
                </div>
              )}
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
