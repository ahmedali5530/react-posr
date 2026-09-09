-- FURS (Slovenia) + CIS (Croatia) fiscal verification tables
-- Added in v11.22.0 for Slovenian and Croatian fiscal compliance

-- FURS fiscal submissions (Slovenia)
DEFINE TABLE IF NOT EXISTS furs_fiscal_submission TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD IF NOT EXISTS order_id ON furs_fiscal_submission TYPE record<order>;
DEFINE FIELD IF NOT EXISTS invoice_number ON furs_fiscal_submission TYPE string;
DEFINE FIELD IF NOT EXISTS tax_number ON furs_fiscal_submission TYPE string; -- davčna številka (8 digits)
DEFINE FIELD IF NOT EXISTS business_premise_id ON furs_fiscal_submission TYPE string; -- oznaka poslovnega prostora
DEFINE FIELD IF NOT EXISTS electronic_device_id ON furs_fiscal_submission TYPE string; -- oznaka elektronske naprave
DEFINE FIELD IF NOT EXISTS zoi ON furs_fiscal_submission TYPE string; -- zaščitna oznaka izdajatelja
DEFINE FIELD IF NOT EXISTS eor ON furs_fiscal_submission TYPE option<string>; -- enkratna identifikacijska oznaka računa
DEFINE FIELD IF NOT EXISTS qr_code ON furs_fiscal_submission TYPE option<string>; -- base64 QR
DEFINE FIELD IF NOT EXISTS issue_date_time ON furs_fiscal_submission TYPE datetime;
DEFINE FIELD IF NOT EXISTS invoice_amount ON furs_fiscal_submission TYPE decimal;
DEFINE FIELD IF NOT EXISTS payment_amount ON furs_fiscal_submission TYPE decimal;
DEFINE FIELD IF NOT EXISTS status ON furs_fiscal_submission TYPE string; -- pending, confirmed, failed
DEFINE FIELD IF NOT EXISTS error_message ON furs_fiscal_submission TYPE option<string>;
DEFINE FIELD IF NOT EXISTS submitted_at ON furs_fiscal_submission TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS confirmed_at ON furs_fiscal_submission TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS test_environment ON furs_fiscal_submission TYPE bool DEFAULT true;

-- CIS fiscal submissions (Croatia)
DEFINE TABLE IF NOT EXISTS cis_fiscal_submission TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;
DEFINE FIELD IF NOT EXISTS order_id ON cis_fiscal_submission TYPE record<order>;
DEFINE FIELD IF NOT EXISTS invoice_number ON cis_fiscal_submission TYPE string;
DEFINE FIELD IF NOT EXISTS oib ON cis_fiscal_submission TYPE string; -- osobni identifikacijski broj (11 digits)
DEFINE FIELD IF NOT EXISTS business_premise_label ON cis_fiscal_submission TYPE string; -- oznaka poslovnog prostora
DEFINE FIELD IF NOT EXISTS payment_device_label ON cis_fiscal_submission TYPE string; -- oznaka naplatnog uređaja
DEFINE FIELD IF NOT EXISTS zki ON cis_fiscal_submission TYPE string; -- zaštitni kod izdavatelja (32 hex)
DEFINE FIELD IF NOT EXISTS jir ON cis_fiscal_submission TYPE option<string>; -- jedinstveni identifikator računa (36 chars)
DEFINE FIELD IF NOT EXISTS qr_code ON cis_fiscal_submission TYPE option<string>; -- base64 QR
DEFINE FIELD IF NOT EXISTS issue_date_time ON cis_fiscal_submission TYPE datetime;
DEFINE FIELD IF NOT EXISTS total_amount ON cis_fiscal_submission TYPE decimal; -- iznos ukupno
DEFINE FIELD IF NOT EXISTS payment_amount ON cis_fiscal_submission TYPE decimal; -- iznos naplate
DEFINE FIELD IF NOT EXISTS payment_method ON cis_fiscal_submission TYPE string; -- G=kotovina, K=kartica, T=transakcijski
DEFINE FIELD IF NOT EXISTS status ON cis_fiscal_submission TYPE string; -- pending, confirmed, failed
DEFINE FIELD IF NOT EXISTS error_message ON cis_fiscal_submission TYPE option<string>;
DEFINE FIELD IF NOT EXISTS submitted_at ON cis_fiscal_submission TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS confirmed_at ON cis_fiscal_submission TYPE option<datetime>;
DEFINE FIELD IF NOT EXISTS test_environment ON cis_fiscal_submission TYPE bool DEFAULT true;

-- Index for quick lookup by order
DEFINE INDEX IF NOT EXISTS furs_fiscal_submission_order_id ON furs_fiscal_submission COLUMNS order_id;
DEFINE INDEX IF NOT EXISTS furs_fiscal_submission_eor ON furs_fiscal_submission COLUMNS eor;
DEFINE INDEX IF NOT EXISTS furs_fiscal_submission_zoi ON furs_fiscal_submission COLUMNS zoi;
DEFINE INDEX IF NOT EXISTS cis_fiscal_submission_order_id ON cis_fiscal_submission COLUMNS order_id;
DEFINE INDEX IF NOT EXISTS cis_fiscal_submission_jir ON cis_fiscal_submission COLUMNS jir;
DEFINE INDEX IF NOT EXISTS cis_fiscal_submission_zki ON cis_fiscal_submission COLUMNS zki;
