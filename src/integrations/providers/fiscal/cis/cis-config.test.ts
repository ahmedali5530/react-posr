import { describe, expect, it } from 'vitest';
import {
  parseCisConfig,
  validateCisConfig,
  serializeCisInvoice,
  generateCisZki,
  generateCisQrCode,
  mapCisPaymentMethod,
  type CisConfig,
} from './cis-config.ts';

const testConfig: CisConfig = {
  certificate: 'fake-fina-cert-base64',
  certificatePassword: 'test123',
  apiBaseUrl: 'https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest',
  oib: '12345678901',
  businessPremiseLabel: 'PP1',
  paymentDeviceLabel: 'NU1',
  testEnvironment: true,
  requestTimeoutSeconds: 30,
  qrPriority: 55,
};

const testOrder = {
  id: 'order:1',
  invoice_number: 1,
  items: [
    { id: 'item:1', name: 'Kava', quantity: 2, price: 1.20, tax_rate: 25 },
    { id: 'item:2', name: 'Burek', quantity: 1, price: 2.50, tax_rate: 25 },
  ],
};

describe('CIS config parsing', () => {
  it('parses valid config', () => {
    const config = parseCisConfig({
      certificate: 'cert',
      certificatePassword: 'pass',
      oib: '12345678901',
      businessPremiseLabel: 'PP1',
      paymentDeviceLabel: 'NU1',
      testEnvironment: true,
    });
    expect(config.oib).toBe('12345678901');
    expect(config.testEnvironment).toBe(true);
    expect(config.apiBaseUrl).toBe('https://cis.apis-it.hr:8449/FiskalizacijaService');
  });

  it('applies defaults for missing fields', () => {
    const config = parseCisConfig({});
    expect(config.requestTimeoutSeconds).toBe(30);
    expect(config.qrPriority).toBe(55);
    expect(config.testEnvironment).toBe(true);
  });
});

