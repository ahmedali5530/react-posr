'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const escpos = require('escpos');
const Image = escpos.Image;

const DEFAULTS = {
  bottomMargin: 0,
  topMargin: 0,
  leftMargin: 0,
  rightMargin: 0,
  companyName: '',
  logo: '',
  showCompanyName: false,
  showItemName: true,
  showItemPrice: true,
  showItemQuantity: true,
  showItemTotal: false,
  showVatNumber: false,
  vatName: 'VAT',
  vatNumber: '',
  currencySymbol: '$',
};

/**
 * Normalize printer config from request.
 * @param {Object} c - raw config
 * @returns {Object}
 */
function normalizeConfig(c = {}) {
  const n = (v, def) => (v === undefined || v === null ? def : v);
  const num = (v, def) => {
    const x = parseInt(v, 10);
    return Number.isNaN(x) ? (def !== undefined ? def : 0) : Math.max(0, x);
  };
  return {
    bottomMargin: num(c.bottomMargin, DEFAULTS.bottomMargin),
    topMargin: num(c.topMargin, DEFAULTS.topMargin),
    leftMargin: num(c.leftMargin, DEFAULTS.leftMargin),
    rightMargin: num(c.rightMargin, DEFAULTS.rightMargin),
    companyName: String(n(c.companyName, DEFAULTS.companyName)),
    logo: n(c.logo, DEFAULTS.logo),
    showCompanyName: Boolean(c.showCompanyName !== undefined ? c.showCompanyName : DEFAULTS.showCompanyName),
    showItemName: Boolean(c.showItemName !== undefined ? c.showItemName : DEFAULTS.showItemName),
    showItemPrice: Boolean(c.showItemPrice !== undefined ? c.showItemPrice : DEFAULTS.showItemPrice),
    showItemQuantity: Boolean(c.showItemQuantity !== undefined ? c.showItemQuantity : DEFAULTS.showItemQuantity),
    showItemTotal: Boolean(c.showItemTotal !== undefined ? c.showItemTotal : DEFAULTS.showItemTotal),
    showVatNumber: Boolean(c.showVatNumber !== undefined ? c.showVatNumber : DEFAULTS.showVatNumber),
    vatName: String(n(c.vatName, DEFAULTS.vatName) || 'VAT'),
    vatNumber: String(n(c.vatNumber, DEFAULTS.vatNumber)),
    currencySymbol: String(n(c.currencySymbol, DEFAULTS.currencySymbol) || '$'),
  };
}

/**
 * Format amount as currency string (e.g. "$12.34").
 * @param {number} amount
 * @param {string} symbol - default '$'
 * @returns {string}
 */
function formatMoney(amount, symbol) {
  const s = symbol != null ? symbol : '$';
  return s + Number(amount || 0).toFixed(2);
}

/**
 * Print one line: label left, value right. Uses tableCustom.
 * @param {Object} printer - escpos Printer
 * @param {string} left
 * @param {string} right
 * @param {{ size?: [number,number] }} opts
 */
function printLineLeftRight(printer, left, right, opts) {
  const size = (opts && opts.size) || [1, 1];
  printer.tableCustom(
    [
      { text: String(left || ''), align: 'LEFT', width: 0.5 },
      { text: String(right || ''), align: 'RIGHT', width: 0.5 },
    ],
    { size }
  );
}

/**
 * Apply top margin (feed) and left/right margin commands. Bottom is applied via feedBottomMargin before cut.
 * @param {Object} printer - escpos Printer
 * @param {Object} config - normalized config
 */
function applyMargins(printer, config) {
  const top = Math.max(0, config.topMargin || 0);
  if (top > 0) printer.feed(top);
  const left = Math.max(0, config.leftMargin || 0);
  if (left > 0) printer.marginLeft(Math.min(255, left));
  const right = Math.max(0, config.rightMargin || 0);
  if (right > 0) printer.marginRight(Math.min(255, right));
}

/**
 * Print logo from base64 or data URI. No-op if logo is empty. Resolves on success or on skip/error.
 * @param {Object} printer - escpos Printer
 * @param {string} logo - base64 string, or data:image/...;base64,...
 * @returns {Promise<void>}
 */
function printLogo(printer, logo) {
  if (!logo || typeof logo !== 'string' || logo.trim() === '') {
    return Promise.resolve();
  }

  let mime = 'image/png';
  let b64 = logo.trim();

  const dataUri = /^data:([^;]+);base64,(.+)$/i.exec(b64);
  if (dataUri) {
    mime = (dataUri[1] || 'image/png').toLowerCase();
    b64 = dataUri[2];
  }

  const ext = mime.includes('jpeg') || mime.includes('jpg') ? '.jpg' : '.png';
  const tmpPath = path.join(os.tmpdir(), `posr-logo-${Date.now()}${ext}`);

  return new Promise((resolve) => {
    let buf;
    try {
      buf = Buffer.from(b64, 'base64');
    } catch (e) {
      return resolve();
    }
    if (buf.length === 0) return resolve();

    fs.writeFile(tmpPath, buf, (writeErr) => {
      if (writeErr) return resolve();

      Image.load(tmpPath, mime, (loadErr, img) => {
        const done = () => {
          fs.unlink(tmpPath, () => {});
          resolve();
        };
        if (loadErr || !img) return done();
        try {
          printer.align('ct');
          printer.image(img, 'd24');
        } catch (e) { /* ignore */ }
        done();
      });
    });
  });
}

