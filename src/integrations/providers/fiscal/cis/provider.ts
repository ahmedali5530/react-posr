/**
 * CIS (Croatia) Fiscal Provider — integrates with CIS SOAP API for
 * fiskalizacija (fiscal verification of invoices).
 */

import { IntegrationProvider, ProviderExecutionContext } from '@/integrations/core/provider.ts';
import {
  IntegrationExecutionRequest,
  IntegrationExecutionResponse,
  IntegrationHealthSnapshot,
  ProviderCapability,
  ProviderConfigurationSchema,
  ProviderManifest,
} from '@/integrations/core/types.ts';
import { nowSurrealDateTime, toJsDate } from '@/lib/datetime.ts';
import {
  CisConfig,
  parseCisConfig,
  validateCisConfig,
  serializeCisInvoice,
  submitCisInvoice,
} from './cis-config.ts';

const schema: ProviderConfigurationSchema = {
  sections: [
    {
      id: 'credentials',
      title: 'FINA certifikat',
      fields: [
        {
          key: 'certificate',
          label: 'FINA certifikat (PEM/P12, base64)',
          type: 'textarea',
          required: true,
          encrypted: true,
          helpText: 'Demo certifikat od APIS-IT (cistest.apis-it.hr)',
        },
        {
          key: 'certificatePassword',
          label: 'Lozinka certifikata',
          type: 'password',
          required: true,
          encrypted: true,
        },
      ],
    },
    {
      id: 'fiscal',
      title: 'Fiskalni podaci',
      fields: [
        {
          key: 'oib',
          label: 'OIB',
          type: 'text',
          required: true,
          helpText: 'Osobni identifikacijski broj (11 znamenki)',
        },
        {
          key: 'businessPremiseLabel',
          label: 'Oznaka poslovnog prostora',
          type: 'text',
          required: true,
        },
        {
          key: 'paymentDeviceLabel',
          label: 'Oznaka naplatnog uređaja',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      id: 'runtime',
      title: 'Runtime',
      fields: [
        {
          key: 'testEnvironment',
          label: 'Testno okruženje',
          type: 'switch',
          defaultValue: true,
          helpText: 'Upotrijebi cistest.apis-it.hr umjesto produkcijskog',
        },
        {
          key: 'apiBaseUrl',
          label: 'API URL (produkcija)',
          type: 'text',
          defaultValue: 'https://cis.apis-it.hr:8449/FiskalizacijaService',
        },
        {
          key: 'requestTimeoutSeconds',
          label: 'Timeout (sekunde)',
          type: 'number',
          defaultValue: 30,
        },
        {
          key: 'qrPriority',
          label: 'QR prioritet',
          type: 'number',
          defaultValue: 55,
        },
      ],
    },
  ],
};

const manifest: ProviderManifest = {
  id: 'provider:cis',
  name: 'cis',
  displayName: 'CIS Hrvaška',
  category: 'fiscal',
  version: '1.0.0',
  providerVersion: '1.0.0',
  minimumFrameworkVersion: '1.0.0',
  country: 'HR',
  authority: 'Porezna uprava',
  supportedFeatures: ['invoiceSubmission', 'invoiceVoid'],
  supportedEvents: ['InvoiceCreated', 'InvoiceVoided'],
  offlineSupport: true,
  requiresInternet: true,
  requiresAuthentication: true,
  authenticationType: 'certificate',
  supportsQueue: true,
  supportsRetry: true,
  supportsWebhooks: false,
  supportsCertificates: true,
  supportsBackgroundJobs: true,
  configurationSchema: schema,
};

export class CisProvider implements IntegrationProvider {
  private config: CisConfig | null = null;

  async initialize() {}
  async shutdown() {}

  getManifest() {
    return manifest;
  }

  getConfigurationSchema() {
    return schema;
  }

  getCapabilities(): ProviderCapability[] {
    return ['execute', 'health', 'queue', 'retry', 'configuration', 'events', 'certificates'];
  }

  supports(capability: ProviderCapability) {
    return this.getCapabilities().includes(capability);
  }

  async validate() {
    this.config = parseCisConfig(await this.loadConfig());
    const result = validateCisConfig(this.config);
    return result;
  }

  private loadConfig = async (): Promise<any> => {
    return {};
  };

  setConfigLoader(loader: () => Promise<any>) {
    this.loadConfig = loader;
  }

  async healthCheck(): Promise<IntegrationHealthSnapshot> {
    const validation = await this.validate();
    return {
      providerId: manifest.id,
      status: validation.valid ? 'connected' : 'disconnected',
      authenticationStatus: validation.valid ? 'valid' : 'invalid',
      averageResponseTimeMs: 200,
      pendingJobs: 0,
      failedJobs: 0,
      lastSynchronization: toJsDate(nowSurrealDateTime()).toISOString(),
      version: manifest.providerVersion,
      updatedAt: toJsDate(nowSurrealDateTime()).toISOString(),
      errors: validation.errors,
    };
  }

  async execute(
    request: IntegrationExecutionRequest,
    _context: ProviderExecutionContext,
  ): Promise<IntegrationExecutionResponse> {
    if (!this.config) {
      this.config = parseCisConfig(await this.loadConfig());
    }

    const payload: any = request.payload?.eventPayload ?? request.payload ?? {};
    const order = payload.order ?? payload;
    const invoiceNumber = String(payload.invoiceNumber ?? payload.posrOrderId ?? `INV-${Date.now()}`);

    const invoice = serializeCisInvoice(order, this.config, invoiceNumber);
    const result = await submitCisInvoice(invoice, this.config);

    return {
      success: result.success,
      status: result.success ? 'completed' : 'failed',
      providerId: manifest.id,
      data: result.success
        ? {
            jir: result.jir,
            zki: result.zki,
            qrcode: result.qrCode,
            qrPriority: this.config.qrPriority,
          }
        : undefined,
      error: result.error,
      retriable: result.retriable,
    };
  }
}
