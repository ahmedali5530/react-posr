import {useEffect, useMemo, useRef, useState} from "react";
import {ReportsLayout} from "@/screens/partials/reports.layout.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {Order, OrderStatus} from "@/api/model/order.ts";
import {OrderVoid} from "@/api/model/order_void.ts";
import {withCurrency, formatNumber} from "@/lib/utils.ts";
import {calculateOrderItemPrice} from "@/lib/cart.ts";

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

const parseFilters = () => {
  const params = new URLSearchParams(window.location.search);
  const startDate = params.get("start_date") || params.get("start");
  const endDate = params.get("end_date") || params.get("end");
  return {startDate, endDate};
};

interface OrderTypeMetrics {
  orderType: string;
  salePriceWithoutTax: number;
  taxes: number;
  amountDue: number;
  serviceCharges: number;
  discounts: number;
  net: number;
  percentOfTotal: number;
  guests: number;
  avgGuest: number;
  checks: number;
  avgCheck: number;
  turnTime: number; // in minutes
}

export const SalesSummary2Report = () => {
  const db = useDB();
  const queryRef = useRef(db.query);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderVoids, setOrderVoids] = useState<OrderVoid[]>([]);
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

        const ordersQuery = `
          SELECT * FROM ${Tables.orders}
          ${orderConditions.length ? `WHERE ${orderConditions.join(" AND ")}` : ""}
          FETCH payments, payments.payment_type, discount, order_type, items, items.item, items.item.categories, extras, user
        `;

        const ordersResult: any = await queryRef.current(ordersQuery, params);
        setOrders((ordersResult?.[0] ?? []) as Order[]);

        // Fetch order voids
        const voidConditions: string[] = [];
        const voidParams: Record<string, string> = {};

        if (filters.startDate) {
          voidConditions.push(`time::format(created_at, "%Y-%m-%d") >= $startDate`);
          voidParams.startDate = filters.startDate;
        }

        if (filters.endDate) {
          voidConditions.push(`time::format(created_at, "%Y-%m-%d") <= $endDate`);
          voidParams.endDate = filters.endDate;
        }

        const voidsQuery = `
          SELECT * FROM ${Tables.order_voids}
          ${voidConditions.length ? `WHERE ${voidConditions.join(" AND ")}` : ""}
          FETCH order_item
        `;

        const voidsResult: any = await queryRef.current(voidsQuery, voidParams);
        setOrderVoids((voidsResult?.[0] ?? []) as OrderVoid[]);

        // Fetch orders created before date range for "carried over" calculation
        if (filters.startDate) {
          const carriedOverConditions = [
            `time::format(created_at, "%Y-%m-%d") < $startDate`,
            `status = '${OrderStatus["In Progress"]}'`,
          ];
          const carriedOverParams = {startDate: filters.startDate};

          const carriedOverQuery = `
            SELECT * FROM ${Tables.orders}
            WHERE ${carriedOverConditions.join(" AND ")}
            FETCH payments, payments.payment_type, discount, order_type, items, items.item, items.item.categories, extras, user
          `;

          const carriedOverResult: any = await queryRef.current(carriedOverQuery, carriedOverParams);
          const carriedOverOrders = (carriedOverResult?.[0] ?? []) as Order[];
          setOrders(prev => [...prev, ...carriedOverOrders]);
        }
      } catch (err) {
        console.error("Failed to load sales summary 2 report", err);
        setError(err instanceof Error ? err.message : "Unable to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.startDate, filters.endDate]);

  // Calculate metrics for a single order
  const calculateOrderMetrics = (order: Order) => {
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

    // Calculate turn time: for paid orders, estimate based on payment time
    // Since we don't have payment timestamps, we'll use 0 for now
    // In a real system, you'd calculate: payment_time - created_at
    const turnTime = 0;

    return {
      salePriceWithoutTax,
      taxes,
      amountDue,
      serviceCharges,
      discounts: totalDiscounts,
      net,
      turnTime,
    };
  };

  // First section: Financial calculations
  const financialMetrics = useMemo(() => {
    const salePriceWithoutTax = safeNumber(
      orders.reduce((sum, order) => {
        const itemsTotal = safeNumber(
          order.items?.reduce((itemSum, item) => {
            const price = calculateOrderItemPrice(item);
            return itemSum + safeNumber(price);
          }, 0) ?? 0
        );
        return sum + itemsTotal;
      }, 0)
    );

    const taxCollected = safeNumber(
      orders.reduce((sum, order) => sum + safeNumber(order.tax_amount), 0)
    );

    const serviceCharges = safeNumber(
      orders.reduce((sum, order) => sum + safeNumber(order.service_charge_amount), 0)
    );

    const itemDiscounts = safeNumber(
      orders.reduce((sum, order) => {
        return sum + safeNumber(order.items?.reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0) ?? 0);
      }, 0)
    );

    const subtotalDiscounts = safeNumber(
      orders.reduce((sum, order) => {
        const lineDiscounts = safeNumber(
          order.items?.reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0) ?? 0
        );
        const orderDiscount = safeNumber(order.discount_amount);
        const extraDiscount = Math.max(0, safeNumber(orderDiscount - lineDiscounts));
        return sum + extraDiscount;
      }, 0)
    );

    const amountDue = safeNumber(salePriceWithoutTax + taxCollected + serviceCharges - itemDiscounts - subtotalDiscounts);

    const amountCollected = safeNumber(
      orders.reduce((sum, order) => {
        return sum + safeNumber(order.payments?.reduce((paySum, payment) => paySum + safeNumber(payment?.amount), 0) ?? 0);
      }, 0)
    );

    const rounding = safeNumber(amountCollected - amountDue);

    const net = safeNumber(amountCollected - serviceCharges - taxCollected);

    const refunds = safeNumber(
      orders.reduce((sum, order) => {
        if (order.status === OrderStatus.Cancelled) {
          return sum + safeNumber(
            order.payments?.reduce((paySum, payment) => {
              const amount = safeNumber(payment?.amount);
              return paySum + Math.abs(Math.min(0, amount));
            }, 0) ?? 0
          );
        }
        return sum + safeNumber(
          order.payments?.reduce((paySum, payment) => {
            const amount = safeNumber(payment?.amount);
            return paySum + (amount < 0 ? Math.abs(amount) : 0);
          }, 0) ?? 0
        );
      }, 0)
    );

    const totalDiscounts = safeNumber(itemDiscounts + subtotalDiscounts);
    const gross = safeNumber(amountCollected + refunds + totalDiscounts);

    return {
      salePriceWithoutTax,
      taxCollected,
      serviceCharges,
      itemDiscounts,
      subtotalDiscounts,
      amountDue,
      amountCollected,
      rounding,
      net,
      refunds,
      gross,
    };
  }, [orders]);

  // Second section: Sale by order type
  const orderTypeMetrics = useMemo(() => {
    const totalNet = financialMetrics.net;
    const map = new Map<string, OrderTypeMetrics>();

    orders.forEach(order => {
      const orderTypeName =
        order.order_type?.name || (typeof order.order_type === "string" ? order.order_type : "Unknown");

      if (!map.has(orderTypeName)) {
        map.set(orderTypeName, {
          orderType: orderTypeName,
          salePriceWithoutTax: 0,
          taxes: 0,
          amountDue: 0,
          serviceCharges: 0,
          discounts: 0,
          net: 0,
          percentOfTotal: 0,
          guests: 0,
          avgGuest: 0,
          checks: 0,
          avgCheck: 0,
          turnTime: 0,
        });
      }

      const metrics = map.get(orderTypeName)!;
      const orderMetrics = calculateOrderMetrics(order);

      metrics.salePriceWithoutTax = safeNumber(metrics.salePriceWithoutTax + safeNumber(orderMetrics.salePriceWithoutTax));
      metrics.taxes = safeNumber(metrics.taxes + safeNumber(orderMetrics.taxes));
      metrics.amountDue = safeNumber(metrics.amountDue + safeNumber(orderMetrics.amountDue));
      metrics.serviceCharges = safeNumber(metrics.serviceCharges + safeNumber(orderMetrics.serviceCharges));
      metrics.discounts = safeNumber(metrics.discounts + safeNumber(orderMetrics.discounts));
      metrics.net = safeNumber(metrics.net + safeNumber(orderMetrics.net));
      metrics.guests = safeNumber(metrics.guests + safeNumber(order.covers));
      metrics.checks += 1;
      metrics.turnTime = safeNumber(metrics.turnTime + safeNumber(orderMetrics.turnTime));
    });

    // Calculate averages and percentages
    map.forEach(metrics => {
      const safeNet = safeNumber(metrics.net);
      const safeGuests = safeNumber(metrics.guests);
      const safeChecks = safeNumber(metrics.checks);
      const safeTotalNet = safeNumber(totalNet);
      const safeTurnTime = safeNumber(metrics.turnTime);

      metrics.avgGuest = safeGuests > 0 ? safeNumber(safeNet / safeGuests) : 0;
      metrics.avgCheck = safeChecks > 0 ? safeNumber(safeNet / safeChecks) : 0;
      metrics.percentOfTotal = safeTotalNet > 0 ? safeNumber((safeNet / safeTotalNet) * 100) : 0;
      metrics.turnTime = safeChecks > 0 ? safeNumber(safeTurnTime / safeChecks) : 0;
    });

    return Array.from(map.values()).sort((a, b) => b.net - a.net);
  }, [orders, financialMetrics.net]);

  // Third section: Sale by day part
  const dayPartMetrics = useMemo(() => {
    const totalNet = financialMetrics.net;
    const map = new Map<DayPartLabel, OrderTypeMetrics>();

    DAY_PARTS.forEach(part => {
      map.set(part.label, {
        orderType: part.label,
        salePriceWithoutTax: 0,
        taxes: 0,
        amountDue: 0,
        serviceCharges: 0,
        discounts: 0,
        net: 0,
        percentOfTotal: 0,
        guests: 0,
        avgGuest: 0,
        checks: 0,
        avgCheck: 0,
        turnTime: 0,
      });
    });

    orders.forEach(order => {
      const dayPart = getDayPartLabel(new Date(order.created_at));
      const metrics = map.get(dayPart)!;
      const orderMetrics = calculateOrderMetrics(order);

      metrics.salePriceWithoutTax = safeNumber(metrics.salePriceWithoutTax + safeNumber(orderMetrics.salePriceWithoutTax));
      metrics.taxes = safeNumber(metrics.taxes + safeNumber(orderMetrics.taxes));
      metrics.amountDue = safeNumber(metrics.amountDue + safeNumber(orderMetrics.amountDue));
      metrics.serviceCharges = safeNumber(metrics.serviceCharges + safeNumber(orderMetrics.serviceCharges));
      metrics.discounts = safeNumber(metrics.discounts + safeNumber(orderMetrics.discounts));
      metrics.net = safeNumber(metrics.net + safeNumber(orderMetrics.net));
      metrics.guests = safeNumber(metrics.guests + safeNumber(order.covers));
      metrics.checks += 1;
      metrics.turnTime = safeNumber(metrics.turnTime + safeNumber(orderMetrics.turnTime));
    });

    // Calculate averages and percentages
    map.forEach(metrics => {
      const safeNet = safeNumber(metrics.net);
      const safeGuests = safeNumber(metrics.guests);
      const safeChecks = safeNumber(metrics.checks);
      const safeTotalNet = safeNumber(totalNet);
      const safeTurnTime = safeNumber(metrics.turnTime);

      metrics.avgGuest = safeGuests > 0 ? safeNumber(safeNet / safeGuests) : 0;
      metrics.avgCheck = safeChecks > 0 ? safeNumber(safeNet / safeChecks) : 0;
      metrics.percentOfTotal = safeTotalNet > 0 ? safeNumber((safeNet / safeTotalNet) * 100) : 0;
      metrics.turnTime = safeChecks > 0 ? safeNumber(safeTurnTime / safeChecks) : 0;
    });

    return Array.from(map.values());
  }, [orders, financialMetrics.net]);

  // Additional metrics for first section subsections
  const deletionMetrics = useMemo(() => {
    const refunds = financialMetrics.refunds;
    const cancelledOrders = orders.filter(order => order.status === OrderStatus.Cancelled).length;
    const voidsByReason = orderVoids.reduce((acc, voidEntry) => {
      const reason = voidEntry.reason || "Unknown";
      const price = safeNumber(voidEntry?.order_item?.price);
      const quantity = safeNumber(voidEntry?.quantity || 1);
      const amount = price * quantity;

      if (!acc[reason]) {
        acc[reason] = {count: 0, amount: 0};
      }
      acc[reason].count += 1;
      acc[reason].amount += amount;
      return acc;
    }, {} as Record<string, {count: number; amount: number}>);
    const totalDeletion = Object.values(voidsByReason).reduce((sum, item) => sum + item.amount, 0);

    return {
      refunds,
      cancelledOrders,
      voidsByReason,
      totalDeletion,
    };
  }, [orders, orderVoids, financialMetrics.refunds]);

  const checkStatusMetrics = useMemo(() => {
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const checksCarriedOver = startDate
      ? orders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate < startDate && order.status === OrderStatus["In Progress"];
        }).length
      : 0;
    const checksBegun = filters.startDate && filters.endDate
      ? orders.filter(order => {
          const orderDate = new Date(order.created_at);
          const start = new Date(filters.startDate!);
          const end = new Date(filters.endDate!);
          end.setHours(23, 59, 59, 999);
          return orderDate >= start && orderDate <= end;
        }).length
      : orders.length;
    const checksPaid = orders.filter(order => order.status === OrderStatus.Paid).length;
    const checksCancelled = orders.filter(order => order.status === OrderStatus.Cancelled).length;
    const checksMerged = orders.filter(order => order.status === OrderStatus.Merged).length;
    const checksOpen = orders.filter(order => order.status === OrderStatus["In Progress"]).length;
    const outstandingChecks = checksOpen;

    return {
      checksCarriedOver,
      checksBegun,
      checksPaid,
      checksCancelled,
      checksMerged,
      checksOpen,
      outstandingChecks,
    };
  }, [orders, filters.startDate, filters.endDate]);

  const discountTypesBreakdown = useMemo(() => {
    const discountTypes = new Map<string, {quantity: number; total: number; percent: number}>();
    orders.forEach(order => {
      if (order.discount) {
        const discountName =
          order.discount?.name ||
          (typeof order.discount === "string" ? order.discount : null) ||
          "Custom discount";
        const amount = safeNumber(order.discount_amount);
        const existing = discountTypes.get(discountName) || {quantity: 0, total: 0, percent: 0};
        existing.quantity += 1;
        existing.total += amount;
        if (order.discount && typeof order.discount === "object" && "type" in order.discount) {
          if (!existing.percent && order.discount.type) {
            existing.percent = 0;
          }
        }
        discountTypes.set(discountName, existing);
      }
    });

    const serviceChargesBreakdown = orders.reduce((acc, order) => {
      const amount = safeNumber(order.service_charge_amount);
      if (amount > 0) {
        const type = order.service_charge_type || "Standard";
        acc[type] = (acc[type] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const taxesBreakdown = orders.reduce((acc, order) => {
      const amount = safeNumber(order.tax_amount);
      if (amount > 0 && order.tax) {
        const taxName =
          order.tax?.name ||
          (typeof order.tax === "string" ? order.tax : null) ||
          "Tax";
        const rate = order.tax && typeof order.tax === "object" && "rate" in order.tax ? safeNumber(order.tax.rate) : 0;
        const key = `${taxName} (${rate}%)`;
        acc[key] = (acc[key] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const tipsBreakdown = orders.reduce((acc, order) => {
      const amount = safeNumber(order.tip_amount);
      if (amount > 0) {
        const type = order.tip_type || "Standard";
        acc[type] = (acc[type] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const extrasBreakdown = orders.reduce((acc, order) => {
      order.extras?.forEach(extra => {
        const name = extra.name || "Extra";
        const value = safeNumber(extra.value);
        acc[name] = (acc[name] || 0) + value;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      discountTypes: Array.from(discountTypes.entries()).map(([name, data]) => ({
        name,
        quantity: data.quantity,
        total: data.total,
        percent: data.percent,
      })),
      serviceChargesBreakdown,
      taxesBreakdown,
      tipsBreakdown,
      extrasBreakdown,
    };
  }, [orders]);

  // Fourth section: Breakdowns
  const breakdownMetrics = useMemo(() => {
    // 1st subsection: Categories with quantity + total
    const categoriesMap = new Map<string, {quantity: number; total: number}>();
    orders.forEach(order => {
      order.items?.forEach(item => {
        const categories = item.item?.categories || [];
        const itemPrice = safeNumber(calculateOrderItemPrice(item));
        if (Array.isArray(categories) && categories.length > 0) {
          categories.forEach((category: any) => {
            const categoryName = category?.name || "Uncategorized";
            const existing = categoriesMap.get(categoryName) || {quantity: 0, total: 0};
            existing.quantity = safeNumber(existing.quantity + safeNumber(item.quantity));
            existing.total = safeNumber(existing.total + itemPrice);
            categoriesMap.set(categoryName, existing);
          });
        } else if (item.category) {
          const existing = categoriesMap.get(item.category) || {quantity: 0, total: 0};
          existing.quantity = safeNumber(existing.quantity + safeNumber(item.quantity));
          existing.total = safeNumber(existing.total + itemPrice);
          categoriesMap.set(item.category, existing);
        }
      });
    });

    // 2nd subsection: Dishes with quantity + total
    const dishesMap = new Map<string, {quantity: number; total: number}>();
    orders.forEach(order => {
      order.items?.forEach(item => {
        const dishName = item.item?.name || "Unknown";
        const existing = dishesMap.get(dishName) || {quantity: 0, total: 0};
        const itemPrice = safeNumber(calculateOrderItemPrice(item));
        existing.quantity = safeNumber(existing.quantity + safeNumber(item.quantity));
        existing.total = safeNumber(existing.total + itemPrice);
        dishesMap.set(dishName, existing);
      });
    });

    // 3rd subsection: Discounts made by users
    const userDiscountsMap = new Map<string, {quantity: number; total: number}>();
    orders.forEach(order => {
      const discountAmount = safeNumber(order.discount_amount);
      if (discountAmount > 0) {
        const userName =
          order.user?.first_name && order.user?.last_name
            ? `${order.user.first_name} ${order.user.last_name}`
            : order.user?.login || "Unknown";
        const existing = userDiscountsMap.get(userName) || {quantity: 0, total: 0};
        existing.quantity = safeNumber(existing.quantity + 1);
        existing.total = safeNumber(existing.total + discountAmount);
        userDiscountsMap.set(userName, existing);
      }
    });

    // 4th subsection: Payment types with quantity + total
    const paymentTypesMap = new Map<string, {quantity: number; total: number}>();
    orders.forEach(order => {
      order.payments?.forEach(payment => {
        const paymentTypeName = payment.payment_type?.name || "Unknown";
        const existing = paymentTypesMap.get(paymentTypeName) || {quantity: 0, total: 0};
        const paymentAmount = safeNumber(payment.amount);
        existing.quantity = safeNumber(existing.quantity + 1);
        existing.total = safeNumber(existing.total + paymentAmount);
        paymentTypesMap.set(paymentTypeName, existing);
      });
    });

    return {
      categories: Array.from(categoriesMap.entries())
        .map(([name, data]) => ({name, ...data}))
        .sort((a, b) => b.total - a.total),
      dishes: Array.from(dishesMap.entries())
        .map(([name, data]) => ({name, ...data}))
        .sort((a, b) => b.total - a.total),
      userDiscounts: Array.from(userDiscountsMap.entries())
        .map(([name, data]) => ({name, ...data}))
        .sort((a, b) => b.total - a.total),
      paymentTypes: Array.from(paymentTypesMap.entries())
        .map(([name, data]) => ({name, ...data}))
        .sort((a, b) => b.total - a.total),
    };
  }, [orders]);

  if (loading) {
    return (
      <ReportsLayout title="Sales summary 2" subtitle={subtitle}>
        <div className="py-12 text-center text-neutral-500">Loading sales summary 2…</div>
      </ReportsLayout>
    );
  }

  if (error) {
    return (
      <ReportsLayout title="Sales summary 2" subtitle={subtitle}>
        <div className="py-12 text-center text-red-600">Failed to load report: {error}</div>
      </ReportsLayout>
    );
  }

  return (
    <ReportsLayout title="Sales summary 2" subtitle={subtitle}>
      <div className="space-y-8">
        {/* First section: Financial calculations with 4 sub-columns */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Financial Calculations</h3>
          <div className="grid grid-cols-4 divide-x divide-neutral-200">
            {/* 1st subsection: Financial calculations */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Financial Summary</h4>
              <table className="min-w-full text-xs">
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Sale price w/o tax</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.salePriceWithoutTax)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Tax collected</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.taxCollected)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Service charges</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.serviceCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">- Item discount</td>
                    <td className="py-1.5 text-right font-semibold text-red-600">
                      {withCurrency(-financialMetrics.itemDiscounts)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">- Subtotal discount</td>
                    <td className="py-1.5 text-right font-semibold text-red-600">
                      {withCurrency(-financialMetrics.subtotalDiscounts)}
                    </td>
                  </tr>
                  <tr className="border-t border-neutral-300">
                    <td className="py-1.5 font-semibold text-neutral-900">= Amount due</td>
                    <td className="py-1.5 text-right font-bold text-neutral-900">
                      {withCurrency(financialMetrics.amountDue)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Amount collected</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.amountCollected)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">- Amount due</td>
                    <td className="py-1.5 text-right font-semibold text-red-600">
                      {withCurrency(-financialMetrics.amountDue)}
                    </td>
                  </tr>
                  <tr className="border-t border-neutral-300">
                    <td className="py-1.5 font-semibold text-neutral-900">= Rounding</td>
                    <td className="py-1.5 text-right font-bold text-neutral-900">
                      {withCurrency(financialMetrics.rounding)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Amount collected</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.amountCollected)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">- Service charges</td>
                    <td className="py-1.5 text-right font-semibold text-red-600">
                      {withCurrency(-financialMetrics.serviceCharges)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">- Tax collected</td>
                    <td className="py-1.5 text-right font-semibold text-red-600">
                      {withCurrency(-financialMetrics.taxCollected)}
                    </td>
                  </tr>
                  <tr className="border-t border-neutral-300">
                    <td className="py-1.5 font-semibold text-neutral-900">= Net</td>
                    <td className="py-1.5 text-right font-bold text-neutral-900">
                      {withCurrency(financialMetrics.net)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Amount collected</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.amountCollected)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Refunds</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.refunds)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">+ Discounts</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(financialMetrics.itemDiscounts + financialMetrics.subtotalDiscounts)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-neutral-300">
                    <td className="py-1.5 font-semibold text-neutral-900">= Gross</td>
                    <td className="py-1.5 text-right font-bold text-neutral-900">
                      {withCurrency(financialMetrics.gross)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2nd subsection: Deletions & Cancellations */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Deletions & Cancellations</h4>
              <table className="min-w-full text-xs">
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-1.5 text-neutral-700">Refunds</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {withCurrency(deletionMetrics.refunds)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Cancelled orders</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(deletionMetrics.cancelledOrders)}
                    </td>
                  </tr>
                  {Object.entries(deletionMetrics.voidsByReason).map(([reason, data]) => (
                    <tr key={reason}>
                      <td className="py-1.5 text-neutral-700">{reason}</td>
                      <td className="py-1.5 text-right text-neutral-700">
                        {formatNumber(data.count)} - {withCurrency(data.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-300">
                    <td className="py-1.5 font-semibold text-neutral-900">Total deletion</td>
                    <td className="py-1.5 text-right font-bold text-neutral-900">
                      {withCurrency(deletionMetrics.totalDeletion)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3rd subsection: Check Status */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Check Status</h4>
              <table className="min-w-full text-xs">
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-1.5 text-neutral-700">Checks carried over</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(checkStatusMetrics.checksCarriedOver)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Checks begun</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(checkStatusMetrics.checksBegun)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Checks paid</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(checkStatusMetrics.checksPaid)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Checks cancelled</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(checkStatusMetrics.checksCancelled)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Checks merged</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(checkStatusMetrics.checksMerged)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-700">Checks open</td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {formatNumber(checkStatusMetrics.checksOpen)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-neutral-300">
                    <td className="py-1.5 font-semibold text-neutral-900">= Outstanding checks</td>
                    <td className="py-1.5 text-right font-bold text-neutral-900">
                      {formatNumber(checkStatusMetrics.outstandingChecks)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4th subsection: Discount Types & Breakdowns */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Discount Types & Breakdowns</h4>
              <div className="space-y-4">
                {discountTypesBreakdown.discountTypes.length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-neutral-600">Discount Types</h5>
                    <table className="min-w-full text-xs">
                      <tbody className="divide-y divide-neutral-100">
                        {discountTypesBreakdown.discountTypes.map(discount => (
                          <tr key={discount.name}>
                            <td className="py-1 text-neutral-700">{discount.name}</td>
                            <td className="py-1 text-right text-neutral-700">
                              {discount.percent > 0 ? `${formatNumber(discount.percent)}%` : "-"}
                            </td>
                            <td className="py-1 text-right text-neutral-700">{formatNumber(discount.quantity)}</td>
                            <td className="py-1 text-right font-semibold text-neutral-900">
                              {withCurrency(discount.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {Object.keys(discountTypesBreakdown.serviceChargesBreakdown).length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-neutral-600">Service Charges</h5>
                    <table className="min-w-full text-xs">
                      <tbody className="divide-y divide-neutral-100">
                        {Object.entries(discountTypesBreakdown.serviceChargesBreakdown).map(([type, amount]) => (
                          <tr key={type}>
                            <td className="py-1 text-neutral-700">{type}</td>
                            <td className="py-1 text-right font-semibold text-neutral-900">{withCurrency(amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {Object.keys(discountTypesBreakdown.taxesBreakdown).length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-neutral-600">Taxes</h5>
                    <table className="min-w-full text-xs">
                      <tbody className="divide-y divide-neutral-100">
                        {Object.entries(discountTypesBreakdown.taxesBreakdown).map(([type, amount]) => (
                          <tr key={type}>
                            <td className="py-1 text-neutral-700">{type}</td>
                            <td className="py-1 text-right font-semibold text-neutral-900">{withCurrency(amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {Object.keys(discountTypesBreakdown.tipsBreakdown).length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-neutral-600">Tips</h5>
                    <table className="min-w-full text-xs">
                      <tbody className="divide-y divide-neutral-100">
                        {Object.entries(discountTypesBreakdown.tipsBreakdown).map(([type, amount]) => (
                          <tr key={type}>
                            <td className="py-1 text-neutral-700">{type}</td>
                            <td className="py-1 text-right font-semibold text-neutral-900">{withCurrency(amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {Object.keys(discountTypesBreakdown.extrasBreakdown).length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-neutral-600">Order Extras</h5>
                    <table className="min-w-full text-xs">
                      <tbody className="divide-y divide-neutral-100">
                        {Object.entries(discountTypesBreakdown.extrasBreakdown).map(([name, amount]) => (
                          <tr key={name}>
                            <td className="py-1 text-neutral-700">{name}</td>
                            <td className="py-1 text-right font-semibold text-neutral-900">{withCurrency(amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second section: Sale by order type */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Sale by Order Type</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Order Type</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Sale Price w/o Tax</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Taxes</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Amount Due</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Service Charges</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Discounts</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Net</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">% of Total</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Guests</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Avg Guest</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Checks</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Avg Check</th>
                  <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Turn Time (min)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {orderTypeMetrics.map(metrics => (
                  <tr key={metrics.orderType}>
                    <td className="py-3 pl-6 pr-3 text-sm font-medium text-neutral-900">{metrics.orderType}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {withCurrency(metrics.salePriceWithoutTax)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.taxes)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.amountDue)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {withCurrency(metrics.serviceCharges)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.discounts)}</td>
                    <td className="py-3 px-3 text-right text-sm font-semibold text-neutral-900">
                      {withCurrency(metrics.net)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {formatNumber(metrics.percentOfTotal)}%
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(metrics.guests)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {withCurrency(metrics.avgGuest)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(metrics.checks)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.avgCheck)}</td>
                    <td className="py-3 pr-6 text-right text-sm text-neutral-700">{formatNumber(metrics.turnTime)}</td>
                  </tr>
                ))}
                {orderTypeMetrics.length === 0 && (
                  <tr>
                    <td colSpan={13} className="py-6 text-center text-sm text-neutral-500">
                      No order type data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Third section: Sale by day part */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Sale by Day Part</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Day Part</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Sale Price w/o Tax</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Taxes</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Amount Due</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Service Charges</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Discounts</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Net</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">% of Total</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Guests</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Avg Guest</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Checks</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Avg Check</th>
                  <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Turn Time (min)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {dayPartMetrics.map(metrics => (
                  <tr key={metrics.orderType}>
                    <td className="py-3 pl-6 pr-3 text-sm font-medium text-neutral-900">{metrics.orderType}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {withCurrency(metrics.salePriceWithoutTax)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.taxes)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.amountDue)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {withCurrency(metrics.serviceCharges)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.discounts)}</td>
                    <td className="py-3 px-3 text-right text-sm font-semibold text-neutral-900">
                      {withCurrency(metrics.net)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {formatNumber(metrics.percentOfTotal)}%
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(metrics.guests)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">
                      {withCurrency(metrics.avgGuest)}
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(metrics.checks)}</td>
                    <td className="py-3 px-3 text-right text-sm text-neutral-700">{withCurrency(metrics.avgCheck)}</td>
                    <td className="py-3 pr-6 text-right text-sm text-neutral-700">{formatNumber(metrics.turnTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fourth section: Breakdowns with 4 sub-columns */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Breakdowns</h3>
          <div className="grid grid-cols-4 divide-x divide-neutral-200">
            {/* 1st subsection: Categories */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Categories</h4>
              {breakdownMetrics.categories.length > 0 ? (
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="py-1.5 text-left text-xs font-semibold text-neutral-600">Category</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Qty</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {breakdownMetrics.categories.map(category => (
                      <tr key={category.name}>
                        <td className="py-1.5 text-neutral-700">{category.name}</td>
                        <td className="py-1.5 text-right text-neutral-700">{formatNumber(category.quantity)}</td>
                        <td className="py-1.5 text-right font-semibold text-neutral-900">
                          {withCurrency(category.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-xs text-neutral-500">No categories data</div>
              )}
            </div>

            {/* 2nd subsection: Dishes */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Dishes</h4>
              {breakdownMetrics.dishes.length > 0 ? (
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="py-1.5 text-left text-xs font-semibold text-neutral-600">Dish</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Qty</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {breakdownMetrics.dishes.map(dish => (
                      <tr key={dish.name}>
                        <td className="py-1.5 text-neutral-700">{dish.name}</td>
                        <td className="py-1.5 text-right text-neutral-700">{formatNumber(dish.quantity)}</td>
                        <td className="py-1.5 text-right font-semibold text-neutral-900">
                          {withCurrency(dish.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-xs text-neutral-500">No dishes data</div>
              )}
            </div>

            {/* 3rd subsection: Discounts by users */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Discounts by Users</h4>
              {breakdownMetrics.userDiscounts.length > 0 ? (
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="py-1.5 text-left text-xs font-semibold text-neutral-600">User</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Qty</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {breakdownMetrics.userDiscounts.map(userDiscount => (
                      <tr key={userDiscount.name}>
                        <td className="py-1.5 text-neutral-700">{userDiscount.name}</td>
                        <td className="py-1.5 text-right text-neutral-700">
                          {formatNumber(userDiscount.quantity)}
                        </td>
                        <td className="py-1.5 text-right font-semibold text-neutral-900">
                          {withCurrency(userDiscount.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-xs text-neutral-500">No user discounts data</div>
              )}
            </div>

            {/* 4th subsection: Payment types */}
            <div className="p-4">
              <h4 className="mb-3 text-xs font-semibold text-neutral-600">Payment Types</h4>
              {breakdownMetrics.paymentTypes.length > 0 ? (
                <table className="min-w-full text-xs">
                  <thead>
                    <tr>
                      <th className="py-1.5 text-left text-xs font-semibold text-neutral-600">Payment Type</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Qty</th>
                      <th className="py-1.5 text-right text-xs font-semibold text-neutral-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {breakdownMetrics.paymentTypes.map(paymentType => (
                      <tr key={paymentType.name}>
                        <td className="py-1.5 text-neutral-700">{paymentType.name}</td>
                        <td className="py-1.5 text-right text-neutral-700">
                          {formatNumber(paymentType.quantity)}
                        </td>
                        <td className="py-1.5 text-right font-semibold text-neutral-900">
                          {withCurrency(paymentType.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-xs text-neutral-500">No payment types data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ReportsLayout>
  );
};
