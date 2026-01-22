'use strict';

const {
  normalizeConfig,
  printReceiptHeader,
  feedBottomMargin,
  formatItemLine,
} = require('../lib/receipt-helpers');
const { mapOrderToKitchen } = require('../lib/order-mapping');

/**
 * Kitchen print builder - kitchen order. Expects data: { order: Order }.
 * Order from src/api/model/order.ts.
 */
function build(printer, data = {}, config = {}) {
  const order = data && data.order;
  if (!order) {
    return Promise.reject(new Error('data.order is required for kitchen print'));
  }

  const cfg = normalizeConfig(config);
  const {
    orderId = '',
    table = '',
    items = [],
    createdAt = new Date().toLocaleTimeString(),
    priority,
  } = mapOrderToKitchen(order);

  return printReceiptHeader(printer, cfg).then(() => {
    printer
      .align('ct')
      .style('bu')
      .size(2, 2)
      .text('*** KITCHEN ***')
      .size(1, 1)
      .style('normal')
      .drawLine();

    if (orderId) printer.text(`Order: ${orderId}`);
    if (table) printer.text(`Table: ${table}`);
    printer.text(`Time: ${createdAt}`);
    if (priority) {
      printer.style('bu').text(`PRIORITY: ${priority}`).style('normal');
    }
    printer.drawLine();

    items.forEach((it) => {
      const line = formatItemLine(it, cfg);
      if (line) printer.style('bu').text(line).style('normal');
      if (it.notes) {
        printer.text(`   >> ${(it.notes || '').slice(0, 26)}`);
      }
    });

    feedBottomMargin(printer, cfg);
    printer.feed(2).cut();
    return printer;
  });
}

module.exports = { build };
