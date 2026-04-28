import {useMemo, type ReactNode} from 'react';
import {Order, OrderStatus} from '@/api/model/order.ts';
import {formatNumber, withCurrency} from '@/lib/utils.ts';
import {getOrderFilteredItems} from '@/lib/order.ts';
import {calculateOrderItemPrice} from '@/lib/cart.ts';

interface Props {
  orders: Order[];
  date: string;
}

const safeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function Row({label, value, hint}: {label: string; value: string; hint?: string}) {
  return (
    <div className="border-b border-neutral-200 py-2 last:border-b-0">
      <div className="flex justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="tabular-nums font-medium">{value}</span>
      </div>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      {subtitle ? <p className="mb-2 text-xs text-neutral-600">{subtitle}</p> : null}
      <div>{children}</div>
    </section>
  );
}

/** Active lines + extras only (no tax, service, tips); voided / refunded / suspended lines excluded. */
function useDailySalesFigures(orders: Order[] | undefined) {
  return useMemo(() => {
    const list = orders ?? [];

    const grossSales = list.reduce((sum, order) => {
      const items = (getOrderFilteredItems(order) ?? []).reduce(
        (s, item) => s + safeNumber(calculateOrderItemPrice(item)),
        0,
      );
      const extras = (order.extras ?? []).reduce((s, extra) => s + safeNumber(extra.value), 0);
      return sum + items + extras;
    }, 0);

    const itemDiscounts = list.reduce((sum, order) => {
      return (
        sum +
        safeNumber(
          order.items?.reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0) ?? 0,
        )
      );
    }, 0);

    const subtotalDiscounts = list.reduce((sum, order) => {
      const lineDiscounts = safeNumber(
        order.items?.reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0) ?? 0,
      );
      const orderDiscount = safeNumber(order.discount_amount);
      return sum + Math.max(0, orderDiscount - lineDiscounts);
    }, 0);

    const couponDiscounts = list.reduce((sum, order) => sum + safeNumber(order.coupon?.discount), 0);

    const discounts = safeNumber(itemDiscounts + subtotalDiscounts + couponDiscounts);

    const netSales = safeNumber(grossSales - discounts);

    const serviceCharges = list.reduce((sum, order) => sum + safeNumber(order.service_charge_amount), 0);
    const taxCollected = list.reduce((sum, order) => sum + safeNumber(order.tax_amount), 0);

    const totalRevenue = safeNumber(netSales + serviceCharges + taxCollected);

    const tips = list.reduce((sum, order) => sum + safeNumber(order.tip_amount), 0);

    const grandTotalDue = safeNumber(totalRevenue + tips);

    const amountCollected = list.reduce((sum, order) => {
      return (
        sum +
        safeNumber(order.payments?.reduce((paySum, p) => paySum + safeNumber(p?.amount), 0) ?? 0)
      );
    }, 0);

    const changeGiven = safeNumber(amountCollected - grandTotalDue);

    const refunds = list.reduce((sum, order) => {
      if (order.status === OrderStatus.Cancelled) {
        return (
          sum +
          safeNumber(
            order.payments?.reduce((paySum, payment) => {
              const amount = safeNumber(payment?.amount);
              return paySum + Math.abs(Math.min(0, amount));
            }, 0) ?? 0,
          )
        );
      }
      return (
        sum +
        safeNumber(
          order.payments?.reduce((paySum, payment) => {
            const amount = safeNumber(payment?.amount);
            return paySum + (amount < 0 ? Math.abs(amount) : 0);
          }, 0) ?? 0,
        )
      );
    }, 0);

    const voids = list.reduce((sum, order) => {
      const allItems = order.items ?? [];
      const filtered = getOrderFilteredItems(order);
      const voidedItems = allItems.filter(item => !filtered.some(f => f.id === item.id));
      return (
        sum +
        voidedItems.reduce((itemSum, item) => itemSum + safeNumber(calculateOrderItemPrice(item)), 0)
      );
    }, 0);

    const covers = list.reduce((sum, order) => sum + safeNumber(order.covers), 0);
    const averageSpend = covers > 0 ? netSales / covers : 0;

    return {
      grossSales,
      discounts,
      netSales,
      serviceCharges,
      taxCollected,
      totalRevenue,
      tips,
      grandTotalDue,
      amountCollected,
      changeGiven,
      refunds,
      voids,
      covers,
      averageSpend,
    };
  }, [orders]);
}

export function DailySalesSummaryReport({orders, date}: Props) {
  const f = useDailySalesFigures(orders);

  return (
    <div className="mb-6 select-none">
      <div className="mb-3 text-center text-lg font-semibold text-neutral-900">
        Daily sales summary — {date}
      </div>

      <Section
        title="1. Sales revenue"
      >
        <Row
          label="Gross sales"
          value={withCurrency(f.grossSales)}
          hint="Sum of menu prices for active items plus extras (voided lines excluded)."
        />
        <Row
          label="(−) Discounts"
          value={withCurrency(f.discounts)}
          hint="Line, order, and coupon reductions."
        />
        <Row
          label="Net sales"
          value={withCurrency(f.netSales)}
          hint="Gross sales − discounts."
        />
      </Section>

      <Section
        title="2. Surcharges and taxes"
        subtitle="Collected surcharges and tax (from orders; typically calculated on net after discount)."
      >
        <Row
          label="Service charges"
          value={withCurrency(f.serviceCharges)}
          hint="Amount on orders; based on net after discount"
        />
        <Row
          label="Taxes"
          value={withCurrency(f.taxCollected)}
          hint="Government tax as recorded per order."
        />
        <div className="border-b border-neutral-300 py-2">
          <div className="flex justify-between gap-3 text-sm font-bold">
            <span>Total revenue</span>
            <span className="tabular-nums">{withCurrency(f.totalRevenue)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">Net sales + service charges + taxes (before tips).</p>
        </div>
      </Section>

      <Section title="3. Settlement and cashier" subtitle="Cash drawer view.">
        <Row
          label="Tips"
          value={withCurrency(f.tips)}
          hint="From order tip fields / over-total (not included in gross sales)."
        />
        <div className="border-b border-neutral-200 py-2">
          <div className="flex justify-between gap-3 text-sm font-bold">
            <span>Grand total (due)</span>
            <span className="tabular-nums">{withCurrency(f.grandTotalDue)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">Total revenue + tips.</p>
        </div>
        <Row
          label="Amount collected"
          value={withCurrency(f.amountCollected)}
          hint="Sum of payment amounts (cash, card, digital, etc.)."
        />
        <Row
          label="Change / variance"
          value={withCurrency(f.changeGiven)}
          hint="Amount collected − grand total."
        />
      </Section>

      <Section title="4. Operational controls" subtitle="Audit signals (voids separate from gross sales).">
        <Row label="Voids" value={withCurrency(f.voids)} hint="Value of lines removed after ring (not in gross sales above)." />
        <Row label="Refunds" value={withCurrency(f.refunds)} hint="Returns from negative payments or cancelled checks." />
        <Row label="Covers" value={formatNumber(f.covers)} hint="Guest count (pax)." />
        <Row
          label="Average spend"
          value={withCurrency(f.averageSpend)}
          hint="Net sales ÷ covers."
        />
      </Section>

      <p className="text-xs leading-relaxed text-neutral-500">
        Sequence: gross sales → discounts → net sales → service charges → taxes → tips → grand total →
        collected.
      </p>
    </div>
  );
}
