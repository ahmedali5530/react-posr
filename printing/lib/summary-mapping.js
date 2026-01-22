'use strict';

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Filtered items (exclude deleted, refunded, suspended). Mirrors getOrderFilteredItems.
 */
function getFilteredItems(order) {
  if (!order || !Array.isArray(order.items)) return [];
  return order.items.filter(
    (it) => !it.deleted_at && it.is_refunded !== true && it.is_suspended !== true
  );
}

/**
 * Item line total. Mirrors calculateOrderItemPrice but without modifiers (price * quantity).
 */
function itemLineTotal(it) {
  return safeNumber((it.price || 0) * (it.quantity ?? 1));
}

/**
 * Voided items (deleted, refunded, or suspended).
 */
function getVoidedItems(order) {
  if (!order || !Array.isArray(order.items)) return [];
  return order.items.filter(
    (it) => !!it.deleted_at || it.is_refunded === true || it.is_suspended === true
  );
}

/**
 * Compute summary from { orders: { data: Order[] }, date } to match Summary (summary.tsx) props and logic.
 * @param {{ orders?: { data?: unknown[] }, date?: string }} props - same as Summary props
 * @returns {Object} flat summary for printing
 */
function computeSummary(props) {
  const orders = props?.orders?.data || [];
  const date = props?.date || new Date().toLocaleDateString();

  // Sale price without tax (items total, using price*quantity)
  const salePriceWithoutTax = orders.reduce((sum, order) => {
    return (
      sum +
      getFilteredItems(order).reduce((itemSum, item) => itemSum + safeNumber(itemLineTotal(item)), 0)
    );
  }, 0);
  const exclusive = salePriceWithoutTax;

  const taxCollected = orders.reduce((s, o) => s + safeNumber(o.tax_amount), 0);
  const serviceCharges = orders.reduce((s, o) => s + safeNumber(o.service_charge_amount), 0);

  const itemDiscounts = orders.reduce((s, order) => {
    return (
      s +
      safeNumber(
        (order.items || []).reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0)
      )
    );
  }, 0);

  const subtotalDiscounts = orders.reduce((s, order) => {
    const lineDiscounts = (order.items || []).reduce(
      (itemSum, item) => itemSum + safeNumber(item?.discount),
      0
    );
    const orderDiscount = safeNumber(order.discount_amount);
    const extraDiscount = Math.max(0, orderDiscount - lineDiscounts);
    return s + extraDiscount;
  }, 0);
  const discounts = itemDiscounts + subtotalDiscounts;

  const totalExtras = orders.reduce((s, order) => {
    return (
      s + (order?.extras || []).reduce((es, e) => es + safeNumber(e.value), 0)
    );
  }, 0);

  const amountDue = salePriceWithoutTax + taxCollected + serviceCharges + totalExtras - itemDiscounts - subtotalDiscounts;
  const amountCollected = orders.reduce((s, order) => {
    return (
      s +
      (order.payments || []).reduce((ps, p) => ps + safeNumber(p?.amount), 0)
    );
  }, 0);
  const rounding = amountCollected - amountDue;
  const net = amountCollected - serviceCharges - taxCollected;

  const refunds = orders.reduce((s, order) => {
    if (order.status === 'Cancelled') {
      return (
        s +
        (order.payments || []).reduce((ps, p) => {
          const a = safeNumber(p?.amount);
          return ps + Math.abs(Math.min(0, a));
        }, 0)
      );
    }
    return (
      s +
      (order.payments || []).reduce((ps, p) => {
        const a = safeNumber(p?.amount);
        return ps + (a < 0 ? Math.abs(a) : 0);
      }, 0)
    );
  }, 0);

  const gross = amountCollected + refunds + discounts;
  const gSales = salePriceWithoutTax;

  const tips = orders.reduce((s, o) => s + safeNumber(o.tip_amount), 0);

  const discountsList = {};
  orders.forEach((order) => {
    if (order?.discount) {
      const k = order.discount?.name || 'Discount';
      if (!discountsList[k]) discountsList[k] = 0;
      discountsList[k] += safeNumber(order.discount_amount);
    }
  });

  const taxesList = {};
  orders.forEach((order) => {
    if (order?.tax) {
      const k = `${order.tax?.name || 'Tax'} ${order.tax?.rate ?? ''}`.trim();
      if (!taxesList[k]) taxesList[k] = 0;
      taxesList[k] += safeNumber(order.tax_amount);
    }
  });

  const paymentTypes = {};
  orders.forEach((order) => {
    (order.payments || []).forEach((p) => {
      const name = p.payment_type?.name || p.payment_type?.title || 'Unknown';
      if (!paymentTypes[name]) paymentTypes[name] = 0;
      paymentTypes[name] += safeNumber(p.payable ?? p.amount ?? 0);
    });
  });

  const extras = {};
  orders.forEach((order) => {
    (order.extras || []).forEach((e) => {
      const n = e.name || 'Extra';
      if (!extras[n]) extras[n] = 0;
      extras[n] += safeNumber(e.value);
    });
  });

  const voids = orders.reduce((s, order) => {
    return (
      s +
      getVoidedItems(order).reduce((itemSum, item) => itemSum + safeNumber(itemLineTotal(item)), 0)
    );
  }, 0);

  const covers = orders.reduce((s, o) => s + safeNumber(o.covers), 0);
  const ordersCount = orders.length;
  const averageCover = covers > 0 ? amountDue / covers : 0;
  const averageOrder = ordersCount > 0 ? amountDue / ordersCount : 0;

  const categories = {};
  orders.forEach((order) => {
    getFilteredItems(order).forEach((item) => {
      const c = item.category;
      const cat = typeof c === 'string' ? c : (c?.name ?? item.item?.categories?.[0]?.name ?? '');
      if (!cat) return;
      if (!categories[cat]) categories[cat] = { quantity: 0, total: 0 };
      categories[cat].quantity += item.quantity ?? 1;
      categories[cat].total += itemLineTotal(item);
    });
  });

  const dishes = {};
  orders.forEach((order) => {
    getFilteredItems(order).forEach((item) => {
      const name = item.item?.name || item.dish?.name || '';
      if (!name) return;
      if (!dishes[name]) dishes[name] = { quantity: 0, total: 0 };
      dishes[name].quantity += item.quantity ?? 1;
      dishes[name].total += itemLineTotal(item);
    });
  });

  return {
    date,
    exclusive,
    gSales,
    gross,
    refunds,
    serviceCharges,
    discounts,
    taxes: taxCollected,
    net,
    amountDue,
    amountCollected,
    totalExtras,
    rounding,
    voids,
    tips,
    covers,
    ordersCount,
    averageCover,
    averageOrder,
    discountsList,
    taxesList,
    paymentTypes,
    extras,
    categories,
    dishes,
  };
}

function formatNum(n) {
  const x = Number(n);
  return Number.isFinite(x) ? String(Math.round(x)) : '0';
}

module.exports = { computeSummary, formatNum, getFilteredItems, getVoidedItems, itemLineTotal };
