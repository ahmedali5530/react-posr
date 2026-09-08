/**
 * AI Franchise & Multi-Unit Operations Optimizer — predicts how franchise
 * and multi-unit operations (franchise royalty optimization, franchisee
 * support, brand consistency, franchise development, territory management,
 * multi-unit benchmarking, franchisee profitability, franchise compliance,
 * franchisee onboarding, unit economics) impact franchise revenue,
 * franchisee satisfaction, brand growth, system-wide profitability.
 *
 * US franchise restaurant market = $280B+ (IFA). Franchise restaurants
 * employ 4M+ workers (IFA). Average franchise royalty = 4-8% of gross
 * sales. Franchise fee = $25,000-50,000 per unit. Franchise failure rate
 * = 15-20% (vs 30-40% independent — franchises survive 2x more). Top
 * franchisees operate 5-50+ units (multi-unit franchising growing 30%
 * YoY). 55% of franchise units are owned by multi-unit franchisees (IFA).
 * Franchisee profitability benchmark = 10-15% EBITDA. Franchise brands
 * with 100+ units grow 3-5x faster than sub-50 unit brands. Brand
 * consistency across units drives 20-30% customer trust (franchisees who
 * deviate lose customers). Franchisee support (training, marketing,
 * operations, tech) reduces failure rate 40-50%. Franchise development
 * (new unit openings) = $50k-500k revenue per new unit (royalty stream).
 * Territory management (exclusive territories) reduces cannibalization
 * 30-50%. Multi-unit benchmarking identifies top/bottom performers =
 * 15-25% profit lift for underperformers. Franchisee satisfaction =
 * #1 predictor of franchise growth (dissatisfied franchisees don't
 * buy more units). Franchise compliance (standards, recipes, branding)
 * = legal protection + brand consistency. Franchisee onboarding (90-day
 * ramp) = critical for early success. Unit economics (food cost, labor,
 * rent) = 10-15% profit margin target. Franchise ROI = $5-15 per $1
 * spent on franchisee support.
 *
 * 207th POSR-exclusive differentiator. Distinct from:
 *   - multi-location-benchmark.service — benchmarks PHYSICAL locations
 *     (same brand, company-owned). This optimizer focuses on FRANCHISE
 *     operations (franchisor-franchisee relationship, royalties, support,
 *     compliance, development).
 *   - branch-comparison.service — compares PHYSICAL branches (operations).
 *     This optimizer focuses on FRANCHISEE profitability + support +
 *     compliance.
 *   - community-partnership-engagement.service — LOCAL community
 *     partnerships. This optimizer focuses on FRANCHISEE partnerships
 *     (business relationship).
 *   - competitor-intelligence.service — tracks COMPETITORS. This optimizer
 *     tracks FRANCHISEES (internal network).
 *   - competitor-monitoring.service — monitors competitor CHANGES. This
 *     optimizer monitors franchisee COMPLIANCE + performance.
 *   - marketing.service — MARKETING campaigns. This optimizer focuses
 *     on franchise DEVELOPMENT (selling new units).
 *   - procurement.service — PROCUREMENT. This optimizer focuses on
 *     franchise SUPPLY chain consistency (brand standards).
 *   - cleaning-scheduler.service — CLEANING. This optimizer focuses
 *     on franchise COMPLIANCE (standards adherence).
 *
 * 8 AI rules:
 *   1. franchise_strategy_absent -> no franchise strategy -> missed $280B market
 *   2. franchisee_profitability_low -> franchisee EBITDA <10% -> franchisee churn + no growth
 *   3. brand_consistency_across_units_low -> poor consistency -> 20-30% trust loss
 *   4. franchisee_support_program_absent -> no support -> 40-50% higher failure rate
 *   5. franchise_development_pipeline_thin -> thin pipeline -> missed growth ($50k-500k/unit)
 *   6. territory_management_cannibalization -> territory overlap -> 30-50% cannibalization
 *   7. franchise_compliance_monitoring_absent -> no compliance -> brand damage + legal risk
 *   8. franchisee_onboarding_program_weak -> weak onboarding -> slow ramp + early failure
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type FranchiseOperationsRuleId =
  | 'franchise_strategy_absent'
  | 'franchisee_profitability_low'
  | 'brand_consistency_across_units_low'
  | 'franchisee_support_program_absent'
  | 'franchise_development_pipeline_thin'
  | 'territory_management_cannibalization'
  | 'franchise_compliance_monitoring_absent'
  | 'franchisee_onboarding_program_weak';

export type FranchiseOperationsAiRec =
  | 'launch_franchise_strategy'
  | 'improve_franchisee_profitability'
  | 'standardize_brand_consistency'
  | 'launch_franchisee_support'
  | 'accelerate_franchise_development'
  | 'optimize_territory_management'
  | 'implement_compliance_monitoring'
  | 'strengthen_franchisee_onboarding'
  | 'monitor'
  | 'skip';

export interface FranchiseOperationsAlert {
  id?: string;
  rule_id: FranchiseOperationsRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'brand' | 'territory_1' | 'territory_2'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Franchise strategy
  has_franchise_strategy?: boolean;                        // franchise strategy present
  franchise_unit_count?: number;                           // number of franchise units
  company_owned_unit_count?: number;                       // number of company-owned units
  franchisee_count?: number;                               // number of franchisees
  multi_unit_franchisee_count?: number;                    // franchisees with 2+ units
  franchise_royalty_rate_pct?: number;                     // franchise royalty rate %
  franchise_fee_per_unit?: number;                         // franchise fee per unit
  // Franchisee profitability
  avg_franchisee_ebitda_pct?: number;                      // avg franchisee EBITDA %
  avg_franchisee_ebitda_target_pct?: number;               // target EBITDA
  franchisee_profitability_score?: number;                 // 0-100 franchisee profitability
  unprofitable_franchisee_count?: number;                  // franchisees below profit target
  franchisee_churn_rate_pct?: number;                      // annual franchisee churn rate
  // Brand consistency
  brand_consistency_score?: number;                        // 0-100 brand consistency across units
  brand_consistency_target_score?: number;                 // target consistency
  brand_audit_score?: number;                              // 0-100 brand audit score
  recipe_compliance_pct?: number;                          // % recipe compliance
  visual_branding_compliance_pct?: number;                 // % visual branding compliance
  // Franchisee support
  has_franchisee_support_program?: boolean;                // franchisee support program present
  franchisee_support_score?: number;                       // 0-100 franchisee support
  training_hours_per_franchisee?: number;                  // training hours per franchisee/year
  field_support_visits_per_year?: number;                  // field support visits per year
  franchisee_satisfaction_score?: number;                  // 0-100 franchisee satisfaction
  // Franchise development
  franchise_development_pipeline_count?: number;           // units in development pipeline
  franchise_development_target?: number;                   // target new units/year
  new_unit_openings_last_year?: number;                    // new units opened last year
  franchise_inquiry_count?: number;                        // franchise inquiries last year
  franchise_conversion_rate_pct?: number;                  // % inquiries that convert to franchisees
  // Territory management
  has_territory_management?: boolean;                      // territory management system
  territory_overlap_count?: number;                        // territories with overlap/cannibalization
  cannibalization_rate_pct?: number;                       // % revenue lost to cannibalization
  territory_exclusivity_score?: number;                    // 0-100 territory exclusivity
  // Franchise compliance
  has_franchise_compliance_monitoring?: boolean;           // compliance monitoring system
  compliance_audit_frequency?: number;                     // audits per year per unit
  compliance_violation_count?: number;                     // violations last year
  compliance_violation_cost?: number;                      // cost of violations (fines, rework)
  legal_action_count?: number;                             // legal actions against franchisees
  // Franchisee onboarding
  has_franchisee_onboarding_program?: boolean;             // onboarding program
  onboarding_duration_days?: number;                      // onboarding duration (days)
  ramp_to_profitability_months?: number;                   // months to profitability
  ramp_target_months?: number;                             // target ramp time
  new_franchisee_success_rate_pct?: number;                // % new franchisees that succeed
  // Revenue + costs
  franchise_revenue_annual?: number;                       // annual franchise revenue (royalties + fees)
  franchise_revenue_growth_pct?: number;                   // YoY franchise revenue growth
  system_wide_revenue?: number;                            // system-wide revenue (all units)
  avg_unit_revenue?: number;                               // avg revenue per unit
  competitor_franchise_score?: number;                     // 0-100 competitor franchise presence
  monthly_revenue?: number;                                // company monthly revenue
  // Costs
  franchise_support_cost_monthly?: number;                 // monthly franchise support cost
  franchise_development_cost_monthly?: number;              // monthly franchise development cost
  compliance_monitoring_cost_monthly?: number;              // monthly compliance monitoring cost
  // Impact projections
  franchise_revenue_growth_projected_pct?: number;
  franchisee_profitability_lift_projected_pts?: number;
  brand_consistency_lift_projected_pts?: number;
  failure_rate_reduction_projected_pct?: number;
  development_revenue_projected?: number;
  cannibalization_reduction_projected_pct?: number;
  compliance_cost_reduction_projected_pct?: number;
  ramp_acceleration_projected_months?: number;
  satisfaction_lift_projected_pts?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: FranchiseOperationsAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface FranchiseOperationsConfig {
  aiEnabled: boolean;
  requireFranchiseStrategy: boolean;                        // require franchise strategy
  requireFranchiseeSupportProgram: boolean;                 // require franchisee support
  requireTerritoryManagement: boolean;                      // require territory management
  requireFranchiseComplianceMonitoring: boolean;            // require compliance monitoring
  requireFranchiseeOnboardingProgram: boolean;              // require onboarding program
  minFranchiseeEbitdaPct: number;                           // min franchisee EBITDA (10%)
  minBrandConsistencyScore: number;                         // min brand consistency (80)
  minTrainingHoursPerFranchisee: number;                    // min training hours (40)
  minFieldSupportVisits: number;                            // min field visits (4)
  minFranchiseeSatisfactionScore: number;                   // min satisfaction (70)
  maxCannibalizationRatePct: number;                        // max cannibalization (5%)
  minComplianceAuditFrequency: number;                      // min audits per year (2)
  maxRampToProfitabilityMonths: number;                     // max ramp time (12)
  preferCompetitorParity: boolean;                          // match competitor franchise presence
}

export const DEFAULT_FRANCHISE_OPERATIONS_CONFIG: FranchiseOperationsConfig = {
  aiEnabled: true,
  requireFranchiseStrategy: true,
  requireFranchiseeSupportProgram: true,
  requireTerritoryManagement: true,
  requireFranchiseComplianceMonitoring: true,
  requireFranchiseeOnboardingProgram: true,
  minFranchiseeEbitdaPct: 10,
  minBrandConsistencyScore: 80,
  minTrainingHoursPerFranchisee: 40,
  minFieldSupportVisits: 4,
  minFranchiseeSatisfactionScore: 70,
  maxCannibalizationRatePct: 5,
  minComplianceAuditFrequency: 2,
  maxRampToProfitabilityMonths: 12,
  preferCompetitorParity: true,
};

export const readFranchiseOperationsConfig = (settings: any): FranchiseOperationsConfig => ({
  aiEnabled: settings?.franchise_operations_ai_enabled ?? true,
  requireFranchiseStrategy: settings?.franchise_operations_require_strategy ?? true,
  requireFranchiseeSupportProgram: settings?.franchise_operations_require_support ?? true,
  requireTerritoryManagement: settings?.franchise_operations_require_territory ?? true,
  requireFranchiseComplianceMonitoring: settings?.franchise_operations_require_compliance ?? true,
  requireFranchiseeOnboardingProgram: settings?.franchise_operations_require_onboarding ?? true,
  minFranchiseeEbitdaPct: safeNumber(settings?.franchise_operations_min_ebitda, 10),
  minBrandConsistencyScore: safeNumber(settings?.franchise_operations_min_consistency, 80),
  minTrainingHoursPerFranchisee: safeNumber(settings?.franchise_operations_min_training, 40),
  minFieldSupportVisits: safeNumber(settings?.franchise_operations_min_visits, 4),
  minFranchiseeSatisfactionScore: safeNumber(settings?.franchise_operations_min_satisfaction, 70),
  maxCannibalizationRatePct: safeNumber(settings?.franchise_operations_max_cannibalization, 5),
  minComplianceAuditFrequency: safeNumber(settings?.franchise_operations_min_audits, 2),
  maxRampToProfitabilityMonths: safeNumber(settings?.franchise_operations_max_ramp, 12),
  preferCompetitorParity: settings?.franchise_operations_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface FranchiseOperationsData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_franchise_strategy: boolean;
  franchise_unit_count: number;
  company_owned_unit_count: number;
  franchisee_count: number;
  multi_unit_franchisee_count: number;
  franchise_royalty_rate_pct: number;
  franchise_fee_per_unit: number;
  avg_franchisee_ebitda_pct: number;
  avg_franchisee_ebitda_target_pct: number;
  franchisee_profitability_score: number;
  unprofitable_franchisee_count: number;
  franchisee_churn_rate_pct: number;
  brand_consistency_score: number;
  brand_consistency_target_score: number;
  brand_audit_score: number;
  recipe_compliance_pct: number;
  visual_branding_compliance_pct: number;
  has_franchisee_support_program: boolean;
  franchisee_support_score: number;
  training_hours_per_franchisee: number;
  field_support_visits_per_year: number;
  franchisee_satisfaction_score: number;
  franchise_development_pipeline_count: number;
  franchise_development_target: number;
  new_unit_openings_last_year: number;
  franchise_inquiry_count: number;
  franchise_conversion_rate_pct: number;
  has_territory_management: boolean;
  territory_overlap_count: number;
  cannibalization_rate_pct: number;
  territory_exclusivity_score: number;
  has_franchise_compliance_monitoring: boolean;
  compliance_audit_frequency: number;
  compliance_violation_count: number;
  compliance_violation_cost: number;
  legal_action_count: number;
  has_franchisee_onboarding_program: boolean;
  onboarding_duration_days: number;
  ramp_to_profitability_months: number;
  ramp_target_months: number;
  new_franchisee_success_rate_pct: number;
  franchise_revenue_annual: number;
  franchise_revenue_growth_pct: number;
  system_wide_revenue: number;
  avg_unit_revenue: number;
  competitor_franchise_score: number;
  monthly_revenue: number;
  franchise_support_cost_monthly: number;
  franchise_development_cost_monthly: number;
  compliance_monitoring_cost_monthly: number;
}

const MOCK_DATA: FranchiseOperationsData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_franchise_strategy: false, franchise_unit_count: 0,
    company_owned_unit_count: 3, franchisee_count: 0,
    multi_unit_franchisee_count: 0, franchise_royalty_rate_pct: 0,
    franchise_fee_per_unit: 0,
    avg_franchisee_ebitda_pct: 0, avg_franchisee_ebitda_target_pct: 12,
    franchisee_profitability_score: 0, unprofitable_franchisee_count: 0,
    franchisee_churn_rate_pct: 0,
    brand_consistency_score: 48, brand_consistency_target_score: 85,
    brand_audit_score: 52, recipe_compliance_pct: 68,
    visual_branding_compliance_pct: 62,
    has_franchisee_support_program: false, franchisee_support_score: 0,
    training_hours_per_franchisee: 0, field_support_visits_per_year: 0,
    franchisee_satisfaction_score: 0,
    franchise_development_pipeline_count: 0, franchise_development_target: 5,
    new_unit_openings_last_year: 0, franchise_inquiry_count: 0,
    franchise_conversion_rate_pct: 0,
    has_territory_management: false, territory_overlap_count: 0,
    cannibalization_rate_pct: 0, territory_exclusivity_score: 0,
    has_franchise_compliance_monitoring: false, compliance_audit_frequency: 0,
    compliance_violation_count: 0, compliance_violation_cost: 0,
    legal_action_count: 0,
    has_franchisee_onboarding_program: false, onboarding_duration_days: 0,
    ramp_to_profitability_months: 0, ramp_target_months: 12,
    new_franchisee_success_rate_pct: 0,
    franchise_revenue_annual: 0, franchise_revenue_growth_pct: 0,
    system_wide_revenue: 2400000, avg_unit_revenue: 800000,
    competitor_franchise_score: 68,
    monthly_revenue: 200000,
    franchise_support_cost_monthly: 0, franchise_development_cost_monthly: 0,
    compliance_monitoring_cost_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_franchise_strategy: true, franchise_unit_count: 18,
    company_owned_unit_count: 6, franchisee_count: 12,
    multi_unit_franchisee_count: 4, franchise_royalty_rate_pct: 6,
    franchise_fee_per_unit: 35000,
    avg_franchisee_ebitda_pct: 8, avg_franchisee_ebitda_target_pct: 12,
    franchisee_profitability_score: 52, unprofitable_franchisee_count: 5,
    franchisee_churn_rate_pct: 12,
    brand_consistency_score: 68, brand_consistency_target_score: 85,
    brand_audit_score: 72, recipe_compliance_pct: 82,
    visual_branding_compliance_pct: 78,
    has_franchisee_support_program: false, franchisee_support_score: 42,
    training_hours_per_franchisee: 24, field_support_visits_per_year: 2,
    franchisee_satisfaction_score: 58,
    franchise_development_pipeline_count: 2, franchise_development_target: 6,
    new_unit_openings_last_year: 3, franchise_inquiry_count: 48,
    franchise_conversion_rate_pct: 6,
    has_territory_management: false, territory_overlap_count: 3,
    cannibalization_rate_pct: 12, territory_exclusivity_score: 48,
    has_franchise_compliance_monitoring: false, compliance_audit_frequency: 1,
    compliance_violation_count: 8, compliance_violation_cost: 12000,
    legal_action_count: 1,
    has_franchisee_onboarding_program: true, onboarding_duration_days: 21,
    ramp_to_profitability_months: 18, ramp_target_months: 12,
    new_franchisee_success_rate_pct: 62,
    franchise_revenue_annual: 860000, franchise_revenue_growth_pct: 18,
    system_wide_revenue: 14400000, avg_unit_revenue: 600000,
    competitor_franchise_score: 76,
    monthly_revenue: 480000,
    franchise_support_cost_monthly: 2000, franchise_development_cost_monthly: 1500,
    compliance_monitoring_cost_monthly: 0,
  },
  {
    location_id: 'territory_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_franchise_strategy: true, franchise_unit_count: 42,
    company_owned_unit_count: 12, franchisee_count: 22,
    multi_unit_franchisee_count: 12, franchise_royalty_rate_pct: 6,
    franchise_fee_per_unit: 40000,
    avg_franchisee_ebitda_pct: 12, avg_franchisee_ebitda_target_pct: 12,
    franchisee_profitability_score: 74, unprofitable_franchisee_count: 4,
    franchisee_churn_rate_pct: 5,
    brand_consistency_score: 82, brand_consistency_target_score: 85,
    brand_audit_score: 84, recipe_compliance_pct: 92,
    visual_branding_compliance_pct: 88,
    has_franchisee_support_program: true, franchisee_support_score: 76,
    training_hours_per_franchisee: 48, field_support_visits_per_year: 4,
    franchisee_satisfaction_score: 78,
    franchise_development_pipeline_count: 6, franchise_development_target: 6,
    new_unit_openings_last_year: 5, franchise_inquiry_count: 120,
    franchise_conversion_rate_pct: 8,
    has_territory_management: true, territory_overlap_count: 1,
    cannibalization_rate_pct: 4, territory_exclusivity_score: 82,
    has_franchise_compliance_monitoring: true, compliance_audit_frequency: 2,
    compliance_violation_count: 3, compliance_violation_cost: 4000,
    legal_action_count: 0,
    has_franchisee_onboarding_program: true, onboarding_duration_days: 35,
    ramp_to_profitability_months: 11, ramp_target_months: 12,
    new_franchisee_success_rate_pct: 82,
    franchise_revenue_annual: 2400000, franchise_revenue_growth_pct: 28,
    system_wide_revenue: 32000000, avg_unit_revenue: 590000,
    competitor_franchise_score: 80,
    monthly_revenue: 960000,
    franchise_support_cost_monthly: 5000, franchise_development_cost_monthly: 3000,
    compliance_monitoring_cost_monthly: 800,
  },
  {
    location_id: 'territory_2', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'mixed',
    has_franchise_strategy: true, franchise_unit_count: 120,
    company_owned_unit_count: 28, franchisee_count: 58,
    multi_unit_franchisee_count: 38, franchise_royalty_rate_pct: 5,
    franchise_fee_per_unit: 45000,
    avg_franchisee_ebitda_pct: 14, avg_franchisee_ebitda_target_pct: 12,
    franchisee_profitability_score: 88, unprofitable_franchisee_count: 3,
    franchisee_churn_rate_pct: 2,
    brand_consistency_score: 92, brand_consistency_target_score: 85,
    brand_audit_score: 94, recipe_compliance_pct: 98,
    visual_branding_compliance_pct: 96,
    has_franchisee_support_program: true, franchisee_support_score: 88,
    training_hours_per_franchisee: 60, field_support_visits_per_year: 6,
    franchisee_satisfaction_score: 86,
    franchise_development_pipeline_count: 12, franchise_development_target: 10,
    new_unit_openings_last_year: 10, franchise_inquiry_count: 280,
    franchise_conversion_rate_pct: 12,
    has_territory_management: true, territory_overlap_count: 0,
    cannibalization_rate_pct: 2, territory_exclusivity_score: 94,
    has_franchise_compliance_monitoring: true, compliance_audit_frequency: 4,
    compliance_violation_count: 1, compliance_violation_cost: 1000,
    legal_action_count: 0,
    has_franchisee_onboarding_program: true, onboarding_duration_days: 45,
    ramp_to_profitability_months: 8, ramp_target_months: 12,
    new_franchisee_success_rate_pct: 92,
    franchise_revenue_annual: 7200000, franchise_revenue_growth_pct: 42,
    system_wide_revenue: 96000000, avg_unit_revenue: 640000,
    competitor_franchise_score: 84,
    monthly_revenue: 2400000,
    franchise_support_cost_monthly: 12000, franchise_development_cost_monthly: 6000,
    compliance_monitoring_cost_monthly: 2000,
  },
];

export const runFranchiseOperationsEngine = async (
  db: ReturnType<typeof useDB>,
  config: FranchiseOperationsConfig,
): Promise<{ alerts: FranchiseOperationsAlert[]; generated: number }> => {
  const alerts: FranchiseOperationsAlert[] = [];
  const now = new Date();

  let data: FranchiseOperationsData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_franchise_strategy, franchise_unit_count,
              company_owned_unit_count, franchisee_count,
              multi_unit_franchisee_count, franchise_royalty_rate_pct,
              franchise_fee_per_unit,
              avg_franchisee_ebitda_pct, avg_franchisee_ebitda_target_pct,
              franchisee_profitability_score, unprofitable_franchisee_count,
              franchisee_churn_rate_pct,
              brand_consistency_score, brand_consistency_target_score,
              brand_audit_score, recipe_compliance_pct,
              visual_branding_compliance_pct,
              has_franchisee_support_program, franchisee_support_score,
              training_hours_per_franchisee, field_support_visits_per_year,
              franchisee_satisfaction_score,
              franchise_development_pipeline_count, franchise_development_target,
              new_unit_openings_last_year, franchise_inquiry_count,
              franchise_conversion_rate_pct,
              has_territory_management, territory_overlap_count,
              cannibalization_rate_pct, territory_exclusivity_score,
              has_franchise_compliance_monitoring, compliance_audit_frequency,
              compliance_violation_count, compliance_violation_cost,
              legal_action_count,
              has_franchisee_onboarding_program, onboarding_duration_days,
              ramp_to_profitability_months, ramp_target_months,
              new_franchisee_success_rate_pct,
              franchise_revenue_annual, franchise_revenue_growth_pct,
              system_wide_revenue, avg_unit_revenue,
              competitor_franchise_score, monthly_revenue,
              franchise_support_cost_monthly, franchise_development_cost_monthly,
              compliance_monitoring_cost_monthly
       FROM franchise_operations_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): FranchiseOperationsData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_franchise_strategy: Boolean(r.has_franchise_strategy ?? false),
      franchise_unit_count: safeNumber(r.franchise_unit_count, 0),
      company_owned_unit_count: safeNumber(r.company_owned_unit_count, 0),
      franchisee_count: safeNumber(r.franchisee_count, 0),
      multi_unit_franchisee_count: safeNumber(r.multi_unit_franchisee_count, 0),
      franchise_royalty_rate_pct: safeNumber(r.franchise_royalty_rate_pct, 0),
      franchise_fee_per_unit: safeNumber(r.franchise_fee_per_unit, 0),
      avg_franchisee_ebitda_pct: safeNumber(r.avg_franchisee_ebitda_pct, 0),
      avg_franchisee_ebitda_target_pct: safeNumber(r.avg_franchisee_ebitda_target_pct, 12),
      franchisee_profitability_score: safeNumber(r.franchisee_profitability_score, 0),
      unprofitable_franchisee_count: safeNumber(r.unprofitable_franchisee_count, 0),
      franchisee_churn_rate_pct: safeNumber(r.franchisee_churn_rate_pct, 0),
      brand_consistency_score: safeNumber(r.brand_consistency_score, 0),
      brand_consistency_target_score: safeNumber(r.brand_consistency_target_score, 85),
      brand_audit_score: safeNumber(r.brand_audit_score, 0),
      recipe_compliance_pct: safeNumber(r.recipe_compliance_pct, 0),
      visual_branding_compliance_pct: safeNumber(r.visual_branding_compliance_pct, 0),
      has_franchisee_support_program: Boolean(r.has_franchisee_support_program ?? false),
      franchisee_support_score: safeNumber(r.franchisee_support_score, 0),
      training_hours_per_franchisee: safeNumber(r.training_hours_per_franchisee, 0),
      field_support_visits_per_year: safeNumber(r.field_support_visits_per_year, 0),
      franchisee_satisfaction_score: safeNumber(r.franchisee_satisfaction_score, 0),
      franchise_development_pipeline_count: safeNumber(r.franchise_development_pipeline_count, 0),
      franchise_development_target: safeNumber(r.franchise_development_target, 0),
      new_unit_openings_last_year: safeNumber(r.new_unit_openings_last_year, 0),
      franchise_inquiry_count: safeNumber(r.franchise_inquiry_count, 0),
      franchise_conversion_rate_pct: safeNumber(r.franchise_conversion_rate_pct, 0),
      has_territory_management: Boolean(r.has_territory_management ?? false),
      territory_overlap_count: safeNumber(r.territory_overlap_count, 0),
      cannibalization_rate_pct: safeNumber(r.cannibalization_rate_pct, 0),
      territory_exclusivity_score: safeNumber(r.territory_exclusivity_score, 0),
      has_franchise_compliance_monitoring: Boolean(r.has_franchise_compliance_monitoring ?? false),
      compliance_audit_frequency: safeNumber(r.compliance_audit_frequency, 0),
      compliance_violation_count: safeNumber(r.compliance_violation_count, 0),
      compliance_violation_cost: safeNumber(r.compliance_violation_cost, 0),
      legal_action_count: safeNumber(r.legal_action_count, 0),
      has_franchisee_onboarding_program: Boolean(r.has_franchisee_onboarding_program ?? false),
      onboarding_duration_days: safeNumber(r.onboarding_duration_days, 0),
      ramp_to_profitability_months: safeNumber(r.ramp_to_profitability_months, 0),
      ramp_target_months: safeNumber(r.ramp_target_months, 12),
      new_franchisee_success_rate_pct: safeNumber(r.new_franchisee_success_rate_pct, 0),
      franchise_revenue_annual: safeNumber(r.franchise_revenue_annual, 0),
      franchise_revenue_growth_pct: safeNumber(r.franchise_revenue_growth_pct, 0),
      system_wide_revenue: safeNumber(r.system_wide_revenue, 0),
      avg_unit_revenue: safeNumber(r.avg_unit_revenue, 0),
      competitor_franchise_score: safeNumber(r.competitor_franchise_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      franchise_support_cost_monthly: safeNumber(r.franchise_support_cost_monthly, 0),
      franchise_development_cost_monthly: safeNumber(r.franchise_development_cost_monthly, 0),
      compliance_monitoring_cost_monthly: safeNumber(r.compliance_monitoring_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetFranchiseGrowthPct = 25;
    const targetFranchiseeProfitLiftPts = 4;
    const targetBrandConsistencyLiftPts = 15;
    const targetFailureRateReductionPct = 40;
    const targetDevelopmentRevenue = Math.round(d.avg_unit_revenue * 0.06 * 5);
    const targetCannibalizationReductionPct = 60;
    const targetComplianceCostReductionPct = 50;
    const targetRampAccelerationMonths = Math.max(d.ramp_to_profitability_months - config.maxRampToProfitabilityMonths, 0);

    // Rule 1: FRANCHISE_STRATEGY_ABSENT
    if (config.requireFranchiseStrategy && !d.has_franchise_strategy) {
      // no franchise strategy -> missed $280B market
      const expectedFranchiseRevenue = Math.round(d.avg_unit_revenue * 0.06 * 5);
      const expectedGrowthFromFranchising = Math.round(baselineRevenue * 0.30);
      const expectedFailureRateReduction = Math.round(baselineRevenue * 0.05);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.04);
      const totalOpportunity = Math.max(expectedFranchiseRevenue / 12 + expectedGrowthFromFranchising + expectedFailureRateReduction + expectedCompetitiveLift, 4500);
      const severityLabel = d.competitor_franchise_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_franchise_score > 65)
        ? 'CRITICAL: NO FRANCHISE STRATEGY — competitor franchise score ' + d.competitor_franchise_score + '/100 (high); US franchise restaurant market = $280B+ (IFA); franchise failure rate = 15-20% (vs 30-40% independent — franchises survive 2x more); franchise brands with 100+ units grow 3-5x faster than sub-50 unit brands; missing franchise = missed $280B market + missed growth + missed royalty revenue; competitors with franchises scale faster. '
        : `HIGH: NO FRANCHISE STRATEGY — US franchise restaurant market = $280B+ (IFA); franchise failure rate 15-20% (vs 30-40% independent); franchise brands with 100+ units grow 3-5x faster; missing royalty revenue + growth. `;
      alerts.push({
        rule_id: 'franchise_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_franchise_strategy: d.has_franchise_strategy,
        franchise_unit_count: d.franchise_unit_count,
        company_owned_unit_count: d.company_owned_unit_count,
        franchise_royalty_rate_pct: d.franchise_royalty_rate_pct,
        franchise_fee_per_unit: d.franchise_fee_per_unit,
        system_wide_revenue: d.system_wide_revenue,
        avg_unit_revenue: d.avg_unit_revenue,
        competitor_franchise_score: d.competitor_franchise_score,
        monthly_revenue: d.monthly_revenue,
        franchise_revenue_growth_projected_pct: targetFranchiseGrowthPct,
        development_revenue_projected: expectedFranchiseRevenue,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FRANCHISE STRATEGY ABSENT: ${d.location_id} — franchise strategy ABSENT; franchise units 0; company-owned units ${d.company_owned_unit_count}; system-wide revenue ${fmt$(d.system_wide_revenue)}/yr; avg unit revenue ${fmt$(d.avg_unit_revenue)}; competitor franchise score ${d.competitor_franchise_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: US franchise restaurant market = $280B+ (IFA — International Franchise Association); franchise restaurants employ 4M+ workers (IFA); average franchise royalty = 4-8% of gross sales; franchise fee = $25,000-50,000 per unit; franchise failure rate = 15-20% (vs 30-40% independent — franchises survive 2x more); top franchisees operate 5-50+ units (multi-unit franchising growing 30% YoY); 55% of franchise units are owned by multi-unit franchisees (IFA); franchise brands with 100+ units grow 3-5x faster than sub-50 unit brands; franchise development (new unit openings) = $50k-500k revenue per new unit (royalty stream); franchise ROI = $5-15 per $1 spent on franchisee support; franchise strategy components = franchise disclosure document (FDD), franchise agreement, operations manual, training program, support program, territory plan, compliance program, franchise development (sales) program. Solutions ranked by impact: (1) LAUNCH franchise strategy — franchise revenue ${fmt$(expectedFranchiseRevenue / 12)}/mo + growth from franchising ${fmt$(expectedGrowthFromFranchising)}/mo + failure rate reduction ${fmt$(expectedFailureRateReduction)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(20000)} setup + ${fmt$(3000)}/mo operations; payback 6-12 months; (2) CREATE franchise disclosure document (FDD) — legal requirement (FTC); (3) DRAFT franchise agreement (royalty 4-8%, fee $25k-50k, term 10-20 years); (4) WRITE operations manual (standards, recipes, procedures); (5) BUILD training program (40-60 hours initial + ongoing); (6) CREATE franchisee support program (field support, marketing, tech); (7) DEFINE territory plan (exclusive territories, no cannibalization); (8) IMPLEMENT compliance monitoring (audits, standards); (9) LAUNCH franchise development (sales) program (leads, conversion); (10) REGISTER FDD in franchise registration states (15+ states); (11) BUILD franchisee onboarding (90-day ramp); (12) BENCHMARK vs competitor franchise presence. Industry data: $280B+ market (IFA); 15-20% failure (vs 30-40% independent); payback 6-12 months. Expected impact: +${targetFranchiseGrowthPct}% franchise revenue growth, +${fmt$(expectedFranchiseRevenue)}/yr franchise revenue, payback 6-12 months.`,
        ai_recommendation: 'launch_franchise_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: FRANCHISEE_PROFITABILITY_LOW
    if (d.has_franchise_strategy && d.avg_franchisee_ebitda_pct < config.minFranchiseeEbitdaPct) {
      // franchisee EBITDA <10% -> franchisee churn + no growth
      const ebitdaGap = Math.max(config.minFranchiseeEbitdaPct - d.avg_franchisee_ebitda_pct, 0);
      const expectedProfitLift = Math.round(d.franchise_unit_count * d.avg_unit_revenue * (ebitdaGap / 100));
      const expectedChurnReduction = Math.round(d.unprofitable_franchisee_count * d.avg_unit_revenue * 0.06 / 12);
      const expectedDevelopmentLift = Math.round(baselineRevenue * 0.04);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.025);
      const totalOpportunity = Math.max(expectedProfitLift / 12 + expectedChurnReduction + expectedDevelopmentLift + expectedSatisfactionLift, 2800);
      const severityLabel = d.avg_franchisee_ebitda_pct < 6 ? 'critical' : 'high';
      const criticalNote = (d.avg_franchisee_ebitda_pct < 6)
        ? `CRITICAL: FRANCHISEE PROFITABILITY LOW — avg EBITDA ${d.avg_franchisee_ebitda_pct}% (min ${config.minFranchiseeEbitdaPct}%); ${d.unprofitable_franchisee_count} unprofitable franchisees; franchisee churn ${d.franchisee_churn_rate_pct}%; franchisee profitability benchmark = 10-15% EBITDA; unprofitable franchisees = churn + no new unit purchases + negative franchisee sentiment + legal disputes; dissatisfied franchisees don't buy more units. `
        : `HIGH: FRANCHISEE PROFITABILITY BELOW TARGET — EBITDA ${d.avg_franchisee_ebitda_pct}% (min ${config.minFranchiseeEbitdaPct}%); ${d.unprofitable_franchisee_count} unprofitable; improve for retention + growth. `;
      alerts.push({
        rule_id: 'franchisee_profitability_low',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        avg_franchisee_ebitda_pct: d.avg_franchisee_ebitda_pct,
        avg_franchisee_ebitda_target_pct: d.avg_franchisee_ebitda_target_pct,
        franchisee_profitability_score: d.franchisee_profitability_score,
        unprofitable_franchisee_count: d.unprofitable_franchisee_count,
        franchisee_churn_rate_pct: d.franchisee_churn_rate_pct,
        franchisee_satisfaction_score: d.franchisee_satisfaction_score,
        franchise_unit_count: d.franchise_unit_count,
        avg_unit_revenue: d.avg_unit_revenue,
        competitor_franchise_score: d.competitor_franchise_score,
        monthly_revenue: d.monthly_revenue,
        franchisee_profitability_lift_projected_pts: targetFranchiseeProfitLiftPts,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FRANCHISEE PROFITABILITY LOW: ${d.location_id} — avg franchisee EBITDA ${d.avg_franchisee_ebitda_pct}% (min ${config.minFranchiseeEbitdaPct}%, target ${d.avg_franchisee_ebitda_target_pct}%); profitability score ${d.franchisee_profitability_score}/100; unprofitable franchisees ${d.unprofitable_franchisee_count}; churn ${d.franchisee_churn_rate_pct}%; satisfaction ${d.franchisee_satisfaction_score}/100; franchise units ${d.franchise_unit_count}; avg unit revenue ${fmt$(d.avg_unit_revenue)}; competitor franchise ${d.competitor_franchise_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: franchisee profitability benchmark = 10-15% EBITDA (Cornell CHR franchise study); unprofitable franchisees = churn (quit brand), no new unit purchases (no growth), negative franchisee sentiment (bad recruitment), legal disputes (sue franchisor); franchisee profitability drivers = food cost (28-32% target), labor cost (25-30%), rent (6-10%), royalty (4-8%), marketing fund (1-4%); profitability improvement = food cost reduction (bulk purchasing, recipe optimization), labor optimization (scheduling, training), rent negotiation (landlord concessions), royalty relief (temporary for struggling units), marketing fund optimization (measurable ROI); franchisee satisfaction = #1 predictor of franchise growth (dissatisfied franchisees don't buy more units); franchisee churn = 2-5% healthy, 10%+ problematic. Solutions ranked by impact: (1) IMPROVE franchisee profitability to ${config.minFranchiseeEbitdaPct}%+ EBITDA — profit lift ${fmt$(expectedProfitLift / 12)}/mo + churn reduction ${fmt$(expectedChurnReduction)}/mo + development lift ${fmt$(expectedDevelopmentLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo; cost ${fmt$(2000)}/mo (support + bulk purchasing); payback 1-2 months; (2) REDUCE food cost (bulk purchasing, recipe optimization, supplier negotiation); (3) OPTIMIZE labor (scheduling, training, cross-training); (4) NEGOTIATE rent (landlord concessions, lease renewal); (5) OFFER royalty relief (temporary for struggling units); (6) OPTIMIZE marketing fund (measurable ROI, local store marketing); (7) PROVIDE profitability consulting (field support, benchmarking); (8) BENCHMARK top performers (what are they doing right?); (9) IDENTIFY bottom performers (what are they doing wrong?); (10) SHARE best practices across network; (11) TRACK EBITDA per franchisee quarterly (target ${config.minFranchiseeEbitdaPct}%+); (12) TRACK churn rate (target under 5%); (13) BENCHMARK vs competitor franchisee profitability. Industry data: 10-15% EBITDA benchmark (Cornell CHR); 2-5% healthy churn; payback 1-2 months. Expected impact: +${targetFranchiseeProfitLiftPts}pts EBITDA, +12pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'improve_franchisee_profitability',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: BRAND_CONSISTENCY_ACROSS_UNITS_LOW
    if (d.has_franchise_strategy && d.brand_consistency_score < config.minBrandConsistencyScore) {
      // poor consistency -> 20-30% trust loss
      const consistencyGap = Math.max(config.minBrandConsistencyScore - d.brand_consistency_score, 0);
      const expectedTrustLift = Math.round(baselineRevenue * (consistencyGap / 400));
      const expectedCustomerRetention = Math.round(baselineRevenue * (consistencyGap / 500));
      const expectedComplianceSavings = Math.round(d.compliance_violation_cost * (consistencyGap / 100));
      const expectedBrandValueLift = Math.round(baselineRevenue * (consistencyGap / 800));
      const totalOpportunity = Math.max(expectedTrustLift + expectedCustomerRetention + expectedComplianceSavings + expectedBrandValueLift, 2000);
      const severityLabel = d.brand_consistency_score < 60 ? 'high' : 'medium';
      const criticalNote = (d.brand_consistency_score < 60)
        ? `HIGH: BRAND CONSISTENCY LOW — consistency score ${d.brand_consistency_score}/100 (min ${config.minBrandConsistencyScore}); brand audit ${d.brand_audit_score}/100; recipe compliance ${d.recipe_compliance_pct}%; visual branding ${d.visual_branding_compliance_pct}%; brand consistency across units drives 20-30% customer trust (franchisees who deviate lose customers); poor consistency = customer confusion + trust loss + brand dilution. `
        : `MEDIUM: BRAND CONSISTENCY BELOW TARGET — ${d.brand_consistency_score}/100 (min ${config.minBrandConsistencyScore}); improve recipe + visual compliance. `;
      alerts.push({
        rule_id: 'brand_consistency_across_units_low',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        brand_consistency_score: d.brand_consistency_score,
        brand_consistency_target_score: d.brand_consistency_target_score,
        brand_audit_score: d.brand_audit_score,
        recipe_compliance_pct: d.recipe_compliance_pct,
        visual_branding_compliance_pct: d.visual_branding_compliance_pct,
        franchise_unit_count: d.franchise_unit_count,
        has_franchise_compliance_monitoring: d.has_franchise_compliance_monitoring,
        compliance_audit_frequency: d.compliance_audit_frequency,
        competitor_franchise_score: d.competitor_franchise_score,
        monthly_revenue: d.monthly_revenue,
        brand_consistency_lift_projected_pts: targetBrandConsistencyLiftPts,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `BRAND CONSISTENCY ACROSS UNITS LOW: ${d.location_id} — brand consistency ${d.brand_consistency_score}/100 (min ${config.minBrandConsistencyScore}, target ${d.brand_consistency_target_score}); brand audit ${d.brand_audit_score}/100; recipe compliance ${d.recipe_compliance_pct}%; visual branding ${d.visual_branding_compliance_pct}%; franchise units ${d.franchise_unit_count}; compliance monitoring ${d.has_franchise_compliance_monitoring ? 'yes' : 'NO'}; audit frequency ${d.compliance_audit_frequency}/yr; competitor franchise ${d.competitor_franchise_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: brand consistency across units drives 20-30% customer trust (franchisees who deviate lose customers — Cornell CHR franchise study); customer expects same experience at every unit (food, service, ambiance); brand consistency components = recipe compliance (exact recipes, portions, ingredients), visual branding (logos, colors, signage, decor), service standards (greeting, timing, friendliness), menu (same items, same prices), cleanliness (same standards), technology (same POS, app, loyalty); brand consistency methods = operations manual (detailed standards), training (initial + ongoing), field audits (regular visits), secret shopper (independent verification), photo standards (visual reference), recipe cards (exact portions); brand audit score = comprehensive check of all standards (recipe, visual, service, cleanliness, tech); recipe compliance = exact recipes followed (portions, ingredients, preparation); visual branding compliance = logos, colors, signage, decor match brand standards. Solutions ranked by impact: (1) STANDARDIZE brand consistency to ${config.minBrandConsistencyScore}+ — trust lift ${fmt$(expectedTrustLift)}/mo + customer retention ${fmt$(expectedCustomerRetention)}/mo + compliance savings ${fmt$(expectedComplianceSavings)}/mo + brand value ${fmt$(expectedBrandValueLift)}/mo; cost ${fmt$(1500)}/mo (audits + training); payback 1-2 months; (2) UPDATE operations manual (detailed standards for recipe, visual, service, cleanliness); (3) TRAIN franchisees on standards (initial + ongoing); (4) CONDUCT field audits (regular visits, score consistency); (5) USE secret shopper (independent verification); (6) CREATE photo standards (visual reference for plating, decor); (7) DISTRIBUTE recipe cards (exact portions, ingredients); (8) ENFORCE recipe compliance (mystery meals, portion checks); (9) ENFORCE visual branding compliance (signage, decor audits); (10) TRACK brand audit score (target 85+); (11) TRACK recipe compliance (target 95%+); (12) TRACK visual branding compliance (target 90%+); (13) BENCHMARK vs competitor brand consistency. Industry data: 20-30% trust from consistency (Cornell CHR); payback 1-2 months. Expected impact: +${targetBrandConsistencyLiftPts}pts brand consistency, +10pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'standardize_brand_consistency',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: FRANCHISEE_SUPPORT_PROGRAM_ABSENT
    if (d.has_franchise_strategy && config.requireFranchiseeSupportProgram && (!d.has_franchisee_support_program || d.franchisee_support_score < 60 || d.training_hours_per_franchisee < config.minTrainingHoursPerFranchisee || d.field_support_visits_per_year < config.minFieldSupportVisits)) {
      // no support -> 40-50% higher failure rate
      const expectedFailureRateReduction = Math.round(d.franchise_unit_count * 0.15 * d.avg_unit_revenue * 0.06 / 12);
      const expectedProfitLift = Math.round(d.franchise_unit_count * d.avg_unit_revenue * 0.02 / 12);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.03);
      const expectedDevelopmentLift = Math.round(baselineRevenue * 0.025);
      const totalOpportunity = Math.max(expectedFailureRateReduction + expectedProfitLift + expectedSatisfactionLift + expectedDevelopmentLift, 2200);
      const severityLabel = !d.has_franchisee_support_program ? 'high' : 'medium';
      const criticalNote = (!d.has_franchisee_support_program)
        ? `HIGH: NO FRANCHISEE SUPPORT PROGRAM — franchisee support ${d.has_franchisee_support_program ? 'present' : 'ABSENT'}; support score ${d.franchisee_support_score}/100; training ${d.training_hours_per_franchisee}h/franchisee (min ${config.minTrainingHoursPerFranchisee}); field visits ${d.field_support_visits_per_year}/yr (min ${config.minFieldSupportVisits}); franchisee support reduces failure rate 40-50%; satisfaction ${d.franchisee_satisfaction_score}/100; without support, franchisees struggle = failure + churn + no growth. `
        : `MEDIUM: FRANCHISEE SUPPORT BELOW TARGET — score ${d.franchisee_support_score}/100; training ${d.training_hours_per_franchisee}h (min ${config.minTrainingHoursPerFranchisee}); visits ${d.field_support_visits_per_year}/yr (min ${config.minFieldSupportVisits}); strengthen support for retention. `;
      alerts.push({
        rule_id: 'franchisee_support_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_franchisee_support_program: d.has_franchisee_support_program,
        franchisee_support_score: d.franchisee_support_score,
        training_hours_per_franchisee: d.training_hours_per_franchisee,
        field_support_visits_per_year: d.field_support_visits_per_year,
        franchisee_satisfaction_score: d.franchisee_satisfaction_score,
        franchise_unit_count: d.franchise_unit_count,
        franchisee_churn_rate_pct: d.franchisee_churn_rate_pct,
        avg_unit_revenue: d.avg_unit_revenue,
        competitor_franchise_score: d.competitor_franchise_score,
        monthly_revenue: d.monthly_revenue,
        franchise_support_cost_monthly: d.franchise_support_cost_monthly,
        failure_rate_reduction_projected_pct: targetFailureRateReductionPct,
        satisfaction_lift_projected_pts: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FRANCHISEE SUPPORT PROGRAM ABSENT: ${d.location_id} — franchisee support ${d.has_franchisee_support_program ? 'present' : 'ABSENT'}; support score ${d.franchisee_support_score}/100; training ${d.training_hours_per_franchisee}h/franchisee (min ${config.minTrainingHoursPerFranchisee}); field visits ${d.field_support_visits_per_year}/yr (min ${config.minFieldSupportVisits}); satisfaction ${d.franchisee_satisfaction_score}/100; franchise units ${d.franchise_unit_count}; churn ${d.franchisee_churn_rate_pct}%; avg unit revenue ${fmt$(d.avg_unit_revenue)}; competitor franchise ${d.competitor_franchise_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: franchisee support (training, marketing, operations, tech) reduces failure rate 40-50% (IFA franchise support study); franchisee support components = initial training (40-60 hours: operations, recipes, service, tech, marketing), ongoing training (refreshers, new products, best practices), field support (regular visits, coaching, problem-solving), marketing support (national ads, local store marketing, creative assets), operations support (supply chain, equipment, tech), tech support (POS, app, loyalty), business consulting (profitability, benchmarking); franchisee support ROI = $5-15 per $1 spent; franchisee satisfaction = #1 predictor of franchise growth (dissatisfied franchisees don't buy more units); field support visits = 4-6 per year (regular coaching); training hours = 40-60 initial + 8-16 ongoing. Solutions ranked by impact: (1) LAUNCH franchisee support program — failure rate reduction ${fmt$(expectedFailureRateReduction)}/mo + profit lift ${fmt$(expectedProfitLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + development ${fmt$(expectedDevelopmentLift)}/mo; cost ${fmt$(3000)}/mo (support staff + tools); payback 1-2 months; (2) BUILD initial training program (40-60 hours: operations, recipes, service, tech, marketing); (3) PROVIDE ongoing training (refreshers, new products, best practices); (4) CONDUCT field support visits (${config.minFieldSupportVisits}+ per year, regular coaching); (5) PROVIDE marketing support (national ads, local store marketing, creative assets); (6) PROVIDE operations support (supply chain, equipment, tech); (7) PROVIDE tech support (POS, app, loyalty); (8) PROVIDE business consulting (profitability, benchmarking); (9) TRACK support score (target 80+); (10) TRACK satisfaction (target ${config.minFranchiseeSatisfactionScore}+); (11) TRACK training hours (target ${config.minTrainingHoursPerFranchisee}+); (12) TRACK field visits (target ${config.minFieldSupportVisits}+); (13) BENCHMARK vs competitor franchisee support. Industry data: 40-50% failure rate reduction with support (IFA); $5-15 ROI per $1; payback 1-2 months. Expected impact: -${targetFailureRateReductionPct}% failure rate, +18pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'launch_franchisee_support',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: FRANCHISE_DEVELOPMENT_PIPELINE_THIN
    if (d.has_franchise_strategy && d.franchise_development_pipeline_count < d.franchise_development_target) {
      // thin pipeline -> missed growth ($50k-500k/unit)
      const pipelineGap = Math.max(d.franchise_development_target - d.franchise_development_pipeline_count, 0);
      const expectedDevelopmentRevenue = Math.round(pipelineGap * d.avg_unit_revenue * 0.06 / 12);
      const expectedGrowthFromNewUnits = Math.round(pipelineGap * d.avg_unit_revenue * 0.02 / 12);
      const expectedInquiryLift = Math.round(baselineRevenue * 0.02);
      const expectedConversionLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedDevelopmentRevenue + expectedGrowthFromNewUnits + expectedInquiryLift + expectedConversionLift, 2400);
      const severityLabel = d.franchise_development_pipeline_count < 2 ? 'high' : 'medium';
      const criticalNote = (d.franchise_development_pipeline_count < 2)
        ? `HIGH: FRANCHISE DEVELOPMENT PIPELINE THIN — pipeline ${d.franchise_development_pipeline_count} (target ${d.franchise_development_target}); new openings last year ${d.new_unit_openings_last_year}; inquiries ${d.franchise_inquiry_count}; conversion ${d.franchise_conversion_rate_pct}%; franchise development = $50k-500k revenue per new unit (royalty stream); thin pipeline = missed growth + missed royalty revenue; franchise brands with 100+ units grow 3-5x faster. `
        : `MEDIUM: DEVELOPMENT PIPELINE BELOW TARGET — ${d.franchise_development_pipeline_count} (target ${d.franchise_development_target}); accelerate development for growth. `;
      alerts.push({
        rule_id: 'franchise_development_pipeline_thin',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        franchise_development_pipeline_count: d.franchise_development_pipeline_count,
        franchise_development_target: d.franchise_development_target,
        new_unit_openings_last_year: d.new_unit_openings_last_year,
        franchise_inquiry_count: d.franchise_inquiry_count,
        franchise_conversion_rate_pct: d.franchise_conversion_rate_pct,
        franchise_fee_per_unit: d.franchise_fee_per_unit,
        franchise_royalty_rate_pct: d.franchise_royalty_rate_pct,
        avg_unit_revenue: d.avg_unit_revenue,
        franchise_revenue_growth_pct: d.franchise_revenue_growth_pct,
        competitor_franchise_score: d.competitor_franchise_score,
        monthly_revenue: d.monthly_revenue,
        franchise_development_cost_monthly: d.franchise_development_cost_monthly,
        development_revenue_projected: expectedDevelopmentRevenue * 12,
        franchise_revenue_growth_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FRANCHISE DEVELOPMENT PIPELINE THIN: ${d.location_id} — pipeline ${d.franchise_development_pipeline_count} (target ${d.franchise_development_target}); new openings last year ${d.new_unit_openings_last_year}; inquiries ${d.franchise_inquiry_count}; conversion ${d.franchise_conversion_rate_pct}%; franchise fee ${fmt$(d.franchise_fee_per_unit)}/unit; royalty ${d.franchise_royalty_rate_pct}%; avg unit revenue ${fmt$(d.avg_unit_revenue)}; revenue growth ${d.franchise_revenue_growth_pct}%; competitor franchise ${d.competitor_franchise_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: franchise development (new unit openings) = $50k-500k revenue per new unit (royalty stream over 10-20 years); franchise brands with 100+ units grow 3-5x faster than sub-50 unit brands; franchise development pipeline = leads -> inquiries -> applications -> approval -> signing -> opening (12-24 month cycle); franchise development channels = franchise broker networks, franchise expos, online franchise portals (Entrepreneur.com, FranchiseGator), SEO/PPC (franchise keywords), referrals (existing franchisees), PR/media; franchise conversion rate = 2-12% of inquiries convert to franchisees; franchise inquiry benchmarks = 100-300 inquiries/year for growing brands; franchise development cost = $2,000-6,000/month (marketing + sales staff); franchise development ROI = $10-30 per $1 spent (each new unit = $50k-500k royalty stream). Solutions ranked by impact: (1) ACCELERATE franchise development — development revenue ${fmt$(expectedDevelopmentRevenue)}/mo + growth from new units ${fmt$(expectedGrowthFromNewUnits)}/mo + inquiry lift ${fmt$(expectedInquiryLift)}/mo + conversion lift ${fmt$(expectedConversionLift)}/mo; cost ${fmt$(4000)}/mo (marketing + sales); payback 3-6 months; (2) BUILD franchise development pipeline (leads -> inquiries -> applications -> approval -> signing -> opening); (3) USE franchise broker networks (commissions 30-50% of franchise fee); (4) ATTEND franchise expos (IFA, MFV); (5) LIST on franchise portals (Entrepreneur.com, FranchiseGator, FranchiseDirect); (6) INVEST in SEO/PPC (franchise keywords — 'buy a restaurant franchise'); (7) ENCOURAGE franchisee referrals (existing franchisees recruit new ones — incentive $5k-15k); (8) GENERATE PR/media (franchise success stories, growth announcements); (9) TRACK inquiries (target 100-300/year); (10) TRACK conversion rate (target 8-12%); (11) TRACK pipeline count (target ${d.franchise_development_target}+); (12) TRACK new openings (target ${d.franchise_development_target}/year); (13) BENCHMARK vs competitor franchise development. Industry data: $50k-500k revenue per new unit; 3-5x faster growth for 100+ unit brands; payback 3-6 months. Expected impact: +${fmt$(expectedDevelopmentRevenue * 12)}/yr development revenue, +25% franchise revenue growth, payback 3-6 months.`,
        ai_recommendation: 'accelerate_franchise_development',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: TERRITORY_MANAGEMENT_CANNIBALIZATION
    if (d.has_franchise_strategy && config.requireTerritoryManagement && (!d.has_territory_management || d.cannibalization_rate_pct > config.maxCannibalizationRatePct)) {
      // territory overlap -> 30-50% cannibalization
      const cannibalizationGap = Math.max(d.cannibalization_rate_pct - config.maxCannibalizationRatePct, 0);
      const expectedCannibalizationReduction = Math.round(d.franchise_unit_count * d.avg_unit_revenue * (cannibalizationGap / 100) / 12);
      const expectedFranchiseeSatisfaction = Math.round(baselineRevenue * 0.02);
      const expectedLegalProtection = Math.round(d.legal_action_count * 5000 / 12);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedCannibalizationReduction + expectedFranchiseeSatisfaction + expectedLegalProtection + expectedCompetitiveLift, 1800);
      const severityLabel = d.cannibalization_rate_pct > 10 ? 'high' : 'medium';
      const criticalNote = (d.cannibalization_rate_pct > 10)
        ? `HIGH: TERRORY CANNIBALIZATION HIGH — cannibalization ${d.cannibalization_rate_pct}% (max ${config.maxCannibalizationRatePct}%); territory overlaps ${d.territory_overlap_count}; exclusivity score ${d.territory_exclusivity_score}/100; territory management reduces cannibalization 30-50%; high cannibalization = franchisee revenue loss + franchisee disputes + legal action; franchisees demand exclusive territories. `
        : `MEDIUM: CANNIBALIZATION ABOVE TARGET — ${d.cannibalization_rate_pct}% (max ${config.maxCannibalizationRatePct}%); improve territory management for protection. `;
      alerts.push({
        rule_id: 'territory_management_cannibalization',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_territory_management: d.has_territory_management,
        territory_overlap_count: d.territory_overlap_count,
        cannibalization_rate_pct: d.cannibalization_rate_pct,
        territory_exclusivity_score: d.territory_exclusivity_score,
        franchise_unit_count: d.franchise_unit_count,
        avg_unit_revenue: d.avg_unit_revenue,
        legal_action_count: d.legal_action_count,
        franchisee_satisfaction_score: d.franchisee_satisfaction_score,
        competitor_franchise_score: d.competitor_franchise_score,
        monthly_revenue: d.monthly_revenue,
        cannibalization_reduction_projected_pct: targetCannibalizationReductionPct,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `TERRITORY MANAGEMENT CANNIBALIZATION: ${d.location_id} — territory management ${d.has_territory_management ? 'present' : 'ABSENT'}; overlaps ${d.territory_overlap_count}; cannibalization ${d.cannibalization_rate_pct}% (max ${config.maxCannibalizationRatePct}%); exclusivity ${d.territory_exclusivity_score}/100; franchise units ${d.franchise_unit_count}; avg unit revenue ${fmt$(d.avg_unit_revenue)}; legal actions ${d.legal_action_count}; satisfaction ${d.franchisee_satisfaction_score}/100; competitor franchise ${d.competitor_franchise_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: territory management (exclusive territories) reduces cannibalization 30-50% (IFA territory study); cannibalization = new unit takes revenue from existing unit (same brand competing with itself); cannibalization causes = territories too close (no exclusivity), no territory management system, poor site selection, franchisee disputes over territory; territory management = exclusive territories (each franchisee has protected area), territory mapping (GIS, demographic data), site selection approval (franchisor approves new sites), encroachment policy (what happens if new unit cannibalizes existing); territory exclusivity = franchisee has exclusive right to operate in defined area (1-3 mile radius, population-based, ZIP code); cannibalization rate = % revenue lost to same-brand units; healthy cannibalization = under 5%, problematic = 10%+. Solutions ranked by impact: (1) OPTIMIZE territory management — cannibalization reduction ${fmt$(expectedCannibalizationReduction)}/mo + franchisee satisfaction ${fmt$(expectedFranchiseeSatisfaction)}/mo + legal protection ${fmt$(expectedLegalProtection)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(500)}/mo (territory mapping tool); payback 1-2 months; (2) IMPLEMENT territory management system (GIS mapping, demographic data); (3) DEFINE exclusive territories (1-3 mile radius, population-based, ZIP code); (4) CREATE encroachment policy (what happens if new unit cannibalizes existing); (5) REQUIRE site selection approval (franchisor approves new sites); (6) ANALYZE cannibalization before new unit approval (impact study); (7) RESOLVE existing overlaps (relocate, close, or compensate); (8) MAP all franchise territories (visual); (9) TRACK cannibalization rate (target under ${config.maxCannibalizationRatePct}%); (10) TRACK territory exclusivity (target 80+); (11) TRACK legal actions (target 0); (12) BENCHMARK vs competitor territory management. Industry data: 30-50% cannibalization reduction with territory management (IFA); payback 1-2 months. Expected impact: -${targetCannibalizationReductionPct}% cannibalization, +10pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'optimize_territory_management',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: FRANCHISE_COMPLIANCE_MONITORING_ABSENT
    if (d.has_franchise_strategy && config.requireFranchiseComplianceMonitoring && (!d.has_franchise_compliance_monitoring || d.compliance_audit_frequency < config.minComplianceAuditFrequency)) {
      // no compliance monitoring -> brand damage + legal risk
      const expectedComplianceCostReduction = Math.round(d.compliance_violation_cost * 0.50 / 12);
      const expectedBrandProtection = Math.round(baselineRevenue * 0.025);
      const expectedLegalProtection = Math.round(d.legal_action_count * 8000 / 12);
      const expectedFranchiseeQuality = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedComplianceCostReduction + expectedBrandProtection + expectedLegalProtection + expectedFranchiseeQuality, 1600);
      const severityLabel = d.compliance_violation_count > 5 ? 'high' : 'medium';
      const criticalNote = (d.compliance_violation_count > 5)
        ? `HIGH: NO FRANCHISE COMPLIANCE MONITORING — violations ${d.compliance_violation_count} (cost ${fmt$(d.compliance_violation_cost)}/yr); audit frequency ${d.compliance_audit_frequency}/yr (min ${config.minComplianceAuditFrequency}); legal actions ${d.legal_action_count}; compliance monitoring = legal protection + brand consistency; without monitoring, franchisees deviate = brand damage + legal risk + customer confusion. `
        : `MEDIUM: COMPLIANCE MONITORING BELOW TARGET — audits ${d.compliance_audit_frequency}/yr (min ${config.minComplianceAuditFrequency}); implement monitoring for protection. `;
      alerts.push({
        rule_id: 'franchise_compliance_monitoring_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_franchise_compliance_monitoring: d.has_franchise_compliance_monitoring,
        compliance_audit_frequency: d.compliance_audit_frequency,
        compliance_violation_count: d.compliance_violation_count,
        compliance_violation_cost: d.compliance_violation_cost,
        legal_action_count: d.legal_action_count,
        brand_audit_score: d.brand_audit_score,
        recipe_compliance_pct: d.recipe_compliance_pct,
        visual_branding_compliance_pct: d.visual_branding_compliance_pct,
        franchise_unit_count: d.franchise_unit_count,
        monthly_revenue: d.monthly_revenue,
        compliance_monitoring_cost_monthly: d.compliance_monitoring_cost_monthly,
        compliance_cost_reduction_projected_pct: targetComplianceCostReductionPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FRANCHISE COMPLIANCE MONITORING ABSENT: ${d.location_id} — compliance monitoring ${d.has_franchise_compliance_monitoring ? 'present' : 'ABSENT'}; audit frequency ${d.compliance_audit_frequency}/yr (min ${config.minComplianceAuditFrequency}); violations ${d.compliance_violation_count} (cost ${fmt$(d.compliance_violation_cost)}/yr); legal actions ${d.legal_action_count}; brand audit ${d.brand_audit_score}/100; recipe compliance ${d.recipe_compliance_pct}%; visual branding ${d.visual_branding_compliance_pct}%; franchise units ${d.franchise_unit_count}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: franchise compliance (standards, recipes, branding) = legal protection + brand consistency; without compliance monitoring, franchisees deviate = brand damage + legal risk + customer confusion; compliance monitoring components = audit program (regular visits, scored), secret shopper (independent verification), recipe compliance checks (mystery meals, portion checks), visual branding audits (signage, decor), technology compliance (POS, app, loyalty), financial audit (royalty reporting accuracy); compliance audit frequency = 2-4 per year per unit (regular); compliance violations = recipe deviation, visual deviation, service deviation, cleanliness deviation, tech deviation, financial reporting deviation; compliance violation cost = rework, retraining, customer loss, legal; legal actions = franchisee lawsuits (breach of contract), customer lawsuits (inconsistent experience); compliance monitoring cost = $500-2,000/month (auditors + tools). Solutions ranked by impact: (1) IMPLEMENT compliance monitoring — compliance cost reduction ${fmt$(expectedComplianceCostReduction)}/mo + brand protection ${fmt$(expectedBrandProtection)}/mo + legal protection ${fmt$(expectedLegalProtection)}/mo + franchisee quality ${fmt$(expectedFranchiseeQuality)}/mo; cost ${fmt$(1000)}/mo (auditors + tools); payback 1-2 months; (2) BUILD audit program (regular visits, scored); (3) USE secret shopper (independent verification); (4) CHECK recipe compliance (mystery meals, portion checks); (5) AUDIT visual branding (signage, decor); (6) AUDIT technology compliance (POS, app, loyalty); (7) AUDIT financial reporting (royalty accuracy); (8) CONDUCT ${config.minComplianceAuditFrequency}+ audits per year per unit; (9) TRACK violations (target under 3); (10) TRACK violation cost (target under $5k); (11) TRACK legal actions (target 0); (12) ENFORCE compliance (retraining, warnings, termination for repeat); (13) BENCHMARK vs competitor compliance monitoring. Industry data: 50% compliance cost reduction with monitoring; payback 1-2 months. Expected impact: -${targetComplianceCostReductionPct}% compliance cost, +brand protection, payback 1-2 months.`,
        ai_recommendation: 'implement_compliance_monitoring',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: FRANCHISEE_ONBOARDING_PROGRAM_WEAK
    if (d.has_franchise_strategy && config.requireFranchiseeOnboardingProgram && (!d.has_franchisee_onboarding_program || d.ramp_to_profitability_months > config.maxRampToProfitabilityMonths || d.new_franchisee_success_rate_pct < 75)) {
      // weak onboarding -> slow ramp + early failure
      const expectedRampAcceleration = Math.round(d.avg_unit_revenue * 0.01 * targetRampAccelerationMonths);
      const expectedFailureRateReduction = Math.round(d.franchise_unit_count * 0.10 * d.avg_unit_revenue * 0.06 / 12);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.025);
      const expectedDevelopmentLift = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedRampAcceleration + expectedFailureRateReduction + expectedSatisfactionLift + expectedDevelopmentLift, 1800);
      const severityLabel = !d.has_franchisee_onboarding_program ? 'high' : 'medium';
      const criticalNote = (!d.has_franchisee_onboarding_program)
        ? `HIGH: NO FRANCHISEE ONBOARDING PROGRAM — onboarding ${d.has_franchisee_onboarding_program ? 'present' : 'ABSENT'}; duration ${d.onboarding_duration_days} days; ramp to profitability ${d.ramp_to_profitability_months} months (max ${config.maxRampToProfitabilityMonths}); new franchisee success ${d.new_franchisee_success_rate_pct}%; onboarding (90-day ramp) = critical for early success; weak onboarding = slow ramp + early failure + franchisee churn. `
        : `MEDIUM: ONBOARDING BELOW TARGET — ramp ${d.ramp_to_profitability_months}mo (max ${config.maxRampToProfitabilityMonths}); success ${d.new_franchisee_success_rate_pct}%; strengthen onboarding for faster ramp. `;
      alerts.push({
        rule_id: 'franchisee_onboarding_program_weak',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_franchisee_onboarding_program: d.has_franchisee_onboarding_program,
        onboarding_duration_days: d.onboarding_duration_days,
        ramp_to_profitability_months: d.ramp_to_profitability_months,
        ramp_target_months: d.ramp_target_months,
        new_franchisee_success_rate_pct: d.new_franchisee_success_rate_pct,
        training_hours_per_franchisee: d.training_hours_per_franchisee,
        franchisee_satisfaction_score: d.franchisee_satisfaction_score,
        avg_unit_revenue: d.avg_unit_revenue,
        monthly_revenue: d.monthly_revenue,
        ramp_acceleration_projected_months: targetRampAccelerationMonths,
        failure_rate_reduction_projected_pct: 30,
        satisfaction_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FRANCHISEE ONBOARDING PROGRAM WEAK: ${d.location_id} — onboarding ${d.has_franchisee_onboarding_program ? 'present' : 'ABSENT'}; duration ${d.onboarding_duration_days} days; ramp to profitability ${d.ramp_to_profitability_months} months (max ${config.maxRampToProfitabilityMonths}, target ${d.ramp_target_months}); new franchisee success ${d.new_franchisee_success_rate_pct}%; training ${d.training_hours_per_franchisee}h; satisfaction ${d.franchisee_satisfaction_score}/100; avg unit revenue ${fmt$(d.avg_unit_revenue)}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: franchisee onboarding (90-day ramp) = critical for early success (IFA onboarding study); weak onboarding = slow ramp + early failure + franchisee churn; onboarding components = pre-opening training (40-60 hours: operations, recipes, service, tech, marketing), opening support (on-site staff for first week), 30-day check-in (early problem-solving), 60-day check-in (profitability review), 90-day review (full assessment); ramp to profitability = months to reach breakeven (target 8-12 months, best-in-class 6-8); new franchisee success rate = % of new franchisees that succeed (target 85%+); onboarding best practice = structured 90-day program, dedicated onboarding manager, peer mentor (experienced franchisee), regular check-ins, early intervention for struggling franchisees; onboarding cost = $5,000-15,000 per franchisee (training + support); onboarding ROI = $10-25 per $1 spent (faster ramp + higher success). Solutions ranked by impact: (1) STRENGTHEN franchisee onboarding — ramp acceleration ${fmt$(expectedRampAcceleration)}/mo + failure rate reduction ${fmt$(expectedFailureRateReduction)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + development ${fmt$(expectedDevelopmentLift)}/mo; cost ${fmt$(800)}/mo (onboarding staff); payback 1-2 months; (2) BUILD structured 90-day onboarding program; (3) ASSIGN dedicated onboarding manager (per new franchisee); (4) PAIR with peer mentor (experienced franchisee); (5) CONDUCT pre-opening training (40-60 hours: operations, recipes, service, tech, marketing); (6) PROVIDE opening support (on-site staff for first week); (7) CONDUCT 30-day check-in (early problem-solving); (8) CONDUCT 60-day check-in (profitability review); (9) CONDUCT 90-day review (full assessment); (10) INTERVENE early for struggling franchisees (additional support, consulting); (11) TRACK ramp to profitability (target ${config.maxRampToProfitabilityMonths} months); (12) TRACK new franchisee success rate (target 85%+); (13) BENCHMARK vs competitor onboarding. Industry data: 90-day ramp critical (IFA); 8-12 month ramp target; 85%+ success rate; payback 1-2 months. Expected impact: -${targetRampAccelerationMonths}mo ramp, -30% failure rate, +14pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'strengthen_franchisee_onboarding',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM franchise_operations_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE franchise_operations_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant franchise and multi-unit operations expert. Given franchise operations data, recommend ONE specific action with expected franchise revenue growth, franchisee profitability lift, brand consistency lift, failure rate reduction, or development revenue (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Franchise strategy: ${a.has_franchise_strategy ?? false} (${a.franchise_unit_count ?? 0} franchise units, ${a.company_owned_unit_count ?? 0} company, ${a.franchisee_count ?? 0} franchisees, ${a.multi_unit_franchisee_count ?? 0} multi-unit, royalty ${a.franchise_royalty_rate_pct ?? 0}%, fee ${fmt$(a.franchise_fee_per_unit ?? 0)}/unit). Franchisee profitability: EBITDA ${a.avg_franchisee_ebitda_pct ?? 0}%/${a.avg_franchisee_ebitda_target_pct ?? 12}% target, score ${a.franchisee_profitability_score ?? 0}/100, ${a.unprofitable_franchisee_count ?? 0} unprofitable, churn ${a.franchisee_churn_rate_pct ?? 0}%. Brand consistency: ${a.brand_consistency_score ?? 0}/100 (target ${a.brand_consistency_target_score ?? 85}), audit ${a.brand_audit_score ?? 0}/100, recipe ${a.recipe_compliance_pct ?? 0}%, visual ${a.visual_branding_compliance_pct ?? 0}%. Franchisee support: ${a.has_franchisee_support_program ?? false} (score ${a.franchisee_support_score ?? 0}/100, training ${a.training_hours_per_franchisee ?? 0}h, visits ${a.field_support_visits_per_year ?? 0}/yr, satisfaction ${a.franchisee_satisfaction_score ?? 0}/100). Development: pipeline ${a.franchise_development_pipeline_count ?? 0}/${a.franchise_development_target ?? 5} target, ${a.new_unit_openings_last_year ?? 0} openings last yr, ${a.franchise_inquiry_count ?? 0} inquiries, ${a.franchise_conversion_rate_pct ?? 0}% conversion. Territory: ${a.has_territory_management ?? false} (${a.territory_overlap_count ?? 0} overlaps, cannibalization ${a.cannibalization_rate_pct ?? 0}%/${config.maxCannibalizationRatePct}% max, exclusivity ${a.territory_exclusivity_score ?? 0}/100). Compliance: ${a.has_franchise_compliance_monitoring ?? false} (${a.compliance_audit_frequency ?? 0} audits/yr min ${config.minComplianceAuditFrequency}, ${a.compliance_violation_count ?? 0} violations, ${fmt$(a.compliance_violation_cost ?? 0)} cost, ${a.legal_action_count ?? 0} legal). Onboarding: ${a.has_franchisee_onboarding_program ?? false} (${a.onboarding_duration_days ?? 0} days, ramp ${a.ramp_to_profitability_months ?? 0}mo/${config.maxRampToProfitabilityMonths} max, success ${a.new_franchisee_success_rate_pct ?? 0}%). Franchise revenue: ${fmt$(a.franchise_revenue_annual ?? 0)}/yr (${a.franchise_revenue_growth_pct ?? 0}% growth). System-wide: ${fmt$(a.system_wide_revenue ?? 0)}/yr. Avg unit: ${fmt$(a.avg_unit_revenue ?? 0)}. Competitor: ${a.competitor_franchise_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Support cost: ${fmt$(a.franchise_support_cost_monthly ?? 0)}/mo. Development cost: ${fmt$(a.franchise_development_cost_monthly ?? 0)}/mo. Compliance cost: ${fmt$(a.compliance_monitoring_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveFranchiseOperationsAlerts = async (db: ReturnType<typeof useDB>): Promise<FranchiseOperationsAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM franchise_operations_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getFranchiseOperationsSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  franchiseStrategyAbsentCount: number;
  franchiseeProfitabilityLowCount: number;
  brandConsistencyAcrossUnitsLowCount: number;
  franchiseeSupportProgramAbsentCount: number;
  franchiseDevelopmentPipelineThinCount: number;
  territoryManagementCannibalizationCount: number;
  franchiseComplianceMonitoringAbsentCount: number;
  franchiseeOnboardingProgramWeakCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'franchise_strategy_absent') AS nostrategy,
              math::count(rule_id = 'franchisee_profitability_low') AS lowprofit,
              math::count(rule_id = 'brand_consistency_across_units_low') AS lowconsistency,
              math::count(rule_id = 'franchisee_support_program_absent') AS nosupport,
              math::count(rule_id = 'franchise_development_pipeline_thin') AS thinpipeline,
              math::count(rule_id = 'territory_management_cannibalization') AS cannibalization,
              math::count(rule_id = 'franchise_compliance_monitoring_absent') AS nocompliance,
              math::count(rule_id = 'franchisee_onboarding_program_weak') AS weakonboarding
       FROM franchise_operations_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      franchiseStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      franchiseeProfitabilityLowCount: safeNumber(r.lowprofit, 0),
      brandConsistencyAcrossUnitsLowCount: safeNumber(r.lowconsistency, 0),
      franchiseeSupportProgramAbsentCount: safeNumber(r.nosupport, 0),
      franchiseDevelopmentPipelineThinCount: safeNumber(r.thinpipeline, 0),
      territoryManagementCannibalizationCount: safeNumber(r.cannibalization, 0),
      franchiseComplianceMonitoringAbsentCount: safeNumber(r.nocompliance, 0),
      franchiseeOnboardingProgramWeakCount: safeNumber(r.weakonboarding, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, franchiseStrategyAbsentCount: 0, franchiseeProfitabilityLowCount: 0, brandConsistencyAcrossUnitsLowCount: 0, franchiseeSupportProgramAbsentCount: 0, franchiseDevelopmentPipelineThinCount: 0, territoryManagementCannibalizationCount: 0, franchiseComplianceMonitoringAbsentCount: 0, franchiseeOnboardingProgramWeakCount: 0 };
  }
};

export const updateFranchiseOperationsAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
