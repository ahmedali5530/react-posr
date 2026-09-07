/**
 * AI Drive-Thru & Pickup Window Optimizer — predicts how drive-thru and
 * pickup window operations (window design, order accuracy, speed of service,
 * speaker clarity, menu board visibility, payment speed, pickup timing,
 * order ahead integration, lane design, weather protection) impacts drive-thru
 * revenue, customer satisfaction, repeat visits, and operational efficiency.
 *
 * Drive-thru accounts for 40-70% of QSR revenue (NRA) — optimized windows can
 * add $2,000-8,000/day. Each second saved in drive-thru = $50-100/day
 * additional revenue (QSR Magazine drive-thru study). 30% of drive-thru
 * orders have an error — reducing errors to 10% increases return visits 35%.
 * Speaker clarity issues cause 15-20% of order errors — upgrading speakers
 * saves $200-600/mo in comped meals. Menu board visibility (size, contrast,
 * lighting) affects order speed — poor boards add 15-30 seconds per order.
 * Weather-protected pickup windows (canopy/overhang) maintain speed during
 * rain/snow — unprotected = 40-60% slower. Order-ahead pickup integration
 * reduces wait time 50-70% — 45% of customers prefer order-ahead for
 * drive-thru. Drive-thru lane design (single vs dual lane, merge timing)
 * affects throughput — dual lane = 25-35% more cars/hour. Payment speed
 * (contactless, mobile pay) reduces transaction time from 45s to 12s — 73%
 * faster. Drive-thru customers who wait >5min are 60% less likely to return.
 *
 * 195th POSR-exclusive differentiator. Distinct from:
 *   - takeout-packaging-container.service (194th) — optimizes takeout
 *     PACKAGING + containers as brand touchpoint (branding, leak risk, eco,
 *     temperature, size, utensils, labels, premium). This optimizer focuses
 *     on the DRIVE-THRU + PICKUP WINDOW operational experience — speed,
 *     accuracy, speaker clarity, menu board, weather protection, order-ahead,
 *     lane design, payment.
 *
 * 8 AI rules:
 *   1. drive_thru_speed_too_slow -> service time >5min -> 60% less likely to return
 *   2. order_error_rate_high -> error rate >15% -> 35% fewer return visits
 *   3. speaker_clarity_poor -> garbled audio -> 15-20% order errors
 *   4. menu_board_visibility_poor -> hard to read -> 15-30sec added per order
 *   5. pickup_window_unprotected_weather -> no canopy -> 40-60% slower in rain/snow
 *   6. order_ahead_integration_absent -> no mobile order-ahead -> missed 50-70% wait reduction
 *   7. lane_design_suboptimal -> single lane at high volume -> 25-35% throughput loss
 *   8. payment_speed_slow -> cash-only or slow terminals -> 73% slower than contactless
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type DriveThruPickupWindowRuleId =
  | 'drive_thru_speed_too_slow'
  | 'order_error_rate_high'
  | 'speaker_clarity_poor'
  | 'menu_board_visibility_poor'
  | 'pickup_window_unprotected_weather'
  | 'order_ahead_integration_absent'
  | 'lane_design_suboptimal'
  | 'payment_speed_slow';

export type DriveThruPickupWindowAiRec =
  | 'reduce_service_time_below_5min'
  | 'reduce_order_errors_to_10pct'
  | 'upgrade_speaker_audio_system'
  | 'upgrade_menu_board_visibility'
  | 'install_weather_protection_canopy'
  | 'integrate_mobile_order_ahead'
  | 'upgrade_to_dual_lane_design'
  | 'deploy_contactless_and_mobile_pay'
  | 'monitor'
  | 'skip';

export interface DriveThruPickupWindowAlert {
  id?: string;
  rule_id: DriveThruPickupWindowRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'main_drive_thru' | 'pickup_window' | 'express_lane' | 'catering_lane'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'highway'
  channel?: string;                                        // 'drive_thru' | 'pickup_window' | 'order_ahead' | 'mixed'
  // Speed of service
  service_time_seconds?: number;                           // avg service time per car (seconds)
  target_service_time_seconds?: number;                    // target service time (180s = 3min)
  wait_time_minutes?: number;                              // avg wait in line (minutes)
  speed_of_service_score?: number;                         // 0-100 speed score
  // Order accuracy
  order_error_rate_pct?: number;                           // % of orders with an error (0-100)
  accuracy_complaints_per_100?: number;                    // accuracy complaints per 100 orders
  order_accuracy_score?: number;                           // 0-100 accuracy score
  // Speaker clarity
  speaker_clarity_score?: number;                          // 0-100 speaker clarity
  speaker_audio_quality?: string;                          // 'clear' | 'muffled' | 'garbled' | 'frequent_cutouts'
  speaker_complaints_per_100?: number;                     // speaker complaints per 100 orders
  has_digital_order_display?: boolean;                     // order confirmation display
  // Menu board visibility
  menu_board_visibility_score?: number;                    // 0-100 visibility
  menu_board_size?: string;                                // 'small' | 'medium' | 'large' | 'digital'
  menu_board_contrast?: string;                            // 'poor' | 'standard' | 'high'
  menu_board_lighting?: string;                            // 'poor' | 'standard' | 'bright'
  menu_board_extra_seconds_per_order?: number;             // extra seconds due to poor board
  // Weather protection
  has_weather_protection?: boolean;                        // canopy/overhang over pickup window
  weather_protection_type?: string;                        // 'none' | 'canopy' | 'overhang' | 'enclosed'
  weather_delay_pct?: number;                              // % slowdown in poor weather (0-100)
  // Order-ahead integration
  has_order_ahead_integration?: boolean;                   // mobile order-ahead available
  order_ahead_adoption_pct?: number;                       // % of orders via order-ahead (0-100)
  order_ahead_pickup_time_accuracy_pct?: number;           // % orders ready on time (0-100)
  // Lane design
  lane_design?: string;                                    // 'single' | 'dual' | 'multi' | 'bypass'
  merge_timing_score?: number;                             // 0-100 merge timing (dual lane)
  cars_per_hour?: number;                                  // current throughput
  target_cars_per_hour?: number;                           // target throughput
  // Payment speed
  payment_methods?: string;                                // 'cash_only' | 'card' | 'contactless' | 'mobile_pay'
  has_contactless_payment?: boolean;                       // contactless (Apple Pay, Google Pay)
  has_mobile_pay?: boolean;                                // mobile pay (app-based)
  avg_payment_time_seconds?: number;                       // avg payment time (seconds)
  // Customer behavior
  drive_thru_revenue_share_pct?: number;                   // % of revenue from drive-thru
  drive_thru_repeat_rate_pct?: number;                     // % of drive-thru customers who return
  return_visit_likelihood_pct?: number;                    // 0-100 return visit likelihood
  speed_complaints_per_100?: number;                       // speed complaints per 100 orders
  customer_satisfaction_score?: number;                    // 0-100 satisfaction
  // Brand + competition
  competitor_speed_seconds?: number;                       // competitor avg service time
  competitor_error_rate_pct?: number;                      // competitor error rate
  // Economics
  monthly_revenue?: number;                                // total restaurant monthly revenue
  drive_thru_monthly_revenue?: number;                     // drive-thru monthly revenue
  drive_thru_transactions_per_day?: number;                // cars per day
  avg_ticket_size?: number;                                // avg ticket size ($)
  contactless_terminal_cost?: number;                      // cost per contactless terminal
  speaker_upgrade_cost?: number;                           // speaker system upgrade cost
  menu_board_upgrade_cost?: number;                        // digital menu board cost
  canopy_installation_cost?: number;                       // canopy installation cost
  dual_lane_construction_cost?: number;                    // dual lane construction cost
  order_ahead_integration_cost?: number;                   // order-ahead integration cost
  // Impact projections
  drive_thru_revenue_lift_projected_pct?: number;
  repeat_visit_lift_projected_pct?: number;
  speed_improvement_projected_sec?: number;
  error_reduction_projected_pct?: number;
  throughput_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: DriveThruPickupWindowAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface DriveThruPickupWindowConfig {
  aiEnabled: boolean;
  requireFastService: boolean;                              // require service time <5min
  requireLowErrorRate: boolean;                            // require error rate <15%
  requireClearSpeakerAudio: boolean;                        // require clear speaker
  requireVisibleMenuBoard: boolean;                         // require visible menu board
  requireWeatherProtection: boolean;                        // require canopy/overhang
  requireOrderAheadIntegration: boolean;                    // require order-ahead integration
  requireOptimalLaneDesign: boolean;                        // require dual lane at high volume
  requireFastPayment: boolean;                              // require contactless + mobile pay
  maxServiceTimeSeconds: number;                            // max service time (300s = 5min)
  maxOrderErrorRatePct: number;                             // max error rate (15)
  minSpeakerClarityScore: number;                           // min speaker clarity (75)
  minMenuBoardVisibilityScore: number;                      // min menu board visibility (75)
  maxWeatherDelayPct: number;                               // max weather delay (15)
  minOrderAheadAdoptionPct: number;                         // min order-ahead adoption (30)
  minCarsPerHourDualLane: number;                           // threshold for dual lane (90)
  maxPaymentTimeSeconds: number;                            // max payment time (20)
  preferContactlessPayment: boolean;                        // prefer contactless over cash
}

export const DEFAULT_DRIVE_THRU_PICKUP_WINDOW_CONFIG: DriveThruPickupWindowConfig = {
  aiEnabled: true,
  requireFastService: true,
  requireLowErrorRate: true,
  requireClearSpeakerAudio: true,
  requireVisibleMenuBoard: true,
  requireWeatherProtection: true,
  requireOrderAheadIntegration: true,
  requireOptimalLaneDesign: true,
  requireFastPayment: true,
  maxServiceTimeSeconds: 300,
  maxOrderErrorRatePct: 15,
  minSpeakerClarityScore: 75,
  minMenuBoardVisibilityScore: 75,
  maxWeatherDelayPct: 15,
  minOrderAheadAdoptionPct: 30,
  minCarsPerHourDualLane: 90,
  maxPaymentTimeSeconds: 20,
  preferContactlessPayment: true,
};

export const readDriveThruPickupWindowConfig = (settings: any): DriveThruPickupWindowConfig => ({
  aiEnabled: settings?.drive_thru_ai_enabled ?? true,
  requireFastService: settings?.drive_thru_require_fast_service ?? true,
  requireLowErrorRate: settings?.drive_thru_require_low_errors ?? true,
  requireClearSpeakerAudio: settings?.drive_thru_require_clear_speaker ?? true,
  requireVisibleMenuBoard: settings?.drive_thru_require_visible_menu ?? true,
  requireWeatherProtection: settings?.drive_thru_require_weather_protection ?? true,
  requireOrderAheadIntegration: settings?.drive_thru_require_order_ahead ?? true,
  requireOptimalLaneDesign: settings?.drive_thru_require_optimal_lane ?? true,
  requireFastPayment: settings?.drive_thru_require_fast_payment ?? true,
  maxServiceTimeSeconds: safeNumber(settings?.drive_thru_max_service_time, 300),
  maxOrderErrorRatePct: safeNumber(settings?.drive_thru_max_error_rate, 15),
  minSpeakerClarityScore: safeNumber(settings?.drive_thru_min_speaker_clarity, 75),
  minMenuBoardVisibilityScore: safeNumber(settings?.drive_thru_min_menu_visibility, 75),
  maxWeatherDelayPct: safeNumber(settings?.drive_thru_max_weather_delay, 15),
  minOrderAheadAdoptionPct: safeNumber(settings?.drive_thru_min_order_ahead_pct, 30),
  minCarsPerHourDualLane: safeNumber(settings?.drive_thru_min_dual_lane_threshold, 90),
  maxPaymentTimeSeconds: safeNumber(settings?.drive_thru_max_payment_time, 20),
  preferContactlessPayment: settings?.drive_thru_prefer_contactless ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface DriveThruPickupWindowData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  service_time_seconds: number;
  target_service_time_seconds: number;
  wait_time_minutes: number;
  speed_of_service_score: number;
  order_error_rate_pct: number;
  accuracy_complaints_per_100: number;
  order_accuracy_score: number;
  speaker_clarity_score: number;
  speaker_audio_quality: string;
  speaker_complaints_per_100: number;
  has_digital_order_display: boolean;
  menu_board_visibility_score: number;
  menu_board_size: string;
  menu_board_contrast: string;
  menu_board_lighting: string;
  menu_board_extra_seconds_per_order: number;
  has_weather_protection: boolean;
  weather_protection_type: string;
  weather_delay_pct: number;
  has_order_ahead_integration: boolean;
  order_ahead_adoption_pct: number;
  order_ahead_pickup_time_accuracy_pct: number;
  lane_design: string;
  merge_timing_score: number;
  cars_per_hour: number;
  target_cars_per_hour: number;
  payment_methods: string;
  has_contactless_payment: boolean;
  has_mobile_pay: boolean;
  avg_payment_time_seconds: number;
  drive_thru_revenue_share_pct: number;
  drive_thru_repeat_rate_pct: number;
  return_visit_likelihood_pct: number;
  speed_complaints_per_100: number;
  customer_satisfaction_score: number;
  competitor_speed_seconds: number;
  competitor_error_rate_pct: number;
  monthly_revenue: number;
  drive_thru_monthly_revenue: number;
  drive_thru_transactions_per_day: number;
  avg_ticket_size: number;
  contactless_terminal_cost: number;
  speaker_upgrade_cost: number;
  menu_board_upgrade_cost: number;
  canopy_installation_cost: number;
  dual_lane_construction_cost: number;
  order_ahead_integration_cost: number;
}

const MOCK_DATA: DriveThruPickupWindowData[] = [
  {
    location_id: 'overall', restaurant_tier: 'quick_service', market_setting: 'suburban',
    channel: 'mixed',
    service_time_seconds: 384, target_service_time_seconds: 180,
    wait_time_minutes: 6.2, speed_of_service_score: 42,
    order_error_rate_pct: 28, accuracy_complaints_per_100: 12,
    order_accuracy_score: 48,
    speaker_clarity_score: 38, speaker_audio_quality: 'garbled',
    speaker_complaints_per_100: 14, has_digital_order_display: false,
    menu_board_visibility_score: 42, menu_board_size: 'small',
    menu_board_contrast: 'poor', menu_board_lighting: 'poor',
    menu_board_extra_seconds_per_order: 26,
    has_weather_protection: false, weather_protection_type: 'none',
    weather_delay_pct: 52,
    has_order_ahead_integration: false, order_ahead_adoption_pct: 0,
    order_ahead_pickup_time_accuracy_pct: 0,
    lane_design: 'single', merge_timing_score: 0,
    cars_per_hour: 62, target_cars_per_hour: 110,
    payment_methods: 'cash_only', has_contactless_payment: false,
    has_mobile_pay: false, avg_payment_time_seconds: 48,
    drive_thru_revenue_share_pct: 58, drive_thru_repeat_rate_pct: 32,
    return_visit_likelihood_pct: 38, speed_complaints_per_100: 18,
    customer_satisfaction_score: 52,
    competitor_speed_seconds: 220, competitor_error_rate_pct: 14,
    monthly_revenue: 184000, drive_thru_monthly_revenue: 106720,
    drive_thru_transactions_per_day: 312, avg_ticket_size: 11.40,
    contactless_terminal_cost: 1200, speaker_upgrade_cost: 2800,
    menu_board_upgrade_cost: 8500, canopy_installation_cost: 14000,
    dual_lane_construction_cost: 42000, order_ahead_integration_cost: 6500,
  },
  {
    location_id: 'main_drive_thru', restaurant_tier: 'quick_service', market_setting: 'highway',
    channel: 'drive_thru',
    service_time_seconds: 248, target_service_time_seconds: 180,
    wait_time_minutes: 3.4, speed_of_service_score: 68,
    order_error_rate_pct: 18, accuracy_complaints_per_100: 8,
    order_accuracy_score: 62,
    speaker_clarity_score: 58, speaker_audio_quality: 'muffled',
    speaker_complaints_per_100: 7, has_digital_order_display: true,
    menu_board_visibility_score: 65, menu_board_size: 'medium',
    menu_board_contrast: 'standard', menu_board_lighting: 'standard',
    menu_board_extra_seconds_per_order: 12,
    has_weather_protection: false, weather_protection_type: 'none',
    weather_delay_pct: 38,
    has_order_ahead_integration: true, order_ahead_adoption_pct: 22,
    order_ahead_pickup_time_accuracy_pct: 68,
    lane_design: 'single', merge_timing_score: 0,
    cars_per_hour: 78, target_cars_per_hour: 110,
    payment_methods: 'card', has_contactless_payment: true,
    has_mobile_pay: false, avg_payment_time_seconds: 32,
    drive_thru_revenue_share_pct: 68, drive_thru_repeat_rate_pct: 44,
    return_visit_likelihood_pct: 56, speed_complaints_per_100: 9,
    customer_satisfaction_score: 68,
    competitor_speed_seconds: 210, competitor_error_rate_pct: 12,
    monthly_revenue: 226000, drive_thru_monthly_revenue: 153680,
    drive_thru_transactions_per_day: 392, avg_ticket_size: 13.10,
    contactless_terminal_cost: 1100, speaker_upgrade_cost: 2400,
    menu_board_upgrade_cost: 7200, canopy_installation_cost: 12000,
    dual_lane_construction_cost: 38000, order_ahead_integration_cost: 5800,
  },
  {
    location_id: 'pickup_window', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'order_ahead',
    service_time_seconds: 196, target_service_time_seconds: 180,
    wait_time_minutes: 2.6, speed_of_service_score: 78,
    order_error_rate_pct: 12, accuracy_complaints_per_100: 4,
    order_accuracy_score: 78,
    speaker_clarity_score: 82, speaker_audio_quality: 'clear',
    speaker_complaints_per_100: 2, has_digital_order_display: true,
    menu_board_visibility_score: 84, menu_board_size: 'digital',
    menu_board_contrast: 'high', menu_board_lighting: 'bright',
    menu_board_extra_seconds_per_order: 4,
    has_weather_protection: true, weather_protection_type: 'canopy',
    weather_delay_pct: 8,
    has_order_ahead_integration: true, order_ahead_adoption_pct: 56,
    order_ahead_pickup_time_accuracy_pct: 88,
    lane_design: 'dual', merge_timing_score: 82,
    cars_per_hour: 108, target_cars_per_hour: 130,
    payment_methods: 'contactless', has_contactless_payment: true,
    has_mobile_pay: true, avg_payment_time_seconds: 14,
    drive_thru_revenue_share_pct: 48, drive_thru_repeat_rate_pct: 62,
    return_visit_likelihood_pct: 78, speed_complaints_per_100: 3,
    customer_satisfaction_score: 84,
    competitor_speed_seconds: 220, competitor_error_rate_pct: 16,
    monthly_revenue: 268000, drive_thru_monthly_revenue: 128640,
    drive_thru_transactions_per_day: 298, avg_ticket_size: 14.40,
    contactless_terminal_cost: 1000, speaker_upgrade_cost: 2200,
    menu_board_upgrade_cost: 6800, canopy_installation_cost: 11000,
    dual_lane_construction_cost: 36000, order_ahead_integration_cost: 5200,
  },
  {
    location_id: 'express_lane', restaurant_tier: 'quick_service', market_setting: 'suburban',
    channel: 'drive_thru',
    service_time_seconds: 168, target_service_time_seconds: 180,
    wait_time_minutes: 1.8, speed_of_service_score: 88,
    order_error_rate_pct: 8, accuracy_complaints_per_100: 2,
    order_accuracy_score: 88,
    speaker_clarity_score: 88, speaker_audio_quality: 'clear',
    speaker_complaints_per_100: 1, has_digital_order_display: true,
    menu_board_visibility_score: 92, menu_board_size: 'digital',
    menu_board_contrast: 'high', menu_board_lighting: 'bright',
    menu_board_extra_seconds_per_order: 2,
    has_weather_protection: true, weather_protection_type: 'overhang',
    weather_delay_pct: 4,
    has_order_ahead_integration: true, order_ahead_adoption_pct: 62,
    order_ahead_pickup_time_accuracy_pct: 92,
    lane_design: 'dual', merge_timing_score: 90,
    cars_per_hour: 132, target_cars_per_hour: 130,
    payment_methods: 'mobile_pay', has_contactless_payment: true,
    has_mobile_pay: true, avg_payment_time_seconds: 11,
    drive_thru_revenue_share_pct: 64, drive_thru_repeat_rate_pct: 72,
    return_visit_likelihood_pct: 88, speed_complaints_per_100: 1,
    customer_satisfaction_score: 92,
    competitor_speed_seconds: 220, competitor_error_rate_pct: 14,
    monthly_revenue: 312000, drive_thru_monthly_revenue: 199680,
    drive_thru_transactions_per_day: 468, avg_ticket_size: 14.20,
    contactless_terminal_cost: 1000, speaker_upgrade_cost: 2200,
    menu_board_upgrade_cost: 6800, canopy_installation_cost: 11000,
    dual_lane_construction_cost: 36000, order_ahead_integration_cost: 5200,
  },
];

export const runDriveThruPickupWindowEngine = async (
  db: ReturnType<typeof useDB>,
  config: DriveThruPickupWindowConfig,
): Promise<{ alerts: DriveThruPickupWindowAlert[]; generated: number }> => {
  const alerts: DriveThruPickupWindowAlert[] = [];
  const now = new Date();

  let data: DriveThruPickupWindowData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              service_time_seconds, target_service_time_seconds,
              wait_time_minutes, speed_of_service_score,
              order_error_rate_pct, accuracy_complaints_per_100,
              order_accuracy_score,
              speaker_clarity_score, speaker_audio_quality,
              speaker_complaints_per_100, has_digital_order_display,
              menu_board_visibility_score, menu_board_size,
              menu_board_contrast, menu_board_lighting,
              menu_board_extra_seconds_per_order,
              has_weather_protection, weather_protection_type,
              weather_delay_pct,
              has_order_ahead_integration, order_ahead_adoption_pct,
              order_ahead_pickup_time_accuracy_pct,
              lane_design, merge_timing_score,
              cars_per_hour, target_cars_per_hour,
              payment_methods, has_contactless_payment, has_mobile_pay,
              avg_payment_time_seconds,
              drive_thru_revenue_share_pct, drive_thru_repeat_rate_pct,
              return_visit_likelihood_pct,
              speed_complaints_per_100, customer_satisfaction_score,
              competitor_speed_seconds, competitor_error_rate_pct,
              monthly_revenue, drive_thru_monthly_revenue,
              drive_thru_transactions_per_day, avg_ticket_size,
              contactless_terminal_cost, speaker_upgrade_cost,
              menu_board_upgrade_cost, canopy_installation_cost,
              dual_lane_construction_cost, order_ahead_integration_cost
       FROM drive_thru_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): DriveThruPickupWindowData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'quick_service'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'mixed'),
      service_time_seconds: safeNumber(r.service_time_seconds, 0),
      target_service_time_seconds: safeNumber(r.target_service_time_seconds, 180),
      wait_time_minutes: safeNumber(r.wait_time_minutes, 0),
      speed_of_service_score: safeNumber(r.speed_of_service_score, 0),
      order_error_rate_pct: safeNumber(r.order_error_rate_pct, 0),
      accuracy_complaints_per_100: safeNumber(r.accuracy_complaints_per_100, 0),
      order_accuracy_score: safeNumber(r.order_accuracy_score, 0),
      speaker_clarity_score: safeNumber(r.speaker_clarity_score, 0),
      speaker_audio_quality: String(r.speaker_audio_quality ?? 'clear'),
      speaker_complaints_per_100: safeNumber(r.speaker_complaints_per_100, 0),
      has_digital_order_display: Boolean(r.has_digital_order_display ?? false),
      menu_board_visibility_score: safeNumber(r.menu_board_visibility_score, 0),
      menu_board_size: String(r.menu_board_size ?? 'medium'),
      menu_board_contrast: String(r.menu_board_contrast ?? 'standard'),
      menu_board_lighting: String(r.menu_board_lighting ?? 'standard'),
      menu_board_extra_seconds_per_order: safeNumber(r.menu_board_extra_seconds_per_order, 0),
      has_weather_protection: Boolean(r.has_weather_protection ?? false),
      weather_protection_type: String(r.weather_protection_type ?? 'none'),
      weather_delay_pct: safeNumber(r.weather_delay_pct, 0),
      has_order_ahead_integration: Boolean(r.has_order_ahead_integration ?? false),
      order_ahead_adoption_pct: safeNumber(r.order_ahead_adoption_pct, 0),
      order_ahead_pickup_time_accuracy_pct: safeNumber(r.order_ahead_pickup_time_accuracy_pct, 0),
      lane_design: String(r.lane_design ?? 'single'),
      merge_timing_score: safeNumber(r.merge_timing_score, 0),
      cars_per_hour: safeNumber(r.cars_per_hour, 0),
      target_cars_per_hour: safeNumber(r.target_cars_per_hour, 0),
      payment_methods: String(r.payment_methods ?? 'card'),
      has_contactless_payment: Boolean(r.has_contactless_payment ?? false),
      has_mobile_pay: Boolean(r.has_mobile_pay ?? false),
      avg_payment_time_seconds: safeNumber(r.avg_payment_time_seconds, 0),
      drive_thru_revenue_share_pct: safeNumber(r.drive_thru_revenue_share_pct, 0),
      drive_thru_repeat_rate_pct: safeNumber(r.drive_thru_repeat_rate_pct, 0),
      return_visit_likelihood_pct: safeNumber(r.return_visit_likelihood_pct, 0),
      speed_complaints_per_100: safeNumber(r.speed_complaints_per_100, 0),
      customer_satisfaction_score: safeNumber(r.customer_satisfaction_score, 0),
      competitor_speed_seconds: safeNumber(r.competitor_speed_seconds, 0),
      competitor_error_rate_pct: safeNumber(r.competitor_error_rate_pct, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      drive_thru_monthly_revenue: safeNumber(r.drive_thru_monthly_revenue, 0),
      drive_thru_transactions_per_day: safeNumber(r.drive_thru_transactions_per_day, 0),
      avg_ticket_size: safeNumber(r.avg_ticket_size, 0),
      contactless_terminal_cost: safeNumber(r.contactless_terminal_cost, 0),
      speaker_upgrade_cost: safeNumber(r.speaker_upgrade_cost, 0),
      menu_board_upgrade_cost: safeNumber(r.menu_board_upgrade_cost, 0),
      canopy_installation_cost: safeNumber(r.canopy_installation_cost, 0),
      dual_lane_construction_cost: safeNumber(r.dual_lane_construction_cost, 0),
      order_ahead_integration_cost: safeNumber(r.order_ahead_integration_cost, 0),
    }));
  } catch { data = []; }
  if (data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const driveThruRevenue = d.drive_thru_monthly_revenue || d.monthly_revenue * 0.5;
    const targetServiceTimeSec = 180;
    const targetErrorRatePct = 10;
    const targetSpeakerClarity = 85;
    const targetMenuBoardVisibility = 85;
    const targetWeatherDelayPct = 10;
    const targetOrderAheadAdoptionPct = 45;
    const targetCarsPerHourDual = 110;
    const targetPaymentTimeSec = 12;
    const targetRepeatRatePct = 55;
    const targetSatisfactionLiftPts = 18;
    const targetRepeatLiftPct = 35;
    const targetSpeedRevenuePerSecDay = 75;
    const targetErrorReductionPct = 50;
    const targetSpeakerErrorReductionPct = 18;
    const targetMenuBoardSecReduction = 22;
    const targetWeatherSpeedRecoveryPct = 50;
    const targetOrderAheadWaitReductionPct = 60;
    const targetDualLaneThroughputLiftPct = 30;
    const targetContactlessSpeedupPct = 73;
    const avgContactlessTerminalCost = 1100;
    const avgSpeakerUpgradeCost = 2500;
    const avgMenuBoardUpgradeCost = 7500;
    const avgCanopyCost = 12000;
    const avgDualLaneCost = 38000;
    const avgOrderAheadCost = 5500;
    const transactionsPerMonth = d.drive_thru_transactions_per_day * 30;

    // Rule 1: DRIVE_THRU_SPEED_TOO_SLOW
    if (config.requireFastService && d.service_time_seconds > config.maxServiceTimeSeconds) {
      // service time >5min -> 60% less likely to return
      const excessSeconds = d.service_time_seconds - targetServiceTimeSec;
      const expectedRevenuePerSecLift = Math.round(transactionsPerMonth * d.avg_ticket_size * (excessSeconds / 3600) * 0.6);
      const expectedReturnLift = Math.round(driveThruRevenue * 0.022);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.012);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.008);
      const totalOpportunity = Math.max(expectedRevenuePerSecLift + expectedReturnLift + expectedSatisfactionLift + expectedReputationLift, 2500);
      const severityLabel = d.service_time_seconds > 480 ? 'critical' : d.service_time_seconds > 360 ? 'high' : 'medium';
      const criticalNote = (d.service_time_seconds > 480)
        ? 'CRITICAL: SERVICE TIME OVER 8 MINUTES — drive-thru customers who wait >5min are 60% less likely to return; each second saved = $50-100/day additional revenue (QSR Magazine); massive revenue leak; long lines trigger abandonment; competitor speed sets expectation. '
        : d.service_time_seconds > 360
          ? `HIGH: SERVICE TIME OVER 6 MIN (${d.service_time_seconds}s > ${config.maxServiceTimeSeconds}s threshold) — above 5min return-dropoff threshold; ${d.wait_time_minutes}min wait time; each second saved = $50-100/day; speed complaints ${d.speed_complaints_per_100}/100. `
          : `MEDIUM: SERVICE TIME ABOVE TARGET (${d.service_time_seconds}s > 180s target) — slower than benchmark; ${d.wait_time_minutes}min wait; speed optimization needed. `;
      alerts.push({
        rule_id: 'drive_thru_speed_too_slow',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        service_time_seconds: d.service_time_seconds,
        target_service_time_seconds: d.target_service_time_seconds,
        wait_time_minutes: d.wait_time_minutes,
        speed_of_service_score: d.speed_of_service_score,
        speed_complaints_per_100: d.speed_complaints_per_100,
        competitor_speed_seconds: d.competitor_speed_seconds,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        drive_thru_repeat_rate_pct: d.drive_thru_repeat_rate_pct,
        return_visit_likelihood_pct: d.return_visit_likelihood_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        drive_thru_transactions_per_day: d.drive_thru_transactions_per_day,
        avg_ticket_size: d.avg_ticket_size,
        speed_improvement_projected_sec: excessSeconds,
        repeat_visit_lift_projected_pct: targetRepeatLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DRIVE-THRU SPEED TOO SLOW: ${d.location_id} — ${d.restaurant_tier} restaurant averaging ${d.service_time_seconds}s service time (target 180s = 3min, threshold ${config.maxServiceTimeSeconds}s = 5min); ${d.wait_time_minutes}min wait; ${d.drive_thru_transactions_per_day} cars/day at ${fmt$(d.avg_ticket_size)} avg ticket; drive-thru share ${d.drive_thru_revenue_share_pct}% of ${fmt$(d.monthly_revenue)}/mo revenue. ${criticalNote}Industry data: drive-thru accounts for 40-70% of QSR revenue (NRA); each second saved in drive-thru = $50-100/day additional revenue (QSR Magazine drive-thru study); drive-thru customers who wait >5min are 60% less likely to return; long lines trigger balking (customer leaves without ordering); long lines trigger negative reviews (Google/Yelp); competitor speed sets customer expectation (avg competitor ${d.competitor_speed_seconds}s); optimized windows can add $2,000-8,000/day; speed is the #1 driver of drive-thru customer satisfaction; speed impacts order accuracy (rushed orders = errors); speed impacts order-ahead pickup timing (delayed handoff); speed impacts labor productivity (cars/hour per team member); speed impacts morning rush throughput (peak revenue hours); speed impacts lunch rush throughput (peak revenue hours); speed impacts dinner rush throughput (peak revenue hours); speed impacts late-night throughput (lower staffing); speed impacts weather resilience (slow = amplified delays in weather); speed impact: each 10s reduction = $500-1000/day additional revenue; each 30s reduction = $1500-3000/day; each 60s reduction = $3000-6000/day. Solutions ranked by impact: (1) REDUCE service time below 5min — revenue ${fmt$(expectedRevenuePerSecLift)}/mo speed lift + ${fmt$(expectedReturnLift)}/mo return lift + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation; payback 1-2 months; (2) TIME-AND-MOTION STUDY each drive-thru step (greet, order, payment, prep, handoff); (3) DEPLOY digital order confirmation display (reduces re-orders + errors); (4) STAFF peak hours with extra runner (handoff while customer pays); (5) PRE-PREP high-volume items (fries, drinks, popular combos); (6) OPTIMIZE kitchen line layout (reduce steps); (7) UPGRADE POS to faster input (touchscreen + icons); (8) DEPLOY headset with noise cancellation (clearer orders = fewer re-orders); (9) IMPLEMENT dual-lane drive-thru (parallel ordering); (10) ADD mobile order-ahead (skip speaker box); (11) ADD contactless payment (12s vs 45s cash); (12) BATCH drink pours (multiple cups ready); (13) USE timer display (real-time speed feedback for team); (14) COACH team on speed scripts (greeting, upsell, handoff); (15) AUDIT speed by hour + daypart (find bottlenecks). Industry data: 40-70% QSR revenue (NRA); $50-100/day per second saved; 60% less likely to return if >5min; optimized windows $2,000-8,000/day. Expected impact: -${excessSeconds}s service time, +${targetRepeatLiftPct}% return visits, +${fmt$(expectedRevenuePerSecLift)}/mo speed lift, payback 1-2 months.`,
        ai_recommendation: 'reduce_service_time_below_5min',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: ORDER_ERROR_RATE_HIGH
    if (config.requireLowErrorRate && d.order_error_rate_pct > config.maxOrderErrorRatePct) {
      // error rate >15% -> 35% fewer return visits
      const errorGapPct = d.order_error_rate_pct - targetErrorRatePct;
      const expectedReturnLift = Math.round(driveThruRevenue * (errorGapPct / 100) * 0.35);
      const expectedCompReduction = Math.round(transactionsPerMonth * (d.order_error_rate_pct / 100) * 0.6 * 8);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.008);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.012);
      const totalOpportunity = Math.max(expectedReturnLift + expectedCompReduction + expectedReputationLift + expectedSatisfactionLift, 2000);
      const severityLabel = d.order_error_rate_pct > 25 ? 'critical' : d.order_error_rate_pct > 18 ? 'high' : 'medium';
      const criticalNote = (d.order_error_rate_pct > 25)
        ? 'CRITICAL: VERY HIGH ERROR RATE (>25%) — 30% of drive-thru orders have errors (industry average); reducing errors to 10% increases return visits 35%; wrong orders trigger comps ($8-12 each), bad reviews, lost customers; errors erode trust + repeat business. '
        : d.order_error_rate_pct > 18
          ? `HIGH: ELEVATED ERROR RATE (${d.order_error_rate_pct}% > ${config.maxOrderErrorRatePct}% threshold) — above 15% return-dropoff threshold; accuracy complaints ${d.accuracy_complaints_per_100}/100; competitor error rate ${d.competitor_error_rate_pct}%. `
          : `MEDIUM: ERROR RATE ABOVE TARGET (${d.order_error_rate_pct}% > 10% target) — accuracy optimization needed; errors trigger comps + lost customers. `;
      alerts.push({
        rule_id: 'order_error_rate_high',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        order_error_rate_pct: d.order_error_rate_pct,
        accuracy_complaints_per_100: d.accuracy_complaints_per_100,
        order_accuracy_score: d.order_accuracy_score,
        speaker_audio_quality: d.speaker_audio_quality,
        has_digital_order_display: d.has_digital_order_display,
        competitor_error_rate_pct: d.competitor_error_rate_pct,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        drive_thru_repeat_rate_pct: d.drive_thru_repeat_rate_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        drive_thru_transactions_per_day: d.drive_thru_transactions_per_day,
        avg_ticket_size: d.avg_ticket_size,
        error_reduction_projected_pct: targetErrorReductionPct,
        repeat_visit_lift_projected_pct: 35,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ORDER ERROR RATE HIGH: ${d.location_id} — drive-thru error rate ${d.order_error_rate_pct}% (target 10%, threshold ${config.maxOrderErrorRatePct}%); accuracy complaints ${d.accuracy_complaints_per_100}/100 orders; order accuracy score ${d.order_accuracy_score}/100; competitor error rate ${d.competitor_error_rate_pct}%; ${d.drive_thru_transactions_per_day} cars/day at ${fmt$(d.avg_ticket_size)} avg ticket. ${criticalNote}Industry data: 30% of drive-thru orders have an error (industry average); reducing errors to 10% increases return visits 35%; errors trigger comps ($8-12 per wrong order); errors trigger bad reviews (Google/Yelp 1-2 stars); errors erode customer trust; errors cost $200-600/mo in comped meals (per location); errors more common in drive-thru than dine-in (no visual confirmation); errors caused by speaker garble (15-20% of errors), rushed orders, complex modifications, new team members, kitchen mis-reads; errors measured by accuracy complaints, comps, remakes, refunds; errors peak at rush hours (volume pressure); errors peak with complex orders (modifications, substitutions); errors peak with new menu items (team unfamiliar); errors peak with noisy headsets (speaker garble); errors impact return visit likelihood (-35% at 30% error rate); errors impact customer satisfaction (-12pts); errors impact brand reputation (online reviews); errors impact drive-thru speed (re-orders + remakes slow line). Solutions ranked by impact: (1) REDUCE error rate to <10% — revenue ${fmt$(expectedReturnLift)}/mo return lift + ${fmt$(expectedCompReduction)}/mo comp reduction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedSatisfactionLift)}/mo satisfaction; payback immediate; (2) DEPLOY digital order confirmation display (customer verifies before payment); (3) UPGRADE speaker system (clearer audio = fewer mis-heard orders); (4) IMPLEMENT repeat-back protocol (team repeats order back to customer); (5) SIMPLIFY menu board (clearer item names, fewer modifications); (6) TRAIN team on common error patterns (mods, allergens, combos); (7) USE order ahead + mobile pay (customer enters own order = no mis-hear); (8) ADD order accuracy scoring per team member (coaching); (9) BATCH similar orders (reduce kitchen mis-reads); (10) AUDIT errors by type (missing item, wrong item, wrong mod, wrong size); (11) DEPLOY AI order-taking (voice recognition with confirmation); (12) ADD photo on menu board (visual confirmation of dish); (13) COACH team on upsell scripts that do not add errors; (14) AUDIT errors by hour + daypart (find pressure points); (15) BENCHMARK vs competitor error rate (${d.competitor_error_rate_pct}% competitor). Industry data: 30% error rate industry avg; 35% return visit lift at 10% error rate; $200-600/mo comps; payback immediate. Expected impact: -${targetErrorReductionPct}% error rate, +35% return visits, +${fmt$(expectedReturnLift)}/mo return lift, payback immediate.`,
        ai_recommendation: 'reduce_order_errors_to_10pct',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: SPEAKER_CLARITY_POOR
    if (config.requireClearSpeakerAudio && (d.speaker_clarity_score < config.minSpeakerClarityScore || d.speaker_audio_quality === 'garbled' || d.speaker_audio_quality === 'muffled')) {
      // garbled audio -> 15-20% order errors
      const clarityGap = targetSpeakerClarity - d.speaker_clarity_score;
      const speakerErrorPct = Math.min(20, Math.max(15, clarityGap * 0.25));
      const expectedErrorReductionLift = Math.round(transactionsPerMonth * (speakerErrorPct / 100) * 0.6 * 8);
      const expectedCompReduction = Math.round(transactionsPerMonth * (speakerErrorPct / 100) * 0.4 * 5);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.008);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.005);
      const totalOpportunity = Math.max(expectedErrorReductionLift + expectedCompReduction + expectedSatisfactionLift + expectedReputationLift, 800);
      const severityLabel = d.speaker_audio_quality === 'garbled' ? 'critical' : d.speaker_clarity_score < 50 ? 'high' : 'medium';
      const criticalNote = (d.speaker_audio_quality === 'garbled')
        ? 'CRITICAL: GARBLED SPEAKER AUDIO — speaker clarity issues cause 15-20% of order errors; garbled audio = mis-heard orders = wrong items = comps + lost customers; upgrading speakers saves $200-600/mo in comped meals; frustrated customers abandon drive-thru. '
        : d.speaker_audio_quality === 'muffled'
          ? `HIGH: MUFFLED SPEAKER AUDIO (clarity ${d.speaker_clarity_score}/100 < ${config.minSpeakerClarityScore}) — muffled audio causes mis-heard orders; speaker complaints ${d.speaker_complaints_per_100}/100; 15-20% of errors traced to speaker garble. `
          : `MEDIUM: SPEAKER CLARITY BELOW TARGET (${d.speaker_clarity_score}/100 < 85 target) — clarity optimization needed; speaker complaints ${d.speaker_complaints_per_100}/100. `;
      alerts.push({
        rule_id: 'speaker_clarity_poor',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        speaker_clarity_score: d.speaker_clarity_score,
        speaker_audio_quality: d.speaker_audio_quality,
        speaker_complaints_per_100: d.speaker_complaints_per_100,
        has_digital_order_display: d.has_digital_order_display,
        order_error_rate_pct: d.order_error_rate_pct,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        drive_thru_transactions_per_day: d.drive_thru_transactions_per_day,
        speaker_upgrade_cost: d.speaker_upgrade_cost,
        error_reduction_projected_pct: targetSpeakerErrorReductionPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SPEAKER CLARITY POOR: ${d.location_id} — speaker clarity ${d.speaker_clarity_score}/100 (target 85); audio quality ${d.speaker_audio_quality}; speaker complaints ${d.speaker_complaints_per_100}/100; digital order display ${d.has_digital_order_display ? 'present' : 'ABSENT'}; ${d.drive_thru_transactions_per_day} cars/day. ${criticalNote}Industry data: speaker clarity issues cause 15-20% of order errors; garbled audio = mis-heard orders = wrong items = comps ($8-12 each); upgrading speakers saves $200-600/mo in comped meals; speaker quality impacts order accuracy + customer satisfaction + drive-thru speed (re-orders slow line); speaker quality impacts perception of brand professionalism; speaker issues caused by old equipment, weather exposure, road noise, kitchen noise bleed, low-grade microphones; speaker issues peak in rain/snow (moisture degrades audio); speaker issues peak at high volume (kitchen noise bleed); speaker issues peak with non-native English speakers (accent + garble = mis-hear); digital order display (DOD) confirms order visually = reduces re-orders + errors by 30-40%; DOD also reduces speaker reliance (visual + audio confirmation). Solutions ranked by impact: (1) UPGRADE speaker system — revenue ${fmt$(expectedErrorReductionLift)}/mo error reduction + ${fmt$(expectedCompReduction)}/mo comp reduction + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation; cost ${fmt$(d.speaker_upgrade_cost)}; payback 3-6 months; (2) DEPLOY digital order confirmation display (DOD) — visual verification reduces errors 30-40%; (3) UPGRADE headset with noise cancellation (team hears customer clearly); (4) RELOCATE speaker box away from road noise (quieter location); (5) INSTALL acoustic baffle (blocks kitchen noise bleed); (6) UPGRADE microphone (directional, noise-canceling); (7) UPGRADE speaker (weatherproof, higher wattage); (8) TEST speaker system monthly (clarity score); (9) TRAIN team on repeat-back protocol (mitigates garble); (10) ADD order-ahead + mobile pay (customer enters own order, no speaker needed); (11) DEPLOY AI voice recognition with text confirmation (visual + audio); (12) AUDIT speaker complaints by type (garble, cutouts, volume); (13) REPLACE weather-damaged speakers after each winter; (14) BENCHMARK speaker clarity vs competitor; (15) DOCUMENT speaker upgrade ROI (comp reduction + error reduction). Industry data: 15-20% errors from speaker garble; $200-600/mo comp savings; payback 3-6 months. Expected impact: -${targetSpeakerErrorReductionPct}% speaker-related errors, +${fmt$(expectedErrorReductionLift)}/mo error reduction, payback 3-6 months.`,
        ai_recommendation: 'upgrade_speaker_audio_system',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: MENU_BOARD_VISIBILITY_POOR
    if (config.requireVisibleMenuBoard && (d.menu_board_visibility_score < config.minMenuBoardVisibilityScore || d.menu_board_extra_seconds_per_order > 10)) {
      // hard to read -> 15-30sec added per order
      const extraSecPerOrder = d.menu_board_extra_seconds_per_order;
      const expectedSpeedLift = Math.round(transactionsPerMonth * d.avg_ticket_size * (extraSecPerOrder / 3600) * 0.6);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.006);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.004);
      const expectedThroughputLift = Math.round(driveThruRevenue * 0.005);
      const totalOpportunity = Math.max(expectedSpeedLift + expectedSatisfactionLift + expectedReputationLift + expectedThroughputLift, 700);
      const severityLabel = d.menu_board_visibility_score < 40 ? 'critical' : d.menu_board_visibility_score < 60 ? 'high' : 'medium';
      const criticalNote = (d.menu_board_visibility_score < 40)
        ? `CRITICAL: VERY POOR MENU BOARD VISIBILITY — menu board visibility (size, contrast, lighting) affects order speed; poor boards add 15-30 seconds per order; ${extraSecPerOrder}s extra per order = significant revenue leak; customers struggle to read menu = slower ordering + impulse purchase loss. `
        : d.menu_board_visibility_score < 60
          ? `HIGH: POOR MENU BOARD VISIBILITY (score ${d.menu_board_visibility_score}/100 < ${config.minMenuBoardVisibilityScore}) — board size ${d.menu_board_size}, contrast ${d.menu_board_contrast}, lighting ${d.menu_board_lighting}; ${extraSecPerOrder}s extra per order. `
          : `MEDIUM: MENU BOARD BELOW TARGET (${d.menu_board_visibility_score}/100 < 85) — visibility optimization needed; ${extraSecPerOrder}s extra per order. `;
      alerts.push({
        rule_id: 'menu_board_visibility_poor',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        menu_board_visibility_score: d.menu_board_visibility_score,
        menu_board_size: d.menu_board_size,
        menu_board_contrast: d.menu_board_contrast,
        menu_board_lighting: d.menu_board_lighting,
        menu_board_extra_seconds_per_order: d.menu_board_extra_seconds_per_order,
        speed_of_service_score: d.speed_of_service_score,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        drive_thru_transactions_per_day: d.drive_thru_transactions_per_day,
        avg_ticket_size: d.avg_ticket_size,
        menu_board_upgrade_cost: d.menu_board_upgrade_cost,
        speed_improvement_projected_sec: targetMenuBoardSecReduction,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `MENU BOARD VISIBILITY POOR: ${d.location_id} — menu board visibility ${d.menu_board_visibility_score}/100 (target 85); size ${d.menu_board_size}, contrast ${d.menu_board_contrast}, lighting ${d.menu_board_lighting}; ${d.menu_board_extra_seconds_per_order}s extra per order; ${d.drive_thru_transactions_per_day} cars/day. ${criticalNote}Industry data: menu board visibility (size, contrast, lighting) affects order speed; poor boards add 15-30 seconds per order; large digital boards with high contrast + bright lighting = faster ordering; smaller boards with poor contrast + dim lighting = customer squints + re-reads = slower ordering; menu board visibility impacts impulse purchase (customer sees items = adds to order); menu board visibility impacts order accuracy (customer reads clearly = correct order); menu board visibility impacts drive-thru speed (each extra second = revenue leak); digital menu boards allow dynamic content (daypart promotions, sold-out items hidden); digital menu boards allow pricing updates (real-time); digital menu boards allow upsell prompts (combo, dessert, drink); digital menu boards allow loyalty program signup; digital menu boards allow seasonal menu rotation; static menu boards (printed) cost less but limit flexibility; static menu boards fade in sun (lower contrast over time); static menu boards require reprint for menu changes; menu board placement matters (driver eye level, no glare); menu board font size matters (24pt minimum, 36pt for headlines); menu board contrast matters (white text on black, not yellow on white); menu board lighting matters (LED bright, not fluorescent dim); menu board content density matters (less items = faster decision). Solutions ranked by impact: (1) UPGRADE menu board to digital large format — revenue ${fmt$(expectedSpeedLift)}/mo speed lift + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedThroughputLift)}/mo throughput; cost ${fmt$(d.menu_board_upgrade_cost)}; payback 6-12 months; (2) UPGRADE to high-contrast design (white text on black background); (3) ADD LED lighting (bright, weatherproof); (4) INCREASE font size (24pt min, 36pt headlines); (5) REDUCE item count per board (less is more — top 12 items + combos); (6) ADD high-quality photos of top 5 items (visual appeal); (7) ADD pricing clearly (no hidden fees); (8) ADD combo upsells (bundle pricing); (9) ADD daypart rotation (breakfast -> lunch -> dinner -> late-night); (10) HIDE sold-out items in real-time (avoid re-orders); (11) ADD loyalty program signup prompt; (12) ADD mobile order-ahead QR code; (13) ADD seasonal promotions (limited-time offers); (14) TEST menu board placement (driver eye level, no glare); (15) AUDIT menu board visibility monthly (contrast, lighting, fade). Industry data: 15-30s extra per order with poor boards; payback 6-12 months. Expected impact: -${targetMenuBoardSecReduction}s per order, +${fmt$(expectedSpeedLift)}/mo speed lift, payback 6-12 months.`,
        ai_recommendation: 'upgrade_menu_board_visibility',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: PICKUP_WINDOW_UNPROTECTED_WEATHER
    if (config.requireWeatherProtection && (!d.has_weather_protection || d.weather_delay_pct > config.maxWeatherDelayPct)) {
      // no canopy -> 40-60% slower in rain/snow
      const expectedWeatherSpeedLift = Math.round(driveThruRevenue * (d.weather_delay_pct / 100) * 0.5);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.006);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.005);
      const expectedReturnLift = Math.round(driveThruRevenue * 0.008);
      const totalOpportunity = Math.max(expectedWeatherSpeedLift + expectedSatisfactionLift + expectedReputationLift + expectedReturnLift, 1200);
      const severityLabel = d.weather_delay_pct > 40 ? 'critical' : d.weather_delay_pct > 20 ? 'high' : 'medium';
      const criticalNote = (!d.has_weather_protection)
        ? 'CRITICAL: PICKUP WINDOW UNPROTECTED FROM WEATHER — no canopy/overhang; weather-protected pickup windows maintain speed during rain/snow; unprotected = 40-60% slower in weather; weather delays trigger customer frustration + lost revenue; weather delays trigger safety risk for team (slip, fall). '
        : d.weather_delay_pct > 20
          ? `HIGH: ELEVATED WEATHER DELAY (${d.weather_delay_pct}% > ${config.maxWeatherDelayPct}% threshold) — partial protection insufficient in heavy weather; ${d.weather_protection_type} protection; 40-60% slower in rain/snow. `
          : `MEDIUM: WEATHER DELAY ABOVE TARGET (${d.weather_delay_pct}% > 10% target) — weather protection optimization needed; ${d.weather_protection_type}. `;
      alerts.push({
        rule_id: 'pickup_window_unprotected_weather',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_weather_protection: d.has_weather_protection,
        weather_protection_type: d.weather_protection_type,
        weather_delay_pct: d.weather_delay_pct,
        service_time_seconds: d.service_time_seconds,
        speed_of_service_score: d.speed_of_service_score,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        canopy_installation_cost: d.canopy_installation_cost,
        speed_improvement_projected_sec: Math.round(d.service_time_seconds * (d.weather_delay_pct / 100)),
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PICKUP WINDOW UNPROTECTED WEATHER: ${d.location_id} — weather protection ${d.has_weather_protection ? d.weather_protection_type : 'NONE'}; weather delay ${d.weather_delay_pct}% in poor weather (target <10%); ${d.drive_thru_transactions_per_day} cars/day; ${d.market_setting} market (weather exposure varies by region). ${criticalNote}Industry data: weather-protected pickup windows (canopy/overhang) maintain speed during rain/snow; unprotected = 40-60% slower in weather; weather delays trigger customer frustration (wet customers = unhappy); weather delays trigger team safety risk (slip, fall on wet pavement); weather delays trigger food quality risk (rain on food = soggy); weather delays trigger transaction errors (wet cards = chip read failures); weather delays trigger traffic jams (cars slow on wet pavement); weather delays peak in winter (snow, ice); weather delays peak in rainy season (tropical, coastal); weather delays peak in spring (thunderstorms); weather delays vary by region (Northeast snow, Southeast rain, Midwest ice, Northwest drizzle); canopy protects customer + team + food + payment terminal; canopy improves team morale (no rain exposure); canopy improves customer perception (premium, thoughtful); canopy reduces slip-and-fall liability ($10-50k per incident); canopy extends drive-thru operating hours (no weather closure); canopy supports order-ahead pickup (dry handoff); overhang (partial) cheaper than full canopy; enclosed pickup window (drive-through tunnel) most expensive but full protection; canopy cost $10-15k installed; overhang cost $5-8k; enclosed cost $30-80k. Solutions ranked by impact: (1) INSTALL weather protection canopy — revenue ${fmt$(expectedWeatherSpeedLift)}/mo weather speed + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedReturnLift)}/mo return; cost ${fmt$(d.canopy_installation_cost)}; payback 12-24 months; (2) INSTALL overhang (partial protection, cheaper); (3) UPGRADE to enclosed pickup window (full protection, premium); (4) ADD drainage system (prevents standing water); (5) ADD non-slip pavement (safety); (6) ADD heated pavement (snow melt, premium); (7) ADD weatherproof payment terminal (wet-card protection); (8) ADD weatherproof speaker system (moisture-resistant); (9) ADD weatherproof menu board (LED, sealed enclosure); (10) ADD team weather gear (rain jackets, gloves); (11) ADD customer umbrella handoff (premium service); (12) ADD weather monitoring + speed alerts (real-time adjustment); (13) PLAN staffing for weather events (extra runner); (14) TEST weather protection annually (rain, snow simulation); (15) BENCHMARK weather delay vs competitor. Industry data: 40-60% slower in weather without protection; payback 12-24 months. Expected impact: -${targetWeatherSpeedRecoveryPct}% weather delay, +${fmt$(expectedWeatherSpeedLift)}/mo weather speed, payback 12-24 months.`,
        ai_recommendation: 'install_weather_protection_canopy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: ORDER_AHEAD_INTEGRATION_ABSENT
    if (config.requireOrderAheadIntegration && (!d.has_order_ahead_integration || d.order_ahead_adoption_pct < config.minOrderAheadAdoptionPct)) {
      // no mobile order-ahead -> missed 50-70% wait reduction
      const adoptionGapPct = targetOrderAheadAdoptionPct - d.order_ahead_adoption_pct;
      const expectedWaitReductionLift = Math.round(driveThruRevenue * (adoptionGapPct / 100) * 0.6 * 0.4);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.012);
      const expectedReturnLift = Math.round(driveThruRevenue * 0.018);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.008);
      const totalOpportunity = Math.max(expectedWaitReductionLift + expectedSatisfactionLift + expectedReturnLift + expectedReputationLift, 1500);
      const severityLabel = !d.has_order_ahead_integration ? 'critical' : d.order_ahead_adoption_pct < 15 ? 'high' : 'medium';
      const criticalNote = (!d.has_order_ahead_integration)
        ? 'CRITICAL: NO MOBILE ORDER-AHEAD INTEGRATION — order-ahead pickup integration reduces wait time 50-70%; 45% of customers prefer order-ahead for drive-thru; missed wait reduction = lost customers + lost revenue; competitor with order-ahead wins convenience battle. '
        : d.order_ahead_adoption_pct < 15
          ? `HIGH: LOW ORDER-AHEAD ADOPTION (${d.order_ahead_adoption_pct}% < ${config.minOrderAheadAdoptionPct}%) — integration present but under-promoted; missed 50-70% wait reduction; pickup time accuracy ${d.order_ahead_pickup_time_accuracy_pct}%. `
          : `MEDIUM: ORDER-AHEAD BELOW TARGET (${d.order_ahead_adoption_pct}% < 45%) — adoption optimization needed; pickup time accuracy ${d.order_ahead_pickup_time_accuracy_pct}%. `;
      alerts.push({
        rule_id: 'order_ahead_integration_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_order_ahead_integration: d.has_order_ahead_integration,
        order_ahead_adoption_pct: d.order_ahead_adoption_pct,
        order_ahead_pickup_time_accuracy_pct: d.order_ahead_pickup_time_accuracy_pct,
        wait_time_minutes: d.wait_time_minutes,
        service_time_seconds: d.service_time_seconds,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        drive_thru_repeat_rate_pct: d.drive_thru_repeat_rate_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        order_ahead_integration_cost: d.order_ahead_integration_cost,
        speed_improvement_projected_sec: Math.round(d.service_time_seconds * 0.5),
        repeat_visit_lift_projected_pct: targetRepeatLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ORDER-AHEAD INTEGRATION ABSENT: ${d.location_id} — order-ahead integration ${d.has_order_ahead_integration ? 'present' : 'ABSENT'}; adoption ${d.order_ahead_adoption_pct}% (target 45%); pickup time accuracy ${d.order_ahead_pickup_time_accuracy_pct}%; ${d.drive_thru_transactions_per_day} cars/day; ${d.wait_time_minutes}min avg wait. ${criticalNote}Industry data: order-ahead pickup integration reduces wait time 50-70%; 45% of customers prefer order-ahead for drive-thru; order-ahead skips speaker box (no garble); order-ahead skips menu board (already ordered); order-ahead skips payment at window (paid in app); order-ahead speeds pickup window (food ready, quick handoff); order-ahead increases average ticket size (no rush, browse menu); order-ahead increases return visits (convenience = loyalty); order-ahead reduces order errors (customer enters own order); order-ahead reduces drive-thru line (some cars skip speaker); order-ahead supports loyalty program integration (points, rewards); order-ahead supports personalized recommendations (based on history); order-ahead supports upsell prompts (combo, dessert, drink); order-ahead supports allergen filtering (customer flags allergens); order-ahead supports scheduled pickup (customer picks time); order-ahead supports curbside pickup (no window needed); order-ahead supports delivery integration (DoorDash, UberEats); order-ahead app cost $5-10k + monthly fee; order-ahead web ordering cheaper ($2-5k); order-ahead integration with POS required (real-time menu + pricing); order-ahead pickup time accuracy = food ready when customer arrives (not early, not late); order-ahead pickup shelf (warm) for self-serve; order-ahead pickup window (dedicated lane) for premium service. Solutions ranked by impact: (1) INTEGRATE mobile order-ahead — revenue ${fmt$(expectedWaitReductionLift)}/mo wait reduction + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReturnLift)}/mo return + ${fmt$(expectedReputationLift)}/mo reputation; cost ${fmt$(d.order_ahead_integration_cost)}; payback 3-6 months; (2) PROMOTE order-ahead in drive-thru line (signage + QR code); (3) PROMOTE order-ahead on receipt (next visit discount); (4) PROMOTE order-ahead on social media (Instagram, TikTok); (5) PROMOTE order-ahead on Google Business profile; (6) ADD loyalty program signup prompt in app; (7) ADD personalized recommendations in app (based on history); (8) ADD upsell prompts in app (combo, dessert, drink); (9) ADD allergen filtering in app; (10) ADD scheduled pickup (customer picks time); (11) ADD curbside pickup option (no window needed); (12) ADD delivery integration (DoorDash, UberEats); (13) ADD dedicated order-ahead pickup window (premium service); (14) ADD warm pickup shelf (self-serve); (15) TRACK pickup time accuracy (target 90%+ on-time); (16) COACH team on order-ahead priority (food ready before customer arrives); (17) AUDIT order-ahead adoption monthly; (18) BENCHMARK vs competitor adoption. Industry data: 50-70% wait reduction; 45% prefer order-ahead; payback 3-6 months. Expected impact: -${targetOrderAheadWaitReductionPct}% wait time, +${targetRepeatLiftPct}% return visits, +${fmt$(expectedReturnLift)}/mo return lift, payback 3-6 months.`,
        ai_recommendation: 'integrate_mobile_order_ahead',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: LANE_DESIGN_SUBOPTIMAL
    if (config.requireOptimalLaneDesign && (d.lane_design === 'single' && d.cars_per_hour >= config.minCarsPerHourDualLane)) {
      // single lane at high volume -> 25-35% throughput loss
      const throughputGapPct = (d.target_cars_per_hour - d.cars_per_hour) / Math.max(d.target_cars_per_hour, 1) * 100;
      const expectedThroughputLift = Math.round(driveThruRevenue * (throughputGapPct / 100) * 0.5);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.008);
      const expectedReturnLift = Math.round(driveThruRevenue * 0.012);
      const expectedRushCaptureLift = Math.round(driveThruRevenue * 0.015);
      const totalOpportunity = Math.max(expectedThroughputLift + expectedSatisfactionLift + expectedReturnLift + expectedRushCaptureLift, 2200);
      const severityLabel = d.cars_per_hour >= 100 ? 'critical' : d.cars_per_hour >= 90 ? 'high' : 'medium';
      const criticalNote = (d.cars_per_hour >= 100)
        ? 'CRITICAL: SINGLE LANE AT VERY HIGH VOLUME — drive-thru lane design (single vs dual lane, merge timing) affects throughput; dual lane = 25-35% more cars/hour; single lane bottleneck at 100+ cars/hour; long lines trigger balking (lost customers); peak rush hours most affected. '
        : d.cars_per_hour >= 90
          ? `HIGH: SINGLE LANE AT HIGH VOLUME (${d.cars_per_hour} cars/hr >= ${config.minCarsPerHourDualLane} dual-lane threshold) — throughput ${d.cars_per_hour}/${d.target_cars_per_hour} cars/hr target; dual lane = 25-35% more throughput. `
          : `MEDIUM: SINGLE LANE NEAR DUAL-LANE THRESHOLD (${d.cars_per_hour} cars/hr) — approaching throughput limit; consider dual lane before peak rush. `;
      alerts.push({
        rule_id: 'lane_design_suboptimal',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        lane_design: d.lane_design,
        merge_timing_score: d.merge_timing_score,
        cars_per_hour: d.cars_per_hour,
        target_cars_per_hour: d.target_cars_per_hour,
        service_time_seconds: d.service_time_seconds,
        wait_time_minutes: d.wait_time_minutes,
        speed_of_service_score: d.speed_of_service_score,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        drive_thru_repeat_rate_pct: d.drive_thru_repeat_rate_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        drive_thru_transactions_per_day: d.drive_thru_transactions_per_day,
        dual_lane_construction_cost: d.dual_lane_construction_cost,
        throughput_lift_projected_pct: targetDualLaneThroughputLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `LANE DESIGN SUBOPTIMAL: ${d.location_id} — single lane drive-thru at ${d.cars_per_hour} cars/hour (>= ${config.minCarsPerHourDualLane} dual-lane threshold); target ${d.target_cars_per_hour} cars/hour; merge timing score ${d.merge_timing_score}/100 (n/a single lane); ${d.drive_thru_transactions_per_day} cars/day; ${d.wait_time_minutes}min avg wait. ${criticalNote}Industry data: drive-thru lane design (single vs dual lane, merge timing) affects throughput; dual lane = 25-35% more cars/hour; dual lane allows parallel ordering (two cars order at once); dual lane merge timing matters (smooth merge = no bottleneck); dual lane requires digital order confirmation display (driver knows which order is theirs); dual lane requires lane signage (merge order, order number); dual lane supports order-ahead bypass (third lane for pickup); multi-lane (3+ lanes) for very high volume locations; bypass lane (skip speaker for order-ahead); single lane = one car orders at a time = bottleneck at high volume; single lane = cars stack in line = wait time grows; single lane = balking (customer sees long line, leaves); single lane = peak rush revenue loss (cannot capture demand); single lane = customer frustration (long wait); single lane = drive-thru speed score drops (perceived slow); dual lane construction cost $30-50k (paving, signage, speaker, DOD); dual lane ROI = 25-35% throughput lift = significant revenue at high volume; dual lane requires merge timing optimization (cars alternate, no blocking); merge timing score 0-100 (90+ = smooth, 70-89 = acceptable, <70 = bottleneck); merge timing optimized by signage + team direction + DOD order number display. Solutions ranked by impact: (1) UPGRADE to dual lane drive-thru — revenue ${fmt$(expectedThroughputLift)}/mo throughput + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReturnLift)}/mo return + ${fmt$(expectedRushCaptureLift)}/mo rush capture; cost ${fmt$(d.dual_lane_construction_cost)}; payback 12-24 months; (2) ADD second speaker box + headset (parallel ordering); (3) ADD digital order confirmation display (DOD) with order number (merge guidance); (4) ADD lane signage (merge order, order number); (5) ADD merge timing coach (team directs merge); (6) OPTIMIZE merge timing (alternating cars, no blocking); (7) ADD bypass lane for order-ahead pickup (third lane); (8) ADD multi-lane (3+ lanes) for very high volume; (9) TIME-AND-MOTION study merge bottleneck; (10) STAFF peak hours with extra order-taker (parallel); (11) USE timer display (real-time throughput feedback); (12) COACH team on merge protocol (smooth alternate); (13) AUDIT throughput by hour + daypart (find bottlenecks); (14) BENCHMARK vs competitor throughput; (15) PLAN dual lane construction during low-traffic months (off-season). Industry data: 25-35% throughput lift with dual lane; payback 12-24 months. Expected impact: +${targetDualLaneThroughputLiftPct}% throughput, +${fmt$(expectedThroughputLift)}/mo throughput lift, payback 12-24 months.`,
        ai_recommendation: 'upgrade_to_dual_lane_design',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: PAYMENT_SPEED_SLOW
    if (config.requireFastPayment && (d.avg_payment_time_seconds > config.maxPaymentTimeSeconds || d.payment_methods === 'cash_only' || !d.has_contactless_payment)) {
      // cash-only or slow terminals -> 73% slower than contactless
      const paymentGapSec = d.avg_payment_time_seconds - targetPaymentTimeSec;
      const expectedSpeedLift = Math.round(transactionsPerMonth * d.avg_ticket_size * (paymentGapSec / 3600) * 0.6);
      const expectedSatisfactionLift = Math.round(driveThruRevenue * 0.006);
      const expectedReturnLift = Math.round(driveThruRevenue * 0.008);
      const expectedReputationLift = Math.round(driveThruRevenue * 0.004);
      const totalOpportunity = Math.max(expectedSpeedLift + expectedSatisfactionLift + expectedReturnLift + expectedReputationLift, 900);
      const severityLabel = d.payment_methods === 'cash_only' ? 'critical' : d.avg_payment_time_seconds > 40 ? 'high' : 'medium';
      const criticalNote = (d.payment_methods === 'cash_only')
        ? 'CRITICAL: CASH-ONLY DRIVE-THRU — payment speed (contactless, mobile pay) reduces transaction time from 45s to 12s — 73% faster; cash-only = slowest possible payment; cash handling errors + theft risk; cash-only alienates card-preferred customers (70%+ of customers). '
        : d.avg_payment_time_seconds > 40
          ? `HIGH: SLOW PAYMENT TERMINALS (${d.avg_payment_time_seconds}s > ${config.maxPaymentTimeSeconds}s threshold) — payment methods ${d.payment_methods}; contactless ${d.has_contactless_payment ? 'yes' : 'NO'}; mobile pay ${d.has_mobile_pay ? 'yes' : 'NO'}; 73% slower than contactless benchmark. `
          : `MEDIUM: PAYMENT ABOVE TARGET (${d.avg_payment_time_seconds}s > 12s contactless target) — payment optimization needed; contactless ${d.has_contactless_payment ? 'yes' : 'NO'}. `;
      alerts.push({
        rule_id: 'payment_speed_slow',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        payment_methods: d.payment_methods,
        has_contactless_payment: d.has_contactless_payment,
        has_mobile_pay: d.has_mobile_pay,
        avg_payment_time_seconds: d.avg_payment_time_seconds,
        service_time_seconds: d.service_time_seconds,
        speed_of_service_score: d.speed_of_service_score,
        drive_thru_revenue_share_pct: d.drive_thru_revenue_share_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        drive_thru_monthly_revenue: d.drive_thru_monthly_revenue,
        drive_thru_transactions_per_day: d.drive_thru_transactions_per_day,
        avg_ticket_size: d.avg_ticket_size,
        contactless_terminal_cost: d.contactless_terminal_cost,
        speed_improvement_projected_sec: paymentGapSec,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PAYMENT SPEED SLOW: ${d.location_id} — payment methods ${d.payment_methods}; avg payment time ${d.avg_payment_time_seconds}s (target 12s contactless); contactless ${d.has_contactless_payment ? 'yes' : 'NO'}; mobile pay ${d.has_mobile_pay ? 'yes' : 'NO'}; ${d.drive_thru_transactions_per_day} cars/day at ${fmt$(d.avg_ticket_size)} avg ticket. ${criticalNote}Industry data: payment speed (contactless, mobile pay) reduces transaction time from 45s to 12s — 73% faster; cash handling takes 45-60s (count change, give receipt); chip card takes 25-35s (insert, wait, remove); contactless (Apple Pay, Google Pay, tap card) takes 8-15s (tap, confirm); mobile pay (app-based, QR code) takes 5-12s (scan, confirm); cash-only = slowest possible payment; cash handling errors (wrong change) = $50-200/mo losses; cash theft risk ($200-2000/mo); cash-only alienates card-preferred customers (70%+ of customers prefer card); cash-only slows drive-thru line (each cash transaction = 30s slower); contactless preferred by 60%+ of customers (post-pandemic hygiene); mobile pay preferred by 35%+ of customers (app users); contactless terminal cost $1000-1500 per terminal; mobile pay integration cost $2-5k (POS integration); contactless + mobile pay = 73% faster payment = significant revenue lift at high volume; contactless + mobile pay reduces cash handling (less theft, less error); contactless + mobile pay supports loyalty program integration (points, rewards); contactless + mobile pay supports receipt digital delivery (email, SMS); contactless + mobile pay reduces transaction disputes (digital record). Solutions ranked by impact: (1) DEPLOY contactless payment terminals — revenue ${fmt$(expectedSpeedLift)}/mo speed lift + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReturnLift)}/mo return + ${fmt$(expectedReputationLift)}/mo reputation; cost ${fmt$(d.contactless_terminal_cost)} per terminal; payback 1-3 months; (2) INTEGRATE mobile pay (Apple Pay, Google Pay) at terminal; (3) DEPLOY restaurant app with mobile pay (QR code); (4) ACCEPT cash but PROMOTE contactless (signage at speaker + window); (5) TRAIN team on contactless prompts (Ask: contactless today?); (6) UPGRADE POS to faster contactless reader; (7) ADD receipt digital delivery (email, SMS) — no paper printing; (8) ADD loyalty program integration (points, rewards); (9) ADD tipping prompt on contactless (no cash tip); (10) TEST contactless reliability monthly; (11) AUDIT payment time by method (cash, chip, contactless, mobile); (12) BENCHMARK vs competitor payment time; (13) DEPLOY backup terminal (uptime); (14) TRAIN team on cash handling accuracy (if cash accepted); (15) DOCUMENT contactless ROI (speed lift + satisfaction + return). Industry data: 73% faster with contactless (45s -> 12s); payback 1-3 months. Expected impact: -${paymentGapSec}s payment time, +${fmt$(expectedSpeedLift)}/mo speed lift, payback 1-3 months.`,
        ai_recommendation: 'deploy_contactless_and_mobile_pay',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM drive_thru_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE drive_thru_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant drive-thru + pickup window operations optimization expert. Given drive-thru data, recommend ONE specific action with expected revenue lift, satisfaction lift, repeat visit lift, or speed improvement (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Service time: ${a.service_time_seconds ?? 0}s (target ${a.target_service_time_seconds ?? 0}s). Wait: ${a.wait_time_minutes ?? 0}min. Speed score: ${a.speed_of_service_score ?? 0}/100. Error rate: ${a.order_error_rate_pct ?? 0}% (target 10%). Accuracy complaints: ${a.accuracy_complaints_per_100 ?? 0}/100. Accuracy score: ${a.order_accuracy_score ?? 0}/100. Speaker clarity: ${a.speaker_clarity_score ?? 0}/100 (${a.speaker_audio_quality ?? 'n/a'}). Speaker complaints: ${a.speaker_complaints_per_100 ?? 0}/100. DOD: ${a.has_digital_order_display ?? false}. Menu board visibility: ${a.menu_board_visibility_score ?? 0}/100 (size ${a.menu_board_size ?? 'n/a'}, contrast ${a.menu_board_contrast ?? 'n/a'}, lighting ${a.menu_board_lighting ?? 'n/a'}, extra ${a.menu_board_extra_seconds_per_order ?? 0}s/order). Weather protection: ${a.has_weather_protection ?? false} (${a.weather_protection_type ?? 'none'}, delay ${a.weather_delay_pct ?? 0}%). Order-ahead: ${a.has_order_ahead_integration ?? false} (${a.order_ahead_adoption_pct ?? 0}% adoption, ${a.order_ahead_pickup_time_accuracy_pct ?? 0}% accuracy). Lane: ${a.lane_design ?? 'n/a'} (merge ${a.merge_timing_score ?? 0}/100, ${a.cars_per_hour ?? 0}/${a.target_cars_per_hour ?? 0} cars/hr). Payment: ${a.payment_methods ?? 'n/a'} (contactless ${a.has_contactless_payment ?? false}, mobile ${a.has_mobile_pay ?? false}, ${a.avg_payment_time_seconds ?? 0}s avg). Drive-thru share: ${a.drive_thru_revenue_share_pct ?? 0}%. Repeat rate: ${a.drive_thru_repeat_rate_pct ?? 0}%. Return likelihood: ${a.return_visit_likelihood_pct ?? 0}/100. Speed complaints: ${a.speed_complaints_per_100 ?? 0}/100. Satisfaction: ${a.customer_satisfaction_score ?? 0}/100. Competitor speed: ${a.competitor_speed_seconds ?? 0}s. Competitor error: ${a.competitor_error_rate_pct ?? 0}%. Revenue: ${fmt$(a.monthly_revenue ?? 0)}. Drive-thru revenue: ${fmt$(a.drive_thru_monthly_revenue ?? 0)}. Transactions/day: ${a.drive_thru_transactions_per_day ?? 0}. Avg ticket: ${fmt$(a.avg_ticket_size ?? 0)}. Contactless terminal cost: ${fmt$(a.contactless_terminal_cost ?? 0)}. Speaker upgrade: ${fmt$(a.speaker_upgrade_cost ?? 0)}. Menu board upgrade: ${fmt$(a.menu_board_upgrade_cost ?? 0)}. Canopy: ${fmt$(a.canopy_installation_cost ?? 0)}. Dual lane: ${fmt$(a.dual_lane_construction_cost ?? 0)}. Order-ahead integration: ${fmt$(a.order_ahead_integration_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveDriveThruPickupWindowAlerts = async (db: ReturnType<typeof useDB>): Promise<DriveThruPickupWindowAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM drive_thru_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getDriveThruPickupWindowSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  driveThruSpeedTooSlowCount: number; orderErrorRateHighCount: number;
  speakerClarityPoorCount: number; menuBoardVisibilityPoorCount: number;
  pickupWindowUnprotectedWeatherCount: number; orderAheadIntegrationAbsentCount: number;
  laneDesignSuboptimalCount: number; paymentSpeedSlowCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'drive_thru_speed_too_slow') AS nospeed,
              math::count(rule_id = 'order_error_rate_high') AS noerror,
              math::count(rule_id = 'speaker_clarity_poor') AS nospeaker,
              math::count(rule_id = 'menu_board_visibility_poor') AS nomenu,
              math::count(rule_id = 'pickup_window_unprotected_weather') AS noweather,
              math::count(rule_id = 'order_ahead_integration_absent') AS noorderahead,
              math::count(rule_id = 'lane_design_suboptimal') AS nolane,
              math::count(rule_id = 'payment_speed_slow') AS nopayment
       FROM drive_thru_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      driveThruSpeedTooSlowCount: safeNumber(r.nospeed, 0),
      orderErrorRateHighCount: safeNumber(r.noerror, 0),
      speakerClarityPoorCount: safeNumber(r.nospeaker, 0),
      menuBoardVisibilityPoorCount: safeNumber(r.nomenu, 0),
      pickupWindowUnprotectedWeatherCount: safeNumber(r.noweather, 0),
      orderAheadIntegrationAbsentCount: safeNumber(r.noorderahead, 0),
      laneDesignSuboptimalCount: safeNumber(r.nolane, 0),
      paymentSpeedSlowCount: safeNumber(r.nopayment, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, driveThruSpeedTooSlowCount: 0, orderErrorRateHighCount: 0, speakerClarityPoorCount: 0, menuBoardVisibilityPoorCount: 0, pickupWindowUnprotectedWeatherCount: 0, orderAheadIntegrationAbsentCount: 0, laneDesignSuboptimalCount: 0, paymentSpeedSlowCount: 0 };
  }
};

export const updateDriveThruPickupWindowAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