describe('CIS config validation', () => {
  it('validates complete config', () => {
    const result = validateCisConfig(testConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects invalid OIB (not 11 digits)', () => {
    const result = validateCisConfig({ ...testConfig, oib: '123' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('OIB must be 11 digits');
  });

  it('rejects missing business premise label', () => {
    const result = validateCisConfig({ ...testConfig, businessPremiseLabel: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Oznaka poslovnog prostora is required');
  });

  it('rejects missing payment device label', () => {
    const result = validateCisConfig({ ...testConfig, paymentDeviceLabel: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Oznaka naplatnog uređaja is required');
  });

  it('rejects missing certificate', () => {
    const result = validateCisConfig({ ...testConfig, certificate: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('FINA certificate is required');
  });
});

describe('CIS invoice serialization', () => {
  it('serializes order into CIS payload', () => {
    const invoice = serializeCisInvoice(testOrder, testConfig, 'RAC-001');
    expect(invoice.BrojRacuna).toBe('RAC-001');
    expect(invoice.Oib).toBe('12345678901');
    expect(invoice.OznakaPoslovnogProstora).toBe('PP1');
    expect(invoice.OznakaNaplatnogUredaja).toBe('NU1');
    expect(invoice.Stavke).toHaveLength(2);
    expect(invoice.Stavke[0].Naziv).toBe('Kava');
    expect(invoice.Stavke[0].Kolicina).toBe(2);
    expect(invoice.Stavke[0].Cijena).toBe(1.20);
    expect(invoice.Stavke[0].PorezStopa).toBe(25);
  });

  it('calculates total amount correctly', () => {
    const invoice = serializeCisInvoice(testOrder, testConfig, 'RAC-001');
    // 2 × 1.20 + 1 × 2.50 = 4.90
    expect(invoice.IznosUkupno).toBe(4.90);
    expect(invoice.IznosNaplate).toBe(4.90);
  });

  it('groups taxes by rate', () => {
    const invoice = serializeCisInvoice(testOrder, testConfig, 'RAC-001');
    expect(invoice.Porezi).toHaveLength(1); // all 25%
    expect(invoice.Porezi[0].Stopa).toBe(25);
    expect(invoice.Porezi[0].Osnovica).toBe(4.90);
  });

  it('generates ZKI during serialization', () => {
    const invoice = serializeCisInvoice(testOrder, testConfig, 'RAC-001');
    expect(invoice.ZastitniKod).toBeTruthy();
    expect(invoice.ZastitniKod.length).toBe(32); // MD5 hex = 32 chars
  });
});

describe('CIS ZKI generation', () => {
  it('generates 32-char hex ZKI', () => {
    const zki = generateCisZki({
      oib: '12345678901',
      datumIzdavanja: '2025-01-15T10:30:00.000Z',
      brojRacuna: 'RAC-001',
      oznakaPoslovnogProstora: 'PP1',
      oznakaNaplatnogUredaja: 'NU1',
      iznosUkupno: 4.90,
    });
    expect(zki).toHaveLength(32);
    expect(zki).toMatch(/^[0-9A-F]{32}$/); // uppercase hex
  });

  it('generates consistent ZKI for same input', () => {
    const input = {
      oib: '12345678901',
      datumIzdavanja: '2025-01-15T10:30:00.000Z',
      brojRacuna: 'RAC-001',
      oznakaPoslovnogProstora: 'PP1',
      oznakaNaplatnogUredaja: 'NU1',
      iznosUkupno: 4.90,
    };
    const zki1 = generateCisZki(input);
    const zki2 = generateCisZki(input);
    expect(zki1).toBe(zki2);
  });

  it('generates different ZKI for different amounts', () => {
    const zki1 = generateCisZki({
      oib: '12345678901', datumIzdavanja: '2025-01-15T10:30:00Z', brojRacuna: 'RAC-001',
      oznakaPoslovnogProstora: 'PP1', oznakaNaplatnogUredaja: 'NU1', iznosUkupno: 4.90,
    });
    const zki2 = generateCisZki({
      oib: '12345678901', datumIzdavanja: '2025-01-15T10:30:00Z', brojRacuna: 'RAC-001',
      oznakaPoslovnogProstora: 'PP1', oznakaNaplatnogUredaja: 'NU1', iznosUkupno: 10.00,
    });
    expect(zki1).not.toBe(zki2);
  });
});

describe('CIS QR code generation', () => {
  it('generates base64 QR code with ZKI and JIR', () => {
    const qr = generateCisQrCode('ABCDEF1234567890ABCDEF1234567890', 'test-jir-123');
    expect(qr).toBeTruthy();
    const decoded = JSON.parse(Buffer.from(qr, 'base64').toString());
    expect(decoded.zki).toBe('ABCDEF1234567890ABCDEF1234567890');
    expect(decoded.jir).toBe('test-jir-123');
  });

  it('handles undefined JIR', () => {
    const qr = generateCisQrCode('ABCDEF1234567890ABCDEF1234567890', undefined);
    const decoded = JSON.parse(Buffer.from(qr, 'base64').toString());
    expect(decoded.zki).toBeTruthy();
    expect(decoded.jir).toBeUndefined();
  });
});

describe('CIS payment method mapping', () => {
  it('maps cash payment to G', () => {
    expect(mapCisPaymentMethod({ payment_type: 'cash' })).toBe('G');
    expect(mapCisPaymentMethod({ payment_type: 'gotovina' })).toBe('G');
  });

  it('maps card payment to K', () => {
    expect(mapCisPaymentMethod({ payment_type: 'card' })).toBe('K');
    expect(mapCisPaymentMethod({ payment_type: 'kartica' })).toBe('K');
  });

  it('maps bank transfer to T', () => {
    expect(mapCisPaymentMethod({ payment_type: 'bank' })).toBe('T');
    expect(mapCisPaymentMethod({ payment_type: 'transaction' })).toBe('T');
  });

  it('defaults to G for unknown payment type', () => {
    expect(mapCisPaymentMethod({ payment_type: 'unknown' })).toBe('G');
    expect(mapCisPaymentMethod({})).toBe('G');
  });
});
