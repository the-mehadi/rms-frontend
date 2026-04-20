"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// API
import { getAllTablesData } from "@/lib/api/tables";

// Components
import TableGrid from "@/components/floor-view/TableGrid";
import SummaryStats from "@/components/floor-view/SummaryStats";

// Cache key for floor view data
const FLOOR_VIEW_CACHE_KEY = 'floorViewTables';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

function getCachedData() {
  if (typeof window === 'undefined') return null;
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(FLOOR_VIEW_CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now(),
  }));
}

export default function FloorViewPage() {
  const router = useRouter();
  const [tables, setTables] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const initialLoadDone = React.useRef(false);

  const fetchData = React.useCallback(async (isRefresh = false, showLoading = true) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (showLoading) setLoading(true);

      const data = await getAllTablesData();
      setTables(data);
      setCachedData(data);
    } catch (error) {
      console.error("Floor map error:", error);
      if (!isRefresh) {
        toast.error("Failed to load table map");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    // Try to load cached data first for instant display
    const cached = getCachedData();
    if (cached) {
      setTables(cached);
      setLoading(false);
    }

    // Always fetch fresh data in background
    fetchData(false, !cached);
    initialLoadDone.current = true;

    // Auto-refresh every 60 seconds (background refresh)
    const interval = setInterval(() => {
      fetchData(true, false);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const stats = React.useMemo(() => {
    return {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      ready: tables.filter(t => t.status === 'ready').length,
    };
  }, [tables]);

  const handleTableClick = (table) => {
    if (table.status === 'occupied' || table.status === 'ready') {
      router.push(`/billing?table_id=${table.id}`);
    } else if (table.status === 'reserved') {
      toast.info(`Table ${table.table_number} is reserved`);
    } else {
      toast.info(`Table ${table.table_number} is empty. Start an order from the Orders page.`);
    }
  };

  return (
    <PageTransition className="space-y-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header Section */}
        <div className="glass lux-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Restaurant Floor Map</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Real-time table status • occupancy • quick billing
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Last Updated
                </div>
                <div className="text-xs font-semibold tabular-nums">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchData(true)}
                disabled={refreshing || loading}
                className="size-11 rounded-2xl border-orange-500/20 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10 hover:text-orange-600"
              >
                <RefreshCcwIcon className={refreshing ? "size-4 animate-spin" : "size-4"} />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />
          
          <SummaryStats stats={stats} />
        </div>

        {/* Main Grid Section */}
        <div className="mt-8">
          <TableGrid 
            tables={tables} 
            loading={loading} 
            onTableClick={handleTableClick} 
          />
        </div>

        {/* Legend / Info Footer */}
        <div className="mt-8 glass lux-card p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              Available
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-orange-500" />
              Occupied
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500" />
              Ready to Bill
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-gray-500" />
              Reserved
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
