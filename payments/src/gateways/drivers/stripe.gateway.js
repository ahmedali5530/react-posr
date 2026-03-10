'use strict';

const { BaseGateway } = require('../base.gateway');
const { PaymentGateway, PaymentStatus, WebhookStatus } = require('../gateway.types');
const { buildCheckoutUrl, generateStrongToken } = require('../../lib/intent.utils');

class StripeGateway extends BaseGateway {
  constructor() {
    super(PaymentGateway.STRIPE);
  }

  async createIntent(payload) {
    const token = generateStrongToken();
    const now = Date.now();
    return {
      gateway: this.name,
      intentId: `stripe_intent_${token}`,
      paymentUrl: buildCheckoutUrl(this.name, token),
      clientToken: null,
      status: PaymentStatus.PENDING,
      expiresAt: new Date(now + 15 * 60 * 1000).toISOString(),
      gatewayPayload: {
        orderId: payload.orderId,
      },
    };
  }

  async verify(payload) {
    return {
      gateway: this.name,
      status: PaymentStatus.PAID,
      verifiedAt: new Date().toISOString(),
      reference: payload.paymentId || payload.intentId || null,
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

module.exports = { StripeGateway };
