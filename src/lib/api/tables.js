import apiClient from "./client";

export async function getTableOrders(tableId) {
  try {
    const response = await apiClient.get(`/orders/table/${tableId}`);
    console.log(`Table ${tableId} orders:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching table ${tableId}:`, error);
    return null;
  }
}

export const processTableData = (tableId, apiResponse) => {
  const hasOrders = apiResponse?.success && apiResponse.data?.items?.length > 0;
  
  return {
    id: apiResponse?.data?.table?.id || tableId,
    table_number: apiResponse?.data?.table?.table_number || tableId,
    status: hasOrders ? 'occupied' : apiResponse?.data?.table?.status || 'available',
    current_bill_amount: hasOrders 
      ? apiResponse.data.items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0) 
      : 0,
    order_count: hasOrders ? apiResponse.data.items.length : 0,
    capacity: apiResponse?.data?.table?.capacity || 0
  };
};

// fetches actual tables from backend first, then fetches orders for each table
export async function getAllTablesData() {
  try {
    // Step 1: Get all tables from backend
    const tablesResponse = await apiClient.get('/tables');
    console.log('Tables from backend:', tablesResponse.data);
    
    // Extract tables array from response
    const tables = tablesResponse.data?.data || tablesResponse.data || [];
    
    if (!tables || tables.length === 0) {
      console.warn('No tables found in backend');
      return [];
    }
    
    // Step 2: For each table, fetch order details
    const promises = tables.map(table => getTableOrders(table.id));
    const results = await Promise.all(promises);
    
    // Step 3: Process and combine data
    return results.map((result, index) => {
      const table = tables[index];
      return processTableData(table.id, result);
    });
    
  } catch (error) {
    console.error('Error fetching all tables data:', error);
    
    // Fallback: If /tables endpoint doesn't exist, return empty
    return [];
  }
}

export const tablesAPI = {
  getTableOrders,
  getAllTablesData,
  processTableData,
  getAll: async () => {
    const response = await apiClient.get('/tables');
    return response.data;
  }
};
