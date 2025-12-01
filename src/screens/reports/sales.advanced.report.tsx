import {useEffect, useMemo, useRef, useState} from "react";
import {ReportsLayout} from "@/screens/partials/reports.layout.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {Order, OrderStatus} from "@/api/model/order.ts";
import {withCurrency, formatNumber} from "@/lib/utils.ts";
import {calculateOrderItemPrice} from "@/lib/cart.ts";

const safeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const recordToString = (value: any): string => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && 'toString' in value) {
    return value.toString();
  }
  return String(value);
};

interface ReportFilters {
  startDate?: string | null;
  endDate?: string | null;
  orderTakerIds: string[];
  cashierIds: string[];
  tableIds: string[];
  floorIds: string[];
  orderTypeIds: string[];
  withTax?: boolean;
  withoutTax?: boolean;
  withDiscount?: boolean;
  withoutDiscount?: boolean;
  discountIds: string[];
  paymentTypeIds: string[];
  refund?: boolean;
  merged?: boolean;
  cancelled?: boolean;
  split?: boolean;
  showMenuItems?: boolean;
  showDetails?: boolean;
}

const parseFilters = (): ReportFilters => {
  const params = new URLSearchParams(window.location.search);
  const parseMulti = (name: string) => {
    const list = [
      ...params.getAll(`${name}[]`),
      ...params.getAll(name),
    ].filter(Boolean);
    return list as string[];
  };

  return {
    startDate: params.get('start') || params.get('start_date'),
    endDate: params.get('end') || params.get('end_date'),
    orderTakerIds: parseMulti('order_takers'),
    cashierIds: parseMulti('cashiers'),
    tableIds: parseMulti('tables'),
    floorIds: parseMulti('floors'),
    orderTypeIds: parseMulti('order_types'),
    withTax: params.has('with_tax'),
    withoutTax: params.has('without_tax'),
    withDiscount: params.has('with_discount'),
    withoutDiscount: params.has('without_discount'),
    discountIds: parseMulti('discounts'),
    paymentTypeIds: parseMulti('payment_types'),
    refund: params.has('refund'),
    merged: params.has('merged'),
    cancelled: params.has('cancelled'),
    split: params.has('split'),
    showMenuItems: params.has('show_menu_items'),
    showDetails: params.has('show_details'),
  };
};

