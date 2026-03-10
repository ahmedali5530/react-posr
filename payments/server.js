'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const paymentsRoutes = require('./src/routes/payments.routes');
const webhooksRoutes = require('./src/routes/webhooks.routes');
const { handleError } = require('./src/lib/response');

const app = express();
const PORT = Number(process.env.PAYMENT_PORT || 3133);
const HOST = process.env.PAYMENT_HOST || '0.0.0.0';

app.use(cors());

// Keep webhook body untouched for signature verification in real integrations.
app.use('/webhooks', express.raw({ type: '*/*', limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'posr-payment-server' });
});

app.use('/payments', paymentsRoutes);
app.use('/webhooks', webhooksRoutes);

app.use((err, req, res, next) => {
  handleError(res, err);
});

app.listen(PORT, HOST, () => {
  console.log(`Payment server listening on http://${HOST}:${PORT}`);
  console.log('POST /payments/create-intent');
  console.log('POST /payments/verify');
  console.log('POST /webhooks/:gateway');
});
