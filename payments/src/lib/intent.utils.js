'use strict';

const crypto = require('crypto');

function generateStrongToken(size = 32) {
  return crypto.randomBytes(size).toString('hex');
}

function getPaymentBaseUrl() {
  const base =
    process.env.PAYMENT_BASE_URL ||
    process.env.VITE_PAYMENT_SERVER_URL ||
    `http://localhost:${process.env.PAYMENT_PORT || 3133}`;

  return String(base).replace(/\/$/, '');
}

function buildCheckoutUrl(gateway, token) {
  return `${getPaymentBaseUrl()}/payments/checkout/${gateway}/${token}`;
}

module.exports = {
  generateStrongToken,
  getPaymentBaseUrl,
  buildCheckoutUrl,
};
