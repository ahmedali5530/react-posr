# POS Print Server

Node.js print server using **escpos** and adapter drivers. Accepts JSON over HTTP and prints to USB, Serial, Network, or Bluetooth printers.

## Run

```bash
npm install
npm start
# or from project root: npm run print-server
```

Server listens on `http://localhost:3132` (or `PRINT_PORT`).

## Preview (no printer needed)

- **GET http://localhost:3132/print/preview** — Tool page: choose print type, paste JSON (same shape as `/print`), click Preview. Opens the receipt layout in a new tab.
- **POST http://localhost:3132/print/preview** — Same request body as `POST /print` (printers are ignored). Returns HTML that mimics the thermal receipt (temp, final, delivery, kitchen, summary).

Use this to check layout and content before printing.

## POST /print

**Body:**
```json
{
  "printers": [ ... ],
  "data": { "printType": "temp|summary|kitchen|delivery|final", ... },
  "config": {
    "bottomMargin": "1",
    "companyName": "Your Co",
    "leftMargin": "1",
    "logo": "",
    "rightMargin": "1",
    "showCompanyName": false,
    "showItemName": true,
    "showItemPrice": true,
    "showItemQuantity": true,
    "showItemTotal": false,
    "showVatNumber": true,
    "topMargin": "1",
    "vatName": "NTN",
    "vatNumber": "12356789"
  }
}
```

**Printers** (one or more):
```json
[
  { "type": "usb" },
  { "type": "usb", "vid": 0x04b8, "pid": 0x0e28 },
  { "type": "serial", "path": "/dev/ttyUSB0", "baudRate": 9600 },
  { "type": "network", "ip": "192.168.1.100", "port": 9100 },
  { "type": "bluetooth", "address": "01:23:45:67:89:AB", "channel": 1 }
]
```

**config** (optional) — applies to temp, final, delivery, kitchen, summary:
- **Margins:** `topMargin`, `bottomMargin`, `leftMargin`, `rightMargin` (string or number, lines/units)
- **Branding:** `companyName`, `logo` (base64 or `data:image/png;base64,...`), `showCompanyName`
- **Currency:** `currencySymbol` (default `$`) for amounts on temp, final, delivery
- **Item columns:** `showItemName`, `showItemPrice`, `showItemQuantity`, `showItemTotal` — for summary / custom use
- **VAT:** `showVatNumber`, `vatName`, `vatNumber`

**temp** (Pre-Sale Bill, matches `presale.bill.tsx`): **CommonBillParts** only — Invoice#, date, table, user; items `Name xQty` / `$lineTotal`; **Items (n)**, **Tax (name rate%)**, **Discount**, **Service charges (X or X%)**, **extras**, **Tip** / **Tip %**; **Total**. No payments or Change.

**final** (matches `final.bill.tsx` + `_common.bill.tsx`): CommonBillParts + **payments** (each `payment_type.name` / amount) + **Change** (`sum(payments) - total`). `data.duplicate: true` → title "Duplicate Final Bill".

**delivery**: CommonBillParts + **Delivery Charges** (when `order.delivery.delivery_charges` or `order.delivery_charges`) + address/phone/notes + payments + Change.

## Drivers (escpos adapters)

| type       | config |
|-----------|--------|
| `usb`     | `vid?`, `pid?` |
| `serial`  | `path?` (default `/dev/ttyUSB0`), `baudRate?`, `dataBits?`, `stopBits?`, `parity?` |
| `network` | `ip`, `port?` (default 9100) |
| `bluetooth` | `address` (MAC), `channel?` (default 1). Requires `npm install escpos-bluetooth` and `libbluetooth-dev` (Linux). |

## Print builders

**temp, final, delivery, kitchen** — expect `data: { printType, order }` where `order` is an `Order` from `src/api/model/order.ts` (invoice_number, split, created_at, table, items, tax_amount, discount_amount, service_charge_amount, tip_amount, payments, customer, delivery, order_type, tags, …). Items are mapped from `order.items` (Dish name, quantity, price, comments); deleted/refunded/suspended items are omitted.

| printType | purpose |
|-----------|---------|
| `temp`    | Quick slip from `order` (items, totals) |
| `final`   | Customer receipt from `order` |
| `delivery`| Delivery slip from `order` (delivery/customer address, phone, items, totals) |
| `kitchen` | Kitchen ticket from `order` (table, items with comments, time, priority) |

**summary** — same props as `Summary` (summary.tsx): `{ orders: { data: Order[] }, date: string }`. All totals (exclusive, gross, refunds, service charges, discounts, taxes, net, amount due, amount collected, extras, rounding, voids, tips, covers, categories, dishes, payment types, taxes list, discounts list, extras) are computed from `orders.data` in the print server to match the Summary logic.

## Bluetooth

To enable Bluetooth: install `escpos-bluetooth` in this folder and the system libs (e.g. `libbluetooth-dev` on Debian/Ubuntu). If the adapter is not available, the bluetooth driver throws a clear error.

```bash
# Debian/Ubuntu
sudo apt-get install libbluetooth-dev
cd printing && npm install escpos-bluetooth
```
