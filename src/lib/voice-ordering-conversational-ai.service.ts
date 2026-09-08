/**
 * AI Voice Ordering & Conversational AI Optimizer — predicts how voice
 * ordering and conversational AI (drive-thru voice AI, phone voice
 * assistant, smart speaker ordering, in-restaurant voice kiosks,
 * multi-language support, accent adaptation, voice biometrics, order
 * accuracy, speed of service, upsell automation, handoff to human)
 * impacts order accuracy, speed, labor cost, customer satisfaction,
 * average ticket, accessibility.
 *
 * Voice AI in drive-thru reduces order time 20-30 seconds per car =
 * $50-100/day additional revenue (QSR Magazine). McDonald's AI drive-thru
 * pilot showed 85% order accuracy (vs 80% human). Voice AI phone ordering
 * handles 24/7 with no hold time — 35% of phone orders abandoned when
 * hold time >30s. 60% of customers prefer voice ordering over touch-tone
 * IVR (Nuance study). Smart speaker restaurant ordering (Alexa, Google
 * Assistant) growing 40% YoY — 15% of US households order food via
 * smart speaker. Voice AI reduces front-counter labor 25-40% during peak
 * (NRA). Voice order accuracy benchmark = 90-95% (human 80-85%, voice
 * AI 85-92% with training). Voice AI upsell acceptance = 35-45% vs 15-20%
 * human (consistent prompts, no awkwardness). Voice biometrics identifies
 * loyalty members by voice (no card/app needed) — 78% prefer voice ID
 * over card/app. Multi-language voice AI serves diverse demographics —
 * 22% of US households speak non-English at home (Census). Accent
 * adaptation reduces order errors 40-60% for non-native speakers.
 * Voice AI conversational design = natural language, context awareness,
 * personality, handoff to human when needed. Voice AI implementation
 * cost $5k-25k setup + $200-1,000/month (per location). Voice AI ROI =
 * $3-8 per $1 spent (labor savings + upsell + accuracy). 45% of QSRs
 * plan voice AI deployment by 2026 (Restaurant Business). Voice AI
 * accessibility serves visually impaired, motor-impaired, elderly —
 * 61M Americans with disabilities (CDC). Voice AI order customization
 * (hold the pickles, extra sauce) handles complex orders 30% faster
 * than human. Voice AI sentiment detection identifies frustrated
 * customers = handoff to human.
 *
 * 205th POSR-exclusive differentiator. Distinct from:
 *   - drive-thru-pickup-window.service (195th) — optimizes drive-thru
 *     WINDOW operations (window design, speaker clarity, menu board,
 *     payment speed, lane design). This optimizer focuses on VOICE AI
 *     CONVERSATIONAL ordering (accuracy, speed, upsell, multi-language,
 *     accent, biometrics, handoff).
 *   - phone-order-optimizer.service (94th) — tracks phone CALL patterns
 *     (abandoned calls, order errors, staff phone skills). This optimizer
 *     focuses on VOICE AI replacing/augmenting human phone ordering.
 *   - mobile-app-ordering.service — MOBILE APP ordering (touch-based).
 *     This optimizer focuses on VOICE-based ordering (conversational).
 *   - self-service-kiosk-terminal.service — TOUCH kiosk ordering. This
 *     optimizer focuses on VOICE kiosk ordering (hands-free).
 *   - digital-menu-qr.service — QR code menu (visual). This optimizer
 *     focuses on VOICE menu (audible).
 *   - order-customization-analyzer.service — analyzes CUSTOMIZATION
 *     patterns. This optimizer focuses on voice AI HANDLING customization.
 *   - accessibility-menu-ada.service (198th) — ADA COMPLIANCE (large
 *     print, braille, wheelchair). This optimizer focuses on VOICE AI
 *     accessibility (visually impaired, motor-impaired, elderly).
 *   - order-pacing-optimizer.service — optimizes order PACING (kitchen
 *     load). This optimizer focuses on voice ORDER taking (front-end).
 *
 * 8 AI rules:
 *   1. voice_ai_strategy_absent -> no voice AI -> missed 20-30s/order + 25-40% labor reduction
 *   2. voice_order_accuracy_low -> accuracy <90% -> errors + comps + churn
 *   3. voice_ai_upsell_automation_absent -> no automated upsell -> missed 35-45% acceptance
 *   4. voice_ai_multilingual_absent -> no multi-language -> missed 22% non-English households
 *   5. voice_ai_accent_adaptation_absent -> no accent adaptation -> 40-60% errors for non-native
 *   6. voice_biometrics_absent -> no voice ID -> missed 78% preference + loyalty friction
 *   7. voice_ai_human_handoff_absent -> no human handoff -> frustrated customers + lost sales
 *   8. voice_ai_accessibility_absent -> no voice accessibility -> missed 61M disabled Americans
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type VoiceOrderingRuleId =
  | 'voice_ai_strategy_absent'
  | 'voice_order_accuracy_low'
  | 'voice_ai_upsell_automation_absent'
  | 'voice_ai_multilingual_absent'
  | 'voice_ai_accent_adaptation_absent'
  | 'voice_biometrics_absent'
  | 'voice_ai_human_handoff_absent'
  | 'voice_ai_accessibility_absent';

export type VoiceOrderingAiRec =
  | 'launch_voice_ai_strategy'
  | 'improve_voice_accuracy'
  | 'implement_voice_upsell'
  | 'add_multilingual_voice'
  | 'implement_accent_adaptation'
  | 'implement_voice_biometrics'
  | 'implement_human_handoff'
  | 'implement_voice_accessibility'
  | 'monitor'
  | 'skip';

export interface VoiceOrderingAlert {
  id?: string;
  rule_id: VoiceOrderingRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'drive_thru' | 'phone' | 'kiosk' | 'smart_speaker'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Voice AI presence
  has_voice_ai_strategy?: boolean;                         // voice AI strategy present
  voice_ai_channels?: string;                              // 'drive_thru,phone,kiosk,smart_speaker' etc.
  voice_ai_provider?: string;                              // provider name (Presto, SoundHound, OpenCity, Google)
  voice_ai_deployment_pct?: number;                        // % of channels with voice AI
  // Order accuracy
  voice_order_accuracy_pct?: number;                       // voice AI order accuracy %
  voice_order_accuracy_target_pct?: number;                // target accuracy
  human_order_accuracy_pct?: number;                       // human order accuracy %
  order_error_rate_pct?: number;                           // % orders with errors
  error_cost_monthly?: number;                             // monthly cost of order errors (comps, remakes)
  // Upsell automation
  has_voice_ai_upsell?: boolean;                           // automated upsell prompts present
  voice_upsell_acceptance_pct?: number;                    // % upsell acceptance rate
  voice_upsell_acceptance_target_pct?: number;             // target upsell acceptance
  avg_upsell_revenue_per_order?: number;                   // avg upsell revenue per order
  upsell_revenue_monthly?: number;                         // monthly upsell revenue
  // Multi-language
  has_multilingual_voice?: boolean;                        // multi-language voice AI present
  languages_supported_count?: number;                      // number of languages supported
  non_english_customer_pct?: number;                       // % non-English speaking customers
  multilingual_revenue_potential?: number;                 // revenue potential from non-English
  // Accent adaptation
  has_accent_adaptation?: boolean;                         // accent adaptation present
  accent_error_rate_pct?: number;                          // % errors for non-native speakers
  accent_error_target_pct?: number;                        // target accent error rate
  non_native_speaker_pct?: number;                         // % non-native speaker customers
  // Voice biometrics
  has_voice_biometrics?: boolean;                          // voice biometrics (voice ID) present
  loyalty_identification_rate_pct?: number;                // % loyalty members identified by voice
  loyalty_identification_target_pct?: number;              // target identification rate
  voice_id_preference_pct?: number;                        // % customers who prefer voice ID
  // Human handoff
  has_human_handoff?: boolean;                             // human handoff when AI fails
  handoff_rate_pct?: number;                               // % orders handed off to human
  handoff_target_pct?: number;                             // target handoff rate
  avg_handoff_time_seconds?: number;                       // avg time to handoff
  sentiment_detection_accuracy?: number;                   // 0-100 sentiment detection accuracy
  // Accessibility
  has_voice_accessibility?: boolean;                       // voice accessibility for disabled
  disabled_customer_pct?: number;                          // % disabled customers
  accessibility_revenue_potential?: number;                // revenue potential from accessibility
  visually_impaired_served_monthly?: number;               // visually impaired customers served monthly
  motor_impaired_served_monthly?: number;                  // motor-impaired customers served monthly
  elderly_served_monthly?: number;                         // elderly customers (65+) served monthly
  // Performance metrics
  avg_voice_order_time_seconds?: number;                   // avg voice order time
  avg_human_order_time_seconds?: number;                   // avg human order time
  voice_ai_uptime_pct?: number;                            // voice AI uptime %
  voice_ai_cost_monthly?: number;                          // monthly voice AI cost
  labor_savings_monthly?: number;                          // monthly labor savings
  avg_ticket_voice?: number;                               // avg ticket via voice AI
  avg_ticket_human?: number;                               // avg ticket via human
  customer_satisfaction_voice_score?: number;              // 0-100 satisfaction with voice AI
  customer_satisfaction_human_score?: number;              // 0-100 satisfaction with human
  competitor_voice_ai_score?: number;                      // 0-100 competitor voice AI presence
  total_orders_monthly?: number;                           // total orders per month
  voice_orders_monthly?: number;                           // voice AI orders per month
  monthly_revenue?: number;                                // total restaurant monthly revenue
  // Costs
  voice_ai_setup_cost?: number;                            // one-time setup cost
  voice_ai_subscription_cost_monthly?: number;             // monthly subscription cost
  // Impact projections
  speed_lift_projected_seconds?: number;
  accuracy_lift_projected_pts?: number;
  upsell_revenue_projected?: number;
  labor_savings_projected?: number;
  multilingual_revenue_projected?: number;
  accessibility_revenue_projected?: number;
  satisfaction_lift_projected_pts?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: VoiceOrderingAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface VoiceOrderingConfig {
  aiEnabled: boolean;
  requireVoiceAiStrategy: boolean;                          // require voice AI strategy
  requireVoiceAiUpsell: boolean;                            // require automated upsell
  requireMultilingualVoice: boolean;                        // require multi-language
  requireAccentAdaptation: boolean;                         // require accent adaptation
  requireVoiceBiometrics: boolean;                          // require voice biometrics
  requireHumanHandoff: boolean;                             // require human handoff
  requireVoiceAccessibility: boolean;                       // require voice accessibility
  minVoiceOrderAccuracyPct: number;                         // min accuracy (90%)
  minVoiceUpsellAcceptancePct: number;                      // min upsell acceptance (35%)
  minLanguagesSupported: number;                            // min languages (2)
  maxAccentErrorRatePct: number;                            // max accent error rate (8%)
  minLoyaltyIdentificationPct: number;                      // min loyalty ID rate (50%)
  maxHandoffRatePct: number;                                // max handoff rate (15%)
  minVoiceAiUptimePct: number;                              // min uptime (98%)
  preferCompetitorParity: boolean;                          // match competitor voice AI
}

export const DEFAULT_VOICE_ORDERING_CONFIG: VoiceOrderingConfig = {
  aiEnabled: true,
  requireVoiceAiStrategy: true,
  requireVoiceAiUpsell: true,
  requireMultilingualVoice: true,
  requireAccentAdaptation: true,
  requireVoiceBiometrics: true,
  requireHumanHandoff: true,
  requireVoiceAccessibility: true,
  minVoiceOrderAccuracyPct: 90,
  minVoiceUpsellAcceptancePct: 35,
  minLanguagesSupported: 2,
  maxAccentErrorRatePct: 8,
  minLoyaltyIdentificationPct: 50,
  maxHandoffRatePct: 15,
  minVoiceAiUptimePct: 98,
  preferCompetitorParity: true,
};

export const readVoiceOrderingConfig = (settings: any): VoiceOrderingConfig => ({
  aiEnabled: settings?.voice_ordering_ai_enabled ?? true,
  requireVoiceAiStrategy: settings?.voice_ordering_require_strategy ?? true,
  requireVoiceAiUpsell: settings?.voice_ordering_require_upsell ?? true,
  requireMultilingualVoice: settings?.voice_ordering_require_multilingual ?? true,
  requireAccentAdaptation: settings?.voice_ordering_require_accent ?? true,
  requireVoiceBiometrics: settings?.voice_ordering_require_biometrics ?? true,
  requireHumanHandoff: settings?.voice_ordering_require_handoff ?? true,
  requireVoiceAccessibility: settings?.voice_ordering_require_accessibility ?? true,
  minVoiceOrderAccuracyPct: safeNumber(settings?.voice_ordering_min_accuracy, 90),
  minVoiceUpsellAcceptancePct: safeNumber(settings?.voice_ordering_min_upsell, 35),
  minLanguagesSupported: safeNumber(settings?.voice_ordering_min_languages, 2),
  maxAccentErrorRatePct: safeNumber(settings?.voice_ordering_max_accent_error, 8),
  minLoyaltyIdentificationPct: safeNumber(settings?.voice_ordering_min_loyalty_id, 50),
  maxHandoffRatePct: safeNumber(settings?.voice_ordering_max_handoff, 15),
  minVoiceAiUptimePct: safeNumber(settings?.voice_ordering_min_uptime, 98),
  preferCompetitorParity: settings?.voice_ordering_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface VoiceOrderingData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_voice_ai_strategy: boolean;
  voice_ai_channels: string;
  voice_ai_provider: string;
  voice_ai_deployment_pct: number;
  voice_order_accuracy_pct: number;
  voice_order_accuracy_target_pct: number;
  human_order_accuracy_pct: number;
  order_error_rate_pct: number;
  error_cost_monthly: number;
  has_voice_ai_upsell: boolean;
  voice_upsell_acceptance_pct: number;
  voice_upsell_acceptance_target_pct: number;
  avg_upsell_revenue_per_order: number;
  upsell_revenue_monthly: number;
  has_multilingual_voice: boolean;
  languages_supported_count: number;
  non_english_customer_pct: number;
  multilingual_revenue_potential: number;
  has_accent_adaptation: boolean;
  accent_error_rate_pct: number;
  accent_error_target_pct: number;
  non_native_speaker_pct: number;
  has_voice_biometrics: boolean;
  loyalty_identification_rate_pct: number;
  loyalty_identification_target_pct: number;
  voice_id_preference_pct: number;
  has_human_handoff: boolean;
  handoff_rate_pct: number;
  handoff_target_pct: number;
  avg_handoff_time_seconds: number;
  sentiment_detection_accuracy: number;
  has_voice_accessibility: boolean;
  disabled_customer_pct: number;
  accessibility_revenue_potential: number;
  visually_impaired_served_monthly: number;
  motor_impaired_served_monthly: number;
  elderly_served_monthly: number;
  avg_voice_order_time_seconds: number;
  avg_human_order_time_seconds: number;
  voice_ai_uptime_pct: number;
  voice_ai_cost_monthly: number;
  labor_savings_monthly: number;
  avg_ticket_voice: number;
  avg_ticket_human: number;
  customer_satisfaction_voice_score: number;
  customer_satisfaction_human_score: number;
  competitor_voice_ai_score: number;
  total_orders_monthly: number;
  voice_orders_monthly: number;
  monthly_revenue: number;
  voice_ai_setup_cost: number;
  voice_ai_subscription_cost_monthly: number;
}

const MOCK_DATA: VoiceOrderingData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_voice_ai_strategy: false, voice_ai_channels: 'none',
    voice_ai_provider: 'none', voice_ai_deployment_pct: 0,
    voice_order_accuracy_pct: 0, voice_order_accuracy_target_pct: 92,
    human_order_accuracy_pct: 82, order_error_rate_pct: 18,
    error_cost_monthly: 2400,
    has_voice_ai_upsell: false, voice_upsell_acceptance_pct: 0,
    voice_upsell_acceptance_target_pct: 40, avg_upsell_revenue_per_order: 0,
    upsell_revenue_monthly: 0,
    has_multilingual_voice: false, languages_supported_count: 0,
    non_english_customer_pct: 18, multilingual_revenue_potential: 0,
    has_accent_adaptation: false, accent_error_rate_pct: 28,
    accent_error_target_pct: 8, non_native_speaker_pct: 22,
    has_voice_biometrics: false, loyalty_identification_rate_pct: 0,
    loyalty_identification_target_pct: 50, voice_id_preference_pct: 0,
    has_human_handoff: false, handoff_rate_pct: 0,
    handoff_target_pct: 12, avg_handoff_time_seconds: 0,
    sentiment_detection_accuracy: 0,
    has_voice_accessibility: false, disabled_customer_pct: 8,
    accessibility_revenue_potential: 0,
    visually_impaired_served_monthly: 0, motor_impaired_served_monthly: 0,
    elderly_served_monthly: 0,
    avg_voice_order_time_seconds: 0, avg_human_order_time_seconds: 95,
    voice_ai_uptime_pct: 0, voice_ai_cost_monthly: 0,
    labor_savings_monthly: 0, avg_ticket_voice: 0,
    avg_ticket_human: 28, customer_satisfaction_voice_score: 0,
    customer_satisfaction_human_score: 68, competitor_voice_ai_score: 58,
    total_orders_monthly: 2800, voice_orders_monthly: 0,
    monthly_revenue: 78000,
    voice_ai_setup_cost: 0, voice_ai_subscription_cost_monthly: 0,
  },
  {
    location_id: 'drive_thru', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'takeout',
    has_voice_ai_strategy: true, voice_ai_channels: 'drive_thru',
    voice_ai_provider: 'Presto', voice_ai_deployment_pct: 50,
    voice_order_accuracy_pct: 86, voice_order_accuracy_target_pct: 92,
    human_order_accuracy_pct: 82, order_error_rate_pct: 14,
    error_cost_monthly: 1800,
    has_voice_ai_upsell: false, voice_upsell_acceptance_pct: 0,
    voice_upsell_acceptance_target_pct: 40, avg_upsell_revenue_per_order: 0,
    upsell_revenue_monthly: 0,
    has_multilingual_voice: false, languages_supported_count: 1,
    non_english_customer_pct: 28, multilingual_revenue_potential: 4200,
    has_accent_adaptation: false, accent_error_rate_pct: 22,
    accent_error_target_pct: 8, non_native_speaker_pct: 32,
    has_voice_biometrics: false, loyalty_identification_rate_pct: 0,
    loyalty_identification_target_pct: 50, voice_id_preference_pct: 0,
    has_human_handoff: true, handoff_rate_pct: 18,
    handoff_target_pct: 12, avg_handoff_time_seconds: 28,
    sentiment_detection_accuracy: 62,
    has_voice_accessibility: false, disabled_customer_pct: 10,
    accessibility_revenue_potential: 2800,
    visually_impaired_served_monthly: 0, motor_impaired_served_monthly: 0,
    elderly_served_monthly: 0,
    avg_voice_order_time_seconds: 68, avg_human_order_time_seconds: 95,
    voice_ai_uptime_pct: 96, voice_ai_cost_monthly: 800,
    labor_savings_monthly: 1200, avg_ticket_voice: 14,
    avg_ticket_human: 12, customer_satisfaction_voice_score: 72,
    customer_satisfaction_human_score: 70, competitor_voice_ai_score: 74,
    total_orders_monthly: 5200, voice_orders_monthly: 2600,
    monthly_revenue: 62000,
    voice_ai_setup_cost: 18000, voice_ai_subscription_cost_monthly: 800,
  },
  {
    location_id: 'phone', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'takeout',
    has_voice_ai_strategy: true, voice_ai_channels: 'phone,smart_speaker',
    voice_ai_provider: 'SoundHound', voice_ai_deployment_pct: 70,
    voice_order_accuracy_pct: 90, voice_order_accuracy_target_pct: 92,
    human_order_accuracy_pct: 82, order_error_rate_pct: 10,
    error_cost_monthly: 1200,
    has_voice_ai_upsell: true, voice_upsell_acceptance_pct: 38,
    voice_upsell_acceptance_target_pct: 40, avg_upsell_revenue_per_order: 2.40,
    upsell_revenue_monthly: 1800,
    has_multilingual_voice: false, languages_supported_count: 1,
    non_english_customer_pct: 24, multilingual_revenue_potential: 3800,
    has_accent_adaptation: false, accent_error_rate_pct: 16,
    accent_error_target_pct: 8, non_native_speaker_pct: 28,
    has_voice_biometrics: false, loyalty_identification_rate_pct: 0,
    loyalty_identification_target_pct: 50, voice_id_preference_pct: 0,
    has_human_handoff: true, handoff_rate_pct: 14,
    handoff_target_pct: 12, avg_handoff_time_seconds: 22,
    sentiment_detection_accuracy: 74,
    has_voice_accessibility: false, disabled_customer_pct: 9,
    accessibility_revenue_potential: 2200,
    visually_impaired_served_monthly: 0, motor_impaired_served_monthly: 0,
    elderly_served_monthly: 0,
    avg_voice_order_time_seconds: 62, avg_human_order_time_seconds: 90,
    voice_ai_uptime_pct: 98, voice_ai_cost_monthly: 600,
    labor_savings_monthly: 1800, avg_ticket_voice: 32,
    avg_ticket_human: 28, customer_satisfaction_voice_score: 78,
    customer_satisfaction_human_score: 72, competitor_voice_ai_score: 78,
    total_orders_monthly: 3200, voice_orders_monthly: 2240,
    monthly_revenue: 96000,
    voice_ai_setup_cost: 14000, voice_ai_subscription_cost_monthly: 600,
  },
  {
    location_id: 'kiosk', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'dine_in',
    has_voice_ai_strategy: true, voice_ai_channels: 'drive_thru,phone,kiosk,smart_speaker',
    voice_ai_provider: 'OpenCity', voice_ai_deployment_pct: 90,
    voice_order_accuracy_pct: 94, voice_order_accuracy_target_pct: 92,
    human_order_accuracy_pct: 82, order_error_rate_pct: 6,
    error_cost_monthly: 600,
    has_voice_ai_upsell: true, voice_upsell_acceptance_pct: 44,
    voice_upsell_acceptance_target_pct: 40, avg_upsell_revenue_per_order: 3.20,
    upsell_revenue_monthly: 4200,
    has_multilingual_voice: true, languages_supported_count: 4,
    non_english_customer_pct: 32, multilingual_revenue_potential: 5200,
    has_accent_adaptation: true, accent_error_rate_pct: 6,
    accent_error_target_pct: 8, non_native_speaker_pct: 35,
    has_voice_biometrics: true, loyalty_identification_rate_pct: 68,
    loyalty_identification_target_pct: 50, voice_id_preference_pct: 78,
    has_human_handoff: true, handoff_rate_pct: 8,
    handoff_target_pct: 12, avg_handoff_time_seconds: 15,
    sentiment_detection_accuracy: 88,
    has_voice_accessibility: true, disabled_customer_pct: 12,
    accessibility_revenue_potential: 3800,
    visually_impaired_served_monthly: 42, motor_impaired_served_monthly: 28,
    elderly_served_monthly: 180,
    avg_voice_order_time_seconds: 52, avg_human_order_time_seconds: 90,
    voice_ai_uptime_pct: 99, voice_ai_cost_monthly: 1100,
    labor_savings_monthly: 3200, avg_ticket_voice: 38,
    avg_ticket_human: 28, customer_satisfaction_voice_score: 84,
    customer_satisfaction_human_score: 74, competitor_voice_ai_score: 82,
    total_orders_monthly: 4800, voice_orders_monthly: 4320,
    monthly_revenue: 168000,
    voice_ai_setup_cost: 24000, voice_ai_subscription_cost_monthly: 1100,
  },
];

export const runVoiceOrderingEngine = async (
  db: ReturnType<typeof useDB>,
  config: VoiceOrderingConfig,
): Promise<{ alerts: VoiceOrderingAlert[]; generated: number }> => {
  const alerts: VoiceOrderingAlert[] = [];
  const now = new Date();

  let data: VoiceOrderingData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_voice_ai_strategy, voice_ai_channels, voice_ai_provider,
              voice_ai_deployment_pct,
              voice_order_accuracy_pct, voice_order_accuracy_target_pct,
              human_order_accuracy_pct, order_error_rate_pct,
              error_cost_monthly,
              has_voice_ai_upsell, voice_upsell_acceptance_pct,
              voice_upsell_acceptance_target_pct, avg_upsell_revenue_per_order,
              upsell_revenue_monthly,
              has_multilingual_voice, languages_supported_count,
              non_english_customer_pct, multilingual_revenue_potential,
              has_accent_adaptation, accent_error_rate_pct,
              accent_error_target_pct, non_native_speaker_pct,
              has_voice_biometrics, loyalty_identification_rate_pct,
              loyalty_identification_target_pct, voice_id_preference_pct,
              has_human_handoff, handoff_rate_pct,
              handoff_target_pct, avg_handoff_time_seconds,
              sentiment_detection_accuracy,
              has_voice_accessibility, disabled_customer_pct,
              accessibility_revenue_potential,
              visually_impaired_served_monthly, motor_impaired_served_monthly,
              elderly_served_monthly,
              avg_voice_order_time_seconds, avg_human_order_time_seconds,
              voice_ai_uptime_pct, voice_ai_cost_monthly,
              labor_savings_monthly, avg_ticket_voice, avg_ticket_human,
              customer_satisfaction_voice_score, customer_satisfaction_human_score,
              competitor_voice_ai_score, total_orders_monthly,
              voice_orders_monthly, monthly_revenue,
              voice_ai_setup_cost, voice_ai_subscription_cost_monthly
       FROM voice_ordering_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): VoiceOrderingData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_voice_ai_strategy: Boolean(r.has_voice_ai_strategy ?? false),
      voice_ai_channels: String(r.voice_ai_channels ?? 'none'),
      voice_ai_provider: String(r.voice_ai_provider ?? 'none'),
      voice_ai_deployment_pct: safeNumber(r.voice_ai_deployment_pct, 0),
      voice_order_accuracy_pct: safeNumber(r.voice_order_accuracy_pct, 0),
      voice_order_accuracy_target_pct: safeNumber(r.voice_order_accuracy_target_pct, 92),
      human_order_accuracy_pct: safeNumber(r.human_order_accuracy_pct, 0),
      order_error_rate_pct: safeNumber(r.order_error_rate_pct, 0),
      error_cost_monthly: safeNumber(r.error_cost_monthly, 0),
      has_voice_ai_upsell: Boolean(r.has_voice_ai_upsell ?? false),
      voice_upsell_acceptance_pct: safeNumber(r.voice_upsell_acceptance_pct, 0),
      voice_upsell_acceptance_target_pct: safeNumber(r.voice_upsell_acceptance_target_pct, 40),
      avg_upsell_revenue_per_order: safeNumber(r.avg_upsell_revenue_per_order, 0),
      upsell_revenue_monthly: safeNumber(r.upsell_revenue_monthly, 0),
      has_multilingual_voice: Boolean(r.has_multilingual_voice ?? false),
      languages_supported_count: safeNumber(r.languages_supported_count, 0),
      non_english_customer_pct: safeNumber(r.non_english_customer_pct, 0),
      multilingual_revenue_potential: safeNumber(r.multilingual_revenue_potential, 0),
      has_accent_adaptation: Boolean(r.has_accent_adaptation ?? false),
      accent_error_rate_pct: safeNumber(r.accent_error_rate_pct, 0),
      accent_error_target_pct: safeNumber(r.accent_error_target_pct, 8),
      non_native_speaker_pct: safeNumber(r.non_native_speaker_pct, 0),
      has_voice_biometrics: Boolean(r.has_voice_biometrics ?? false),
      loyalty_identification_rate_pct: safeNumber(r.loyalty_identification_rate_pct, 0),
      loyalty_identification_target_pct: safeNumber(r.loyalty_identification_target_pct, 50),
      voice_id_preference_pct: safeNumber(r.voice_id_preference_pct, 0),
      has_human_handoff: Boolean(r.has_human_handoff ?? false),
      handoff_rate_pct: safeNumber(r.handoff_rate_pct, 0),
      handoff_target_pct: safeNumber(r.handoff_target_pct, 12),
      avg_handoff_time_seconds: safeNumber(r.avg_handoff_time_seconds, 0),
      sentiment_detection_accuracy: safeNumber(r.sentiment_detection_accuracy, 0),
      has_voice_accessibility: Boolean(r.has_voice_accessibility ?? false),
      disabled_customer_pct: safeNumber(r.disabled_customer_pct, 0),
      accessibility_revenue_potential: safeNumber(r.accessibility_revenue_potential, 0),
      visually_impaired_served_monthly: safeNumber(r.visually_impaired_served_monthly, 0),
      motor_impaired_served_monthly: safeNumber(r.motor_impaired_served_monthly, 0),
      elderly_served_monthly: safeNumber(r.elderly_served_monthly, 0),
      avg_voice_order_time_seconds: safeNumber(r.avg_voice_order_time_seconds, 0),
      avg_human_order_time_seconds: safeNumber(r.avg_human_order_time_seconds, 0),
      voice_ai_uptime_pct: safeNumber(r.voice_ai_uptime_pct, 0),
      voice_ai_cost_monthly: safeNumber(r.voice_ai_cost_monthly, 0),
      labor_savings_monthly: safeNumber(r.labor_savings_monthly, 0),
      avg_ticket_voice: safeNumber(r.avg_ticket_voice, 0),
      avg_ticket_human: safeNumber(r.avg_ticket_human, 0),
      customer_satisfaction_voice_score: safeNumber(r.customer_satisfaction_voice_score, 0),
      customer_satisfaction_human_score: safeNumber(r.customer_satisfaction_human_score, 0),
      competitor_voice_ai_score: safeNumber(r.competitor_voice_ai_score, 0),
      total_orders_monthly: safeNumber(r.total_orders_monthly, 0),
      voice_orders_monthly: safeNumber(r.voice_orders_monthly, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      voice_ai_setup_cost: safeNumber(r.voice_ai_setup_cost, 0),
      voice_ai_subscription_cost_monthly: safeNumber(r.voice_ai_subscription_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetSpeedLiftSeconds = 25;
    const targetAccuracyLiftPts = 8;
    const targetLaborSavings = Math.round(baselineRevenue * 0.04);
    const targetMultilingualRevenue = Math.round(baselineRevenue * 0.05);
    const targetAccessibilityRevenue = Math.round(baselineRevenue * 0.03);
    const targetSatisfactionLiftPts = 12;

    // Rule 1: VOICE_AI_STRATEGY_ABSENT
    if (config.requireVoiceAiStrategy && !d.has_voice_ai_strategy) {
      // no voice AI -> missed 20-30s/order + 25-40% labor reduction
      const expectedSpeedRevenue = Math.round(d.total_orders_monthly * 0.5 * (d.avg_human_order_time_seconds / 60) * 2);
      const expectedLaborSavings = Math.round(baselineRevenue * 0.05);
      const expectedUpsellRevenue = Math.round(d.total_orders_monthly * 0.35 * 2.5);
      const expectedAccuracySavings = Math.round(d.error_cost_monthly * 0.35);
      const totalOpportunity = Math.max(expectedSpeedRevenue + expectedLaborSavings + expectedUpsellRevenue + expectedAccuracySavings, 3200);
      const severityLabel = d.competitor_voice_ai_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_voice_ai_score > 65)
        ? 'CRITICAL: NO VOICE AI STRATEGY — competitor voice AI score ' + d.competitor_voice_ai_score + '/100 (high); voice AI reduces order time 20-30 seconds per car = $50-100/day additional revenue (QSR Magazine); McDonald AI drive-thru pilot showed 85% order accuracy (vs 80% human); voice AI reduces front-counter labor 25-40% during peak (NRA); 45% of QSRs plan voice AI deployment by 2026 (Restaurant Business); missing voice AI = missed speed + labor savings + upsell + accuracy. '
        : `HIGH: NO VOICE AI STRATEGY — voice AI reduces order time 20-30s/order (QSR Magazine); reduces labor 25-40% (NRA); 45% of QSRs plan deployment by 2026; missing speed + labor + upsell + accuracy. `;
      alerts.push({
        rule_id: 'voice_ai_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_voice_ai_strategy: d.has_voice_ai_strategy,
        voice_ai_channels: d.voice_ai_channels,
        voice_ai_provider: d.voice_ai_provider,
        voice_ai_deployment_pct: d.voice_ai_deployment_pct,
        human_order_accuracy_pct: d.human_order_accuracy_pct,
        order_error_rate_pct: d.order_error_rate_pct,
        error_cost_monthly: d.error_cost_monthly,
        avg_human_order_time_seconds: d.avg_human_order_time_seconds,
        competitor_voice_ai_score: d.competitor_voice_ai_score,
        total_orders_monthly: d.total_orders_monthly,
        monthly_revenue: d.monthly_revenue,
        voice_ai_setup_cost: d.voice_ai_setup_cost,
        voice_ai_subscription_cost_monthly: d.voice_ai_subscription_cost_monthly,
        speed_lift_projected_seconds: targetSpeedLiftSeconds,
        labor_savings_projected: expectedLaborSavings,
        upsell_revenue_projected: expectedUpsellRevenue,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VOICE AI STRATEGY ABSENT: ${d.location_id} — voice AI strategy ABSENT; channels: ${d.voice_ai_channels}; provider: ${d.voice_ai_provider}; deployment ${d.voice_ai_deployment_pct}%; human order accuracy ${d.human_order_accuracy_pct}%; error rate ${d.order_error_rate_pct}%; error cost ${fmt$(d.error_cost_monthly)}/mo; avg human order time ${d.avg_human_order_time_seconds}s; competitor voice AI ${d.competitor_voice_ai_score}/100; total orders ${d.total_orders_monthly}/mo; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: voice AI in drive-thru reduces order time 20-30 seconds per car = $50-100/day additional revenue (QSR Magazine); McDonald AI drive-thru pilot showed 85% order accuracy (vs 80% human); voice AI phone ordering handles 24/7 with no hold time — 35% of phone orders abandoned when hold time >30s; 60% of customers prefer voice ordering over touch-tone IVR (Nuance study); smart speaker restaurant ordering (Alexa, Google Assistant) growing 40% YoY — 15% of US households order food via smart speaker; voice AI reduces front-counter labor 25-40% during peak (NRA); voice AI implementation cost $5k-25k setup + $200-1,000/month (per location); voice AI ROI = $3-8 per $1 spent (labor savings + upsell + accuracy); 45% of QSRs plan voice AI deployment by 2026 (Restaurant Business); voice AI channels = drive-thru (Presto, SoundHound, OpenCity), phone (no hold time, 24/7), smart speaker (Alexa, Google Assistant), in-restaurant kiosk (hands-free). Solutions ranked by impact: (1) LAUNCH voice AI strategy — speed revenue ${fmt$(expectedSpeedRevenue)}/mo + labor savings ${fmt$(expectedLaborSavings)}/mo + upsell revenue ${fmt$(expectedUpsellRevenue)}/mo + accuracy savings ${fmt$(expectedAccuracySavings)}/mo; cost ${fmt$(12000)} setup + ${fmt$(600)}/mo subscription; payback 3-6 months; (2) CHOOSE voice AI provider (Presto drive-thru, SoundHound phone/smart speaker, OpenCity multi-channel, Google); (3) DEPLOY on highest-traffic channel first (drive-thru or phone); (4) INTEGRATE with POS (order flow, payment, loyalty); (5) TRAIN voice AI on menu (item names, modifiers, pronunciations); (6) TEST accuracy 85%+ before full deployment; (7) IMPLEMENT upsell automation (35-45% acceptance); (8) ADD multi-language (22% non-English households); (9) ADD accent adaptation (reduce non-native errors 40-60%); (10) ADD voice biometrics (loyalty ID by voice); (11) ADD human handoff (sentiment detection); (12) ADD accessibility (visually impaired, motor-impaired, elderly); (13) BENCHMARK vs competitor voice AI. Industry data: 20-30s/order speed (QSR Magazine); 25-40% labor reduction (NRA); $3-8 ROI per $1; payback 3-6 months. Expected impact: -${targetSpeedLiftSeconds}s/order, +${fmt$(expectedLaborSavings)}/mo labor savings, +${fmt$(expectedUpsellRevenue)}/mo upsell, payback 3-6 months.`,
        ai_recommendation: 'launch_voice_ai_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: VOICE_ORDER_ACCURACY_LOW
    if (d.has_voice_ai_strategy && d.voice_order_accuracy_pct < config.minVoiceOrderAccuracyPct) {
      // accuracy <90% -> errors + comps + churn
      const accuracyGap = Math.max(config.minVoiceOrderAccuracyPct - d.voice_order_accuracy_pct, 0);
      const expectedAccuracySavings = Math.round(d.error_cost_monthly * (accuracyGap / d.order_error_rate_pct));
      const expectedCompReduction = Math.round(d.voice_orders_monthly * (accuracyGap / 100) * 8);
      const expectedRetentionLift = Math.round(d.voice_orders_monthly * (accuracyGap / 100) * d.avg_ticket_voice * 0.3);
      const expectedReputationLift = Math.round(baselineRevenue * (accuracyGap / 500));
      const totalOpportunity = Math.max(expectedAccuracySavings + expectedCompReduction + expectedRetentionLift + expectedReputationLift, 1800);
      const severityLabel = d.voice_order_accuracy_pct < 85 ? 'high' : 'medium';
      const criticalNote = (d.voice_order_accuracy_pct < 85)
        ? `HIGH: VOICE ORDER ACCURACY LOW — ${d.voice_order_accuracy_pct}% (min ${config.minVoiceOrderAccuracyPct}%); accuracy benchmark = 90-95% (human 80-85%, voice AI 85-92% with training); low accuracy = errors + comps + churn + negative reviews; McDonald AI pilot showed 85% accuracy (vs 80% human) — aim higher. `
        : `MEDIUM: VOICE ACCURACY BELOW TARGET — ${d.voice_order_accuracy_pct}% (min ${config.minVoiceOrderAccuracyPct}%); train voice AI for higher accuracy. `;
      alerts.push({
        rule_id: 'voice_order_accuracy_low',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_voice_ai_strategy: d.has_voice_ai_strategy,
        voice_ai_provider: d.voice_ai_provider,
        voice_order_accuracy_pct: d.voice_order_accuracy_pct,
        voice_order_accuracy_target_pct: d.voice_order_accuracy_target_pct,
        human_order_accuracy_pct: d.human_order_accuracy_pct,
        order_error_rate_pct: d.order_error_rate_pct,
        error_cost_monthly: d.error_cost_monthly,
        voice_orders_monthly: d.voice_orders_monthly,
        avg_ticket_voice: d.avg_ticket_voice,
        voice_ai_subscription_cost_monthly: d.voice_ai_subscription_cost_monthly,
        monthly_revenue: d.monthly_revenue,
        accuracy_lift_projected_pts: accuracyGap,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VOICE ORDER ACCURACY LOW: ${d.location_id} — voice order accuracy ${d.voice_order_accuracy_pct}% (min ${config.minVoiceOrderAccuracyPct}%, target ${d.voice_order_accuracy_target_pct}%); human accuracy ${d.human_order_accuracy_pct}%; error rate ${d.order_error_rate_pct}%; error cost ${fmt$(d.error_cost_monthly)}/mo; voice orders ${d.voice_orders_monthly}/mo; avg ticket ${fmt$(d.avg_ticket_voice)}; provider ${d.voice_ai_provider}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: voice AI order accuracy benchmark = 90-95% (human 80-85%, voice AI 85-92% with training); McDonald AI drive-thru pilot showed 85% order accuracy (vs 80% human); accuracy <90% = errors + comps + churn + negative reviews; accuracy improvement methods = train on more audio samples (10,000+ hours), menu item training (pronunciations, modifiers, abbreviations), accent adaptation (reduce non-native errors 40-60%), context awareness (understand order context), confidence scoring (handoff when low confidence), continuous learning (improve from corrections); accuracy cost = errors cost $2-5 per error (comp, remake, time), 10% error rate = $2-5/order error cost; accuracy best practice = target 92%+, train on menu-specific audio, test before deployment, monitor weekly, retrain when accuracy drops. Solutions ranked by impact: (1) IMPROVE voice accuracy to ${config.minVoiceOrderAccuracyPct}%+ — accuracy savings ${fmt$(expectedAccuracySavings)}/mo + comp reduction ${fmt$(expectedCompReduction)}/mo + retention lift ${fmt$(expectedRetentionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo; cost ${fmt$(300)}/mo (additional training); payback <1 month; (2) TRAIN on more audio samples (10,000+ hours); (3) TRAIN on menu-specific items (pronunciations, modifiers, abbreviations); (4) IMPLEMENT accent adaptation (reduce non-native errors 40-60%); (5) ADD context awareness (understand order context); (6) IMPLEMENT confidence scoring (handoff when low confidence); (7) ENABLE continuous learning (improve from corrections); (8) TEST accuracy before deployment (85%+ minimum); (9) MONITOR accuracy weekly (retrain when drops); (10) TARGET 92%+ accuracy; (11) BENCHMARK vs competitor voice accuracy. Industry data: 90-95% accuracy benchmark; McDonald 85% pilot; payback <1 month. Expected impact: +${accuracyGap}pts accuracy, +10pts satisfaction, payback <1 month.`,
        ai_recommendation: 'improve_voice_accuracy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: VOICE_AI_UPSELL_AUTOMATION_ABSENT
    if (d.has_voice_ai_strategy && config.requireVoiceAiUpsell && !d.has_voice_ai_upsell) {
      // no automated upsell -> missed 35-45% acceptance
      const expectedUpsellRevenue = Math.round(d.voice_orders_monthly * 0.40 * 2.80);
      const expectedTicketLift = Math.round(d.voice_orders_monthly * 0.50);
      const expectedConsistencyLift = Math.round(baselineRevenue * 0.02);
      const expectedLaborEfficiency = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedUpsellRevenue + expectedTicketLift + expectedConsistencyLift + expectedLaborEfficiency, 1800);
      const severityLabel = d.voice_orders_monthly > 1000 ? 'high' : 'medium';
      const criticalNote = (d.voice_orders_monthly > 1000)
        ? `HIGH: NO VOICE AI UPSELL AUTOMATION — ${d.voice_orders_monthly} voice orders/mo with no automated upsell; voice AI upsell acceptance = 35-45% vs 15-20% human (consistent prompts, no awkwardness); missing upsell = ${fmt$(expectedUpsellRevenue)}/mo missed revenue; automated upsell is consistent, never forgets, never feels pushy. `
        : `MEDIUM: NO VOICE AI UPSELL — add automated upsell for 35-45% acceptance. `;
      alerts.push({
        rule_id: 'voice_ai_upsell_automation_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_voice_ai_upsell: d.has_voice_ai_upsell,
        voice_upsell_acceptance_pct: d.voice_upsell_acceptance_pct,
        voice_upsell_acceptance_target_pct: d.voice_upsell_acceptance_target_pct,
        avg_upsell_revenue_per_order: d.avg_upsell_revenue_per_order,
        upsell_revenue_monthly: d.upsell_revenue_monthly,
        voice_orders_monthly: d.voice_orders_monthly,
        avg_ticket_voice: d.avg_ticket_voice,
        voice_ai_subscription_cost_monthly: d.voice_ai_subscription_cost_monthly,
        monthly_revenue: d.monthly_revenue,
        upsell_revenue_projected: expectedUpsellRevenue,
        satisfaction_lift_projected_pts: 8,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VOICE AI UPSELL AUTOMATION ABSENT: ${d.location_id} — voice AI upsell ABSENT; upsell acceptance ${d.voice_upsell_acceptance_pct}% (target ${d.voice_upsell_acceptance_target_pct}%); avg upsell revenue ${fmt$(d.avg_upsell_revenue_per_order)}/order; upsell revenue ${fmt$(d.upsell_revenue_monthly)}/mo; voice orders ${d.voice_orders_monthly}/mo; avg ticket ${fmt$(d.avg_ticket_voice)}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: voice AI upsell acceptance = 35-45% vs 15-20% human (consistent prompts, no awkwardness, no forgetting); automated upsell is consistent (never forgets), personalized (based on order history), contextual (suggests complementary items), non-pushy (natural language); upsell types = add-on (fries with burger), upgrade (large vs medium), combo (meal deal), dessert (after main), beverage (with food); upsell best practice = 1 upsell per order (not pushy), contextual (complementary to order), personalized (loyalty history), natural language (not robotic), A/B test prompts (which converts best?); upsell revenue = 35-45% acceptance x $2-3 per upsell = $0.70-1.35 per order; 2,000 voice orders/mo = $1,400-2,700/mo upsell revenue. Solutions ranked by impact: (1) IMPLEMENT voice AI upsell — upsell revenue ${fmt$(expectedUpsellRevenue)}/mo + ticket lift ${fmt$(expectedTicketLift)}/mo + consistency ${fmt$(expectedConsistencyLift)}/mo + labor efficiency ${fmt$(expectedLaborEfficiency)}/mo; cost ${fmt$(200)}/mo (upsell module); payback <1 month; (2) DESIGN upsell prompts (add-on, upgrade, combo, dessert, beverage); (3) MAKE contextual (suggest complementary to order); (4) PERSONALIZE (based on loyalty history); (5) USE natural language (not robotic); (6) LIMIT to 1 upsell per order (not pushy); (7) A/B test prompts (which converts best?); (8) TRACK acceptance rate (target ${config.minVoiceUpsellAcceptancePct}%+); (9) TRACK upsell revenue per order (target $2-3); (10) OPTIMIZE prompts quarterly; (11) BENCHMARK vs competitor upsell automation. Industry data: 35-45% upsell acceptance (vs 15-20% human); payback <1 month. Expected impact: +${fmt$(expectedUpsellRevenue)}/mo upsell revenue, +8pts satisfaction, payback <1 month.`,
        ai_recommendation: 'implement_voice_upsell',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: VOICE_AI_MULTILINGUAL_ABSENT
    if (d.has_voice_ai_strategy && config.requireMultilingualVoice && (!d.has_multilingual_voice || d.languages_supported_count < config.minLanguagesSupported)) {
      // no multi-language -> missed 22% non-English households
      const expectedMultilingualRevenue = Math.round(d.multilingual_revenue_potential * 0.60);
      const expectedNewCustomerAcquisition = Math.round(d.total_orders_monthly * (d.non_english_customer_pct / 100) * 0.15 * d.avg_ticket_voice);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.02);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedMultilingualRevenue + expectedNewCustomerAcquisition + expectedSatisfactionLift + expectedCompetitiveLift, 1600);
      const severityLabel = d.non_english_customer_pct > 25 ? 'high' : 'medium';
      const criticalNote = (d.non_english_customer_pct > 25)
        ? `HIGH: NO MULTILINGUAL VOICE AI — ${d.non_english_customer_pct}% non-English customers (22% US households speak non-English at home, Census); languages supported ${d.languages_supported_count} (min ${config.minLanguagesSupported}); missing multi-language = missed non-English revenue + missed customer acquisition; multi-language voice AI serves diverse demographics. `
        : `MEDIUM: MULTILINGUAL VOICE AI BELOW TARGET — ${d.languages_supported_count} languages (min ${config.minLanguagesSupported}); add languages for ${d.non_english_customer_pct}% non-English customers. `;
      alerts.push({
        rule_id: 'voice_ai_multilingual_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_multilingual_voice: d.has_multilingual_voice,
        languages_supported_count: d.languages_supported_count,
        non_english_customer_pct: d.non_english_customer_pct,
        multilingual_revenue_potential: d.multilingual_revenue_potential,
        total_orders_monthly: d.total_orders_monthly,
        avg_ticket_voice: d.avg_ticket_voice,
        competitor_voice_ai_score: d.competitor_voice_ai_score,
        monthly_revenue: d.monthly_revenue,
        multilingual_revenue_projected: expectedMultilingualRevenue,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `MULTILINGUAL VOICE AI ABSENT: ${d.location_id} — multilingual voice ${d.has_multilingual_voice ? 'present' : 'ABSENT'}; languages supported ${d.languages_supported_count} (min ${config.minLanguagesSupported}); non-English customers ${d.non_english_customer_pct}%; multilingual revenue potential ${fmt$(d.multilingual_revenue_potential)}/mo; total orders ${d.total_orders_monthly}/mo; avg ticket ${fmt$(d.avg_ticket_voice)}; competitor voice AI ${d.competitor_voice_ai_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 22% of US households speak non-English at home (US Census); multi-language voice AI serves diverse demographics (Spanish 13%, Chinese 1.6%, Tagalog 1.4%, Vietnamese 1.1%, French 0.8%, Arabic 0.7%, Korean 0.6%); non-English customers prefer ordering in native language = higher satisfaction + higher conversion; multi-language voice AI reduces order errors 30-40% for non-English speakers; multi-language implementation = language detection (auto-detect from first words), language selection (press 1 for English, 2 for Spanish), language training (10,000+ hours per language); multi-language cost = $200-500/month per additional language; multi-language best practice = start with top 2-3 non-English languages in your area, train on menu in each language, test accuracy per language. Solutions ranked by impact: (1) ADD multilingual voice AI — multilingual revenue ${fmt$(expectedMultilingualRevenue)}/mo + new customer acquisition ${fmt$(expectedNewCustomerAcquisition)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(400)}/mo per language; payback 1-2 months; (2) ANALYZE customer demographics (top non-English languages in your area); (3) ADD top 2-3 non-English languages (Spanish, Chinese, Tagalog most common); (4) TRAIN voice AI on menu in each language (item names, modifiers); (5) IMPLEMENT language detection (auto-detect from first words); (6) OR language selection (press 1 for English, 2 for Spanish); (7) TEST accuracy per language (85%+); (8) MONITOR usage per language (which most used?); (9) ADD more languages based on demand; (10) BENCHMARK vs competitor multi-language support. Industry data: 22% non-English households (Census); 30-40% error reduction for non-English; payback 1-2 months. Expected impact: +${fmt$(expectedMultilingualRevenue)}/mo multilingual revenue, +10pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'add_multilingual_voice',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: VOICE_AI_ACCENT_ADAPTATION_ABSENT
    if (d.has_voice_ai_strategy && config.requireAccentAdaptation && (!d.has_accent_adaptation || d.accent_error_rate_pct > config.maxAccentErrorRatePct)) {
      // no accent adaptation -> 40-60% errors for non-native
      const accentGap = Math.max(d.accent_error_rate_pct - config.maxAccentErrorRatePct, 0);
      const expectedAccentErrorReduction = Math.round(d.voice_orders_monthly * (d.non_native_speaker_pct / 100) * (accentGap / 100) * 6);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.02);
      const expectedRetentionLift = Math.round(d.voice_orders_monthly * (d.non_native_speaker_pct / 100) * (accentGap / 100) * d.avg_ticket_voice * 0.4);
      const expectedReputationLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedAccentErrorReduction + expectedSatisfactionLift + expectedRetentionLift + expectedReputationLift, 1400);
      const severityLabel = d.accent_error_rate_pct > 20 ? 'high' : 'medium';
      const criticalNote = (d.accent_error_rate_pct > 20)
        ? `HIGH: NO ACCENT ADAPTATION — accent error rate ${d.accent_error_rate_pct}% (max ${config.maxAccentErrorRatePct}%); ${d.non_native_speaker_pct}% non-native speakers; accent adaptation reduces order errors 40-60% for non-native speakers; missing adaptation = high errors + frustration + churn for diverse demographics. `
        : `MEDIUM: ACCENT ERROR RATE ABOVE TARGET — ${d.accent_error_rate_pct}% (max ${config.maxAccentErrorRatePct}%); implement accent adaptation for ${d.non_native_speaker_pct}% non-native speakers. `;
      alerts.push({
        rule_id: 'voice_ai_accent_adaptation_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_accent_adaptation: d.has_accent_adaptation,
        accent_error_rate_pct: d.accent_error_rate_pct,
        accent_error_target_pct: d.accent_error_target_pct,
        non_native_speaker_pct: d.non_native_speaker_pct,
        voice_orders_monthly: d.voice_orders_monthly,
        avg_ticket_voice: d.avg_ticket_voice,
        voice_ai_subscription_cost_monthly: d.voice_ai_subscription_cost_monthly,
        monthly_revenue: d.monthly_revenue,
        accuracy_lift_projected_pts: Math.round(accentGap / 2),
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ACCENT ADAPTATION ABSENT: ${d.location_id} — accent adaptation ${d.has_accent_adaptation ? 'present' : 'ABSENT'}; accent error rate ${d.accent_error_rate_pct}% (max ${config.maxAccentErrorRatePct}%, target ${d.accent_error_target_pct}%); non-native speakers ${d.non_native_speaker_pct}%; voice orders ${d.voice_orders_monthly}/mo; avg ticket ${fmt$(d.avg_ticket_voice)}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: accent adaptation reduces order errors 40-60% for non-native speakers (voice AI accent study); non-native speakers have 2-3x higher error rates without adaptation (28% vs 8%); accent adaptation = train on diverse accents (regional US, non-native English), accent detection (identify accent type), accent-specific models (adapt recognition to accent); accent adaptation cost = $200-400/month (additional training); accent adaptation best practice = train on 10,000+ hours of diverse accents, test accuracy per accent group, monitor error rates per accent, retrain when errors spike; accent types = regional US (Southern, New York, Boston, Midwest), non-native English (Spanish, Chinese, Indian, Vietnamese, Korean, French, German, Russian); 35% of US restaurant customers are non-native English speakers (urban markets higher). Solutions ranked by impact: (1) IMPLEMENT accent adaptation — accent error reduction ${fmt$(expectedAccentErrorReduction)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + retention ${fmt$(expectedRetentionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo; cost ${fmt$(300)}/mo (accent training); payback 1-2 months; (2) TRAIN on diverse accents (10,000+ hours); (3) INCLUDE regional US accents (Southern, New York, Boston, Midwest); (4) INCLUDE non-native English accents (Spanish, Chinese, Indian, Vietnamese, Korean); (5) IMPLEMENT accent detection (identify accent type); (6) USE accent-specific models (adapt recognition); (7) TEST accuracy per accent group (85%+); (8) MONITOR error rates per accent; (9) RETRAIN when errors spike; (10) ADD more accents based on customer demographics; (11) BENCHMARK vs competitor accent adaptation. Industry data: 40-60% error reduction with adaptation; 35% non-native speakers (urban); payback 1-2 months. Expected impact: +${Math.round(accentGap / 2)}pts accuracy, +12pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'implement_accent_adaptation',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: VOICE_BIOMETRICS_ABSENT
    if (d.has_voice_ai_strategy && config.requireVoiceBiometrics && !d.has_voice_biometrics) {
      // no voice ID -> missed 78% preference + loyalty friction
      const expectedLoyaltyLift = Math.round(d.voice_orders_monthly * 0.20 * 4);
      const expectedFrictionReduction = Math.round(d.voice_orders_monthly * 0.10 * 2);
      const expectedPersonalization = Math.round(d.voice_orders_monthly * 0.15 * 3);
      const expectedReducedFraud = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedLoyaltyLift + expectedFrictionReduction + expectedPersonalization + expectedReducedFraud, 1200);
      const severityLabel = d.voice_orders_monthly > 1500 ? 'medium' : 'low';
      const criticalNote = (d.voice_orders_monthly > 1500)
        ? `MEDIUM: NO VOICE BIOMETRICS — ${d.voice_orders_monthly} voice orders/mo with no voice ID; voice biometrics identifies loyalty members by voice (no card/app needed) — 78% prefer voice ID over card/app; missing voice ID = loyalty friction + missed personalization + missed fraud prevention. `
        : `LOW: NO VOICE BIOMETRICS — implement voice ID for loyalty identification. `;
      alerts.push({
        rule_id: 'voice_biometrics_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_voice_biometrics: d.has_voice_biometrics,
        loyalty_identification_rate_pct: d.loyalty_identification_rate_pct,
        loyalty_identification_target_pct: d.loyalty_identification_target_pct,
        voice_id_preference_pct: d.voice_id_preference_pct,
        voice_orders_monthly: d.voice_orders_monthly,
        competitor_voice_ai_score: d.competitor_voice_ai_score,
        monthly_revenue: d.monthly_revenue,
        voice_ai_subscription_cost_monthly: d.voice_ai_subscription_cost_monthly,
        satisfaction_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VOICE BIOMETRICS ABSENT: ${d.location_id} — voice biometrics ${d.has_voice_biometrics ? 'present' : 'ABSENT'}; loyalty identification rate ${d.loyalty_identification_rate_pct}% (target ${d.loyalty_identification_target_pct}%); voice ID preference ${d.voice_id_preference_pct}%; voice orders ${d.voice_orders_monthly}/mo; competitor voice AI ${d.competitor_voice_ai_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: voice biometrics identifies loyalty members by voice (no card/app needed) — 78% prefer voice ID over card/app (voice biometrics preference study); voice biometrics = voiceprint matching (unique voice characteristics), speaker identification (who is speaking), speaker verification (confirm identity); voice biometrics enables = automatic loyalty identification (no card/app), personalized greetings (welcome back, [name]), personalized recommendations (based on history), seamless payment (voice-authorized), fraud prevention (voiceprint can't be stolen like card); voice biometrics accuracy = 95-99% (comparable to fingerprint); voice biometrics cost = $200-500/month (biometrics module); voice biometrics best practice = enroll loyalty members (30-second voiceprint), identify at order start, verify for payment, store securely (encrypted, GDPR compliant). Solutions ranked by impact: (1) IMPLEMENT voice biometrics — loyalty lift ${fmt$(expectedLoyaltyLift)}/mo + friction reduction ${fmt$(expectedFrictionReduction)}/mo + personalization ${fmt$(expectedPersonalization)}/mo + reduced fraud ${fmt$(expectedReducedFraud)}/mo; cost ${fmt$(400)}/mo (biometrics module); payback 2-3 months; (2) ENROLL loyalty members (30-second voiceprint); (3) IMPLEMENT voiceprint matching (unique voice characteristics); (4) IDENTIFY at order start (who is speaking?); (5) VERIFY for payment (confirm identity); (6) ENABLE personalized greetings (welcome back, [name]); (7) ENABLE personalized recommendations (based on history); (8) ENABLE seamless payment (voice-authorized); (9) ENABLE fraud prevention (voiceprint can't be stolen); (10) STORE securely (encrypted, GDPR compliant); (11) TRACK identification rate (target ${config.minLoyaltyIdentificationPct}%+); (12) BENCHMARK vs competitor voice biometrics. Industry data: 78% prefer voice ID (preference study); 95-99% accuracy; payback 2-3 months. Expected impact: +14pts satisfaction, +${fmt$(expectedLoyaltyLift)}/mo loyalty lift, payback 2-3 months.`,
        ai_recommendation: 'implement_voice_biometrics',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: VOICE_AI_HUMAN_HANDOFF_ABSENT
    if (d.has_voice_ai_strategy && config.requireHumanHandoff && (!d.has_human_handoff || d.handoff_rate_pct > config.maxHandoffRatePct || d.sentiment_detection_accuracy < 60)) {
      // no human handoff -> frustrated customers + lost sales
      const expectedFrictionReduction = Math.round(d.voice_orders_monthly * 0.05 * d.avg_ticket_voice);
      const expectedRetentionLift = Math.round(d.voice_orders_monthly * 0.08 * d.avg_ticket_voice * 0.3);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.025);
      const expectedReputationLift = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedFrictionReduction + expectedRetentionLift + expectedSatisfactionLift + expectedReputationLift, 1400);
      const severityLabel = !d.has_human_handoff ? 'high' : 'medium';
      const criticalNote = (!d.has_human_handoff)
        ? `HIGH: NO HUMAN HANDOFF — when voice AI fails, no human fallback; frustrated customers + lost sales + negative reviews; handoff rate ${d.handoff_rate_pct}% (max ${config.maxHandoffRatePct}%); avg handoff time ${d.avg_handoff_time_seconds}s; sentiment detection ${d.sentiment_detection_accuracy}/100; human handoff = safety net when AI fails, sentiment detection identifies frustrated customers. `
        : `MEDIUM: HANDOFF RATE ABOVE TARGET — ${d.handoff_rate_pct}% (max ${config.maxHandoffRatePct}%); improve AI accuracy + handoff efficiency. `;
      alerts.push({
        rule_id: 'voice_ai_human_handoff_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_human_handoff: d.has_human_handoff,
        handoff_rate_pct: d.handoff_rate_pct,
        handoff_target_pct: d.handoff_target_pct,
        avg_handoff_time_seconds: d.avg_handoff_time_seconds,
        sentiment_detection_accuracy: d.sentiment_detection_accuracy,
        voice_order_accuracy_pct: d.voice_order_accuracy_pct,
        voice_orders_monthly: d.voice_orders_monthly,
        avg_ticket_voice: d.avg_ticket_voice,
        monthly_revenue: d.monthly_revenue,
        satisfaction_lift_projected_pts: 16,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `HUMAN HANDOFF ABSENT/SUBOPTIMAL: ${d.location_id} — human handoff ${d.has_human_handoff ? 'present' : 'ABSENT'}; handoff rate ${d.handoff_rate_pct}% (max ${config.maxHandoffRatePct}%, target ${d.handoff_target_pct}%); avg handoff time ${d.avg_handoff_time_seconds}s; sentiment detection ${d.sentiment_detection_accuracy}/100; voice accuracy ${d.voice_order_accuracy_pct}%; voice orders ${d.voice_orders_monthly}/mo; avg ticket ${fmt$(d.avg_ticket_voice)}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: human handoff = safety net when voice AI fails; without handoff, frustrated customers + lost sales + negative reviews; handoff triggers = low confidence (<70%), sentiment detection (frustration, anger), complex order (AI can't handle), customer request ('speak to human'); handoff rate = 8-15% of orders (too high = AI accuracy problem, too low = handoff not offered enough); handoff best practice = sentiment detection (identify frustrated customers), confidence scoring (handoff when <70% confidence), seamless transfer (context preserved, no re-explaining), staff alert (notify staff of handoff + context); sentiment detection accuracy = 70-90% (detect frustration, anger, confusion from voice tone, pace, volume). Solutions ranked by impact: (1) IMPLEMENT/OPTIMIZE human handoff — friction reduction ${fmt$(expectedFrictionReduction)}/mo + retention lift ${fmt$(expectedRetentionLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo; cost ${fmt$(200)}/mo (handoff module); payback 1-2 months; (2) IMPLEMENT sentiment detection (identify frustrated customers from voice tone, pace, volume); (3) IMPLEMENT confidence scoring (handoff when <70% confidence); (4) ENABLE customer request handoff ('speak to human'); (5) ENABLE complex order handoff (AI can't handle); (6) ENSURE seamless transfer (context preserved, no re-explaining); (7) ALERT staff of handoff (notify + context); (8) TRACK handoff rate (target ${config.maxHandoffRatePct}% or lower); (9) TRACK handoff time (target <15s); (10) TRACK sentiment detection accuracy (target 70%+); (11) REDUCE handoff rate by improving AI accuracy; (12) BENCHMARK vs competitor handoff. Industry data: 8-15% handoff rate target; 70-90% sentiment detection accuracy; payback 1-2 months. Expected impact: +16pts satisfaction, +${fmt$(expectedFrictionReduction)}/mo friction reduction, payback 1-2 months.`,
        ai_recommendation: 'implement_human_handoff',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: VOICE_AI_ACCESSIBILITY_ABSENT
    if (d.has_voice_ai_strategy && config.requireVoiceAccessibility && !d.has_voice_accessibility) {
      // no voice accessibility -> missed 61M disabled Americans
      const expectedAccessibilityRevenue = Math.round(d.accessibility_revenue_potential * 0.70);
      const expectedNewCustomerAcquisition = Math.round(d.total_orders_monthly * (d.disabled_customer_pct / 100) * 0.20 * d.avg_ticket_voice);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.02);
      const expectedBrandReputationLift = Math.round(baselineRevenue * 0.025);
      const totalOpportunity = Math.max(expectedAccessibilityRevenue + expectedNewCustomerAcquisition + expectedSatisfactionLift + expectedBrandReputationLift, 1200);
      const severityLabel = 'medium';
      const criticalNote = 'MEDIUM: NO VOICE ACCESSIBILITY — 61M Americans with disabilities (CDC); voice AI accessibility serves visually impaired, motor-impaired, elderly; voice ordering = hands-free, eyes-free = accessible to all; missing accessibility = missed customers + missed brand reputation; voice AI is inherently accessible (no touch, no sight needed). ';
      alerts.push({
        rule_id: 'voice_ai_accessibility_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_voice_accessibility: d.has_voice_accessibility,
        disabled_customer_pct: d.disabled_customer_pct,
        accessibility_revenue_potential: d.accessibility_revenue_potential,
        visually_impaired_served_monthly: d.visually_impaired_served_monthly,
        motor_impaired_served_monthly: d.motor_impaired_served_monthly,
        elderly_served_monthly: d.elderly_served_monthly,
        total_orders_monthly: d.total_orders_monthly,
        avg_ticket_voice: d.avg_ticket_voice,
        competitor_voice_ai_score: d.competitor_voice_ai_score,
        monthly_revenue: d.monthly_revenue,
        accessibility_revenue_projected: expectedAccessibilityRevenue,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VOICE ACCESSIBILITY ABSENT: ${d.location_id} — voice accessibility ${d.has_voice_accessibility ? 'present' : 'ABSENT'}; disabled customers ${d.disabled_customer_pct}%; accessibility revenue potential ${fmt$(d.accessibility_revenue_potential)}/mo; visually impaired served ${d.visually_impaired_served_monthly}/mo; motor-impaired served ${d.motor_impaired_served_monthly}/mo; elderly served ${d.elderly_served_monthly}/mo; total orders ${d.total_orders_monthly}/mo; avg ticket ${fmt$(d.avg_ticket_voice)}; competitor voice AI ${d.competitor_voice_ai_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 61M Americans with disabilities (CDC — 1 in 4 adults); voice AI accessibility serves visually impaired (cannot see menu/kiosk), motor-impaired (cannot touch kiosk/phone), elderly (prefer voice over touch); voice ordering = hands-free, eyes-free = inherently accessible (no touch, no sight needed); voice AI accessibility features = screen reader compatibility (for kiosks with screens), voice-guided navigation (audio prompts), slow speech option (for elderly), simple language (avoid jargon), multiple retries (patience for disabled); accessibility market = 61M disabled Americans + 56M elderly (65+) = 117M potential customers; accessibility revenue = 8-12% of customer base; accessibility brand reputation = 78% view disability-friendly businesses positively (Cone); ADA compliance for digital = growing legal requirement (WCAG 2.1, ADA Title III). Solutions ranked by impact: (1) IMPLEMENT voice accessibility — accessibility revenue ${fmt$(expectedAccessibilityRevenue)}/mo + new customer acquisition ${fmt$(expectedNewCustomerAcquisition)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + brand reputation ${fmt$(expectedBrandReputationLift)}/mo; cost ${fmt$(200)}/mo (accessibility module); payback 1-2 months; (2) ENSURE screen reader compatibility (for kiosks with screens); (3) ADD voice-guided navigation (audio prompts); (4) ADD slow speech option (for elderly); (5) USE simple language (avoid jargon); (6) ALLOW multiple retries (patience for disabled); (7) TEST with disabled users (visually impaired, motor-impaired, elderly); (8) COMPLY with WCAG 2.1 (Web Content Accessibility Guidelines); (9) COMPLY with ADA Title III (Americans with Disabilities Act); (10) TRACK disabled customers served (visually impaired, motor-impaired, elderly); (11) TRACK accessibility revenue; (12) BENCHMARK vs competitor accessibility. Industry data: 61M disabled Americans (CDC); 56M elderly (65+); 78% view disability-friendly positively (Cone); payback 1-2 months. Expected impact: +${fmt$(expectedAccessibilityRevenue)}/mo accessibility revenue, +12pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'implement_voice_accessibility',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM voice_ordering_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE voice_ordering_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant voice AI and conversational AI expert. Given voice ordering data, recommend ONE specific action with expected speed lift, accuracy lift, upsell revenue, labor savings, or satisfaction lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Voice AI strategy: ${a.has_voice_ai_strategy ?? false} (channels: ${a.voice_ai_channels ?? 'none'}, provider: ${a.voice_ai_provider ?? 'none'}, deployment ${a.voice_ai_deployment_pct ?? 0}%). Accuracy: voice ${a.voice_order_accuracy_pct ?? 0}% (target ${a.voice_order_accuracy_target_pct ?? 92}%), human ${a.human_order_accuracy_pct ?? 0}%, error rate ${a.order_error_rate_pct ?? 0}%, error cost ${fmt$(a.error_cost_monthly ?? 0)}/mo. Upsell: ${a.has_voice_ai_upsell ?? false} (${a.voice_upsell_acceptance_pct ?? 0}% acceptance, ${fmt$(a.avg_upsell_revenue_per_order ?? 0)}/order, ${fmt$(a.upsell_revenue_monthly ?? 0)}/mo). Multilingual: ${a.has_multilingual_voice ?? false} (${a.languages_supported_count ?? 0} languages, ${a.non_english_customer_pct ?? 0}% non-English, potential ${fmt$(a.multilingual_revenue_potential ?? 0)}). Accent: ${a.has_accent_adaptation ?? false} (error ${a.accent_error_rate_pct ?? 0}%/${a.accent_error_target_pct ?? 8}%, ${a.non_native_speaker_pct ?? 0}% non-native). Biometrics: ${a.has_voice_biometrics ?? false} (loyalty ID ${a.loyalty_identification_rate_pct ?? 0}%/${a.loyalty_identification_target_pct ?? 50}%, ${a.voice_id_preference_pct ?? 0}% prefer voice ID). Handoff: ${a.has_human_handoff ?? false} (${a.handoff_rate_pct ?? 0}%/${a.handoff_target_pct ?? 12}%, ${a.avg_handoff_time_seconds ?? 0}s, sentiment ${a.sentiment_detection_accuracy ?? 0}/100). Accessibility: ${a.has_voice_accessibility ?? false} (${a.disabled_customer_pct ?? 0}% disabled, potential ${fmt$(a.accessibility_revenue_potential ?? 0)}, visually impaired ${a.visually_impaired_served_monthly ?? 0}, motor ${a.motor_impaired_served_monthly ?? 0}, elderly ${a.elderly_served_monthly ?? 0}). Speed: voice ${a.avg_voice_order_time_seconds ?? 0}s vs human ${a.avg_human_order_time_seconds ?? 0}s. Uptime: ${a.voice_ai_uptime_pct ?? 0}%. Cost: ${fmt$(a.voice_ai_cost_monthly ?? 0)}/mo. Labor savings: ${fmt$(a.labor_savings_monthly ?? 0)}/mo. Ticket: voice ${fmt$(a.avg_ticket_voice ?? 0)} vs human ${fmt$(a.avg_ticket_human ?? 0)}. Satisfaction: voice ${a.customer_satisfaction_voice_score ?? 0}/100 vs human ${a.customer_satisfaction_human_score ?? 0}/100. Competitor: ${a.competitor_voice_ai_score ?? 0}/100. Total orders: ${a.total_orders_monthly ?? 0}/mo. Voice orders: ${a.voice_orders_monthly ?? 0}/mo. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Setup cost: ${fmt$(a.voice_ai_setup_cost ?? 0)}. Subscription: ${fmt$(a.voice_ai_subscription_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveVoiceOrderingAlerts = async (db: ReturnType<typeof useDB>): Promise<VoiceOrderingAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM voice_ordering_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getVoiceOrderingSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  voiceAiStrategyAbsentCount: number;
  voiceOrderAccuracyLowCount: number;
  voiceAiUpsellAutomationAbsentCount: number;
  voiceAiMultilingualAbsentCount: number;
  voiceAiAccentAdaptationAbsentCount: number;
  voiceBiometricsAbsentCount: number;
  voiceAiHumanHandoffAbsentCount: number;
  voiceAiAccessibilityAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'voice_ai_strategy_absent') AS nostrategy,
              math::count(rule_id = 'voice_order_accuracy_low') AS lowaccuracy,
              math::count(rule_id = 'voice_ai_upsell_automation_absent') AS noupsell,
              math::count(rule_id = 'voice_ai_multilingual_absent') AS nomultilingual,
              math::count(rule_id = 'voice_ai_accent_adaptation_absent') AS noaccent,
              math::count(rule_id = 'voice_biometrics_absent') AS nobiometrics,
              math::count(rule_id = 'voice_ai_human_handoff_absent') AS nohandoff,
              math::count(rule_id = 'voice_ai_accessibility_absent') AS noaccessibility
       FROM voice_ordering_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      voiceAiStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      voiceOrderAccuracyLowCount: safeNumber(r.lowaccuracy, 0),
      voiceAiUpsellAutomationAbsentCount: safeNumber(r.noupsell, 0),
      voiceAiMultilingualAbsentCount: safeNumber(r.nomultilingual, 0),
      voiceAiAccentAdaptationAbsentCount: safeNumber(r.noaccent, 0),
      voiceBiometricsAbsentCount: safeNumber(r.nobiometrics, 0),
      voiceAiHumanHandoffAbsentCount: safeNumber(r.nohandoff, 0),
      voiceAiAccessibilityAbsentCount: safeNumber(r.noaccessibility, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, voiceAiStrategyAbsentCount: 0, voiceOrderAccuracyLowCount: 0, voiceAiUpsellAutomationAbsentCount: 0, voiceAiMultilingualAbsentCount: 0, voiceAiAccentAdaptationAbsentCount: 0, voiceBiometricsAbsentCount: 0, voiceAiHumanHandoffAbsentCount: 0, voiceAiAccessibilityAbsentCount: 0 };
  }
};

export const updateVoiceOrderingAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
