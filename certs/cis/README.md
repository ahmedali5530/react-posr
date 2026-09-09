# CIS (Croatia) Demo Certificates

CIS (Centralni informacijski sustav) uses FINA-issued certificates
for fiskalizacija (fiscal verification).

## How to obtain demo certificate

The CIS demo certificate is NOT publicly downloadable — it requires
registration with FINA. Follow these steps:

### Step 1: Visit FINA demo PKI portal
- URL: https://demo-pki.fina.hr/certificate-search
- Search for: Vrsta certifikata = "Aplikacijski certifikati"
- Certifikacijsko tijelo (CA) = "FINA Demo CA"

### Step 2: Download demo certificate
- Search for "FiskalciTest" certificate
- Download in PEM format: `/certificate-search/search/pem/FiskalciTest`
- Or DER format: `/certificate-search/search/der/FiskalciTest`

### Step 3: Get your own demo certificate
For testing with your own OIB:
1. Visit https://www.fina.hr/fiskalizacija
2. Download and fill the "Demo aplikacijski certifikat" form
3. Submit to FINA
4. Receive your .pfx demo certificate

### Step 4: Convert .pfx to .pem (if needed)
```bash
openssl pkcs12 -in demo_cert.pfx -out demo_cert.pem -nodes
```

## Test environment

- **Test URL**: `https://cistest.apis-it.hr:8449/FiskalizacijaServiceTest`
- **Production URL**: `https://cis.apis-it.hr:8449/FiskalizacijaService`
- **SOAP action**: `http://apis-it.hr/tns/fiskalizacija/2017-07-25/RacunZahtjev`

## Configuration

Configure `provider:cis` with:
- `certificate`: Your FINA demo certificate (PEM or base64 P12)
- `certificatePassword`: Certificate password
- `oib`: Your 11-digit OIB
- `businessPremiseLabel`: Oznaka poslovnog prostora
- `paymentDeviceLabel`: Oznaka naplatnog uređaja
- `testEnvironment: true`

## Technical specification

Download the official CIS technical specification:
https://porezna-uprava.gov.hr/UserDocsImages/Fiskalizacija/Tehni%C4%8Dke%20specifikacije/Fiskalizacija%20-%20Tehnicka%20specifikacija%20za%20korisnike_v2.7.pdf

## Note

The demo certificate expires periodically (last expiry: July 2026).
Check https://porezna-uprava.gov.hr for updates.