export const SalesAdvancedReport = () => {
  const db = useDB();
  const queryRef = useRef(db.query);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(parseFilters, []);
  const subtitle = filters.startDate && filters.endDate ? `${filters.startDate} to ${filters.endDate}` : undefined;

  useEffect(() => {
    queryRef.current = db.query;
  }, [db]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderConditions: string[] = [];
        const params: Record<string, string> = {};

        if (filters.startDate) {
          orderConditions.push(`time::format(created_at, "%Y-%m-%d") >= $startDate`);
          params.startDate = filters.startDate;
        }

        if (filters.endDate) {
          orderConditions.push(`time::format(created_at, "%Y-%m-%d") <= $endDate`);
          params.endDate = filters.endDate;
        }

        // Build status conditions
        // If no status filters are selected, show all orders
        // If status filters are selected, only show orders matching those statuses
        const statusConditions: string[] = [];
        if (filters.refund) {
          statusConditions.push(`status = '${OrderStatus.Refunded}'`);
        }
        if (filters.merged) {
          statusConditions.push(`status = '${OrderStatus.Merged}'`);
        }
        if (filters.cancelled) {
          statusConditions.push(`status = '${OrderStatus.Cancelled}'`);
        }
        if (filters.split) {
          statusConditions.push(`status = '${OrderStatus.Spilt}'`);
        }

        // If specific status filters are set, use them; otherwise include all statuses
        if (statusConditions.length > 0) {
          orderConditions.push(`(${statusConditions.join(' OR ')})`);
        }

        const ordersQuery = `
          SELECT * FROM ${Tables.orders}
          ${orderConditions.length ? `WHERE ${orderConditions.join(" AND ")}` : ""}
          FETCH payments, payments.payment_type, discount, order_type, items, items.item, items.item.categories, extras, user, cashier, table, floor
        `;

        const ordersResult: any = await queryRef.current(ordersQuery, params);
        setOrders((ordersResult?.[0] ?? []) as Order[]);
      } catch (err) {
        console.error("Failed to load sales advanced report", err);
        setError(err instanceof Error ? err.message : "Unable to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    filters.startDate,
    filters.endDate,
    filters.refund,
    filters.merged,
    filters.cancelled,
    filters.split,
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filter by order takers
      if (filters.orderTakerIds.length > 0) {
        const orderTakerId = recordToString(order.user?.id ?? order.user);
        if (!filters.orderTakerIds.includes(orderTakerId)) {
          return false;
        }
      }

      // Filter by cashiers
      if (filters.cashierIds.length > 0) {
        const cashierId = recordToString(order.cashier?.id ?? order.cashier);
        if (!filters.cashierIds.includes(cashierId)) {
          return false;
        }
      }

      // Filter by tables
      if (filters.tableIds.length > 0) {
        const tableId = recordToString(order.table?.id ?? order.table);
        if (!filters.tableIds.includes(tableId)) {
          return false;
        }
      }

      // Filter by floors
      if (filters.floorIds.length > 0) {
        const floorId = recordToString(order.floor?.id ?? order.floor);
        if (!filters.floorIds.includes(floorId)) {
          return false;
        }
      }

      // Filter by order types
      if (filters.orderTypeIds.length > 0) {
        const orderTypeId = recordToString(order.order_type?.id ?? order.order_type);
        if (!filters.orderTypeIds.includes(orderTypeId)) {
          return false;
        }
      }

      // Filter by tax
      const hasTax = safeNumber(order.tax_amount) > 0;
      if (filters.withTax && !hasTax) {
        return false;
      }
      if (filters.withoutTax && hasTax) {
        return false;
      }

      // Filter by discount
      const hasDiscount = safeNumber(order.discount_amount) > 0;
      if (filters.withDiscount && !hasDiscount) {
        return false;
      }
      if (filters.withoutDiscount && hasDiscount) {
        return false;
      }

      // Filter by specific discounts
      if (filters.discountIds.length > 0) {
        const discountId = recordToString(order.discount?.id ?? order.discount);
        if (!filters.discountIds.includes(discountId)) {
          return false;
        }
      }

      // Filter by payment types
      if (filters.paymentTypeIds.length > 0) {
        const hasPaymentType = order.payments?.some(payment => {
          const paymentTypeId = recordToString(payment.payment_type?.id ?? payment.payment_type);
          return filters.paymentTypeIds.includes(paymentTypeId);
        });
        if (!hasPaymentType) {
          return false;
        }
      }

      return true;
    });
  }, [orders, filters]);

  const calculateOrderTotals = (order: Order) => {
    const salePriceWithoutTax = safeNumber(
      order.items?.reduce((sum, item) => {
        const price = calculateOrderItemPrice(item);
        return sum + safeNumber(price);
      }, 0) ?? 0
    );
    const itemDiscounts = safeNumber(
      order.items?.reduce((sum, item) => sum + safeNumber(item?.discount), 0) ?? 0
    );
    const lineDiscounts = itemDiscounts;
    const orderDiscount = safeNumber(order.discount_amount);
    const subtotalDiscount = Math.max(0, safeNumber(orderDiscount - lineDiscounts));
    const totalDiscounts = safeNumber(lineDiscounts + subtotalDiscount);
    const taxes = safeNumber(order.tax_amount);
    const serviceCharges = safeNumber(order.service_charge_amount);
    const amountDue = safeNumber(salePriceWithoutTax + taxes + serviceCharges - totalDiscounts);
    const amountCollected = safeNumber(
      order.payments?.reduce((sum, payment) => sum + safeNumber(payment?.amount), 0) ?? 0
    );
    const net = safeNumber(amountCollected - serviceCharges - taxes);

    return {
      salePriceWithoutTax,
      taxes,
      amountDue,
      serviceCharges,
      discounts: totalDiscounts,
      net,
      amountCollected,
    };
  };

  const totals = useMemo(() => {
    return filteredOrders.reduce(
      (acc, order) => {
        const orderTotals = calculateOrderTotals(order);
        acc.salePriceWithoutTax += orderTotals.salePriceWithoutTax;
        acc.taxes += orderTotals.taxes;
        acc.amountDue += orderTotals.amountDue;
        acc.serviceCharges += orderTotals.serviceCharges;
        acc.discounts += orderTotals.discounts;
        acc.net += orderTotals.net;
        acc.amountCollected += orderTotals.amountCollected;
        acc.ordersCount += 1;
        return acc;
      },
      {
        salePriceWithoutTax: 0,
        taxes: 0,
        amountDue: 0,
        serviceCharges: 0,
        discounts: 0,
        net: 0,
        amountCollected: 0,
        ordersCount: 0,
      }
    );
  }, [filteredOrders]);

  if (loading) {
    return (
      <ReportsLayout title="Sales Advanced Report" subtitle={subtitle}>
        <div className="py-12 text-center text-neutral-500">Loading sales advanced report…</div>
      </ReportsLayout>
    );
  }

  if (error) {
    return (
      <ReportsLayout title="Sales Advanced Report" subtitle={subtitle}>
        <div className="py-12 text-center text-red-600">Failed to load report: {error}</div>
      </ReportsLayout>
    );
  }

  return (
    <ReportsLayout title="Sales Advanced Report" subtitle={subtitle}>
      <div className="space-y-8">
        {/* Summary Totals */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Summary</h3>
          <div className="p-4">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-2 text-neutral-700">Total Orders</td>
                  <td className="py-2 text-right font-semibold text-neutral-900">{formatNumber(totals.ordersCount)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-700">Sale Price w/o Tax</td>
                  <td className="py-2 text-right font-semibold text-neutral-900">{withCurrency(totals.salePriceWithoutTax)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-700">Taxes</td>
                  <td className="py-2 text-right font-semibold text-neutral-900">{withCurrency(totals.taxes)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-700">Service Charges</td>
                  <td className="py-2 text-right font-semibold text-neutral-900">{withCurrency(totals.serviceCharges)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-700">Discounts</td>
                  <td className="py-2 text-right font-semibold text-red-600">{withCurrency(-totals.discounts)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-700">Amount Due</td>
                  <td className="py-2 text-right font-semibold text-neutral-900">{withCurrency(totals.amountDue)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-700">Amount Collected</td>
                  <td className="py-2 text-right font-semibold text-neutral-900">{withCurrency(totals.amountCollected)}</td>
                </tr>
                <tr className="border-t-2 border-neutral-300">
                  <td className="py-2 font-semibold text-neutral-900">Net</td>
                  <td className="py-2 text-right font-bold text-neutral-900">{withCurrency(totals.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Date</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Invoice #</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Order Taker</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Cashier</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Table</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Floor</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Order Type</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Status</th>
                  {filters.showDetails && (
                    <>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Sale w/o Tax</th>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Taxes</th>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Service Charges</th>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Discounts</th>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Amount Due</th>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Amount Collected</th>
                      <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Net</th>
                    </>
                  )}
                  {!filters.showDetails && (
                    <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Net</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {filteredOrders.map(order => {
                  const orderTotals = calculateOrderTotals(order);
                  const orderDate = new Date(order.created_at);
                  const dateStr = orderDate.toLocaleDateString();
                  const orderTakerName = order.user
                    ? `${order.user.first_name ?? ''} ${order.user.last_name ?? ''}`.trim() || order.user.login || 'Unknown'
                    : 'Unknown';
                  const cashierName = order.cashier
                    ? `${order.cashier.first_name ?? ''} ${order.cashier.last_name ?? ''}`.trim() || order.cashier.login || 'Unknown'
                    : 'N/A';
                  const tableName = order.table?.name
                    ? `${order.table.name}${order.table.number ?? ''}`
                    : `Table ${order.table?.number ?? ''}`;
                  const floorName = order.floor?.name || 'Unknown';
                  const orderTypeName = order.order_type?.name || 'Unknown';
                  const discountName = order.discount?.name || (orderTotals.discounts > 0 ? 'Custom' : 'None');
                  const hasItems = filters.showMenuItems && order.items && order.items.length > 0;

                  return (
                    <>
                      <tr key={order.id} className={hasItems ? 'border-b-0' : ''}>
                        <td className="py-3 pl-6 pr-3 text-sm text-neutral-700">{dateStr}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{order.invoice_number}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{orderTakerName}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{cashierName}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{tableName}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{floorName}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{orderTypeName}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === OrderStatus.Paid ? 'bg-green-100 text-green-800' :
                            order.status === OrderStatus.Cancelled ? 'bg-red-100 text-red-800' :
                            order.status === OrderStatus.Merged ? 'bg-blue-100 text-blue-800' :
                            order.status === OrderStatus.Refunded ? 'bg-orange-100 text-orange-800' :
                            order.status === OrderStatus.Spilt ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        {filters.showDetails && (
                          <>
                            <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(orderTotals.salePriceWithoutTax)}</td>
                            <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(orderTotals.taxes)}</td>
                            <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(orderTotals.serviceCharges)}</td>
                            <td className="py-3 px-3 text-right text-sm text-red-600">{withCurrency(-orderTotals.discounts)}</td>
                            <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(orderTotals.amountDue)}</td>
                            <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(orderTotals.amountCollected)}</td>
                            <td className="py-3 px-3 text-right text-sm font-semibold text-neutral-900">{withCurrency(orderTotals.net)}</td>
                          </>
                        )}
                        {!filters.showDetails && (
                          <td className="py-3 pr-6 text-right text-sm font-semibold text-neutral-900">{withCurrency(orderTotals.net)}</td>
                        )}
                      </tr>
                      {hasItems && (
                        <tr key={`${order.id}-items`} className="bg-neutral-50">
                          <td colSpan={filters.showDetails ? 15 : 9} className="py-3 pl-6 pr-6">
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-neutral-700 mb-2">Menu Items:</div>
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-neutral-200">
                                    <th className="text-left py-2 pr-4 font-semibold text-neutral-600">Item</th>
                                    <th className="text-right py-2 px-2 font-semibold text-neutral-600">Quantity</th>
                                    <th className="text-right py-2 px-2 font-semibold text-neutral-600">Price</th>
                                    <th className="text-right py-2 px-2 font-semibold text-neutral-600">Discount</th>
                                    <th className="text-right py-2 pl-2 font-semibold text-neutral-600">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                  {order.items.map((item, idx) => {
                                    const itemPrice = calculateOrderItemPrice(item);
                                    const itemDiscount = safeNumber(item.discount);
                                    const itemTotal = safeNumber(itemPrice) - itemDiscount;

                                    return (
                                      <tr key={`${order.id}-item-${idx}`}>
                                        <td className="py-2 pr-4 text-neutral-700">{item.item?.name || 'Unknown'}</td>
                                        <td className="py-2 px-2 text-right text-neutral-700">{formatNumber(item.quantity)}</td>
                                        <td className="py-2 px-2 text-right text-neutral-700">{withCurrency(itemPrice)}</td>
                                        <td className="py-2 px-2 text-right text-red-600">{withCurrency(-itemDiscount)}</td>
                                        <td className="py-2 pl-2 text-right font-semibold text-neutral-900">{withCurrency(itemTotal)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={filters.showDetails ? 15 : 9} className="py-6 text-center text-sm text-neutral-500">
                      No orders found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ReportsLayout>
  );
};