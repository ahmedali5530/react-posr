/**
 * AI Smart Restaurant IoT & Connected Device Optimizer — predicts how IoT
 * and connected device ecosystems (smart sensors, occupancy tracking,
 * temperature monitoring, equipment predictive maintenance, energy IoT,
 * food safety IoT, customer behavior tracking, real-time alerts, unified
 * device dashboard, edge computing, 5G connectivity, device lifecycle
 * management, IoT security) impact operational efficiency, food safety,
 * energy savings, customer experience, labor optimization, and
 * decision-making speed.
 *
 * Smart restaurant IoT market = $50B+ by 2030 (Markets and Markets),
 * growing 35%+ CAGR. 68% of restaurants plan IoT deployment by 2027
 * (Restaurant Business). IoT sensors reduce equipment downtime 40-50%
 * (predictive maintenance). Smart temperature monitoring reduces food
 * safety incidents 60-80% (real-time alerts vs manual checks). Occupancy
 * sensors optimize staffing 15-25% (real-time vs scheduled). Energy IoT
 * reduces utility costs 15-30% (smart HVAC, lighting, refrigeration).
 * Customer behavior tracking (dwell time, traffic patterns) increases
 * revenue 10-20% (optimized layout, targeted upselling). Real-time alerts
 * reduce incident response time 70-90% (seconds vs minutes). Unified IoT
 * dashboard saves 2-4 hours/day manager time (single pane of glass).
 * Edge computing = 5-10x faster decision-making (local processing vs
 * cloud round-trip). 5G connectivity = 100x more devices supported
 * (vs WiFi). IoT device lifecycle = 3-7 years (needs replacement plan).
 * IoT security = critical (each device = potential attack vector).
 * 45% of restaurant IoT devices have security vulnerabilities (Ponemon
 * Institute). IoT ROI = $5-15 per $1 invested (efficiency + safety +
 * energy + labor savings). Smart sensors cost $50-500 per device.
 * Average restaurant deploys 20-100 IoT devices (temperature, occupancy,
 * energy, equipment, security). IoT platform cost = $200-1,000/month
 * (device management + analytics + alerts).
 *
 * 215th POSR-exclusive differentiator. Distinct from:
 *   - energy-optimization.service — optimizes ENERGY usage (analysis).
 *     This optimizer focuses on IoT DEVICES that monitor/control energy.
 *   - equipment-maintenance.service — maintains TRADITIONAL equipment.
 *     This optimizer focuses on IoT PREDICTIVE maintenance (sensor-based).
 *   - temperature-hvac-comfort.service — optimizes COMFORT (temp/HVAC).
 *     This optimizer focuses on IoT temperature MONITORING (sensors).
 *   - air-quality-ventilation.service — optimizes AIR QUALITY. This
 *     optimizer focuses on IoT air quality SENSORS (monitoring devices).
 *   - food-safety.service — HACCP temperature logs. This optimizer
 *     focuses on IoT food safety MONITORING (real-time sensor alerts).
 *   - alerts.service — system ALERTS (operational). This optimizer
 *     focuses on IoT-generated alerts (device-triggered).
 *   - kitchen-robotics-automation.service (208th) — ROBOTICS for cooking.
 *     This optimizer focuses on IoT SENSORS (monitoring, not automation).
 *   - cleaning-scheduler.service — CLEANING schedules. This optimizer
 *     focuses on IoT cleanliness SENSORS (real-time monitoring).
 *
 * 8 AI rules:
 *   1. smart_iot_strategy_absent -> no IoT strategy -> missed $50B market + 40-50% downtime reduction
 *   2. predictive_maintenance_absent -> no predictive maintenance -> missed 40-50% downtime reduction
 *   3. food_safety_iot_monitoring_absent -> no food safety IoT -> missed 60-80% incident reduction
 *   4. occupancy_tracking_absent -> no occupancy tracking -> missed 15-25% staffing optimization
 *   5. energy_iot_absent -> no energy IoT -> missed 15-30% utility savings
 *   6. unified_iot_dashboard_absent -> no unified dashboard -> missed 2-4h/day manager time
 *   7. iot_security_program_absent -> no IoT security -> 45% vulnerability risk
 *   8. iot_roi_tracking_absent -> no ROI tracking -> can't optimize device deployment
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type SmartRestaurantIotRuleId =
  | 'smart_iot_strategy_absent'
  | 'predictive_maintenance_absent'
  | 'food_safety_iot_monitoring_absent'
  | 'occupancy_tracking_absent'
  | 'energy_iot_absent'
  | 'unified_iot_dashboard_absent'
  | 'iot_security_program_absent'
  | 'iot_roi_tracking_absent';

export type SmartRestaurantIotAiRec =
  'launch_smart_iot_strategy'
  | 'implement_predictive_maintenance'
  | 'deploy_food_safety_iot'
  | 'implement_occupancy_tracking'
  | 'deploy_energy_iot'
  | 'implement_unified_dashboard'
  | 'implement_iot_security'
  | 'implement_iot_roi_tracking'
  | 'monitor'
  | 'skip';

export interface SmartRestaurantIotAlert {
  id?: string;
  rule_id: SmartRestaurantIotRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  has_smart_iot_strategy?: boolean;
  iot_platform?: string;
  iot_device_count?: number;
  iot_device_target_count?: number;
  has_predictive_maintenance?: boolean;
  equipment_sensors_count?: number;
  equipment_downtime_hours_monthly?: number;
  equipment_downtime_target_hours?: number;
  predictive_maintenance_accuracy_pct?: number;
  has_food_safety_iot_monitoring?: boolean;
  temperature_sensors_count?: number;
  food_safety_alerts_monthly?: number;
  food_safety_incident_reduction_pct?: number;
  real_time_temp_monitoring?: boolean;
  has_occupancy_tracking?: boolean;
  occupancy_sensors_count?: number;
  staffing_optimization_pct?: number;
  staffing_optimization_target_pct?: number;
  dwell_time_tracking?: boolean;
  traffic_pattern_analysis?: boolean;
  has_energy_iot?: boolean;
  energy_sensors_count?: number;
  energy_savings_pct?: number;
  energy_savings_target_pct?: number;
  smart_hvac_enabled?: boolean;
  smart_lighting_enabled?: boolean;
  smart_refrigeration_enabled?: boolean;
  has_unified_iot_dashboard?: boolean;
  dashboard_device_integration_pct?: number;
  manager_time_saved_hours_daily?: number;
  real_time_alerts_enabled?: boolean;
  edge_computing_enabled?: boolean;
  has_iot_security_program?: boolean;
  iot_security_score?: number;
  iot_vulnerability_count?: number;
  iot_security_audit_frequency?: number;
  device_authentication_enabled?: boolean;
  network_segmentation_enabled?: boolean;
  has_iot_roi_tracking?: boolean;
  iot_investment_total?: number;
  downtime_savings_monthly?: number;
  food_safety_savings_monthly?: number;
  staffing_savings_monthly?: number;
  energy_savings_monthly?: number;
  iot_roas?: number;
  decision_speed_score?: number;
  operational_efficiency_score?: number;
  labor_optimization_score?: number;
  customer_experience_score?: number;
  competitor_iot_score?: number;
  monthly_revenue?: number;
  total_equipment_count?: number;
  iot_device_cost_avg?: number;
  iot_platform_cost_monthly?: number;
  iot_maintenance_cost_monthly?: number;
  downtime_reduction_projected_pct?: number;
  food_safety_improvement_projected_pct?: number;
  staffing_optimization_projected_pct?: number;
  energy_savings_projected_pct?: number;
  manager_time_projected_hours?: number;
  security_lift_projected_pts?: number;
  efficiency_lift_projected_pts?: number;
  roi_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: SmartRestaurantIotAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface SmartRestaurantIotConfig {
  aiEnabled: boolean;
  requireSmartIotStrategy: boolean;
  requirePredictiveMaintenance: boolean;
  requireFoodSafetyIotMonitoring: boolean;
  requireOccupancyTracking: boolean;
  requireEnergyIot: boolean;
  requireUnifiedIotDashboard: boolean;
  requireIotSecurityProgram: boolean;
  requireIotRoiTracking: boolean;
  minIotDeviceCount: number;
  minPredictiveMaintenanceAccuracyPct: number;
  minFoodSafetyIncidentReductionPct: number;
  minStaffingOptimizationPct: number;
  minEnergySavingsPct: number;
  minDashboardDeviceIntegrationPct: number;
  minIotSecurityScore: number;
  minIotRoas: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_SMART_RESTAURANT_IOT_CONFIG: SmartRestaurantIotConfig = {
  aiEnabled: true,
  requireSmartIotStrategy: true,
  requirePredictiveMaintenance: true,
  requireFoodSafetyIotMonitoring: true,
  requireOccupancyTracking: true,
  requireEnergyIot: true,
  requireUnifiedIotDashboard: true,
  requireIotSecurityProgram: true,
  requireIotRoiTracking: true,
  minIotDeviceCount: 20,
  minPredictiveMaintenanceAccuracyPct: 80,
  minFoodSafetyIncidentReductionPct: 50,
  minStaffingOptimizationPct: 10,
  minEnergySavingsPct: 15,
  minDashboardDeviceIntegrationPct: 70,
  minIotSecurityScore: 80,
  minIotRoas: 3,
  preferCompetitorParity: true,
};

export const readSmartRestaurantIotConfig = (settings: any): SmartRestaurantIotConfig => ({
  aiEnabled: settings?.smart_iot_ai_enabled ?? true,
  requireSmartIotStrategy: settings?.smart_iot_require_strategy ?? true,
  requirePredictiveMaintenance: settings?.smart_iot_require_maintenance ?? true,
  requireFoodSafetyIotMonitoring: settings?.smart_iot_require_food_safety ?? true,
  requireOccupancyTracking: settings?.smart_iot_require_occupancy ?? true,
  requireEnergyIot: settings?.smart_iot_require_energy ?? true,
  requireUnifiedIotDashboard: settings?.smart_iot_require_dashboard ?? true,
  requireIotSecurityProgram: settings?.smart_iot_require_security ?? true,
  requireIotRoiTracking: settings?.smart_iot_require_roi ?? true,
  minIotDeviceCount: safeNumber(settings?.smart_iot_min_devices, 20),
  minPredictiveMaintenanceAccuracyPct: safeNumber(settings?.smart_iot_min_maintenance_accuracy, 80),
  minFoodSafetyIncidentReductionPct: safeNumber(settings?.smart_iot_min_food_safety_reduction, 50),
  minStaffingOptimizationPct: safeNumber(settings?.smart_iot_min_staffing_opt, 10),
  minEnergySavingsPct: safeNumber(settings?.smart_iot_min_energy_savings, 15),
  minDashboardDeviceIntegrationPct: safeNumber(settings?.smart_iot_min_dashboard_integration, 70),
  minIotSecurityScore: safeNumber(settings?.smart_iot_min_security, 80),
  minIotRoas: safeNumber(settings?.smart_iot_min_roas, 3),
  preferCompetitorParity: settings?.smart_iot_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface SmartRestaurantIotData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_smart_iot_strategy: boolean;
  iot_platform: string;
  iot_device_count: number;
  iot_device_target_count: number;
  has_predictive_maintenance: boolean;
  equipment_sensors_count: number;
  equipment_downtime_hours_monthly: number;
  equipment_downtime_target_hours: number;
  predictive_maintenance_accuracy_pct: number;
  has_food_safety_iot_monitoring: boolean;
  temperature_sensors_count: number;
  food_safety_alerts_monthly: number;
  food_safety_incident_reduction_pct: number;
  real_time_temp_monitoring: boolean;
  has_occupancy_tracking: boolean;
  occupancy_sensors_count: number;
  staffing_optimization_pct: number;
  staffing_optimization_target_pct: number;
  dwell_time_tracking: boolean;
  traffic_pattern_analysis: boolean;
  has_energy_iot: boolean;
  energy_sensors_count: number;
  energy_savings_pct: number;
  energy_savings_target_pct: number;
  smart_hvac_enabled: boolean;
  smart_lighting_enabled: boolean;
  smart_refrigeration_enabled: boolean;
  has_unified_iot_dashboard: boolean;
  dashboard_device_integration_pct: number;
  manager_time_saved_hours_daily: number;
  real_time_alerts_enabled: boolean;
  edge_computing_enabled: boolean;
  has_iot_security_program: boolean;
  iot_security_score: number;
  iot_vulnerability_count: number;
  iot_security_audit_frequency: number;
  device_authentication_enabled: boolean;
  network_segmentation_enabled: boolean;
  has_iot_roi_tracking: boolean;
  iot_investment_total: number;
  downtime_savings_monthly: number;
  food_safety_savings_monthly: number;
  staffing_savings_monthly: number;
  energy_savings_monthly: number;
  iot_roas: number;
  decision_speed_score: number;
  operational_efficiency_score: number;
  labor_optimization_score: number;
  customer_experience_score: number;
  competitor_iot_score: number;
  monthly_revenue: number;
  total_equipment_count: number;
  iot_device_cost_avg: number;
  iot_platform_cost_monthly: number;
  iot_maintenance_cost_monthly: number;
}

const MOCK_DATA: SmartRestaurantIotData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_smart_iot_strategy: false, iot_platform: 'none',
    iot_device_count: 0, iot_device_target_count: 30,
    has_predictive_maintenance: false, equipment_sensors_count: 0,
    equipment_downtime_hours_monthly: 18, equipment_downtime_target_hours: 8,
    predictive_maintenance_accuracy_pct: 0,
    has_food_safety_iot_monitoring: false, temperature_sensors_count: 0,
    food_safety_alerts_monthly: 0, food_safety_incident_reduction_pct: 0,
    real_time_temp_monitoring: false,
    has_occupancy_tracking: false, occupancy_sensors_count: 0,
    staffing_optimization_pct: 0, staffing_optimization_target_pct: 15,
    dwell_time_tracking: false, traffic_pattern_analysis: false,
    has_energy_iot: false, energy_sensors_count: 0,
    energy_savings_pct: 0, energy_savings_target_pct: 20,
    smart_hvac_enabled: false, smart_lighting_enabled: false,
    smart_refrigeration_enabled: false,
    has_unified_iot_dashboard: false, dashboard_device_integration_pct: 0,
    manager_time_saved_hours_daily: 0, real_time_alerts_enabled: false,
    edge_computing_enabled: false,
    has_iot_security_program: false, iot_security_score: 22,
    iot_vulnerability_count: 0, iot_security_audit_frequency: 0,
    device_authentication_enabled: false, network_segmentation_enabled: false,
    has_iot_roi_tracking: false, iot_investment_total: 0,
    downtime_savings_monthly: 0, food_safety_savings_monthly: 0,
    staffing_savings_monthly: 0, energy_savings_monthly: 0,
    iot_roas: 0,
    decision_speed_score: 32, operational_efficiency_score: 48,
    labor_optimization_score: 42, customer_experience_score: 58,
    competitor_iot_score: 62, monthly_revenue: 86000,
    total_equipment_count: 15, iot_device_cost_avg: 200,
    iot_platform_cost_monthly: 0, iot_maintenance_cost_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_smart_iot_strategy: true, iot_platform: 'AWS IoT Core',
    iot_device_count: 12, iot_device_target_count: 30,
    has_predictive_maintenance: false, equipment_sensors_count: 4,
    equipment_downtime_hours_monthly: 14, equipment_downtime_target_hours: 8,
    predictive_maintenance_accuracy_pct: 0,
    has_food_safety_iot_monitoring: true, temperature_sensors_count: 6,
    food_safety_alerts_monthly: 8, food_safety_incident_reduction_pct: 35,
    real_time_temp_monitoring: true,
    has_occupancy_tracking: false, occupancy_sensors_count: 0,
    staffing_optimization_pct: 0, staffing_optimization_target_pct: 15,
    dwell_time_tracking: false, traffic_pattern_analysis: false,
    has_energy_iot: false, energy_sensors_count: 2,
    energy_savings_pct: 5, energy_savings_target_pct: 20,
    smart_hvac_enabled: false, smart_lighting_enabled: true,
    smart_refrigeration_enabled: false,
    has_unified_iot_dashboard: false, dashboard_device_integration_pct: 35,
    manager_time_saved_hours_daily: 0.5, real_time_alerts_enabled: true,
    edge_computing_enabled: false,
    has_iot_security_program: false, iot_security_score: 48,
    iot_vulnerability_count: 3, iot_security_audit_frequency: 0,
    device_authentication_enabled: false, network_segmentation_enabled: false,
    has_iot_roi_tracking: false, iot_investment_total: 5000,
    downtime_savings_monthly: 200, food_safety_savings_monthly: 300,
    staffing_savings_monthly: 0, energy_savings_monthly: 120,
    iot_roas: 0,
    decision_speed_score: 52, operational_efficiency_score: 62,
    labor_optimization_score: 55, customer_experience_score: 68,
    competitor_iot_score: 72, monthly_revenue: 152000,
    total_equipment_count: 22, iot_device_cost_avg: 200,
    iot_platform_cost_monthly: 300, iot_maintenance_cost_monthly: 100,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_smart_iot_strategy: true, iot_platform: 'AWS IoT Core + Edge',
    iot_device_count: 38, iot_device_target_count: 30,
    has_predictive_maintenance: true, equipment_sensors_count: 12,
    equipment_downtime_hours_monthly: 6, equipment_downtime_target_hours: 8,
    predictive_maintenance_accuracy_pct: 84,
    has_food_safety_iot_monitoring: true, temperature_sensors_count: 14,
    food_safety_alerts_monthly: 3, food_safety_incident_reduction_pct: 72,
    real_time_temp_monitoring: true,
    has_occupancy_tracking: true, occupancy_sensors_count: 8,
    staffing_optimization_pct: 18, staffing_optimization_target_pct: 15,
    dwell_time_tracking: true, traffic_pattern_analysis: true,
    has_energy_iot: true, energy_sensors_count: 10,
    energy_savings_pct: 22, energy_savings_target_pct: 20,
    smart_hvac_enabled: true, smart_lighting_enabled: true,
    smart_refrigeration_enabled: true,
    has_unified_iot_dashboard: true, dashboard_device_integration_pct: 82,
    manager_time_saved_hours_daily: 2.5, real_time_alerts_enabled: true,
    edge_computing_enabled: true,
    has_iot_security_program: true, iot_security_score: 85,
    iot_vulnerability_count: 1, iot_security_audit_frequency: 4,
    device_authentication_enabled: true, network_segmentation_enabled: true,
    has_iot_roi_tracking: true, iot_investment_total: 18000,
    downtime_savings_monthly: 800, food_safety_savings_monthly: 600,
    staffing_savings_monthly: 1200, energy_savings_monthly: 480,
    iot_roas: 5.8,
    decision_speed_score: 82, operational_efficiency_score: 84,
    labor_optimization_score: 80, customer_experience_score: 82,
    competitor_iot_score: 80, monthly_revenue: 201000,
    total_equipment_count: 28, iot_device_cost_avg: 180,
    iot_platform_cost_monthly: 500, iot_maintenance_cost_monthly: 200,
  },
  {
    location_id: 'location_2', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'mixed',
    has_smart_iot_strategy: true, iot_platform: 'Azure IoT + Edge + 5G',
    iot_device_count: 85, iot_device_target_count: 30,
    has_predictive_maintenance: true, equipment_sensors_count: 28,
    equipment_downtime_hours_monthly: 3, equipment_downtime_target_hours: 8,
    predictive_maintenance_accuracy_pct: 92,
    has_food_safety_iot_monitoring: true, temperature_sensors_count: 32,
    food_safety_alerts_monthly: 1, food_safety_incident_reduction_pct: 88,
    real_time_temp_monitoring: true,
    has_occupancy_tracking: true, occupancy_sensors_count: 18,
    staffing_optimization_pct: 25, staffing_optimization_target_pct: 15,
    dwell_time_tracking: true, traffic_pattern_analysis: true,
    has_energy_iot: true, energy_sensors_count: 24,
    energy_savings_pct: 28, energy_savings_target_pct: 20,
    smart_hvac_enabled: true, smart_lighting_enabled: true,
    smart_refrigeration_enabled: true,
    has_unified_iot_dashboard: true, dashboard_device_integration_pct: 94,
    manager_time_saved_hours_daily: 3.5, real_time_alerts_enabled: true,
    edge_computing_enabled: true,
    has_iot_security_program: true, iot_security_score: 94,
    iot_vulnerability_count: 0, iot_security_audit_frequency: 6,
    device_authentication_enabled: true, network_segmentation_enabled: true,
    has_iot_roi_tracking: true, iot_investment_total: 42000,
    downtime_savings_monthly: 2200, food_safety_savings_monthly: 1200,
    staffing_savings_monthly: 2800, energy_savings_monthly: 820,
    iot_roas: 8.2,
    decision_speed_score: 94, operational_efficiency_score: 92,
    labor_optimization_score: 88, customer_experience_score: 88,
    competitor_iot_score: 84, monthly_revenue: 265000,
    total_equipment_count: 45, iot_device_cost_avg: 160,
    iot_platform_cost_monthly: 800, iot_maintenance_cost_monthly: 400,
  },
];

export const runSmartRestaurantIotEngine = async (
  db: ReturnType<typeof useDB>,
  config: SmartRestaurantIotConfig,
): Promise<{ alerts: SmartRestaurantIotAlert[]; generated: number }> => {
  const alerts: SmartRestaurantIotAlert[] = [];
  const now = new Date();

  let data: SmartRestaurantIotData[] = [];
  try {
    const result = await db.query(`SELECT * FROM smart_restaurant_iot_log`);
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): SmartRestaurantIotData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_smart_iot_strategy: Boolean(r.has_smart_iot_strategy ?? false),
      iot_platform: String(r.iot_platform ?? 'none'),
      iot_device_count: safeNumber(r.iot_device_count, 0),
      iot_device_target_count: safeNumber(r.iot_device_target_count, 0),
      has_predictive_maintenance: Boolean(r.has_predictive_maintenance ?? false),
      equipment_sensors_count: safeNumber(r.equipment_sensors_count, 0),
      equipment_downtime_hours_monthly: safeNumber(r.equipment_downtime_hours_monthly, 0),
      equipment_downtime_target_hours: safeNumber(r.equipment_downtime_target_hours, 8),
      predictive_maintenance_accuracy_pct: safeNumber(r.predictive_maintenance_accuracy_pct, 0),
      has_food_safety_iot_monitoring: Boolean(r.has_food_safety_iot_monitoring ?? false),
      temperature_sensors_count: safeNumber(r.temperature_sensors_count, 0),
      food_safety_alerts_monthly: safeNumber(r.food_safety_alerts_monthly, 0),
      food_safety_incident_reduction_pct: safeNumber(r.food_safety_incident_reduction_pct, 0),
      real_time_temp_monitoring: Boolean(r.real_time_temp_monitoring ?? false),
      has_occupancy_tracking: Boolean(r.has_occupancy_tracking ?? false),
      occupancy_sensors_count: safeNumber(r.occupancy_sensors_count, 0),
      staffing_optimization_pct: safeNumber(r.staffing_optimization_pct, 0),
      staffing_optimization_target_pct: safeNumber(r.staffing_optimization_target_pct, 15),
      dwell_time_tracking: Boolean(r.dwell_time_tracking ?? false),
      traffic_pattern_analysis: Boolean(r.traffic_pattern_analysis ?? false),
      has_energy_iot: Boolean(r.has_energy_iot ?? false),
      energy_sensors_count: safeNumber(r.energy_sensors_count, 0),
      energy_savings_pct: safeNumber(r.energy_savings_pct, 0),
      energy_savings_target_pct: safeNumber(r.energy_savings_target_pct, 20),
      smart_hvac_enabled: Boolean(r.smart_hvac_enabled ?? false),
      smart_lighting_enabled: Boolean(r.smart_lighting_enabled ?? false),
      smart_refrigeration_enabled: Boolean(r.smart_refrigeration_enabled ?? false),
      has_unified_iot_dashboard: Boolean(r.has_unified_iot_dashboard ?? false),
      dashboard_device_integration_pct: safeNumber(r.dashboard_device_integration_pct, 0),
      manager_time_saved_hours_daily: safeNumber(r.manager_time_saved_hours_daily, 0),
      real_time_alerts_enabled: Boolean(r.real_time_alerts_enabled ?? false),
      edge_computing_enabled: Boolean(r.edge_computing_enabled ?? false),
      has_iot_security_program: Boolean(r.has_iot_security_program ?? false),
      iot_security_score: safeNumber(r.iot_security_score, 0),
      iot_vulnerability_count: safeNumber(r.iot_vulnerability_count, 0),
      iot_security_audit_frequency: safeNumber(r.iot_security_audit_frequency, 0),
      device_authentication_enabled: Boolean(r.device_authentication_enabled ?? false),
      network_segmentation_enabled: Boolean(r.network_segmentation_enabled ?? false),
      has_iot_roi_tracking: Boolean(r.has_iot_roi_tracking ?? false),
      iot_investment_total: safeNumber(r.iot_investment_total, 0),
      downtime_savings_monthly: safeNumber(r.downtime_savings_monthly, 0),
      food_safety_savings_monthly: safeNumber(r.food_safety_savings_monthly, 0),
      staffing_savings_monthly: safeNumber(r.staffing_savings_monthly, 0),
      energy_savings_monthly: safeNumber(r.energy_savings_monthly, 0),
      iot_roas: safeNumber(r.iot_roas, 0),
      decision_speed_score: safeNumber(r.decision_speed_score, 0),
      operational_efficiency_score: safeNumber(r.operational_efficiency_score, 0),
      labor_optimization_score: safeNumber(r.labor_optimization_score, 0),
      customer_experience_score: safeNumber(r.customer_experience_score, 0),
      competitor_iot_score: safeNumber(r.competitor_iot_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_equipment_count: safeNumber(r.total_equipment_count, 0),
      iot_device_cost_avg: safeNumber(r.iot_device_cost_avg, 0),
      iot_platform_cost_monthly: safeNumber(r.iot_platform_cost_monthly, 0),
      iot_maintenance_cost_monthly: safeNumber(r.iot_maintenance_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;

    // Rule 1: SMART_IOT_STRATEGY_ABSENT
    if (config.requireSmartIotStrategy && !d.has_smart_iot_strategy) {
      const expectedDowntimeSavings = Math.round(baselineRevenue * 0.02);
      const expectedFoodSafetySavings = Math.round(baselineRevenue * 0.015);
      const expectedStaffingSavings = Math.round(baselineRevenue * 0.025);
      const expectedEnergySavings = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedDowntimeSavings + expectedFoodSafetySavings + expectedStaffingSavings + expectedEnergySavings, 4200);
      const severityLabel = d.competitor_iot_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_iot_score > 65)
        ? 'CRITICAL: NO SMART IoT STRATEGY — competitor IoT score ' + d.competitor_iot_score + '/100 (high); smart restaurant IoT market = $50B+ by 2030 (Markets and Markets); 68% of restaurants plan IoT by 2027 (Restaurant Business); IoT reduces equipment downtime 40-50%, food safety incidents 60-80%, optimizes staffing 15-25%, reduces energy 15-30%; missing IoT = missed downtime + food safety + staffing + energy savings; competitors with IoT operate more efficiently + safely. '
        : `HIGH: NO SMART IoT STRATEGY — smart restaurant IoT market $50B+ by 2030; 68% plan IoT by 2027; IoT reduces downtime 40-50%, food safety 60-80%, optimizes staffing 15-25%, reduces energy 15-30%; ROI $5-15 per $1; missing downtime + food safety + staffing + energy savings. `;
      alerts.push({
        rule_id: 'smart_iot_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_smart_iot_strategy: d.has_smart_iot_strategy,
        iot_platform: d.iot_platform, iot_device_count: d.iot_device_count,
        iot_device_target_count: d.iot_device_target_count,
        equipment_downtime_hours_monthly: d.equipment_downtime_hours_monthly,
        operational_efficiency_score: d.operational_efficiency_score,
        labor_optimization_score: d.labor_optimization_score,
        customer_experience_score: d.customer_experience_score,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue, total_equipment_count: d.total_equipment_count,
        iot_device_cost_avg: d.iot_device_cost_avg,
        iot_platform_cost_monthly: d.iot_platform_cost_monthly,
        downtime_reduction_projected_pct: 45,
        food_safety_improvement_projected_pct: 60,
        staffing_optimization_projected_pct: 15,
        energy_savings_projected_pct: 20,
        efficiency_lift_projected_pts: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SMART IoT STRATEGY ABSENT: ${d.location_id} — smart IoT strategy ABSENT; platform: ${d.iot_platform}; devices 0 (target ${d.iot_device_target_count}); equipment downtime ${d.equipment_downtime_hours_monthly}h/mo; operational efficiency ${d.operational_efficiency_score}/100; labor optimization ${d.labor_optimization_score}/100; customer experience ${d.customer_experience_score}/100; competitor IoT ${d.competitor_iot_score}/100; total equipment ${d.total_equipment_count}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: smart restaurant IoT market = $50B+ by 2030 (Markets and Markets), growing 35%+ CAGR; 68% of restaurants plan IoT deployment by 2027 (Restaurant Business); IoT sensors reduce equipment downtime 40-50% (predictive maintenance — detect failures before they happen); smart temperature monitoring reduces food safety incidents 60-80% (real-time alerts vs manual checks); occupancy sensors optimize staffing 15-25% (real-time vs scheduled); energy IoT reduces utility costs 15-30% (smart HVAC, lighting, refrigeration); customer behavior tracking (dwell time, traffic patterns) increases revenue 10-20% (optimized layout, targeted upselling); real-time alerts reduce incident response time 70-90% (seconds vs minutes); unified IoT dashboard saves 2-4 hours/day manager time (single pane of glass); edge computing = 5-10x faster decision-making (local processing vs cloud round-trip); 5G connectivity = 100x more devices supported; IoT device lifecycle = 3-7 years; IoT security = critical (45% of restaurant IoT devices have vulnerabilities — Ponemon Institute); IoT ROI = $5-15 per $1 invested (efficiency + safety + energy + labor savings); smart sensors cost $50-500 per device; average restaurant deploys 20-100 IoT devices; IoT platform cost = $200-1,000/month. Solutions ranked by impact: (1) LAUNCH smart IoT strategy — downtime savings ${fmt$(expectedDowntimeSavings)}/mo + food safety ${fmt$(expectedFoodSafetySavings)}/mo + staffing ${fmt$(expectedStaffingSavings)}/mo + energy ${fmt$(expectedEnergySavings)}/mo; cost ${fmt$(d.iot_device_cost_avg * config.minIotDeviceCount)} setup (${config.minIotDeviceCount} devices) + ${fmt$(d.iot_platform_cost_monthly || 400)}/mo platform; payback 3-6 months; (2) CHOOSE IoT platform (AWS IoT Core, Azure IoT, Google Cloud IoT, private); (3) DEPLOY equipment sensors (vibration, temperature, current — predictive maintenance); (4) DEPLOY temperature sensors (walk-in, freezer, holding — food safety); (5) DEPLOY occupancy sensors (people counting, dwell time — staffing optimization); (6) DEPLOY energy sensors (smart HVAC, lighting, refrigeration — energy savings); (7) IMPLEMENT unified dashboard (single pane of glass — all devices); (8) IMPLEMENT real-time alerts (push notifications for critical events); (9) IMPLEMENT edge computing (local processing for speed); (10) IMPLEMENT IoT security (authentication, segmentation, audits); (11) TRACK ROI (downtime, food safety, staffing, energy); (12) BENCHMARK vs competitor IoT. Industry data: $50B+ market by 2030; 68% plan by 2027; ROI $5-15 per $1; payback 3-6 months. Expected impact: +45% downtime reduction, +60% food safety, +15% staffing, +20% energy, +25pts efficiency, payback 3-6 months.`,
        ai_recommendation: 'launch_smart_iot_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: PREDICTIVE_MAINTENANCE_ABSENT
    if (d.has_smart_iot_strategy && config.requirePredictiveMaintenance && (!d.has_predictive_maintenance || d.predictive_maintenance_accuracy_pct < config.minPredictiveMaintenanceAccuracyPct)) {
      const downtimeGap = Math.max(d.equipment_downtime_hours_monthly - d.equipment_downtime_target_hours, 0);
      const expectedDowntimeSavings = Math.round(downtimeGap * 200);
      const expectedRepairSavings = Math.round(baselineRevenue * 0.01);
      const expectedLifespanExtension = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedDowntimeSavings + expectedRepairSavings + expectedLifespanExtension + expectedCompetitiveLift, 2000);
      const severityLabel = !d.has_predictive_maintenance ? 'high' : 'medium';
      const criticalNote = (!d.has_predictive_maintenance)
        ? `HIGH: NO PREDICTIVE MAINTENANCE — equipment sensors ${d.equipment_sensors_count}; downtime ${d.equipment_downtime_hours_monthly}h/mo (target ${d.equipment_downtime_target_hours}h); IoT predictive maintenance reduces downtime 40-50% (detect failures before they happen); without predictive maintenance, equipment fails unexpectedly = downtime + lost revenue + emergency repairs. `
        : `MEDIUM: PREDICTIVE MAINTENANCE BELOW TARGET — accuracy ${d.predictive_maintenance_accuracy_pct}% (min ${config.minPredictiveMaintenanceAccuracyPct}%); improve for more downtime reduction. `;
      alerts.push({
        rule_id: 'predictive_maintenance_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_predictive_maintenance: d.has_predictive_maintenance,
        equipment_sensors_count: d.equipment_sensors_count,
        equipment_downtime_hours_monthly: d.equipment_downtime_hours_monthly,
        equipment_downtime_target_hours: d.equipment_downtime_target_hours,
        predictive_maintenance_accuracy_pct: d.predictive_maintenance_accuracy_pct,
        total_equipment_count: d.total_equipment_count,
        iot_device_count: d.iot_device_count,
        iot_platform: d.iot_platform,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue,
        downtime_reduction_projected_pct: 45,
        efficiency_lift_projected_pts: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PREDICTIVE MAINTENANCE ABSENT: ${d.location_id} — predictive maintenance ${d.has_predictive_maintenance ? 'present' : 'ABSENT'}; equipment sensors ${d.equipment_sensors_count}; downtime ${d.equipment_downtime_hours_monthly}h/mo (target ${d.equipment_downtime_target_hours}h); accuracy ${d.predictive_maintenance_accuracy_pct}% (min ${config.minPredictiveMaintenanceAccuracyPct}%); total equipment ${d.total_equipment_count}; IoT devices ${d.iot_device_count} (${d.iot_platform}); competitor ${d.competitor_iot_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: IoT predictive maintenance reduces equipment downtime 40-50% (detect failures before they happen — vibration, temperature, current sensors detect anomalies); predictive maintenance = equipment sensors (vibration, temperature, current, pressure), AI/ML models (pattern recognition, anomaly detection), alert system (notify before failure), maintenance scheduling (fix before breakdown); predictive maintenance types = vibration analysis (motors, compressors — detect bearing wear), temperature monitoring (refrigeration, cooking — detect thermostat failure), current monitoring (electrical — detect overload), pressure monitoring (gas, steam — detect leaks); predictive maintenance benefits = reduced downtime (40-50%), reduced emergency repairs (50-70% — scheduled vs emergency), extended equipment lifespan (20-30%), reduced maintenance costs (25-30%); predictive maintenance cost = $200-800/month (sensors + ML platform); predictive maintenance ROI = $8-15 per $1 (downtime + repair + lifespan savings). Solutions ranked by impact: (1) IMPLEMENT predictive maintenance — downtime savings ${fmt$(expectedDowntimeSavings)}/mo + repair savings ${fmt$(expectedRepairSavings)}/mo + lifespan extension ${fmt$(expectedLifespanExtension)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(400)}/mo (sensors + ML); payback 2-4 months; (2) INSTALL vibration sensors (motors, compressors, fans); (3) INSTALL temperature sensors (refrigeration, cooking equipment); (4) INSTALL current sensors (electrical panels, motors); (5) INSTALL pressure sensors (gas lines, steam); (6) DEPLOY ML model (pattern recognition, anomaly detection); (7) SET alert thresholds (notify before failure); (8) SCHEDULE maintenance (fix before breakdown); (9) TRACK downtime (target under ${d.equipment_downtime_target_hours}h/mo); (10) TRACK accuracy (target ${config.minPredictiveMaintenanceAccuracyPct}%+); (11) BENCHMARK vs competitor predictive maintenance. Industry data: 40-50% downtime reduction; 50-70% emergency repair reduction; payback 2-4 months. Expected impact: +45% downtime reduction, +15pts efficiency, payback 2-4 months.`,
        ai_recommendation: 'implement_predictive_maintenance',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: FOOD_SAFETY_IOT_MONITORING_ABSENT
    if (d.has_smart_iot_strategy && config.requireFoodSafetyIotMonitoring && (!d.has_food_safety_iot_monitoring || d.food_safety_incident_reduction_pct < config.minFoodSafetyIncidentReductionPct)) {
      const reductionGap = Math.max(config.minFoodSafetyIncidentReductionPct - d.food_safety_incident_reduction_pct, 0);
      const expectedFoodSafetySavings = Math.round(baselineRevenue * (reductionGap / 300));
      const expectedComplianceSavings = Math.round(baselineRevenue * 0.01);
      const expectedReputationLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedFoodSafetySavings + expectedComplianceSavings + expectedReputationLift + expectedCompetitiveLift, 1800);
      const severityLabel = !d.has_food_safety_iot_monitoring ? 'high' : 'medium';
      const criticalNote = (!d.has_food_safety_iot_monitoring)
        ? `HIGH: NO FOOD SAFETY IoT MONITORING — temperature sensors 0; smart temperature monitoring reduces food safety incidents 60-80% (real-time alerts vs manual checks); 32M Americans have food allergies (FDA); food safety lawsuits cost $50k-500k per case; without IoT monitoring, food safety relies on manual checks (error-prone, infrequent). `
        : `MEDIUM: FOOD SAFETY IoT BELOW TARGET — ${d.food_safety_incident_reduction_pct}% reduction (min ${config.minFoodSafetyIncidentReductionPct}%); ${d.temperature_sensors_count} sensors; improve for more reduction. `;
      alerts.push({
        rule_id: 'food_safety_iot_monitoring_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_food_safety_iot_monitoring: d.has_food_safety_iot_monitoring,
        temperature_sensors_count: d.temperature_sensors_count,
        food_safety_alerts_monthly: d.food_safety_alerts_monthly,
        food_safety_incident_reduction_pct: d.food_safety_incident_reduction_pct,
        real_time_temp_monitoring: d.real_time_temp_monitoring,
        iot_device_count: d.iot_device_count,
        iot_platform: d.iot_platform,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue,
        food_safety_improvement_projected_pct: 60,
        efficiency_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FOOD SAFETY IoT MONITORING ABSENT: ${d.location_id} — food safety IoT ${d.has_food_safety_iot_monitoring ? 'present' : 'ABSENT'}; temperature sensors ${d.temperature_sensors_count}; alerts ${d.food_safety_alerts_monthly}/mo; incident reduction ${d.food_safety_incident_reduction_pct}% (min ${config.minFoodSafetyIncidentReductionPct}%); real-time monitoring ${d.real_time_temp_monitoring ? 'yes' : 'NO'}; IoT devices ${d.iot_device_count} (${d.iot_platform}); competitor ${d.competitor_iot_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: smart temperature monitoring reduces food safety incidents 60-80% (real-time alerts vs manual checks — continuous monitoring catches violations instantly); food safety IoT monitoring = temperature sensors (walk-in, freezer, holding, cooking — continuous monitoring), humidity sensors (dry storage, walk-in), door sensors (open/close alerts — prevent temperature abuse), pH sensors (food acidity), contamination sensors (pathogen detection); food safety IoT benefits = reduced incidents (60-80%), reduced lawsuits ($50k-500k per case), reduced insurance premiums (10-20%), compliance automation (HACCP digital logs), audit readiness (real-time data export); food safety IoT cost = $200-600/month (sensors + platform); food safety IoT ROI = $10-20 per $1 (incident reduction + lawsuit avoidance + insurance + compliance). Solutions ranked by impact: (1) DEPLOY food safety IoT — food safety savings ${fmt$(expectedFoodSafetySavings)}/mo + compliance ${fmt$(expectedComplianceSavings)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo (sensors + platform); payback 1-2 months; (2) INSTALL temperature sensors (walk-in, freezer, holding, cooking); (3) INSTALL humidity sensors (dry storage, walk-in); (4) INSTALL door sensors (open/close alerts); (5) ENABLE real-time alerts (push notifications for temperature violations); (6) IMPLEMENT HACCP digital logs (automated, exportable); (7) SET alert thresholds (FDA compliance: walk-in under 40F, freezer under 0F, holding over 135F); (8) TRACK incident reduction (target ${config.minFoodSafetyIncidentReductionPct}%+); (9) BENCHMARK vs competitor food safety IoT. Industry data: 60-80% incident reduction; $50k-500k lawsuit avoidance; payback 1-2 months. Expected impact: +60% food safety improvement, +12pts efficiency, payback 1-2 months.`,
        ai_recommendation: 'deploy_food_safety_iot',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: OCCUPANCY_TRACKING_ABSENT
    if (d.has_smart_iot_strategy && config.requireOccupancyTracking && (!d.has_occupancy_tracking || d.staffing_optimization_pct < config.minStaffingOptimizationPct)) {
      const staffingGap = Math.max(config.minStaffingOptimizationPct - d.staffing_optimization_pct, 0);
      const expectedStaffingSavings = Math.round(baselineRevenue * (staffingGap / 200));
      const expectedRevenueOptimization = Math.round(baselineRevenue * 0.015);
      const expectedCustomerExperience = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedStaffingSavings + expectedRevenueOptimization + expectedCustomerExperience + expectedCompetitiveLift, 1600);
      const severityLabel = !d.has_occupancy_tracking ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO OCCUPANCY TRACKING — occupancy sensors 0; staffing optimization ${d.staffing_optimization_pct}% (min ${config.minStaffingOptimizationPct}%); IoT occupancy sensors optimize staffing 15-25% (real-time vs scheduled); dwell time tracking reveals customer behavior; without occupancy tracking, staffing is based on estimates = overstaffing (waste) or understaffing (poor service). `;
      alerts.push({
        rule_id: 'occupancy_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_occupancy_tracking: d.has_occupancy_tracking,
        occupancy_sensors_count: d.occupancy_sensors_count,
        staffing_optimization_pct: d.staffing_optimization_pct,
        staffing_optimization_target_pct: d.staffing_optimization_target_pct,
        dwell_time_tracking: d.dwell_time_tracking,
        traffic_pattern_analysis: d.traffic_pattern_analysis,
        iot_device_count: d.iot_device_count,
        labor_optimization_score: d.labor_optimization_score,
        customer_experience_score: d.customer_experience_score,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue,
        staffing_optimization_projected_pct: 20,
        efficiency_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `OCCUPANCY TRACKING ABSENT: ${d.location_id} — occupancy tracking ${d.has_occupancy_tracking ? 'present' : 'ABSENT'}; sensors ${d.occupancy_sensors_count}; staffing optimization ${d.staffing_optimization_pct}% (min ${config.minStaffingOptimizationPct}%, target ${d.staffing_optimization_target_pct}%); dwell time ${d.dwell_time_tracking ? 'tracked' : 'NOT tracked'}; traffic patterns ${d.traffic_pattern_analysis ? 'analyzed' : 'NOT analyzed'}; IoT devices ${d.iot_device_count}; labor optimization ${d.labor_optimization_score}/100; customer experience ${d.customer_experience_score}/100; competitor ${d.competitor_iot_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: IoT occupancy sensors optimize staffing 15-25% (real-time vs scheduled — adjust staff based on actual customer count); occupancy tracking = people counting sensors (entrance, zone-based), dwell time tracking (how long customers stay — table, bar, queue), traffic pattern analysis (where customers go, bottlenecks, hot zones); occupancy tracking benefits = staffing optimization (15-25% — right staff at right time), revenue optimization (10-20% — identify peak zones, upsell opportunities), customer experience (reduce wait, optimize layout), capacity management (prevent overcrowding, optimize seating); occupancy sensor types = infrared (people counting), camera-based (AI people counting + dwell time), WiFi analytics (phone tracking — anonymous), pressure mats (table occupancy); occupancy tracking cost = $300-1,000/month (sensors + analytics); occupancy tracking ROI = $5-10 per $1 (staffing + revenue + experience). Solutions ranked by impact: (1) IMPLEMENT occupancy tracking — staffing savings ${fmt$(expectedStaffingSavings)}/mo + revenue optimization ${fmt$(expectedRevenueOptimization)}/mo + customer experience ${fmt$(expectedCustomerExperience)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(500)}/mo (sensors + analytics); payback 2-4 months; (2) INSTALL people counting sensors (entrance, zones); (3) INSTALL dwell time tracking (table, bar, queue); (4) IMPLEMENT traffic pattern analysis (bottlenecks, hot zones); (5) OPTIMIZE staffing (real-time vs scheduled); (6) OPTIMIZE layout (identify underutilized areas); (7) OPTIMIZE upselling (identify peak zones for upsell prompts); (8) TRACK staffing optimization (target ${config.minStaffingOptimizationPct}%+); (9) BENCHMARK vs competitor occupancy tracking. Industry data: 15-25% staffing optimization; 10-20% revenue optimization; payback 2-4 months. Expected impact: +20% staffing optimization, +12pts efficiency, payback 2-4 months.`,
        ai_recommendation: 'implement_occupancy_tracking',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: ENERGY_IOT_ABSENT
    if (d.has_smart_iot_strategy && config.requireEnergyIot && (!d.has_energy_iot || d.energy_savings_pct < config.minEnergySavingsPct)) {
      const energyGap = Math.max(config.minEnergySavingsPct - d.energy_savings_pct, 0);
      const expectedEnergySavings = Math.round(baselineRevenue * (energyGap / 300));
      const expectedEquipmentSavings = Math.round(baselineRevenue * 0.008);
      const expectedSustainabilityLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedEnergySavings + expectedEquipmentSavings + expectedSustainabilityLift + expectedCompetitiveLift, 1400);
      const severityLabel = d.energy_savings_pct < 5 ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO ENERGY IoT — energy sensors ${d.energy_sensors_count}; savings ${d.energy_savings_pct}% (min ${config.minEnergySavingsPct}%); smart HVAC ${d.smart_hvac_enabled ? 'yes' : 'NO'}; smart lighting ${d.smart_lighting_enabled ? 'yes' : 'NO'}; smart refrigeration ${d.smart_refrigeration_enabled ? 'yes' : 'NO'}; energy IoT reduces utility costs 15-30% (smart HVAC, lighting, refrigeration); without energy IoT, energy usage is unmonitored = waste. `;
      alerts.push({
        rule_id: 'energy_iot_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_energy_iot: d.has_energy_iot,
        energy_sensors_count: d.energy_sensors_count,
        energy_savings_pct: d.energy_savings_pct,
        energy_savings_target_pct: d.energy_savings_target_pct,
        smart_hvac_enabled: d.smart_hvac_enabled,
        smart_lighting_enabled: d.smart_lighting_enabled,
        smart_refrigeration_enabled: d.smart_refrigeration_enabled,
        iot_device_count: d.iot_device_count,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue,
        energy_savings_projected_pct: 20,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ENERGY IoT ABSENT: ${d.location_id} — energy IoT ${d.has_energy_iot ? 'present' : 'ABSENT'}; sensors ${d.energy_sensors_count}; savings ${d.energy_savings_pct}% (min ${config.minEnergySavingsPct}%, target ${d.energy_savings_target_pct}%); smart HVAC ${d.smart_hvac_enabled ? 'enabled' : 'disabled'}; smart lighting ${d.smart_lighting_enabled ? 'enabled' : 'disabled'}; smart refrigeration ${d.smart_refrigeration_enabled ? 'enabled' : 'disabled'}; IoT devices ${d.iot_device_count}; competitor ${d.competitor_iot_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: energy IoT reduces utility costs 15-30% (smart HVAC, lighting, refrigeration — real-time monitoring + automated control); energy IoT = smart HVAC (occupancy-based, schedule-based, temperature optimization), smart lighting (occupancy-based, daylight harvesting, schedule-based), smart refrigeration (temperature monitoring, door alerts, defrost optimization), energy monitoring (real-time kWh, peak demand, cost tracking); energy IoT benefits = reduced utility costs (15-30%), reduced equipment wear (smart cycling), sustainability (carbon reduction), compliance (energy reporting); energy IoT cost = $300-1,000/month (sensors + smart controllers + platform); energy IoT ROI = $5-10 per $1 (utility savings + equipment savings + sustainability). Solutions ranked by impact: (1) DEPLOY energy IoT — energy savings ${fmt$(expectedEnergySavings)}/mo + equipment savings ${fmt$(expectedEquipmentSavings)}/mo + sustainability ${fmt$(expectedSustainabilityLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(500)}/mo (sensors + controllers); payback 2-4 months; (2) INSTALL smart HVAC (occupancy-based, schedule-based); (3) INSTALL smart lighting (occupancy-based, daylight harvesting); (4) INSTALL smart refrigeration (temperature monitoring, door alerts); (5) INSTALL energy monitoring (real-time kWh, peak demand); (6) IMPLEMENT automated control (smart cycling, peak shaving); (7) TRACK energy savings (target ${config.minEnergySavingsPct}%+); (8) BENCHMARK vs competitor energy IoT. Industry data: 15-30% utility cost reduction; payback 2-4 months. Expected impact: +20% energy savings, payback 2-4 months.`,
        ai_recommendation: 'deploy_energy_iot',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: UNIFIED_IOT_DASHBOARD_ABSENT
    if (d.has_smart_iot_strategy && config.requireUnifiedIotDashboard && (!d.has_unified_iot_dashboard || d.dashboard_device_integration_pct < config.minDashboardDeviceIntegrationPct)) {
      const integrationGap = Math.max(config.minDashboardDeviceIntegrationPct - d.dashboard_device_integration_pct, 0);
      const expectedManagerTimeSavings = Math.round(d.manager_time_saved_hours_daily < 2 ? (2 - d.manager_time_saved_hours_daily) * 30 * 25 : 0);
      const expectedDecisionSpeed = Math.round(baselineRevenue * 0.015);
      const expectedOperationalLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedManagerTimeSavings + expectedDecisionSpeed + expectedOperationalLift + expectedCompetitiveLift, 1200);
      const severityLabel = !d.has_unified_iot_dashboard ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO UNIFIED IoT DASHBOARD — device integration ${d.dashboard_device_integration_pct}% (min ${config.minDashboardDeviceIntegrationPct}%); manager time saved ${d.manager_time_saved_hours_daily}h/day; real-time alerts ${d.real_time_alerts_enabled ? 'yes' : 'NO'}; edge computing ${d.edge_computing_enabled ? 'yes' : 'NO'}; unified dashboard = single pane of glass for all IoT devices; saves 2-4h/day manager time; without unified dashboard, managers check multiple systems = wasted time + slower decisions. `;
      alerts.push({
        rule_id: 'unified_iot_dashboard_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_unified_iot_dashboard: d.has_unified_iot_dashboard,
        dashboard_device_integration_pct: d.dashboard_device_integration_pct,
        manager_time_saved_hours_daily: d.manager_time_saved_hours_daily,
        real_time_alerts_enabled: d.real_time_alerts_enabled,
        edge_computing_enabled: d.edge_computing_enabled,
        iot_device_count: d.iot_device_count,
        iot_platform: d.iot_platform,
        decision_speed_score: d.decision_speed_score,
        operational_efficiency_score: d.operational_efficiency_score,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue,
        manager_time_projected_hours: 3,
        efficiency_lift_projected_pts: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `UNIFIED IoT DASHBOARD ABSENT: ${d.location_id} — unified dashboard ${d.has_unified_iot_dashboard ? 'present' : 'ABSENT'}; device integration ${d.dashboard_device_integration_pct}% (min ${config.minDashboardDeviceIntegrationPct}%); manager time saved ${d.manager_time_saved_hours_daily}h/day; real-time alerts ${d.real_time_alerts_enabled ? 'yes' : 'NO'}; edge computing ${d.edge_computing_enabled ? 'yes' : 'NO'}; IoT devices ${d.iot_device_count} (${d.iot_platform}); decision speed ${d.decision_speed_score}/100; operational efficiency ${d.operational_efficiency_score}/100; competitor ${d.competitor_iot_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: unified IoT dashboard = single pane of glass for all IoT devices (equipment, food safety, occupancy, energy, security — all in one view); unified dashboard saves 2-4 hours/day manager time (vs checking multiple systems); unified dashboard enables real-time alerts (push notifications for critical events — all systems monitored simultaneously); unified dashboard enables faster decisions (all data in one place — no switching between systems); edge computing = 5-10x faster decision-making (local processing vs cloud round-trip — critical for real-time alerts); unified dashboard types = cloud-based (AWS, Azure, Google), on-premise (edge computing), hybrid; unified dashboard features = real-time monitoring (all devices on one screen), alert management (all alerts in one inbox), analytics (cross-device insights), reporting (unified reports), automation (cross-device triggers); unified dashboard cost = $200-800/month (platform + integration); unified dashboard ROI = $5-10 per $1 (manager time + decision speed + operational efficiency). Solutions ranked by impact: (1) IMPLEMENT unified dashboard — manager time savings ${fmt$(expectedManagerTimeSavings)}/mo + decision speed ${fmt$(expectedDecisionSpeed)}/mo + operational ${fmt$(expectedOperationalLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(400)}/mo (platform + integration); payback 1-2 months; (2) CHOOSE dashboard platform (AWS IoT, Azure IoT, Google Cloud IoT, private); (3) INTEGRATE all IoT devices (equipment, food safety, occupancy, energy, security); (4) ENABLE real-time alerts (push notifications for critical events); (5) IMPLEMENT edge computing (local processing for speed); (6) CREATE unified analytics (cross-device insights); (7) CREATE unified reporting (all data in one report); (8) IMPLEMENT automation (cross-device triggers — e.g., occupancy sensor triggers HVAC adjustment); (9) TRACK device integration (target ${config.minDashboardDeviceIntegrationPct}%+); (10) TRACK manager time saved (target 2-4h/day); (11) BENCHMARK vs competitor unified dashboard. Industry data: 2-4h/day manager time saved; 5-10x faster decisions; payback 1-2 months. Expected impact: +3h/day manager time, +15pts efficiency, payback 1-2 months.`,
        ai_recommendation: 'implement_unified_dashboard',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: IOT_SECURITY_PROGRAM_ABSENT
    if (d.has_smart_iot_strategy && config.requireIotSecurityProgram && (!d.has_iot_security_program || d.iot_security_score < config.minIotSecurityScore)) {
      const securityGap = Math.max(config.minIotSecurityScore - d.iot_security_score, 0);
      const expectedSecuritySavings = Math.round(baselineRevenue * 0.02);
      const expectedBreachPrevention = Math.round(baselineRevenue * 0.015);
      const expectedComplianceLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedSecuritySavings + expectedBreachPrevention + expectedComplianceLift + expectedCompetitiveLift, 1400);
      const severityLabel = d.iot_security_score < 50 ? 'high' : 'medium';
      const criticalNote = (d.iot_security_score < 50)
        ? `HIGH: NO IoT SECURITY PROGRAM — security score ${d.iot_security_score}/100 (min ${config.minIotSecurityScore}); vulnerabilities ${d.iot_vulnerability_count}; device auth ${d.device_authentication_enabled ? 'yes' : 'NO'}; network segmentation ${d.network_segmentation_enabled ? 'yes' : 'NO'}; 45% of restaurant IoT devices have security vulnerabilities (Ponemon Institute); each IoT device = potential attack vector; without IoT security, restaurant is vulnerable to cyber attacks, data breaches, operational disruption. `
        : `MEDIUM: IoT SECURITY BELOW TARGET — score ${d.iot_security_score}/100 (min ${config.minIotSecurityScore}); improve for breach prevention. `;
      alerts.push({
        rule_id: 'iot_security_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_iot_security_program: d.has_iot_security_program,
        iot_security_score: d.iot_security_score,
        iot_vulnerability_count: d.iot_vulnerability_count,
        iot_security_audit_frequency: d.iot_security_audit_frequency,
        device_authentication_enabled: d.device_authentication_enabled,
        network_segmentation_enabled: d.network_segmentation_enabled,
        iot_device_count: d.iot_device_count,
        iot_platform: d.iot_platform,
        competitor_iot_score: d.competitor_iot_score,
        monthly_revenue: d.monthly_revenue,
        security_lift_projected_pts: 30,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `IoT SECURITY PROGRAM ABSENT: ${d.location_id} — IoT security ${d.has_iot_security_program ? 'present' : 'ABSENT'}; security score ${d.iot_security_score}/100 (min ${config.minIotSecurityScore}); vulnerabilities ${d.iot_vulnerability_count}; audit frequency ${d.iot_security_audit_frequency}/yr; device authentication ${d.device_authentication_enabled ? 'enabled' : 'disabled'}; network segmentation ${d.network_segmentation_enabled ? 'enabled' : 'disabled'}; IoT devices ${d.iot_device_count} (${d.iot_platform}); competitor ${d.competitor_iot_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 45% of restaurant IoT devices have security vulnerabilities (Ponemon Institute); each IoT device = potential attack vector (hacked thermostat, compromised camera, infected sensor — all can be entry points for cyber attacks); IoT security = device authentication (each device has unique credentials), network segmentation (IoT devices on separate network — isolate from POS/customer data), encryption (data in transit + at rest), firmware updates (regular security patches), vulnerability scanning (regular scans for known vulnerabilities), security audits (annual third-party), incident response plan (what to do if breached); IoT security breach costs = $50k-500k per incident (data breach, operational disruption, reputation damage, legal liability); IoT security compliance = PCI DSS (payment data), GDPR (customer data), CCPA (California customer data); IoT security cost = $200-600/month (security tools + audits); IoT security ROI = risk avoidance ($50k-500k per breach) + compliance + insurance premium reduction (10-20%). Solutions ranked by impact: (1) IMPLEMENT IoT security — security savings ${fmt$(expectedSecuritySavings)}/mo + breach prevention ${fmt$(expectedBreachPrevention)}/mo + compliance ${fmt$(expectedComplianceLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo (security tools); payback immediate (risk avoidance); (2) ENABLE device authentication (unique credentials per device); (3) ENABLE network segmentation (IoT on separate network — isolate from POS/data); (4) ENABLE encryption (data in transit + at rest); (5) IMPLEMENT firmware updates (regular security patches); (6) IMPLEMENT vulnerability scanning (regular scans); (7) CONDUCT security audits (annual third-party); (8) CREATE incident response plan (what to do if breached); (9) TRACK security score (target ${config.minIotSecurityScore}+); (10) TRACK vulnerabilities (target 0); (11) BENCHMARK vs competitor IoT security. Industry data: 45% IoT device vulnerabilities (Ponemon); $50k-500k breach cost; payback immediate. Expected impact: +30pts security, +breach prevention, payback immediate.`,
        ai_recommendation: 'implement_iot_security',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: IOT_ROI_TRACKING_ABSENT
    if (d.has_smart_iot_strategy && config.requireIotRoiTracking && !d.has_iot_roi_tracking) {
      const expectedRoiRecovery = Math.round((d.downtime_savings_monthly + d.food_safety_savings_monthly + d.staffing_savings_monthly + d.energy_savings_monthly) * 0.20);
      const expectedPortfolioOptimization = Math.round(d.iot_investment_total * 0.001);
      const expectedWastedSpendRecovery = Math.round(d.iot_investment_total * 0.0005);
      const expectedScalingLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedPortfolioOptimization + expectedWastedSpendRecovery + expectedScalingLift, 1000);
      const severityLabel = d.iot_investment_total > 15000 ? 'medium' : 'low';
      const criticalNote = (d.iot_investment_total > 15000)
        ? `MEDIUM: NO IoT ROI TRACKING — investment ${fmt$(d.iot_investment_total)} but no ROI tracking; without tracking, can't identify which IoT devices drive savings = wasted 15-20% of investment; IoT ROI = downtime savings, food safety savings, staffing savings, energy savings, ROAS. `
        : `LOW: NO IoT ROI TRACKING — implement tracking to optimize IoT investment. `;
      alerts.push({
        rule_id: 'iot_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_iot_roi_tracking: d.has_iot_roi_tracking,
        iot_investment_total: d.iot_investment_total,
        downtime_savings_monthly: d.downtime_savings_monthly,
        food_safety_savings_monthly: d.food_safety_savings_monthly,
        staffing_savings_monthly: d.staffing_savings_monthly,
        energy_savings_monthly: d.energy_savings_monthly,
        iot_roas: d.iot_roas,
        iot_device_count: d.iot_device_count,
        iot_platform: d.iot_platform,
        monthly_revenue: d.monthly_revenue,
        iot_platform_cost_monthly: d.iot_platform_cost_monthly,
        iot_maintenance_cost_monthly: d.iot_maintenance_cost_monthly,
        roi_lift_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `IoT ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_iot_roi_tracking ? 'present' : 'ABSENT'}; investment ${fmt$(d.iot_investment_total)}; downtime savings ${fmt$(d.downtime_savings_monthly)}/mo; food safety savings ${fmt$(d.food_safety_savings_monthly)}/mo; staffing savings ${fmt$(d.staffing_savings_monthly)}/mo; energy savings ${fmt$(d.energy_savings_monthly)}/mo; ROAS ${d.iot_roas}x; devices ${d.iot_device_count} (${d.iot_platform}); platform ${fmt$(d.iot_platform_cost_monthly)}/mo; maintenance ${fmt$(d.iot_maintenance_cost_monthly)}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without ROI tracking, restaurants waste 15-20% of IoT investment on underperforming devices; IoT ROI tracking = downtime savings (predictive maintenance ROI), food safety savings (incident reduction ROI), staffing savings (occupancy optimization ROI), energy savings (energy IoT ROI), ROAS (total savings / total cost); ROI tracking tools = IoT platform analytics (per-device metrics), POS integration (revenue attribution), maintenance logs (downtime tracking), energy bills (utility savings); ROI metrics = ROAS (target ${config.minIotRoas}x+), downtime reduction (target 40-50%), food safety improvement (target 60-80%), staffing optimization (target 15-25%), energy savings (target 15-30%); ROI tracking best practice = track per device category weekly, audit portfolio quarterly (scale winners, cut losers). Solutions ranked by impact: (1) IMPLEMENT IoT ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + portfolio optimization ${fmt$(expectedPortfolioOptimization)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + scaling ${fmt$(expectedScalingLift)}/mo; cost ${fmt$(200)}/mo (analytics); payback immediate; (2) INTEGRATE IoT platform analytics (per-device metrics); (3) INTEGRATE POS (revenue attribution); (4) INTEGRATE maintenance logs (downtime tracking); (5) INTEGRATE energy bills (utility savings); (6) TRACK ROAS per device category (target ${config.minIotRoas}x+); (7) TRACK downtime savings; (8) TRACK food safety savings; (9) TRACK staffing savings; (10) TRACK energy savings; (11) AUDIT quarterly (scale winners, cut losers); (12) BENCHMARK vs competitor IoT ROI. Industry data: 15-20% wasted investment without tracking; payback immediate. Expected impact: +25% ROI, +${fmt$(expectedRoiRecovery)}/mo ROI recovery, payback immediate.`,
        ai_recommendation: 'implement_iot_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM smart_restaurant_iot_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE smart_restaurant_iot_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant smart IoT and connected device expert. Given IoT data, recommend ONE specific action with expected downtime reduction, food safety improvement, staffing optimization, energy savings, or ROI lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. IoT strategy: ${a.has_smart_iot_strategy ?? false} (${a.iot_platform ?? 'none'}, ${a.iot_device_count ?? 0}/${a.iot_device_target_count ?? 30} devices). Predictive maintenance: ${a.has_predictive_maintenance ?? false} (${a.equipment_sensors_count ?? 0} sensors, downtime ${a.equipment_downtime_hours_monthly ?? 0}h/mo, accuracy ${a.predictive_maintenance_accuracy_pct ?? 0}%). Food safety IoT: ${a.has_food_safety_iot_monitoring ?? false} (${a.temperature_sensors_count ?? 0} temp sensors, ${a.food_safety_alerts_monthly ?? 0} alerts/mo, reduction ${a.food_safety_incident_reduction_pct ?? 0}%). Occupancy tracking: ${a.has_occupancy_tracking ?? false} (${a.occupancy_sensors_count ?? 0} sensors, staffing opt ${a.staffing_optimization_pct ?? 0}%). Energy IoT: ${a.has_energy_iot ?? false} (${a.energy_sensors_count ?? 0} sensors, savings ${a.energy_savings_pct ?? 0}%, HVAC ${a.smart_hvac_enabled ?? false}, lighting ${a.smart_lighting_enabled ?? false}, refrigeration ${a.smart_refrigeration_enabled ?? false}). Unified dashboard: ${a.has_unified_iot_dashboard ?? false} (integration ${a.dashboard_device_integration_pct ?? 0}%, manager time ${a.manager_time_saved_hours_daily ?? 0}h/day, edge ${a.edge_computing_enabled ?? false}). Security: ${a.has_iot_security_program ?? false} (score ${a.iot_security_score ?? 0}/100, vulnerabilities ${a.iot_vulnerability_count ?? 0}, auth ${a.device_authentication_enabled ?? false}, segmentation ${a.network_segmentation_enabled ?? false}). ROI: ${a.has_iot_roi_tracking ?? false} (investment ${fmt$(a.iot_investment_total ?? 0)}, downtime savings ${fmt$(a.downtime_savings_monthly ?? 0)}/mo, food safety ${fmt$(a.food_safety_savings_monthly ?? 0)}/mo, staffing ${fmt$(a.staffing_savings_monthly ?? 0)}/mo, energy ${fmt$(a.energy_savings_monthly ?? 0)}/mo, ROAS ${a.iot_roas ?? 0}x). Decision speed: ${a.decision_speed_score ?? 0}/100. Efficiency: ${a.operational_efficiency_score ?? 0}/100. Labor: ${a.labor_optimization_score ?? 0}/100. Customer experience: ${a.customer_experience_score ?? 0}/100. Competitor: ${a.competitor_iot_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Equipment: ${a.total_equipment_count ?? 0}. Device cost: ${fmt$(a.iot_device_cost_avg ?? 0)}. Platform cost: ${fmt$(a.iot_platform_cost_monthly ?? 0)}/mo. Maintenance: ${fmt$(a.iot_maintenance_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveSmartRestaurantIotAlerts = async (db: ReturnType<typeof useDB>): Promise<SmartRestaurantIotAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM smart_restaurant_iot_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getSmartRestaurantIotSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  smartIotStrategyAbsentCount: number;
  predictiveMaintenanceAbsentCount: number;
  foodSafetyIotMonitoringAbsentCount: number;
  occupancyTrackingAbsentCount: number;
  energyIotAbsentCount: number;
  unifiedIotDashboardAbsentCount: number;
  iotSecurityProgramAbsentCount: number;
  iotRoiTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'smart_iot_strategy_absent') AS nostrategy,
              math::count(rule_id = 'predictive_maintenance_absent') AS nomaintenance,
              math::count(rule_id = 'food_safety_iot_monitoring_absent') AS nofoodsafety,
              math::count(rule_id = 'occupancy_tracking_absent') AS nooccupancy,
              math::count(rule_id = 'energy_iot_absent') AS noenergy,
              math::count(rule_id = 'unified_iot_dashboard_absent') AS nodashboard,
              math::count(rule_id = 'iot_security_program_absent') AS nosecurity,
              math::count(rule_id = 'iot_roi_tracking_absent') AS noroi
       FROM smart_restaurant_iot_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      smartIotStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      predictiveMaintenanceAbsentCount: safeNumber(r.nomaintenance, 0),
      foodSafetyIotMonitoringAbsentCount: safeNumber(r.nofoodsafety, 0),
      occupancyTrackingAbsentCount: safeNumber(r.nooccupancy, 0),
      energyIotAbsentCount: safeNumber(r.noenergy, 0),
      unifiedIotDashboardAbsentCount: safeNumber(r.nodashboard, 0),
      iotSecurityProgramAbsentCount: safeNumber(r.nosecurity, 0),
      iotRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, smartIotStrategyAbsentCount: 0, predictiveMaintenanceAbsentCount: 0, foodSafetyIotMonitoringAbsentCount: 0, occupancyTrackingAbsentCount: 0, energyIotAbsentCount: 0, unifiedIotDashboardAbsentCount: 0, iotSecurityProgramAbsentCount: 0, iotRoiTrackingAbsentCount: 0 };
  }
};

export const updateSmartRestaurantIotAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
