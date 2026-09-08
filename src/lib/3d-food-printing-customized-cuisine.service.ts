/**
 * AI 3D Food Printing & Customized Cuisine Optimizer — predicts how 3D food
 * printing technology (personalized nutrition printing, customized shape/texture,
 * dietary restriction printing, multi-ingredient extrusion, precision portion
 * control, novel food creation, aesthetic plating automation, ingredient
 * efficiency, customer co-creation, premium pricing, ROI tracking) impacts
 * menu differentiation, food cost reduction, customer personalization,
 * dietary compliance, premium pricing, and competitive advantage.
 *
 * 3D food printing market = $5.B+ by 2030 (Markets and Markets), growing
 * 45%+ CAGR. Foodini (Natural Machines) = leading commercial food printer
 * ($4,000-8,000 per unit). 3D food printing enables personalized nutrition
 * (print food with exact macros, vitamins, calories per individual).
 * 3D printed food = 30-50% premium pricing (novelty + personalization).
 * 3D food printing reduces food waste 20-30% (precision portioning, no
 * trim waste). 3D printing enables dietary restriction compliance (gluten-
 * free, vegan, allergen-free printing with exact ingredient control).
 * 3D printed food attracts Gen Z/millennials — 65% would try 3D printed
 * food (Mintel). 3D food printing enables novel shapes/textures impossible
 * by hand (intricate chocolate sculptures, geometric pasta, layered
 * proteins). 3D food printing = automated plating (consistent, fast,
 * labor-saving). 3D printing reduces skilled labor dependency (no chef
 * needed for complex plating). 3D food printing enables customer co-
 * creation (customers design their own food shapes). 3D printed food
 * generates social media buzz = $500-2,000/month marketing value. 3D food
 * printing platforms: Foodini (Natural Machines), byFlow, 3D Systems
 * ChefJet, BeeHex. 3D food printing materials: chocolate, dough, cheese,
 * pureed vegetables, protein pastes, sugar. 3D food printing cost =
 * $4k-15k per printer + $200-600/month consumables. 3D food printing ROI
 * = $4-12 per $1 (premium pricing + waste reduction + labor savings +
 * personalization value). 40% of fine dining restaurants plan 3D food
 * printing by 2028 (Restaurant Hospitality). 3D printed food is
 * Instagram-worthy = viral social media content. 3D food printing enables
 * personalized nutrition for health-conscious customers (exact macros,
 * allergen avoidance, calorie control). NASA uses 3D food printing for
 * space missions = proven technology.
 *
 * 214th POSR-exclusive differentiator. Distinct from:
 *   - kitchen-robotics-automation.service (208th) — ROBOTICS for cooking
 *     (fryers, grills, dishwashers). This optimizer focuses on 3D PRINTING
 *     for food creation (novel shapes, personalized nutrition, plating).
 *   - menu-optimization.service — BCG menu matrix (which items to keep).
 *     This optimizer focuses on 3D printing new items (novel creation).
 *   - recipe-optimization.service — optimizes EXISTING recipes. This
 *     optimizer creates NEW recipes via 3D printing (novel shapes/textures).
 *   - nutritional-transparency.service — nutritional DISPLAY. This optimizer
 *     focuses on nutritional CREATION (print exact macros into food).
 *   - menu-photography-impact.service — PHOTOGRAPHY impact. This optimizer
 *     focuses on 3D printed food as visual/marketing differentiator.
 *   - tabletop-entertainment-activity.service — tabletop GAMES. This
 *     optimizer focuses on 3D food printing as entertainment/co-creation.
 *   - allergen-risk.service — allergen CROSS-CONTAMINATION detection.
 *     This optimizer focuses on 3D printing ALLERGEN-FREE food (exact
 *     ingredient control).
 *   - recipe-substitution.service — ingredient SUBSTITUTIONS. This
 *     optimizer creates entirely NEW food forms via 3D printing.
 *   - food-display-pastry-case.service — food DISPLAY. This optimizer
 *     focuses on 3D printing food as display/marketing differentiator.
 *
 * 8 AI rules:
 *   1. food_3d_printing_strategy_absent -> no 3D printing -> missed $5B market + 30-50% premium
 *   2. personalized_nutrition_printing_absent -> no personalized nutrition -> missed health market
 *   3. dietary_restriction_printing_absent -> no allergen-free printing -> missed dietary market
 *   4. novel_food_creation_absent -> no novel shapes/textures -> missed differentiation
 *   5. precision_portion_control_absent -> no precision portioning -> missed 20-30% waste reduction
 *   6. automated_plating_absent -> no automated plating -> missed labor savings + consistency
 *   7. customer_co_creation_absent -> no customer co-creation -> missed engagement + social media
 *   8. food_3d_printing_roi_tracking_absent -> no ROI tracking -> can't optimize printer deployment
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type Food3dPrintingRuleId =
  | 'food_3d_printing_strategy_absent'
  | 'personalized_nutrition_printing_absent'
  | 'dietary_restriction_printing_absent'
  | 'novel_food_creation_absent'
  | 'precision_portion_control_absent'
  | 'automated_plating_absent'
  | 'customer_co_creation_absent'
  | 'food_3d_printing_roi_tracking_absent';

export type Food3dPrintingAiRec =
  'launch_3d_food_printing_strategy'
  | 'implement_personalized_nutrition'
  | 'implement_dietary_restriction_printing'
  | 'launch_novel_food_creation'
  | 'implement_precision_portioning'
  | 'implement_automated_plating'
  | 'launch_customer_co_creation'
  | 'implement_3d_printing_roi_tracking'
  | 'monitor'
  | 'skip';

export interface Food3dPrintingAlert {
  id?: string;
  rule_id: Food3dPrintingRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  has_food_3d_printing_strategy?: boolean;
  printer_brand?: string;
  printer_count?: number;
  printer_target_count?: number;
  has_personalized_nutrition_printing?: boolean;
  personalized_nutrition_customers_monthly?: number;
  personalized_nutrition_revenue_per_dish?: number;
  personalized_nutrition_target_pct?: number;
  has_dietary_restriction_printing?: boolean;
  allergen_free_printing_enabled?: boolean;
  gluten_free_printing_enabled?: boolean;
  vegan_printing_enabled?: boolean;
  dietary_restriction_dishes_count?: number;
  has_novel_food_creation?: boolean;
  novel_dishes_count?: number;
  novel_dish_revenue_monthly?: number;
  social_media_value_monthly?: number;
  has_precision_portion_control?: boolean;
  food_waste_reduction_pct?: number;
  food_waste_reduction_target_pct?: number;
  ingredient_efficiency_score?: number;
  has_automated_plating?: boolean;
  plating_automation_pct?: number;
  plating_time_per_dish_seconds?: number;
  plating_time_target_seconds?: number;
  plating_consistency_score?: number;
  has_customer_co_creation?: boolean;
  co_creation_participation_pct?: number;
  co_creation_engagement_rate_pct?: number;
  co_creation_social_shares_monthly?: number;
  has_food_3d_printing_roi_tracking?: boolean;
  printer_investment_total?: number;
  premium_pricing_revenue_monthly?: number;
  waste_reduction_savings_monthly?: number;
  labor_savings_monthly?: number;
  social_media_value_monthly_roi?: number;
  food_3d_printing_roas?: number;
  avg_ticket_3d_printed?: number;
  avg_ticket_traditional?: number;
  customer_satisfaction_3d_score?: number;
  customer_satisfaction_traditional_score?: number;
  gen_z_millennial_interest_pct?: number;
  competitor_3d_printing_score?: number;
  monthly_revenue?: number;
  total_dishes_monthly?: number;
  printer_cost_per_unit?: number;
  consumables_cost_monthly?: number;
  maintenance_cost_monthly?: number;
  premium_pricing_projected_pct?: number;
  waste_reduction_projected_pct?: number;
  personalization_revenue_projected?: number;
  differentiation_lift_projected_pts?: number;
  labor_savings_projected_pct?: number;
  consistency_lift_projected_pts?: number;
  satisfaction_lift_projected_pts?: number;
  engagement_lift_projected_pct?: number;
  social_media_value_projected?: number;
  roi_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: Food3dPrintingAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface Food3dPrintingConfig {
  aiEnabled: boolean;
  requireFood3dPrintingStrategy: boolean;
  requirePersonalizedNutritionPrinting: boolean;
  requireDietaryRestrictionPrinting: boolean;
  requireNovelFoodCreation: boolean;
  requirePrecisionPortionControl: boolean;
  requireAutomatedPlating: boolean;
  requireCustomerCoCreation: boolean;
  requireFood3dPrintingRoiTracking: boolean;
  minPrinterCount: number;
  minPersonalizedNutritionTargetPct: number;
  minDietaryRestrictionDishesCount: number;
  minNovelDishesCount: number;
  minFoodWasteReductionPct: number;
  minPlatingAutomationPct: number;
  minCoCreationParticipationPct: number;
  minFood3dPrintingRoas: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_FOOD_3D_PRINTING_CONFIG: Food3dPrintingConfig = {
  aiEnabled: true,
  requireFood3dPrintingStrategy: true,
  requirePersonalizedNutritionPrinting: true,
  requireDietaryRestrictionPrinting: true,
  requireNovelFoodCreation: true,
  requirePrecisionPortionControl: true,
  requireAutomatedPlating: true,
  requireCustomerCoCreation: true,
  requireFood3dPrintingRoiTracking: true,
  minPrinterCount: 1,
  minPersonalizedNutritionTargetPct: 5,
  minDietaryRestrictionDishesCount: 3,
  minNovelDishesCount: 2,
  minFoodWasteReductionPct: 15,
  minPlatingAutomationPct: 30,
  minCoCreationParticipationPct: 10,
  minFood3dPrintingRoas: 3,
  preferCompetitorParity: true,
};

export const readFood3dPrintingConfig = (settings: any): Food3dPrintingConfig => ({
  aiEnabled: settings?.food_3d_printing_ai_enabled ?? true,
  requireFood3dPrintingStrategy: settings?.food_3d_printing_require_strategy ?? true,
  requirePersonalizedNutritionPrinting: settings?.food_3d_printing_require_nutrition ?? true,
  requireDietaryRestrictionPrinting: settings?.food_3d_printing_require_dietary ?? true,
  requireNovelFoodCreation: settings?.food_3d_printing_require_novel ?? true,
  requirePrecisionPortionControl: settings?.food_3d_printing_require_portion ?? true,
  requireAutomatedPlating: settings?.food_3d_printing_require_plating ?? true,
  requireCustomerCoCreation: settings?.food_3d_printing_require_co_creation ?? true,
  requireFood3dPrintingRoiTracking: settings?.food_3d_printing_require_roi ?? true,
  minPrinterCount: safeNumber(settings?.food_3d_printing_min_printers, 1),
  minPersonalizedNutritionTargetPct: safeNumber(settings?.food_3d_printing_min_nutrition_pct, 5),
  minDietaryRestrictionDishesCount: safeNumber(settings?.food_3d_printing_min_dietary_dishes, 3),
  minNovelDishesCount: safeNumber(settings?.food_3d_printing_min_novel_dishes, 2),
  minFoodWasteReductionPct: safeNumber(settings?.food_3d_printing_min_waste_reduction, 15),
  minPlatingAutomationPct: safeNumber(settings?.food_3d_printing_min_plating_auto, 30),
  minCoCreationParticipationPct: safeNumber(settings?.food_3d_printing_min_co_creation, 10),
  minFood3dPrintingRoas: safeNumber(settings?.food_3d_printing_min_roas, 3),
  preferCompetitorParity: settings?.food_3d_printing_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface Food3dPrintingData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_food_3d_printing_strategy: boolean;
  printer_brand: string;
  printer_count: number;
  printer_target_count: number;
  has_personalized_nutrition_printing: boolean;
  personalized_nutrition_customers_monthly: number;
  personalized_nutrition_revenue_per_dish: number;
  personalized_nutrition_target_pct: number;
  has_dietary_restriction_printing: boolean;
  allergen_free_printing_enabled: boolean;
  gluten_free_printing_enabled: boolean;
  vegan_printing_enabled: boolean;
  dietary_restriction_dishes_count: number;
  has_novel_food_creation: boolean;
  novel_dishes_count: number;
  novel_dish_revenue_monthly: number;
  social_media_value_monthly: number;
  has_precision_portion_control: boolean;
  food_waste_reduction_pct: number;
  food_waste_reduction_target_pct: number;
  ingredient_efficiency_score: number;
  has_automated_plating: boolean;
  plating_automation_pct: number;
  plating_time_per_dish_seconds: number;
  plating_time_target_seconds: number;
  plating_consistency_score: number;
  has_customer_co_creation: boolean;
  co_creation_participation_pct: number;
  co_creation_engagement_rate_pct: number;
  co_creation_social_shares_monthly: number;
  has_food_3d_printing_roi_tracking: boolean;
  printer_investment_total: number;
  premium_pricing_revenue_monthly: number;
  waste_reduction_savings_monthly: number;
  labor_savings_monthly: number;
  social_media_value_monthly_roi: number;
  food_3d_printing_roas: number;
  avg_ticket_3d_printed: number;
  avg_ticket_traditional: number;
  customer_satisfaction_3d_score: number;
  customer_satisfaction_traditional_score: number;
  gen_z_millennial_interest_pct: number;
  competitor_3d_printing_score: number;
  monthly_revenue: number;
  total_dishes_monthly: number;
  printer_cost_per_unit: number;
  consumables_cost_monthly: number;
  maintenance_cost_monthly: number;
}

const MOCK_DATA: Food3dPrintingData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_food_3d_printing_strategy: false, printer_brand: 'none',
    printer_count: 0, printer_target_count: 2,
    has_personalized_nutrition_printing: false,
    personalized_nutrition_customers_monthly: 0,
    personalized_nutrition_revenue_per_dish: 0,
    personalized_nutrition_target_pct: 5,
    has_dietary_restriction_printing: false,
    allergen_free_printing_enabled: false, gluten_free_printing_enabled: false,
    vegan_printing_enabled: false, dietary_restriction_dishes_count: 0,
    has_novel_food_creation: false, novel_dishes_count: 0,
    novel_dish_revenue_monthly: 0, social_media_value_monthly: 0,
    has_precision_portion_control: false, food_waste_reduction_pct: 0,
    food_waste_reduction_target_pct: 20, ingredient_efficiency_score: 48,
    has_automated_plating: false, plating_automation_pct: 0,
    plating_time_per_dish_seconds: 0, plating_time_target_seconds: 60,
    plating_consistency_score: 62,
    has_customer_co_creation: false, co_creation_participation_pct: 0,
    co_creation_engagement_rate_pct: 0, co_creation_social_shares_monthly: 0,
    has_food_3d_printing_roi_tracking: false, printer_investment_total: 0,
    premium_pricing_revenue_monthly: 0, waste_reduction_savings_monthly: 0,
    labor_savings_monthly: 0, social_media_value_monthly_roi: 0,
    food_3d_printing_roas: 0,
    avg_ticket_3d_printed: 0, avg_ticket_traditional: 32,
    customer_satisfaction_3d_score: 0, customer_satisfaction_traditional_score: 68,
    gen_z_millennial_interest_pct: 58, competitor_3d_printing_score: 52,
    monthly_revenue: 86000, total_dishes_monthly: 4200,
    printer_cost_per_unit: 6000, consumables_cost_monthly: 0,
    maintenance_cost_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_food_3d_printing_strategy: true, printer_brand: 'Foodini (Natural Machines)',
    printer_count: 1, printer_target_count: 2,
    has_personalized_nutrition_printing: false,
    personalized_nutrition_customers_monthly: 0,
    personalized_nutrition_revenue_per_dish: 0,
    personalized_nutrition_target_pct: 5,
    has_dietary_restriction_printing: false,
    allergen_free_printing_enabled: false, gluten_free_printing_enabled: true,
    vegan_printing_enabled: false, dietary_restriction_dishes_count: 1,
    has_novel_food_creation: true, novel_dishes_count: 2,
    novel_dish_revenue_monthly: 480, social_media_value_monthly: 300,
    has_precision_portion_control: false, food_waste_reduction_pct: 5,
    food_waste_reduction_target_pct: 20, ingredient_efficiency_score: 62,
    has_automated_plating: false, plating_automation_pct: 10,
    plating_time_per_dish_seconds: 120, plating_time_target_seconds: 60,
    plating_consistency_score: 68,
    has_customer_co_creation: false, co_creation_participation_pct: 0,
    co_creation_engagement_rate_pct: 8, co_creation_social_shares_monthly: 12,
    has_food_3d_printing_roi_tracking: false, printer_investment_total: 8000,
    premium_pricing_revenue_monthly: 480, waste_reduction_savings_monthly: 80,
    labor_savings_monthly: 120, social_media_value_monthly_roi: 300,
    food_3d_printing_roas: 0,
    avg_ticket_3d_printed: 42, avg_ticket_traditional: 28,
    customer_satisfaction_3d_score: 78, customer_satisfaction_traditional_score: 72,
    gen_z_millennial_interest_pct: 62, competitor_3d_printing_score: 68,
    monthly_revenue: 152000, total_dishes_monthly: 6800,
    printer_cost_per_unit: 8000, consumables_cost_monthly: 200,
    maintenance_cost_monthly: 100,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_food_3d_printing_strategy: true, printer_brand: 'Foodini + byFlow',
    printer_count: 3, printer_target_count: 2,
    has_personalized_nutrition_printing: true,
    personalized_nutrition_customers_monthly: 48,
    personalized_nutrition_revenue_per_dish: 48,
    personalized_nutrition_target_pct: 5,
    has_dietary_restriction_printing: true,
    allergen_free_printing_enabled: true, gluten_free_printing_enabled: true,
    vegan_printing_enabled: true, dietary_restriction_dishes_count: 5,
    has_novel_food_creation: true, novel_dishes_count: 6,
    novel_dish_revenue_monthly: 2400, social_media_value_monthly: 1200,
    has_precision_portion_control: true, food_waste_reduction_pct: 22,
    food_waste_reduction_target_pct: 20, ingredient_efficiency_score: 82,
    has_automated_plating: true, plating_automation_pct: 38,
    plating_time_per_dish_seconds: 55, plating_time_target_seconds: 60,
    plating_consistency_score: 88,
    has_customer_co_creation: true, co_creation_participation_pct: 15,
    co_creation_engagement_rate_pct: 32, co_creation_social_shares_monthly: 88,
    has_food_3d_printing_roi_tracking: true, printer_investment_total: 24000,
    premium_pricing_revenue_monthly: 2400, waste_reduction_savings_monthly: 380,
    labor_savings_monthly: 480, social_media_value_monthly_roi: 1200,
    food_3d_printing_roas: 5.5,
    avg_ticket_3d_printed: 85, avg_ticket_traditional: 62,
    customer_satisfaction_3d_score: 88, customer_satisfaction_traditional_score: 78,
    gen_z_millennial_interest_pct: 68, competitor_3d_printing_score: 78,
    monthly_revenue: 201000, total_dishes_monthly: 3200,
    printer_cost_per_unit: 8000, consumables_cost_monthly: 500,
    maintenance_cost_monthly: 200,
  },
  {
    location_id: 'location_2', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_food_3d_printing_strategy: true, printer_brand: 'Foodini + byFlow + 3D Systems ChefJet',
    printer_count: 5, printer_target_count: 2,
    has_personalized_nutrition_printing: true,
    personalized_nutrition_customers_monthly: 120,
    personalized_nutrition_revenue_per_dish: 65,
    personalized_nutrition_target_pct: 5,
    has_dietary_restriction_printing: true,
    allergen_free_printing_enabled: true, gluten_free_printing_enabled: true,
    vegan_printing_enabled: true, dietary_restriction_dishes_count: 8,
    has_novel_food_creation: true, novel_dishes_count: 12,
    novel_dish_revenue_monthly: 6800, social_media_value_monthly: 2400,
    has_precision_portion_control: true, food_waste_reduction_pct: 28,
    food_waste_reduction_target_pct: 20, ingredient_efficiency_score: 94,
    has_automated_plating: true, plating_automation_pct: 52,
    plating_time_per_dish_seconds: 40, plating_time_target_seconds: 60,
    plating_consistency_score: 96,
    has_customer_co_creation: true, co_creation_participation_pct: 28,
    co_creation_engagement_rate_pct: 48, co_creation_social_shares_monthly: 220,
    has_food_3d_printing_roi_tracking: true, printer_investment_total: 45000,
    premium_pricing_revenue_monthly: 6800, waste_reduction_savings_monthly: 820,
    labor_savings_monthly: 1200, social_media_value_monthly_roi: 2400,
    food_3d_printing_roas: 8.2,
    avg_ticket_3d_printed: 128, avg_ticket_traditional: 92,
    customer_satisfaction_3d_score: 94, customer_satisfaction_traditional_score: 82,
    gen_z_millennial_interest_pct: 72, competitor_3d_printing_score: 84,
    monthly_revenue: 265000, total_dishes_monthly: 2800,
    printer_cost_per_unit: 9000, consumables_cost_monthly: 800,
    maintenance_cost_monthly: 400,
  },
];

export const runFood3dPrintingEngine = async (
  db: ReturnType<typeof useDB>,
  config: Food3dPrintingConfig,
): Promise<{ alerts: Food3dPrintingAlert[]; generated: number }> => {
  const alerts: Food3dPrintingAlert[] = [];
  const now = new Date();

  let data: Food3dPrintingData[] = [];
  try {
    const result = await db.query(`SELECT * FROM food_3d_printing_log`);
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): Food3dPrintingData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_food_3d_printing_strategy: Boolean(r.has_food_3d_printing_strategy ?? false),
      printer_brand: String(r.printer_brand ?? 'none'),
      printer_count: safeNumber(r.printer_count, 0),
      printer_target_count: safeNumber(r.printer_target_count, 0),
      has_personalized_nutrition_printing: Boolean(r.has_personalized_nutrition_printing ?? false),
      personalized_nutrition_customers_monthly: safeNumber(r.personalized_nutrition_customers_monthly, 0),
      personalized_nutrition_revenue_per_dish: safeNumber(r.personalized_nutrition_revenue_per_dish, 0),
      personalized_nutrition_target_pct: safeNumber(r.personalized_nutrition_target_pct, 5),
      has_dietary_restriction_printing: Boolean(r.has_dietary_restriction_printing ?? false),
      allergen_free_printing_enabled: Boolean(r.allergen_free_printing_enabled ?? false),
      gluten_free_printing_enabled: Boolean(r.gluten_free_printing_enabled ?? false),
      vegan_printing_enabled: Boolean(r.vegan_printing_enabled ?? false),
      dietary_restriction_dishes_count: safeNumber(r.dietary_restriction_dishes_count, 0),
      has_novel_food_creation: Boolean(r.has_novel_food_creation ?? false),
      novel_dishes_count: safeNumber(r.novel_dishes_count, 0),
      novel_dish_revenue_monthly: safeNumber(r.novel_dish_revenue_monthly, 0),
      social_media_value_monthly: safeNumber(r.social_media_value_monthly, 0),
      has_precision_portion_control: Boolean(r.has_precision_portion_control ?? false),
      food_waste_reduction_pct: safeNumber(r.food_waste_reduction_pct, 0),
      food_waste_reduction_target_pct: safeNumber(r.food_waste_reduction_target_pct, 20),
      ingredient_efficiency_score: safeNumber(r.ingredient_efficiency_score, 0),
      has_automated_plating: Boolean(r.has_automated_plating ?? false),
      plating_automation_pct: safeNumber(r.plating_automation_pct, 0),
      plating_time_per_dish_seconds: safeNumber(r.plating_time_per_dish_seconds, 0),
      plating_time_target_seconds: safeNumber(r.plating_time_target_seconds, 60),
      plating_consistency_score: safeNumber(r.plating_consistency_score, 0),
      has_customer_co_creation: Boolean(r.has_customer_co_creation ?? false),
      co_creation_participation_pct: safeNumber(r.co_creation_participation_pct, 0),
      co_creation_engagement_rate_pct: safeNumber(r.co_creation_engagement_rate_pct, 0),
      co_creation_social_shares_monthly: safeNumber(r.co_creation_social_shares_monthly, 0),
      has_food_3d_printing_roi_tracking: Boolean(r.has_food_3d_printing_roi_tracking ?? false),
      printer_investment_total: safeNumber(r.printer_investment_total, 0),
      premium_pricing_revenue_monthly: safeNumber(r.premium_pricing_revenue_monthly, 0),
      waste_reduction_savings_monthly: safeNumber(r.waste_reduction_savings_monthly, 0),
      labor_savings_monthly: safeNumber(r.labor_savings_monthly, 0),
      social_media_value_monthly_roi: safeNumber(r.social_media_value_monthly_roi, 0),
      food_3d_printing_roas: safeNumber(r.food_3d_printing_roas, 0),
      avg_ticket_3d_printed: safeNumber(r.avg_ticket_3d_printed, 0),
      avg_ticket_traditional: safeNumber(r.avg_ticket_traditional, 0),
      customer_satisfaction_3d_score: safeNumber(r.customer_satisfaction_3d_score, 0),
      customer_satisfaction_traditional_score: safeNumber(r.customer_satisfaction_traditional_score, 0),
      gen_z_millennial_interest_pct: safeNumber(r.gen_z_millennial_interest_pct, 0),
      competitor_3d_printing_score: safeNumber(r.competitor_3d_printing_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_dishes_monthly: safeNumber(r.total_dishes_monthly, 0),
      printer_cost_per_unit: safeNumber(r.printer_cost_per_unit, 0),
      consumables_cost_monthly: safeNumber(r.consumables_cost_monthly, 0),
      maintenance_cost_monthly: safeNumber(r.maintenance_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetWasteReductionPct = 20;

    // Rule 1: FOOD_3D_PRINTING_STRATEGY_ABSENT
    if (config.requireFood3dPrintingStrategy && !d.has_food_3d_printing_strategy) {
      const expectedPremiumPricing = Math.round(baselineRevenue * 0.04);
      const expectedWasteReduction = Math.round(baselineRevenue * 0.02);
      const expectedSocialMedia = Math.round(baselineRevenue * 0.02);
      const expectedCompetitive = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedPremiumPricing + expectedWasteReduction + expectedSocialMedia + expectedCompetitive, 3500);
      const severityLabel = d.competitor_3d_printing_score > 60 ? 'high' : 'medium';
      const criticalNote = (d.competitor_3d_printing_score > 60)
        ? 'HIGH: NO 3D FOOD PRINTING STRATEGY — competitor 3D printing score ' + d.competitor_3d_printing_score + '/100; 3D food printing market = $5B+ by 2030 (Markets and Markets); 3D printed food = 30-50% premium pricing; 65% would try 3D printed food (Mintel); 3D printing reduces food waste 20-30%; generates $500-2,000/mo social media value; 40% of fine dining plan 3D printing by 2028; missing 3D printing = missed premium + waste reduction + social media + differentiation. '
        : `MEDIUM: NO 3D FOOD PRINTING STRATEGY — 3D food printing market $5B+ by 2030; 30-50% premium pricing; 65% would try (Mintel); 20-30% waste reduction; $500-2,000/mo social media value; 40% fine dining plan by 2028; missing premium + waste reduction + differentiation. `;
      alerts.push({
        rule_id: 'food_3d_printing_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_food_3d_printing_strategy: d.has_food_3d_printing_strategy,
        printer_brand: d.printer_brand, printer_count: d.printer_count,
        printer_target_count: d.printer_target_count,
        avg_ticket_traditional: d.avg_ticket_traditional,
        customer_satisfaction_traditional_score: d.customer_satisfaction_traditional_score,
        gen_z_millennial_interest_pct: d.gen_z_millennial_interest_pct,
        competitor_3d_printing_score: d.competitor_3d_printing_score,
        monthly_revenue: d.monthly_revenue, total_dishes_monthly: d.total_dishes_monthly,
        printer_cost_per_unit: d.printer_cost_per_unit,
        consumables_cost_monthly: d.consumables_cost_monthly,
        maintenance_cost_monthly: d.maintenance_cost_monthly,
        premium_pricing_projected_pct: 35,
        waste_reduction_projected_pct: 20,
        social_media_value_projected: expectedSocialMedia,
        differentiation_lift_projected_pts: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `3D FOOD PRINTING STRATEGY ABSENT: ${d.location_id} — 3D food printing ABSENT; printer brand: ${d.printer_brand}; printers 0 (target ${d.printer_target_count}); avg ticket traditional ${fmt$(d.avg_ticket_traditional)}; satisfaction ${d.customer_satisfaction_traditional_score}/100; Gen Z/millennial interest ${d.gen_z_millennial_interest_pct}%; competitor 3D printing ${d.competitor_3d_printing_score}/100; total dishes ${d.total_dishes_monthly}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D food printing market = $5B+ by 2030 (Markets and Markets), growing 45%+ CAGR; Foodini (Natural Machines) = leading commercial food printer ($4k-8k per unit); 3D printed food = 30-50% premium pricing (novelty + personalization); 3D food printing reduces food waste 20-30% (precision portioning, no trim waste); 3D printing enables dietary restriction compliance (gluten-free, vegan, allergen-free with exact ingredient control); 3D printed food attracts Gen Z/millennials — 65% would try 3D printed food (Mintel); 3D printing enables novel shapes/textures impossible by hand (intricate chocolate sculptures, geometric pasta, layered proteins); 3D food printing = automated plating (consistent, fast, labor-saving); 3D printing reduces skilled labor dependency (no chef needed for complex plating); 3D food printing enables customer co-creation (customers design their own food shapes); 3D printed food generates social media buzz = $500-2,000/month marketing value; 3D food printing platforms: Foodini (Natural Machines), byFlow, 3D Systems ChefJet, BeeHex; 3D food printing materials: chocolate, dough, cheese, pureed vegetables, protein pastes, sugar; 3D food printing cost = $4k-15k per printer + $200-600/month consumables; 3D food printing ROI = $4-12 per $1 (premium pricing + waste reduction + labor savings + personalization value); 40% of fine dining restaurants plan 3D food printing by 2028 (Restaurant Hospitality); NASA uses 3D food printing for space missions = proven technology. Solutions ranked by impact: (1) LAUNCH 3D food printing strategy — premium pricing ${fmt$(expectedPremiumPricing)}/mo + waste reduction ${fmt$(expectedWasteReduction)}/mo + social media ${fmt$(expectedSocialMedia)}/mo + competitive ${fmt$(expectedCompetitive)}/mo; cost ${fmt$(d.printer_cost_per_unit * config.minPrinterCount)} setup (${config.minPrinterCount} printer(s)) + ${fmt$(d.consumables_cost_monthly || 300)}/mo consumables; payback 4-8 months; (2) CHOOSE 3D food printer (Foodini — versatile, byFlow — multi-ingredient, ChefJet — chocolate/sugar, BeeHex — pizza); (3) START with dessert printing (chocolate, sugar — highest novelty, easiest implementation); (4) ADD personalized nutrition (print exact macros per customer); (5) ADD dietary restriction dishes (allergen-free, gluten-free, vegan); (6) CREATE novel dishes (impossible shapes/textures); (7) IMPLEMENT precision portioning (reduce waste 20-30%); (8) IMPLEMENT automated plating (consistent, fast); (9) LAUNCH customer co-creation (design your own food); (10) GENERATE social media content ($500-2,000/mo value); (11) TRACK ROI (premium pricing, waste reduction, labor savings, social media); (12) BENCHMARK vs competitor 3D printing. Industry data: $5B+ market by 2030; 30-50% premium pricing; 20-30% waste reduction; ROI $4-12 per $1; payback 4-8 months. Expected impact: +35% premium pricing, +20% waste reduction, +25pts differentiation, payback 4-8 months.`,
        ai_recommendation: 'launch_3d_food_printing_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: PERSONALIZED_NUTRITION_PRINTING_ABSENT
    if (d.has_food_3d_printing_strategy && config.requirePersonalizedNutritionPrinting && !d.has_personalized_nutrition_printing) {
      const expectedPersonalizationRevenue = Math.round(d.total_dishes_monthly * 0.05 * d.personalized_nutrition_revenue_per_dish);
      const expectedHealthMarketCapture = Math.round(baselineRevenue * 0.02);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedPersonalizationRevenue + expectedHealthMarketCapture + expectedSatisfactionLift + expectedCompetitiveLift, 1800);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO PERSONALIZED NUTRITION PRINTING — 3D printing enables personalized nutrition (print food with exact macros, vitamins, calories per individual); 68% want nutritional information (IFIC); personalized nutrition market = $11B+ by 2025 (Nutrition Business Journal); without personalized nutrition printing, missing health-conscious customer capture + premium pricing + satisfaction. `;
      alerts.push({
        rule_id: 'personalized_nutrition_printing_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_personalized_nutrition_printing: d.has_personalized_nutrition_printing,
        personalized_nutrition_customers_monthly: d.personalized_nutrition_customers_monthly,
        personalized_nutrition_revenue_per_dish: d.personalized_nutrition_revenue_per_dish,
        personalized_nutrition_target_pct: d.personalized_nutrition_target_pct,
        printer_count: d.printer_count,
        printer_brand: d.printer_brand,
        total_dishes_monthly: d.total_dishes_monthly,
        customer_satisfaction_3d_score: d.customer_satisfaction_3d_score,
        competitor_3d_printing_score: d.competitor_3d_printing_score,
        monthly_revenue: d.monthly_revenue,
        personalization_revenue_projected: expectedPersonalizationRevenue,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PERSONALIZED NUTRITION PRINTING ABSENT: ${d.location_id} — personalized nutrition printing ${d.has_personalized_nutrition_printing ? 'present' : 'ABSENT'}; customers ${d.personalized_nutrition_customers_monthly}/mo; revenue/dish ${fmt$(d.personalized_nutrition_revenue_per_dish)}; target ${d.personalized_nutrition_target_pct}% of dishes; printers ${d.printer_count} (${d.printer_brand}); total dishes ${d.total_dishes_monthly}/mo; satisfaction ${d.customer_satisfaction_3d_score}/100; competitor ${d.competitor_3d_printing_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D printing enables personalized nutrition (print food with exact macros, vitamins, calories per individual); personalized nutrition market = $11B+ by 2025 (Nutrition Business Journal); 68% want nutritional information (IFIC); personalized nutrition printing = customer provides health data (macros, calories, allergens, vitamin needs), printer creates food with exact nutritional profile; personalized nutrition types = macro-balanced (exact protein/carbs/fat per customer goals), calorie-controlled (exact calories per dish), vitamin-enriched (add specific vitamins), allergen-avoidance (remove specific allergens), performance nutrition (athlete macros), medical nutrition (diabetic, hypertension, heart-healthy); personalized nutrition revenue = $5-15 premium per dish (vs traditional); personalized nutrition cost = $100-300/month (nutrition database + integration); personalized nutrition ROI = $5-12 per $1 (premium pricing + health market capture + satisfaction). Solutions ranked by impact: (1) IMPLEMENT personalized nutrition printing — personalization revenue ${fmt$(expectedPersonalizationRevenue)}/mo + health market ${fmt$(expectedHealthMarketCapture)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(200)}/mo (nutrition database); payback 1-2 months; (2) INTEGRATE nutrition database (USDA, custom); (3) ENABLE customer health profiles (macros, calories, allergens, vitamins); (4) CREATE macro-balanced dishes (exact protein/carbs/fat); (5) CREATE calorie-controlled dishes (exact calories); (6) CREATE vitamin-enriched dishes (add specific vitamins); (7) CREATE performance nutrition (athlete macros); (8) CREATE medical nutrition (diabetic, heart-healthy); (9) CHARGE premium ($5-15 per dish); (10) TRACK personalization customers (target ${d.personalized_nutrition_target_pct}%+ of dishes); (11) BENCHMARK vs competitor personalized nutrition. Industry data: $11B+ personalized nutrition market; 68% want nutrition info; $5-15 premium per dish; payback 1-2 months. Expected impact: +${fmt$(expectedPersonalizationRevenue)}/mo personalization revenue, +12pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'implement_personalized_nutrition',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: DIETARY_RESTRICTION_PRINTING_ABSENT
    if (d.has_food_3d_printing_strategy && config.requireDietaryRestrictionPrinting && (!d.has_dietary_restriction_printing || d.dietary_restriction_dishes_count < config.minDietaryRestrictionDishesCount)) {
      const dishGap = Math.max(config.minDietaryRestrictionDishesCount - d.dietary_restriction_dishes_count, 0);
      const expectedDietaryRevenue = Math.round(dishGap * 80 * 30);
      const expectedAllergenSafety = Math.round(baselineRevenue * 0.015);
      const expectedMarketCapture = Math.round(baselineRevenue * 0.02);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedDietaryRevenue + expectedAllergenSafety + expectedMarketCapture + expectedCompetitiveLift, 1600);
      const severityLabel = !d.has_dietary_restriction_printing ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO DIETARY RESTRICTION PRINTING — dietary restriction dishes ${d.dietary_restriction_dishes_count} (min ${config.minDietaryRestrictionDishesCount}); allergen-free ${d.allergen_free_printing_enabled ? 'yes' : 'NO'}; gluten-free ${d.gluten_free_printing_enabled ? 'yes' : 'NO'}; vegan ${d.vegan_printing_enabled ? 'yes' : 'NO'}; 3D printing enables exact ingredient control (no cross-contamination); 32M Americans have food allergies (FDA); 45% choose restaurants based on dietary options (NRA); without dietary restriction printing, missing allergen-safe + dietary market. `;
      alerts.push({
        rule_id: 'dietary_restriction_printing_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_dietary_restriction_printing: d.has_dietary_restriction_printing,
        allergen_free_printing_enabled: d.allergen_free_printing_enabled,
        gluten_free_printing_enabled: d.gluten_free_printing_enabled,
        vegan_printing_enabled: d.vegan_printing_enabled,
        dietary_restriction_dishes_count: d.dietary_restriction_dishes_count,
        printer_count: d.printer_count,
        printer_brand: d.printer_brand,
        customer_satisfaction_3d_score: d.customer_satisfaction_3d_score,
        competitor_3d_printing_score: d.competitor_3d_printing_score,
        monthly_revenue: d.monthly_revenue,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DIETARY RESTRICTION PRINTING ABSENT: ${d.location_id} — dietary restriction printing ${d.has_dietary_restriction_printing ? 'present' : 'ABSENT'}; dishes ${d.dietary_restriction_dishes_count} (min ${config.minDietaryRestrictionDishesCount}); allergen-free ${d.allergen_free_printing_enabled ? 'enabled' : 'disabled'}; gluten-free ${d.gluten_free_printing_enabled ? 'enabled' : 'disabled'}; vegan ${d.vegan_printing_enabled ? 'enabled' : 'disabled'}; printers ${d.printer_count} (${d.printer_brand}); satisfaction ${d.customer_satisfaction_3d_score}/100; competitor ${d.competitor_3d_printing_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D printing enables exact ingredient control (no cross-contamination — each ingredient in separate cartridge); 32M Americans have food allergies (FDA), 200+ die annually from anaphylaxis; 45% choose restaurants based on dietary options (NRA); dietary restriction printing types = allergen-free (no nuts, dairy, soy, eggs — separate cartridges eliminate cross-contamination), gluten-free (celiac-safe — no wheat contamination), vegan (no animal products — plant-based pastes), keto (low-carb — exact macro control), FODMAP (specific fermentable carb avoidance); dietary restriction printing = 100% safe (no human error, no shared equipment); dietary restriction revenue = $5-10 premium per dish (vs traditional); dietary restriction printing cost = $100-300/month (ingredient cartridges); dietary restriction ROI = $5-10 per $1 (safety + market capture + premium). Solutions ranked by impact: (1) IMPLEMENT dietary restriction printing — dietary revenue ${fmt$(expectedDietaryRevenue)}/mo + allergen safety ${fmt$(expectedAllergenSafety)}/mo + market capture ${fmt$(expectedMarketCapture)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(200)}/mo (cartridges); payback 1-2 months; (2) ENABLE allergen-free printing (separate cartridges, no cross-contamination); (3) ENABLE gluten-free printing (celiac-safe); (4) ENABLE vegan printing (plant-based pastes); (5) CREATE ${config.minDietaryRestrictionDishesCount}+ dietary restriction dishes; (6) MARKET as allergen-safe restaurant (32M food allergy customers); (7) CHARGE premium ($5-10 per dietary dish); (8) TRACK dietary dish sales; (9) BENCHMARK vs competitor dietary options. Industry data: 32M food allergies (FDA); 45% choose based on dietary (NRA); 100% safe (no cross-contamination); payback 1-2 months. Expected impact: +${fmt$(expectedDietaryRevenue)}/mo dietary revenue, +allergen safety, payback 1-2 months.`,
        ai_recommendation: 'implement_dietary_restriction_printing',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: NOVEL_FOOD_CREATION_ABSENT
    if (d.has_food_3d_printing_strategy && config.requireNovelFoodCreation && (!d.has_novel_food_creation || d.novel_dishes_count < config.minNovelDishesCount)) {
      const dishGap = Math.max(config.minNovelDishesCount - d.novel_dishes_count, 0);
      const expectedNovelRevenue = Math.round(dishGap * 200 * 30);
      const expectedSocialMedia = Math.round(baselineRevenue * 0.02);
      const expectedDifferentiation = Math.round(baselineRevenue * 0.02);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedNovelRevenue + expectedSocialMedia + expectedDifferentiation + expectedCompetitiveLift, 1800);
      const severityLabel = !d.has_novel_food_creation ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO NOVEL FOOD CREATION — novel dishes ${d.novel_dishes_count} (min ${config.minNovelDishesCount}); novel dish revenue ${fmt$(d.novel_dish_revenue_monthly)}/mo; social media value ${fmt$(d.social_media_value_monthly)}/mo; 3D printing enables novel shapes/textures impossible by hand; novel food = 30-50% premium + social media buzz; without novel food creation, missing differentiation + premium + viral marketing. `;
      alerts.push({
        rule_id: 'novel_food_creation_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_novel_food_creation: d.has_novel_food_creation,
        novel_dishes_count: d.novel_dishes_count,
        novel_dish_revenue_monthly: d.novel_dish_revenue_monthly,
        social_media_value_monthly: d.social_media_value_monthly,
        printer_count: d.printer_count,
        printer_brand: d.printer_brand,
        avg_ticket_3d_printed: d.avg_ticket_3d_printed,
        avg_ticket_traditional: d.avg_ticket_traditional,
        customer_satisfaction_3d_score: d.customer_satisfaction_3d_score,
        competitor_3d_printing_score: d.competitor_3d_printing_score,
        monthly_revenue: d.monthly_revenue,
        social_media_value_projected: expectedSocialMedia,
        differentiation_lift_projected_pts: 20,
        premium_pricing_projected_pct: 30,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `NOVEL FOOD CREATION ABSENT: ${d.location_id} — novel food creation ${d.has_novel_food_creation ? 'present' : 'ABSENT'}; novel dishes ${d.novel_dishes_count} (min ${config.minNovelDishesCount}); novel dish revenue ${fmt$(d.novel_dish_revenue_monthly)}/mo; social media value ${fmt$(d.social_media_value_monthly)}/mo; printers ${d.printer_count} (${d.printer_brand}); avg ticket 3D printed ${fmt$(d.avg_ticket_3d_printed)} (traditional ${fmt$(d.avg_ticket_traditional)}); satisfaction ${d.customer_satisfaction_3d_score}/100; competitor ${d.competitor_3d_printing_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D printing enables novel shapes/textures impossible by hand (intricate chocolate sculptures, geometric pasta, layered proteins, internal-fill structures, multi-material compositions); novel food = 30-50% premium pricing (novelty + uniqueness); novel food generates social media buzz = $500-2,000/month marketing value (Instagram, TikTok viral content); novel food types = geometric chocolate (intricate patterns, impossible by hand), architectural sugar (3D sugar sculptures), layered protein (multi-protein compositions), internal-fill pasta (filled pasta shapes impossible by hand), transparent desserts (light-transmitting food structures), floating food (hollow structures that appear to float); novel food best practice = 2-5 novel dishes (signature items), seasonal rotation (new shapes each season), social media marketing (encourage photos/videos), premium pricing ($15-50 per dish vs $8-20 traditional); novel food cost = $200-600/month (design time + consumables); novel food ROI = $5-12 per $1 (premium + social media + differentiation). Solutions ranked by impact: (1) LAUNCH novel food creation — novel revenue ${fmt$(expectedNovelRevenue)}/mo + social media ${fmt$(expectedSocialMedia)}/mo + differentiation ${fmt$(expectedDifferentiation)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo (design + consumables); payback 1-2 months; (2) CREATE ${config.minNovelDishesCount}+ novel dishes (signature items); (3) DESIGN geometric chocolate (intricate patterns); (4) DESIGN architectural sugar (3D sculptures); (5) DESIGN layered protein (multi-protein compositions); (6) DESIGN internal-fill pasta (filled shapes); (7) ROTATE novel dishes seasonally (new shapes each season); (8) MARKET on social media (Instagram, TikTok — encourage photos); (9) CHARGE premium ($15-50 per dish); (10) TRACK novel dish revenue (target growth); (11) TRACK social media mentions (target viral); (12) BENCHMARK vs competitor novel food. Industry data: 30-50% premium pricing; $500-2,000/mo social media value; payback 1-2 months. Expected impact: +30% premium pricing, +20pts differentiation, +${fmt$(expectedSocialMedia)}/mo social media, payback 1-2 months.`,
        ai_recommendation: 'launch_novel_food_creation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: PRECISION_PORTION_CONTROL_ABSENT
    if (d.has_food_3d_printing_strategy && config.requirePrecisionPortionControl && (!d.has_precision_portion_control || d.food_waste_reduction_pct < config.minFoodWasteReductionPct)) {
      const wasteGap = Math.max(config.minFoodWasteReductionPct - d.food_waste_reduction_pct, 0);
      const expectedWasteReduction = Math.round(baselineRevenue * (wasteGap / 300));
      const expectedIngredientSavings = Math.round(baselineRevenue * 0.01);
      const expectedConsistencyLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedWasteReduction + expectedIngredientSavings + expectedConsistencyLift + expectedCompetitiveLift, 1200);
      const severityLabel = d.food_waste_reduction_pct < 10 ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO PRECISION PORTION CONTROL — waste reduction ${d.food_waste_reduction_pct}% (min ${config.minFoodWasteReductionPct}%); ingredient efficiency ${d.ingredient_efficiency_score}/100; 3D printing enables precision portioning (exact weight, no trim waste, no over-pouring); reduces food waste 20-30%; without precision portioning, missing waste reduction + consistency + ingredient savings. `;
      alerts.push({
        rule_id: 'precision_portion_control_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_precision_portion_control: d.has_precision_portion_control,
        food_waste_reduction_pct: d.food_waste_reduction_pct,
        food_waste_reduction_target_pct: d.food_waste_reduction_target_pct,
        ingredient_efficiency_score: d.ingredient_efficiency_score,
        printer_count: d.printer_count,
        total_dishes_monthly: d.total_dishes_monthly,
        monthly_revenue: d.monthly_revenue,
        waste_reduction_projected_pct: targetWasteReductionPct,
        consistency_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PRECISION PORTION CONTROL ABSENT: ${d.location_id} — precision portion control ${d.has_precision_portion_control ? 'present' : 'ABSENT'}; waste reduction ${d.food_waste_reduction_pct}% (min ${config.minFoodWasteReductionPct}%, target ${d.food_waste_reduction_target_pct}%); ingredient efficiency ${d.ingredient_efficiency_score}/100; printers ${d.printer_count}; total dishes ${d.total_dishes_monthly}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D printing enables precision portioning (exact weight per dish, no trim waste, no over-pouring, no human error); precision portioning reduces food waste 20-30% (vs traditional hand-plating with trim, over-portioning, inconsistency); restaurants waste 4-10% of purchased food (NRA); 20-30% waste reduction = $1,500-5,000/year savings per location; precision portioning = exact calorie/macro control (consistent nutritional profile); precision portioning = consistent presentation (every dish identical); precision portioning types = exact weight (gram-precise portions), exact volume (milliliter-precise liquids), exact shape (identical food shapes), exact layers (multi-layer compositions); precision portioning cost = $0 (built into 3D printer); precision portioning ROI = $5-10 per $1 (waste reduction + ingredient savings + consistency). Solutions ranked by impact: (1) IMPLEMENT precision portion control — waste reduction ${fmt$(expectedWasteReduction)}/mo + ingredient savings ${fmt$(expectedIngredientSavings)}/mo + consistency ${fmt$(expectedConsistencyLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost $0 (built into printer); payback immediate; (2) CALIBRATE printer for exact portions (gram-precise); (3) ELIMINATE trim waste (3D print exact shape, no cutting); (4) ELIMINATE over-pouring (exact volume); (5) ENSURE consistent presentation (every dish identical); (6) TRACK food waste reduction (target ${config.minFoodWasteReductionPct}%+); (7) TRACK ingredient efficiency (target 80+); (8) BENCHMARK vs competitor waste reduction. Industry data: 20-30% waste reduction; $1,500-5,000/year savings; payback immediate. Expected impact: +${targetWasteReductionPct}% waste reduction, +12pts consistency, payback immediate.`,
        ai_recommendation: 'implement_precision_portioning',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: AUTOMATED_PLATING_ABSENT
    if (d.has_food_3d_printing_strategy && config.requireAutomatedPlating && (!d.has_automated_plating || d.plating_automation_pct < config.minPlatingAutomationPct)) {
      const automationGap = Math.max(config.minPlatingAutomationPct - d.plating_automation_pct, 0);
      const expectedLaborSavings = Math.round(d.total_dishes_monthly * (automationGap / 100) * 0.5);
      const expectedConsistencyLift = Math.round(baselineRevenue * 0.015);
      const expectedSpeedLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedLaborSavings + expectedConsistencyLift + expectedSpeedLift + expectedCompetitiveLift, 1200);
      const severityLabel = d.plating_automation_pct < 15 ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO AUTOMATED PLATING — plating automation ${d.plating_automation_pct}% (min ${config.minPlatingAutomationPct}%); plating time ${d.plating_time_per_dish_seconds}s/dish (target ${d.plating_time_target_seconds}s); consistency ${d.plating_consistency_score}/100; 3D printing = automated plating (consistent, fast, labor-saving); without automated plating, missing labor savings + consistency + speed. `;
      alerts.push({
        rule_id: 'automated_plating_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_automated_plating: d.has_automated_plating,
        plating_automation_pct: d.plating_automation_pct,
        plating_time_per_dish_seconds: d.plating_time_per_dish_seconds,
        plating_time_target_seconds: d.plating_time_target_seconds,
        plating_consistency_score: d.plating_consistency_score,
        printer_count: d.printer_count,
        total_dishes_monthly: d.total_dishes_monthly,
        monthly_revenue: d.monthly_revenue,
        labor_savings_projected_pct: 20,
        consistency_lift_projected_pts: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AUTOMATED PLATING ABSENT: ${d.location_id} — automated plating ${d.has_automated_plating ? 'present' : 'ABSENT'}; automation ${d.plating_automation_pct}% (min ${config.minPlatingAutomationPct}%); plating time ${d.plating_time_per_dish_seconds}s/dish (target ${d.plating_time_target_seconds}s); consistency ${d.plating_consistency_score}/100; printers ${d.printer_count}; total dishes ${d.total_dishes_monthly}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D printing = automated plating (printer plates food automatically, no chef needed for plating); automated plating benefits = consistent (every dish identical — 99%+ consistency vs 80-90% human), fast (30-60 seconds per dish vs 2-5 minutes human), labor-saving (no skilled chef needed for plating — $2k-5k/month labor savings), scalable (multiple printers = parallel plating); automated plating types = full plating (printer creates complete dish), component plating (printer creates one component, chef assembles), dessert plating (printer creates dessert + garnish), garnish plating (printer creates intricate garnishes); automated plating cost = $0 (built into printer); automated plating ROI = $5-10 per $1 (labor savings + consistency + speed). Solutions ranked by impact: (1) IMPLEMENT automated plating — labor savings ${fmt$(expectedLaborSavings)}/mo + consistency ${fmt$(expectedConsistencyLift)}/mo + speed ${fmt$(expectedSpeedLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost $0 (built into printer); payback immediate; (2) AUTOMATE full plating (printer creates complete dish); (3) OR automate component plating (printer creates components, chef assembles); (4) OR automate dessert plating (desserts + garnishes); (5) OR automate garnish plating (intricate garnishes); (6) TARGET automation ${config.minPlatingAutomationPct}%+ of dishes; (7) TARGET plating time under ${d.plating_time_target_seconds}s; (8) TARGET consistency 90+; (9) TRACK labor savings; (10) BENCHMARK vs competitor plating automation. Industry data: 99%+ consistency; 30-60s per dish; $2k-5k/mo labor savings; payback immediate. Expected impact: +20% labor savings, +18pts consistency, payback immediate.`,
        ai_recommendation: 'implement_automated_plating',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: CUSTOMER_CO_CREATION_ABSENT
    if (d.has_food_3d_printing_strategy && config.requireCustomerCoCreation && (!d.has_customer_co_creation || d.co_creation_participation_pct < config.minCoCreationParticipationPct)) {
      const participationGap = Math.max(config.minCoCreationParticipationPct - d.co_creation_participation_pct, 0);
      const expectedEngagementRevenue = Math.round(d.total_dishes_monthly * (participationGap / 100) * d.avg_ticket_3d_printed * 0.3);
      const expectedSocialMedia = Math.round(baselineRevenue * 0.02);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedEngagementRevenue + expectedSocialMedia + expectedSatisfactionLift + expectedCompetitiveLift, 1400);
      const severityLabel = 'low';
      const criticalNote = `LOW: NO CUSTOMER CO-CREATION — co-creation participation ${d.co_creation_participation_pct}% (min ${config.minCoCreationParticipationPct}%); engagement ${d.co_creation_engagement_rate_pct}%; social shares ${d.co_creation_social_shares_monthly}/mo; 3D printing enables customer co-creation (customers design their own food shapes); co-creation = high engagement + viral social media + premium pricing; without co-creation, missing engagement + social media + satisfaction. `;
      alerts.push({
        rule_id: 'customer_co_creation_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_customer_co_creation: d.has_customer_co_creation,
        co_creation_participation_pct: d.co_creation_participation_pct,
        co_creation_engagement_rate_pct: d.co_creation_engagement_rate_pct,
        co_creation_social_shares_monthly: d.co_creation_social_shares_monthly,
        printer_count: d.printer_count,
        total_dishes_monthly: d.total_dishes_monthly,
        avg_ticket_3d_printed: d.avg_ticket_3d_printed,
        customer_satisfaction_3d_score: d.customer_satisfaction_3d_score,
        competitor_3d_printing_score: d.competitor_3d_printing_score,
        monthly_revenue: d.monthly_revenue,
        engagement_lift_projected_pct: 30,
        social_media_value_projected: expectedSocialMedia,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CUSTOMER CO-CREATION ABSENT: ${d.location_id} — co-creation ${d.has_customer_co_creation ? 'present' : 'ABSENT'}; participation ${d.co_creation_participation_pct}% (min ${config.minCoCreationParticipationPct}%); engagement ${d.co_creation_engagement_rate_pct}%; social shares ${d.co_creation_social_shares_monthly}/mo; printers ${d.printer_count}; total dishes ${d.total_dishes_monthly}/mo; avg ticket 3D ${fmt$(d.avg_ticket_3d_printed)}; satisfaction ${d.customer_satisfaction_3d_score}/100; competitor ${d.competitor_3d_printing_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 3D printing enables customer co-creation (customers design their own food shapes via app/tablet, printer creates their design); co-creation = high engagement (customers invested in their creation = 30-50% higher satisfaction), viral social media (customers photograph + share their unique creations = $500-2,000/month marketing value), premium pricing (co-created dishes = $10-25 premium), differentiation (only restaurants with 3D printers can offer); co-creation types = shape design (customers draw/select food shape), flavor combination (customers select ingredients, printer combines), texture design (customers select texture profile), color customization (customers select food colors), name your dish (customers name their creation on menu); co-creation platform = tablet at table (design app), mobile app (pre-order with custom design), social media integration (share design); co-creation cost = $500-1,500 setup (app/tablet); co-creation ROI = $5-10 per $1 (engagement + social media + premium). Solutions ranked by impact: (1) LAUNCH customer co-creation — engagement revenue ${fmt$(expectedEngagementRevenue)}/mo + social media ${fmt$(expectedSocialMedia)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(800)} setup (app/tablet); payback 1-2 months; (2) DEPLOY design app (tablet at table or mobile); (3) ENABLE shape design (customers draw/select shape); (4) ENABLE flavor combination (customers select ingredients); (5) ENABLE texture design (customers select texture); (6) ENABLE color customization; (7) ENABLE name your dish (customers name creation); (8) INTEGRATE social media sharing (customers share designs); (9) CHARGE premium ($10-25 per co-created dish); (10) TRACK participation (target ${config.minCoCreationParticipationPct}%+); (11) TRACK social shares; (12) BENCHMARK vs competitor co-creation. Industry data: 30-50% higher satisfaction; $500-2,000/mo social media; $10-25 premium; payback 1-2 months. Expected impact: +30% engagement, +12pts satisfaction, +${fmt$(expectedSocialMedia)}/mo social media, payback 1-2 months.`,
        ai_recommendation: 'launch_customer_co_creation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: FOOD_3D_PRINTING_ROI_TRACKING_ABSENT
    if (d.has_food_3d_printing_strategy && config.requireFood3dPrintingRoiTracking && !d.has_food_3d_printing_roi_tracking) {
      const expectedRoiRecovery = Math.round((d.premium_pricing_revenue_monthly + d.waste_reduction_savings_monthly + d.labor_savings_monthly + d.social_media_value_monthly_roi) * 0.20);
      const expectedPortfolioOptimization = Math.round(d.printer_investment_total * 0.001);
      const expectedWastedSpendRecovery = Math.round(d.printer_investment_total * 0.0005);
      const expectedScalingLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedPortfolioOptimization + expectedWastedSpendRecovery + expectedScalingLift, 800);
      const severityLabel = d.printer_investment_total > 20000 ? 'medium' : 'low';
      const criticalNote = (d.printer_investment_total > 20000)
        ? `MEDIUM: NO 3D PRINTING ROI TRACKING — investment ${fmt$(d.printer_investment_total)} but no ROI tracking; without tracking, can't identify which 3D printing features drive revenue = wasted 15-20% of investment; 3D printing ROI = premium pricing, waste reduction, labor savings, social media value, ROAS. `
        : `LOW: NO 3D PRINTING ROI TRACKING — implement tracking to optimize printer investment. `;
      alerts.push({
        rule_id: 'food_3d_printing_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_food_3d_printing_roi_tracking: d.has_food_3d_printing_roi_tracking,
        printer_investment_total: d.printer_investment_total,
        premium_pricing_revenue_monthly: d.premium_pricing_revenue_monthly,
        waste_reduction_savings_monthly: d.waste_reduction_savings_monthly,
        labor_savings_monthly: d.labor_savings_monthly,
        social_media_value_monthly_roi: d.social_media_value_monthly_roi,
        food_3d_printing_roas: d.food_3d_printing_roas,
        printer_count: d.printer_count,
        avg_ticket_3d_printed: d.avg_ticket_3d_printed,
        avg_ticket_traditional: d.avg_ticket_traditional,
        monthly_revenue: d.monthly_revenue,
        consumables_cost_monthly: d.consumables_cost_monthly,
        maintenance_cost_monthly: d.maintenance_cost_monthly,
        roi_lift_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `3D PRINTING ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_food_3d_printing_roi_tracking ? 'present' : 'ABSENT'}; investment ${fmt$(d.printer_investment_total)}; premium pricing revenue ${fmt$(d.premium_pricing_revenue_monthly)}/mo; waste reduction savings ${fmt$(d.waste_reduction_savings_monthly)}/mo; labor savings ${fmt$(d.labor_savings_monthly)}/mo; social media value ${fmt$(d.social_media_value_monthly_roi)}/mo; ROAS ${d.food_3d_printing_roas}x; printers ${d.printer_count}; avg ticket 3D ${fmt$(d.avg_ticket_3d_printed)} (traditional ${fmt$(d.avg_ticket_traditional)}); consumables ${fmt$(d.consumables_cost_monthly)}/mo; maintenance ${fmt$(d.maintenance_cost_monthly)}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without ROI tracking, restaurants waste 15-20% of 3D printing investment on underperforming features; 3D printing ROI tracking = premium pricing revenue (3D vs traditional ticket), waste reduction savings (food waste reduction), labor savings (automated plating), social media value (viral content), ROAS (revenue / cost); ROI tracking tools = POS integration (revenue per 3D dish), inventory system (waste tracking), labor management (plating time), social media analytics (mentions, shares); ROI metrics = ROAS (target ${config.minFood3dPrintingRoas}x+), premium pricing (target 30-50% higher), waste reduction (target 20-30%), labor savings (target $2k-5k/mo), social media value (target $500-2,000/mo); ROI tracking best practice = track per 3D printing feature weekly, audit quarterly (scale winners, cut losers). Solutions ranked by impact: (1) IMPLEMENT ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + portfolio optimization ${fmt$(expectedPortfolioOptimization)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + scaling ${fmt$(expectedScalingLift)}/mo; cost ${fmt$(200)}/mo (analytics); payback immediate; (2) INTEGRATE POS (revenue per 3D dish); (3) INTEGRATE inventory system (waste tracking); (4) INTEGRATE labor management (plating time); (5) TRACK premium pricing (3D vs traditional ticket); (6) TRACK waste reduction savings; (7) TRACK labor savings; (8) TRACK social media value; (9) TRACK ROAS (target ${config.minFood3dPrintingRoas}x+); (10) AUDIT quarterly (scale winners, cut losers); (11) BENCHMARK vs competitor 3D printing ROI. Industry data: 15-20% wasted investment without tracking; payback immediate. Expected impact: +25% ROI, +${fmt$(expectedRoiRecovery)}/mo ROI recovery, payback immediate.`,
        ai_recommendation: 'implement_3d_printing_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM food_3d_printing_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE food_3d_printing_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant 3D food printing and customized cuisine expert. Given 3D food printing data, recommend ONE specific action with expected premium pricing lift, waste reduction, personalization revenue, differentiation lift, or ROI lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. 3D printing strategy: ${a.has_food_3d_printing_strategy ?? false} (${a.printer_brand ?? 'none'}, ${a.printer_count ?? 0}/${a.printer_target_count ?? 2} printers). Personalized nutrition: ${a.has_personalized_nutrition_printing ?? false} (${a.personalized_nutrition_customers_monthly ?? 0} customers/mo, ${fmt$(a.personalized_nutrition_revenue_per_dish ?? 0)}/dish). Dietary restriction: ${a.has_dietary_restriction_printing ?? false} (allergen-free ${a.allergen_free_printing_enabled ?? false}, GF ${a.gluten_free_printing_enabled ?? false}, vegan ${a.vegan_printing_enabled ?? false}, ${a.dietary_restriction_dishes_count ?? 0} dishes). Novel food: ${a.has_novel_food_creation ?? false} (${a.novel_dishes_count ?? 0} dishes, ${fmt$(a.novel_dish_revenue_monthly ?? 0)}/mo, ${fmt$(a.social_media_value_monthly ?? 0)} social media). Precision portion: ${a.has_precision_portion_control ?? false} (waste reduction ${a.food_waste_reduction_pct ?? 0}%, efficiency ${a.ingredient_efficiency_score ?? 0}/100). Automated plating: ${a.has_automated_plating ?? false} (automation ${a.plating_automation_pct ?? 0}%, time ${a.plating_time_per_dish_seconds ?? 0}s, consistency ${a.plating_consistency_score ?? 0}/100). Co-creation: ${a.has_customer_co_creation ?? false} (participation ${a.co_creation_participation_pct ?? 0}%, engagement ${a.co_creation_engagement_rate_pct ?? 0}%, shares ${a.co_creation_social_shares_monthly ?? 0}/mo). ROI: ${a.has_food_3d_printing_roi_tracking ?? false} (investment ${fmt$(a.printer_investment_total ?? 0)}, premium ${fmt$(a.premium_pricing_revenue_monthly ?? 0)}/mo, waste savings ${fmt$(a.waste_reduction_savings_monthly ?? 0)}/mo, labor savings ${fmt$(a.labor_savings_monthly ?? 0)}/mo, social ${fmt$(a.social_media_value_monthly_roi ?? 0)}/mo, ROAS ${a.food_3d_printing_roas ?? 0}x). Avg ticket: 3D ${fmt$(a.avg_ticket_3d_printed ?? 0)} vs traditional ${fmt$(a.avg_ticket_traditional ?? 0)}. Satisfaction: 3D ${a.customer_satisfaction_3d_score ?? 0}/100, traditional ${a.customer_satisfaction_traditional_score ?? 0}/100. Gen Z interest: ${a.gen_z_millennial_interest_pct ?? 0}%. Competitor: ${a.competitor_3d_printing_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Dishes: ${a.total_dishes_monthly ?? 0}/mo. Printer cost: ${fmt$(a.printer_cost_per_unit ?? 0)}. Consumables: ${fmt$(a.consumables_cost_monthly ?? 0)}/mo. Maintenance: ${fmt$(a.maintenance_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveFood3dPrintingAlerts = async (db: ReturnType<typeof useDB>): Promise<Food3dPrintingAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM food_3d_printing_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getFood3dPrintingSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  food3dPrintingStrategyAbsentCount: number;
  personalizedNutritionPrintingAbsentCount: number;
  dietaryRestrictionPrintingAbsentCount: number;
  novelFoodCreationAbsentCount: number;
  precisionPortionControlAbsentCount: number;
  automatedPlatingAbsentCount: number;
  customerCoCreationAbsentCount: number;
  food3dPrintingRoiTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'food_3d_printing_strategy_absent') AS nostrategy,
              math::count(rule_id = 'personalized_nutrition_printing_absent') AS nonutrition,
              math::count(rule_id = 'dietary_restriction_printing_absent') AS nodietary,
              math::count(rule_id = 'novel_food_creation_absent') AS nonovel,
              math::count(rule_id = 'precision_portion_control_absent') AS noportion,
              math::count(rule_id = 'automated_plating_absent') AS noplating,
              math::count(rule_id = 'customer_co_creation_absent') AS nococreation,
              math::count(rule_id = 'food_3d_printing_roi_tracking_absent') AS noroi
       FROM food_3d_printing_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      food3dPrintingStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      personalizedNutritionPrintingAbsentCount: safeNumber(r.nonutrition, 0),
      dietaryRestrictionPrintingAbsentCount: safeNumber(r.nodietary, 0),
      novelFoodCreationAbsentCount: safeNumber(r.nonovel, 0),
      precisionPortionControlAbsentCount: safeNumber(r.noportion, 0),
      automatedPlatingAbsentCount: safeNumber(r.noplating, 0),
      customerCoCreationAbsentCount: safeNumber(r.nococreation, 0),
      food3dPrintingRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, food3dPrintingStrategyAbsentCount: 0, personalizedNutritionPrintingAbsentCount: 0, dietaryRestrictionPrintingAbsentCount: 0, novelFoodCreationAbsentCount: 0, precisionPortionControlAbsentCount: 0, automatedPlatingAbsentCount: 0, customerCoCreationAbsentCount: 0, food3dPrintingRoiTrackingAbsentCount: 0 };
  }
};

export const updateFood3dPrintingAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
