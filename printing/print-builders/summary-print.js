'use strict';

const { normalizeConfig, printReceiptHeader } = require('../lib/receipt-helpers');
const { printSummaryLayout } = require('../lib/summary-layout');

/**
 * Summary print – end of day summary. Matches Summary (summary.tsx).
 * Expects data: { orders: { data: Order[] }, date: string } – same props as Summary.
 */
function build(printer, data = {}, config = {}) {
  const orders = data && data.orders;
  if (!orders || !Array.isArray(orders.data)) {
    return Promise.reject(new Error('data.orders with data (Order[]) is required for summary print'));
  }

  const cfg = normalizeConfig(config);

  return printReceiptHeader(printer, cfg).then(() => {
    printSummaryLayout(printer, data, cfg);
    return printer;
  });
}

module.exports = { build };
