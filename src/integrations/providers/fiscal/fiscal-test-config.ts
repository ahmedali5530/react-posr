/**
 * FURS (Slovenia) + CIS (Croatia) fiscal provider default configuration.
 *
 * Pre-configured with test environment settings and certificate paths.
 * Production use requires real certificates from FURS/FINA.
 */

export const FURS_TEST_CONFIG = {
  providerId: 'provider:furs',
  testEnvironment: true,
  apiBaseUrl: 'https://blagajne-test.fu.gov.si:9002',
  productionApiBaseUrl: 'https://blagajne.fu.gov.si:9002',
  // Test TLS certificate (downloaded from datoteke.durs.gov.si)
  tlsCertificatePath: 'certs/furs/blagajne-test.fu.gov.si.cer',
  // Test signing certificate (downloaded from datoteke.durs.gov.si)
  signingCertificatePath: 'certs/furs/DavPotRacTEST.cer',
  // Slovenian VAT rates
  vatRates: {
    standard: 22,      // DDV (davek na dodano vrednost)
    reduced: 9.5,      // Nižja stopnja (živila, knjige)
    special: 5,        // Posebna stopnja (časopisi)
  },
  // Default test values (replace with real values for production)
  defaults: {
    taxNumber: '10026642',      // FURS test tax number
    businessPremiseId: 'PE1',   // Poslovni prostor 1
    electronicDeviceId: 'B1',   // Blagajna 1
  },
};

export const CIS_TEST_CONFIG = {
  providerId: 'provider:cis',
  testEnvironment: true,
  apiBaseUrl: 'https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest',
  productionApiBaseUrl: 'https://cis.apis-it.hr:8449/FiskalizacijaService',
  // FINA demo certificate (must be obtained from demo-pki.fina.hr)
  certificatePath: 'certs/cis/FinaDemoSubCA.cer',
  // Croatian PDV rates
  pdvRates: {
    standard: 25,      // PDV (porez na dodanu vrijednost)
    reduced: 13,       // Niža stopnja (živila, knjige)
    special: 5,        // Posebna stopnja (novine)
  },
  // Default test values (replace with real values for production)
  defaults: {
    oib: '12345678901',            // Test OIB (11 digits)
    businessPremiseLabel: 'PP1',   // Poslovni prostor 1
    paymentDeviceLabel: 'NU1',     // Naplatni uređaj 1
  },
  // SOAP action for racun submission
  soapAction: 'http://apis-it.hr/tns/fiskalizacija/2017-07-25/RacunZahtjev',
};

/**
 * Get FURS configuration for test or production environment.
 */
export const getFursConfig = (testEnv: boolean = true) => ({
  ...FURS_TEST_CONFIG,
  testEnvironment: testEnv,
  apiBaseUrl: testEnv
    ? FURS_TEST_CONFIG.apiBaseUrl
    : FURS_TEST_CONFIG.productionApiBaseUrl,
});

/**
 * Get CIS configuration for test or production environment.
 */
export const getCisConfig = (testEnv: boolean = true) => ({
  ...CIS_TEST_CONFIG,
  testEnvironment: testEnv,
  apiBaseUrl: testEnv
    ? CIS_TEST_CONFIG.apiBaseUrl
    : CIS_TEST_CONFIG.productionApiBaseUrl,
});

/**
 * Fiscal provider registry — all supported fiscal authorities.
 */
export const FISCAL_PROVIDERS = {
  // Pakistan
  fbr: { id: 'provider:fbr', country: 'PK', authority: 'FBR', currency: 'PKR' },
  pra: { id: 'provider:pra', country: 'PK', authority: 'PRA', currency: 'PKR' },
  // Slovenia
  furs: { id: 'provider:furs', country: 'SI', authority: 'FURS', currency: 'EUR' },
  // Croatia
  cis: { id: 'provider:cis', country: 'HR', authority: 'Porezna uprava', currency: 'EUR' },
} as const;

export type FiscalProviderId = keyof typeof FISCAL_PROVIDERS;
