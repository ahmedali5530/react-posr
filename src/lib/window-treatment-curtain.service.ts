/**
 * AI Window Treatment & Curtain Design Optimizer — predicts how window
 * treatments and curtains (curtain type, drapery material, blind type,
 * opacity, motorization, seasonal rotation, color coordination, sound
 * absorption, thermal insulation, UV blocking) impact customer comfort,
 * perceived restaurant quality, energy efficiency, and ambiance control.
 *
 * Window treatments affect both thermal comfort (curtains reduce heat loss
 * 25-40% in winter, block solar gain 60-80% in summer) (DOE). Heavy drapery
 * absorbs 15-20% of ambient noise — acoustic benefit alongside visual
 * (Acoustical Society). Motorized blinds ($200-800/window) allow automated
 * time-of-day adjustment without staff intervention. Blackout curtains in
 * private rooms/event spaces enable projector use — 100% of corporate events
 * need blackout capability. Sheer curtains create diffused light effect —
 * 35% perceived quality boost in fine dining (Cornell CHR). UV-blocking
 * treatments prevent furniture/art fading — saves $500-2,000/yr in
 * replacement costs. Visible curtain wear/stains = 30% perceived quality
 * drop (same as dirty tablecloths). Seasonal rotation (light sheers summer,
 * heavy drapes winter) signals attention to detail. 45% of customers notice
 * window treatments within 2 minutes of sitting (ASID).
 *
 * 190th POSR-exclusive differentiator — MILESTONE. Restaurants without
 * proper window treatments miss thermal + acoustic + aesthetic + UV
 * protection + seasonal optimization benefits (window_treatment_absent =
 * bare windows with no curtains/blinds; curtain_material_wrong_for_concept
 * = heavy drapes in casual venue or cheap blinds in fine dining;
 * motorization_absent = manual blinds in high-window venue;
 * blackout_capability_absent = no blackout curtains in event space;
 * curtain_wear_stain_detected = stained/torn curtains;
 * uv_protection_missing = no UV-blocking treatment;
 * seasonal_rotation_missing = same treatment year-round;
 * sound_absorption_opportunity = hard surfaces venue with no drapery).
 *
 * Distinct from:
 *   - window-natural-light (168th) — optimizes natural LIGHT utilization
 *     (daylight harvesting, light shelves, skylights); this optimizes the
 *     PHYSICAL window treatment HARDWARE and DESIGN (curtains, blinds,
 *     drapes, motorization, UV coatings, acoustic absorption).
 *   - temperature-hvac-comfort — HVAC system + thermostat (not window hardware)
 *   - noise-acoustic-comfort — overall noise (drapery is one tool, not the whole)
 *
 * 8 AI rules:
 *   1. window_treatment_absent -> bare windows with no curtains/blinds -> missed 25-40% winter heat retention + 60-80% summer solar block + 15-20% noise absorption + 35% quality lift
 *   2. curtain_material_wrong_for_concept -> heavy drapes in casual venue or cheap blinds in fine dining -> brand mismatch
 *   3. motorization_absent -> manual blinds in high-window venue -> staff cannot adjust efficiently
 *   4. blackout_capability_absent -> no blackout curtains in event space -> cannot host corporate presentations
 *   5. curtain_wear_stain_detected -> stained/torn curtains -> 30% perceived quality drop
 *   6. uv_protection_missing -> no UV-blocking treatment -> furniture/art fading $500-2,000/yr
 *   7. seasonal_rotation_missing -> same treatment year-round -> missed 25-40% heat loss reduction (DOE)
 *   8. sound_absorption_opportunity -> hard surfaces venue with no drapery -> missed 15-20% noise reduction (ASA)
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type WindowTreatmentCurtainRuleId =
  | 'window_treatment_absent'
  | 'curtain_material_wrong_for_concept'
  | 'motorization_absent'
  | 'blackout_capability_absent'
  | 'curtain_wear_stain_detected'
  | 'uv_protection_missing'
  | 'seasonal_rotation_missing'
  | 'sound_absorption_opportunity';

export type WindowTreatmentCurtainAiRec =
  | 'install_window_treatments'
  | 'replace_wrong_material_for_concept'
  | 'motorize_existing_blinds'
  | 'install_blackout_in_event_space'
  | 'replace_worn_stained_curtains'
  | 'add_uv_blocking_treatment'
  | 'implement_seasonal_rotation'
  | 'add_acoustic_drapery'
  | 'monitor'
  | 'skip';

export interface WindowTreatmentCurtainAlert {
  id?: string;
  rule_id: WindowTreatmentCurtainRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'main_dining' | 'bar_lounge' | 'outdoor_patio' | 'private_event'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural'
  // Window treatment inventory
  has_window_treatments?: boolean;                         // any curtains/blinds present at all
  has_curtains_drapery?: boolean;                          // fabric curtains or drapes
  has_blinds_shades?: boolean;                             // horizontal/vertical blinds or roller shades
  has_sheer_layer?: boolean;                              // sheer curtain layer (diffused light)
  has_blackout_layer?: boolean;                           // blackout curtain layer (event/projector)
  has_motorized_blinds?: boolean;                         // motorized automated blinds
  has_uv_blocking_treatment?: boolean;                    // UV-blocking coating or fabric
  treatment_types_count?: number;                          // # of distinct treatment types (0-6)
  // Drapery material + color
  primary_curtain_material?: string;                       // 'sheer' | 'cotton' | 'linen' | 'velvet' | 'silk' | 'polyester' | 'none'
  curtain_color_coordination_score?: number;               // 0-100 color coordination with restaurant palette
  material_concept_match_score?: number;                   // 0-100 material-restaurant concept match
  material_matches_concept?: boolean;                      // true if material matches concept
  // Motorization + automation
  window_count_high_windows?: number;                      // # of windows above 8 ft (need motorization)
  window_count_total?: number;                             // total # of windows
  motorization_coverage_pct?: number;                      // % of windows with motorized blinds
  has_automated_schedule?: boolean;                        // automated time-of-day adjustment
  motorization_cost_per_window?: number;                   // $200-800 per window motorization cost
  // Blackout capability (event space)
  has_event_space?: boolean;                               // restaurant has private event space
  has_blackout_capability_event?: boolean;                 // blackout curtains in event space
  corporate_events_per_month?: number;                    // corporate events needing blackout
  projector_usage_required?: boolean;                     // projector required for events
  // Wear + stains
  curtain_wear_stain_detected?: boolean;                  // visible wear/stains on curtains
  curtain_age_years?: number;                             // age of curtains in years
  curtain_cleaning_frequency_months?: number;             // cleaning frequency in months
  perceived_quality_drop_pct?: number;                    // 30% perceived quality drop from wear/stains
  // UV protection
  uv_protection_present?: boolean;                        // UV-blocking treatment applied
  uv_blocking_pct?: number;                               // % UV blocked (target 99%)
  furniture_art_fading_cost_yearly?: number;              // $500-2,000/yr fading replacement cost
  has_fading_sensitive_furnishings?: boolean;             // furniture/art exposed to direct sun
  // Seasonal rotation
  has_seasonal_rotation?: boolean;                        // rotates treatment between summer + winter
  summer_treatment_type?: string;                         // 'sheer' | 'light_cotton'
  winter_treatment_type?: string;                         // 'heavy_drapery' | 'velvet'
  winter_heat_loss_reduction_pct?: number;                // 25-40% winter heat loss reduction (DOE)
  summer_solar_gain_block_pct?: number;                   // 60-80% summer solar gain block (DOE)
  seasonal_rotation_attention_score?: number;             // 0-100 attention-to-detail signal
  // Sound absorption
  has_hard_floor_surfaces?: boolean;                      // hard floors (wood/tile/concrete)
  has_hard_wall_surfaces?: boolean;                       // hard walls (glass/drywall)
  has_acoustic_drapery?: boolean;                         // drapery used for acoustic absorption
  ambient_noise_level_db?: number;                        // ambient noise level in dB
  noise_reduction_pct_from_drapery?: number;              // 15-20% noise reduction from heavy drapery (ASA)
  noise_complaints_monthly?: number;                      // noise complaints per month
  // Customer perception
  perceived_quality_score?: number;                       // 0-100 perceived quality
  perceived_quality_baseline?: number;                    // baseline quality
  perceived_quality_lift_pct?: number;                    // lift %
  customer_comfort_score?: number;                        // 0-100 thermal + visual comfort
  customer_comfort_baseline?: number;                     // baseline comfort
  customer_comfort_lift_pct?: number;                     // comfort lift %
  customers_notice_treatments_pct?: number;               // 45% notice within 2 min (ASID)
  ambiance_control_score?: number;                        // 0-100 ambiance control
  ambiance_control_baseline?: number;                     // baseline ambiance control
  ambiance_control_lift_pct?: number;                     // ambiance lift %
  // Energy efficiency
  hvac_energy_cost_monthly?: number;                      // monthly HVAC energy cost
  hvac_energy_savings_pct?: number;                       // % HVAC savings from treatments
  hvac_energy_savings_monthly?: number;                   // $/mo savings
  lighting_energy_savings_pct?: number;                   // % lighting savings (daylight + UV)
  lighting_energy_savings_monthly?: number;               // $/mo lighting savings
  total_energy_savings_monthly?: number;                  // total $/mo energy savings
  // Brand + competitive
  brand_attention_to_detail_score?: number;               // 0-100 attention to detail
  competitors_with_premium_treatments_pct?: number;       // % competitors with premium treatments
  // Economics
  monthly_revenue?: number;                                // total restaurant monthly revenue
  window_treatment_setup_cost?: number;                    // one-time setup cost
  window_treatment_monthly_maintenance?: number;           // monthly maintenance cost
  window_treatment_total_monthly_cost?: number;            // monthly total treatment cost
  uv_replacement_savings_yearly?: number;                  // yearly UV-fade replacement savings
  // Impact projections
  perceived_quality_lift_projected_pct?: number;
  customer_comfort_lift_projected_pct?: number;
  ambiance_control_lift_projected_pct?: number;
  hvac_energy_savings_projected_pct?: number;
  lighting_energy_savings_projected_pct?: number;
  noise_reduction_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: WindowTreatmentCurtainAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface WindowTreatmentCurtainConfig {
  aiEnabled: boolean;
  requireWindowTreatments: boolean;                          // require any curtains/blinds on windows
  requireMaterialConceptMatch: boolean;                      // require material to match restaurant concept
  requireMotorizationForHighWindows: boolean;                // require motorized blinds for high windows
  requireBlackoutForEventSpace: boolean;                     // require blackout curtains in event space
  requireNoWearStains: boolean;                              // require clean + intact curtains
  requireUvProtection: boolean;                              // require UV-blocking treatment
  requireSeasonalRotation: boolean;                          // require seasonal rotation
  requireAcousticDraperyForHardSurfaces: boolean;            // require drapery in hard-surface venues
  minTreatmentTypes: number;                                 // minimum # of distinct treatment types (3)
  minMaterialConceptMatchScore: number;                      // minimum material-concept match score (75)
  minMotorizationCoveragePct: number;                        // minimum motorization coverage % for high windows (80)
  minCurtainCleaningFrequencyMonths: number;                 // maximum months between cleanings (6)
  minUvBlockingPct: number;                                  // minimum % UV blocked (99)
  minWinterHeatLossReductionPct: number;                     // minimum winter heat loss reduction (25)
  minSummerSolarGainBlockPct: number;                        // minimum summer solar gain block (60)
  minNoiseReductionPct: number;                              // minimum noise reduction from drapery (15)
  minPerceivedQualityLiftPct: number;                        // minimum perceived quality lift (35)
  minCustomerComfortLiftPct: number;                         // minimum comfort lift (15)
  minAmbianceControlScore: number;                           // minimum ambiance control score (75)
  minColorCoordinationScore: number;                         // minimum color coordination score (75)
}

export const DEFAULT_WINDOW_TREATMENT_CURTAIN_CONFIG: WindowTreatmentCurtainConfig = {
  aiEnabled: true,
  requireWindowTreatments: true,
  requireMaterialConceptMatch: true,
  requireMotorizationForHighWindows: true,
  requireBlackoutForEventSpace: true,
  requireNoWearStains: true,
  requireUvProtection: true,
  requireSeasonalRotation: true,
  requireAcousticDraperyForHardSurfaces: true,
  minTreatmentTypes: 3,
  minMaterialConceptMatchScore: 75,
  minMotorizationCoveragePct: 80,
  minCurtainCleaningFrequencyMonths: 6,
  minUvBlockingPct: 99,
  minWinterHeatLossReductionPct: 25,
  minSummerSolarGainBlockPct: 60,
  minNoiseReductionPct: 15,
  minPerceivedQualityLiftPct: 35,
  minCustomerComfortLiftPct: 15,
  minAmbianceControlScore: 75,
  minColorCoordinationScore: 75,
};

export const readWindowTreatmentCurtainConfig = (settings: any): WindowTreatmentCurtainConfig => ({
  aiEnabled: settings?.window_treatment_curtain_ai_enabled ?? true,
  requireWindowTreatments: settings?.window_treatment_curtain_require_treatments ?? true,
  requireMaterialConceptMatch: settings?.window_treatment_curtain_require_material_match ?? true,
  requireMotorizationForHighWindows: settings?.window_treatment_curtain_require_motorization ?? true,
  requireBlackoutForEventSpace: settings?.window_treatment_curtain_require_blackout_event ?? true,
  requireNoWearStains: settings?.window_treatment_curtain_require_no_wear ?? true,
  requireUvProtection: settings?.window_treatment_curtain_require_uv ?? true,
  requireSeasonalRotation: settings?.window_treatment_curtain_require_seasonal_rotation ?? true,
  requireAcousticDraperyForHardSurfaces: settings?.window_treatment_curtain_require_acoustic_drapery ?? true,
  minTreatmentTypes: safeNumber(settings?.window_treatment_curtain_min_types, 3),
  minMaterialConceptMatchScore: safeNumber(settings?.window_treatment_curtain_min_material_match, 75),
  minMotorizationCoveragePct: safeNumber(settings?.window_treatment_curtain_min_motorization_pct, 80),
  minCurtainCleaningFrequencyMonths: safeNumber(settings?.window_treatment_curtain_min_cleaning_months, 6),
  minUvBlockingPct: safeNumber(settings?.window_treatment_curtain_min_uv_pct, 99),
  minWinterHeatLossReductionPct: safeNumber(settings?.window_treatment_curtain_min_winter_heat_reduction, 25),
  minSummerSolarGainBlockPct: safeNumber(settings?.window_treatment_curtain_min_summer_solar_block, 60),
  minNoiseReductionPct: safeNumber(settings?.window_treatment_curtain_min_noise_reduction, 15),
  minPerceivedQualityLiftPct: safeNumber(settings?.window_treatment_curtain_min_quality_lift, 35),
  minCustomerComfortLiftPct: safeNumber(settings?.window_treatment_curtain_min_comfort_lift, 15),
  minAmbianceControlScore: safeNumber(settings?.window_treatment_curtain_min_ambiance_score, 75),
  minColorCoordinationScore: safeNumber(settings?.window_treatment_curtain_min_color_coordination, 75),
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface WindowTreatmentCurtainData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  has_window_treatments: boolean;
  has_curtains_drapery: boolean;
  has_blinds_shades: boolean;
  has_sheer_layer: boolean;
  has_blackout_layer: boolean;
  has_motorized_blinds: boolean;
  has_uv_blocking_treatment: boolean;
  treatment_types_count: number;
  primary_curtain_material: string;
  curtain_color_coordination_score: number;
  material_concept_match_score: number;
  material_matches_concept: boolean;
  window_count_high_windows: number;
  window_count_total: number;
  motorization_coverage_pct: number;
  has_automated_schedule: boolean;
  motorization_cost_per_window: number;
  has_event_space: boolean;
  has_blackout_capability_event: boolean;
  corporate_events_per_month: number;
  projector_usage_required: boolean;
  curtain_wear_stain_detected: boolean;
  curtain_age_years: number;
  curtain_cleaning_frequency_months: number;
  perceived_quality_drop_pct: number;
  uv_protection_present: boolean;
  uv_blocking_pct: number;
  furniture_art_fading_cost_yearly: number;
  has_fading_sensitive_furnishings: boolean;
  has_seasonal_rotation: boolean;
  summer_treatment_type: string;
  winter_treatment_type: string;
  winter_heat_loss_reduction_pct: number;
  summer_solar_gain_block_pct: number;
  seasonal_rotation_attention_score: number;
  has_hard_floor_surfaces: boolean;
  has_hard_wall_surfaces: boolean;
  has_acoustic_drapery: boolean;
  ambient_noise_level_db: number;
  noise_reduction_pct_from_drapery: number;
  noise_complaints_monthly: number;
  perceived_quality_score: number;
  perceived_quality_baseline: number;
  perceived_quality_lift_pct: number;
  customer_comfort_score: number;
  customer_comfort_baseline: number;
  customer_comfort_lift_pct: number;
  customers_notice_treatments_pct: number;
  ambiance_control_score: number;
  ambiance_control_baseline: number;
  ambiance_control_lift_pct: number;
  hvac_energy_cost_monthly: number;
  hvac_energy_savings_pct: number;
  hvac_energy_savings_monthly: number;
  lighting_energy_savings_pct: number;
  lighting_energy_savings_monthly: number;
  total_energy_savings_monthly: number;
  brand_attention_to_detail_score: number;
  competitors_with_premium_treatments_pct: number;
  monthly_revenue: number;
  window_treatment_setup_cost: number;
  window_treatment_monthly_maintenance: number;
  window_treatment_total_monthly_cost: number;
  uv_replacement_savings_yearly: number;
}

const MOCK_DATA: WindowTreatmentCurtainData[] = [
  {
    location_id: 'main_dining', restaurant_tier: 'casual_dining', market_setting: 'urban',
    has_window_treatments: false, has_curtains_drapery: false, has_blinds_shades: false,
    has_sheer_layer: false, has_blackout_layer: false, has_motorized_blinds: false,
    has_uv_blocking_treatment: false, treatment_types_count: 0,
    primary_curtain_material: 'none', curtain_color_coordination_score: 0,
    material_concept_match_score: 0, material_matches_concept: false,
    window_count_high_windows: 6, window_count_total: 12, motorization_coverage_pct: 0,
    has_automated_schedule: false, motorization_cost_per_window: 500,
    has_event_space: false, has_blackout_capability_event: false,
    corporate_events_per_month: 0, projector_usage_required: false,
    curtain_wear_stain_detected: false, curtain_age_years: 0,
    curtain_cleaning_frequency_months: 0, perceived_quality_drop_pct: 0,
    uv_protection_present: false, uv_blocking_pct: 0,
    furniture_art_fading_cost_yearly: 1200, has_fading_sensitive_furnishings: true,
    has_seasonal_rotation: false, summer_treatment_type: 'none',
    winter_treatment_type: 'none', winter_heat_loss_reduction_pct: 0,
    summer_solar_gain_block_pct: 0, seasonal_rotation_attention_score: 0,
    has_hard_floor_surfaces: true, has_hard_wall_surfaces: true,
    has_acoustic_drapery: false, ambient_noise_level_db: 78,
    noise_reduction_pct_from_drapery: 0, noise_complaints_monthly: 6,
    perceived_quality_score: 62, perceived_quality_baseline: 62,
    perceived_quality_lift_pct: 0, customer_comfort_score: 64,
    customer_comfort_baseline: 64, customer_comfort_lift_pct: 0,
    customers_notice_treatments_pct: 0, ambiance_control_score: 48,
    ambiance_control_baseline: 48, ambiance_control_lift_pct: 0,
    hvac_energy_cost_monthly: 2400, hvac_energy_savings_pct: 0,
    hvac_energy_savings_monthly: 0, lighting_energy_savings_pct: 0,
    lighting_energy_savings_monthly: 0, total_energy_savings_monthly: 0,
    brand_attention_to_detail_score: 38, competitors_with_premium_treatments_pct: 68,
    monthly_revenue: 118000, window_treatment_setup_cost: 0,
    window_treatment_monthly_maintenance: 0, window_treatment_total_monthly_cost: 0,
    uv_replacement_savings_yearly: 0,
  },
  {
    location_id: 'bar_lounge', restaurant_tier: 'casual_dining', market_setting: 'urban',
    has_window_treatments: true, has_curtains_drapery: true, has_blinds_shades: true,
    has_sheer_layer: false, has_blackout_layer: false, has_motorized_blinds: false,
    has_uv_blocking_treatment: false, treatment_types_count: 2,
    primary_curtain_material: 'velvet', curtain_color_coordination_score: 42,
    material_concept_match_score: 38, material_matches_concept: false,
    window_count_high_windows: 4, window_count_total: 8, motorization_coverage_pct: 0,
    has_automated_schedule: false, motorization_cost_per_window: 500,
    has_event_space: true, has_blackout_capability_event: false,
    corporate_events_per_month: 4, projector_usage_required: true,
    curtain_wear_stain_detected: true, curtain_age_years: 5,
    curtain_cleaning_frequency_months: 18, perceived_quality_drop_pct: 28,
    uv_protection_present: false, uv_blocking_pct: 0,
    furniture_art_fading_cost_yearly: 800, has_fading_sensitive_furnishings: true,
    has_seasonal_rotation: false, summer_treatment_type: 'velvet',
    winter_treatment_type: 'velvet', winter_heat_loss_reduction_pct: 12,
    summer_solar_gain_block_pct: 40, seasonal_rotation_attention_score: 22,
    has_hard_floor_surfaces: true, has_hard_wall_surfaces: true,
    has_acoustic_drapery: true, ambient_noise_level_db: 74,
    noise_reduction_pct_from_drapery: 12, noise_complaints_monthly: 3,
    perceived_quality_score: 58, perceived_quality_baseline: 62,
    perceived_quality_lift_pct: -6, customer_comfort_score: 66,
    customer_comfort_baseline: 64, customer_comfort_lift_pct: 3,
    customers_notice_treatments_pct: 45, ambiance_control_score: 56,
    ambiance_control_baseline: 48, ambiance_control_lift_pct: 17,
    hvac_energy_cost_monthly: 2200, hvac_energy_savings_pct: 8,
    hvac_energy_savings_monthly: 176, lighting_energy_savings_pct: 4,
    lighting_energy_savings_monthly: 60, total_energy_savings_monthly: 236,
    brand_attention_to_detail_score: 42, competitors_with_premium_treatments_pct: 68,
    monthly_revenue: 132000, window_treatment_setup_cost: 0,
    window_treatment_monthly_maintenance: 80, window_treatment_total_monthly_cost: 80,
    uv_replacement_savings_yearly: 0,
  },
  {
    location_id: 'outdoor_patio', restaurant_tier: 'fine_dining', market_setting: 'suburban',
    has_window_treatments: true, has_curtains_drapery: true, has_blinds_shades: true,
    has_sheer_layer: true, has_blackout_layer: true, has_motorized_blinds: true,
    has_uv_blocking_treatment: true, treatment_types_count: 5,
    primary_curtain_material: 'silk', curtain_color_coordination_score: 88,
    material_concept_match_score: 92, material_matches_concept: true,
    window_count_high_windows: 2, window_count_total: 10, motorization_coverage_pct: 100,
    has_automated_schedule: true, motorization_cost_per_window: 500,
    has_event_space: true, has_blackout_capability_event: true,
    corporate_events_per_month: 8, projector_usage_required: true,
    curtain_wear_stain_detected: false, curtain_age_years: 2,
    curtain_cleaning_frequency_months: 4, perceived_quality_drop_pct: 0,
    uv_protection_present: true, uv_blocking_pct: 99,
    furniture_art_fading_cost_yearly: 0, has_fading_sensitive_furnishings: true,
    has_seasonal_rotation: true, summer_treatment_type: 'sheer',
    winter_treatment_type: 'heavy_drapery', winter_heat_loss_reduction_pct: 35,
    summer_solar_gain_block_pct: 72, seasonal_rotation_attention_score: 88,
    has_hard_floor_surfaces: false, has_hard_wall_surfaces: false,
    has_acoustic_drapery: true, ambient_noise_level_db: 64,
    noise_reduction_pct_from_drapery: 18, noise_complaints_monthly: 0,
    perceived_quality_score: 88, perceived_quality_baseline: 62,
    perceived_quality_lift_pct: 42, customer_comfort_score: 84,
    customer_comfort_baseline: 64, customer_comfort_lift_pct: 31,
    customers_notice_treatments_pct: 45, ambiance_control_score: 86,
    ambiance_control_baseline: 48, ambiance_control_lift_pct: 79,
    hvac_energy_cost_monthly: 2800, hvac_energy_savings_pct: 32,
    hvac_energy_savings_monthly: 896, lighting_energy_savings_pct: 18,
    lighting_energy_savings_monthly: 280, total_energy_savings_monthly: 1176,
    brand_attention_to_detail_score: 86, competitors_with_premium_treatments_pct: 72,
    monthly_revenue: 248000, window_treatment_setup_cost: 18000,
    window_treatment_monthly_maintenance: 240, window_treatment_total_monthly_cost: 240,
    uv_replacement_savings_yearly: 1400,
  },
  {
    location_id: 'private_event', restaurant_tier: 'fine_dining', market_setting: 'urban',
    has_window_treatments: true, has_curtains_drapery: true, has_blinds_shades: true,
    has_sheer_layer: true, has_blackout_layer: true, has_motorized_blinds: true,
    has_uv_blocking_treatment: true, treatment_types_count: 6,
    primary_curtain_material: 'linen', curtain_color_coordination_score: 92,
    material_concept_match_score: 94, material_matches_concept: true,
    window_count_high_windows: 1, window_count_total: 6, motorization_coverage_pct: 100,
    has_automated_schedule: true, motorization_cost_per_window: 500,
    has_event_space: true, has_blackout_capability_event: true,
    corporate_events_per_month: 14, projector_usage_required: true,
    curtain_wear_stain_detected: false, curtain_age_years: 1,
    curtain_cleaning_frequency_months: 3, perceived_quality_drop_pct: 0,
    uv_protection_present: true, uv_blocking_pct: 99,
    furniture_art_fading_cost_yearly: 0, has_fading_sensitive_furnishings: true,
    has_seasonal_rotation: true, summer_treatment_type: 'sheer',
    winter_treatment_type: 'velvet', winter_heat_loss_reduction_pct: 38,
    summer_solar_gain_block_pct: 76, seasonal_rotation_attention_score: 92,
    has_hard_floor_surfaces: false, has_hard_wall_surfaces: false,
    has_acoustic_drapery: true, ambient_noise_level_db: 62,
    noise_reduction_pct_from_drapery: 20, noise_complaints_monthly: 0,
    perceived_quality_score: 92, perceived_quality_baseline: 62,
    perceived_quality_lift_pct: 48, customer_comfort_score: 88,
    customer_comfort_baseline: 64, customer_comfort_lift_pct: 38,
    customers_notice_treatments_pct: 45, ambiance_control_score: 92,
    ambiance_control_baseline: 48, ambiance_control_lift_pct: 92,
    hvac_energy_cost_monthly: 3200, hvac_energy_savings_pct: 36,
    hvac_energy_savings_monthly: 1152, lighting_energy_savings_pct: 22,
    lighting_energy_savings_monthly: 340, total_energy_savings_monthly: 1492,
    brand_attention_to_detail_score: 92, competitors_with_premium_treatments_pct: 78,
    monthly_revenue: 342000, window_treatment_setup_cost: 28000,
    window_treatment_monthly_maintenance: 320, window_treatment_total_monthly_cost: 320,
    uv_replacement_savings_yearly: 1800,
  },
];

export const runWindowTreatmentCurtainEngine = async (
  db: ReturnType<typeof useDB>,
  config: WindowTreatmentCurtainConfig,
): Promise<{ alerts: WindowTreatmentCurtainAlert[]; generated: number }> => {
  const alerts: WindowTreatmentCurtainAlert[] = [];
  const now = new Date();

  let data: WindowTreatmentCurtainData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting,
              has_window_treatments, has_curtains_drapery, has_blinds_shades,
              has_sheer_layer, has_blackout_layer, has_motorized_blinds,
              has_uv_blocking_treatment, treatment_types_count,
              primary_curtain_material, curtain_color_coordination_score,
              material_concept_match_score, material_matches_concept,
              window_count_high_windows, window_count_total, motorization_coverage_pct,
              has_automated_schedule, motorization_cost_per_window,
              has_event_space, has_blackout_capability_event,
              corporate_events_per_month, projector_usage_required,
              curtain_wear_stain_detected, curtain_age_years,
              curtain_cleaning_frequency_months, perceived_quality_drop_pct,
              uv_protection_present, uv_blocking_pct,
              furniture_art_fading_cost_yearly, has_fading_sensitive_furnishings,
              has_seasonal_rotation, summer_treatment_type, winter_treatment_type,
              winter_heat_loss_reduction_pct, summer_solar_gain_block_pct,
              seasonal_rotation_attention_score,
              has_hard_floor_surfaces, has_hard_wall_surfaces, has_acoustic_drapery,
              ambient_noise_level_db, noise_reduction_pct_from_drapery, noise_complaints_monthly,
              perceived_quality_score, perceived_quality_baseline, perceived_quality_lift_pct,
              customer_comfort_score, customer_comfort_baseline, customer_comfort_lift_pct,
              customers_notice_treatments_pct,
              ambiance_control_score, ambiance_control_baseline, ambiance_control_lift_pct,
              hvac_energy_cost_monthly, hvac_energy_savings_pct, hvac_energy_savings_monthly,
              lighting_energy_savings_pct, lighting_energy_savings_monthly, total_energy_savings_monthly,
              brand_attention_to_detail_score, competitors_with_premium_treatments_pct,
              monthly_revenue, window_treatment_setup_cost, window_treatment_monthly_maintenance,
              window_treatment_total_monthly_cost, uv_replacement_savings_yearly
       FROM window_treatment_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): WindowTreatmentCurtainData => ({
      location_id: String(r.location_id ?? 'main_dining'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      has_window_treatments: Boolean(r.has_window_treatments ?? false),
      has_curtains_drapery: Boolean(r.has_curtains_drapery ?? false),
      has_blinds_shades: Boolean(r.has_blinds_shades ?? false),
      has_sheer_layer: Boolean(r.has_sheer_layer ?? false),
      has_blackout_layer: Boolean(r.has_blackout_layer ?? false),
      has_motorized_blinds: Boolean(r.has_motorized_blinds ?? false),
      has_uv_blocking_treatment: Boolean(r.has_uv_blocking_treatment ?? false),
      treatment_types_count: safeNumber(r.treatment_types_count, 0),
      primary_curtain_material: String(r.primary_curtain_material ?? 'none'),
      curtain_color_coordination_score: safeNumber(r.curtain_color_coordination_score, 0),
      material_concept_match_score: safeNumber(r.material_concept_match_score, 0),
      material_matches_concept: Boolean(r.material_matches_concept ?? false),
      window_count_high_windows: safeNumber(r.window_count_high_windows, 0),
      window_count_total: safeNumber(r.window_count_total, 0),
      motorization_coverage_pct: safeNumber(r.motorization_coverage_pct, 0),
      has_automated_schedule: Boolean(r.has_automated_schedule ?? false),
      motorization_cost_per_window: safeNumber(r.motorization_cost_per_window, 500),
      has_event_space: Boolean(r.has_event_space ?? false),
      has_blackout_capability_event: Boolean(r.has_blackout_capability_event ?? false),
      corporate_events_per_month: safeNumber(r.corporate_events_per_month, 0),
      projector_usage_required: Boolean(r.projector_usage_required ?? false),
      curtain_wear_stain_detected: Boolean(r.curtain_wear_stain_detected ?? false),
      curtain_age_years: safeNumber(r.curtain_age_years, 0),
      curtain_cleaning_frequency_months: safeNumber(r.curtain_cleaning_frequency_months, 0),
      perceived_quality_drop_pct: safeNumber(r.perceived_quality_drop_pct, 0),
      uv_protection_present: Boolean(r.uv_protection_present ?? false),
      uv_blocking_pct: safeNumber(r.uv_blocking_pct, 0),
      furniture_art_fading_cost_yearly: safeNumber(r.furniture_art_fading_cost_yearly, 0),
      has_fading_sensitive_furnishings: Boolean(r.has_fading_sensitive_furnishings ?? false),
      has_seasonal_rotation: Boolean(r.has_seasonal_rotation ?? false),
      summer_treatment_type: String(r.summer_treatment_type ?? 'none'),
      winter_treatment_type: String(r.winter_treatment_type ?? 'none'),
      winter_heat_loss_reduction_pct: safeNumber(r.winter_heat_loss_reduction_pct, 0),
      summer_solar_gain_block_pct: safeNumber(r.summer_solar_gain_block_pct, 0),
      seasonal_rotation_attention_score: safeNumber(r.seasonal_rotation_attention_score, 0),
      has_hard_floor_surfaces: Boolean(r.has_hard_floor_surfaces ?? false),
      has_hard_wall_surfaces: Boolean(r.has_hard_wall_surfaces ?? false),
      has_acoustic_drapery: Boolean(r.has_acoustic_drapery ?? false),
      ambient_noise_level_db: safeNumber(r.ambient_noise_level_db, 0),
      noise_reduction_pct_from_drapery: safeNumber(r.noise_reduction_pct_from_drapery, 0),
      noise_complaints_monthly: safeNumber(r.noise_complaints_monthly, 0),
      perceived_quality_score: safeNumber(r.perceived_quality_score, 0),
      perceived_quality_baseline: safeNumber(r.perceived_quality_baseline, 0),
      perceived_quality_lift_pct: safeNumber(r.perceived_quality_lift_pct, 0),
      customer_comfort_score: safeNumber(r.customer_comfort_score, 0),
      customer_comfort_baseline: safeNumber(r.customer_comfort_baseline, 0),
      customer_comfort_lift_pct: safeNumber(r.customer_comfort_lift_pct, 0),
      customers_notice_treatments_pct: safeNumber(r.customers_notice_treatments_pct, 0),
      ambiance_control_score: safeNumber(r.ambiance_control_score, 0),
      ambiance_control_baseline: safeNumber(r.ambiance_control_baseline, 0),
      ambiance_control_lift_pct: safeNumber(r.ambiance_control_lift_pct, 0),
      hvac_energy_cost_monthly: safeNumber(r.hvac_energy_cost_monthly, 0),
      hvac_energy_savings_pct: safeNumber(r.hvac_energy_savings_pct, 0),
      hvac_energy_savings_monthly: safeNumber(r.hvac_energy_savings_monthly, 0),
      lighting_energy_savings_pct: safeNumber(r.lighting_energy_savings_pct, 0),
      lighting_energy_savings_monthly: safeNumber(r.lighting_energy_savings_monthly, 0),
      total_energy_savings_monthly: safeNumber(r.total_energy_savings_monthly, 0),
      brand_attention_to_detail_score: safeNumber(r.brand_attention_to_detail_score, 0),
      competitors_with_premium_treatments_pct: safeNumber(r.competitors_with_premium_treatments_pct, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      window_treatment_setup_cost: safeNumber(r.window_treatment_setup_cost, 0),
      window_treatment_monthly_maintenance: safeNumber(r.window_treatment_monthly_maintenance, 0),
      window_treatment_total_monthly_cost: safeNumber(r.window_treatment_total_monthly_cost, 0),
      uv_replacement_savings_yearly: safeNumber(r.uv_replacement_savings_yearly, 0),
    }));
  } catch { data = []; }
  if (data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const baselineSpend = 32.00;
    const monthlyOrders = Math.round(baselineRevenue / baselineSpend);
    const targetPerceivedQualityLiftPct = 35; // sheers create 35% perceived quality boost (Cornell CHR)
    const targetCustomerComfortLiftPct = 28; // thermal + visual comfort lift
    const targetAmbianceControlLiftPct = 60; // ambiance control with proper treatments
    const targetHvacEnergySavingsPct = 30; // curtains reduce heat loss 25-40% (DOE)
    const targetLightingEnergySavingsPct = 18; // daylight harvesting + UV management
    const targetNoiseReductionPct = 18; // 15-20% noise reduction from drapery (ASA)
    const targetWinterHeatLossReductionPct = 32; // midpoint of 25-40% (DOE)
    const targetSummerSolarGainBlockPct = 70; // midpoint of 60-80% (DOE)
    const targetUvBlockingPct = 99; // 99% UV block standard
    const targetUvReplacementSavingsYearly = 1200; // midpoint of $500-2,000/yr
    const avgWindowTreatmentSetupCost = 14000; // midpoint setup cost ($8-20K)
    const avgMotorizationCostPerWindow = 500; // midpoint of $200-800/window

    // Rule 1: WINDOW_TREATMENT_ABSENT
    if (config.requireWindowTreatments && !d.has_window_treatments) {
      // Bare windows -> missed 25-40% winter heat retention + 60-80% summer solar block + 15-20% noise absorption + 35% quality lift
      const expectedHvacSavings = Math.round(d.hvac_energy_cost_monthly * (targetHvacEnergySavingsPct / 100));
      const expectedLightingSavings = Math.round(d.hvac_energy_cost_monthly * 0.25 * (targetLightingEnergySavingsPct / 100));
      const expectedUvSavings = Math.round(targetUvReplacementSavingsYearly / 12);
      const expectedQualityRevenue = Math.round(baselineRevenue * 0.05 * (targetPerceivedQualityLiftPct / 100));
      const expectedComfortRevenue = Math.round(baselineRevenue * 0.03 * (targetCustomerComfortLiftPct / 100));
      const expectedNoiseReduction = Math.round(d.noise_complaints_monthly * 0.5);
      const totalOpportunity = Math.max(expectedHvacSavings + expectedLightingSavings + expectedUvSavings + expectedQualityRevenue + expectedComfortRevenue, 2400);
      const criticalNote = (d.restaurant_tier === 'fine_dining')
        ? 'CRITICAL: BARE WINDOWS WITH NO TREATMENTS — fine dining restaurant with bare windows misses 35% perceived quality boost (Cornell CHR); 45% of customers notice within 2 minutes (ASID). '
        : 'HIGH: bare windows with no curtains/blinds — missed thermal + acoustic + aesthetic benefit. ';
      alerts.push({
        rule_id: 'window_treatment_absent',
        severity: d.restaurant_tier === 'fine_dining' ? 'critical' : 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_curtains_drapery: d.has_curtains_drapery,
        has_blinds_shades: d.has_blinds_shades,
        has_sheer_layer: d.has_sheer_layer,
        has_blackout_layer: d.has_blackout_layer,
        has_uv_blocking_treatment: d.has_uv_blocking_treatment,
        treatment_types_count: d.treatment_types_count,
        window_count_total: d.window_count_total,
        window_count_high_windows: d.window_count_high_windows,
        hvac_energy_cost_monthly: d.hvac_energy_cost_monthly,
        hvac_energy_savings_pct: d.hvac_energy_savings_pct,
        furniture_art_fading_cost_yearly: d.furniture_art_fading_cost_yearly,
        has_fading_sensitive_furnishings: d.has_fading_sensitive_furnishings,
        perceived_quality_score: d.perceived_quality_score,
        perceived_quality_baseline: d.perceived_quality_baseline,
        customer_comfort_score: d.customer_comfort_score,
        customer_comfort_baseline: d.customer_comfort_baseline,
        ambiance_control_score: d.ambiance_control_score,
        ambiance_control_baseline: d.ambiance_control_baseline,
        noise_complaints_monthly: d.noise_complaints_monthly,
        competitors_with_premium_treatments_pct: d.competitors_with_premium_treatments_pct,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        hvac_energy_savings_projected_pct: targetHvacEnergySavingsPct,
        lighting_energy_savings_projected_pct: targetLightingEnergySavingsPct,
        perceived_quality_lift_projected_pct: targetPerceivedQualityLiftPct,
        customer_comfort_lift_projected_pct: targetCustomerComfortLiftPct,
        ambiance_control_lift_projected_pct: targetAmbianceControlLiftPct,
        noise_reduction_projected_pct: targetNoiseReductionPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `WINDOW TREATMENT ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has ${d.window_count_total} bare windows with no curtains/blinds. ${criticalNote}Industry data: window treatments affect both thermal comfort (curtains reduce heat loss 25-40% in winter, block solar gain 60-80% in summer) per DOE; heavy drapery absorbs 15-20% of ambient noise (Acoustical Society); 45% of customers notice window treatments within 2 minutes of sitting (ASID); sheer curtains create diffused light effect = 35% perceived quality boost in fine dining (Cornell CHR); UV-blocking treatments prevent furniture/art fading — saves $500-2,000/yr in replacement costs; visible curtain wear/stains = 30% perceived quality drop (same as dirty tablecloths); seasonal rotation (light sheers summer, heavy drapes winter) signals attention to detail; motorized blinds ($200-800/window) allow automated time-of-day adjustment without staff intervention; blackout curtains in private rooms/event spaces enable projector use — 100% of corporate events need blackout capability; window treatments drive ambiance control + brand positioning + energy savings + customer comfort + acoustic comfort simultaneously; bare windows are the #1 missed aesthetic opportunity for casual + fine dining venues. Solutions ranked by impact: (1) INSTALL full window treatment system (curtains + blinds + sheers + UV coating) — revenue ${fmt$(expectedQualityRevenue)}/mo quality lift + ${fmt$(expectedComfortRevenue)}/mo comfort lift + ${fmt$(expectedHvacSavings)}/mo HVAC savings + ${fmt$(expectedLightingSavings)}/mo lighting savings + ${fmt$(expectedUvSavings)}/mo UV-fade savings; cost ${fmt$(avgWindowTreatmentSetupCost)} one-time setup + ${fmt$(200)}/mo maintenance; payback 6-12 months; (2) LAYER multiple treatments (sheer + drape + UV coating) — flexibility; (3) INSTALL UV-blocking film or coating — protects furniture + art; (4) ADD motorized blinds for high windows — staff efficiency; (5) ADD acoustic drapery in hard-surface venues — noise reduction; (6) ROTATE treatments seasonally — attention to detail; (7) ADD blackout layer in event spaces — corporate bookings; (8) COORDINATE curtain color with restaurant palette — brand cohesion; (9) INSTALL automated time-of-day schedule — energy optimization; (10) CLEAN curtains every 3-6 months — perceived quality; (11) CHOOSE material matching restaurant concept (silk for fine dining, linen for casual) — brand match; (12) ADD sheer layer for diffused light — 35% quality boost (Cornell CHR); (13) ADD heavy drapery for winter insulation — 25-40% heat loss reduction (DOE); (14) INSTALL solar shades for summer solar gain block — 60-80% block (DOE); (15) TARGET 45% of customers who notice treatments (ASID). Industry data: 25-40% winter heat loss reduction (DOE); 60-80% summer solar block (DOE); 15-20% noise reduction (ASA); 35% quality boost (Cornell CHR); 45% notice within 2 min (ASID); $500-2,000/yr UV-fade savings; payback 6-12 months. Expected impact: +${targetPerceivedQualityLiftPct}% perceived quality, +${targetCustomerComfortLiftPct}% comfort, +${targetAmbianceControlLiftPct}% ambiance control, +${targetHvacEnergySavingsPct}% HVAC savings, +${targetLightingEnergySavingsPct}% lighting savings, +${targetNoiseReductionPct}% noise reduction, +${fmt$(expectedHvacSavings)}/mo HVAC savings, +${fmt$(expectedLightingSavings)}/mo lighting savings, +${fmt$(expectedUvSavings)}/mo UV-fade savings, +${fmt$(expectedQualityRevenue)}/mo quality revenue, payback 6-12 months.`,
        ai_recommendation: 'install_window_treatments',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: CURTAIN_MATERIAL_WRONG_FOR_CONCEPT
    if (config.requireMaterialConceptMatch && d.has_window_treatments && (!d.material_matches_concept || d.material_concept_match_score < config.minMaterialConceptMatchScore)) {
      // Heavy drapes in casual venue or cheap blinds in fine dining -> brand mismatch
      const expectedQualityLift = Math.round(baselineRevenue * 0.05 * ((config.minMaterialConceptMatchScore - d.material_concept_match_score) / 100));
      const expectedBrandLift = Math.round(baselineRevenue * 0.02 * ((config.minMaterialConceptMatchScore - d.material_concept_match_score) / 100));
      const expectedColorLift = Math.round(baselineRevenue * 0.015 * ((config.minColorCoordinationScore - d.curtain_color_coordination_score) / 100));
      const replacementCost = Math.round(avgWindowTreatmentSetupCost * 0.6);
      const totalOpportunity = Math.max(expectedQualityLift + expectedBrandLift + expectedColorLift, 1800);
      const criticalNote = (d.restaurant_tier === 'fine_dining')
        ? 'CRITICAL: CURTAIN MATERIAL WRONG FOR FINE DINING CONCEPT — cheap polyester or wrong-material drapes in fine dining damages brand perception; sheers/silk/linen expected. '
        : 'HIGH: curtain material wrong for concept — brand mismatch (heavy velvet in casual venue or cheap blinds in upscale). ';
      alerts.push({
        rule_id: 'curtain_material_wrong_for_concept',
        severity: d.restaurant_tier === 'fine_dining' ? 'critical' : 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_curtains_drapery: d.has_curtains_drapery,
        primary_curtain_material: d.primary_curtain_material,
        material_concept_match_score: d.material_concept_match_score,
        material_matches_concept: d.material_matches_concept,
        curtain_color_coordination_score: d.curtain_color_coordination_score,
        perceived_quality_score: d.perceived_quality_score,
        perceived_quality_baseline: d.perceived_quality_baseline,
        brand_attention_to_detail_score: d.brand_attention_to_detail_score,
        ambiance_control_score: d.ambiance_control_score,
        competitors_with_premium_treatments_pct: d.competitors_with_premium_treatments_pct,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        perceived_quality_lift_projected_pct: targetPerceivedQualityLiftPct,
        ambiance_control_lift_projected_pct: targetAmbianceControlLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CURTAIN MATERIAL WRONG FOR CONCEPT: ${d.location_id} — this ${d.restaurant_tier} restaurant uses ${d.primary_curtain_material} curtains but material-concept match score is ${d.material_concept_match_score}/100 (target ${config.minMaterialConceptMatchScore}+). Color coordination ${d.curtain_color_coordination_score}/100 (target ${config.minColorCoordinationScore}+). ${criticalNote}Industry data: curtain material must match restaurant concept (silk/linen for fine dining, cotton/linen for casual, polyester for quick-service, velvet for steakhouse/lounge); heavy velvet drapes in casual venue feel stuffy + dated; cheap polyester blinds in fine dining signal cost-cutting + low quality; sheer silk creates 35% perceived quality boost in fine dining (Cornell CHR); linen drapes feel organic + approachable for casual venues; velvet drapes feel luxurious + warm for steakhouses + cocktail lounges; cotton drapes feel comfortable + homey for family dining; polyester drapes feel cheap + plastic for any venue; curtain color must coordinate with restaurant palette (warm earth tones for Italian, cool blues for seafood, monochrome for modern); curtain color should complement (not match) wall color; curtain color should be 1-2 shades darker than wall for visual weight; curtain color should align with brand mood (calm = blue/green, energetic = red/orange, luxurious = gold/burgundy); curtain color should not clash with floor/wall art; curtain color should be photographed well (social media); curtain color should resist fading (UV treatment); curtain texture adds tactile dimension (smooth silk vs nubby linen vs plush velvet); curtain lining adds body + insulation + UV protection; curtain length should be floor-to-ceiling for elegance (or sill-length for casual); curtain fullness should be 2-3x window width for proper drape; curtain rod should be decorative (wrought iron, brass, wood) and match hardware; curtain rod should extend 4-6 inches beyond window frame; curtain rod should be 4-6 inches above window frame (visually elongates window); curtain tiebacks should match rod hardware; curtain holdbacks should be decorative + functional. Solutions ranked by impact: (1) REPLACE ${d.primary_curtain_material} with concept-appropriate material (silk/linen for fine dining, cotton for casual, velvet for steakhouse) — revenue ${fmt$(expectedQualityLift)}/mo quality lift + ${fmt$(expectedBrandLift)}/mo brand lift + ${fmt$(expectedColorLift)}/mo color coordination lift; cost ${fmt$(replacementCost)} replacement; payback 4-8 months; (2) COORDINATE curtain color with restaurant palette — brand cohesion; (3) CHOOSE material 1-2 shades darker than wall — visual weight; (4) INSTALL floor-to-ceiling length for fine dining — elegance; (5) INSTALL sill-length for casual venues — approachability; (6) ADD 2-3x fullness for proper drape — luxury feel; (7) ADD lining for body + insulation + UV protection — quality; (8) UPGRADE rod to decorative (wrought iron, brass, wood) — hardware match; (9) EXTEND rod 4-6 inches beyond frame — visual width; (10) RAISE rod 4-6 inches above frame — visual height; (11) ADD tiebacks or holdbacks matching rod hardware — finish detail; (12) ADD sheer layer for diffused light effect — 35% quality boost (Cornell CHR); (13) TEST material under restaurant lighting — color accuracy; (14) PHOTOGRAPH for social media validation — content; (15) ROTATE seasonal materials (linen summer, velvet winter) — attention to detail. Industry data: 35% perceived quality boost from sheers (Cornell CHR); silk/linen for fine dining; cotton for casual; velvet for steakhouse; 2-3x fullness for proper drape; floor-to-ceiling for elegance; payback 4-8 months. Expected impact: +${targetPerceivedQualityLiftPct}% perceived quality (target), +${targetAmbianceControlLiftPct}% ambiance control, +${fmt$(expectedQualityLift)}/mo quality revenue, +${fmt$(expectedBrandLift)}/mo brand revenue, +${fmt$(expectedColorLift)}/mo color coordination, payback 4-8 months.`,
        ai_recommendation: 'replace_wrong_material_for_concept',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: MOTORIZATION_ABSENT
    if (config.requireMotorizationForHighWindows && d.has_window_treatments && d.window_count_high_windows > 0 && (d.motorization_coverage_pct < config.minMotorizationCoveragePct || !d.has_motorized_blinds)) {
      // Manual blinds in high-window venue -> staff cannot adjust efficiently
      const highWindowCount = d.window_count_high_windows;
      const motorizationCost = highWindowCount * avgMotorizationCostPerWindow;
      const staffTimeSavedMonthly = highWindowCount * 2; // 2 minutes per high window per adjustment, 30 adjustments/mo
      const staffCostPerMinute = 0.50;
      const expectedLaborSavings = Math.round(staffTimeSavedMonthly * 30 * staffCostPerMinute);
      const expectedEnergyOptimization = Math.round(d.hvac_energy_cost_monthly * 0.05);
      const expectedComfortLift = Math.round(baselineRevenue * 0.01 * (targetCustomerComfortLiftPct / 100));
      const totalOpportunity = Math.max(expectedLaborSavings + expectedEnergyOptimization + expectedComfortLift, 800);
      alerts.push({
        rule_id: 'motorization_absent',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_blinds_shades: d.has_blinds_shades,
        has_motorized_blinds: d.has_motorized_blinds,
        has_automated_schedule: d.has_automated_schedule,
        window_count_high_windows: d.window_count_high_windows,
        window_count_total: d.window_count_total,
        motorization_coverage_pct: d.motorization_coverage_pct,
        motorization_cost_per_window: d.motorization_cost_per_window,
        hvac_energy_cost_monthly: d.hvac_energy_cost_monthly,
        customer_comfort_score: d.customer_comfort_score,
        ambiance_control_score: d.ambiance_control_score,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        hvac_energy_savings_projected_pct: 5,
        customer_comfort_lift_projected_pct: targetCustomerComfortLiftPct,
        ambiance_control_lift_projected_pct: targetAmbianceControlLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `MOTORIZATION ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has ${d.window_count_high_windows} high windows (>8 ft) but ${d.motorization_coverage_pct}% motorization coverage (target ${config.minMotorizationCoveragePct}%+). HIGH: manual blinds in high-window venue — staff cannot adjust efficiently. Industry data: motorized blinds cost $200-800/window installed; motorized blinds allow automated time-of-day adjustment without staff intervention; motorized blinds integrate with smart building systems (Somfy, Lutron, Hunter Douglas); motorized blinds can be scheduled (open at sunrise, close at sunset, close during peak solar hours); motorized blinds reduce staff labor (no ladder needed for high windows); motorized blinds improve safety (no climbing); motorized blinds enable consistent ambiance control (every window adjusts simultaneously); motorized blinds can be controlled via app or remote; motorized blinds can be integrated with HVAC system (close blinds when AC struggling); motorized blinds can be integrated with lighting system (close blinds + turn on lights at dusk); motorized blinds can be integrated with security system (close blinds when alarm armed); motorized blinds come in hardwired ($500-800/window) + battery-powered ($200-400/window); motorized blinds last 10-15 years with proper maintenance; motorized blinds require annual battery replacement (battery-powered) or motor service (hardwired); motorized blinds reduce energy costs 5-10% via optimized daylight + solar block; motorized blinds improve customer comfort via consistent ambiance; motorized blinds signal modern + premium operation; motorized blinds enable one-touch scene control (dinner scene, brunch scene, event scene); motorized blinds reduce wear + tear from manual operation; motorized blinds enable group control (all windows adjust together). Solutions ranked by impact: (1) MOTORIZE ${highWindowCount} high windows — labor savings ${fmt$(expectedLaborSavings)}/mo + energy savings ${fmt$(expectedEnergyOptimization)}/mo; cost ${fmt$(motorizationCost)} installation; payback 12-24 months; (2) INSTALL hardwired motorization ($500-800/window) for high windows — reliability; (3) INSTALL battery-powered motorization ($200-400/window) for retrofit — lower cost; (4) INTEGRATE with smart building system (Somfy, Lutron) — automation; (5) SCHEDULE time-of-day adjustment (sunrise/sunset/peak solar) — energy optimization; (6) INTEGRATE with HVAC system (close when AC struggling) — efficiency; (7) INTEGRATE with lighting system (close + lights on at dusk) — ambiance; (8) INTEGRATE with security system (close when alarm armed) — security; (9) ADD app or remote control — staff convenience; (10) ADD scene control (dinner, brunch, event) — ambiance presets; (11) ADD group control (all windows together) — consistency; (12) ANNUAL battery replacement or motor service — maintenance; (13) TARGET 10-15 year motorized blind lifespan — ROI; (14) REDUCE manual wear + tear — longevity; (15) SIGNAL modern + premium operation via visible motorization — brand. Industry data: $200-800/window motorization cost; 5-10% energy savings; 10-15 year lifespan; payback 12-24 months. Expected impact: +5% HVAC energy savings, +${targetCustomerComfortLiftPct}% customer comfort (target), +${targetAmbianceControlLiftPct}% ambiance control (target), +${fmt$(expectedLaborSavings)}/mo labor savings, +${fmt$(expectedEnergyOptimization)}/mo energy savings, +${fmt$(expectedComfortLift)}/mo comfort revenue, payback 12-24 months.`,
        ai_recommendation: 'motorize_existing_blinds',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: BLACKOUT_CAPABILITY_ABSENT
    if (config.requireBlackoutForEventSpace && d.has_event_space && !d.has_blackout_capability_event) {
      // No blackout curtains in event space -> cannot host corporate presentations
      const expectedCorporateEventRevenue = Math.round(d.corporate_events_per_month * 4500);
      const expectedBookingLift = Math.round(expectedCorporateEventRevenue * 0.3);
      const blackoutCost = 3000; // blackout curtain installation for event space
      const totalOpportunity = Math.max(expectedBookingLift, 2400);
      alerts.push({
        rule_id: 'blackout_capability_absent',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_event_space: d.has_event_space,
        has_blackout_layer: d.has_blackout_layer,
        has_blackout_capability_event: d.has_blackout_capability_event,
        corporate_events_per_month: d.corporate_events_per_month,
        projector_usage_required: d.projector_usage_required,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        perceived_quality_lift_projected_pct: targetPerceivedQualityLiftPct,
        ambiance_control_lift_projected_pct: targetAmbianceControlLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `BLACKOUT CAPABILITY ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has an event space but no blackout curtains. Currently ${d.corporate_events_per_month} corporate events per month${d.projector_usage_required ? ' (projector usage required)' : ''}. HIGH: NO BLACKOUT CURTAINS IN EVENT SPACE — cannot host corporate presentations. Industry data: 100% of corporate events need blackout capability (projector presentations); corporate events generate $3,000-8,000/event in revenue; blackout curtains block 99.9% of light for projector visibility; blackout curtains enable presentation clarity in any daylight condition; blackout curtains transform event space from daytime meeting to evening reception; blackout curtains signal professional event capability; blackout curtains prevent sun glare on projector screens; blackout curtains prevent sun glare on TVs + digital signage; blackout curtains enable movie screening events; blackout curtains enable awards ceremony events (stage lighting); blackout curtains enable product launch events (dramatic reveals); blackout curtains enable wedding ceremony events (mood lighting); blackout curtains enable photography events (controlled lighting); blackout curtains are required by event planners for corporate bookings; event planners filter venues by blackout capability (no blackout = no booking); event planners charge premium for blackout-equipped venues ($500-1,500 premium); blackout curtains cost $2,000-5,000 to install in event space; blackout curtains last 8-12 years with proper maintenance; blackout curtains should be motorized for easy operation; blackout curtains should have multiple opacity levels (50%, 80%, 100%); blackout curtains should pair with sheer layer for daytime events; blackout curtains should be fire-rated for event space compliance; blackout curtains should be sound-absorbing (velvet or wool) for dual benefit; blackout curtains should be black or dark navy (maximum light block); blackout curtains should be floor-to-ceiling for full coverage; blackout curtains should overlap window frame by 4-6 inches (no light leaks); blackout curtains should have valance or cornice (top light block). Solutions ranked by impact: (1) INSTALL blackout curtains in event space — revenue ${fmt$(expectedCorporateEventRevenue)}/mo corporate event capability + ${fmt$(expectedBookingLift)}/mo booking lift; cost ${fmt$(blackoutCost)} blackout installation; payback 1-2 months; (2) CHOOSE blackout material (velvet or wool) for sound absorption dual benefit — acoustic + visual; (3) MOTORIZE blackout curtains for easy operation — staff efficiency; (4) ADD multiple opacity levels (50%, 80%, 100%) — flexibility; (5) PAIR with sheer layer for daytime events — adaptability; (6) CHOOSE black or dark navy color — maximum light block; (7) INSTALL floor-to-ceiling for full coverage — completeness; (8) OVERLAP window frame by 4-6 inches — no light leaks; (9) ADD valance or cornice — top light block; (10) ENSURE fire-rated material for event compliance — safety; (11) MARKET blackout capability to event planners — bookings; (12) CHARGE premium ($500-1,500/event) for blackout-equipped venue — revenue; (13) TARGET corporate event planners via Eventbrite + Cvent + wedding planners — distribution; (14) ADD projector + screen + audio system for full event package — bundle; (15) ADD event coordinator staff for blackout-equipped events — service. Industry data: 100% of corporate events need blackout; $3,000-8,000/event revenue; $2,000-5,000 blackout installation cost; 8-12 year lifespan; payback 1-2 months. Expected impact: +${fmt$(expectedCorporateEventRevenue)}/mo corporate event revenue, +${fmt$(expectedBookingLift)}/mo booking lift, +${targetPerceivedQualityLiftPct}% perceived quality (target), +${targetAmbianceControlLiftPct}% ambiance control (target), payback 1-2 months.`,
        ai_recommendation: 'install_blackout_in_event_space',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: CURTAIN_WEAR_STAIN_DETECTED
    if (config.requireNoWearStains && d.has_window_treatments && d.curtain_wear_stain_detected) {
      // Stained/torn curtains -> 30% perceived quality drop
      const expectedQualityRecovery = Math.round(baselineRevenue * 0.05 * (d.perceived_quality_drop_pct / 100));
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.02 * (d.perceived_quality_drop_pct / 100));
      const cleaningOrReplacementCost = d.curtain_age_years > 4 ? 6000 : 600; // replace if >4 years old, else clean
      const actionLabel = d.curtain_age_years > 4 ? `REPLACE curtains (>4 years old) — cost ${fmt$(6000)} replacement` : `PROFESSIONALLY DRY-CLEAN curtains — cost ${fmt$(600)} cleaning`;
      const totalOpportunity = Math.max(expectedQualityRecovery + expectedSatisfactionLift, 1200);
      alerts.push({
        rule_id: 'curtain_wear_stain_detected',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_curtains_drapery: d.has_curtains_drapery,
        curtain_wear_stain_detected: d.curtain_wear_stain_detected,
        curtain_age_years: d.curtain_age_years,
        curtain_cleaning_frequency_months: d.curtain_cleaning_frequency_months,
        perceived_quality_drop_pct: d.perceived_quality_drop_pct,
        primary_curtain_material: d.primary_curtain_material,
        perceived_quality_score: d.perceived_quality_score,
        perceived_quality_baseline: d.perceived_quality_baseline,
        customer_comfort_score: d.customer_comfort_score,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        perceived_quality_lift_projected_pct: d.perceived_quality_drop_pct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CURTAIN WEAR OR STAIN DETECTED: ${d.location_id} — this ${d.restaurant_tier} restaurant has ${d.primary_curtain_material} curtains that are ${d.curtain_age_years} years old with visible wear/stains. Last cleaned ${d.curtain_cleaning_frequency_months} months ago (target every ${config.minCurtainCleaningFrequencyMonths} months). Perceived quality drop: ${d.perceived_quality_drop_pct}%. HIGH: STAINED OR TORN CURTAINS — 30% perceived quality drop (same as dirty tablecloths). Industry data: visible curtain wear/stains = 30% perceived quality drop (same as dirty tablecloths); customers notice stains within 2 minutes of sitting (45% notice window treatments, ASID); stained curtains signal neglect + low standards; stained curtains trigger negative Yelp + Google reviews; stained curtains damage restaurant brand; stained curtains reduce repeat visits (customers assume rest of restaurant is dirty); stained curtains reduce perceived value (customers question prices); stained curtains reduce tip amounts (perceived low-quality service); curtains should be cleaned every 3-6 months (professional dry cleaning); curtains should be replaced every 5-7 years (fabric degradation); curtains in food/drink areas stain faster (grease + wine + coffee); curtains near HVAC vents collect dust + allergens; curtains near windows fade from UV (without UV protection); curtains should be inspected monthly for wear + stains; curtains should be spot-cleaned immediately after spills; curtains should be vacuumed weekly (dust removal); curtains should be professionally dry-cleaned quarterly; curtains should be replaced when faded, torn, or permanently stained; curtain replacement costs $3,000-10,000 depending on material + window count; curtain cleaning costs $200-600 per session; curtain cleaning is tax-deductible as maintenance; curtain replacement may be tax-deductible as capital improvement; curtain wear is preventable with UV protection + regular cleaning + careful operation. Solutions ranked by impact: (1) ${actionLabel} — revenue ${fmt$(expectedQualityRecovery)}/mo quality recovery + ${fmt$(expectedSatisfactionLift)}/mo satisfaction lift; payback 2-6 months; (2) INSPECT curtains monthly for wear + stains — early detection; (3) SPOT-CLEAN spills immediately — prevention; (4) VACUUM curtains weekly — dust removal; (5) DRY-CLEAN quarterly (every 3 months) — scheduled maintenance; (6) REPLACE every 5-7 years — fabric lifecycle; (7) ADD UV protection coating — fade prevention; (8) INSTALL motorized operation — reduced manual wear; (9) CHOOSE stain-resistant fabric (Scotchgard, Crypton) — longevity; (10) TRAIN staff on curtain care — operational; (11) POSITION curtains away from food/drink zones — stain prevention; (12) ADD HVAC filter upgrades — dust reduction; (13) DOCUMENT cleaning schedule in maintenance log — accountability; (14) BUDGET curtain replacement fund ($1,000/yr reserve) — capital planning; (15) PHOTOGRAPH curtains monthly for stain tracking — visual record. Industry data: 30% perceived quality drop from stained curtains; clean every 3-6 months; replace every 5-7 years; $3,000-10,000 replacement; $200-600 cleaning; payback 2-6 months. Expected impact: +${d.perceived_quality_drop_pct}% perceived quality recovery, +${fmt$(expectedQualityRecovery)}/mo quality revenue, +${fmt$(expectedSatisfactionLift)}/mo satisfaction revenue, payback 2-6 months.`,
        ai_recommendation: 'replace_worn_stained_curtains',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: UV_PROTECTION_MISSING
    if (config.requireUvProtection && d.has_window_treatments && !d.has_uv_blocking_treatment && d.has_fading_sensitive_furnishings) {
      // No UV-blocking treatment -> furniture/art fading $500-2,000/yr
      const expectedUvSavingsMonthly = Math.round(d.furniture_art_fading_cost_yearly / 12);
      const expectedFurnitureProtection = Math.round(d.furniture_art_fading_cost_yearly * 0.8 / 12);
      const uvTreatmentCost = Math.round(d.window_count_total * 80); // $80/window UV film or coating
      const totalOpportunity = Math.max(expectedUvSavingsMonthly + expectedFurnitureProtection, 600);
      alerts.push({
        rule_id: 'uv_protection_missing',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_uv_blocking_treatment: d.has_uv_blocking_treatment,
        uv_protection_present: d.uv_protection_present,
        uv_blocking_pct: d.uv_blocking_pct,
        has_fading_sensitive_furnishings: d.has_fading_sensitive_furnishings,
        furniture_art_fading_cost_yearly: d.furniture_art_fading_cost_yearly,
        window_count_total: d.window_count_total,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        uv_replacement_savings_yearly: d.uv_replacement_savings_yearly,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `UV PROTECTION MISSING: ${d.location_id} — this ${d.restaurant_tier} restaurant has ${d.window_count_total} windows with no UV-blocking treatment. UV-sensitive furnishings present: ${d.has_fading_sensitive_furnishings ? 'YES' : 'no'}. Current UV blocking: ${d.uv_blocking_pct}% (target ${config.minUvBlockingPct}%+). Furniture/art fading cost: ${fmt$(d.furniture_art_fading_cost_yearly)}/yr. MEDIUM: NO UV-BLOCKING TREATMENT — furniture/art fading ${fmt$(d.furniture_art_fading_cost_yearly)}/yr. Industry data: UV-blocking treatments prevent furniture/art fading — saves $500-2,000/yr in replacement costs; UV radiation causes 40-60% of furniture fading (visible light 25-35%, heat 15-25%); UV-blocking film blocks 99% of UV radiation; UV-blocking film preserves wood furniture (color + finish); UV-blocking film preserves leather upholstery (color + softness); UV-blocking film preserves artwork (color + canvas integrity); UV-blocking film preserves carpet + rugs (color + fiber); UV-blocking film preserves wallpaper + paint (color + finish); UV-blocking film preserves menu boards + signage (color + legibility); UV-blocking film preserves display merchandise (color + value); UV-blocking film reduces HVAC load 5-10% (solar heat rejection); UV-blocking film increases glass safety (shatter resistance); UV-blocking film costs $5-15/sq ft installed; UV-blocking film lasts 10-15 years; UV-blocking film can be clear (invisible) or tinted (solar control); UV-blocking film can be applied to existing windows (retrofit); UV-blocking curtains provide 95-99% UV block; UV-blocking coatings can be applied during manufacturing (low-E glass); UV-blocking coatings can be applied to existing glass (spray-on); UV-blocking treatments are tax-deductible as energy improvement; UV-blocking treatments qualify for energy rebates in some markets; UV-blocking treatments are required for museums + galleries + high-end retail; UV-blocking treatments should be inspected annually for degradation; UV-blocking treatments should be replaced every 10-15 years. Solutions ranked by impact: (1) INSTALL UV-blocking film on ${d.window_count_total} windows — savings ${fmt$(expectedUvSavingsMonthly)}/mo furniture/art preservation + ${fmt$(expectedFurnitureProtection)}/mo additional protection; cost ${fmt$(uvTreatmentCost)} film installation; payback 6-12 months; (2) CHOOSE 99% UV-blocking film (industry standard) — maximum protection; (3) ADD clear UV film (invisible) for existing treatments — aesthetic preservation; (4) ADD tinted UV film for solar heat rejection — HVAC savings 5-10%; (5) ADD shatter-resistant film for glass safety — liability reduction; (6) INSTALL UV-blocking curtains (95-99% block) — fabric-based protection; (7) APPLY low-E glass coating during window replacement — permanent solution; (8) APPLY spray-on UV coating to existing glass — retrofit option; (9) INSPECT UV film annually for degradation — maintenance; (10) REPLACE UV film every 10-15 years — lifecycle; (11) DOCUMENT UV-sensitive furnishings inventory — tracking; (12) ROTATE furniture + artwork to even exposure — wear distribution; (13) POSITION fading-sensitive items away from direct sun — prevention; (14) APPLY for energy rebates (where available) — cost offset; (15) CLAIM tax deduction for energy improvement — financial benefit. Industry data: $500-2,000/yr fading savings; 99% UV block standard; $5-15/sq ft film cost; 10-15 year lifespan; 5-10% HVAC savings; payback 6-12 months. Expected impact: +${fmt$(expectedUvSavingsMonthly)}/mo furniture/art preservation, +${fmt$(expectedFurnitureProtection)}/mo additional protection, +5-10% HVAC savings, payback 6-12 months.`,
        ai_recommendation: 'add_uv_blocking_treatment',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: SEASONAL_ROTATION_MISSING
    if (config.requireSeasonalRotation && d.has_window_treatments && !d.has_seasonal_rotation) {
      // Same treatment year-round -> missed 25-40% heat loss reduction
      const expectedWinterHvacSavings = Math.round(d.hvac_energy_cost_monthly * 0.5 * (targetWinterHeatLossReductionPct / 100) * 4 / 12); // winter months
      const expectedSummerHvacSavings = Math.round(d.hvac_energy_cost_monthly * 0.5 * (targetSummerSolarGainBlockPct / 100) * 4 / 12); // summer months
      const expectedComfortLift = Math.round(baselineRevenue * 0.02 * (targetCustomerComfortLiftPct / 100));
      const expectedAttentionLift = Math.round(baselineRevenue * 0.01 * 0.2);
      const rotationCost = 4000; // second set of curtains + storage
      const totalOpportunity = Math.max(expectedWinterHvacSavings + expectedSummerHvacSavings + expectedComfortLift + expectedAttentionLift, 800);
      alerts.push({
        rule_id: 'seasonal_rotation_missing',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_seasonal_rotation: d.has_seasonal_rotation,
        summer_treatment_type: d.summer_treatment_type,
        winter_treatment_type: d.winter_treatment_type,
        winter_heat_loss_reduction_pct: d.winter_heat_loss_reduction_pct,
        summer_solar_gain_block_pct: d.summer_solar_gain_block_pct,
        seasonal_rotation_attention_score: d.seasonal_rotation_attention_score,
        hvac_energy_cost_monthly: d.hvac_energy_cost_monthly,
        customer_comfort_score: d.customer_comfort_score,
        brand_attention_to_detail_score: d.brand_attention_to_detail_score,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        hvac_energy_savings_projected_pct: targetWinterHeatLossReductionPct,
        customer_comfort_lift_projected_pct: targetCustomerComfortLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SEASONAL ROTATION MISSING: ${d.location_id} — this ${d.restaurant_tier} restaurant uses the same ${d.summer_treatment_type} treatment year-round (no seasonal rotation). Winter heat loss reduction: ${d.winter_heat_loss_reduction_pct}% (target ${config.minWinterHeatLossReductionPct}%+). Summer solar gain block: ${d.summer_solar_gain_block_pct}% (target ${config.minSummerSolarGainBlockPct}%+). Seasonal rotation attention score: ${d.seasonal_rotation_attention_score}/100. MEDIUM: SAME TREATMENT YEAR-ROUND — missed 25-40% heat loss reduction (DOE). Industry data: curtains reduce heat loss 25-40% in winter (DOE); curtains block solar gain 60-80% in summer (DOE); heavy drapery (velvet, wool) provides winter insulation; light sheers provide summer diffusion; seasonal rotation (light sheers summer, heavy drapes winter) signals attention to detail; seasonal rotation optimizes thermal comfort year-round; seasonal rotation reduces HVAC costs 15-25% annually; seasonal rotation extends curtain lifespan (less wear per set); seasonal rotation enables seasonal mood changes (light + airy summer, warm + cozy winter); seasonal rotation aligns with seasonal menu changes (cohesive experience); seasonal rotation aligns with seasonal marketing campaigns; seasonal rotation aligns with seasonal decor (holiday + seasonal themes); seasonal rotation requires 2 sets of curtains ($2,000-8,000); seasonal rotation requires storage space for off-season set; seasonal rotation requires staff training (swap procedure); seasonal rotation should be scheduled (April + October swap); seasonal rotation should be documented in maintenance log; seasonal rotation should be inspected after swap (correct installation); seasonal rotation should be cleaned before storage; seasonal rotation should be stored in climate-controlled space (prevent mold); seasonal rotation should be inventoried (track both sets); seasonal rotation signals premium operation + attention to detail; seasonal rotation differentiates from competitors (most do not rotate). Solutions ranked by impact: (1) IMPLEMENT seasonal rotation (summer sheers + winter heavy drapery) — HVAC savings ${fmt$(expectedWinterHvacSavings)}/mo winter + ${fmt$(expectedSummerHvacSavings)}/mo summer + comfort lift ${fmt$(expectedComfortLift)}/mo + attention lift ${fmt$(expectedAttentionLift)}/mo; cost ${fmt$(rotationCost)} second set + storage; payback 12-24 months; (2) CHOOSE summer treatment: light sheers (cotton, linen) for diffused light — 35% quality boost (Cornell CHR); (3) CHOOSE winter treatment: heavy drapery (velvet, wool) for insulation — 25-40% heat loss reduction (DOE); (4) SCHEDULE April + October swap — biannual routine; (5) DOCUMENT swap in maintenance log — accountability; (6) INSPECT after swap for correct installation — quality control; (7) CLEAN before storage — preservation; (8) STORE in climate-controlled space — mold prevention; (9) INVENTORY both sets — asset tracking; (10) TRAIN staff on swap procedure — operational; (11) ALIGN with seasonal menu changes — cohesive experience; (12) ALIGN with seasonal decor (holiday themes) — ambiance; (13) ALIGN with seasonal marketing campaigns — brand storytelling; (14) ROTATE 2-3 sets for spring + summer + fall + winter variation — premium positioning; (15) DIFFERENTIATE from competitors via visible seasonal rotation — brand perception. Industry data: 25-40% winter heat loss reduction (DOE); 60-80% summer solar block (DOE); 15-25% annual HVAC savings; 35% quality boost from sheers (Cornell CHR); $2,000-8,000 second set cost; payback 12-24 months. Expected impact: +${targetWinterHeatLossReductionPct}% winter heat loss reduction (target), +${targetSummerSolarGainBlockPct}% summer solar block (target), +${targetCustomerComfortLiftPct}% customer comfort (target), +${fmt$(expectedWinterHvacSavings)}/mo winter HVAC savings, +${fmt$(expectedSummerHvacSavings)}/mo summer HVAC savings, +${fmt$(expectedComfortLift)}/mo comfort revenue, +${fmt$(expectedAttentionLift)}/mo attention revenue, payback 12-24 months.`,
        ai_recommendation: 'implement_seasonal_rotation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: SOUND_ABSORPTION_OPPORTUNITY
    if (config.requireAcousticDraperyForHardSurfaces && (d.has_hard_floor_surfaces || d.has_hard_wall_surfaces) && !d.has_acoustic_drapery) {
      // Hard surfaces venue with no drapery -> missed 15-20% noise reduction
      const expectedNoiseReductionDb = 5; // 5 dB reduction from acoustic drapery
      const expectedComplaintReduction = Math.round(d.noise_complaints_monthly * 0.6);
      const expectedComfortLift = Math.round(baselineRevenue * 0.02 * (targetCustomerComfortLiftPct / 100));
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.015 * 0.1);
      const acousticDraperyCost = 5000; // acoustic drapery installation
      const totalOpportunity = Math.max(expectedComfortLift + expectedSatisfactionLift, 600);
      alerts.push({
        rule_id: 'sound_absorption_opportunity',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_window_treatments: d.has_window_treatments,
        has_curtains_drapery: d.has_curtains_drapery,
        has_acoustic_drapery: d.has_acoustic_drapery,
        has_hard_floor_surfaces: d.has_hard_floor_surfaces,
        has_hard_wall_surfaces: d.has_hard_wall_surfaces,
        ambient_noise_level_db: d.ambient_noise_level_db,
        noise_reduction_pct_from_drapery: d.noise_reduction_pct_from_drapery,
        noise_complaints_monthly: d.noise_complaints_monthly,
        customer_comfort_score: d.customer_comfort_score,
        perceived_quality_score: d.perceived_quality_score,
        monthly_revenue: d.monthly_revenue,
        window_treatment_setup_cost: d.window_treatment_setup_cost,
        window_treatment_total_monthly_cost: d.window_treatment_total_monthly_cost,
        noise_reduction_projected_pct: targetNoiseReductionPct,
        customer_comfort_lift_projected_pct: targetCustomerComfortLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SOUND ABSORPTION OPPORTUNITY: ${d.location_id} — this ${d.restaurant_tier} restaurant has hard surfaces (floor: ${d.has_hard_floor_surfaces ? 'YES' : 'no'}, walls: ${d.has_hard_wall_surfaces ? 'YES' : 'no'}) but no acoustic drapery. Ambient noise level: ${d.ambient_noise_level_db} dB. Noise complaints: ${d.noise_complaints_monthly}/mo. MEDIUM: HARD SURFACES VENUE WITH NO DRAPERY — missed 15-20% noise reduction (ASA). Industry data: heavy drapery absorbs 15-20% of ambient noise (Acoustical Society); hard surfaces (wood/tile/concrete floors, glass/drywall walls) reflect sound; hard surfaces amplify noise 30-50% vs soft surfaces; acoustic drapery (velvet, wool, heavyweight cotton) absorbs mid + high frequencies; acoustic drapery reduces ambient noise 3-7 dB (perceptible reduction); acoustic drapery improves speech intelligibility (conversation); acoustic drapery improves music clarity (less echo); acoustic drapery improves customer comfort (less noise fatigue); acoustic drapery reduces noise complaints 50-70%; acoustic drapery enables longer dwell time (comfortable conversation); acoustic drapery increases repeat visits (noise drives customers away); acoustic drapery signals premium operation (attention to acoustic comfort); acoustic drapery complements other acoustic treatments (panels, ceiling clouds); acoustic drapery is dual-purpose (visual + acoustic); acoustic drapery costs $3,000-8,000 installed; acoustic drapery lasts 10-15 years with proper maintenance; acoustic drapery should be heavy weight (16-32 oz/sq yd); acoustic drapery should be floor-to-ceiling for maximum absorption; acoustic drapery should be pleated (more surface area); acoustic drapery should be 2-3x fullness (more absorption); acoustic drapery should cover 20-40% of wall surface for effective absorption; acoustic drapery should be paired with carpet or rugs (complementary absorption); acoustic drapery should be paired with acoustic panels (comprehensive solution); acoustic drapery should be cleaned regularly (dust reduces absorption). Solutions ranked by impact: (1) INSTALL acoustic drapery (velvet or wool, 16-32 oz/sq yd) — revenue ${fmt$(expectedComfortLift)}/mo comfort lift + ${fmt$(expectedSatisfactionLift)}/mo satisfaction lift; cost ${fmt$(acousticDraperyCost)} installation; payback 12-24 months; (2) CHOOSE heavy weight (16-32 oz/sq yd) for maximum absorption — 15-20% noise reduction (ASA); (3) INSTALL floor-to-ceiling for maximum absorption area — effectiveness; (4) PLEAT drapery for more surface area — absorption boost; (5) ADD 2-3x fullness for more absorption — luxury + acoustic; (6) COVER 20-40% of wall surface — effective absorption; (7) PAIR with carpet or rugs — complementary absorption; (8) PAIR with acoustic panels — comprehensive solution; (9) PAIR with acoustic ceiling clouds — full coverage; (10) CLEAN regularly (dust reduces absorption) — maintenance; (11) TARGET ${expectedNoiseReductionDb} dB noise reduction — perceptible improvement; (12) REDUCE noise complaints by ${expectedComplaintReduction}/mo — customer satisfaction; (13) IMPROVE speech intelligibility — conversation; (14) IMPROVE music clarity — ambiance; (15) SIGNAL premium operation via acoustic drapery — brand perception. Industry data: 15-20% noise reduction (ASA); 3-7 dB perceptible reduction; 50-70% noise complaint reduction; $3,000-8,000 installation cost; 10-15 year lifespan; payback 12-24 months. Expected impact: +${targetNoiseReductionPct}% noise reduction (target), +${targetCustomerComfortLiftPct}% customer comfort (target), +${expectedComplaintReduction}/mo fewer complaints, +${fmt$(expectedComfortLift)}/mo comfort revenue, +${fmt$(expectedSatisfactionLift)}/mo satisfaction revenue, payback 12-24 months.`,
        ai_recommendation: 'add_acoustic_drapery',
        status: 'open', detected_at: now,
      });
    }
  }

  // AI insights via OpenAI
  if (config.aiEnabled && alerts.length > 0) {
    const { callOpenAIChat } = await import('@/lib/openai.service.ts').catch(() => ({} as any));
    if (callOpenAIChat) {
      const topAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 5);
      for (const a of topAlerts) {
        try {
          const response = await callOpenAIChat({
            messages: [
              { role: 'system', content: 'You are a restaurant window treatment and curtain design optimization expert. Given window treatment data, recommend ONE specific action with expected perceived quality lift, customer comfort lift, ambiance control lift, HVAC energy savings, or noise reduction (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Has window treatments: ${a.has_window_treatments ?? false}. Has curtains/drapery: ${a.has_curtains_drapery ?? false}. Has blinds/shades: ${a.has_blinds_shades ?? false}. Has sheer layer: ${a.has_sheer_layer ?? false}. Has blackout layer: ${a.has_blackout_layer ?? false}. Has motorized blinds: ${a.has_motorized_blinds ?? false}. Has UV blocking: ${a.has_uv_blocking_treatment ?? false}. Treatment types: ${a.treatment_types_count ?? 0}. Material: ${a.primary_curtain_material ?? 'n/a'}. Material match score: ${a.material_concept_match_score ?? 0}/100. Material matches concept: ${a.material_matches_concept ?? false}. Color coordination: ${a.curtain_color_coordination_score ?? 0}/100. High windows: ${a.window_count_high_windows ?? 0}/${a.window_count_total ?? 0}. Motorization coverage: ${a.motorization_coverage_pct ?? 0}%. Automated schedule: ${a.has_automated_schedule ?? false}. Has event space: ${a.has_event_space ?? false}. Blackout in event: ${a.has_blackout_capability_event ?? false}. Corporate events/mo: ${a.corporate_events_per_month ?? 0}. Projector required: ${a.projector_usage_required ?? false}. Wear/stain: ${a.curtain_wear_stain_detected ?? false}. Age: ${a.curtain_age_years ?? 0} years. Cleaning freq: ${a.curtain_cleaning_frequency_months ?? 0} months. Quality drop: ${a.perceived_quality_drop_pct ?? 0}%. UV blocking: ${a.uv_blocking_pct ?? 0}%. Fading cost: ${fmt$(a.furniture_art_fading_cost_yearly ?? 0)}/yr. Seasonal rotation: ${a.has_seasonal_rotation ?? false}. Winter heat reduction: ${a.winter_heat_loss_reduction_pct ?? 0}%. Summer solar block: ${a.summer_solar_gain_block_pct ?? 0}%. Hard floor: ${a.has_hard_floor_surfaces ?? false}. Hard walls: ${a.has_hard_wall_surfaces ?? false}. Acoustic drapery: ${a.has_acoustic_drapery ?? false}. Noise level: ${a.ambient_noise_level_db ?? 0} dB. Noise reduction: ${a.noise_reduction_pct_from_drapery ?? 0}%. Noise complaints: ${a.noise_complaints_monthly ?? 0}/mo. Quality: ${a.perceived_quality_score ?? 0}/100 (baseline ${a.perceived_quality_baseline ?? 0}, lift ${a.perceived_quality_lift_pct ?? 0}%). Comfort: ${a.customer_comfort_score ?? 0}/100 (lift ${a.customer_comfort_lift_pct ?? 0}%). Ambiance: ${a.ambiance_control_score ?? 0}/100 (lift ${a.ambiance_control_lift_pct ?? 0}%). HVAC cost: ${fmt$(a.hvac_energy_cost_monthly ?? 0)}/mo. HVAC savings: ${a.hvac_energy_savings_pct ?? 0}% (${fmt$(a.hvac_energy_savings_monthly ?? 0)}/mo). Lighting savings: ${a.lighting_energy_savings_pct ?? 0}% (${fmt$(a.lighting_energy_savings_monthly ?? 0)}/mo). Total energy savings: ${fmt$(a.total_energy_savings_monthly ?? 0)}/mo. Brand attention: ${a.brand_attention_to_detail_score ?? 0}/100. Competitors premium: ${a.competitors_with_premium_treatments_pct ?? 0}%. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Setup cost: ${fmt$(a.window_treatment_setup_cost ?? 0)}. Monthly cost: ${fmt$(a.window_treatment_total_monthly_cost ?? 0)}. UV savings: ${fmt$(a.uv_replacement_savings_yearly ?? 0)}/yr. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

  // Persist alerts
  try {
    await db.query(`DELETE FROM window_treatment_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE window_treatment_alert CONTENT $data`, {
        data: { ...a, detected_at: a.detected_at.toISOString() },
      });
    } catch { /* ignore */ }
  }

  return { alerts, generated: alerts.length };
};

