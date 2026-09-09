/**
 * FURS (Slovenia) Fiscal Provider — integrates with FURS SOAP API for
 * davčno potrjevanje računov (fiscal verification of invoices).
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
  FursConfig,
  parseFursConfig,
  validateFursConfig,
  serializeFursInvoice,
  submitFursInvoice,
} from './furs-config.ts';

const schema: ProviderConfigurationSchema = {
  sections: [
    {
      id: 'credentials',
      title: 'Digitalno potrdilo',
      fields: [
        {
          key: 'certificateP12',
          label: 'Certifikat (.p12, base64)',
          type: 'textarea',
          required: true,
          encrypted: true,
          helpText: 'Digitalno potrdilo od FURS (test: blagajne-test.fu.gov.si.cer)',
        },
        {
          key: 'certificatePassword',
          label: 'Geslo certifikata',
          type: 'password',
          required: true,
          encrypted: true,
        },
      ],
    },
    {
      id: 'fiscal',
      title: 'Fiskalni podatki',
      fields: [
        {
          key: 'taxNumber',
          label: 'Davčna številka',
          type: 'text',
          required: true,
          helpText: '8-mestna davčna številka izdajatelja',
        },
        {
          key: 'businessPremiseId',
          label: 'Oznaka poslovnega prostora',
          type: 'text',
          required: true,
        },
        {
          key: 'electronicDeviceId',
          label: 'Oznaka elektronske naprave',
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
          label: 'Testno okolje',
          type: 'switch',
          defaultValue: true,
          helpText: 'Uporabi blagajne-test.fu.gov.si namesto produkcijskega',
        },
        {
          key: 'apiBaseUrl',
          label: 'API Base URL (produkcija)',
          type: 'text',
          defaultValue: 'https://blagajne.fu.gov.si:9002',
        },
        {
          key: 'requestTimeoutSeconds',
          label: 'Timeout (sekunde)',
          type: 'number',
          defaultValue: 30,
        },
        {
          key: 'qrPriority',
          label: 'QR prioriteta',
          type: 'number',
          defaultValue: 60,
        },
      ],
    },
  ],
};

const manifest: ProviderManifest = {
  id: 'provider:furs',
  name: 'furs',
  displayName: 'FURS Slovenija',
  category: 'fiscal',
  version: '1.0.0',
  providerVersion: '1.0.0',
  minimumFrameworkVersion: '1.0.0',
  country: 'SI',
  authority: 'FURS',
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

export class FursProvider implements IntegrationProvider {
  private config: FursConfig | null = null;

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
    this.config = parseFursConfig(await this.loadConfig());
    const result = validateFursConfig(this.config);
    return result;
  }

  private loadConfig = async (): Promise<any> => {
    // In real implementation, load from integration_provider_config table
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
      this.config = parseFursConfig(await this.loadConfig());
    }

    const payload: any = request.payload?.eventPayload ?? request.payload ?? {};
    const order = payload.order ?? payload;
    const invoiceNumber = String(payload.invoiceNumber ?? payload.posrOrderId ?? `INV-${Date.now()}`);

    const invoice = serializeFursInvoice(order, this.config, invoiceNumber);
    const result = await submitFursInvoice(invoice, this.config);

    return {
      success: result.success,
      status: result.success ? 'completed' : 'failed',
      providerId: manifest.id,
      data: result.success
        ? {
            eor: result.eor,
            zoi: result.zoi,
            qrcode: result.qrCode,
            qrPriority: this.config.qrPriority,
          }
        : undefined,
      error: result.error,
      retriable: result.retriable,
    };
  }
}
