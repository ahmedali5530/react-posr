import {useEffect, useMemo, useRef, useState} from "react";
import {ReportsLayout} from "@/screens/partials/reports.layout.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {OrderVoid} from "@/api/model/order_void.ts";
import {formatNumber, withCurrency} from "@/lib/utils.ts";

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
  reasonIds: string[];
  managerIds: string[];
  cashierIds: string[];
  menuItemIds: string[];
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
    reasonIds: parseMulti('reasons'),
    managerIds: parseMulti('managers'),
    cashierIds: parseMulti('cashiers'),
    menuItemIds: parseMulti('menu_items'),
  };
};

export const VoidsReport = () => {
  const db = useDB();
  const queryRef = useRef(db.query);
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

        const conditions: string[] = [];
        const params: Record<string, string | string[]> = {};

        if (filters.startDate) {
          conditions.push(`time::format(created_at, "%Y-%m-%d") >= $startDate`);
          params.startDate = filters.startDate;
        }

        if (filters.endDate) {
          conditions.push(`time::format(created_at, "%Y-%m-%d") <= $endDate`);
          params.endDate = filters.endDate;
        }

        const query = `
          SELECT * FROM ${Tables.order_voids}
          ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
          order by created_at ASC
          FETCH deleted_by, order, order.cashier, order_item, order_item.item
        `;

        const result: any = await queryRef.current(query, params);
        let voids = (result?.[0] ?? []) as OrderVoid[];

        // Apply client-side filters
        if (filters.reasonIds.length > 0) {
          voids = voids.filter(voidItem => 
            filters.reasonIds.includes(voidItem.reason)
          );
        }

        if (filters.managerIds.length > 0) {
          voids = voids.filter(voidItem => {
            const managerId = recordToString(voidItem.deleted_by?.id ?? voidItem.deleted_by);
            return filters.managerIds.includes(managerId);
          });
        }

        if (filters.cashierIds.length > 0) {
          voids = voids.filter(voidItem => {
            const cashierId = recordToString(voidItem.order?.cashier?.id ?? voidItem.order?.cashier);
            return filters.cashierIds.includes(cashierId);
          });
        }

        if (filters.menuItemIds.length > 0) {
          voids = voids.filter(voidItem => {
            const menuItemId = recordToString(voidItem.order_item?.item?.id ?? voidItem.order_item?.item);
            return filters.menuItemIds.includes(menuItemId);
          });
        }

        setOrderVoids(voids);
      } catch (err) {
        console.error('Failed to load voids report:', err);
        setError(err instanceof Error ? err.message : 'Unable to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.startDate, filters.endDate, filters.reasonIds, filters.managerIds, filters.cashierIds, filters.menuItemIds]);

  // Summary: Voids by reason
  const voidsByReason = useMemo(() => {
    const map = new Map<string, {count: number; quantity: number; amount: number}>();
    
    orderVoids.forEach(voidItem => {
      const reason = voidItem.reason || 'Unknown';
      const quantity = safeNumber(voidItem.quantity);
      const price = safeNumber(voidItem.order_item?.price || 0);
      const amount = price * quantity;
      
      const existing = map.get(reason) || {count: 0, quantity: 0, amount: 0};
      existing.count += 1;
      existing.quantity = safeNumber(existing.quantity + quantity);
      existing.amount = safeNumber(existing.amount + amount);
      map.set(reason, existing);
    });
    
    return Array.from(map.entries())
      .map(([reason, data]) => ({reason, ...data}))
      .sort((a, b) => b.count - a.count);
  }, [orderVoids]);

  // Summary: Voids by managers
  const voidsByManager = useMemo(() => {
    const map = new Map<string, {count: number; quantity: number; amount: number}>();
    
    orderVoids.forEach(voidItem => {
      const managerName = voidItem.deleted_by 
        ? `${voidItem.deleted_by.first_name ?? ''} ${voidItem.deleted_by.last_name ?? ''}`.trim() || voidItem.deleted_by.login || 'Unknown'
        : 'Unknown';
      const quantity = safeNumber(voidItem.quantity);
      const price = safeNumber(voidItem.order_item?.price || 0);
      const amount = price * quantity;
      
      const existing = map.get(managerName) || {count: 0, quantity: 0, amount: 0};
      existing.count += 1;
      existing.quantity = safeNumber(existing.quantity + quantity);
      existing.amount = safeNumber(existing.amount + amount);
      map.set(managerName, existing);
    });
    
    return Array.from(map.entries())
      .map(([manager, data]) => ({manager, ...data}))
      .sort((a, b) => b.count - a.count);
  }, [orderVoids]);

  // Summary: Voids by menu items
  const voidsByMenuItem = useMemo(() => {
    const map = new Map<string, {count: number; quantity: number; amount: number}>();
    
    orderVoids.forEach(voidItem => {
      const menuItemName = voidItem.order_item?.item?.name || 'Unknown';
      const quantity = safeNumber(voidItem.quantity);
      const price = safeNumber(voidItem.order_item?.price || 0);
      const amount = price * quantity;
      
      const existing = map.get(menuItemName) || {count: 0, quantity: 0, amount: 0};
      existing.count += 1;
      existing.quantity = safeNumber(existing.quantity + quantity);
      existing.amount = safeNumber(existing.amount + amount);
      map.set(menuItemName, existing);
    });
    
    return Array.from(map.entries())
      .map(([menuItem, data]) => ({menuItem, ...data}))
      .sort((a, b) => b.count - a.count);
  }, [orderVoids]);

  if (loading) {
    return (
      <ReportsLayout title="Voids summary" subtitle={subtitle}>
        <div className="py-12 text-center text-neutral-500">Loading voids report…</div>
      </ReportsLayout>
    );
  }

  if (error) {
    return (
      <ReportsLayout title="Voids summary" subtitle={subtitle}>
        <div className="py-12 text-center text-red-600">Failed to load report: {error}</div>
      </ReportsLayout>
    );
  }

  return (
    <ReportsLayout
      title="Voids summary"
      subtitle={subtitle}
    >
      <div className="space-y-8">
        {/* Summary sections */}
        <div className="grid grid-cols-3 gap-4">
          {/* Voids by Reason */}
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Voids by Reason</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Reason</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Count</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Quantity</th>
                    <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {voidsByReason.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-neutral-500">
                        No voids by reason
                      </td>
                    </tr>
                  ) : (
                    voidsByReason.map((item) => (
                      <tr key={item.reason}>
                        <td className="py-3 pl-6 pr-3 text-sm font-medium text-neutral-900">{item.reason}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(item.count)}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(item.quantity)}</td>
                        <td className="py-3 pr-6 text-right text-sm font-semibold text-neutral-900">
                          {withCurrency(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Voids by Managers */}
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Voids by Managers</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Manager</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Count</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Quantity</th>
                    <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {voidsByManager.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-neutral-500">
                        No voids by manager
                      </td>
                    </tr>
                  ) : (
                    voidsByManager.map((item) => (
                      <tr key={item.manager}>
                        <td className="py-3 pl-6 pr-3 text-sm font-medium text-neutral-900">{item.manager}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(item.count)}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(item.quantity)}</td>
                        <td className="py-3 pr-6 text-right text-sm font-semibold text-neutral-900">
                          {withCurrency(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Voids by Menu Items */}
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Voids by Menu Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Menu Item</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Count</th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Quantity</th>
                    <th className="py-3 pr-6 text-right text-xs font-semibold text-neutral-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {voidsByMenuItem.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-neutral-500">
                        No voids by menu item
                      </td>
                    </tr>
                  ) : (
                    voidsByMenuItem.map((item) => (
                      <tr key={item.menuItem}>
                        <td className="py-3 pl-6 pr-3 text-sm font-medium text-neutral-900">{item.menuItem}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(item.count)}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(item.quantity)}</td>
                        <td className="py-3 pr-6 text-right text-sm font-semibold text-neutral-900">
                          {withCurrency(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed voids table */}
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <h3 className="bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-700">Voids Detail</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-neutral-700">Date</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Time</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Reason</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Menu Item</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Quantity</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Manager</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-700">Cashier</th>
                  <th className="py-3 px-3 text-right text-xs font-semibold text-neutral-700">Order #</th>
                  <th className="py-3 pr-6 text-left text-xs font-semibold text-neutral-700">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {orderVoids.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-sm text-neutral-500">
                      No voids found for the selected filters
                    </td>
                  </tr>
                ) : (
                  orderVoids.map((voidItem) => {
                    const date = new Date(voidItem.created_at);
                    const dateStr = date.toLocaleDateString();
                    const timeStr = date.toLocaleTimeString();
                    const managerName = voidItem.deleted_by 
                      ? `${voidItem.deleted_by.first_name ?? ''} ${voidItem.deleted_by.last_name ?? ''}`.trim() || voidItem.deleted_by.login || 'Unknown'
                      : 'Unknown';
                    const cashierName = voidItem.order?.cashier
                      ? `${voidItem.order.cashier.first_name ?? ''} ${voidItem.order.cashier.last_name ?? ''}`.trim() || voidItem.order.cashier.login || 'Unknown'
                      : 'N/A';
                    const menuItemName = voidItem.order_item?.item?.name || 'Unknown';
                    const orderNumber = voidItem.order?.invoice_number || 'N/A';

                    return (
                      <tr key={voidItem.id}>
                        <td className="py-3 pl-6 pr-3 text-sm text-neutral-900">{dateStr}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{timeStr}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{voidItem.reason}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{menuItemName}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{formatNumber(voidItem.quantity)}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{managerName}</td>
                        <td className="py-3 px-3 text-sm text-neutral-700">{cashierName}</td>
                        <td className="py-3 px-3 text-right text-sm text-neutral-700">{orderNumber}</td>
                        <td className="py-3 pr-6 text-sm text-neutral-700">{voidItem.comments || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {orderVoids.length > 0 && (
                <tfoot className="bg-neutral-50">
                  <tr>
                    <td colSpan={4} className="py-3 pl-6 pr-3 text-sm font-semibold text-neutral-900">Total</td>
                    <td className="py-3 px-3 text-right text-sm font-bold text-neutral-900">
                      {formatNumber(orderVoids.reduce((sum, v) => sum + safeNumber(v.quantity), 0))}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </ReportsLayout>
  );
}