/**
 * AI Augmented Reality (AR) Menu & Immersive Dining Experience Optimizer —
 * predicts how AR menu technology and immersive dining experiences (3D food
 * visualization, AR menu ordering, projection mapping dining, virtual
 * ambiance, AR allergen/nutrition overlay, AR multilingual visual menu,
 * AR food photography, immersive premium dining, AR engagement tracking,
 * AR content production, AR platform optimization) impact order value,
 * order accuracy, customer engagement, brand differentiation, premium
 * pricing, and competitive advantage.
 *
 * AR market in restaurants = $2B+ by 2027 (Markets and Markets), growing
 * 35%+ CAGR. 65% of customers are visual learners — seeing food in 3D
 * increases order confidence. AR menus increase order value 15-25%
 * (customers see portion size, add sides). AR menus reduce order errors
 * 30-40% (visual confirmation before ordering). Snapchat AR menu pilots
 * showed 45% engagement rate. Google Lens food recognition = 60% of users
 * search food visually. AR menus reduce return/complaint rate 20-30%
 * (expectation matches reality). Immersive dining (projection mapping,
 * virtual ambiance) = premium experience ($50-200/cover). TeamLab,
 * Sublimotion, Ultraviolet charge $500-2,500/cover for immersive dining.
 * AR menus attract Gen Z/millennials — 72% prefer visual ordering. AR
 * food photography (3D models) costs $200-1,000 per dish but reuses
 * forever (vs $50-200 per traditional photoshoot, reshoot needed on
 * change). AR menu platforms: Snapchat AR, Google ARCore, Apple ARKit,
 * 8th Wall, Zappar. AR reduces menu printing costs $200-1,000/year. AR
 * enables multi-language (visual transcends language barrier). AR enables
 * allergen visualization (highlight allergens in 3D). AR nutrition overlay
 * (calories, macros shown on 3D food). 45% of customers would pay more
 * for AR-enhanced dining experience. AR menu ROI = $5-15 per $1 spent
 * (order value lift + error reduction + printing savings + engagement).
 *
 * 210th POSR-exclusive differentiator. Distinct from:
 *   - digital-menu-qr.service — QR code menu (2D, text+photo). This
 *     optimizer focuses on AR 3D menu (immersive, interactive, real-time).
 *   - menu-photography-impact.service — traditional PHOTOGRAPHY impact.
 *     This optimizer focuses on AR 3D visualization + immersive dining.
 *   - menu-typography-material.service — physical menu DESIGN (fonts,
 *     materials). This optimizer focuses on AR digital overlay.
 *   - menu-layout-placement.service — menu LAYOUT on page. This optimizer
 *     focuses on AR menu spatial visualization.
 *   - menu-description-impact.service — menu TEXT descriptions. This
 *     optimizer focuses on AR visual (3D models, not text).
 *   - menu-optimization.service — BCG menu matrix. This optimizer
 *     focuses on AR menu technology.
 *   - vibe-optimizer.service — overall AMBIANCE. This optimizer focuses
 *     on AR immersive dining (projection mapping, virtual ambiance).
 *   - tabletop-entertainment-activity.service — tabletop GAMES/activities.
 *     This optimizer focuses on AR food visualization + immersive dining.
 *   - nutritional-transparency.service — calorie/allergen DISPLAY. This
 *     optimizer focuses on AR calorie/allergen OVERLAY on 3D food.
 *
 * 8 AI rules:
 *   1. ar_menu_strategy_absent -> no AR menu -> missed $2B market + 15-25% order value lift
 *   2. ar_food_visualization_absent -> no 3D food models -> missed confidence + 30-40% error reduction
 *   3. ar_immersive_dining_experience_absent -> no immersive/projection dining -> missed premium ($50-200/cover)
 *   4. ar_allergen_nutrition_overlay_absent -> no AR allergen/nutrition overlay -> missed safety + health market
 *   5. ar_multilingual_visual_menu_absent -> no AR multilingual -> missed 22% non-English (visual transcends language)
 *   6. ar_menu_platform_optimization_absent -> poor platform -> low performance + low engagement
 *   7. ar_content_production_program_absent -> no AR content production -> stale content + high per-dish cost
 *   8. ar_menu_roi_tracking_absent -> no ROI tracking -> can't optimize AR investment
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type ArMenuRuleId =
  | 'ar_menu_strategy_absent'
  | 'ar_food_visualization_absent'
  | 'ar_immersive_dining_experience_absent'
  | 'ar_allergen_nutrition_overlay_absent'
  | 'ar_multilingual_visual_menu_absent'
  | 'ar_menu_platform_optimization_absent'
  | 'ar_content_production_program_absent'
  | 'ar_menu_roi_tracking_absent';

export type ArMenuAiRec =
  | 'launch_ar_menu_strategy'
  | 'deploy_ar_food_visualization'
  | 'launch_immersive_dining'
  | 'deploy_ar_allergen_nutrition'
  | 'launch_ar_multilingual'
  | 'optimize_ar_platform'
  | 'establish_ar_content_production'
  | 'implement_ar_roi_tracking'
  | 'monitor'
  | 'skip';

export interface ArMenuAlert {
  id?: string;
  rule_id: ArMenuRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  has_ar_menu_strategy?: boolean;
  ar_menu_platform?: string;
  ar_menu_adoption_pct?: number;
  ar_menu_adoption_target_pct?: number;
  has_ar_food_visualization?: boolean;
  ar_food_models_count?: number;
  ar_food_models_target_count?: number;
  ar_food_model_quality_score?: number;
  has_immersive_dining?: boolean;
  immersive_dining_type?: string;
  immersive_dining_covers_monthly?: number;
  immersive_dining_revenue_per_cover?: number;
  immersive_dining_revenue_monthly?: number;
  has_ar_allergen_nutrition_overlay?: boolean;
  ar_allergen_highlight_accuracy?: number;
  ar_nutrition_overlay_accuracy?: number;
  has_ar_multilingual_visual_menu?: boolean;
  ar_languages_supported_count?: number;
  ar_multilingual_usage_pct?: number;
  has_ar_menu_platform_optimization?: boolean;
  ar_menu_load_time_seconds?: number;
  ar_menu_load_target_seconds?: number;
  ar_engagement_rate_pct?: number;
  ar_engagement_target_pct?: number;
  has_ar_content_production_program?: boolean;
  ar_content_refresh_frequency_months?: number;
  ar_content_production_cost_monthly?: number;
  ar_content_freshness_score?: number;
  has_ar_menu_roi_tracking?: boolean;
  ar_menu_investment_total?: number;
  ar_order_value_lift_monthly?: number;
  ar_error_reduction_savings_monthly?: number;
  ar_printing_savings_monthly?: number;
  ar_engagement_revenue_monthly?: number;
  ar_menu_roas?: number;
  avg_order_value_without_ar?: number;
  avg_order_value_with_ar?: number;
  order_error_rate_without_ar_pct?: number;
  order_error_rate_with_ar_pct?: number;
  complaint_rate_without_ar_pct?: number;
  complaint_rate_with_ar_pct?: number;
  customer_satisfaction_ar_score?: number;
  customer_satisfaction_non_ar_score?: number;
  gen_z_millennial_customer_pct?: number;
  competitor_ar_menu_score?: number;
  monthly_revenue?: number;
  total_menu_items?: number;
  total_customers_monthly?: number;
  ar_menu_development_cost?: number;
  ar_menu_subscription_cost_monthly?: number;
  ar_content_cost_per_dish?: number;
  order_value_lift_projected_pct?: number;
  error_reduction_projected_pct?: number;
  complaint_reduction_projected_pct?: number;
  immersive_revenue_projected?: number;
  engagement_lift_projected_pct?: number;
  satisfaction_lift_projected_pts?: number;
  content_freshness_lift_projected_pts?: number;
  roi_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: ArMenuAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface ArMenuConfig {
  aiEnabled: boolean;
  requireArMenuStrategy: boolean;
  requireArFoodVisualization: boolean;
  requireImmersiveDining: boolean;
  requireArAllergenNutritionOverlay: boolean;
  requireArMultilingualVisualMenu: boolean;
  requireArMenuPlatformOptimization: boolean;
  requireArContentProductionProgram: boolean;
  requireArMenuRoiTracking: boolean;
  minArMenuAdoptionPct: number;
  minArFoodModelsCount: number;
  minArFoodModelQualityScore: number;
  maxArMenuLoadTimeSeconds: number;
  minArEngagementRatePct: number;
  minArContentFreshnessScore: number;
  minArMenuRoas: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_AR_MENU_CONFIG: ArMenuConfig = {
  aiEnabled: true,
  requireArMenuStrategy: true,
  requireArFoodVisualization: true,
  requireImmersiveDining: false,
  requireArAllergenNutritionOverlay: true,
  requireArMultilingualVisualMenu: true,
  requireArMenuPlatformOptimization: true,
  requireArContentProductionProgram: true,
  requireArMenuRoiTracking: true,
  minArMenuAdoptionPct: 30,
  minArFoodModelsCount: 10,
  minArFoodModelQualityScore: 80,
  maxArMenuLoadTimeSeconds: 3,
  minArEngagementRatePct: 25,
  minArContentFreshnessScore: 75,
  minArMenuRoas: 3,
  preferCompetitorParity: true,
};

export const readArMenuConfig = (settings: any): ArMenuConfig => ({
  aiEnabled: settings?.ar_menu_ai_enabled ?? true,
  requireArMenuStrategy: settings?.ar_menu_require_strategy ?? true,
  requireArFoodVisualization: settings?.ar_menu_require_visualization ?? true,
  requireImmersiveDining: settings?.ar_menu_require_immersive ?? false,
  requireArAllergenNutritionOverlay: settings?.ar_menu_require_allergen ?? true,
  requireArMultilingualVisualMenu: settings?.ar_menu_require_multilingual ?? true,
  requireArMenuPlatformOptimization: settings?.ar_menu_require_platform ?? true,
  requireArContentProductionProgram: settings?.ar_menu_require_content ?? true,
  requireArMenuRoiTracking: settings?.ar_menu_require_roi ?? true,
  minArMenuAdoptionPct: safeNumber(settings?.ar_menu_min_adoption, 30),
  minArFoodModelsCount: safeNumber(settings?.ar_menu_min_models, 10),
  minArFoodModelQualityScore: safeNumber(settings?.ar_menu_min_quality, 80),
  maxArMenuLoadTimeSeconds: safeNumber(settings?.ar_menu_max_load_time, 3),
  minArEngagementRatePct: safeNumber(settings?.ar_menu_min_engagement, 25),
  minArContentFreshnessScore: safeNumber(settings?.ar_menu_min_freshness, 75),
  minArMenuRoas: safeNumber(settings?.ar_menu_min_roas, 3),
  preferCompetitorParity: settings?.ar_menu_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface ArMenuData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_ar_menu_strategy: boolean;
  ar_menu_platform: string;
  ar_menu_adoption_pct: number;
  ar_menu_adoption_target_pct: number;
  has_ar_food_visualization: boolean;
  ar_food_models_count: number;
  ar_food_models_target_count: number;
  ar_food_model_quality_score: number;
  has_immersive_dining: boolean;
  immersive_dining_type: string;
  immersive_dining_covers_monthly: number;
  immersive_dining_revenue_per_cover: number;
  immersive_dining_revenue_monthly: number;
  has_ar_allergen_nutrition_overlay: boolean;
  ar_allergen_highlight_accuracy: number;
  ar_nutrition_overlay_accuracy: number;
  has_ar_multilingual_visual_menu: boolean;
  ar_languages_supported_count: number;
  ar_multilingual_usage_pct: number;
  has_ar_menu_platform_optimization: boolean;
  ar_menu_load_time_seconds: number;
  ar_menu_load_target_seconds: number;
  ar_engagement_rate_pct: number;
  ar_engagement_target_pct: number;
  has_ar_content_production_program: boolean;
  ar_content_refresh_frequency_months: number;
  ar_content_production_cost_monthly: number;
  ar_content_freshness_score: number;
  has_ar_menu_roi_tracking: boolean;
  ar_menu_investment_total: number;
  ar_order_value_lift_monthly: number;
  ar_error_reduction_savings_monthly: number;
  ar_printing_savings_monthly: number;
  ar_engagement_revenue_monthly: number;
  ar_menu_roas: number;
  avg_order_value_without_ar: number;
  avg_order_value_with_ar: number;
  order_error_rate_without_ar_pct: number;
  order_error_rate_with_ar_pct: number;
  complaint_rate_without_ar_pct: number;
  complaint_rate_with_ar_pct: number;
  customer_satisfaction_ar_score: number;
  customer_satisfaction_non_ar_score: number;
  gen_z_millennial_customer_pct: number;
  competitor_ar_menu_score: number;
  monthly_revenue: number;
  total_menu_items: number;
  total_customers_monthly: number;
  ar_menu_development_cost: number;
  ar_menu_subscription_cost_monthly: number;
  ar_content_cost_per_dish: number;
}

const MOCK_DATA: ArMenuData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_ar_menu_strategy: false, ar_menu_platform: 'none',
    ar_menu_adoption_pct: 0, ar_menu_adoption_target_pct: 35,
    has_ar_food_visualization: false, ar_food_models_count: 0,
    ar_food_models_target_count: 15, ar_food_model_quality_score: 0,
    has_immersive_dining: false, immersive_dining_type: 'none',
    immersive_dining_covers_monthly: 0, immersive_dining_revenue_per_cover: 0,
    immersive_dining_revenue_monthly: 0,
    has_ar_allergen_nutrition_overlay: false,
    ar_allergen_highlight_accuracy: 0, ar_nutrition_overlay_accuracy: 0,
    has_ar_multilingual_visual_menu: false, ar_languages_supported_count: 0,
    ar_multilingual_usage_pct: 0,
    has_ar_menu_platform_optimization: false, ar_menu_load_time_seconds: 0,
    ar_menu_load_target_seconds: 3, ar_engagement_rate_pct: 0,
    ar_engagement_target_pct: 35,
    has_ar_content_production_program: false, ar_content_refresh_frequency_months: 0,
    ar_content_production_cost_monthly: 0, ar_content_freshness_score: 0,
    has_ar_menu_roi_tracking: false, ar_menu_investment_total: 0,
    ar_order_value_lift_monthly: 0, ar_error_reduction_savings_monthly: 0,
    ar_printing_savings_monthly: 0, ar_engagement_revenue_monthly: 0,
    ar_menu_roas: 0,
    avg_order_value_without_ar: 32, avg_order_value_with_ar: 0,
    order_error_rate_without_ar_pct: 15, order_error_rate_with_ar_pct: 0,
    complaint_rate_without_ar_pct: 12, complaint_rate_with_ar_pct: 0,
    customer_satisfaction_ar_score: 0, customer_satisfaction_non_ar_score: 68,
    gen_z_millennial_customer_pct: 42, competitor_ar_menu_score: 58,
    monthly_revenue: 86000, total_menu_items: 48,
    total_customers_monthly: 2800,
    ar_menu_development_cost: 0, ar_menu_subscription_cost_monthly: 0,
    ar_content_cost_per_dish: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_ar_menu_strategy: true, ar_menu_platform: '8th Wall',
    ar_menu_adoption_pct: 18, ar_menu_adoption_target_pct: 35,
    has_ar_food_visualization: true, ar_food_models_count: 6,
    ar_food_models_target_count: 15, ar_food_model_quality_score: 62,
    has_immersive_dining: false, immersive_dining_type: 'none',
    immersive_dining_covers_monthly: 0, immersive_dining_revenue_per_cover: 0,
    immersive_dining_revenue_monthly: 0,
    has_ar_allergen_nutrition_overlay: false,
    ar_allergen_highlight_accuracy: 0, ar_nutrition_overlay_accuracy: 0,
    has_ar_multilingual_visual_menu: false, ar_languages_supported_count: 1,
    ar_multilingual_usage_pct: 0,
    has_ar_menu_platform_optimization: false, ar_menu_load_time_seconds: 6,
    ar_menu_load_target_seconds: 3, ar_engagement_rate_pct: 22,
    ar_engagement_target_pct: 35,
    has_ar_content_production_program: false, ar_content_refresh_frequency_months: 8,
    ar_content_production_cost_monthly: 300, ar_content_freshness_score: 48,
    has_ar_menu_roi_tracking: false, ar_menu_investment_total: 12000,
    ar_order_value_lift_monthly: 800, ar_error_reduction_savings_monthly: 200,
    ar_printing_savings_monthly: 50, ar_engagement_revenue_monthly: 300,
    ar_menu_roas: 0,
    avg_order_value_without_ar: 28, avg_order_value_with_ar: 33,
    order_error_rate_without_ar_pct: 15, order_error_rate_with_ar_pct: 10,
    complaint_rate_without_ar_pct: 12, complaint_rate_with_ar_pct: 9,
    customer_satisfaction_ar_score: 74, customer_satisfaction_non_ar_score: 70,
    gen_z_millennial_customer_pct: 58, competitor_ar_menu_score: 72,
    monthly_revenue: 152000, total_menu_items: 32,
    total_customers_monthly: 6200,
    ar_menu_development_cost: 12000, ar_menu_subscription_cost_monthly: 400,
    ar_content_cost_per_dish: 500,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_ar_menu_strategy: true, ar_menu_platform: 'Snapchat AR',
    ar_menu_adoption_pct: 38, ar_menu_adoption_target_pct: 35,
    has_ar_food_visualization: true, ar_food_models_count: 18,
    ar_food_models_target_count: 15, ar_food_model_quality_score: 84,
    has_immersive_dining: true, immersive_dining_type: 'projection_mapping',
    immersive_dining_covers_monthly: 120, immersive_dining_revenue_per_cover: 85,
    immersive_dining_revenue_monthly: 10200,
    has_ar_allergen_nutrition_overlay: true,
    ar_allergen_highlight_accuracy: 92, ar_nutrition_overlay_accuracy: 88,
    has_ar_multilingual_visual_menu: true, ar_languages_supported_count: 4,
    ar_multilingual_usage_pct: 28,
    has_ar_menu_platform_optimization: true, ar_menu_load_time_seconds: 2.5,
    ar_menu_load_target_seconds: 3, ar_engagement_rate_pct: 42,
    ar_engagement_target_pct: 35,
    has_ar_content_production_program: true, ar_content_refresh_frequency_months: 2,
    ar_content_production_cost_monthly: 800, ar_content_freshness_score: 82,
    has_ar_menu_roi_tracking: true, ar_menu_investment_total: 28000,
    ar_order_value_lift_monthly: 3200, ar_error_reduction_savings_monthly: 600,
    ar_printing_savings_monthly: 80, ar_engagement_revenue_monthly: 1200,
    ar_menu_roas: 5.8,
    avg_order_value_without_ar: 28, avg_order_value_with_ar: 38,
    order_error_rate_without_ar_pct: 15, order_error_rate_with_ar_pct: 6,
    complaint_rate_without_ar_pct: 12, complaint_rate_with_ar_pct: 4,
    customer_satisfaction_ar_score: 84, customer_satisfaction_non_ar_score: 72,
    gen_z_millennial_customer_pct: 68, competitor_ar_menu_score: 80,
    monthly_revenue: 201000, total_menu_items: 36,
    total_customers_monthly: 9800,
    ar_menu_development_cost: 28000, ar_menu_subscription_cost_monthly: 600,
    ar_content_cost_per_dish: 400,
  },
  {
    location_id: 'location_2', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_ar_menu_strategy: true, ar_menu_platform: 'Apple ARKit',
    ar_menu_adoption_pct: 52, ar_menu_adoption_target_pct: 35,
    has_ar_food_visualization: true, ar_food_models_count: 28,
    ar_food_models_target_count: 15, ar_food_model_quality_score: 94,
    has_immersive_dining: true, immersive_dining_type: 'full_immersive',
    immersive_dining_covers_monthly: 80, immersive_dining_revenue_per_cover: 280,
    immersive_dining_revenue_monthly: 22400,
    has_ar_allergen_nutrition_overlay: true,
    ar_allergen_highlight_accuracy: 98, ar_nutrition_overlay_accuracy: 96,
    has_ar_multilingual_visual_menu: true, ar_languages_supported_count: 6,
    ar_multilingual_usage_pct: 42,
    has_ar_menu_platform_optimization: true, ar_menu_load_time_seconds: 1.8,
    ar_menu_load_target_seconds: 3, ar_engagement_rate_pct: 58,
    ar_engagement_target_pct: 35,
    has_ar_content_production_program: true, ar_content_refresh_frequency_months: 1,
    ar_content_production_cost_monthly: 1500, ar_content_freshness_score: 92,
    has_ar_menu_roi_tracking: true, ar_menu_investment_total: 68000,
    ar_order_value_lift_monthly: 8200, ar_error_reduction_savings_monthly: 1200,
    ar_printing_savings_monthly: 120, ar_engagement_revenue_monthly: 2800,
    ar_menu_roas: 7.5,
    avg_order_value_without_ar: 92, avg_order_value_with_ar: 128,
    order_error_rate_without_ar_pct: 12, order_error_rate_with_ar_pct: 3,
    complaint_rate_without_ar_pct: 8, complaint_rate_with_ar_pct: 2,
    customer_satisfaction_ar_score: 92, customer_satisfaction_non_ar_score: 78,
    gen_z_millennial_customer_pct: 52, competitor_ar_menu_score: 84,
    monthly_revenue: 265000, total_menu_items: 42,
    total_customers_monthly: 3200,
    ar_menu_development_cost: 68000, ar_menu_subscription_cost_monthly: 1000,
    ar_content_cost_per_dish: 350,
  },
];

export const runArMenuEngine = async (
  db: ReturnType<typeof useDB>,
  config: ArMenuConfig,
): Promise<{ alerts: ArMenuAlert[]; generated: number }> => {
  const alerts: ArMenuAlert[] = [];
  const now = new Date();

  let data: ArMenuData[] = [];
  try {
    const result = await db.query(
      `SELECT * FROM ar_menu_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): ArMenuData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_ar_menu_strategy: Boolean(r.has_ar_menu_strategy ?? false),
      ar_menu_platform: String(r.ar_menu_platform ?? 'none'),
      ar_menu_adoption_pct: safeNumber(r.ar_menu_adoption_pct, 0),
      ar_menu_adoption_target_pct: safeNumber(r.ar_menu_adoption_target_pct, 35),
      has_ar_food_visualization: Boolean(r.has_ar_food_visualization ?? false),
      ar_food_models_count: safeNumber(r.ar_food_models_count, 0),
      ar_food_models_target_count: safeNumber(r.ar_food_models_target_count, 0),
      ar_food_model_quality_score: safeNumber(r.ar_food_model_quality_score, 0),
      has_immersive_dining: Boolean(r.has_immersive_dining ?? false),
      immersive_dining_type: String(r.immersive_dining_type ?? 'none'),
      immersive_dining_covers_monthly: safeNumber(r.immersive_dining_covers_monthly, 0),
      immersive_dining_revenue_per_cover: safeNumber(r.immersive_dining_revenue_per_cover, 0),
      immersive_dining_revenue_monthly: safeNumber(r.immersive_dining_revenue_monthly, 0),
      has_ar_allergen_nutrition_overlay: Boolean(r.has_ar_allergen_nutrition_overlay ?? false),
      ar_allergen_highlight_accuracy: safeNumber(r.ar_allergen_highlight_accuracy, 0),
      ar_nutrition_overlay_accuracy: safeNumber(r.ar_nutrition_overlay_accuracy, 0),
      has_ar_multilingual_visual_menu: Boolean(r.has_ar_multilingual_visual_menu ?? false),
      ar_languages_supported_count: safeNumber(r.ar_languages_supported_count, 0),
      ar_multilingual_usage_pct: safeNumber(r.ar_multilingual_usage_pct, 0),
      has_ar_menu_platform_optimization: Boolean(r.has_ar_menu_platform_optimization ?? false),
      ar_menu_load_time_seconds: safeNumber(r.ar_menu_load_time_seconds, 0),
      ar_menu_load_target_seconds: safeNumber(r.ar_menu_load_target_seconds, 3),
      ar_engagement_rate_pct: safeNumber(r.ar_engagement_rate_pct, 0),
      ar_engagement_target_pct: safeNumber(r.ar_engagement_target_pct, 35),
      has_ar_content_production_program: Boolean(r.has_ar_content_production_program ?? false),
      ar_content_refresh_frequency_months: safeNumber(r.ar_content_refresh_frequency_months, 0),
      ar_content_production_cost_monthly: safeNumber(r.ar_content_production_cost_monthly, 0),
      ar_content_freshness_score: safeNumber(r.ar_content_freshness_score, 0),
      has_ar_menu_roi_tracking: Boolean(r.has_ar_menu_roi_tracking ?? false),
      ar_menu_investment_total: safeNumber(r.ar_menu_investment_total, 0),
      ar_order_value_lift_monthly: safeNumber(r.ar_order_value_lift_monthly, 0),
      ar_error_reduction_savings_monthly: safeNumber(r.ar_error_reduction_savings_monthly, 0),
      ar_printing_savings_monthly: safeNumber(r.ar_printing_savings_monthly, 0),
      ar_engagement_revenue_monthly: safeNumber(r.ar_engagement_revenue_monthly, 0),
      ar_menu_roas: safeNumber(r.ar_menu_roas, 0),
      avg_order_value_without_ar: safeNumber(r.avg_order_value_without_ar, 0),
      avg_order_value_with_ar: safeNumber(r.avg_order_value_with_ar, 0),
      order_error_rate_without_ar_pct: safeNumber(r.order_error_rate_without_ar_pct, 0),
      order_error_rate_with_ar_pct: safeNumber(r.order_error_rate_with_ar_pct, 0),
      complaint_rate_without_ar_pct: safeNumber(r.complaint_rate_without_ar_pct, 0),
      complaint_rate_with_ar_pct: safeNumber(r.complaint_rate_with_ar_pct, 0),
      customer_satisfaction_ar_score: safeNumber(r.customer_satisfaction_ar_score, 0),
      customer_satisfaction_non_ar_score: safeNumber(r.customer_satisfaction_non_ar_score, 0),
      gen_z_millennial_customer_pct: safeNumber(r.gen_z_millennial_customer_pct, 0),
      competitor_ar_menu_score: safeNumber(r.competitor_ar_menu_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_menu_items: safeNumber(r.total_menu_items, 0),
      total_customers_monthly: safeNumber(r.total_customers_monthly, 0),
      ar_menu_development_cost: safeNumber(r.ar_menu_development_cost, 0),
      ar_menu_subscription_cost_monthly: safeNumber(r.ar_menu_subscription_cost_monthly, 0),
      ar_content_cost_per_dish: safeNumber(r.ar_content_cost_per_dish, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetOrderValueLiftPct = 20;
    const targetErrorReductionPct = 50;
    const targetComplaintReductionPct = 50;
    const targetImmersiveRevenue = Math.round(baselineRevenue * 0.05);
    const targetEngagementLiftPct = 25;
    const targetSatisfactionLiftPts = 15;
    const targetContentFreshnessLiftPts = 20;
    const targetRoiLiftPct = 30;

    // Rule 1: AR_MENU_STRATEGY_ABSENT
    if (config.requireArMenuStrategy && !d.has_ar_menu_strategy) {
      const expectedOrderValueLift = Math.round(d.total_customers_monthly * d.avg_order_value_without_ar * 0.18);
      const expectedErrorReduction = Math.round(d.total_customers_monthly * (d.order_error_rate_without_ar_pct / 100) * 0.35 * 5);
      const expectedPrintingSavings = 80;
      const expectedEngagementRevenue = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedOrderValueLift + expectedErrorReduction + expectedPrintingSavings + expectedEngagementRevenue, 3800);
      const severityLabel = d.competitor_ar_menu_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_ar_menu_score > 65)
        ? 'CRITICAL: NO AR MENU STRATEGY — competitor AR menu score ' + d.competitor_ar_menu_score + '/100 (high); AR market in restaurants = $2B+ by 2027 (Markets and Markets); 65% of customers are visual learners; AR menus increase order value 15-25%; AR menus reduce order errors 30-40%; Snapchat AR menu pilots showed 45% engagement; 72% of Gen Z/millennials prefer visual ordering; missing AR = missed order value lift + error reduction + engagement revenue + competitive differentiation. '
        : `HIGH: NO AR MENU STRATEGY — AR market $2B+ by 2027 (Markets and Markets); AR increases order value 15-25%; reduces errors 30-40%; 72% Gen Z/millennials prefer visual; missing order value lift + engagement. `;
      alerts.push({
        rule_id: 'ar_menu_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_menu_strategy: d.has_ar_menu_strategy,
        ar_menu_platform: d.ar_menu_platform,
        ar_menu_adoption_pct: d.ar_menu_adoption_pct,
        ar_menu_adoption_target_pct: d.ar_menu_adoption_target_pct,
        avg_order_value_without_ar: d.avg_order_value_without_ar,
        order_error_rate_without_ar_pct: d.order_error_rate_without_ar_pct,
        complaint_rate_without_ar_pct: d.complaint_rate_without_ar_pct,
        customer_satisfaction_non_ar_score: d.customer_satisfaction_non_ar_score,
        gen_z_millennial_customer_pct: d.gen_z_millennial_customer_pct,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        total_customers_monthly: d.total_customers_monthly,
        total_menu_items: d.total_menu_items,
        monthly_revenue: d.monthly_revenue,
        ar_menu_development_cost: d.ar_menu_development_cost,
        ar_menu_subscription_cost_monthly: d.ar_menu_subscription_cost_monthly,
        order_value_lift_projected_pct: targetOrderValueLiftPct,
        error_reduction_projected_pct: targetErrorReductionPct,
        complaint_reduction_projected_pct: targetComplaintReductionPct,
        engagement_lift_projected_pct: targetEngagementLiftPct,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR MENU STRATEGY ABSENT: ${d.location_id} — AR menu strategy ABSENT; platform: ${d.ar_menu_platform}; adoption 0% (target ${d.ar_menu_adoption_target_pct}%); avg order value ${fmt$(d.avg_order_value_without_ar)} (no AR); error rate ${d.order_error_rate_without_ar_pct}%; complaint rate ${d.complaint_rate_without_ar_pct}%; satisfaction ${d.customer_satisfaction_non_ar_score}/100; Gen Z/millennial customers ${d.gen_z_millennial_customer_pct}%; competitor AR ${d.competitor_ar_menu_score}/100; total customers ${d.total_customers_monthly}/mo; total menu items ${d.total_menu_items}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: AR market in restaurants = $2B+ by 2027 (Markets and Markets), growing 35%+ CAGR; 65% of customers are visual learners — seeing food in 3D increases order confidence; AR menus increase order value 15-25% (customers see portion size, add sides); AR menus reduce order errors 30-40% (visual confirmation before ordering); Snapchat AR menu pilots showed 45% engagement rate; Google Lens food recognition = 60% of users search food visually; AR menus reduce return/complaint rate 20-30% (expectation matches reality); AR menus attract Gen Z/millennials — 72% prefer visual ordering; AR food photography (3D models) costs $200-1,000 per dish but reuses forever (vs $50-200 per traditional photoshoot, reshoot needed on change); AR menu platforms: Snapchat AR, Google ARCore, Apple ARKit, 8th Wall, Zappar; AR reduces menu printing costs $200-1,000/year; AR enables multi-language (visual transcends language barrier); 45% of customers would pay more for AR-enhanced dining experience; AR menu ROI = $5-15 per $1 spent (order value lift + error reduction + printing savings + engagement). Solutions ranked by impact: (1) LAUNCH AR menu strategy — order value lift ${fmt$(expectedOrderValueLift)}/mo + error reduction ${fmt$(expectedErrorReduction)}/mo + printing savings ${fmt$(expectedPrintingSavings)}/mo + engagement ${fmt$(expectedEngagementRevenue)}/mo; cost ${fmt$(d.ar_menu_development_cost || 15000)} setup + ${fmt$(d.ar_menu_subscription_cost_monthly || 400)}/mo subscription; payback 3-6 months; (2) CHOOSE AR platform (Snapchat AR, 8th Wall, Apple ARKit, Google ARCore, Zappar); (3) BUILD AR menu for top 10-15 dishes (highest-volume, highest-value); (4) CREATE 3D food models ($200-1,000 per dish); (5) INTEGRATE with POS (order from AR menu); (6) ADD allergen/nutrition overlay (highlight allergens, show calories/macros); (7) ADD multilingual support (visual transcends language); (8) OPTIMIZE platform (load time under 3 seconds); (9) ESTABLISH content production program (refresh quarterly); (10) TRACK ROI (order value, errors, complaints, engagement); (11) CONSIDER immersive dining for premium tier (projection mapping, $50-200/cover); (12) BENCHMARK vs competitor AR menu. Industry data: $2B+ market by 2027 (Markets and Markets); 15-25% order value lift; 30-40% error reduction; $5-15 ROI per $1; payback 3-6 months. Expected impact: +${targetOrderValueLiftPct}% order value, -${targetErrorReductionPct}% errors, -${targetComplaintReductionPct}% complaints, payback 3-6 months.`,
        ai_recommendation: 'launch_ar_menu_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: AR_FOOD_VISUALIZATION_ABSENT
    if (d.has_ar_menu_strategy && config.requireArFoodVisualization && (!d.has_ar_food_visualization || d.ar_food_models_count < config.minArFoodModelsCount || d.ar_food_model_quality_score < config.minArFoodModelQualityScore)) {
      const modelGap = Math.max(config.minArFoodModelsCount - d.ar_food_models_count, 0);
      const expectedOrderValueLift = Math.round(d.total_customers_monthly * d.avg_order_value_without_ar * 0.10);
      const expectedErrorReduction = Math.round(d.total_customers_monthly * (d.order_error_rate_without_ar_pct / 100) * 0.25 * 5);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.02);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedOrderValueLift + expectedErrorReduction + expectedSatisfactionLift + expectedCompetitiveLift, 2200);
      const severityLabel = !d.has_ar_food_visualization ? 'high' : 'medium';
      const criticalNote = (!d.has_ar_food_visualization)
        ? `HIGH: NO AR FOOD VISUALIZATION — 3D food models 0 (target ${config.minArFoodModelsCount}); without 3D models, AR menu has no visual content = no value; 65% of customers are visual learners; AR food visualization increases order confidence + reduces errors 30-40%; 3D models cost $200-1,000 per dish but reuse forever. `
        : `MEDIUM: AR FOOD MODELS BELOW TARGET — ${d.ar_food_models_count} models (min ${config.minArFoodModelsCount}), quality ${d.ar_food_model_quality_score}/100 (min ${config.minArFoodModelQualityScore}); add more models + improve quality. `;
      alerts.push({
        rule_id: 'ar_food_visualization_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_food_visualization: d.has_ar_food_visualization,
        ar_food_models_count: d.ar_food_models_count,
        ar_food_models_target_count: d.ar_food_models_target_count,
        ar_food_model_quality_score: d.ar_food_model_quality_score,
        ar_menu_platform: d.ar_menu_platform,
        total_menu_items: d.total_menu_items,
        avg_order_value_without_ar: d.avg_order_value_without_ar,
        avg_order_value_with_ar: d.avg_order_value_with_ar,
        order_error_rate_without_ar_pct: d.order_error_rate_without_ar_pct,
        order_error_rate_with_ar_pct: d.order_error_rate_with_ar_pct,
        customer_satisfaction_ar_score: d.customer_satisfaction_ar_score,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        monthly_revenue: d.monthly_revenue,
        ar_content_cost_per_dish: d.ar_content_cost_per_dish,
        order_value_lift_projected_pct: 15,
        error_reduction_projected_pct: 35,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR FOOD VISUALIZATION ABSENT/LOW: ${d.location_id} — AR food visualization ${d.has_ar_food_visualization ? 'present' : 'ABSENT'}; 3D models ${d.ar_food_models_count} (min ${config.minArFoodModelsCount}, target ${d.ar_food_models_target_count}); quality ${d.ar_food_model_quality_score}/100 (min ${config.minArFoodModelQualityScore}); platform ${d.ar_menu_platform}; total menu items ${d.total_menu_items}; avg order value without AR ${fmt$(d.avg_order_value_without_ar)}, with AR ${fmt$(d.avg_order_value_with_ar)}; error rate without AR ${d.order_error_rate_without_ar_pct}%, with AR ${d.order_error_rate_with_ar_pct}%; satisfaction AR ${d.customer_satisfaction_ar_score}/100; competitor AR ${d.competitor_ar_menu_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 65% of customers are visual learners — seeing food in 3D increases order confidence; AR food visualization increases order value 15-25% (customers see portion size, add sides); AR food visualization reduces order errors 30-40% (visual confirmation before ordering); AR food visualization reduces complaint rate 20-30% (expectation matches reality); 3D food model production = photogrammetry (3D scan of real dish), CGI modeling (digital recreation), or hybrid; 3D food model cost = $200-1,000 per dish (one-time, reuse forever vs $50-200 per traditional photoshoot with reshoots); 3D food model quality = photorealistic (95%+ realism), good (80-95%), fair (60-80%), poor (below 60%); 3D food model best practice = model top 10-15 dishes (highest-volume, highest-value), update when recipe changes, show actual portion size (not enlarged), show actual plating (not styled differently). Solutions ranked by impact: (1) DEPLOY AR food visualization — order value lift ${fmt$(expectedOrderValueLift)}/mo + error reduction ${fmt$(expectedErrorReduction)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(modelGap * (d.ar_content_cost_per_dish || 500))} one-time (${modelGap} models x ${fmt$(d.ar_content_cost_per_dish || 500)}/dish); payback 2-4 months; (2) IDENTIFY top ${config.minArFoodModelsCount} dishes for 3D modeling (highest-volume, highest-value); (3) CHOOSE production method (photogrammetry, CGI, hybrid); (4) CREATE photorealistic 3D models ($200-1,000/dish); (5) ENSURE actual portion size (not enlarged); (6) ENSURE actual plating (not styled differently); (7) UPDATE models when recipe changes; (8) TARGET quality ${config.minArFoodModelQualityScore}+ (photorealistic); (9) TRACK order value with/without AR; (10) TRACK error rate with/without AR; (11) TRACK complaint rate with/without AR; (12) BENCHMARK vs competitor AR food visualization. Industry data: 15-25% order value lift; 30-40% error reduction; $200-1,000/dish one-time; payback 2-4 months. Expected impact: +15% order value, -35% errors, +12pts satisfaction, payback 2-4 months.`,
        ai_recommendation: 'deploy_ar_food_visualization',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: AR_IMMERSIVE_DINING_EXPERIENCE_ABSENT
    if (d.has_ar_menu_strategy && config.requireImmersiveDining && !d.has_immersive_dining) {
      const expectedImmersiveRevenue = Math.round(d.total_customers_monthly * 0.05 * 85);
      const expectedPremiumPricing = Math.round(baselineRevenue * 0.03);
      const expectedBrandDifferentiation = Math.round(baselineRevenue * 0.02);
      const expectedSocialMediaLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedImmersiveRevenue + expectedPremiumPricing + expectedBrandDifferentiation + expectedSocialMediaLift, 2400);
      const severityLabel = d.restaurant_tier === 'fine_dining' || d.restaurant_tier === 'casual_dining' ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO IMMERSIVE DINING EXPERIENCE — immersive dining type: ${d.immersive_dining_type}; immersive dining (projection mapping, virtual ambiance) = premium experience ($50-200/cover); TeamLab, Sublimotion, Ultraviolet charge $500-2,500/cover for full immersive; 45% of customers would pay more for AR-enhanced dining; missing immersive = missed premium pricing + brand differentiation + social media buzz. `;
      alerts.push({
        rule_id: 'ar_immersive_dining_experience_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_immersive_dining: d.has_immersive_dining,
        immersive_dining_type: d.immersive_dining_type,
        immersive_dining_covers_monthly: d.immersive_dining_covers_monthly,
        immersive_dining_revenue_per_cover: d.immersive_dining_revenue_per_cover,
        immersive_dining_revenue_monthly: d.immersive_dining_revenue_monthly,
        customer_satisfaction_ar_score: d.customer_satisfaction_ar_score,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        monthly_revenue: d.monthly_revenue,
        immersive_revenue_projected: expectedImmersiveRevenue,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `IMMERSIVE DINING EXPERIENCE ABSENT: ${d.location_id} — immersive dining ${d.has_immersive_dining ? 'present' : 'ABSENT'}; type ${d.immersive_dining_type}; covers/month ${d.immersive_dining_covers_monthly}; revenue/cover ${fmt$(d.immersive_dining_revenue_per_cover)}; revenue/month ${fmt$(d.immersive_dining_revenue_monthly)}; satisfaction ${d.customer_satisfaction_ar_score}/100; competitor AR ${d.competitor_ar_menu_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: immersive dining (projection mapping, virtual ambiance) = premium experience ($50-200/cover); TeamLab, Sublimotion, Ultraviolet charge $500-2,500/cover for full immersive dining; immersive dining types = projection mapping (table/wall projections synchronized with courses), virtual ambiance (AR room transformation — beach, forest, space), interactive table (touch-responsive projections), multi-sensory (sound + light + scent + projection), full immersive (360-degree room projection, synchronized courses); 45% of customers would pay more for AR-enhanced dining experience; immersive dining attracts premium customers + generates social media buzz (Instagram, TikTok viral content); immersive dining cost = $10k-100k setup (projection equipment, content creation) + $500-2,000/month (content refresh, maintenance); immersive dining ROI = $5-15 per $1 spent (premium pricing + covers + social media value). Solutions ranked by impact: (1) LAUNCH immersive dining — immersive revenue ${fmt$(expectedImmersiveRevenue)}/mo + premium pricing ${fmt$(expectedPremiumPricing)}/mo + brand differentiation ${fmt$(expectedBrandDifferentiation)}/mo + social media ${fmt$(expectedSocialMediaLift)}/mo; cost ${fmt$(20000)} setup + ${fmt$(1000)}/mo; payback 4-8 months; (2) CHOOSE immersive type (projection mapping, virtual ambiance, interactive table, multi-sensory, full immersive); (3) DESIGN immersive content (synchronized with courses, themed); (4) INVEST in projection equipment ($5k-50k depending on type); (5) CREATE content (projections, sounds, scents); (6) SET premium pricing ($50-200/cover for projection mapping, $500-2,500 for full immersive); (7) MARKET as exclusive experience (limited covers, reservations); (8) GENERATE social media buzz (Instagram, TikTok — encourage photos/videos); (9) TRACK covers/month; (10) TRACK revenue/cover; (11) TRACK satisfaction; (12) BENCHMARK vs competitor immersive dining. Industry data: $50-200/cover (projection mapping); $500-2,500/cover (full immersive); 45% would pay more; payback 4-8 months. Expected impact: +${fmt$(expectedImmersiveRevenue)}/mo immersive revenue, +${targetSatisfactionLiftPts}pts satisfaction, payback 4-8 months.`,
        ai_recommendation: 'launch_immersive_dining',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: AR_ALLERGEN_NUTRITION_OVERLAY_ABSENT
    if (d.has_ar_menu_strategy && config.requireArAllergenNutritionOverlay && !d.has_ar_allergen_nutrition_overlay) {
      const expectedSafetyLift = Math.round(baselineRevenue * 0.02);
      const expectedHealthMarketCapture = Math.round(baselineRevenue * 0.025);
      const expectedOrderConfidence = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedSafetyLift + expectedHealthMarketCapture + expectedOrderConfidence + expectedCompetitiveLift, 1800);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO AR ALLERGEN/NUTRITION OVERLAY — allergen highlight accuracy 0; nutrition overlay accuracy 0; AR allergen visualization (highlight allergens in 3D) improves safety; AR nutrition overlay (calories, macros on 3D food) attracts health-conscious; 68% want nutritional information (IFIC); 45% choose restaurants based on dietary options (NRA); FDA requires calorie labeling (chains 20+); missing overlay = missed safety + health market + compliance. `;
      alerts.push({
        rule_id: 'ar_allergen_nutrition_overlay_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_allergen_nutrition_overlay: d.has_ar_allergen_nutrition_overlay,
        ar_allergen_highlight_accuracy: d.ar_allergen_highlight_accuracy,
        ar_nutrition_overlay_accuracy: d.ar_nutrition_overlay_accuracy,
        has_ar_food_visualization: d.has_ar_food_visualization,
        ar_food_models_count: d.ar_food_models_count,
        customer_satisfaction_ar_score: d.customer_satisfaction_ar_score,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        monthly_revenue: d.monthly_revenue,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR ALLERGEN/NUTRITION OVERLAY ABSENT: ${d.location_id} — AR allergen/nutrition overlay ${d.has_ar_allergen_nutrition_overlay ? 'present' : 'ABSENT'}; allergen highlight accuracy ${d.ar_allergen_highlight_accuracy}/100; nutrition overlay accuracy ${d.ar_nutrition_overlay_accuracy}/100; AR food visualization ${d.has_ar_food_visualization ? 'present' : 'ABSENT'} (${d.ar_food_models_count} models); satisfaction ${d.customer_satisfaction_ar_score}/100; competitor AR ${d.competitor_ar_menu_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: AR allergen visualization (highlight allergens in 3D model — e.g., nuts glow red, dairy glows yellow) improves safety (32M Americans have food allergies, 200+ die annually from anaphylaxis — FDA, AAAAI); AR nutrition overlay (calories, macros shown on 3D food) attracts health-conscious (68% want nutritional information — IFIC; 45% choose restaurants based on dietary options — NRA); FDA requires calorie labeling for chains 20+ locations (FDA Menu Labeling Rule, 2018 — non-compliance = $500-1,000/item/day); AR allergen/nutrition overlay types = allergen highlight (color-coded glow on 3D food for 8 major allergens), calorie overlay (calorie count floating on 3D food), macro overlay (protein/carbs/fat breakdown), ingredient list (scrollable on 3D food), dietary labels (vegan, gluten-free, keto badges); AR allergen/nutrition overlay accuracy = 90%+ (must be accurate for safety); AR allergen/nutrition overlay cost = $100-500/month (data integration + overlay development); AR allergen/nutrition overlay ROI = $5-10 per $1 (safety + health market + compliance). Solutions ranked by impact: (1) DEPLOY AR allergen/nutrition overlay — safety ${fmt$(expectedSafetyLift)}/mo + health market ${fmt$(expectedHealthMarketCapture)}/mo + order confidence ${fmt$(expectedOrderConfidence)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo; payback 1-2 months; (2) INTEGRATE with recipe/ingredient database (real-time allergen data); (3) CREATE allergen highlight overlay (color-coded glow for 8 major allergens); (4) CREATE calorie overlay (calorie count on 3D food); (5) CREATE macro overlay (protein/carbs/fat); (6) CREATE ingredient list (scrollable); (7) CREATE dietary labels (vegan, gluten-free, keto); (8) ENSURE accuracy 90%+ (safety requirement); (9) COMPLY with FDA calorie labeling (chains 20+); (10) TRACK allergen inquiries (reduction); (11) TRACK health-conscious orders (growth); (12) BENCHMARK vs competitor allergen/nutrition transparency. Industry data: 32M food allergies (FDA); 68% want nutrition info (IFIC); 45% choose based on dietary (NRA); payback 1-2 months. Expected impact: +12pts satisfaction, +safety, payback 1-2 months.`,
        ai_recommendation: 'deploy_ar_allergen_nutrition',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: AR_MULTILINGUAL_VISUAL_MENU_ABSENT
    if (d.has_ar_menu_strategy && config.requireArMultilingualVisualMenu && (!d.has_ar_multilingual_visual_menu || d.ar_languages_supported_count < 2)) {
      const expectedMultilingualCapture = Math.round(baselineRevenue * 0.03);
      const expectedOrderConfidence = Math.round(baselineRevenue * 0.015);
      const expectedErrorReduction = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedMultilingualCapture + expectedOrderConfidence + expectedErrorReduction + expectedCompetitiveLift, 1600);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO AR MULTILINGUAL VISUAL MENU — languages supported ${d.ar_languages_supported_count}; multilingual usage ${d.ar_multilingual_usage_pct}%; AR visual menu transcends language barrier (22% of US households speak non-English — Census); 3D food visualization is language-agnostic (visual = universal); missing multilingual = missed non-English customers + order errors from language barrier. `;
      alerts.push({
        rule_id: 'ar_multilingual_visual_menu_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_multilingual_visual_menu: d.has_ar_multilingual_visual_menu,
        ar_languages_supported_count: d.ar_languages_supported_count,
        ar_multilingual_usage_pct: d.ar_multilingual_usage_pct,
        has_ar_food_visualization: d.has_ar_food_visualization,
        ar_food_models_count: d.ar_food_models_count,
        customer_satisfaction_ar_score: d.customer_satisfaction_ar_score,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        monthly_revenue: d.monthly_revenue,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR MULTILINGUAL VISUAL MENU ABSENT: ${d.location_id} — AR multilingual ${d.has_ar_multilingual_visual_menu ? 'present' : 'ABSENT'}; languages ${d.ar_languages_supported_count}; multilingual usage ${d.ar_multilingual_usage_pct}%; AR food visualization ${d.has_ar_food_visualization ? 'present' : 'ABSENT'} (${d.ar_food_models_count} models); satisfaction ${d.customer_satisfaction_ar_score}/100; competitor AR ${d.competitor_ar_menu_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: AR visual menu transcends language barrier (22% of US households speak non-English at home — Census); 3D food visualization is language-agnostic (visual = universal — see food, understand portion, identify ingredients); AR multilingual visual menu types = language toggle (switch between languages), auto-detect (detect phone language), visual-only mode (no text, just 3D food + icons), dual-language (native + English side by side); AR multilingual visual menu benefits = captures non-English customers (22% of US households), reduces order errors from language barrier (misunderstanding dish names, ingredients), increases order confidence (visual = clear), enables tourism market (international visitors); AR multilingual visual menu cost = $200-500/month (translation + localization); AR multilingual visual menu ROI = $5-10 per $1 (non-English capture + error reduction + tourism). Solutions ranked by impact: (1) LAUNCH AR multilingual visual menu — multilingual capture ${fmt$(expectedMultilingualCapture)}/mo + order confidence ${fmt$(expectedOrderConfidence)}/mo + error reduction ${fmt$(expectedErrorReduction)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo; payback 1-2 months; (2) ADD top 2-4 languages (Spanish, Chinese, Tagalog — most common non-English); (3) ADD language toggle (switch between languages); (4) ADD auto-detect (detect phone language); (5) ADD visual-only mode (no text, just 3D food + icons); (6) ADD dual-language display (native + English); (7) TRANSLATE menu item names + descriptions; (8) LOCALIZE 3D models (culturally appropriate); (9) TRACK multilingual usage (which languages most used?); (10) TRACK non-English customer satisfaction; (11) BENCHMARK vs competitor multilingual support. Industry data: 22% non-English households (Census); visual = universal; payback 1-2 months. Expected impact: +10pts satisfaction, +non-English capture, payback 1-2 months.`,
        ai_recommendation: 'launch_ar_multilingual',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: AR_MENU_PLATFORM_OPTIMIZATION_ABSENT
    if (d.has_ar_menu_strategy && config.requireArMenuPlatformOptimization && (!d.has_ar_menu_platform_optimization || d.ar_menu_load_time_seconds > config.maxArMenuLoadTimeSeconds || d.ar_engagement_rate_pct < config.minArEngagementRatePct)) {
      const loadTimeGap = Math.max(d.ar_menu_load_time_seconds - config.maxArMenuLoadTimeSeconds, 0);
      const engagementGap = Math.max(config.minArEngagementRatePct - d.ar_engagement_rate_pct, 0);
      const expectedEngagementLift = Math.round(baselineRevenue * (engagementGap / 500));
      const expectedAbandonmentReduction = Math.round(d.total_customers_monthly * (loadTimeGap / 10) * d.avg_order_value_without_ar * 0.1);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedEngagementLift + expectedAbandonmentReduction + expectedSatisfactionLift + expectedCompetitiveLift, 1400);
      const severityLabel = d.ar_menu_load_time_seconds > 5 ? 'high' : 'medium';
      const criticalNote = (d.ar_menu_load_time_seconds > 5)
        ? `HIGH: AR MENU PLATFORM NOT OPTIMIZED — load time ${d.ar_menu_load_time_seconds}s (max ${config.maxArMenuLoadTimeSeconds}s); engagement rate ${d.ar_engagement_rate_pct}% (min ${config.minArEngagementRatePct}%); 60% of users abandon if AR takes >3 seconds to load (Google); poor performance = low engagement + abandonment; Snapchat AR pilots showed 45% engagement when optimized. `
        : `MEDIUM: AR PLATFORM BELOW TARGET — load time ${d.ar_menu_load_time_seconds}s (max ${config.maxArMenuLoadTimeSeconds}s); engagement ${d.ar_engagement_rate_pct}% (min ${config.minArEngagementRatePct}%); optimize for performance. `;
      alerts.push({
        rule_id: 'ar_menu_platform_optimization_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_menu_platform_optimization: d.has_ar_menu_platform_optimization,
        ar_menu_load_time_seconds: d.ar_menu_load_time_seconds,
        ar_menu_load_target_seconds: d.ar_menu_load_target_seconds,
        ar_engagement_rate_pct: d.ar_engagement_rate_pct,
        ar_engagement_target_pct: d.ar_engagement_target_pct,
        ar_menu_platform: d.ar_menu_platform,
        ar_food_models_count: d.ar_food_models_count,
        ar_food_model_quality_score: d.ar_food_model_quality_score,
        total_customers_monthly: d.total_customers_monthly,
        avg_order_value_without_ar: d.avg_order_value_without_ar,
        customer_satisfaction_ar_score: d.customer_satisfaction_ar_score,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        monthly_revenue: d.monthly_revenue,
        ar_menu_subscription_cost_monthly: d.ar_menu_subscription_cost_monthly,
        engagement_lift_projected_pct: targetEngagementLiftPct,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR MENU PLATFORM OPTIMIZATION ABSENT: ${d.location_id} — platform optimization ${d.has_ar_menu_platform_optimization ? 'present' : 'ABSENT'}; load time ${d.ar_menu_load_time_seconds}s (max ${config.maxArMenuLoadTimeSeconds}s, target ${d.ar_menu_load_target_seconds}s); engagement rate ${d.ar_engagement_rate_pct}% (min ${config.minArEngagementRatePct}%, target ${d.ar_engagement_target_pct}%); platform ${d.ar_menu_platform}; models ${d.ar_food_models_count}; quality ${d.ar_food_model_quality_score}/100; total customers ${d.total_customers_monthly}/mo; avg order value ${fmt$(d.avg_order_value_without_ar)}; satisfaction ${d.customer_satisfaction_ar_score}/100; competitor AR ${d.competitor_ar_menu_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 60% of users abandon if AR takes over 3 seconds to load (Google AR performance study); Snapchat AR menu pilots showed 45% engagement rate when optimized (load under 3s, smooth rendering); AR platform optimization = model compression (reduce 3D model file size), lazy loading (load models on demand), CDN (content delivery network for fast global access), device detection (optimize for phone capability), progressive loading (show placeholder then render), caching (store models locally); AR engagement rate = % of customers who interact with AR menu (target 25-45%); AR engagement rate benchmarks = Snapchat AR 45%, 8th Wall 35-40%, Apple ARKit 30-35%, Google ARCore 25-30%; AR platform optimization cost = $200-800/month (CDN + optimization tools); AR platform optimization ROI = $5-10 per $1 (engagement lift + abandonment reduction). Solutions ranked by impact: (1) OPTIMIZE AR platform — engagement lift ${fmt$(expectedEngagementLift)}/mo + abandonment reduction ${fmt$(expectedAbandonmentReduction)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(400)}/mo; payback 1-2 months; (2) COMPRESS 3D models (reduce file size without quality loss); (3) IMPLEMENT lazy loading (load models on demand); (4) USE CDN (content delivery network for fast global access); (5) ADD device detection (optimize for phone capability); (6) IMPLEMENT progressive loading (placeholder then render); (7) ENABLE caching (store models locally); (8) TARGET load time under ${config.maxArMenuLoadTimeSeconds}s; (9) TARGET engagement rate ${config.minArEngagementRatePct}%+; (10) TRACK load time per device; (11) TRACK engagement rate; (12) BENCHMARK vs competitor AR performance. Industry data: 60% abandon if over 3s (Google); 45% engagement when optimized (Snapchat); payback 1-2 months. Expected impact: +${targetEngagementLiftPct}% engagement, +10pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'optimize_ar_platform',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: AR_CONTENT_PRODUCTION_PROGRAM_ABSENT
    if (d.has_ar_menu_strategy && config.requireArContentProductionProgram && (!d.has_ar_content_production_program || d.ar_content_freshness_score < config.minArContentFreshnessScore)) {
      const freshnessGap = Math.max(config.minArContentFreshnessScore - d.ar_content_freshness_score, 0);
      const expectedEngagementLift = Math.round(baselineRevenue * (freshnessGap / 500));
      const expectedContentCostReduction = Math.round(d.ar_content_production_cost_monthly * 0.30);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedEngagementLift + expectedContentCostReduction + expectedSatisfactionLift + expectedCompetitiveLift, 1200);
      const severityLabel = d.ar_content_freshness_score < 50 ? 'medium' : 'low';
      const criticalNote = (d.ar_content_freshness_score < 50)
        ? `MEDIUM: NO AR CONTENT PRODUCTION PROGRAM — refresh frequency ${d.ar_content_refresh_frequency_months} months; freshness score ${d.ar_content_freshness_score}/100 (min ${config.minArContentFreshnessScore}); production cost ${fmt$(d.ar_content_production_cost_monthly)}/mo; without content production program, AR content goes stale = low engagement + high per-dish cost; stale content = customers see outdated 3D models (wrong portions, old plating). `
        : `LOW: AR CONTENT FRESHNESS BELOW TARGET — ${d.ar_content_freshness_score}/100 (min ${config.minArContentFreshnessScore}); improve content production for freshness. `;
      alerts.push({
        rule_id: 'ar_content_production_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_content_production_program: d.has_ar_content_production_program,
        ar_content_refresh_frequency_months: d.ar_content_refresh_frequency_months,
        ar_content_production_cost_monthly: d.ar_content_production_cost_monthly,
        ar_content_freshness_score: d.ar_content_freshness_score,
        ar_food_models_count: d.ar_food_models_count,
        ar_content_cost_per_dish: d.ar_content_cost_per_dish,
        ar_engagement_rate_pct: d.ar_engagement_rate_pct,
        customer_satisfaction_ar_score: d.customer_satisfaction_ar_score,
        competitor_ar_menu_score: d.competitor_ar_menu_score,
        monthly_revenue: d.monthly_revenue,
        content_freshness_lift_projected_pts: targetContentFreshnessLiftPts,
        engagement_lift_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR CONTENT PRODUCTION PROGRAM ABSENT: ${d.location_id} — content production ${d.has_ar_content_production_program ? 'present' : 'ABSENT'}; refresh frequency ${d.ar_content_refresh_frequency_months} months; production cost ${fmt$(d.ar_content_production_cost_monthly)}/mo; freshness score ${d.ar_content_freshness_score}/100 (min ${config.minArContentFreshnessScore}); models ${d.ar_food_models_count}; cost/dish ${fmt$(d.ar_content_cost_per_dish)}; engagement ${d.ar_engagement_rate_pct}%; satisfaction ${d.customer_satisfaction_ar_score}/100; competitor AR ${d.competitor_ar_menu_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without content production program, AR content goes stale = low engagement (customers see outdated 3D models — wrong portions, old plating, seasonal items missing) + high per-dish cost (ad hoc production is 2-3x more expensive than programmatic); AR content production program = regular refresh schedule (monthly or quarterly), dedicated 3D artist/team, batch production (multiple dishes at once), version control (track model versions), quality standards (photorealistic 80%+), seasonal updates (new menu items, holiday specials); AR content freshness = score 0-100 (100 = just updated, 75 = within 2 months, 50 = within 6 months, below 50 = stale); AR content production cost = $200-1,000 per dish (one-time) + $500-1,500/month (ongoing production for new items); AR content production ROI = $4-10 per $1 (engagement + satisfaction + cost reduction from batch production). Solutions ranked by impact: (1) ESTABLISH AR content production program — engagement lift ${fmt$(expectedEngagementLift)}/mo + content cost reduction ${fmt$(expectedContentCostReduction)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(600)}/mo (production program); payback 1-2 months; (2) SET refresh schedule (monthly or quarterly); (3) HIRE/CONTRACT dedicated 3D artist or team; (4) BATCH produce multiple dishes at once (cost reduction 30-50%); (5) IMPLEMENT version control (track model versions); (6) SET quality standards (photorealistic 80%+); (7) UPDATE seasonal items (new menu, holiday specials); (8) REFRESH stale models (over 6 months old); (9) TRACK freshness score (target ${config.minArContentFreshnessScore}+); (10) TRACK production cost per dish (target reduction); (11) BENCHMARK vs competitor AR content quality. Industry data: 30-50% cost reduction with batch production; payback 1-2 months. Expected impact: +${targetContentFreshnessLiftPts}pts freshness, +15% engagement, payback 1-2 months.`,
        ai_recommendation: 'establish_ar_content_production',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: AR_MENU_ROI_TRACKING_ABSENT
    if (d.has_ar_menu_strategy && config.requireArMenuRoiTracking && !d.has_ar_menu_roi_tracking) {
      const expectedRoiRecovery = Math.round((d.ar_order_value_lift_monthly + d.ar_error_reduction_savings_monthly + d.ar_printing_savings_monthly + d.ar_engagement_revenue_monthly) * 0.20);
      const expectedInvestmentOptimization = Math.round(d.ar_menu_investment_total * 0.001);
      const expectedWastedSpendRecovery = Math.round(d.ar_menu_investment_total * 0.0005);
      const expectedScalingLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedInvestmentOptimization + expectedWastedSpendRecovery + expectedScalingLift, 1000);
      const severityLabel = d.ar_menu_investment_total > 20000 ? 'medium' : 'low';
      const criticalNote = (d.ar_menu_investment_total > 20000)
        ? `MEDIUM: NO AR MENU ROI TRACKING — investment ${fmt$(d.ar_menu_investment_total)} but no ROI tracking; without tracking, can't identify which AR features drive revenue = wasted 15-20% of investment; AR menu ROI tracking = order value lift, error reduction savings, printing savings, engagement revenue, ROAS. `
        : `LOW: NO AR MENU ROI TRACKING — implement tracking to optimize AR investment. `;
      alerts.push({
        rule_id: 'ar_menu_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_ar_menu_roi_tracking: d.has_ar_menu_roi_tracking,
        ar_menu_investment_total: d.ar_menu_investment_total,
        ar_order_value_lift_monthly: d.ar_order_value_lift_monthly,
        ar_error_reduction_savings_monthly: d.ar_error_reduction_savings_monthly,
        ar_printing_savings_monthly: d.ar_printing_savings_monthly,
        ar_engagement_revenue_monthly: d.ar_engagement_revenue_monthly,
        ar_menu_roas: d.ar_menu_roas,
        ar_menu_adoption_pct: d.ar_menu_adoption_pct,
        monthly_revenue: d.monthly_revenue,
        roi_lift_projected_pct: targetRoiLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AR MENU ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_ar_menu_roi_tracking ? 'present' : 'ABSENT'}; investment ${fmt$(d.ar_menu_investment_total)}; order value lift ${fmt$(d.ar_order_value_lift_monthly)}/mo; error reduction savings ${fmt$(d.ar_error_reduction_savings_monthly)}/mo; printing savings ${fmt$(d.ar_printing_savings_monthly)}/mo; engagement revenue ${fmt$(d.ar_engagement_revenue_monthly)}/mo; ROAS ${d.ar_menu_roas}x; adoption ${d.ar_menu_adoption_pct}%; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without ROI tracking, restaurants waste 15-20% of AR investment on underperforming features; AR menu ROI tracking = order value lift (compare AR vs non-AR order value), error reduction savings (compare error rates), printing savings (menu printing cost reduction), engagement revenue (social media, brand buzz), ROAS (revenue / cost); ROI tracking tools = POS integration (track AR vs non-AR orders), A/B testing (compare with/without AR), analytics dashboard (per-feature metrics); ROI metrics = ROAS (target ${config.minArMenuRoas}x+), payback period (target 3-6 months), order value lift per feature (target $0.50-2.00 per AR order), error reduction (target 30-40%); ROI tracking best practice = track per feature (which AR features drive most ROI?), audit quarterly (scale winners, cut losers). Solutions ranked by impact: (1) IMPLEMENT AR menu ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + investment optimization ${fmt$(expectedInvestmentOptimization)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + scaling ${fmt$(expectedScalingLift)}/mo; cost ${fmt$(200)}/mo (analytics tool); payback immediate; (2) INTEGRATE POS (track AR vs non-AR orders); (3) CONDUCT A/B testing (compare with/without AR); (4) BUILD analytics dashboard (per-feature metrics); (5) TRACK ROAS per feature (target ${config.minArMenuRoas}x+); (6) TRACK order value lift (AR vs non-AR); (7) TRACK error reduction (AR vs non-AR); (8) TRACK engagement revenue; (9) AUDIT quarterly (scale winners, cut losers); (10) BENCHMARK vs competitor AR ROI. Industry data: 15-20% wasted investment without tracking; payback immediate. Expected impact: +${targetRoiLiftPct}% ROI, +${fmt$(expectedRoiRecovery)}/mo ROI recovery, payback immediate.`,
        ai_recommendation: 'implement_ar_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM ar_menu_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE ar_menu_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant augmented reality (AR) menu and immersive dining expert. Given AR menu data, recommend ONE specific action with expected order value lift, error reduction, engagement lift, immersive revenue, or satisfaction lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. AR menu strategy: ${a.has_ar_menu_strategy ?? false} (platform: ${a.ar_menu_platform ?? 'none'}, adoption ${a.ar_menu_adoption_pct ?? 0}%/${a.ar_menu_adoption_target_pct ?? 35}% target). AR food visualization: ${a.has_ar_food_visualization ?? false} (${a.ar_food_models_count ?? 0}/${a.ar_food_models_target_count ?? 15} models, quality ${a.ar_food_model_quality_score ?? 0}/100). Immersive dining: ${a.has_immersive_dining ?? false} (${a.immersive_dining_type ?? 'none'}, ${a.immersive_dining_covers_monthly ?? 0} covers/mo, ${fmt$(a.immersive_dining_revenue_per_cover ?? 0)}/cover, ${fmt$(a.immersive_dining_revenue_monthly ?? 0)}/mo). Allergen/nutrition: ${a.has_ar_allergen_nutrition_overlay ?? false} (allergen accuracy ${a.ar_allergen_highlight_accuracy ?? 0}/100, nutrition ${a.ar_nutrition_overlay_accuracy ?? 0}/100). Multilingual: ${a.has_ar_multilingual_visual_menu ?? false} (${a.ar_languages_supported_count ?? 0} languages, ${a.ar_multilingual_usage_pct ?? 0}% usage). Platform optimization: ${a.has_ar_menu_platform_optimization ?? false} (load time ${a.ar_menu_load_time_seconds ?? 0}s/${a.ar_menu_load_target_seconds ?? 3}s target, engagement ${a.ar_engagement_rate_pct ?? 0}%/${a.ar_engagement_target_pct ?? 35}% target). Content production: ${a.has_ar_content_production_program ?? false} (refresh ${a.ar_content_refresh_frequency_months ?? 0}mo, cost ${fmt$(a.ar_content_production_cost_monthly ?? 0)}/mo, freshness ${a.ar_content_freshness_score ?? 0}/100). ROI tracking: ${a.has_ar_menu_roi_tracking ?? false} (investment ${fmt$(a.ar_menu_investment_total ?? 0)}, order value lift ${fmt$(a.ar_order_value_lift_monthly ?? 0)}/mo, error savings ${fmt$(a.ar_error_reduction_savings_monthly ?? 0)}/mo, ROAS ${a.ar_menu_roas ?? 0}x). Order value: without AR ${fmt$(a.avg_order_value_without_ar ?? 0)}, with AR ${fmt$(a.avg_order_value_with_ar ?? 0)}. Error rate: without AR ${a.order_error_rate_without_ar_pct ?? 0}%, with AR ${a.order_error_rate_with_ar_pct ?? 0}%. Complaint rate: without AR ${a.complaint_rate_without_ar_pct ?? 0}%, with AR ${a.complaint_rate_with_ar_pct ?? 0}%. Satisfaction: AR ${a.customer_satisfaction_ar_score ?? 0}/100, non-AR ${a.customer_satisfaction_non_ar_score ?? 0}/100. Gen Z/millennial: ${a.gen_z_millennial_customer_pct ?? 0}%. Competitor AR: ${a.competitor_ar_menu_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Total menu items: ${a.total_menu_items ?? 0}. Total customers: ${a.total_customers_monthly ?? 0}/mo. Dev cost: ${fmt$(a.ar_menu_development_cost ?? 0)}. Subscription: ${fmt$(a.ar_menu_subscription_cost_monthly ?? 0)}/mo. Content cost/dish: ${fmt$(a.ar_content_cost_per_dish ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveArMenuAlerts = async (db: ReturnType<typeof useDB>): Promise<ArMenuAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM ar_menu_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getArMenuSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  arMenuStrategyAbsentCount: number;
  arFoodVisualizationAbsentCount: number;
  arImmersiveDiningExperienceAbsentCount: number;
  arAllergenNutritionOverlayAbsentCount: number;
  arMultilingualVisualMenuAbsentCount: number;
  arMenuPlatformOptimizationAbsentCount: number;
  arContentProductionProgramAbsentCount: number;
  arMenuRoiTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'ar_menu_strategy_absent') AS nostrategy,
              math::count(rule_id = 'ar_food_visualization_absent') AS novisualization,
              math::count(rule_id = 'ar_immersive_dining_experience_absent') AS noimmersive,
              math::count(rule_id = 'ar_allergen_nutrition_overlay_absent') AS noallergen,
              math::count(rule_id = 'ar_multilingual_visual_menu_absent') AS nomultilingual,
              math::count(rule_id = 'ar_menu_platform_optimization_absent') AS noplatform,
              math::count(rule_id = 'ar_content_production_program_absent') AS nocontent,
              math::count(rule_id = 'ar_menu_roi_tracking_absent') AS noroi
       FROM ar_menu_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      arMenuStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      arFoodVisualizationAbsentCount: safeNumber(r.novisualization, 0),
      arImmersiveDiningExperienceAbsentCount: safeNumber(r.noimmersive, 0),
      arAllergenNutritionOverlayAbsentCount: safeNumber(r.noallergen, 0),
      arMultilingualVisualMenuAbsentCount: safeNumber(r.nomultilingual, 0),
      arMenuPlatformOptimizationAbsentCount: safeNumber(r.noplatform, 0),
      arContentProductionProgramAbsentCount: safeNumber(r.nocontent, 0),
      arMenuRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, arMenuStrategyAbsentCount: 0, arFoodVisualizationAbsentCount: 0, arImmersiveDiningExperienceAbsentCount: 0, arAllergenNutritionOverlayAbsentCount: 0, arMultilingualVisualMenuAbsentCount: 0, arMenuPlatformOptimizationAbsentCount: 0, arContentProductionProgramAbsentCount: 0, arMenuRoiTrackingAbsentCount: 0 };
  }
};

export const updateArMenuAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
