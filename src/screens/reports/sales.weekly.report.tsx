import {useEffect, useMemo, useRef, useState} from "react";
import {ReportsLayout} from "@/screens/partials/reports.layout.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {Order, OrderStatus} from "@/api/model/order.ts";
import {OrderVoid} from "@/api/model/order_void.ts";
import {withCurrency, formatNumber} from "@/lib/utils.ts";
import {calculateOrderItemPrice} from "@/lib/cart.ts";
import {DateTime} from "luxon";

const safeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const DAY_PARTS = [
  {label: "Breakfast", startHour: 5, endHour: 11},
  {label: "Lunch", startHour: 11, endHour: 16},
  {label: "Dinner", startHour: 16, endHour: 22},
  {label: "Late night", startHour: 22, endHour: 5},
] as const;

type DayPartLabel = typeof DAY_PARTS[number]["label"];

const getDayPartLabel = (date: Date): DayPartLabel => {
  const hour = date.getHours();
  for (const part of DAY_PARTS) {
    const {startHour, endHour, label} = part;
    const wrapsMidnight = startHour > endHour;
    if (
      (!wrapsMidnight && hour >= startHour && hour < endHour) ||
      (wrapsMidnight && (hour >= startHour || hour < endHour))
    ) {
      return label;
    }
  }
  return DAY_PARTS[0].label;
};

const WEEK_DAYS: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const parseWeekParams = () => {
  const params = new URLSearchParams(window.location.search);
  const weekParam = params.get('week');

  let weekStart = weekParam ? DateTime.fromISO(weekParam) : DateTime.now();
  if (!weekStart.isValid) {
    weekStart = DateTime.now();
  }
  weekStart = weekStart.startOf('week');
  const weekEnd = weekStart.plus({days: 6});

  return {
    weekStart,
    weekEnd,
    weekStartISO: weekStart.toISODate(),
    weekEndISO: weekEnd.toISODate(),
  };
};

const calculateOrderNetSales = (order: Order): number => {
  const grossTotal = order.items?.reduce((sum, item) => sum + calculateOrderItemPrice(item), 0) ?? 0;
  const lineDiscounts = order.items?.reduce((sum, item) => sum + safeNumber(item?.discount), 0) ?? 0;
  const orderDiscount = safeNumber(order.discount_amount);
  const extraDiscount = Math.max(0, orderDiscount - lineDiscounts);
  const net = grossTotal - lineDiscounts - extraDiscount;
  return net > 0 ? net : 0;
};

interface DayMetrics {
  netSales: number;
  cashPayments: number;
  nonCashPayments: number;
  amountCollected: number;
  salesByDayPart: Record<DayPartLabel, number>;
  voids: number;
  comps: number;
  serviceChargesCollected: number;
  serviceChargesNotCollected: number;
  salesByOrderMode: Record<string, number>;
}

