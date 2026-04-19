import apiClient from "./client";

export async function getTableOrders(tableId) {
  try {
    const response = await apiClient.get(`/orders/table/${tableId}`);
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

export async function getAllTablesData() {
  const tableCount = 15; // Standard restaurant size for this app
  const promises = [];
  
  for (let i = 1; i <= tableCount; i++) {
    promises.push(getTableOrders(i));
  }
  
  const results = await Promise.all(promises);
  return results.map((result, index) => processTableData(index + 1, result));
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
