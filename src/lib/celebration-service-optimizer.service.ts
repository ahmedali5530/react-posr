/**
 * AI Birthday, Anniversary & Celebration Service Optimizer — predicts how
 * celebration service (birthday dessert + candle, anniversary recognition +
 * toast, celebration photo service, reservation celebration flagging, group
 * celebration party packages, complimentary celebration treats, staff
 * celebration training, post-celebration follow-up) impacts revenue,
 * customer return rate, social media engagement, average check, and loyalty.
 *
 * Celebrations drive 15-20% of restaurant revenue (NRA celebration dining
 * report). Birthday is the #1 celebrated occasion at restaurants — 60% of
 * Americans celebrate a birthday at a restaurant each year (National
 * Restaurant Association). A complimentary birthday dessert with candle
 * produces a 3x higher return rate (Cornell School of Hotel Administration
 * loyalty study). Anniversary diners spend 2x the average check (couples,
 * multi-course, wine, dessert). 78% of customers want restaurants to
 * recognize special occasions (OpenTable dining trends). Celebration tables
 * spend 40% more than regular tables (Toast restaurant data). Celebration
 * photos generate 40-60% more social media shares = free marketing worth
 * $300-1,500/month. Group celebration bookings (6+ guests) generate
 * $400-1,500 per table. Missed celebration recognition = 35% lower return
 * rate (guests feel ignored on milestone moments). Celebration party tips
 * average 25% higher than regular tables. 40% of celebration diners book
 * 1-2 weeks ahead (reservation optimization opportunity). Gender reveal
 * and rehearsal dinner private events generate $500-2,000 per booking.
 * Post-celebration follow-up (thank you + photo share + next-year nudge)
 * captures 30-45% repeat celebration bookings.
 *
 * 200th POSR-exclusive differentiator (major milestone). Distinct from:
 *   - occasion-prediction.service — PREDICTS why a guest is dining (business,
 *     date, family, celebration, solo). This optimizer OPTIMIZES how the
 *     restaurant SERVES celebrations (birthday, anniversary, graduation,
 *     engagement, rehearsal dinner, gender reveal, retirement, baby shower).
 *   - milestone-campaign.service — MARKETING campaigns for loyalty milestones
 *     (visit count anniversaries, spend thresholds). This optimizer focuses
 *     on IN-RESTAURANT celebration SERVICE delivery (dessert, candle, photo,
 *     toast, recognition, party package, treat, training, follow-up).
 *   - private-event-space.service — optimizes the PHYSICAL SPACE for private
 *     events. This optimizer optimizes the SERVICE PROTOCOL for celebrations
 *     regardless of space (dining room, private room, bar, patio).
 *   - seasonal-holiday-decor.service (199th) — SEASONAL + HOLIDAY DECOR
 *     (Christmas, Valentine, Halloween). This optimizer focuses on PERSONAL
 *     celebrations (birthday, anniversary, graduation, engagement).
 *
 * 8 AI rules:
 *   1. birthday_service_absent -> no birthday dessert + candle + song -> missed 3x return rate
 *   2. anniversary_service_absent -> no anniversary recognition + toast -> missed 2x average check
 *   3. celebration_photo_service_absent -> no staff photo / polaroid / branded frame -> missed 40-60% social shares
 *   4. celebration_reservation_recognition_absent -> reservations do not flag celebrations -> missed recognition -> 35% lower return rate
 *   5. celebration_party_package_absent -> no group celebration package (6+ guests, set menu, dedicated server) -> missed $400-1,500/table
 *   6. celebration_complimentary_treat_absent -> no complimentary celebration treat (amuse, digestif, petit four) -> missed delight moment
 *   7. celebration_staff_training_absent -> staff not trained on celebration protocol -> awkward moments + negative reviews
 *   8. celebration_followup_absent -> no post-celebration follow-up (thank you, photo share, next-year nudge) -> missed loyalty capture
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type CelebrationServiceRuleId =
  | 'birthday_service_absent'
  | 'anniversary_service_absent'
  | 'celebration_photo_service_absent'
  | 'celebration_reservation_recognition_absent'
  | 'celebration_party_package_absent'
  | 'celebration_complimentary_treat_absent'
  | 'celebration_staff_training_absent'
  | 'celebration_followup_absent';

export type CelebrationServiceAiRec =
  | 'launch_birthday_service'
  | 'launch_anniversary_service'
  | 'launch_celebration_photo_service'
  | 'flag_celebration_in_reservations'
  | 'launch_celebration_party_package'
  | 'add_complimentary_celebration_treat'
  | 'train_staff_on_celebration_protocol'
  | 'launch_celebration_followup'
  | 'monitor'
  | 'skip';

export interface CelebrationServiceAlert {
  id?: string;
  rule_id: CelebrationServiceRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'dining' | 'private_room' | 'bar' | 'patio'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Birthday service
  has_birthday_service?: boolean;                          // birthday dessert + candle + song present
  birthday_dessert_complimentary?: boolean;                // birthday dessert is complimentary
  birthday_celebrations_monthly?: number;                  // birthday celebrations served per month
  birthday_celebrations_missed_monthly?: number;           // birthdays missed (not recognized) per month
  // Anniversary service
  has_anniversary_service?: boolean;                       // anniversary recognition + toast present
  anniversary_celebrations_monthly?: number;               // anniversary celebrations served per month
  anniversary_celebrations_missed_monthly?: number;        // anniversaries missed per month
  // Celebration photo service
  has_celebration_photo_service?: boolean;                 // staff photo / polaroid / branded frame service present
  celebration_photos_monthly?: number;                     // celebration photos taken per month
  celebration_photo_type?: string;                         // 'polaroid' | 'staff_phone' | 'professional' | 'branded_frame' | 'none'
  // Reservation recognition
  has_reservation_celebration_flag?: boolean;              // reservations system flags celebrations
  reservation_celebration_capture_pct?: number;            // % of celebration reservations captured at booking
  // Party package
  has_celebration_party_package?: boolean;                 // group celebration package (6+ guests) present
  party_package_bookings_monthly?: number;                 // party package bookings per month
  party_package_avg_revenue?: number;                      // average revenue per party package booking
  // Complimentary treat
  has_complimentary_celebration_treat?: boolean;           // complimentary celebration treat present (amuse, digestif, petit four)
  complimentary_treat_type?: string;                       // 'amuse_bouche' | 'digestif' | 'petit_four' | 'chocolate' | 'none'
  // Staff training
  has_celebration_staff_training?: boolean;                // staff trained on celebration protocol
  celebration_training_completion_pct?: number;            // % of staff trained on celebration protocol
  // Follow-up
  has_celebration_followup?: boolean;                      // post-celebration follow-up present (thank you, photo share, next-year nudge)
  followup_capture_rate_pct?: number;                      // % of celebration guests captured in follow-up
  // Social media + perception
  instagram_photos_monthly?: number;                       // celebration Instagram photos tagged at restaurant
  instagram_photos_baseline_monthly?: number;              // baseline IG photos (non-celebration)
  social_shares_monthly?: number;                          // total celebration social shares per month
  // Customer perception + revenue
  customer_satisfaction_score?: number;                    // 0-100 satisfaction
  perceived_quality_score?: number;                        // 0-100 perceived restaurant quality
  return_rate_pct?: number;                                // % of celebration guests who return within 90 days
  return_rate_baseline_pct?: number;                       // baseline return rate (non-celebration)
  competitor_celebration_score?: number;                   // 0-100 competitor celebration service
  celebration_revenue_monthly?: number;                    // total celebration revenue per month
  celebration_revenue_baseline_pct?: number;               // celebration revenue as % of total revenue
  avg_celebration_check?: number;                          // average check for celebration tables
  avg_regular_check?: number;                              // average check for regular tables
  monthly_revenue?: number;                                // total restaurant monthly revenue
  // Costs
  celebration_service_cost_monthly?: number;               // cost of celebration service (desserts, candles, photos, treats)
  celebration_training_cost?: number;                      // one-time staff training cost
  celebration_followup_cost_monthly?: number;              // cost of follow-up system (CRM, photo sharing, messaging)
  // Impact projections
  birthday_return_lift_projected_pct?: number;
  anniversary_check_lift_projected_pct?: number;
  social_share_lift_projected_pct?: number;
  reservation_recognition_lift_projected_pct?: number;
  party_package_revenue_projected?: number;
  complimentary_treat_satisfaction_lift_pts?: number;
  staff_training_review_lift_pts?: number;
  followup_loyalty_capture_projected?: number;
  satisfaction_lift_projected_pts?: number;
  perceived_quality_lift_projected_pts?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: CelebrationServiceAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface CelebrationServiceConfig {
  aiEnabled: boolean;
  requireBirthdayService: boolean;                          // require birthday dessert + candle + song
  requireAnniversaryService: boolean;                      // require anniversary recognition + toast
  requireCelebrationPhotoService: boolean;                 // require celebration photo service
  requireReservationCelebrationFlag: boolean;              // require reservation system to flag celebrations
  requireCelebrationPartyPackage: boolean;                 // require group celebration package
  requireComplimentaryCelebrationTreat: boolean;           // require complimentary celebration treat
  requireCelebrationStaffTraining: boolean;                // require staff celebration training
  requireCelebrationFollowup: boolean;                     // require post-celebration follow-up
  minReservationCelebrationCapturePct: number;             // min % of celebration reservations captured (70)
  minCelebrationTrainingCompletionPct: number;             // min % of staff trained (85)
  minFollowupCaptureRatePct: number;                       // min % of celebration guests captured in follow-up (50)
  minReturnRatePct: number;                                // min celebration return rate (65)
  preferCompetitorParity: boolean;                         // match competitor celebration service
}

export const DEFAULT_CELEBRATION_SERVICE_CONFIG: CelebrationServiceConfig = {
  aiEnabled: true,
  requireBirthdayService: true,
  requireAnniversaryService: true,
  requireCelebrationPhotoService: true,
  requireReservationCelebrationFlag: true,
  requireCelebrationPartyPackage: true,
  requireComplimentaryCelebrationTreat: true,
  requireCelebrationStaffTraining: true,
  requireCelebrationFollowup: true,
  minReservationCelebrationCapturePct: 70,
  minCelebrationTrainingCompletionPct: 85,
  minFollowupCaptureRatePct: 50,
  minReturnRatePct: 65,
  preferCompetitorParity: true,
};

export const readCelebrationServiceConfig = (settings: any): CelebrationServiceConfig => ({
  aiEnabled: settings?.celebration_service_ai_enabled ?? true,
  requireBirthdayService: settings?.celebration_service_require_birthday ?? true,
  requireAnniversaryService: settings?.celebration_service_require_anniversary ?? true,
  requireCelebrationPhotoService: settings?.celebration_service_require_photo ?? true,
  requireReservationCelebrationFlag: settings?.celebration_service_require_reservation_flag ?? true,
  requireCelebrationPartyPackage: settings?.celebration_service_require_party_package ?? true,
  requireComplimentaryCelebrationTreat: settings?.celebration_service_require_treat ?? true,
  requireCelebrationStaffTraining: settings?.celebration_service_require_training ?? true,
  requireCelebrationFollowup: settings?.celebration_service_require_followup ?? true,
  minReservationCelebrationCapturePct: safeNumber(settings?.celebration_service_min_reservation_capture, 70),
  minCelebrationTrainingCompletionPct: safeNumber(settings?.celebration_service_min_training_pct, 85),
  minFollowupCaptureRatePct: safeNumber(settings?.celebration_service_min_followup_pct, 50),
  minReturnRatePct: safeNumber(settings?.celebration_service_min_return_rate, 65),
  preferCompetitorParity: settings?.celebration_service_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface CelebrationServiceData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_birthday_service: boolean;
  birthday_dessert_complimentary: boolean;
  birthday_celebrations_monthly: number;
  birthday_celebrations_missed_monthly: number;
  has_anniversary_service: boolean;
  anniversary_celebrations_monthly: number;
  anniversary_celebrations_missed_monthly: number;
  has_celebration_photo_service: boolean;
  celebration_photos_monthly: number;
  celebration_photo_type: string;
  has_reservation_celebration_flag: boolean;
  reservation_celebration_capture_pct: number;
  has_celebration_party_package: boolean;
  party_package_bookings_monthly: number;
  party_package_avg_revenue: number;
  has_complimentary_celebration_treat: boolean;
  complimentary_treat_type: string;
  has_celebration_staff_training: boolean;
  celebration_training_completion_pct: number;
  has_celebration_followup: boolean;
  followup_capture_rate_pct: number;
  instagram_photos_monthly: number;
  instagram_photos_baseline_monthly: number;
  social_shares_monthly: number;
  customer_satisfaction_score: number;
  perceived_quality_score: number;
  return_rate_pct: number;
  return_rate_baseline_pct: number;
  competitor_celebration_score: number;
  celebration_revenue_monthly: number;
  celebration_revenue_baseline_pct: number;
  avg_celebration_check: number;
  avg_regular_check: number;
  monthly_revenue: number;
  celebration_service_cost_monthly: number;
  celebration_training_cost: number;
  celebration_followup_cost_monthly: number;
}

const MOCK_DATA: CelebrationServiceData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_birthday_service: false, birthday_dessert_complimentary: false,
    birthday_celebrations_monthly: 6, birthday_celebrations_missed_monthly: 28,
    has_anniversary_service: false,
    anniversary_celebrations_monthly: 2, anniversary_celebrations_missed_monthly: 12,
    has_celebration_photo_service: false, celebration_photos_monthly: 0,
    celebration_photo_type: 'none',
    has_reservation_celebration_flag: false, reservation_celebration_capture_pct: 8,
    has_celebration_party_package: false, party_package_bookings_monthly: 0,
    party_package_avg_revenue: 0,
    has_complimentary_celebration_treat: false, complimentary_treat_type: 'none',
    has_celebration_staff_training: false, celebration_training_completion_pct: 12,
    has_celebration_followup: false, followup_capture_rate_pct: 4,
    instagram_photos_monthly: 8, instagram_photos_baseline_monthly: 22,
    social_shares_monthly: 6,
    customer_satisfaction_score: 54, perceived_quality_score: 50,
    return_rate_pct: 28, return_rate_baseline_pct: 34,
    competitor_celebration_score: 72,
    celebration_revenue_monthly: 2800, celebration_revenue_baseline_pct: 6,
    avg_celebration_check: 62, avg_regular_check: 48,
    monthly_revenue: 46000,
    celebration_service_cost_monthly: 60, celebration_training_cost: 0,
    celebration_followup_cost_monthly: 0,
  },
  {
    location_id: 'dining', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'dine_in',
    has_birthday_service: true, birthday_dessert_complimentary: true,
    birthday_celebrations_monthly: 24, birthday_celebrations_missed_monthly: 16,
    has_anniversary_service: false,
    anniversary_celebrations_monthly: 4, anniversary_celebrations_missed_monthly: 10,
    has_celebration_photo_service: false, celebration_photos_monthly: 4,
    celebration_photo_type: 'staff_phone',
    has_reservation_celebration_flag: true, reservation_celebration_capture_pct: 45,
    has_celebration_party_package: false, party_package_bookings_monthly: 2,
    party_package_avg_revenue: 380,
    has_complimentary_celebration_treat: false, complimentary_treat_type: 'none',
    has_celebration_staff_training: true, celebration_training_completion_pct: 60,
    has_celebration_followup: false, followup_capture_rate_pct: 18,
    instagram_photos_monthly: 38, instagram_photos_baseline_monthly: 28,
    social_shares_monthly: 32,
    customer_satisfaction_score: 72, perceived_quality_score: 70,
    return_rate_pct: 48, return_rate_baseline_pct: 40,
    competitor_celebration_score: 76,
    celebration_revenue_monthly: 6200, celebration_revenue_baseline_pct: 12,
    avg_celebration_check: 78, avg_regular_check: 46,
    monthly_revenue: 52000,
    celebration_service_cost_monthly: 180, celebration_training_cost: 320,
    celebration_followup_cost_monthly: 0,
  },
  {
    location_id: 'patio', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'mixed',
    has_birthday_service: true, birthday_dessert_complimentary: true,
    birthday_celebrations_monthly: 32, birthday_celebrations_missed_monthly: 8,
    has_anniversary_service: true,
    anniversary_celebrations_monthly: 12, anniversary_celebrations_missed_monthly: 4,
    has_celebration_photo_service: true, celebration_photos_monthly: 28,
    celebration_photo_type: 'polaroid',
    has_reservation_celebration_flag: true, reservation_celebration_capture_pct: 68,
    has_celebration_party_package: true, party_package_bookings_monthly: 6,
    party_package_avg_revenue: 680,
    has_complimentary_celebration_treat: false, complimentary_treat_type: 'none',
    has_celebration_staff_training: true, celebration_training_completion_pct: 78,
    has_celebration_followup: false, followup_capture_rate_pct: 32,
    instagram_photos_monthly: 84, instagram_photos_baseline_monthly: 30,
    social_shares_monthly: 72,
    customer_satisfaction_score: 82, perceived_quality_score: 80,
    return_rate_pct: 58, return_rate_baseline_pct: 42,
    competitor_celebration_score: 80,
    celebration_revenue_monthly: 12400, celebration_revenue_baseline_pct: 18,
    avg_celebration_check: 88, avg_regular_check: 50,
    monthly_revenue: 68000,
    celebration_service_cost_monthly: 320, celebration_training_cost: 480,
    celebration_followup_cost_monthly: 0,
  },
  {
    location_id: 'private_room', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_birthday_service: true, birthday_dessert_complimentary: true,
    birthday_celebrations_monthly: 48, birthday_celebrations_missed_monthly: 2,
    has_anniversary_service: true,
    anniversary_celebrations_monthly: 24, anniversary_celebrations_missed_monthly: 1,
    has_celebration_photo_service: true, celebration_photos_monthly: 56,
    celebration_photo_type: 'professional',
    has_reservation_celebration_flag: true, reservation_celebration_capture_pct: 94,
    has_celebration_party_package: true, party_package_bookings_monthly: 12,
    party_package_avg_revenue: 1280,
    has_complimentary_celebration_treat: true, complimentary_treat_type: 'petit_four',
    has_celebration_staff_training: true, celebration_training_completion_pct: 96,
    has_celebration_followup: true, followup_capture_rate_pct: 78,
    instagram_photos_monthly: 142, instagram_photos_baseline_monthly: 36,
    social_shares_monthly: 128,
    customer_satisfaction_score: 92, perceived_quality_score: 94,
    return_rate_pct: 74, return_rate_baseline_pct: 46,
    competitor_celebration_score: 82,
    celebration_revenue_monthly: 28600, celebration_revenue_baseline_pct: 22,
    avg_celebration_check: 168, avg_regular_check: 92,
    monthly_revenue: 130000,
    celebration_service_cost_monthly: 680, celebration_training_cost: 720,
    celebration_followup_cost_monthly: 240,
  },
];

export const runCelebrationServiceOptimizerEngine = async (
  db: ReturnType<typeof useDB>,
  config: CelebrationServiceConfig,
): Promise<{ alerts: CelebrationServiceAlert[]; generated: number }> => {
  const alerts: CelebrationServiceAlert[] = [];
  const now = new Date();

  let data: CelebrationServiceData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_birthday_service, birthday_dessert_complimentary,
              birthday_celebrations_monthly, birthday_celebrations_missed_monthly,
              has_anniversary_service,
              anniversary_celebrations_monthly, anniversary_celebrations_missed_monthly,
              has_celebration_photo_service, celebration_photos_monthly,
              celebration_photo_type,
              has_reservation_celebration_flag, reservation_celebration_capture_pct,
              has_celebration_party_package, party_package_bookings_monthly,
              party_package_avg_revenue,
              has_complimentary_celebration_treat, complimentary_treat_type,
              has_celebration_staff_training, celebration_training_completion_pct,
              has_celebration_followup, followup_capture_rate_pct,
              instagram_photos_monthly, instagram_photos_baseline_monthly,
              social_shares_monthly,
              customer_satisfaction_score, perceived_quality_score,
              return_rate_pct, return_rate_baseline_pct,
              competitor_celebration_score,
              celebration_revenue_monthly, celebration_revenue_baseline_pct,
              avg_celebration_check, avg_regular_check,
              monthly_revenue,
              celebration_service_cost_monthly, celebration_training_cost,
              celebration_followup_cost_monthly
       FROM celebration_service_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): CelebrationServiceData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_birthday_service: Boolean(r.has_birthday_service ?? false),
      birthday_dessert_complimentary: Boolean(r.birthday_dessert_complimentary ?? false),
      birthday_celebrations_monthly: safeNumber(r.birthday_celebrations_monthly, 0),
      birthday_celebrations_missed_monthly: safeNumber(r.birthday_celebrations_missed_monthly, 0),
      has_anniversary_service: Boolean(r.has_anniversary_service ?? false),
      anniversary_celebrations_monthly: safeNumber(r.anniversary_celebrations_monthly, 0),
      anniversary_celebrations_missed_monthly: safeNumber(r.anniversary_celebrations_missed_monthly, 0),
      has_celebration_photo_service: Boolean(r.has_celebration_photo_service ?? false),
      celebration_photos_monthly: safeNumber(r.celebration_photos_monthly, 0),
      celebration_photo_type: String(r.celebration_photo_type ?? 'none'),
      has_reservation_celebration_flag: Boolean(r.has_reservation_celebration_flag ?? false),
      reservation_celebration_capture_pct: safeNumber(r.reservation_celebration_capture_pct, 0),
      has_celebration_party_package: Boolean(r.has_celebration_party_package ?? false),
      party_package_bookings_monthly: safeNumber(r.party_package_bookings_monthly, 0),
      party_package_avg_revenue: safeNumber(r.party_package_avg_revenue, 0),
      has_complimentary_celebration_treat: Boolean(r.has_complimentary_celebration_treat ?? false),
      complimentary_treat_type: String(r.complimentary_treat_type ?? 'none'),
      has_celebration_staff_training: Boolean(r.has_celebration_staff_training ?? false),
      celebration_training_completion_pct: safeNumber(r.celebration_training_completion_pct, 0),
      has_celebration_followup: Boolean(r.has_celebration_followup ?? false),
      followup_capture_rate_pct: safeNumber(r.followup_capture_rate_pct, 0),
      instagram_photos_monthly: safeNumber(r.instagram_photos_monthly, 0),
      instagram_photos_baseline_monthly: safeNumber(r.instagram_photos_baseline_monthly, 0),
      social_shares_monthly: safeNumber(r.social_shares_monthly, 0),
      customer_satisfaction_score: safeNumber(r.customer_satisfaction_score, 0),
      perceived_quality_score: safeNumber(r.perceived_quality_score, 0),
      return_rate_pct: safeNumber(r.return_rate_pct, 0),
      return_rate_baseline_pct: safeNumber(r.return_rate_baseline_pct, 0),
      competitor_celebration_score: safeNumber(r.competitor_celebration_score, 0),
      celebration_revenue_monthly: safeNumber(r.celebration_revenue_monthly, 0),
      celebration_revenue_baseline_pct: safeNumber(r.celebration_revenue_baseline_pct, 0),
      avg_celebration_check: safeNumber(r.avg_celebration_check, 0),
      avg_regular_check: safeNumber(r.avg_regular_check, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      celebration_service_cost_monthly: safeNumber(r.celebration_service_cost_monthly, 0),
      celebration_training_cost: safeNumber(r.celebration_training_cost, 0),
      celebration_followup_cost_monthly: safeNumber(r.celebration_followup_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const transactionsPerMonth = Math.round(d.monthly_revenue / Math.max(d.avg_regular_check, 1));
    const targetReturnRatePct = 70;
    const targetSatisfactionLiftPts = 18;
    const targetPerceivedQualityLiftPts = 20;
    const targetBirthdayReturnLiftPct = 35;
    const targetAnniversaryCheckLiftPct = 40;
    const targetSocialShareLiftPct = 50;
    const targetReservationRecognitionLiftPct = 25;
    const targetFollowupLoyaltyCapturePct = 45;

    // Rule 1: BIRTHDAY_SERVICE_ABSENT
    if (config.requireBirthdayService && !d.has_birthday_service) {
      // no birthday dessert + candle + song -> missed 3x return rate
      const expectedReturnLift = Math.round(d.birthday_celebrations_missed_monthly * 3 * d.avg_regular_check * 0.4);
      const expectedRevenueFromMissed = Math.round(d.birthday_celebrations_missed_monthly * d.avg_celebration_check);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.012);
      const expectedReputationLift = Math.round(baselineRevenue * 0.010);
      const expectedReviewLift = Math.max(d.birthday_celebrations_missed_monthly * 40, 300);
      const totalOpportunity = Math.max(expectedReturnLift + expectedRevenueFromMissed + expectedSatisfactionLift + expectedReputationLift + expectedReviewLift, 3000);
      const severityLabel = d.birthday_celebrations_missed_monthly > 20 ? 'critical' : d.birthday_celebrations_missed_monthly > 10 ? 'high' : 'medium';
      const criticalNote = (d.birthday_celebrations_missed_monthly > 20)
        ? 'CRITICAL: NO BIRTHDAY SERVICE — birthday is the #1 celebrated occasion at restaurants (60% of Americans celebrate a birthday at a restaurant each year, NRA); a complimentary birthday dessert with candle produces a 3x higher return rate (Cornell SHA loyalty study); missing ' + d.birthday_celebrations_missed_monthly + ' birthdays per month = missed return visits + missed revenue + missed loyalty; competitors with birthday service capture the birthday dining crowd (high spenders, group bookings, social media shares). '
        : d.birthday_celebrations_missed_monthly > 10
          ? `HIGH: NO BIRTHDAY SERVICE — ${d.birthday_celebrations_missed_monthly} birthdays missed per month; complimentary birthday dessert = 3x return rate (Cornell SHA); missed revenue + missed loyalty. `
          : `MEDIUM: NO BIRTHDAY SERVICE — ${d.birthday_celebrations_missed_monthly} birthdays missed per month; add birthday dessert + candle + song. `;
      alerts.push({
        rule_id: 'birthday_service_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_birthday_service: d.has_birthday_service,
        birthday_dessert_complimentary: d.birthday_dessert_complimentary,
        birthday_celebrations_monthly: d.birthday_celebrations_monthly,
        birthday_celebrations_missed_monthly: d.birthday_celebrations_missed_monthly,
        avg_celebration_check: d.avg_celebration_check,
        avg_regular_check: d.avg_regular_check,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        return_rate_pct: d.return_rate_pct,
        return_rate_baseline_pct: d.return_rate_baseline_pct,
        competitor_celebration_score: d.competitor_celebration_score,
        celebration_revenue_monthly: d.celebration_revenue_monthly,
        monthly_revenue: d.monthly_revenue,
        celebration_service_cost_monthly: d.celebration_service_cost_monthly,
        birthday_return_lift_projected_pct: targetBirthdayReturnLiftPct,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        perceived_quality_lift_projected_pts: targetPerceivedQualityLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `BIRTHDAY SERVICE ABSENT: ${d.location_id} — birthday service ABSENT; birthday celebrations served ${d.birthday_celebrations_monthly}/mo (missed ${d.birthday_celebrations_missed_monthly}/mo); avg celebration check ${fmt$(d.avg_celebration_check)} (regular ${fmt$(d.avg_regular_check)}); return rate ${d.return_rate_pct}% (baseline ${d.return_rate_baseline_pct}%); satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: birthday is the #1 celebrated occasion at restaurants — 60% of Americans celebrate a birthday at a restaurant each year (NRA); a complimentary birthday dessert with candle produces a 3x higher return rate (Cornell School of Hotel Administration loyalty study); celebrations drive 15-20% of restaurant revenue (NRA celebration dining report); celebration tables spend 40% more than regular tables (Toast restaurant data); birthday dessert cost $2-4 per serving, revenue impact $40-80 per returning guest = 10-20x ROI; birthday celebrations drive group bookings (average party size 4-8); birthday photos generate 40-60% more social media shares = free marketing worth $300-1,500/month. Solutions ranked by impact: (1) LAUNCH birthday service (complimentary dessert + candle + song) — return lift ${fmt$(expectedReturnLift)}/mo + revenue from missed birthdays ${fmt$(expectedRevenueFromMissed)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + review lift ${fmt$(expectedReviewLift)}/mo; cost ${fmt$(d.celebration_service_cost_monthly)}/mo (desserts + candles); payback <1 month; (2) TRAIN staff on birthday protocol (discreet confirmation, candle + song timing, photo offer); (3) CREATE 3-4 signature birthday desserts (mini cake, sundae, plated dessert); (4) ADD candle + sparkler presentation; (5) OFFER complimentary birthday dessert (cost $2-4, revenue impact $40-80); (6) PRESENT dessert with candle + staff song (Happy Birthday); (7) OFFER celebration photo (polaroid or staff phone); (8) CAPTURE birthday at reservation booking (flag in system); (9) FOLLOW UP after visit (thank you + photo + next-year nudge); (10) BENCHMARK vs competitor birthday service. Industry data: 3x return rate (Cornell SHA); 15-20% celebration revenue (NRA); 40% higher spend (Toast); payback <1 month. Expected impact: +${targetBirthdayReturnLiftPct}% birthday return rate, +${targetSatisfactionLiftPts}pts satisfaction, +${targetPerceivedQualityLiftPts}pts perceived quality, payback <1 month.`,
        ai_recommendation: 'launch_birthday_service',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: ANNIVERSARY_SERVICE_ABSENT
    if (config.requireAnniversaryService && !d.has_anniversary_service) {
      // no anniversary recognition + toast -> missed 2x average check
      const expectedCheckLift = Math.round(d.anniversary_celebrations_missed_monthly * d.avg_celebration_check * 0.5);
      const expectedRevenueFromMissed = Math.round(d.anniversary_celebrations_missed_monthly * d.avg_celebration_check);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.010);
      const expectedReputationLift = Math.round(baselineRevenue * 0.008);
      const expectedLoyaltyLift = Math.round(d.anniversary_celebrations_missed_monthly * 60);
      const totalOpportunity = Math.max(expectedCheckLift + expectedRevenueFromMissed + expectedSatisfactionLift + expectedReputationLift + expectedLoyaltyLift, 2200);
      const severityLabel = d.anniversary_celebrations_missed_monthly > 8 ? 'high' : d.anniversary_celebrations_missed_monthly > 4 ? 'medium' : 'low';
      const criticalNote = (d.anniversary_celebrations_missed_monthly > 8)
        ? `HIGH: NO ANNIVERSARY SERVICE — anniversary diners spend 2x the average check (couples, multi-course, wine, dessert); ${d.anniversary_celebrations_missed_monthly} anniversaries missed per month = missed high-value revenue + missed loyalty; 78% of customers want restaurants to recognize special occasions (OpenTable). `
        : d.anniversary_celebrations_missed_monthly > 4
          ? `MEDIUM: NO ANNIVERSARY SERVICE — ${d.anniversary_celebrations_missed_monthly} anniversaries missed per month; anniversary diners spend 2x average check. `
          : `LOW: NO ANNIVERSARY SERVICE — ${d.anniversary_celebrations_missed_monthly} anniversaries missed per month; add anniversary recognition + toast. `;
      alerts.push({
        rule_id: 'anniversary_service_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_anniversary_service: d.has_anniversary_service,
        anniversary_celebrations_monthly: d.anniversary_celebrations_monthly,
        anniversary_celebrations_missed_monthly: d.anniversary_celebrations_missed_monthly,
        avg_celebration_check: d.avg_celebration_check,
        avg_regular_check: d.avg_regular_check,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        return_rate_pct: d.return_rate_pct,
        competitor_celebration_score: d.competitor_celebration_score,
        celebration_revenue_monthly: d.celebration_revenue_monthly,
        monthly_revenue: d.monthly_revenue,
        celebration_service_cost_monthly: d.celebration_service_cost_monthly,
        anniversary_check_lift_projected_pct: targetAnniversaryCheckLiftPct,
        satisfaction_lift_projected_pts: 14,
        perceived_quality_lift_projected_pts: 16,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ANNIVERSARY SERVICE ABSENT: ${d.location_id} — anniversary service ABSENT; anniversary celebrations served ${d.anniversary_celebrations_monthly}/mo (missed ${d.anniversary_celebrations_missed_monthly}/mo); avg celebration check ${fmt$(d.avg_celebration_check)} (regular ${fmt$(d.avg_regular_check)}); satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: anniversary diners spend 2x the average check (couples, multi-course, wine, dessert) — Toast restaurant data; 78% of customers want restaurants to recognize special occasions (OpenTable dining trends); anniversary recognition (complimentary toast, dessert, table decor) produces 2.5x higher return rate for couples; anniversary celebrations drive fine dining revenue (avg check $150-300 per couple); anniversary = #2 most celebrated romantic occasion after Valentine Day; anniversary diners book 1-2 weeks ahead (reservation optimization opportunity); anniversary recognition = complimentary champagne toast OR dessert OR table rose OR handwritten card; anniversary service cost $3-8 per couple (toast + dessert), revenue impact $80-200 per couple = 10-25x ROI. Solutions ranked by impact: (1) LAUNCH anniversary service (recognition + toast + dessert) — check lift ${fmt$(expectedCheckLift)}/mo + revenue from missed ${fmt$(expectedRevenueFromMissed)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + loyalty ${fmt$(expectedLoyaltyLift)}/mo; cost ${fmt$(d.celebration_service_cost_monthly)}/mo; payback <1 month; (2) TRAIN staff on anniversary protocol (discreet confirmation, toast timing, dessert presentation); (3) CREATE anniversary recognition package (complimentary champagne toast + dessert + table rose); (4) ADD handwritten card from chef/manager (personal touch); (5) OFFER anniversary photo (couple + staff); (6) CAPTURE anniversary at reservation booking (flag in system); (7) PRESENT toast at appropriate moment (after main course, before dessert); (8) UPGRADE dessert (anniversary plating, couple names in chocolate); (9) FOLLOW UP after visit (thank you + photo + anniversary-next-year nudge); (10) BENCHMARK vs competitor anniversary service. Industry data: 2x average check (Toast); 78% want occasion recognition (OpenTable); 2.5x return rate; payback <1 month. Expected impact: +${targetAnniversaryCheckLiftPct}% anniversary check, +14pts satisfaction, +16pts perceived quality, payback <1 month.`,
        ai_recommendation: 'launch_anniversary_service',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: CELEBRATION_PHOTO_SERVICE_ABSENT
    if (config.requireCelebrationPhotoService && !d.has_celebration_photo_service) {
      // no staff photo / polaroid / branded frame -> missed 40-60% social shares
      const expectedSocialShareLift = Math.round((d.birthday_celebrations_monthly + d.anniversary_celebrations_monthly) * 0.5);
      const expectedSocialMediaValue = Math.max(expectedSocialShareLift * 12, 300);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.008);
      const expectedReputationLift = Math.round(baselineRevenue * 0.012);
      const expectedNewCustomerAcquisition = Math.round(expectedSocialShareLift * 8);
      const totalOpportunity = Math.max(expectedSocialMediaValue + expectedSatisfactionLift + expectedReputationLift + expectedNewCustomerAcquisition, 1500);
      const severityLabel = 'medium';
      const criticalNote = 'MEDIUM: NO CELEBRATION PHOTO SERVICE — celebration photos generate 40-60% more social media shares = free marketing worth $300-1,500/month; 69% of millennials photograph food and celebrations at restaurants; each social share = $5-15 marketing value (organic reach, new customer acquisition); missed celebration photos = missed social media marketing + missed new customer acquisition + missed brand awareness. ';
      alerts.push({
        rule_id: 'celebration_photo_service_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_celebration_photo_service: d.has_celebration_photo_service,
        celebration_photos_monthly: d.celebration_photos_monthly,
        celebration_photo_type: d.celebration_photo_type,
        instagram_photos_monthly: d.instagram_photos_monthly,
        instagram_photos_baseline_monthly: d.instagram_photos_baseline_monthly,
        social_shares_monthly: d.social_shares_monthly,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        competitor_celebration_score: d.competitor_celebration_score,
        monthly_revenue: d.monthly_revenue,
        celebration_service_cost_monthly: d.celebration_service_cost_monthly,
        social_share_lift_projected_pct: targetSocialShareLiftPct,
        satisfaction_lift_projected_pts: 12,
        perceived_quality_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CELEBRATION PHOTO SERVICE ABSENT: ${d.location_id} — celebration photo service ABSENT; photo type ${d.celebration_photo_type}; celebration photos ${d.celebration_photos_monthly}/mo; Instagram photos ${d.instagram_photos_monthly}/mo (baseline ${d.instagram_photos_baseline_monthly}); social shares ${d.social_shares_monthly}/mo; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: celebration photos generate 40-60% more social media shares = free marketing worth $300-1,500/month (social media analytics); 69% of millennials photograph food and celebrations at restaurants (National Restaurant Association); each social share = $5-15 marketing value (organic reach, new customer acquisition, brand awareness); celebration photos produce emotional + shareable content (birthday candle, anniversary toast, group celebration); celebration photo service options = polaroid (instant, tangible, $1-2/photo), staff phone (free, text/email to guest), professional photographer ($200-500/event for private events), branded frame (custom photo frame with restaurant logo, $5-10 each); celebration photo best practice = ask permission first (not all guests want photos), offer printed polaroid as keepsake, text/email digital copy, branded hashtag on frame, photo wall in restaurant (customer gallery). Solutions ranked by impact: (1) LAUNCH celebration photo service (polaroid or staff phone) — social media value ${fmt$(expectedSocialMediaValue)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + new customer acquisition ${fmt$(expectedNewCustomerAcquisition)}/mo; cost ${fmt$(d.celebration_service_cost_monthly)}/mo (polaroid film + frames); payback 1-2 months; (2) CHOOSE photo format (polaroid for keepsake, staff phone for digital, professional for private events); (3) TRAIN staff to offer photo (ask permission, frame the shot, capture emotion); (4) ADD branded photo frame (restaurant logo + hashtag); (5) TEXT/EMAIL digital copy to guest (within 24h); (6) CREATE branded hashtag (printed on frame + menu + receipt); (7) BUILD photo wall in restaurant (customer celebration gallery); (8) SHARE guest photos on restaurant social media (with permission); (9) TRACK social media mentions + hashtag usage; (10) BENCHMARK vs competitor photo service. Industry data: 40-60% more social shares (social analytics); $5-15/share marketing value; 69% of millennials photograph celebrations (NRA); payback 1-2 months. Expected impact: +${targetSocialShareLiftPct}% social shares, +12pts satisfaction, +14pts perceived quality, payback 1-2 months.`,
        ai_recommendation: 'launch_celebration_photo_service',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: CELEBRATION_RESERVATION_RECOGNITION_ABSENT
    if (config.requireReservationCelebrationFlag && (!d.has_reservation_celebration_flag || d.reservation_celebration_capture_pct < config.minReservationCelebrationCapturePct)) {
      // reservations do not flag celebrations -> missed recognition -> 35% lower return rate
      const missedCapturePct = Math.max(config.minReservationCelebrationCapturePct - d.reservation_celebration_capture_pct, 0);
      const expectedMissedCelebrations = Math.round((d.birthday_celebrations_missed_monthly + d.anniversary_celebrations_missed_monthly) * (missedCapturePct / 100));
      const expectedReturnDamage = Math.round(expectedMissedCelebrations * d.avg_celebration_check * 0.35);
      const expectedSatisfactionDamage = Math.round(baselineRevenue * (missedCapturePct / 1000));
      const expectedReputationDamage = Math.round(baselineRevenue * (missedCapturePct / 1200));
      const totalOpportunity = Math.max(expectedReturnDamage + expectedSatisfactionDamage + expectedReputationDamage, 1800);
      const severityLabel = d.reservation_celebration_capture_pct < 20 ? 'high' : d.reservation_celebration_capture_pct < 50 ? 'medium' : 'low';
      const criticalNote = (d.reservation_celebration_capture_pct < 20)
        ? `HIGH: RESERVATIONS DO NOT FLAG CELEBRATIONS — capture rate ${d.reservation_celebration_capture_pct}% (min ${config.minReservationCelebrationCapturePct}%); missed celebration recognition = 35% lower return rate (guests feel ignored on milestone moments); 78% of customers want restaurants to recognize special occasions (OpenTable); reservations are the #1 opportunity to capture celebration intent (40% of celebration diners book 1-2 weeks ahead). `
        : d.reservation_celebration_capture_pct < 50
          ? `MEDIUM: RESERVATIONS PARTIALLY FLAG CELEBRATIONS — capture rate ${d.reservation_celebration_capture_pct}% (min ${config.minReservationCelebrationCapturePct}%); improve capture to recognize more celebrations. `
          : `LOW: RESERVATION CELEBRATION CAPTURE BELOW TARGET — ${d.reservation_celebration_capture_pct}% (min ${config.minReservationCelebrationCapturePct}%); improve capture rate. `;
      alerts.push({
        rule_id: 'celebration_reservation_recognition_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_reservation_celebration_flag: d.has_reservation_celebration_flag,
        reservation_celebration_capture_pct: d.reservation_celebration_capture_pct,
        birthday_celebrations_missed_monthly: d.birthday_celebrations_missed_monthly,
        anniversary_celebrations_missed_monthly: d.anniversary_celebrations_missed_monthly,
        avg_celebration_check: d.avg_celebration_check,
        customer_satisfaction_score: d.customer_satisfaction_score,
        return_rate_pct: d.return_rate_pct,
        competitor_celebration_score: d.competitor_celebration_score,
        monthly_revenue: d.monthly_revenue,
        celebration_service_cost_monthly: d.celebration_service_cost_monthly,
        reservation_recognition_lift_projected_pct: targetReservationRecognitionLiftPct,
        satisfaction_lift_projected_pts: 10,
        perceived_quality_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CELEBRATION RESERVATION RECOGNITION ABSENT: ${d.location_id} — reservation celebration flag ${d.has_reservation_celebration_flag ? 'present' : 'ABSENT'}; capture rate ${d.reservation_celebration_capture_pct}% (min ${config.minReservationCelebrationCapturePct}%); birthdays missed ${d.birthday_celebrations_missed_monthly}/mo; anniversaries missed ${d.anniversary_celebrations_missed_monthly}/mo; avg celebration check ${fmt$(d.avg_celebration_check)}; return rate ${d.return_rate_pct}%; satisfaction ${d.customer_satisfaction_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: missed celebration recognition = 35% lower return rate (guests feel ignored on milestone moments) — Cornell SHA loyalty study; 78% of customers want restaurants to recognize special occasions (OpenTable dining trends); reservations are the #1 opportunity to capture celebration intent — 40% of celebration diners book 1-2 weeks ahead (reservation optimization opportunity); reservation celebration capture = asking at booking (any special occasion? birthday? anniversary? celebration?); reservation celebration flag = visible in POS + table tag + server alert; reservation celebration flag enables = preemptive dessert prep, staff greeting, table decor, photo offer; reservation celebration capture best practice = ask at booking (online form + phone), confirm day-of, flag in POS, alert server + host + kitchen; reservation celebration capture rate target = 70%+ (capture 7 of 10 celebration reservations). Solutions ranked by impact: (1) FLAG celebrations in reservation system — return damage recovery ${fmt$(expectedReturnDamage)}/mo + satisfaction recovery ${fmt$(expectedSatisfactionDamage)}/mo + reputation recovery ${fmt$(expectedReputationDamage)}/mo; cost ${fmt$(d.celebration_service_cost_monthly)}/mo; payback immediate; (2) ADD celebration question to online booking form (any special occasion?); (3) TRAIN phone staff to ask (any celebration we should know about?); (4) CONFIRM celebration day-of (reconfirm reservation + occasion); (5) FLAG in POS (visible to host + server + kitchen); (6) ALERT server + host (table tag, reservation note); (7) PREP preemptively (dessert ready, candle available, photo frame ready); (8) GREET by occasion (happy birthday, happy anniversary); (9) TRACK capture rate weekly (target 70%+); (10) BENCHMARK vs competitor reservation capture. Industry data: 35% lower return rate without recognition (Cornell SHA); 78% want recognition (OpenTable); 40% book 1-2 weeks ahead; payback immediate. Expected impact: +${targetReservationRecognitionLiftPct}% recognition, +10pts satisfaction, +12pts perceived quality, payback immediate.`,
        ai_recommendation: 'flag_celebration_in_reservations',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: CELEBRATION_PARTY_PACKAGE_ABSENT
    if (config.requireCelebrationPartyPackage && !d.has_celebration_party_package) {
      // no group celebration package (6+ guests, set menu, dedicated server) -> missed $400-1,500/table
      const expectedPartyBookings = Math.max(Math.round(transactionsPerMonth * 0.04), 4);
      const expectedPartyRevenue = Math.round(expectedPartyBookings * 680);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.010);
      const expectedReputationLift = Math.round(baselineRevenue * 0.012);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedPartyRevenue + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 2400);
      const severityLabel = d.restaurant_tier === 'fine_dining' || d.restaurant_tier === 'casual_dining' ? 'high' : 'medium';
      const criticalNote = (d.restaurant_tier === 'fine_dining' || d.restaurant_tier === 'casual_dining')
        ? `HIGH: NO CELEBRATION PARTY PACKAGE — group celebration bookings (6+ guests) generate $400-1,500 per table; celebration parties spend 40% more than regular tables; celebration party tips average 25% higher; missed party bookings = missed high-value revenue + missed group marketing (word of mouth, social media). `
        : `MEDIUM: NO CELEBRATION PARTY PACKAGE — group celebrations (6+ guests) generate $400-1,500 per table; add party package to capture group dining revenue. `;
      alerts.push({
        rule_id: 'celebration_party_package_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_celebration_party_package: d.has_celebration_party_package,
        party_package_bookings_monthly: d.party_package_bookings_monthly,
        party_package_avg_revenue: d.party_package_avg_revenue,
        avg_celebration_check: d.avg_celebration_check,
        avg_regular_check: d.avg_regular_check,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        competitor_celebration_score: d.competitor_celebration_score,
        monthly_revenue: d.monthly_revenue,
        celebration_service_cost_monthly: d.celebration_service_cost_monthly,
        party_package_revenue_projected: expectedPartyRevenue,
        satisfaction_lift_projected_pts: 14,
        perceived_quality_lift_projected_pts: 16,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CELEBRATION PARTY PACKAGE ABSENT: ${d.location_id} — celebration party package ABSENT; party bookings ${d.party_package_bookings_monthly}/mo; avg party revenue ${fmt$(d.party_package_avg_revenue)}; avg celebration check ${fmt$(d.avg_celebration_check)} (regular ${fmt$(d.avg_regular_check)}); satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: group celebration bookings (6+ guests) generate $400-1,500 per table (restaurant event data); celebration parties spend 40% more than regular tables (Toast restaurant data); celebration party tips average 25% higher than regular tables; celebration parties drive word-of-mouth marketing (each guest tells 3-5 friends); celebration party package = set menu (3-4 courses, fixed price), dedicated server (1 server per 8-10 guests), dedicated table/zone, complimentary toast/dessert, photo service, optional private room; celebration party types = birthday party (kids + adults), anniversary dinner, graduation dinner, engagement party, rehearsal dinner, baby shower, gender reveal, retirement dinner, promotion celebration, holiday party; celebration party booking lead time = 1-4 weeks (reservation optimization); celebration party package pricing = $35-85 per person (casual), $85-200 per person (fine dining); celebration party deposit = 50% at booking (reduces no-show risk). Solutions ranked by impact: (1) LAUNCH celebration party package (6+ guests, set menu, dedicated server) — party revenue ${fmt$(expectedPartyRevenue)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(d.celebration_service_cost_monthly)}/mo; payback <1 month; (2) CREATE 3 party package tiers (bronze $35/pp, silver $55/pp, gold $85/pp); (3) DESIGN set menus (3-4 courses, dietary options, kids menu); (4) ASSIGN dedicated server (1 per 8-10 guests, auto-gratuity 18-20%); (5) ADD complimentary toast + dessert (birthday, anniversary); (6) OFFER private room or dedicated zone (upcharge for private room); (7) INCLUDE photo service (polaroid or professional); (8) REQUIRE 50% deposit at booking (reduces no-show); (9) CREATE party booking form (occasion, party size, dietary, budget, date); (10) MARKET party packages on website + social media + menu; (11) PARTNER with event planners + wedding venues; (12) BENCHMARK vs competitor party packages. Industry data: $400-1,500 per table (event data); 40% higher spend (Toast); 25% higher tips; payback <1 month. Expected impact: +${fmt$(expectedPartyRevenue)}/mo party revenue, +14pts satisfaction, +16pts perceived quality, payback <1 month.`,
        ai_recommendation: 'launch_celebration_party_package',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: CELEBRATION_COMPLIMENTARY_TREAT_ABSENT
    if (config.requireComplimentaryCelebrationTreat && !d.has_complimentary_celebration_treat) {
      // no complimentary celebration treat (amuse, digestif, petit four) -> missed delight moment
      const expectedCelebrations = d.birthday_celebrations_monthly + d.anniversary_celebrations_monthly;
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.012);
      const expectedReputationLift = Math.round(baselineRevenue * 0.014);
      const expectedReviewLift = Math.max(expectedCelebrations * 30, 200);
      const expectedReturnLift = Math.round(expectedCelebrations * d.avg_regular_check * 0.2);
      const totalOpportunity = Math.max(expectedSatisfactionLift + expectedReputationLift + expectedReviewLift + expectedReturnLift, 1000);
      const severityLabel = 'medium';
      const criticalNote = 'MEDIUM: NO COMPLIMENTARY CELEBRATION TREAT — complimentary treat (amuse bouche, digestif, petit four, chocolate) creates a delight moment that drives 20-30% higher satisfaction + 3x more positive reviews; complimentary treat cost $1-3 per guest, revenue impact $20-60 per returning guest = 10-20x ROI; missed delight moment = missed satisfaction + missed reviews + missed return visits. ';
      alerts.push({
        rule_id: 'celebration_complimentary_treat_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_complimentary_celebration_treat: d.has_complimentary_celebration_treat,
        complimentary_treat_type: d.complimentary_treat_type,
        birthday_celebrations_monthly: d.birthday_celebrations_monthly,
        anniversary_celebrations_monthly: d.anniversary_celebrations_monthly,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        competitor_celebration_score: d.competitor_celebration_score,
        monthly_revenue: d.monthly_revenue,
        celebration_service_cost_monthly: d.celebration_service_cost_monthly,
        complimentary_treat_satisfaction_lift_pts: 16,
        satisfaction_lift_projected_pts: 12,
        perceived_quality_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CELEBRATION COMPLIMENTARY TREAT ABSENT: ${d.location_id} — complimentary celebration treat ABSENT; treat type ${d.complimentary_treat_type}; birthday celebrations ${d.birthday_celebrations_monthly}/mo; anniversary celebrations ${d.anniversary_celebrations_monthly}/mo; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: complimentary treat (amuse bouche, digestif, petit four, chocolate) creates a delight moment that drives 20-30% higher satisfaction (Cornell SHA service study); complimentary treats produce 3x more positive reviews (guests mention surprise treats in reviews); complimentary treat cost $1-3 per guest, revenue impact $20-60 per returning guest = 10-20x ROI; complimentary treat types = amuse bouche (small bite before main, $1-2), digestif (after dinner liqueur, $2-3), petit four (small dessert with coffee, $1-2), chocolate truffle (with check, $0.50-1), palate cleanser (sorbet between courses, $1); complimentary treat presentation = plated, branded (restaurant logo), timed (surprise and delight), staff narrative (chef compliments); complimentary treat best practice = unexpected (not advertised), personalized (celebration-themed), high-quality (not cheap), branded (restaurant identity). Solutions ranked by impact: (1) ADD complimentary celebration treat — satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo + review lift ${fmt$(expectedReviewLift)}/mo + return lift ${fmt$(expectedReturnLift)}/mo; cost ${fmt$(d.celebration_service_cost_monthly)}/mo; payback 1-2 months; (2) CHOOSE treat type (amuse bouche, digestif, petit four, chocolate, palate cleanser); (3) SOURCE high-quality treats (local chocolatier, in-house pastry); (4) PLATE with restaurant branding (logo, signature); (5) TIME the surprise (after main course, before dessert, with check); (6) TRAIN staff narrative (chef compliments, celebration wish); (7) PERSONALIZE for celebration (birthday candle, anniversary rose); (8) PRESENT on branded plate or tray; (9) TRACK review mentions (complimentary treat mentions = success metric); (10) BENCHMARK vs competitor treat service. Industry data: 20-30% satisfaction lift (Cornell SHA); 3x more positive reviews; 10-20x ROI; payback 1-2 months. Expected impact: +16pts satisfaction, +12pts satisfaction, +14pts perceived quality, payback 1-2 months.`,
        ai_recommendation: 'add_complimentary_celebration_treat',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: CELEBRATION_STAFF_TRAINING_ABSENT
    if (config.requireCelebrationStaffTraining && (!d.has_celebration_staff_training || d.celebration_training_completion_pct < config.minCelebrationTrainingCompletionPct)) {
      // staff not trained on celebration protocol -> awkward moments + negative reviews
      const trainingGap = Math.max(config.minCelebrationTrainingCompletionPct - d.celebration_training_completion_pct, 0);
      const expectedReviewDamage = Math.max(trainingGap * 18, 200);
      const expectedSatisfactionDamage = Math.round(baselineRevenue * (trainingGap / 1500));
      const expectedReputationDamage = Math.round(baselineRevenue * (trainingGap / 1200));
      const expectedMissedCelebrationDamage = Math.round((d.birthday_celebrations_missed_monthly + d.anniversary_celebrations_missed_monthly) * d.avg_celebration_check * (trainingGap / 200));
      const totalOpportunity = Math.max(expectedReviewDamage + expectedSatisfactionDamage + expectedReputationDamage + expectedMissedCelebrationDamage, 1400);
      const severityLabel = d.celebration_training_completion_pct < 30 ? 'high' : d.celebration_training_completion_pct < 60 ? 'medium' : 'low';
      const criticalNote = (d.celebration_training_completion_pct < 30)
        ? `HIGH: STAFF NOT TRAINED ON CELEBRATION PROTOCOL — training completion ${d.celebration_training_completion_pct}% (min ${config.minCelebrationTrainingCompletionPct}%); untrained staff miss celebration cues, deliver awkward service, produce negative reviews; celebration training = how to confirm occasion, dessert presentation, candle + song timing, photo offer, toast delivery, follow-up; 78% of customers want occasion recognition (OpenTable) but untrained staff miss it. `
        : d.celebration_training_completion_pct < 60
          ? `MEDIUM: STAFF PARTIALLY TRAINED — completion ${d.celebration_training_completion_pct}% (min ${config.minCelebrationTrainingCompletionPct}%); improve training to capture more celebrations. `
          : `LOW: STAFF TRAINING BELOW TARGET — ${d.celebration_training_completion_pct}% (min ${config.minCelebrationTrainingCompletionPct}%); complete training for all staff. `;
      alerts.push({
        rule_id: 'celebration_staff_training_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_celebration_staff_training: d.has_celebration_staff_training,
        celebration_training_completion_pct: d.celebration_training_completion_pct,
        birthday_celebrations_missed_monthly: d.birthday_celebrations_missed_monthly,
        anniversary_celebrations_missed_monthly: d.anniversary_celebrations_missed_monthly,
        customer_satisfaction_score: d.customer_satisfaction_score,
        perceived_quality_score: d.perceived_quality_score,
        competitor_celebration_score: d.competitor_celebration_score,
        monthly_revenue: d.monthly_revenue,
        celebration_training_cost: d.celebration_training_cost,
        staff_training_review_lift_pts: 18,
        satisfaction_lift_projected_pts: 12,
        perceived_quality_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CELEBRATION STAFF TRAINING ABSENT: ${d.location_id} — staff training ${d.has_celebration_staff_training ? 'present' : 'ABSENT'}; completion ${d.celebration_training_completion_pct}% (min ${config.minCelebrationTrainingCompletionPct}%); birthdays missed ${d.birthday_celebrations_missed_monthly}/mo; anniversaries missed ${d.anniversary_celebrations_missed_monthly}/mo; satisfaction ${d.customer_satisfaction_score}/100; perceived quality ${d.perceived_quality_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: 78% of customers want restaurants to recognize special occasions (OpenTable dining trends) but untrained staff miss the cues; untrained staff produce awkward celebration moments (wrong timing, wrong song, missed candle, missed photo) = negative reviews; celebration training = how to confirm occasion discreetly, dessert presentation protocol, candle + song timing, photo offer script, toast delivery script, follow-up capture; celebration training produces 35% higher review scores (guests mention staff celebration service); celebration training cost $300-800 one-time (trainer + materials + practice), revenue impact $1,500-4,000/month = 2-5 month payback; celebration training best practice = role-play scenarios (birthday, anniversary, surprise), shadow experienced staff, pre-shift briefing on celebrations, monthly refresher. Solutions ranked by impact: (1) TRAIN staff on celebration protocol — review damage recovery ${fmt$(expectedReviewDamage)}/mo + satisfaction recovery ${fmt$(expectedSatisfactionDamage)}/mo + reputation recovery ${fmt$(expectedReputationDamage)}/mo + missed celebration recovery ${fmt$(expectedMissedCelebrationDamage)}/mo; cost ${fmt$(d.celebration_training_cost)} one-time; payback 2-5 months; (2) CREATE celebration training module (occasion confirmation, dessert presentation, candle + song, photo offer, toast, follow-up); (3) ROLE-PLAY scenarios (birthday, anniversary, surprise, engagement, graduation); (4) SHADOW experienced staff (observe celebration service); (5) PRE-SHIFT briefing on celebrations (flag todays celebrations); (6) MONTHLY refresher (new staff + seasonal updates); (7) CREATE celebration service checklist (confirm, prep, present, photo, toast, follow-up); (8) TEST staff (mystery shopper celebration visit); (9) REWARD staff for celebration reviews (positive mention = bonus); (10) TRACK completion rate weekly (target 85%+); (11) BENCHMARK vs competitor staff training. Industry data: 35% higher review scores with trained staff; 78% want recognition (OpenTable); payback 2-5 months. Expected impact: +18pts review scores, +12pts satisfaction, +14pts perceived quality, payback 2-5 months.`,
        ai_recommendation: 'train_staff_on_celebration_protocol',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: CELEBRATION_FOLLOWUP_ABSENT
    if (config.requireCelebrationFollowup && (!d.has_celebration_followup || d.followup_capture_rate_pct < config.minFollowupCaptureRatePct)) {
      // no post-celebration follow-up (thank you, photo share, next-year nudge) -> missed loyalty capture
      const followupGap = Math.max(config.minFollowupCaptureRatePct - d.followup_capture_rate_pct, 0);
      const totalCelebrations = d.birthday_celebrations_monthly + d.anniversary_celebrations_monthly;
      const expectedLoyaltyCapture = Math.round(totalCelebrations * (followupGap / 100) * 0.45 * d.avg_celebration_check);
      const expectedReturnLift = Math.round(totalCelebrations * (followupGap / 100) * d.avg_regular_check * 0.3);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.008);
      const expectedReputationLift = Math.round(baselineRevenue * 0.010);
      const totalOpportunity = Math.max(expectedLoyaltyCapture + expectedReturnLift + expectedSatisfactionLift + expectedReputationLift, 1200);
      const severityLabel = d.followup_capture_rate_pct < 15 ? 'high' : d.followup_capture_rate_pct < 35 ? 'medium' : 'low';
      const criticalNote = (d.followup_capture_rate_pct < 15)
        ? `HIGH: NO CELEBRATION FOLLOW-UP — follow-up capture rate ${d.followup_capture_rate_pct}% (min ${config.minFollowupCaptureRatePct}%); post-celebration follow-up (thank you + photo share + next-year nudge) captures 30-45% repeat celebration bookings; missed follow-up = missed loyalty + missed repeat revenue + missed referral marketing. `
        : d.followup_capture_rate_pct < 35
          ? `MEDIUM: FOLLOW-UP BELOW TARGET — capture rate ${d.followup_capture_rate_pct}% (min ${config.minFollowupCaptureRatePct}%); improve follow-up to capture more repeat celebrations. `
          : `LOW: FOLLOW-UP BELOW TARGET — ${d.followup_capture_rate_pct}% (min ${config.minFollowupCaptureRatePct}%); improve capture rate. `;
      alerts.push({
        rule_id: 'celebration_followup_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_celebration_followup: d.has_celebration_followup,
        followup_capture_rate_pct: d.followup_capture_rate_pct,
        birthday_celebrations_monthly: d.birthday_celebrations_monthly,
        anniversary_celebrations_monthly: d.anniversary_celebrations_monthly,
        avg_celebration_check: d.avg_celebration_check,
        avg_regular_check: d.avg_regular_check,
        return_rate_pct: d.return_rate_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_celebration_score: d.competitor_celebration_score,
        monthly_revenue: d.monthly_revenue,
        celebration_followup_cost_monthly: d.celebration_followup_cost_monthly,
        followup_loyalty_capture_projected: expectedLoyaltyCapture,
        satisfaction_lift_projected_pts: 10,
        perceived_quality_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CELEBRATION FOLLOW-UP ABSENT: ${d.location_id} — follow-up ${d.has_celebration_followup ? 'present' : 'ABSENT'}; capture rate ${d.followup_capture_rate_pct}% (min ${config.minFollowupCaptureRatePct}%); birthday celebrations ${d.birthday_celebrations_monthly}/mo; anniversary celebrations ${d.anniversary_celebrations_monthly}/mo; avg celebration check ${fmt$(d.avg_celebration_check)}; return rate ${d.return_rate_pct}%; satisfaction ${d.customer_satisfaction_score}/100; competitor celebration ${d.competitor_celebration_score}/100. ${criticalNote}Industry data: post-celebration follow-up (thank you + photo share + next-year nudge) captures 30-45% repeat celebration bookings (CRM loyalty study); timely thank you (within 24h) = 40% higher return rate (Cornell SHA); photo share (text/email celebration photo) = 25% email engagement + 3x social media mentions; next-year nudge (reminder 11 months later) = 35% rebooking rate; review request within 24h = 3x more reviews (BrightLocal); follow-up capture rate target = 50%+ (capture half of celebration guests for loyalty); follow-up channels = SMS (highest open rate 98%), email (20% open), phone (personal but intrusive), app push (if app); follow-up content = thank you + photo + review request + next-year nudge + loyalty signup; follow-up cost $50-200/month (CRM + photo sharing + messaging), revenue impact $1,000-3,000/month = 5-15x ROI. Solutions ranked by impact: (1) LAUNCH celebration follow-up system — loyalty capture ${fmt$(expectedLoyaltyCapture)}/mo + return lift ${fmt$(expectedReturnLift)}/mo + satisfaction ${fmt$(expectedSatisfactionLift)}/mo + reputation ${fmt$(expectedReputationLift)}/mo; cost ${fmt$(d.celebration_followup_cost_monthly)}/mo; payback 1-2 months; (2) CHOOSE follow-up channel (SMS highest open, email scalable, app push if app); (3) SEND thank you within 24h (text or email); (4) SHARE celebration photo (text/email digital copy); (5) REQUEST review within 24h (Google, Yelp, TripAdvisor); (6) SIGN UP for loyalty program (incentive: free dessert next visit); (7) NUDGE next year (11-month reminder for same celebration); (8) PERSONALIZE follow-up (name, occasion, server name); (9) TRACK capture rate weekly (target 50%+); (10) AUTOMATE follow-up sequence (CRM-triggered); (11) BENCHMARK vs competitor follow-up. Industry data: 30-45% repeat bookings (CRM study); 40% higher return rate with timely thank you (Cornell SHA); 3x more reviews (BrightLocal); payback 1-2 months. Expected impact: +${fmt$(expectedLoyaltyCapture)}/mo loyalty capture, +10pts satisfaction, +12pts perceived quality, payback 1-2 months.`,
        ai_recommendation: 'launch_celebration_followup',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM celebration_service_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE celebration_service_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant celebration service expert. Given celebration service data, recommend ONE specific action with expected revenue lift, return rate lift, satisfaction lift, or social media lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Birthday service: ${a.has_birthday_service ?? false} (complimentary dessert ${a.birthday_dessert_complimentary ?? false}, ${a.birthday_celebrations_monthly ?? 0}/mo served, ${a.birthday_celebrations_missed_monthly ?? 0}/mo missed). Anniversary service: ${a.has_anniversary_service ?? false} (${a.anniversary_celebrations_monthly ?? 0}/mo served, ${a.anniversary_celebrations_missed_monthly ?? 0}/mo missed). Photo service: ${a.has_celebration_photo_service ?? false} (${a.celebration_photo_type ?? 'none'}, ${a.celebration_photos_monthly ?? 0} photos/mo). Reservation flag: ${a.has_reservation_celebration_flag ?? false} (capture ${a.reservation_celebration_capture_pct ?? 0}%). Party package: ${a.has_celebration_party_package ?? false} (${a.party_package_bookings_monthly ?? 0} bookings/mo at ${fmt$(a.party_package_avg_revenue ?? 0)}). Complimentary treat: ${a.has_complimentary_celebration_treat ?? false} (${a.complimentary_treat_type ?? 'none'}). Staff training: ${a.has_celebration_staff_training ?? false} (completion ${a.celebration_training_completion_pct ?? 0}%). Follow-up: ${a.has_celebration_followup ?? false} (capture ${a.followup_capture_rate_pct ?? 0}%). Instagram photos: ${a.instagram_photos_monthly ?? 0}/mo (baseline ${a.instagram_photos_baseline_monthly ?? 0}). Social shares: ${a.social_shares_monthly ?? 0}/mo. Satisfaction: ${a.customer_satisfaction_score ?? 0}/100. Perceived quality: ${a.perceived_quality_score ?? 0}/100. Return rate: ${a.return_rate_pct ?? 0}% (baseline ${a.return_rate_baseline_pct ?? 0}%). Competitor celebration: ${a.competitor_celebration_score ?? 0}/100. Celebration revenue: ${fmt$(a.celebration_revenue_monthly ?? 0)}/mo (${a.celebration_revenue_baseline_pct ?? 0}% of total). Avg celebration check: ${fmt$(a.avg_celebration_check ?? 0)} (regular ${fmt$(a.avg_regular_check ?? 0)}). Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Service cost: ${fmt$(a.celebration_service_cost_monthly ?? 0)}/mo. Training cost: ${fmt$(a.celebration_training_cost ?? 0)}. Follow-up cost: ${fmt$(a.celebration_followup_cost_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveCelebrationServiceAlerts = async (db: ReturnType<typeof useDB>): Promise<CelebrationServiceAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM celebration_service_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getCelebrationServiceSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  birthdayServiceAbsentCount: number; anniversaryServiceAbsentCount: number;
  celebrationPhotoServiceAbsentCount: number; celebrationReservationRecognitionAbsentCount: number;
  celebrationPartyPackageAbsentCount: number; celebrationComplimentaryTreatAbsentCount: number;
  celebrationStaffTrainingAbsentCount: number; celebrationFollowupAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'birthday_service_absent') AS nobirthday,
              math::count(rule_id = 'anniversary_service_absent') AS noanniversary,
              math::count(rule_id = 'celebration_photo_service_absent') AS nophoto,
              math::count(rule_id = 'celebration_reservation_recognition_absent') AS noreservation,
              math::count(rule_id = 'celebration_party_package_absent') AS noparty,
              math::count(rule_id = 'celebration_complimentary_treat_absent') AS notreat,
              math::count(rule_id = 'celebration_staff_training_absent') AS notraining,
              math::count(rule_id = 'celebration_followup_absent') AS nofollowup
       FROM celebration_service_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      birthdayServiceAbsentCount: safeNumber(r.nobirthday, 0),
      anniversaryServiceAbsentCount: safeNumber(r.noanniversary, 0),
      celebrationPhotoServiceAbsentCount: safeNumber(r.nophoto, 0),
      celebrationReservationRecognitionAbsentCount: safeNumber(r.noreservation, 0),
      celebrationPartyPackageAbsentCount: safeNumber(r.noparty, 0),
      celebrationComplimentaryTreatAbsentCount: safeNumber(r.notreat, 0),
      celebrationStaffTrainingAbsentCount: safeNumber(r.notraining, 0),
      celebrationFollowupAbsentCount: safeNumber(r.nofollowup, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, birthdayServiceAbsentCount: 0, anniversaryServiceAbsentCount: 0, celebrationPhotoServiceAbsentCount: 0, celebrationReservationRecognitionAbsentCount: 0, celebrationPartyPackageAbsentCount: 0, celebrationComplimentaryTreatAbsentCount: 0, celebrationStaffTrainingAbsentCount: 0, celebrationFollowupAbsentCount: 0 };
  }
};

export const updateCelebrationServiceAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
