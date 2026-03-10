'use strict';

const { getGatewayDriver } = require('../gateways/gateway.factory');
const { sendSuccess } = require('../lib/response');
const {
  validateCreateIntentRequest,
  validateVerifyRequest,
} = require('../lib/validation');

async function createIntent(req, res, next) {
  try {
    const payload = validateCreateIntentRequest(req.body);
    const idempotencyKey = req.get('x-idempotency-key') || null;
    const driver = getGatewayDriver(payload.gateway);
    const data = await driver.createIntent({
      ...payload,
      idempotencyKey,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const payload = validateVerifyRequest(req.body);
    const driver = getGatewayDriver(payload.gateway);
    const data = await driver.verify(payload);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createIntent,
  verifyPayment,
};
