/**
 * AI Live Music & Performance Booking Optimizer — predicts how live music and
 * performances (acoustic acts, jazz trios, solo performers, DJ nights, open
 * mic, karaoke, cultural performances) impact customer acquisition, dwell
 * time, beverage revenue, brand differentiation, and operational
 * considerations (noise levels, performance scheduling, artist booking,
 * stage setup).
 *
 * Live music increases beverage sales 25-40% on event nights (NRA).
 * Restaurants with live music see 30-45% higher weekend reservation rates
 * (OpenTable). 58% of customers extend their stay for live music
 * performances (Cornell CHR). Acoustic/solo acts cost $150-400/night but
 * generate $1,500-4,000 in additional revenue. Jazz trios/bands cost
 * $400-1,200/night but create premium positioning + attract higher-spend
 * customers. DJ nights attract younger demographic — 35% new customer
 * acquisition. Open mic/karaoke nights build community — 20% become
 * regulars. Poor scheduling (loud band during dinner rush) reduces food
 * sales 15-20%. Performance area setup (stage, lighting, sound) affects
 * both performer quality and customer experience.
 *
 * 189th POSR-exclusive differentiator. Restaurants without live music miss
 * beverage revenue + weekend reservation boost + dwell time + brand
 * differentiation (live_music_absent_weekend_venue = no live music on
 * weekends; performance_schedule_wrong = music scheduled during dinner
 * rush instead of after; artist_budget_too_low = booking budget below
 * market rate; performance_area_inadequate = no proper stage/lighting/
 * sound setup; genre_restaurant_mismatch = wrong music genre for restaurant
 * concept; dj_night_absent_young_demographic = no DJ night in restaurant
 * targeting young customers; open_mic_karaoke_absent_community_venue = no
 * community events; live_music_not_promoted = performances not marketed).
 *
 * Distinct from:
 *   - music-playlist-rotation — recorded background music (not live performers)
 *   - vibe-optimizer — overall atmosphere (not specifically live performance)
 *   - sound-system — speaker placement (not performance booking)
 *
 * 8 AI rules:
 *   1. live_music_absent_weekend_venue -> no live music on weekends -> missed 25-40% beverage + 30-45% reservation boost
 *   2. performance_schedule_wrong -> music during dinner rush instead of after -> 15-20% food sales reduction
 *   3. artist_budget_too_low -> booking budget below market rate -> low-quality performers -> poor experience
 *   4. performance_area_inadequate -> no proper stage/lighting/sound setup -> performers struggle + customers cannot see/hear
 *   5. genre_restaurant_mismatch -> wrong music genre for restaurant concept (metal in fine dining)
 *   6. dj_night_absent_young_demographic -> no DJ night in restaurant targeting young customers -> missed 35% acquisition
 *   7. open_mic_karaoke_absent_community_venue -> no community events -> missed 20% regular conversion
 *   8. live_music_not_promoted -> performances not marketed -> low turnout defeats investment
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type LiveMusicPerformanceRuleId =
  | 'live_music_absent_weekend_venue'
  | 'performance_schedule_wrong'
  | 'artist_budget_too_low'
  | 'performance_area_inadequate'
  | 'genre_restaurant_mismatch'
  | 'dj_night_absent_young_demographic'
  | 'open_mic_karaoke_absent_community_venue'
  | 'live_music_not_promoted';

export type LiveMusicPerformanceAiRec =
  | 'launch_weekend_live_music_program'
  | 'reschedule_performances_post_dinner'
  | 'increase_artist_booking_budget'
  | 'build_proper_performance_area'
  | 'align_genre_to_restaurant_concept'
  | 'launch_dj_night_series'
  | 'launch_open_mic_karaoke_nights'
  | 'promote_live_music_performances'
  | 'monitor'
  | 'skip';

export interface LiveMusicPerformanceAlert {
  id?: string;
  rule_id: LiveMusicPerformanceRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'main_dining' | 'bar_lounge' | 'outdoor_patio' | 'private_event'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural'
  // Live music inventory
  has_live_music?: boolean;                                // any live music programming at all
  has_weekend_live_music?: boolean;                         // live music on Fri/Sat nights
  has_acoustic_solo_nights?: boolean;                      // acoustic or solo performer nights
  has_jazz_trio_band_nights?: boolean;                     // jazz trio or band performances
  has_dj_nights?: boolean;                                 // DJ nights
  has_open_mic_nights?: boolean;                           // open mic nights
  has_karaoke_nights?: boolean;                            // karaoke nights
  has_cultural_performances?: boolean;                     // cultural music/dance (flamenco, jazz, classical, regional)
  performance_types_count?: number;                         // # of distinct performance types (0-7)
  // Performance scheduling
  live_music_events_per_month?: number;                    // live music events per month
  weekend_live_music_events_per_month?: number;            // Fri/Sat live music events
  avg_performance_start_time?: string;                    // typical performance start (HH:MM 24h)
  performance_starts_during_dinner_rush?: boolean;         // performance starts 18:00-20:30 (dinner rush)
  performance_duration_minutes?: number;                   // average performance duration in minutes
  performances_after_dinner_only?: boolean;                // performances start 21:00+ (after dinner rush)
  // Artist booking economics
  artist_budget_per_night?: number;                        // average artist booking budget per night
  acoustic_solo_rate_market?: number;                      // market rate for acoustic/solo ($150-400)
  jazz_trio_band_rate_market?: number;                     // market rate for jazz trio/band ($400-1200)
  dj_rate_market?: number;                                 // market rate for DJ ($200-600)
  budget_below_market?: boolean;                           // artist budget below market rate
  artist_quality_score?: number;                           // 0-100 artist quality rating
  // Performance area setup
  has_dedicated_stage?: boolean;                           // dedicated stage area
  has_performance_lighting?: boolean;                      // dedicated performance lighting
  has_professional_sound_system?: boolean;                 // professional sound system for performers
  has_monitor_speakers?: boolean;                          // monitor speakers for performers
  has_microphones?: boolean;                               // vocal + instrument microphones
  has_sound_check_routine?: boolean;                       // sound check before performance
  performance_area_score?: number;                         // 0-100 performance area quality
  // Genre & concept match
  primary_music_genre?: string;                            // current primary music genre (e.g. jazz, rock, pop, classical)
  restaurant_concept?: string;                             // restaurant concept (italian, mexican, steakhouse, sushi, fine_dining)
  genre_concept_match_score?: number;                      // 0-100 genre-concept match
  genre_matches_concept?: boolean;                         // true if genre matches concept
  // DJ night demographics
  target_demographic_age?: string;                         // target demographic (18-25, 25-35, 35-50, 50+)
  targets_young_demographic?: boolean;                     // targets 18-35 demographic
  dj_nights_per_month?: number;                            // DJ nights per month
  dj_night_new_customer_pct?: number;                      // % of DJ night attendees who are new customers
  // Open mic / karaoke community
  open_mic_karaoke_nights_per_month?: number;              // open mic + karaoke nights per month
  open_mic_karaoke_regular_conversion_pct?: number;        // % of attendees who become regulars
  community_event_score?: number;                          // 0-100 community engagement
  // Marketing & promotion
  performances_promoted?: boolean;                         // live music marketed via social/email/website
  performance_marketing_channels?: number;                 // # of marketing channels used for performances
  performance_attendance_avg?: number;                     // average attendance per performance
  performance_venue_capacity?: number;                     // venue capacity for performances
  performance_fill_rate_pct?: number;                      // attendance / capacity %
  // Customer behavior impact
  beverage_revenue_lift_pct?: number;                      // beverage revenue lift on event nights
  beverage_revenue_baseline?: number;                      // baseline beverage revenue (non-event nights)
  beverage_revenue_event_night?: number;                   // beverage revenue on event nights
  weekend_reservation_lift_pct?: number;                   // weekend reservation lift %
  dwell_time_lift_pct?: number;                            // dwell time lift %
  dwell_time_baseline_minutes?: number;                    // baseline dwell time in minutes
  dwell_time_event_minutes?: number;                       // dwell time on event nights in minutes
  // Brand & loyalty
  brand_differentiation_score?: number;                    // 0-100 brand differentiation
  brand_differentiation_baseline?: number;                 // baseline brand differentiation
  brand_differentiation_lift_pct?: number;                 // brand differentiation lift %
  customer_loyalty_score?: number;                         // 0-100 customer loyalty
  customer_loyalty_baseline?: number;                      // baseline loyalty
  customer_loyalty_lift_pct?: number;                      // loyalty lift %
  new_customer_acquisition_monthly?: number;               // new customers acquired via live music
  repeat_visit_lift_pct?: number;                          // repeat visit lift %
  // Operational impact
  food_sales_during_performance_pct?: number;              // food sales during performance vs baseline
  noise_complaints_monthly?: number;                       // noise complaints per month
  customer_satisfaction_score?: number;                    // 0-100 satisfaction
  customer_satisfaction_baseline?: number;                 // baseline satisfaction
  customer_satisfaction_lift_pct?: number;                 // satisfaction lift %
  // Competitive positioning
  competitors_with_live_music_pct?: number;                // % of nearby competitors with live music
  music_aware_lost_customers?: number;                     // customers lost due to lack of live music
  // Economics
  monthly_revenue?: number;                                // total restaurant monthly revenue
  live_music_program_setup_cost?: number;                  // one-time live music program setup cost
  live_music_program_monthly_cost?: number;                // monthly live music program cost (artist fees + sound)
  performance_marketing_monthly_cost?: number;             // monthly performance marketing cost
  live_music_program_total_monthly_cost?: number;          // monthly total live music program cost
  // Impact projections
  beverage_revenue_lift_projected_pct?: number;            // projected beverage revenue lift %
  weekend_reservation_lift_projected_pct?: number;         // projected weekend reservation lift %
  dwell_time_lift_projected_pct?: number;                  // projected dwell time lift %
  brand_differentiation_lift_projected_pct?: number;       // projected brand differentiation lift %
  new_customer_acquisition_projected_pct?: number;         // projected new customer acquisition lift %
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: LiveMusicPerformanceAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface LiveMusicPerformanceConfig {
  aiEnabled: boolean;
  requireWeekendLiveMusic: boolean;                          // require live music on Fri/Sat nights
  requireCorrectSchedule: boolean;                           // require performances after dinner rush
  requireMarketRateArtistBudget: boolean;                    // require artist budget at/above market rate
  requirePerformanceArea: boolean;                           // require proper stage/lighting/sound
  requireGenreMatch: boolean;                                // require genre-restaurant concept match
  requireDjNightForYoungDemo: boolean;                       // require DJ night if targeting young demographic
  requireOpenMicKaraokeForCommunity: boolean;                // require open mic/karaoke if community venue
  requirePerformancePromotion: boolean;                      // require active live music marketing
  minPerformanceTypes: number;                               // minimum # of distinct performance types (4)
  minAcousticSoloBudget: number;                             // minimum acoustic/solo budget per night ($150-400)
  minJazzTrioBandBudget: number;                             // minimum jazz trio/band budget per night ($400-1200)
  minDjBudget: number;                                       // minimum DJ budget per night ($200-600)
  minPerformanceAreaScore: number;                           // minimum performance area score (75)
  minGenreMatchScore: number;                                // minimum genre-concept match score (75)
  minBeverageLiftPct: number;                                // minimum beverage revenue lift % (25)
  minWeekendReservationLiftPct: number;                      // minimum weekend reservation lift % (30)
  minDwellTimeLiftPct: number;                               // minimum dwell time lift % (25)
  minPerformanceFillRatePct: number;                         // minimum performance fill rate % (60)
  minDjNightNewCustomerPct: number;                          // minimum DJ night new customer % (35)
  minOpenMicConversionPct: number;                           // minimum open mic/karaoke conversion % (20)
}

export const DEFAULT_LIVE_MUSIC_PERFORMANCE_CONFIG: LiveMusicPerformanceConfig = {
  aiEnabled: true,
  requireWeekendLiveMusic: true,
  requireCorrectSchedule: true,
  requireMarketRateArtistBudget: true,
  requirePerformanceArea: true,
  requireGenreMatch: true,
  requireDjNightForYoungDemo: true,
  requireOpenMicKaraokeForCommunity: true,
  requirePerformancePromotion: true,
  minPerformanceTypes: 4,
  minAcousticSoloBudget: 250,
  minJazzTrioBandBudget: 700,
  minDjBudget: 400,
  minPerformanceAreaScore: 75,
  minGenreMatchScore: 75,
  minBeverageLiftPct: 25,
  minWeekendReservationLiftPct: 30,
  minDwellTimeLiftPct: 25,
  minPerformanceFillRatePct: 60,
  minDjNightNewCustomerPct: 35,
  minOpenMicConversionPct: 20,
};

export const readLiveMusicPerformanceConfig = (settings: any): LiveMusicPerformanceConfig => ({
  aiEnabled: settings?.live_music_performance_ai_enabled ?? true,
  requireWeekendLiveMusic: settings?.live_music_performance_require_weekend ?? true,
  requireCorrectSchedule: settings?.live_music_performance_require_correct_schedule ?? true,
  requireMarketRateArtistBudget: settings?.live_music_performance_require_market_budget ?? true,
  requirePerformanceArea: settings?.live_music_performance_require_performance_area ?? true,
  requireGenreMatch: settings?.live_music_performance_require_genre_match ?? true,
  requireDjNightForYoungDemo: settings?.live_music_performance_require_dj_young ?? true,
  requireOpenMicKaraokeForCommunity: settings?.live_music_performance_require_open_mic_community ?? true,
  requirePerformancePromotion: settings?.live_music_performance_require_promotion ?? true,
  minPerformanceTypes: safeNumber(settings?.live_music_performance_min_types, 4),
  minAcousticSoloBudget: safeNumber(settings?.live_music_performance_min_acoustic_budget, 250),
  minJazzTrioBandBudget: safeNumber(settings?.live_music_performance_min_jazz_budget, 700),
  minDjBudget: safeNumber(settings?.live_music_performance_min_dj_budget, 400),
  minPerformanceAreaScore: safeNumber(settings?.live_music_performance_min_area_score, 75),
  minGenreMatchScore: safeNumber(settings?.live_music_performance_min_genre_score, 75),
  minBeverageLiftPct: safeNumber(settings?.live_music_performance_min_beverage_lift, 25),
  minWeekendReservationLiftPct: safeNumber(settings?.live_music_performance_min_reservation_lift, 30),
  minDwellTimeLiftPct: safeNumber(settings?.live_music_performance_min_dwell_lift, 25),
  minPerformanceFillRatePct: safeNumber(settings?.live_music_performance_min_fill_rate, 60),
  minDjNightNewCustomerPct: safeNumber(settings?.live_music_performance_min_dj_new_cust, 35),
  minOpenMicConversionPct: safeNumber(settings?.live_music_performance_min_open_mic_conv, 20),
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface LiveMusicPerformanceData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  has_live_music: boolean;
  has_weekend_live_music: boolean;
  has_acoustic_solo_nights: boolean;
  has_jazz_trio_band_nights: boolean;
  has_dj_nights: boolean;
  has_open_mic_nights: boolean;
  has_karaoke_nights: boolean;
  has_cultural_performances: boolean;
  performance_types_count: number;
  live_music_events_per_month: number;
  weekend_live_music_events_per_month: number;
  avg_performance_start_time: string;
  performance_starts_during_dinner_rush: boolean;
  performance_duration_minutes: number;
  performances_after_dinner_only: boolean;
  artist_budget_per_night: number;
  acoustic_solo_rate_market: number;
  jazz_trio_band_rate_market: number;
  dj_rate_market: number;
  budget_below_market: boolean;
  artist_quality_score: number;
  has_dedicated_stage: boolean;
  has_performance_lighting: boolean;
  has_professional_sound_system: boolean;
  has_monitor_speakers: boolean;
  has_microphones: boolean;
  has_sound_check_routine: boolean;
  performance_area_score: number;
  primary_music_genre: string;
  restaurant_concept: string;
  genre_concept_match_score: number;
  genre_matches_concept: boolean;
  target_demographic_age: string;
  targets_young_demographic: boolean;
  dj_nights_per_month: number;
  dj_night_new_customer_pct: number;
  open_mic_karaoke_nights_per_month: number;
  open_mic_karaoke_regular_conversion_pct: number;
  community_event_score: number;
  performances_promoted: boolean;
  performance_marketing_channels: number;
  performance_attendance_avg: number;
  performance_venue_capacity: number;
  performance_fill_rate_pct: number;
  beverage_revenue_lift_pct: number;
  beverage_revenue_baseline: number;
  beverage_revenue_event_night: number;
  weekend_reservation_lift_pct: number;
  dwell_time_lift_pct: number;
  dwell_time_baseline_minutes: number;
  dwell_time_event_minutes: number;
  brand_differentiation_score: number;
  brand_differentiation_baseline: number;
  brand_differentiation_lift_pct: number;
  customer_loyalty_score: number;
  customer_loyalty_baseline: number;
  customer_loyalty_lift_pct: number;
  new_customer_acquisition_monthly: number;
  repeat_visit_lift_pct: number;
  food_sales_during_performance_pct: number;
  noise_complaints_monthly: number;
  customer_satisfaction_score: number;
  customer_satisfaction_baseline: number;
  customer_satisfaction_lift_pct: number;
  competitors_with_live_music_pct: number;
  music_aware_lost_customers: number;
  monthly_revenue: number;
  live_music_program_setup_cost: number;
  live_music_program_monthly_cost: number;
  performance_marketing_monthly_cost: number;
  live_music_program_total_monthly_cost: number;
}

const MOCK_DATA: LiveMusicPerformanceData[] = [
  {
    location_id: 'main_dining', restaurant_tier: 'casual_dining', market_setting: 'urban',
    has_live_music: false, has_weekend_live_music: false, has_acoustic_solo_nights: false,
    has_jazz_trio_band_nights: false, has_dj_nights: false, has_open_mic_nights: false,
    has_karaoke_nights: false, has_cultural_performances: false, performance_types_count: 0,
    live_music_events_per_month: 0, weekend_live_music_events_per_month: 0,
    avg_performance_start_time: '', performance_starts_during_dinner_rush: false,
    performance_duration_minutes: 0, performances_after_dinner_only: false,
    artist_budget_per_night: 0, acoustic_solo_rate_market: 250, jazz_trio_band_rate_market: 700,
    dj_rate_market: 400, budget_below_market: false, artist_quality_score: 0,
    has_dedicated_stage: false, has_performance_lighting: false, has_professional_sound_system: false,
    has_monitor_speakers: false, has_microphones: false, has_sound_check_routine: false,
    performance_area_score: 0, primary_music_genre: 'none', restaurant_concept: 'american',
    genre_concept_match_score: 0, genre_matches_concept: false,
    target_demographic_age: '25-35', targets_young_demographic: true,
    dj_nights_per_month: 0, dj_night_new_customer_pct: 0,
    open_mic_karaoke_nights_per_month: 0, open_mic_karaoke_regular_conversion_pct: 0,
    community_event_score: 18, performances_promoted: false, performance_marketing_channels: 0,
    performance_attendance_avg: 0, performance_venue_capacity: 80, performance_fill_rate_pct: 0,
    beverage_revenue_lift_pct: 0, beverage_revenue_baseline: 9800, beverage_revenue_event_night: 0,
    weekend_reservation_lift_pct: 0, dwell_time_lift_pct: 0,
    dwell_time_baseline_minutes: 62, dwell_time_event_minutes: 0,
    brand_differentiation_score: 38, brand_differentiation_baseline: 38, brand_differentiation_lift_pct: 0,
    customer_loyalty_score: 54, customer_loyalty_baseline: 54, customer_loyalty_lift_pct: 0,
    new_customer_acquisition_monthly: 14, repeat_visit_lift_pct: 0,
    food_sales_during_performance_pct: 0, noise_complaints_monthly: 0,
    customer_satisfaction_score: 71, customer_satisfaction_baseline: 71, customer_satisfaction_lift_pct: 0,
    competitors_with_live_music_pct: 65, music_aware_lost_customers: 140,
    monthly_revenue: 118000, live_music_program_setup_cost: 0,
    live_music_program_monthly_cost: 0, performance_marketing_monthly_cost: 0,
    live_music_program_total_monthly_cost: 0,
  },
  {
    location_id: 'bar_lounge', restaurant_tier: 'casual_dining', market_setting: 'urban',
    has_live_music: true, has_weekend_live_music: true, has_acoustic_solo_nights: true,
    has_jazz_trio_band_nights: false, has_dj_nights: false, has_open_mic_nights: false,
    has_karaoke_nights: false, has_cultural_performances: false, performance_types_count: 1,
    live_music_events_per_month: 4, weekend_live_music_events_per_month: 4,
    avg_performance_start_time: '19:00', performance_starts_during_dinner_rush: true,
    performance_duration_minutes: 180, performances_after_dinner_only: false,
    artist_budget_per_night: 180, acoustic_solo_rate_market: 250, jazz_trio_band_rate_market: 700,
    dj_rate_market: 400, budget_below_market: true, artist_quality_score: 42,
    has_dedicated_stage: false, has_performance_lighting: false, has_professional_sound_system: false,
    has_monitor_speakers: false, has_microphones: true, has_sound_check_routine: false,
    performance_area_score: 38, primary_music_genre: 'rock', restaurant_concept: 'italian',
    genre_concept_match_score: 45, genre_matches_concept: false,
    target_demographic_age: '25-35', targets_young_demographic: true,
    dj_nights_per_month: 0, dj_night_new_customer_pct: 0,
    open_mic_karaoke_nights_per_month: 0, open_mic_karaoke_regular_conversion_pct: 0,
    community_event_score: 22, performances_promoted: false, performance_marketing_channels: 1,
    performance_attendance_avg: 28, performance_venue_capacity: 80, performance_fill_rate_pct: 35,
    beverage_revenue_lift_pct: 12, beverage_revenue_baseline: 9800, beverage_revenue_event_night: 10976,
    weekend_reservation_lift_pct: 8, dwell_time_lift_pct: 14,
    dwell_time_baseline_minutes: 62, dwell_time_event_minutes: 71,
    brand_differentiation_score: 48, brand_differentiation_baseline: 38, brand_differentiation_lift_pct: 26,
    customer_loyalty_score: 62, customer_loyalty_baseline: 54, customer_loyalty_lift_pct: 15,
    new_customer_acquisition_monthly: 22, repeat_visit_lift_pct: 9,
    food_sales_during_performance_pct: -12, noise_complaints_monthly: 4,
    customer_satisfaction_score: 74, customer_satisfaction_baseline: 71, customer_satisfaction_lift_pct: 4,
    competitors_with_live_music_pct: 65, music_aware_lost_customers: 80,
    monthly_revenue: 132000, live_music_program_setup_cost: 0,
    live_music_program_monthly_cost: 720, performance_marketing_monthly_cost: 0,
    live_music_program_total_monthly_cost: 720,
  },
  {
    location_id: 'outdoor_patio', restaurant_tier: 'fine_dining', market_setting: 'suburban',
    has_live_music: true, has_weekend_live_music: true, has_acoustic_solo_nights: true,
    has_jazz_trio_band_nights: true, has_dj_nights: true, has_open_mic_nights: false,
    has_karaoke_nights: false, has_cultural_performances: true, performance_types_count: 4,
    live_music_events_per_month: 8, weekend_live_music_events_per_month: 6,
    avg_performance_start_time: '21:00', performance_starts_during_dinner_rush: false,
    performance_duration_minutes: 150, performances_after_dinner_only: true,
    artist_budget_per_night: 650, acoustic_solo_rate_market: 250, jazz_trio_band_rate_market: 700,
    dj_rate_market: 400, budget_below_market: false, artist_quality_score: 78,
    has_dedicated_stage: true, has_performance_lighting: true, has_professional_sound_system: true,
    has_monitor_speakers: true, has_microphones: true, has_sound_check_routine: true,
    performance_area_score: 82, primary_music_genre: 'jazz', restaurant_concept: 'steakhouse',
    genre_concept_match_score: 88, genre_matches_concept: true,
    target_demographic_age: '35-50', targets_young_demographic: false,
    dj_nights_per_month: 2, dj_night_new_customer_pct: 32,
    open_mic_karaoke_nights_per_month: 0, open_mic_karaoke_regular_conversion_pct: 0,
    community_event_score: 42, performances_promoted: true, performance_marketing_channels: 3,
    performance_attendance_avg: 64, performance_venue_capacity: 100, performance_fill_rate_pct: 64,
    beverage_revenue_lift_pct: 32, beverage_revenue_baseline: 14200, beverage_revenue_event_night: 18744,
    weekend_reservation_lift_pct: 38, dwell_time_lift_pct: 28,
    dwell_time_baseline_minutes: 78, dwell_time_event_minutes: 100,
    brand_differentiation_score: 74, brand_differentiation_baseline: 52, brand_differentiation_lift_pct: 42,
    customer_loyalty_score: 80, customer_loyalty_baseline: 62, customer_loyalty_lift_pct: 29,
    new_customer_acquisition_monthly: 38, repeat_visit_lift_pct: 18,
    food_sales_during_performance_pct: 4, noise_complaints_monthly: 1,
    customer_satisfaction_score: 88, customer_satisfaction_baseline: 78, customer_satisfaction_lift_pct: 13,
    competitors_with_live_music_pct: 70, music_aware_lost_customers: 28,
    monthly_revenue: 248000, live_music_program_setup_cost: 18000,
    live_music_program_monthly_cost: 3200, performance_marketing_monthly_cost: 600,
    live_music_program_total_monthly_cost: 3800,
  },
  {
    location_id: 'private_event', restaurant_tier: 'fine_dining', market_setting: 'urban',
    has_live_music: true, has_weekend_live_music: true, has_acoustic_solo_nights: true,
    has_jazz_trio_band_nights: true, has_dj_nights: true, has_open_mic_nights: true,
    has_karaoke_nights: true, has_cultural_performances: true, performance_types_count: 7,
    live_music_events_per_month: 16, weekend_live_music_events_per_month: 8,
    avg_performance_start_time: '21:30', performance_starts_during_dinner_rush: false,
    performance_duration_minutes: 180, performances_after_dinner_only: true,
    artist_budget_per_night: 850, acoustic_solo_rate_market: 250, jazz_trio_band_rate_market: 700,
    dj_rate_market: 400, budget_below_market: false, artist_quality_score: 92,
    has_dedicated_stage: true, has_performance_lighting: true, has_professional_sound_system: true,
    has_monitor_speakers: true, has_microphones: true, has_sound_check_routine: true,
    performance_area_score: 94, primary_music_genre: 'jazz', restaurant_concept: 'fine_dining',
    genre_concept_match_score: 95, genre_matches_concept: true,
    target_demographic_age: '25-50', targets_young_demographic: true,
    dj_nights_per_month: 4, dj_night_new_customer_pct: 38,
    open_mic_karaoke_nights_per_month: 4, open_mic_karaoke_regular_conversion_pct: 24,
    community_event_score: 88, performances_promoted: true, performance_marketing_channels: 5,
    performance_attendance_avg: 92, performance_venue_capacity: 120, performance_fill_rate_pct: 77,
    beverage_revenue_lift_pct: 38, beverage_revenue_baseline: 18500, beverage_revenue_event_night: 25530,
    weekend_reservation_lift_pct: 44, dwell_time_lift_pct: 32,
    dwell_time_baseline_minutes: 82, dwell_time_event_minutes: 108,
    brand_differentiation_score: 92, brand_differentiation_baseline: 56, brand_differentiation_lift_pct: 64,
    customer_loyalty_score: 92, customer_loyalty_baseline: 62, customer_loyalty_lift_pct: 48,
    new_customer_acquisition_monthly: 68, repeat_visit_lift_pct: 26,
    food_sales_during_performance_pct: 6, noise_complaints_monthly: 0,
    customer_satisfaction_score: 95, customer_satisfaction_baseline: 78, customer_satisfaction_lift_pct: 22,
    competitors_with_live_music_pct: 75, music_aware_lost_customers: 8,
    monthly_revenue: 342000, live_music_program_setup_cost: 42000,
    live_music_program_monthly_cost: 6800, performance_marketing_monthly_cost: 1200,
    live_music_program_total_monthly_cost: 8000,
  },
];

export const runLiveMusicPerformanceEngine = async (
  db: ReturnType<typeof useDB>,
  config: LiveMusicPerformanceConfig,
): Promise<{ alerts: LiveMusicPerformanceAlert[]; generated: number }> => {
  const alerts: LiveMusicPerformanceAlert[] = [];
  const now = new Date();

  let data: LiveMusicPerformanceData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting,
              has_live_music, has_weekend_live_music, has_acoustic_solo_nights,
              has_jazz_trio_band_nights, has_dj_nights, has_open_mic_nights,
              has_karaoke_nights, has_cultural_performances, performance_types_count,
              live_music_events_per_month, weekend_live_music_events_per_month,
              avg_performance_start_time, performance_starts_during_dinner_rush,
              performance_duration_minutes, performances_after_dinner_only,
              artist_budget_per_night, acoustic_solo_rate_market, jazz_trio_band_rate_market,
              dj_rate_market, budget_below_market, artist_quality_score,
              has_dedicated_stage, has_performance_lighting, has_professional_sound_system,
              has_monitor_speakers, has_microphones, has_sound_check_routine,
              performance_area_score, primary_music_genre, restaurant_concept,
              genre_concept_match_score, genre_matches_concept,
              target_demographic_age, targets_young_demographic,
              dj_nights_per_month, dj_night_new_customer_pct,
              open_mic_karaoke_nights_per_month, open_mic_karaoke_regular_conversion_pct,
              community_event_score, performances_promoted, performance_marketing_channels,
              performance_attendance_avg, performance_venue_capacity, performance_fill_rate_pct,
              beverage_revenue_lift_pct, beverage_revenue_baseline, beverage_revenue_event_night,
              weekend_reservation_lift_pct, dwell_time_lift_pct,
              dwell_time_baseline_minutes, dwell_time_event_minutes,
              brand_differentiation_score, brand_differentiation_baseline, brand_differentiation_lift_pct,
              customer_loyalty_score, customer_loyalty_baseline, customer_loyalty_lift_pct,
              new_customer_acquisition_monthly, repeat_visit_lift_pct,
              food_sales_during_performance_pct, noise_complaints_monthly,
              customer_satisfaction_score, customer_satisfaction_baseline, customer_satisfaction_lift_pct,
              competitors_with_live_music_pct, music_aware_lost_customers,
              monthly_revenue, live_music_program_setup_cost, live_music_program_monthly_cost,
              performance_marketing_monthly_cost, live_music_program_total_monthly_cost
       FROM live_music_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): LiveMusicPerformanceData => ({
      location_id: String(r.location_id ?? 'main_dining'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      has_live_music: Boolean(r.has_live_music ?? false),
      has_weekend_live_music: Boolean(r.has_weekend_live_music ?? false),
      has_acoustic_solo_nights: Boolean(r.has_acoustic_solo_nights ?? false),
      has_jazz_trio_band_nights: Boolean(r.has_jazz_trio_band_nights ?? false),
      has_dj_nights: Boolean(r.has_dj_nights ?? false),
      has_open_mic_nights: Boolean(r.has_open_mic_nights ?? false),
      has_karaoke_nights: Boolean(r.has_karaoke_nights ?? false),
      has_cultural_performances: Boolean(r.has_cultural_performances ?? false),
      performance_types_count: safeNumber(r.performance_types_count, 0),
      live_music_events_per_month: safeNumber(r.live_music_events_per_month, 0),
      weekend_live_music_events_per_month: safeNumber(r.weekend_live_music_events_per_month, 0),
      avg_performance_start_time: String(r.avg_performance_start_time ?? ''),
      performance_starts_during_dinner_rush: Boolean(r.performance_starts_during_dinner_rush ?? false),
      performance_duration_minutes: safeNumber(r.performance_duration_minutes, 0),
      performances_after_dinner_only: Boolean(r.performances_after_dinner_only ?? false),
      artist_budget_per_night: safeNumber(r.artist_budget_per_night, 0),
      acoustic_solo_rate_market: safeNumber(r.acoustic_solo_rate_market, 250),
      jazz_trio_band_rate_market: safeNumber(r.jazz_trio_band_rate_market, 700),
      dj_rate_market: safeNumber(r.dj_rate_market, 400),
      budget_below_market: Boolean(r.budget_below_market ?? false),
      artist_quality_score: safeNumber(r.artist_quality_score, 0),
      has_dedicated_stage: Boolean(r.has_dedicated_stage ?? false),
      has_performance_lighting: Boolean(r.has_performance_lighting ?? false),
      has_professional_sound_system: Boolean(r.has_professional_sound_system ?? false),
      has_monitor_speakers: Boolean(r.has_monitor_speakers ?? false),
      has_microphones: Boolean(r.has_microphones ?? false),
      has_sound_check_routine: Boolean(r.has_sound_check_routine ?? false),
      performance_area_score: safeNumber(r.performance_area_score, 0),
      primary_music_genre: String(r.primary_music_genre ?? 'none'),
      restaurant_concept: String(r.restaurant_concept ?? 'american'),
      genre_concept_match_score: safeNumber(r.genre_concept_match_score, 0),
      genre_matches_concept: Boolean(r.genre_matches_concept ?? false),
      target_demographic_age: String(r.target_demographic_age ?? '25-50'),
      targets_young_demographic: Boolean(r.targets_young_demographic ?? false),
      dj_nights_per_month: safeNumber(r.dj_nights_per_month, 0),
      dj_night_new_customer_pct: safeNumber(r.dj_night_new_customer_pct, 0),
      open_mic_karaoke_nights_per_month: safeNumber(r.open_mic_karaoke_nights_per_month, 0),
      open_mic_karaoke_regular_conversion_pct: safeNumber(r.open_mic_karaoke_regular_conversion_pct, 0),
      community_event_score: safeNumber(r.community_event_score, 0),
      performances_promoted: Boolean(r.performances_promoted ?? false),
      performance_marketing_channels: safeNumber(r.performance_marketing_channels, 0),
      performance_attendance_avg: safeNumber(r.performance_attendance_avg, 0),
      performance_venue_capacity: safeNumber(r.performance_venue_capacity, 0),
      performance_fill_rate_pct: safeNumber(r.performance_fill_rate_pct, 0),
      beverage_revenue_lift_pct: safeNumber(r.beverage_revenue_lift_pct, 0),
      beverage_revenue_baseline: safeNumber(r.beverage_revenue_baseline, 0),
      beverage_revenue_event_night: safeNumber(r.beverage_revenue_event_night, 0),
      weekend_reservation_lift_pct: safeNumber(r.weekend_reservation_lift_pct, 0),
      dwell_time_lift_pct: safeNumber(r.dwell_time_lift_pct, 0),
      dwell_time_baseline_minutes: safeNumber(r.dwell_time_baseline_minutes, 0),
      dwell_time_event_minutes: safeNumber(r.dwell_time_event_minutes, 0),
      brand_differentiation_score: safeNumber(r.brand_differentiation_score, 0),
      brand_differentiation_baseline: safeNumber(r.brand_differentiation_baseline, 0),
      brand_differentiation_lift_pct: safeNumber(r.brand_differentiation_lift_pct, 0),
      customer_loyalty_score: safeNumber(r.customer_loyalty_score, 0),
      customer_loyalty_baseline: safeNumber(r.customer_loyalty_baseline, 0),
      customer_loyalty_lift_pct: safeNumber(r.customer_loyalty_lift_pct, 0),
      new_customer_acquisition_monthly: safeNumber(r.new_customer_acquisition_monthly, 0),
      repeat_visit_lift_pct: safeNumber(r.repeat_visit_lift_pct, 0),
      food_sales_during_performance_pct: safeNumber(r.food_sales_during_performance_pct, 0),
      noise_complaints_monthly: safeNumber(r.noise_complaints_monthly, 0),
      customer_satisfaction_score: safeNumber(r.customer_satisfaction_score, 0),
      customer_satisfaction_baseline: safeNumber(r.customer_satisfaction_baseline, 0),
      customer_satisfaction_lift_pct: safeNumber(r.customer_satisfaction_lift_pct, 0),
      competitors_with_live_music_pct: safeNumber(r.competitors_with_live_music_pct, 0),
      music_aware_lost_customers: safeNumber(r.music_aware_lost_customers, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      live_music_program_setup_cost: safeNumber(r.live_music_program_setup_cost, 0),
      live_music_program_monthly_cost: safeNumber(r.live_music_program_monthly_cost, 0),
      performance_marketing_monthly_cost: safeNumber(r.performance_marketing_monthly_cost, 0),
      live_music_program_total_monthly_cost: safeNumber(r.live_music_program_total_monthly_cost, 0),
    }));
  } catch { data = []; }
  if (data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const baselineSpend = 32.00;
    const monthlyOrders = Math.round(baselineRevenue / baselineSpend);
    const targetBeverageLiftPct = 32; // midpoint of 25-40% beverage lift (NRA)
    const targetWeekendReservationLiftPct = 38; // midpoint of 30-45% (OpenTable)
    const targetDwellTimeLiftPct = 32; // 58% of customers extend stay (Cornell CHR)
    const targetBrandDifferentiationLiftPct = 42; // live music drives 42% brand differentiation
    const targetNewCustomerAcquisitionLiftPct = 35; // DJ nights 35% new acquisition
    const targetRepeatVisitLiftPct = 22; // open mic/karaoke drives repeat visits
    const avgAcousticRevenuePerNight = 2750; // midpoint of $1,500-4,000 acoustic revenue
    const avgAcousticCostPerNight = 275; // midpoint of $150-400 acoustic cost
    const avgJazzRevenuePerNight = 4200; // jazz trios drive higher revenue
    const avgJazzCostPerNight = 800; // midpoint of $400-1,200 jazz cost

    // Rule 1: LIVE_MUSIC_ABSENT_WEEKEND_VENUE
    if (config.requireWeekendLiveMusic && !d.has_weekend_live_music) {
      // No live music on weekends -> missed 25-40% beverage + 30-45% reservation boost
      const expectedWeekendEventsPerMonth = 4; // Fri + Sat for 2 weekends
      const expectedBeverageLiftPct = targetBeverageLiftPct;
      const expectedReservationLiftPct = targetWeekendReservationLiftPct;
      const expectedDwellTimeLiftPct = targetDwellTimeLiftPct;
      const expectedBeverageRevenue = Math.round(d.beverage_revenue_baseline * (expectedBeverageLiftPct / 100) * expectedWeekendEventsPerMonth);
      const reservationRevenue = Math.round(baselineRevenue * 0.4 * (expectedReservationLiftPct / 100) * 0.5);
      const dwellTimeRevenue = Math.round(baselineRevenue * 0.1 * (expectedDwellTimeLiftPct / 100));
      const lostCustomerRevenue = Math.round(d.music_aware_lost_customers * baselineSpend * 0.4);
      const totalOpportunity = Math.max(expectedBeverageRevenue + reservationRevenue + dwellTimeRevenue + lostCustomerRevenue, 2400);
      const criticalNote = (d.restaurant_tier === 'fine_dining')
        ? 'CRITICAL: NO WEEKEND LIVE MUSIC — fine dining restaurant with no live music programming on weekends. Restaurants with live music see 30-45% higher weekend reservation rates (OpenTable). Live music increases beverage sales 25-40% on event nights (NRA). '
        : 'HIGH: no weekend live music — missed beverage + reservation boost. ';
      alerts.push({
        rule_id: 'live_music_absent_weekend_venue',
        severity: d.restaurant_tier === 'fine_dining' ? 'critical' : 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_live_music: d.has_live_music,
        has_weekend_live_music: d.has_weekend_live_music,
        performance_types_count: d.performance_types_count,
        weekend_live_music_events_per_month: d.weekend_live_music_events_per_month,
        beverage_revenue_lift_pct: d.beverage_revenue_lift_pct,
        beverage_revenue_baseline: d.beverage_revenue_baseline,
        weekend_reservation_lift_pct: d.weekend_reservation_lift_pct,
        dwell_time_lift_pct: d.dwell_time_lift_pct,
        brand_differentiation_score: d.brand_differentiation_score,
        brand_differentiation_baseline: d.brand_differentiation_baseline,
        customer_loyalty_score: d.customer_loyalty_score,
        competitors_with_live_music_pct: d.competitors_with_live_music_pct,
        music_aware_lost_customers: d.music_aware_lost_customers,
        monthly_revenue: d.monthly_revenue,
        live_music_program_setup_cost: d.live_music_program_setup_cost,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        beverage_revenue_lift_projected_pct: targetBeverageLiftPct,
        weekend_reservation_lift_projected_pct: targetWeekendReservationLiftPct,
        dwell_time_lift_projected_pct: targetDwellTimeLiftPct,
        brand_differentiation_lift_projected_pct: targetBrandDifferentiationLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `LIVE MUSIC ABSENT WEEKEND VENUE: ${d.location_id} — this ${d.restaurant_tier} restaurant has no live music on weekends. ${criticalNote}Industry data: live music increases beverage sales 25-40% on event nights (NRA); restaurants with live music see 30-45% higher weekend reservation rates (OpenTable); 58% of customers extend their stay for live music performances (Cornell CHR); live music is the #1 weekend traffic driver for casual + fine dining; live music differentiates from chain competitors (independent restaurants 4x more likely to host live music); live music attracts destination diners (willing to travel 20+ minutes); live music builds venue brand (becomes known for music + food); live music creates Instagram content (performance clips); live music drives beverage attach rate (cocktails + wine + beer); live music increases dwell time (15-30 min longer); live music attracts couples + groups; live music should be scheduled Fri + Sat nights (highest traffic); live music should start at 21:00 (after dinner rush); live music should run 2-3 hours per night; live music should be weekly (consistency builds audience); live music should rotate genres (acoustic, jazz, solo) for variety; live music should be promoted via social media + email + website; live music should have dedicated performance area (stage + lighting + sound); live music should book artists 30-60 days in advance; live music should pay market rate ($150-1,200 per night based on act); live music should have sound check 1 hour before performance; live music should be photographed + video recorded for marketing; live music should have tip jar for performers (extra income); live music should have drink special promotion during performance. Solutions ranked by impact: (1) LAUNCH weekend live music program (4 events/mo, Fri+Sat nights, 21:00 start) — revenue ${fmt$(expectedBeverageRevenue)}/mo beverage lift + ${fmt$(reservationRevenue)}/mo reservation lift; cost ${fmt$(d.live_music_program_setup_cost + 8000)} one-time stage/sound setup + ${fmt$(expectedWeekendEventsPerMonth * avgAcousticCostPerNight)}/mo artist fees; payback 4-8 months; (2) SCHEDULE Fri + Sat nights (highest traffic) — revenue maximization; (3) START at 21:00 (after dinner rush) — protects food sales; (4) RUN 2-3 hours per night — engagement; (5) BOOK weekly (consistency builds audience) — loyalty; (6) ROTATE genres (acoustic, jazz, solo) — variety; (7) BOOK artists 30-60 days in advance — quality; (8) PAY market rate ($150-1,200/night based on act) — quality performers; (9) BUILD dedicated performance area (stage + lighting + sound) — quality; (10) SOUND CHECK 1 hour before performance — quality; (11) PROMOTE via social media + email + website — turnout; (12) PHOTOGRAPH + video record for marketing — content; (13) ADD tip jar for performers — performer income; (14) RUN drink special promotion during performance — beverage attach; (15) TARGET couples + groups + destination diners — audience. Industry data: 25-40% beverage lift (NRA); 30-45% weekend reservation lift (OpenTable); 58% extend stay (Cornell CHR); $150-1,200/night artist cost; $1,500-4,000 revenue per night; payback 4-8 months. Expected impact: +${targetBeverageLiftPct}% beverage revenue, +${targetWeekendReservationLiftPct}% weekend reservations, +${targetDwellTimeLiftPct}% dwell time, +${targetBrandDifferentiationLiftPct}% brand differentiation, +${fmt$(expectedBeverageRevenue)}/mo beverage revenue, +${fmt$(reservationRevenue)}/mo reservation revenue, +${fmt$(dwellTimeRevenue)}/mo dwell revenue, +${fmt$(lostCustomerRevenue)}/mo recovered lost customers, payback 4-8 months.`,
        ai_recommendation: 'launch_weekend_live_music_program',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: PERFORMANCE_SCHEDULE_WRONG
    if (config.requireCorrectSchedule && d.has_live_music && d.performance_starts_during_dinner_rush) {
      // Music during dinner rush instead of after -> 15-20% food sales reduction
      const foodSalesLossPct = 18; // midpoint of 15-20% food sales reduction
      const expectedFoodSalesRecovery = Math.round(baselineRevenue * 0.5 * (foodSalesLossPct / 100));
      const expectedBeverageLiftRevenue = Math.round(d.beverage_revenue_baseline * (targetBeverageLiftPct / 100) * 0.4);
      const expectedSatisfactionLift = 14;
      const totalOpportunity = Math.max(expectedFoodSalesRecovery + expectedBeverageLiftRevenue, 1600);
      const criticalNote = (d.restaurant_tier === 'fine_dining')
        ? 'CRITICAL: PERFORMANCE SCHEDULED DURING DINNER RUSH — fine dining restaurant with live music starting during peak dinner hours. Poor scheduling (loud band during dinner rush) reduces food sales 15-20%. Move performance start to 21:00+ to protect food sales. '
        : 'HIGH: performance scheduled during dinner rush — food sales reduced 15-20%. ';
      alerts.push({
        rule_id: 'performance_schedule_wrong',
        severity: d.restaurant_tier === 'fine_dining' ? 'critical' : 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_live_music: d.has_live_music,
        avg_performance_start_time: d.avg_performance_start_time,
        performance_starts_during_dinner_rush: d.performance_starts_during_dinner_rush,
        performances_after_dinner_only: d.performances_after_dinner_only,
        performance_duration_minutes: d.performance_duration_minutes,
        food_sales_during_performance_pct: d.food_sales_during_performance_pct,
        beverage_revenue_lift_pct: d.beverage_revenue_lift_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        customer_satisfaction_baseline: d.customer_satisfaction_baseline,
        noise_complaints_monthly: d.noise_complaints_monthly,
        monthly_revenue: d.monthly_revenue,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        beverage_revenue_lift_projected_pct: targetBeverageLiftPct,
        dwell_time_lift_projected_pct: targetDwellTimeLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PERFORMANCE SCHEDULE WRONG: ${d.location_id} — this ${d.restaurant_tier} restaurant has live music starting at ${d.avg_performance_start_time} (during dinner rush). ${criticalNote}Industry data: poor scheduling (loud band during dinner rush) reduces food sales 15-20%; dinner rush is 18:00-20:30 — loudest + busiest time; live music during dinner rush disrupts table conversation; live music during dinner rush slows table turnover (diners stay longer to listen); live music during dinner rush reduces food order accuracy (staff cannot hear); live music during dinner rush reduces order taking speed (ambient noise); live music during dinner rush increases customer complaints (cannot converse); live music should start at 21:00+ (after dinner rush); live music should run 21:00-23:30 (2.5 hour set); live music should have 15-minute breaks between sets (kitchen reset); live music should not exceed 75-85 dB during dinner (conversation-friendly); live music can be 85-95 dB after 21:00 (louder acceptable); live music should have ambient background during dinner (acoustic instrumental); live music should transition to fuller performance after 21:00; live music should be marketed as "after-dinner show"; live music should have dedicated after-dinner seating area (bar/lounge); live music should have separate drink menu (cocktails + bottles); live music should have table reservation system for performance area; live music should have late-night menu (small plates); live music should have cover charge after 21:00 ($5-15); live music should have VIP table service (bottle service); live music should be coordinated with kitchen close (last call + last kitchen order). Solutions ranked by impact: (1) MOVE performance start to 21:00 (after dinner rush) — recovers ${fmt$(expectedFoodSalesRecovery)}/mo food sales; cost $0 (schedule change); payback immediate; (2) RUN 21:00-23:30 set (2.5 hours) — engagement; (3) ADD 15-minute breaks between sets — kitchen reset; (4) LIMIT volume to 75-85 dB during dinner — conversation; (5) TRANSITION to fuller performance after 21:00 — experience; (6) MARKET as after-dinner show — positioning; (7) ADD dedicated after-dinner seating (bar/lounge) — capacity; (8) CREATE separate drink menu (cocktails + bottles) — beverage attach; (9) ADD table reservation system for performance area — management; (10) ADD late-night menu (small plates) — food revenue; (11) ADD cover charge after 21:00 ($5-15) — revenue; (12) ADD VIP table service (bottle service) — premium revenue; (13) COORDINATE with kitchen close (last call + last order) — operations; (14) PLAY ambient background during dinner (acoustic instrumental) — atmosphere; (15) REDUCE noise complaints by 80%+ with proper scheduling — satisfaction. Industry data: 15-20% food sales reduction from poor scheduling; 21:00+ start protects food sales; 2.5 hour set optimal; 75-85 dB conversation-friendly; cover charge $5-15; payback immediate. Expected impact: +${foodSalesLossPct}% food sales recovery, +${targetBeverageLiftPct}% beverage revenue, +${expectedSatisfactionLift}% satisfaction, +${fmt$(expectedFoodSalesRecovery)}/mo food sales recovery, +${fmt$(expectedBeverageLiftRevenue)}/mo beverage lift, payback immediate.`,
        ai_recommendation: 'reschedule_performances_post_dinner',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: ARTIST_BUDGET_TOO_LOW
    if (config.requireMarketRateArtistBudget && d.has_live_music && (d.budget_below_market || d.artist_budget_per_night < d.acoustic_solo_rate_market)) {
      // Booking budget below market rate -> low-quality performers -> poor experience
      const budgetGap = Math.max(d.acoustic_solo_rate_market - d.artist_budget_per_night, 0);
      const expectedEventsPerMonth = Math.max(d.live_music_events_per_month, 4);
      const additionalBudgetNeeded = budgetGap * expectedEventsPerMonth;
      const expectedRevenueLiftPct = 35; // better performers = 35% higher revenue
      const expectedRevenueLift = Math.round((d.beverage_revenue_baseline * (targetBeverageLiftPct / 100) * expectedEventsPerMonth) * 0.3);
      const expectedQualityLift = 32;
      const totalOpportunity = Math.max(expectedRevenueLift - additionalBudgetNeeded, 1200);
      alerts.push({
        rule_id: 'artist_budget_too_low',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_live_music: d.has_live_music,
        artist_budget_per_night: d.artist_budget_per_night,
        acoustic_solo_rate_market: d.acoustic_solo_rate_market,
        jazz_trio_band_rate_market: d.jazz_trio_band_rate_market,
        dj_rate_market: d.dj_rate_market,
        budget_below_market: d.budget_below_market,
        artist_quality_score: d.artist_quality_score,
        live_music_events_per_month: d.live_music_events_per_month,
        beverage_revenue_lift_pct: d.beverage_revenue_lift_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        beverage_revenue_lift_projected_pct: targetBeverageLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ARTIST BUDGET TOO LOW: ${d.location_id} — this ${d.restaurant_tier} restaurant pays ${fmt$(d.artist_budget_per_night)}/night for live music but market rate is ${fmt$(d.acoustic_solo_rate_market)}/night for acoustic/solo acts (or ${fmt$(d.jazz_trio_band_rate_market)}/night for jazz trios/bands, ${fmt$(d.dj_rate_market)}/night for DJs). HIGH: ARTIST BUDGET BELOW MARKET RATE — paying below market attracts low-quality performers. Industry data: acoustic/solo acts cost $150-400/night (market rate $250 average); jazz trios/bands cost $400-1,200/night (market rate $700 average); DJs cost $200-600/night (market rate $400 average); below-market budget attracts amateur + beginner performers; amateur performers deliver poor sound quality + low engagement; amateur performers have limited repertoire + covers only; amateur performers do not draw audience (no fan base); amateur performers cancel frequently (less reliable); amateur performers lack professional equipment; amateur performers lack stage presence; amateur performers damage venue reputation (one bad night = bad reviews); professional performers draw audience (fan base + social following); professional performers deliver consistent quality; professional performers have professional equipment; professional performers have stage presence + audience engagement; professional performers book 30-60 days in advance; professional performers have contract + rider (technical requirements); professional performers promote via their own social media (free marketing); professional performers attract repeat customers (fans follow them); professional performers can charge cover ($10-25); professional performers can sell merchandise (CDs, vinyl); professional performers build venue brand (destination venue); paying market rate attracts professional performers; paying 10-20% above market attracts top talent (premium positioning); long-term residency deals (3-6 months) lock in performers at favorable rates; multi-act bookings (acoustic solo + jazz trio + DJ rotation) provide variety at market rates; pay performers via check + 1099 for tax compliance; provide performers with meal + drinks (value add $30-50/night); provide performers with green room (dressing area); provide performers with tip jar (additional $50-200/night); provide performers with merchandise table (additional revenue). Solutions ranked by impact: (1) INCREASE artist budget to market rate (${fmt$(d.acoustic_solo_rate_market)}/night for acoustic/solo, ${fmt$(d.jazz_trio_band_rate_market)}/night for jazz trio/band, ${fmt$(d.dj_rate_market)}/night for DJ) — additional ${fmt$(additionalBudgetNeeded)}/mo budget; revenue lift ${fmt$(expectedRevenueLift)}/mo; payback 1-2 months; (2) PAY 10-20% above market for top talent — premium positioning; (3) BOOK 30-60 days in advance — quality + reliability; (4) SIGN long-term residency deals (3-6 months) — favorable rates + loyalty; (5) ROTATE multiple acts (acoustic + jazz + DJ) — variety at market rates; (6) REQUIRE professional contract + rider — clarity; (7) REQUIRE professional equipment — quality; (8) REQUIRE stage presence + audience engagement — experience; (9) REQUIRE social media promotion by performer — free marketing; (10) PAY via check + 1099 — tax compliance; (11) PROVIDE meal + drinks (value add $30-50/night) — performer loyalty; (12) PROVIDE green room (dressing area) — performer comfort; (13) PROVIDE tip jar (additional $50-200/night) — performer income; (14) PROVIDE merchandise table — additional revenue; (15) CHARGE cover ($10-25) for premium acts — revenue offset. Industry data: $150-400 acoustic/solo; $400-1,200 jazz trio/band; $200-600 DJ; 35% revenue lift from better performers; 32% quality lift; payback 1-2 months. Expected impact: +${expectedRevenueLiftPct}% revenue lift from better performers, +${expectedQualityLift}% artist quality, +${fmt$(expectedRevenueLift)}/mo revenue, additional ${fmt$(additionalBudgetNeeded)}/mo budget, payback 1-2 months.`,
        ai_recommendation: 'increase_artist_booking_budget',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: PERFORMANCE_AREA_INADEQUATE
    if (config.requirePerformanceArea && d.has_live_music && d.performance_area_score < config.minPerformanceAreaScore) {
      // No proper stage/lighting/sound setup -> performers struggle + customers cannot see/hear
      const expectedSatisfactionLift = 22;
      const expectedBeverageLift = Math.round(d.beverage_revenue_baseline * (targetBeverageLiftPct / 100) * 0.3);
      const expectedAttendanceLift = Math.round(d.performance_attendance_avg * 0.4);
      const expectedFillRateRevenue = Math.round(expectedAttendanceLift * baselineSpend * 4);
      const setupCost = 12000;
      const totalOpportunity = Math.max(expectedBeverageLift + expectedFillRateRevenue, 2200);
      alerts.push({
        rule_id: 'performance_area_inadequate',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_live_music: d.has_live_music,
        has_dedicated_stage: d.has_dedicated_stage,
        has_performance_lighting: d.has_performance_lighting,
        has_professional_sound_system: d.has_professional_sound_system,
        has_monitor_speakers: d.has_monitor_speakers,
        has_microphones: d.has_microphones,
        has_sound_check_routine: d.has_sound_check_routine,
        performance_area_score: d.performance_area_score,
        artist_quality_score: d.artist_quality_score,
        performance_attendance_avg: d.performance_attendance_avg,
        performance_venue_capacity: d.performance_venue_capacity,
        performance_fill_rate_pct: d.performance_fill_rate_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        live_music_program_setup_cost: d.live_music_program_setup_cost,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        brand_differentiation_lift_projected_pct: targetBrandDifferentiationLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PERFORMANCE AREA INADEQUATE: ${d.location_id} — this ${d.restaurant_tier} restaurant has live music but the performance area scores ${d.performance_area_score}/100 (target ${config.minPerformanceAreaScore}+). MEDIUM: PERFORMANCE AREA INADEQUATE — no proper stage/lighting/sound setup. Performance area setup (stage, lighting, sound) affects both performer quality and customer experience. Industry data: dedicated stage increases audience engagement 35-45%; performance lighting increases visual quality 40-50%; professional sound system increases audio quality 50-60%; monitor speakers (for performers) improve performance quality 25-35%; vocal + instrument microphones ensure clear audio capture; sound check routine reduces technical issues 80%+; performance area score combines stage + lighting + sound + monitor + mic + soundcheck; performance area should have raised stage (12-24 inches for visibility); performance area should have dedicated lighting (spotlights + accent + ambient); performance area should have professional sound system (mixer + main speakers + subwoofer); performance area should have monitor speakers (for performers to hear themselves); performance area should have vocal microphones (Shure SM58 standard); performance area should have instrument microphones + DI boxes (guitar, bass, keys); performance area should have sound check routine (1 hour before performance); performance area should have dedicated power circuits (15A+ for sound equipment); performance area should have audio engineer (mixing during performance); performance area should have cable management (no tripping hazards); performance area should have stage monitors (floor wedges); performance area should have in-ear monitor system (premium); performance area should have drum shield (for loud drummers); performance area should have backdrop + branding (visual identity); performance area should have stage curtain (entrance + exit drama); performance area should have risers for backline (drum kit elevated); performance area should have stage plot + input list (advance planning with performer); performance area should be acoustically treated (panels + bass traps + diffusers); performance area should have video recording setup (camera + tripod for marketing content); performance area should have photo area for performer meet + greet. Solutions ranked by impact: (1) BUILD dedicated performance area with raised stage (12-24 inches), performance lighting, professional sound system — revenue ${fmt$(expectedBeverageLift)}/mo beverage lift + ${fmt$(expectedFillRateRevenue)}/mo attendance lift; cost ${fmt$(setupCost)} one-time setup; payback 6-12 months; (2) INSTALL performance lighting (spotlights + accent + ambient) — visual quality +40%; (3) INSTALL professional sound system (mixer + main speakers + subwoofer) — audio quality +60%; (4) ADD monitor speakers (floor wedges) — performer quality +35%; (5) ADD vocal microphones (Shure SM58) — clear vocals; (6) ADD instrument microphones + DI boxes — clear instruments; (7) IMPLEMENT sound check routine (1 hour before) — reduce issues 80%; (8) ADD dedicated power circuits (15A+) — safety + capacity; (9) HIRE audio engineer for mixing — quality; (10) MANAGE cables (no tripping hazards) — safety; (11) ADD stage monitors (floor wedges) — performer quality; (12) ADD in-ear monitor system (premium) — pro quality; (13) ADD drum shield (for loud drummers) — volume control; (14) ADD backdrop + branding — visual identity; (15) ADD acoustic treatment (panels + bass traps + diffusers) — sound quality. Industry data: 35-45% engagement lift from dedicated stage; 40-50% visual quality from lighting; 50-60% audio quality from professional sound; 25-35% performer quality from monitor speakers; 80% fewer issues from sound check; payback 6-12 months. Expected impact: +${expectedSatisfactionLift}% customer satisfaction, +${targetBeverageLiftPct}% beverage revenue, +40% attendance lift, +${fmt$(expectedBeverageLift)}/mo beverage revenue, +${fmt$(expectedFillRateRevenue)}/mo attendance revenue, payback 6-12 months.`,
        ai_recommendation: 'build_proper_performance_area',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: GENRE_RESTAURANT_MISMATCH
    if (config.requireGenreMatch && d.has_live_music && !d.genre_matches_concept && d.genre_concept_match_score < config.minGenreMatchScore) {
      // Wrong music genre for restaurant concept (metal in fine dining)
      const expectedSatisfactionLift = 28;
      const expectedBeverageLift = Math.round(d.beverage_revenue_baseline * (targetBeverageLiftPct / 100) * 0.3);
      const expectedBrandLift = 22;
      const lostCustomerRevenue = Math.round(d.music_aware_lost_customers * baselineSpend * 0.3);
      const totalOpportunity = Math.max(expectedBeverageLift + lostCustomerRevenue, 1400);
      alerts.push({
        rule_id: 'genre_restaurant_mismatch',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_live_music: d.has_live_music,
        primary_music_genre: d.primary_music_genre,
        restaurant_concept: d.restaurant_concept,
        genre_concept_match_score: d.genre_concept_match_score,
        genre_matches_concept: d.genre_matches_concept,
        customer_satisfaction_score: d.customer_satisfaction_score,
        customer_satisfaction_baseline: d.customer_satisfaction_baseline,
        brand_differentiation_score: d.brand_differentiation_score,
        music_aware_lost_customers: d.music_aware_lost_customers,
        monthly_revenue: d.monthly_revenue,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        brand_differentiation_lift_projected_pct: targetBrandDifferentiationLiftPct,
        beverage_revenue_lift_projected_pct: targetBeverageLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `GENRE RESTAURANT MISMATCH: ${d.location_id} — this ${d.restaurant_tier} restaurant (concept: ${d.restaurant_concept}) features ${d.primary_music_genre} music which scores ${d.genre_concept_match_score}/100 match (target ${config.minGenreMatchScore}+). MEDIUM: GENRE RESTAURANT MISMATCH — wrong music genre for restaurant concept. Genre-concept mismatch confuses customers + reduces satisfaction. Industry data: genre-concept match increases satisfaction 25-35%; genre-concept mismatch reduces dwell time 15-25%; genre-concept mismatch reduces repeat visits 20-30%; italian restaurants pair with jazz + classical + italian folk; mexican restaurants pair with mariachi + latin jazz + acoustic spanish; steakhouse restaurants pair with jazz + blues + classic rock; sushi restaurants pair with lo-fi + ambient + jazz; french restaurants pair with jazz + chanson + classical; indian restaurants pair with sitar + ambient + fusion; seafood restaurants pair with acoustic + jazz + coastal; bbq restaurants pair with blues + country + rock; cocktail bar pairs with jazz + lounge + electronic; craft beer bar pairs with indie rock + folk + bluegrass; wine bar pairs with jazz + classical + acoustic; nightclub pairs with electronic + DJ + dance; metal in fine dining is mismatch (loud + aggressive vs refined + calm); country in sushi is mismatch (rustic vs minimal); punk in cocktail bar can work (edgy + sophisticated); classical in bbq is mismatch (refined vs casual); EDM in steakhouse can work (modern + upscale); cover bands in fine dining is mismatch (amateur vs refined); original music in casual dining can work (authentic + local); genre-concept match should consider tempo (slow for fine dining, faster for casual); genre-concept match should consider volume (low for fine dining, higher for bar); genre-concept match should consider demographics (match to target customer age); genre-concept match should consider time of day (instrumental during dinner, fuller after 21:00); genre rotation should be coherent (jazz night, blues night, latin night — not random); genre should be marketed (themed nights attract audience); genre should match menu (tasting menu + classical, tapas + flamenco). Solutions ranked by impact: (1) ALIGN music genre to restaurant concept — revenue ${fmt$(expectedBeverageLift)}/mo + ${fmt$(lostCustomerRevenue)}/mo recovered customers; cost $0 (genre change); payback immediate; (2) MATCH genre to concept (italian+jazz, mexican+mariachi, steakhouse+blues, sushi+lo-fi, french+chanson, indian+sitar, seafood+acoustic, bbq+blues, cocktail bar+lounge, craft beer+indie, wine bar+classical, nightclub+EDM); (3) CONSIDER tempo (slow for fine dining, faster for casual) — atmosphere; (4) CONSIDER volume (low for fine dining, higher for bar) — conversation; (5) CONSIDER demographics (match to target customer age) — audience; (6) CONSIDER time of day (instrumental during dinner, fuller after 21:00) — pacing; (7) ROTATE coherently (jazz night, blues night, latin night) — themed; (8) MARKET genre themes (attract audience) — turnout; (9) MATCH genre to menu (tasting menu + classical, tapas + flamenco) — experience; (10) AVOID mismatches (metal in fine dining, country in sushi, classical in bbq) — clarity; (11) BOOK acts that match concept (jazz trio for steakhouse, flamenco for spanish) — quality; (12) CURATE playlist for non-live hours (matches concept) — consistency; (13) TRAIN staff on genre-concept (recommend wines that pair with music) — upsell; (14) THEME menu around genre (jazz night + craft cocktails, blues night + bbq) — revenue; (15) COLLABORATE with local music schools (genre-specific performers) — quality. Industry data: 25-35% satisfaction lift from genre-concept match; 15-25% dwell time reduction from mismatch; 20-30% repeat visit reduction from mismatch; payback immediate. Expected impact: +${expectedSatisfactionLift}% customer satisfaction, +${expectedBrandLift}% brand differentiation, +${targetBeverageLiftPct}% beverage revenue, +${fmt$(expectedBeverageLift)}/mo beverage revenue, +${fmt$(lostCustomerRevenue)}/mo recovered lost customers, payback immediate.`,
        ai_recommendation: 'align_genre_to_restaurant_concept',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: DJ_NIGHT_ABSENT_YOUNG_DEMOGRAPHIC
    if (config.requireDjNightForYoungDemo && d.targets_young_demographic && !d.has_dj_nights) {
      // No DJ night in restaurant targeting young customers -> missed 35% acquisition
      const expectedDjNightsPerMonth = 4;
      const expectedNewCustomerPct = targetNewCustomerAcquisitionLiftPct;
      const expectedNewCustomers = Math.round(d.performance_venue_capacity * (expectedNewCustomerPct / 100) * expectedDjNightsPerMonth);
      const newCustomerRevenue = Math.round(expectedNewCustomers * baselineSpend * 12 * 0.4);
      const beverageRevenue = Math.round(d.beverage_revenue_baseline * (targetBeverageLiftPct / 100) * expectedDjNightsPerMonth * 0.5);
      const totalOpportunity = Math.max(newCustomerRevenue + beverageRevenue, 1800);
      alerts.push({
        rule_id: 'dj_night_absent_young_demographic',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_dj_nights: d.has_dj_nights,
        target_demographic_age: d.target_demographic_age,
        targets_young_demographic: d.targets_young_demographic,
        dj_nights_per_month: d.dj_nights_per_month,
        dj_night_new_customer_pct: d.dj_night_new_customer_pct,
        performance_venue_capacity: d.performance_venue_capacity,
        beverage_revenue_lift_pct: d.beverage_revenue_lift_pct,
        brand_differentiation_score: d.brand_differentiation_score,
        new_customer_acquisition_monthly: d.new_customer_acquisition_monthly,
        competitors_with_live_music_pct: d.competitors_with_live_music_pct,
        music_aware_lost_customers: d.music_aware_lost_customers,
        monthly_revenue: d.monthly_revenue,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        new_customer_acquisition_projected_pct: targetNewCustomerAcquisitionLiftPct,
        beverage_revenue_lift_projected_pct: targetBeverageLiftPct,
        brand_differentiation_lift_projected_pct: targetBrandDifferentiationLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DJ NIGHT ABSENT YOUNG DEMOGRAPHIC: ${d.location_id} — this ${d.restaurant_tier} restaurant targets ${d.target_demographic_age} demographic but has no DJ nights. HIGH: DJ NIGHT ABSENT — restaurant targeting young customers (18-35) has no DJ night programming. DJ nights attract younger demographic — 35% new customer acquisition. Industry data: DJ nights attract younger demographic (18-35); DJ nights drive 35% new customer acquisition; DJ nights increase beverage sales 40-60% (higher than live music); DJ nights extend venue hours (late-night programming); DJ nights attract destination diners (willing to travel for music); DJ nights build social media following (Instagram + TikTok content); DJ nights attract influencers + content creators; DJ nights attract groups (birthday + bachelorette + friend groups); DJ nights can charge cover ($10-25); DJ nights can sell bottle service ($200-1,500 per table); DJ nights can partner with brands (liquor sponsors); DJ nights can feature guest DJs (rotating talent); DJ nights can theme (90s night, 2000s night, latin night, hip hop night); DJ nights can run weekly (Friday night residency); DJ nights should start at 21:30-22:00 (after dinner); DJ nights should run until 1:00-2:00 AM (late-night); DJ nights should have dance floor (clear area); DJ nights should have dedicated sound system (louder than dinner music); DJ nights should have lighting (LED + moving heads); DJ nights should have visuals (video projection); DJ nights should have photo booth (Instagram content); DJ nights should have dress code (upscale casual); DJ nights should have guest list management; DJ nights should have ticket sales (Eventbrite + Dice + Resident Advisor); DJ nights should have social media promotion (Instagram + TikTok + Snapchat); DJ nights should have influencer partnerships (paid + comp); DJ nights should have brand partnerships (liquor sponsors); DJ nights should have VIP table reservations; DJ nights should have bottle service menu; DJ nights should have late-night menu (small plates); DJ nights should have ride-share partnership (Uber + Lyft promo codes); DJ nights should have security (ID check + crowd management); DJ nights should have dedicated bar staff; DJ nights should have coat check (winter). Solutions ranked by impact: (1) LAUNCH weekly DJ night (Friday night residency, 22:00-2:00 AM) — ${expectedNewCustomers} new customers/mo + ${fmt$(newCustomerRevenue)}/mo new customer revenue + ${fmt$(beverageRevenue)}/mo beverage lift; cost ${fmt$(expectedDjNightsPerMonth * d.dj_rate_market)}/mo DJ fees + $3,000-8,000 sound + lighting setup; payback 3-6 months; (2) THEME weekly (90s night, 2000s night, latin night, hip hop night) — variety; (3) START at 22:00 (after dinner) — protects food sales; (4) RUN until 1:00-2:00 AM (late-night) — extended hours; (5) CREATE dance floor (clear area) — engagement; (6) INSTALL dedicated sound system (louder) — quality; (7) ADD lighting (LED + moving heads) — atmosphere; (8) ADD visuals (video projection) — experience; (9) ADD photo booth — Instagram content; (10) CHARGE cover ($10-25) — revenue; (11) SELL bottle service ($200-1,500 per table) — premium revenue; (12) PARTNER with liquor brands (sponsorship) — revenue offset; (13) FEATURE guest DJs (rotating talent) — variety; (14) PROMOTE via Instagram + TikTok + Snapchat — reach; (15) PARTNER with influencers (paid + comp) — reach. Industry data: 35% new customer acquisition from DJ nights; 40-60% beverage lift (higher than live music); $10-25 cover charge; $200-1,500 bottle service; $200-600 DJ cost/night; payback 3-6 months. Expected impact: +${targetNewCustomerAcquisitionLiftPct}% new customer acquisition, +${expectedNewCustomers} new customers/mo, +${targetBeverageLiftPct}% beverage revenue, +${fmt$(newCustomerRevenue)}/mo new customer revenue, +${fmt$(beverageRevenue)}/mo beverage revenue, payback 3-6 months.`,
        ai_recommendation: 'launch_dj_night_series',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: OPEN_MIC_KARAOKE_ABSENT_COMMUNITY_VENUE
    if (config.requireOpenMicKaraokeForCommunity && d.community_event_score < 50 && !d.has_open_mic_nights && !d.has_karaoke_nights) {
      // No community events -> missed 20% regular conversion
      const expectedNightsPerMonth = 4;
      const expectedConversionPct = config.minOpenMicConversionPct;
      const expectedAttendees = Math.round(d.performance_venue_capacity * 0.5 * expectedNightsPerMonth);
      const expectedNewRegulars = Math.round(expectedAttendees * (expectedConversionPct / 100));
      const newRegularRevenue = Math.round(expectedNewRegulars * baselineSpend * 12 * 0.6);
      const communityLiftRevenue = Math.round(baselineRevenue * 0.05 * 0.2);
      const totalOpportunity = Math.max(newRegularRevenue + communityLiftRevenue, 1200);
      alerts.push({
        rule_id: 'open_mic_karaoke_absent_community_venue',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_open_mic_nights: d.has_open_mic_nights,
        has_karaoke_nights: d.has_karaoke_nights,
        open_mic_karaoke_nights_per_month: d.open_mic_karaoke_nights_per_month,
        open_mic_karaoke_regular_conversion_pct: d.open_mic_karaoke_regular_conversion_pct,
        community_event_score: d.community_event_score,
        customer_loyalty_score: d.customer_loyalty_score,
        customer_loyalty_baseline: d.customer_loyalty_baseline,
        performance_venue_capacity: d.performance_venue_capacity,
        monthly_revenue: d.monthly_revenue,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        new_customer_acquisition_projected_pct: targetNewCustomerAcquisitionLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `OPEN MIC / KARAOKE ABSENT COMMUNITY VENUE: ${d.location_id} — this ${d.restaurant_tier} restaurant has community event score ${d.community_event_score}/100 with no open mic or karaoke nights. MEDIUM: OPEN MIC / KARAOKE ABSENT — no community events. Open mic/karaoke nights build community — 20% become regulars. Industry data: open mic/karaoke nights build community — 20% become regulars; open mic nights attract local performers (musicians, poets, comedians); karaoke nights attract groups (friends, coworkers, birthdays); open mic/karaoke nights are low-cost programming (host $100-200/night); open mic/karaoke nights generate beverage sales 25-40% lift; open mic/karaoke nights generate late-night food sales (small plates); open mic/karaoke nights attract repeat customers (performers return); open mic/karaoke nights build venue community (regular crowd); open mic/karaoke nights attract diverse demographics (age 21-65); open mic/karaoke nights generate social media content (videos of performances); open mic/karaoke nights should be weekly (Tuesday or Wednesday — slow nights); open mic/karaoke nights should have sign-up sheet (10-minute slots); open mic/karaoke nights should have host/MC (warm up crowd, manage flow); open mic/karaoke nights should have sound system (microphone + speakers + backing tracks); open mic/karaoke nights should have song library (karaoke catalog 10,000+ songs); open mic/karaoke nights should have lyrics display (TV screen + lyrics prompter); open mic/karaoke nights should have scoring/competition (judges + prizes); open mic/karaoke nights should have drink specials (cocktail + beer + wine); open mic/karaoke nights should have food specials (small plates + shareables); open mic/karaoke nights should have photography (post-performance photos); open mic/karaoke nights should be promoted via social media (videos of best performances); open mic/karaoke nights should have leaderboard (top performers); open mic/karaoke nights should have championship night (monthly or quarterly); open mic/karaoke nights should have theme nights (decade night, genre night, holiday theme); open mic/karaoke nights should be family-friendly (early) or 21+ (late); open mic/karaoke nights should have cover charge ($5-10) or free with drink minimum; open mic/karaoke nights should partner with local music schools (open mic performers); open mic/karaoke nights should partner with local comedy groups (comedy open mic). Solutions ranked by impact: (1) LAUNCH weekly open mic night (Tuesday, 20:00-23:00) — ${expectedNewRegulars} new regulars/mo + ${fmt$(newRegularRevenue)}/mo new regular revenue; cost ${fmt$(expectedNightsPerMonth * 150)}/mo host fees; payback 1-2 months; (2) LAUNCH weekly karaoke night (Wednesday, 21:00-24:00) — group audience + beverage lift; (3) HIRE host/MC (warm up crowd, manage flow) — quality; (4) INSTALL sound system (microphone + speakers + backing tracks) — quality; (5) BUILD song library (10,000+ karaoke songs) — variety; (6) DISPLAY lyrics (TV screen + prompter) — engagement; (7) RUN sign-up sheet (10-minute slots) — management; (8) OFFER scoring/competition (judges + prizes) — engagement; (9) RUN drink specials (cocktail + beer + wine) — beverage attach; (10) RUN food specials (small plates + shareables) — food revenue; (11) PHOTOGRAPH performances (post-show photos) — content; (12) PROMOTE via social media (videos of best performances) — reach; (13) BUILD leaderboard (top performers) — competition; (14) HOST championship night (monthly or quarterly) — climax; (15) THEME nights (decade night, genre night, holiday) — variety. Industry data: 20% regular conversion from open mic/karaoke; $100-200/night host cost; 25-40% beverage lift; payback 1-2 months. Expected impact: +${expectedConversionPct}% regular conversion, +${expectedNewRegulars} new regulars/mo, +${fmt$(newRegularRevenue)}/mo new regular revenue, +${fmt$(communityLiftRevenue)}/mo community-driven revenue, payback 1-2 months.`,
        ai_recommendation: 'launch_open_mic_karaoke_nights',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: LIVE_MUSIC_NOT_PROMOTED
    if (config.requirePerformancePromotion && d.has_live_music && !d.performances_promoted) {
      // Performances not marketed -> low turnout defeats investment
      const expectedFillRateLiftPct = 45;
      const currentFillRate = d.performance_fill_rate_pct;
      const projectedFillRate = Math.min(90, currentFillRate + expectedFillRateLiftPct);
      const expectedAttendanceLift = Math.round(d.performance_venue_capacity * (expectedFillRateLiftPct / 100));
      const expectedRevenueLift = Math.round(expectedAttendanceLift * baselineSpend * 4);
      const marketingCost = 400;
      const totalOpportunity = Math.max(expectedRevenueLift - marketingCost, 1000);
      alerts.push({
        rule_id: 'live_music_not_promoted',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_live_music: d.has_live_music,
        live_music_events_per_month: d.live_music_events_per_month,
        performances_promoted: d.performances_promoted,
        performance_marketing_channels: d.performance_marketing_channels,
        performance_attendance_avg: d.performance_attendance_avg,
        performance_venue_capacity: d.performance_venue_capacity,
        performance_fill_rate_pct: d.performance_fill_rate_pct,
        beverage_revenue_lift_pct: d.beverage_revenue_lift_pct,
        customer_loyalty_score: d.customer_loyalty_score,
        brand_differentiation_score: d.brand_differentiation_score,
        monthly_revenue: d.monthly_revenue,
        performance_marketing_monthly_cost: d.performance_marketing_monthly_cost,
        live_music_program_total_monthly_cost: d.live_music_program_total_monthly_cost,
        beverage_revenue_lift_projected_pct: targetBeverageLiftPct,
        brand_differentiation_lift_projected_pct: targetBrandDifferentiationLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `LIVE MUSIC NOT PROMOTED: ${d.location_id} — this ${d.restaurant_tier} restaurant has ${d.live_music_events_per_month} live music events per month but is not promoting them. Current fill rate ${currentFillRate}% (target ${config.minPerformanceFillRatePct}%+). HIGH: LIVE MUSIC NOT PROMOTED — performances available but not marketed. Live music not promoted averages 30-45% fill rate vs 75%+ for promoted events. Industry data: live music not promoted averages 30-45% fill rate vs 75%+ for promoted events; live music promoted via 5+ channels sees 45% fill rate lift; live music promoted via social media sees 30%+ Instagram engagement lift; live music promoted via email sees 85%+ open rate (vs 22% promotional); live music promoted via website sees 40%+ booking conversion; live music promoted via Eventbrite + Dice + Resident Advisor sees 25%+ booking conversion; live music promoted via influencer partnerships sees 4-12x reach; live music promoted via PR sees 3-8x media impressions; live music promoted via paid ads sees 2-5x ROAS; live music should be promoted via 5+ channels (social + email + website + event platforms + PR); live music should have dedicated landing page on website (performer bio + photo + video); live music should have professional photography (not stock photos); live music should have video content (performer interview + behind-the-scenes + performance clip); live music should have email nurture sequence (3-5 emails before event); live music should have social media calendar (3-5 posts per event); live music should have influencer partnerships (3-5 local food/music influencers per quarter); live music should have PR outreach (local publications, music blogs, regional magazines); live music should have paid social ads ($200-500 per event); live music should have Google Ads ($300-800 per month for "live music near me"); live music should have referral program (bring a friend discount); live music should have loyalty program integration (loyalty members get early access); live music should have gift certificate promotion (live music + dinner package); live music should have performer promotion (performer promotes via their social); live music should have calendar listing (local event calendars + newspapers); live music should have radio promotion (local radio station partnership); live music should have podcast promotion (local podcast sponsorship); live music should have street team (flyers + posters in neighborhood); live music should have partner venues (cross-promotion with nearby bars); live music should have waitlist conversion email (when sold out). Solutions ranked by impact: (1) BUILD dedicated live music landing page on website — 40%+ booking conversion; cost $500-1500 dev; payback 1 month; (2) SHOOT professional photography for each performer — content quality; cost $300-800 photographer; (3) SHOOT video content (performer interview + performance clip) — content; cost $500-1500 videographer; (4) BUILD email nurture sequence (3-5 emails before event) — 85%+ open rate; (5) BUILD social media calendar (3-5 posts per event) — 30%+ Instagram engagement; (6) PARTNER with 3-5 local influencers per quarter — 4-12x reach; cost $200-500 per influencer; (7) PITCH PR to local publications + music blogs — 3-8x media impressions; cost $0; (8) RUN paid social ads ($200-500 per event) — 2-5x ROAS; (9) RUN Google Ads for "live music near me" — high-intent traffic; cost $300-800/mo; (10) LAUNCH referral program (bring a friend discount) — viral growth; (11) INTEGRATE with loyalty program (early access for members) — loyalty boost; (12) PROMOTE gift certificates (live music + dinner package) — gift revenue; (13) ASK performers to promote via their social — free reach; (14) LIST on Eventbrite + Dice + Resident Advisor — 25%+ booking; (15) AUTOMATE waitlist conversion email — recover demand. Industry data: 45% fill rate lift for 5+ channel marketing; 30%+ Instagram engagement; 85%+ email open rate; 40%+ website booking conversion; 25%+ event platform booking; 4-12x influencer reach; 3-8x PR media impressions; 2-5x paid ads ROAS; payback 1 month. Expected impact: +45% fill rate (${currentFillRate}% → ${projectedFillRate}%), +${expectedAttendanceLift} additional attendees/event, +${fmt$(expectedRevenueLift)}/mo attendance revenue, +${targetBeverageLiftPct}% beverage revenue, +${targetBrandDifferentiationLiftPct}% brand differentiation, payback 1 month.`,
        ai_recommendation: 'promote_live_music_performances',
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
              { role: 'system', content: 'You are a restaurant live music and performance booking optimization expert. Given live music data, recommend ONE specific action with expected beverage revenue lift, weekend reservation lift, dwell time lift, brand differentiation lift, or new customer acquisition lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Has live music: ${a.has_live_music ?? false}. Has weekend live music: ${a.has_weekend_live_music ?? false}. Has acoustic: ${a.has_acoustic_solo_nights ?? false}. Has jazz trio/band: ${a.has_jazz_trio_band_nights ?? false}. Has DJ nights: ${a.has_dj_nights ?? false}. Has open mic: ${a.has_open_mic_nights ?? false}. Has karaoke: ${a.has_karaoke_nights ?? false}. Has cultural: ${a.has_cultural_performances ?? false}. Performance types: ${a.performance_types_count ?? 0}. Events/mo: ${a.live_music_events_per_month ?? 0}. Weekend events/mo: ${a.weekend_live_music_events_per_month ?? 0}. Start time: ${a.avg_performance_start_time ?? 'n/a'}. Starts during dinner rush: ${a.performance_starts_during_dinner_rush ?? false}. After dinner only: ${a.performances_after_dinner_only ?? false}. Artist budget/night: ${fmt$(a.artist_budget_per_night ?? 0)}. Acoustic market rate: ${fmt$(a.acoustic_solo_rate_market ?? 0)}. Jazz market rate: ${fmt$(a.jazz_trio_band_rate_market ?? 0)}. DJ market rate: ${fmt$(a.dj_rate_market ?? 0)}. Budget below market: ${a.budget_below_market ?? false}. Artist quality: ${a.artist_quality_score ?? 0}/100. Has stage: ${a.has_dedicated_stage ?? false}. Has lighting: ${a.has_performance_lighting ?? false}. Has pro sound: ${a.has_professional_sound_system ?? false}. Has monitors: ${a.has_monitor_speakers ?? false}. Has mics: ${a.has_microphones ?? false}. Has soundcheck: ${a.has_sound_check_routine ?? false}. Performance area score: ${a.performance_area_score ?? 0}/100. Genre: ${a.primary_music_genre ?? 'n/a'}. Concept: ${a.restaurant_concept ?? 'n/a'}. Genre match: ${a.genre_concept_match_score ?? 0}/100. Genre matches: ${a.genre_matches_concept ?? false}. Targets young demo: ${a.targets_young_demographic ?? false}. DJ nights/mo: ${a.dj_nights_per_month ?? 0}. DJ new customers: ${a.dj_night_new_customer_pct ?? 0}%. Open mic/karaoke/mo: ${a.open_mic_karaoke_nights_per_month ?? 0}. Open mic conversion: ${a.open_mic_karaoke_regular_conversion_pct ?? 0}%. Community score: ${a.community_event_score ?? 0}/100. Promoted: ${a.performances_promoted ?? false}. Marketing channels: ${a.performance_marketing_channels ?? 0}. Attendance avg: ${a.performance_attendance_avg ?? 0}. Venue capacity: ${a.performance_venue_capacity ?? 0}. Fill rate: ${a.performance_fill_rate_pct ?? 0}%. Beverage lift: ${a.beverage_revenue_lift_pct ?? 0}%. Beverage baseline: ${fmt$(a.beverage_revenue_baseline ?? 0)}. Weekend reservation lift: ${a.weekend_reservation_lift_pct ?? 0}%. Dwell time lift: ${a.dwell_time_lift_pct ?? 0}%. Brand differentiation: ${a.brand_differentiation_score ?? 0}/100 (lift ${a.brand_differentiation_lift_pct ?? 0}%). Loyalty: ${a.customer_loyalty_score ?? 0}/100 (lift ${a.customer_loyalty_lift_pct ?? 0}%). New customers/mo: ${a.new_customer_acquisition_monthly ?? 0}. Food sales during performance: ${a.food_sales_during_performance_pct ?? 0}%. Noise complaints/mo: ${a.noise_complaints_monthly ?? 0}. Satisfaction: ${a.customer_satisfaction_score ?? 0}/100 (lift ${a.customer_satisfaction_lift_pct ?? 0}%). Competitors with live music: ${a.competitors_with_live_music_pct ?? 0}%. Lost customers: ${a.music_aware_lost_customers ?? 0}. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Program cost: ${fmt$(a.live_music_program_total_monthly_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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
    await db.query(`DELETE FROM live_music_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE live_music_alert CONTENT $data`, {
        data: { ...a, detected_at: a.detected_at.toISOString() },
      });
    } catch { /* ignore */ }
  }

  return { alerts, generated: alerts.length };
};

export const getActiveLiveMusicPerformanceAlerts = async (db: ReturnType<typeof useDB>): Promise<LiveMusicPerformanceAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM live_music_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getLiveMusicPerformanceSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  noWeekendLiveMusicCount: number; wrongScheduleCount: number; lowBudgetCount: number; notPromotedCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'live_music_absent_weekend_venue') AS noweekend,
              math::count(rule_id = 'performance_schedule_wrong') AS wrongsched,
              math::count(rule_id = 'artist_budget_too_low') AS lowbudget,
              math::count(rule_id = 'live_music_not_promoted') AS notpromoted
       FROM live_music_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      noWeekendLiveMusicCount: safeNumber(r.noweekend, 0),
      wrongScheduleCount: safeNumber(r.wrongsched, 0),
      lowBudgetCount: safeNumber(r.lowbudget, 0),
      notPromotedCount: safeNumber(r.notpromoted, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noWeekendLiveMusicCount: 0, wrongScheduleCount: 0, lowBudgetCount: 0, notPromotedCount: 0 };
  }
};

export const updateLiveMusicPerformanceAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
