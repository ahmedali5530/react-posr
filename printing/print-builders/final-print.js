'use strict';

const { normalizeConfig, printReceiptHeader } = require('../lib/receipt-helpers');
const { printBillLayout } = require('../lib/bill-layout');
const { mapOrderToFinal } = require('../lib/order-mapping');

/**
 * Final print – Final Bill + CommonBillParts + payments + Change. Matches final.bill.tsx and _common.bill.tsx.
 * Expects data: { order: Order, duplicate?: boolean }. duplicate=true uses "Duplicate Final Bill" as title.
 */
function build(printer, data = {}, config = {}) {
  const order = data && data.order;
  if (!order) {
    return Promise.reject(new Error('data.order is required for final print'));
  }

  const cfg = normalizeConfig(config);
  const bill = mapOrderToFinal(order, { duplicate: !!data.duplicate });

  return printReceiptHeader(printer, cfg).then(() => {
    printBillLayout(printer, bill, cfg, {
      title: bill.title,
      thankYou: bill.thankYou,
      showPayments: true,
      showChange: true,
      showDeliveryLine: false,
    });
    return printer;
  });
}

module.exports = { build };