export const SalesWeeklyReport = () => {
  const db = useDB();
  const queryRef = useRef(db.query);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderVoids, setOrderVoids] = useState<OrderVoid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {weekStart, weekEnd, weekStartISO, weekEndISO} = useMemo(parseWeekParams, []);
  const subtitle = `${weekStartISO} to ${weekEndISO}`;

  useEffect(() => {
    queryRef.current = db.query;
  }, [db]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {start: weekStartISO, end: weekEndISO};

        const ordersQuery = `
          SELECT * FROM ${Tables.orders}
          WHERE time::format(created_at, "%Y-%m-%d") >= $start
            AND time::format(created_at, "%Y-%m-%d") <= $end
          FETCH payments, payments.payment_type, discount, order_type, items, items.item, items.item.categories, extras, user
        `;

        const ordersResult: any = await queryRef.current(ordersQuery, params);
        setOrders((ordersResult?.[0] ?? []) as Order[]);

        // Fetch order voids
        const voidsQuery = `
          SELECT * FROM ${Tables.order_voids}
          WHERE time::format(created_at, "%Y-%m-%d") >= $start
            AND time::format(created_at, "%Y-%m-%d") <= $end
          FETCH order_item
        `;

        const voidsResult: any = await queryRef.current(voidsQuery, params);
        setOrderVoids((voidsResult?.[0] ?? []) as OrderVoid[]);
      } catch (err) {
        console.error("Failed to load sales weekly report", err);
        setError(err instanceof Error ? err.message : "Unable to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weekStartISO, weekEndISO]);

  const dayMetrics = useMemo(() => {
    const metrics: Record<string, DayMetrics> = {};

    // Initialize metrics for each day of the week
    WEEK_DAYS.forEach((_, index) => {
      const date = weekStart.plus({days: index});
      const dateKey = date.toISODate() || '';
      metrics[dateKey] = {
        netSales: 0,
        cashPayments: 0,
        nonCashPayments: 0,
        amountCollected: 0,
        salesByDayPart: {
          Breakfast: 0,
          Lunch: 0,
          Dinner: 0,
          "Late night": 0,
        },
        voids: 0,
        comps: 0,
        serviceChargesCollected: 0,
        serviceChargesNotCollected: 0,
        salesByOrderMode: {},
      };
    });

    // Process orders
    orders.forEach(order => {
      const orderDate = DateTime.fromJSDate(new Date(order.created_at));
      const dateKey = orderDate.toISODate();
      if (!dateKey || !metrics[dateKey]) {
        return;
      }

      const dayMetric = metrics[dateKey];

      // Net sales
      const netSales = calculateOrderNetSales(order);
      dayMetric.netSales += netSales;

      // Payments
      order.payments?.forEach(payment => {
        const amount = safeNumber(payment?.amount);
        dayMetric.amountCollected += amount;

        const typeName = payment?.payment_type?.name || "Other";
        const typeCode = payment?.payment_type?.type || typeName;
        const normalized = typeCode?.toLowerCase() ?? "";
        const isCash = normalized.includes("cash");

        if (isCash) {
          dayMetric.cashPayments += amount;
        } else {
          dayMetric.nonCashPayments += amount;
        }
      });

      // Sales by day part
      const dayPart = getDayPartLabel(new Date(order.created_at));
      dayMetric.salesByDayPart[dayPart] += netSales;

      // Service charges
      const serviceChargeAmount = safeNumber(order.service_charge_amount);
      const amountCollected = safeNumber(
        order.payments?.reduce((sum, payment) => sum + safeNumber(payment?.amount), 0) ?? 0
      );
      if (amountCollected > 0) {
        dayMetric.serviceChargesCollected += serviceChargeAmount;
      } else {
        dayMetric.serviceChargesNotCollected += serviceChargeAmount;
      }

      // Sales by order mode
      const orderTypeName =
        order.order_type?.name || (typeof order.order_type === "string" ? order.order_type : "Unknown");
      dayMetric.salesByOrderMode[orderTypeName] = (dayMetric.salesByOrderMode[orderTypeName] || 0) + netSales;

      // Comps (100% discounts or complimentary items)
      const totalDiscount = safeNumber(order.discount_amount);
      const itemDiscounts = safeNumber(
        order.items?.reduce((sum, item) => sum + safeNumber(item?.discount), 0) ?? 0
      );
      const grossTotal = order.items?.reduce((sum, item) => sum + calculateOrderItemPrice(item), 0) ?? 0;
      if (grossTotal > 0 && (totalDiscount >= grossTotal || itemDiscounts >= grossTotal)) {
        dayMetric.comps += grossTotal;
      }
    });

    // Process voids
    orderVoids.forEach(voidEntry => {
      const voidDate = DateTime.fromISO(voidEntry.created_at);
      const dateKey = voidDate.toISODate();
      if (!dateKey || !metrics[dateKey]) {
        return;
      }

      const price = safeNumber(voidEntry?.order_item?.price);
      const quantity = safeNumber(voidEntry?.quantity || 1);
      const amount = price * quantity;
      metrics[dateKey].voids += amount;
    });

    return metrics;
  }, [orders, orderVoids, weekStart]);

  const dayHeaders = useMemo(() => {
    return WEEK_DAYS.map((day, index) => {
      const date = weekStart.plus({days: index});
      return {
        day,
        dateLabel: date.toFormat('yyyy-LL-dd'),
        dateKey: date.toISODate() || '',
      };
    });
  }, [weekStart]);

  const rows = useMemo(() => {
    const rowData: Array<{
      label: string;
      values: number[];
      total: number;
      formatter: (value: number) => string;
    }> = [];

    // Net Sales
    const netSalesValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.netSales || 0);
    rowData.push({
      label: "Net Sales",
      values: netSalesValues,
      total: netSalesValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Cash Payments
    const cashPaymentsValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.cashPayments || 0);
    rowData.push({
      label: "Cash Payments",
      values: cashPaymentsValues,
      total: cashPaymentsValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Non-Cash Payments
    const nonCashPaymentsValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.nonCashPayments || 0);
    rowData.push({
      label: "Non-Cash Payments",
      values: nonCashPaymentsValues,
      total: nonCashPaymentsValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Amount Collected
    const amountCollectedValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.amountCollected || 0);
    rowData.push({
      label: "Amount Collected",
      values: amountCollectedValues,
      total: amountCollectedValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Sales by Day Part
    DAY_PARTS.forEach(part => {
      const dayPartValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.salesByDayPart[part.label] || 0);
      rowData.push({
        label: `Sales by Day Part - ${part.label}`,
        values: dayPartValues,
        total: dayPartValues.reduce((sum, val) => sum + val, 0),
        formatter: withCurrency,
      });
    });

    // Voids
    const voidsValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.voids || 0);
    rowData.push({
      label: "Voids",
      values: voidsValues,
      total: voidsValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Comps
    const compsValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.comps || 0);
    rowData.push({
      label: "Comps",
      values: compsValues,
      total: compsValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Service Charges Collected
    const serviceChargesCollectedValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.serviceChargesCollected || 0);
    rowData.push({
      label: "Service Charges Collected",
      values: serviceChargesCollectedValues,
      total: serviceChargesCollectedValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Service Charges Not Collected
    const serviceChargesNotCollectedValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.serviceChargesNotCollected || 0);
    rowData.push({
      label: "Service Charges Not Collected",
      values: serviceChargesNotCollectedValues,
      total: serviceChargesNotCollectedValues.reduce((sum, val) => sum + val, 0),
      formatter: withCurrency,
    });

    // Sales by Order Mode - collect all order types
    const orderTypesSet = new Set<string>();
    dayHeaders.forEach(h => {
      const dayMetric = dayMetrics[h.dateKey];
      if (dayMetric) {
        Object.keys(dayMetric.salesByOrderMode).forEach(type => orderTypesSet.add(type));
      }
    });

    orderTypesSet.forEach(orderType => {
      const orderTypeValues = dayHeaders.map(h => dayMetrics[h.dateKey]?.salesByOrderMode[orderType] || 0);
      rowData.push({
        label: `Sales by Order Mode - ${orderType}`,
        values: orderTypeValues,
        total: orderTypeValues.reduce((sum, val) => sum + val, 0),
        formatter: withCurrency,
      });
    });

    return rowData;
  }, [dayMetrics, dayHeaders]);

  if (loading) {
    return (
      <ReportsLayout title="Sales weekly" subtitle={subtitle}>
        <div className="py-12 text-center text-neutral-500">Loading sales weekly report…</div>
      </ReportsLayout>
    );
  }

  if (error) {
    return (
      <ReportsLayout title="Sales weekly" subtitle={subtitle}>
        <div className="py-12 text-center text-red-600">Failed to load report: {error}</div>
      </ReportsLayout>
    );
  }

  return (
    <ReportsLayout title="Sales weekly" subtitle={subtitle}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 border border-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Metric</th>
              {dayHeaders.map(({day, dateLabel}) => (
                <th key={day} className="py-3 px-3 text-center text-xs font-semibold text-neutral-700">
                  <div>{day}</div>
                  <div className="text-xs text-neutral-500 font-normal">{dateLabel}</div>
                </th>
              ))}
              <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Weekly Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-neutral-50">
                <td className="py-3 pl-6 pr-3 text-sm font-medium text-neutral-900">{row.label}</td>
                {row.values.map((value, idx) => (
                  <td key={idx} className="py-3 px-3 text-right text-sm text-neutral-700">
                    {row.formatter(value)}
                  </td>
                ))}
                <td className="py-3 pr-6 text-right text-sm font-semibold text-neutral-900">
                  {row.formatter(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportsLayout>
  );
};
