"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getFloorViewData, isReadyToBill } from "@/lib/api/tables";
import { billsAPI } from "@/lib/api/bills";
import TableGrid from "@/components/floor-view/TableGrid";
import SummaryStats from "@/components/floor-view/SummaryStats";

const FLOOR_VIEW_CACHE_KEY = "floorViewTables";
const CACHE_DURATION = 30 * 1000;

function getCachedData() {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem(FLOOR_VIEW_CACHE_KEY);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) return null;
    return data;
  } catch {
    return null;
  }
}

function setCachedData(data) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    FLOOR_VIEW_CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
}

export default function FloorViewPage() {
  const router = useRouter();
  const [data, setData] = React.useState({
    tables: [],
    summary: {
      total_tables: 0,
      available: 0,
      occupied: 0,
      reserved: 0,
      ready_to_bill: 0,
      total_unpaid_amount: 0,
    },
  });
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const [creatingBill, setCreatingBill] = React.useState(false);

  const fetchFloorData = React.useCallback(async (isRefresh = false, showLoading = true) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else if (showLoading) {
        setLoading(true);
      }

      const result = await getFloorViewData();
      setData(result);
      setCachedData(result);
      setLastUpdated(new Date());
    } catch (fetchError) {
      console.error("Floor view error:", fetchError);
      setError(fetchError?.response?.data?.message || fetchError.message || "Failed to load floor view data.");

      if (!isRefresh && showLoading) {
        toast.error("Failed to load floor view");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    const cached = getCachedData();

    if (cached) {
      setData(cached);
      setLoading(false);
      setLastUpdated(new Date());
    }

    fetchFloorData(false, !cached);

    const interval = setInterval(() => {
      fetchFloorData(true, false);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchFloorData]);

  const getDisplayStatus = React.useCallback((table) => {
    return isReadyToBill(table) ? "ready_to_bill" : table.status;
  }, []);

  const buildBillingUrl = React.useCallback((table) => {
    const params = new URLSearchParams({
      table_id: String(table.id),
      table: String(table.table_number),
    });

    if (table.unpaid_order?.order_id) {
      params.set("order", String(table.unpaid_order.order_id));
    }

    if (table.unpaid_order?.subtotal !== undefined) {
      params.set("amount", String(table.unpaid_order.subtotal));
    }

    return `/billing?${params.toString()}`;
  }, []);

  const handleAvailableTableClick = React.useCallback(
    (table) => {
      router.push(`/orders?table_id=${table.id}&table=${table.table_number}`);
    },
    [router]
  );

  const handleOccupiedTableClick = React.useCallback(
    (table) => {
      router.push(buildBillingUrl(table));
    },
    [buildBillingUrl, router]
  );

  const handleReadyToBillClick = React.useCallback(
    async (table) => {
      if (creatingBill) return;

      setCreatingBill(true);
      try {
        const payload = {
          table_id: Number(table.id) || table.id,
          method: "cash",
          vat: 5,
          discount: 0,
        };

        const response = await billsAPI.create(payload);

        if (response?.data?.success === false) {
          throw new Error(response.data.message || "Failed to create bill");
        }

        const billId =
          response?.data?.data?.id ??
          response?.data?.data?.bill_id ??
          response?.data?.id ??
          response?.data?.bill_id;

        if (!billId) {
          throw new Error("Bill creation did not return bill_id");
        }

        const params = new URLSearchParams({
          bill_id: String(billId),
          table_id: String(table.id),
          table: String(table.table_number),
        });

        if (table.unpaid_order?.order_id) {
          params.set("order", String(table.unpaid_order.order_id));
        }

        if (table.unpaid_order?.subtotal !== undefined) {
          params.set("amount", String(table.unpaid_order.subtotal));
        }

        router.push(`/billing?${params.toString()}`);
      } catch (error) {
        console.error("Bill creation failed:", error);
        toast.error(error?.response?.data?.message || error.message || "Failed to create bill");
      } finally {
        setCreatingBill(false);
      }
    },
    [creatingBill, router]
  );

  const handleTableClick = React.useCallback(
    (table, displayStatus) => {
      if (displayStatus === "ready_to_bill") {
        handleReadyToBillClick(table);
        return;
      }

      if (displayStatus === "occupied") {
        handleOccupiedTableClick(table);
        return;
      }

      if (displayStatus === "available") {
        handleAvailableTableClick(table);
      }
    },
    [handleAvailableTableClick, handleOccupiedTableClick, handleReadyToBillClick]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Floor View</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time table status • occupancy • quick billing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <RefreshCw className={refreshing ? "h-3 w-3 animate-spin" : "h-3 w-3"} />
            <span>Auto-refresh enabled</span>
            {lastUpdated ? (
              <span className="hidden sm:inline">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            ) : null}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fetchFloorData(true, false)}
            disabled={refreshing}
            className="rounded-lg"
          >
            <RefreshCw className={refreshing ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-8">
        <SummaryStats summary={data.summary} />
      </div>

      <TableGrid
        tables={data.tables}
        loading={loading}
        getDisplayStatus={getDisplayStatus}
        onTableClick={handleTableClick}
        onBillingClick={handleReadyToBillClick}
      />
    </div>
  );
}
