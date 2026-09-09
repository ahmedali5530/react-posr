import { describe, expect, it } from 'vitest';
import {
  parseFursConfig,
  validateFursConfig,
  serializeFursInvoice,
  generateFursZoi,
  generateFursQrCode,
  type FursConfig,
} from './furs-config.ts';

const testConfig: FursConfig = {
  certificateP12: 'fake-cert-base64',
  certificatePassword: 'test123',
  apiBaseUrl: 'https://blagajne-test.fu.gov.si:9002',
  taxNumber: '10026642',
  businessPremiseId: 'PE1',
  electronicDeviceId: 'B1',
  testEnvironment: true,
  requestTimeoutSeconds: 30,
  qrPriority: 60,
};

const testOrder = {
  id: 'order:1',
  invoice_number: 1,
  items: [
    { id: 'item:1', name: 'Kava', quantity: 2, price: 1.50, tax_rate: 22 },
    { id: 'item:2', name: 'Burek', quantity: 1, price: 3.20, tax_rate: 22 },
  ],
};

describe('FURS config parsing', () => {
  it('parses valid config', () => {
    const config = parseFursConfig({
      certificateP12: 'cert',
      certificatePassword: 'pass',
      taxNumber: '10026642',
      businessPremiseId: 'PE1',
      electronicDeviceId: 'B1',
      testEnvironment: true,
    });
    expect(config.taxNumber).toBe('10026642');
    expect(config.testEnvironment).toBe(true);
    expect(config.apiBaseUrl).toBe('https://blagajne.fu.gov.si:9002');
  });

  it('uses test URL when testEnvironment is true', () => {
    const config = parseFursConfig({ testEnvironment: true });
    expect(config.apiBaseUrl).toBe('https://blagajne.fu.gov.si:9002');
  });

  it('applies defaults for missing fields', () => {
    const config = parseFursConfig({});
    expect(config.requestTimeoutSeconds).toBe(30);
    expect(config.qrPriority).toBe(60);
    expect(config.testEnvironment).toBe(true);
  });
});

