/**
 * AI Kitchen Robotics & Automation Optimizer — predicts how kitchen
 * robotics and automation (robotic fryers/flippy, automated grills,
 * robotic dishwashers, automated prep stations, smart ovens, conveyor
 * cooking, robotic beverage dispensers, inventory automation, cleaning
 * automation, labor displacement, consistency improvement, ROI tracking,
 * maintenance planning, staff retraining) impacts labor cost, food
 * consistency, speed of service, kitchen throughput, food safety, and
 * profitability.
 *
 * Restaurant robotics market = $4B+ by 2030 (Allied Market Research),
 * growing 25%+ CAGR. Miso Robotics' Flippy flips 150+ burgers/hour =
 * 2-3x human output. White Castle deployed Flippy at 100+ locations.
 * Robotic fryers reduce oil waste 30-40% (consistent temperature).
 * Automated grills reduce cook time 20-30%. Robotic dishwashers process
 * 200+ racks/hour vs 80-100 human. Smart ovens (combitherm, conveyor)
 * reduce energy 15-25%. Conveyor cooking (pizza, burgers) = consistent
 * product 99%+ vs 85-90% human. Robotic beverage dispensers pour
 * 120+ drinks/hour with 0.5% variance vs 5-8% human. Inventory
 * automation (smart shelves, RFID) reduces stockouts 40-60%. Cleaning
 * automation (auto-clean ovens, floors) saves 2-4 hours/day labor.
 * Labor displacement: each robot replaces 1-3 FTE ($30k-90k/year
 * savings). Kitchen robotics ROI = $3-8 per $1 spent (2-4 year payback).
 * 35% of QSRs plan robotics deployment by 2027 (Restaurant Business).
 * Robots work 24/7 (no breaks, no sick days, no overtime). Food
 * consistency improves 10-20% (exact temps, exact times). Food safety
 * improves (no cross-contamination from human hands). Speed of service
 * increases 15-30% (no fatigue, consistent pace). Kitchen throughput
 * increases 20-40% (bottleneck reduction). Maintenance cost = $2k-8k/
 * year per robot (preventive + repairs). Staff retraining required
 * (operators not cooks). Robot cost = $30k-100k per unit (purchase) or
 * $1.5k-4k/month (lease/aaS). 60% of robotics ROI comes from labor
 * savings, 25% from consistency/waste, 15% from speed/throughput.
 *
 * 208th POSR-exclusive differentiator. Distinct from:
 *   - kitchen-bottleneck.service — identifies kitchen BOTTLENECKS
 *     (analysis). This optimizer focuses on ROBOTICS solutions to
 *     bottlenecks (automation deployment).
 *   - kitchen-station-efficiency.service — optimizes station LAYOUT.
 *     This optimizer focuses on AUTOMATING stations (robots).
 *   - kitchen-prep-scheduler.service — schedules PREP tasks. This
 *     optimizer focuses on AUTOMATING prep (robotic prep stations).
 *   - kitchen-demand-surge.service — handles DEMAND surges. This
 *     optimizer focuses on robotics for surge capacity (24/7 output).
 *   - kitchen-skill-gap.service — identifies SKILL gaps. This optimizer
 *     focuses on robotics eliminating skill gaps (consistent execution).
 *   - equipment-maintenance.service — maintains TRADITIONAL equipment.
 *     This optimizer focuses on robot-specific maintenance.
 *   - labor-optimization.service — optimizes HUMAN labor. This optimizer
 *     focuses on REPLACING/augmenting labor with robotics.
 *   - energy-optimization.service — optimizes ENERGY usage. This
 *     optimizer focuses on robotics-specific energy savings.
 *   - food-safety.service — HACCP temperature logs. This optimizer
 *     focuses on robotics improving food safety (no cross-contamination).
 *
 * 8 AI rules:
 *   1. kitchen_robotics_strategy_absent -> no robotics -> missed $4B market + labor savings
 *   2. robotic_cooking_automation_low -> low cooking automation -> missed consistency + speed
 *   3. robotic_prep_automation_absent -> no prep automation -> missed 40-60% stockout reduction
 *   4. inventory_automation_absent -> no inventory automation -> missed 40-60% stockout reduction
 *   5. cleaning_automation_absent -> no cleaning automation -> missed 2-4h/day labor
 *   6. robotics_roi_tracking_absent -> no ROI tracking -> can't optimize deployment
 *   7. robotics_maintenance_program_absent -> no maintenance -> downtime + repairs
 *   8. staff_robotics_retraining_absent -> no retraining -> failed deployment
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type KitchenRoboticsRuleId =
  | 'kitchen_robotics_strategy_absent'
  | 'robotic_cooking_automation_low'
  | 'robotic_prep_automation_absent'
  | 'inventory_automation_absent'
  | 'cleaning_automation_absent'
  | 'robotics_roi_tracking_absent'
  | 'robotics_maintenance_program_absent'
  | 'staff_robotics_retraining_absent';

export type KitchenRoboticsAiRec =
  | 'launch_kitchen_robotics_strategy'
  | 'deploy_robotic_cooking'
  | 'deploy_robotic_prep'
  | 'deploy_inventory_automation'
  | 'deploy_cleaning_automation'
  | 'implement_roi_tracking'
  | 'implement_maintenance_program'
  | 'conduct_staff_retraining'
  | 'monitor'
  | 'skip';

export interface KitchenRoboticsAlert {
  id?: string;
  rule_id: KitchenRoboticsRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  // Robotics strategy
  has_kitchen_robotics_strategy?: boolean;
  robot_count?: number;
  robot_target_count?: number;
  robot_types_deployed?: string;
  // Cooking automation
  has_robotic_cooking?: boolean;
  cooking_automation_pct?: number;
  cooking_automation_target_pct?: number;
  robotic_fryer_count?: number;
  robotic_grill_count?: number;
  robotic_oven_count?: number;
  conveyor_cooking_count?: number;
  // Prep automation
  has_robotic_prep?: boolean;
  prep_automation_pct?: number;
  prep_automation_target_pct?: number;
  automated_prep_stations_count?: number;
  // Inventory automation
  has_inventory_automation?: boolean;
  smart_shelf_count?: number;
  rfid_enabled?: boolean;
  inventory_stockout_rate_pct?: number;
  inventory_stockout_target_pct?: number;
  // Cleaning automation
  has_cleaning_automation?: boolean;
  auto_clean_oven_count?: number;
  auto_clean_floor_count?: number;
  cleaning_automation_hours_saved_daily?: number;
  // ROI tracking
  has_robotics_roi_tracking?: boolean;
  robotics_investment_total?: number;
  robotics_labor_savings_monthly?: number;
  robotics_waste_savings_monthly?: number;
  robotics_speed_savings_monthly?: number;
  robotics_roas?: number;
  // Maintenance
  has_robotics_maintenance_program?: boolean;
  maintenance_frequency_per_year?: number;
  robot_downtime_hours_monthly?: number;
  maintenance_cost_monthly?: number;
  repair_cost_annual?: number;
  // Staff retraining
  has_staff_robotics_retraining?: boolean;
  staff_retrained_count?: number;
  staff_retrained_target?: number;
  retraining_completion_pct?: number;
  // Performance metrics
  labor_cost_monthly?: number;
  labor_savings_potential_monthly?: number;
  food_consistency_score?: number;
  food_consistency_target_score?: number;
  speed_of_service_seconds?: number;
  speed_of_service_target_seconds?: number;
  kitchen_throughput_orders_hour?: number;
  kitchen_throughput_target_orders_hour?: number;
  food_safety_incidents_last_year?: number;
  competitor_robotics_score?: number;
  monthly_revenue?: number;
  // Costs
  robot_purchase_cost_avg?: number;
  robot_lease_cost_monthly_avg?: number;
  // Impact projections
  labor_savings_projected_pct?: number;
  consistency_lift_projected_pts?: number;
  speed_lift_projected_pct?: number;
  throughput_lift_projected_pct?: number;
  waste_reduction_projected_pct?: number;
  stockout_reduction_projected_pct?: number;
  cleaning_labor_savings_projected_hours?: number;
  downtime_reduction_projected_pct?: number;
  roi_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: KitchenRoboticsAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface KitchenRoboticsConfig {
  aiEnabled: boolean;
  requireKitchenRoboticsStrategy: boolean;
  requireRoboticsRoiTracking: boolean;
  requireRoboticsMaintenanceProgram: boolean;
  requireStaffRoboticsRetraining: boolean;
  minCookingAutomationPct: number;
  minPrepAutomationPct: number;
  maxInventoryStockoutRatePct: number;
  minCleaningAutomationHoursSavedDaily: number;
  minFoodConsistencyScore: number;
  maxRobotDowntimeHoursMonthly: number;
  minRoboticsRoas: number;
  minRetrainingCompletionPct: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_KITCHEN_ROBOTICS_CONFIG: KitchenRoboticsConfig = {
  aiEnabled: true,
  requireKitchenRoboticsStrategy: true,
  requireRoboticsRoiTracking: true,
  requireRoboticsMaintenanceProgram: true,
  requireStaffRoboticsRetraining: true,
  minCookingAutomationPct: 30,
  minPrepAutomationPct: 20,
  maxInventoryStockoutRatePct: 5,
  minCleaningAutomationHoursSavedDaily: 2,
  minFoodConsistencyScore: 85,
  maxRobotDowntimeHoursMonthly: 10,
  minRoboticsRoas: 3,
  minRetrainingCompletionPct: 85,
  preferCompetitorParity: true,
};

export const readKitchenRoboticsConfig = (settings: any): KitchenRoboticsConfig => ({
  aiEnabled: settings?.kitchen_robotics_ai_enabled ?? true,
  requireKitchenRoboticsStrategy: settings?.kitchen_robotics_require_strategy ?? true,
  requireRoboticsRoiTracking: settings?.kitchen_robotics_require_roi ?? true,
  requireRoboticsMaintenanceProgram: settings?.kitchen_robotics_require_maintenance ?? true,
  requireStaffRoboticsRetraining: settings?.kitchen_robotics_require_retraining ?? true,
  minCookingAutomationPct: safeNumber(settings?.kitchen_robotics_min_cooking_auto, 30),
  minPrepAutomationPct: safeNumber(settings?.kitchen_robotics_min_prep_auto, 20),
  maxInventoryStockoutRatePct: safeNumber(settings?.kitchen_robotics_max_stockout, 5),
  minCleaningAutomationHoursSavedDaily: safeNumber(settings?.kitchen_robotics_min_cleaning_hours, 2),
  minFoodConsistencyScore: safeNumber(settings?.kitchen_robotics_min_consistency, 85),
  maxRobotDowntimeHoursMonthly: safeNumber(settings?.kitchen_robotics_max_downtime, 10),
  minRoboticsRoas: safeNumber(settings?.kitchen_robotics_min_roas, 3),
  minRetrainingCompletionPct: safeNumber(settings?.kitchen_robotics_min_retraining, 85),
  preferCompetitorParity: settings?.kitchen_robotics_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface KitchenRoboticsData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_kitchen_robotics_strategy: boolean;
  robot_count: number;
  robot_target_count: number;
  robot_types_deployed: string;
  has_robotic_cooking: boolean;
  cooking_automation_pct: number;
  cooking_automation_target_pct: number;
  robotic_fryer_count: number;
  robotic_grill_count: number;
  robotic_oven_count: number;
  conveyor_cooking_count: number;
  has_robotic_prep: boolean;
  prep_automation_pct: number;
  prep_automation_target_pct: number;
  automated_prep_stations_count: number;
  has_inventory_automation: boolean;
  smart_shelf_count: number;
  rfid_enabled: boolean;
  inventory_stockout_rate_pct: number;
  inventory_stockout_target_pct: number;
  has_cleaning_automation: boolean;
  auto_clean_oven_count: number;
  auto_clean_floor_count: number;
  cleaning_automation_hours_saved_daily: number;
  has_robotics_roi_tracking: boolean;
  robotics_investment_total: number;
  robotics_labor_savings_monthly: number;
  robotics_waste_savings_monthly: number;
  robotics_speed_savings_monthly: number;
  robotics_roas: number;
  has_robotics_maintenance_program: boolean;
  maintenance_frequency_per_year: number;
  robot_downtime_hours_monthly: number;
  maintenance_cost_monthly: number;
  repair_cost_annual: number;
  has_staff_robotics_retraining: boolean;
  staff_retrained_count: number;
  staff_retrained_target: number;
  retraining_completion_pct: number;
  labor_cost_monthly: number;
  labor_savings_potential_monthly: number;
  food_consistency_score: number;
  food_consistency_target_score: number;
  speed_of_service_seconds: number;
  speed_of_service_target_seconds: number;
  kitchen_throughput_orders_hour: number;
  kitchen_throughput_target_orders_hour: number;
  food_safety_incidents_last_year: number;
  competitor_robotics_score: number;
  monthly_revenue: number;
  robot_purchase_cost_avg: number;
  robot_lease_cost_monthly_avg: number;
}

const MOCK_DATA: KitchenRoboticsData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_kitchen_robotics_strategy: false, robot_count: 0,
    robot_target_count: 4, robot_types_deployed: 'none',
    has_robotic_cooking: false, cooking_automation_pct: 0,
    cooking_automation_target_pct: 35,
    robotic_fryer_count: 0, robotic_grill_count: 0,
    robotic_oven_count: 0, conveyor_cooking_count: 0,
    has_robotic_prep: false, prep_automation_pct: 0,
    prep_automation_target_pct: 25, automated_prep_stations_count: 0,
    has_inventory_automation: false, smart_shelf_count: 0,
    rfid_enabled: false, inventory_stockout_rate_pct: 14,
    inventory_stockout_target_pct: 4,
    has_cleaning_automation: false, auto_clean_oven_count: 0,
    auto_clean_floor_count: 0, cleaning_automation_hours_saved_daily: 0,
    has_robotics_roi_tracking: false, robotics_investment_total: 0,
    robotics_labor_savings_monthly: 0, robotics_waste_savings_monthly: 0,
    robotics_speed_savings_monthly: 0, robotics_roas: 0,
    has_robotics_maintenance_program: false, maintenance_frequency_per_year: 0,
    robot_downtime_hours_monthly: 0, maintenance_cost_monthly: 0,
    repair_cost_annual: 0,
    has_staff_robotics_retraining: false, staff_retrained_count: 0,
    staff_retrained_target: 6, retraining_completion_pct: 0,
    labor_cost_monthly: 28000, labor_savings_potential_monthly: 8400,
    food_consistency_score: 68, food_consistency_target_score: 88,
    speed_of_service_seconds: 320, speed_of_service_target_seconds: 240,
    kitchen_throughput_orders_hour: 80, kitchen_throughput_target_orders_hour: 120,
    food_safety_incidents_last_year: 2, competitor_robotics_score: 58,
    monthly_revenue: 86000,
    robot_purchase_cost_avg: 60000, robot_lease_cost_monthly_avg: 2500,
  },
  {
    location_id: 'kitchen_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_kitchen_robotics_strategy: true, robot_count: 2,
    robot_target_count: 4, robot_types_deployed: 'fryer,grill',
    has_robotic_cooking: true, cooking_automation_pct: 22,
    cooking_automation_target_pct: 35,
    robotic_fryer_count: 1, robotic_grill_count: 1,
    robotic_oven_count: 0, conveyor_cooking_count: 0,
    has_robotic_prep: false, prep_automation_pct: 8,
    prep_automation_target_pct: 25, automated_prep_stations_count: 0,
    has_inventory_automation: false, smart_shelf_count: 0,
    rfid_enabled: false, inventory_stockout_rate_pct: 11,
    inventory_stockout_target_pct: 4,
    has_cleaning_automation: false, auto_clean_oven_count: 0,
    auto_clean_floor_count: 0, cleaning_automation_hours_saved_daily: 0,
    has_robotics_roi_tracking: false, robotics_investment_total: 80000,
    robotics_labor_savings_monthly: 3200, robotics_waste_savings_monthly: 800,
    robotics_speed_savings_monthly: 600, robotics_roas: 0,
    has_robotics_maintenance_program: false, maintenance_frequency_per_year: 2,
    robot_downtime_hours_monthly: 18, maintenance_cost_monthly: 200,
    repair_cost_annual: 4800,
    has_staff_robotics_retraining: false, staff_retrained_count: 2,
    staff_retrained_target: 5, retraining_completion_pct: 30,
    labor_cost_monthly: 32000, labor_savings_potential_monthly: 9600,
    food_consistency_score: 78, food_consistency_target_score: 88,
    speed_of_service_seconds: 280, speed_of_service_target_seconds: 240,
    kitchen_throughput_orders_hour: 95, kitchen_throughput_target_orders_hour: 120,
    food_safety_incidents_last_year: 1, competitor_robotics_score: 72,
    monthly_revenue: 124000,
    robot_purchase_cost_avg: 60000, robot_lease_cost_monthly_avg: 2500,
  },
  {
    location_id: 'kitchen_2', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'mixed',
    has_kitchen_robotics_strategy: true, robot_count: 6,
    robot_target_count: 5, robot_types_deployed: 'fryer,grill,oven,prep,beverage',
    has_robotic_cooking: true, cooking_automation_pct: 48,
    cooking_automation_target_pct: 35,
    robotic_fryer_count: 2, robotic_grill_count: 1,
    robotic_oven_count: 1, conveyor_cooking_count: 2,
    has_robotic_prep: true, prep_automation_pct: 32,
    prep_automation_target_pct: 25, automated_prep_stations_count: 2,
    has_inventory_automation: true, smart_shelf_count: 8,
    rfid_enabled: true, inventory_stockout_rate_pct: 4,
    inventory_stockout_target_pct: 4,
    has_cleaning_automation: true, auto_clean_oven_count: 1,
    auto_clean_floor_count: 1, cleaning_automation_hours_saved_daily: 3,
    has_robotics_roi_tracking: true, robotics_investment_total: 320000,
    robotics_labor_savings_monthly: 14000, robotics_waste_savings_monthly: 2800,
    robotics_speed_savings_monthly: 2200, robotics_roas: 5.8,
    has_robotics_maintenance_program: true, maintenance_frequency_per_year: 6,
    robot_downtime_hours_monthly: 6, maintenance_cost_monthly: 800,
    repair_cost_annual: 3200,
    has_staff_robotics_retraining: true, staff_retrained_count: 12,
    staff_retrained_target: 10, retraining_completion_pct: 88,
    labor_cost_monthly: 38000, labor_savings_potential_monthly: 11400,
    food_consistency_score: 88, food_consistency_target_score: 88,
    speed_of_service_seconds: 230, speed_of_service_target_seconds: 240,
    kitchen_throughput_orders_hour: 135, kitchen_throughput_target_orders_hour: 120,
    food_safety_incidents_last_year: 0, competitor_robotics_score: 80,
    monthly_revenue: 186000,
    robot_purchase_cost_avg: 55000, robot_lease_cost_monthly_avg: 2200,
  },
  {
    location_id: 'kitchen_3', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'mixed',
    has_kitchen_robotics_strategy: true, robot_count: 12,
    robot_target_count: 8, robot_types_deployed: 'fryer,grill,oven,prep,beverage,dishwasher,cleaning',
    has_robotic_cooking: true, cooking_automation_pct: 68,
    cooking_automation_target_pct: 35,
    robotic_fryer_count: 4, robotic_grill_count: 2,
    robotic_oven_count: 2, conveyor_cooking_count: 4,
    has_robotic_prep: true, prep_automation_pct: 52,
    prep_automation_target_pct: 25, automated_prep_stations_count: 4,
    has_inventory_automation: true, smart_shelf_count: 16,
    rfid_enabled: true, inventory_stockout_rate_pct: 2,
    inventory_stockout_target_pct: 4,
    has_cleaning_automation: true, auto_clean_oven_count: 2,
    auto_clean_floor_count: 2, cleaning_automation_hours_saved_daily: 4,
    has_robotics_roi_tracking: true, robotics_investment_total: 680000,
    robotics_labor_savings_monthly: 32000, robotics_waste_savings_monthly: 5200,
    robotics_speed_savings_monthly: 4800, robotics_roas: 7.2,
    has_robotics_maintenance_program: true, maintenance_frequency_per_year: 8,
    robot_downtime_hours_monthly: 3, maintenance_cost_monthly: 1500,
    repair_cost_annual: 2400,
    has_staff_robotics_retraining: true, staff_retrained_count: 24,
    staff_retrained_target: 18, retraining_completion_pct: 96,
    labor_cost_monthly: 42000, labor_savings_potential_monthly: 12600,
    food_consistency_score: 94, food_consistency_target_score: 88,
    speed_of_service_seconds: 195, speed_of_service_target_seconds: 240,
    kitchen_throughput_orders_hour: 165, kitchen_throughput_target_orders_hour: 120,
    food_safety_incidents_last_year: 0, competitor_robotics_score: 86,
    monthly_revenue: 280000,
    robot_purchase_cost_avg: 52000, robot_lease_cost_monthly_avg: 2000,
  },
];

export const runKitchenRoboticsEngine = async (
  db: ReturnType<typeof useDB>,
  config: KitchenRoboticsConfig,
): Promise<{ alerts: KitchenRoboticsAlert[]; generated: number }> => {
  const alerts: KitchenRoboticsAlert[] = [];
  const now = new Date();

  let data: KitchenRoboticsData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_kitchen_robotics_strategy, robot_count, robot_target_count,
              robot_types_deployed,
              has_robotic_cooking, cooking_automation_pct,
              cooking_automation_target_pct,
              robotic_fryer_count, robotic_grill_count,
              robotic_oven_count, conveyor_cooking_count,
              has_robotic_prep, prep_automation_pct,
              prep_automation_target_pct, automated_prep_stations_count,
              has_inventory_automation, smart_shelf_count, rfid_enabled,
              inventory_stockout_rate_pct, inventory_stockout_target_pct,
              has_cleaning_automation, auto_clean_oven_count,
              auto_clean_floor_count, cleaning_automation_hours_saved_daily,
              has_robotics_roi_tracking, robotics_investment_total,
              robotics_labor_savings_monthly, robotics_waste_savings_monthly,
              robotics_speed_savings_monthly, robotics_roas,
              has_robotics_maintenance_program, maintenance_frequency_per_year,
              robot_downtime_hours_monthly, maintenance_cost_monthly,
              repair_cost_annual,
              has_staff_robotics_retraining, staff_retrained_count,
              staff_retrained_target, retraining_completion_pct,
              labor_cost_monthly, labor_savings_potential_monthly,
              food_consistency_score, food_consistency_target_score,
              speed_of_service_seconds, speed_of_service_target_seconds,
              kitchen_throughput_orders_hour, kitchen_throughput_target_orders_hour,
              food_safety_incidents_last_year, competitor_robotics_score,
              monthly_revenue,
              robot_purchase_cost_avg, robot_lease_cost_monthly_avg
       FROM kitchen_robotics_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): KitchenRoboticsData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_kitchen_robotics_strategy: Boolean(r.has_kitchen_robotics_strategy ?? false),
      robot_count: safeNumber(r.robot_count, 0),
      robot_target_count: safeNumber(r.robot_target_count, 0),
      robot_types_deployed: String(r.robot_types_deployed ?? 'none'),
      has_robotic_cooking: Boolean(r.has_robotic_cooking ?? false),
      cooking_automation_pct: safeNumber(r.cooking_automation_pct, 0),
      cooking_automation_target_pct: safeNumber(r.cooking_automation_target_pct, 35),
      robotic_fryer_count: safeNumber(r.robotic_fryer_count, 0),
      robotic_grill_count: safeNumber(r.robotic_grill_count, 0),
      robotic_oven_count: safeNumber(r.robotic_oven_count, 0),
      conveyor_cooking_count: safeNumber(r.conveyor_cooking_count, 0),
      has_robotic_prep: Boolean(r.has_robotic_prep ?? false),
      prep_automation_pct: safeNumber(r.prep_automation_pct, 0),
      prep_automation_target_pct: safeNumber(r.prep_automation_target_pct, 25),
      automated_prep_stations_count: safeNumber(r.automated_prep_stations_count, 0),
      has_inventory_automation: Boolean(r.has_inventory_automation ?? false),
      smart_shelf_count: safeNumber(r.smart_shelf_count, 0),
      rfid_enabled: Boolean(r.rfid_enabled ?? false),
      inventory_stockout_rate_pct: safeNumber(r.inventory_stockout_rate_pct, 0),
      inventory_stockout_target_pct: safeNumber(r.inventory_stockout_target_pct, 4),
      has_cleaning_automation: Boolean(r.has_cleaning_automation ?? false),
      auto_clean_oven_count: safeNumber(r.auto_clean_oven_count, 0),
      auto_clean_floor_count: safeNumber(r.auto_clean_floor_count, 0),
      cleaning_automation_hours_saved_daily: safeNumber(r.cleaning_automation_hours_saved_daily, 0),
      has_robotics_roi_tracking: Boolean(r.has_robotics_roi_tracking ?? false),
      robotics_investment_total: safeNumber(r.robotics_investment_total, 0),
      robotics_labor_savings_monthly: safeNumber(r.robotics_labor_savings_monthly, 0),
      robotics_waste_savings_monthly: safeNumber(r.robotics_waste_savings_monthly, 0),
      robotics_speed_savings_monthly: safeNumber(r.robotics_speed_savings_monthly, 0),
      robotics_roas: safeNumber(r.robotics_roas, 0),
      has_robotics_maintenance_program: Boolean(r.has_robotics_maintenance_program ?? false),
      maintenance_frequency_per_year: safeNumber(r.maintenance_frequency_per_year, 0),
      robot_downtime_hours_monthly: safeNumber(r.robot_downtime_hours_monthly, 0),
      maintenance_cost_monthly: safeNumber(r.maintenance_cost_monthly, 0),
      repair_cost_annual: safeNumber(r.repair_cost_annual, 0),
      has_staff_robotics_retraining: Boolean(r.has_staff_robotics_retraining ?? false),
      staff_retrained_count: safeNumber(r.staff_retrained_count, 0),
      staff_retrained_target: safeNumber(r.staff_retrained_target, 0),
      retraining_completion_pct: safeNumber(r.retraining_completion_pct, 0),
      labor_cost_monthly: safeNumber(r.labor_cost_monthly, 0),
      labor_savings_potential_monthly: safeNumber(r.labor_savings_potential_monthly, 0),
      food_consistency_score: safeNumber(r.food_consistency_score, 0),
      food_consistency_target_score: safeNumber(r.food_consistency_target_score, 88),
      speed_of_service_seconds: safeNumber(r.speed_of_service_seconds, 0),
      speed_of_service_target_seconds: safeNumber(r.speed_of_service_target_seconds, 240),
      kitchen_throughput_orders_hour: safeNumber(r.kitchen_throughput_orders_hour, 0),
      kitchen_throughput_target_orders_hour: safeNumber(r.kitchen_throughput_target_orders_hour, 120),
      food_safety_incidents_last_year: safeNumber(r.food_safety_incidents_last_year, 0),
      competitor_robotics_score: safeNumber(r.competitor_robotics_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      robot_purchase_cost_avg: safeNumber(r.robot_purchase_cost_avg, 0),
      robot_lease_cost_monthly_avg: safeNumber(r.robot_lease_cost_monthly_avg, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetLaborSavingsPct = 25;
    const targetConsistencyLiftPts = 18;
    const targetSpeedLiftPct = 25;
    const targetThroughputLiftPct = 30;
    const targetWasteReductionPct = 35;
    const targetStockoutReductionPct = 60;
    const targetCleaningHoursSaved = 3;
    const targetDowntimeReductionPct = 50;
    const targetRoiLiftPct = 30;

    // Rule 1: KITCHEN_ROBOTICS_STRATEGY_ABSENT
    if (config.requireKitchenRoboticsStrategy && !d.has_kitchen_robotics_strategy) {
      // no robotics -> missed $4B market + labor savings
      const expectedLaborSavings = Math.round(d.labor_savings_potential_monthly * 0.60);
      const expectedConsistencyLift = Math.round(baselineRevenue * 0.04);
      const expectedSpeedLift = Math.round(baselineRevenue * 0.03);
      const expectedSafetyLift = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedLaborSavings + expectedConsistencyLift + expectedSpeedLift + expectedSafetyLift, 3800);
      const severityLabel = d.competitor_robotics_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_robotics_score > 65)
        ? 'CRITICAL: NO KITCHEN ROBOTICS STRATEGY — competitor robotics score ' + d.competitor_robotics_score + '/100 (high); restaurant robotics market = $4B+ by 2030 (Allied Market Research), growing 25%+ CAGR; each robot replaces 1-3 FTE ($30k-90k/year savings); 35% of QSRs plan robotics by 2027 (Restaurant Business); robots work 24/7 (no breaks, no sick days, no overtime); missing robotics = missed labor savings + missed consistency + missed speed; competitors with robotics scale faster + cheaper. '
        : `HIGH: NO KITCHEN ROBOTICS STRATEGY — robotics market $4B+ by 2030 (Allied Market Research); each robot replaces 1-3 FTE ($30k-90k/year savings); 35% of QSRs plan robotics by 2027; missing labor savings + consistency + speed. `;
      alerts.push({
        rule_id: 'kitchen_robotics_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_kitchen_robotics_strategy: d.has_kitchen_robotics_strategy,
        robot_count: d.robot_count,
        robot_target_count: d.robot_target_count,
        robot_types_deployed: d.robot_types_deployed,
        labor_cost_monthly: d.labor_cost_monthly,
        labor_savings_potential_monthly: d.labor_savings_potential_monthly,
        food_consistency_score: d.food_consistency_score,
        food_consistency_target_score: d.food_consistency_target_score,
        speed_of_service_seconds: d.speed_of_service_seconds,
        speed_of_service_target_seconds: d.speed_of_service_target_seconds,
        kitchen_throughput_orders_hour: d.kitchen_throughput_orders_hour,
        kitchen_throughput_target_orders_hour: d.kitchen_throughput_target_orders_hour,
        food_safety_incidents_last_year: d.food_safety_incidents_last_year,
        competitor_robotics_score: d.competitor_robotics_score,
        monthly_revenue: d.monthly_revenue,
        robot_purchase_cost_avg: d.robot_purchase_cost_avg,
        robot_lease_cost_monthly_avg: d.robot_lease_cost_monthly_avg,
        labor_savings_projected_pct: targetLaborSavingsPct,
        consistency_lift_projected_pts: targetConsistencyLiftPts,
        speed_lift_projected_pct: targetSpeedLiftPct,
        throughput_lift_projected_pct: targetThroughputLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `KITCHEN ROBOTICS STRATEGY ABSENT: ${d.location_id} — robotics strategy ABSENT; robots 0 (target ${d.robot_target_count}); types: ${d.robot_types_deployed}; labor cost ${fmt$(d.labor_cost_monthly)}/mo; labor savings potential ${fmt$(d.labor_savings_potential_monthly)}/mo; food consistency ${d.food_consistency_score}/100 (target ${d.food_consistency_target_score}); speed of service ${d.speed_of_service_seconds}s (target ${d.speed_of_service_target_seconds}s); throughput ${d.kitchen_throughput_orders_hour} orders/hr (target ${d.kitchen_throughput_target_orders_hour}); food safety incidents ${d.food_safety_incidents_last_year}/yr; competitor robotics ${d.competitor_robotics_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: restaurant robotics market = $4B+ by 2030 (Allied Market Research), growing 25%+ CAGR; Miso Robotics Flippy flips 150+ burgers/hour = 2-3x human output; White Castle deployed Flippy at 100+ locations; each robot replaces 1-3 FTE ($30k-90k/year savings); robots work 24/7 (no breaks, no sick days, no overtime); food consistency improves 10-20% (exact temps, exact times); food safety improves (no cross-contamination from human hands); speed of service increases 15-30% (no fatigue, consistent pace); kitchen throughput increases 20-40% (bottleneck reduction); robotics ROI = $3-8 per $1 spent (2-4 year payback); 35% of QSRs plan robotics deployment by 2027 (Restaurant Business); 60% of robotics ROI comes from labor savings, 25% from consistency/waste, 15% from speed/throughput; robotics types = robotic fryers (Flippy, Miso Robotics), robotic grills (automated flipping), smart ovens (combitherm, conveyor), conveyor cooking (pizza, burgers), robotic beverage dispensers, robotic dishwashers, automated prep stations, inventory automation (smart shelves, RFID), cleaning automation. Solutions ranked by impact: (1) LAUNCH kitchen robotics strategy — labor savings ${fmt$(expectedLaborSavings)}/mo + consistency lift ${fmt$(expectedConsistencyLift)}/mo + speed lift ${fmt$(expectedSpeedLift)}/mo + safety ${fmt$(expectedSafetyLift)}/mo; cost ${fmt$(d.robot_lease_cost_monthly_avg * 2)}/mo lease (2 robots) or ${fmt$(d.robot_purchase_cost_avg * 2)} purchase; payback 2-4 years; (2) IDENTIFY highest-ROI automation targets (fryer, grill, prep); (3) EVALUATE robot providers (Miso Robotics Flippy, Wilkinson, Nala Robotics, Creator); (4) DECIDE purchase vs lease (purchase $30k-100k/unit, lease $1.5k-4k/month); (5) PILOT 1-2 robots on highest-volume station; (6) MEASURE ROI (labor savings, consistency, speed, throughput); (7) SCALE to additional stations if ROI justifies; (8) IMPLEMENT ROI tracking (per-robot metrics); (9) ESTABLISH maintenance program (preventive); (10) RETRAIN staff (operators not cooks); (11) BENCHMARK vs competitor robotics deployment. Industry data: $4B+ market by 2030 (Allied); $3-8 ROI per $1; 2-4 year payback; 35% QSRs plan by 2027. Expected impact: +${targetLaborSavingsPct}% labor savings, +${targetConsistencyLiftPts}pts consistency, +${targetSpeedLiftPct}% speed, payback 2-4 years.`,
        ai_recommendation: 'launch_kitchen_robotics_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: ROBOTIC_COOKING_AUTOMATION_LOW
    if (d.has_kitchen_robotics_strategy && d.cooking_automation_pct < config.minCookingAutomationPct) {
      // low cooking automation -> missed consistency + speed
      const cookingGap = Math.max(config.minCookingAutomationPct - d.cooking_automation_pct, 0);
      const expectedConsistencyLift = Math.round(baselineRevenue * (cookingGap / 200));
      const expectedSpeedLift = Math.round(baselineRevenue * (cookingGap / 300));
      const expectedThroughputLift = Math.round(baselineRevenue * (cookingGap / 400));
      const expectedWasteReduction = Math.round(baselineRevenue * (cookingGap / 500));
      const totalOpportunity = Math.max(expectedConsistencyLift + expectedSpeedLift + expectedThroughputLift + expectedWasteReduction, 2200);
      const severityLabel = d.cooking_automation_pct < 15 ? 'high' : 'medium';
      const criticalNote = (d.cooking_automation_pct < 15)
        ? `HIGH: ROBOTIC COOKING AUTOMATION LOW — cooking automation ${d.cooking_automation_pct}% (min ${config.minCookingAutomationPct}%); robotic fryers ${d.robotic_fryer_count}, grills ${d.robotic_grill_count}, ovens ${d.robotic_oven_count}, conveyors ${d.conveyor_cooking_count}; robotic fryers reduce oil waste 30-40%; automated grills reduce cook time 20-30%; conveyor cooking = consistent 99%+ vs 85-90% human; low automation = missed consistency + speed + waste reduction. `
        : `MEDIUM: COOKING AUTOMATION BELOW TARGET — ${d.cooking_automation_pct}% (min ${config.minCookingAutomationPct}%); add robots for consistency + speed. `;
      alerts.push({
        rule_id: 'robotic_cooking_automation_low',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_robotic_cooking: d.has_robotic_cooking,
        cooking_automation_pct: d.cooking_automation_pct,
        cooking_automation_target_pct: d.cooking_automation_target_pct,
        robotic_fryer_count: d.robotic_fryer_count,
        robotic_grill_count: d.robotic_grill_count,
        robotic_oven_count: d.robotic_oven_count,
        conveyor_cooking_count: d.conveyor_cooking_count,
        food_consistency_score: d.food_consistency_score,
        food_consistency_target_score: d.food_consistency_target_score,
        speed_of_service_seconds: d.speed_of_service_seconds,
        speed_of_service_target_seconds: d.speed_of_service_target_seconds,
        kitchen_throughput_orders_hour: d.kitchen_throughput_orders_hour,
        monthly_revenue: d.monthly_revenue,
        robot_lease_cost_monthly_avg: d.robot_lease_cost_monthly_avg,
        consistency_lift_projected_pts: targetConsistencyLiftPts,
        speed_lift_projected_pct: targetSpeedLiftPct,
        throughput_lift_projected_pct: targetThroughputLiftPct,
        waste_reduction_projected_pct: targetWasteReductionPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ROBOTIC COOKING AUTOMATION LOW: ${d.location_id} — cooking automation ${d.cooking_automation_pct}% (min ${config.minCookingAutomationPct}%, target ${d.cooking_automation_target_pct}%); robotic fryers ${d.robotic_fryer_count}, grills ${d.robotic_grill_count}, ovens ${d.robotic_oven_count}, conveyors ${d.conveyor_cooking_count}; food consistency ${d.food_consistency_score}/100 (target ${d.food_consistency_target_score}); speed of service ${d.speed_of_service_seconds}s (target ${d.speed_of_service_target_seconds}s); throughput ${d.kitchen_throughput_orders_hour} orders/hr; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: robotic fryers (Miso Robotics Flippy) reduce oil waste 30-40% (consistent temperature); automated grills reduce cook time 20-30% (consistent flipping); smart ovens (combitherm, conveyor) reduce energy 15-25%; conveyor cooking (pizza, burgers) = consistent product 99%+ vs 85-90% human; robotic cooking improves food consistency 10-20% (exact temps, exact times); robotic cooking improves speed 15-30% (no fatigue, consistent pace); robotic cooking improves throughput 20-40% (bottleneck reduction); robotic cooking types = fryer automation (Flippy flips 150+ burgers/hour), grill automation (automated flipping, temperature), oven automation (combitherm, programmable), conveyor cooking (pizza, burgers, sandwiches — consistent product); robotic cooking ROI = $3-8 per $1 spent; robotic cooking best practice = pilot on highest-volume station first, measure ROI, scale if justified. Solutions ranked by impact: (1) DEPLOY robotic cooking — consistency lift ${fmt$(expectedConsistencyLift)}/mo + speed lift ${fmt$(expectedSpeedLift)}/mo + throughput ${fmt$(expectedThroughputLift)}/mo + waste reduction ${fmt$(expectedWasteReduction)}/mo; cost ${fmt$(d.robot_lease_cost_monthly_avg * 2)}/mo lease (2 robots); payback 2-4 years; (2) IDENTIFY highest-volume cooking station (fryer, grill, oven); (3) EVALUATE robot providers (Miso Robotics Flippy for fryers, Wilkinson for grills, combitherm for ovens); (4) DEPLOY robotic fryer (Flippy — $30k-60k purchase or $1.5k-2.5k/mo lease); (5) OR automated grill (consistent flipping, temperature); (6) OR smart oven (combitherm, programmable); (7) OR conveyor cooking (pizza, burgers — consistent 99%+); (8) MEASURE consistency (target 88+); (9) MEASURE speed (target ${d.speed_of_service_target_seconds}s); (10) MEASURE throughput (target ${d.kitchen_throughput_target_orders_hour} orders/hr); (11) MEASURE waste reduction (target 30-40% oil savings); (12) SCALE to additional stations if ROI justifies; (13) BENCHMARK vs competitor cooking automation. Industry data: 30-40% oil waste reduction (Flippy); 20-30% cook time reduction; 99%+ consistency (conveyor); payback 2-4 years. Expected impact: +${targetConsistencyLiftPts}pts consistency, +${targetSpeedLiftPct}% speed, +${targetThroughputLiftPct}% throughput, payback 2-4 years.`,
        ai_recommendation: 'deploy_robotic_cooking',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: ROBOTIC_PREP_AUTOMATION_ABSENT
    if (d.has_kitchen_robotics_strategy && (!d.has_robotic_prep || d.prep_automation_pct < config.minPrepAutomationPct)) {
      // no prep automation -> missed efficiency
      const prepGap = Math.max(config.minPrepAutomationPct - d.prep_automation_pct, 0);
      const expectedLaborSavings = Math.round(d.labor_cost_monthly * (prepGap / 300));
      const expectedConsistencyLift = Math.round(baselineRevenue * (prepGap / 500));
      const expectedSpeedLift = Math.round(baselineRevenue * (prepGap / 400));
      const expectedWasteReduction = Math.round(baselineRevenue * (prepGap / 600));
      const totalOpportunity = Math.max(expectedLaborSavings + expectedConsistencyLift + expectedSpeedLift + expectedWasteReduction, 1800);
      const severityLabel = d.prep_automation_pct < 10 ? 'medium' : 'low';
      const criticalNote = (d.prep_automation_pct < 10)
        ? `MEDIUM: ROBOTIC PREP AUTOMATION ABSENT/LOW — prep automation ${d.prep_automation_pct}% (min ${config.minPrepAutomationPct}%); automated prep stations ${d.automated_prep_stations_count}; robotic prep (chopping, dicing, portioning) saves 2-4 hours/day labor; consistent portions 99%+ vs 85-90% human; missing prep automation = labor waste + inconsistent portions. `
        : `LOW: PREP AUTOMATION BELOW TARGET — ${d.prep_automation_pct}% (min ${config.minPrepAutomationPct}%); add automated prep stations. `;
      alerts.push({
        rule_id: 'robotic_prep_automation_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_robotic_prep: d.has_robotic_prep,
        prep_automation_pct: d.prep_automation_pct,
        prep_automation_target_pct: d.prep_automation_target_pct,
        automated_prep_stations_count: d.automated_prep_stations_count,
        labor_cost_monthly: d.labor_cost_monthly,
        food_consistency_score: d.food_consistency_score,
        monthly_revenue: d.monthly_revenue,
        robot_lease_cost_monthly_avg: d.robot_lease_cost_monthly_avg,
        labor_savings_projected_pct: 15,
        consistency_lift_projected_pts: 10,
        speed_lift_projected_pct: 12,
        waste_reduction_projected_pct: 20,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ROBOTIC PREP AUTOMATION ABSENT: ${d.location_id} — prep automation ${d.has_robotic_prep ? 'present' : 'ABSENT'}; automation ${d.prep_automation_pct}% (min ${config.minPrepAutomationPct}%, target ${d.prep_automation_target_pct}%); automated prep stations ${d.automated_prep_stations_count}; labor cost ${fmt$(d.labor_cost_monthly)}/mo; food consistency ${d.food_consistency_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: robotic prep (chopping, dicing, portioning) saves 2-4 hours/day labor ($50-150/day savings); consistent portions 99%+ vs 85-90% human (exact weights, exact cuts); robotic prep types = vegetable choppers (automated dicing, slicing), portioning robots (exact weights for proteins, cheese), dough sheeters (consistent pizza dough), sauce dispensers (exact portions); robotic prep ROI = $4-8 per $1 spent (labor savings + consistency + waste reduction); robotic prep best practice = automate highest-volume prep tasks first (chopping, portioning), measure labor savings + consistency, scale if justified. Solutions ranked by impact: (1) DEPLOY robotic prep — labor savings ${fmt$(expectedLaborSavings)}/mo + consistency ${fmt$(expectedConsistencyLift)}/mo + speed ${fmt$(expectedSpeedLift)}/mo + waste reduction ${fmt$(expectedWasteReduction)}/mo; cost ${fmt$(d.robot_lease_cost_monthly_avg)}/mo lease (1 prep robot); payback 2-3 years; (2) IDENTIFY highest-volume prep tasks (chopping, portioning, dough); (3) EVALUATE prep robot providers (Nala Robotics, Wilkinson, custom); (4) DEPLOY vegetable chopper (automated dicing, slicing — $20k-40k); (5) OR portioning robot (exact weights — $15k-30k); (6) OR dough sheeter (consistent pizza dough — $10k-25k); (7) OR sauce dispenser (exact portions — $5k-15k); (8) MEASURE labor savings (target 2-4h/day); (9) MEASURE consistency (target 99%+ portions); (10) MEASURE waste reduction (target 20%); (11) SCALE to additional prep tasks; (12) BENCHMARK vs competitor prep automation. Industry data: 2-4h/day labor savings; 99%+ portion consistency; payback 2-3 years. Expected impact: +15% labor savings, +10pts consistency, payback 2-3 years.`,
        ai_recommendation: 'deploy_robotic_prep',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: INVENTORY_AUTOMATION_ABSENT
    if (d.has_kitchen_robotics_strategy && (!d.has_inventory_automation || d.inventory_stockout_rate_pct > config.maxInventoryStockoutRatePct)) {
      // no inventory automation -> missed 40-60% stockout reduction
      const stockoutGap = Math.max(d.inventory_stockout_rate_pct - config.maxInventoryStockoutRatePct, 0);
      const expectedStockoutReduction = Math.round(baselineRevenue * (stockoutGap / 100) * 2);
      const expectedLaborSavings = Math.round(baselineRevenue * 0.01);
      const expectedWasteReduction = Math.round(baselineRevenue * 0.015);
      const expectedAccuracyLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedStockoutReduction + expectedLaborSavings + expectedWasteReduction + expectedAccuracyLift, 1600);
      const severityLabel = d.inventory_stockout_rate_pct > 10 ? 'high' : 'medium';
      const criticalNote = (d.inventory_stockout_rate_pct > 10)
        ? `HIGH: INVENTORY AUTOMATION ABSENT — stockout rate ${d.inventory_stockout_rate_pct}% (max ${config.maxInventoryStockoutRatePct}%); smart shelves ${d.smart_shelf_count}; RFID ${d.rfid_enabled ? 'yes' : 'NO'}; inventory automation (smart shelves, RFID) reduces stockouts 40-60%; high stockout = lost sales + customer churn; manual inventory = labor waste + inaccuracy. `
        : `MEDIUM: INVENTORY AUTOMATION BELOW TARGET — stockout ${d.inventory_stockout_rate_pct}% (max ${config.maxInventoryStockoutRatePct}%); deploy smart shelves + RFID. `;
      alerts.push({
        rule_id: 'inventory_automation_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_inventory_automation: d.has_inventory_automation,
        smart_shelf_count: d.smart_shelf_count,
        rfid_enabled: d.rfid_enabled,
        inventory_stockout_rate_pct: d.inventory_stockout_rate_pct,
        inventory_stockout_target_pct: d.inventory_stockout_target_pct,
        monthly_revenue: d.monthly_revenue,
        stockout_reduction_projected_pct: targetStockoutReductionPct,
        labor_savings_projected_pct: 10,
        waste_reduction_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `INVENTORY AUTOMATION ABSENT: ${d.location_id} — inventory automation ${d.has_inventory_automation ? 'present' : 'ABSENT'}; smart shelves ${d.smart_shelf_count}; RFID ${d.rfid_enabled ? 'enabled' : 'disabled'}; stockout rate ${d.inventory_stockout_rate_pct}% (max ${config.maxInventoryStockoutRatePct}%, target ${d.inventory_stockout_target_pct}%); monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: inventory automation (smart shelves, RFID) reduces stockouts 40-60% (real-time tracking, auto-reorder); stockouts = lost sales ($500-2,000/month per restaurant) + customer churn (25% of stockout customers don't return); manual inventory = labor waste (2-4 hours/day counting) + inaccuracy (15-20% variance); inventory automation types = smart shelves (weight sensors, real-time inventory), RFID tags (automatic scanning, no manual counting), IoT sensors (temperature, humidity for food safety), inventory management software (auto-reorder, demand forecasting); inventory automation cost = $5k-20k setup (shelves + RFID) + $100-300/month (software); inventory automation ROI = $5-15 per $1 spent (stockout reduction + labor savings + waste reduction + accuracy). Solutions ranked by impact: (1) DEPLOY inventory automation — stockout reduction ${fmt$(expectedStockoutReduction)}/mo + labor savings ${fmt$(expectedLaborSavings)}/mo + waste reduction ${fmt$(expectedWasteReduction)}/mo + accuracy ${fmt$(expectedAccuracyLift)}/mo; cost ${fmt$(800)}/mo amortized ($10k setup); payback 6-12 months; (2) INSTALL smart shelves (weight sensors — $2k-5k per shelf); (3) ENABLE RFID tags (automatic scanning — $0.10-0.50 per tag); (4) DEPLOY IoT sensors (temperature, humidity — $200-500/sensor); (5) INTEGRATE inventory management software (auto-reorder, demand forecasting); (6) SET auto-reorder thresholds (prevent stockouts); (7) TRACK stockout rate (target under ${config.maxInventoryStockoutRatePct}%); (8) TRACK labor savings (target 2-4h/day); (9) TRACK waste reduction (target 15%); (10) TRACK accuracy (target 98%+); (11) BENCHMARK vs competitor inventory automation. Industry data: 40-60% stockout reduction (smart shelves, RFID); payback 6-12 months. Expected impact: -${targetStockoutReductionPct}% stockouts, +10% labor savings, payback 6-12 months.`,
        ai_recommendation: 'deploy_inventory_automation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: CLEANING_AUTOMATION_ABSENT
    if (d.has_kitchen_robotics_strategy && (!d.has_cleaning_automation || d.cleaning_automation_hours_saved_daily < config.minCleaningAutomationHoursSavedDaily)) {
      // no cleaning automation -> missed 2-4h/day labor
      const cleaningGap = Math.max(config.minCleaningAutomationHoursSavedDaily - d.cleaning_automation_hours_saved_daily, 0);
      const expectedLaborSavings = Math.round(cleaningGap * 30 * 25);
      const expectedConsistencyLift = Math.round(baselineRevenue * 0.01);
      const expectedSafetyLift = Math.round(baselineRevenue * 0.015);
      const expectedComplianceLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedLaborSavings + expectedConsistencyLift + expectedSafetyLift + expectedComplianceLift, 1200);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: CLEANING AUTOMATION ABSENT — cleaning automation ${d.has_cleaning_automation ? 'present' : 'ABSENT'}; auto-clean ovens ${d.auto_clean_oven_count}; auto-clean floors ${d.auto_clean_floor_count}; hours saved ${d.cleaning_automation_hours_saved_daily}/day (min ${config.minCleaningAutomationHoursSavedDaily}); cleaning automation saves 2-4 hours/day labor; missing automation = labor waste + inconsistent cleanliness + food safety risk. `;
      alerts.push({
        rule_id: 'cleaning_automation_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_cleaning_automation: d.has_cleaning_automation,
        auto_clean_oven_count: d.auto_clean_oven_count,
        auto_clean_floor_count: d.auto_clean_floor_count,
        cleaning_automation_hours_saved_daily: d.cleaning_automation_hours_saved_daily,
        labor_cost_monthly: d.labor_cost_monthly,
        food_safety_incidents_last_year: d.food_safety_incidents_last_year,
        monthly_revenue: d.monthly_revenue,
        cleaning_labor_savings_projected_hours: cleaningGap,
        labor_savings_projected_pct: 8,
        consistency_lift_projected_pts: 8,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CLEANING AUTOMATION ABSENT: ${d.location_id} — cleaning automation ${d.has_cleaning_automation ? 'present' : 'ABSENT'}; auto-clean ovens ${d.auto_clean_oven_count}; auto-clean floors ${d.auto_clean_floor_count}; hours saved ${d.cleaning_automation_hours_saved_daily}/day (min ${config.minCleaningAutomationHoursSavedDaily}); labor cost ${fmt$(d.labor_cost_monthly)}/mo; food safety incidents ${d.food_safety_incidents_last_year}/yr; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: cleaning automation (auto-clean ovens, floors) saves 2-4 hours/day labor ($50-150/day savings); auto-clean ovens = pyrolytic self-cleaning (burns off residue, no chemicals); auto-clean floors = robotic floor scrubbers (autonomous, scheduled); cleaning automation improves consistency (every clean is identical); cleaning automation improves food safety (consistent sanitation, no human error); cleaning automation improves compliance (auditable cleaning logs); cleaning automation types = auto-clean ovens (pyrolytic, $2k-8k per oven), auto-clean floors (robotic scrubbers, $5k-15k per unit), automated dishwashers (high-temp, chemical — $3k-10k), CIP (clean-in-place for pipes, tanks — $5k-20k); cleaning automation cost = $5k-20k setup; cleaning automation ROI = $4-10 per $1 spent (labor savings + consistency + safety + compliance). Solutions ranked by impact: (1) DEPLOY cleaning automation — labor savings ${fmt$(expectedLaborSavings)}/mo + consistency ${fmt$(expectedConsistencyLift)}/mo + safety ${fmt$(expectedSafetyLift)}/mo + compliance ${fmt$(expectedComplianceLift)}/mo; cost ${fmt$(500)}/mo amortized ($6k setup); payback 6-12 months; (2) INSTALL auto-clean ovens (pyrolytic self-cleaning — $2k-8k per oven); (3) DEPLOY auto-clean floors (robotic scrubbers — $5k-15k); (4) UPGRADE dishwasher (high-temp, chemical — $3k-10k); (5) IMPLEMENT CIP (clean-in-place for pipes, tanks — $5k-20k); (6) SCHEDULE automated cleaning (after hours, consistent); (7) TRACK hours saved (target 2-4h/day); (8) TRACK consistency (every clean identical); (9) TRACK food safety incidents (target 0); (10) TRACK compliance (auditable logs); (11) BENCHMARK vs competitor cleaning automation. Industry data: 2-4h/day labor savings; payback 6-12 months. Expected impact: +${cleaningGap}h/day labor savings, +8pts consistency, payback 6-12 months.`,
        ai_recommendation: 'deploy_cleaning_automation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: ROBOTICS_ROI_TRACKING_ABSENT
    if (d.has_kitchen_robotics_strategy && config.requireRoboticsRoiTracking && !d.has_robotics_roi_tracking) {
      // no ROI tracking -> can't optimize deployment
      const expectedRoiRecovery = Math.round((d.robotics_labor_savings_monthly + d.robotics_waste_savings_monthly + d.robotics_speed_savings_monthly) * 0.20);
      const expectedPortfolioOptimization = Math.round(d.robotics_investment_total * 0.001);
      const expectedWastedSpendRecovery = Math.round(d.robotics_investment_total * 0.0005);
      const expectedScalingLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedPortfolioOptimization + expectedWastedSpendRecovery + expectedScalingLift, 1200);
      const severityLabel = d.robotics_investment_total > 100000 ? 'medium' : 'low';
      const criticalNote = (d.robotics_investment_total > 100000)
        ? `MEDIUM: NO ROBOTICS ROI TRACKING — investment ${fmt$(d.robotics_investment_total)} but no ROI tracking; without tracking, can't identify which robots drive savings = wasted 15-20% of investment; ROI tracking = labor savings, waste savings, speed savings, ROAS per robot. `
        : `LOW: NO ROBOTICS ROI TRACKING — implement tracking to optimize robot deployment. `;
      alerts.push({
        rule_id: 'robotics_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_robotics_roi_tracking: d.has_robotics_roi_tracking,
        robotics_investment_total: d.robotics_investment_total,
        robotics_labor_savings_monthly: d.robotics_labor_savings_monthly,
        robotics_waste_savings_monthly: d.robotics_waste_savings_monthly,
        robotics_speed_savings_monthly: d.robotics_speed_savings_monthly,
        robotics_roas: d.robotics_roas,
        robot_count: d.robot_count,
        monthly_revenue: d.monthly_revenue,
        roi_lift_projected_pct: targetRoiLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ROBOTICS ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_robotics_roi_tracking ? 'present' : 'ABSENT'}; investment ${fmt$(d.robotics_investment_total)}; labor savings ${fmt$(d.robotics_labor_savings_monthly)}/mo; waste savings ${fmt$(d.robotics_waste_savings_monthly)}/mo; speed savings ${fmt$(d.robotics_speed_savings_monthly)}/mo; ROAS ${d.robotics_roas}x; robots ${d.robot_count}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without ROI tracking, restaurants waste 15-20% of robotics investment on underperforming robots; robotics ROI tracking = labor savings per robot, waste savings per robot, speed savings per robot, ROAS per robot, throughput per robot, downtime per robot; ROI tracking tools = IoT sensors (per-robot metrics), POS integration (revenue attribution), inventory system (waste tracking), labor management (hours saved); ROI metrics = ROAS (savings / cost, target 3-6x), payback period (target 2-4 years), labor savings per robot (target $2k-5k/month), waste savings per robot (target $500-1,500/month), speed savings per robot (target $300-1,000/month), downtime per robot (target under 10h/month); ROI tracking best practice = track per robot weekly, audit portfolio quarterly (replace underperformers, scale winners). Solutions ranked by impact: (1) IMPLEMENT ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + portfolio optimization ${fmt$(expectedPortfolioOptimization)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + scaling ${fmt$(expectedScalingLift)}/mo; cost ${fmt$(300)}/mo (IoT + software); payback immediate; (2) INSTALL IoT sensors per robot (labor, waste, speed metrics); (3) INTEGRATE POS (revenue attribution per robot); (4) INTEGRATE inventory system (waste tracking); (5) INTEGRATE labor management (hours saved); (6) TRACK ROAS per robot (target ${config.minRoboticsRoas}x+); (7) TRACK payback period (target 2-4 years); (8) TRACK labor savings per robot (target $2k-5k/month); (9) TRACK downtime per robot (target under ${config.maxRobotDowntimeHoursMonthly}h/month); (10) AUDIT portfolio quarterly (replace underperformers, scale winners); (11) BENCHMARK vs competitor ROI tracking. Industry data: 15-20% wasted investment without tracking; payback immediate. Expected impact: +${targetRoiLiftPct}% ROI, +${fmt$(expectedRoiRecovery)}/mo ROI recovery, payback immediate.`,
        ai_recommendation: 'implement_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: ROBOTICS_MAINTENANCE_PROGRAM_ABSENT
    if (d.has_kitchen_robotics_strategy && config.requireRoboticsMaintenanceProgram && (!d.has_robotics_maintenance_program || d.robot_downtime_hours_monthly > config.maxRobotDowntimeHoursMonthly)) {
      // no maintenance -> downtime + repairs
      const downtimeGap = Math.max(d.robot_downtime_hours_monthly - config.maxRobotDowntimeHoursMonthly, 0);
      const expectedDowntimeReduction = Math.round(downtimeGap * d.robot_count * 50);
      const expectedRepairCostReduction = Math.round(d.repair_cost_annual * 0.50 / 12);
      const expectedThroughputProtection = Math.round(baselineRevenue * 0.02);
      const expectedLaborEfficiency = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedDowntimeReduction + expectedRepairCostReduction + expectedThroughputProtection + expectedLaborEfficiency, 1400);
      const severityLabel = d.robot_downtime_hours_monthly > 15 ? 'high' : 'medium';
      const criticalNote = (d.robot_downtime_hours_monthly > 15)
        ? `HIGH: NO ROBOTICS MAINTENANCE PROGRAM — downtime ${d.robot_downtime_hours_monthly}h/mo (max ${config.maxRobotDowntimeHoursMonthly}h); maintenance frequency ${d.maintenance_frequency_per_year}/yr; repair cost ${fmt$(d.repair_cost_annual)}/yr; without maintenance, robots break down = downtime + lost production + expensive emergency repairs; preventive maintenance reduces downtime 50-70%. `
        : `MEDIUM: MAINTENANCE PROGRAM BELOW TARGET — downtime ${d.robot_downtime_hours_monthly}h/mo (max ${config.maxRobotDowntimeHoursMonthly}h); improve maintenance for uptime. `;
      alerts.push({
        rule_id: 'robotics_maintenance_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_robotics_maintenance_program: d.has_robotics_maintenance_program,
        maintenance_frequency_per_year: d.maintenance_frequency_per_year,
        robot_downtime_hours_monthly: d.robot_downtime_hours_monthly,
        maintenance_cost_monthly: d.maintenance_cost_monthly,
        repair_cost_annual: d.repair_cost_annual,
        robot_count: d.robot_count,
        kitchen_throughput_orders_hour: d.kitchen_throughput_orders_hour,
        monthly_revenue: d.monthly_revenue,
        downtime_reduction_projected_pct: targetDowntimeReductionPct,
        throughput_lift_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ROBOTICS MAINTENANCE PROGRAM ABSENT: ${d.location_id} — maintenance program ${d.has_robotics_maintenance_program ? 'present' : 'ABSENT'}; frequency ${d.maintenance_frequency_per_year}/yr; downtime ${d.robot_downtime_hours_monthly}h/mo (max ${config.maxRobotDowntimeHoursMonthly}h); maintenance cost ${fmt$(d.maintenance_cost_monthly)}/mo; repair cost ${fmt$(d.repair_cost_annual)}/yr; robots ${d.robot_count}; throughput ${d.kitchen_throughput_orders_hour} orders/hr; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without maintenance, robots break down = downtime (lost production) + expensive emergency repairs (2-3x preventive cost); preventive maintenance reduces downtime 50-70% (scheduled, not emergency); preventive maintenance reduces repair costs 40-60% (catch issues early); maintenance cost = $2k-8k/year per robot (preventive + repairs); maintenance types = preventive maintenance (scheduled inspections, cleaning, calibration), predictive maintenance (IoT sensors predict failures), corrective maintenance (emergency repairs); maintenance best practice = preventive maintenance 4-8 times/year per robot, IoT sensors for predictive maintenance, spare parts inventory, certified technician on call; maintenance ROI = $5-15 per $1 spent (downtime avoidance + repair cost reduction). Solutions ranked by impact: (1) IMPLEMENT maintenance program — downtime reduction ${fmt$(expectedDowntimeReduction)}/mo + repair cost reduction ${fmt$(expectedRepairCostReduction)}/mo + throughput protection ${fmt$(expectedThroughputProtection)}/mo + labor efficiency ${fmt$(expectedLaborEfficiency)}/mo; cost ${fmt$(600)}/mo (maintenance contract); payback immediate; (2) SCHEDULE preventive maintenance 4-8 times/year per robot; (3) INSTALL IoT sensors for predictive maintenance (predict failures before they happen); (4) BUILD spare parts inventory (critical components); (5) CONTRACT certified technician (on-call, 24/7); (6) TRACK downtime per robot (target under ${config.maxRobotDowntimeHoursMonthly}h/month); (7) TRACK repair costs (target under $3k/year); (8) TRACK maintenance frequency (target 4-8/year); (9) BENCHMARK vs competitor maintenance. Industry data: 50-70% downtime reduction with preventive maintenance; 40-60% repair cost reduction; payback immediate. Expected impact: -${targetDowntimeReductionPct}% downtime, +15% throughput, payback immediate.`,
        ai_recommendation: 'implement_maintenance_program',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: STAFF_ROBOTICS_RETRAINING_ABSENT
    if (d.has_kitchen_robotics_strategy && config.requireStaffRoboticsRetraining && (!d.has_staff_robotics_retraining || d.retraining_completion_pct < config.minRetrainingCompletionPct)) {
      // no retraining -> failed deployment
      const retrainingGap = Math.max(config.minRetrainingCompletionPct - d.retraining_completion_pct, 0);
      const expectedProductivityLift = Math.round(baselineRevenue * (retrainingGap / 500));
      const expectedErrorReduction = Math.round(baselineRevenue * (retrainingGap / 600));
      const expectedSafetyLift = Math.round(baselineRevenue * 0.015);
      const expectedRetentionLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedProductivityLift + expectedErrorReduction + expectedSafetyLift + expectedRetentionLift, 1200);
      const severityLabel = d.retraining_completion_pct < 50 ? 'high' : 'medium';
      const criticalNote = (d.retraining_completion_pct < 50)
        ? `HIGH: NO STAFF ROBOTICS RETRAINING — retrained ${d.staff_retrained_count}/${d.staff_retrained_target} staff (${d.retraining_completion_pct}% completion, min ${config.minRetrainingCompletionPct}%); robots require operators not cooks; without retraining, staff can't operate robots = failed deployment + safety risk + robot damage; retraining is critical for robotics success. `
        : `MEDIUM: RETRAINING BELOW TARGET — ${d.retraining_completion_pct}% (min ${config.minRetrainingCompletionPct}%); complete retraining for all staff. `;
      alerts.push({
        rule_id: 'staff_robotics_retraining_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_staff_robotics_retraining: d.has_staff_robotics_retraining,
        staff_retrained_count: d.staff_retrained_count,
        staff_retrained_target: d.staff_retrained_target,
        retraining_completion_pct: d.retraining_completion_pct,
        robot_count: d.robot_count,
        food_safety_incidents_last_year: d.food_safety_incidents_last_year,
        monthly_revenue: d.monthly_revenue,
        labor_savings_projected_pct: 15,
        consistency_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `STAFF ROBOTICS RETRAINING ABSENT: ${d.location_id} — retraining ${d.has_staff_robotics_retraining ? 'present' : 'ABSENT'}; retrained ${d.staff_retrained_count}/${d.staff_retrained_target} staff; completion ${d.retraining_completion_pct}% (min ${config.minRetrainingCompletionPct}%); robots ${d.robot_count}; food safety incidents ${d.food_safety_incidents_last_year}/yr; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: robots require operators not cooks; without retraining, staff can't operate robots = failed deployment (robots sit idle) + safety risk (improper operation) + robot damage (misuse); retraining is critical for robotics success; retraining components = robot operation (start, stop, monitor, adjust), safety protocols (emergency stop, lockout/tagout), maintenance basics (cleaning, calibration), troubleshooting (common issues, error codes), quality monitoring (output consistency), software interface (POS, robot dashboard); retraining cost = $500-2,000 per staff member (training + certification); retraining best practice = train all kitchen staff (not just operators), certify before solo operation, refresh quarterly, include safety + maintenance + troubleshooting; retraining ROI = $10-25 per $1 spent (productivity + error reduction + safety + retention). Solutions ranked by impact: (1) CONDUCT staff retraining — productivity lift ${fmt$(expectedProductivityLift)}/mo + error reduction ${fmt$(expectedErrorReduction)}/mo + safety ${fmt$(expectedSafetyLift)}/mo + retention ${fmt$(expectedRetentionLift)}/mo; cost ${fmt$(800)}/mo (training program); payback 1-2 months; (2) TRAIN all kitchen staff on robot operation (start, stop, monitor, adjust); (3) TRAIN safety protocols (emergency stop, lockout/tagout); (4) TRAIN maintenance basics (cleaning, calibration); (5) TRAIN troubleshooting (common issues, error codes); (6) TRAIN quality monitoring (output consistency); (7) TRAIN software interface (POS, robot dashboard); (8) CERTIFY before solo operation (competency test); (9) REFRESH quarterly (new features, updates); (10) TRACK completion rate (target ${config.minRetrainingCompletionPct}%+); (11) TRACK productivity per staff; (12) TRACK safety incidents (target 0); (13) BENCHMARK vs competitor retraining. Industry data: failed deployment without retraining; $10-25 ROI per $1; payback 1-2 months. Expected impact: +15% labor savings, +12pts consistency, payback 1-2 months.`,
        ai_recommendation: 'conduct_staff_retraining',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM kitchen_robotics_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE kitchen_robotics_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant kitchen robotics and automation expert. Given kitchen robotics data, recommend ONE specific action with expected labor savings, consistency lift, speed lift, throughput lift, or waste reduction (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Robotics strategy: ${a.has_kitchen_robotics_strategy ?? false} (${a.robot_count ?? 0}/${a.robot_target_count ?? 4} robots, types: ${a.robot_types_deployed ?? 'none'}). Cooking automation: ${a.has_robotic_cooking ?? false} (${a.cooking_automation_pct ?? 0}%/${config.minCookingAutomationPct}% min, fryers ${a.robotic_fryer_count ?? 0}, grills ${a.robotic_grill_count ?? 0}, ovens ${a.robotic_oven_count ?? 0}, conveyors ${a.conveyor_cooking_count ?? 0}). Prep automation: ${a.has_robotic_prep ?? false} (${a.prep_automation_pct ?? 0}%/${config.minPrepAutomationPct}% min, ${a.automated_prep_stations_count ?? 0} stations). Inventory automation: ${a.has_inventory_automation ?? false} (${a.smart_shelf_count ?? 0} smart shelves, RFID ${a.rfid_enabled ?? false}, stockout ${a.inventory_stockout_rate_pct ?? 0}%/${config.maxInventoryStockoutRatePct}% max). Cleaning automation: ${a.has_cleaning_automation ?? false} (ovens ${a.auto_clean_oven_count ?? 0}, floors ${a.auto_clean_floor_count ?? 0}, ${a.cleaning_automation_hours_saved_daily ?? 0}h saved/day). ROI tracking: ${a.has_robotics_roi_tracking ?? false} (investment ${fmt$(a.robotics_investment_total ?? 0)}, labor savings ${fmt$(a.robotics_labor_savings_monthly ?? 0)}/mo, waste ${fmt$(a.robotics_waste_savings_monthly ?? 0)}/mo, speed ${fmt$(a.robotics_speed_savings_monthly ?? 0)}/mo, ROAS ${a.robotics_roas ?? 0}x). Maintenance: ${a.has_robotics_maintenance_program ?? false} (${a.maintenance_frequency_per_year ?? 0}/yr, downtime ${a.robot_downtime_hours_monthly ?? 0}h/${config.maxRobotDowntimeHoursMonthly}h max, ${fmt$(a.maintenance_cost_monthly ?? 0)}/mo, ${fmt$(a.repair_cost_annual ?? 0)}/yr repairs). Retraining: ${a.has_staff_robotics_retraining ?? false} (${a.staff_retrained_count ?? 0}/${a.staff_retrained_target ?? 6} retrained, ${a.retraining_completion_pct ?? 0}%/${config.minRetrainingCompletionPct}% min). Labor cost: ${fmt$(a.labor_cost_monthly ?? 0)}/mo. Savings potential: ${fmt$(a.labor_savings_potential_monthly ?? 0)}/mo. Consistency: ${a.food_consistency_score ?? 0}/100 (target ${a.food_consistency_target_score ?? 88}). Speed: ${a.speed_of_service_seconds ?? 0}s (target ${a.speed_of_service_target_seconds ?? 240}s). Throughput: ${a.kitchen_throughput_orders_hour ?? 0} orders/hr (target ${a.kitchen_throughput_target_orders_hour ?? 120}). Food safety incidents: ${a.food_safety_incidents_last_year ?? 0}/yr. Competitor robotics: ${a.competitor_robotics_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Robot purchase: ${fmt$(a.robot_purchase_cost_avg ?? 0)}. Robot lease: ${fmt$(a.robot_lease_cost_monthly_avg ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveKitchenRoboticsAlerts = async (db: ReturnType<typeof useDB>): Promise<KitchenRoboticsAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM kitchen_robotics_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getKitchenRoboticsSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  kitchenRoboticsStrategyAbsentCount: number;
  roboticCookingAutomationLowCount: number;
  roboticPrepAutomationAbsentCount: number;
  inventoryAutomationAbsentCount: number;
  cleaningAutomationAbsentCount: number;
  roboticsRoiTrackingAbsentCount: number;
  roboticsMaintenanceProgramAbsentCount: number;
  staffRoboticsRetrainingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'kitchen_robotics_strategy_absent') AS nostrategy,
              math::count(rule_id = 'robotic_cooking_automation_low') AS lowcooking,
              math::count(rule_id = 'robotic_prep_automation_absent') AS noprep,
              math::count(rule_id = 'inventory_automation_absent') AS noinventory,
              math::count(rule_id = 'cleaning_automation_absent') AS nocleaning,
              math::count(rule_id = 'robotics_roi_tracking_absent') AS noroi,
              math::count(rule_id = 'robotics_maintenance_program_absent') AS nomaintenance,
              math::count(rule_id = 'staff_robotics_retraining_absent') AS noretraining
       FROM kitchen_robotics_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      kitchenRoboticsStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      roboticCookingAutomationLowCount: safeNumber(r.lowcooking, 0),
      roboticPrepAutomationAbsentCount: safeNumber(r.noprep, 0),
      inventoryAutomationAbsentCount: safeNumber(r.noinventory, 0),
      cleaningAutomationAbsentCount: safeNumber(r.nocleaning, 0),
      roboticsRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
      roboticsMaintenanceProgramAbsentCount: safeNumber(r.nomaintenance, 0),
      staffRoboticsRetrainingAbsentCount: safeNumber(r.noretraining, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, kitchenRoboticsStrategyAbsentCount: 0, roboticCookingAutomationLowCount: 0, roboticPrepAutomationAbsentCount: 0, inventoryAutomationAbsentCount: 0, cleaningAutomationAbsentCount: 0, roboticsRoiTrackingAbsentCount: 0, roboticsMaintenanceProgramAbsentCount: 0, staffRoboticsRetrainingAbsentCount: 0 };
  }
};

export const updateKitchenRoboticsAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
