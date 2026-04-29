function normalizeString(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function normalizeTableStatus(status) {
  const value = normalizeString(status);

  if (value === "free") return "available";
  if (value === "ready") return "ready";
  if (value === "reserved") return "reserved";
  if (value === "occupied") return "occupied";

  return "available";
}

export function isOrderPaid(order) {
  if (!order) return false;

  if (
    order.is_paid === true ||
    order.paid === true ||
    order.payment_completed === true ||
    order.payment?.paid === true ||
    order.paid_at ||
    order.payment_date
  ) {
    return true;
  }

  const paymentStates = [
    order.payment_status,
    order.bill_status,
    order.payment?.status,
    order.bill?.status,
  ].map(normalizeString);

  return paymentStates.some((state) =>
    ["paid", "completed", "settled", "closed"].includes(state)
  );
}

export function isOrderUnpaid(order) {
  if (!order) return false;
  if (isOrderPaid(order)) return false;

  if (order.is_paid === false || order.paid === false) {
    return true;
  }

  const paymentStates = [
    order.payment_status,
    order.bill_status,
    order.payment?.status,
    order.bill?.status,
  ].map(normalizeString);

  if (
    paymentStates.some((state) =>
      ["unpaid", "pending", "due", "partial", "open"].includes(state)
    )
  ) {
    return true;
  }

  // When the API does not expose an explicit payment flag, treat returned
  // table orders as unpaid so they remain billable until a payment completes.
  return true;
}

function getOrderItems(order) {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.order_items)) return order.order_items;
  return [];
}

function normalizeItem(item, order, index) {
  const quantity = Number(item?.quantity ?? item?.qty ?? 0) || 0;
  const unitPrice =
    Number(item?.unit_price ?? item?.price ?? item?.menu_item?.price ?? 0) || 0;
  const subtotal =
    Number(item?.subtotal ?? item?.total ?? item?.line_total) ||
    quantity * unitPrice;

  return {
    id: item?.id ?? `${order?.id ?? "order"}-${index}`,
    order_id: item?.order_id ?? order?.id ?? null,
    menu_item_id: item?.menu_item_id ?? item?.menu_item?.id ?? null,
    name: item?.menu_item?.name ?? item?.item_name ?? item?.name ?? "Unnamed item",
    quantity,
    unit_price: unitPrice,
    subtotal,
  };
}

function buildOrdersFromFlatItems(items, payload) {
  const groupedOrders = new Map();

  items.forEach((item, index) => {
    const orderId = item?.order_id ?? payload?.order_id ?? `table-${index}`;
    const existing = groupedOrders.get(orderId) ?? {
      id: orderId,
      status: item?.order_status ?? payload?.status ?? null,
      payment_status: item?.payment_status ?? payload?.payment_status ?? null,
      items: [],
    };

    existing.items.push(item);
    groupedOrders.set(orderId, existing);
  });

  return Array.from(groupedOrders.values());
}

function extractOrders(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.unpaid_orders)) return payload.unpaid_orders;
  if (payload?.order) return [payload.order];

  if (payload?.id && (Array.isArray(payload?.items) || Array.isArray(payload?.order_items))) {
    return [payload];
  }

  if (Array.isArray(payload?.items)) {
    return buildOrdersFromFlatItems(payload.items, payload);
  }

  return [];
}

export function normalizeTableOrdersResponse(apiResponse, fallbackTableId) {
  const payload = apiResponse?.data ?? apiResponse ?? {};
  const rawOrders = extractOrders(payload);
  const primaryOrder = rawOrders[0] ?? null;
  const table =
    payload?.table ??
    payload?.order?.table ??
    primaryOrder?.table ??
    primaryOrder?.order?.table ??
    null;
  const derivedStatus =
    table?.status ??
    payload?.status ??
    payload?.order?.status ??
    primaryOrder?.status ??
    primaryOrder?.table?.status;

  const unpaidOrders = rawOrders
    .filter(isOrderUnpaid)
    .map((order) => ({
      id: order?.id ?? order?.order_id ?? null,
      status: normalizeString(order?.status),
      payment_status: normalizeString(
        order?.payment_status ?? order?.bill_status ?? order?.payment?.status
      ),
      items: getOrderItems(order).map((item, index) => normalizeItem(item, order, index)),
    }))
    .filter((order) => order.items.length > 0 || order.id !== null);

  const rawItems = unpaidOrders.flatMap((order) => order.items);
  const mergedItemsMap = new Map();

  rawItems.forEach((item) => {
    const key = `${item.menu_item_id ?? item.name}-${item.unit_price}`;
    const existing = mergedItemsMap.get(key);

    if (existing) {
      existing.quantity += item.quantity;
      existing.subtotal += item.subtotal;
      existing.order_ids = Array.from(
        new Set([...existing.order_ids, item.order_id].filter(Boolean))
      );
      return;
    }

    mergedItemsMap.set(key, {
      ...item,
      order_ids: item.order_id ? [item.order_id] : [],
    });
  });

  const mergedItems = Array.from(mergedItemsMap.values());
  const orderIds = Array.from(
    new Set(
      unpaidOrders
        .map((order) => order.id)
        .concat(rawItems.map((item) => item.order_id))
        .filter(Boolean)
    )
  );

  return {
    table: {
      id: table?.id ?? payload?.table_id ?? payload?.order?.table_id ?? fallbackTableId,
      number:
        table?.table_number ??
        payload?.table_number ??
        payload?.order?.table_number ??
        payload?.order?.table?.table_number ??
        primaryOrder?.table?.table_number ??
        fallbackTableId,
      capacity: table?.capacity ?? 0,
      status: normalizeTableStatus(derivedStatus),
    },
    orders: unpaidOrders,
    orderIds,
    rawItems,
    mergedItems,
  };
}
