'use strict';

const { normalizeConfig, printReceiptHeader } = require('../lib/receipt-helpers');
const { printBillLayout } = require('../lib/bill-layout');
const { mapOrderToTemp } = require('../lib/order-mapping');

/**
 * Temp print – Pre-Sale Bill (CommonBillParts only, no payments/change). Matches presale.bill.tsx.
 * Expects data: { order: Order }. Order from src/api/model/order.ts.
 */
function build(printer, data = {}, config = {}) {
  const order = data && data.order;
  if (!order) {
    return Promise.reject(new Error('data.order is required for temp print'));
  }

  const cfg = normalizeConfig(config);
  const bill = mapOrderToTemp(order);

  return printReceiptHeader(printer, cfg).then(() => {
    printBillLayout(printer, bill, cfg, {
      title: bill.title,
      notes: bill.note || undefined,
      showPayments: false,
      showChange: false,
      showDeliveryLine: false,
    });
    return printer;
  });
}

module.exports = { build };