describe('FURS config validation', () => {
  it('validates complete config', () => {
    const result = validateFursConfig(testConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects invalid tax number (not 8 digits)', () => {
    const result = validateFursConfig({ ...testConfig, taxNumber: '123' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Tax number (davčna številka) must be 8 digits');
  });

  it('rejects missing business premise ID', () => {
    const result = validateFursConfig({ ...testConfig, businessPremiseId: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Business premise ID (oznaka poslovnega prostora) is required');
  });

  it('rejects missing electronic device ID', () => {
    const result = validateFursConfig({ ...testConfig, electronicDeviceId: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Electronic device ID (oznaka elektronske naprave) is required');
  });

  it('rejects missing certificate', () => {
    const result = validateFursConfig({ ...testConfig, certificateP12: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Certificate (.p12) is required');
  });

  it('rejects missing certificate password', () => {
    const result = validateFursConfig({ ...testConfig, certificatePassword: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Certificate password is required');
  });
});

describe('FURS invoice serialization', () => {
  it('serializes order into FURS payload', () => {
    const invoice = serializeFursInvoice(testOrder, testConfig, 'INV-001');
    expect(invoice.InvoiceNumber).toBe('INV-001');
    expect(invoice.TaxNumber).toBe('10026642');
    expect(invoice.BusinessPremiseId).toBe('PE1');
    expect(invoice.ElectronicDeviceId).toBe('B1');
    expect(invoice.Items).toHaveLength(2);
    expect(invoice.Items[0].ItemName).toBe('Kava');
    expect(invoice.Items[0].Quantity).toBe(2);
    expect(invoice.Items[0].UnitPrice).toBe(1.50);
    expect(invoice.Items[0].TaxRate).toBe(22);
  });

  it('calculates invoice amount correctly', () => {
    const invoice = serializeFursInvoice(testOrder, testConfig, 'INV-001');
    // 2 × 1.50 + 1 × 3.20 = 6.20
    expect(invoice.InvoiceAmount).toBe(6.20);
    expect(invoice.PaymentAmount).toBe(6.20);
  });

  it('groups taxes by rate', () => {
    const invoice = serializeFursInvoice(testOrder, testConfig, 'INV-001');
    expect(invoice.TaxesPerRate).toHaveLength(1); // all 22%
    expect(invoice.TaxesPerRate[0].TaxRate).toBe(22);
    expect(invoice.TaxesPerRate[0].TaxableAmount).toBe(6.20);
  });

  it('handles empty order', () => {
    const invoice = serializeFursInvoice({ items: [] }, testConfig, 'INV-002');
    expect(invoice.Items).toHaveLength(0);
    expect(invoice.InvoiceAmount).toBe(0);
    expect(invoice.TaxesPerRate).toHaveLength(0);
  });

  it('rounds amounts to 2 decimals', () => {
    const order = {
      items: [
        { id: 'i1', name: 'Test', quantity: 3, price: 1.333, tax_rate: 22 },
      ],
    };
    const invoice = serializeFursInvoice(order, testConfig, 'INV-003');
    expect(invoice.Items[0].ItemAmount).toBe(4.00); // 3 × 1.333 = 3.999 → 4.00
  });
});

describe('FURS ZOI generation', () => {
  it('generates ZOI from invoice data', async () => {
    const zoi = await generateFursZoi(
      {
        taxNumber: '10026642',
        issueDateTime: '2025-01-15T10:30:00.000Z',
        invoiceNumber: 'INV-001',
        businessPremiseId: 'PE1',
        electronicDeviceId: 'B1',
        invoiceAmount: 6.20,
      },
      '', // no private key — will use MD5 fallback
    );
    expect(zoi).toBeTruthy();
    expect(typeof zoi).toBe('string');
    expect(zoi.length).toBeGreaterThan(10);
  });

  it('generates consistent ZOI for same input', async () => {
    const input = {
      taxNumber: '10026642',
      issueDateTime: '2025-01-15T10:30:00.000Z',
      invoiceNumber: 'INV-001',
      businessPremiseId: 'PE1',
      electronicDeviceId: 'B1',
      invoiceAmount: 6.20,
    };
    const zoi1 = await generateFursZoi(input, '');
    const zoi2 = await generateFursZoi(input, '');
    expect(zoi1).toBe(zoi2);
  });

  it('generates different ZOI for different amounts', async () => {
    const zoi1 = await generateFursZoi(
      { taxNumber: '10026642', issueDateTime: '2025-01-15T10:30:00Z', invoiceNumber: 'INV-001', businessPremiseId: 'PE1', electronicDeviceId: 'B1', invoiceAmount: 6.20 },
      '',
    );
    const zoi2 = await generateFursZoi(
      { taxNumber: '10026642', issueDateTime: '2025-01-15T10:30:00Z', invoiceNumber: 'INV-001', businessPremiseId: 'PE1', electronicDeviceId: 'B1', invoiceAmount: 10.00 },
      '',
    );
    expect(zoi1).not.toBe(zoi2);
  });
});

describe('FURS QR code generation', () => {
  it('generates base64 QR code', () => {
    const qr = generateFursQrCode('zoi-hash-1234567890123456789012345678', '10026642', '2025-01-15T10:30:00Z');
    expect(qr).toBeTruthy();
    expect(typeof qr).toBe('string');
    // Should be base64-encoded JSON
    const decoded = Buffer.from(qr, 'base64').toString();
    const parsed = JSON.parse(decoded);
    expect(parsed.zoi).toBeTruthy();
    expect(parsed.taxNumber).toBe('10026642');
    expect(parsed.issueDateTime).toBe('2025-01-15T10:30:00Z');
  });

  it('truncates ZOI to 32 chars in QR', () => {
    const longZoi = 'a'.repeat(64);
    const qr = generateFursQrCode(longZoi, '10026642', '2025-01-15T10:30:00Z');
    const decoded = JSON.parse(Buffer.from(qr, 'base64').toString());
    expect(decoded.zoi.length).toBe(32);
  });
});
