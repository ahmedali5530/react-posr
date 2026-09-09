# FURS (Slovenia) Test Certificates

These certificates are downloaded from FURS official site (edavki.durs.si)
for test environment fiscal verification.

## Files

### `blagajne-test.fu.gov.si.cer`
- **Purpose**: TLS server certificate for FURS test environment
- **Source**: https://datoteke.durs.gov.si/dpr/files/blagajne-test.fu.gov.si.cer
- **Used for**: Mutual TLS connection to `blagajne-test.fu.gov.si:9002`
- **Format**: PEM (X.509)

### `DavPotRacTEST.cer`
- **Purpose**: FURS test signing certificate (public key)
- **Source**: https://datoteke.durs.gov.si/dpr/files/DavPotRacTEST.cer
- **Used for**: Verifying FURS response signatures in test environment
- **Format**: PEM (X.509)

## How to use

1. Import these certificates into your trust store
2. Configure `provider:furs` with:
   - `certificateP12`: Your .p12 digital certificate (from eDavki)
   - `certificatePassword`: Your .p12 password
   - `testEnvironment: true`
3. Test connection to `blagajne-test.fu.gov.si:9002`

## Production

For production, download production certificates:
- TLS: https://www.datoteke.fu.gov.si/dpr/files/blagajne.fu.gov.si_2025.cer
- Signing: https://www.datoteke.fu.gov.si/dpr/files/DavPotRac_2025.cer

## Source

Downloaded from: https://edavki.durs.si/Documents/DavcnoPotrjevanjeRacunov.aspx
FURS technical specifications: https://edavki.durs.si
