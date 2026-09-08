/**
 * AI Restaurant Data Monetization & API Revenue Optimizer — predicts how
 * data monetization strategies (API sales, data licensing, data marketplace,
 * third-party integrations, customer segmentation for sale, benchmarking
 * data, predictive models as API, market research data, privacy/compliance,
 * pricing strategy, partner ecosystem) impact new recurring revenue,
 * strategic partnerships, competitive advantage, and data asset valuation.
 *
 * Restaurant data monetization market = $10B+ by 2025 (Gartner). API
 * economy = $4.2T by 2026 (McKinsey). 35% of enterprises already monetize
 * data (Forrester). Average API revenue for platforms = $100k-1M/year.
 * Data licensing = $50k-500k/year for segmented datasets. Third-party
 * integrations (DoorDash, Uber Eats, loyalty platforms) = $10k-100k/
 * partner/year. Benchmarking data = $20k-100k/year for industry analytics.
 * Predictive models as API = $50k-200k/year (forecasting, demand
 * prediction). Restaurants collect terabytes of data daily (orders,
 * preferences, traffic, transactions). 72% of customers expect
 * personalization = data is valuable. Restaurant data premium = realtime,
 * geo-located, behavioral. Data monetization types = API access
 * (developers pay per call), data licensing (bulk dataset sale), data
 * marketplace (exchange), benchmarking reports (industry insights),
 * predictive API (forecasting, demand prediction), customer segments
 * (anonymized audiences). Privacy compliance (GDPR, CCPA, CPRA) =
 * mandatory for monetization. Data anonymization required (no PII).
 * Partner ecosystem = delivery platforms, loyalty networks, payment
 * processors, marketing agencies, research firms. Data valuation =
 * $0.01-0.10 per record for anonymized customer data. Data ROI = $5-20
 * per $1 invested in data infrastructure. 60% of data monetization
 * revenue comes from API access, 25% from licensing, 15% from
 * marketplace/benchmarking.
 *
 * 209th POSR-exclusive differentiator. Distinct from:
 *   - competitor-intelligence.service — TRACKS competitors (consumes data).
 *     This optimizer focuses on SELLING data (produces revenue).
 *   - branch-comparison.service — compares OWN branches (internal). This
 *     optimizer focuses on selling benchmarking data to OTHERS.
 *   - multi-location-benchmark.service — benchmarks OWN locations. This
 *     optimizer sells benchmarking as a service.
 *   - segmentation.service — segments OWN customers (internal use). This
 *     optimizer sells anonymized customer segments.
 *   - marketing.service — MARKETING campaigns (uses data). This optimizer
 *     focuses on data as PRODUCT (sells data).
 *   - cross-channel-attribution.service — attributes MARKETING channels.
 *     This optimizer focuses on data attribution as API product.
 *   - loyalty-roi.service — loyalty program ROI (internal). This optimizer
 *     focuses on loyalty data as monetizable asset.
 *   - social-listening-monitor.service — MONITORS social mentions. This
 *     optimizer sells social listening data to others.
 *   - carbon-footprint-tracker.service — TRACKS carbon (internal). This
 *     optimizer could sell carbon data to ESG investors.
 *
 * 8 AI rules:
 *   1. data_monetization_strategy_absent -> no data monetization -> missed $10B market
 *   2. api_revenue_program_absent -> no API program -> missed $100k-1M/year
 *   3. data_licensing_program_absent -> no data licensing -> missed $50k-500k/year
 *   4. third_party_integration_ecosystem_thin -> thin partner ecosystem -> missed $10k-100k/partner
 *   5. benchmarking_data_product_absent -> no benchmarking product -> missed $20k-100k/year
 *   6. predictive_model_api_absent -> no predictive API -> missed $50k-200k/year
 *   7. privacy_compliance_program_weak -> weak privacy -> legal risk + lost deals
 *   8. data_valuation_tracking_absent -> no data valuation -> can't optimize pricing
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type DataMonetizationRuleId =
  | 'data_monetization_strategy_absent'
  | 'api_revenue_program_absent'
  | 'data_licensing_program_absent'
  | 'third_party_integration_ecosystem_thin'
  | 'benchmarking_data_product_absent'
  | 'predictive_model_api_absent'
  | 'privacy_compliance_program_weak'
  | 'data_valuation_tracking_absent';

export type DataMonetizationAiRec =
  'launch_data_monetization_strategy'
  | 'launch_api_revenue_program'
  | 'launch_data_licensing'
  | 'expand_partner_ecosystem'
  | 'launch_benchmarking_product'
  | 'launch_predictive_api'
  | 'strengthen_privacy_compliance'
  | 'implement_data_valuation'
  | 'monitor'
  | 'skip';

export interface DataMonetizationAlert {
  id?: string;
  rule_id: DataMonetizationRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  // Data monetization strategy
  has_data_monetization_strategy?: boolean;
  data_assets_count?: number;
  data_volume_tb_monthly?: number;
  data_quality_score?: number;
  // API revenue
  has_api_revenue_program?: boolean;
  api_endpoints_count?: number;
  api_call_volume_monthly?: number;
  api_revenue_monthly?: number;
  api_revenue_target_monthly?: number;
  api_pricing_model?: string;
  api_developer_count?: number;
  // Data licensing
  has_data_licensing_program?: boolean;
  licensed_datasets_count?: number;
  licensing_revenue_monthly?: number;
  licensing_target_monthly?: number;
  licensing_customers_count?: number;
  // Third-party integrations
  has_partner_ecosystem?: boolean;
  partner_count?: number;
  partner_target_count?: number;
  partner_revenue_monthly?: number;
  partner_types?: string;
  // Benchmarking product
  has_benchmarking_product?: boolean;
  benchmarking_customers_count?: number;
  benchmarking_revenue_monthly?: number;
  benchmarking_target_monthly?: number;
  benchmark_report_frequency?: string;
  // Predictive model API
  has_predictive_model_api?: boolean;
  predictive_models_count?: number;
  predictive_api_revenue_monthly?: number;
  predictive_api_target_monthly?: number;
  predictive_model_types?: string;
  // Privacy compliance
  has_privacy_compliance_program?: boolean;
  privacy_compliance_score?: number;
  gdpr_compliant?: boolean;
  ccpa_compliant?: boolean;
  anonymization_score?: number;
  consent_management_present?: boolean;
  // Data valuation
  has_data_valuation_tracking?: boolean;
  data_asset_valuation?: number;
  data_value_per_record?: number;
  valuation_frequency_months?: number;
  // Revenue metrics
  total_data_revenue_monthly?: number;
  data_revenue_growth_pct?: number;
  data_revenue_as_pct_of_total?: number;
  competitor_data_monetization_score?: number;
  monthly_revenue?: number;
  total_customers?: number;
  total_orders_monthly?: number;
  // Costs
  data_infrastructure_cost_monthly?: number;
  api_development_cost_monthly?: number;
  compliance_cost_monthly?: number;
  // Impact projections
  data_revenue_growth_projected_pct?: number;
  api_revenue_projected?: number;
  licensing_revenue_projected?: number;
  partner_revenue_projected?: number;
  benchmarking_revenue_projected?: number;
  predictive_revenue_projected?: number;
  compliance_risk_reduction_projected_pct?: number;
  data_valuation_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: DataMonetizationAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface DataMonetizationConfig {
  aiEnabled: boolean;
  requireDataMonetizationStrategy: boolean;
  requireApiRevenueProgram: boolean;
  requireDataLicensingProgram: boolean;
  requirePartnerEcosystem: boolean;
  requireBenchmarkingProduct: boolean;
  requirePredictiveModelApi: boolean;
  requirePrivacyComplianceProgram: boolean;
  requireDataValuationTracking: boolean;
  minDataQualityScore: number;
  minApiCallVolumeMonthly: number;
  minPartnerCount: number;
  minPrivacyComplianceScore: number;
  minAnonymizationScore: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_DATA_MONETIZATION_CONFIG: DataMonetizationConfig = {
  aiEnabled: true,
  requireDataMonetizationStrategy: true,
  requireApiRevenueProgram: true,
  requireDataLicensingProgram: true,
  requirePartnerEcosystem: true,
  requireBenchmarkingProduct: true,
  requirePredictiveModelApi: true,
  requirePrivacyComplianceProgram: true,
  requireDataValuationTracking: true,
  minDataQualityScore: 80,
  minApiCallVolumeMonthly: 10000,
  minPartnerCount: 3,
  minPrivacyComplianceScore: 85,
  minAnonymizationScore: 90,
  preferCompetitorParity: true,
};

export const readDataMonetizationConfig = (settings: any): DataMonetizationConfig => ({
  aiEnabled: settings?.data_monetization_ai_enabled ?? true,
  requireDataMonetizationStrategy: settings?.data_monetization_require_strategy ?? true,
  requireApiRevenueProgram: settings?.data_monetization_require_api ?? true,
  requireDataLicensingProgram: settings?.data_monetization_require_licensing ?? true,
  requirePartnerEcosystem: settings?.data_monetization_require_partner ?? true,
  requireBenchmarkingProduct: settings?.data_monetization_require_benchmarking ?? true,
  requirePredictiveModelApi: settings?.data_monetization_require_predictive ?? true,
  requirePrivacyComplianceProgram: settings?.data_monetization_require_privacy ?? true,
  requireDataValuationTracking: settings?.data_monetization_require_valuation ?? true,
  minDataQualityScore: safeNumber(settings?.data_monetization_min_quality, 80),
  minApiCallVolumeMonthly: safeNumber(settings?.data_monetization_min_api_volume, 10000),
  minPartnerCount: safeNumber(settings?.data_monetization_min_partners, 3),
  minPrivacyComplianceScore: safeNumber(settings?.data_monetization_min_privacy, 85),
  minAnonymizationScore: safeNumber(settings?.data_monetization_min_anonymization, 90),
  preferCompetitorParity: settings?.data_monetization_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface DataMonetizationData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_data_monetization_strategy: boolean;
  data_assets_count: number;
  data_volume_tb_monthly: number;
  data_quality_score: number;
  has_api_revenue_program: boolean;
  api_endpoints_count: number;
  api_call_volume_monthly: number;
  api_revenue_monthly: number;
  api_revenue_target_monthly: number;
  api_pricing_model: string;
  api_developer_count: number;
  has_data_licensing_program: boolean;
  licensed_datasets_count: number;
  licensing_revenue_monthly: number;
  licensing_target_monthly: number;
  licensing_customers_count: number;
  has_partner_ecosystem: boolean;
  partner_count: number;
  partner_target_count: number;
  partner_revenue_monthly: number;
  partner_types: string;
  has_benchmarking_product: boolean;
  benchmarking_customers_count: number;
  benchmarking_revenue_monthly: number;
  benchmarking_target_monthly: number;
  benchmark_report_frequency: string;
  has_predictive_model_api: boolean;
  predictive_models_count: number;
  predictive_api_revenue_monthly: number;
  predictive_api_target_monthly: number;
  predictive_model_types: string;
  has_privacy_compliance_program: boolean;
  privacy_compliance_score: number;
  gdpr_compliant: boolean;
  ccpa_compliant: boolean;
  anonymization_score: number;
  consent_management_present: boolean;
  has_data_valuation_tracking: boolean;
  data_asset_valuation: number;
  data_value_per_record: number;
  valuation_frequency_months: number;
  total_data_revenue_monthly: number;
  data_revenue_growth_pct: number;
  data_revenue_as_pct_of_total: number;
  competitor_data_monetization_score: number;
  monthly_revenue: number;
  total_customers: number;
  total_orders_monthly: number;
  data_infrastructure_cost_monthly: number;
  api_development_cost_monthly: number;
  compliance_cost_monthly: number;
}

const MOCK_DATA: DataMonetizationData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_data_monetization_strategy: false, data_assets_count: 0,
    data_volume_tb_monthly: 0.4, data_quality_score: 42,
    has_api_revenue_program: false, api_endpoints_count: 0,
    api_call_volume_monthly: 0, api_revenue_monthly: 0,
    api_revenue_target_monthly: 12000, api_pricing_model: 'none',
    api_developer_count: 0,
    has_data_licensing_program: false, licensed_datasets_count: 0,
    licensing_revenue_monthly: 0, licensing_target_monthly: 8000,
    licensing_customers_count: 0,
    has_partner_ecosystem: false, partner_count: 1,
    partner_target_count: 5, partner_revenue_monthly: 200,
    partner_types: 'delivery_only',
    has_benchmarking_product: false, benchmarking_customers_count: 0,
    benchmarking_revenue_monthly: 0, benchmarking_target_monthly: 3000,
    benchmark_report_frequency: 'none',
    has_predictive_model_api: false, predictive_models_count: 0,
    predictive_api_revenue_monthly: 0, predictive_api_target_monthly: 5000,
    predictive_model_types: 'none',
    has_privacy_compliance_program: false, privacy_compliance_score: 38,
    gdpr_compliant: false, ccpa_compliant: false,
    anonymization_score: 22, consent_management_present: false,
    has_data_valuation_tracking: false, data_asset_valuation: 0,
    data_value_per_record: 0, valuation_frequency_months: 0,
    total_data_revenue_monthly: 200, data_revenue_growth_pct: 0,
    data_revenue_as_pct_of_total: 0.2,
    competitor_data_monetization_score: 58,
    monthly_revenue: 86000, total_customers: 2800,
    total_orders_monthly: 4200,
    data_infrastructure_cost_monthly: 300, api_development_cost_monthly: 0,
    compliance_cost_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_data_monetization_strategy: true, data_assets_count: 4,
    data_volume_tb_monthly: 1.8, data_quality_score: 68,
    has_api_revenue_program: false, api_endpoints_count: 2,
    api_call_volume_monthly: 800, api_revenue_monthly: 0,
    api_revenue_target_monthly: 12000, api_pricing_model: 'free',
    api_developer_count: 3,
    has_data_licensing_program: false, licensed_datasets_count: 0,
    licensing_revenue_monthly: 0, licensing_target_monthly: 8000,
    licensing_customers_count: 0,
    has_partner_ecosystem: true, partner_count: 3,
    partner_target_count: 6, partner_revenue_monthly: 1800,
    partner_types: 'delivery,loyalty,payment',
    has_benchmarking_product: false, benchmarking_customers_count: 0,
    benchmarking_revenue_monthly: 0, benchmarking_target_monthly: 3000,
    benchmark_report_frequency: 'none',
    has_predictive_model_api: false, predictive_models_count: 1,
    predictive_api_revenue_monthly: 0, predictive_api_target_monthly: 5000,
    predictive_model_types: 'demand_forecast_internal',
    has_privacy_compliance_program: false, privacy_compliance_score: 52,
    gdpr_compliant: false, ccpa_compliant: true,
    anonymization_score: 48, consent_management_present: false,
    has_data_valuation_tracking: false, data_asset_valuation: 0,
    data_value_per_record: 0, valuation_frequency_months: 0,
    total_data_revenue_monthly: 1800, data_revenue_growth_pct: 15,
    data_revenue_as_pct_of_total: 1.2,
    competitor_data_monetization_score: 72,
    monthly_revenue: 152000, total_customers: 6200,
    total_orders_monthly: 9800,
    data_infrastructure_cost_monthly: 800, api_development_cost_monthly: 400,
    compliance_cost_monthly: 100,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_data_monetization_strategy: true, data_assets_count: 8,
    data_volume_tb_monthly: 3.2, data_quality_score: 82,
    has_api_revenue_program: true, api_endpoints_count: 6,
    api_call_volume_monthly: 45000, api_revenue_monthly: 8500,
    api_revenue_target_monthly: 12000, api_pricing_model: 'tiered',
    api_developer_count: 18,
    has_data_licensing_program: true, licensed_datasets_count: 3,
    licensing_revenue_monthly: 6200, licensing_target_monthly: 8000,
    licensing_customers_count: 4,
    has_partner_ecosystem: true, partner_count: 6,
    partner_target_count: 6, partner_revenue_monthly: 4200,
    partner_types: 'delivery,loyalty,payment,marketing,research,analytics',
    has_benchmarking_product: true, benchmarking_customers_count: 8,
    benchmarking_revenue_monthly: 2400, benchmarking_target_monthly: 3000,
    benchmark_report_frequency: 'quarterly',
    has_predictive_model_api: true, predictive_models_count: 3,
    predictive_api_revenue_monthly: 3800, predictive_api_target_monthly: 5000,
    predictive_model_types: 'demand_forecast,churn_prediction,price_optimization',
    has_privacy_compliance_program: true, privacy_compliance_score: 86,
    gdpr_compliant: true, ccpa_compliant: true,
    anonymization_score: 92, consent_management_present: true,
    has_data_valuation_tracking: true, data_asset_valuation: 480000,
    data_value_per_record: 0.04, valuation_frequency_months: 6,
    total_data_revenue_monthly: 25100, data_revenue_growth_pct: 32,
    data_revenue_as_pct_of_total: 12.5,
    competitor_data_monetization_score: 80,
    monthly_revenue: 201000, total_customers: 9800,
    total_orders_monthly: 15800,
    data_infrastructure_cost_monthly: 1800, api_development_cost_monthly: 1200,
    compliance_cost_monthly: 400,
  },
  {
    location_id: 'location_2', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'mixed',
    has_data_monetization_strategy: true, data_assets_count: 14,
    data_volume_tb_monthly: 6.8, data_quality_score: 94,
    has_api_revenue_program: true, api_endpoints_count: 12,
    api_call_volume_monthly: 180000, api_revenue_monthly: 28000,
    api_revenue_target_monthly: 12000, api_pricing_model: 'tiered_usage',
    api_developer_count: 48,
    has_data_licensing_program: true, licensed_datasets_count: 6,
    licensing_revenue_monthly: 14500, licensing_target_monthly: 8000,
    licensing_customers_count: 9,
    has_partner_ecosystem: true, partner_count: 10,
    partner_target_count: 6, partner_revenue_monthly: 8200,
    partner_types: 'delivery,loyalty,payment,marketing,research,analytics,media,ad_tech,consulting,franchise',
    has_benchmarking_product: true, benchmarking_customers_count: 22,
    benchmarking_revenue_monthly: 5800, benchmarking_target_monthly: 3000,
    benchmark_report_frequency: 'monthly',
    has_predictive_model_api: true, predictive_models_count: 6,
    predictive_api_revenue_monthly: 9200, predictive_api_target_monthly: 5000,
    predictive_model_types: 'demand_forecast,churn_prediction,price_optimization,menu_engineering,labor_forecast,weather_impact',
    has_privacy_compliance_program: true, privacy_compliance_score: 95,
    gdpr_compliant: true, ccpa_compliant: true,
    anonymization_score: 98, consent_management_present: true,
    has_data_valuation_tracking: true, data_asset_valuation: 1850000,
    data_value_per_record: 0.08, valuation_frequency_months: 3,
    total_data_revenue_monthly: 65700, data_revenue_growth_pct: 48,
    data_revenue_as_pct_of_total: 24.8,
    competitor_data_monetization_score: 84,
    monthly_revenue: 265000, total_customers: 18500,
    total_orders_monthly: 32000,
    data_infrastructure_cost_monthly: 4200, api_development_cost_monthly: 2800,
    compliance_cost_monthly: 900,
  },
];

export const runDataMonetizationEngine = async (
  db: ReturnType<typeof useDB>,
  config: DataMonetizationConfig,
): Promise<{ alerts: DataMonetizationAlert[]; generated: number }> => {
  const alerts: DataMonetizationAlert[] = [];
  const now = new Date();

  let data: DataMonetizationData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_data_monetization_strategy, data_assets_count,
              data_volume_tb_monthly, data_quality_score,
              has_api_revenue_program, api_endpoints_count,
              api_call_volume_monthly, api_revenue_monthly,
              api_revenue_target_monthly, api_pricing_model, api_developer_count,
              has_data_licensing_program, licensed_datasets_count,
              licensing_revenue_monthly, licensing_target_monthly,
              licensing_customers_count,
              has_partner_ecosystem, partner_count, partner_target_count,
              partner_revenue_monthly, partner_types,
              has_benchmarking_product, benchmarking_customers_count,
              benchmarking_revenue_monthly, benchmarking_target_monthly,
              benchmark_report_frequency,
              has_predictive_model_api, predictive_models_count,
              predictive_api_revenue_monthly, predictive_api_target_monthly,
              predictive_model_types,
              has_privacy_compliance_program, privacy_compliance_score,
              gdpr_compliant, ccpa_compliant, anonymization_score,
              consent_management_present,
              has_data_valuation_tracking, data_asset_valuation,
              data_value_per_record, valuation_frequency_months,
              total_data_revenue_monthly, data_revenue_growth_pct,
              data_revenue_as_pct_of_total, competitor_data_monetization_score,
              monthly_revenue, total_customers, total_orders_monthly,
              data_infrastructure_cost_monthly, api_development_cost_monthly,
              compliance_cost_monthly
       FROM data_monetization_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): DataMonetizationData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_data_monetization_strategy: Boolean(r.has_data_monetization_strategy ?? false),
      data_assets_count: safeNumber(r.data_assets_count, 0),
      data_volume_tb_monthly: safeNumber(r.data_volume_tb_monthly, 0),
      data_quality_score: safeNumber(r.data_quality_score, 0),
      has_api_revenue_program: Boolean(r.has_api_revenue_program ?? false),
      api_endpoints_count: safeNumber(r.api_endpoints_count, 0),
      api_call_volume_monthly: safeNumber(r.api_call_volume_monthly, 0),
      api_revenue_monthly: safeNumber(r.api_revenue_monthly, 0),
      api_revenue_target_monthly: safeNumber(r.api_revenue_target_monthly, 0),
      api_pricing_model: String(r.api_pricing_model ?? 'none'),
      api_developer_count: safeNumber(r.api_developer_count, 0),
      has_data_licensing_program: Boolean(r.has_data_licensing_program ?? false),
      licensed_datasets_count: safeNumber(r.licensed_datasets_count, 0),
      licensing_revenue_monthly: safeNumber(r.licensing_revenue_monthly, 0),
      licensing_target_monthly: safeNumber(r.licensing_target_monthly, 0),
      licensing_customers_count: safeNumber(r.licensing_customers_count, 0),
      has_partner_ecosystem: Boolean(r.has_partner_ecosystem ?? false),
      partner_count: safeNumber(r.partner_count, 0),
      partner_target_count: safeNumber(r.partner_target_count, 0),
      partner_revenue_monthly: safeNumber(r.partner_revenue_monthly, 0),
      partner_types: String(r.partner_types ?? 'none'),
      has_benchmarking_product: Boolean(r.has_benchmarking_product ?? false),
      benchmarking_customers_count: safeNumber(r.benchmarking_customers_count, 0),
      benchmarking_revenue_monthly: safeNumber(r.benchmarking_revenue_monthly, 0),
      benchmarking_target_monthly: safeNumber(r.benchmarking_target_monthly, 0),
      benchmark_report_frequency: String(r.benchmark_report_frequency ?? 'none'),
      has_predictive_model_api: Boolean(r.has_predictive_model_api ?? false),
      predictive_models_count: safeNumber(r.predictive_models_count, 0),
      predictive_api_revenue_monthly: safeNumber(r.predictive_api_revenue_monthly, 0),
      predictive_api_target_monthly: safeNumber(r.predictive_api_target_monthly, 0),
      predictive_model_types: String(r.predictive_model_types ?? 'none'),
      has_privacy_compliance_program: Boolean(r.has_privacy_compliance_program ?? false),
      privacy_compliance_score: safeNumber(r.privacy_compliance_score, 0),
      gdpr_compliant: Boolean(r.gdpr_compliant ?? false),
      ccpa_compliant: Boolean(r.ccpa_compliant ?? false),
      anonymization_score: safeNumber(r.anonymization_score, 0),
      consent_management_present: Boolean(r.consent_management_present ?? false),
      has_data_valuation_tracking: Boolean(r.has_data_valuation_tracking ?? false),
      data_asset_valuation: safeNumber(r.data_asset_valuation, 0),
      data_value_per_record: safeNumber(r.data_value_per_record, 0),
      valuation_frequency_months: safeNumber(r.valuation_frequency_months, 0),
      total_data_revenue_monthly: safeNumber(r.total_data_revenue_monthly, 0),
      data_revenue_growth_pct: safeNumber(r.data_revenue_growth_pct, 0),
      data_revenue_as_pct_of_total: safeNumber(r.data_revenue_as_pct_of_total, 0),
      competitor_data_monetization_score: safeNumber(r.competitor_data_monetization_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_customers: safeNumber(r.total_customers, 0),
      total_orders_monthly: safeNumber(r.total_orders_monthly, 0),
      data_infrastructure_cost_monthly: safeNumber(r.data_infrastructure_cost_monthly, 0),
      api_development_cost_monthly: safeNumber(r.api_development_cost_monthly, 0),
      compliance_cost_monthly: safeNumber(r.compliance_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetDataRevenueGrowthPct = 35;
    const targetApiRevenue = Math.max(d.api_revenue_target_monthly, 12000);
    const targetLicensingRevenue = Math.max(d.licensing_target_monthly, 8000);
    const targetPartnerRevenue = Math.round(baselineRevenue * 0.04);
    const targetBenchmarkingRevenue = Math.max(d.benchmarking_target_monthly, 3000);
    const targetPredictiveRevenue = Math.max(d.predictive_api_target_monthly, 5000);
    const targetComplianceRiskReductionPct = 60;
    const targetDataValuationLiftPct = 40;

    // Rule 1: DATA_MONETIZATION_STRATEGY_ABSENT
    if (config.requireDataMonetizationStrategy && !d.has_data_monetization_strategy) {
      // no data monetization -> missed $10B market
      const expectedApiRevenue = Math.round(targetApiRevenue * 0.5);
      const expectedLicensingRevenue = Math.round(targetLicensingRevenue * 0.5);
      const expectedPartnerRevenue = Math.round(targetPartnerRevenue * 0.3);
      const expectedBenchmarkingRevenue = Math.round(targetBenchmarkingRevenue * 0.5);
      const totalOpportunity = Math.max(expectedApiRevenue + expectedLicensingRevenue + expectedPartnerRevenue + expectedBenchmarkingRevenue, 4500);
      const severityLabel = d.competitor_data_monetization_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_data_monetization_score > 65)
        ? 'CRITICAL: NO DATA MONETIZATION STRATEGY — competitor data monetization score ' + d.competitor_data_monetization_score + '/100 (high); restaurant data monetization market = $10B+ by 2025 (Gartner); API economy = $4.2T by 2026 (McKinsey); 35% of enterprises already monetize data (Forrester); restaurants collect terabytes of data daily (orders, preferences, traffic, transactions); 72% of customers expect personalization = data is valuable; missing data monetization = missed recurring revenue + missed strategic partnerships + missed competitive advantage. '
        : `HIGH: NO DATA MONETIZATION STRATEGY — restaurant data monetization market $10B+ by 2025 (Gartner); API economy $4.2T by 2026 (McKinsey); 35% monetize data (Forrester); missing recurring revenue + partnerships. `;
      alerts.push({
        rule_id: 'data_monetization_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_data_monetization_strategy: d.has_data_monetization_strategy,
        data_assets_count: d.data_assets_count,
        data_volume_tb_monthly: d.data_volume_tb_monthly,
        data_quality_score: d.data_quality_score,
        total_customers: d.total_customers,
        total_orders_monthly: d.total_orders_monthly,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        data_infrastructure_cost_monthly: d.data_infrastructure_cost_monthly,
        data_revenue_growth_projected_pct: targetDataRevenueGrowthPct,
        api_revenue_projected: expectedApiRevenue,
        licensing_revenue_projected: expectedLicensingRevenue,
        partner_revenue_projected: expectedPartnerRevenue,
        benchmarking_revenue_projected: expectedBenchmarkingRevenue,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DATA MONETIZATION STRATEGY ABSENT: ${d.location_id} — data monetization strategy ABSENT; data assets ${d.data_assets_count}; data volume ${d.data_volume_tb_monthly}TB/mo; data quality ${d.data_quality_score}/100; total customers ${d.total_customers}; total orders ${d.total_orders_monthly}/mo; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: restaurant data monetization market = $10B+ by 2025 (Gartner); API economy = $4.2T by 2026 (McKinsey); 35% of enterprises already monetize data (Forrester); average API revenue for platforms = $100k-1M/year; data licensing = $50k-500k/year for segmented datasets; third-party integrations = $10k-100k/partner/year; benchmarking data = $20k-100k/year for industry analytics; predictive models as API = $50k-200k/year; restaurants collect terabytes of data daily (orders, preferences, traffic, transactions); 72% of customers expect personalization = data is valuable; restaurant data premium = realtime, geo-located, behavioral; data monetization types = API access (developers pay per call), data licensing (bulk dataset sale), data marketplace (exchange), benchmarking reports (industry insights), predictive API (forecasting), customer segments (anonymized audiences); data ROI = $5-20 per $1 invested in data infrastructure; 60% of data monetization revenue comes from API access, 25% from licensing, 15% from marketplace/benchmarking. Solutions ranked by impact: (1) LAUNCH data monetization strategy — API revenue ${fmt$(expectedApiRevenue)}/mo + licensing ${fmt$(expectedLicensingRevenue)}/mo + partner ${fmt$(expectedPartnerRevenue)}/mo + benchmarking ${fmt$(expectedBenchmarkingRevenue)}/mo; cost ${fmt$(1500)}/mo (infrastructure + development); payback 3-6 months; (2) INVENTORY data assets (orders, customers, menu, traffic, transactions); (3) ASSESS data quality (completeness, accuracy, timeliness); (4) IDENTIFY monetization opportunities (API, licensing, marketplace, benchmarking, predictive); (5) ENSURE privacy compliance (GDPR, CCPA, anonymization); (6) BUILD data infrastructure (warehouse, API platform); (7) DEVELOP API endpoints (high-value data products); (8) SET pricing strategy (tiered, usage-based); (9) BUILD partner ecosystem (delivery, loyalty, payment, marketing); (10) LAUNCH benchmarking product (industry insights); (11) PRODUCTIZE predictive models (forecasting, demand prediction); (12) TRACK data valuation (per record, per asset); (13) BENCHMARK vs competitor data monetization. Industry data: $10B+ market by 2025 (Gartner); $4.2T API economy (McKinsey); payback 3-6 months. Expected impact: +${targetDataRevenueGrowthPct}% data revenue growth, +${fmt$(totalOpportunity)}/mo new revenue, payback 3-6 months.`,
        ai_recommendation: 'launch_data_monetization_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: API_REVENUE_PROGRAM_ABSENT
    if (d.has_data_monetization_strategy && config.requireApiRevenueProgram && (!d.has_api_revenue_program || d.api_revenue_monthly < d.api_revenue_target_monthly * 0.5)) {
      // no API program -> missed $100k-1M/year
      const expectedApiRevenue = Math.round(d.api_revenue_target_monthly * 0.7);
      const expectedDeveloperGrowth = Math.round(baselineRevenue * 0.01);
      const expectedEcosystemLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedApiRevenue + expectedDeveloperGrowth + expectedEcosystemLift + expectedCompetitiveLift, 2800);
      const severityLabel = !d.has_api_revenue_program ? 'high' : 'medium';
      const criticalNote = (!d.has_api_revenue_program)
        ? `HIGH: NO API REVENUE PROGRAM — API endpoints ${d.api_endpoints_count}; API calls ${d.api_call_volume_monthly}/mo; API revenue ${fmt$(d.api_revenue_monthly)}/mo; API developers ${d.api_developer_count}; pricing model ${d.api_pricing_model}; average API revenue for platforms = $100k-1M/year; without API program, data sits unused = missed recurring revenue; API is #1 data monetization channel (60% of revenue). `
        : `MEDIUM: API REVENUE BELOW TARGET — ${fmt$(d.api_revenue_monthly)}/mo (target ${fmt$(d.api_revenue_target_monthly)}); scale API program for growth. `;
      alerts.push({
        rule_id: 'api_revenue_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_api_revenue_program: d.has_api_revenue_program,
        api_endpoints_count: d.api_endpoints_count,
        api_call_volume_monthly: d.api_call_volume_monthly,
        api_revenue_monthly: d.api_revenue_monthly,
        api_revenue_target_monthly: d.api_revenue_target_monthly,
        api_pricing_model: d.api_pricing_model,
        api_developer_count: d.api_developer_count,
        data_assets_count: d.data_assets_count,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        api_development_cost_monthly: d.api_development_cost_monthly,
        api_revenue_projected: expectedApiRevenue,
        data_revenue_growth_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `API REVENUE PROGRAM ABSENT: ${d.location_id} — API program ${d.has_api_revenue_program ? 'present' : 'ABSENT'}; endpoints ${d.api_endpoints_count}; calls ${d.api_call_volume_monthly}/mo; revenue ${fmt$(d.api_revenue_monthly)}/mo (target ${fmt$(d.api_revenue_target_monthly)}); developers ${d.api_developer_count}; pricing ${d.api_pricing_model}; data assets ${d.data_assets_count}; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: average API revenue for platforms = $100k-1M/year ($8k-83k/month); API is #1 data monetization channel (60% of revenue); API monetization types = pay-per-call ($0.001-0.10/call), tiered pricing (free/starter/pro/enterprise), usage-based (per 1k calls), subscription (monthly fee), revenue share (percentage of partner revenue); API products = order data (realtime orders, historical), customer data (anonymized segments), menu data (items, prices, availability), traffic data (foot traffic, peak times), transaction data (payment volumes, methods), location data (geo, delivery zones), predictive data (forecasts, recommendations); API developer ecosystem = attract developers with documentation, SDKs, sandboxes, developer portals; API best practice = RESTful design, OAuth2 authentication, rate limiting, documentation (Swagger/OpenAPI), SDKs (JavaScript, Python, Ruby), sandbox for testing, analytics dashboard for developers; API cost = $2k-10k/month (infrastructure + development); API ROI = $5-15 per $1 spent. Solutions ranked by impact: (1) LAUNCH API revenue program — API revenue ${fmt$(expectedApiRevenue)}/mo + developer growth ${fmt$(expectedDeveloperGrowth)}/mo + ecosystem ${fmt$(expectedEcosystemLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(2000)}/mo (infrastructure + development); payback 2-4 months; (2) DESIGN API products (order, customer, menu, traffic, transaction, location, predictive); (3) SET pricing strategy (tiered: free/starter $500/pro $2k/enterprise $10k); (4) BUILD API endpoints (RESTful, OAuth2, rate limited); (5) CREATE developer portal (documentation, SDKs, sandbox); (6) PUBLISH API documentation (Swagger/OpenAPI); (7) BUILD SDKs (JavaScript, Python, Ruby); (8) PROVIDE sandbox for testing (free tier); (9) ADD analytics dashboard for developers (usage, revenue); (10) MARKET API to developers (dev conferences, hackathons, partner programs); (11) TRACK API call volume (target ${config.minApiCallVolumeMonthly}+); (12) TRACK API revenue (target ${fmt$(d.api_revenue_target_monthly)}/mo); (13) TRACK developer count (growth); (14) BENCHMARK vs competitor API programs. Industry data: $100k-1M/year API revenue; 60% of data monetization; payback 2-4 months. Expected impact: +${fmt$(expectedApiRevenue)}/mo API revenue, +25% data revenue growth, payback 2-4 months.`,
        ai_recommendation: 'launch_api_revenue_program',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: DATA_LICENSING_PROGRAM_ABSENT
    if (d.has_data_monetization_strategy && config.requireDataLicensingProgram && !d.has_data_licensing_program) {
      // no data licensing -> missed $50k-500k/year
      const expectedLicensingRevenue = Math.round(d.licensing_target_monthly * 0.6);
      const expectedResearchFirmRevenue = Math.round(baselineRevenue * 0.015);
      const expectedMarketIntelligence = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedLicensingRevenue + expectedResearchFirmRevenue + expectedMarketIntelligence + expectedCompetitiveLift, 2200);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO DATA LICENSING PROGRAM — licensed datasets ${d.licensed_datasets_count}; licensing revenue ${fmt$(d.licensing_revenue_monthly)}/mo; licensing customers ${d.licensing_customers_count}; data licensing = $50k-500k/year for segmented datasets; without licensing, bulk data sits unsold = missed recurring revenue; licensing is #2 data monetization channel (25% of revenue). `;
      alerts.push({
        rule_id: 'data_licensing_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_data_licensing_program: d.has_data_licensing_program,
        licensed_datasets_count: d.licensed_datasets_count,
        licensing_revenue_monthly: d.licensing_revenue_monthly,
        licensing_target_monthly: d.licensing_target_monthly,
        licensing_customers_count: d.licensing_customers_count,
        data_assets_count: d.data_assets_count,
        data_volume_tb_monthly: d.data_volume_tb_monthly,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        licensing_revenue_projected: expectedLicensingRevenue,
        data_revenue_growth_projected_pct: 20,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DATA LICENSING PROGRAM ABSENT: ${d.location_id} — data licensing ${d.has_data_licensing_program ? 'present' : 'ABSENT'}; licensed datasets ${d.licensed_datasets_count}; licensing revenue ${fmt$(d.licensing_revenue_monthly)}/mo (target ${fmt$(d.licensing_target_monthly)}); licensing customers ${d.licensing_customers_count}; data assets ${d.data_assets_count}; data volume ${d.data_volume_tb_monthly}TB/mo; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: data licensing = $50k-500k/year for segmented datasets ($4k-42k/month); licensing is #2 data monetization channel (25% of revenue); data licensing types = bulk dataset sale (one-time or annual), subscription licensing (monthly data feed), exclusive licensing (one buyer), non-exclusive licensing (multiple buyers), white-label data (rebranded); data licensing customers = market research firms (Nielsen, IRI, Mintel), consulting firms (McKinsey, BCG, Deloitte), financial firms (hedge funds, private equity analyzing restaurant industry), ad agencies (targeting data), academic researchers, government (economic data); data licensing products = customer demographics (anonymized age, gender, income, location), order patterns (popular items, time of day, day of week), pricing data (menu prices, promotions), traffic data (foot traffic, peak times), transaction data (payment volumes, methods), menu intelligence (item performance, trends); data licensing pricing = $5k-50k/year per dataset (non-exclusive), $50k-500k/year (exclusive); data licensing best practice = anonymize all PII (GDPR/CCPA), license agreements (terms, usage, exclusivity), data delivery (API, SFTP, cloud), quality guarantees (accuracy, completeness); data licensing cost = $500-2,000/month (data prep + legal); data licensing ROI = $10-30 per $1 spent. Solutions ranked by impact: (1) LAUNCH data licensing program — licensing revenue ${fmt$(expectedLicensingRevenue)}/mo + research firm ${fmt$(expectedResearchFirmRevenue)}/mo + market intelligence ${fmt$(expectedMarketIntelligence)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(1000)}/mo (data prep + legal); payback 1-3 months; (2) IDENTIFY licensable datasets (customer demographics, order patterns, pricing, traffic, transactions, menu intelligence); (3) ANONYMIZE all PII (GDPR/CCPA compliance); (4) CREATE licensing agreements (terms, usage, exclusivity); (5) SET pricing ($5k-50k/year non-exclusive, $50k-500k exclusive); (6) IDENTIFY target customers (research firms, consulting, financial, ad agencies, academic); (7) BUILD data delivery mechanism (API, SFTP, cloud); (8) ENSURE data quality (accuracy, completeness guarantees); (9) MARKET to research firms (Nielsen, IRI, Mintel); (10) MARKET to consulting firms (McKinsey, BCG, Deloitte); (11) MARKET to financial firms (hedge funds, PE); (12) TRACK licensing customers (target 5+); (13) TRACK licensing revenue (target ${fmt$(d.licensing_target_monthly)}/mo); (14) BENCHMARK vs competitor data licensing. Industry data: $50k-500k/year licensing revenue; 25% of data monetization; payback 1-3 months. Expected impact: +${fmt$(expectedLicensingRevenue)}/mo licensing revenue, +20% data revenue growth, payback 1-3 months.`,
        ai_recommendation: 'launch_data_licensing',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: THIRD_PARTY_INTEGRATION_ECOSYSTEM_THIN
    if (d.has_data_monetization_strategy && config.requirePartnerEcosystem && d.partner_count < config.minPartnerCount) {
      // thin partner ecosystem -> missed $10k-100k/partner
      const partnerGap = Math.max(config.minPartnerCount - d.partner_count, 0);
      const expectedPartnerRevenue = Math.round(partnerGap * 800);
      const expectedEcosystemLift = Math.round(baselineRevenue * 0.02);
      const expectedDataEnrichment = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedPartnerRevenue + expectedEcosystemLift + expectedDataEnrichment + expectedCompetitiveLift, 2000);
      const severityLabel = d.partner_count < 2 ? 'high' : 'medium';
      const criticalNote = (d.partner_count < 2)
        ? `HIGH: PARTNER ECOSYSTEM THIN — partners ${d.partner_count} (min ${config.minPartnerCount}); partner revenue ${fmt$(d.partner_revenue_monthly)}/mo; partner types ${d.partner_types}; third-party integrations = $10k-100k/partner/year; thin ecosystem = missed recurring revenue + missed data enrichment + missed competitive moat. `
        : `MEDIUM: PARTNER ECOSYSTEM BELOW TARGET — ${d.partner_count} partners (min ${config.minPartnerCount}); expand ecosystem for revenue. `;
      alerts.push({
        rule_id: 'third_party_integration_ecosystem_thin',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_partner_ecosystem: d.has_partner_ecosystem,
        partner_count: d.partner_count,
        partner_target_count: d.partner_target_count,
        partner_revenue_monthly: d.partner_revenue_monthly,
        partner_types: d.partner_types,
        data_assets_count: d.data_assets_count,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        partner_revenue_projected: expectedPartnerRevenue,
        data_revenue_growth_projected_pct: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `THIRD-PARTY INTEGRATION ECOSYSTEM THIN: ${d.location_id} — partner ecosystem ${d.has_partner_ecosystem ? 'present' : 'ABSENT'}; partners ${d.partner_count} (min ${config.minPartnerCount}, target ${d.partner_target_count}); partner revenue ${fmt$(d.partner_revenue_monthly)}/mo; partner types ${d.partner_types}; data assets ${d.data_assets_count}; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: third-party integrations = $10k-100k/partner/year ($833-8,333/month per partner); partner ecosystem types = delivery platforms (DoorDash, Uber Eats, Grubhub — pay for data access), loyalty networks (cross-brand loyalty), payment processors (transaction data), marketing agencies (targeting data), research firms (market intelligence), analytics platforms (benchmarking), ad tech (audience data), media (trend data), consulting (industry data), franchise systems (performance data); partner ecosystem benefits = recurring revenue + data enrichment (partners share data back) + competitive moat (lock-in) + brand awareness; partner ecosystem best practice = API access (partners integrate via API), revenue share (10-30% of partner revenue), co-marketing (joint campaigns), data exchange (mutual data sharing), exclusive partnerships (premium tier); partner ecosystem cost = $500-2,000/month (partner management); partner ecosystem ROI = $8-20 per $1 spent. Solutions ranked by impact: (1) EXPAND partner ecosystem — partner revenue ${fmt$(expectedPartnerRevenue)}/mo + ecosystem ${fmt$(expectedEcosystemLift)}/mo + data enrichment ${fmt$(expectedDataEnrichment)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(800)}/mo (partner management); payback 1-2 months; (2) IDENTIFY target partner types (delivery, loyalty, payment, marketing, research, analytics, ad tech, media, consulting, franchise); (3) BUILD partner API (integration access); (4) SET revenue share model (10-30% of partner revenue); (5) RECRUIT delivery platform partners (DoorDash, Uber Eats, Grubhub); (6) RECRUIT loyalty network partners (cross-brand); (7) RECRUIT payment processor partners (transaction data); (8) RECRUIT marketing agency partners (targeting data); (9) RECRUIT research firm partners (market intelligence); (10) RECRUIT analytics platform partners (benchmarking); (11) CREATE co-marketing campaigns (joint); (12) ESTABLISH data exchange (mutual data sharing); (13) OFFER exclusive partnerships (premium tier); (14) TRACK partner count (target ${config.minPartnerCount}+); (15) TRACK partner revenue (target growth); (16) BENCHMARK vs competitor partner ecosystem. Industry data: $10k-100k/partner/year; payback 1-2 months. Expected impact: +${fmt$(expectedPartnerRevenue)}/mo partner revenue, +18% data revenue growth, payback 1-2 months.`,
        ai_recommendation: 'expand_partner_ecosystem',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: BENCHMARKING_DATA_PRODUCT_ABSENT
    if (d.has_data_monetization_strategy && config.requireBenchmarkingProduct && !d.has_benchmarking_product) {
      // no benchmarking product -> missed $20k-100k/year
      const expectedBenchmarkingRevenue = Math.round(d.benchmarking_target_monthly * 0.6);
      const expectedIndustryInsights = Math.round(baselineRevenue * 0.01);
      const expectedResearchRevenue = Math.round(baselineRevenue * 0.012);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedBenchmarkingRevenue + expectedIndustryInsights + expectedResearchRevenue + expectedCompetitiveLift, 1800);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO BENCHMARKING DATA PRODUCT — benchmarking customers ${d.benchmarking_customers_count}; benchmarking revenue ${fmt$(d.benchmarking_revenue_monthly)}/mo; frequency ${d.benchmark_report_frequency}; benchmarking data = $20k-100k/year for industry analytics; without benchmarking product, industry insights go unsold = missed recurring revenue; benchmarking is valuable to industry analysts, researchers, competitors. `;
      alerts.push({
        rule_id: 'benchmarking_data_product_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_benchmarking_product: d.has_benchmarking_product,
        benchmarking_customers_count: d.benchmarking_customers_count,
        benchmarking_revenue_monthly: d.benchmarking_revenue_monthly,
        benchmarking_target_monthly: d.benchmarking_target_monthly,
        benchmark_report_frequency: d.benchmark_report_frequency,
        data_assets_count: d.data_assets_count,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        benchmarking_revenue_projected: expectedBenchmarkingRevenue,
        data_revenue_growth_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `BENCHMARKING DATA PRODUCT ABSENT: ${d.location_id} — benchmarking product ${d.has_benchmarking_product ? 'present' : 'ABSENT'}; customers ${d.benchmarking_customers_count}; revenue ${fmt$(d.benchmarking_revenue_monthly)}/mo (target ${fmt$(d.benchmarking_target_monthly)}); frequency ${d.benchmark_report_frequency}; data assets ${d.data_assets_count}; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: benchmarking data = $20k-100k/year for industry analytics ($1.7k-8.3k/month); benchmarking is #3 data monetization channel (15% of revenue); benchmarking product types = industry reports (quarterly, annual), competitive benchmarks (performance vs competitors), operational benchmarks (efficiency, labor, food cost), customer benchmarks (satisfaction, retention, LTV), menu benchmarks (item performance, pricing), financial benchmarks (revenue, margin, EBITDA); benchmarking customers = industry analysts (Nielsen, IRI), research firms (Mintel, Technomic), consulting firms (McKinsey, BCG), financial firms (investment research), trade associations (NRA), media (trade publications), competitors (anonymized), franchise systems; benchmarking product best practice = anonymize all data (no restaurant identification), aggregate (minimum 10+ restaurants for anonymity), regular frequency (monthly, quarterly, annual), multiple formats (PDF report, API, dashboard), subscription pricing ($1k-8k/month); benchmarking cost = $300-1,500/month (data aggregation + report production); benchmarking ROI = $8-20 per $1 spent. Solutions ranked by impact: (1) LAUNCH benchmarking product — benchmarking revenue ${fmt$(expectedBenchmarkingRevenue)}/mo + industry insights ${fmt$(expectedIndustryInsights)}/mo + research ${fmt$(expectedResearchRevenue)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(600)}/mo (aggregation + production); payback 1-3 months; (2) IDENTIFY benchmarking topics (industry, competitive, operational, customer, menu, financial); (3) AGGREGATE data (minimum 10+ restaurants for anonymity); (4) ANONYMIZE all data (no restaurant identification); (5) SET frequency (monthly, quarterly, annual); (6) CREATE multiple formats (PDF report, API, dashboard); (7) SET subscription pricing ($1k-8k/month); (8) IDENTIFY target customers (analysts, research firms, consulting, financial, trade associations, media); (9) MARKET to industry analysts (Nielsen, IRI); (10) MARKET to research firms (Mintel, Technomic); (11) MARKET to consulting firms (McKinsey, BCG); (12) TRACK benchmarking customers (target 10+); (13) TRACK benchmarking revenue (target ${fmt$(d.benchmarking_target_monthly)}/mo); (14) BENCHMARK vs competitor benchmarking products. Industry data: $20k-100k/year benchmarking revenue; 15% of data monetization; payback 1-3 months. Expected impact: +${fmt$(expectedBenchmarkingRevenue)}/mo benchmarking revenue, +15% data revenue growth, payback 1-3 months.`,
        ai_recommendation: 'launch_benchmarking_product',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: PREDICTIVE_MODEL_API_ABSENT
    if (d.has_data_monetization_strategy && config.requirePredictiveModelApi && !d.has_predictive_model_api) {
      // no predictive API -> missed $50k-200k/year
      const expectedPredictiveRevenue = Math.round(d.predictive_api_target_monthly * 0.6);
      const expectedModelLicensing = Math.round(baselineRevenue * 0.012);
      const expectedConsultingRevenue = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedPredictiveRevenue + expectedModelLicensing + expectedConsultingRevenue + expectedCompetitiveLift, 1800);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO PREDICTIVE MODEL API — predictive models ${d.predictive_models_count}; predictive revenue ${fmt$(d.predictive_api_revenue_monthly)}/mo; model types ${d.predictive_model_types}; predictive models as API = $50k-200k/year; without predictive API, AI/ML models sit internal-only = missed recurring revenue; predictive API is high-value (AI-powered insights). `;
      alerts.push({
        rule_id: 'predictive_model_api_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_predictive_model_api: d.has_predictive_model_api,
        predictive_models_count: d.predictive_models_count,
        predictive_api_revenue_monthly: d.predictive_api_revenue_monthly,
        predictive_api_target_monthly: d.predictive_api_target_monthly,
        predictive_model_types: d.predictive_model_types,
        data_assets_count: d.data_assets_count,
        data_quality_score: d.data_quality_score,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        predictive_revenue_projected: expectedPredictiveRevenue,
        data_revenue_growth_projected_pct: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PREDICTIVE MODEL API ABSENT: ${d.location_id} — predictive API ${d.has_predictive_model_api ? 'present' : 'ABSENT'}; models ${d.predictive_models_count}; revenue ${fmt$(d.predictive_api_revenue_monthly)}/mo (target ${fmt$(d.predictive_api_target_monthly)}); model types ${d.predictive_model_types}; data assets ${d.data_assets_count}; data quality ${d.data_quality_score}/100; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: predictive models as API = $50k-200k/year ($4k-17k/month); predictive API is high-value (AI-powered insights command premium pricing); predictive model types = demand forecasting (predict order volume), churn prediction (predict customer departure), price optimization (optimal pricing), menu engineering (item performance prediction), labor forecasting (staff needs), weather impact (weather-based demand), customer lifetime value (LTV prediction), recommendation engines (next order); predictive API customers = other restaurants (use your models), POS companies (embed in their products), delivery platforms (optimize logistics), marketing agencies (targeting), consulting firms (client insights), franchise systems (performance prediction), investors (revenue prediction); predictive API pricing = $2k-15k/month per model (subscription), $0.10-1.00 per prediction (usage-based), $50k-200k/year enterprise (custom); predictive API best practice = model accuracy (85%+ for commercial), API latency (under 200ms), model documentation (methodology, accuracy, limitations), A/B testing (prove value), model refresh (monthly retraining); predictive API cost = $1k-5k/month (infrastructure + ML engineering); predictive API ROI = $10-25 per $1 spent. Solutions ranked by impact: (1) LAUNCH predictive model API — predictive revenue ${fmt$(expectedPredictiveRevenue)}/mo + model licensing ${fmt$(expectedModelLicensing)}/mo + consulting ${fmt$(expectedConsultingRevenue)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(1500)}/mo (infrastructure + ML); payback 2-4 months; (2) IDENTIFY predictive models to productize (demand, churn, price, menu, labor, weather, LTV, recommendation); (3) ENSURE model accuracy (85%+ for commercial); (4) BUILD API endpoints (RESTful, low latency); (5) SET pricing ($2k-15k/month per model, $0.10-1.00/prediction, $50k-200k enterprise); (6) CREATE model documentation (methodology, accuracy, limitations); (7) PROVIDE A/B testing (prove value to customers); (8) REFRESH models monthly (retraining); (9) IDENTIFY target customers (other restaurants, POS companies, delivery platforms, marketing agencies, consulting, franchise, investors); (10) MARKET to POS companies (embed in products); (11) MARKET to delivery platforms (optimize logistics); (12) TRACK predictive revenue (target ${fmt$(d.predictive_api_target_monthly)}/mo); (13) TRACK model count (target 3+); (14) BENCHMARK vs competitor predictive APIs. Industry data: $50k-200k/year predictive API revenue; payback 2-4 months. Expected impact: +${fmt$(expectedPredictiveRevenue)}/mo predictive revenue, +18% data revenue growth, payback 2-4 months.`,
        ai_recommendation: 'launch_predictive_api',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: PRIVACY_COMPLIANCE_PROGRAM_WEAK
    if (d.has_data_monetization_strategy && config.requirePrivacyComplianceProgram && (!d.has_privacy_compliance_program || d.privacy_compliance_score < config.minPrivacyComplianceScore || d.anonymization_score < config.minAnonymizationScore || !d.consent_management_present)) {
      // weak privacy -> legal risk + lost deals
      const expectedComplianceRiskReduction = Math.round(baselineRevenue * 0.02);
      const expectedDealProtection = Math.round(baselineRevenue * 0.015);
      const expectedCustomerTrust = Math.round(baselineRevenue * 0.01);
      const expectedLegalCostReduction = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedComplianceRiskReduction + expectedDealProtection + expectedCustomerTrust + expectedLegalCostReduction, 1600);
      const severityLabel = d.privacy_compliance_score < 50 ? 'high' : 'medium';
      const criticalNote = (d.privacy_compliance_score < 50)
        ? `HIGH: PRIVACY COMPLIANCE WEAK — compliance score ${d.privacy_compliance_score}/100 (min ${config.minPrivacyComplianceScore}); GDPR ${d.gdpr_compliant ? 'yes' : 'NO'}; CCPA ${d.ccpa_compliant ? 'yes' : 'NO'}; anonymization ${d.anonymization_score}/100 (min ${config.minAnonymizationScore}); consent management ${d.consent_management_present ? 'yes' : 'NO'}; privacy compliance (GDPR, CCPA, CPRA) = mandatory for monetization; weak privacy = legal risk ($50k-500k fines) + lost deals (enterprises require compliance) + customer trust loss. `
        : `MEDIUM: PRIVACY COMPLIANCE BELOW TARGET — ${d.privacy_compliance_score}/100 (min ${config.minPrivacyComplianceScore}); strengthen for deal protection. `;
      alerts.push({
        rule_id: 'privacy_compliance_program_weak',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_privacy_compliance_program: d.has_privacy_compliance_program,
        privacy_compliance_score: d.privacy_compliance_score,
        gdpr_compliant: d.gdpr_compliant,
        ccpa_compliant: d.ccpa_compliant,
        anonymization_score: d.anonymization_score,
        consent_management_present: d.consent_management_present,
        total_customers: d.total_customers,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        compliance_cost_monthly: d.compliance_cost_monthly,
        compliance_risk_reduction_projected_pct: targetComplianceRiskReductionPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PRIVACY COMPLIANCE PROGRAM WEAK: ${d.location_id} — privacy compliance ${d.has_privacy_compliance_program ? 'present' : 'ABSENT'}; compliance score ${d.privacy_compliance_score}/100 (min ${config.minPrivacyComplianceScore}); GDPR ${d.gdpr_compliant ? 'compliant' : 'NOT compliant'}; CCPA ${d.ccpa_compliant ? 'compliant' : 'NOT compliant'}; anonymization ${d.anonymization_score}/100 (min ${config.minAnonymizationScore}); consent management ${d.consent_management_present ? 'present' : 'ABSENT'}; total customers ${d.total_customers}; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: privacy compliance (GDPR, CCPA, CPRA) = mandatory for data monetization; GDPR fines = up to 4% of annual revenue or EUR 20M (whichever higher); CCPA fines = $2,500 per violation ($7,500 intentional); weak privacy = legal risk ($50k-500k fines) + lost deals (enterprises require compliance — 80% of B2B data deals require GDPR/CCPA compliance) + customer trust loss (78% of customers won't buy from non-compliant); privacy compliance components = GDPR compliance (EU customers), CCPA/CPRA compliance (California customers), anonymization (remove all PII), consent management (opt-in/opt-out), data subject rights (access, delete, portability), data processing agreements (DPAs with partners), privacy policy (transparent), data protection officer (DPO), regular audits; anonymization = remove all personally identifiable information (name, email, phone, address, payment), aggregate data (minimum 10+ records per group), k-anonymity (k=5 minimum); consent management = opt-in before data collection, opt-out at any time, granular consent (per data type), consent records (auditable); privacy compliance cost = $500-2,000/month (tools + legal); privacy compliance ROI = risk avoidance ($50k-500k fines) + deal protection ($100k-500k/year in B2B deals). Solutions ranked by impact: (1) STRENGTHEN privacy compliance — compliance risk reduction ${fmt$(expectedComplianceRiskReduction)}/mo + deal protection ${fmt$(expectedDealProtection)}/mo + customer trust ${fmt$(expectedCustomerTrust)}/mo + legal cost reduction ${fmt$(expectedLegalCostReduction)}/mo; cost ${fmt$(800)}/mo (tools + legal); payback immediate (risk avoidance); (2) ACHIEVE GDPR compliance (EU customers — privacy policy, consent, DPA, DPO); (3) ACHIEVE CCPA/CPRA compliance (California — opt-out, data subject rights); (4) IMPLEMENT anonymization (remove all PII, aggregate, k-anonymity k=5); (5) DEPLOY consent management (opt-in/opt-out, granular, auditable); (6) ENABLE data subject rights (access, delete, portability); (7) CREATE data processing agreements (DPAs with partners); (8) UPDATE privacy policy (transparent, comprehensive); (9) APPOINT data protection officer (DPO); (10) CONDUCT regular audits (annual); (11) TRACK compliance score (target ${config.minPrivacyComplianceScore}+); (12) TRACK anonymization score (target ${config.minAnonymizationScore}+); (13) BENCHMARK vs competitor privacy compliance. Industry data: GDPR fines up to 4% revenue; 80% B2B deals require compliance; payback immediate. Expected impact: -${targetComplianceRiskReductionPct}% compliance risk, +deal protection, payback immediate.`,
        ai_recommendation: 'strengthen_privacy_compliance',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: DATA_VALUATION_TRACKING_ABSENT
    if (d.has_data_monetization_strategy && config.requireDataValuationTracking && !d.has_data_valuation_tracking) {
      // no data valuation -> can't optimize pricing
      const expectedDataValuationLift = Math.round(baselineRevenue * 0.015);
      const expectedPricingOptimization = Math.round(d.total_data_revenue_monthly * 0.20);
      const expectedAssetRecognition = Math.round(baselineRevenue * 0.01);
      const expectedStrategicLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedDataValuationLift + expectedPricingOptimization + expectedAssetRecognition + expectedStrategicLift, 1200);
      const severityLabel = d.total_data_revenue_monthly > 5000 ? 'medium' : 'low';
      const criticalNote = (d.total_data_revenue_monthly > 5000)
        ? `MEDIUM: NO DATA VALUATION TRACKING — data revenue ${fmt$(d.total_data_revenue_monthly)}/mo but no valuation tracking; without valuation, can't optimize pricing or recognize data as asset; data valuation = $0.01-0.10 per record for anonymized customer data; tracking valuation enables pricing optimization + strategic decisions + investor reporting. `
        : `LOW: NO DATA VALUATION TRACKING — implement valuation to optimize pricing + recognize data asset. `;
      alerts.push({
        rule_id: 'data_valuation_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_data_valuation_tracking: d.has_data_valuation_tracking,
        data_asset_valuation: d.data_asset_valuation,
        data_value_per_record: d.data_value_per_record,
        valuation_frequency_months: d.valuation_frequency_months,
        total_data_revenue_monthly: d.total_data_revenue_monthly,
        total_customers: d.total_customers,
        total_orders_monthly: d.total_orders_monthly,
        competitor_data_monetization_score: d.competitor_data_monetization_score,
        monthly_revenue: d.monthly_revenue,
        data_valuation_lift_projected_pct: targetDataValuationLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DATA VALUATION TRACKING ABSENT: ${d.location_id} — data valuation ${d.has_data_valuation_tracking ? 'present' : 'ABSENT'}; data asset valuation ${fmt$(d.data_asset_valuation)}; value per record ${fmt$(d.data_value_per_record)}; valuation frequency ${d.valuation_frequency_months} months; data revenue ${fmt$(d.total_data_revenue_monthly)}/mo; total customers ${d.total_customers}; total orders ${d.total_orders_monthly}/mo; competitor data monetization ${d.competitor_data_monetization_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: data valuation = $0.01-0.10 per record for anonymized customer data; data asset valuation = total records x value per record (e.g., 100k customers x $0.05 = $5,000 asset); without valuation, can't optimize pricing (are you charging too little?) or recognize data as asset (investors, M&A); data valuation methods = cost approach (what did it cost to collect?), market approach (what do similar datasets sell for?), income approach (what revenue does it generate?); data valuation tracking = regular valuation (quarterly), per-record value, per-asset value, valuation trends; data valuation benefits = pricing optimization (charge what data is worth), strategic decisions (which data to invest in?), investor reporting (data as asset on balance sheet), M&A (data increases company value), insurance (data asset insurance); data valuation cost = $200-1,000/month (valuation tools + consulting); data valuation ROI = $5-15 per $1 spent (pricing optimization + asset recognition). Solutions ranked by impact: (1) IMPLEMENT data valuation tracking — valuation lift ${fmt$(expectedDataValuationLift)}/mo + pricing optimization ${fmt$(expectedPricingOptimization)}/mo + asset recognition ${fmt$(expectedAssetRecognition)}/mo + strategic ${fmt$(expectedStrategicLift)}/mo; cost ${fmt$(400)}/mo (tools + consulting); payback immediate; (2) CHOOSE valuation method (cost, market, income); (3) CALCULATE per-record value ($0.01-0.10 per anonymized record); (4) CALCULATE per-asset value (total records x value per record); (5) CONDUCT regular valuation (quarterly); (6) TRACK valuation trends (is data appreciating?); (7) OPTIMIZE pricing based on valuation (charge what data is worth); (8) REPORT data as asset (investors, board); (9) INCLUDE data in M&A valuation (increases company value); (10) INSURE data asset (data breach protection); (11) TRACK data revenue (target growth); (12) BENCHMARK vs competitor data valuation. Industry data: $0.01-0.10 per record; payback immediate. Expected impact: +${targetDataValuationLiftPct}% data valuation, +pricing optimization, payback immediate.`,
        ai_recommendation: 'implement_data_valuation',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM data_monetization_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE data_monetization_alert CONTENT $data`, {
        data: { ...a, detected_at: a.detected_at.toISOString() },
      });
    } catch { /* ignore */ }
  }

  // AI enrichment (optional, fail-safe)
  if (config.aiEnabled) {
    const { callOpenAIChat } = await import('@/lib/openai.service.ts').catch(() => ({} as any));
    if (callOpenAIChat) {
      const topAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 5);
      for (const a of topAlerts) {
        try {
          const response = await callOpenAIChat({
            messages: [
              { role: 'system', content: 'You are a restaurant data monetization and API revenue expert. Given data monetization data, recommend ONE specific action with expected data revenue growth, API revenue, licensing revenue, partner revenue, benchmarking revenue, predictive revenue, compliance risk reduction, or data valuation lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Data monetization strategy: ${a.has_data_monetization_strategy ?? false} (${a.data_assets_count ?? 0} assets, ${a.data_volume_tb_monthly ?? 0}TB/mo, quality ${a.data_quality_score ?? 0}/100). API program: ${a.has_api_revenue_program ?? false} (${a.api_endpoints_count ?? 0} endpoints, ${a.api_call_volume_monthly ?? 0} calls/mo, ${fmt$(a.api_revenue_monthly ?? 0)}/${fmt$(a.api_revenue_target_monthly ?? 0)} target, ${a.api_developer_count ?? 0} devs, ${a.api_pricing_model ?? 'none'}). Licensing: ${a.has_data_licensing_program ?? false} (${a.licensed_datasets_count ?? 0} datasets, ${fmt$(a.licensing_revenue_monthly ?? 0)}/${fmt$(a.licensing_target_monthly ?? 0)} target, ${a.licensing_customers_count ?? 0} customers). Partner ecosystem: ${a.has_partner_ecosystem ?? false} (${a.partner_count ?? 0}/${config.minPartnerCount} min, ${fmt$(a.partner_revenue_monthly ?? 0)}/mo, types: ${a.partner_types ?? 'none'}). Benchmarking: ${a.has_benchmarking_product ?? false} (${a.benchmarking_customers_count ?? 0} customers, ${fmt$(a.benchmarking_revenue_monthly ?? 0)}/${fmt$(a.benchmarking_target_monthly ?? 0)} target, ${a.benchmark_report_frequency ?? 'none'}). Predictive API: ${a.has_predictive_model_api ?? false} (${a.predictive_models_count ?? 0} models, ${fmt$(a.predictive_api_revenue_monthly ?? 0)}/${fmt$(a.predictive_api_target_monthly ?? 0)} target, types: ${a.predictive_model_types ?? 'none'}). Privacy: ${a.has_privacy_compliance_program ?? false} (score ${a.privacy_compliance_score ?? 0}/${config.minPrivacyComplianceScore} min, GDPR ${a.gdpr_compliant ?? false}, CCPA ${a.ccpa_compliant ?? false}, anonymization ${a.anonymization_score ?? 0}/${config.minAnonymizationScore} min, consent ${a.consent_management_present ?? false}). Valuation: ${a.has_data_valuation_tracking ?? false} (${fmt$(a.data_asset_valuation ?? 0)} asset, ${fmt$(a.data_value_per_record ?? 0)}/record, ${a.valuation_frequency_months ?? 0}mo frequency). Total data revenue: ${fmt$(a.total_data_revenue_monthly ?? 0)}/mo (${a.data_revenue_growth_pct ?? 0}% growth, ${a.data_revenue_as_pct_of_total ?? 0}% of total). Competitor: ${a.competitor_data_monetization_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Customers: ${a.total_customers ?? 0}. Orders: ${a.total_orders_monthly ?? 0}/mo. Infrastructure cost: ${fmt$(a.data_infrastructure_cost_monthly ?? 0)}/mo. API dev cost: ${fmt$(a.api_development_cost_monthly ?? 0)}/mo. Compliance cost: ${fmt$(a.compliance_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
            ],
            task: 'reporting',
          });
          const text = typeof response === 'string'
            ? response
            : (response as any)?.choices?.[0]?.message?.content ?? '';
          a.ai_insight = String(text).slice(0, 200);
        } catch { /* skip */ }
      }
    }
  }

  return { alerts, generated: alerts.length };
};

