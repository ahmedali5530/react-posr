'use strict';

const { formatMoney, normalizeConfig } = require('./receipt-helpers');
const { mapOrderToTemp, mapOrderToFinal, mapOrderToDelivery, mapOrderToRefund } = require('./order-mapping');
const { computeSummary, formatNum } = require('./summary-mapping');

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render bill as HTML (receipt-style) for preview. Mirrors bill-layout.js structure.
 */
function renderBillToHtml(bill, config, opts) {
  const cfg = config || {};
  const sym = cfg.currencySymbol || '$';
  const {
    title = 'Bill',
    address,
    phone,
    notes,
    thankYou,
    showPayments = false,
    showChange = false,
    showDeliveryLine = false,
  } = opts || {};

  const row = (left, right) =>
    `<div class="row"><span>${escapeHtml(left)}</span><span>${escapeHtml(right)}</span></div>`;

  const parts = [];

  // Logo
  if (cfg.logo && String(cfg.logo).trim()) {
    const src = /^data:/.test(cfg.logo) ? cfg.logo : `data:image/png;base64,${cfg.logo}`;
    parts.push(`<div class="logo"><img src="${escapeHtml(src)}" alt="Logo" style="max-width:120px;max-height:60px;" /></div>`);
  }
  if (cfg.showCompanyName && cfg.companyName) {
    parts.push(`<div class="center">${escapeHtml(cfg.companyName)}</div>`);
  }

  // Header
  parts.push(`<div class="title">${escapeHtml(title)}</div>`);
  parts.push(row(`Invoice# ${bill.orderId || ''}`, bill.date || ''));
  parts.push(row(bill.table || '', bill.userName || ''));
  if (address) parts.push(`<div class="row"><span>Address: ${escapeHtml(String(address).slice(0, 40))}</span></div>`);
  if (phone) parts.push(`<div class="row"><span>Phone: ${escapeHtml(String(phone))}</span></div>`);
  parts.push('<hr/>');

  // Items
  (bill.items || []).forEach((it) => {
    const name = (it.name || it.title || '').slice(0, 28);
    const qty = it.qty != null ? it.qty : 1;
    const lineTotal = it.total != null ? Number(it.total) : (it.price || 0) * qty;
    parts.push(row(`${name} x${qty}`, formatMoney(lineTotal, sym)));
  });
  parts.push('<hr/>');

  // Summary
  parts.push(row(`Items (${bill.itemsCount || 0})`, formatMoney(bill.itemsTotal, sym)));
  if (bill.tax != null && Number(bill.tax) !== 0) {
    parts.push(row(`Tax (${bill.taxLabel || 'Tax'})`, formatMoney(bill.tax, sym)));
  }
  if (bill.discount && bill.discountAmount != null && Number(bill.discountAmount) !== 0) {
    parts.push(row('Discount', formatMoney(bill.discountAmount, sym)));
  }
  if (bill.serviceChargeLabel && bill.serviceChargeAmount != null && Number(bill.serviceChargeAmount) !== 0) {
    parts.push(row(bill.serviceChargeLabel, formatMoney(bill.serviceChargeAmount, sym)));
  }
  (bill.extras || []).forEach((e) => {
    parts.push(row(e.name || 'Extra', formatMoney(e.value, sym)));
  });
  if (bill.tipAmount != null && Number(bill.tipAmount) !== 0) {
    parts.push(row(bill.tipLabel || 'Tip', formatMoney(bill.tipAmount, sym)));
  }
  if (showDeliveryLine && bill.deliveryCharges != null && Number(bill.deliveryCharges) !== 0) {
    parts.push(row('Delivery Charges', formatMoney(bill.deliveryCharges, sym)));
  }
  parts.push('<hr/>');

  // Total
  parts.push(`<div class="row bold"><span>Total</span><span>${escapeHtml(formatMoney(bill.total, sym))}</span></div>`);

  if (showPayments && Array.isArray(bill.payments) && bill.payments.length > 0) {
    parts.push('<hr/>');
    bill.payments.forEach((p) => {
      parts.push(row(p.method || 'Payment', formatMoney(p.amount, sym)));
    });
  }
  if (showChange) {
    parts.push('<hr/>');
    parts.push(`<div class="row bold"><span>Change</span><span>${escapeHtml(formatMoney(bill.change, sym))}</span></div>`);
  }

  if (cfg.showVatNumber && cfg.vatNumber) {
    parts.push(`<div class="row">${escapeHtml(cfg.vatName + ': ' + cfg.vatNumber)}</div>`);
  }
  if (notes) {
    parts.push('<hr/>');
    parts.push(`<div class="row"><span>Notes: ${escapeHtml(String(notes).slice(0, 48))}</span></div>`);
  }
  if (thankYou) {
    parts.push(`<div class="center thankyou">${escapeHtml(thankYou)}</div>`);
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt preview</title>
  <style>
    body { margin: 0; padding: 16px; background: #f0f0f0; font-family: 'Courier New', Consolas, monospace; }
    .receipt { width: 280px; margin: 0 auto; padding: 12px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); font-size: 12px; line-height: 1.4; }
    .title, .center { text-align: center; }
    .title { font-weight: bold; margin-bottom: 8px; }
    .row { display: flex; justify-content: space-between; gap: 12px; }
    .row span:last-child { text-align: right; }
    .bold { font-weight: bold; }
    .thankyou { margin-top: 8px; }
    hr { border: none; border-top: 1px dashed #333; margin: 6px 0; }
    .logo { text-align: center; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="receipt">${parts.join('\n  ')}</div>
</body>
</html>`;
}

function pct(x, of) {
  const n = Number(of);
  return Number.isFinite(n) && n > 0 ? (Number(x) / n * 100) : 0;
}

/**
 * Render summary as HTML. Matches Summary (summary.tsx).
 * data: { orders: { data: Order[] }, date: string } – same props as Summary.
 */
function renderSummaryToHtml(data, config) {
  const cfg = normalizeConfig(config || {});
  const sym = cfg.currencySymbol || '$';
  const s = computeSummary(data || {});
  const row = (a, b) => `<div class="row"><span>${escapeHtml(a)}</span><span>${escapeHtml(b)}</span></div>`;
  const sub = (t) => `<div class="sub">${escapeHtml(t)}</div>`;
  const sect = (t) => `<div class="sect">${escapeHtml(t)}</div>`;

  const parts = [];
  if (cfg.showCompanyName && cfg.companyName) {
    parts.push(`<div class="center">${escapeHtml(cfg.companyName)}</div>`);
  }
  parts.push(`<div class="title">Summary of ${escapeHtml(s.date)}</div>`);
  parts.push('<hr/>');
  parts.push(row('Exclusive amount', formatMoney(s.exclusive, sym)));
  parts.push(row('G sales', formatMoney(s.gSales, sym)));
  parts.push(sub('Items total (before tax)'));
  parts.push(row('Gross', formatMoney(s.gross, sym)));
  parts.push(sub('Amount collected + Refunds + Discounts'));
  parts.push(row('Refunds', formatMoney(s.refunds, sym)));
  parts.push(row('Service charges', formatMoney(s.serviceCharges, sym)));
  parts.push(row('Discounts', formatMoney(s.discounts, sym)));
  parts.push(row('Taxes', formatMoney(s.taxes, sym)));
  parts.push(row('Net', formatMoney(s.net, sym)));
  parts.push(sub('Amount collected - Service charges - Taxes'));
  parts.push(row('Amount due', formatMoney(s.amountDue, sym)));
  parts.push(sub('Items total + Taxes + Service + Extras - Discounts'));
  parts.push(row('Amount collected', formatMoney(s.amountCollected, sym)));
  parts.push(row('Extras', formatMoney(s.totalExtras, sym)));
  parts.push(row('Rounding', formatMoney(s.rounding, sym)));
  parts.push(sub('Amount collected - Amount due'));
  parts.push(row('Voids', formatMoney(s.voids, sym)));
  parts.push('<hr/>');
  parts.push(sect('Tips'));
  parts.push(row('Total Tips', formatMoney(s.tips, sym)));
  parts.push('<hr/>');
  parts.push(row('Covers', formatNum(s.covers)));
  parts.push(row('Average cover', formatMoney(s.averageCover, sym)));
  parts.push(row('Orders/Checks', formatNum(s.ordersCount)));
  parts.push(row('Average order/check', formatMoney(s.averageOrder, sym)));
  parts.push('<hr/>');
  parts.push(sect('Categories'));
  Object.keys(s.categories || {}).forEach((k) => {
    const c = s.categories[k];
    parts.push(`<div class="row4"><span>${escapeHtml(k)}</span><span>${formatNum(c.quantity)}</span><span>${formatMoney(c.total, sym)}</span><span>${formatNum(pct(c.total, s.exclusive))}%</span></div>`);
  });
  parts.push('<hr/>');
  parts.push(sect('Dishes'));
  Object.keys(s.dishes || {}).forEach((k) => {
    const d = s.dishes[k];
    parts.push(`<div class="row4"><span>${escapeHtml(k)}</span><span>${formatNum(d.quantity)}</span><span>${formatMoney(d.total, sym)}</span><span>${formatNum(pct(d.total, s.exclusive))}%</span></div>`);
  });
  parts.push('<hr/>');
  parts.push(sect('Payment types'));
  Object.keys(s.paymentTypes || {}).forEach((k) => {
    const a = s.paymentTypes[k];
    parts.push(row(k, formatMoney(a, sym) + '  ' + formatNum(pct(a, s.amountDue)) + '%'));
  });
  parts.push('<hr/>');
  parts.push(sect('Taxes'));
  Object.keys(s.taxesList || {}).forEach((k) => {
    const a = s.taxesList[k];
    parts.push(row(k + '%', formatMoney(a, sym) + '  ' + formatNum(pct(a, s.taxes)) + '%'));
  });
  parts.push('<hr/>');
  parts.push(sect('Discounts'));
  Object.keys(s.discountsList || {}).forEach((k) => {
    const a = s.discountsList[k];
    parts.push(row(k, formatMoney(a, sym) + '  ' + formatNum(pct(a, s.discounts)) + '%'));
  });
  parts.push('<hr/>');
  parts.push(sect('Extras'));
  Object.keys(s.extras || {}).forEach((k) => {
    parts.push(row(k, formatMoney(s.extras[k], sym)));
  });
  if (cfg.showVatNumber && cfg.vatNumber) {
    parts.push('<hr/>');
    parts.push(`<div class="row">${escapeHtml(cfg.vatName + ': ' + cfg.vatNumber)}</div>`);
  }
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Summary preview</title>
  <style>
    body { margin: 0; padding: 16px; background: #f0f0f0; font-family: 'Courier New', Consolas, monospace; }
    .receipt { max-width: 420px; margin: 0 auto; padding: 12px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); font-size: 12px; line-height: 1.4; }
    .title, .center { text-align: center; }
    .title { font-weight: bold; margin-bottom: 8px; font-size: 1.1rem; }
    .row { display: flex; justify-content: space-between; gap: 12px; }
    .row span:last-child { text-align: right; }
    .row4 { display: flex; justify-content: space-between; gap: 8px; }
    .row4 span:nth-child(1) { flex: 1.4; text-align: left; }
    .row4 span:nth-child(2) { width: 48px; text-align: right; }
    .row4 span:nth-child(3) { width: 72px; text-align: right; }
    .row4 span:nth-child(4) { width: 44px; text-align: right; }
    .sub { font-size: 0.75rem; color: #6b7280; margin: -2px 0 4px 0; }
    .sect { font-weight: bold; text-align: center; margin: 8px 0 4px 0; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 6px 0; }
  </style>
</head>
<body>
  <div class="receipt">${parts.join('\n  ')}</div>
</body>
</html>`;
}

/**
 * Render kitchen ticket as HTML.
 */
function renderKitchenToHtml(data, config) {
  const cfg = normalizeConfig(config || {});
  const { mapOrderToKitchen } = require('./order-mapping');
  const order = data && data.order;
  if (!order) return `<html><body><p>data.order required for kitchen preview</p></body></html>`;
  const k = mapOrderToKitchen(order);
  const parts = [];
  parts.push(`<div class="title">*** KITCHEN ***</div>`);
  parts.push(`<div class="row"><span>Order</span><span>${escapeHtml(k.orderId)}</span></div>`);
  parts.push(`<div class="row"><span>Table</span><span>${escapeHtml(k.table)}</span></div>`);
  parts.push(`<div class="row"><span>Time</span><span>${escapeHtml(k.createdAt)}</span></div>`);
  if (k.priority) parts.push(`<div class="row bold"><span>PRIORITY</span><span>${escapeHtml(k.priority)}</span></div>`);
  parts.push('<hr/>');
  (k.items || []).forEach((it) => {
    const name = (it.name || '').slice(0, 28);
    const qty = it.qty != null ? it.qty : 1;
    parts.push(`<div class="row"><span>${escapeHtml(name)} x${qty}</span></div>`);
    if (it.notes) parts.push(`<div class="indent">>> ${escapeHtml((it.notes || '').slice(0, 26))}</div>`);
  });
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kitchen preview</title>
  <style>
    body { margin: 0; padding: 16px; background: #f0f0f0; font-family: 'Courier New', Consolas, monospace; }
    .receipt { width: 280px; margin: 0 auto; padding: 12px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); font-size: 12px; line-height: 1.4; }
    .title { text-align: center; font-weight: bold; margin-bottom: 8px; }
    .row { display: flex; justify-content: space-between; gap: 12px; }
    .indent { padding-left: 8px; }
    hr { border: none; border-top: 1px dashed #333; margin: 6px 0; }
  </style>
</head>
<body>
  <div class="receipt">${parts.join('\n  ')}</div>
</body>
</html>`;
}

/**
 * Render refund receipt as HTML. Matches refund.bill.tsx and refund-print.js.
 * data: { order: refundOrder, originalOrder }
 */
function renderRefundToHtml(data, config) {
  const cfg = normalizeConfig(config || {});
  const sym = cfg.currencySymbol || '$';
  const refundOrder = data && data.order;
  const originalOrder = data && data.originalOrder;
  if (!refundOrder) return `<html><body><p>data.order (refund order) is required for refund preview</p></body></html>`;
  const bill = mapOrderToRefund(refundOrder, originalOrder);
  const row = (left, right) =>
    `<div class="row"><span>${escapeHtml(left)}</span><span>${escapeHtml(right)}</span></div>`;

  const parts = [];
  if (cfg.logo && String(cfg.logo).trim()) {
    const src = /^data:/.test(cfg.logo) ? cfg.logo : `data:image/png;base64,${cfg.logo}`;
    parts.push(`<div class="logo"><img src="${escapeHtml(src)}" alt="Logo" style="max-width:120px;max-height:60px;" /></div>`);
  }
  if (cfg.showCompanyName && cfg.companyName) {
    parts.push(`<div class="center">${escapeHtml(cfg.companyName)}</div>`);
  }
  parts.push(`<div class="title">REFUND RECEIPT</div>`);
  parts.push(row(`Original Invoice# ${bill.originalOrderId || ''}`, ''));
  parts.push(row(`Refund Date: ${bill.refundDate || ''}`, ''));
  parts.push('<hr/>');
  (bill.items || []).forEach((it) => {
    const name = (it.name || it.title || '').slice(0, 28);
    const qty = it.qty != null ? it.qty : 1;
    const lineTotal = it.total != null ? Number(it.total) : (it.price || 0) * qty;
    parts.push(row(`${name} x${qty}`, formatMoney(lineTotal, sym)));
  });
  parts.push('<hr/>');
  parts.push(row(`Items (${bill.itemsCount || 0})`, formatMoney(bill.itemsTotal, sym)));
  if (bill.tax != null && Number(bill.tax) !== 0) {
    parts.push(row(`Tax (${bill.taxLabel || 'Tax'})`, formatMoney(bill.tax, sym)));
  }
  if (bill.discount && bill.discountAmount != null && Number(bill.discountAmount) !== 0) {
    parts.push(row('Discount', formatMoney(bill.discountAmount, sym)));
  }
  if (bill.serviceChargeLabel && bill.serviceChargeAmount != null && Number(bill.serviceChargeAmount) !== 0) {
    parts.push(row(bill.serviceChargeLabel, formatMoney(bill.serviceChargeAmount, sym)));
  }
  (bill.extras || []).forEach((e) => {
    parts.push(row(e.name || 'Extra', formatMoney(e.value, sym)));
  });
  if (bill.tipAmount != null && Number(bill.tipAmount) !== 0) {
    parts.push(row(bill.tipLabel || 'Tip', formatMoney(bill.tipAmount, sym)));
  }
  parts.push('<hr/>');
  parts.push(`<div class="row bold"><span>Refund Total</span><span>${escapeHtml(formatMoney(bill.total, sym))}</span></div>`);
  if (cfg.showVatNumber && cfg.vatNumber) {
    parts.push(`<div class="row">${escapeHtml(cfg.vatName + ': ' + cfg.vatNumber)}</div>`);
  }
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Refund preview</title>
  <style>
    body { margin: 0; padding: 16px; background: #f0f0f0; font-family: 'Courier New', Consolas, monospace; }
    .receipt { width: 280px; margin: 0 auto; padding: 12px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); font-size: 12px; line-height: 1.4; }
    .title, .center { text-align: center; }
    .title { font-weight: bold; margin-bottom: 8px; }
    .row { display: flex; justify-content: space-between; gap: 12px; }
    .row span:last-child { text-align: right; }
    .bold { font-weight: bold; }
    hr { border: none; border-top: 1px dashed #333; margin: 6px 0; }
    .logo { text-align: center; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="receipt">${parts.join('\n  ')}</div>
</body>
</html>`;
}

/**
 * Generate HTML preview for the given print type, data, and config.
 * @param {string} printType - temp | final | delivery | kitchen | summary | refund
 * @param {Object} data - { order?, originalOrder?, printType?, duplicate?, ... }
 * @param {Object} config - printer config
 * @returns {string} HTML
 */
function renderPreview(printType, data, config) {
  const cfg = normalizeConfig(config || {});
  const t = (printType || (data && data.printType) || 'final').toLowerCase();

  if (t === 'temp') {
    const order = data && data.order;
    if (!order) throw new Error('data.order is required for temp preview');
    const bill = mapOrderToTemp(order);
    return renderBillToHtml(bill, cfg, {
      title: bill.title,
      notes: bill.note || undefined,
      showPayments: false,
      showChange: false,
      showDeliveryLine: false,
    });
  }

  if (t === 'final') {
    const order = data && data.order;
    if (!order) throw new Error('data.order is required for final preview');
    const bill = mapOrderToFinal(order, { duplicate: !!data.duplicate });
    return renderBillToHtml(bill, cfg, {
      title: bill.title,
      thankYou: bill.thankYou,
      showPayments: true,
      showChange: true,
      showDeliveryLine: false,
    });
  }

  if (t === 'delivery') {
    const order = data && data.order;
    if (!order) throw new Error('data.order is required for delivery preview');
    const bill = mapOrderToDelivery(order);
    return renderBillToHtml(bill, cfg, {
      title: bill.title,
      address: bill.address,
      phone: bill.phone,
      notes: bill.notes || undefined,
      showPayments: true,
      showChange: true,
      showDeliveryLine: true,
    });
  }

  if (t === 'kitchen') {
    return renderKitchenToHtml(data, config);
  }

  if (t === 'summary') {
    return renderSummaryToHtml(data, config);
  }

  if (t === 'refund') {
    return renderRefundToHtml(data, config);
  }

  throw new Error(`Unknown printType: ${printType}. Use: temp, final, delivery, kitchen, summary, refund`);
}

module.exports = { renderPreview, renderBillToHtml, renderSummaryToHtml, renderKitchenToHtml, renderRefundToHtml };
