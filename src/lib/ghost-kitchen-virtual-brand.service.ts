/**
 * AI Ghost Kitchen & Virtual Brand Optimizer — predicts how ghost kitchen
 * strategy (virtual brand portfolio, kitchen utilization, delivery platform
 * optimization, multi-brand operations, menu engineering for delivery,
 * cross-brand prep efficiency, ghost kitchen ROI tracking, market expansion,
 * quality consistency) impacts revenue, profit margins, market reach,
 * operational efficiency.
 *
 * Ghost kitchen market = $50B+ by 2030 (Allied Market Research). Ghost
 * kitchens reduce overhead 50-70% vs traditional restaurants (no dining
 * room, no front-of-house staff, smaller footprint). Virtual brands can
 * launch in 2-4 weeks vs 6-12 months for traditional restaurants. Kitchen
 * utilization reaches 60-80% with multi-brand operations vs 30-40% single-
 * brand. Average ghost kitchen revenue $200k-1M/year per kitchen. Virtual
 * brand profit margins 15-25% vs 3-9% traditional restaurants. 35% of
 * restaurants operate virtual brands (NRA 2024). Cross-brand prep efficiency
 * (shared ingredients, shared equipment) reduces food cost 10-15%. Delivery-
 * only brands avoid dine-in health inspections (faster launch, lower
 * compliance overhead). Ghost kitchen failure rate 30-40% (poor menu,
 * poor platform optimization, poor location, poor quality consistency).
 * Delivery platform fees (Uber Eats 15-30%, DoorDash 15-30%, Grubhub 15-25%)
 * can be optimized with hybrid models (own ordering + marketplace). 60% of
 * ghost kitchen orders come from delivery apps (vs 40% direct). Ghost
 * kitchens enable market expansion without real estate investment ($50k-200k
 * vs $500k-2M traditional). Virtual brand portfolio of 3-5 brands per
 * kitchen maximizes revenue per square foot. Menu engineering for delivery
 * (travel time, temperature, packaging) reduces complaints 40-60%.
 *
 * 203rd POSR-exclusive differentiator. Distinct from:
 *   - delivery-analytics.service — ANALYZES delivery performance (times,
 *     errors). This optimizer focuses on GHOST KITCHEN + VIRTUAL BRAND
 *     strategy (portfolio, utilization, multi-brand ops).
 *   - delivery-route.service — optimizes ROUTES. This optimizer optimizes
 *     the KITCHEN + BRAND strategy for delivery-only.
 *   - delivery-zone-optimizer.service — optimizes delivery ZONES. This
 *     optimizer optimizes virtual brand PORTFOLIO + kitchen utilization.
 *   - takeout-packaging-container.service — optimizes PACKAGING. This
 *     optimizer optimizes the ghost kitchen BUSINESS MODEL.
 *   - catering-optimizer.service — optimizes CATERING (events). This
 *     optimizer focuses on delivery-only VIRTUAL BRANDS.
 *   - private-event-space.service — optimizes PHYSICAL event space. Ghost
 *     kitchens have NO physical dine-in space.
 *   - menu-optimization.service — BCG matrix for dine-in. This optimizer
 *     optimizes menus for DELIVERY specifically (travel time, temperature).
 *   - branch-comparison.service — compares PHYSICAL branches. This optimizer
 *     compares VIRTUAL brands.
 *   - multi-location-benchmark.service — benchmarks PHYSICAL locations. This
 *     optimizer benchmarks ghost kitchen virtual brands.
 *
 * 8 AI rules:
 *   1. ghost_kitchen_strategy_absent -> no ghost kitchen/virtual brand -> missed 50-70% overhead reduction
 *   2. virtual_brand_portfolio_thin -> <2 virtual brands -> missed kitchen utilization (60-80% vs 30-40%)
 *   3. delivery_platform_optimization_absent -> no delivery platform optimization -> missed visibility + high fees
 *   4. cross_brand_prep_efficiency_absent -> no shared ingredients/equipment -> missed 10-15% food cost reduction
 *   5. virtual_brand_menu_delivery_unoptimized -> menus not optimized for delivery -> poor reviews + complaints
 *   6. ghost_kitchen_roi_tracking_absent -> no ROI tracking per virtual brand -> can't optimize portfolio
 *   7. virtual_brand_market_expansion_absent -> no market expansion via virtual brands -> missed geographic reach
 *   8. ghost_kitchen_quality_consistency_absent -> quality consistency across brands poor -> negative reviews + churn
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type GhostKitchenRuleId =
  | 'ghost_kitchen_strategy_absent'
  | 'virtual_brand_portfolio_thin'
  | 'delivery_platform_optimization_absent'
  | 'cross_brand_prep_efficiency_absent'
  | 'virtual_brand_menu_delivery_unoptimized'
  | 'ghost_kitchen_roi_tracking_absent'
  | 'virtual_brand_market_expansion_absent'
  | 'ghost_kitchen_quality_consistency_absent';

export type GhostKitchenAiRec =
  | 'launch_ghost_kitchen'
  | 'expand_virtual_brand_portfolio'
  | 'optimize_delivery_platforms'
  | 'implement_cross_brand_prep'
  | 'optimize_menus_for_delivery'
  | 'implement_roi_tracking'
  | 'expand_to_new_markets'
  | 'standardize_quality_across_brands'
  | 'monitor'
  | 'skip';

export interface GhostKitchenAlert {
  id?: string;
  rule_id: GhostKitchenRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'kitchen_1' | 'kitchen_2' | 'brand_a' | 'brand_b'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'delivery' | 'takeout' | 'mixed'
  // Ghost kitchen presence
  has_ghost_kitchen_strategy?: boolean;                    // active ghost kitchen/virtual brand strategy present
  ghost_kitchen_count?: number;                            // number of ghost kitchen locations
  virtual_brand_count?: number;                            // number of virtual brands operated
  virtual_brand_target_count?: number;                     // recommended virtual brand count
  // Kitchen utilization
  kitchen_utilization_pct?: number;                        // % kitchen capacity utilized
  kitchen_utilization_target_pct?: number;                 // target utilization
  kitchen_sqft?: number;                                   // kitchen square footage
  revenue_per_sqft?: number;                               // revenue per square foot
  // Delivery platform optimization
  has_delivery_platform_optimization?: boolean;            // delivery platform optimization present
  delivery_platforms_count?: number;                       // number of delivery platforms active
  delivery_platform_fees_pct?: number;                     // avg delivery platform fees %
  delivery_platform_fee_target_pct?: number;               // target fees (negotiated/hybrid)
  direct_order_pct?: number;                               // % of orders direct (not via apps)
  direct_order_target_pct?: number;                        // target direct order %
  // Cross-brand prep efficiency
  has_cross_brand_prep_efficiency?: boolean;               // shared ingredients/equipment across brands
  shared_ingredients_pct?: number;                         // % ingredients shared across brands
  shared_equipment_pct?: number;                           // % equipment shared across brands
  food_cost_pct?: number;                                  // food cost % of revenue
  food_cost_target_pct?: number;                           // target food cost %
  // Menu delivery optimization
  has_delivery_optimized_menus?: boolean;                  // menus optimized for delivery
  delivery_complaint_rate_pct?: number;                    // % delivery complaints (cold, soggy, wrong)
  delivery_complaint_target_pct?: number;                  // target complaint rate
  travel_time_optimized_minutes?: number;                  // max travel time for menu items
  // ROI tracking
  has_ghost_kitchen_roi_tracking?: boolean;                // ROI tracking per virtual brand
  ghost_kitchen_revenue_monthly?: number;                  // monthly ghost kitchen revenue
  ghost_kitchen_profit_margin_pct?: number;                // ghost kitchen profit margin %
  ghost_kitchen_profit_margin_target_pct?: number;         // target profit margin
  ghost_kitchen_investment?: number;                       // ghost kitchen investment cost
  // Market expansion
  has_virtual_brand_market_expansion?: boolean;            // virtual brand market expansion present
  markets_served_count?: number;                           // number of markets/neighborhoods served
  markets_target_count?: number;                           // target markets
  virtual_brand_reach_potential?: number;                  // potential reach (households in delivery range)
  // Quality consistency
  has_quality_consistency_program?: boolean;               // quality consistency across brands
  quality_consistency_score?: number;                      // 0-100 quality consistency
  avg_brand_rating?: number;                               // avg rating across virtual brands
  avg_brand_rating_target?: number;                        // target rating
  cross_brand_complaint_pct?: number;                      // % complaints about consistency
  // Revenue + costs
  ghost_kitchen_revenue_growth_pct?: number;               // YoY revenue growth
  traditional_revenue_baseline?: number;                   // traditional restaurant revenue baseline
  competitor_ghost_kitchen_score?: number;                 // 0-100 competitor ghost kitchen presence
  monthly_revenue?: number;                                // total restaurant monthly revenue
  // Costs
  ghost_kitchen_operating_cost_monthly?: number;           // ghost kitchen monthly operating cost
  virtual_brand_launch_cost?: number;                      // cost to launch one virtual brand
  delivery_platform_cost_monthly?: number;                 // monthly delivery platform fees
  // Impact projections
  overhead_reduction_projected_pct?: number;
  kitchen_utilization_lift_projected_pct?: number;
  food_cost_reduction_projected_pct?: number;
  delivery_complaint_reduction_projected_pct?: number;
  profit_margin_lift_projected_pts?: number;
  market_expansion_revenue_projected?: number;
  quality_rating_lift_projected_pts?: number;
  revenue_growth_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: GhostKitchenAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface GhostKitchenConfig {
  aiEnabled: boolean;
  requireGhostKitchenStrategy: boolean;                    // require ghost kitchen/virtual brand strategy
  requireDeliveryPlatformOptimization: boolean;            // require delivery platform optimization
  requireCrossBrandPrepEfficiency: boolean;                // require cross-brand prep efficiency
  requireDeliveryOptimizedMenus: boolean;                  // require delivery-optimized menus
  requireGhostKitchenRoiTracking: boolean;                 // require ROI tracking per virtual brand
  requireVirtualBrandMarketExpansion: boolean;             // require market expansion via virtual brands
  requireQualityConsistencyProgram: boolean;               // require quality consistency program
  minVirtualBrandCount: number;                            // min virtual brands per kitchen (3)
  minKitchenUtilizationPct: number;                        // min kitchen utilization (65%)
  minSharedIngredientsPct: number;                         // min shared ingredients (40%)
  maxDeliveryComplaintRatePct: number;                     // max delivery complaint rate (8%)
  minDirectOrderPct: number;                               // min direct orders (30%)
  minGhostKitchenProfitMarginPct: number;                  // min ghost kitchen profit margin (18%)
  minQualityConsistencyScore: number;                      // min quality consistency (80)
  minAvgBrandRating: number;                               // min avg brand rating (4.3)
  preferCompetitorParity: boolean;                         // match competitor ghost kitchen presence
}

export const DEFAULT_GHOST_KITCHEN_CONFIG: GhostKitchenConfig = {
  aiEnabled: true,
  requireGhostKitchenStrategy: true,
  requireDeliveryPlatformOptimization: true,
  requireCrossBrandPrepEfficiency: true,
  requireDeliveryOptimizedMenus: true,
  requireGhostKitchenRoiTracking: true,
  requireVirtualBrandMarketExpansion: true,
  requireQualityConsistencyProgram: true,
  minVirtualBrandCount: 3,
  minKitchenUtilizationPct: 65,
  minSharedIngredientsPct: 40,
  maxDeliveryComplaintRatePct: 8,
  minDirectOrderPct: 30,
  minGhostKitchenProfitMarginPct: 18,
  minQualityConsistencyScore: 80,
  minAvgBrandRating: 4.3,
  preferCompetitorParity: true,
};

export const readGhostKitchenConfig = (settings: any): GhostKitchenConfig => ({
  aiEnabled: settings?.ghost_kitchen_ai_enabled ?? true,
  requireGhostKitchenStrategy: settings?.ghost_kitchen_require_strategy ?? true,
  requireDeliveryPlatformOptimization: settings?.ghost_kitchen_require_platform ?? true,
  requireCrossBrandPrepEfficiency: settings?.ghost_kitchen_require_cross_brand ?? true,
  requireDeliveryOptimizedMenus: settings?.ghost_kitchen_require_delivery_menu ?? true,
  requireGhostKitchenRoiTracking: settings?.ghost_kitchen_require_roi ?? true,
  requireVirtualBrandMarketExpansion: settings?.ghost_kitchen_require_expansion ?? true,
  requireQualityConsistencyProgram: settings?.ghost_kitchen_require_quality ?? true,
  minVirtualBrandCount: safeNumber(settings?.ghost_kitchen_min_brands, 3),
  minKitchenUtilizationPct: safeNumber(settings?.ghost_kitchen_min_utilization, 65),
  minSharedIngredientsPct: safeNumber(settings?.ghost_kitchen_min_shared_ingredients, 40),
  maxDeliveryComplaintRatePct: safeNumber(settings?.ghost_kitchen_max_complaints, 8),
  minDirectOrderPct: safeNumber(settings?.ghost_kitchen_min_direct, 30),
  minGhostKitchenProfitMarginPct: safeNumber(settings?.ghost_kitchen_min_margin, 18),
  minQualityConsistencyScore: safeNumber(settings?.ghost_kitchen_min_quality, 80),
  minAvgBrandRating: safeNumber(settings?.ghost_kitchen_min_rating, 4.3),
  preferCompetitorParity: settings?.ghost_kitchen_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface GhostKitchenData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_ghost_kitchen_strategy: boolean;
  ghost_kitchen_count: number;
  virtual_brand_count: number;
  virtual_brand_target_count: number;
  kitchen_utilization_pct: number;
  kitchen_utilization_target_pct: number;
  kitchen_sqft: number;
  revenue_per_sqft: number;
  has_delivery_platform_optimization: boolean;
  delivery_platforms_count: number;
  delivery_platform_fees_pct: number;
  delivery_platform_fee_target_pct: number;
  direct_order_pct: number;
  direct_order_target_pct: number;
  has_cross_brand_prep_efficiency: boolean;
  shared_ingredients_pct: number;
  shared_equipment_pct: number;
  food_cost_pct: number;
  food_cost_target_pct: number;
  has_delivery_optimized_menus: boolean;
  delivery_complaint_rate_pct: number;
  delivery_complaint_target_pct: number;
  travel_time_optimized_minutes: number;
  has_ghost_kitchen_roi_tracking: boolean;
  ghost_kitchen_revenue_monthly: number;
  ghost_kitchen_profit_margin_pct: number;
  ghost_kitchen_profit_margin_target_pct: number;
  ghost_kitchen_investment: number;
  has_virtual_brand_market_expansion: boolean;
  markets_served_count: number;
  markets_target_count: number;
  virtual_brand_reach_potential: number;
  has_quality_consistency_program: boolean;
  quality_consistency_score: number;
  avg_brand_rating: number;
  avg_brand_rating_target: number;
  cross_brand_complaint_pct: number;
  ghost_kitchen_revenue_growth_pct: number;
  traditional_revenue_baseline: number;
  competitor_ghost_kitchen_score: number;
  monthly_revenue: number;
  ghost_kitchen_operating_cost_monthly: number;
  virtual_brand_launch_cost: number;
  delivery_platform_cost_monthly: number;
}

const MOCK_DATA: GhostKitchenData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_ghost_kitchen_strategy: false, ghost_kitchen_count: 0,
    virtual_brand_count: 0, virtual_brand_target_count: 4,
    kitchen_utilization_pct: 32, kitchen_utilization_target_pct: 70,
    kitchen_sqft: 1200, revenue_per_sqft: 42,
    has_delivery_platform_optimization: false, delivery_platforms_count: 1,
    delivery_platform_fees_pct: 28, delivery_platform_fee_target_pct: 18,
    direct_order_pct: 8, direct_order_target_pct: 35,
    has_cross_brand_prep_efficiency: false, shared_ingredients_pct: 12,
    shared_equipment_pct: 20, food_cost_pct: 34, food_cost_target_pct: 28,
    has_delivery_optimized_menus: false, delivery_complaint_rate_pct: 18,
    delivery_complaint_target_pct: 6, travel_time_optimized_minutes: 0,
    has_ghost_kitchen_roi_tracking: false, ghost_kitchen_revenue_monthly: 0,
    ghost_kitchen_profit_margin_pct: 0, ghost_kitchen_profit_margin_target_pct: 20,
    ghost_kitchen_investment: 0,
    has_virtual_brand_market_expansion: false, markets_served_count: 1,
    markets_target_count: 4, virtual_brand_reach_potential: 0,
    has_quality_consistency_program: false, quality_consistency_score: 42,
    avg_brand_rating: 0, avg_brand_rating_target: 4.3,
    cross_brand_complaint_pct: 0,
    ghost_kitchen_revenue_growth_pct: 0,
    traditional_revenue_baseline: 68000, competitor_ghost_kitchen_score: 58,
    monthly_revenue: 68000,
    ghost_kitchen_operating_cost_monthly: 0, virtual_brand_launch_cost: 0,
    delivery_platform_cost_monthly: 2400,
  },
  {
    location_id: 'kitchen_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'delivery',
    has_ghost_kitchen_strategy: true, ghost_kitchen_count: 1,
    virtual_brand_count: 2, virtual_brand_target_count: 4,
    kitchen_utilization_pct: 48, kitchen_utilization_target_pct: 70,
    kitchen_sqft: 800, revenue_per_sqft: 78,
    has_delivery_platform_optimization: false, delivery_platforms_count: 3,
    delivery_platform_fees_pct: 25, delivery_platform_fee_target_pct: 18,
    direct_order_pct: 18, direct_order_target_pct: 35,
    has_cross_brand_prep_efficiency: false, shared_ingredients_pct: 28,
    shared_equipment_pct: 40, food_cost_pct: 31, food_cost_target_pct: 28,
    has_delivery_optimized_menus: false, delivery_complaint_rate_pct: 14,
    delivery_complaint_target_pct: 6, travel_time_optimized_minutes: 25,
    has_ghost_kitchen_roi_tracking: false, ghost_kitchen_revenue_monthly: 42000,
    ghost_kitchen_profit_margin_pct: 14, ghost_kitchen_profit_margin_target_pct: 20,
    ghost_kitchen_investment: 85000,
    has_virtual_brand_market_expansion: false, markets_served_count: 2,
    markets_target_count: 4, virtual_brand_reach_potential: 28000,
    has_quality_consistency_program: false, quality_consistency_score: 62,
    avg_brand_rating: 4.0, avg_brand_rating_target: 4.3,
    cross_brand_complaint_pct: 12,
    ghost_kitchen_revenue_growth_pct: 22,
    traditional_revenue_baseline: 52000, competitor_ghost_kitchen_score: 72,
    monthly_revenue: 94000,
    ghost_kitchen_operating_cost_monthly: 18000, virtual_brand_launch_cost: 12000,
    delivery_platform_cost_monthly: 4800,
  },
  {
    location_id: 'kitchen_2', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'delivery',
    has_ghost_kitchen_strategy: true, ghost_kitchen_count: 2,
    virtual_brand_count: 4, virtual_brand_target_count: 4,
    kitchen_utilization_pct: 72, kitchen_utilization_target_pct: 70,
    kitchen_sqft: 900, revenue_per_sqft: 128,
    has_delivery_platform_optimization: true, delivery_platforms_count: 4,
    delivery_platform_fees_pct: 19, delivery_platform_fee_target_pct: 18,
    direct_order_pct: 38, direct_order_target_pct: 35,
    has_cross_brand_prep_efficiency: true, shared_ingredients_pct: 52,
    shared_equipment_pct: 68, food_cost_pct: 28, food_cost_target_pct: 28,
    has_delivery_optimized_menus: true, delivery_complaint_rate_pct: 6,
    delivery_complaint_target_pct: 6, travel_time_optimized_minutes: 30,
    has_ghost_kitchen_roi_tracking: true, ghost_kitchen_revenue_monthly: 96000,
    ghost_kitchen_profit_margin_pct: 21, ghost_kitchen_profit_margin_target_pct: 20,
    ghost_kitchen_investment: 180000,
    has_virtual_brand_market_expansion: true, markets_served_count: 5,
    markets_target_count: 4, virtual_brand_reach_potential: 62000,
    has_quality_consistency_program: true, quality_consistency_score: 84,
    avg_brand_rating: 4.4, avg_brand_rating_target: 4.3,
    cross_brand_complaint_pct: 5,
    ghost_kitchen_revenue_growth_pct: 42,
    traditional_revenue_baseline: 48000, competitor_ghost_kitchen_score: 78,
    monthly_revenue: 144000,
    ghost_kitchen_operating_cost_monthly: 32000, virtual_brand_launch_cost: 10000,
    delivery_platform_cost_monthly: 5400,
  },
  {
    location_id: 'brand_a', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'delivery',
    has_ghost_kitchen_strategy: true, ghost_kitchen_count: 3,
    virtual_brand_count: 6, virtual_brand_target_count: 5,
    kitchen_utilization_pct: 82, kitchen_utilization_target_pct: 75,
    kitchen_sqft: 1100, revenue_per_sqft: 168,
    has_delivery_platform_optimization: true, delivery_platforms_count: 5,
    delivery_platform_fees_pct: 17, delivery_platform_fee_target_pct: 18,
    direct_order_pct: 44, direct_order_target_pct: 35,
    has_cross_brand_prep_efficiency: true, shared_ingredients_pct: 62,
    shared_equipment_pct: 78, food_cost_pct: 26, food_cost_target_pct: 28,
    has_delivery_optimized_menus: true, delivery_complaint_rate_pct: 4,
    delivery_complaint_target_pct: 6, travel_time_optimized_minutes: 32,
    has_ghost_kitchen_roi_tracking: true, ghost_kitchen_revenue_monthly: 184000,
    ghost_kitchen_profit_margin_pct: 24, ghost_kitchen_profit_margin_target_pct: 20,
    ghost_kitchen_investment: 280000,
    has_virtual_brand_market_expansion: true, markets_served_count: 8,
    markets_target_count: 5, virtual_brand_reach_potential: 95000,
    has_quality_consistency_program: true, quality_consistency_score: 92,
    avg_brand_rating: 4.6, avg_brand_rating_target: 4.3,
    cross_brand_complaint_pct: 3,
    ghost_kitchen_revenue_growth_pct: 58,
    traditional_revenue_baseline: 52000, competitor_ghost_kitchen_score: 84,
    monthly_revenue: 236000,
    ghost_kitchen_operating_cost_monthly: 48000, virtual_brand_launch_cost: 9000,
    delivery_platform_cost_monthly: 6800,
  },
];

export const runGhostKitchenEngine = async (
  db: ReturnType<typeof useDB>,
  config: GhostKitchenConfig,
): Promise<{ alerts: GhostKitchenAlert[]; generated: number }> => {
  const alerts: GhostKitchenAlert[] = [];
  const now = new Date();

  let data: GhostKitchenData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_ghost_kitchen_strategy, ghost_kitchen_count,
              virtual_brand_count, virtual_brand_target_count,
              kitchen_utilization_pct, kitchen_utilization_target_pct,
              kitchen_sqft, revenue_per_sqft,
              has_delivery_platform_optimization, delivery_platforms_count,
              delivery_platform_fees_pct, delivery_platform_fee_target_pct,
              direct_order_pct, direct_order_target_pct,
              has_cross_brand_prep_efficiency, shared_ingredients_pct,
              shared_equipment_pct, food_cost_pct, food_cost_target_pct,
              has_delivery_optimized_menus, delivery_complaint_rate_pct,
              delivery_complaint_target_pct, travel_time_optimized_minutes,
              has_ghost_kitchen_roi_tracking, ghost_kitchen_revenue_monthly,
              ghost_kitchen_profit_margin_pct, ghost_kitchen_profit_margin_target_pct,
              ghost_kitchen_investment,
              has_virtual_brand_market_expansion, markets_served_count,
              markets_target_count, virtual_brand_reach_potential,
              has_quality_consistency_program, quality_consistency_score,
              avg_brand_rating, avg_brand_rating_target,
              cross_brand_complaint_pct,
              ghost_kitchen_revenue_growth_pct,
              traditional_revenue_baseline, competitor_ghost_kitchen_score,
              monthly_revenue,
              ghost_kitchen_operating_cost_monthly, virtual_brand_launch_cost,
              delivery_platform_cost_monthly
       FROM ghost_kitchen_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): GhostKitchenData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_ghost_kitchen_strategy: Boolean(r.has_ghost_kitchen_strategy ?? false),
      ghost_kitchen_count: safeNumber(r.ghost_kitchen_count, 0),
      virtual_brand_count: safeNumber(r.virtual_brand_count, 0),
      virtual_brand_target_count: safeNumber(r.virtual_brand_target_count, 0),
      kitchen_utilization_pct: safeNumber(r.kitchen_utilization_pct, 0),
      kitchen_utilization_target_pct: safeNumber(r.kitchen_utilization_target_pct, 70),
      kitchen_sqft: safeNumber(r.kitchen_sqft, 0),
      revenue_per_sqft: safeNumber(r.revenue_per_sqft, 0),
      has_delivery_platform_optimization: Boolean(r.has_delivery_platform_optimization ?? false),
      delivery_platforms_count: safeNumber(r.delivery_platforms_count, 0),
      delivery_platform_fees_pct: safeNumber(r.delivery_platform_fees_pct, 0),
      delivery_platform_fee_target_pct: safeNumber(r.delivery_platform_fee_target_pct, 0),
      direct_order_pct: safeNumber(r.direct_order_pct, 0),
      direct_order_target_pct: safeNumber(r.direct_order_target_pct, 0),
      has_cross_brand_prep_efficiency: Boolean(r.has_cross_brand_prep_efficiency ?? false),
      shared_ingredients_pct: safeNumber(r.shared_ingredients_pct, 0),
      shared_equipment_pct: safeNumber(r.shared_equipment_pct, 0),
      food_cost_pct: safeNumber(r.food_cost_pct, 0),
      food_cost_target_pct: safeNumber(r.food_cost_target_pct, 0),
      has_delivery_optimized_menus: Boolean(r.has_delivery_optimized_menus ?? false),
      delivery_complaint_rate_pct: safeNumber(r.delivery_complaint_rate_pct, 0),
      delivery_complaint_target_pct: safeNumber(r.delivery_complaint_target_pct, 0),
      travel_time_optimized_minutes: safeNumber(r.travel_time_optimized_minutes, 0),
      has_ghost_kitchen_roi_tracking: Boolean(r.has_ghost_kitchen_roi_tracking ?? false),
      ghost_kitchen_revenue_monthly: safeNumber(r.ghost_kitchen_revenue_monthly, 0),
      ghost_kitchen_profit_margin_pct: safeNumber(r.ghost_kitchen_profit_margin_pct, 0),
      ghost_kitchen_profit_margin_target_pct: safeNumber(r.ghost_kitchen_profit_margin_target_pct, 0),
      ghost_kitchen_investment: safeNumber(r.ghost_kitchen_investment, 0),
      has_virtual_brand_market_expansion: Boolean(r.has_virtual_brand_market_expansion ?? false),
      markets_served_count: safeNumber(r.markets_served_count, 0),
      markets_target_count: safeNumber(r.markets_target_count, 0),
      virtual_brand_reach_potential: safeNumber(r.virtual_brand_reach_potential, 0),
      has_quality_consistency_program: Boolean(r.has_quality_consistency_program ?? false),
      quality_consistency_score: safeNumber(r.quality_consistency_score, 0),
      avg_brand_rating: safeNumber(r.avg_brand_rating, 0),
      avg_brand_rating_target: safeNumber(r.avg_brand_rating_target, 4.3),
      cross_brand_complaint_pct: safeNumber(r.cross_brand_complaint_pct, 0),
      ghost_kitchen_revenue_growth_pct: safeNumber(r.ghost_kitchen_revenue_growth_pct, 0),
      traditional_revenue_baseline: safeNumber(r.traditional_revenue_baseline, 0),
      competitor_ghost_kitchen_score: safeNumber(r.competitor_ghost_kitchen_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      ghost_kitchen_operating_cost_monthly: safeNumber(r.ghost_kitchen_operating_cost_monthly, 0),
      virtual_brand_launch_cost: safeNumber(r.virtual_brand_launch_cost, 0),
      delivery_platform_cost_monthly: safeNumber(r.delivery_platform_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetOverheadReductionPct = 60;
    const targetKitchenUtilLiftPct = 35;
    const targetFoodCostReductionPct = 8;
    const targetDeliveryComplaintReductionPct = 60;
    const targetProfitMarginLiftPts = 8;
    const targetMarketExpansionRevenue = Math.max(baselineRevenue * 0.25, 15000);
    const targetQualityRatingLiftPts = 3;

    // Rule 1: GHOST_KITCHEN_STRATEGY_ABSENT
    if (config.requireGhostKitchenStrategy && !d.has_ghost_kitchen_strategy) {
      // no ghost kitchen/virtual brand -> missed 50-70% overhead reduction
      const expectedOverheadReduction = Math.round(d.traditional_revenue_baseline * 0.18);
      const expectedRevenueFromVirtual = Math.round(baselineRevenue * 0.35);
      const expectedMarketReach = Math.round(baselineRevenue * 0.12);
      const expectedMarginImprovement = Math.round(baselineRevenue * 0.08);
      const totalOpportunity = Math.max(expectedOverheadReduction + expectedRevenueFromVirtual + expectedMarketReach + expectedMarginImprovement, 4500);
      const severityLabel = d.competitor_ghost_kitchen_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_ghost_kitchen_score > 65)
        ? 'CRITICAL: NO GHOST KITCHEN STRATEGY — competitor ghost kitchen score ' + d.competitor_ghost_kitchen_score + '/100 (high); ghost kitchens reduce overhead 50-70% vs traditional (no dining room, no front-of-house staff); ghost kitchen market = $50B+ by 2030 (Allied Market Research); 35% of restaurants operate virtual brands (NRA 2024); missing ghost kitchen = missed overhead reduction + missed virtual brand revenue + missed market expansion; competitors with ghost kitchens capture delivery-only market. '
        : `HIGH: NO GHOST KITCHEN STRATEGY — ghost kitchens reduce overhead 50-70% vs traditional; market = $50B+ by 2030 (Allied Market Research); 35% of restaurants operate virtual brands (NRA); missing virtual brand revenue + market expansion. `;
      alerts.push({
        rule_id: 'ghost_kitchen_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ghost_kitchen_strategy: d.has_ghost_kitchen_strategy,
        ghost_kitchen_count: d.ghost_kitchen_count,
        virtual_brand_count: d.virtual_brand_count,
        virtual_brand_target_count: d.virtual_brand_target_count,
        kitchen_utilization_pct: d.kitchen_utilization_pct,
        kitchen_utilization_target_pct: d.kitchen_utilization_target_pct,
        kitchen_sqft: d.kitchen_sqft,
        revenue_per_sqft: d.revenue_per_sqft,
        competitor_ghost_kitchen_score: d.competitor_ghost_kitchen_score,
        traditional_revenue_baseline: d.traditional_revenue_baseline,
        monthly_revenue: d.monthly_revenue,
        ghost_kitchen_operating_cost_monthly: d.ghost_kitchen_operating_cost_monthly,
        virtual_brand_launch_cost: d.virtual_brand_launch_cost,
        overhead_reduction_projected_pct: targetOverheadReductionPct,
        revenue_growth_projected_pct: 35,
        profit_margin_lift_projected_pts: 8,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `GHOST KITCHEN STRATEGY ABSENT: ${d.location_id} — ghost kitchen strategy ABSENT; ghost kitchens 0; virtual brands 0 (target ${d.virtual_brand_target_count}); kitchen utilization ${d.kitchen_utilization_pct}% (target ${d.kitchen_utilization_target_pct}%); revenue/sqft ${fmt$(d.revenue_per_sqft)}; competitor ghost kitchen score ${d.competitor_ghost_kitchen_score}/100; traditional revenue baseline ${fmt$(d.traditional_revenue_baseline)}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: ghost kitchens reduce overhead 50-70% vs traditional restaurants (no dining room, no front-of-house staff, smaller footprint); ghost kitchen market = $50B+ by 2030 (Allied Market Research); 35% of restaurants operate virtual brands (NRA 2024); virtual brands can launch in 2-4 weeks vs 6-12 months for traditional restaurants; average ghost kitchen revenue $200k-1M/year per kitchen; virtual brand profit margins 15-25% vs 3-9% traditional restaurants; ghost kitchen investment $50k-200k vs $500k-2M traditional restaurant; ghost kitchens enable market expansion without real estate investment; ghost kitchens avoid dine-in health inspections (faster launch, lower compliance); ghost kitchen failure rate 30-40% (poor menu, poor platform optimization, poor location, poor quality); ghost kitchen types = dedicated ghost kitchen (standalone), shared/commissary kitchen (rented), restaurant-as-ghost-kitchen (existing kitchen + virtual brands). Solutions ranked by impact: (1) LAUNCH ghost kitchen strategy — overhead reduction ${fmt$(expectedOverheadReduction)}/mo + revenue from virtual brands ${fmt$(expectedRevenueFromVirtual)}/mo + market reach ${fmt$(expectedMarketReach)}/mo + margin improvement ${fmt$(expectedMarginImprovement)}/mo; cost ${fmt$(d.virtual_brand_launch_cost * 3)}/mo amortized (3 virtual brands); payback 3-6 months; (2) DECIDE ghost kitchen type = dedicated (standalone $100k-200k), shared/commissary ($2k-5k/mo rent), or restaurant-as-ghost-kitchen (use existing kitchen $0-15k setup); (3) IDENTIFY virtual brand concepts (cuisine gaps in delivery area, e.g., vegan, Korean, wings, birria); (4) LAUNCH 3 virtual brands (cuisine gaps + shared ingredients); (5) REGISTER on delivery platforms (Uber Eats, DoorDash, Grubhub, Postmates); (6) DESIGN delivery-optimized menus (travel time, temperature, packaging); (7) IMPLEMENT cross-brand prep efficiency (shared ingredients, shared equipment); (8) BUILD direct ordering channel (own website/app, 0% commission); (9) TRACK ROI per virtual brand (revenue, margin, complaint rate); (10) EXPAND to new markets (additional ghost kitchens or shared kitchens); (11) STANDARDIZE quality across brands (SOPs, training, audits); (12) BENCHMARK vs competitor ghost kitchen presence. Industry data: 50-70% overhead reduction; $50B+ market by 2030; 35% operate virtual brands (NRA); payback 3-6 months. Expected impact: +${targetOverheadReductionPct}% overhead reduction, +35% revenue growth, +8pts profit margin, payback 3-6 months.`,
        ai_recommendation: 'launch_ghost_kitchen',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: VIRTUAL_BRAND_PORTFOLIO_THIN
    if (d.has_ghost_kitchen_strategy && d.virtual_brand_count < config.minVirtualBrandCount) {
      // <2 virtual brands -> missed kitchen utilization (60-80% vs 30-40%)
      const brandGap = Math.max(config.minVirtualBrandCount - d.virtual_brand_count, 0);
      const expectedUtilLift = Math.round(baselineRevenue * 0.15);
      const expectedRevenueFromNewBrands = Math.round(brandGap * 12000);
      const expectedMarginLift = Math.round(baselineRevenue * 0.05);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.04);
      const totalOpportunity = Math.max(expectedUtilLift + expectedRevenueFromNewBrands + expectedMarginLift + expectedCompetitiveLift, 3000);
      const severityLabel = d.virtual_brand_count < 2 ? 'high' : 'medium';
      const criticalNote = (d.virtual_brand_count < 2)
        ? `HIGH: VIRTUAL BRAND PORTFOLIO THIN — ${d.virtual_brand_count} brand(s) (min ${config.minVirtualBrandCount}); kitchen utilization ${d.kitchen_utilization_pct}% (target ${d.kitchen_utilization_target_pct}%); multi-brand operations reach 60-80% utilization vs 30-40% single-brand; ${brandGap} more brands needed; missing brands = underutilized kitchen + missed revenue. `
        : `MEDIUM: VIRTUAL BRAND PORTFOLIO BELOW TARGET — ${d.virtual_brand_count} brands (min ${config.minVirtualBrandCount}); add ${brandGap} more for 60-80% utilization. `;
      alerts.push({
        rule_id: 'virtual_brand_portfolio_thin',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ghost_kitchen_strategy: d.has_ghost_kitchen_strategy,
        ghost_kitchen_count: d.ghost_kitchen_count,
        virtual_brand_count: d.virtual_brand_count,
        virtual_brand_target_count: d.virtual_brand_target_count,
        kitchen_utilization_pct: d.kitchen_utilization_pct,
        kitchen_utilization_target_pct: d.kitchen_utilization_target_pct,
        kitchen_sqft: d.kitchen_sqft,
        revenue_per_sqft: d.revenue_per_sqft,
        ghost_kitchen_revenue_monthly: d.ghost_kitchen_revenue_monthly,
        ghost_kitchen_profit_margin_pct: d.ghost_kitchen_profit_margin_pct,
        competitor_ghost_kitchen_score: d.competitor_ghost_kitchen_score,
        monthly_revenue: d.monthly_revenue,
        virtual_brand_launch_cost: d.virtual_brand_launch_cost,
        kitchen_utilization_lift_projected_pct: targetKitchenUtilLiftPct,
        revenue_growth_projected_pct: 25,
        profit_margin_lift_projected_pts: 5,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VIRTUAL BRAND PORTFOLIO THIN: ${d.location_id} — ${d.virtual_brand_count} virtual brand(s) (min ${config.minVirtualBrandCount}); kitchen utilization ${d.kitchen_utilization_pct}% (target ${d.kitchen_utilization_target_pct}%); kitchen ${d.kitchen_sqft}sqft; revenue/sqft ${fmt$(d.revenue_per_sqft)}; ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo; profit margin ${d.ghost_kitchen_profit_margin_pct}%; competitor ghost kitchen ${d.competitor_ghost_kitchen_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: kitchen utilization reaches 60-80% with multi-brand operations vs 30-40% single-brand (ghost kitchen utilization study); multi-brand portfolio of 3-5 brands per kitchen maximizes revenue per square foot; each additional virtual brand adds $8k-15k/month revenue (cuisine gap filling); cross-brand prep efficiency (shared ingredients, shared equipment) reduces food cost 10-15%; virtual brand launch cost $8k-15k (menu development, photography, platform setup, initial marketing); virtual brand launch time 2-4 weeks (vs 6-12 months traditional); virtual brand selection criteria = cuisine gap in delivery area, shared ingredients with existing brands, high demand + low competition, delivery-friendly food (travel time, temperature, packaging); virtual brand portfolio examples = burger brand + wings brand + salad brand (shared proteins, shared fryer, shared prep), taco brand + burrito brand + bowl brand (shared ingredients, shared equipment), pizza brand + pasta brand + wings brand (shared oven, shared ingredients). Solutions ranked by impact: (1) EXPAND virtual brand portfolio by ${brandGap} brands — utilization lift ${fmt$(expectedUtilLift)}/mo + revenue from new brands ${fmt$(expectedRevenueFromNewBrands)}/mo + margin lift ${fmt$(expectedMarginLift)}/mo + competitive lift ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.virtual_brand_launch_cost * brandGap)} launch; payback 1-2 months; (2) ANALYZE delivery area cuisine gaps (search Uber Eats, DoorDash for underserved cuisines); (3) IDENTIFY ${brandGap} virtual brand concepts (cuisine gap + shared ingredients); (4) ENSURE shared ingredients with existing brands (cross-brand prep efficiency); (5) ENSURE shared equipment (fryer, oven, grill, prep stations); (6) DEVELOP delivery-optimized menus (travel time, temperature, packaging); (7) CREATE brand identity (name, logo, menu design, photography); (8) REGISTER on delivery platforms (Uber Eats, DoorDash, Grubhub); (9) LAUNCH with initial marketing ($500-1,500/brand); (10) TRACK performance per brand (revenue, margin, complaint rate); (11) REPLACE underperforming brands quarterly; (12) SCALE top performers; (13) BENCHMARK vs competitor virtual brand portfolio. Industry data: 60-80% utilization with multi-brand vs 30-40% single-brand; $8k-15k/brand/month revenue; payback 1-2 months. Expected impact: +${targetKitchenUtilLiftPct}% kitchen utilization, +25% revenue growth, +5pts profit margin, payback 1-2 months.`,
        ai_recommendation: 'expand_virtual_brand_portfolio',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: DELIVERY_PLATFORM_OPTIMIZATION_ABSENT
    if (config.requireDeliveryPlatformOptimization && (!d.has_delivery_platform_optimization || d.delivery_platform_fees_pct > d.delivery_platform_fee_target_pct || d.direct_order_pct < config.minDirectOrderPct)) {
      // no delivery platform optimization -> missed visibility + high fees
      const feeGap = Math.max(d.delivery_platform_fees_pct - d.delivery_platform_fee_target_pct, 0);
      const expectedFeeSavings = Math.round(d.delivery_platform_cost_monthly * (feeGap / Math.max(d.delivery_platform_fees_pct, 1)));
      const expectedDirectOrderLift = Math.round(d.ghost_kitchen_revenue_monthly * 0.12);
      const expectedVisibilityLift = Math.round(baselineRevenue * 0.06);
      const expectedConversionLift = Math.round(baselineRevenue * 0.04);
      const totalOpportunity = Math.max(expectedFeeSavings + expectedDirectOrderLift + expectedVisibilityLift + expectedConversionLift, 2200);
      const severityLabel = d.delivery_platform_fees_pct > 25 ? 'high' : 'medium';
      const criticalNote = (d.delivery_platform_fees_pct > 25)
        ? `HIGH: NO DELIVERY PLATFORM OPTIMIZATION — platform fees ${d.delivery_platform_fees_pct}% (target ${d.delivery_platform_fee_target_pct}%); direct orders ${d.direct_order_pct}% (min ${config.minDirectOrderPct}%); delivery platform fees (Uber Eats 15-30%, DoorDash 15-30%, Grubhub 15-25%) can be optimized with hybrid model (own ordering + marketplace); high fees erode margins; low direct orders = over-reliance on apps. `
        : `MEDIUM: DELIVERY PLATFORM OPTIMIZATION BELOW TARGET — fees ${d.delivery_platform_fees_pct}% (target ${d.delivery_platform_fee_target_pct}%); direct orders ${d.direct_order_pct}% (min ${config.minDirectOrderPct}%); optimize for fee reduction + direct order growth. `;
      alerts.push({
        rule_id: 'delivery_platform_optimization_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_delivery_platform_optimization: d.has_delivery_platform_optimization,
        delivery_platforms_count: d.delivery_platforms_count,
        delivery_platform_fees_pct: d.delivery_platform_fees_pct,
        delivery_platform_fee_target_pct: d.delivery_platform_fee_target_pct,
        direct_order_pct: d.direct_order_pct,
        direct_order_target_pct: d.direct_order_target_pct,
        ghost_kitchen_revenue_monthly: d.ghost_kitchen_revenue_monthly,
        delivery_platform_cost_monthly: d.delivery_platform_cost_monthly,
        monthly_revenue: d.monthly_revenue,
        delivery_complaint_reduction_projected_pct: 25,
        profit_margin_lift_projected_pts: 6,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DELIVERY PLATFORM OPTIMIZATION ABSENT: ${d.location_id} — platform optimization ${d.has_delivery_platform_optimization ? 'present' : 'ABSENT'}; platforms ${d.delivery_platforms_count}; fees ${d.delivery_platform_fees_pct}% (target ${d.delivery_platform_fee_target_pct}%); direct orders ${d.direct_order_pct}% (min ${config.minDirectOrderPct}%, target ${d.direct_order_target_pct}%); ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo; platform cost ${fmt$(d.delivery_platform_cost_monthly)}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: delivery platform fees (Uber Eats 15-30%, DoorDash 15-30%, Grubhub 15-25%) can be optimized with hybrid model (own ordering + marketplace); 60% of ghost kitchen orders come from delivery apps vs 40% direct (industry average); direct ordering channel (own website/app) has 0% commission vs 15-30% on apps; direct order target = 30-45% (reduce platform dependency); platform fee optimization = negotiate rates (volume discounts), use own delivery fleet for nearby orders, promote direct ordering (discounts, loyalty), hybrid model (marketplace for discovery + direct for repeat); platform optimization best practice = list on 4-5 platforms (max visibility), negotiate rates (volume discounts 2-5%), promote direct ordering (10-15% discount on direct orders), use own delivery for nearby (3-5km), use apps for farther (5-10km); direct ordering platforms = Own Website (Shopify, WooCommerce, custom), Loyalty App (Stamp Me, Loyalzoo), Direct Ordering Service (ChowNow, OrderDirect, Slice). Solutions ranked by impact: (1) OPTIMIZE delivery platforms — fee savings ${fmt$(expectedFeeSavings)}/mo + direct order lift ${fmt$(expectedDirectOrderLift)}/mo + visibility lift ${fmt$(expectedVisibilityLift)}/mo + conversion lift ${fmt$(expectedConversionLift)}/mo; cost ${fmt$(200)}/mo (direct ordering platform); payback <1 month; (2) LIST on 4-5 delivery platforms (Uber Eats, DoorDash, Grubhub, Postmates, regional); (3) NEGOTIATE platform rates (volume discounts 2-5% for high-volume); (4) BUILD direct ordering channel (own website/app — ChowNow, OrderDirect, Slice, custom); (5) PROMOTE direct ordering (10-15% discount on direct orders, loyalty points); (6) USE own delivery fleet for nearby (3-5km, 0% commission); (7) USE apps for farther (5-10km, pay commission); (8) OPTIMIZE platform listings (high-quality photos, SEO keywords, menu descriptions); (9) MANAGE platform reviews (respond within 24h); (10) TRACK performance per platform (revenue, fees, complaint rate); (11) SHIFT budget to highest-ROI platform; (12) BENCHMARK vs competitor platform optimization. Industry data: 15-30% platform fees; 0% direct; 30-45% direct order target; payback <1 month. Expected impact: +6pts profit margin, +25% complaint reduction, +${fmt$(expectedFeeSavings)}/mo fee savings, payback <1 month.`,
        ai_recommendation: 'optimize_delivery_platforms',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: CROSS_BRAND_PREP_EFFICIENCY_ABSENT
    if (config.requireCrossBrandPrepEfficiency && (!d.has_cross_brand_prep_efficiency || d.shared_ingredients_pct < config.minSharedIngredientsPct)) {
      // no shared ingredients/equipment -> missed 10-15% food cost reduction
      const sharedGap = Math.max(config.minSharedIngredientsPct - d.shared_ingredients_pct, 0);
      const expectedFoodCostReduction = Math.round(baselineRevenue * (d.food_cost_pct - d.food_cost_target_pct) / 100);
      const expectedLaborEfficiency = Math.round(baselineRevenue * 0.03);
      const expectedInventoryReduction = Math.round(baselineRevenue * 0.02);
      const expectedWasteReduction = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedFoodCostReduction + expectedLaborEfficiency + expectedInventoryReduction + expectedWasteReduction, 1800);
      const severityLabel = d.shared_ingredients_pct < 25 ? 'high' : 'medium';
      const criticalNote = (d.shared_ingredients_pct < 25)
        ? `HIGH: NO CROSS-BRAND PREP EFFICIENCY — shared ingredients ${d.shared_ingredients_pct}% (min ${config.minSharedIngredientsPct}%); shared equipment ${d.shared_equipment_pct}%; food cost ${d.food_cost_pct}% (target ${d.food_cost_target_pct}%); cross-brand prep efficiency (shared ingredients, shared equipment) reduces food cost 10-15%; missing efficiency = higher food cost + more waste + more inventory. `
        : `MEDIUM: CROSS-BRAND PREP EFFICIENCY BELOW TARGET — shared ingredients ${d.shared_ingredients_pct}% (min ${config.minSharedIngredientsPct}%); improve for 10-15% food cost reduction. `;
      alerts.push({
        rule_id: 'cross_brand_prep_efficiency_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_cross_brand_prep_efficiency: d.has_cross_brand_prep_efficiency,
        shared_ingredients_pct: d.shared_ingredients_pct,
        shared_equipment_pct: d.shared_equipment_pct,
        food_cost_pct: d.food_cost_pct,
        food_cost_target_pct: d.food_cost_target_pct,
        virtual_brand_count: d.virtual_brand_count,
        ghost_kitchen_revenue_monthly: d.ghost_kitchen_revenue_monthly,
        monthly_revenue: d.monthly_revenue,
        food_cost_reduction_projected_pct: targetFoodCostReductionPct,
        profit_margin_lift_projected_pts: 5,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CROSS-BRAND PREP EFFICIENCY ABSENT: ${d.location_id} — cross-brand prep efficiency ${d.has_cross_brand_prep_efficiency ? 'present' : 'ABSENT'}; shared ingredients ${d.shared_ingredients_pct}% (min ${config.minSharedIngredientsPct}%); shared equipment ${d.shared_equipment_pct}%; food cost ${d.food_cost_pct}% (target ${d.food_cost_target_pct}%); virtual brands ${d.virtual_brand_count}; ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: cross-brand prep efficiency (shared ingredients, shared equipment) reduces food cost 10-15% (bulk purchasing, less waste, less inventory); shared ingredients enable bulk purchasing (5-10% volume discounts); shared equipment reduces equipment investment ($10k-30k savings per kitchen); shared prep stations reduce labor (15-20% efficiency gain); shared inventory reduces waste (fewer spoilage, better rotation); cross-brand prep best practice = design virtual brands around shared ingredients (proteins, sauces, bases), shared equipment (fryer, oven, grill, prep stations), shared prep (batch cooking, portioning); cross-brand prep examples = burger brand + wings brand + salad brand (shared proteins, shared fryer, shared prep), taco brand + burrito brand + bowl brand (shared ingredients, shared equipment), pizza brand + pasta brand + wings brand (shared oven, shared ingredients); cross-brand prep efficiency target = 40-60% shared ingredients, 60-80% shared equipment. Solutions ranked by impact: (1) IMPLEMENT cross-brand prep efficiency — food cost reduction ${fmt$(expectedFoodCostReduction)}/mo + labor efficiency ${fmt$(expectedLaborEfficiency)}/mo + inventory reduction ${fmt$(expectedInventoryReduction)}/mo + waste reduction ${fmt$(expectedWasteReduction)}/mo; cost minimal (process change); payback immediate; (2) AUDIT current virtual brand menus (identify shared ingredient opportunities); (3) REDESIGN menus for shared ingredients (proteins, sauces, bases, garnishes); (4) CONSOLIDATE suppliers (bulk purchasing for shared ingredients, 5-10% volume discounts); (5) SHARE equipment across brands (fryer, oven, grill, prep stations); (6) BATCH cook shared ingredients (proteins, sauces, bases); (7) PORTION shared ingredients across brands; (8) CONSOLIDATE inventory (less spoilage, better rotation); (9) CROSS-TRAIN staff on multiple brands (labor efficiency); (10) TRACK shared ingredients % (target 40-60%); (11) TRACK shared equipment % (target 60-80%); (12) TRACK food cost % (target ${d.food_cost_target_pct}%); (13) BENCHMARK vs competitor cross-brand prep. Industry data: 10-15% food cost reduction; 5-10% bulk purchasing discounts; payback immediate. Expected impact: +${targetFoodCostReductionPct}% food cost reduction, +5pts profit margin, payback immediate.`,
        ai_recommendation: 'implement_cross_brand_prep',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: VIRTUAL_BRAND_MENU_DELIVERY_UNOPTIMIZED
    if (config.requireDeliveryOptimizedMenus && (!d.has_delivery_optimized_menus || d.delivery_complaint_rate_pct > config.maxDeliveryComplaintRatePct)) {
      // menus not optimized for delivery -> poor reviews + complaints
      const complaintGap = Math.max(d.delivery_complaint_rate_pct - config.maxDeliveryComplaintRatePct, 0);
      const expectedComplaintReduction = Math.round(baselineRevenue * (complaintGap / 100) * 3);
      const expectedReviewLift = Math.round(baselineRevenue * 0.04);
      const expectedRetentionLift = Math.round(baselineRevenue * 0.05);
      const expectedCompReduction = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedComplaintReduction + expectedReviewLift + expectedRetentionLift + expectedCompReduction, 1600);
      const severityLabel = d.delivery_complaint_rate_pct > 15 ? 'high' : 'medium';
      const criticalNote = (d.delivery_complaint_rate_pct > 15)
        ? `HIGH: MENUS NOT DELIVERY-OPTIMIZED — complaint rate ${d.delivery_complaint_rate_pct}% (max ${config.maxDeliveryComplaintRatePct}%); delivery-optimized menus reduce complaints 40-60%; menu engineering for delivery (travel time, temperature, packaging) prevents cold/soggy/wrong food; high complaints = poor reviews + churn + comps. `
        : `MEDIUM: DELIVERY COMPLAINT RATE ABOVE TARGET — ${d.delivery_complaint_rate_pct}% (max ${config.maxDeliveryComplaintRatePct}%); optimize menus for delivery to reduce complaints 40-60%. `;
      alerts.push({
        rule_id: 'virtual_brand_menu_delivery_unoptimized',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_delivery_optimized_menus: d.has_delivery_optimized_menus,
        delivery_complaint_rate_pct: d.delivery_complaint_rate_pct,
        delivery_complaint_target_pct: d.delivery_complaint_target_pct,
        travel_time_optimized_minutes: d.travel_time_optimized_minutes,
        virtual_brand_count: d.virtual_brand_count,
        avg_brand_rating: d.avg_brand_rating,
        ghost_kitchen_revenue_monthly: d.ghost_kitchen_revenue_monthly,
        monthly_revenue: d.monthly_revenue,
        delivery_complaint_reduction_projected_pct: targetDeliveryComplaintReductionPct,
        quality_rating_lift_projected_pts: 2,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VIRTUAL BRAND MENU DELIVERY UNOPTIMIZED: ${d.location_id} — delivery-optimized menus ${d.has_delivery_optimized_menus ? 'present' : 'ABSENT'}; complaint rate ${d.delivery_complaint_rate_pct}% (max ${config.maxDeliveryComplaintRatePct}%, target ${d.delivery_complaint_target_pct}%); travel time optimized ${d.travel_time_optimized_minutes}min; virtual brands ${d.virtual_brand_count}; avg brand rating ${d.avg_brand_rating}/5; ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: delivery-optimized menus reduce complaints 40-60% (menu engineering for delivery study); menu engineering for delivery = travel time (max 30min), temperature (hot food hot, cold food cold), packaging (leak-proof, vented, insulated), portion size (smaller for delivery, less sogginess); delivery complaint types = cold food (35%), soggy food (25%), wrong order (20%), missing items (15%), poor packaging (5%); delivery menu best practice = avoid travel-sensitive items (fried foods get soggy, ice cream melts, delicate greens wilt), design for travel time (max 30min), use insulated packaging (hot food), use vented packaging (fried food), use leak-proof containers (soups, sauces), portion for delivery (smaller, less sogginess), include reheating instructions; delivery menu optimization reduces comps 40-60%, improves ratings 0.3-0.5 stars, increases repeat orders 15-25%. Solutions ranked by impact: (1) OPTIMIZE menus for delivery — complaint reduction ${fmt$(expectedComplaintReduction)}/mo + review lift ${fmt$(expectedReviewLift)}/mo + retention lift ${fmt$(expectedRetentionLift)}/mo + comp reduction ${fmt$(expectedCompReduction)}/mo; cost ${fmt$(500)}/mo (packaging + menu redesign); payback 1 month; (2) AUDIT current menu for delivery issues (travel-sensitive items, temperature, packaging); (3) REMOVE travel-sensitive items (fried foods get soggy, ice cream melts, delicate greens wilt); (4) DESIGN for travel time (max 30min delivery radius); (5) USE insulated packaging for hot food ($0.50-1.50/container); (6) USE vented packaging for fried food (prevents sogginess); (7) USE leak-proof containers for soups/sauces; (8) PORTION for delivery (smaller, less sogginess); (9) INCLUDE reheating instructions (improves experience); (10) TEST delivery quality (order own food, taste after 30min); (11) TRACK complaint rate (target ${config.maxDeliveryComplaintRatePct}%); (12) TRACK ratings per brand (target 4.3+); (13) BENCHMARK vs competitor delivery quality. Industry data: 40-60% complaint reduction; 0.3-0.5 star rating lift; payback 1 month. Expected impact: +${targetDeliveryComplaintReductionPct}% complaint reduction, +2pts rating, payback 1 month.`,
        ai_recommendation: 'optimize_menus_for_delivery',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: GHOST_KITCHEN_ROI_TRACKING_ABSENT
    if (config.requireGhostKitchenRoiTracking && d.has_ghost_kitchen_strategy && !d.has_ghost_kitchen_roi_tracking) {
      // no ROI tracking per virtual brand -> can't optimize portfolio
      const expectedRoiRecovery = Math.round(d.ghost_kitchen_revenue_monthly * 0.15);
      const expectedPortfolioOptimization = Math.round(d.ghost_kitchen_revenue_monthly * 0.10);
      const expectedWastedSpendRecovery = Math.round(d.ghost_kitchen_operating_cost_monthly * 0.20);
      const expectedMarginLift = Math.round(d.ghost_kitchen_revenue_monthly * 0.08);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedPortfolioOptimization + expectedWastedSpendRecovery + expectedMarginLift, 1200);
      const severityLabel = d.ghost_kitchen_revenue_monthly > 50000 ? 'medium' : 'low';
      const criticalNote = (d.ghost_kitchen_revenue_monthly > 50000)
        ? `MEDIUM: NO GHOST KITCHEN ROI TRACKING — ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo but no ROI tracking per virtual brand; without tracking, can't identify which brands drive revenue = wasted 15-20% of operating cost; ROI tracking = revenue per brand, margin per brand, complaint rate per brand, ROAS per brand. `
        : `LOW: NO GHOST KITCHEN ROI TRACKING — implement tracking to optimize virtual brand portfolio. `;
      alerts.push({
        rule_id: 'ghost_kitchen_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ghost_kitchen_roi_tracking: d.has_ghost_kitchen_roi_tracking,
        ghost_kitchen_revenue_monthly: d.ghost_kitchen_revenue_monthly,
        ghost_kitchen_profit_margin_pct: d.ghost_kitchen_profit_margin_pct,
        ghost_kitchen_investment: d.ghost_kitchen_investment,
        virtual_brand_count: d.virtual_brand_count,
        ghost_kitchen_operating_cost_monthly: d.ghost_kitchen_operating_cost_monthly,
        monthly_revenue: d.monthly_revenue,
        profit_margin_lift_projected_pts: 5,
        revenue_growth_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `GHOST KITCHEN ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_ghost_kitchen_roi_tracking ? 'present' : 'ABSENT'}; ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo; profit margin ${d.ghost_kitchen_profit_margin_pct}%; investment ${fmt$(d.ghost_kitchen_investment)}; virtual brands ${d.virtual_brand_count}; operating cost ${fmt$(d.ghost_kitchen_operating_cost_monthly)}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without ROI tracking, ghost kitchens waste 15-20% of operating cost on underperforming brands; ghost kitchen ROI tracking = revenue per brand, margin per brand, complaint rate per brand, ROAS per brand, customer acquisition cost per brand; ROI tracking tools = POS with brand-level reporting (Toast, Square, Lightspeed), delivery platform dashboards (Uber Eats Manager, DoorDash Merchant), spreadsheets (manual), dedicated ghost kitchen platforms (CloudKitchens, Kitchen United); ROI metrics = revenue per brand (target $8k-15k/brand/month), margin per brand (target 15-25%), complaint rate per brand (target <8%), ROAS per brand (target 3-6x), CAC per brand (target $10-25); ROI tracking best practice = track per brand weekly, audit portfolio quarterly (replace underperformers, scale winners), benchmark brands against each other. Solutions ranked by impact: (1) IMPLEMENT ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + portfolio optimization ${fmt$(expectedPortfolioOptimization)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + margin lift ${fmt$(expectedMarginLift)}/mo; cost ${fmt$(200)}/mo (tool); payback immediate; (2) USE POS with brand-level reporting (Toast, Square, Lightspeed); (3) OR use delivery platform dashboards (Uber Eats Manager, DoorDash Merchant); (4) OR use dedicated ghost kitchen platform (CloudKitchens, Kitchen United); (5) TRACK revenue per brand (target $8k-15k/brand/month); (6) TRACK margin per brand (target 15-25%); (7) TRACK complaint rate per brand (target <8%); (8) TRACK ROAS per brand (target 3-6x); (9) TRACK CAC per brand (target $10-25); (10) AUDIT portfolio quarterly (replace underperformers, scale winners); (11) BENCHMARK brands against each other; (12) BENCHMARK vs competitor ROI tracking. Industry data: 15-20% wasted spend without tracking; payback immediate. Expected impact: +5pts profit margin, +15% revenue growth, +${fmt$(expectedWastedSpendRecovery)}/mo wasted spend recovery, payback immediate.`,
        ai_recommendation: 'implement_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: VIRTUAL_BRAND_MARKET_EXPANSION_ABSENT
    if (config.requireVirtualBrandMarketExpansion && d.has_ghost_kitchen_strategy && (!d.has_virtual_brand_market_expansion || d.markets_served_count < d.markets_target_count)) {
      // no market expansion via virtual brands -> missed geographic reach
      const marketGap = Math.max(d.markets_target_count - d.markets_served_count, 0);
      const expectedMarketExpansionRevenue = Math.round(targetMarketExpansionRevenue * (marketGap / Math.max(d.markets_target_count, 1)));
      const expectedReachGrowth = Math.round(baselineRevenue * 0.08);
      const expectedCustomerAcquisition = Math.round(baselineRevenue * 0.05);
      const expectedBrandAwareness = Math.round(baselineRevenue * 0.04);
      const totalOpportunity = Math.max(expectedMarketExpansionRevenue + expectedReachGrowth + expectedCustomerAcquisition + expectedBrandAwareness, 2200);
      const severityLabel = d.markets_served_count < 2 ? 'high' : 'medium';
      const criticalNote = (d.markets_served_count < 2)
        ? `HIGH: NO VIRTUAL BRAND MARKET EXPANSION — markets served ${d.markets_served_count} (target ${d.markets_target_count}); virtual brands enable market expansion without real estate investment ($50k-200k vs $500k-2M traditional); missing expansion = missed geographic reach + missed customer acquisition + missed brand awareness. `
        : `MEDIUM: MARKET EXPANSION BELOW TARGET — ${d.markets_served_count} markets (target ${d.markets_target_count}); expand to ${marketGap} more markets for geographic reach. `;
      alerts.push({
        rule_id: 'virtual_brand_market_expansion_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_virtual_brand_market_expansion: d.has_virtual_brand_market_expansion,
        markets_served_count: d.markets_served_count,
        markets_target_count: d.markets_target_count,
        virtual_brand_reach_potential: d.virtual_brand_reach_potential,
        virtual_brand_count: d.virtual_brand_count,
        ghost_kitchen_count: d.ghost_kitchen_count,
        ghost_kitchen_revenue_monthly: d.ghost_kitchen_revenue_monthly,
        ghost_kitchen_revenue_growth_pct: d.ghost_kitchen_revenue_growth_pct,
        competitor_ghost_kitchen_score: d.competitor_ghost_kitchen_score,
        monthly_revenue: d.monthly_revenue,
        virtual_brand_launch_cost: d.virtual_brand_launch_cost,
        market_expansion_revenue_projected: expectedMarketExpansionRevenue,
        revenue_growth_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VIRTUAL BRAND MARKET EXPANSION ABSENT: ${d.location_id} — market expansion ${d.has_virtual_brand_market_expansion ? 'present' : 'ABSENT'}; markets served ${d.markets_served_count} (target ${d.markets_target_count}); reach potential ${d.virtual_brand_reach_potential} households; virtual brands ${d.virtual_brand_count}; ghost kitchens ${d.ghost_kitchen_count}; ghost kitchen revenue ${fmt$(d.ghost_kitchen_revenue_monthly)}/mo; revenue growth ${d.ghost_kitchen_revenue_growth_pct}%; competitor ghost kitchen ${d.competitor_ghost_kitchen_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: virtual brands enable market expansion without real estate investment ($50k-200k vs $500k-2M traditional restaurant); ghost kitchen market expansion = additional ghost kitchens in new neighborhoods, shared/commissary kitchens in new markets, delivery platform expansion to new zones; market expansion ROI = $8k-15k/month revenue per new market; market expansion cost = $50k-200k per ghost kitchen (or $2k-5k/month shared kitchen); market expansion best practice = analyze delivery demand per neighborhood (Uber Eats, DoorDash data), identify cuisine gaps in new markets, launch in shared kitchens first (lower risk), scale to dedicated ghost kitchen if demand justifies; market expansion sequence = (1) analyze demand per neighborhood, (2) identify cuisine gaps, (3) launch in shared kitchen (lowest cost), (4) validate demand (3-6 months), (5) scale to dedicated ghost kitchen if ROI justifies, (6) replicate virtual brand portfolio in new market. Solutions ranked by impact: (1) EXPAND to ${marketGap} new markets — market expansion revenue ${fmt$(expectedMarketExpansionRevenue)}/mo + reach growth ${fmt$(expectedReachGrowth)}/mo + customer acquisition ${fmt$(expectedCustomerAcquisition)}/mo + brand awareness ${fmt$(expectedBrandAwareness)}/mo; cost ${fmt$(d.virtual_brand_launch_cost * marketGap)} launch + ${fmt$(3000)}/mo shared kitchen; payback 3-6 months; (2) ANALYZE delivery demand per neighborhood (Uber Eats, DoorDash data); (3) IDENTIFY cuisine gaps in new markets; (4) LAUNCH in shared kitchen first (lowest cost, $2k-5k/mo rent); (5) VALIDATE demand (3-6 months); (6) SCALE to dedicated ghost kitchen if ROI justifies ($50k-200k); (7) REPLICATE virtual brand portfolio in new market; (8) ENSURE quality consistency across markets (SOPs, training); (9) TRACK ROI per market (revenue, margin, complaint rate); (10) EXPAND to next market if ROI justifies; (11) BENCHMARK vs competitor market expansion. Industry data: $50k-200k ghost kitchen vs $500k-2M traditional; $8k-15k/month revenue per new market; payback 3-6 months. Expected impact: +${fmt$(expectedMarketExpansionRevenue)}/mo market expansion revenue, +25% revenue growth, payback 3-6 months.`,
        ai_recommendation: 'expand_to_new_markets',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: GHOST_KITCHEN_QUALITY_CONSISTENCY_ABSENT
    if (config.requireQualityConsistencyProgram && d.has_ghost_kitchen_strategy && (!d.has_quality_consistency_program || d.quality_consistency_score < config.minQualityConsistencyScore || d.avg_brand_rating < config.minAvgBrandRating)) {
      // quality consistency across brands poor -> negative reviews + churn
      const qualityGap = Math.max(config.minQualityConsistencyScore - d.quality_consistency_score, 0);
      const expectedReviewLift = Math.round(baselineRevenue * (qualityGap / 800));
      const expectedRetentionLift = Math.round(baselineRevenue * (qualityGap / 600));
      const expectedComplaintReduction = Math.round(baselineRevenue * (qualityGap / 500));
      const expectedBrandValueLift = Math.round(baselineRevenue * (qualityGap / 1000));
      const totalOpportunity = Math.max(expectedReviewLift + expectedRetentionLift + expectedComplaintReduction + expectedBrandValueLift, 1400);
      const severityLabel = d.quality_consistency_score < 50 ? 'high' : d.quality_consistency_score < 70 ? 'medium' : 'low';
      const criticalNote = (d.quality_consistency_score < 50)
        ? `HIGH: QUALITY CONSISTENCY POOR — consistency score ${d.quality_consistency_score}/100 (min ${config.minQualityConsistencyScore}); avg brand rating ${d.avg_brand_rating}/5 (min ${config.minAvgBrandRating}); cross-brand complaints ${d.cross_brand_complaint_pct}%; quality inconsistency across virtual brands = negative reviews + churn + brand damage; quality consistency program = SOPs, training, audits, brand standards. `
        : d.quality_consistency_score < 70
          ? `MEDIUM: QUALITY CONSISTENCY BELOW TARGET — ${d.quality_consistency_score}/100 (min ${config.minQualityConsistencyScore}); avg rating ${d.avg_brand_rating}/5; improve for higher ratings. `
          : `LOW: QUALITY CONSISTENCY BELOW TARGET — ${d.quality_consistency_score}/100 (min ${config.minQualityConsistencyScore}); improve brand consistency. `;
      alerts.push({
        rule_id: 'ghost_kitchen_quality_consistency_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quality_consistency_program: d.has_quality_consistency_program,
        quality_consistency_score: d.quality_consistency_score,
        avg_brand_rating: d.avg_brand_rating,
        avg_brand_rating_target: d.avg_brand_rating_target,
        cross_brand_complaint_pct: d.cross_brand_complaint_pct,
        virtual_brand_count: d.virtual_brand_count,
        ghost_kitchen_count: d.ghost_kitchen_count,
        delivery_complaint_rate_pct: d.delivery_complaint_rate_pct,
        competitor_ghost_kitchen_score: d.competitor_ghost_kitchen_score,
        monthly_revenue: d.monthly_revenue,
        ghost_kitchen_operating_cost_monthly: d.ghost_kitchen_operating_cost_monthly,
        quality_rating_lift_projected_pts: targetQualityRatingLiftPts,
        delivery_complaint_reduction_projected_pct: 30,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `GHOST KITCHEN QUALITY CONSISTENCY ABSENT: ${d.location_id} — quality consistency program ${d.has_quality_consistency_program ? 'present' : 'ABSENT'}; consistency score ${d.quality_consistency_score}/100 (min ${config.minQualityConsistencyScore}); avg brand rating ${d.avg_brand_rating}/5 (min ${config.minAvgBrandRating}, target ${d.avg_brand_rating_target}); cross-brand complaints ${d.cross_brand_complaint_pct}%; virtual brands ${d.virtual_brand_count}; ghost kitchens ${d.ghost_kitchen_count}; delivery complaints ${d.delivery_complaint_rate_pct}%; competitor ghost kitchen ${d.competitor_ghost_kitchen_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: quality inconsistency across virtual brands = negative reviews + churn + brand damage; ghost kitchens struggle with quality consistency (multi-brand ops, shared kitchen, staff cross-training); quality consistency program = standard operating procedures (SOPs) per brand, staff training per brand, quality audits, brand standards (recipes, portions, plating); quality consistency reduces complaints 30-40%, improves ratings 0.3-0.5 stars, increases repeat orders 15-25%; quality consistency best practice = documented recipes (portions, temps, times), brand-specific SOPs (prep, cook, plate, package), staff training per brand (certify before solo), quality audits (weekly, mystery shopper), brand standards (photos, checklists); quality consistency tools = digital recipe management (MeazureUp, Zenput), brand-specific checklists, photo standards (visual reference). Solutions ranked by impact: (1) STANDARDIZE quality across brands — review lift ${fmt$(expectedReviewLift)}/mo + retention lift ${fmt$(expectedRetentionLift)}/mo + complaint reduction ${fmt$(expectedComplaintReduction)}/mo + brand value lift ${fmt$(expectedBrandValueLift)}/mo; cost ${fmt$(300)}/mo (tools + training); payback 1-2 months; (2) DOCUMENT recipes per brand (portions, temps, times); (3) CREATE brand-specific SOPs (prep, cook, plate, package); (4) TRAIN staff per brand (certify before solo); (5) CONDUCT quality audits weekly (mystery shopper); (6) CREATE brand standards (photos, checklists); (7) USE digital recipe management (MeazureUp, Zenput); (8) IMPLEMENT brand-specific checklists; (9) CREATE photo standards (visual reference for plating); (10) TRACK consistency score (target 80+); (11) TRACK avg brand rating (target 4.3+); (12) TRACK cross-brand complaints (target <5%); (13) BENCHMARK vs competitor quality consistency. Industry data: 30-40% complaint reduction; 0.3-0.5 star rating lift; payback 1-2 months. Expected impact: +${targetQualityRatingLiftPts}pts rating, +30% complaint reduction, payback 1-2 months.`,
        ai_recommendation: 'standardize_quality_across_brands',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM ghost_kitchen_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE ghost_kitchen_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant ghost kitchen and virtual brand expert. Given ghost kitchen data, recommend ONE specific action with expected overhead reduction, kitchen utilization lift, food cost reduction, profit margin lift, or market expansion revenue (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Ghost kitchen strategy: ${a.has_ghost_kitchen_strategy ?? false} (${a.ghost_kitchen_count ?? 0} kitchens, ${a.virtual_brand_count ?? 0}/${a.virtual_brand_target_count ?? 4} brands). Kitchen utilization: ${a.kitchen_utilization_pct ?? 0}% (target ${a.kitchen_utilization_target_pct ?? 70}%), ${a.kitchen_sqft ?? 0}sqft, ${fmt$(a.revenue_per_sqft ?? 0)}/sqft. Platform optimization: ${a.has_delivery_platform_optimization ?? false} (${a.delivery_platforms_count ?? 0} platforms, fees ${a.delivery_platform_fees_pct ?? 0}%/${a.delivery_platform_fee_target_pct ?? 18}%, direct ${a.direct_order_pct ?? 0}%/${a.direct_order_target_pct ?? 35}%). Cross-brand prep: ${a.has_cross_brand_prep_efficiency ?? false} (shared ingredients ${a.shared_ingredients_pct ?? 0}%, equipment ${a.shared_equipment_pct ?? 0}%, food cost ${a.food_cost_pct ?? 0}%/${a.food_cost_target_pct ?? 28}%). Delivery menus: ${a.has_delivery_optimized_menus ?? false} (complaints ${a.delivery_complaint_rate_pct ?? 0}%/${a.delivery_complaint_target_pct ?? 6}%, travel ${a.travel_time_optimized_minutes ?? 0}min). ROI tracking: ${a.has_ghost_kitchen_roi_tracking ?? false} (revenue ${fmt$(a.ghost_kitchen_revenue_monthly ?? 0)}/mo, margin ${a.ghost_kitchen_profit_margin_pct ?? 0}%/${a.ghost_kitchen_profit_margin_target_pct ?? 20}%, investment ${fmt$(a.ghost_kitchen_investment ?? 0)}). Market expansion: ${a.has_virtual_brand_market_expansion ?? false} (${a.markets_served_count ?? 0}/${a.markets_target_count ?? 4} markets, reach ${a.virtual_brand_reach_potential ?? 0}). Quality consistency: ${a.has_quality_consistency_program ?? false} (score ${a.quality_consistency_score ?? 0}/100, rating ${a.avg_brand_rating ?? 0}/${a.avg_brand_rating_target ?? 4.3}, cross-brand complaints ${a.cross_brand_complaint_pct ?? 0}%). Revenue growth: ${a.ghost_kitchen_revenue_growth_pct ?? 0}%. Traditional baseline: ${fmt$(a.traditional_revenue_baseline ?? 0)}. Competitor ghost kitchen: ${a.competitor_ghost_kitchen_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Operating cost: ${fmt$(a.ghost_kitchen_operating_cost_monthly ?? 0)}/mo. Launch cost: ${fmt$(a.virtual_brand_launch_cost ?? 0)}. Platform cost: ${fmt$(a.delivery_platform_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveGhostKitchenAlerts = async (db: ReturnType<typeof useDB>): Promise<GhostKitchenAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM ghost_kitchen_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getGhostKitchenSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  ghostKitchenStrategyAbsentCount: number;
  virtualBrandPortfolioThinCount: number;
  deliveryPlatformOptimizationAbsentCount: number;
  crossBrandPrepEfficiencyAbsentCount: number;
  virtualBrandMenuDeliveryUnoptimizedCount: number;
  ghostKitchenRoiTrackingAbsentCount: number;
  virtualBrandMarketExpansionAbsentCount: number;
  ghostKitchenQualityConsistencyAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'ghost_kitchen_strategy_absent') AS nostrategy,
              math::count(rule_id = 'virtual_brand_portfolio_thin') AS thinportfolio,
              math::count(rule_id = 'delivery_platform_optimization_absent') AS noplatform,
              math::count(rule_id = 'cross_brand_prep_efficiency_absent') AS nocrossbrand,
              math::count(rule_id = 'virtual_brand_menu_delivery_unoptimized') AS nodeliverymenu,
              math::count(rule_id = 'ghost_kitchen_roi_tracking_absent') AS noroi,
              math::count(rule_id = 'virtual_brand_market_expansion_absent') AS noexpansion,
              math::count(rule_id = 'ghost_kitchen_quality_consistency_absent') AS noquality
       FROM ghost_kitchen_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      ghostKitchenStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      virtualBrandPortfolioThinCount: safeNumber(r.thinportfolio, 0),
      deliveryPlatformOptimizationAbsentCount: safeNumber(r.noplatform, 0),
      crossBrandPrepEfficiencyAbsentCount: safeNumber(r.nocrossbrand, 0),
      virtualBrandMenuDeliveryUnoptimizedCount: safeNumber(r.nodeliverymenu, 0),
      ghostKitchenRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
      virtualBrandMarketExpansionAbsentCount: safeNumber(r.noexpansion, 0),
      ghostKitchenQualityConsistencyAbsentCount: safeNumber(r.noquality, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, ghostKitchenStrategyAbsentCount: 0, virtualBrandPortfolioThinCount: 0, deliveryPlatformOptimizationAbsentCount: 0, crossBrandPrepEfficiencyAbsentCount: 0, virtualBrandMenuDeliveryUnoptimizedCount: 0, ghostKitchenRoiTrackingAbsentCount: 0, virtualBrandMarketExpansionAbsentCount: 0, ghostKitchenQualityConsistencyAbsentCount: 0 };
  }
};

export const updateGhostKitchenAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
