'use strict';

const {
  printLineLeftRight,
  formatMoney,
  printVatLine,
  feedBottomMargin,
} = require('./receipt-helpers');

/**
 * Print bill layout aligned with _common.bill.tsx and final.bill.tsx / presale.bill.tsx.
 * @param {Object} printer - escpos Printer
 * @param {Object} bill - from mapOrderToTemp/Final/Delivery
 * @param {Object} config - normalized config (currencySymbol, showVatNumber, vatName, vatNumber)
 * @param {Object} opts - { title, address?, phone?, notes?, thankYou?, showPayments?, showChange?, showDeliveryLine? }
 */
function printBillLayout(printer, bill, config, opts) {
  const cfg = config || {};
  const sym = cfg.currencySymbol || '$';
  const {
    title,
    address,
    phone,
    notes,
    thankYou,
    showPayments = false,
    showChange = false,
    showDeliveryLine = false,
  } = opts || {};

  // --- Header (CommonBillParts) ---
  printer.align('ct').style('bu').text(title || 'Bill').style('normal');
  printLineLeftRight(printer, `Invoice# ${bill.orderId || ''}`, bill.date || '');
  printLineLeftRight(printer, bill.table || '', bill.userName || '');
  if (address) printer.text(`Address: ${String(address).slice(0, 40)}`);
  if (phone) printer.text(`Phone: ${String(phone)}`);
  printer.drawLine();

  // --- Items: "Name xQty" left, "$lineTotal" right ---
  (bill.items || []).forEach((it) => {
    const name = (it.name || it.title || '').slice(0, 28);
    const qty = it.qty != null ? it.qty : 1;
    const lineTotal = it.total != null ? Number(it.total) : (it.price || 0) * qty;
    printLineLeftRight(printer, `${name} x${qty}`, formatMoney(lineTotal, sym));
  });
  printer.drawLine();

  // --- Summary (CommonBillParts order): Items(n), Tax, Discount, Service charges, extras, Tip; optionally Delivery ---
  printLineLeftRight(printer, `Items (${bill.itemsCount || 0})`, formatMoney(bill.itemsTotal, sym));
  if (bill.tax != null && Number(bill.tax) !== 0) {
    printLineLeftRight(printer, `Tax (${bill.taxLabel || 'Tax'})`, formatMoney(bill.tax, sym));
  }
  if (bill.discount && bill.discountAmount != null && Number(bill.discountAmount) !== 0) {
    printLineLeftRight(printer, 'Discount', formatMoney(bill.discountAmount, sym));
  }
  if (bill.serviceChargeLabel && bill.serviceChargeAmount != null && Number(bill.serviceChargeAmount) !== 0) {
    printLineLeftRight(printer, bill.serviceChargeLabel, formatMoney(bill.serviceChargeAmount, sym));
  }
  (bill.extras || []).forEach((e) => {
    printLineLeftRight(printer, e.name || 'Extra', formatMoney(e.value, sym));
  });
  if (bill.tipAmount != null && Number(bill.tipAmount) !== 0) {
    printLineLeftRight(printer, bill.tipLabel || 'Tip', formatMoney(bill.tipAmount, sym));
  }
  if (showDeliveryLine && bill.deliveryCharges != null && Number(bill.deliveryCharges) !== 0) {
    printLineLeftRight(printer, 'Delivery Charges', formatMoney(bill.deliveryCharges, sym));
  }
  printer.drawLine();

  // --- Total (bold) ---
  printer.style('bu');
  printLineLeftRight(printer, 'Total', formatMoney(bill.total, sym));
  printer.style('normal');

  // --- Payments and Change (final.bill: each payment, then Change) ---
  if (showPayments && Array.isArray(bill.payments) && bill.payments.length > 0) {
    printer.drawLine();
    bill.payments.forEach((p) => {
      printLineLeftRight(printer, p.method || 'Payment', formatMoney(p.amount, sym));
    });
  }
  if (showChange) {
    printer.drawLine();
    printer.style('bu');
    printLineLeftRight(printer, 'Change', formatMoney(bill.change, sym));
    printer.style('normal');
  }

  printVatLine(printer, cfg);
  if (notes) {
    printer.drawLine();
    printer.text(`Notes: ${String(notes).slice(0, 48)}`);
  }
  if (thankYou) {
    printer.feed(1).align('ct').text(thankYou).feed(2);
  }

  feedBottomMargin(printer, cfg);
  printer.feed(1).cut();
}

module.exports = { printBillLayout };
