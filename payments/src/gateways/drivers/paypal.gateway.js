'use strict';

const { BaseGateway } = require('../base.gateway');
const { PaymentGateway, PaymentStatus, WebhookStatus } = require('../gateway.types');
const { buildCheckoutUrl, generateStrongToken } = require('../../lib/intent.utils');

class PaypalGateway extends BaseGateway {
  constructor() {
    super(PaymentGateway.PAYPAL);
  }

  async createIntent(payload) {
    const token = generateStrongToken();
    const clientToken = generateStrongToken(24);
    const now = Date.now();
    return {
      gateway: this.name,
      intentId: `paypal_order_${token}`,
      paymentUrl: buildCheckoutUrl(this.name, token),
      clientToken: `paypal_client_token_${clientToken}`,
      status: PaymentStatus.PENDING,
      expiresAt: new Date(now + 30 * 60 * 1000).toISOString(),
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

module.exports = { PaypalGateway };
