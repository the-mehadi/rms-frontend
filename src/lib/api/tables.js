import apiClient, { fetchGet, clearCache, getTableOrdersCache, setTableOrdersCache, clearTableOrdersCache } from "./client";
import { normalizeTableOrdersResponse } from "@/lib/order-utils";

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

export const tablesAPI = {
  getTableOrders,
  getAllTablesData,
  processTableData,
  clearTableOrdersCache,
  getAll: async () => {
    return fetchGet('/tables');
  }
};
