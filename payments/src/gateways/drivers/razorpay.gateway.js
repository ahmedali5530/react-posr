'use strict';

const { BaseGateway } = require('../base.gateway');
const { PaymentGateway, PaymentStatus, WebhookStatus } = require('../gateway.types');
const { buildCheckoutUrl, generateStrongToken } = require('../../lib/intent.utils');

class RazorpayGateway extends BaseGateway {
  constructor() {
    super(PaymentGateway.RAZORPAY);
  }

  async createIntent(payload) {
    const token = generateStrongToken();
    const now = Date.now();
    return {
      gateway: this.name,
      intentId: `razorpay_order_${token}`,
      paymentUrl: buildCheckoutUrl(this.name, token),
      clientToken: null,
      status: PaymentStatus.PENDING,
      expiresAt: new Date(now + 20 * 60 * 1000).toISOString(),
      gatewayPayload: {
        orderId: payload.orderId,
      },
    };
  }

  async verify(payload) {
    return {
      gateway: this.name,
      status: PaymentStatus.AUTHORIZED,
      verifiedAt: new Date().toISOString(),
      reference: payload.paymentId || payload.orderId || null,
      gatewayPayload: payload,
    };
  }

  async handleWebhook(payload) {
    return {
      gateway: this.name,
      status: WebhookStatus.RECEIVED,
      eventType: payload.eventType || 'unknown',
      eventId: payload.eventId || null,
      normalizedData: payload,
      receivedAt: new Date().toISOString(),
    };
  }
}

module.exports = { RazorpayGateway };
