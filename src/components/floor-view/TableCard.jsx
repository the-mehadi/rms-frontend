import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShoppingBag, Users } from "lucide-react";
import { TABLE_STATUS_COLORS } from "./floor-view-config";

export default function TableCard({ table, displayStatus, onClick, onBillingClick }) {
  const statusColors = TABLE_STATUS_COLORS[displayStatus] || TABLE_STATUS_COLORS.available;
  const isClickable = displayStatus !== "reserved";
  const isReadyToBill = displayStatus === "ready_to_bill";
  const order = table.unpaid_order;

  const handleCardClick = () => {
    if (!isClickable) return;
    onClick(table, displayStatus);
  };

  const handleBillingClick = (event) => {
    event.stopPropagation();
    onBillingClick(table);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "min-h-[180px] rounded-2xl border-2 py-0 shadow-lg transition-all duration-300 md:min-h-[200px]",
        statusColors.bg,
        statusColors.border,
        isClickable ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "cursor-default",
        isReadyToBill && "animate-pulse"
      )}
    >
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <Badge
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase shadow-none",
              statusColors.badge
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", statusColors.dot)} />
            {statusColors.label}
          </Badge>

          <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
            <Users className="h-4 w-4" />
            <span>{table.capacity}</span>
          </div>
        </div>

        <div className="mb-4 text-center">
          <div className="text-5xl font-black text-gray-900 md:text-6xl">
            {table.table_number}
          </div>
          <div className="mt-2 text-sm font-medium tracking-wider text-gray-500 uppercase">
            TABLE
          </div>
        </div>

        <div className="mt-auto">
          {displayStatus === "available" ? (
            <div className="text-center text-sm font-medium tracking-wide text-gray-500 uppercase">
              READY FOR GUEST
            </div>
          ) : order ? (
            <>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <ShoppingBag className="h-4 w-4" />
                <span>{order.items_count} Items</span>
              </div>

              <Badge className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold uppercase text-blue-700 shadow-none">
                {order.order_status}
              </Badge>

              <div className="mt-2 text-xl font-bold text-gray-900 md:text-2xl">
                {`৳${Number(order.subtotal ?? 0).toFixed(2)}`}
              </div>

              {isReadyToBill ? (
                <Button
                  onClick={handleBillingClick}
                  className="mt-4 w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-lg"
                >
                  Proceed to Billing
                </Button>
              ) : null}
            </>
          ) : (
            <div className="text-center text-sm font-medium tracking-wide text-gray-500 uppercase">
              TABLE STATUS UPDATED
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
