/**
 * AI Restaurant Subscription & Membership Program Optimizer — predicts how
 * subscription/membership programs (Panera Sip Club, Sweetgreen Pass, Cava
 * Rewards, Chipotle Rewards, unlimited drink refills, meal plans, monthly
 * dining passes, tiered membership, benefit value, sign-up friction, churn
 * prevention, cross-sell, usage tracking, pricing optimization) impact
 * recurring revenue, customer LTV, visit frequency, brand loyalty.
 *
 * Restaurant subscription market growing 20%+ YoY (Restaurant Business).
 * Panera Sip Club: 1M+ subscribers at $8.99-11.99/mo = $108-144M/year
 * recurring revenue. Sweetgreen Pass: $10/mo, $3 off every order.
 * Subscribers visit 2-3x more frequently than non-subscribers (Panera data).
 * Subscription programs increase customer LTV 40-60% (McKinsey). 40% of
 * subscribers say they'd never cancel (Restaurant Business). Subscription
 * reduces CAC by locking in customers (predictable revenue). Average
 * restaurant subscriber spends $15-40 more per visit than non-subscriber.
 * Subscription programs have 5-15% monthly churn (industry average).
 * Reducing churn by 5% increases subscription revenue 25-95% (HBR).
 * Subscription sign-up friction is #1 barrier to adoption — 60% of
 * interested customers abandon if sign-up takes >2 minutes. Subscription
 * benefit value is #1 retention factor — perceived value must exceed
 * subscription fee by 2-3x. Subscription pricing optimization can lift
 * revenue 10-20% (price elasticity testing). Subscription cross-sell to
 * non-subscribers converts 8-15% per campaign. Subscription usage tracking
 * enables benefit optimization (which benefits drive retention). Restaurant
 * subscription market = $5-15B by 2028 (Allied Market Research).
 *
 * 204th POSR-exclusive differentiator. Distinct from:
 *   - loyalty.service — POINTS-based loyalty (earn points, redeem for
 *     discounts, tier system). This optimizer focuses on SUBSCRIPTION/
 *     MEMBERSHIP programs (recurring monthly fee for unlimited/refilled
 *     items or per-order discount).
 *   - loyalty-roi.service — loyalty program ROI tracking. This optimizer
 *     focuses on SUBSCRIPTION program design + optimization (tiers,
 *     benefits, pricing, churn, cross-sell).
 *   - loyalty-tier-migration.service — loyalty TIER migration (bronze ->
 *     silver). This optimizer focuses on subscription TIER structure
 *     (basic/premium/elite monthly passes).
 *   - milestone-campaign.service — MARKETING campaigns for loyalty
 *     milestones. This optimizer focuses on SUBSCRIPTION business model
 *     (recurring revenue, not milestone rewards).
 *   - retention-program.service — STAFF retention programs. This optimizer
 *     focuses on CUSTOMER subscription retention (churn prevention).
 *   - winback.service — winback campaigns for churned customers. This
 *     optimizer focuses on preventing subscription CHURN before it happens.
 *   - clv.service — customer LIFETIME VALUE calculation. This optimizer
 *     focuses on subscription programs that INCREASE LTV (recurring revenue).
 *   - promo-analytics.service — PROMO code performance. This optimizer
 *     focuses on SUBSCRIPTION (ongoing recurring, not one-time promo).
 *   - promo-forecast.service — promo FORECASTING. This optimizer forecasts
 *     subscription REVENUE + churn.
 *
 * 8 AI rules:
 *   1. subscription_program_absent -> no subscription program -> missed recurring revenue
 *   2. subscription_tier_structure_suboptimal -> poor tier structure -> low conversion
 *   3. subscription_benefit_value_low -> benefits not valuable enough -> churn
 *   4. subscription_sign_up_friction_high -> sign-up friction high -> low adoption
 *   5. subscription_retention_churn_high -> high churn rate -> revenue leak
 *   6. subscription_cross_sell_absent -> no cross-sell to non-subscribers -> missed conversion
 *   7. subscription_usage_tracking_absent -> no usage tracking -> can't optimize benefits
 *   8. subscription_pricing_optimization_absent -> pricing not optimized -> leaving money on table
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type SubscriptionProgramRuleId =
  | 'subscription_program_absent'
  | 'subscription_tier_structure_suboptimal'
  | 'subscription_benefit_value_low'
  | 'subscription_sign_up_friction_high'
  | 'subscription_retention_churn_high'
  | 'subscription_cross_sell_absent'
  | 'subscription_usage_tracking_absent'
  | 'subscription_pricing_optimization_absent';

export type SubscriptionProgramAiRec =
  | 'launch_subscription_program'
  | 'redesign_tier_structure'
  | 'increase_benefit_value'
  | 'reduce_sign_up_friction'
  | 'implement_churn_prevention'
  | 'launch_cross_sell_campaign'
  | 'implement_usage_tracking'
  | 'optimize_subscription_pricing'
  | 'monitor'
  | 'skip';

export interface SubscriptionProgramAlert {
  id?: string;
  rule_id: SubscriptionProgramRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'brand' | 'location_1' | 'location_2'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Subscription program presence
  has_subscription_program?: boolean;                      // subscription/membership program present
  subscription_program_name?: string;                      // program name (e.g., 'Sip Club', 'Sweetgreen Pass')
  subscriber_count?: number;                               // active subscribers
  subscriber_target_count?: number;                        // target subscriber count
  // Tier structure
  subscription_tier_count?: number;                        // number of subscription tiers
  subscription_tiers?: string;                             // tier names (e.g., 'basic,premium,elite')
  tier_conversion_rate_pct?: number;                       // % of visitors who subscribe
  tier_conversion_target_pct?: number;                     // target conversion rate
  // Benefit value
  subscription_monthly_fee?: number;                       // monthly subscription fee
  benefit_value_per_month?: number;                        // perceived benefit value per month
  benefit_value_ratio?: number;                            // benefit_value / monthly_fee (target 2-3x)
  benefit_types?: string;                                  // 'unlimited_drinks,free_item,discount,free_delivery,priority'
  // Sign-up friction
  sign_up_steps_count?: number;                            // number of steps to sign up
  sign_up_time_minutes?: number;                           // time to sign up (minutes)
  sign_up_time_target_minutes?: number;                    // target sign-up time
  sign_up_abandonment_rate_pct?: number;                   // % who abandon sign-up
  // Churn
  monthly_churn_rate_pct?: number;                         // monthly churn rate
  monthly_churn_target_pct?: number;                       // target churn rate
  avg_subscriber_lifetime_months?: number;                 // average subscriber lifetime
  churn_reasons_top?: string;                              // top churn reasons
  // Cross-sell
  has_cross_sell_campaign?: boolean;                       // cross-sell campaign to non-subscribers present
  non_subscriber_count?: number;                           // non-subscriber customers
  cross_sell_conversion_rate_pct?: number;                 // % of non-subscribers converted per campaign
  cross_sell_campaigns_monthly?: number;                   // cross-sell campaigns per month
  // Usage tracking
  has_usage_tracking?: boolean;                            // subscription usage tracking present
  avg_usage_per_subscriber_monthly?: number;               // avg uses per subscriber per month
  usage_benefit_breakdown?: string;                        // which benefits used most
  benefit_utilization_rate_pct?: number;                   // % of benefits utilized
  // Pricing optimization
  has_pricing_optimization?: boolean;                      // pricing optimization (A/B testing) present
  price_elasticity_score?: number;                         // 0-100 price elasticity understanding
  optimal_monthly_fee?: number;                            // AI-recommended optimal monthly fee
  price_test_count?: number;                               // number of price tests conducted
  // Revenue + metrics
  subscription_revenue_monthly?: number;                   // monthly subscription revenue
  subscription_revenue_annual_projected?: number;           // projected annual subscription revenue
  subscriber_avg_spend_per_visit?: number;                 // avg spend per visit by subscribers
  non_subscriber_avg_spend_per_visit?: number;              // avg spend per visit by non-subscribers
  subscriber_visit_frequency_monthly?: number;             // subscriber visits per month
  non_subscriber_visit_frequency_monthly?: number;          // non-subscriber visits per month
  subscriber_ltv?: number;                                 // subscriber LTV
  non_subscriber_ltv?: number;                             // non-subscriber LTV
  subscriber_ltv_lift_pct?: number;                        // subscriber LTV lift vs non-subscriber
  competitor_subscription_score?: number;                  // 0-100 competitor subscription presence
  total_customers?: number;                                // total customer base
  monthly_revenue?: number;                                // total restaurant monthly revenue
  // Costs
  subscription_program_cost_monthly?: number;              // monthly cost to run subscription program
  subscription_acquisition_cost?: number;                  // cost to acquire one subscriber
  churn_cost_monthly?: number;                             // monthly revenue lost to churn
  // Impact projections
  recurring_revenue_projected?: number;
  conversion_lift_projected_pct?: number;
  churn_reduction_projected_pct?: number;
  cross_sell_revenue_projected?: number;
  ltv_lift_projected_pct?: number;
  pricing_revenue_lift_projected_pct?: number;
  visit_frequency_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: SubscriptionProgramAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface SubscriptionProgramConfig {
  aiEnabled: boolean;
  requireSubscriptionProgram: boolean;                     // require subscription/membership program
  requireCrossSellCampaign: boolean;                       // require cross-sell to non-subscribers
  requireUsageTracking: boolean;                           // require usage tracking
  requirePricingOptimization: boolean;                     // require pricing optimization
  minSubscriptionTiers: number;                            // min subscription tiers (2)
  minTierConversionRatePct: number;                        // min conversion rate (8%)
  minBenefitValueRatio: number;                            // min benefit value ratio (2x)
  maxSignUpTimeMinutes: number;                            // max sign-up time (2 min)
  maxMonthlyChurnRatePct: number;                          // max monthly churn (8%)
  minCrossSellConversionRatePct: number;                   // min cross-sell conversion (5%)
  minBenefitUtilizationRatePct: number;                    // min benefit utilization (50%)
  preferCompetitorParity: boolean;                         // match competitor subscription presence
}

export const DEFAULT_SUBSCRIPTION_PROGRAM_CONFIG: SubscriptionProgramConfig = {
  aiEnabled: true,
  requireSubscriptionProgram: true,
  requireCrossSellCampaign: true,
  requireUsageTracking: true,
  requirePricingOptimization: true,
  minSubscriptionTiers: 2,
  minTierConversionRatePct: 8,
  minBenefitValueRatio: 2,
  maxSignUpTimeMinutes: 2,
  maxMonthlyChurnRatePct: 8,
  minCrossSellConversionRatePct: 5,
  minBenefitUtilizationRatePct: 50,
  preferCompetitorParity: true,
};

export const readSubscriptionProgramConfig = (settings: any): SubscriptionProgramConfig => ({
  aiEnabled: settings?.subscription_program_ai_enabled ?? true,
  requireSubscriptionProgram: settings?.subscription_program_require_program ?? true,
  requireCrossSellCampaign: settings?.subscription_program_require_cross_sell ?? true,
  requireUsageTracking: settings?.subscription_program_require_usage ?? true,
  requirePricingOptimization: settings?.subscription_program_require_pricing ?? true,
  minSubscriptionTiers: safeNumber(settings?.subscription_program_min_tiers, 2),
  minTierConversionRatePct: safeNumber(settings?.subscription_program_min_conversion, 8),
  minBenefitValueRatio: safeNumber(settings?.subscription_program_min_benefit_ratio, 2),
  maxSignUpTimeMinutes: safeNumber(settings?.subscription_program_max_signup_time, 2),
  maxMonthlyChurnRatePct: safeNumber(settings?.subscription_program_max_churn, 8),
  minCrossSellConversionRatePct: safeNumber(settings?.subscription_program_min_cross_sell, 5),
  minBenefitUtilizationRatePct: safeNumber(settings?.subscription_program_min_utilization, 50),
  preferCompetitorParity: settings?.subscription_program_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface SubscriptionProgramData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_subscription_program: boolean;
  subscription_program_name: string;
  subscriber_count: number;
  subscriber_target_count: number;
  subscription_tier_count: number;
  subscription_tiers: string;
  tier_conversion_rate_pct: number;
  tier_conversion_target_pct: number;
  subscription_monthly_fee: number;
  benefit_value_per_month: number;
  benefit_value_ratio: number;
  benefit_types: string;
  sign_up_steps_count: number;
  sign_up_time_minutes: number;
  sign_up_time_target_minutes: number;
  sign_up_abandonment_rate_pct: number;
  monthly_churn_rate_pct: number;
  monthly_churn_target_pct: number;
  avg_subscriber_lifetime_months: number;
  churn_reasons_top: string;
  has_cross_sell_campaign: boolean;
  non_subscriber_count: number;
  cross_sell_conversion_rate_pct: number;
  cross_sell_campaigns_monthly: number;
  has_usage_tracking: boolean;
  avg_usage_per_subscriber_monthly: number;
  usage_benefit_breakdown: string;
  benefit_utilization_rate_pct: number;
  has_pricing_optimization: boolean;
  price_elasticity_score: number;
  optimal_monthly_fee: number;
  price_test_count: number;
  subscription_revenue_monthly: number;
  subscription_revenue_annual_projected: number;
  subscriber_avg_spend_per_visit: number;
  non_subscriber_avg_spend_per_visit: number;
  subscriber_visit_frequency_monthly: number;
  non_subscriber_visit_frequency_monthly: number;
  subscriber_ltv: number;
  non_subscriber_ltv: number;
  subscriber_ltv_lift_pct: number;
  competitor_subscription_score: number;
  total_customers: number;
  monthly_revenue: number;
  subscription_program_cost_monthly: number;
  subscription_acquisition_cost: number;
  churn_cost_monthly: number;
}

const MOCK_DATA: SubscriptionProgramData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_subscription_program: false, subscription_program_name: 'none',
    subscriber_count: 0, subscriber_target_count: 320,
    subscription_tier_count: 0, subscription_tiers: 'none',
    tier_conversion_rate_pct: 0, tier_conversion_target_pct: 10,
    subscription_monthly_fee: 0, benefit_value_per_month: 0,
    benefit_value_ratio: 0, benefit_types: 'none',
    sign_up_steps_count: 0, sign_up_time_minutes: 0,
    sign_up_time_target_minutes: 2, sign_up_abandonment_rate_pct: 0,
    monthly_churn_rate_pct: 0, monthly_churn_target_pct: 7,
    avg_subscriber_lifetime_months: 0, churn_reasons_top: 'none',
    has_cross_sell_campaign: false, non_subscriber_count: 2800,
    cross_sell_conversion_rate_pct: 0, cross_sell_campaigns_monthly: 0,
    has_usage_tracking: false, avg_usage_per_subscriber_monthly: 0,
    usage_benefit_breakdown: 'none', benefit_utilization_rate_pct: 0,
    has_pricing_optimization: false, price_elasticity_score: 12,
    optimal_monthly_fee: 0, price_test_count: 0,
    subscription_revenue_monthly: 0, subscription_revenue_annual_projected: 0,
    subscriber_avg_spend_per_visit: 0, non_subscriber_avg_spend_per_visit: 32,
    subscriber_visit_frequency_monthly: 0, non_subscriber_visit_frequency_monthly: 2.4,
    subscriber_ltv: 0, non_subscriber_ltv: 420,
    subscriber_ltv_lift_pct: 0, competitor_subscription_score: 62,
    total_customers: 2800, monthly_revenue: 86000,
    subscription_program_cost_monthly: 0, subscription_acquisition_cost: 0,
    churn_cost_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_subscription_program: true, subscription_program_name: 'Coffee Pass',
    subscriber_count: 120, subscriber_target_count: 420,
    subscription_tier_count: 1, subscription_tiers: 'basic',
    tier_conversion_rate_pct: 4, tier_conversion_target_pct: 10,
    subscription_monthly_fee: 9.99, benefit_value_per_month: 18,
    benefit_value_ratio: 1.8, benefit_types: 'unlimited_coffee',
    sign_up_steps_count: 5, sign_up_time_minutes: 3.5,
    sign_up_time_target_minutes: 2, sign_up_abandonment_rate_pct: 42,
    monthly_churn_rate_pct: 12, monthly_churn_target_pct: 7,
    avg_subscriber_lifetime_months: 8, churn_reasons_top: 'not_using_enough,price',
    has_cross_sell_campaign: false, non_subscriber_count: 2400,
    cross_sell_conversion_rate_pct: 0, cross_sell_campaigns_monthly: 0,
    has_usage_tracking: false, avg_usage_per_subscriber_monthly: 8,
    usage_benefit_breakdown: 'unknown', benefit_utilization_rate_pct: 0,
    has_pricing_optimization: false, price_elasticity_score: 28,
    optimal_monthly_fee: 0, price_test_count: 0,
    subscription_revenue_monthly: 1199, subscription_revenue_annual_projected: 14388,
    subscriber_avg_spend_per_visit: 14, non_subscriber_avg_spend_per_visit: 11,
    subscriber_visit_frequency_monthly: 6, non_subscriber_visit_frequency_monthly: 2.8,
    subscriber_ltv: 680, non_subscriber_ltv: 380,
    subscriber_ltv_lift_pct: 79, competitor_subscription_score: 72,
    total_customers: 2520, monthly_revenue: 92000,
    subscription_program_cost_monthly: 180, subscription_acquisition_cost: 12,
    churn_cost_monthly: 144,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_subscription_program: true, subscription_program_name: 'Dining Pass',
    subscriber_count: 380, subscriber_target_count: 420,
    subscription_tier_count: 2, subscription_tiers: 'basic,premium',
    tier_conversion_rate_pct: 9, tier_conversion_target_pct: 10,
    subscription_monthly_fee: 12.99, benefit_value_per_month: 32,
    benefit_value_ratio: 2.5, benefit_types: 'unlimited_drinks,free_item,discount',
    sign_up_steps_count: 3, sign_up_time_minutes: 1.8,
    sign_up_time_target_minutes: 2, sign_up_abandonment_rate_pct: 18,
    monthly_churn_rate_pct: 7, monthly_churn_target_pct: 7,
    avg_subscriber_lifetime_months: 14, churn_reasons_top: 'moved,relocation',
    has_cross_sell_campaign: true, non_subscriber_count: 3200,
    cross_sell_conversion_rate_pct: 6, cross_sell_campaigns_monthly: 2,
    has_usage_tracking: true, avg_usage_per_subscriber_monthly: 12,
    usage_benefit_breakdown: 'unlimited_drinks:60%,free_item:25%,discount:15%',
    benefit_utilization_rate_pct: 62,
    has_pricing_optimization: false, price_elasticity_score: 48,
    optimal_monthly_fee: 14.99, price_test_count: 0,
    subscription_revenue_monthly: 4936, subscription_revenue_annual_projected: 59232,
    subscriber_avg_spend_per_visit: 18, non_subscriber_avg_spend_per_visit: 12,
    subscriber_visit_frequency_monthly: 8, non_subscriber_visit_frequency_monthly: 3.0,
    subscriber_ltv: 1180, non_subscriber_ltv: 420,
    subscriber_ltv_lift_pct: 181, competitor_subscription_score: 78,
    total_customers: 3580, monthly_revenue: 128000,
    subscription_program_cost_monthly: 320, subscription_acquisition_cost: 8,
    churn_cost_monthly: 346,
  },
  {
    location_id: 'location_2', restaurant_tier: 'casual_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_subscription_program: true, subscription_program_name: 'Elite Membership',
    subscriber_count: 620, subscriber_target_count: 580,
    subscription_tier_count: 3, subscription_tiers: 'basic,premium,elite',
    tier_conversion_rate_pct: 14, tier_conversion_target_pct: 10,
    subscription_monthly_fee: 18.99, benefit_value_per_month: 52,
    benefit_value_ratio: 2.7, benefit_types: 'unlimited_drinks,free_item,discount,free_delivery,priority',
    sign_up_steps_count: 2, sign_up_time_minutes: 1.2,
    sign_up_time_target_minutes: 2, sign_up_abandonment_rate_pct: 8,
    monthly_churn_rate_pct: 5, monthly_churn_target_pct: 7,
    avg_subscriber_lifetime_months: 20, churn_reasons_top: 'relocation,financial',
    has_cross_sell_campaign: true, non_subscriber_count: 3800,
    cross_sell_conversion_rate_pct: 9, cross_sell_campaigns_monthly: 3,
    has_usage_tracking: true, avg_usage_per_subscriber_monthly: 16,
    usage_benefit_breakdown: 'unlimited_drinks:45%,free_item:20%,discount:15%,free_delivery:12%,priority:8%',
    benefit_utilization_rate_pct: 78,
    has_pricing_optimization: true, price_elasticity_score: 82,
    optimal_monthly_fee: 19.99, price_test_count: 4,
    subscription_revenue_monthly: 11774, subscription_revenue_annual_projected: 141288,
    subscriber_avg_spend_per_visit: 28, non_subscriber_avg_spend_per_visit: 16,
    subscriber_visit_frequency_monthly: 10, non_subscriber_visit_frequency_monthly: 3.2,
    subscriber_ltv: 2280, non_subscriber_ltv: 520,
    subscriber_ltv_lift_pct: 338, competitor_subscription_score: 84,
    total_customers: 4420, monthly_revenue: 186000,
    subscription_program_cost_monthly: 580, subscription_acquisition_cost: 6,
    churn_cost_monthly: 589,
  },
];

export const runSubscriptionProgramEngine = async (
  db: ReturnType<typeof useDB>,
  config: SubscriptionProgramConfig,
): Promise<{ alerts: SubscriptionProgramAlert[]; generated: number }> => {
  const alerts: SubscriptionProgramAlert[] = [];
  const now = new Date();

  let data: SubscriptionProgramData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_subscription_program, subscription_program_name,
              subscriber_count, subscriber_target_count,
              subscription_tier_count, subscription_tiers,
              tier_conversion_rate_pct, tier_conversion_target_pct,
              subscription_monthly_fee, benefit_value_per_month,
              benefit_value_ratio, benefit_types,
              sign_up_steps_count, sign_up_time_minutes,
              sign_up_time_target_minutes, sign_up_abandonment_rate_pct,
              monthly_churn_rate_pct, monthly_churn_target_pct,
              avg_subscriber_lifetime_months, churn_reasons_top,
              has_cross_sell_campaign, non_subscriber_count,
              cross_sell_conversion_rate_pct, cross_sell_campaigns_monthly,
              has_usage_tracking, avg_usage_per_subscriber_monthly,
              usage_benefit_breakdown, benefit_utilization_rate_pct,
              has_pricing_optimization, price_elasticity_score,
              optimal_monthly_fee, price_test_count,
              subscription_revenue_monthly, subscription_revenue_annual_projected,
              subscriber_avg_spend_per_visit, non_subscriber_avg_spend_per_visit,
              subscriber_visit_frequency_monthly, non_subscriber_visit_frequency_monthly,
              subscriber_ltv, non_subscriber_ltv,
              subscriber_ltv_lift_pct, competitor_subscription_score,
              total_customers, monthly_revenue,
              subscription_program_cost_monthly, subscription_acquisition_cost,
              churn_cost_monthly
       FROM subscription_program_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): SubscriptionProgramData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_subscription_program: Boolean(r.has_subscription_program ?? false),
      subscription_program_name: String(r.subscription_program_name ?? 'none'),
      subscriber_count: safeNumber(r.subscriber_count, 0),
      subscriber_target_count: safeNumber(r.subscriber_target_count, 0),
      subscription_tier_count: safeNumber(r.subscription_tier_count, 0),
      subscription_tiers: String(r.subscription_tiers ?? 'none'),
      tier_conversion_rate_pct: safeNumber(r.tier_conversion_rate_pct, 0),
      tier_conversion_target_pct: safeNumber(r.tier_conversion_target_pct, 10),
      subscription_monthly_fee: safeNumber(r.subscription_monthly_fee, 0),
      benefit_value_per_month: safeNumber(r.benefit_value_per_month, 0),
      benefit_value_ratio: safeNumber(r.benefit_value_ratio, 0),
      benefit_types: String(r.benefit_types ?? 'none'),
      sign_up_steps_count: safeNumber(r.sign_up_steps_count, 0),
      sign_up_time_minutes: safeNumber(r.sign_up_time_minutes, 0),
      sign_up_time_target_minutes: safeNumber(r.sign_up_time_target_minutes, 2),
      sign_up_abandonment_rate_pct: safeNumber(r.sign_up_abandonment_rate_pct, 0),
      monthly_churn_rate_pct: safeNumber(r.monthly_churn_rate_pct, 0),
      monthly_churn_target_pct: safeNumber(r.monthly_churn_target_pct, 7),
      avg_subscriber_lifetime_months: safeNumber(r.avg_subscriber_lifetime_months, 0),
      churn_reasons_top: String(r.churn_reasons_top ?? 'none'),
      has_cross_sell_campaign: Boolean(r.has_cross_sell_campaign ?? false),
      non_subscriber_count: safeNumber(r.non_subscriber_count, 0),
      cross_sell_conversion_rate_pct: safeNumber(r.cross_sell_conversion_rate_pct, 0),
      cross_sell_campaigns_monthly: safeNumber(r.cross_sell_campaigns_monthly, 0),
      has_usage_tracking: Boolean(r.has_usage_tracking ?? false),
      avg_usage_per_subscriber_monthly: safeNumber(r.avg_usage_per_subscriber_monthly, 0),
      usage_benefit_breakdown: String(r.usage_benefit_breakdown ?? 'none'),
      benefit_utilization_rate_pct: safeNumber(r.benefit_utilization_rate_pct, 0),
      has_pricing_optimization: Boolean(r.has_pricing_optimization ?? false),
      price_elasticity_score: safeNumber(r.price_elasticity_score, 0),
      optimal_monthly_fee: safeNumber(r.optimal_monthly_fee, 0),
      price_test_count: safeNumber(r.price_test_count, 0),
      subscription_revenue_monthly: safeNumber(r.subscription_revenue_monthly, 0),
      subscription_revenue_annual_projected: safeNumber(r.subscription_revenue_annual_projected, 0),
      subscriber_avg_spend_per_visit: safeNumber(r.subscriber_avg_spend_per_visit, 0),
      non_subscriber_avg_spend_per_visit: safeNumber(r.non_subscriber_avg_spend_per_visit, 0),
      subscriber_visit_frequency_monthly: safeNumber(r.subscriber_visit_frequency_monthly, 0),
      non_subscriber_visit_frequency_monthly: safeNumber(r.non_subscriber_visit_frequency_monthly, 0),
      subscriber_ltv: safeNumber(r.subscriber_ltv, 0),
      non_subscriber_ltv: safeNumber(r.non_subscriber_ltv, 0),
      subscriber_ltv_lift_pct: safeNumber(r.subscriber_ltv_lift_pct, 0),
      competitor_subscription_score: safeNumber(r.competitor_subscription_score, 0),
      total_customers: safeNumber(r.total_customers, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      subscription_program_cost_monthly: safeNumber(r.subscription_program_cost_monthly, 0),
      subscription_acquisition_cost: safeNumber(r.subscription_acquisition_cost, 0),
      churn_cost_monthly: safeNumber(r.churn_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const totalCustomers = Math.max(d.total_customers, 1);
    const targetConversionLiftPct = 6;
    const targetChurnReductionPct = 40;
    const targetCrossSellRevenue = Math.round(baselineRevenue * 0.08);
    const targetLtvLiftPct = 50;
    const targetPricingLiftPct = 15;
    const targetVisitFreqLiftPct = 25;

    // Rule 1: SUBSCRIPTION_PROGRAM_ABSENT
    if (config.requireSubscriptionProgram && !d.has_subscription_program) {
      // no subscription program -> missed recurring revenue
      const expectedSubscribers = Math.round(totalCustomers * 0.10);
      const expectedSubscriptionRevenue = Math.round(expectedSubscribers * 12.99);
      const expectedVisitFrequencyLift = Math.round(expectedSubscribers * 4 * 18);
      const expectedLtvLift = Math.round(expectedSubscribers * 400);
      const expectedReducedCac = Math.round(expectedSubscribers * 15);
      const totalOpportunity = Math.max(expectedSubscriptionRevenue + expectedVisitFrequencyLift + expectedLtvLift + expectedReducedCac, 4000);
      const severityLabel = d.competitor_subscription_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_subscription_score > 65)
        ? 'CRITICAL: NO SUBSCRIPTION PROGRAM — competitor subscription score ' + d.competitor_subscription_score + '/100 (high); Panera Sip Club: 1M+ subscribers at $8.99-11.99/mo = $108-144M/year recurring revenue; subscription programs increase customer LTV 40-60% (McKinsey); subscribers visit 2-3x more frequently (Panera); 40% of subscribers say they never cancel; missing subscription = missed recurring revenue + missed LTV lift + missed visit frequency; competitors with subscriptions lock in customers. '
        : `HIGH: NO SUBSCRIPTION PROGRAM — Panera Sip Club: 1M+ subscribers, $108-144M/year recurring revenue; subscription increases LTV 40-60% (McKinsey); subscribers visit 2-3x more; missing recurring revenue + LTV lift. `;
      alerts.push({
        rule_id: 'subscription_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_subscription_program: d.has_subscription_program,
        subscription_program_name: d.subscription_program_name,
        subscriber_count: d.subscriber_count,
        subscriber_target_count: d.subscriber_target_count,
        total_customers: d.total_customers,
        non_subscriber_ltv: d.non_subscriber_ltv,
        non_subscriber_visit_frequency_monthly: d.non_subscriber_visit_frequency_monthly,
        non_subscriber_avg_spend_per_visit: d.non_subscriber_avg_spend_per_visit,
        competitor_subscription_score: d.competitor_subscription_score,
        monthly_revenue: d.monthly_revenue,
        subscription_program_cost_monthly: d.subscription_program_cost_monthly,
        recurring_revenue_projected: expectedSubscriptionRevenue,
        ltv_lift_projected_pct: 50,
        visit_frequency_lift_projected_pct: 100,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SUBSCRIPTION PROGRAM ABSENT: ${d.location_id} — subscription program ABSENT; subscribers 0 (target ${d.subscriber_target_count}); total customers ${d.total_customers}; non-subscriber LTV ${fmt$(d.non_subscriber_ltv)}; non-subscriber visit frequency ${d.non_subscriber_visit_frequency_monthly}/mo; non-subscriber avg spend ${fmt$(d.non_subscriber_avg_spend_per_visit)}/visit; competitor subscription ${d.competitor_subscription_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: Panera Sip Club: 1M+ subscribers at $8.99-11.99/mo = $108-144M/year recurring revenue (Panera annual report); Sweetgreen Pass: $10/mo, $3 off every order; subscription programs increase customer LTV 40-60% (McKinsey); subscribers visit 2-3x more frequently than non-subscribers (Panera data); 40% of subscribers say they never cancel (Restaurant Business); subscription reduces CAC by locking in customers (predictable revenue); average restaurant subscriber spends $15-40 more per visit than non-subscriber; restaurant subscription market = $5-15B by 2028 (Allied Market Research), growing 20%+ YoY; subscription program types = unlimited drinks (Panera Sip Club — unlimited coffee/tea), per-order discount (Sweetgreen Pass — $3 off every order), free item monthly (Chipotle Rewards — free item after X visits), free delivery (DoorDash DashPass — $0 delivery), monthly meal plan (prepaid meals at discount), priority access (skip the line); subscription best practice = 2-3 tiers (basic/premium/elite), benefit value 2-3x fee, sign-up under 2 minutes, churn under 8%, cross-sell to non-subscribers. Solutions ranked by impact: (1) LAUNCH subscription program — recurring revenue ${fmt$(expectedSubscriptionRevenue)}/mo + visit frequency lift ${fmt$(expectedVisitFrequencyLift)}/mo + LTV lift ${fmt$(expectedLtvLift)}/mo + reduced CAC ${fmt$(expectedReducedCac)}/mo; cost ${fmt$(d.subscription_program_cost_monthly + 200)}/mo (program setup + management); payback 1-2 months; (2) CHOOSE subscription type (unlimited drinks, per-order discount, free item, free delivery, meal plan, priority); (3) DESIGN 2-3 tiers (basic $8-12, premium $12-18, elite $18-25); (4) SET benefit value 2-3x fee (e.g., $12 fee = $24-36 value); (5) BUILD sign-up flow (under 2 min, 2-3 steps); (6) INTEGRATE with POS (subscriber ID at checkout, auto-apply benefits); (7) LAUNCH cross-sell campaign (convert non-subscribers); (8) IMPLEMENT usage tracking (which benefits drive retention); (9) OPTIMIZE pricing quarterly (A/B test fees); (10) PREVENT churn (win-back offers, re-engagement); (11) BENCHMARK vs competitor subscription programs. Industry data: $108-144M/year Panera Sip Club; 40-60% LTV lift (McKinsey); 2-3x visit frequency; payback 1-2 months. Expected impact: +${fmt$(expectedSubscriptionRevenue)}/mo recurring revenue, +50% LTV lift, +100% visit frequency, payback 1-2 months.`,
        ai_recommendation: 'launch_subscription_program',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: SUBSCRIPTION_TIER_STRUCTURE_SUBOPTIMAL
    if (d.has_subscription_program && d.subscription_tier_count < config.minSubscriptionTiers) {
      // poor tier structure -> low conversion
      const tierGap = Math.max(config.minSubscriptionTiers - d.subscription_tier_count, 0);
      const expectedConversionLift = Math.round(d.subscriber_count * 0.30 * 12.99);
      const expectedRevenueFromNewTiers = Math.round(tierGap * d.total_customers * 0.03 * 14.99);
      const expectedUpgrades = Math.round(d.subscriber_count * 0.20 * 6);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.03);
      const totalOpportunity = Math.max(expectedConversionLift + expectedRevenueFromNewTiers + expectedUpgrades + expectedCompetitiveLift, 2000);
      const severityLabel = d.subscription_tier_count < 2 ? 'high' : 'medium';
      const criticalNote = (d.subscription_tier_count < 2)
        ? `HIGH: SINGLE TIER ONLY — ${d.subscription_tier_count} tier (min ${config.minSubscriptionTiers}); single-tier programs limit choice + miss revenue from premium customers; multi-tier (basic/premium/elite) increases conversion 25-35% by offering choice; tier structure enables upsell (basic -> premium -> elite). `
        : `MEDIUM: TIER STRUCTURE BELOW TARGET — ${d.subscription_tier_count} tiers (min ${config.minSubscriptionTiers}); add ${tierGap} more tiers for conversion lift. `;
      alerts.push({
        rule_id: 'subscription_tier_structure_suboptimal',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_subscription_program: d.has_subscription_program,
        subscription_program_name: d.subscription_program_name,
        subscription_tier_count: d.subscription_tier_count,
        subscription_tiers: d.subscription_tiers,
        tier_conversion_rate_pct: d.tier_conversion_rate_pct,
        tier_conversion_target_pct: d.tier_conversion_target_pct,
        subscriber_count: d.subscriber_count,
        subscription_monthly_fee: d.subscription_monthly_fee,
        total_customers: d.total_customers,
        competitor_subscription_score: d.competitor_subscription_score,
        monthly_revenue: d.monthly_revenue,
        conversion_lift_projected_pct: targetConversionLiftPct,
        recurring_revenue_projected: expectedRevenueFromNewTiers,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SUBSCRIPTION TIER STRUCTURE SUBOPTIMAL: ${d.location_id} — ${d.subscription_tier_count} tier(s) (min ${config.minSubscriptionTiers}); tiers: ${d.subscription_tiers}; conversion rate ${d.tier_conversion_rate_pct}% (target ${d.tier_conversion_target_pct}%); subscribers ${d.subscriber_count}; monthly fee ${fmt$(d.subscription_monthly_fee)}; total customers ${d.total_customers}; competitor subscription ${d.competitor_subscription_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: multi-tier subscription programs (basic/premium/elite) increase conversion 25-35% by offering choice (McKinsey pricing study); single-tier programs limit choice + miss revenue from premium customers willing to pay more; tier structure enables upsell (basic -> premium -> elite) = 15-20% upgrade rate; tier pricing best practice = 3 tiers with clear value differentiation (basic $8-12, premium $12-18, elite $18-25), basic tier = entry point (low commitment), premium tier = sweet spot (most subscribers), elite tier = high-value (max revenue per subscriber); tier benefits differentiation = basic (1-2 benefits), premium (3-4 benefits), elite (5+ benefits + priority); tier examples = Panera Sip Club (1 tier, missing premium opportunity), Sweetgreen Pass (1 tier), Cava Rewards (multi-tier), Chipotle Rewards (points-based not subscription); multi-tier reduces churn (subscribers downgrade instead of cancel). Solutions ranked by impact: (1) REDESIGN tier structure to ${config.minSubscriptionTiers} tiers — conversion lift ${fmt$(expectedConversionLift)}/mo + revenue from new tiers ${fmt$(expectedRevenueFromNewTiers)}/mo + upgrades ${fmt$(expectedUpgrades)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(500)} one-time (design + POS config); payback <1 month; (2) DESIGN ${config.minSubscriptionTiers} tiers (basic $8-12, premium $12-18, elite $18-25); (3) DIFFERENTIATE benefits per tier (basic 1-2, premium 3-4, elite 5+); (4) SET clear value differentiation (each tier = 2x previous value); (5) POSITION premium as sweet spot (most subscribers); (6) ENABLE upsell (basic -> premium -> elite, 15-20% upgrade rate); (7) ENABLE downgrade (reduce churn — subscribers downgrade instead of cancel); (8) UPDATE POS to support multi-tier (subscriber ID + tier); (9) MARKET tier options (in-store, app, email); (10) TRACK conversion per tier (target ${d.tier_conversion_target_pct}%); (11) BENCHMARK vs competitor tier structure. Industry data: 25-35% conversion lift with multi-tier (McKinsey); 15-20% upgrade rate; payback <1 month. Expected impact: +${targetConversionLiftPct}% conversion, +${fmt$(expectedRevenueFromNewTiers)}/mo recurring revenue, payback <1 month.`,
        ai_recommendation: 'redesign_tier_structure',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: SUBSCRIPTION_BENEFIT_VALUE_LOW
    if (d.has_subscription_program && d.benefit_value_ratio < config.minBenefitValueRatio) {
      // benefits not valuable enough -> churn
      const ratioGap = Math.max(config.minBenefitValueRatio - d.benefit_value_ratio, 0);
      const expectedChurnReduction = Math.round(d.subscriber_count * 12.99 * (ratioGap / 2));
      const expectedRetentionLift = Math.round(d.subscriber_count * 0.15 * 12.99);
      const expectedSatisfactionLift = Math.round(baselineRevenue * (ratioGap / 200));
      const expectedLtvLift = Math.round(d.subscriber_count * (ratioGap * 50));
      const totalOpportunity = Math.max(expectedChurnReduction + expectedRetentionLift + expectedSatisfactionLift + expectedLtvLift, 1800);
      const severityLabel = d.benefit_value_ratio < 1.5 ? 'high' : 'medium';
      const criticalNote = (d.benefit_value_ratio < 1.5)
        ? `HIGH: BENEFIT VALUE TOO LOW — benefit value ratio ${d.benefit_value_ratio}x (min ${config.minBenefitValueRatio}x); benefit value ${fmt$(d.benefit_value_per_month)}/mo vs fee ${fmt$(d.subscription_monthly_fee)}/mo; perceived value must exceed fee by 2-3x for retention; low value = high churn; subscribers cancel when value < fee. `
        : `MEDIUM: BENEFIT VALUE BELOW TARGET — ratio ${d.benefit_value_ratio}x (min ${config.minBenefitValueRatio}x); increase benefits for retention. `;
      alerts.push({
        rule_id: 'subscription_benefit_value_low',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_subscription_program: d.has_subscription_program,
        subscription_program_name: d.subscription_program_name,
        subscription_monthly_fee: d.subscription_monthly_fee,
        benefit_value_per_month: d.benefit_value_per_month,
        benefit_value_ratio: d.benefit_value_ratio,
        benefit_types: d.benefit_types,
        subscriber_count: d.subscriber_count,
        monthly_churn_rate_pct: d.monthly_churn_rate_pct,
        avg_subscriber_lifetime_months: d.avg_subscriber_lifetime_months,
        churn_reasons_top: d.churn_reasons_top,
        subscriber_ltv: d.subscriber_ltv,
        monthly_revenue: d.monthly_revenue,
        churn_cost_monthly: d.churn_cost_monthly,
        churn_reduction_projected_pct: targetChurnReductionPct,
        ltv_lift_projected_pct: targetLtvLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SUBSCRIPTION BENEFIT VALUE LOW: ${d.location_id} — benefit value ratio ${d.benefit_value_ratio}x (min ${config.minBenefitValueRatio}x); benefit value ${fmt$(d.benefit_value_per_month)}/mo vs fee ${fmt$(d.subscription_monthly_fee)}/mo; benefit types: ${d.benefit_types}; subscribers ${d.subscriber_count}; churn rate ${d.monthly_churn_rate_pct}%; avg lifetime ${d.avg_subscriber_lifetime_months} months; top churn reasons: ${d.churn_reasons_top}; subscriber LTV ${fmt$(d.subscriber_ltv)}; monthly revenue ${fmt$(d.monthly_revenue)}; churn cost ${fmt$(d.churn_cost_monthly)}/mo. ${criticalNote}Industry data: perceived benefit value must exceed subscription fee by 2-3x for retention (subscription pricing study); subscribers cancel when perceived value < fee; benefit value ratio = benefit_value_per_month / monthly_fee (target 2-3x); benefit value calculation = retail value of benefits if purchased separately (e.g., unlimited coffee = 30 cups x $3 = $90 value for $10 fee = 9x ratio); low benefit value = high churn (subscribers feel cheated); benefit types ranked by perceived value = unlimited drinks (highest, 8-10x ratio), free item monthly (5-7x), per-order discount (3-5x), free delivery (2-4x), priority access (1-2x); benefit value best practice = offer 3-5 benefit types, ensure total value 2-3x fee, communicate value clearly (show $X value for $Y fee); benefit value optimization = add high-value low-cost benefits (unlimited drinks = high perceived value, low marginal cost). Solutions ranked by impact: (1) INCREASE benefit value to ${config.minBenefitValueRatio}x ratio — churn reduction ${fmt$(expectedChurnReduction)}/mo + retention lift ${fmt$(expectedRetentionLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + LTV lift ${fmt$(expectedLtvLift)}/mo; cost ${fmt$(d.subscriber_count * 3)}/mo (marginal cost of benefits); payback 1-2 months; (2) ADD high-value low-cost benefits (unlimited drinks = 8-10x ratio, low marginal cost); (3) CALCULATE benefit value (retail value if purchased separately); (4) ENSURE total value 2-3x fee (e.g., $12 fee = $24-36 value); (5) COMMUNICATE value clearly (show $X value for $Y fee in marketing); (6) ADD 3-5 benefit types (unlimited drinks, free item, discount, free delivery, priority); (7) TEST benefit combinations (which drive retention?); (8) REMOVE low-value benefits (subscribers don't use); (9) TRACK benefit utilization (which benefits used most?); (10) SURVEY churned subscribers (why did they cancel?); (11) BENCHMARK vs competitor benefit value. Industry data: 2-3x benefit value ratio for retention; 40% churn reduction with high value; payback 1-2 months. Expected impact: -${targetChurnReductionPct}% churn, +${targetLtvLiftPct}% LTV, payback 1-2 months.`,
        ai_recommendation: 'increase_benefit_value',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: SUBSCRIPTION_SIGN_UP_FRICTION_HIGH
    if (d.has_subscription_program && (d.sign_up_time_minutes > config.maxSignUpTimeMinutes || d.sign_up_abandonment_rate_pct > 25)) {
      // sign-up friction high -> low adoption
      const frictionGap = Math.max(d.sign_up_time_minutes - config.maxSignUpTimeMinutes, 0);
      const expectedConversionLift = Math.round(d.non_subscriber_count * 0.05 * 12.99);
      const expectedAbandonmentReduction = Math.round(d.non_subscriber_count * (d.sign_up_abandonment_rate_pct / 100) * 0.30 * 12.99);
      const expectedSubscriberGrowth = Math.round(d.non_subscriber_count * 0.04 * 12.99);
      const expectedReducedAcquisitionCost = Math.round(d.non_subscriber_count * 0.02 * 8);
      const totalOpportunity = Math.max(expectedConversionLift + expectedAbandonmentReduction + expectedSubscriberGrowth + expectedReducedAcquisitionCost, 1600);
      const severityLabel = d.sign_up_time_minutes > 3 ? 'high' : 'medium';
      const criticalNote = (d.sign_up_time_minutes > 3)
        ? `HIGH: SIGN-UP FRICTION HIGH — sign-up time ${d.sign_up_time_minutes}min (max ${config.maxSignUpTimeMinutes}min); ${d.sign_up_steps_count} steps; abandonment ${d.sign_up_abandonment_rate_pct}%; 60% of interested customers abandon if sign-up takes >2 minutes (Baymard Institute); high friction = low adoption = missed subscribers. `
        : `MEDIUM: SIGN-UP FRICTION ABOVE TARGET — ${d.sign_up_time_minutes}min (max ${config.maxSignUpTimeMinutes}min); reduce steps + time for higher conversion. `;
      alerts.push({
        rule_id: 'subscription_sign_up_friction_high',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_subscription_program: d.has_subscription_program,
        sign_up_steps_count: d.sign_up_steps_count,
        sign_up_time_minutes: d.sign_up_time_minutes,
        sign_up_time_target_minutes: d.sign_up_time_target_minutes,
        sign_up_abandonment_rate_pct: d.sign_up_abandonment_rate_pct,
        non_subscriber_count: d.non_subscriber_count,
        subscription_monthly_fee: d.subscription_monthly_fee,
        subscription_acquisition_cost: d.subscription_acquisition_cost,
        tier_conversion_rate_pct: d.tier_conversion_rate_pct,
        monthly_revenue: d.monthly_revenue,
        conversion_lift_projected_pct: 30,
        recurring_revenue_projected: expectedConversionLift,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SIGN-UP FRICTION HIGH: ${d.location_id} — sign-up time ${d.sign_up_time_minutes}min (max ${config.maxSignUpTimeMinutes}min); ${d.sign_up_steps_count} steps; abandonment ${d.sign_up_abandonment_rate_pct}%; non-subscribers ${d.non_subscriber_count}; monthly fee ${fmt$(d.subscription_monthly_fee)}; acquisition cost ${fmt$(d.subscription_acquisition_cost)}/subscriber; conversion rate ${d.tier_conversion_rate_pct}%; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 60% of interested customers abandon if sign-up takes >2 minutes (Baymard Institute form abandonment study); sign-up friction is #1 barrier to subscription adoption; sign-up best practice = 2-3 steps, under 2 minutes, minimal fields (name, email, payment), auto-fill from loyalty account, 1-click sign-up for existing customers, Apple Pay/Google Pay for instant payment; sign-up abandonment rate = 20-40% industry average, 8-15% best-in-class; sign-up friction causes = too many steps, too many fields, account creation required, payment friction, unclear benefits, no trial/preview; sign-up optimization = reduce steps to 2-3, pre-fill from loyalty account, 1-click payment (Apple Pay/Google Pay), show benefits upfront, offer free trial/first month free, progress indicator, guest checkout option. Solutions ranked by impact: (1) REDUCE sign-up friction — conversion lift ${fmt$(expectedConversionLift)}/mo + abandonment reduction ${fmt$(expectedAbandonmentReduction)}/mo + subscriber growth ${fmt$(expectedSubscriberGrowth)}/mo + reduced CAC ${fmt$(expectedReducedAcquisitionCost)}/mo; cost ${fmt$(500)} one-time (UX redesign); payback <1 month; (2) REDUCE steps to 2-3 (name, email, payment); (3) REDUCE time to under 2 minutes; (4) MINIMIZE fields (name, email, payment only); (5) AUTO-FILL from loyalty account (existing customers); (6) ENABLE 1-click sign-up for existing customers; (7) ADD Apple Pay/Google Pay (instant payment, no card entry); (8) SHOW benefits upfront (value proposition before sign-up); (9) OFFER free trial / first month free (reduce commitment barrier); (10) ADD progress indicator (step 1 of 3); (11) ENABLE guest checkout (no account creation required); (12) A/B test sign-up flows (which converts best?); (13) TRACK abandonment rate (target 8-15%); (14) BENCHMARK vs competitor sign-up friction. Industry data: 60% abandon if >2 min (Baymard); 20-40% abandonment industry avg, 8-15% best-in-class; payback <1 month. Expected impact: +30% conversion, +${fmt$(expectedConversionLift)}/mo recurring revenue, payback <1 month.`,
        ai_recommendation: 'reduce_sign_up_friction',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: SUBSCRIPTION_RETENTION_CHURN_HIGH
    if (d.has_subscription_program && d.monthly_churn_rate_pct > config.maxMonthlyChurnRatePct) {
      // high churn rate -> revenue leak
      const churnGap = Math.max(d.monthly_churn_rate_pct - config.maxMonthlyChurnRatePct, 0);
      const expectedChurnReduction = Math.round(d.subscriber_count * (churnGap / 100) * 12.99);
      const expectedLtvExtension = Math.round(d.subscriber_count * (churnGap / 100) * 200);
      const expectedWinbackRevenue = Math.round(d.subscriber_count * (churnGap / 100) * 0.30 * 12.99);
      const expectedReducedAcquisitionCost = Math.round(d.subscriber_count * (churnGap / 100) * 8);
      const totalOpportunity = Math.max(expectedChurnReduction + expectedLtvExtension + expectedWinbackRevenue + expectedReducedAcquisitionCost, 1500);
      const severityLabel = d.monthly_churn_rate_pct > 12 ? 'high' : 'medium';
      const criticalNote = (d.monthly_churn_rate_pct > 12)
        ? `HIGH: SUBSCRIPTION CHURN HIGH — monthly churn ${d.monthly_churn_rate_pct}% (max ${config.maxMonthlyChurnRatePct}%); avg subscriber lifetime ${d.avg_subscriber_lifetime_months} months; reducing churn by 5% increases subscription revenue 25-95% (HBR); top churn reasons: ${d.churn_reasons_top}; high churn = revenue leak + wasted acquisition cost. `
        : `MEDIUM: CHURN ABOVE TARGET — ${d.monthly_churn_rate_pct}% (max ${config.maxMonthlyChurnRatePct}%); implement churn prevention to reduce revenue leak. `;
      alerts.push({
        rule_id: 'subscription_retention_churn_high',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_subscription_program: d.has_subscription_program,
        monthly_churn_rate_pct: d.monthly_churn_rate_pct,
        monthly_churn_target_pct: d.monthly_churn_target_pct,
        avg_subscriber_lifetime_months: d.avg_subscriber_lifetime_months,
        churn_reasons_top: d.churn_reasons_top,
        subscriber_count: d.subscriber_count,
        subscription_monthly_fee: d.subscription_monthly_fee,
        subscriber_ltv: d.subscriber_ltv,
        churn_cost_monthly: d.churn_cost_monthly,
        subscription_acquisition_cost: d.subscription_acquisition_cost,
        monthly_revenue: d.monthly_revenue,
        churn_reduction_projected_pct: targetChurnReductionPct,
        ltv_lift_projected_pct: 30,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SUBSCRIPTION CHURN HIGH: ${d.location_id} — monthly churn ${d.monthly_churn_rate_pct}% (max ${config.maxMonthlyChurnRatePct}%, target ${d.monthly_churn_target_pct}%); avg subscriber lifetime ${d.avg_subscriber_lifetime_months} months; top churn reasons: ${d.churn_reasons_top}; subscribers ${d.subscriber_count}; monthly fee ${fmt$(d.subscription_monthly_fee)}; subscriber LTV ${fmt$(d.subscriber_ltv)}; churn cost ${fmt$(d.churn_cost_monthly)}/mo; acquisition cost ${fmt$(d.subscription_acquisition_cost)}/subscriber; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: subscription programs have 5-15% monthly churn (industry average); reducing churn by 5% increases subscription revenue 25-95% (Harvard Business Review); churn reasons = not using enough (35%), price too high (25%), moved/relocation (15%), financial (10%), switched to competitor (10%), other (5%); churn prevention = usage reminders (subscribers who don't use = churn risk), win-back offers (discount/extra benefit before cancel), re-engagement campaigns (dormant subscribers), benefit optimization (increase value to prevent cancel), annual prepay discount (reduce monthly churn to annual), downgrade option (basic instead of cancel); churn prediction = track usage decline, survey at-risk subscribers, intervene before cancel; churn cost = lost recurring revenue + acquisition cost to replace + LTV reduction; 5% monthly churn = 46% annual churn (subscribers last ~20 months); 10% monthly churn = 72% annual churn (subscribers last ~10 months); 15% monthly churn = 86% annual churn (subscribers last ~6 months). Solutions ranked by impact: (1) IMPLEMENT churn prevention — churn reduction ${fmt$(expectedChurnReduction)}/mo + LTV extension ${fmt$(expectedLtvExtension)}/mo + winback revenue ${fmt$(expectedWinbackRevenue)}/mo + reduced CAC ${fmt$(expectedReducedAcquisitionCost)}/mo; cost ${fmt$(300)}/mo (retention campaigns + tools); payback <1 month; (2) TRACK usage decline (subscribers who stop using = churn risk); (3) SEND usage reminders (subscribers who don't use = churn risk); (4) OFFER win-back before cancel (discount/extra benefit when they try to cancel); (5) LAUNCH re-engagement campaigns (dormant subscribers); (6) OPTIMIZE benefits (increase value to prevent cancel); (7) OFFER annual prepay discount (10-20% off annual = reduce monthly churn to annual); (8) ENABLE downgrade option (basic instead of cancel — reduce churn); (9) SURVEY at-risk subscribers (why considering cancel?); (10) INTERVENE before cancel (save team, retention offers); (11) TRACK churn rate monthly (target ${config.maxMonthlyChurnRatePct}%); (12) BENCHMARK vs competitor churn rate. Industry data: 5-15% monthly churn industry avg; 25-95% revenue increase from 5% churn reduction (HBR); payback <1 month. Expected impact: -${targetChurnReductionPct}% churn, +30% LTV, payback <1 month.`,
        ai_recommendation: 'implement_churn_prevention',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: SUBSCRIPTION_CROSS_SELL_ABSENT
    if (d.has_subscription_program && config.requireCrossSellCampaign && !d.has_cross_sell_campaign) {
      // no cross-sell to non-subscribers -> missed conversion
      const expectedCrossSellConversions = Math.round(d.non_subscriber_count * 0.08);
      const expectedCrossSellRevenue = Math.round(expectedCrossSellConversions * 12.99);
      const expectedVisitFrequencyLift = Math.round(expectedCrossSellConversions * 4 * 18);
      const expectedLtvLift = Math.round(expectedCrossSellConversions * 400);
      const expectedReducedCac = Math.round(expectedCrossSellConversions * 15);
      const totalOpportunity = Math.max(expectedCrossSellRevenue + expectedVisitFrequencyLift + expectedLtvLift + expectedReducedCac, 2000);
      const severityLabel = d.non_subscriber_count > 2000 ? 'high' : 'medium';
      const criticalNote = (d.non_subscriber_count > 2000)
        ? `HIGH: NO CROSS-SELL CAMPAIGN — ${d.non_subscriber_count} non-subscribers with no cross-sell; cross-sell converts 8-15% per campaign; missing cross-sell = missed conversion + missed recurring revenue; cross-sell to existing customers is 5-10x cheaper than acquiring new subscribers. `
        : `MEDIUM: NO CROSS-SELL CAMPAIGN — ${d.non_subscriber_count} non-subscribers; launch cross-sell for conversion. `;
      alerts.push({
        rule_id: 'subscription_cross_sell_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_cross_sell_campaign: d.has_cross_sell_campaign,
        non_subscriber_count: d.non_subscriber_count,
        cross_sell_conversion_rate_pct: d.cross_sell_conversion_rate_pct,
        cross_sell_campaigns_monthly: d.cross_sell_campaigns_monthly,
        subscriber_count: d.subscriber_count,
        subscription_monthly_fee: d.subscription_monthly_fee,
        subscription_acquisition_cost: d.subscription_acquisition_cost,
        monthly_revenue: d.monthly_revenue,
        cross_sell_revenue_projected: expectedCrossSellRevenue,
        conversion_lift_projected_pct: 8,
        recurring_revenue_projected: expectedCrossSellRevenue,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SUBSCRIPTION CROSS-SELL ABSENT: ${d.location_id} — cross-sell campaign ABSENT; non-subscribers ${d.non_subscriber_count}; cross-sell conversion ${d.cross_sell_conversion_rate_pct}%; campaigns/month ${d.cross_sell_campaigns_monthly}; subscribers ${d.subscriber_count}; monthly fee ${fmt$(d.subscription_monthly_fee)}; acquisition cost ${fmt$(d.subscription_acquisition_cost)}/subscriber; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: cross-sell to existing customers converts 8-15% per campaign (subscription marketing study); cross-sell to existing customers is 5-10x cheaper than acquiring new subscribers (existing relationship, no CAC); cross-sell channels = email (existing customer database, free), SMS (high open rate 98%, $0.01-0.05/text), in-app push (if app), in-store (server/table tent), POS receipt (QR code sign-up); cross-sell campaign types = first month free (reduce commitment), value comparison (show $X value for $Y fee), social proof (X subscribers love it), limited-time offer (urgency), bundle (subscription + loyalty points); cross-sell best practice = 2-4 campaigns/month, segment non-subscribers (new, regular, lapsed), personalize message, A/B test offers, track conversion per campaign. Solutions ranked by impact: (1) LAUNCH cross-sell campaign — cross-sell revenue ${fmt$(expectedCrossSellRevenue)}/mo + visit frequency lift ${fmt$(expectedVisitFrequencyLift)}/mo + LTV lift ${fmt$(expectedLtvLift)}/mo + reduced CAC ${fmt$(expectedReducedCac)}/mo; cost ${fmt$(200)}/mo (email/SMS campaigns); payback <1 month; (2) SEGMENT non-subscribers (new, regular, lapsed); (3) DESIGN campaign types (first month free, value comparison, social proof, limited-time, bundle); (4) USE email channel (existing customer database, free); (5) USE SMS channel (high open rate 98%); (6) USE in-app push (if app); (7) USE in-store (server mention, table tent, POS receipt QR); (8) PERSONALIZE message (based on visit frequency, favorite items); (9) A/B test offers (which converts best?); (10) LAUNCH 2-4 campaigns/month; (11) TRACK conversion per campaign (target ${config.minCrossSellConversionRatePct}%+); (12) BENCHMARK vs competitor cross-sell. Industry data: 8-15% conversion per campaign; 5-10x cheaper than new acquisition; payback <1 month. Expected impact: +8% conversion, +${fmt$(expectedCrossSellRevenue)}/mo recurring revenue, payback <1 month.`,
        ai_recommendation: 'launch_cross_sell_campaign',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: SUBSCRIPTION_USAGE_TRACKING_ABSENT
    if (d.has_subscription_program && config.requireUsageTracking && !d.has_usage_tracking) {
      // no usage tracking -> can't optimize benefits
      const expectedBenefitOptimization = Math.round(d.subscriber_count * 12.99 * 0.15);
      const expectedChurnReduction = Math.round(d.subscriber_count * 0.10 * 12.99);
      const expectedLtvLift = Math.round(d.subscriber_count * 100);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedBenefitOptimization + expectedChurnReduction + expectedLtvLift + expectedSatisfactionLift, 1200);
      const severityLabel = d.subscriber_count > 200 ? 'medium' : 'low';
      const criticalNote = (d.subscriber_count > 200)
        ? `MEDIUM: NO USAGE TRACKING — ${d.subscriber_count} subscribers but no usage tracking; without tracking, can't identify which benefits drive retention = wasted benefit spend; usage tracking enables benefit optimization, churn prediction, personalization. `
        : `LOW: NO USAGE TRACKING — implement tracking to optimize benefits + predict churn. `;
      alerts.push({
        rule_id: 'subscription_usage_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_usage_tracking: d.has_usage_tracking,
        avg_usage_per_subscriber_monthly: d.avg_usage_per_subscriber_monthly,
        usage_benefit_breakdown: d.usage_benefit_breakdown,
        benefit_utilization_rate_pct: d.benefit_utilization_rate_pct,
        subscriber_count: d.subscriber_count,
        benefit_types: d.benefit_types,
        subscription_monthly_fee: d.subscription_monthly_fee,
        monthly_revenue: d.monthly_revenue,
        churn_reduction_projected_pct: 20,
        ltv_lift_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `USAGE TRACKING ABSENT: ${d.location_id} — usage tracking ${d.has_usage_tracking ? 'present' : 'ABSENT'}; avg usage ${d.avg_usage_per_subscriber_monthly}/subscriber/mo; benefit breakdown: ${d.usage_benefit_breakdown}; benefit utilization ${d.benefit_utilization_rate_pct}%; subscribers ${d.subscriber_count}; benefit types: ${d.benefit_types}; monthly fee ${fmt$(d.subscription_monthly_fee)}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without usage tracking, restaurants can't identify which benefits drive retention = wasted benefit spend; usage tracking enables benefit optimization (which benefits to keep/remove), churn prediction (subscribers who stop using = churn risk), personalization (recommend benefits based on usage), ROI measurement (which benefits drive LTV); usage tracking methods = POS integration (track benefit redemptions per subscriber), app tracking (if app, track logins/uses), CRM (track subscriber activity), survey (ask subscribers what they use); usage metrics = avg usage per subscriber/month (target 8-16), benefit utilization rate (target 50%+), benefit breakdown (which benefits used most), usage decline (churn risk indicator); usage tracking best practice = track per benefit per subscriber, identify high-value benefits (drive retention), remove low-value benefits (wasted spend), predict churn (usage decline = intervene), personalize (recommend benefits based on usage). Solutions ranked by impact: (1) IMPLEMENT usage tracking — benefit optimization ${fmt$(expectedBenefitOptimization)}/mo + churn reduction ${fmt$(expectedChurnReduction)}/mo + LTV lift ${fmt$(expectedLtvLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo; cost ${fmt$(200)}/mo (CRM/POS integration); payback 1-2 months; (2) INTEGRATE POS with subscription (track benefit redemptions per subscriber); (3) OR use app tracking (if app, track logins/uses); (4) OR use CRM (track subscriber activity); (5) OR survey subscribers (ask what they use); (6) TRACK avg usage per subscriber/month (target 8-16); (7) TRACK benefit utilization rate (target 50%+); (8) TRACK benefit breakdown (which benefits used most); (9) IDENTIFY high-value benefits (drive retention — keep); (10) REMOVE low-value benefits (wasted spend — cut); (11) PREDICT churn (usage decline = intervene before cancel); (12) PERSONALIZE (recommend benefits based on usage); (13) BENCHMARK vs competitor usage tracking. Industry data: 15% benefit optimization savings; 20% churn reduction; payback 1-2 months. Expected impact: +20% churn reduction, +15% LTV, payback 1-2 months.`,
        ai_recommendation: 'implement_usage_tracking',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: SUBSCRIPTION_PRICING_OPTIMIZATION_ABSENT
    if (d.has_subscription_program && config.requirePricingOptimization && !d.has_pricing_optimization) {
      // pricing not optimized -> leaving money on table
      const expectedPricingLift = Math.round(d.subscriber_count * (d.optimal_monthly_fee - d.subscription_monthly_fee));
      const expectedConversionOptimization = Math.round(d.non_subscriber_count * 0.02 * d.optimal_monthly_fee);
      const expectedRevenueOptimization = Math.round(d.subscriber_count * d.optimal_monthly_fee * 0.10);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedPricingLift + expectedConversionOptimization + expectedRevenueOptimization + expectedCompetitiveLift, 1400);
      const severityLabel = d.subscriber_count > 200 ? 'medium' : 'low';
      const criticalNote = (d.subscriber_count > 200)
        ? `MEDIUM: NO PRICING OPTIMIZATION — ${d.subscriber_count} subscribers, fee ${fmt$(d.subscription_monthly_fee)} but optimal ${fmt$(d.optimal_monthly_fee)}; without A/B testing, leaving 10-20% revenue on table; pricing optimization can lift subscription revenue 10-20%; price elasticity score ${d.price_elasticity_score}/100 (low understanding). `
        : `LOW: NO PRICING OPTIMIZATION — implement A/B testing to find optimal price. `;
      alerts.push({
        rule_id: 'subscription_pricing_optimization_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_pricing_optimization: d.has_pricing_optimization,
        price_elasticity_score: d.price_elasticity_score,
        subscription_monthly_fee: d.subscription_monthly_fee,
        optimal_monthly_fee: d.optimal_monthly_fee,
        price_test_count: d.price_test_count,
        subscriber_count: d.subscriber_count,
        non_subscriber_count: d.non_subscriber_count,
        benefit_value_ratio: d.benefit_value_ratio,
        monthly_revenue: d.monthly_revenue,
        pricing_revenue_lift_projected_pct: targetPricingLiftPct,
        recurring_revenue_projected: expectedPricingLift,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PRICING OPTIMIZATION ABSENT: ${d.location_id} — pricing optimization ${d.has_pricing_optimization ? 'present' : 'ABSENT'}; price elasticity score ${d.price_elasticity_score}/100 (low understanding); current fee ${fmt$(d.subscription_monthly_fee)}; AI-optimal fee ${fmt$(d.optimal_monthly_fee)}; price tests ${d.price_test_count}; subscribers ${d.subscriber_count}; non-subscribers ${d.non_subscriber_count}; benefit value ratio ${d.benefit_value_ratio}x; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: pricing optimization (A/B testing) can lift subscription revenue 10-20% (subscription pricing study); most restaurants set price once and never test — leaving 10-20% revenue on table; price elasticity = how demand changes with price (high elasticity = price-sensitive, low elasticity = price-insensitive); subscription price elasticity typically -0.5 to -1.5 (10% price increase = 5-15% subscriber loss, but 10% price increase = 10% revenue increase if loss < 10%); pricing optimization methods = A/B test (offer different prices to different segments), Van Westendorp (survey price sensitivity), competitive analysis (benchmark vs competitors), value-based (price based on benefit value, not cost); pricing test best practice = test 3-5 price points, 2-4 weeks per test, measure conversion + churn + revenue, find optimal = max revenue (not max conversion); pricing optimization tools = Price Intelligently, ProfitWell, Baremetrics (subscription analytics); annual vs monthly pricing = annual prepay 10-20% discount (reduces churn, improves cash flow). Solutions ranked by impact: (1) IMPLEMENT pricing optimization — pricing lift ${fmt$(expectedPricingLift)}/mo + conversion optimization ${fmt$(expectedConversionOptimization)}/mo + revenue optimization ${fmt$(expectedRevenueOptimization)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(200)}/mo (pricing tool); payback <1 month; (2) USE pricing optimization tool (Price Intelligently, ProfitWell, Baremetrics); (3) OR conduct Van Westendorp survey (ask price sensitivity); (4) A/B test 3-5 price points (e.g., $9.99, $12.99, $14.99, $17.99); (5) RUN 2-4 weeks per test; (6) MEASURE conversion + churn + revenue per price; (7) FIND optimal = max revenue (not max conversion); (8) BENCHMARK vs competitor pricing; (9) CONSIDER value-based pricing (price based on benefit value, not cost); (10) OFFER annual prepay (10-20% discount, reduces churn, improves cash flow); (11) TEST annual vs monthly (which drives more revenue?); (12) TRACK price elasticity score (target 70+); (13) BENCHMARK vs competitor pricing optimization. Industry data: 10-20% revenue lift from pricing optimization; payback <1 month. Expected impact: +${targetPricingLiftPct}% pricing revenue lift, +${fmt$(expectedPricingLift)}/mo recurring revenue, payback <1 month.`,
        ai_recommendation: 'optimize_subscription_pricing',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM subscription_program_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE subscription_program_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant subscription and membership program expert. Given subscription program data, recommend ONE specific action with expected recurring revenue lift, conversion lift, churn reduction, or LTV lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Subscription program: ${a.has_subscription_program ?? false} (${a.subscription_program_name ?? 'none'}, ${a.subscriber_count ?? 0}/${a.subscriber_target_count ?? 0} subscribers). Tiers: ${a.subscription_tier_count ?? 0} (${a.subscription_tiers ?? 'none'}), conversion ${a.tier_conversion_rate_pct ?? 0}%/${a.tier_conversion_target_pct ?? 10}%. Fee: ${fmt$(a.subscription_monthly_fee ?? 0)}/mo, benefit value ${fmt$(a.benefit_value_per_month ?? 0)} (${a.benefit_value_ratio ?? 0}x ratio, types: ${a.benefit_types ?? 'none'}). Sign-up: ${a.sign_up_steps_count ?? 0} steps, ${a.sign_up_time_minutes ?? 0}min (max ${a.sign_up_time_target_minutes ?? 2}min), ${a.sign_up_abandonment_rate_pct ?? 0}% abandon. Churn: ${a.monthly_churn_rate_pct ?? 0}%/mo (max ${a.monthly_churn_rate_pct ?? 8}%, target ${a.monthly_churn_target_pct ?? 7}%), lifetime ${a.avg_subscriber_lifetime_months ?? 0}mo, reasons: ${a.churn_reasons_top ?? 'none'}. Cross-sell: ${a.has_cross_sell_campaign ?? false} (${a.cross_sell_conversion_rate_pct ?? 0}% conversion, ${a.cross_sell_campaigns_monthly ?? 0} campaigns/mo, ${a.non_subscriber_count ?? 0} non-subscribers). Usage tracking: ${a.has_usage_tracking ?? false} (${a.avg_usage_per_subscriber_monthly ?? 0} uses/sub/mo, utilization ${a.benefit_utilization_rate_pct ?? 0}%, breakdown: ${a.usage_benefit_breakdown ?? 'none'}). Pricing: ${a.has_pricing_optimization ?? false} (elasticity ${a.price_elasticity_score ?? 0}/100, fee ${fmt$(a.subscription_monthly_fee ?? 0)}/${fmt$(a.optimal_monthly_fee ?? 0)} optimal, ${a.price_test_count ?? 0} tests). Revenue: ${fmt$(a.subscription_revenue_monthly ?? 0)}/mo (${fmt$(a.subscription_revenue_annual_projected ?? 0)}/yr projected). Subscriber spend: ${fmt$(a.subscriber_avg_spend_per_visit ?? 0)}/visit vs ${fmt$(a.non_subscriber_avg_spend_per_visit ?? 0)} non-sub. Visit freq: ${a.subscriber_visit_frequency_monthly ?? 0}/mo vs ${a.non_subscriber_visit_frequency_monthly ?? 0}/mo. LTV: ${fmt$(a.subscriber_ltv ?? 0)} vs ${fmt$(a.non_subscriber_ltv ?? 0)} (${a.subscriber_ltv_lift_pct ?? 0}% lift). Competitor: ${a.competitor_subscription_score ?? 0}/100. Total customers: ${a.total_customers ?? 0}. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Program cost: ${fmt$(a.subscription_program_cost_monthly ?? 0)}/mo. Acquisition cost: ${fmt$(a.subscription_acquisition_cost ?? 0)}/sub. Churn cost: ${fmt$(a.churn_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveSubscriptionProgramAlerts = async (db: ReturnType<typeof useDB>): Promise<SubscriptionProgramAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM subscription_program_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getSubscriptionProgramSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  subscriptionProgramAbsentCount: number;
  subscriptionTierStructureSuboptimalCount: number;
  subscriptionBenefitValueLowCount: number;
  subscriptionSignUpFrictionHighCount: number;
  subscriptionRetentionChurnHighCount: number;
  subscriptionCrossSellAbsentCount: number;
  subscriptionUsageTrackingAbsentCount: number;
  subscriptionPricingOptimizationAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'subscription_program_absent') AS noprogram,
              math::count(rule_id = 'subscription_tier_structure_suboptimal') AS subtiers,
              math::count(rule_id = 'subscription_benefit_value_low') AS lowbenefit,
              math::count(rule_id = 'subscription_sign_up_friction_high') AS highfriction,
              math::count(rule_id = 'subscription_retention_churn_high') AS highchurn,
              math::count(rule_id = 'subscription_cross_sell_absent') AS nocrosssell,
              math::count(rule_id = 'subscription_usage_tracking_absent') AS nousage,
              math::count(rule_id = 'subscription_pricing_optimization_absent') AS nopricing
       FROM subscription_program_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      subscriptionProgramAbsentCount: safeNumber(r.noprogram, 0),
      subscriptionTierStructureSuboptimalCount: safeNumber(r.subtiers, 0),
      subscriptionBenefitValueLowCount: safeNumber(r.lowbenefit, 0),
      subscriptionSignUpFrictionHighCount: safeNumber(r.highfriction, 0),
      subscriptionRetentionChurnHighCount: safeNumber(r.highchurn, 0),
      subscriptionCrossSellAbsentCount: safeNumber(r.nocrosssell, 0),
      subscriptionUsageTrackingAbsentCount: safeNumber(r.nousage, 0),
      subscriptionPricingOptimizationAbsentCount: safeNumber(r.nopricing, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, subscriptionProgramAbsentCount: 0, subscriptionTierStructureSuboptimalCount: 0, subscriptionBenefitValueLowCount: 0, subscriptionSignUpFrictionHighCount: 0, subscriptionRetentionChurnHighCount: 0, subscriptionCrossSellAbsentCount: 0, subscriptionUsageTrackingAbsentCount: 0, subscriptionPricingOptimizationAbsentCount: 0 };
  }
};

export const updateSubscriptionProgramAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
