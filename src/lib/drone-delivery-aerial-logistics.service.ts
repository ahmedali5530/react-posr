/**
 * AI Drone Delivery & Autonomous Aerial Logistics Optimizer — predicts how
 * drone delivery and autonomous aerial logistics (drone fleet management,
 * delivery route optimization, regulatory compliance, weather adaptation,
 * payload optimization, battery management, delivery speed, customer
 * experience, cost per delivery, competitive advantage) impacts delivery
 * revenue, speed of service, delivery cost reduction, market reach, and
 * customer satisfaction.
 *
 * Drone delivery market = $30B+ by 2030 (Markets and Markets), growing
 * 40%+ CAGR. DoorDash Wing drone delivery = 3-5 min delivery (vs 25-40
 * min traditional). Uber Eats drone pilots in San Diego showed 60%
 * faster delivery. Chick-fil-A drone delivery pilot in Tampa. McDonald's
 * filed drone delivery patents. Drone delivery cost = $1-5 per delivery
 * (vs $5-10 traditional driver). Drone delivery range = 3-6 miles (vs
 * 3-5 miles traditional). Drone payload = 2-5 lbs (burgers, bowls, not
 * large family orders). 72% of customers want faster delivery (NRA).
 * Drone delivery attracts tech-savvy customers — 45% would pay premium
 * for drone delivery. FAA Part 135 certification required for commercial
 * drone delivery (beyond visual line of sight). Drone delivery reduces
 * last-mile cost 50-70% (no driver, no vehicle, no fuel). Drone delivery
 * increases delivery radius 20-40% (drones can fly over traffic, not
 * through it). Weather limitation = drones cannot fly in high wind (>25
 * mph), heavy rain, snow, fog. Drone delivery battery = 20-30 min flight
 * time (10-15 miles round trip). Drone delivery charging stations = on-
 * site or at delivery hub. Drone delivery regulatory landscape: FAA Part
 * 107 (visual line of sight), Part 135 (beyond visual line of sight, 
 * commercial), LAANC (Low Altitude Authorization and Notification
 * Capability). Drone delivery platforms: Wing (Alphabet/Google), Amazon
 * Prime Air, Manna, Flytrex, Zipline. Drone delivery ROI = $5-15 per $1
 * invested (cost reduction + speed premium + market reach expansion).
 *
 * 211th POSR-exclusive differentiator. Distinct from:
 *   - delivery-route.service — optimizes GROUND delivery routes. This
 *     optimizer focuses on AERIAL drone delivery routes.
 *   - delivery-zone-optimizer.service — optimizes delivery ZONES (ground).
 *     This optimizer focuses on drone FLIGHT zones (aerial).
 *   - delivery-analytics.service — ANALYZES delivery performance (ground).
 *     This optimizer focuses on drone-specific metrics (aerial).
 *   - delivery-quality-decay.service — food quality DECAY in ground
 *     delivery. This optimizer focuses on drone delivery quality (faster
 *     = less decay).
 *   - delivery-route.service — GROUND route optimization. This optimizer
 *     focuses on AERIAL route optimization (3D, weather, battery).
 *   - driver-coach.service — coaches HUMAN drivers. This optimizer
 *     focuses on drone fleet management (autonomous, no driver).
 *   - packaging-optimizer.service — optimizes PACKAGING. This optimizer
 *     focuses on drone-specific packaging (payload weight, temperature
 *     during flight).
 *   - ghost-kitchen-virtual-brand.service — GHOST KITCHEN strategy. This
 *     optimizer focuses on drone delivery FROM kitchens (aerial logistics).
 *   - mobile-app-ordering.service — MOBILE APP ordering. This optimizer
 *     focuses on drone delivery execution (fulfillment, not ordering).
 *
 * 8 AI rules:
 *   1. drone_delivery_strategy_absent -> no drone delivery -> missed $30B market + 60% faster delivery
 *   2. drone_fleet_management_absent -> no fleet management -> operational chaos
 *   3. drone_delivery_route_optimization_absent -> no aerial route opt -> slow + costly
 *   4. drone_regulatory_compliance_absent -> no FAA compliance -> legal risk + grounding
 *   5. drone_weather_adaptation_absent -> no weather adaptation -> safety risk + cancellations
 *   6. drone_payload_packaging_optimization_absent -> poor payload -> weight waste + food damage
 *   7. drone_battery_charging_infrastructure_absent -> poor battery infra -> downtime + limited range
 *   8. drone_delivery_roi_tracking_absent -> no ROI tracking -> can't optimize fleet
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type DroneDeliveryRuleId =
  | 'drone_delivery_strategy_absent'
  | 'drone_fleet_management_absent'
  | 'drone_delivery_route_optimization_absent'
  | 'drone_regulatory_compliance_absent'
  | 'drone_weather_adaptation_absent'
  | 'drone_payload_packaging_optimization_absent'
  | 'drone_battery_charging_infrastructure_absent'
  | 'drone_delivery_roi_tracking_absent';

export type DroneDeliveryAiRec =
  | 'launch_drone_delivery_strategy'
  | 'implement_fleet_management'
  | 'optimize_aerial_routes'
  | 'achieve_regulatory_compliance'
  | 'implement_weather_adaptation'
  | 'optimize_payload_packaging'
  | 'build_battery_charging_infra'
  | 'implement_roi_tracking'
  | 'monitor'
  | 'skip';

export interface DroneDeliveryAlert {
  id?: string;
  rule_id: DroneDeliveryRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  has_drone_delivery_strategy?: boolean;
  drone_delivery_platform?: string;
  drone_fleet_size?: number;
  drone_fleet_target_size?: number;
  has_drone_fleet_management?: boolean;
  drone_fleet_utilization_pct?: number;
  drone_fleet_utilization_target_pct?: number;
  has_drone_delivery_route_optimization?: boolean;
  avg_drone_delivery_time_minutes?: number;
  avg_ground_delivery_time_minutes?: number;
  drone_delivery_time_target_minutes?: number;
  drone_route_efficiency_score?: number;
  has_drone_regulatory_compliance?: boolean;
  faa_part_135_certified?: boolean;
  laanc_authorized?: boolean;
  bvlos_authorized?: boolean;
  regulatory_compliance_score?: number;
  has_drone_weather_adaptation?: boolean;
  weather_cancellation_rate_pct?: number;
  weather_cancellation_target_pct?: number;
  wind_speed_monitoring?: boolean;
  rain_monitoring?: boolean;
  has_drone_payload_packaging_optimization?: boolean;
  max_drone_payload_lbs?: number;
  avg_drone_payload_lbs?: number;
  payload_utilization_pct?: number;
  drone_specific_packaging_present?: boolean;
  has_drone_battery_charging_infrastructure?: boolean;
  avg_battery_life_minutes?: number;
  charging_stations_count?: number;
  drone_uptime_pct?: number;
  drone_uptime_target_pct?: number;
  has_drone_delivery_roi_tracking?: boolean;
  drone_delivery_cost_per_delivery?: number;
  ground_delivery_cost_per_delivery?: number;
  drone_delivery_revenue_monthly?: number;
  drone_delivery_cost_monthly?: number;
  drone_delivery_roas?: number;
  drone_delivery_revenue_per_delivery?: number;
  drone_delivery_volume_monthly?: number;
  drone_delivery_radius_miles?: number;
  ground_delivery_radius_miles?: number;
  drone_delivery_customer_satisfaction_score?: number;
  ground_delivery_customer_satisfaction_score?: number;
  drone_premium_willingness_pct?: number;
  competitor_drone_delivery_score?: number;
  monthly_revenue?: number;
  total_deliveries_monthly?: number;
  drone_fleet_investment?: number;
  drone_subscription_cost_monthly?: number;
  regulatory_compliance_cost_monthly?: number;
  charging_infrastructure_cost?: number;
  cost_per_delivery_reduction_projected_pct?: number;
  delivery_speed_lift_projected_pct?: number;
  delivery_radius_lift_projected_pct?: number;
  fleet_utilization_lift_projected_pct?: number;
  weather_cancellation_reduction_projected_pct?: number;
  payload_utilization_lift_projected_pts?: number;
  uptime_lift_projected_pct?: number;
  roi_lift_projected_pct?: number;
  satisfaction_lift_projected_pts?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: DroneDeliveryAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface DroneDeliveryConfig {
  aiEnabled: boolean;
  requireDroneDeliveryStrategy: boolean;
  requireDroneFleetManagement: boolean;
  requireDroneDeliveryRouteOptimization: boolean;
  requireDroneRegulatoryCompliance: boolean;
  requireDroneWeatherAdaptation: boolean;
  requireDronePayloadPackagingOptimization: boolean;
  requireDroneBatteryChargingInfrastructure: boolean;
  requireDroneDeliveryRoiTracking: boolean;
  minDroneFleetSize: number;
  minDroneFleetUtilizationPct: number;
  maxDroneDeliveryTimeMinutes: number;
  minRegulatoryComplianceScore: number;
  maxWeatherCancellationRatePct: number;
  minPayloadUtilizationPct: number;
  minDroneUptimePct: number;
  minDroneDeliveryRoas: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_DRONE_DELIVERY_CONFIG: DroneDeliveryConfig = {
  aiEnabled: true,
  requireDroneDeliveryStrategy: true,
  requireDroneFleetManagement: true,
  requireDroneDeliveryRouteOptimization: true,
  requireDroneRegulatoryCompliance: true,
  requireDroneWeatherAdaptation: true,
  requireDronePayloadPackagingOptimization: true,
  requireDroneBatteryChargingInfrastructure: true,
  requireDroneDeliveryRoiTracking: true,
  minDroneFleetSize: 3,
  minDroneFleetUtilizationPct: 60,
  maxDroneDeliveryTimeMinutes: 8,
  minRegulatoryComplianceScore: 85,
  maxWeatherCancellationRatePct: 15,
  minPayloadUtilizationPct: 70,
  minDroneUptimePct: 90,
  minDroneDeliveryRoas: 3,
  preferCompetitorParity: true,
};

export const readDroneDeliveryConfig = (settings: any): DroneDeliveryConfig => ({
  aiEnabled: settings?.drone_delivery_ai_enabled ?? true,
  requireDroneDeliveryStrategy: settings?.drone_delivery_require_strategy ?? true,
  requireDroneFleetManagement: settings?.drone_delivery_require_fleet ?? true,
  requireDroneDeliveryRouteOptimization: settings?.drone_delivery_require_route ?? true,
  requireDroneRegulatoryCompliance: settings?.drone_delivery_require_regulatory ?? true,
  requireDroneWeatherAdaptation: settings?.drone_delivery_require_weather ?? true,
  requireDronePayloadPackagingOptimization: settings?.drone_delivery_require_payload ?? true,
  requireDroneBatteryChargingInfrastructure: settings?.drone_delivery_require_battery ?? true,
  requireDroneDeliveryRoiTracking: settings?.drone_delivery_require_roi ?? true,
  minDroneFleetSize: safeNumber(settings?.drone_delivery_min_fleet, 3),
  minDroneFleetUtilizationPct: safeNumber(settings?.drone_delivery_min_utilization, 60),
  maxDroneDeliveryTimeMinutes: safeNumber(settings?.drone_delivery_max_time, 8),
  minRegulatoryComplianceScore: safeNumber(settings?.drone_delivery_min_regulatory, 85),
  maxWeatherCancellationRatePct: safeNumber(settings?.drone_delivery_max_weather_cancel, 15),
  minPayloadUtilizationPct: safeNumber(settings?.drone_delivery_min_payload, 70),
  minDroneUptimePct: safeNumber(settings?.drone_delivery_min_uptime, 90),
  minDroneDeliveryRoas: safeNumber(settings?.drone_delivery_min_roas, 3),
  preferCompetitorParity: settings?.drone_delivery_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface DroneDeliveryData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_drone_delivery_strategy: boolean;
  drone_delivery_platform: string;
  drone_fleet_size: number;
  drone_fleet_target_size: number;
  has_drone_fleet_management: boolean;
  drone_fleet_utilization_pct: number;
  drone_fleet_utilization_target_pct: number;
  has_drone_delivery_route_optimization: boolean;
  avg_drone_delivery_time_minutes: number;
  avg_ground_delivery_time_minutes: number;
  drone_delivery_time_target_minutes: number;
  drone_route_efficiency_score: number;
  has_drone_regulatory_compliance: boolean;
  faa_part_135_certified: boolean;
  laanc_authorized: boolean;
  bvlos_authorized: boolean;
  regulatory_compliance_score: number;
  has_drone_weather_adaptation: boolean;
  weather_cancellation_rate_pct: number;
  weather_cancellation_target_pct: number;
  wind_speed_monitoring: boolean;
  rain_monitoring: boolean;
  has_drone_payload_packaging_optimization: boolean;
  max_drone_payload_lbs: number;
  avg_drone_payload_lbs: number;
  payload_utilization_pct: number;
  drone_specific_packaging_present: boolean;
  has_drone_battery_charging_infrastructure: boolean;
  avg_battery_life_minutes: number;
  charging_stations_count: number;
  drone_uptime_pct: number;
  drone_uptime_target_pct: number;
  has_drone_delivery_roi_tracking: boolean;
  drone_delivery_cost_per_delivery: number;
  ground_delivery_cost_per_delivery: number;
  drone_delivery_revenue_monthly: number;
  drone_delivery_cost_monthly: number;
  drone_delivery_roas: number;
  drone_delivery_revenue_per_delivery: number;
  drone_delivery_volume_monthly: number;
  drone_delivery_radius_miles: number;
  ground_delivery_radius_miles: number;
  drone_delivery_customer_satisfaction_score: number;
  ground_delivery_customer_satisfaction_score: number;
  drone_premium_willingness_pct: number;
  competitor_drone_delivery_score: number;
  monthly_revenue: number;
  total_deliveries_monthly: number;
  drone_fleet_investment: number;
  drone_subscription_cost_monthly: number;
  regulatory_compliance_cost_monthly: number;
  charging_infrastructure_cost: number;
}

const MOCK_DATA: DroneDeliveryData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'delivery',
    has_drone_delivery_strategy: false, drone_delivery_platform: 'none',
    drone_fleet_size: 0, drone_fleet_target_size: 4,
    has_drone_fleet_management: false, drone_fleet_utilization_pct: 0,
    drone_fleet_utilization_target_pct: 65,
    has_drone_delivery_route_optimization: false,
    avg_drone_delivery_time_minutes: 0, avg_ground_delivery_time_minutes: 32,
    drone_delivery_time_target_minutes: 8, drone_route_efficiency_score: 0,
    has_drone_regulatory_compliance: false,
    faa_part_135_certified: false, laanc_authorized: false, bvlos_authorized: false,
    regulatory_compliance_score: 12,
    has_drone_weather_adaptation: false, weather_cancellation_rate_pct: 0,
    weather_cancellation_target_pct: 12, wind_speed_monitoring: false,
    rain_monitoring: false,
    has_drone_payload_packaging_optimization: false,
    max_drone_payload_lbs: 0, avg_drone_payload_lbs: 0,
    payload_utilization_pct: 0, drone_specific_packaging_present: false,
    has_drone_battery_charging_infrastructure: false,
    avg_battery_life_minutes: 0, charging_stations_count: 0,
    drone_uptime_pct: 0, drone_uptime_target_pct: 92,
    has_drone_delivery_roi_tracking: false,
    drone_delivery_cost_per_delivery: 0, ground_delivery_cost_per_delivery: 7.5,
    drone_delivery_revenue_monthly: 0, drone_delivery_cost_monthly: 0,
    drone_delivery_roas: 0, drone_delivery_revenue_per_delivery: 0,
    drone_delivery_volume_monthly: 0, drone_delivery_radius_miles: 0,
    ground_delivery_radius_miles: 3.5,
    drone_delivery_customer_satisfaction_score: 0,
    ground_delivery_customer_satisfaction_score: 68,
    drone_premium_willingness_pct: 42, competitor_drone_delivery_score: 58,
    monthly_revenue: 86000, total_deliveries_monthly: 1200,
    drone_fleet_investment: 0, drone_subscription_cost_monthly: 0,
    regulatory_compliance_cost_monthly: 0, charging_infrastructure_cost: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'delivery',
    has_drone_delivery_strategy: true, drone_delivery_platform: 'Flytrex',
    drone_fleet_size: 2, drone_fleet_target_size: 4,
    has_drone_fleet_management: false, drone_fleet_utilization_pct: 38,
    drone_fleet_utilization_target_pct: 65,
    has_drone_delivery_route_optimization: false,
    avg_drone_delivery_time_minutes: 12, avg_ground_delivery_time_minutes: 28,
    drone_delivery_time_target_minutes: 8, drone_route_efficiency_score: 52,
    has_drone_regulatory_compliance: true,
    faa_part_135_certified: true, laanc_authorized: true, bvlos_authorized: false,
    regulatory_compliance_score: 68,
    has_drone_weather_adaptation: false, weather_cancellation_rate_pct: 28,
    weather_cancellation_target_pct: 12, wind_speed_monitoring: false,
    rain_monitoring: false,
    has_drone_payload_packaging_optimization: false,
    max_drone_payload_lbs: 5, avg_drone_payload_lbs: 2.5,
    payload_utilization_pct: 50, drone_specific_packaging_present: false,
    has_drone_battery_charging_infrastructure: false,
    avg_battery_life_minutes: 22, charging_stations_count: 1,
    drone_uptime_pct: 78, drone_uptime_target_pct: 92,
    has_drone_delivery_roi_tracking: false,
    drone_delivery_cost_per_delivery: 4.5, ground_delivery_cost_per_delivery: 7.5,
    drone_delivery_revenue_monthly: 3200, drone_delivery_cost_monthly: 900,
    drone_delivery_roas: 0, drone_delivery_revenue_per_delivery: 18,
    drone_delivery_volume_monthly: 180, drone_delivery_radius_miles: 4,
    ground_delivery_radius_miles: 3.5,
    drone_delivery_customer_satisfaction_score: 78,
    ground_delivery_customer_satisfaction_score: 70,
    drone_premium_willingness_pct: 48, competitor_drone_delivery_score: 72,
    monthly_revenue: 152000, total_deliveries_monthly: 3800,
    drone_fleet_investment: 25000, drone_subscription_cost_monthly: 800,
    regulatory_compliance_cost_monthly: 200, charging_infrastructure_cost: 5000,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'delivery',
    has_drone_delivery_strategy: true, drone_delivery_platform: 'Wing (Alphabet)',
    drone_fleet_size: 5, drone_fleet_target_size: 4,
    has_drone_fleet_management: true, drone_fleet_utilization_pct: 68,
    drone_fleet_utilization_target_pct: 65,
    has_drone_delivery_route_optimization: true,
    avg_drone_delivery_time_minutes: 6, avg_ground_delivery_time_minutes: 28,
    drone_delivery_time_target_minutes: 8, drone_route_efficiency_score: 84,
    has_drone_regulatory_compliance: true,
    faa_part_135_certified: true, laanc_authorized: true, bvlos_authorized: true,
    regulatory_compliance_score: 88,
    has_drone_weather_adaptation: true, weather_cancellation_rate_pct: 10,
    weather_cancellation_target_pct: 12, wind_speed_monitoring: true,
    rain_monitoring: true,
    has_drone_payload_packaging_optimization: true,
    max_drone_payload_lbs: 5, avg_drone_payload_lbs: 3.8,
    payload_utilization_pct: 76, drone_specific_packaging_present: true,
    has_drone_battery_charging_infrastructure: true,
    avg_battery_life_minutes: 28, charging_stations_count: 3,
    drone_uptime_pct: 93, drone_uptime_target_pct: 92,
    has_drone_delivery_roi_tracking: true,
    drone_delivery_cost_per_delivery: 2.5, ground_delivery_cost_per_delivery: 7.5,
    drone_delivery_revenue_monthly: 12000, drone_delivery_cost_monthly: 1500,
    drone_delivery_roas: 5.8, drone_delivery_revenue_per_delivery: 22,
    drone_delivery_volume_monthly: 540, drone_delivery_radius_miles: 5,
    ground_delivery_radius_miles: 3.5,
    drone_delivery_customer_satisfaction_score: 88,
    ground_delivery_customer_satisfaction_score: 72,
    drone_premium_willingness_pct: 52, competitor_drone_delivery_score: 80,
    monthly_revenue: 201000, total_deliveries_monthly: 6200,
    drone_fleet_investment: 65000, drone_subscription_cost_monthly: 1200,
    regulatory_compliance_cost_monthly: 400, charging_infrastructure_cost: 15000,
  },
  {
    location_id: 'location_2', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'delivery',
    has_drone_delivery_strategy: true, drone_delivery_platform: 'Wing (Alphabet) + Manna',
    drone_fleet_size: 10, drone_fleet_target_size: 6,
    has_drone_fleet_management: true, drone_fleet_utilization_pct: 82,
    drone_fleet_utilization_target_pct: 65,
    has_drone_delivery_route_optimization: true,
    avg_drone_delivery_time_minutes: 4, avg_ground_delivery_time_minutes: 28,
    drone_delivery_time_target_minutes: 8, drone_route_efficiency_score: 94,
    has_drone_regulatory_compliance: true,
    faa_part_135_certified: true, laanc_authorized: true, bvlos_authorized: true,
    regulatory_compliance_score: 95,
    has_drone_weather_adaptation: true, weather_cancellation_rate_pct: 6,
    weather_cancellation_target_pct: 12, wind_speed_monitoring: true,
    rain_monitoring: true,
    has_drone_payload_packaging_optimization: true,
    max_drone_payload_lbs: 5, avg_drone_payload_lbs: 4.2,
    payload_utilization_pct: 84, drone_specific_packaging_present: true,
    has_drone_battery_charging_infrastructure: true,
    avg_battery_life_minutes: 30, charging_stations_count: 5,
    drone_uptime_pct: 96, drone_uptime_target_pct: 92,
    has_drone_delivery_roi_tracking: true,
    drone_delivery_cost_per_delivery: 1.8, ground_delivery_cost_per_delivery: 7.5,
    drone_delivery_revenue_monthly: 38000, drone_delivery_cost_monthly: 3200,
    drone_delivery_roas: 7.5, drone_delivery_revenue_per_delivery: 28,
    drone_delivery_volume_monthly: 1380, drone_delivery_radius_miles: 6,
    ground_delivery_radius_miles: 3.5,
    drone_delivery_customer_satisfaction_score: 92,
    ground_delivery_customer_satisfaction_score: 74,
    drone_premium_willingness_pct: 58, competitor_drone_delivery_score: 84,
    monthly_revenue: 265000, total_deliveries_monthly: 9800,
    drone_fleet_investment: 140000, drone_subscription_cost_monthly: 2000,
    regulatory_compliance_cost_monthly: 600, charging_infrastructure_cost: 28000,
  },
];

export const runDroneDeliveryEngine = async (
  db: ReturnType<typeof useDB>,
  config: DroneDeliveryConfig,
): Promise<{ alerts: DroneDeliveryAlert[]; generated: number }> => {
  const alerts: DroneDeliveryAlert[] = [];
  const now = new Date();

  let data: DroneDeliveryData[] = [];
  try {
    const result = await db.query(`SELECT * FROM drone_delivery_log`);
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): DroneDeliveryData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'delivery'),
      has_drone_delivery_strategy: Boolean(r.has_drone_delivery_strategy ?? false),
      drone_delivery_platform: String(r.drone_delivery_platform ?? 'none'),
      drone_fleet_size: safeNumber(r.drone_fleet_size, 0),
      drone_fleet_target_size: safeNumber(r.drone_fleet_target_size, 0),
      has_drone_fleet_management: Boolean(r.has_drone_fleet_management ?? false),
      drone_fleet_utilization_pct: safeNumber(r.drone_fleet_utilization_pct, 0),
      drone_fleet_utilization_target_pct: safeNumber(r.drone_fleet_utilization_target_pct, 65),
      has_drone_delivery_route_optimization: Boolean(r.has_drone_delivery_route_optimization ?? false),
      avg_drone_delivery_time_minutes: safeNumber(r.avg_drone_delivery_time_minutes, 0),
      avg_ground_delivery_time_minutes: safeNumber(r.avg_ground_delivery_time_minutes, 0),
      drone_delivery_time_target_minutes: safeNumber(r.drone_delivery_time_target_minutes, 8),
      drone_route_efficiency_score: safeNumber(r.drone_route_efficiency_score, 0),
      has_drone_regulatory_compliance: Boolean(r.has_drone_regulatory_compliance ?? false),
      faa_part_135_certified: Boolean(r.faa_part_135_certified ?? false),
      laanc_authorized: Boolean(r.laanc_authorized ?? false),
      bvlos_authorized: Boolean(r.bvlos_authorized ?? false),
      regulatory_compliance_score: safeNumber(r.regulatory_compliance_score, 0),
      has_drone_weather_adaptation: Boolean(r.has_drone_weather_adaptation ?? false),
      weather_cancellation_rate_pct: safeNumber(r.weather_cancellation_rate_pct, 0),
      weather_cancellation_target_pct: safeNumber(r.weather_cancellation_target_pct, 12),
      wind_speed_monitoring: Boolean(r.wind_speed_monitoring ?? false),
      rain_monitoring: Boolean(r.rain_monitoring ?? false),
      has_drone_payload_packaging_optimization: Boolean(r.has_drone_payload_packaging_optimization ?? false),
      max_drone_payload_lbs: safeNumber(r.max_drone_payload_lbs, 0),
      avg_drone_payload_lbs: safeNumber(r.avg_drone_payload_lbs, 0),
      payload_utilization_pct: safeNumber(r.payload_utilization_pct, 0),
      drone_specific_packaging_present: Boolean(r.drone_specific_packaging_present ?? false),
      has_drone_battery_charging_infrastructure: Boolean(r.has_drone_battery_charging_infrastructure ?? false),
      avg_battery_life_minutes: safeNumber(r.avg_battery_life_minutes, 0),
      charging_stations_count: safeNumber(r.charging_stations_count, 0),
      drone_uptime_pct: safeNumber(r.drone_uptime_pct, 0),
      drone_uptime_target_pct: safeNumber(r.drone_uptime_target_pct, 92),
      has_drone_delivery_roi_tracking: Boolean(r.has_drone_delivery_roi_tracking ?? false),
      drone_delivery_cost_per_delivery: safeNumber(r.drone_delivery_cost_per_delivery, 0),
      ground_delivery_cost_per_delivery: safeNumber(r.ground_delivery_cost_per_delivery, 0),
      drone_delivery_revenue_monthly: safeNumber(r.drone_delivery_revenue_monthly, 0),
      drone_delivery_cost_monthly: safeNumber(r.drone_delivery_cost_monthly, 0),
      drone_delivery_roas: safeNumber(r.drone_delivery_roas, 0),
      drone_delivery_revenue_per_delivery: safeNumber(r.drone_delivery_revenue_per_delivery, 0),
      drone_delivery_volume_monthly: safeNumber(r.drone_delivery_volume_monthly, 0),
      drone_delivery_radius_miles: safeNumber(r.drone_delivery_radius_miles, 0),
      ground_delivery_radius_miles: safeNumber(r.ground_delivery_radius_miles, 0),
      drone_delivery_customer_satisfaction_score: safeNumber(r.drone_delivery_customer_satisfaction_score, 0),
      ground_delivery_customer_satisfaction_score: safeNumber(r.ground_delivery_customer_satisfaction_score, 0),
      drone_premium_willingness_pct: safeNumber(r.drone_premium_willingness_pct, 0),
      competitor_drone_delivery_score: safeNumber(r.competitor_drone_delivery_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_deliveries_monthly: safeNumber(r.total_deliveries_monthly, 0),
      drone_fleet_investment: safeNumber(r.drone_fleet_investment, 0),
      drone_subscription_cost_monthly: safeNumber(r.drone_subscription_cost_monthly, 0),
      regulatory_compliance_cost_monthly: safeNumber(r.regulatory_compliance_cost_monthly, 0),
      charging_infrastructure_cost: safeNumber(r.charging_infrastructure_cost, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetCostReductionPct = 60;
    const targetSpeedLiftPct = 70;
    const targetRadiusLiftPct = 40;
    const targetFleetUtilLiftPct = 25;
    const targetWeatherCancelReductionPct = 50;
    const targetPayloadUtilLiftPts = 20;
    const targetUptimeLiftPct = 15;
    const targetRoiLiftPct = 30;
    const targetSatisfactionLiftPts = 15;

    // Rule 1: DRONE_DELIVERY_STRATEGY_ABSENT
    if (config.requireDroneDeliveryStrategy && !d.has_drone_delivery_strategy) {
      const expectedCostReduction = Math.round(d.total_deliveries_monthly * (d.ground_delivery_cost_per_delivery - 3) * 0.30);
      const expectedSpeedPremium = Math.round(d.total_deliveries_monthly * 3);
      const expectedRadiusExpansion = Math.round(d.total_deliveries_monthly * 0.15 * 28);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedCostReduction + expectedSpeedPremium + expectedRadiusExpansion + expectedCompetitiveLift, 3500);
      const severityLabel = d.competitor_drone_delivery_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_drone_delivery_score > 65)
        ? 'CRITICAL: NO DRONE DELIVERY STRATEGY — competitor drone delivery score ' + d.competitor_drone_delivery_score + '/100 (high); drone delivery market = $30B+ by 2030 (Markets and Markets); drone delivery = 3-5 min (vs 25-40 min ground); drone cost = $1-5/delivery (vs $5-10 ground); 72% of customers want faster delivery; 45% would pay premium for drone; missing drone = missed cost reduction + speed premium + market expansion. '
        : `HIGH: NO DRONE DELIVERY STRATEGY — drone market $30B+ by 2030; 3-5 min delivery (vs 25-40 min ground); $1-5/delivery cost (vs $5-10 ground); 72% want faster; 45% would pay premium; missing cost reduction + speed premium. `;
      alerts.push({
        rule_id: 'drone_delivery_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_delivery_strategy: d.has_drone_delivery_strategy,
        drone_delivery_platform: d.drone_delivery_platform,
        drone_fleet_size: d.drone_fleet_size,
        drone_fleet_target_size: d.drone_fleet_target_size,
        avg_ground_delivery_time_minutes: d.avg_ground_delivery_time_minutes,
        ground_delivery_cost_per_delivery: d.ground_delivery_cost_per_delivery,
        ground_delivery_radius_miles: d.ground_delivery_radius_miles,
        drone_premium_willingness_pct: d.drone_premium_willingness_pct,
        competitor_drone_delivery_score: d.competitor_drone_delivery_score,
        total_deliveries_monthly: d.total_deliveries_monthly,
        monthly_revenue: d.monthly_revenue,
        drone_fleet_investment: d.drone_fleet_investment,
        drone_subscription_cost_monthly: d.drone_subscription_cost_monthly,
        cost_per_delivery_reduction_projected_pct: targetCostReductionPct,
        delivery_speed_lift_projected_pct: targetSpeedLiftPct,
        delivery_radius_lift_projected_pct: targetRadiusLiftPct,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE DELIVERY STRATEGY ABSENT: ${d.location_id} — drone delivery ABSENT; platform: ${d.drone_delivery_platform}; fleet 0 (target ${d.drone_fleet_target_size}); ground delivery time ${d.avg_ground_delivery_time_minutes}min; ground cost ${fmt$(d.ground_delivery_cost_per_delivery)}/delivery; ground radius ${d.ground_delivery_radius_miles}mi; premium willingness ${d.drone_premium_willingness_pct}%; competitor drone ${d.competitor_drone_delivery_score}/100; total deliveries ${d.total_deliveries_monthly}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: drone delivery market = $30B+ by 2030 (Markets and Markets), growing 40%+ CAGR; DoorDash Wing drone delivery = 3-5 min delivery (vs 25-40 min traditional); Uber Eats drone pilots showed 60% faster delivery; Chick-fil-A drone delivery pilot in Tampa; McDonald filed drone delivery patents; drone delivery cost = $1-5 per delivery (vs $5-10 traditional driver); drone delivery range = 3-6 miles (vs 3-5 miles traditional); drone payload = 2-5 lbs (burgers, bowls, not large family orders); 72% of customers want faster delivery (NRA); 45% would pay premium for drone delivery; drone delivery reduces last-mile cost 50-70% (no driver, no vehicle, no fuel); drone delivery increases delivery radius 20-40% (drones fly over traffic); drone delivery platforms: Wing (Alphabet/Google), Amazon Prime Air, Manna, Flytrex, Zipline; drone delivery ROI = $5-15 per $1 invested (cost reduction + speed premium + market reach expansion). Solutions ranked by impact: (1) LAUNCH drone delivery strategy — cost reduction ${fmt$(expectedCostReduction)}/mo + speed premium ${fmt$(expectedSpeedPremium)}/mo + radius expansion ${fmt$(expectedRadiusExpansion)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.drone_fleet_investment || 25000)} setup + ${fmt$(d.drone_subscription_cost_monthly || 800)}/mo subscription; payback 4-8 months; (2) CHOOSE drone platform (Wing, Manna, Flytrex, Zipline, or in-house); (3) OBTAIN FAA Part 135 certification (beyond visual line of sight, commercial); (4) OBTAIN LAANC authorization (Low Altitude Authorization); (5) BUILD drone fleet (start with ${config.minDroneFleetSize} drones); (6) INSTALL charging stations; (7) OPTIMIZE aerial routes (3D, weather, battery); (8) DESIGN drone-specific packaging (payload weight, flight temperature); (9) IMPLEMENT weather adaptation (wind, rain monitoring); (10) IMPLEMENT fleet management (utilization, maintenance); (11) TRACK ROI (cost per delivery, speed, radius, satisfaction); (12) BENCHMARK vs competitor drone delivery. Industry data: $30B+ market by 2030; 60% faster; 50-70% last-mile cost reduction; $5-15 ROI per $1; payback 4-8 months. Expected impact: -${targetCostReductionPct}% delivery cost, +${targetSpeedLiftPct}% speed, +${targetRadiusLiftPct}% radius, payback 4-8 months.`,
        ai_recommendation: 'launch_drone_delivery_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: DRONE_FLEET_MANAGEMENT_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDroneFleetManagement && (!d.has_drone_fleet_management || d.drone_fleet_utilization_pct < config.minDroneFleetUtilizationPct)) {
      const utilGap = Math.max(config.minDroneFleetUtilizationPct - d.drone_fleet_utilization_pct, 0);
      const expectedUtilLift = Math.round(d.drone_delivery_volume_monthly * (utilGap / 100) * d.drone_delivery_revenue_per_delivery);
      const expectedMaintenanceSavings = Math.round(d.drone_fleet_size * 200);
      const expectedDowntimeReduction = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedUtilLift + expectedMaintenanceSavings + expectedDowntimeReduction + expectedCompetitiveLift, 1800);
      const severityLabel = !d.has_drone_fleet_management ? 'high' : 'medium';
      const criticalNote = (!d.has_drone_fleet_management)
        ? `HIGH: NO DRONE FLEET MANAGEMENT — fleet ${d.drone_fleet_size} drones, utilization ${d.drone_fleet_utilization_pct}% (min ${config.minDroneFleetUtilizationPct}%); without fleet management, drones are underutilized + poorly maintained = downtime + wasted investment; fleet management = scheduling, maintenance, utilization tracking, battery management, safety monitoring. `
        : `MEDIUM: FLEET UTILIZATION BELOW TARGET — ${d.drone_fleet_utilization_pct}% (min ${config.minDroneFleetUtilizationPct}%); improve scheduling for higher utilization. `;
      alerts.push({
        rule_id: 'drone_fleet_management_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_fleet_management: d.has_drone_fleet_management,
        drone_fleet_size: d.drone_fleet_size,
        drone_fleet_target_size: d.drone_fleet_target_size,
        drone_fleet_utilization_pct: d.drone_fleet_utilization_pct,
        drone_fleet_utilization_target_pct: d.drone_fleet_utilization_target_pct,
        drone_uptime_pct: d.drone_uptime_pct,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        drone_delivery_revenue_per_delivery: d.drone_delivery_revenue_per_delivery,
        competitor_drone_delivery_score: d.competitor_drone_delivery_score,
        monthly_revenue: d.monthly_revenue,
        drone_subscription_cost_monthly: d.drone_subscription_cost_monthly,
        fleet_utilization_lift_projected_pct: targetFleetUtilLiftPct,
        uptime_lift_projected_pct: targetUptimeLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE FLEET MANAGEMENT ABSENT: ${d.location_id} — fleet management ${d.has_drone_fleet_management ? 'present' : 'ABSENT'}; fleet ${d.drone_fleet_size} drones (target ${d.drone_fleet_target_size}); utilization ${d.drone_fleet_utilization_pct}% (min ${config.minDroneFleetUtilizationPct}%, target ${d.drone_fleet_utilization_target_pct}%); uptime ${d.drone_uptime_pct}% (target ${d.drone_uptime_target_pct}%); delivery volume ${d.drone_delivery_volume_monthly}/mo; revenue/delivery ${fmt$(d.drone_delivery_revenue_per_delivery)}; competitor drone ${d.competitor_drone_delivery_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: drone fleet management = scheduling (which drone for which delivery), maintenance (preventive + corrective), utilization tracking (drones should fly 60-80% of available time), battery management (charge cycles, replacement), safety monitoring (flight logs, incident tracking), remote ID (FAA requirement); without fleet management, drones are underutilized (30-40% vs 60-80% target), poorly maintained (higher downtime), unsafe (no flight logs); fleet management platforms: AirHub, AirMap, Unifly, drone-specific fleet software; fleet management cost = $200-800/month (software + staff); fleet management ROI = $5-10 per $1 (utilization lift + maintenance savings + downtime reduction). Solutions ranked by impact: (1) IMPLEMENT fleet management — utilization lift ${fmt$(expectedUtilLift)}/mo + maintenance savings ${fmt$(expectedMaintenanceSavings)}/mo + downtime reduction ${fmt$(expectedDowntimeReduction)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(400)}/mo (software); payback 1-2 months; (2) DEPLOY fleet management platform (AirHub, AirMap, Unifly); (3) IMPLEMENT scheduling (which drone for which delivery); (4) SCHEDULE preventive maintenance (battery cycles, motor checks); (5) TRACK utilization per drone (target ${config.minDroneFleetUtilizationPct}%+); (6) TRACK uptime (target ${config.minDroneUptimePct}%+); (7) IMPLEMENT battery management (charge cycles, replacement schedule); (8) IMPLEMENT safety monitoring (flight logs, incident tracking); (9) ENABLE remote ID (FAA requirement); (10) BENCHMARK vs competitor fleet management. Industry data: 60-80% utilization target; 90%+ uptime; payback 1-2 months. Expected impact: +${targetFleetUtilLiftPct}% utilization, +${targetUptimeLiftPct}% uptime, payback 1-2 months.`,
        ai_recommendation: 'implement_fleet_management',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: DRONE_DELIVERY_ROUTE_OPTIMIZATION_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDroneDeliveryRouteOptimization && (!d.has_drone_delivery_route_optimization || d.avg_drone_delivery_time_minutes > config.maxDroneDeliveryTimeMinutes)) {
      const timeGap = Math.max(d.avg_drone_delivery_time_minutes - config.maxDroneDeliveryTimeMinutes, 0);
      const expectedSpeedLift = Math.round(d.drone_delivery_volume_monthly * (timeGap / d.avg_drone_delivery_time_minutes) * d.drone_delivery_revenue_per_delivery * 0.3);
      const expectedBatterySavings = Math.round(d.drone_fleet_size * 150);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedSpeedLift + expectedBatterySavings + expectedSatisfactionLift + expectedCompetitiveLift, 1600);
      const severityLabel = d.avg_drone_delivery_time_minutes > 10 ? 'high' : 'medium';
      const criticalNote = (d.avg_drone_delivery_time_minutes > 10)
        ? `HIGH: NO AERIAL ROUTE OPTIMIZATION — drone delivery time ${d.avg_drone_delivery_time_minutes}min (max ${config.maxDroneDeliveryTimeMinutes}min); route efficiency ${d.drone_route_efficiency_score}/100; ground delivery ${d.avg_ground_delivery_time_minutes}min; without aerial route optimization, drones are slower than potential = no speed advantage; aerial route = 3D (altitude, airspace, no-fly zones), weather-aware, battery-aware. `
        : `MEDIUM: DRONE DELIVERY TIME ABOVE TARGET — ${d.avg_drone_delivery_time_minutes}min (max ${config.maxDroneDeliveryTimeMinutes}min); optimize routes for speed. `;
      alerts.push({
        rule_id: 'drone_delivery_route_optimization_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_delivery_route_optimization: d.has_drone_delivery_route_optimization,
        avg_drone_delivery_time_minutes: d.avg_drone_delivery_time_minutes,
        avg_ground_delivery_time_minutes: d.avg_ground_delivery_time_minutes,
        drone_delivery_time_target_minutes: d.drone_delivery_time_target_minutes,
        drone_route_efficiency_score: d.drone_route_efficiency_score,
        drone_fleet_size: d.drone_fleet_size,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        drone_delivery_revenue_per_delivery: d.drone_delivery_revenue_per_delivery,
        drone_delivery_customer_satisfaction_score: d.drone_delivery_customer_satisfaction_score,
        competitor_drone_delivery_score: d.competitor_drone_delivery_score,
        monthly_revenue: d.monthly_revenue,
        delivery_speed_lift_projected_pct: targetSpeedLiftPct,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE DELIVERY ROUTE OPTIMIZATION ABSENT: ${d.location_id} — aerial route optimization ${d.has_drone_delivery_route_optimization ? 'present' : 'ABSENT'}; drone delivery time ${d.avg_drone_delivery_time_minutes}min (max ${config.maxDroneDeliveryTimeMinutes}min, target ${d.drone_delivery_time_target_minutes}min); ground delivery ${d.avg_ground_delivery_time_minutes}min; route efficiency ${d.drone_route_efficiency_score}/100; fleet ${d.drone_fleet_size} drones; volume ${d.drone_delivery_volume_monthly}/mo; revenue/delivery ${fmt$(d.drone_delivery_revenue_per_delivery)}; satisfaction ${d.drone_delivery_customer_satisfaction_score}/100; competitor ${d.competitor_drone_delivery_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: aerial route optimization = 3D routing (altitude, airspace, no-fly zones), weather-aware (avoid wind, rain), battery-aware (route length vs battery life), multi-stop optimization (multiple deliveries per flight), dynamic re-routing (real-time traffic, weather changes); without aerial route optimization, drones are slower than potential (10-15min vs 3-5min target) = no speed advantage over ground delivery; aerial route optimization types = point-to-point (single delivery), multi-stop (multiple deliveries per flight), hub-and-spoke (drone hub to multiple drop points), swarm (multiple drones coordinated); aerial route optimization platforms = Wing proprietary, AirMap, Unifly, custom; aerial route optimization cost = $200-800/month (software + algorithms); aerial route optimization ROI = $5-10 per $1 (speed lift + battery savings + satisfaction). Solutions ranked by impact: (1) OPTIMIZE aerial routes — speed lift ${fmt$(expectedSpeedLift)}/mo + battery savings ${fmt$(expectedBatterySavings)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(400)}/mo (software); payback 1-2 months; (2) IMPLEMENT 3D routing (altitude, airspace, no-fly zones); (3) IMPLEMENT weather-aware routing (avoid wind, rain); (4) IMPLEMENT battery-aware routing (route length vs battery life); (5) IMPLEMENT multi-stop optimization (multiple deliveries per flight); (6) IMPLEMENT dynamic re-routing (real-time traffic, weather); (7) TARGET delivery time under ${config.maxDroneDeliveryTimeMinutes}min; (8) TRACK route efficiency (target 80+); (9) BENCHMARK vs competitor drone delivery speed. Industry data: 3-5 min delivery target; payback 1-2 months. Expected impact: +${targetSpeedLiftPct}% speed, +10pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'optimize_aerial_routes',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: DRONE_REGULATORY_COMPLIANCE_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDroneRegulatoryCompliance && (!d.has_drone_regulatory_compliance || d.regulatory_compliance_score < config.minRegulatoryComplianceScore || !d.faa_part_135_certified || !d.laanc_authorized)) {
      const complianceGap = Math.max(config.minRegulatoryComplianceScore - d.regulatory_compliance_score, 0);
      const expectedLegalProtection = Math.round(baselineRevenue * 0.02);
      const expectedOperationalContinuity = Math.round(baselineRevenue * 0.015);
      const expectedExpansionCapability = Math.round(baselineRevenue * 0.02);
      const expectedFineAvoidance = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedLegalProtection + expectedOperationalContinuity + expectedExpansionCapability + expectedFineAvoidance, 2000);
      const severityLabel = !d.faa_part_135_certified ? 'critical' : d.regulatory_compliance_score < 70 ? 'high' : 'medium';
      const criticalNote = (!d.faa_part_135_certified)
        ? `CRITICAL: NO FAA PART 135 CERTIFICATION — without Part 135, commercial BVLOS drone delivery is ILLEGAL; FAA fines = $10,000-50,000 per violation; regulatory compliance score ${d.regulatory_compliance_score}/100 (min ${config.minRegulatoryComplianceScore}); LAANC ${d.laanc_authorized ? 'authorized' : 'NOT authorized'}; BVLOS ${d.bvlos_authorized ? 'authorized' : 'NOT authorized'}; without compliance, drone operations are grounded or illegal. `
        : `HIGH: REGULATORY COMPLIANCE BELOW TARGET — score ${d.regulatory_compliance_score}/100 (min ${config.minRegulatoryComplianceScore}); LAANC ${d.laanc_authorized ? 'yes' : 'NO'}; BVLOS ${d.bvlos_authorized ? 'yes' : 'NO'}; achieve full compliance for operational continuity + expansion. `;
      alerts.push({
        rule_id: 'drone_regulatory_compliance_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_regulatory_compliance: d.has_drone_regulatory_compliance,
        faa_part_135_certified: d.faa_part_135_certified,
        laanc_authorized: d.laanc_authorized,
        bvlos_authorized: d.bvlos_authorized,
        regulatory_compliance_score: d.regulatory_compliance_score,
        drone_fleet_size: d.drone_fleet_size,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        competitor_drone_delivery_score: d.competitor_drone_delivery_score,
        monthly_revenue: d.monthly_revenue,
        regulatory_compliance_cost_monthly: d.regulatory_compliance_cost_monthly,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE REGULATORY COMPLIANCE ABSENT: ${d.location_id} — regulatory compliance ${d.has_drone_regulatory_compliance ? 'present' : 'ABSENT'}; FAA Part 135 ${d.faa_part_135_certified ? 'certified' : 'NOT certified'}; LAANC ${d.laanc_authorized ? 'authorized' : 'NOT authorized'}; BVLOS ${d.bvlos_authorized ? 'authorized' : 'NOT authorized'}; compliance score ${d.regulatory_compliance_score}/100 (min ${config.minRegulatoryComplianceScore}); fleet ${d.drone_fleet_size} drones; volume ${d.drone_delivery_volume_monthly}/mo; competitor ${d.competitor_drone_delivery_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: FAA Part 135 certification required for commercial BVLOS (beyond visual line of sight) drone delivery; without Part 135, commercial drone delivery is ILLEGAL; FAA fines = $10,000-50,000 per violation; FAA Part 135 = air carrier certification (stringent — ops manual, safety management, pilot training, aircraft maintenance); LAANC (Low Altitude Authorization and Notification Capability) = real-time airspace authorization (required for controlled airspace); BVLOS (beyond visual line of sight) authorization = required for delivery beyond operator visual range; regulatory compliance components = Part 135 certification, LAANC authorization, BVLOS waiver, remote ID compliance, pilot certification (Part 107), aircraft registration, ops manual, safety management system, incident reporting, insurance; regulatory compliance cost = $5,000-20,000 setup (certification) + $200-600/month (compliance management); regulatory compliance ROI = risk avoidance ($10k-50k fines) + operational continuity + expansion capability. Solutions ranked by impact: (1) ACHIEVE regulatory compliance — legal protection ${fmt$(expectedLegalProtection)}/mo + operational continuity ${fmt$(expectedOperationalContinuity)}/mo + expansion ${fmt$(expectedExpansionCapability)}/mo + fine avoidance ${fmt$(expectedFineAvoidance)}/mo; cost ${fmt$(d.regulatory_compliance_cost_monthly || 400)}/mo; payback immediate (risk avoidance); (2) OBTAIN FAA Part 135 certification (ops manual, safety management, pilot training, maintenance); (3) OBTAIN LAANC authorization (real-time airspace); (4) OBTAIN BVLOS waiver (beyond visual line of sight); (5) IMPLEMENT remote ID (FAA requirement); (6) CERTIFY pilots (Part 107); (7) REGISTER aircraft (FAA); (8) CREATE ops manual (standard operating procedures); (9) IMPLEMENT safety management system (SMS); (10) IMPLEMENT incident reporting; (11) OBTAIN insurance (drone liability); (12) TRACK compliance score (target ${config.minRegulatoryComplianceScore}+); (13) BENCHMARK vs competitor compliance. Industry data: $10k-50k FAA fines; Part 135 required for BVLOS; payback immediate. Expected impact: +legal protection, +operational continuity, payback immediate.`,
        ai_recommendation: 'achieve_regulatory_compliance',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: DRONE_WEATHER_ADAPTATION_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDroneWeatherAdaptation && (!d.has_drone_weather_adaptation || d.weather_cancellation_rate_pct > config.maxWeatherCancellationRatePct)) {
      const cancelGap = Math.max(d.weather_cancellation_rate_pct - config.maxWeatherCancellationRatePct, 0);
      const expectedCancellationReduction = Math.round(d.drone_delivery_volume_monthly * (cancelGap / 100) * d.drone_delivery_revenue_per_delivery);
      const expectedSafetyLift = Math.round(baselineRevenue * 0.01);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedCancellationReduction + expectedSafetyLift + expectedSatisfactionLift + expectedCompetitiveLift, 1400);
      const severityLabel = d.weather_cancellation_rate_pct > 25 ? 'high' : 'medium';
      const criticalNote = (d.weather_cancellation_rate_pct > 25)
        ? `HIGH: NO WEATHER ADAPTATION — cancellation rate ${d.weather_cancellation_rate_pct}% (max ${config.maxWeatherCancellationRatePct}%); wind monitoring ${d.wind_speed_monitoring ? 'yes' : 'NO'}; rain monitoring ${d.rain_monitoring ? 'yes' : 'NO'}; drones cannot fly in high wind (>25 mph), heavy rain, snow, fog; without weather adaptation, high cancellations = lost revenue + customer frustration. `
        : `MEDIUM: WEATHER CANCELLATIONS ABOVE TARGET — ${d.weather_cancellation_rate_pct}% (max ${config.maxWeatherCancellationRatePct}%); implement weather adaptation. `;
      alerts.push({
        rule_id: 'drone_weather_adaptation_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_weather_adaptation: d.has_drone_weather_adaptation,
        weather_cancellation_rate_pct: d.weather_cancellation_rate_pct,
        weather_cancellation_target_pct: d.weather_cancellation_target_pct,
        wind_speed_monitoring: d.wind_speed_monitoring,
        rain_monitoring: d.rain_monitoring,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        drone_delivery_revenue_per_delivery: d.drone_delivery_revenue_per_delivery,
        drone_delivery_customer_satisfaction_score: d.drone_delivery_customer_satisfaction_score,
        competitor_drone_delivery_score: d.competitor_drone_delivery_score,
        monthly_revenue: d.monthly_revenue,
        weather_cancellation_reduction_projected_pct: targetWeatherCancelReductionPct,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE WEATHER ADAPTATION ABSENT: ${d.location_id} — weather adaptation ${d.has_drone_weather_adaptation ? 'present' : 'ABSENT'}; cancellation rate ${d.weather_cancellation_rate_pct}% (max ${config.maxWeatherCancellationRatePct}%, target ${d.weather_cancellation_target_pct}%); wind monitoring ${d.wind_speed_monitoring ? 'yes' : 'NO'}; rain monitoring ${d.rain_monitoring ? 'yes' : 'NO'}; delivery volume ${d.drone_delivery_volume_monthly}/mo; revenue/delivery ${fmt$(d.drone_delivery_revenue_per_delivery)}; satisfaction ${d.drone_delivery_customer_satisfaction_score}/100; competitor ${d.competitor_drone_delivery_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: drones cannot fly in high wind (>25 mph), heavy rain, snow, fog; weather limitation = 15-30% of drone deliveries cancelled without adaptation; weather adaptation = real-time weather monitoring (wind speed, precipitation, visibility), predictive weather (forecast-based cancellation), dynamic re-routing (avoid weather cells), ground fallback (switch to driver when weather cancels drone); weather monitoring APIs = National Weather Service, Dark Sky, WeatherAPI, OpenWeatherMap; weather adaptation cost = $100-500/month (weather APIs + monitoring); weather adaptation ROI = $5-10 per $1 (cancellation reduction + satisfaction). Solutions ranked by impact: (1) IMPLEMENT weather adaptation — cancellation reduction ${fmt$(expectedCancellationReduction)}/mo + safety ${fmt$(expectedSafetyLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(200)}/mo (weather APIs); payback 1-2 months; (2) INTEGRATE weather API (NWS, Dark Sky, WeatherAPI, OpenWeatherMap); (3) MONITOR wind speed (cancel if >25 mph); (4) MONITOR precipitation (cancel if heavy rain/snow); (5) MONITOR visibility (cancel if fog); (6) IMPLEMENT predictive cancellation (forecast-based, notify customer early); (7) IMPLEMENT dynamic re-routing (avoid weather cells); (8) IMPLEMENT ground fallback (switch to driver when weather cancels drone); (9) TRACK cancellation rate (target under ${config.maxWeatherCancellationRatePct}%); (10) BENCHMARK vs competitor weather adaptation. Industry data: 15-30% cancellations without adaptation; payback 1-2 months. Expected impact: -${targetWeatherCancelReductionPct}% cancellations, +10pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'implement_weather_adaptation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: DRONE_PAYLOAD_PACKAGING_OPTIMIZATION_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDronePayloadPackagingOptimization && (!d.has_drone_payload_packaging_optimization || d.payload_utilization_pct < config.minPayloadUtilizationPct || !d.drone_specific_packaging_present)) {
      const payloadGap = Math.max(config.minPayloadUtilizationPct - d.payload_utilization_pct, 0);
      const expectedPayloadLift = Math.round(d.drone_delivery_volume_monthly * (payloadGap / 100) * d.drone_delivery_revenue_per_delivery * 0.5);
      const expectedFoodQualityLift = Math.round(baselineRevenue * 0.01);
      const expectedCostReduction = Math.round(d.drone_fleet_size * 100);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedPayloadLift + expectedFoodQualityLift + expectedCostReduction + expectedSatisfactionLift, 1200);
      const severityLabel = d.payload_utilization_pct < 50 ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO PAYLOAD/PACKAGING OPTIMIZATION — max payload ${d.max_drone_payload_lbs}lbs, avg payload ${d.avg_drone_payload_lbs}lbs, utilization ${d.payload_utilization_pct}% (min ${config.minPayloadUtilizationPct}%); drone-specific packaging ${d.drone_specific_packaging_present ? 'present' : 'ABSENT'}; without payload optimization, drones carry less than capacity = wasted flights; without drone-specific packaging, food may be damaged during flight (wind, temperature). `;
      alerts.push({
        rule_id: 'drone_payload_packaging_optimization_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_payload_packaging_optimization: d.has_drone_payload_packaging_optimization,
        max_drone_payload_lbs: d.max_drone_payload_lbs,
        avg_drone_payload_lbs: d.avg_drone_payload_lbs,
        payload_utilization_pct: d.payload_utilization_pct,
        drone_specific_packaging_present: d.drone_specific_packaging_present,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        drone_delivery_revenue_per_delivery: d.drone_delivery_revenue_per_delivery,
        drone_fleet_size: d.drone_fleet_size,
        drone_delivery_customer_satisfaction_score: d.drone_delivery_customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        payload_utilization_lift_projected_pts: targetPayloadUtilLiftPts,
        satisfaction_lift_projected_pts: 8,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE PAYLOAD/PACKAGING OPTIMIZATION ABSENT: ${d.location_id} — payload optimization ${d.has_drone_payload_packaging_optimization ? 'present' : 'ABSENT'}; max payload ${d.max_drone_payload_lbs}lbs, avg ${d.avg_drone_payload_lbs}lbs, utilization ${d.payload_utilization_pct}% (min ${config.minPayloadUtilizationPct}%); drone-specific packaging ${d.drone_specific_packaging_present ? 'present' : 'ABSENT'}; volume ${d.drone_delivery_volume_monthly}/mo; revenue/delivery ${fmt$(d.drone_delivery_revenue_per_delivery)}; fleet ${d.drone_fleet_size}; satisfaction ${d.drone_delivery_customer_satisfaction_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: drone payload = 2-5 lbs (limited by drone capacity); without payload optimization, drones carry less than capacity = wasted flights (more deliveries needed = higher cost); payload optimization = batch orders (multiple items per flight), weight distribution (balanced payload), temperature control (insulated packaging for hot/cold food); drone-specific packaging = lightweight (reduce payload weight), aerodynamic (reduce wind resistance), insulated (maintain food temperature during flight), secure (prevent spillage during flight maneuvers), vented (prevent condensation); drone-specific packaging cost = $0.50-2.00 per order (vs $0.30-1.00 standard); payload optimization ROI = $3-8 per $1 (payload lift + food quality + cost reduction). Solutions ranked by impact: (1) OPTIMIZE payload/packaging — payload lift ${fmt$(expectedPayloadLift)}/mo + food quality ${fmt$(expectedFoodQualityLift)}/mo + cost reduction ${fmt$(expectedCostReduction)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo; cost ${fmt$(300)}/mo (packaging); payback 1-2 months; (2) OPTIMIZE payload utilization (target ${config.minPayloadUtilizationPct}%+); (3) BATCH orders (multiple items per flight); (4) DISTRIBUTE weight (balanced payload); (5) DESIGN drone-specific packaging (lightweight, aerodynamic, insulated, secure, vented); (6) TEST food temperature after flight (maintain quality); (7) TEST food integrity after flight (no spillage); (8) TRACK payload utilization per flight; (9) BENCHMARK vs competitor payload optimization. Industry data: 2-5 lbs payload; 70%+ utilization target; payback 1-2 months. Expected impact: +${targetPayloadUtilLiftPts}pts payload utilization, +8pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'optimize_payload_packaging',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: DRONE_BATTERY_CHARGING_INFRASTRUCTURE_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDroneBatteryChargingInfrastructure && (!d.has_drone_battery_charging_infrastructure || d.drone_uptime_pct < config.minDroneUptimePct || d.charging_stations_count < d.drone_fleet_size)) {
      const uptimeGap = Math.max(config.minDroneUptimePct - d.drone_uptime_pct, 0);
      const expectedUptimeLift = Math.round(d.drone_delivery_volume_monthly * (uptimeGap / 100) * d.drone_delivery_revenue_per_delivery);
      const expectedFleetExpansion = Math.round(baselineRevenue * 0.015);
      const expectedBatteryReplacementSavings = Math.round(d.drone_fleet_size * 80);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedUptimeLift + expectedFleetExpansion + expectedBatteryReplacementSavings + expectedCompetitiveLift, 1400);
      const severityLabel = d.drone_uptime_pct < 80 ? 'high' : 'medium';
      const criticalNote = (d.drone_uptime_pct < 80)
        ? `HIGH: NO BATTERY/CHARGING INFRASTRUCTURE — uptime ${d.drone_uptime_pct}% (min ${config.minDroneUptimePct}%); battery life ${d.avg_battery_life_minutes}min; charging stations ${d.charging_stations_count} (fleet ${d.drone_fleet_size}); without charging infrastructure, drones are grounded waiting for charge = low uptime + limited range; battery life = 20-30 min flight time. `
        : `MEDIUM: BATTERY INFRASTRUCTURE BELOW TARGET — uptime ${d.drone_uptime_pct}% (min ${config.minDroneUptimePct}%); charging stations ${d.charging_stations_count} (fleet ${d.drone_fleet_size}); improve for uptime. `;
      alerts.push({
        rule_id: 'drone_battery_charging_infrastructure_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_battery_charging_infrastructure: d.has_drone_battery_charging_infrastructure,
        avg_battery_life_minutes: d.avg_battery_life_minutes,
        charging_stations_count: d.charging_stations_count,
        drone_uptime_pct: d.drone_uptime_pct,
        drone_uptime_target_pct: d.drone_uptime_target_pct,
        drone_fleet_size: d.drone_fleet_size,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        drone_delivery_revenue_per_delivery: d.drone_delivery_revenue_per_delivery,
        competitor_drone_delivery_score: d.competitor_drone_delivery_score,
        monthly_revenue: d.monthly_revenue,
        charging_infrastructure_cost: d.charging_infrastructure_cost,
        uptime_lift_projected_pct: targetUptimeLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE BATTERY/CHARGING INFRASTRUCTURE ABSENT: ${d.location_id} — battery infrastructure ${d.has_drone_battery_charging_infrastructure ? 'present' : 'ABSENT'}; battery life ${d.avg_battery_life_minutes}min; charging stations ${d.charging_stations_count} (fleet ${d.drone_fleet_size} drones); uptime ${d.drone_uptime_pct}% (min ${config.minDroneUptimePct}%, target ${d.drone_uptime_target_pct}%); volume ${d.drone_delivery_volume_monthly}/mo; revenue/delivery ${fmt$(d.drone_delivery_revenue_per_delivery)}; competitor ${d.competitor_drone_delivery_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: drone battery = 20-30 min flight time (10-15 miles round trip); without charging infrastructure, drones are grounded waiting for charge = low uptime (50-70% vs 90%+ target); battery charging infrastructure = on-site charging stations (at restaurant), charging hub (centralized), battery swap (instant swap vs 30-60 min charge), fast charging (30 min full charge), solar charging (off-grid); charging station cost = $2,000-8,000 per station (hardware + installation); charging stations needed = 1 per drone (minimum); battery management = charge cycles (track for replacement), battery health monitoring (capacity degradation), temperature control (prevent overheating); battery replacement = $500-2,000 per battery (every 300-500 charge cycles); battery/charging ROI = $5-10 per $1 (uptime lift + fleet expansion + battery savings). Solutions ranked by impact: (1) BUILD battery/charging infrastructure — uptime lift ${fmt$(expectedUptimeLift)}/mo + fleet expansion ${fmt$(expectedFleetExpansion)}/mo + battery savings ${fmt$(expectedBatteryReplacementSavings)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.charging_infrastructure_cost || 10000)} setup; payback 2-4 months; (2) INSTALL charging stations (1 per drone minimum); (3) IMPLEMENT fast charging (30 min full charge); (4) CONSIDER battery swap (instant swap); (5) IMPLEMENT battery management (charge cycles, health monitoring); (6) IMPLEMENT temperature control (prevent overheating); (7) TRACK uptime (target ${config.minDroneUptimePct}%+); (8) TRACK battery health (capacity degradation); (9) PLAN battery replacement schedule (300-500 cycles); (10) BENCHMARK vs competitor battery infrastructure. Industry data: 20-30 min battery life; 90%+ uptime target; payback 2-4 months. Expected impact: +${targetUptimeLiftPct}% uptime, payback 2-4 months.`,
        ai_recommendation: 'build_battery_charging_infra',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: DRONE_DELIVERY_ROI_TRACKING_ABSENT
    if (d.has_drone_delivery_strategy && config.requireDroneDeliveryRoiTracking && !d.has_drone_delivery_roi_tracking) {
      const expectedRoiRecovery = Math.round((d.drone_delivery_revenue_monthly - d.drone_delivery_cost_monthly) * 0.20);
      const expectedFleetOptimization = Math.round(d.drone_fleet_investment * 0.001);
      const expectedWastedSpendRecovery = Math.round(d.drone_fleet_investment * 0.0005);
      const expectedScalingLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedFleetOptimization + expectedWastedSpendRecovery + expectedScalingLift, 1000);
      const severityLabel = d.drone_fleet_investment > 50000 ? 'medium' : 'low';
      const criticalNote = (d.drone_fleet_investment > 50000)
        ? `MEDIUM: NO DRONE DELIVERY ROI TRACKING — investment ${fmt$(d.drone_fleet_investment)} but no ROI tracking; without tracking, can't identify which drone operations drive revenue = wasted 15-20% of investment; drone ROI tracking = cost per delivery, revenue per delivery, ROAS, fleet utilization, uptime. `
        : `LOW: NO DRONE DELIVERY ROI TRACKING — implement tracking to optimize fleet investment. `;
      alerts.push({
        rule_id: 'drone_delivery_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_drone_delivery_roi_tracking: d.has_drone_delivery_roi_tracking,
        drone_fleet_investment: d.drone_fleet_investment,
        drone_delivery_cost_per_delivery: d.drone_delivery_cost_per_delivery,
        ground_delivery_cost_per_delivery: d.ground_delivery_cost_per_delivery,
        drone_delivery_revenue_monthly: d.drone_delivery_revenue_monthly,
        drone_delivery_cost_monthly: d.drone_delivery_cost_monthly,
        drone_delivery_roas: d.drone_delivery_roas,
        drone_delivery_revenue_per_delivery: d.drone_delivery_revenue_per_delivery,
        drone_delivery_volume_monthly: d.drone_delivery_volume_monthly,
        drone_fleet_size: d.drone_fleet_size,
        drone_fleet_utilization_pct: d.drone_fleet_utilization_pct,
        monthly_revenue: d.monthly_revenue,
        drone_subscription_cost_monthly: d.drone_subscription_cost_monthly,
        roi_lift_projected_pct: targetRoiLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRONE DELIVERY ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_drone_delivery_roi_tracking ? 'present' : 'ABSENT'}; investment ${fmt$(d.drone_fleet_investment)}; cost/delivery ${fmt$(d.drone_delivery_cost_per_delivery)} (ground ${fmt$(d.ground_delivery_cost_per_delivery)}); revenue ${fmt$(d.drone_delivery_revenue_monthly)}/mo; cost ${fmt$(d.drone_delivery_cost_monthly)}/mo; ROAS ${d.drone_delivery_roas}x; revenue/delivery ${fmt$(d.drone_delivery_revenue_per_delivery)}; volume ${d.drone_delivery_volume_monthly}/mo; fleet ${d.drone_fleet_size} drones (utilization ${d.drone_fleet_utilization_pct}%); monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: without ROI tracking, restaurants waste 15-20% of drone investment on underperforming operations; drone delivery ROI tracking = cost per delivery (drone vs ground), revenue per delivery, ROAS (revenue / cost), fleet utilization, uptime, delivery time, customer satisfaction; ROI tracking tools = fleet management platform (per-drone metrics), POS integration (revenue attribution), delivery management (cost tracking); ROI metrics = ROAS (target ${config.minDroneDeliveryRoas}x+), cost per delivery (target $1-3 vs $5-10 ground), delivery time (target under ${config.maxDroneDeliveryTimeMinutes}min), utilization (target ${config.minDroneFleetUtilizationPct}%+), uptime (target ${config.minDroneUptimePct}%+); ROI tracking best practice = track per drone weekly, audit fleet quarterly (replace underperformers, scale winners). Solutions ranked by impact: (1) IMPLEMENT ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + fleet optimization ${fmt$(expectedFleetOptimization)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + scaling ${fmt$(expectedScalingLift)}/mo; cost ${fmt$(200)}/mo (analytics); payback immediate; (2) INTEGRATE fleet management platform (per-drone metrics); (3) INTEGRATE POS (revenue attribution); (4) INTEGRATE delivery management (cost tracking); (5) TRACK ROAS (target ${config.minDroneDeliveryRoas}x+); (6) TRACK cost per delivery (target $1-3); (7) TRACK revenue per delivery; (8) TRACK fleet utilization (target ${config.minDroneFleetUtilizationPct}%+); (9) TRACK uptime (target ${config.minDroneUptimePct}%+); (10) AUDIT fleet quarterly (replace underperformers); (11) BENCHMARK vs competitor drone ROI. Industry data: 15-20% wasted investment without tracking; payback immediate. Expected impact: +${targetRoiLiftPct}% ROI, +${fmt$(expectedRoiRecovery)}/mo ROI recovery, payback immediate.`,
        ai_recommendation: 'implement_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM drone_delivery_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE drone_delivery_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant drone delivery and autonomous aerial logistics expert. Given drone delivery data, recommend ONE specific action with expected cost per delivery reduction, delivery speed lift, delivery radius lift, fleet utilization lift, or ROI lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Drone strategy: ${a.has_drone_delivery_strategy ?? false} (platform: ${a.drone_delivery_platform ?? 'none'}, fleet ${a.drone_fleet_size ?? 0}/${a.drone_fleet_target_size ?? 4} target). Fleet management: ${a.has_drone_fleet_management ?? false} (utilization ${a.drone_fleet_utilization_pct ?? 0}%/${config.minDroneFleetUtilizationPct}% min, uptime ${a.drone_uptime_pct ?? 0}%/${config.minDroneUptimePct}% min). Route optimization: ${a.has_drone_delivery_route_optimization ?? false} (drone time ${a.avg_drone_delivery_time_minutes ?? 0}min/${config.maxDroneDeliveryTimeMinutes}min max, ground ${a.avg_ground_delivery_time_minutes ?? 0}min, efficiency ${a.drone_route_efficiency_score ?? 0}/100). Regulatory: ${a.has_drone_regulatory_compliance ?? false} (Part 135 ${a.faa_part_135_certified ?? false}, LAANC ${a.laanc_authorized ?? false}, BVLOS ${a.bvlos_authorized ?? false}, score ${a.regulatory_compliance_score ?? 0}/${config.minRegulatoryComplianceScore} min). Weather: ${a.has_drone_weather_adaptation ?? false} (cancellation ${a.weather_cancellation_rate_pct ?? 0}%/${config.maxWeatherCancellationRatePct}% max, wind ${a.wind_speed_monitoring ?? false}, rain ${a.rain_monitoring ?? false}). Payload: ${a.has_drone_payload_packaging_optimization ?? false} (max ${a.max_drone_payload_lbs ?? 0}lbs, avg ${a.avg_drone_payload_lbs ?? 0}lbs, utilization ${a.payload_utilization_pct ?? 0}%/${config.minPayloadUtilizationPct}% min, drone packaging ${a.drone_specific_packaging_present ?? false}). Battery: ${a.has_drone_battery_charging_infrastructure ?? false} (battery life ${a.avg_battery_life_minutes ?? 0}min, stations ${a.charging_stations_count ?? 0}, uptime ${a.drone_uptime_pct ?? 0}%/${config.minDroneUptimePct}% min). ROI: ${a.has_drone_delivery_roi_tracking ?? false} (investment ${fmt$(a.drone_fleet_investment ?? 0)}, cost/delivery ${fmt$(a.drone_delivery_cost_per_delivery ?? 0)}/${fmt$(a.ground_delivery_cost_per_delivery ?? 0)} ground, revenue ${fmt$(a.drone_delivery_revenue_monthly ?? 0)}/mo, cost ${fmt$(a.drone_delivery_cost_monthly ?? 0)}/mo, ROAS ${a.drone_delivery_roas ?? 0}x, revenue/delivery ${fmt$(a.drone_delivery_revenue_per_delivery ?? 0)}, volume ${a.drone_delivery_volume_monthly ?? 0}/mo). Radius: drone ${a.drone_delivery_radius_miles ?? 0}mi vs ground ${a.ground_delivery_radius_miles ?? 0}mi. Satisfaction: drone ${a.drone_delivery_customer_satisfaction_score ?? 0}/100, ground ${a.ground_delivery_customer_satisfaction_score ?? 0}/100. Premium willingness: ${a.drone_premium_willingness_pct ?? 0}%. Competitor: ${a.competitor_drone_delivery_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Total deliveries: ${a.total_deliveries_monthly ?? 0}/mo. Fleet investment: ${fmt$(a.drone_fleet_investment ?? 0)}. Subscription: ${fmt$(a.drone_subscription_cost_monthly ?? 0)}/mo. Regulatory cost: ${fmt$(a.regulatory_compliance_cost_monthly ?? 0)}/mo. Charging infra: ${fmt$(a.charging_infrastructure_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveDroneDeliveryAlerts = async (db: ReturnType<typeof useDB>): Promise<DroneDeliveryAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM drone_delivery_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getDroneDeliverySummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  droneDeliveryStrategyAbsentCount: number;
  droneFleetManagementAbsentCount: number;
  droneDeliveryRouteOptimizationAbsentCount: number;
  droneRegulatoryComplianceAbsentCount: number;
  droneWeatherAdaptationAbsentCount: number;
  dronePayloadPackagingOptimizationAbsentCount: number;
  droneBatteryChargingInfrastructureAbsentCount: number;
  droneDeliveryRoiTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'drone_delivery_strategy_absent') AS nostrategy,
              math::count(rule_id = 'drone_fleet_management_absent') AS nofleet,
              math::count(rule_id = 'drone_delivery_route_optimization_absent') AS noroute,
              math::count(rule_id = 'drone_regulatory_compliance_absent') AS noregulatory,
              math::count(rule_id = 'drone_weather_adaptation_absent') AS noweather,
              math::count(rule_id = 'drone_payload_packaging_optimization_absent') AS nopayload,
              math::count(rule_id = 'drone_battery_charging_infrastructure_absent') AS nobattery,
              math::count(rule_id = 'drone_delivery_roi_tracking_absent') AS noroi
       FROM drone_delivery_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      droneDeliveryStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      droneFleetManagementAbsentCount: safeNumber(r.nofleet, 0),
      droneDeliveryRouteOptimizationAbsentCount: safeNumber(r.noroute, 0),
      droneRegulatoryComplianceAbsentCount: safeNumber(r.noregulatory, 0),
      droneWeatherAdaptationAbsentCount: safeNumber(r.noweather, 0),
      dronePayloadPackagingOptimizationAbsentCount: safeNumber(r.nopayload, 0),
      droneBatteryChargingInfrastructureAbsentCount: safeNumber(r.nobattery, 0),
      droneDeliveryRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, droneDeliveryStrategyAbsentCount: 0, droneFleetManagementAbsentCount: 0, droneDeliveryRouteOptimizationAbsentCount: 0, droneRegulatoryComplianceAbsentCount: 0, droneWeatherAdaptationAbsentCount: 0, dronePayloadPackagingOptimizationAbsentCount: 0, droneBatteryChargingInfrastructureAbsentCount: 0, droneDeliveryRoiTrackingAbsentCount: 0 };
  }
};

export const updateDroneDeliveryAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