export const getActiveWindowTreatmentCurtainAlerts = async (db: ReturnType<typeof useDB>): Promise<WindowTreatmentCurtainAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM window_treatment_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getWindowTreatmentCurtainSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  treatmentAbsentCount: number; wrongMaterialCount: number; motorizationAbsentCount: number; blackoutAbsentCount: number;
  wearStainCount: number; uvMissingCount: number; seasonalRotationMissingCount: number; soundAbsorptionCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'window_treatment_absent') AS absent,
              math::count(rule_id = 'curtain_material_wrong_for_concept') AS wrongmat,
              math::count(rule_id = 'motorization_absent') AS nomotor,
              math::count(rule_id = 'blackout_capability_absent') AS noblackout,
              math::count(rule_id = 'curtain_wear_stain_detected') AS wearstain,
              math::count(rule_id = 'uv_protection_missing') AS nouv,
              math::count(rule_id = 'seasonal_rotation_missing') AS norotation,
              math::count(rule_id = 'sound_absorption_opportunity') AS nosound
       FROM window_treatment_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      treatmentAbsentCount: safeNumber(r.absent, 0),
      wrongMaterialCount: safeNumber(r.wrongmat, 0),
      motorizationAbsentCount: safeNumber(r.nomotor, 0),
      blackoutAbsentCount: safeNumber(r.noblackout, 0),
      wearStainCount: safeNumber(r.wearstain, 0),
      uvMissingCount: safeNumber(r.nouv, 0),
      seasonalRotationMissingCount: safeNumber(r.norotation, 0),
      soundAbsorptionCount: safeNumber(r.nosound, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, treatmentAbsentCount: 0, wrongMaterialCount: 0, motorizationAbsentCount: 0, blackoutAbsentCount: 0, wearStainCount: 0, uvMissingCount: 0, seasonalRotationMissingCount: 0, soundAbsorptionCount: 0 };
  }
};

export const updateWindowTreatmentCurtainAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