export const getActiveDataMonetizationAlerts = async (db: ReturnType<typeof useDB>): Promise<DataMonetizationAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM data_monetization_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getDataMonetizationSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  dataMonetizationStrategyAbsentCount: number;
  apiRevenueProgramAbsentCount: number;
  dataLicensingProgramAbsentCount: number;
  thirdPartyIntegrationEcosystemThinCount: number;
  benchmarkingDataProductAbsentCount: number;
  predictiveModelApiAbsentCount: number;
  privacyComplianceProgramWeakCount: number;
  dataValuationTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'data_monetization_strategy_absent') AS nostrategy,
              math::count(rule_id = 'api_revenue_program_absent') AS noapi,
              math::count(rule_id = 'data_licensing_program_absent') AS nolicensing,
              math::count(rule_id = 'third_party_integration_ecosystem_thin') AS thinpartners,
              math::count(rule_id = 'benchmarking_data_product_absent') AS nobenchmarking,
              math::count(rule_id = 'predictive_model_api_absent') AS nopredictive,
              math::count(rule_id = 'privacy_compliance_program_weak') AS weakprivacy,
              math::count(rule_id = 'data_valuation_tracking_absent') AS novaluation
       FROM data_monetization_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      dataMonetizationStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      apiRevenueProgramAbsentCount: safeNumber(r.noapi, 0),
      dataLicensingProgramAbsentCount: safeNumber(r.nolicensing, 0),
      thirdPartyIntegrationEcosystemThinCount: safeNumber(r.thinpartners, 0),
      benchmarkingDataProductAbsentCount: safeNumber(r.nobenchmarking, 0),
      predictiveModelApiAbsentCount: safeNumber(r.nopredictive, 0),
      privacyComplianceProgramWeakCount: safeNumber(r.weakprivacy, 0),
      dataValuationTrackingAbsentCount: safeNumber(r.novaluation, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, dataMonetizationStrategyAbsentCount: 0, apiRevenueProgramAbsentCount: 0, dataLicensingProgramAbsentCount: 0, thirdPartyIntegrationEcosystemThinCount: 0, benchmarkingDataProductAbsentCount: 0, predictiveModelApiAbsentCount: 0, privacyComplianceProgramWeakCount: 0, dataValuationTrackingAbsentCount: 0 };
  }
};

export const updateDataMonetizationAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
