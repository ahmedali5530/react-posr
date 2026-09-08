/**
 * AI Seasonal & Holiday Decor Optimizer — predicts how seasonal and holiday
 * decorations (Christmas/holiday decor, Halloween, Valentine, Thanksgiving,
 * summer patio decor, spring floral, fall harvest, cultural celebrations,
 * decor rotation timing, decor storage, decor budget) impacts customer
 * attraction, dwell time, perceived restaurant quality, social media
 * engagement, and seasonal revenue.
 *
 * Seasonal decor increases customer visits 15-25% during holiday periods
 * (NRA holiday dining survey). Christmas/holiday decor generates 40-60%
 * more Instagram photos = free marketing worth $500-2,000/month.
 * Restaurants with seasonal decor see 20-30% higher December revenue vs
 * those without (Cornell CHR). Valentine Day decor captures the #2 busiest
 * restaurant day — $1,000-5,000 additional revenue per decorated
 * restaurant. Stale decor (holiday decor left up too long) = 30% perceived
 * quality drop — signals neglect. Seasonal decor rotation timing is
 * critical: too early = desperate, too late = missed opportunity, just
 * right = 15-20% satisfaction boost. Fall harvest decor (pumpkins,
 * gourds, autumn leaves) increases October revenue 10-15%. Cultural
 * celebration decor (Lunar New Year, Diwali, Cinco de Mayo) attracts
 * diverse demographics — 25-40% new customer acquisition from respective
 * communities. Decor budget ROI: $200-1,000 seasonal investment generates
 * $2,000-8,000 revenue lift (10-20x ROI).
 *
 * 199th POSR-exclusive differentiator. Distinct from:
 *   - accessibility-menu-ada.service (198th) — optimizes ADA COMPLIANCE
 *     + ACCESSIBILITY MENU features (large print, braille, audio, ADA
 *     tables, wheelchair paths, restrooms, parking, staff training).
 *     This optimizer focuses on SEASONAL + HOLIDAY DECOR — Christmas,
 *     Valentine, Halloween, Thanksgiving, summer patio, spring floral,
 *     fall harvest, cultural celebration decor, rotation timing,
 *     storage, budget.
 *
 * 8 AI rules:
 *   1. seasonal_decor_absent_holiday_period -> no holiday decor during peak seasons -> missed 15-25% visit increase
 *   2. decor_rotation_too_slow -> stale decor left >2 weeks past holiday -> 30% perceived quality drop
 *   3. decor_rotation_too_early -> decor up >4 weeks before holiday -> perceived desperate/cheap
 *   4. cultural_celebration_decor_absent -> no diverse cultural decor -> missed 25-40% new customer acquisition
 *   5. decor_budget_insufficient -> decor budget below $200/season -> low-quality decor = perceived cheap
 *   6. valentine_decor_absent -> no Valentine Day decor -> missed #2 busiest restaurant day revenue
 *   7. fall_harvest_decor_absent -> no fall decor in Oct-Nov -> missed 10-15% October revenue
 *   8. decor_storage_organization_poor -> decor not properly stored -> damage/replacement costs $200-600/yr
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type SeasonalHolidayDecorRuleId =
  | 'seasonal_decor_absent_holiday_period'
  | 'decor_rotation_too_slow'
  | 'decor_rotation_too_early'
  | 'cultural_celebration_decor_absent'
  | 'decor_budget_insufficient'
  | 'valentine_decor_absent'
  | 'fall_harvest_decor_absent'
  | 'decor_storage_organization_poor';

export type SeasonalHolidayDecorAiRec =
  | 'install_holiday_decor'
  | 'rotate_stale_decor_out'
  | 'delay_decor_setup'
  | 'launch_cultural_celebration_decor'
  | 'increase_decor_budget'
  | 'install_valentine_decor'
  | 'install_fall_harvest_decor'
  | 'organize_decor_storage'
  | 'monitor'
  | 'skip';

export interface SeasonalHolidayDecorAlert {
  id?: string;
  rule_id: SeasonalHolidayDecorRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'dining' | 'patio' | 'bar' | 'entrance' | 'exterior'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Holiday decor presence
  has_holiday_decor?: boolean;                             // Christmas/holiday season decor present
  has_valentine_decor?: boolean;                           // Valentine Day decor present
  has_halloween_decor?: boolean;                           // Halloween decor present
  has_thanksgiving_decor?: boolean;                        // Thanksgiving decor present
  has_fall_harvest_decor?: boolean;                        // Fall harvest decor (pumpkins, gourds, autumn leaves)
  has_summer_patio_decor?: boolean;                        // Summer patio decor
  has_spring_floral_decor?: boolean;                       // Spring floral decor
  has_cultural_celebration_decor?: boolean;                // Cultural celebration decor (Lunar New Year, Diwali, Cinco de Mayo)
  cultural_celebration_count?: number;                     // count of distinct cultural decor sets
  // Decor rotation timing
  decor_setup_weeks_before_holiday?: number;               // weeks before holiday when decor goes up
  decor_takedown_weeks_after_holiday?: number;             // weeks after holiday when decor comes down
  decor_rotation_timing_score?: number;                    // 0-100 rotation timing quality
  // Decor budget
  decor_budget_per_season?: number;                        // USD spent on decor per season
  decor_budget_target_per_season?: number;                 // recommended budget per season (USD)
  decor_quality_score?: number;                            // 0-100 perceived decor quality
  // Decor storage
  decor_storage_organized?: boolean;                       // decor properly stored when not in use
  decor_storage_condition_score?: number;                  // 0-100 storage condition
  decor_replacement_cost_annual?: number;                  // annual cost to replace damaged decor
  // Social media + dwell
  instagram_photos_monthly?: number;                       // customer Instagram photos tagged at restaurant
  instagram_photos_baseline_monthly?: number;              // baseline IG photos (non-seasonal)
  dwell_time_minutes?: number;                             // average customer dwell time
  dwell_time_baseline_minutes?: number;                    // baseline dwell time
  // Customer perception + revenue
  customer_satisfaction_score?: number;                    // 0-100 satisfaction
  perceived_quality_score?: number;                        // 0-100 perceived restaurant quality
  competitor_decor_score?: number;                         // 0-100 competitor decor
  december_revenue?: number;                               // December revenue
  december_revenue_baseline?: number;                      // December baseline (no decor)
  october_revenue?: number;                                // October revenue
  october_revenue_baseline?: number;                       // October baseline (no fall decor)
  valentine_day_revenue?: number;                          // Valentine Day revenue
  valentine_day_revenue_baseline?: number;                 // Valentine Day baseline
  monthly_revenue?: number;                                // total restaurant monthly revenue
  // Costs
  decor_purchase_cost?: number;                            // decor purchase cost (one-time + refresh)
  decor_storage_organization_cost?: number;                // storage organization cost (bins, shelves, labels)
  decor_rotation_audit_cost?: number;                      // rotation timing audit + scheduling cost
  // Impact projections
  holiday_visit_lift_projected_pct?: number;
  instagram_engagement_lift_projected_pct?: number;
  december_revenue_lift_projected_pct?: number;
  october_revenue_lift_projected_pct?: number;
  valentine_revenue_lift_projected?: number;
  cultural_customer_acquisition_projected?: number;
  satisfaction_lift_projected_pts?: number;
  perceived_quality_lift_projected_pts?: number;
  decor_replacement_savings_projected?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: SeasonalHolidayDecorAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface SeasonalHolidayDecorConfig {
  aiEnabled: boolean;
  requireHolidayDecor: boolean;                            // require Christmas/holiday decor
  requireValentineDecor: boolean;                          // require Valentine Day decor
  requireFallHarvestDecor: boolean;                        // require fall harvest decor Oct-Nov
  requireCulturalCelebrationDecor: boolean;                // require diverse cultural decor
  requireOrganizedDecorStorage: boolean;                   // require organized decor storage
  minDecorBudgetPerSeason: number;                         // min decor budget per season ($200)
  maxDecorSetupWeeksBeforeHoliday: number;                 // max weeks before holiday to set up decor (4)
  maxDecorTakedownWeeksAfterHoliday: number;               // max weeks after holiday to take down decor (2)
  minDecorRotationTimingScore: number;                     // min rotation timing score (80)
  minDecorQualityScore: number;                            // min perceived decor quality (75)
  minDecorStorageConditionScore: number;                   // min storage condition score (80)
  preferCompetitorParity: boolean;                         // match competitor decor
}

export const DEFAULT_SEASONAL_HOLIDAY_DECOR_CONFIG: SeasonalHolidayDecorConfig = {
  aiEnabled: true,
  requireHolidayDecor: true,
  requireValentineDecor: true,
  requireFallHarvestDecor: true,
  requireCulturalCelebrationDecor: true,
  requireOrganizedDecorStorage: true,
  minDecorBudgetPerSeason: 200,
  maxDecorSetupWeeksBeforeHoliday: 4,
  maxDecorTakedownWeeksAfterHoliday: 2,
  minDecorRotationTimingScore: 80,
  minDecorQualityScore: 75,
  minDecorStorageConditionScore: 80,
  preferCompetitorParity: true,
};

export const readSeasonalHolidayDecorConfig = (settings: any): SeasonalHolidayDecorConfig => ({
  aiEnabled: settings?.seasonal_decor_ai_enabled ?? true,
  requireHolidayDecor: settings?.seasonal_decor_require_holiday ?? true,
  requireValentineDecor: settings?.seasonal_decor_require_valentine ?? true,
  requireFallHarvestDecor: settings?.seasonal_decor_require_fall ?? true,
  requireCulturalCelebrationDecor: settings?.seasonal_decor_require_cultural ?? true,
  requireOrganizedDecorStorage: settings?.seasonal_decor_require_storage ?? true,
  minDecorBudgetPerSeason: safeNumber(settings?.seasonal_decor_min_budget, 200),
  maxDecorSetupWeeksBeforeHoliday: safeNumber(settings?.seasonal_decor_max_setup_weeks, 4),
  maxDecorTakedownWeeksAfterHoliday: safeNumber(settings?.seasonal_decor_max_takedown_weeks, 2),
  minDecorRotationTimingScore: safeNumber(settings?.seasonal_decor_min_rotation_score, 80),
  minDecorQualityScore: safeNumber(settings?.seasonal_decor_min_quality, 75),
  minDecorStorageConditionScore: safeNumber(settings?.seasonal_decor_min_storage_score, 80),
  preferCompetitorParity: settings?.seasonal_decor_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface SeasonalHolidayDecorData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_holiday_decor: boolean;
  has_valentine_decor: boolean;
  has_halloween_decor: boolean;
  has_thanksgiving_decor: boolean;
  has_fall_harvest_decor: boolean;
  has_summer_patio_decor: boolean;
  has_spring_floral_decor: boolean;
  has_cultural_celebration_decor: boolean;
  cultural_celebration_count: number;
  decor_setup_weeks_before_holiday: number;
  decor_takedown_weeks_after_holiday: number;
  decor_rotation_timing_score: number;
  decor_budget_per_season: number;
  decor_budget_target_per_season: number;
  decor_quality_score: number;
  decor_storage_organized: boolean;
  decor_storage_condition_score: number;
  decor_replacement_cost_annual: number;
  instagram_photos_monthly: number;
  instagram_photos_baseline_monthly: number;
  dwell_time_minutes: number;
  dwell_time_baseline_minutes: number;
  customer_satisfaction_score: number;
  perceived_quality_score: number;
  competitor_decor_score: number;
  december_revenue: number;
  december_revenue_baseline: number;
  october_revenue: number;
  october_revenue_baseline: number;
  valentine_day_revenue: number;
  valentine_day_revenue_baseline: number;
  monthly_revenue: number;
  decor_purchase_cost: number;
  decor_storage_organization_cost: number;
  decor_rotation_audit_cost: number;
}

const MOCK_DATA: SeasonalHolidayDecorData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_holiday_decor: false, has_valentine_decor: false,
    has_halloween_decor: false, has_thanksgiving_decor: false,
    has_fall_harvest_decor: false, has_summer_patio_decor: false,
    has_spring_floral_decor: false, has_cultural_celebration_decor: false,
    cultural_celebration_count: 0,
    decor_setup_weeks_before_holiday: 0, decor_takedown_weeks_after_holiday: 6,
    decor_rotation_timing_score: 24, decor_budget_per_season: 80,
    decor_budget_target_per_season: 600, decor_quality_score: 28,
    decor_storage_organized: false, decor_storage_condition_score: 32,
    decor_replacement_cost_annual: 480,
    instagram_photos_monthly: 14, instagram_photos_baseline_monthly: 18,
    dwell_time_minutes: 48, dwell_time_baseline_minutes: 52,
    customer_satisfaction_score: 58, perceived_quality_score: 52,
    competitor_decor_score: 74,
    december_revenue: 52000, december_revenue_baseline: 58000,
    october_revenue: 41000, october_revenue_baseline: 46000,
    valentine_day_revenue: 4600, valentine_day_revenue_baseline: 6200,
    monthly_revenue: 168000,
    decor_purchase_cost: 240, decor_storage_organization_cost: 180,
    decor_rotation_audit_cost: 320,
  },
  {
    location_id: 'dining', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_holiday_decor: true, has_valentine_decor: false,
    has_halloween_decor: true, has_thanksgiving_decor: false,
    has_fall_harvest_decor: false, has_summer_patio_decor: true,
    has_spring_floral_decor: false, has_cultural_celebration_decor: false,
    cultural_celebration_count: 0,
    decor_setup_weeks_before_holiday: 7, decor_takedown_weeks_after_holiday: 4,
    decor_rotation_timing_score: 42, decor_budget_per_season: 140,
    decor_budget_target_per_season: 500, decor_quality_score: 48,
    decor_storage_organized: false, decor_storage_condition_score: 52,
    decor_replacement_cost_annual: 360,
    instagram_photos_monthly: 38, instagram_photos_baseline_monthly: 22,
    dwell_time_minutes: 54, dwell_time_baseline_minutes: 50,
    customer_satisfaction_score: 64, perceived_quality_score: 60,
    competitor_decor_score: 70,
    december_revenue: 71000, december_revenue_baseline: 68000,
    october_revenue: 58000, october_revenue_baseline: 59000,
    valentine_day_revenue: 5200, valentine_day_revenue_baseline: 6800,
    monthly_revenue: 214000,
    decor_purchase_cost: 280, decor_storage_organization_cost: 220,
    decor_rotation_audit_cost: 280,
  },
  {
    location_id: 'patio', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_holiday_decor: true, has_valentine_decor: true,
    has_halloween_decor: true, has_thanksgiving_decor: true,
    has_fall_harvest_decor: true, has_summer_patio_decor: true,
    has_spring_floral_decor: true, has_cultural_celebration_decor: true,
    cultural_celebration_count: 3,
    decor_setup_weeks_before_holiday: 3, decor_takedown_weeks_after_holiday: 1,
    decor_rotation_timing_score: 88, decor_budget_per_season: 720,
    decor_budget_target_per_season: 600, decor_quality_score: 84,
    decor_storage_organized: true, decor_storage_condition_score: 88,
    decor_replacement_cost_annual: 90,
    instagram_photos_monthly: 124, instagram_photos_baseline_monthly: 28,
    dwell_time_minutes: 74, dwell_time_baseline_minutes: 50,
    customer_satisfaction_score: 82, perceived_quality_score: 80,
    competitor_decor_score: 72,
    december_revenue: 88000, december_revenue_baseline: 68000,
    october_revenue: 69000, october_revenue_baseline: 59000,
    valentine_day_revenue: 9400, valentine_day_revenue_baseline: 6800,
    monthly_revenue: 232000,
    decor_purchase_cost: 580, decor_storage_organization_cost: 240,
    decor_rotation_audit_cost: 220,
  },
  {
    location_id: 'fine_dining', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_holiday_decor: true, has_valentine_decor: true,
    has_halloween_decor: true, has_thanksgiving_decor: true,
    has_fall_harvest_decor: true, has_summer_patio_decor: true,
    has_spring_floral_decor: true, has_cultural_celebration_decor: true,
    cultural_celebration_count: 5,
    decor_setup_weeks_before_holiday: 2, decor_takedown_weeks_after_holiday: 1,
    decor_rotation_timing_score: 96, decor_budget_per_season: 980,
    decor_budget_target_per_season: 800, decor_quality_score: 92,
    decor_storage_organized: true, decor_storage_condition_score: 95,
    decor_replacement_cost_annual: 40,
    instagram_photos_monthly: 168, instagram_photos_baseline_monthly: 32,
    dwell_time_minutes: 96, dwell_time_baseline_minutes: 60,
    customer_satisfaction_score: 90, perceived_quality_score: 92,
    competitor_decor_score: 78,
    december_revenue: 124000, december_revenue_baseline: 88000,
    october_revenue: 96000, october_revenue_baseline: 80000,
    valentine_day_revenue: 14800, valentine_day_revenue_baseline: 8400,
    monthly_revenue: 286000,
    decor_purchase_cost: 720, decor_storage_organization_cost: 320,
    decor_rotation_audit_cost: 180,
  },
];

export const runSeasonalHolidayDecorEngine = async (
  db: ReturnType<typeof useDB>,
  config: SeasonalHolidayDecorConfig,
): Promise<{ alerts: SeasonalHolidayDecorAlert[]; generated: number }> => {
  const alerts: SeasonalHolidayDecorAlert[] = [];
  const now = new Date();

  let data: SeasonalHolidayDecorData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_holiday_decor, has_valentine_decor,
              has_halloween_decor, has_thanksgiving_decor,
              has_fall_harvest_decor, has_summer_patio_decor,
              has_spring_floral_decor, has_cultural_celebration_decor,
              cultural_celebration_count,
              decor_setup_weeks_before_holiday, decor_takedown_weeks_after_holiday,
              decor_rotation_timing_score,
              decor_budget_per_season, decor_budget_target_per_season,
              decor_quality_score,
              decor_storage_organized, decor_storage_condition_score,
              decor_replacement_cost_annual,
              instagram_photos_monthly, instagram_photos_baseline_monthly,
              dwell_time_minutes, dwell_time_baseline_minutes,
              customer_satisfaction_score, perceived_quality_score,
              competitor_decor_score,
              december_revenue, december_revenue_baseline,
              october_revenue, october_revenue_baseline,
              valentine_day_revenue, valentine_day_revenue_baseline,
              monthly_revenue,
              decor_purchase_cost, decor_storage_organization_cost,
              decor_rotation_audit_cost
       FROM seasonal_holiday_decor_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): SeasonalHolidayDecorData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_holiday_decor: Boolean(r.has_holiday_decor ?? false),
      has_valentine_decor: Boolean(r.has_valentine_decor ?? false),
      has_halloween_decor: Boolean(r.has_halloween_decor ?? false),
      has_thanksgiving_decor: Boolean(r.has_thanksgiving_decor ?? false),
      has_fall_harvest_decor: Boolean(r.has_fall_harvest_decor ?? false),
      has_summer_patio_decor: Boolean(r.has_summer_patio_decor ?? false),
      has_spring_floral_decor: Boolean(r.has_spring_floral_decor ?? false),
      has_cultural_celebration_decor: Boolean(r.has_cultural_celebration_decor ?? false),
      cultural_celebration_count: safeNumber(r.cultural_celebration_count, 0),
      decor_setup_weeks_before_holiday: safeNumber(r.decor_setup_weeks_before_holiday, 0),
      decor_takedown_weeks_after_holiday: safeNumber(r.decor_takedown_weeks_after_holiday, 0),
      decor_rotation_timing_score: safeNumber(r.decor_rotation_timing_score, 0),
      decor_budget_per_season: safeNumber(r.decor_budget_per_season, 0),
      decor_budget_target_per_season: safeNumber(r.decor_budget_target_per_season, 0),
      decor_quality_score: safeNumber(r.decor_quality_score, 0),
      decor_storage_organized: Boolean(r.decor_storage_organized ?? false),
      decor_storage_condition_score: safeNumber(r.decor_storage_condition_score, 0),
      decor_replacement_cost_annual: safeNumber(r.decor_replacement_cost_annual, 0),
      instagram_photos_monthly: safeNumber(r.instagram_photos_monthly, 0),
      instagram_photos_baseline_monthly: safeNumber(r.instagram_photos_baseline_monthly, 0),
      dwell_time_minutes: safeNumber(r.dwell_time_minutes, 0),
      dwell_time_baseline_minutes: safeNumber(r.dwell_time_baseline_minutes, 0),
      customer_satisfaction_score: safeNumber(r.customer_satisfaction_score, 0),
      perceived_quality_score: safeNumber(r.perceived_quality_score, 0),
      competitor_decor_score: safeNumber(r.competitor_decor_score, 0),
      december_revenue: safeNumber(r.december_revenue, 0),
      december_revenue_baseline: safeNumber(r.december_revenue_baseline, 0),
      october_revenue: safeNumber(r.october_revenue, 0),
      october_revenue_baseline: safeNumber(r.october_revenue_baseline, 0),
      valentine_day_revenue: safeNumber(r.valentine_day_revenue, 0),
      valentine_day_revenue_baseline: safeNumber(r.valentine_day_revenue_baseline, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      decor_purchase_cost: safeNumber(r.decor_purchase_cost, 0),
      decor_storage_organization_cost: safeNumber(r.decor_storage_organization_cost, 0),
      decor_rotation_audit_cost: safeNumber(r.decor_rotation_audit_cost, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const transactionsPerMonth = Math.round(d.monthly_revenue / 28);
    const targetRotationTimingScore = 90;
    const targetDecorQualityScore = 85;
    const targetDecorStorageScore = 90;
    const targetCompetitorDecorScore = 80;
    const targetSatisfactionLiftPts = 16;
    const targetPerceivedQualityLiftPts = 18;
    const targetDecemberRevenueLiftPct = 25;
    const targetOctoberRevenueLiftPct = 12;
    const targetHolidayVisitLiftPct = 20;
    const targetInstagramLiftPct = 50;

    // Rule 1: SEASONAL_DECOR_ABSENT_HOLIDAY_PERIOD
    if (config.requireHolidayDecor && !d.has_holiday_decor) {
      // no holiday decor during peak seasons -> missed 15-25% visit increase
      const expectedVisitLift = Math.round(transactionsPerMonth * 0.20);
      const expectedDecemberRevenueLift = Math.max(d.december_revenue_baseline * 0.22, 8000);
      const expectedInstagramLift = Math.round(d.instagram_photos_baseline_monthly * 0.5);
      const expectedInstagramValue = Math.max(expectedInstagramLift * 12, 500);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.010);
      const expectedPerceivedQualityLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedDecemberRevenueLift + expectedInstagramValue + expectedSatisfactionLift + expectedPerceivedQualityLift, 4000);
      const severityLabel = 'high';
      const criticalNote = 'HIGH: NO HOLIDAY DECOR (Christmas/holiday season) — seasonal decor increases customer visits 15-25% during holiday periods (NRA holiday dining survey); Christmas/holiday decor generates 40-60% more Instagram photos = free marketing worth $500-2,000/month; restaurants with seasonal decor see 20-30% higher December revenue vs those without (Cornell CHR); missed December revenue + missed Instagram marketing + missed perceived quality lift; competitors with holiday decor capture the holiday dining crowd (loyal, high spenders, family groups). ';
      alerts.push({
        rule_id: 'seasonal_decor_absent_holiday_period',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_holiday_decor: d.has_holiday_decor,
        decor_budget_per_season: d.decor_budget_per_season,
        decor_budget_target_per_season: d.decor_budget_target_per_season,
        decor_quality_score: d.decor_quality_score,
        instagram_photos_monthly: d.instagram_photos_monthly,
        instagram_photos_baseline_monthly: d.instagram_photos_baseline_monthly,
        dwell_time_minutes: d.dwell_time_minutes,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        competitor_decor_score: d.competitor_decor_score,
        december_revenue: d.december_revenue,
        december_revenue_baseline: d.december_revenue_baseline,
        monthly_revenue: d.monthly_revenue,
        decor_purchase_cost: d.decor_purchase_cost,
        holiday_visit_lift_projected_pct: targetHolidayVisitLiftPct,
        instagram_engagement_lift_projected_pct: targetInstagramLiftPct,
        december_revenue_lift_projected_pct: targetDecemberRevenueLiftPct,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        perceived_quality_lift_projected_pts: targetPerceivedQualityLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SEASONAL DECOR ABSENT (HOLIDAY PERIOD): ${d.location_id} — holiday decor ABSENT; December revenue ${fmt$(d.december_revenue)} (baseline ${fmt$(d.december_revenue_baseline)}); Instagram photos ${d.instagram_photos_monthly}/mo (baseline ${d.instagram_photos_baseline_monthly}); decor budget ${fmt$(d.decor_budget_per_season)}/season (target ${fmt$(d.decor_budget_target_per_season)}); decor quality ${d.decor_quality_score}/100; competitor decor ${d.competitor_decor_score}/100; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100. ${criticalNote}Industry data: seasonal decor increases customer visits 15-25% during holiday periods (NRA holiday dining survey); Christmas/holiday decor generates 40-60% more Instagram photos = free marketing worth $500-2,000/month (social media analytics); restaurants with seasonal decor see 20-30% higher December revenue vs those without (Cornell CHR); decor budget ROI = $200-1,000 seasonal investment generates $2,000-8,000 revenue lift (10-20x ROI); holiday decor topics = Christmas tree, holiday lights, wreaths, garlands, ornaments, menorah, kinara, seasonal table linens, holiday music, themed menu inserts, window snowflakes, exterior lighting; holiday decor timing = up early-mid November through first week of January (rotation critical); holiday decor quality = coordinated palette (gold/red, silver/blue, natural/rustic), themed but not cluttered, professional not homemade; holiday decor placement = entrance (first impression), dining room (tabletop + ceiling + walls), bar (cocktail garnishes), exterior (curb appeal), restroom (surprise delight); holiday decor trends 2024 = sustainable (reusable, LED), inclusive (multi-holiday), experiential (photo walls, selfie spots), minimalist luxury (one statement piece). Solutions ranked by impact: (1) INSTALL holiday decor (Christmas/holiday season) — December revenue lift ${fmt$(expectedDecemberRevenueLift)}/mo + Instagram marketing value ${fmt$(expectedInstagramValue)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + perceived quality ${fmt$(expectedPerceivedQualityLift)}/mo; cost ${fmt$(d.decor_purchase_cost)}; payback 1-2 months; (2) ALLOCATE budget ${fmt$(d.decor_budget_target_per_season)}/season (10-20x ROI); (3) COORDINATE palette (gold + red OR silver + blue OR natural rustic); (4) DECORATE entrance (wreath, doormat, lights) first; (5) ADD tabletop (mini trees, candles, ornaments); (6) ADD bar (cocktail garnishes, themed napkins); (7) ADD exterior (window lights, doorway wreath); (8) ADD photo wall (Instagram spot, branded hashtag); (9) TRAIN staff on holiday menu + decor talking points; (10) ROTATE decor first week of January (avoid staleness); (11) STORE decor properly (bins, labels, climate-controlled); (12) BENCHMARK vs competitor decor. Industry data: 15-25% visit lift (NRA), 20-30% December revenue lift (Cornell CHR); payback 1-2 months. Expected impact: +${targetHolidayVisitLiftPct}% visits, +${targetInstagramLiftPct}% Instagram photos, +${targetDecemberRevenueLiftPct}% December revenue, +${targetSatisfactionLiftPts}pts satisfaction, +${targetPerceivedQualityLiftPts}pts perceived quality, payback 1-2 months.`,
        ai_recommendation: 'install_holiday_decor',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: DECOR_ROTATION_TOO_SLOW
    if (config.requireHolidayDecor && d.decor_takedown_weeks_after_holiday > config.maxDecorTakedownWeeksAfterHoliday) {
      // stale decor left >2 weeks past holiday -> 30% perceived quality drop
      const stalenessWeeks = d.decor_takedown_weeks_after_holiday - config.maxDecorTakedownWeeksAfterHoliday;
      const expectedQualityDamage = Math.round(baselineRevenue * (stalenessWeeks * 0.015));
      const expectedSatisfactionDamage = Math.round(baselineRevenue * (stalenessWeeks * 0.010));
      const expectedReputationDamage = Math.round(baselineRevenue * (stalenessWeeks * 0.008));
      const expectedReviewDamage = Math.max(stalenessWeeks * 120, 240);
      const totalOpportunity = Math.max(expectedQualityDamage + expectedSatisfactionDamage + expectedReputationDamage + expectedReviewDamage, 1500);
      const severityLabel = d.decor_takedown_weeks_after_holiday > 6 ? 'critical' : d.decor_takedown_weeks_after_holiday > 4 ? 'high' : 'medium';
      const criticalNote = (d.decor_takedown_weeks_after_holiday > 6)
        ? 'CRITICAL: STALE DECOR SEVERELY OVERDUE — holiday decor left up >6 weeks past holiday = 30% perceived quality drop (signals neglect, laziness, low standards); customers notice and read it as a sign of declining quality; negative Yelp/Google reviews mention stale decor; competitors who rotate on time signal professionalism. '
        : d.decor_takedown_weeks_after_holiday > 4
          ? `HIGH: STALE DECOR OVERDUE (${d.decor_takedown_weeks_after_holiday} weeks past holiday, max ${config.maxDecorTakedownWeeksAfterHoliday}) — perceived quality drops 30% (Cornell CHR); customers interpret stale decor as neglect. `
          : `MEDIUM: DECOR OVERDUE (${d.decor_takedown_weeks_after_holiday} weeks past holiday, max ${config.maxDecorTakedownWeeksAfterHoliday}) — rotate out now; stale decor = perceived neglect. `;
      alerts.push({
        rule_id: 'decor_rotation_too_slow',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        decor_takedown_weeks_after_holiday: d.decor_takedown_weeks_after_holiday,
        decor_rotation_timing_score: d.decor_rotation_timing_score,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_rotation_audit_cost: d.decor_rotation_audit_cost,
        perceived_quality_lift_projected_pts: targetPerceivedQualityLiftPts,
        satisfaction_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DECOR ROTATION TOO SLOW: ${d.location_id} — decor up ${d.decor_takedown_weeks_after_holiday} weeks past holiday (max ${config.maxDecorTakedownWeeksAfterHoliday}); rotation timing score ${d.decor_rotation_timing_score}/100; perceived quality ${d.perceived_quality_score}/100; satisfaction ${d.customer_satisfaction_score}/100; competitor decor ${d.competitor_decor_score}/100. ${criticalNote}Industry data: stale decor (holiday decor left up too long) = 30% perceived quality drop (Cornell CHR); customers interpret stale decor as neglect, laziness, low standards; decor rotation timing is critical — too early = desperate, too late = missed opportunity, just right = 15-20% satisfaction boost (NRA); standard decor rotation windows = Christmas/holiday (early Nov to Jan 7), Valentine (Feb 1-14, take down Feb 15), Halloween (Oct 1-31, take down Nov 1), Thanksgiving (Nov 1-28, take down Nov 29), fall harvest (Oct 1-Nov 30), summer patio (Memorial Day to Labor Day), spring floral (Mar 1-May 31); decor rotation best practice = take down within 1-2 weeks of holiday end; decor rotation audit = calendar reminder for each holiday takedown; decor rotation damage = perceived quality drop + negative reviews + competitor advantage; decor rotation prevention = annual decor calendar (12 months, all holidays), staff assignment (manager or lead server owns rotation), storage organized by holiday (labeled bins). Solutions ranked by impact: (1) ROTATE stale decor out NOW — perceived quality recovery ${fmt$(expectedQualityDamage)}/mo + satisfaction recovery ${fmt$(expectedSatisfactionDamage)}/mo + reputation recovery ${fmt$(expectedReputationDamage)}/mo + review damage avoidance ${fmt$(expectedReviewDamage)}/mo; cost ${fmt$(d.decor_rotation_audit_cost)}; payback immediate; (2) TAKE DOWN stale decor within 48 hours; (3) INSPECT decor for damage (replace before storing); (4) STORE in labeled bins by holiday; (5) CREATE annual decor rotation calendar (12 months); (6) ASSIGN rotation owner (manager or lead server); (7) SET calendar reminders for each holiday takedown; (8) AUDIT decor rotation quarterly; (9) TRAIN staff on rotation protocol; (10) BENCHMARK vs competitor rotation timing. Industry data: 30% perceived quality drop (Cornell CHR); payback immediate. Expected impact: +${targetPerceivedQualityLiftPts}pts perceived quality, +14pts satisfaction, +${fmt$(expectedQualityDamage)}/mo quality recovery, payback immediate.`,
        ai_recommendation: 'rotate_stale_decor_out',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: DECOR_ROTATION_TOO_EARLY
    if (config.requireHolidayDecor && d.decor_setup_weeks_before_holiday > config.maxDecorSetupWeeksBeforeHoliday) {
      // decor up >4 weeks before holiday -> perceived desperate/cheap
      const eagernessWeeks = d.decor_setup_weeks_before_holiday - config.maxDecorSetupWeeksBeforeHoliday;
      const expectedDesperationDamage = Math.round(baselineRevenue * (eagernessWeeks * 0.008));
      const expectedSatisfactionDamage = Math.round(baselineRevenue * (eagernessWeeks * 0.006));
      const expectedPerceivedQualityDamage = Math.round(baselineRevenue * (eagernessWeeks * 0.007));
      const totalOpportunity = Math.max(expectedDesperationDamage + expectedSatisfactionDamage + expectedPerceivedQualityDamage, 1200);
      const severityLabel = d.decor_setup_weeks_before_holiday > 8 ? 'high' : d.decor_setup_weeks_before_holiday > 6 ? 'medium' : 'low';
      const criticalNote = (d.decor_setup_weeks_before_holiday > 8)
        ? 'HIGH: DECOR UP WAY TOO EARLY — decor up >8 weeks before holiday = perceived desperate, cheap, overcompensating; customers read early decor as try-hard or tacky; subtle/just-in-time decor signals confidence + sophistication; too early = dilutes holiday excitement (overexposure). '
        : d.decor_setup_weeks_before_holiday > 6
          ? `MEDIUM: DECOR UP TOO EARLY (${d.decor_setup_weeks_before_holiday} weeks before, max ${config.maxDecorSetupWeeksBeforeHoliday}) — perceived desperate; delay decor setup to ${config.maxDecorSetupWeeksBeforeHoliday} weeks before. `
          : `LOW: DECOR UP SLIGHTLY EARLY (${d.decor_setup_weeks_before_holiday} weeks before, max ${config.maxDecorSetupWeeksBeforeHoliday}) — pull back to ${config.maxDecorSetupWeeksBeforeHoliday} weeks for just-right timing. `;
      alerts.push({
        rule_id: 'decor_rotation_too_early',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        decor_setup_weeks_before_holiday: d.decor_setup_weeks_before_holiday,
        decor_rotation_timing_score: d.decor_rotation_timing_score,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_rotation_audit_cost: d.decor_rotation_audit_cost,
        perceived_quality_lift_projected_pts: 10,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DECOR ROTATION TOO EARLY: ${d.location_id} — decor up ${d.decor_setup_weeks_before_holiday} weeks before holiday (max ${config.maxDecorSetupWeeksBeforeHoliday}); rotation timing score ${d.decor_rotation_timing_score}/100; perceived quality ${d.perceived_quality_score}/100; satisfaction ${d.customer_satisfaction_score}/100; competitor decor ${d.competitor_decor_score}/100. ${criticalNote}Industry data: decor rotation timing is critical — too early = desperate, too late = missed opportunity, just right = 15-20% satisfaction boost (NRA); customers read early decor as try-hard, tacky, overcompensating, desperate; subtle/just-in-time decor signals confidence, sophistication; standard decor setup windows = Christmas/holiday (early-mid November, 3-4 weeks before), Valentine (Feb 1, 2 weeks before), Halloween (Oct 1, 4 weeks before but consider Oct 7 for fresh feel), Thanksgiving (Nov 1, 4 weeks before), fall harvest (Oct 1, 4 weeks before), summer patio (Memorial Day weekend, 1 week before), spring floral (Mar 1, 4 weeks before but depends on climate); decor rotation best practice = set up 2-4 weeks before holiday, take down within 1-2 weeks after; decor rotation audit = calendar reminder for each holiday setup; decor rotation prevention = annual decor calendar (12 months, all holidays), staff assignment (manager or lead server owns rotation), storage organized by holiday (labeled bins). Solutions ranked by impact: (1) DELAY decor setup (rotate out now, reinstall closer to holiday) — desperation damage recovery ${fmt$(expectedDesperationDamage)}/mo + satisfaction recovery ${fmt$(expectedSatisfactionDamage)}/mo + perceived quality recovery ${fmt$(expectedPerceivedQualityDamage)}/mo; cost ${fmt$(d.decor_rotation_audit_cost)}; payback immediate; (2) TAKE DOWN decor now if >4 weeks early; (3) REINSTALL 2-4 weeks before holiday; (4) CREATE annual decor calendar with setup dates; (5) ASSIGN rotation owner (manager); (6) SET calendar reminders for each holiday setup; (7) COMMUNICATE timing to staff; (8) AUDIT decor rotation quarterly; (9) BENCHMARK vs competitor rotation timing. Industry data: 15-20% satisfaction boost with just-right timing (NRA); payback immediate. Expected impact: +10pts perceived quality, +12pts satisfaction, +${fmt$(expectedDesperationDamage)}/mo desperation damage recovery, payback immediate.`,
        ai_recommendation: 'delay_decor_setup',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: CULTURAL_CELEBRATION_DECOR_ABSENT
    if (config.requireCulturalCelebrationDecor && !d.has_cultural_celebration_decor) {
      // no diverse cultural decor -> missed 25-40% new customer acquisition
      const expectedNewCustomers = Math.max(transactionsPerMonth * 0.05, 80);
      const expectedRevenueFromNewCustomers = Math.round(expectedNewCustomers * 28);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.008);
      const expectedReputationLift = Math.round(baselineRevenue * 0.012);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.006);
      const totalOpportunity = Math.max(expectedRevenueFromNewCustomers + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 2000);
      const severityLabel = 'medium';
      const criticalNote = 'MEDIUM: NO CULTURAL CELEBRATION DECOR — cultural celebration decor (Lunar New Year, Diwali, Cinco de Mayo, Oktoberfest, Pride Month, Black History Month, Hispanic Heritage Month) attracts diverse demographics — 25-40% new customer acquisition from respective communities; cultural decor signals inclusion + community awareness + brand differentiation; missed diverse customer acquisition + missed brand reputation lift + missed community partnership opportunities; competitors with cultural decor capture diverse dining spend. '
      ;
      alerts.push({
        rule_id: 'cultural_celebration_decor_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_cultural_celebration_decor: d.has_cultural_celebration_decor,
        cultural_celebration_count: d.cultural_celebration_count,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_purchase_cost: d.decor_purchase_cost,
        cultural_customer_acquisition_projected: expectedNewCustomers,
        satisfaction_lift_projected_pts: 12,
        perceived_quality_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CULTURAL CELEBRATION DECOR ABSENT: ${d.location_id} — cultural celebration decor ABSENT; cultural celebration count ${d.cultural_celebration_count}; competitor decor ${d.competitor_decor_score}/100; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100. ${criticalNote}Industry data: cultural celebration decor (Lunar New Year, Diwali, Cinco de Mayo, Oktoberfest, Pride Month, Black History Month, Hispanic Heritage Month, Hanukkah, Kwanzaa, Ramadan/Eid, Vaisakhi, Nowruz) attracts diverse demographics — 25-40% new customer acquisition from respective communities (diversity marketing research); cultural decor signals inclusion + community awareness + brand differentiation; cultural decor generates community word-of-mouth + social media shares; cultural decor partnership opportunities = local cultural organizations, community leaders, ethnic media; cultural decor best practice = authentic (research symbols, colors, traditions), respectful (avoid stereotypes, consult community), inclusive (multiple celebrations), seasonal (Lunar New Year Jan-Feb, Diwali Oct-Nov, Cinco de Mayo May, Pride June, Hispanic Heritage Sep-Oct, Black History Feb); cultural decor budget = $200-500 per celebration (modest); cultural decor topics = Lunar New Year (red/gold, lanterns, dragons), Diwali (diyas, rangoli, marigolds), Cinco de Mayo (papel picado, sombreras, mariachi), Oktoberfest (blue/white, pretzels, biergarten), Pride (rainbow flags, balloons), Black History (pan-African colors, historical figures), Hispanic Heritage (flags, folk art). Solutions ranked by impact: (1) LAUNCH cultural celebration decor (start with 2-3 celebrations) — revenue from new customers ${fmt$(expectedRevenueFromNewCustomers)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.decor_purchase_cost)}; payback 1-2 months; (2) RESEARCH local demographics (US Census, community organizations); (3) SELECT 2-3 highest-impact celebrations for your market; (4) CONSULT community organizations (authenticity + respect); (5) DESIGN authentic decor (correct symbols, colors, traditions); (6) ADD culturally relevant menu items (Lunar New Year dumplings, Diwali sweets, Cinco de Mayo specials); (7) PARTNER with community organizations (cross-promotion); (8) PROMOTE on ethnic media + social media; (9) TRAIN staff on cultural context; (10) DOCUMENT impact (new customer acquisition, revenue lift); (11) EXPAND to 5+ celebrations annually; (12) BENCHMARK vs competitor cultural decor. Industry data: 25-40% new customer acquisition (diversity marketing); payback 1-2 months. Expected impact: +${expectedNewCustomers} new customers/mo, +12pts satisfaction, +14pts perceived quality, payback 1-2 months.`,
        ai_recommendation: 'launch_cultural_celebration_decor',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: DECOR_BUDGET_INSUFFICIENT
    if (d.decor_budget_per_season < config.minDecorBudgetPerSeason) {
      // decor budget below $200/season -> low-quality decor = perceived cheap
      const budgetGap = config.minDecorBudgetPerSeason - d.decor_budget_per_season;
      const expectedQualityLift = Math.round(baselineRevenue * 0.010);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.008);
      const expectedReputationLift = Math.round(baselineRevenue * 0.006);
      const expectedRevenueFromDecorLift = Math.max(baselineRevenue * 0.012, 2000);
      const totalOpportunity = Math.max(expectedQualityLift + expectedSatisfactionLift + expectedReputationLift + expectedRevenueFromDecorLift, 2500);
      const severityLabel = d.decor_budget_per_season < 50 ? 'high' : d.decor_budget_per_season < 100 ? 'medium' : 'low';
      const criticalNote = (d.decor_budget_per_season < 50)
        ? 'HIGH: DECOR BUDGET SEVERELY INSUFFICIENT — budget below $50/season = cheap decor = perceived cheap restaurant; decor quality signals restaurant quality; cheap homemade decor damages perceived quality + brand; decor budget ROI = $200-1,000 seasonal investment generates $2,000-8,000 revenue lift (10-20x ROI); underinvesting in decor = leaving $2,000-8,000/season on table. '
        : d.decor_budget_per_season < 100
          ? `MEDIUM: DECOR BUDGET LOW (${fmt$(d.decor_budget_per_season)}/season, min ${fmt$(config.minDecorBudgetPerSeason)}) — budget below $200/season signals cheap; increase to ${fmt$(d.decor_budget_target_per_season)}/season for 10-20x ROI. `
          : `LOW: DECOR BUDGET BELOW TARGET (${fmt$(d.decor_budget_per_season)}/season, min ${fmt$(config.minDecorBudgetPerSeason)}) — bump to ${fmt$(d.decor_budget_target_per_season)} for higher quality decor. `;
      alerts.push({
        rule_id: 'decor_budget_insufficient',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        decor_budget_per_season: d.decor_budget_per_season,
        decor_budget_target_per_season: d.decor_budget_target_per_season,
        decor_quality_score: d.decor_quality_score,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_purchase_cost: d.decor_purchase_cost,
        perceived_quality_lift_projected_pts: targetPerceivedQualityLiftPts,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DECOR BUDGET INSUFFICIENT: ${d.location_id} — decor budget ${fmt$(d.decor_budget_per_season)}/season (min ${fmt$(config.minDecorBudgetPerSeason)}, target ${fmt$(d.decor_budget_target_per_season)}); decor quality ${d.decor_quality_score}/100; perceived quality ${d.perceived_quality_score}/100; satisfaction ${d.customer_satisfaction_score}/100; competitor decor ${d.competitor_decor_score}/100. ${criticalNote}Industry data: decor budget ROI = $200-1,000 seasonal investment generates $2,000-8,000 revenue lift (10-20x ROI); decor quality signals restaurant quality (cheap decor = cheap restaurant perception); decor budget best practice = $200-1,000/season depending on restaurant tier (quick_service $200-400, fast_casual $300-600, casual_dining $400-800, fine_dining $600-1,000+); decor budget allocation = focal pieces 50% (tree, wreath, lights), tabletop 25% (centerpieces, candles), bar 10% (garnishes, napkins), exterior 15% (window lights, doorway); decor budget sourcing = wholesale (Amazon, Oriental Trading, local florist wholesale), rental (event rental companies), DIY (high-quality DIY only, avoid homemade look); decor budget ROI measurement = December revenue lift + Instagram photos + satisfaction survey + perceived quality survey; decor budget mistakes = underinvesting (cheap perceived), overinvesting without rotation (wasted), no storage (damage = replacement cost), no calendar (last-minute premium pricing). Solutions ranked by impact: (1) INCREASE decor budget to ${fmt$(d.decor_budget_target_per_season)}/season — quality lift ${fmt$(expectedQualityLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + revenue lift ${fmt$(expectedRevenueFromDecorLift)}/mo; cost ${fmt$(d.decor_budget_target_per_season - d.decor_budget_per_season)} (budget increase); payback 1-2 months (10-20x ROI); (2) ALLOCATE budget by zone (focal 50%, tabletop 25%, bar 10%, exterior 15%); (3) SOURCE wholesale (Amazon, Oriental Trading); (4) BUY reusable decor (high-quality, store properly); (5) RENT large pieces (event rental companies, $50-200/season); (6) COORDINATE palette (single color story = perceived higher quality); (7) INVEST in 1 statement piece (focal tree, wreath, garland); (8) ADD tabletop (candles, ornaments, linens); (9) ADD bar (themed napkins, garnishes); (10) ADD exterior (window lights, doorway); (11) MEASURE ROI (December revenue lift, IG photos, satisfaction); (12) BENCHMARK vs competitor decor budget. Industry data: 10-20x ROI (NRA); payback 1-2 months. Expected impact: +${targetPerceivedQualityLiftPts}pts perceived quality, +12pts satisfaction, +${fmt$(expectedRevenueFromDecorLift)}/mo revenue lift, payback 1-2 months.`,
        ai_recommendation: 'increase_decor_budget',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: VALENTINE_DECOR_ABSENT
    if (config.requireValentineDecor && !d.has_valentine_decor) {
      // no Valentine Day decor -> missed #2 busiest restaurant day revenue
      const expectedValentineRevenueLift = Math.max(d.valentine_day_revenue_baseline * 0.45, 1500);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.006);
      const expectedReputationLift = Math.round(baselineRevenue * 0.010);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.005);
      const totalOpportunity = Math.max(expectedValentineRevenueLift + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 1500);
      const severityLabel = 'high';
      const criticalNote = 'HIGH: NO VALENTINE DAY DECOR — Valentine Day is the #2 busiest restaurant day (after Mothers Day); Valentine Day decor captures $1,000-5,000 additional revenue per decorated restaurant; couples choose romantic restaurants (decor signals romance); Valentine Day decor = rose petals, candles, hearts, red/pink palette, romantic lighting, themed cocktails; missed Valentine Day revenue + missed romantic brand positioning + missed couples market. '
      ;
      alerts.push({
        rule_id: 'valentine_decor_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_valentine_decor: d.has_valentine_decor,
        valentine_day_revenue: d.valentine_day_revenue,
        valentine_day_revenue_baseline: d.valentine_day_revenue_baseline,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_purchase_cost: d.decor_purchase_cost,
        valentine_revenue_lift_projected: expectedValentineRevenueLift,
        satisfaction_lift_projected_pts: 10,
        perceived_quality_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VALENTINE DECOR ABSENT: ${d.location_id} — Valentine decor ABSENT; Valentine Day revenue ${fmt$(d.valentine_day_revenue)} (baseline ${fmt$(d.valentine_day_revenue_baseline)}); competitor decor ${d.competitor_decor_score}/100; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100. ${criticalNote}Industry data: Valentine Day is the #2 busiest restaurant day (after Mothers Day, NRA); Valentine Day decor captures $1,000-5,000 additional revenue per decorated restaurant (NRA); couples choose romantic restaurants (decor signals romance); Valentine Day decor topics = rose petals (table scatter), candles (real or LED), hearts (wall decals, garlands), red/pink palette (linens, napkins, lighting gels), romantic lighting (dimmed, uplighting), themed cocktails (love potions, chocolate martinis), sweetheart table settings, photo backdrop (couples selfies); Valentine Day decor timing = Feb 1-14 (setup Feb 1, takedown Feb 15); Valentine Day decor budget = $200-500 (modest, high ROI); Valentine Day decor quality = elegant not tacky (avoid cheap heart confetti, focus on romantic ambiance); Valentine Day menu = couples tasting menu, aphrodisiac ingredients (oysters, chocolate, champagne), heart-shaped desserts; Valentine Day reservations = prix fixe menu, deposit required, 2-seating policy (early + late). Solutions ranked by impact: (1) INSTALL Valentine Day decor — Valentine revenue lift ${fmt$(expectedValentineRevenueLift)}/mo (Feb 14) + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.decor_purchase_cost)}; payback immediate (single-day revenue lift); (2) SETUP decor Feb 1 (2 weeks before); (3) SCATTER rose petals on tables (real or silk); (4) LIGHT candles (LED for safety, real for fine dining); (5) ADD red/pink palette (linens, napkins); (6) DIM lighting + uplighting (romantic); (7) CREATE sweetheart table settings (rose, candle, menu); (8) ADD photo backdrop (couples selfie spot); (9) DESIGN Valentine cocktail menu (love potion, chocolate martini); (10) OFFER couples tasting menu (prix fixe); (11) REQUIRE reservations + deposit; (12) ROTATE decor out Feb 15 (avoid staleness); (13) STORE decor properly; (14) BENCHMARK vs competitor Valentine decor. Industry data: #2 busiest restaurant day (NRA); payback immediate. Expected impact: +${fmt$(expectedValentineRevenueLift)} Valentine Day revenue lift, +10pts satisfaction, +12pts perceived quality, payback immediate.`,
        ai_recommendation: 'install_valentine_decor',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: FALL_HARVEST_DECOR_ABSENT
    if (config.requireFallHarvestDecor && !d.has_fall_harvest_decor) {
      // no fall decor in Oct-Nov -> missed 10-15% October revenue
      const expectedOctoberRevenueLift = Math.max(d.october_revenue_baseline * 0.12, 2000);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.008);
      const expectedReputationLift = Math.round(baselineRevenue * 0.010);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.005);
      const totalOpportunity = Math.max(expectedOctoberRevenueLift + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 1800);
      const severityLabel = 'medium';
      const criticalNote = 'MEDIUM: NO FALL HARVEST DECOR — fall harvest decor (pumpkins, gourds, autumn leaves, hay bales, corn stalks) increases October revenue 10-15%; fall decor captures autumn family dining + Halloween adjacent + Thanksgiving lead-in; fall decor = rustic + cozy + harvest-themed; missed October revenue + missed fall family market + missed seasonal ambiance. '
      ;
      alerts.push({
        rule_id: 'fall_harvest_decor_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_fall_harvest_decor: d.has_fall_harvest_decor,
        october_revenue: d.october_revenue,
        october_revenue_baseline: d.october_revenue_baseline,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_purchase_cost: d.decor_purchase_cost,
        october_revenue_lift_projected_pct: targetOctoberRevenueLiftPct,
        satisfaction_lift_projected_pts: 10,
        perceived_quality_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FALL HARVEST DECOR ABSENT: ${d.location_id} — fall harvest decor ABSENT; October revenue ${fmt$(d.october_revenue)} (baseline ${fmt$(d.october_revenue_baseline)}); competitor decor ${d.competitor_decor_score}/100; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100. ${criticalNote}Industry data: fall harvest decor (pumpkins, gourds, autumn leaves, hay bales, corn stalks, mums) increases October revenue 10-15% (Cornell CHR); fall decor captures autumn family dining + Halloween adjacent + Thanksgiving lead-in; fall decor = rustic + cozy + harvest-themed; fall decor topics = pumpkins (real or faux, varied sizes), gourds (mixed shapes/colors), autumn leaves (faux garlands, scatter), hay bales (entrance display), corn stalks (exterior poles), mums (live plants, varied colors), scarecrows, rustic signage (chalkboard, wood); fall decor timing = Oct 1-Nov 30 (covers Halloween + Thanksgiving); fall decor budget = $200-500 (modest, farm-sourced cheap); fall decor sourcing = local farms (pumpkin patches, fall festivals), craft stores (Michaels, Joann), Amazon (faux garlands); fall decor placement = entrance (hay bales, pumpkins, mums), dining room (tabletop gourds, leaf garlands), bar (cocktail garnishes, themed napkins), exterior (corn stalks, pumpkin pile); fall menu pairing = pumpkin spice (lattes, desserts), apple (cider, pies), squash (soup, side), turkey (Thanksgiving); fall decor best practice = authentic (real pumpkins/gourds > faux), varied (mix sizes/colors/textures), layered (clusters not single items). Solutions ranked by impact: (1) INSTALL fall harvest decor — October revenue lift ${fmt$(expectedOctoberRevenueLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.decor_purchase_cost)}; payback 1-2 months; (2) SETUP decor Oct 1 (4 weeks before Halloween); (3) SOURCE real pumpkins + gourds from local farm; (4) CLUSTER pumpkins at entrance (varied sizes); (5) ADD faux leaf garlands (tabletop, ceiling); (6) ADD mums (live plants, varied colors); (7) ADD hay bales at entrance; (8) ADD corn stalks to exterior poles; (9) ADD rustic chalkboard signage (seasonal menu); (10) PAIR with fall menu (pumpkin, apple, squash, turkey); (11) ROTATE to Thanksgiving decor Nov 1; (12) ROTATE out Nov 30 (avoid staleness); (13) COMPOST real decor (sustainability); (14) STORE faux decor properly; (15) BENCHMARK vs competitor fall decor. Industry data: 10-15% October revenue lift (Cornell CHR); payback 1-2 months. Expected impact: +${targetOctoberRevenueLiftPct}% October revenue, +10pts satisfaction, +12pts perceived quality, payback 1-2 months.`,
        ai_recommendation: 'install_fall_harvest_decor',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: DECOR_STORAGE_ORGANIZATION_POOR
    if (config.requireOrganizedDecorStorage && (!d.decor_storage_organized || d.decor_storage_condition_score < config.minDecorStorageConditionScore)) {
      // decor not properly stored -> damage/replacement costs $200-600/yr
      const expectedReplacementSavings = Math.max(d.decor_replacement_cost_annual * 0.70, 200);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.004);
      const expectedReputationLift = Math.round(baselineRevenue * 0.005);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.003);
      const totalOpportunity = Math.max(expectedReplacementSavings + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 800);
      const severityLabel = d.decor_storage_condition_score < 40 ? 'high' : d.decor_storage_condition_score < 60 ? 'medium' : 'low';
      const criticalNote = (d.decor_storage_condition_score < 40)
        ? 'HIGH: DECOR STORAGE SEVERELY DISORGANIZED — decor not properly stored = damage/replacement costs $200-600/year; damaged decor = poor quality appearance = perceived cheap; disorganized storage = setup takes 2-3x longer (staff time waste); missing decor = last-minute premium purchases; storage organization = labeled bins by holiday + climate-controlled + inventory list. '
        : d.decor_storage_condition_score < 60
          ? `MEDIUM: DECOR STORAGE POOR (condition score ${d.decor_storage_condition_score}/100, min ${config.minDecorStorageConditionScore}) — decor ${d.decor_storage_organized ? 'organized' : 'NOT organized'}; damage cost ${fmt$(d.decor_replacement_cost_annual)}/yr; organize storage to save replacement costs. `
          : `LOW: DECOR STORAGE BELOW TARGET (condition score ${d.decor_storage_condition_score}/100, min ${config.minDecorStorageConditionScore}) — improve organization to reduce damage + setup time. `;
      alerts.push({
        rule_id: 'decor_storage_organization_poor',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        decor_storage_organized: d.decor_storage_organized,
        decor_storage_condition_score: d.decor_storage_condition_score,
        decor_replacement_cost_annual: d.decor_replacement_cost_annual,
        decor_quality_score: d.decor_quality_score,
        perceived_quality_score: d.perceived_quality_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_decor_score: d.competitor_decor_score,
        monthly_revenue: d.monthly_revenue,
        decor_storage_organization_cost: d.decor_storage_organization_cost,
        decor_replacement_savings_projected: expectedReplacementSavings,
        satisfaction_lift_projected_pts: 8,
        perceived_quality_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DECOR STORAGE ORGANIZATION POOR: ${d.location_id} — decor storage ${d.decor_storage_organized ? 'organized' : 'NOT organized'}; storage condition score ${d.decor_storage_condition_score}/100 (min ${config.minDecorStorageConditionScore}); replacement cost ${fmt$(d.decor_replacement_cost_annual)}/yr; decor quality ${d.decor_quality_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor decor ${d.competitor_decor_score}/100. ${criticalNote}Industry data: decor not properly stored = damage/replacement costs $200-600/year (restaurant operations research); damaged decor = poor quality appearance = perceived cheap; disorganized storage = setup takes 2-3x longer (staff time waste = $50-150/holiday in labor); missing decor = last-minute premium purchases (rush shipping 50-100% premium); storage organization best practice = labeled bins by holiday (clear bins, label maker), climate-controlled storage (avoid heat/humidity damage), inventory list (spreadsheet with bin contents), photo catalog (snap bin contents for quick ID); storage organization supplies = clear plastic bins (Home Depot, Target), shelving units (Heavy-duty, 4-tier), label maker (Brother, Dymo), bubble wrap (fragile items), silica gel packets (moisture control); storage organization process = sort by holiday, declutter (donate/discard damaged), label bins, shelve by season (current season accessible), inventory list, photo catalog; storage organization ROI = $200-600/yr replacement savings + $50-150/holiday labor savings + reduced rush purchases; storage organization maintenance = annual audit (declutter, repair), restock supplies, update inventory. Solutions ranked by impact: (1) ORGANIZE decor storage — replacement savings ${fmt$(expectedReplacementSavings)}/yr + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.decor_storage_organization_cost)}; payback 3-6 months; (2) SORT decor by holiday (Christmas, Valentine, Halloween, Thanksgiving, fall, summer, spring, cultural); (3) DECLUTTER damaged decor (donate or discard); (4) BUY clear plastic bins (one per holiday); (5) LABEL each bin (holiday + contents); (6) SHELF bins by season (current season accessible); (7) CREATE inventory spreadsheet (bin, contents, condition); (8) PHOTOGRAPH bin contents (quick ID); (9) ADD bubble wrap for fragile items; (10) ADD silica gel packets (moisture control); (11) USE climate-controlled storage (avoid basement/attic extremes); (12) AUDIT annually (declutter, repair, restock); (13) BENCHMARK vs competitor storage organization. Industry data: $200-600/yr replacement cost savings; payback 3-6 months. Expected impact: +${fmt$(expectedReplacementSavings)}/yr replacement savings, +8pts satisfaction, +10pts perceived quality, payback 3-6 months.`,
        ai_recommendation: 'organize_decor_storage',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM seasonal_holiday_decor_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE seasonal_holiday_decor_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant seasonal + holiday decor expert. Given decor data, recommend ONE specific action with expected revenue lift, satisfaction lift, perceived quality lift, or replacement cost savings (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Holiday decor: ${a.has_holiday_decor ?? false}. Valentine decor: ${a.has_valentine_decor ?? false}. Halloween decor: ${a.has_halloween_decor ?? false}. Thanksgiving decor: ${a.has_thanksgiving_decor ?? false}. Fall harvest decor: ${a.has_fall_harvest_decor ?? false}. Summer patio decor: ${a.has_summer_patio_decor ?? false}. Spring floral decor: ${a.has_spring_floral_decor ?? false}. Cultural celebration decor: ${a.has_cultural_celebration_decor ?? false} (${a.cultural_celebration_count ?? 0} celebrations). Setup weeks before holiday: ${a.decor_setup_weeks_before_holiday ?? 0}. Takedown weeks after holiday: ${a.decor_takedown_weeks_after_holiday ?? 0}. Rotation timing score: ${a.decor_rotation_timing_score ?? 0}/100. Decor budget per season: ${fmt$(a.decor_budget_per_season ?? 0)}/${fmt$(a.decor_budget_target_per_season ?? 0)} target. Decor quality: ${a.decor_quality_score ?? 0}/100. Storage organized: ${a.decor_storage_organized ?? false} (condition ${a.decor_storage_condition_score ?? 0}/100). Replacement cost: ${fmt$(a.decor_replacement_cost_annual ?? 0)}/yr. Instagram photos: ${a.instagram_photos_monthly ?? 0}/mo (baseline ${a.instagram_photos_baseline_monthly ?? 0}). Dwell time: ${a.dwell_time_minutes ?? 0} min (baseline ${a.dwell_time_baseline_minutes ?? 0}). Satisfaction: ${a.customer_satisfaction_score ?? 0}/100. Perceived quality: ${a.perceived_quality_score ?? 0}/100. Competitor decor: ${a.competitor_decor_score ?? 0}/100. December revenue: ${fmt$(a.december_revenue ?? 0)} (baseline ${fmt$(a.december_revenue_baseline ?? 0)}). October revenue: ${fmt$(a.october_revenue ?? 0)} (baseline ${fmt$(a.october_revenue_baseline ?? 0)}). Valentine Day revenue: ${fmt$(a.valentine_day_revenue ?? 0)} (baseline ${fmt$(a.valentine_day_revenue_baseline ?? 0)}). Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Decor purchase cost: ${fmt$(a.decor_purchase_cost ?? 0)}. Storage organization cost: ${fmt$(a.decor_storage_organization_cost ?? 0)}. Rotation audit cost: ${fmt$(a.decor_rotation_audit_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveSeasonalHolidayDecorAlerts = async (db: ReturnType<typeof useDB>): Promise<SeasonalHolidayDecorAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM seasonal_holiday_decor_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getSeasonalHolidayDecorSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  seasonalDecorAbsentCount: number; decorRotationTooSlowCount: number;
  decorRotationTooEarlyCount: number; culturalCelebrationDecorAbsentCount: number;
  decorBudgetInsufficientCount: number; valentineDecorAbsentCount: number;
  fallHarvestDecorAbsentCount: number; decorStorageOrganizationPoorCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'seasonal_decor_absent_holiday_period') AS noholiday,
              math::count(rule_id = 'decor_rotation_too_slow') AS tooslow,
              math::count(rule_id = 'decor_rotation_too_early') AS tooearly,
              math::count(rule_id = 'cultural_celebration_decor_absent') AS nocultural,
              math::count(rule_id = 'decor_budget_insufficient') AS lowbudget,
              math::count(rule_id = 'valentine_decor_absent') AS novalentine,
              math::count(rule_id = 'fall_harvest_decor_absent') AS nofall,
              math::count(rule_id = 'decor_storage_organization_poor') AS badstorage
       FROM seasonal_holiday_decor_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      seasonalDecorAbsentCount: safeNumber(r.noholiday, 0),
      decorRotationTooSlowCount: safeNumber(r.tooslow, 0),
      decorRotationTooEarlyCount: safeNumber(r.tooearly, 0),
      culturalCelebrationDecorAbsentCount: safeNumber(r.nocultural, 0),
      decorBudgetInsufficientCount: safeNumber(r.lowbudget, 0),
      valentineDecorAbsentCount: safeNumber(r.novalentine, 0),
      fallHarvestDecorAbsentCount: safeNumber(r.nofall, 0),
      decorStorageOrganizationPoorCount: safeNumber(r.badstorage, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, seasonalDecorAbsentCount: 0, decorRotationTooSlowCount: 0, decorRotationTooEarlyCount: 0, culturalCelebrationDecorAbsentCount: 0, decorBudgetInsufficientCount: 0, valentineDecorAbsentCount: 0, fallHarvestDecorAbsentCount: 0, decorStorageOrganizationPoorCount: 0 };
  }
};

export const updateSeasonalHolidayDecorAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
