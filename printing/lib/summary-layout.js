'use strict';

const { printLineLeftRight, formatMoney, printVatLine, feedBottomMargin } = require('./receipt-helpers');
const { computeSummary, formatNum } = require('./summary-mapping');

function pct(x, of) {
  const n = Number(of);
  return Number.isFinite(n) && n > 0 ? (Number(x) / n * 100) : 0;
}

/**
 * Print summary layout matching Summary (summary.tsx). Expects data: { orders: Order[], date }.
 */
function printSummaryLayout(printer, data, config) {
  const cfg = config || {};
  const sym = cfg.currencySymbol || '$';
  const s = computeSummary(data);

  const line = (left, right) => printLineLeftRight(printer, left, right);
  const sect = (title) => {
    printer.drawLine();
    printer.align('ct').style('bu').text(title).style('normal');
  };

  printer.align('ct').style('bu').text(`Summary of ${s.date}`).style('normal');
  printer.drawLine();

  line('Exclusive amount', formatMoney(s.exclusive, sym));
  line('G sales', formatMoney(s.gSales, sym));
  // printer.text('  Items total (before tax)');
  line('Gross', formatMoney(s.gross, sym));
  // printer.text('  Amount collected + Refunds + Discounts');
  line('Refunds', formatMoney(s.refunds, sym));
  line('Service charges', formatMoney(s.serviceCharges, sym));
  line('Discounts', formatMoney(s.discounts, sym));
  line('Taxes', formatMoney(s.taxes, sym));
  line('Net', formatMoney(s.net, sym));
  // printer.text('  Amount collected - Service charges - Taxes');
  line('Amount due', formatMoney(s.amountDue, sym));
  // printer.text('  Items total + Taxes + Service + Extras - Discounts');
  line('Amount collected', formatMoney(s.amountCollected, sym));
  line('Extras', formatMoney(s.totalExtras, sym));
  line('Rounding', formatMoney(s.rounding, sym));
  // printer.text('  Amount collected - Amount due');
  line('Voids', formatMoney(s.voids, sym));

  sect('Tips');
  line('Total Tips', formatMoney(s.tips, sym));
  printer.drawLine();
  line('Covers', formatNum(s.covers));
  line('Average cover', formatMoney(s.averageCover, sym));
  line('Orders/Checks', formatNum(s.ordersCount));
  line('Average order/check', formatMoney(s.averageOrder, sym));

  sect('Categories');
  Object.keys(s.categories || {}).forEach((k) => {
    const c = s.categories[k];
    const p = formatNum(pct(c.total, s.exclusive)) + '%';
    const label = String(k).slice(0, 20) + ' x' + formatNum(c.quantity);
    printer.tableCustom(
      [
        { text: label, align: 'LEFT', width: 0.4 },
        { text: formatMoney(c.total, sym), align: 'RIGHT', width: 0.3 },
        { text: p, align: 'RIGHT', width: 0.3 },
      ],
      { size: [1, 1] }
    );
  });

  sect('Dishes');
  Object.keys(s.dishes || {}).forEach((k) => {
    const d = s.dishes[k];
    const p = formatNum(pct(d.total, s.exclusive)) + '%';
    const label = String(k).slice(0, 20) + ' x' + formatNum(d.quantity);
    printer.tableCustom(
      [
        { text: label, align: 'LEFT', width: 0.4 },
        { text: formatMoney(d.total, sym), align: 'RIGHT', width: 0.3 },
        { text: p, align: 'RIGHT', width: 0.3 },
      ],
      { size: [1, 1] }
    );
  });

  sect('Payment types');
  Object.keys(s.paymentTypes || {}).forEach((k) => {
    const a = s.paymentTypes[k];
    const p = formatNum(pct(a, s.amountDue)) + '%';
    line(k, formatMoney(a, sym) + '  ' + p);
  });

  sect('Taxes');
  Object.keys(s.taxesList || {}).forEach((k) => {
    const a = s.taxesList[k];
    const p = formatNum(pct(a, s.taxes)) + '%';
    line(k + '%', formatMoney(a, sym) + '  ' + p);
  });

  sect('Discounts');
  Object.keys(s.discountsList || {}).forEach((k) => {
    const a = s.discountsList[k];
    const p = formatNum(pct(a, s.discounts)) + '%';
    line(k, formatMoney(a, sym) + '  ' + p);
  });

  sect('Extras');
  Object.keys(s.extras || {}).forEach((k) => {
    line(k, formatMoney(s.extras[k], sym));
  });

  printVatLine(printer, cfg);
  feedBottomMargin(printer, cfg);
  printer.feed(2).cut();
}

module.exports = { printSummaryLayout, computeSummary };
