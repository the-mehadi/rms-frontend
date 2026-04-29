import apiClient, { fetchGet, clearCache, getTableOrdersCache, setTableOrdersCache, clearTableOrdersCache } from "./client";
import { normalizeTableOrdersResponse } from "@/lib/order-utils";

export function isReadyToBill(table) {
  return (
    table?.status === "occupied" &&
    table?.unpaid_order !== null &&
    String(table?.unpaid_order?.order_status ?? "").toLowerCase() === "served"
  );
}

export async function getTableOrders(tableId, useCache = true) {
  // Check centralized cache first
  if (useCache) {
    const cached = getTableOrdersCache(tableId);
    if (cached) return cached;
  }

  try {
    const data = await fetchGet(`/orders/table/${tableId}`, { useCache: false });

    // Cache the result
    if (useCache) {
      setTableOrdersCache(tableId, data);
    }

    return data;
  } catch (error) {
    return null;
  }
}

export { clearTableOrdersCache };

export const processTableData = (tableId, apiResponse) => {
  const normalized = normalizeTableOrdersResponse(apiResponse, tableId);
  const hasOrders = normalized.orderIds.length > 0 || normalized.rawItems.length > 0;
  const hasReadyOrders = normalized.orders.some((order) => order.status === "ready");
  const currentBillAmount = normalized.rawItems.reduce(
    (sum, item) => sum + (Number(item.subtotal) || 0),
    0
  );

  return {
    id: normalized.table.id || tableId,
    table_number: normalized.table.number || tableId,
    status: hasOrders ? (hasReadyOrders ? "ready" : "occupied") : normalized.table.status,
    current_bill_amount: hasOrders ? currentBillAmount : 0,
    order_count: hasOrders ? normalized.rawItems.length : 0,
    capacity: normalized.table.capacity || 0
  };
};

// Optimized: fetches tables and orders in parallel with caching
export async function getAllTablesData() {
  try {
    // Step 1: Get all tables from backend (cached)
    const tablesResponse = await fetchGet('/tables', { cacheTTL: 30 * 1000 }); // 30s cache
    console.log('Tables from backend:', tablesResponse);

    // Extract tables array from response
    const tables = tablesResponse?.data || tablesResponse || [];

    if (!tables || tables.length === 0) {
      console.warn('No tables found in backend');
      return [];
    }

    // Step 2: For each table, fetch order details (with in-memory cache)
    const promises = tables.map(table => getTableOrders(table.id, true));
    const results = await Promise.all(promises);

    // Step 3: Process and combine data
    return results.map((result, index) => {
      const table = tables[index];
      return processTableData(table.id, result);
    });

  } catch (error) {
    console.error('Error fetching all tables data:', error);
    return [];
  }
}

// New optimized function: Single API call for floor view data
export async function getFloorViewData() {
  try {
    const response = await apiClient.get('/floor-view');

    if (!response.data || !response.data.success) {
      throw new Error('Invalid response format');
    }

    const payload = response.data.data ?? {};
    const tables = Array.isArray(payload.tables) ? payload.tables : [];
    const summary = payload.summary ?? {};

    const processedTables = tables.map((table) => ({
      id: table.id,
      table_number: table.table_number,
      capacity: table.capacity,
      status: table.status,
      unpaid_order: table.unpaid_order
        ? {
            order_id: table.unpaid_order.order_id,
            order_status: table.unpaid_order.order_status,
            items_count: table.unpaid_order.items_count,
            subtotal: Number(table.unpaid_order.subtotal) || 0,
            created_at: table.unpaid_order.created_at,
            waiter_name: table.unpaid_order.waiter_name,
          }
        : null,
    }));

    const readyToBillCount = processedTables.filter(isReadyToBill).length;
    const occupiedCount = processedTables.filter(
      (table) => table.status === "occupied" && !isReadyToBill(table)
    ).length;
    const availableCount = processedTables.filter((table) => table.status === "available").length;
    const reservedCount = processedTables.filter((table) => table.status === "reserved").length;

    return {
      tables: processedTables,
      summary: {
        total_tables: Number(summary.total_tables) || processedTables.length,
        available: availableCount,
        occupied: occupiedCount,
        reserved: reservedCount,
        ready_to_bill: readyToBillCount,
        total_unpaid_amount: Number(summary.total_unpaid_amount) || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching floor view data:', error);
    throw error;
  }
}

export const tablesAPI = {
  getTableOrders,
  getAllTablesData,
  getFloorViewData,
  processTableData,
  clearTableOrdersCache,
  getAll: async () => {
    return fetchGet('/tables');
  }
};
