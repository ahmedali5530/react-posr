/**
 * AI Pet-Friendly & Service Animal Accommodation Optimizer — predicts how
 * pet-friendly policies and service animal accommodations (dog-friendly patio,
 * service animal protocols, pet water bowls, pet menu items, pet waste
 * stations, staff training on service animal law, ADA compliance, pet
 * photography spots, pet events/yappy hour) impacts customer acquisition from
 * pet owners, legal compliance, brand differentiation, and revenue.
 *
 * 70% of US households own pets (APPA 2024) — 45% own dogs. 78% of dog
 * owners would dine at pet-friendly restaurants more frequently (AKC
 * survey). Pet-friendly patios increase weekend revenue 20-35% (dog owners
 * stay longer, order more). Service animals are legally protected under
 * ADA — refusal = $55,000-$200,000 lawsuit (DOJ). 22% of restaurants now
 * allow dogs on patios (NRA 2024) — up from 8% in 2019. "Yappy Hour"
 * events (dog social hours) attract 30-50 new customers per event. Pet
 * menu items (dog treats, pup cups) cost $0.50-2.00 but generate $3-5
 * revenue each. Staff not trained on service animal law = #1 ADA lawsuit
 * source for restaurants. Pet water bowls + waste stations = 90% reduction
 * in pet-related complaints. Pet-friendly restaurants get free social
 * media exposure — dog photos = 40-60% more Instagram engagement.
 *
 * 197th POSR-exclusive differentiator. Distinct from:
 *   - sensory-friendly-space.service (196th) — optimizes sensory-friendly
 *     spaces for the NEURODIVERGENT community. This optimizer focuses on
 *     PET-FRIENDLY policies + SERVICE ANIMAL accommodations — dog-friendly
 *     patio, ADA service animal law compliance, pet amenities, pet menu,
 *     yappy hour, photography spots.
 *   - family-infant-amenity.service — optimizes HUMAN family amenities
 *     (high chairs, changing tables, kids menu). This optimizer focuses
 *     on PET family members.
 *
 * 8 AI rules:
 *   1. pet_friendly_patio_absent -> no dog-friendly outdoor seating -> missed 20-35% weekend revenue from dog owners
 *   2. service_animal_protocol_absent -> no staff training on ADA service animal law -> $55k-$200k lawsuit risk
 *   3. pet_amenities_missing -> no water bowls/waste stations -> 90% more pet complaints
 *   4. pet_menu_items_absent -> no dog treats/pup cups -> missed $3-5 profit per pet-owning table
 *   5. yappy_hour_event_absent -> no pet social events -> missed 30-50 new customer acquisition per event
 *   6. pet_policy_unclear -> no visible pet policy signage -> confusion + conflicts + negative reviews
 *   7. pet_photography_spot_absent -> no Instagram-worthy pet photo area -> missed 40-60% social engagement
 *   8. service_animal_refusal_risk -> staff may refuse service animals -> immediate ADA violation + lawsuit
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type PetFriendlyServiceAnimalRuleId =
  | 'pet_friendly_patio_absent'
  | 'service_animal_protocol_absent'
  | 'pet_amenities_missing'
  | 'pet_menu_items_absent'
  | 'yappy_hour_event_absent'
  | 'pet_policy_unclear'
  | 'pet_photography_spot_absent'
  | 'service_animal_refusal_risk';

export type PetFriendlyServiceAnimalAiRec =
  | 'install_pet_friendly_patio'
  | 'deploy_service_animal_protocol_training'
  | 'add_pet_water_bowls_and_waste_stations'
  | 'launch_pet_menu_items'
  | 'host_yappy_hour_events'
  | 'publish_visible_pet_policy_signage'
  | 'create_pet_photography_spot'
  | 'mitigate_service_animal_refusal_risk'
  | 'monitor'
  | 'skip';

export interface PetFriendlyServiceAnimalAlert {
  id?: string;
  rule_id: PetFriendlyServiceAnimalRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'patio' | 'main_dining' | 'outdoor' | 'rooftop'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Pet-friendly patio
  has_pet_friendly_patio?: boolean;                         // dog-friendly outdoor seating
  pet_patio_seats?: number;                                // seats in pet-friendly patio zone
  pet_patio_score?: number;                                // 0-100 pet patio quality
  // Service animal protocol
  has_service_animal_protocol?: boolean;                    // documented ADA service animal protocol
  staff_ada_training_pct?: number;                          // % of staff trained on ADA service animal law (0-100)
  trained_ada_staff_count?: number;                         // staff trained on ADA
  total_staff_count?: number;                               // total staff
  // Pet amenities
  has_pet_water_bowls?: boolean;                            // water bowls for dogs
  has_pet_waste_station?: boolean;                          // pet waste station with bags + bin
  pet_amenity_score?: number;                               // 0-100 pet amenity score
  pet_complaints_per_100?: number;                          // pet-related complaints per 100 customers
  // Pet menu items
  has_pet_menu?: boolean;                                   // dog treats / pup cups on menu
  pet_menu_item_count?: number;                             // number of pet menu items
  pet_menu_revenue_per_item?: number;                       // revenue per pet menu item ($)
  pet_menu_profit_per_item?: number;                        // profit per pet menu item ($)
  pet_menu_items_sold_monthly?: number;                     // pet menu items sold per month
  // Yappy hour events
  has_yappy_hour?: boolean;                                 // hosts dog social hours
  yappy_hour_events_per_month?: number;                     // yappy hour events per month
  yappy_hour_new_customers_per_event?: number;              // new customers per event
  // Pet policy signage
  has_pet_policy_signage?: boolean;                         // visible pet policy signage
  pet_policy_clarity_score?: number;                        // 0-100 pet policy clarity
  pet_policy_complaints_per_100?: number;                   // pet policy complaint rate per 100
  // Pet photography
  has_pet_photography_spot?: boolean;                       // Instagram-worthy pet photo area
  pet_photo_spot_score?: number;                            // 0-100 photo spot quality
  instagram_engagement_pct?: number;                        // IG engagement % on pet content
  // Service animal refusal risk
  service_animal_refusal_incidents?: number;                // documented refusals of service animals
  ada_lawsuit_risk_score?: number;                          // 0-100 ADA lawsuit risk
  ada_compliance_score?: number;                            // 0-100 ADA compliance
  // Customer behavior
  pet_owner_visit_pct?: number;                             // % of visits from pet owners (0-100)
  dog_owner_visit_pct?: number;                             // % of visits from dog owners (0-100)
  pet_owner_satisfaction_score?: number;                    // 0-100 satisfaction from pet owners
  customer_satisfaction_score?: number;                     // 0-100 overall satisfaction
  negative_review_count?: number;                           // pet-related negative reviews (last 30d)
  // Brand + competition
  competitor_pet_friendly_score?: number;                   // 0-100 competitor pet-friendliness
  // Economics
  monthly_revenue?: number;                                 // total restaurant monthly revenue
  weekend_revenue?: number;                                 // weekend monthly revenue
  weekend_revenue_share_pct?: number;                       // % of revenue from weekends (0-100)
  average_party_size?: number;                              // avg party size
  // Costs
  pet_patio_installation_cost?: number;                     // pet patio setup cost
  staff_ada_training_cost?: number;                         // ADA service animal law training cost
  pet_amenity_installation_cost?: number;                   // water bowls + waste station cost
  pet_menu_creation_cost?: number;                          // pet menu development cost
  yappy_hour_setup_cost?: number;                           // yappy hour launch cost
  pet_policy_signage_cost?: number;                         // signage cost
  pet_photography_spot_cost?: number;                       // photo spot setup cost
  ada_compliance_audit_cost?: number;                       // ADA compliance audit cost
  // Impact projections
  weekend_revenue_lift_projected_pct?: number;
  pet_owner_visit_lift_projected_pct?: number;
  satisfaction_lift_projected_pts?: number;
  pet_complaint_reduction_projected_pct?: number;
  instagram_engagement_lift_projected_pct?: number;
  new_customer_acquisition_projected?: number;
  ada_lawsuit_risk_reduction_projected_pts?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: PetFriendlyServiceAnimalAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface PetFriendlyServiceAnimalConfig {
  aiEnabled: boolean;
  requirePetFriendlyPatio: boolean;                          // require dog-friendly outdoor seating
  requireServiceAnimalProtocol: boolean;                     // require ADA service animal protocol
  requirePetAmenities: boolean;                              // require water bowls + waste stations
  requirePetMenu: boolean;                                   // require pet menu items
  requireYappyHour: boolean;                                 // require yappy hour events
  requirePetPolicySignage: boolean;                          // require visible pet policy signage
  requirePetPhotographySpot: boolean;                        // require Instagram-worthy pet photo area
  minPetPatioScore: number;                                  // min pet patio quality (75)
  minStaffAdaTrainingPct: number;                            // min ADA-trained staff % (80)
  minPetAmenityScore: number;                                // min pet amenity score (70)
  minPetMenuItemCount: number;                               // min pet menu items (3)
  minYappyHourEventsPerMonth: number;                        // min yappy hour events/month (1)
  minPetPolicyClarityScore: number;                          // min pet policy clarity (75)
  minPetPhotoSpotScore: number;                              // min photo spot quality (70)
  minAdaComplianceScore: number;                             // min ADA compliance (85)
  maxPetComplaintsPer100: number;                            // max pet complaints per 100 (5)
  preferCompetitorParity: boolean;                           // match competitor pet-friendliness
}

export const DEFAULT_PET_FRIENDLY_SERVICE_ANIMAL_CONFIG: PetFriendlyServiceAnimalConfig = {
  aiEnabled: true,
  requirePetFriendlyPatio: true,
  requireServiceAnimalProtocol: true,
  requirePetAmenities: true,
  requirePetMenu: true,
  requireYappyHour: true,
  requirePetPolicySignage: true,
  requirePetPhotographySpot: true,
  minPetPatioScore: 75,
  minStaffAdaTrainingPct: 80,
  minPetAmenityScore: 70,
  minPetMenuItemCount: 3,
  minYappyHourEventsPerMonth: 1,
  minPetPolicyClarityScore: 75,
  minPetPhotoSpotScore: 70,
  minAdaComplianceScore: 85,
  maxPetComplaintsPer100: 5,
  preferCompetitorParity: true,
};

export const readPetFriendlyServiceAnimalConfig = (settings: any): PetFriendlyServiceAnimalConfig => ({
  aiEnabled: settings?.pet_ai_enabled ?? true,
  requirePetFriendlyPatio: settings?.pet_require_patio ?? true,
  requireServiceAnimalProtocol: settings?.pet_require_service_protocol ?? true,
  requirePetAmenities: settings?.pet_require_amenities ?? true,
  requirePetMenu: settings?.pet_require_menu ?? true,
  requireYappyHour: settings?.pet_require_yappy_hour ?? true,
  requirePetPolicySignage: settings?.pet_require_policy_signage ?? true,
  requirePetPhotographySpot: settings?.pet_require_photo_spot ?? true,
  minPetPatioScore: safeNumber(settings?.pet_min_patio_score, 75),
  minStaffAdaTrainingPct: safeNumber(settings?.pet_min_ada_training_pct, 80),
  minPetAmenityScore: safeNumber(settings?.pet_min_amenity_score, 70),
  minPetMenuItemCount: safeNumber(settings?.pet_min_menu_items, 3),
  minYappyHourEventsPerMonth: safeNumber(settings?.pet_min_yappy_hour, 1),
  minPetPolicyClarityScore: safeNumber(settings?.pet_min_policy_clarity, 75),
  minPetPhotoSpotScore: safeNumber(settings?.pet_min_photo_score, 70),
  minAdaComplianceScore: safeNumber(settings?.pet_min_ada_compliance, 85),
  maxPetComplaintsPer100: safeNumber(settings?.pet_max_complaints, 5),
  preferCompetitorParity: settings?.pet_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface PetFriendlyServiceAnimalData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_pet_friendly_patio: boolean;
  pet_patio_seats: number;
  pet_patio_score: number;
  has_service_animal_protocol: boolean;
  staff_ada_training_pct: number;
  trained_ada_staff_count: number;
  total_staff_count: number;
  has_pet_water_bowls: boolean;
  has_pet_waste_station: boolean;
  pet_amenity_score: number;
  pet_complaints_per_100: number;
  has_pet_menu: boolean;
  pet_menu_item_count: number;
  pet_menu_revenue_per_item: number;
  pet_menu_profit_per_item: number;
  pet_menu_items_sold_monthly: number;
  has_yappy_hour: boolean;
  yappy_hour_events_per_month: number;
  yappy_hour_new_customers_per_event: number;
  has_pet_policy_signage: boolean;
  pet_policy_clarity_score: number;
  pet_policy_complaints_per_100: number;
  has_pet_photography_spot: boolean;
  pet_photo_spot_score: number;
  instagram_engagement_pct: number;
  service_animal_refusal_incidents: number;
  ada_lawsuit_risk_score: number;
  ada_compliance_score: number;
  pet_owner_visit_pct: number;
  dog_owner_visit_pct: number;
  pet_owner_satisfaction_score: number;
  customer_satisfaction_score: number;
  negative_review_count: number;
  competitor_pet_friendly_score: number;
  monthly_revenue: number;
  weekend_revenue: number;
  weekend_revenue_share_pct: number;
  average_party_size: number;
  pet_patio_installation_cost: number;
  staff_ada_training_cost: number;
  pet_amenity_installation_cost: number;
  pet_menu_creation_cost: number;
  yappy_hour_setup_cost: number;
  pet_policy_signage_cost: number;
  pet_photography_spot_cost: number;
  ada_compliance_audit_cost: number;
}

const MOCK_DATA: PetFriendlyServiceAnimalData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_pet_friendly_patio: false, pet_patio_seats: 0, pet_patio_score: 14,
    has_service_animal_protocol: false, staff_ada_training_pct: 6,
    trained_ada_staff_count: 1, total_staff_count: 22,
    has_pet_water_bowls: false, has_pet_waste_station: false,
    pet_amenity_score: 18, pet_complaints_per_100: 14,
    has_pet_menu: false, pet_menu_item_count: 0,
    pet_menu_revenue_per_item: 0, pet_menu_profit_per_item: 0,
    pet_menu_items_sold_monthly: 0,
    has_yappy_hour: false, yappy_hour_events_per_month: 0,
    yappy_hour_new_customers_per_event: 0,
    has_pet_policy_signage: false, pet_policy_clarity_score: 22,
    pet_policy_complaints_per_100: 8,
    has_pet_photography_spot: false, pet_photo_spot_score: 12,
    instagram_engagement_pct: 4,
    service_animal_refusal_incidents: 2, ada_lawsuit_risk_score: 82,
    ada_compliance_score: 38,
    pet_owner_visit_pct: 6, dog_owner_visit_pct: 3,
    pet_owner_satisfaction_score: 32, customer_satisfaction_score: 54,
    negative_review_count: 6,
    competitor_pet_friendly_score: 64,
    monthly_revenue: 168000, weekend_revenue: 60480,
    weekend_revenue_share_pct: 36,
    average_party_size: 2.8,
    pet_patio_installation_cost: 7500, staff_ada_training_cost: 2200,
    pet_amenity_installation_cost: 800, pet_menu_creation_cost: 950,
    yappy_hour_setup_cost: 450, pet_policy_signage_cost: 220,
    pet_photography_spot_cost: 380, ada_compliance_audit_cost: 1500,
  },
  {
    location_id: 'patio', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_pet_friendly_patio: false, pet_patio_seats: 0, pet_patio_score: 22,
    has_service_animal_protocol: false, staff_ada_training_pct: 12,
    trained_ada_staff_count: 3, total_staff_count: 26,
    has_pet_water_bowls: false, has_pet_waste_station: false,
    pet_amenity_score: 26, pet_complaints_per_100: 11,
    has_pet_menu: false, pet_menu_item_count: 0,
    pet_menu_revenue_per_item: 0, pet_menu_profit_per_item: 0,
    pet_menu_items_sold_monthly: 0,
    has_yappy_hour: false, yappy_hour_events_per_month: 0,
    yappy_hour_new_customers_per_event: 0,
    has_pet_policy_signage: false, pet_policy_clarity_score: 30,
    pet_policy_complaints_per_100: 6,
    has_pet_photography_spot: false, pet_photo_spot_score: 18,
    instagram_engagement_pct: 6,
    service_animal_refusal_incidents: 1, ada_lawsuit_risk_score: 68,
    ada_compliance_score: 48,
    pet_owner_visit_pct: 9, dog_owner_visit_pct: 5,
    pet_owner_satisfaction_score: 38, customer_satisfaction_score: 60,
    negative_review_count: 4,
    competitor_pet_friendly_score: 68,
    monthly_revenue: 214000, weekend_revenue: 81320,
    weekend_revenue_share_pct: 38,
    average_party_size: 2.6,
    pet_patio_installation_cost: 6800, staff_ada_training_cost: 1900,
    pet_amenity_installation_cost: 700, pet_menu_creation_cost: 850,
    yappy_hour_setup_cost: 400, pet_policy_signage_cost: 200,
    pet_photography_spot_cost: 320, ada_compliance_audit_cost: 1300,
  },
  {
    location_id: 'outdoor', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_pet_friendly_patio: true, pet_patio_seats: 16, pet_patio_score: 58,
    has_service_animal_protocol: true, staff_ada_training_pct: 55,
    trained_ada_staff_count: 14, total_staff_count: 26,
    has_pet_water_bowls: true, has_pet_waste_station: false,
    pet_amenity_score: 62, pet_complaints_per_100: 4,
    has_pet_menu: true, pet_menu_item_count: 2,
    pet_menu_revenue_per_item: 4.50, pet_menu_profit_per_item: 3.20,
    pet_menu_items_sold_monthly: 180,
    has_yappy_hour: false, yappy_hour_events_per_month: 0,
    yappy_hour_new_customers_per_event: 0,
    has_pet_policy_signage: true, pet_policy_clarity_score: 68,
    pet_policy_complaints_per_100: 2,
    has_pet_photography_spot: false, pet_photo_spot_score: 35,
    instagram_engagement_pct: 14,
    service_animal_refusal_incidents: 0, ada_lawsuit_risk_score: 32,
    ada_compliance_score: 76,
    pet_owner_visit_pct: 18, dog_owner_visit_pct: 11,
    pet_owner_satisfaction_score: 68, customer_satisfaction_score: 78,
    negative_review_count: 1,
    competitor_pet_friendly_score: 72,
    monthly_revenue: 232000, weekend_revenue: 92800,
    weekend_revenue_share_pct: 40,
    average_party_size: 3.0,
    pet_patio_installation_cost: 4500, staff_ada_training_cost: 1400,
    pet_amenity_installation_cost: 500, pet_menu_creation_cost: 600,
    yappy_hour_setup_cost: 300, pet_policy_signage_cost: 150,
    pet_photography_spot_cost: 250, ada_compliance_audit_cost: 1000,
  },
  {
    location_id: 'rooftop', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_pet_friendly_patio: true, pet_patio_seats: 22, pet_patio_score: 88,
    has_service_animal_protocol: true, staff_ada_training_pct: 92,
    trained_ada_staff_count: 23, total_staff_count: 25,
    has_pet_water_bowls: true, has_pet_waste_station: true,
    pet_amenity_score: 92, pet_complaints_per_100: 1,
    has_pet_menu: true, pet_menu_item_count: 5,
    pet_menu_revenue_per_item: 6.00, pet_menu_profit_per_item: 4.20,
    pet_menu_items_sold_monthly: 420,
    has_yappy_hour: true, yappy_hour_events_per_month: 2,
    yappy_hour_new_customers_per_event: 38,
    has_pet_policy_signage: true, pet_policy_clarity_score: 92,
    pet_policy_complaints_per_100: 0,
    has_pet_photography_spot: true, pet_photo_spot_score: 86,
    instagram_engagement_pct: 48,
    service_animal_refusal_incidents: 0, ada_lawsuit_risk_score: 8,
    ada_compliance_score: 96,
    pet_owner_visit_pct: 28, dog_owner_visit_pct: 18,
    pet_owner_satisfaction_score: 92, customer_satisfaction_score: 92,
    negative_review_count: 0,
    competitor_pet_friendly_score: 78,
    monthly_revenue: 286000, weekend_revenue: 128700,
    weekend_revenue_share_pct: 45,
    average_party_size: 3.4,
    pet_patio_installation_cost: 3000, staff_ada_training_cost: 900,
    pet_amenity_installation_cost: 300, pet_menu_creation_cost: 400,
    yappy_hour_setup_cost: 200, pet_policy_signage_cost: 100,
    pet_photography_spot_cost: 180, ada_compliance_audit_cost: 700,
  },
];

export const runPetFriendlyServiceAnimalEngine = async (
  db: ReturnType<typeof useDB>,
  config: PetFriendlyServiceAnimalConfig,
): Promise<{ alerts: PetFriendlyServiceAnimalAlert[]; generated: number }> => {
  const alerts: PetFriendlyServiceAnimalAlert[] = [];
  const now = new Date();

  let data: PetFriendlyServiceAnimalData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_pet_friendly_patio, pet_patio_seats, pet_patio_score,
              has_service_animal_protocol, staff_ada_training_pct,
              trained_ada_staff_count, total_staff_count,
              has_pet_water_bowls, has_pet_waste_station,
              pet_amenity_score, pet_complaints_per_100,
              has_pet_menu, pet_menu_item_count, pet_menu_revenue_per_item,
              pet_menu_profit_per_item, pet_menu_items_sold_monthly,
              has_yappy_hour, yappy_hour_events_per_month,
              yappy_hour_new_customers_per_event,
              has_pet_policy_signage, pet_policy_clarity_score,
              pet_policy_complaints_per_100,
              has_pet_photography_spot, pet_photo_spot_score,
              instagram_engagement_pct,
              service_animal_refusal_incidents, ada_lawsuit_risk_score,
              ada_compliance_score,
              pet_owner_visit_pct, dog_owner_visit_pct,
              pet_owner_satisfaction_score, customer_satisfaction_score,
              negative_review_count,
              competitor_pet_friendly_score,
              monthly_revenue, weekend_revenue, weekend_revenue_share_pct,
              average_party_size,
              pet_patio_installation_cost, staff_ada_training_cost,
              pet_amenity_installation_cost, pet_menu_creation_cost,
              yappy_hour_setup_cost, pet_policy_signage_cost,
              pet_photography_spot_cost, ada_compliance_audit_cost
       FROM pet_friendly_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): PetFriendlyServiceAnimalData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_pet_friendly_patio: Boolean(r.has_pet_friendly_patio ?? false),
      pet_patio_seats: safeNumber(r.pet_patio_seats, 0),
      pet_patio_score: safeNumber(r.pet_patio_score, 0),
      has_service_animal_protocol: Boolean(r.has_service_animal_protocol ?? false),
      staff_ada_training_pct: safeNumber(r.staff_ada_training_pct, 0),
      trained_ada_staff_count: safeNumber(r.trained_ada_staff_count, 0),
      total_staff_count: safeNumber(r.total_staff_count, 0),
      has_pet_water_bowls: Boolean(r.has_pet_water_bowls ?? false),
      has_pet_waste_station: Boolean(r.has_pet_waste_station ?? false),
      pet_amenity_score: safeNumber(r.pet_amenity_score, 0),
      pet_complaints_per_100: safeNumber(r.pet_complaints_per_100, 0),
      has_pet_menu: Boolean(r.has_pet_menu ?? false),
      pet_menu_item_count: safeNumber(r.pet_menu_item_count, 0),
      pet_menu_revenue_per_item: safeNumber(r.pet_menu_revenue_per_item, 0),
      pet_menu_profit_per_item: safeNumber(r.pet_menu_profit_per_item, 0),
      pet_menu_items_sold_monthly: safeNumber(r.pet_menu_items_sold_monthly, 0),
      has_yappy_hour: Boolean(r.has_yappy_hour ?? false),
      yappy_hour_events_per_month: safeNumber(r.yappy_hour_events_per_month, 0),
      yappy_hour_new_customers_per_event: safeNumber(r.yappy_hour_new_customers_per_event, 0),
      has_pet_policy_signage: Boolean(r.has_pet_policy_signage ?? false),
      pet_policy_clarity_score: safeNumber(r.pet_policy_clarity_score, 0),
      pet_policy_complaints_per_100: safeNumber(r.pet_policy_complaints_per_100, 0),
      has_pet_photography_spot: Boolean(r.has_pet_photography_spot ?? false),
      pet_photo_spot_score: safeNumber(r.pet_photo_spot_score, 0),
      instagram_engagement_pct: safeNumber(r.instagram_engagement_pct, 0),
      service_animal_refusal_incidents: safeNumber(r.service_animal_refusal_incidents, 0),
      ada_lawsuit_risk_score: safeNumber(r.ada_lawsuit_risk_score, 0),
      ada_compliance_score: safeNumber(r.ada_compliance_score, 0),
      pet_owner_visit_pct: safeNumber(r.pet_owner_visit_pct, 0),
      dog_owner_visit_pct: safeNumber(r.dog_owner_visit_pct, 0),
      pet_owner_satisfaction_score: safeNumber(r.pet_owner_satisfaction_score, 0),
      customer_satisfaction_score: safeNumber(r.customer_satisfaction_score, 0),
      negative_review_count: safeNumber(r.negative_review_count, 0),
      competitor_pet_friendly_score: safeNumber(r.competitor_pet_friendly_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      weekend_revenue: safeNumber(r.weekend_revenue, 0),
      weekend_revenue_share_pct: safeNumber(r.weekend_revenue_share_pct, 0),
      average_party_size: safeNumber(r.average_party_size, 3),
      pet_patio_installation_cost: safeNumber(r.pet_patio_installation_cost, 0),
      staff_ada_training_cost: safeNumber(r.staff_ada_training_cost, 0),
      pet_amenity_installation_cost: safeNumber(r.pet_amenity_installation_cost, 0),
      pet_menu_creation_cost: safeNumber(r.pet_menu_creation_cost, 0),
      yappy_hour_setup_cost: safeNumber(r.yappy_hour_setup_cost, 0),
      pet_policy_signage_cost: safeNumber(r.pet_policy_signage_cost, 0),
      pet_photography_spot_cost: safeNumber(r.pet_photography_spot_cost, 0),
      ada_compliance_audit_cost: safeNumber(r.ada_compliance_audit_cost, 0),
    }));
  } catch { data = []; }
  if (data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const weekendRevenue = d.weekend_revenue || d.monthly_revenue * 0.36;
    const targetPetPatioScore = 80;
    const targetStaffAdaTrainingPct = 85;
    const targetPetAmenityScore = 80;
    const targetPetMenuItemCount = 4;
    const targetYappyHourEventsPerMonth = 2;
    const targetPetPolicyClarity = 85;
    const targetPetPhotoSpotScore = 80;
    const targetAdaComplianceScore = 92;
    const targetCompetitorPet = 70;
    const targetWeekendRevenueLiftPct = 28;
    const targetPetOwnerVisitLiftPct = 32;
    const targetSatisfactionLiftPts = 22;
    const targetPetComplaintReductionPct = 85;
    const targetInstagramEngagementLiftPct = 50;
    const targetNewCustomerAcquisitionPerEvent = 40;
    const targetAdaLawsuitRiskReductionPts = 60;
    const transactionsPerMonth = Math.round(d.monthly_revenue / 24);
    const petOwningHouseholds = Math.round(transactionsPerMonth / d.average_party_size * 0.45);

    // Rule 1: PET_FRIENDLY_PATIO_ABSENT
    if (config.requirePetFriendlyPatio && (!d.has_pet_friendly_patio || d.pet_patio_score < config.minPetPatioScore)) {
      // no dog-friendly patio -> missed 20-35% weekend revenue from dog owners
      const patioGap = targetPetPatioScore - d.pet_patio_score;
      const expectedWeekendLift = Math.round(weekendRevenue * (targetWeekendRevenueLiftPct / 100));
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.012);
      const expectedReputationLift = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.006);
      const totalOpportunity = Math.max(expectedWeekendLift + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 2200);
      const severityLabel = !d.has_pet_friendly_patio ? 'critical' : d.pet_patio_score < 50 ? 'high' : 'medium';
      const criticalNote = (!d.has_pet_friendly_patio)
        ? 'CRITICAL: NO PET-FRIENDLY PATIO (no dog-friendly outdoor seating) — 70% of US households own pets (APPA 2024); 45% own dogs; 78% of dog owners would dine at pet-friendly restaurants more frequently (AKC survey); pet-friendly patios increase weekend revenue 20-35% (dog owners stay longer, order more); 22% of restaurants now allow dogs on patios (NRA 2024) — up from 8% in 2019; massive underserved market. '
        : d.pet_patio_score < 50
          ? `HIGH: PET PATIO BELOW TARGET (${d.pet_patio_score}/100 < ${config.minPetPatioScore}) — ${d.pet_patio_seats} seats; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; dog owner visits ${d.dog_owner_visit_pct}%. `
          : `MEDIUM: PET PATIO OPTIMIZATION NEEDED (${d.pet_patio_score}/100 < 80 target) — ${d.pet_patio_seats} seats; tune amenities; dog owner visits ${d.dog_owner_visit_pct}%. `;
      alerts.push({
        rule_id: 'pet_friendly_patio_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_pet_friendly_patio: d.has_pet_friendly_patio,
        pet_patio_seats: d.pet_patio_seats,
        pet_patio_score: d.pet_patio_score,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        dog_owner_visit_pct: d.dog_owner_visit_pct,
        pet_owner_visit_pct: d.pet_owner_visit_pct,
        pet_owner_satisfaction_score: d.pet_owner_satisfaction_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        weekend_revenue: d.weekend_revenue,
        weekend_revenue_share_pct: d.weekend_revenue_share_pct,
        average_party_size: d.average_party_size,
        pet_patio_installation_cost: d.pet_patio_installation_cost,
        weekend_revenue_lift_projected_pct: targetWeekendRevenueLiftPct,
        pet_owner_visit_lift_projected_pct: targetPetOwnerVisitLiftPct,
        satisfaction_lift_projected_pts: targetSatisfactionLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PET-FRIENDLY PATIO ABSENT: ${d.location_id} — ${d.restaurant_tier} restaurant; pet patio ${d.has_pet_friendly_patio ? `present (${d.pet_patio_seats} seats, score ${d.pet_patio_score}/100)` : 'ABSENT'}; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; dog owner visits ${d.dog_owner_visit_pct}%; pet owner visits ${d.pet_owner_visit_pct}%; weekend revenue ${fmt$(d.weekend_revenue)} (${d.weekend_revenue_share_pct}% of total); customer satisfaction ${d.customer_satisfaction_score}/100. ${criticalNote}Industry data: 70% of US households own pets (APPA 2024) — 45% own dogs; 78% of dog owners would dine at pet-friendly restaurants more frequently (AKC survey); pet-friendly patios increase weekend revenue 20-35% (dog owners stay 18-25 min longer, order 12-18% more); 22% of restaurants now allow dogs on patios (NRA 2024) — up from 8% in 2019 (3x growth); dog owners seek patios for: social, exercise, bonding, date nights with pet; pet-friendly patio design = dog-safe flooring (no gaps, paw-friendly surface), shaded areas (heat safety), water access, leash hooks under tables, spacing for dog beds, waste station nearby, signage with rules; pet-friendly patio regulations = local health code (varies by state/county — check with health dept); pet patio size = 8-24 seats typical; pet patio location = separate from main patio (allergy/distraction concerns); pet patio staff = trained on dog body language + ADA service animal law. Solutions ranked by impact: (1) INSTALL pet-friendly patio — revenue ${fmt$(expectedWeekendLift)}/mo weekend lift + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.pet_patio_installation_cost)}; payback 2-4 months; (2) DESIGNATE section of existing patio for dogs (start small, expand); (3) INSTALL leash hooks under tables; (4) PROVIDE water bowls (stainless, dishwasher safe); (5) ADD shade structures (umbrellas, sails, pergola); (6) USE paw-friendly flooring (composite, no gaps); (7) SPACE tables for dog beds (4 ft aisles); (8) POST rules signage (leash required, well-behaved only, owner liability); (9) CHECK local health code for pet patio permits; (10) TRAIN staff on dog behavior + ADA service animal law; (11) PROVIDE pet waste station nearby; (12) MARKET pet patio on social media + Google Business Profile; (13) PARTNER with local dog rescue for cross-promo events; (14) COLLECT dog owner feedback monthly; (15) BENCHMARK vs competitor pet patios. Industry data: 70% pet ownership (APPA 2024); 78% dog owners dine more (AKC); 20-35% weekend revenue lift; 22% of restaurants pet-friendly (NRA 2024, up from 8% in 2019). Expected impact: +${targetWeekendRevenueLiftPct}% weekend revenue, +${targetPetOwnerVisitLiftPct}% pet owner visits, +${fmt$(expectedWeekendLift)}/mo weekend lift, payback 2-4 months.`,
        ai_recommendation: 'install_pet_friendly_patio',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: SERVICE_ANIMAL_PROTOCOL_ABSENT
    if (config.requireServiceAnimalProtocol && (!d.has_service_animal_protocol || d.staff_ada_training_pct < config.minStaffAdaTrainingPct)) {
      // no staff training on ADA service animal law -> $55k-$200k lawsuit risk
      const trainingGap = targetStaffAdaTrainingPct - d.staff_ada_training_pct;
      const expectedLawsuitRiskReduction = Math.max(d.ada_lawsuit_risk_score, 30) * 1500;
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.008);
      const expectedReputationLift = Math.round(baselineRevenue * 0.006);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.004);
      const totalOpportunity = Math.max(expectedLawsuitRiskReduction + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 3500);
      const severityLabel = d.staff_ada_training_pct < 25 ? 'critical' : d.staff_ada_training_pct < 60 ? 'high' : 'medium';
      const criticalNote = (d.staff_ada_training_pct < 25)
        ? 'CRITICAL: ALMOST NO STAFF TRAINED ON ADA SERVICE ANIMAL LAW — service animals are legally protected under ADA; refusal = $55,000-$200,000 lawsuit (DOJ); staff not trained on service animal law = #1 ADA lawsuit source for restaurants; service animals are NOT pets (working animals); only 2 questions legal: (1) is the dog a service animal required because of a disability? (2) what work or task has the dog been trained to perform?; CANNOT ask for documentation, certification, or demonstration; CANNOT require dog to wear vest/ID; CANNOT charge pet fee; CANNOT isolate/segment service animal; CANNOT ask person with service animal to leave unless out of control + handler does not act. '
        : d.staff_ada_training_pct < 60
          ? `HIGH: INSUFFICIENT ADA SERVICE ANIMAL TRAINING (${d.staff_ada_training_pct}% < ${config.minStaffAdaTrainingPct}%) — only ${d.trained_ada_staff_count}/${d.total_staff_count} trained; ADA lawsuit risk ${d.ada_lawsuit_risk_score}/100; ADA compliance ${d.ada_compliance_score}/100; ${d.service_animal_refusal_incidents} refusal incidents documented. `
          : `MEDIUM: ADA TRAINING BELOW TARGET (${d.staff_ada_training_pct}% < 85%) — ${d.trained_ada_staff_count}/${d.total_staff_count} trained; ADA compliance ${d.ada_compliance_score}/100. `;
      alerts.push({
        rule_id: 'service_animal_protocol_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_service_animal_protocol: d.has_service_animal_protocol,
        staff_ada_training_pct: d.staff_ada_training_pct,
        trained_ada_staff_count: d.trained_ada_staff_count,
        total_staff_count: d.total_staff_count,
        service_animal_refusal_incidents: d.service_animal_refusal_incidents,
        ada_lawsuit_risk_score: d.ada_lawsuit_risk_score,
        ada_compliance_score: d.ada_compliance_score,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        monthly_revenue: d.monthly_revenue,
        staff_ada_training_cost: d.staff_ada_training_cost,
        ada_compliance_audit_cost: d.ada_compliance_audit_cost,
        ada_lawsuit_risk_reduction_projected_pts: targetAdaLawsuitRiskReductionPts,
        satisfaction_lift_projected_pts: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SERVICE ANIMAL PROTOCOL ABSENT: ${d.location_id} — ADA protocol ${d.has_service_animal_protocol ? 'documented' : 'ABSENT'}; staff ADA training ${d.staff_ada_training_pct}% (${d.trained_ada_staff_count}/${d.total_staff_count} trained); ADA lawsuit risk ${d.ada_lawsuit_risk_score}/100; ADA compliance ${d.ada_compliance_score}/100; ${d.service_animal_refusal_incidents} documented refusal incidents; competitor pet-friendly ${d.competitor_pet_friendly_score}/100. ${criticalNote}Industry data: service animals are legally protected under ADA Title III (public accommodations); refusal = $55,000-$200,000 lawsuit (DOJ); staff not trained on service animal law = #1 ADA lawsuit source for restaurants (ADA.gov); service animals are NOT pets — they are working animals trained to perform tasks for people with disabilities (guide dogs, hearing dogs, mobility dogs, medical alert dogs, PSD dogs); service animal = dogs only (miniature horses allowed in some cases); emotional support animals (ESAs) are NOT service animals under ADA (no public access rights); only 2 questions legal under ADA: (1) is the dog a service animal required because of a disability? (2) what work or task has the dog been trained to perform?; CANNOT ask: documentation, certification, license, demonstration of task, nature of disability; CANNOT require: vest, ID tag, harness, registration; CANNOT charge: pet fee, deposit, surcharge; CANNOT: isolate, segment, treat differently; CANNOT ask to leave unless: dog out of control + handler does not take action, OR dog poses direct threat (growling, biting); allergies + fear of dogs are NOT valid reasons to refuse; staff MUST allow service animal anywhere customers are allowed (dining areas, bathrooms, patio); service animal must be housebroken + under handler control (leash, harness, voice); ADA violation examples: refusing entry, asking documentation, charging fee, isolating to patio only, asking disability nature, asking dog to demonstrate task, asking dog to leave (when well-behaved); ADA penalties: $55,000 first violation, $200,000 subsequent violations (DOJ); private lawsuits: $4,000-$100,000+ damages + attorney fees; reputational damage: news coverage, viral social media, boycotts. Solutions ranked by impact: (1) DEPLOY staff training on ADA service animal law — risk reduction ${fmt$(expectedLawsuitRiskReduction)}/mo (lawsuit avoidance) + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.staff_ada_training_cost)}; payback immediate (lawsuit avoidance); (2) DOCUMENT service animal protocol (laminated, at host stand + POS); (3) TRAIN all customer-facing staff (servers, hosts, managers, security); (4) COVER 2 legal questions + prohibited questions + prohibited actions; (5) REFRESHER training quarterly (new hires + changes); (6) ADD ADA service animal module to onboarding (new hire required); (7) POST service animal welcome signage (door, host stand); (8) ROLE-PLAY refusal scenarios in pre-shift meetings; (9) CREATE escalation chain (manager on duty handles disputes); (10) DOCUMENT any refusal incidents (date, time, reason, witness) for legal defense; (11) AUDIT compliance via mystery shopper with service animal; (12) PARTNER with disability rights org for training (ADA National Network); (13) CONSULT employment attorney for protocol review; (14) INSURE against ADA lawsuit (general liability + EPLI); (15) BENCHMARK vs competitor ADA compliance. Industry data: $55k-$200k lawsuit (DOJ); #1 ADA lawsuit source = staff not trained; payback immediate. Expected impact: -${targetAdaLawsuitRiskReductionPts}pts lawsuit risk, +15pts satisfaction, +${fmt$(expectedLawsuitRiskReduction)}/mo lawsuit risk reduction, payback immediate.`,
        ai_recommendation: 'deploy_service_animal_protocol_training',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: PET_AMENITIES_MISSING
    if (config.requirePetAmenities && (d.pet_amenity_score < config.minPetAmenityScore || !d.has_pet_water_bowls || !d.has_pet_waste_station)) {
      // no water bowls/waste stations -> 90% more pet complaints
      const amenityGap = targetPetAmenityScore - d.pet_amenity_score;
      const expectedComplaintReduction = Math.round(transactionsPerMonth * (d.pet_complaints_per_100 / 100) * (targetPetComplaintReductionPct / 100) * 18);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.006);
      const expectedReputationLift = Math.round(baselineRevenue * 0.004);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.003);
      const totalOpportunity = Math.max(expectedComplaintReduction + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 600);
      const severityLabel = !d.has_pet_water_bowls && !d.has_pet_waste_station ? 'high' : d.pet_amenity_score < 50 ? 'medium' : 'low';
      const criticalNote = (!d.has_pet_water_bowls && !d.has_pet_waste_station)
        ? 'HIGH: NO PET AMENITIES (no water bowls, no waste station) — pet water bowls + waste stations = 90% reduction in pet-related complaints; dogs need water (dehydration risk on patios); waste stations prevent messes + odor + health violations; absent amenities = complaints + negative reviews + staff burden; pet owners notice + remember amenities (or lack thereof). '
        : d.pet_amenity_score < 50
          ? `MEDIUM: PET AMENITIES BELOW TARGET (${d.pet_amenity_score}/100 < ${config.minPetAmenityScore}) — water bowls ${d.has_pet_water_bowls ? 'yes' : 'NO'}; waste station ${d.has_pet_waste_station ? 'yes' : 'NO'}; pet complaints ${d.pet_complaints_per_100}/100. `
          : `LOW: PET AMENITIES OPTIMIZATION NEEDED (${d.pet_amenity_score}/100 < 80 target) — add waste station if missing; complaints ${d.pet_complaints_per_100}/100. `;
      alerts.push({
        rule_id: 'pet_amenities_missing',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_pet_water_bowls: d.has_pet_water_bowls,
        has_pet_waste_station: d.has_pet_waste_station,
        pet_amenity_score: d.pet_amenity_score,
        pet_complaints_per_100: d.pet_complaints_per_100,
        has_pet_friendly_patio: d.has_pet_friendly_patio,
        pet_owner_satisfaction_score: d.pet_owner_satisfaction_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        monthly_revenue: d.monthly_revenue,
        pet_amenity_installation_cost: d.pet_amenity_installation_cost,
        pet_complaint_reduction_projected_pct: targetPetComplaintReductionPct,
        satisfaction_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PET AMENITIES MISSING: ${d.location_id} — water bowls ${d.has_pet_water_bowls ? 'yes' : 'NO'}; waste station ${d.has_pet_waste_station ? 'yes' : 'NO'}; pet amenity score ${d.pet_amenity_score}/100; pet complaints ${d.pet_complaints_per_100}/100; pet patio ${d.has_pet_friendly_patio ? 'yes' : 'NO'}; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; customer satisfaction ${d.customer_satisfaction_score}/100. ${criticalNote}Industry data: pet water bowls + waste stations = 90% reduction in pet-related complaints; water bowls are basic hospitality for dogs (dehydration risk on hot patios — dogs overheat faster than humans); water bowl design = stainless steel (sanitize in dishwasher), no plastic (bacteria), refilled every 30 min on hot days, labeled DOG WATER ONLY (not for humans); waste station design = bag dispenser + sealed bin, location near exit (not dining area), emptied 2x daily, no odor; waste station prevents: messes in dining area, health code violations, odor complaints, staff cleanup burden, negative reviews; pet amenity cost = $200-1,000 setup (bowls + station + signage); pet amenity ROI = 90% complaint reduction + 10-15% satisfaction lift + 5-8% review lift; pet amenity signals care + thoughtfulness; pet owners share + recommend pet-friendly restaurants (word of mouth); pet amenity absence signals disregard; pet amenity extensions = dog treats at host stand (free), dog beds in patio (loaner), cooling mats in summer, bandanas (branded photo op), birthday treats for dogs (loyalty). Solutions ranked by impact: (1) ADD pet water bowls + waste station — revenue ${fmt$(expectedComplaintReduction)}/mo complaint reduction + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.pet_amenity_installation_cost)}; payback 1-2 months; (2) INSTALL stainless steel water bowls (3-5 bowls for patio); (3) SANITIZE bowls daily (dishwasher cycle); (4) REFILL every 30 min on hot days (90°F+); (5) LABEL DOG WATER ONLY (avoid human use); (6) INSTALL waste station near exit (bag dispenser + sealed bin); (7) EMPTY waste bin 2x daily (lunch + close); (8) PROVIDE biodegradable waste bags (eco-friendly); (9) ADD hand sanitizer station near waste station; (10) POST signage (clean up after your pet); (11) TRAIN staff to offer water to dog owners proactively; (12) ADD dog treats at host stand (free, branded); (13) ADD dog beds in patio (loaner, washable); (14) ADD cooling mats in summer (heat safety); (15) BENCHMARK vs competitor pet amenities. Industry data: 90% complaint reduction; payback 1-2 months. Expected impact: -${targetPetComplaintReductionPct}% pet complaints, +10pts satisfaction, +${fmt$(expectedComplaintReduction)}/mo complaint reduction, payback 1-2 months.`,
        ai_recommendation: 'add_pet_water_bowls_and_waste_stations',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: PET_MENU_ITEMS_ABSENT
    if (config.requirePetMenu && (!d.has_pet_menu || d.pet_menu_item_count < config.minPetMenuItemCount)) {
      // no dog treats/pup cups -> missed $3-5 profit per pet-owning table
      const menuGap = targetPetMenuItemCount - d.pet_menu_item_count;
      const expectedPetMenuProfit = Math.round(petOwningHouseholds * 4 * 3.5);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.005);
      const expectedReputationLift = Math.round(baselineRevenue * 0.004);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.003);
      const totalOpportunity = Math.max(expectedPetMenuProfit + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 400);
      const severityLabel = !d.has_pet_menu ? 'medium' : d.pet_menu_item_count < 2 ? 'low' : 'low';
      const criticalNote = (!d.has_pet_menu)
        ? 'MEDIUM: NO PET MENU ITEMS (no dog treats, no pup cups) — pet menu items (dog treats, pup cups) cost $0.50-2.00 but generate $3-5 revenue each; missed profit per pet-owning table; pet owners want to treat their dogs (dining out is bonding); pup cups (whipped cream in small cup) are viral on social media (free marketing); pet menu signals pet-welcome; missed revenue + missed marketing + missed satisfaction. '
        : `LOW: PET MENU BELOW TARGET (${d.pet_menu_item_count} < ${config.minPetMenuItemCount}) — add 2-3 more items; current revenue ${fmt$(d.pet_menu_revenue_per_item)}/item; profit ${fmt$(d.pet_menu_profit_per_item)}/item. `;
      alerts.push({
        rule_id: 'pet_menu_items_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_pet_menu: d.has_pet_menu,
        pet_menu_item_count: d.pet_menu_item_count,
        pet_menu_revenue_per_item: d.pet_menu_revenue_per_item,
        pet_menu_profit_per_item: d.pet_menu_profit_per_item,
        pet_menu_items_sold_monthly: d.pet_menu_items_sold_monthly,
        has_pet_friendly_patio: d.has_pet_friendly_patio,
        pet_owner_visit_pct: d.pet_owner_visit_pct,
        dog_owner_visit_pct: d.dog_owner_visit_pct,
        pet_owner_satisfaction_score: d.pet_owner_satisfaction_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        monthly_revenue: d.monthly_revenue,
        average_party_size: d.average_party_size,
        pet_menu_creation_cost: d.pet_menu_creation_cost,
        satisfaction_lift_projected_pts: 8,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PET MENU ITEMS ABSENT: ${d.location_id} — pet menu ${d.has_pet_menu ? `${d.pet_menu_item_count} items (${fmt$(d.pet_menu_revenue_per_item)}/item, ${fmt$(d.pet_menu_profit_per_item)}/item profit, ${d.pet_menu_items_sold_monthly}/mo)` : 'ABSENT'}; pet owner visits ${d.pet_owner_visit_pct}%; dog owner visits ${d.dog_owner_visit_pct}%; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; customer satisfaction ${d.customer_satisfaction_score}/100. ${criticalNote}Industry data: pet menu items (dog treats, pup cups) cost $0.50-2.00 but generate $3-5 revenue each (60-80% margin); pup cups (whipped cream in small cup) cost $0.30, sell for $1-3 (or free with meal = loyalty); dog treats (commercial, dog-safe) cost $0.50, sell for $2-4; pupcakes (mini dog cupcakes) cost $1.50, sell for $4-6; dog ice cream (dog-safe, lactose-free) cost $1.00, sell for $3-5; dog beer (non-alcoholic, dog-safe) cost $1.50, sell for $4-6; pet menu marketing value = viral on social media (pup cup videos get 50K+ views); pet menu signals pet-welcome (loyalty); pet menu items = high margin + low food cost + high emotional value; pet menu items drive repeat visits (dog owners return for treats); pet menu design = dog-safe ingredients (no chocolate, no grapes, no onions, no xylitol, no macadamia nuts); chef collaboration with vet nutritionist recommended; pet menu items labeled clearly (DOG TREATS — NOT FOR HUMAN CONSUMPTION). Solutions ranked by impact: (1) LAUNCH pet menu items (3-5 items) — revenue ${fmt$(expectedPetMenuProfit)}/mo pet menu profit + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.pet_menu_creation_cost)}; payback 1-2 months; (2) ADD pup cups (whipped cream in small cup, free with meal or $1-3); (3) ADD dog treats (commercial, dog-safe, 2-3 brands); (4) ADD pupcakes (mini dog cupcakes, bakery-collab); (5) ADD dog ice cream (lactose-free, dog-safe); (6) ADD dog beer (non-alcoholic, dog-safe); (7) LABEL dog-safe ingredients clearly (no chocolate/grapes/onions/xylitol); (8) CONSULT vet nutritionist on menu items; (9) TRAIN staff to offer pet menu to dog owners; (10) PHOTOGRAPH pet menu items for social media; (11) PROMOTE pup cups as Instagram moment (free marketing); (12) OFFER dog birthday treat (free pupcake for dog birthdays); (13) SOURCE commercial dog treats wholesale (lower cost); (14) ADD pet menu to QR code menu (pet section); (15) BENCHMARK vs competitor pet menus. Industry data: $3-5 revenue per item, $0.50-2.00 cost (60-80% margin); payback 1-2 months. Expected impact: +8pts satisfaction, +${fmt$(expectedPetMenuProfit)}/mo pet menu profit, payback 1-2 months.`,
        ai_recommendation: 'launch_pet_menu_items',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: YAPPY_HOUR_EVENT_ABSENT
    if (config.requireYappyHour && (!d.has_yappy_hour || d.yappy_hour_events_per_month < config.minYappyHourEventsPerMonth)) {
      // no pet social events -> missed 30-50 new customer acquisition per event
      const eventGap = targetYappyHourEventsPerMonth - d.yappy_hour_events_per_month;
      const expectedNewCustomerAcquisition = (targetYappyHourEventsPerMonth - d.yappy_hour_events_per_month) * targetNewCustomerAcquisitionPerEvent;
      const expectedRevenueFromNewCustomers = Math.round(expectedNewCustomerAcquisition * 28);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.006);
      const expectedReputationLift = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.005);
      const totalOpportunity = Math.max(expectedRevenueFromNewCustomers + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 900);
      const severityLabel = !d.has_yappy_hour ? 'medium' : d.yappy_hour_events_per_month < 1 ? 'low' : 'low';
      const criticalNote = (!d.has_yappy_hour)
        ? 'MEDIUM: NO YAPPY HOUR EVENTS (no dog social hours) — yappy hour events (dog social hours) attract 30-50 new customers per event; missed new customer acquisition + missed brand differentiation; yappy hour = off-peak revenue + community building + social media content; yappy hour is signature event (differentiates from competitors); missed community + missed content + missed revenue. '
        : `LOW: YAPPY HOURS BELOW TARGET (${d.yappy_hour_events_per_month}/mo < ${config.minYappyHourEventsPerMonth}) — expand to 2-4/month; current new customers/event ${d.yappy_hour_new_customers_per_event}. `;
      alerts.push({
        rule_id: 'yappy_hour_event_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_yappy_hour: d.has_yappy_hour,
        yappy_hour_events_per_month: d.yappy_hour_events_per_month,
        yappy_hour_new_customers_per_event: d.yappy_hour_new_customers_per_event,
        has_pet_friendly_patio: d.has_pet_friendly_patio,
        pet_owner_visit_pct: d.pet_owner_visit_pct,
        dog_owner_visit_pct: d.dog_owner_visit_pct,
        pet_owner_satisfaction_score: d.pet_owner_satisfaction_score,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        monthly_revenue: d.monthly_revenue,
        yappy_hour_setup_cost: d.yappy_hour_setup_cost,
        new_customer_acquisition_projected: expectedNewCustomerAcquisition,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `YAPPY HOUR EVENT ABSENT: ${d.location_id} — yappy hour ${d.has_yappy_hour ? `${d.yappy_hour_events_per_month}/mo (${d.yappy_hour_new_customers_per_event} new customers/event)` : 'ABSENT'}; pet owner visits ${d.pet_owner_visit_pct}%; dog owner visits ${d.dog_owner_visit_pct}%; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; customer satisfaction ${d.customer_satisfaction_score}/100. ${criticalNote}Industry data: yappy hour events (dog social hours) attract 30-50 new customers per event (AKC + restaurant industry data); yappy hour = off-peak event (2-5pm weekday or weekend brunch) that fills empty seats; yappy hour format = dog social hour with: dog treats, dog games (costume contest, trick contest), dog photo booth, rescue adoption partner, dog trainer Q&A, vet nutritionist booth, dog beer + pup cups, dog cake cutting; yappy hour marketing = social media (Facebook event), local dog groups, vet clinics, dog parks, dog rescue partners, neighborhood apps (Nextdoor); yappy hour revenue = $1,500-4,000 per event (food + drinks + pet menu); yappy hour new customer acquisition = 30-50 per event (most return as repeat customers); yappy hour cost = $200-500 setup (decor, treats, signage, staff); yappy hour ROI = 5-15x return per event; yappy hour brand value = signature event (differentiates from competitors), media coverage (local newspaper, blogs), social media content (50-100 photos + videos per event); yappy hour partnership = local dog rescue (adoption booth = community goodwill + free marketing); yappy hour frequency = monthly (sustainable) or weekly (aggressive); yappy hour scheduling = off-peak hours (avoid cannibalizing regular service). Solutions ranked by impact: (1) HOST yappy hour events (2-4/month) — revenue ${fmt$(expectedRevenueFromNewCustomers)}/mo from new customers + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.yappy_hour_setup_cost)}; payback immediate (1 event); (2) SCHEDULE monthly yappy hour (3rd Saturday, 2-5pm); (3) PARTNER with local dog rescue (adoption booth = community goodwill); (4) ADD dog games (costume contest, trick contest, look-alike contest); (5) SET UP dog photo booth (Instagram moment); (6) OFFER pet menu specials (pup cups, pupcakes); (7) INVITE dog trainer for Q&A; (8) INVITE vet nutritionist for booth; (9) PROVIDE dog beer (non-alcoholic) + dog treats; (10) CUT dog cake (group photo op); (11) COLLECT email signups (loyalty program); (12) PROMOTE on social media (Facebook event, Instagram, Nextdoor); (13) PARTNER with vet clinics for cross-promo (flyers); (14) COLLECT customer feedback after event; (15) SCALE to weekly if successful. Industry data: 30-50 new customers/event; payback immediate. Expected impact: +${expectedNewCustomerAcquisition} new customers/mo, +12pts satisfaction, +${fmt$(expectedRevenueFromNewCustomers)}/mo revenue from new customers, payback immediate.`,
        ai_recommendation: 'host_yappy_hour_events',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: PET_POLICY_UNCLEAR
    if (config.requirePetPolicySignage && (!d.has_pet_policy_signage || d.pet_policy_clarity_score < config.minPetPolicyClarityScore)) {
      // no visible pet policy signage -> confusion + conflicts + negative reviews
      const clarityGap = targetPetPolicyClarity - d.pet_policy_clarity_score;
      const expectedComplaintReduction = Math.round(transactionsPerMonth * (d.pet_policy_complaints_per_100 / 100) * 0.7 * 12);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.004);
      const expectedReputationLift = Math.round(baselineRevenue * 0.005);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.003);
      const totalOpportunity = Math.max(expectedComplaintReduction + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 350);
      const severityLabel = !d.has_pet_policy_signage ? 'medium' : d.pet_policy_clarity_score < 60 ? 'low' : 'low';
      const criticalNote = (!d.has_pet_policy_signage)
        ? 'MEDIUM: NO VISIBLE PET POLICY SIGNAGE — no signage = confusion (customers do not know if pets allowed); confusion = conflicts (staff must explain policy ad hoc); conflicts = negative reviews (customers feel unwelcome or surprised); pet policy signage = clarity (rules visible to all); ADA service animal policy = signage required (welcome service animals); pet policy signage = legal protection (rules visible = enforceable). '
        : `LOW: PET POLICY CLARITY BELOW TARGET (${d.pet_policy_clarity_score}/100 < ${config.minPetPolicyClarityScore}) — signage present but unclear; pet policy complaints ${d.pet_policy_complaints_per_100}/100. `;
      alerts.push({
        rule_id: 'pet_policy_unclear',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_pet_policy_signage: d.has_pet_policy_signage,
        pet_policy_clarity_score: d.pet_policy_clarity_score,
        pet_policy_complaints_per_100: d.pet_policy_complaints_per_100,
        has_pet_friendly_patio: d.has_pet_friendly_patio,
        customer_satisfaction_score: d.customer_satisfaction_score,
        negative_review_count: d.negative_review_count,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        monthly_revenue: d.monthly_revenue,
        pet_policy_signage_cost: d.pet_policy_signage_cost,
        satisfaction_lift_projected_pts: 6,
        pet_complaint_reduction_projected_pct: 70,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PET POLICY UNCLEAR: ${d.location_id} — pet policy signage ${d.has_pet_policy_signage ? `present (clarity ${d.pet_policy_clarity_score}/100)` : 'ABSENT'}; pet policy complaints ${d.pet_policy_complaints_per_100}/100; negative reviews (30d) ${d.negative_review_count}; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; customer satisfaction ${d.customer_satisfaction_score}/100. ${criticalNote}Industry data: visible pet policy signage = clarity (customers know rules before entering); signage prevents: confusion, conflicts at door, staff explanations, negative reviews, ADA lawsuits (service animal policy must be visible); pet policy signage content = (1) service animals welcome (ADA required); (2) pet-friendly patio rules (leash required, well-behaved only, owner liability, dog waste cleanup); (3) pet menu available; (4) pet amenities location (water bowls, waste station); (5) pet-free zones (dining room, bar, food prep areas); signage location = entrance (door), host stand, patio entrance, menu (pet section); signage design = clear, friendly tone (Welcome Pets!), readable from distance (24pt+ font), durable (weatherproof for patio), bilingual (top local languages); signage legal protection = visible rules = enforceable (no surprises); ADA signage = Service Animals Welcome (mandatory under ADA Title III); pet policy = per restaurant (no federal pet law, but local health codes vary); pet policy communication = signage + website + Google Business Profile + social media + phone script. Solutions ranked by impact: (1) PUBLISH visible pet policy signage — revenue ${fmt$(expectedComplaintReduction)}/mo complaint reduction + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.pet_policy_signage_cost)}; payback 1 month; (2) INSTALL entrance signage (Welcome Pets + Service Animals Welcome); (3) INSTALL host stand signage (pet policy quick reference); (4) INSTALL patio entrance signage (leash required + waste cleanup); (5) ADD pet policy to menu (pet section with rules); (6) ADD pet policy to website (Google Business Profile); (7) ADD pet policy to phone script (host quotes policy); (8) USE friendly tone (Welcome Pets! not No Pets Allowed); (9) USE clear language (avoid jargon, simple sentences); (10) USE readable font (24pt+ for entrance signage); (11) USE durable materials (weatherproof for patio); (12) TRANSLATE to top local languages; (13) INCLUDE service animal welcome (ADA required); (14) UPDATE policy seasonally (e.g. heat advisories for dogs); (15) BENCHMARK vs competitor pet policies. Industry data: signage = clarity + legal protection; payback 1 month. Expected impact: -70% pet policy complaints, +6pts satisfaction, +${fmt$(expectedComplaintReduction)}/mo complaint reduction, payback 1 month.`,
        ai_recommendation: 'publish_visible_pet_policy_signage',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: PET_PHOTOGRAPHY_SPOT_ABSENT
    if (config.requirePetPhotographySpot && (!d.has_pet_photography_spot || d.pet_photo_spot_score < config.minPetPhotoSpotScore)) {
      // no Instagram-worthy pet photo area -> missed 40-60% social engagement
      const photoGap = targetPetPhotoSpotScore - d.pet_photo_spot_score;
      const expectedSocialEngagementLift = Math.round(baselineRevenue * 0.015);
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.004);
      const expectedReputationLift = Math.round(baselineRevenue * 0.006);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.004);
      const totalOpportunity = Math.max(expectedSocialEngagementLift + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 500);
      const severityLabel = !d.has_pet_photography_spot ? 'medium' : d.pet_photo_spot_score < 50 ? 'low' : 'low';
      const criticalNote = (!d.has_pet_photography_spot)
        ? 'MEDIUM: NO PET PHOTOGRAPHY SPOT (no Instagram-worthy pet photo area) — pet-friendly restaurants get free social media exposure; dog photos = 40-60% more Instagram engagement than food photos; missed free marketing; missed brand awareness; missed user-generated content (UGC); pet owners want to photograph their dogs (dining out = photo op); photo spot signals pet-welcome. '
        : `LOW: PET PHOTO SPOT BELOW TARGET (${d.pet_photo_spot_score}/100 < ${config.minPetPhotoSpotScore}) — improve lighting + backdrop + props; current IG engagement ${d.instagram_engagement_pct}%. `;
      alerts.push({
        rule_id: 'pet_photography_spot_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_pet_photography_spot: d.has_pet_photography_spot,
        pet_photo_spot_score: d.pet_photo_spot_score,
        instagram_engagement_pct: d.instagram_engagement_pct,
        has_pet_friendly_patio: d.has_pet_friendly_patio,
        has_pet_menu: d.has_pet_menu,
        dog_owner_visit_pct: d.dog_owner_visit_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        monthly_revenue: d.monthly_revenue,
        pet_photography_spot_cost: d.pet_photography_spot_cost,
        instagram_engagement_lift_projected_pct: targetInstagramEngagementLiftPct,
        satisfaction_lift_projected_pts: 8,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `PET PHOTOGRAPHY SPOT ABSENT: ${d.location_id} — pet photo spot ${d.has_pet_photography_spot ? `present (score ${d.pet_photo_spot_score}/100)` : 'ABSENT'}; IG engagement ${d.instagram_engagement_pct}%; dog owner visits ${d.dog_owner_visit_pct}%; pet menu ${d.has_pet_menu ? 'yes' : 'NO'}; competitor pet-friendly ${d.competitor_pet_friendly_score}/100; customer satisfaction ${d.customer_satisfaction_score}/100. ${criticalNote}Industry data: pet-friendly restaurants get free social media exposure — dog photos = 40-60% more Instagram engagement than food photos; Instagram engagement drives: brand awareness, new customer acquisition, repeat visits, UGC (user-generated content = free content marketing); pet photo spot design = (1) backdrop (branded wall, floral wall, mural); (2) lighting (natural + soft, no harsh shadows); (3) props (bandanas, signs, toys, treats); (4) framing (clear focal point, no clutter); (5) branding (logo visible in photo); (6) hashtag (encourage tagging #RestaurantNamePets); pet photo spot location = patio corner (natural light), entrance wall (high visibility), dedicated photo booth (professional); pet photo spot cost = $150-500 setup (backdrop + props + signage); pet photo spot ROI = 40-60% more IG engagement + 5-10% new customer acquisition from social + free UGC (vs $500-2,000/mo paid social); pet photo spot marketing = hashtag campaign, photo contest (best dog photo monthly), featured customer photos on restaurant account; pet photo spot extensions = polaroid camera loaner (instant photos), photo props box (bandanas, signs, toys), branded photo frames (giveaway with meal purchase); pet photo spot = signature marketing asset (differentiates from competitors). Solutions ranked by impact: (1) CREATE pet photography spot — revenue ${fmt$(expectedSocialEngagementLift)}/mo social engagement + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.pet_photography_spot_cost)}; payback 1-2 months; (2) INSTALL branded backdrop (wall mural, floral wall, or printed backdrop); (3) POSITION in natural light (patio corner or window wall); (4) ADD props (bandanas with logo, signs likeadopt me, dog toys, treats); (5) ADD hashtag signage (#RestaurantNamePets); (6) ADD logo visible in photo frame; (7) LAUNCH monthly photo contest (best dog photo = free meal); (8) FEATURE customer photos on restaurant Instagram (repost); (9) PROVIDE polaroid camera loaner (instant photos); (10) CREATE photo props box (props at host stand); (11) GIVE branded photo frames with meal purchase (loyalty); (12) ENCOURAGE tagging in signage + menu; (13) TRACK hashtag mentions monthly; (14) USE UGC in paid social ads (with permission); (15) BENCHMARK vs competitor photo spots. Industry data: 40-60% more IG engagement; payback 1-2 months. Expected impact: +${targetInstagramEngagementLiftPct}% IG engagement, +8pts satisfaction, +${fmt$(expectedSocialEngagementLift)}/mo social engagement lift, payback 1-2 months.`,
        ai_recommendation: 'create_pet_photography_spot',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: SERVICE_ANIMAL_REFUSAL_RISK
    if (d.service_animal_refusal_incidents > 0 || d.ada_lawsuit_risk_score > 50 || d.ada_compliance_score < config.minAdaComplianceScore) {
      // staff may refuse service animals -> immediate ADA violation + lawsuit
      const refusalRiskGap = d.ada_lawsuit_risk_score;
      const expectedLawsuitCostAvoidance = Math.max(d.ada_lawsuit_risk_score, 40) * 2500;
      const expectedSatisfactionLift = Math.round(baselineRevenue * 0.006);
      const expectedReputationLift = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.004);
      const totalOpportunity = Math.max(expectedLawsuitCostAvoidance + expectedSatisfactionLift + expectedReputationLift + expectedCompetitiveLift, 5000);
      const severityLabel = d.service_animal_refusal_incidents > 0 ? 'critical' : d.ada_lawsuit_risk_score > 70 ? 'high' : d.ada_lawsuit_risk_score > 50 ? 'medium' : 'medium';
      const criticalNote = (d.service_animal_refusal_incidents > 0)
        ? 'CRITICAL: SERVICE ANIMAL REFUSAL INCIDENTS DOCUMENTED — service animal refusal = immediate ADA violation; each refusal = $55,000-$200,000 lawsuit (DOJ); refusal incidents documented = evidence of pattern (higher damages); ADA Title III public accommodations MUST allow service animals; staff refusal = #1 ADA lawsuit source for restaurants; immediate training + protocol + documentation required. '
        : d.ada_lawsuit_risk_score > 70
          ? `HIGH: HIGH ADA LAWSUIT RISK (score ${d.ada_lawsuit_risk_score}/100) — ADA compliance ${d.ada_compliance_score}/100; staff ADA training ${d.staff_ada_training_pct}%; service animal protocol ${d.has_service_animal_protocol ? 'yes' : 'NO'}; high refusal probability without intervention. `
          : `MEDIUM: ADA LAWSUIT RISK ELEVATED (score ${d.ada_lawsuit_risk_score}/100) — ADA compliance ${d.ada_compliance_score}/100; mitigate risk with training + protocol. `;
      alerts.push({
        rule_id: 'service_animal_refusal_risk',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        service_animal_refusal_incidents: d.service_animal_refusal_incidents,
        ada_lawsuit_risk_score: d.ada_lawsuit_risk_score,
        ada_compliance_score: d.ada_compliance_score,
        has_service_animal_protocol: d.has_service_animal_protocol,
        staff_ada_training_pct: d.staff_ada_training_pct,
        trained_ada_staff_count: d.trained_ada_staff_count,
        total_staff_count: d.total_staff_count,
        customer_satisfaction_score: d.customer_satisfaction_score,
        negative_review_count: d.negative_review_count,
        competitor_pet_friendly_score: d.competitor_pet_friendly_score,
        monthly_revenue: d.monthly_revenue,
        staff_ada_training_cost: d.staff_ada_training_cost,
        ada_compliance_audit_cost: d.ada_compliance_audit_cost,
        ada_lawsuit_risk_reduction_projected_pts: targetAdaLawsuitRiskReductionPts,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SERVICE ANIMAL REFUSAL RISK: ${d.location_id} — refusal incidents ${d.service_animal_refusal_incidents}; ADA lawsuit risk ${d.ada_lawsuit_risk_score}/100; ADA compliance ${d.ada_compliance_score}/100; staff ADA training ${d.staff_ada_training_pct}% (${d.trained_ada_staff_count}/${d.total_staff_count}); protocol ${d.has_service_animal_protocol ? 'documented' : 'ABSENT'}; negative reviews (30d) ${d.negative_review_count}; competitor pet-friendly ${d.competitor_pet_friendly_score}/100. ${criticalNote}Industry data: service animal refusal = immediate ADA violation; $55,000 first violation, $200,000 subsequent violations (DOJ); private ADA lawsuits = $4,000-$100,000+ damages + attorney fees; refusal pattern (multiple incidents) = punitive damages + injunctive relief; staff refusal = #1 ADA lawsuit source for restaurants (ADA.gov); refusal examples = asking for documentation (illegal), asking dog to demonstrate task (illegal), charging pet fee (illegal), isolating to patio only (illegal), asking disability nature (illegal), refusing entry (illegal if service animal); refusal causes = untrained staff (do not know ADA law), confusion between service animal vs ESA vs pet, bias against dogs, allergies (NOT legal reason to refuse), fear of dogs (NOT legal reason), religious objections (NOT legal reason under ADA); refusal documentation = log date, time, staff member, customer description, refusal reason, witness (for legal defense); refusal mitigation = staff training (mandatory), protocol documentation (laminated), manager escalation chain, mystery shopper audits, ADA-compliance insurance, employment attorney consultation; refusal response = if refused, manager intervenes immediately, apologizes, seats customer, documents incident, retrains staff; refusal lawsuit prevention = proactive training + protocol + signage + audits + insurance. Solutions ranked by impact: (1) MITIGATE service animal refusal risk — risk reduction ${fmt$(expectedLawsuitCostAvoidance)}/mo (lawsuit avoidance) + ${fmt$(expectedSatisfactionLift)}/mo satisfaction + ${fmt$(expectedReputationLift)}/mo reputation + ${fmt$(expectedCompetitiveLift)}/mo competitive; cost ${fmt$(d.staff_ada_training_cost + d.ada_compliance_audit_cost)}; payback immediate (lawsuit avoidance); (2) TRAIN all staff on ADA service animal law (mandatory, quarterly refresher); (3) DOCUMENT service animal protocol (laminated, at host stand + POS); (4) POST Service Animals Welcome signage (entrance + host stand); (5) CREATE escalation chain (manager on duty handles disputes); (6) LOG refusal incidents (date, time, staff, customer, reason, witness); (7) AUDIT via mystery shopper with service animal (monthly); (8) RETRAIN staff after any incident (immediate); (9) INSURE against ADA lawsuit (general liability + EPLI); (10) CONSULT employment attorney for protocol review; (11) PARTNER with disability rights org for training (ADA National Network); (12) ADD ADA module to onboarding (new hire required); (13) ROLE-PLAY refusal scenarios in pre-shift; (14) DOCUMENT compliance efforts (training records, protocol versions, audit results) for legal defense; (15) BENCHMARK vs competitor ADA compliance. Industry data: $55k-$200k per violation (DOJ); payback immediate. Expected impact: -${targetAdaLawsuitRiskReductionPts}pts lawsuit risk, +12pts satisfaction, +${fmt$(expectedLawsuitCostAvoidance)}/mo lawsuit cost avoidance, payback immediate.`,
        ai_recommendation: 'mitigate_service_animal_refusal_risk',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM pet_friendly_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE pet_friendly_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant pet-friendly + service animal accommodation expert. Given pet policy + ADA service animal data, recommend ONE specific action with expected revenue lift, lawsuit risk reduction, satisfaction lift, or new customer acquisition (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Pet patio: ${a.has_pet_friendly_patio ?? false} (${a.pet_patio_seats ?? 0} seats, score ${a.pet_patio_score ?? 0}/100). Service animal protocol: ${a.has_service_animal_protocol ?? false}. Staff ADA training: ${a.staff_ada_training_pct ?? 0}% (${a.trained_ada_staff_count ?? 0}/${a.total_staff_count ?? 0}). Water bowls: ${a.has_pet_water_bowls ?? false}. Waste station: ${a.has_pet_waste_station ?? false}. Pet amenity score: ${a.pet_amenity_score ?? 0}/100. Pet complaints: ${a.pet_complaints_per_100 ?? 0}/100. Pet menu: ${a.has_pet_menu ?? false} (${a.pet_menu_item_count ?? 0} items, ${fmt$(a.pet_menu_revenue_per_item ?? 0)}/item, ${fmt$(a.pet_menu_profit_per_item ?? 0)}/item profit, ${a.pet_menu_items_sold_monthly ?? 0}/mo sold). Yappy hour: ${a.has_yappy_hour ?? false} (${a.yappy_hour_events_per_month ?? 0}/mo, ${a.yappy_hour_new_customers_per_event ?? 0} new/event). Pet signage: ${a.has_pet_policy_signage ?? false} (clarity ${a.pet_policy_clarity_score ?? 0}/100, complaints ${a.pet_policy_complaints_per_100 ?? 0}/100). Photo spot: ${a.has_pet_photography_spot ?? false} (score ${a.pet_photo_spot_score ?? 0}/100, IG engagement ${a.instagram_engagement_pct ?? 0}%). Refusal incidents: ${a.service_animal_refusal_incidents ?? 0}. ADA lawsuit risk: ${a.ada_lawsuit_risk_score ?? 0}/100. ADA compliance: ${a.ada_compliance_score ?? 0}/100. Pet owner visits: ${a.pet_owner_visit_pct ?? 0}%. Dog owner visits: ${a.dog_owner_visit_pct ?? 0}%. Pet owner satisfaction: ${a.pet_owner_satisfaction_score ?? 0}/100. Customer satisfaction: ${a.customer_satisfaction_score ?? 0}/100. Negative reviews (30d): ${a.negative_review_count ?? 0}. Competitor pet-friendly: ${a.competitor_pet_friendly_score ?? 0}/100. Revenue: ${fmt$(a.monthly_revenue ?? 0)}. Weekend revenue: ${fmt$(a.weekend_revenue ?? 0)} (${a.weekend_revenue_share_pct ?? 0}% share). Avg party size: ${a.average_party_size ?? 0}. Patio cost: ${fmt$(a.pet_patio_installation_cost ?? 0)}. Training cost: ${fmt$(a.staff_ada_training_cost ?? 0)}. Amenity cost: ${fmt$(a.pet_amenity_installation_cost ?? 0)}. Menu cost: ${fmt$(a.pet_menu_creation_cost ?? 0)}. Yappy hour cost: ${fmt$(a.yappy_hour_setup_cost ?? 0)}. Signage cost: ${fmt$(a.pet_policy_signage_cost ?? 0)}. Photo spot cost: ${fmt$(a.pet_photography_spot_cost ?? 0)}. ADA audit cost: ${fmt$(a.ada_compliance_audit_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActivePetFriendlyServiceAnimalAlerts = async (db: ReturnType<typeof useDB>): Promise<PetFriendlyServiceAnimalAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM pet_friendly_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getPetFriendlyServiceAnimalSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  petFriendlyPatioAbsentCount: number; serviceAnimalProtocolAbsentCount: number;
  petAmenitiesMissingCount: number; petMenuItemsAbsentCount: number;
  yappyHourEventAbsentCount: number; petPolicyUnclearCount: number;
  petPhotographySpotAbsentCount: number; serviceAnimalRefusalRiskCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'pet_friendly_patio_absent') AS nopatio,
              math::count(rule_id = 'service_animal_protocol_absent') AS noprotocol,
              math::count(rule_id = 'pet_amenities_missing') AS noamenity,
              math::count(rule_id = 'pet_menu_items_absent') AS nomenu,
              math::count(rule_id = 'yappy_hour_event_absent') AS noyappy,
              math::count(rule_id = 'pet_policy_unclear') AS nopolicy,
              math::count(rule_id = 'pet_photography_spot_absent') AS nophoto,
              math::count(rule_id = 'service_animal_refusal_risk') AS refusals
       FROM pet_friendly_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      petFriendlyPatioAbsentCount: safeNumber(r.nopatio, 0),
      serviceAnimalProtocolAbsentCount: safeNumber(r.noprotocol, 0),
      petAmenitiesMissingCount: safeNumber(r.noamenity, 0),
      petMenuItemsAbsentCount: safeNumber(r.nomenu, 0),
      yappyHourEventAbsentCount: safeNumber(r.noyappy, 0),
      petPolicyUnclearCount: safeNumber(r.nopolicy, 0),
      petPhotographySpotAbsentCount: safeNumber(r.nophoto, 0),
      serviceAnimalRefusalRiskCount: safeNumber(r.refusals, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, petFriendlyPatioAbsentCount: 0, serviceAnimalProtocolAbsentCount: 0, petAmenitiesMissingCount: 0, petMenuItemsAbsentCount: 0, yappyHourEventAbsentCount: 0, petPolicyUnclearCount: 0, petPhotographySpotAbsentCount: 0, serviceAnimalRefusalRiskCount: 0 };
  }
};

export const updatePetFriendlyServiceAnimalAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
