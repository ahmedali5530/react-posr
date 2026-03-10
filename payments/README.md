# POS Payment Server

Standalone Node.js service for payment gateway orchestration.

This service keeps third-party secrets on the server and exposes a small API for the browser app:
- create payment intent/link/token
- verify payment
- receive gateway webhooks

## Run

```bash
cd payments
npm install
npm start
```

Server listens on `http://localhost:3133` by default.

From project root:

```bash
npm run payment-server
```

## Environment

Copy `.env.example` to `.env` inside `payments`.

All gateway keys remain server-side. Do not add these secrets to frontend env files.

## API

### `GET /health`

Health endpoint.

### `POST /payments/create-intent`

Creates a normalized payment intent response for any supported gateway.

Request:

```json
{
  "gateway": "stripe",
  "amount": 1200,
  "currency": "USD",
  "orderId": "order-123",
  "customer": {
    "name": "Ahmed",
    "email": "ahmed@example.com"
  },
  "returnUrl": "https://example.com/payment/success",
  "cancelUrl": "https://example.com/payment/cancel",
  "metadata": {
    "source": "posr-react"
  }
}
```

Response (scaffold mode):

```json
{
  "success": true,
  "data": {
    "gateway": "stripe",
    "intentId": "stripe_intent_xxx",
    "paymentUrl": "https://mock-payments.local/stripe/pay/xxx",
    "clientToken": null,
    "status": "pending",
    "expiresAt": "2026-03-07T12:00:00.000Z",
    "gatewayPayload": {}
  }
}
```

### `POST /payments/verify`

Verifies payment from gateway payload and returns normalized status.

Request:

```json
{
  "gateway": "paypal",
  "paymentId": "PAY-123",
  "metadata": {
    "orderId": "order-123"
  }
}
```

### `POST /webhooks/:gateway`

Webhook receiver endpoint. Signature verification is scaffolded and should be implemented per gateway in production mode.

## Supported Gateways

- `stripe`
- `paypal`
- `razorpay`
- `jazzcash`

Each gateway has its own driver under `src/gateways/drivers`.
