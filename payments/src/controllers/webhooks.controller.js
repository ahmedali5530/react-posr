'use strict';

const { getGatewayDriver } = require('../gateways/gateway.factory');
const { sendSuccess } = require('../lib/response');
const { normalizeGateway, parseWebhookBody } = require('../lib/validation');

async function handleWebhook(req, res, next) {
  try {
    const gateway = normalizeGateway(req.params.gateway);
    const signature = req.get('x-signature') || req.get('stripe-signature') || null;
    const rawBody = req.body;
    const parsedBody = parseWebhookBody(rawBody);

    const driver = getGatewayDriver(gateway);
    const data = await driver.handleWebhook({
      headers: req.headers,
      signature,
      rawBody,
      body: parsedBody,
      eventType: parsedBody.type || parsedBody.eventType,
      eventId: parsedBody.id || parsedBody.eventId,
    });

    // Always acknowledge quickly so gateway retries are minimized.
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleWebhook,
};