/**
 * Print company name when showCompanyName is true.
 * @param {Object} printer - escpos Printer
 * @param {Object} config - normalized config
 */
function printCompanyName(printer, config) {
  if (!config.showCompanyName || !config.companyName) return;
  printer.align('ct').text(config.companyName);
}

/**
 * Print VAT line when showVatNumber is true.
 * @param {Object} printer - escpos Printer
 * @param {Object} config - normalized config
 */
function printVatLine(printer, config) {
  if (!config.showVatNumber || !config.vatNumber) return;
  printer.text(`${config.vatName}: ${config.vatNumber}`);
}

/**
 * Feed before cut for bottom margin.
 * @param {Object} printer - escpos Printer
 * @param {Object} config - normalized config
 */
function feedBottomMargin(printer, config) {
  const n = Math.max(0, config.bottomMargin || 0);
  if (n > 0) printer.feed(n);
}

/**
 * Build receipt header: margins, logo, company name. Async when logo is present.
 * @param {Object} printer - escpos Printer
 * @param {Object} config - normalized config
 * @returns {Promise<void>}
 */
function printReceiptHeader(printer, config) {
  applyMargins(printer, config);
  return printLogo(printer, config.logo).then(() => {
    printCompanyName(printer, config);
  });
}

/**
 * Format a single item line for text() based on config flags.
 * @param {Object} item - { name, qty, price, total? }
 * @param {Object} config - normalized config
 * @returns {string}
 */
function formatItemLine(item, config) {
  const name = (item.name || item.title || '').slice(0, 28);
  const qty = item.qty != null ? item.qty : 1;
  const price = item.price != null ? Number(item.price) : 0;
  const total = item.total != null ? Number(item.total) : price * qty;

  const parts = [];
  if (config.showItemName) parts.push(name);
  if (config.showItemQuantity) parts.push(`x${qty}`);
  if (config.showItemPrice) parts.push(price.toFixed(2));
  if (config.showItemTotal) parts.push(total.toFixed(2));
  return parts.join('  ');
}

/**
 * Build tableCustom row for item based on config. Returns array of { text, align, width }.
 * @param {Object} item - { name, qty, price, total? }
 * @param {Object} config - normalized config
 * @returns {{ cells: Array<{ text, align, width }>, totalWidth: number }}
 */
function getItemTableRow(item, config) {
  const name = (item.name || item.title || '').slice(0, 20);
  const qty = item.qty != null ? item.qty : 1;
  const price = item.price != null ? Number(item.price) : 0;
  const lineTotal = (item.total != null ? Number(item.total) : price * qty).toFixed(2);

  const cells = [];
  if (config.showItemName) cells.push({ text: name, align: 'LEFT', width: 1 });
  if (config.showItemQuantity) cells.push({ text: String(qty), align: 'CENTER', width: 1 });
  if (config.showItemPrice) cells.push({ text: price.toFixed(2), align: 'RIGHT', width: 1 });
  if (config.showItemTotal) cells.push({ text: lineTotal, align: 'RIGHT', width: 1 });

  if (cells.length === 0) cells.push({ text: name || '-', align: 'LEFT', width: 1 });

  const n = cells.length;
  const w = 1 / n;
  cells.forEach((c) => { c.width = w; });

  return { cells, totalWidth: 1 };
}

/**
 * Build tableCustom header row for final receipt based on config.
 * @param {Object} config - normalized config
 * @returns {Array<{ text, align, width }>}
 */
function getItemTableHeader(config) {
  const cells = [];
  if (config.showItemName) cells.push({ text: 'Item', align: 'LEFT', width: 1 });
  if (config.showItemQuantity) cells.push({ text: 'Qty', align: 'CENTER', width: 1 });
  if (config.showItemPrice) cells.push({ text: 'Price', align: 'RIGHT', width: 1 });
  if (config.showItemTotal) cells.push({ text: 'Total', align: 'RIGHT', width: 1 });
  if (cells.length === 0) cells.push({ text: 'Item', align: 'LEFT', width: 1 });

  const n = cells.length;
  const w = 1 / n;
  cells.forEach((c) => { c.width = w; });
  return cells;
}

module.exports = {
  normalizeConfig,
  applyMargins,
  printLogo,
  printCompanyName,
  printVatLine,
  feedBottomMargin,
  printReceiptHeader,
  formatItemLine,
  getItemTableRow,
  getItemTableHeader,
  formatMoney,
  printLineLeftRight,
};
