'use strict';

const { normalizeConfig, printReceiptHeader } = require('../lib/receipt-helpers');
const { printBillLayout } = require('../lib/bill-layout');
const { mapOrderToDelivery } = require('../lib/order-mapping');

/**
 * Delivery print – Duplicate Final Bill format with address/phone. Expects data: { order: Order }.
 * Order from src/api/model/order.ts.
 */
function build(printer, data = {}, config = {}) {
  const order = data && data.order;
  if (!order) {
    return Promise.reject(new Error('data.order is required for delivery print'));
  }

  const cfg = normalizeConfig(config);
  const bill = mapOrderToDelivery(order);

  return printReceiptHeader(printer, cfg).then(() => {
    printBillLayout(printer, bill, cfg, {
      title: bill.title,
      address: bill.address,
      phone: bill.phone,
      notes: bill.notes || undefined,
      showPayments: true,
      showChange: true,
      showDeliveryLine: true,
    });
    return printer;
  });
}

module.exports = { build };
