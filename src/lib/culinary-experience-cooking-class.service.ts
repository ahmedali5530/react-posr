/**
 * AI Culinary Experience & Cooking Class Optimizer — predicts how culinary
 * experiences and cooking classes (chef-led cooking classes, wine pairing
 * dinners, tasting menus, chef table experiences, culinary workshops, food
 * tours, demonstration kitchens, interactive dining) impact additional
 * revenue, brand differentiation, customer loyalty, and marketing reach.
 *
 * Cooking classes generate $1,500-5,000 per event with 80%+ profit margins
 * (Culinary Institute of America). Chef table experiences command a 200-300%
 * premium over regular dining (OpenTable). Tasting menus increase average
 * ticket 150-250% and are the #1 fine dining revenue maximizer (Cornell
 * CHR). Wine pairing dinners increase beverage revenue 300-400% per event.
 * 55% of fine dining customers would attend a cooking class at their
 * favorite restaurant (NRA). Culinary workshops attract new customers — 35%
 * become regular diners. Demonstration kitchens create "dinner theater" —
 * 40% satisfaction boost + 30% more Instagram content. Interactive dining
 * (build-your-own, tableside prep) increases engagement 50-60%. Cooking
 * classes are the #1 restaurant-based experiential dining trend (National
 * Restaurant Association 2024).
 *
 * 188th POSR-exclusive differentiator. Restaurants without culinary
 * experiences miss experiential revenue + brand differentiation + loyalty
 * (cooking_class_program_absent = no cooking classes; chef_table_experience_absent
 * = no chef table; tasting_menu_absent = no tasting menu in fine dining;
 * wine_pairing_dinner_absent = no wine pairing events; culinary_workshop_absent
 * = no workshops; demonstration_kitchen_absent = no demo kitchen;
 * interactive_dining_missing = no build-your-own or tableside;
 * culinary_experience_not_promoted = experiences available but not marketed).
 *
 * Distinct from:
 *   - catering-optimizer — off-site event catering (not on-premise culinary experiences)
 *   - private-event-space — space booking (not the culinary program itself)
 *   - wine-pairing (legacy) — dish-level wine pairing recommendation (not wine pairing dinners)
 *
 * 8 AI rules:
 *   1. cooking_class_program_absent -> no cooking classes -> missed $1,500-5,000/event at 80%+ margins
 *   2. chef_table_experience_absent -> no chef table -> missed 200-300% premium pricing
 *   3. tasting_menu_absent -> no tasting menu in fine dining -> missed 150-250% ticket increase
 *   4. wine_pairing_dinner_absent -> no wine pairing events -> missed 300-400% beverage revenue
 *   5. culinary_workshop_absent -> no workshops -> missed 35% new-to-regular conversion
 *   6. demonstration_kitchen_absent -> no demo kitchen -> missed 40% satisfaction + 30% Instagram
 *   7. interactive_dining_missing -> no build-your-own or tableside -> missed 50-60% engagement
 *   8. culinary_experience_not_promoted -> experiences available but not marketed -> low enrollment
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type CulinaryExperienceRuleId =
  | 'cooking_class_program_absent'
  | 'chef_table_experience_absent'
  | 'tasting_menu_absent'
  | 'wine_pairing_dinner_absent'
  | 'culinary_workshop_absent'
  | 'demonstration_kitchen_absent'
  | 'interactive_dining_missing'
  | 'culinary_experience_not_promoted';

export type CulinaryExperienceAiRec =
  | 'launch_cooking_class_program'
  | 'build_chef_table_experience'
  | 'launch_tasting_menu'
  | 'host_wine_pairing_dinners'
  | 'add_culinary_workshops'
  | 'install_demonstration_kitchen'
  | 'add_interactive_dining'
  | 'promote_culinary_experiences'
  | 'monitor'
  | 'skip';

export interface CulinaryExperienceAlert {
  id?: string;
  rule_id: CulinaryExperienceRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'dining_room' | 'private_room' | 'kitchen_studio' | 'chef_table'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural'
  // Culinary experience inventory
  has_cooking_classes?: boolean;                           // chef-led cooking classes offered
  has_chef_table?: boolean;                                // chef table experience available
  has_tasting_menu?: boolean;                              // multi-course tasting menu offered
  has_wine_pairing_dinners?: boolean;                      // wine pairing dinner events hosted
  has_culinary_workshops?: boolean;                        // skill-building culinary workshops
  has_demonstration_kitchen?: boolean;                     // demonstration kitchen installed
  has_interactive_dining?: boolean;                        // build-your-own or tableside prep
  has_food_tours?: boolean;                                // restaurant-led food tours
  experience_features_count?: number;                      // # of distinct experience features (0-8)
  // Cooking class details
  cooking_class_events_per_month?: number;                 // cooking class events hosted per month
  cooking_class_seat_count?: number;                       // seats per cooking class event
  cooking_class_ticket_price?: number;                     // price per cooking class seat
  cooking_class_revenue_monthly?: number;                  // monthly cooking class revenue
  cooking_class_margin_pct?: number;                       // cooking class profit margin %
  cooking_class_waitlist_count?: number;                   // current cooking class waitlist size
  // Chef table details
  chef_table_seats?: number;                               // chef table seat count
  chef_table_price_per_person?: number;                    // chef table price per person
  chef_table_premium_pct?: number;                         // chef table premium over regular dining %
  chef_table_bookings_monthly?: number;                    // chef table bookings per month
  chef_table_revenue_monthly?: number;                     // monthly chef table revenue
  // Tasting menu details
  tasting_menu_courses?: number;                           // number of courses in tasting menu
  tasting_menu_price?: number;                             // tasting menu price per person
  tasting_menu_ticket_lift_pct?: number;                   // average ticket lift % from tasting menu
  tasting_menu_orders_monthly?: number;                    // tasting menu orders per month
  tasting_menu_revenue_monthly?: number;                   // monthly tasting menu revenue
  // Wine pairing dinner details
  wine_pairing_events_monthly?: number;                    // wine pairing dinner events per month
  wine_pairing_attendance_avg?: number;                    // average attendance per wine pairing dinner
  wine_pairing_ticket_price?: number;                      // wine pairing dinner ticket price
  wine_pairing_beverage_revenue_lift_pct?: number;         // beverage revenue lift % per event
  wine_pairing_revenue_monthly?: number;                   // monthly wine pairing dinner revenue
  // Culinary workshop details
  workshop_topics_count?: number;                          // number of distinct workshop topics
  workshop_attendance_monthly?: number;                    // monthly workshop attendance
  workshop_new_customer_pct?: number;                      // % of workshop attendees who are new customers
  workshop_conversion_to_regular_pct?: number;             // % of new workshop customers who become regular diners
  workshop_revenue_monthly?: number;                      // monthly workshop revenue
  // Demonstration kitchen details
  demo_kitchen_seats?: number;                            // demonstration kitchen seat count
  demo_kitchen_events_monthly?: number;                   // demonstration kitchen events per month
  demo_kitchen_satisfaction_lift_pct?: number;            // satisfaction lift % from demo kitchen
  demo_kitchen_instagram_lift_pct?: number;              // Instagram content lift % from demo kitchen
  demo_kitchen_revenue_monthly?: number;                  // monthly demo kitchen revenue
  // Interactive dining details
  interactive_dining_options?: number;                    // # of build-your-own or tableside options
  interactive_engagement_lift_pct?: number;               // engagement lift % from interactive dining
  interactive_dining_revenue_lift_pct?: number;           // revenue lift % from interactive dining
  // Marketing & promotion
  experiences_promoted?: boolean;                          // experiences marketed via social/email/website
  experiences_marketing_channels?: number;                 // # of marketing channels used for experiences
  experience_enrollment_rate_pct?: number;                // enrollment rate % of experiences
  experience_waitlist_total?: number;                     // total waitlist across all experiences
  // Customer behavior impact
  customer_loyalty_score?: number;                        // 0-100 customer loyalty
  customer_loyalty_baseline?: number;                     // baseline loyalty
  customer_loyalty_lift_pct?: number;                     // loyalty lift %
  brand_differentiation_score?: number;                   // 0-100 brand differentiation
  brand_differentiation_baseline?: number;                // baseline brand differentiation
  brand_differentiation_lift_pct?: number;                // brand differentiation lift %
  customer_satisfaction_score?: number;                   // 0-100 satisfaction
  customer_satisfaction_baseline?: number;                // baseline satisfaction
  customer_satisfaction_lift_pct?: number;                // satisfaction lift %
  instagram_engagement_lift_pct?: number;                 // Instagram engagement lift %
  marketing_reach_lift_pct?: number;                      // marketing reach lift %
  new_customer_acquisition_monthly?: number;              // new customers acquired via experiences per month
  repeat_visit_lift_pct?: number;                         // repeat visit lift %
  // Competitive positioning
  competitors_with_experiences_pct?: number;              // % of nearby competitors with culinary experiences
  experience_aware_lost_customers?: number;               // customers lost due to lack of experiences
  // Economics
  monthly_revenue?: number;                               // total restaurant monthly revenue
  experience_program_setup_cost?: number;                 // one-time experience program setup cost
  experience_program_monthly_cost?: number;               // monthly experience program cost
  experience_marketing_monthly_cost?: number;             // monthly experience marketing cost
  experience_program_total_monthly_cost?: number;         // monthly total experience program cost
  // Impact projections
  customer_loyalty_lift_projected_pct?: number;           // projected loyalty lift %
  brand_differentiation_lift_projected_pct?: number;      // projected brand differentiation lift %
  customer_satisfaction_lift_projected_pct?: number;      // projected satisfaction lift %
  instagram_engagement_lift_projected_pct?: number;       // projected Instagram engagement lift %
  marketing_reach_lift_projected_pct?: number;            // projected marketing reach lift %
  new_customer_acquisition_projected_pct?: number;        // projected new customer acquisition lift %
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: CulinaryExperienceAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface CulinaryExperienceConfig {
  aiEnabled: boolean;
  requireCookingClasses: boolean;                          // require cooking class program
  requireChefTable: boolean;                               // require chef table experience
  requireTastingMenu: boolean;                             // require tasting menu (fine dining)
  requireWinePairingDinners: boolean;                      // require wine pairing dinner events
  requireCulinaryWorkshops: boolean;                       // require culinary workshops
  requireDemonstrationKitchen: boolean;                    // require demonstration kitchen
  requireInteractiveDining: boolean;                       // require build-your-own or tableside
  requireExperiencePromotion: boolean;                     // require active experience marketing
  minExperienceFeatures: number;                           // minimum # of distinct experience features (6)
  minCookingClassMarginPct: number;                        // minimum cooking class profit margin % (80)
  minChefTablePremiumPct: number;                          // minimum chef table premium % (200)
  minTastingMenuTicketLiftPct: number;                     // minimum tasting menu ticket lift % (150)
  minWinePairingBeverageLiftPct: number;                   // minimum wine pairing beverage lift % (300)
  minWorkshopConversionPct: number;                        // minimum workshop conversion % (35)
  minDemoKitchenSatisfactionLiftPct: number;               // minimum demo kitchen satisfaction lift % (40)
  minInteractiveEngagementLiftPct: number;                 // minimum interactive engagement lift % (50)
  minLoyaltyLiftPct: number;                               // minimum loyalty lift % (15)
  minBrandDifferentiationLiftPct: number;                  // minimum brand differentiation lift % (20)
  minNewCustomerAcquisitionLiftPct: number;                // minimum new customer acquisition lift % (20)
}

export const DEFAULT_CULINARY_EXPERIENCE_CONFIG: CulinaryExperienceConfig = {
  aiEnabled: true,
  requireCookingClasses: true,
  requireChefTable: true,
  requireTastingMenu: true,
  requireWinePairingDinners: true,
  requireCulinaryWorkshops: true,
  requireDemonstrationKitchen: true,
  requireInteractiveDining: true,
  requireExperiencePromotion: true,
  minExperienceFeatures: 6,
  minCookingClassMarginPct: 80,
  minChefTablePremiumPct: 200,
  minTastingMenuTicketLiftPct: 150,
  minWinePairingBeverageLiftPct: 300,
  minWorkshopConversionPct: 35,
  minDemoKitchenSatisfactionLiftPct: 40,
  minInteractiveEngagementLiftPct: 50,
  minLoyaltyLiftPct: 15,
  minBrandDifferentiationLiftPct: 20,
  minNewCustomerAcquisitionLiftPct: 20,
};

export const readCulinaryExperienceConfig = (settings: any): CulinaryExperienceConfig => ({
  aiEnabled: settings?.culinary_experience_ai_enabled ?? true,
  requireCookingClasses: settings?.culinary_experience_require_cooking_classes ?? true,
  requireChefTable: settings?.culinary_experience_require_chef_table ?? true,
  requireTastingMenu: settings?.culinary_experience_require_tasting_menu ?? true,
  requireWinePairingDinners: settings?.culinary_experience_require_wine_pairing ?? true,
  requireCulinaryWorkshops: settings?.culinary_experience_require_workshops ?? true,
  requireDemonstrationKitchen: settings?.culinary_experience_require_demo_kitchen ?? true,
  requireInteractiveDining: settings?.culinary_experience_require_interactive ?? true,
  requireExperiencePromotion: settings?.culinary_experience_require_promotion ?? true,
  minExperienceFeatures: safeNumber(settings?.culinary_experience_min_features, 6),
  minCookingClassMarginPct: safeNumber(settings?.culinary_experience_min_cooking_margin, 80),
  minChefTablePremiumPct: safeNumber(settings?.culinary_experience_min_chef_table_premium, 200),
  minTastingMenuTicketLiftPct: safeNumber(settings?.culinary_experience_min_tasting_lift, 150),
  minWinePairingBeverageLiftPct: safeNumber(settings?.culinary_experience_min_wine_lift, 300),
  minWorkshopConversionPct: safeNumber(settings?.culinary_experience_min_workshop_conv, 35),
  minDemoKitchenSatisfactionLiftPct: safeNumber(settings?.culinary_experience_min_demo_lift, 40),
  minInteractiveEngagementLiftPct: safeNumber(settings?.culinary_experience_min_interactive_lift, 50),
  minLoyaltyLiftPct: safeNumber(settings?.culinary_experience_min_loyalty_lift, 15),
  minBrandDifferentiationLiftPct: safeNumber(settings?.culinary_experience_min_brand_lift, 20),
  minNewCustomerAcquisitionLiftPct: safeNumber(settings?.culinary_experience_min_new_cust_lift, 20),
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface CulinaryExperienceData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  has_cooking_classes: boolean;
  has_chef_table: boolean;
  has_tasting_menu: boolean;
  has_wine_pairing_dinners: boolean;
  has_culinary_workshops: boolean;
  has_demonstration_kitchen: boolean;
  has_interactive_dining: boolean;
  has_food_tours: boolean;
  experience_features_count: number;
  cooking_class_events_per_month: number;
  cooking_class_seat_count: number;
  cooking_class_ticket_price: number;
  cooking_class_revenue_monthly: number;
  cooking_class_margin_pct: number;
  cooking_class_waitlist_count: number;
  chef_table_seats: number;
  chef_table_price_per_person: number;
  chef_table_premium_pct: number;
  chef_table_bookings_monthly: number;
  chef_table_revenue_monthly: number;
  tasting_menu_courses: number;
  tasting_menu_price: number;
  tasting_menu_ticket_lift_pct: number;
  tasting_menu_orders_monthly: number;
  tasting_menu_revenue_monthly: number;
  wine_pairing_events_monthly: number;
  wine_pairing_attendance_avg: number;
  wine_pairing_ticket_price: number;
  wine_pairing_beverage_revenue_lift_pct: number;
  wine_pairing_revenue_monthly: number;
  workshop_topics_count: number;
  workshop_attendance_monthly: number;
  workshop_new_customer_pct: number;
  workshop_conversion_to_regular_pct: number;
  workshop_revenue_monthly: number;
  demo_kitchen_seats: number;
  demo_kitchen_events_monthly: number;
  demo_kitchen_satisfaction_lift_pct: number;
  demo_kitchen_instagram_lift_pct: number;
  demo_kitchen_revenue_monthly: number;
  interactive_dining_options: number;
  interactive_engagement_lift_pct: number;
  interactive_dining_revenue_lift_pct: number;
  experiences_promoted: boolean;
  experiences_marketing_channels: number;
  experience_enrollment_rate_pct: number;
  experience_waitlist_total: number;
  customer_loyalty_score: number;
  customer_loyalty_baseline: number;
  customer_loyalty_lift_pct: number;
  brand_differentiation_score: number;
  brand_differentiation_baseline: number;
  brand_differentiation_lift_pct: number;
  customer_satisfaction_score: number;
  customer_satisfaction_baseline: number;
  customer_satisfaction_lift_pct: number;
  instagram_engagement_lift_pct: number;
  marketing_reach_lift_pct: number;
  new_customer_acquisition_monthly: number;
  repeat_visit_lift_pct: number;
  competitors_with_experiences_pct: number;
  experience_aware_lost_customers: number;
  monthly_revenue: number;
  experience_program_setup_cost: number;
  experience_program_monthly_cost: number;
  experience_marketing_monthly_cost: number;
  experience_program_total_monthly_cost: number;
}

const MOCK_DATA: CulinaryExperienceData[] = [
  {
    location_id: 'dining_room', restaurant_tier: 'casual_dining', market_setting: 'urban',
    has_cooking_classes: false, has_chef_table: false, has_tasting_menu: false,
    has_wine_pairing_dinners: false, has_culinary_workshops: false,
    has_demonstration_kitchen: false, has_interactive_dining: false, has_food_tours: false,
    experience_features_count: 0,
    cooking_class_events_per_month: 0, cooking_class_seat_count: 0, cooking_class_ticket_price: 0,
    cooking_class_revenue_monthly: 0, cooking_class_margin_pct: 0, cooking_class_waitlist_count: 0,
    chef_table_seats: 0, chef_table_price_per_person: 0, chef_table_premium_pct: 0,
    chef_table_bookings_monthly: 0, chef_table_revenue_monthly: 0,
    tasting_menu_courses: 0, tasting_menu_price: 0, tasting_menu_ticket_lift_pct: 0,
    tasting_menu_orders_monthly: 0, tasting_menu_revenue_monthly: 0,
    wine_pairing_events_monthly: 0, wine_pairing_attendance_avg: 0, wine_pairing_ticket_price: 0,
    wine_pairing_beverage_revenue_lift_pct: 0, wine_pairing_revenue_monthly: 0,
    workshop_topics_count: 0, workshop_attendance_monthly: 0, workshop_new_customer_pct: 0,
    workshop_conversion_to_regular_pct: 0, workshop_revenue_monthly: 0,
    demo_kitchen_seats: 0, demo_kitchen_events_monthly: 0, demo_kitchen_satisfaction_lift_pct: 0,
    demo_kitchen_instagram_lift_pct: 0, demo_kitchen_revenue_monthly: 0,
    interactive_dining_options: 0, interactive_engagement_lift_pct: 0, interactive_dining_revenue_lift_pct: 0,
    experiences_promoted: false, experiences_marketing_channels: 0,
    experience_enrollment_rate_pct: 0, experience_waitlist_total: 0,
    customer_loyalty_score: 54, customer_loyalty_baseline: 54, customer_loyalty_lift_pct: 0,
    brand_differentiation_score: 38, brand_differentiation_baseline: 38, brand_differentiation_lift_pct: 0,
    customer_satisfaction_score: 71, customer_satisfaction_baseline: 71, customer_satisfaction_lift_pct: 0,
    instagram_engagement_lift_pct: 0, marketing_reach_lift_pct: 0,
    new_customer_acquisition_monthly: 12, repeat_visit_lift_pct: 0,
    competitors_with_experiences_pct: 65, experience_aware_lost_customers: 180,
    monthly_revenue: 118000, experience_program_setup_cost: 0,
    experience_program_monthly_cost: 0, experience_marketing_monthly_cost: 0,
    experience_program_total_monthly_cost: 0,
  },
  {
    location_id: 'private_room', restaurant_tier: 'fine_dining', market_setting: 'urban',
    has_cooking_classes: true, has_chef_table: false, has_tasting_menu: false,
    has_wine_pairing_dinners: true, has_culinary_workshops: false,
    has_demonstration_kitchen: false, has_interactive_dining: false, has_food_tours: false,
    experience_features_count: 2,
    cooking_class_events_per_month: 2, cooking_class_seat_count: 12, cooking_class_ticket_price: 145,
    cooking_class_revenue_monthly: 3480, cooking_class_margin_pct: 82, cooking_class_waitlist_count: 24,
    chef_table_seats: 0, chef_table_price_per_person: 0, chef_table_premium_pct: 0,
    chef_table_bookings_monthly: 0, chef_table_revenue_monthly: 0,
    tasting_menu_courses: 0, tasting_menu_price: 0, tasting_menu_ticket_lift_pct: 0,
    tasting_menu_orders_monthly: 0, tasting_menu_revenue_monthly: 0,
    wine_pairing_events_monthly: 1, wine_pairing_attendance_avg: 18, wine_pairing_ticket_price: 195,
    wine_pairing_beverage_revenue_lift_pct: 320, wine_pairing_revenue_monthly: 3510,
    workshop_topics_count: 0, workshop_attendance_monthly: 0, workshop_new_customer_pct: 0,
    workshop_conversion_to_regular_pct: 0, workshop_revenue_monthly: 0,
    demo_kitchen_seats: 0, demo_kitchen_events_monthly: 0, demo_kitchen_satisfaction_lift_pct: 0,
    demo_kitchen_instagram_lift_pct: 0, demo_kitchen_revenue_monthly: 0,
    interactive_dining_options: 0, interactive_engagement_lift_pct: 0, interactive_dining_revenue_lift_pct: 0,
    experiences_promoted: true, experiences_marketing_channels: 2,
    experience_enrollment_rate_pct: 58, experience_waitlist_total: 24,
    customer_loyalty_score: 74, customer_loyalty_baseline: 60, customer_loyalty_lift_pct: 23,
    brand_differentiation_score: 62, brand_differentiation_baseline: 45, brand_differentiation_lift_pct: 38,
    customer_satisfaction_score: 84, customer_satisfaction_baseline: 76, customer_satisfaction_lift_pct: 11,
    instagram_engagement_lift_pct: 18, marketing_reach_lift_pct: 22,
    new_customer_acquisition_monthly: 28, repeat_visit_lift_pct: 14,
    competitors_with_experiences_pct: 80, experience_aware_lost_customers: 60,
    monthly_revenue: 215000, experience_program_setup_cost: 18000,
    experience_program_monthly_cost: 850, experience_marketing_monthly_cost: 450,
    experience_program_total_monthly_cost: 1300,
  },
  {
    location_id: 'kitchen_studio', restaurant_tier: 'fast_casual', market_setting: 'suburban',
    has_cooking_classes: true, has_chef_table: false, has_tasting_menu: false,
    has_wine_pairing_dinners: false, has_culinary_workshops: true,
    has_demonstration_kitchen: true, has_interactive_dining: true, has_food_tours: false,
    experience_features_count: 4,
    cooking_class_events_per_month: 4, cooking_class_seat_count: 16, cooking_class_ticket_price: 95,
    cooking_class_revenue_monthly: 6080, cooking_class_margin_pct: 86, cooking_class_waitlist_count: 38,
    chef_table_seats: 0, chef_table_price_per_person: 0, chef_table_premium_pct: 0,
    chef_table_bookings_monthly: 0, chef_table_revenue_monthly: 0,
    tasting_menu_courses: 0, tasting_menu_price: 0, tasting_menu_ticket_lift_pct: 0,
    tasting_menu_orders_monthly: 0, tasting_menu_revenue_monthly: 0,
    wine_pairing_events_monthly: 0, wine_pairing_attendance_avg: 0, wine_pairing_ticket_price: 0,
    wine_pairing_beverage_revenue_lift_pct: 0, wine_pairing_revenue_monthly: 0,
    workshop_topics_count: 5, workshop_attendance_monthly: 64, workshop_new_customer_pct: 62,
    workshop_conversion_to_regular_pct: 38, workshop_revenue_monthly: 4480,
    demo_kitchen_seats: 24, demo_kitchen_events_monthly: 6, demo_kitchen_satisfaction_lift_pct: 42,
    demo_kitchen_instagram_lift_pct: 31, demo_kitchen_revenue_monthly: 5760,
    interactive_dining_options: 3, interactive_engagement_lift_pct: 54, interactive_dining_revenue_lift_pct: 18,
    experiences_promoted: false, experiences_marketing_channels: 1,
    experience_enrollment_rate_pct: 41, experience_waitlist_total: 38,
    customer_loyalty_score: 78, customer_loyalty_baseline: 58, customer_loyalty_lift_pct: 35,
    brand_differentiation_score: 68, brand_differentiation_baseline: 42, brand_differentiation_lift_pct: 62,
    customer_satisfaction_score: 88, customer_satisfaction_baseline: 74, customer_satisfaction_lift_pct: 19,
    instagram_engagement_lift_pct: 31, marketing_reach_lift_pct: 28,
    new_customer_acquisition_monthly: 44, repeat_visit_lift_pct: 21,
    competitors_with_experiences_pct: 45, experience_aware_lost_customers: 25,
    monthly_revenue: 162000, experience_program_setup_cost: 32000,
    experience_program_monthly_cost: 1200, experience_marketing_monthly_cost: 0,
    experience_program_total_monthly_cost: 1200,
  },
  {
    location_id: 'chef_table', restaurant_tier: 'fine_dining', market_setting: 'urban',
    has_cooking_classes: true, has_chef_table: true, has_tasting_menu: true,
    has_wine_pairing_dinners: true, has_culinary_workshops: true,
    has_demonstration_kitchen: true, has_interactive_dining: true, has_food_tours: true,
    experience_features_count: 8,
    cooking_class_events_per_month: 6, cooking_class_seat_count: 14, cooking_class_ticket_price: 195,
    cooking_class_revenue_monthly: 16380, cooking_class_margin_pct: 88, cooking_class_waitlist_count: 52,
    chef_table_seats: 8, chef_table_price_per_person: 285, chef_table_premium_pct: 245,
    chef_table_bookings_monthly: 18, chef_table_revenue_monthly: 41040,
    tasting_menu_courses: 9, tasting_menu_price: 225, tasting_menu_ticket_lift_pct: 215,
    tasting_menu_orders_monthly: 96, tasting_menu_revenue_monthly: 21600,
    wine_pairing_events_monthly: 4, wine_pairing_attendance_avg: 22, wine_pairing_ticket_price: 275,
    wine_pairing_beverage_revenue_lift_pct: 380, wine_pairing_revenue_monthly: 24200,
    workshop_topics_count: 8, workshop_attendance_monthly: 120, workshop_new_customer_pct: 55,
    workshop_conversion_to_regular_pct: 42, workshop_revenue_monthly: 8400,
    demo_kitchen_seats: 30, demo_kitchen_events_monthly: 10, demo_kitchen_satisfaction_lift_pct: 46,
    demo_kitchen_instagram_lift_pct: 34, demo_kitchen_revenue_monthly: 9600,
    interactive_dining_options: 6, interactive_engagement_lift_pct: 58, interactive_dining_revenue_lift_pct: 22,
    experiences_promoted: true, experiences_marketing_channels: 5,
    experience_enrollment_rate_pct: 86, experience_waitlist_total: 12,
    customer_loyalty_score: 94, customer_loyalty_baseline: 62, customer_loyalty_lift_pct: 52,
    brand_differentiation_score: 92, brand_differentiation_baseline: 48, brand_differentiation_lift_pct: 92,
    customer_satisfaction_score: 96, customer_satisfaction_baseline: 78, customer_satisfaction_lift_pct: 23,
    instagram_engagement_lift_pct: 34, marketing_reach_lift_pct: 48,
    new_customer_acquisition_monthly: 78, repeat_visit_lift_pct: 34,
    competitors_with_experiences_pct: 70, experience_aware_lost_customers: 8,
    monthly_revenue: 312000, experience_program_setup_cost: 65000,
    experience_program_monthly_cost: 2200, experience_marketing_monthly_cost: 1200,
    experience_program_total_monthly_cost: 3400,
  },
];

export const runCulinaryExperienceEngine = async (
  db: ReturnType<typeof useDB>,
  config: CulinaryExperienceConfig,
): Promise<{ alerts: CulinaryExperienceAlert[]; generated: number }> => {
  const alerts: CulinaryExperienceAlert[] = [];
  const now = new Date();

  let data: CulinaryExperienceData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting,
              has_cooking_classes, has_chef_table, has_tasting_menu,
              has_wine_pairing_dinners, has_culinary_workshops,
              has_demonstration_kitchen, has_interactive_dining, has_food_tours,
              experience_features_count,
              cooking_class_events_per_month, cooking_class_seat_count, cooking_class_ticket_price,
              cooking_class_revenue_monthly, cooking_class_margin_pct, cooking_class_waitlist_count,
              chef_table_seats, chef_table_price_per_person, chef_table_premium_pct,
              chef_table_bookings_monthly, chef_table_revenue_monthly,
              tasting_menu_courses, tasting_menu_price, tasting_menu_ticket_lift_pct,
              tasting_menu_orders_monthly, tasting_menu_revenue_monthly,
              wine_pairing_events_monthly, wine_pairing_attendance_avg, wine_pairing_ticket_price,
              wine_pairing_beverage_revenue_lift_pct, wine_pairing_revenue_monthly,
              workshop_topics_count, workshop_attendance_monthly, workshop_new_customer_pct,
              workshop_conversion_to_regular_pct, workshop_revenue_monthly,
              demo_kitchen_seats, demo_kitchen_events_monthly, demo_kitchen_satisfaction_lift_pct,
              demo_kitchen_instagram_lift_pct, demo_kitchen_revenue_monthly,
              interactive_dining_options, interactive_engagement_lift_pct, interactive_dining_revenue_lift_pct,
              experiences_promoted, experiences_marketing_channels,
              experience_enrollment_rate_pct, experience_waitlist_total,
              customer_loyalty_score, customer_loyalty_baseline, customer_loyalty_lift_pct,
              brand_differentiation_score, brand_differentiation_baseline, brand_differentiation_lift_pct,
              customer_satisfaction_score, customer_satisfaction_baseline, customer_satisfaction_lift_pct,
              instagram_engagement_lift_pct, marketing_reach_lift_pct,
              new_customer_acquisition_monthly, repeat_visit_lift_pct,
              competitors_with_experiences_pct, experience_aware_lost_customers,
              monthly_revenue, experience_program_setup_cost, experience_program_monthly_cost,
              experience_marketing_monthly_cost, experience_program_total_monthly_cost
       FROM culinary_experience_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): CulinaryExperienceData => ({
      location_id: String(r.location_id ?? 'dining_room'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      has_cooking_classes: Boolean(r.has_cooking_classes ?? false),
      has_chef_table: Boolean(r.has_chef_table ?? false),
      has_tasting_menu: Boolean(r.has_tasting_menu ?? false),
      has_wine_pairing_dinners: Boolean(r.has_wine_pairing_dinners ?? false),
      has_culinary_workshops: Boolean(r.has_culinary_workshops ?? false),
      has_demonstration_kitchen: Boolean(r.has_demonstration_kitchen ?? false),
      has_interactive_dining: Boolean(r.has_interactive_dining ?? false),
      has_food_tours: Boolean(r.has_food_tours ?? false),
      experience_features_count: safeNumber(r.experience_features_count, 0),
      cooking_class_events_per_month: safeNumber(r.cooking_class_events_per_month, 0),
      cooking_class_seat_count: safeNumber(r.cooking_class_seat_count, 0),
      cooking_class_ticket_price: safeNumber(r.cooking_class_ticket_price, 0),
      cooking_class_revenue_monthly: safeNumber(r.cooking_class_revenue_monthly, 0),
      cooking_class_margin_pct: safeNumber(r.cooking_class_margin_pct, 0),
      cooking_class_waitlist_count: safeNumber(r.cooking_class_waitlist_count, 0),
      chef_table_seats: safeNumber(r.chef_table_seats, 0),
      chef_table_price_per_person: safeNumber(r.chef_table_price_per_person, 0),
      chef_table_premium_pct: safeNumber(r.chef_table_premium_pct, 0),
      chef_table_bookings_monthly: safeNumber(r.chef_table_bookings_monthly, 0),
      chef_table_revenue_monthly: safeNumber(r.chef_table_revenue_monthly, 0),
      tasting_menu_courses: safeNumber(r.tasting_menu_courses, 0),
      tasting_menu_price: safeNumber(r.tasting_menu_price, 0),
      tasting_menu_ticket_lift_pct: safeNumber(r.tasting_menu_ticket_lift_pct, 0),
      tasting_menu_orders_monthly: safeNumber(r.tasting_menu_orders_monthly, 0),
      tasting_menu_revenue_monthly: safeNumber(r.tasting_menu_revenue_monthly, 0),
      wine_pairing_events_monthly: safeNumber(r.wine_pairing_events_monthly, 0),
      wine_pairing_attendance_avg: safeNumber(r.wine_pairing_attendance_avg, 0),
      wine_pairing_ticket_price: safeNumber(r.wine_pairing_ticket_price, 0),
      wine_pairing_beverage_revenue_lift_pct: safeNumber(r.wine_pairing_beverage_revenue_lift_pct, 0),
      wine_pairing_revenue_monthly: safeNumber(r.wine_pairing_revenue_monthly, 0),
      workshop_topics_count: safeNumber(r.workshop_topics_count, 0),
      workshop_attendance_monthly: safeNumber(r.workshop_attendance_monthly, 0),
      workshop_new_customer_pct: safeNumber(r.workshop_new_customer_pct, 0),
      workshop_conversion_to_regular_pct: safeNumber(r.workshop_conversion_to_regular_pct, 0),
      workshop_revenue_monthly: safeNumber(r.workshop_revenue_monthly, 0),
      demo_kitchen_seats: safeNumber(r.demo_kitchen_seats, 0),
      demo_kitchen_events_monthly: safeNumber(r.demo_kitchen_events_monthly, 0),
      demo_kitchen_satisfaction_lift_pct: safeNumber(r.demo_kitchen_satisfaction_lift_pct, 0),
      demo_kitchen_instagram_lift_pct: safeNumber(r.demo_kitchen_instagram_lift_pct, 0),
      demo_kitchen_revenue_monthly: safeNumber(r.demo_kitchen_revenue_monthly, 0),
      interactive_dining_options: safeNumber(r.interactive_dining_options, 0),
      interactive_engagement_lift_pct: safeNumber(r.interactive_engagement_lift_pct, 0),
      interactive_dining_revenue_lift_pct: safeNumber(r.interactive_dining_revenue_lift_pct, 0),
      experiences_promoted: Boolean(r.experiences_promoted ?? false),
      experiences_marketing_channels: safeNumber(r.experiences_marketing_channels, 0),
      experience_enrollment_rate_pct: safeNumber(r.experience_enrollment_rate_pct, 0),
      experience_waitlist_total: safeNumber(r.experience_waitlist_total, 0),
      customer_loyalty_score: safeNumber(r.customer_loyalty_score, 0),
      customer_loyalty_baseline: safeNumber(r.customer_loyalty_baseline, 0),
      customer_loyalty_lift_pct: safeNumber(r.customer_loyalty_lift_pct, 0),
      brand_differentiation_score: safeNumber(r.brand_differentiation_score, 0),
      brand_differentiation_baseline: safeNumber(r.brand_differentiation_baseline, 0),
      brand_differentiation_lift_pct: safeNumber(r.brand_differentiation_lift_pct, 0),
      customer_satisfaction_score: safeNumber(r.customer_satisfaction_score, 0),
      customer_satisfaction_baseline: safeNumber(r.customer_satisfaction_baseline, 0),
      customer_satisfaction_lift_pct: safeNumber(r.customer_satisfaction_lift_pct, 0),
      instagram_engagement_lift_pct: safeNumber(r.instagram_engagement_lift_pct, 0),
      marketing_reach_lift_pct: safeNumber(r.marketing_reach_lift_pct, 0),
      new_customer_acquisition_monthly: safeNumber(r.new_customer_acquisition_monthly, 0),
      repeat_visit_lift_pct: safeNumber(r.repeat_visit_lift_pct, 0),
      competitors_with_experiences_pct: safeNumber(r.competitors_with_experiences_pct, 0),
      experience_aware_lost_customers: safeNumber(r.experience_aware_lost_customers, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      experience_program_setup_cost: safeNumber(r.experience_program_setup_cost, 0),
      experience_program_monthly_cost: safeNumber(r.experience_program_monthly_cost, 0),
      experience_marketing_monthly_cost: safeNumber(r.experience_marketing_monthly_cost, 0),
      experience_program_total_monthly_cost: safeNumber(r.experience_program_total_monthly_cost, 0),
    }));
  } catch { data = []; }
  if (data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const baselineSpend = 32.00;
    const monthlyOrders = Math.round(baselineRevenue / baselineSpend);
    const targetLoyaltyLiftPct = 28; // culinary experiences drive 28% loyalty lift (NRA)
    const targetBrandDifferentiationLiftPct = 45; // chef table + tasting menu 45% brand lift
    const targetSatisfactionLiftPct = 22; // demo kitchen + interactive 22% satisfaction lift
    const targetInstagramLiftPct = 32; // demo kitchen 30%+ Instagram content lift
    const targetMarketingReachLiftPct = 35; // experiences 35% marketing reach lift
    const targetNewCustomerAcquisitionLiftPct = 35; // workshops 35% new-to-regular conversion
    const targetRepeatVisitLiftPct = 24; // cooking class attendees 24% repeat visit lift
    const avgCookingClassRevenuePerEvent = 3200; // midpoint of $1,500-5,000 cooking class revenue
    const avgChefTablePremiumPct = 250; // midpoint of 200-300% chef table premium
    const avgTastingMenuTicketLiftPct = 200; // midpoint of 150-250% tasting menu lift
    const avgWinePairingBeverageLiftPct = 350; // midpoint of 300-400% wine pairing lift

    // Rule 1: COOKING_CLASS_PROGRAM_ABSENT
    if (config.requireCookingClasses && !d.has_cooking_classes) {
      // No cooking classes -> missed $1,500-5,000/event at 80%+ margins
      const expectedEventsPerMonth = 4; // 4 classes per month target
      const expectedRevenuePerEvent = avgCookingClassRevenuePerEvent;
      const expectedMarginPct = 82; // 80%+ margin target
      const monthlyClassRevenue = expectedEventsPerMonth * expectedRevenuePerEvent;
      const monthlyClassProfit = Math.round(monthlyClassRevenue * (expectedMarginPct / 100));
      const loyaltyLiftRevenue = Math.round(baselineRevenue * 0.24 * 0.15);
      const newCustomerRevenue = Math.round(expectedEventsPerMonth * 12 * baselineSpend * 0.35);
      const lostCustomerRevenue = Math.round(d.experience_aware_lost_customers * baselineSpend * 0.4);
      const totalOpportunity = Math.max(monthlyClassProfit + loyaltyLiftRevenue + newCustomerRevenue + lostCustomerRevenue, 1800);
      const criticalNote = (d.restaurant_tier === 'fine_dining')
        ? 'CRITICAL: COOKING CLASSES ABSENT — fine dining restaurant with no chef-led cooking classes. 55% of fine dining customers would attend a cooking class at their favorite restaurant (NRA). Cooking classes generate $1,500-5,000 per event at 80%+ profit margins (Culinary Institute of America). '
        : 'HIGH: no cooking class program — missed experiential revenue. ';
      alerts.push({
        rule_id: 'cooking_class_program_absent',
        severity: d.restaurant_tier === 'fine_dining' ? 'critical' : 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_cooking_classes: d.has_cooking_classes,
        experience_features_count: d.experience_features_count,
        cooking_class_events_per_month: d.cooking_class_events_per_month,
        cooking_class_seat_count: d.cooking_class_seat_count,
        cooking_class_ticket_price: d.cooking_class_ticket_price,
        cooking_class_revenue_monthly: d.cooking_class_revenue_monthly,
        cooking_class_margin_pct: d.cooking_class_margin_pct,
        cooking_class_waitlist_count: d.cooking_class_waitlist_count,
        customer_loyalty_score: d.customer_loyalty_score,
        customer_loyalty_baseline: d.customer_loyalty_baseline,
        brand_differentiation_score: d.brand_differentiation_score,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        experience_aware_lost_customers: d.experience_aware_lost_customers,
        monthly_revenue: d.monthly_revenue,
        experience_program_setup_cost: d.experience_program_setup_cost,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        customer_loyalty_lift_projected_pct: targetLoyaltyLiftPct,
        new_customer_acquisition_projected_pct: targetNewCustomerAcquisitionLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `COOKING CLASS PROGRAM ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has no chef-led cooking class program. ${criticalNote}Cooking classes are the #1 restaurant-based experiential dining trend (National Restaurant Association 2024). Industry data: cooking classes generate $1,500-5,000 per event with 80%+ profit margins (Culinary Institute of America); 55% of fine dining customers would attend a cooking class at their favorite restaurant (NRA); cooking class attendees are 2.4x more likely to return as regular diners; cooking classes are the highest-margin revenue stream in restaurants (above catering, merch, delivery); cooking classes build chef personal brand (social media following); cooking classes generate Instagram content (3-5 posts per class); cooking classes generate email list growth (attendee opt-in 90%+); cooking classes attract corporate team-building bookings ($3,000-8,000/event); cooking classes attract date-night couples (premium positioning); cooking classes attract food tourists (destination dining); cooking classes should be 90-120 minutes long; cooking classes should cap at 12-16 students for hands-on instruction; cooking classes should charge $95-195 per seat; cooking classes should run weekly or bi-weekly; cooking classes should be themed (pasta, sushi, BBQ, pastry); cooking classes should include take-home recipe cards; cooking classes should be bookable via website + OpenTable + Eventbrite; cooking classes should have waitlist management (high demand); cooking classes should be photographed for marketing; cooking classes should offer gift certificates ($95-195 holiday gifts); cooking classes should partner with local wineries + breweries (collab events); cooking classes should be taught by head chef or sous chef (brand building); cooking classes should include ingredient sourcing story (farm-to-table); cooking classes should have apron + hat merchandise bundle ($35-65 upsell). Solutions ranked by impact: (1) LAUNCH monthly cooking class program (4 classes/mo) — revenue ${fmt$(monthlyClassRevenue)}/mo at 82% margin = ${fmt$(monthlyClassProfit)}/mo profit; cost ${fmt$(d.experience_program_setup_cost)} one-time kitchen studio setup; payback 3-6 months; (2) THEME classes by cuisine (pasta, sushi, BBQ, pastry, regional) — variety; (3) CAP at 12-16 seats for hands-on instruction — quality; (4) CHARGE $95-195 per seat — premium positioning; (5) BUILD waitlist management (high demand signals) — scarcity; (6) BOOK via website + OpenTable + Eventbrite — discoverability; (7) PARTNER with local wineries + breweries for collab events — cross-promotion; (8) TEACH by head chef or sous chef — brand building; (9) OFFER corporate team-building packages ($3,000-8,000/event) — B2B revenue; (10) OFFER gift certificates ($95-195 holiday gifts) — holiday revenue; (11) INCLUDE take-home recipe cards — value; (12) PHOTOGRAPH every class for Instagram — content; (13) BUILD email list from attendee opt-in (90%+ opt-in) — owned audience; (14) OFFER apron + hat merchandise bundle ($35-65 upsell) — merchandise revenue; (15) SCHEDULE classes weekly or bi-weekly — consistency. Industry data: $1,500-5,000/event cooking class revenue (CIA); 80%+ profit margin (CIA); 55% of fine diners would attend (NRA); 2.4x return rate for cooking class attendees; 90%+ email opt-in from attendees; $3,000-8,000 corporate team-building events; $95-195 per seat pricing; 12-16 seat sweet spot; payback 3-6 months. Expected impact: +${targetLoyaltyLiftPct}% customer loyalty, +${targetNewCustomerAcquisitionLiftPct}% new customer acquisition, +${fmt$(monthlyClassProfit)}/mo class profit, +${fmt$(loyaltyLiftRevenue)}/mo loyalty-driven revenue, +${fmt$(newCustomerRevenue)}/mo new-customer revenue, +${fmt$(lostCustomerRevenue)}/mo recovered lost customers, payback 3-6 months.`,
        ai_recommendation: 'launch_cooking_class_program',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: CHEF_TABLE_EXPERIENCE_ABSENT
    if (config.requireChefTable && !d.has_chef_table) {
      // No chef table -> missed 200-300% premium pricing
      const expectedSeats = 8;
      const expectedPrice = 285;
      const expectedBookings = 18;
      const expectedPremiumPct = avgChefTablePremiumPct;
      const expectedMonthlyRevenue = expectedSeats * expectedPrice * expectedBookings;
      const brandLiftRevenue = Math.round(baselineRevenue * 0.12 * 0.18);
      const lostCustomerRevenue = Math.round(d.experience_aware_lost_customers * baselineSpend * 0.3);
      const totalOpportunity = Math.max(Math.round(expectedMonthlyRevenue * 0.4) + brandLiftRevenue + lostCustomerRevenue, 2400);
      const criticalNote = (d.restaurant_tier === 'fine_dining')
        ? 'CRITICAL: CHEF TABLE ABSENT — fine dining restaurant without chef table experience. Chef tables command 200-300% premium over regular dining (OpenTable). Chef table is the #1 fine dining differentiation experience. '
        : 'HIGH: no chef table — missed premium dining revenue. ';
      alerts.push({
        rule_id: 'chef_table_experience_absent',
        severity: d.restaurant_tier === 'fine_dining' ? 'critical' : 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_chef_table: d.has_chef_table,
        experience_features_count: d.experience_features_count,
        chef_table_seats: d.chef_table_seats,
        chef_table_price_per_person: d.chef_table_price_per_person,
        chef_table_premium_pct: d.chef_table_premium_pct,
        chef_table_bookings_monthly: d.chef_table_bookings_monthly,
        chef_table_revenue_monthly: d.chef_table_revenue_monthly,
        brand_differentiation_score: d.brand_differentiation_score,
        brand_differentiation_baseline: d.brand_differentiation_baseline,
        customer_loyalty_score: d.customer_loyalty_score,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        experience_aware_lost_customers: d.experience_aware_lost_customers,
        monthly_revenue: d.monthly_revenue,
        experience_program_setup_cost: d.experience_program_setup_cost,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        brand_differentiation_lift_projected_pct: targetBrandDifferentiationLiftPct,
        customer_loyalty_lift_projected_pct: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CHEF TABLE EXPERIENCE ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has no chef table experience. ${criticalNote}Chef table experiences command 200-300% premium over regular dining (OpenTable). Industry data: chef tables command 200-300% premium pricing (OpenTable); chef table is the #1 fine dining differentiation experience; chef table seats 6-10 guests in or adjacent to kitchen; chef table includes personalized menu by head chef; chef table includes interaction with chef during meal; chef table includes kitchen tour + ingredient presentation; chef table bookings average 18-25 per month (high-demand restaurants); chef table is the highest per-seat revenue in restaurant; chef table builds chef personal brand (media + social); chef table generates PR + media coverage (food critics); chef table attracts special occasions (anniversaries, proposals, birthdays); chef table attracts corporate VIPs + clients; chef table attracts food tourists (destination dining); chef table should be bookable via OpenTable + Tock + Resy; chef table should require prepayment (high-value booking); chef table should have 7-14 day advance booking; chef table should have cancelation policy (72-hour); chef table should include wine pairing option (additional $95-195/person); chef table should include signed menu keepsake; chef table should be photographed for marketing; chef table should have minimum spend ($1,500-3,500); chef table should have dedicated server + sommelier; chef table should have custom plating (different from regular menu); chef table should have interactive element (chef finishes dish tableside); chef table should be available for private buyout ($8,000-25,000); chef table should be marketed as "exclusive" + "limited availability". Solutions ranked by impact: (1) BUILD chef table experience (8 seats, $285/person, 18 bookings/mo) — revenue ${fmt$(expectedMonthlyRevenue)}/mo at 60% margin; cost ${fmt$(d.experience_program_setup_cost + 12000)} one-time build-out; payback 4-8 months; (2) PERSONALIZE menu by head chef — differentiation; (3) INCLUDE interaction with chef during meal — experience; (4) OFFER kitchen tour + ingredient presentation — value; (5) BOOK via OpenTable + Tock + Resy — discoverability; (6) REQUIRE prepayment + cancelation policy — protection; (7) SCHEDULE 7-14 day advance booking — exclusivity; (8) OFFER wine pairing option ($95-195/person additional) — beverage revenue; (9) INCLUDE signed menu keepsake — memorable; (10) PHOTOGRAPH for marketing — content; (11) SET minimum spend ($1,500-3,500) — profitability; (12) ASSIGN dedicated server + sommelier — service quality; (13) OFFER custom plating (different from regular menu) — exclusivity; (14) ADD interactive element (chef finishes dish tableside) — theater; (15) OFFER private buyout ($8,000-25,000) — B2B + special events. Industry data: 200-300% premium (OpenTable); 6-10 seat capacity; 18-25 bookings/mo; $285+/person pricing; $1,500-3,500 minimum spend; 60% profit margin; $8,000-25,000 private buyout; payback 4-8 months. Expected impact: +${targetBrandDifferentiationLiftPct}% brand differentiation, +18% customer loyalty, +${fmt$(Math.round(expectedMonthlyRevenue * 0.4))}/mo chef table revenue, +${fmt$(brandLiftRevenue)}/mo brand-driven revenue, +${fmt$(lostCustomerRevenue)}/mo recovered lost customers, payback 4-8 months.`,
        ai_recommendation: 'build_chef_table_experience',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: TASTING_MENU_ABSENT
    if (config.requireTastingMenu && d.restaurant_tier === 'fine_dining' && !d.has_tasting_menu) {
      // No tasting menu in fine dining -> missed 150-250% ticket increase
      const expectedCourses = 9;
      const expectedPrice = 225;
      const expectedOrdersMonthly = 96;
      const expectedTicketLiftPct = avgTastingMenuTicketLiftPct;
      const expectedMonthlyRevenue = expectedPrice * expectedOrdersMonthly;
      const loyaltyLiftRevenue = Math.round(baselineRevenue * 0.18 * 0.15);
      const totalOpportunity = Math.max(Math.round(expectedMonthlyRevenue * 0.45) + loyaltyLiftRevenue, 2000);
      alerts.push({
        rule_id: 'tasting_menu_absent',
        severity: 'critical',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_tasting_menu: d.has_tasting_menu,
        experience_features_count: d.experience_features_count,
        tasting_menu_courses: d.tasting_menu_courses,
        tasting_menu_price: d.tasting_menu_price,
        tasting_menu_ticket_lift_pct: d.tasting_menu_ticket_lift_pct,
        tasting_menu_orders_monthly: d.tasting_menu_orders_monthly,
        tasting_menu_revenue_monthly: d.tasting_menu_revenue_monthly,
        brand_differentiation_score: d.brand_differentiation_score,
        customer_loyalty_score: d.customer_loyalty_score,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        monthly_revenue: d.monthly_revenue,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        brand_differentiation_lift_projected_pct: 32,
        customer_loyalty_lift_projected_pct: 22,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `TASTING MENU ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has no multi-course tasting menu. CRITICAL: TASTING MENU ABSENT — fine dining restaurant without tasting menu. Tasting menus increase average ticket 150-250% and are the #1 fine dining revenue maximizer (Cornell CHR). Industry data: tasting menus increase average ticket 150-250% (Cornell CHR); tasting menus are the #1 fine dining revenue maximizer (Cornell CHR); tasting menus are 7-12 courses; tasting menus price at $185-385 per person; tasting menus drive 96-180 orders per month in fine dining; tasting menus attract food critics + Michelin reviewers; tasting menus attract special occasion diners (anniversaries, birthdays); tasting menus attract food tourists; tasting menus showcase chef creativity (changing weekly or monthly); tasting menus generate Instagram content (every course photographed); tasting menus increase beverage attach rate (wine pairing $95-195 additional); tasting menus have 65-75% profit margin (vs 60% regular menu); tasting menus reduce food waste (precise portioning); tasting menus simplify prep (limited menu = focused kitchen); tasting menus allow premium ingredient use (truffle, caviar, wagyu); tasting menus should be available every night (not just weekends); tasting menus should have vegetarian + vegan versions; tasting menus should change seasonally (4 menus/year); tasting menus should be bookable via OpenTable + Tock; tasting menus should require prepayment; tasting menus should have cancelation policy (48-hour); tasting menus should include menu card keepsake; tasting menus should be paired with wine or non-alcoholic pairing; tasting menus should be photographed for marketing; tasting menus should have minimum 2 guests; tasting menus should allow dietary restrictions (24-hour notice); tasting menus should be the flagship offering (above regular menu); tasting menus should have secret "chefs choice" off-menu courses for VIPs. Solutions ranked by impact: (1) LAUNCH 9-course tasting menu at $225/person — revenue ${fmt$(expectedMonthlyRevenue)}/mo at 70% margin; cost $0 incremental (uses existing kitchen); payback immediate; (2) CHANGE menu seasonally (4 menus/year) — freshness; (3) OFFER vegetarian + vegan versions — inclusivity; (4) PAIR with wine ($95 additional) or non-alcoholic pairing ($45 additional) — beverage attach; (5) BOOK via OpenTable + Tock with prepayment — protection; (6) REQUIRE 48-hour cancelation policy — protection; (7) INCLUDE menu card keepsake — memorable; (8) PHOTOGRAPH every course for Instagram — content; (9) SET minimum 2 guests — profitability; (10) ALLOW dietary restrictions (24-hour notice) — inclusivity; (11) OFFER secret off-menu courses for VIPs — exclusivity; (12) SHOWCASE premium ingredients (truffle, caviar, wagyu) — positioning; (13) REDUCE food waste via precise portioning — efficiency; (14) SIMPLIFY prep with limited menu — focus; (15) HIGHLIGHT tasting menu as flagship offering — differentiation. Industry data: 150-250% ticket increase (Cornell CHR); 7-12 courses; $185-385 pricing; 96-180 orders/mo; 65-75% profit margin; $95-195 wine pairing attach; payback immediate. Expected impact: +${expectedTicketLiftPct}% average ticket, +32% brand differentiation, +22% customer loyalty, +${fmt$(Math.round(expectedMonthlyRevenue * 0.45))}/mo tasting menu profit, +${fmt$(loyaltyLiftRevenue)}/mo loyalty-driven revenue, payback immediate.`,
        ai_recommendation: 'launch_tasting_menu',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: WINE_PAIRING_DINNER_ABSENT
    if (config.requireWinePairingDinners && !d.has_wine_pairing_dinners) {
      // No wine pairing events -> missed 300-400% beverage revenue
      const expectedEventsMonthly = 2;
      const expectedAttendance = 22;
      const expectedTicketPrice = 245;
      const expectedBeverageLiftPct = avgWinePairingBeverageLiftPct;
      const expectedMonthlyRevenue = expectedEventsMonthly * expectedAttendance * expectedTicketPrice;
      const loyaltyLiftRevenue = Math.round(baselineRevenue * 0.12 * 0.15);
      const totalOpportunity = Math.max(Math.round(expectedMonthlyRevenue * 0.5) + loyaltyLiftRevenue, 1600);
      alerts.push({
        rule_id: 'wine_pairing_dinner_absent',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_wine_pairing_dinners: d.has_wine_pairing_dinners,
        experience_features_count: d.experience_features_count,
        wine_pairing_events_monthly: d.wine_pairing_events_monthly,
        wine_pairing_attendance_avg: d.wine_pairing_attendance_avg,
        wine_pairing_ticket_price: d.wine_pairing_ticket_price,
        wine_pairing_beverage_revenue_lift_pct: d.wine_pairing_beverage_revenue_lift_pct,
        wine_pairing_revenue_monthly: d.wine_pairing_revenue_monthly,
        customer_loyalty_score: d.customer_loyalty_score,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        monthly_revenue: d.monthly_revenue,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        customer_loyalty_lift_projected_pct: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `WINE PAIRING DINNER ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has no wine pairing dinner events. HIGH: WINE PAIRING DINNER ABSENT — no wine pairing dinner events. Wine pairing dinners increase beverage revenue 300-400% per event. Industry data: wine pairing dinners increase beverage revenue 300-400% per event; wine pairing dinners are 4-7 courses paired with wines; wine pairing dinners price at $185-385 per person (includes food + wine); wine pairing dinners attract wine enthusiasts (premium demographic); wine pairing dinners attract date-night couples; wine pairing dinners attract special occasions; wine pairing dinners should be hosted monthly or quarterly; wine pairing dinners should be taught by sommelier or wine director; wine pairing dinners should partner with wineries (winemaker dinners); wine pairing dinners should partner with wine distributors (sponsorship revenue); wine pairing dinners should include education (wine region, varietal, vintage); wine pairing dinners should have limited seating (20-40 guests); wine pairing dinners should be bookable via OpenTable + Tock + Eventbrite; wine pairing dinners should require prepayment; wine pairing dinners should have cancelation policy (72-hour); wine pairing dinners should be photographed for marketing; wine pairing dinners should generate email list growth (attendee opt-in 85%+); wine pairing dinners should offer non-alcoholic pairing option ($45-95); wine pairing dinners should offer designated driver discount; wine pairing dinners should partner with ride-share services (Uber + Lyft promo codes); wine pairing dinners should have printed menu with wine notes (keepsake); wine pairing dinners should be themed (Bordeaux, Burgundy, Napa, Tuscany, sparkling); wine pairing dinners should be seasonal (holiday themes, summer whites, winter reds); wine pairing dinners should include library wines (vertical tastings); wine pairing dinners should include rare wines (allocated bottles); wine pairing dinners should have winemaker Q&A session; wine pairing dinners should offer wine club signup (recurring revenue). Solutions ranked by impact: (1) HOST monthly wine pairing dinner (2 events/mo, 22 guests, $245/person) — revenue ${fmt$(expectedMonthlyRevenue)}/mo at 55% margin; cost $0 incremental (uses existing kitchen + wine inventory); payback immediate; (2) PARTNER with wineries for winemaker dinners — credibility; (3) PARTNER with wine distributors for sponsorship — revenue; (4) TEACH by sommelier or wine director — expertise; (5) INCLUDE education (region, varietal, vintage) — value; (6) LIMIT seating to 20-40 guests — exclusivity; (7) BOOK via OpenTable + Tock + Eventbrite — discoverability; (8) REQUIRE prepayment + 72-hour cancelation — protection; (9) OFFER non-alcoholic pairing ($45-95) — inclusivity; (10) PARTNER with Uber + Lyft for ride-share promo codes — responsibility; (11) INCLUDE printed menu with wine notes (keepsake) — memorable; (12) THEME dinners by region (Bordeaux, Burgundy, Napa, Tuscany) — variety; (13) OFFER library wines (vertical tastings) — exclusivity; (14) OFFER rare wines (allocated bottles) — premium; (15) OFFER wine club signup — recurring revenue. Industry data: 300-400% beverage revenue lift per event; $185-385 per person; 4-7 courses; 20-40 guest capacity; 85%+ email opt-in; 55% profit margin; payback immediate. Expected impact: +${expectedBeverageLiftPct}% beverage revenue per event, +18% customer loyalty, +${fmt$(Math.round(expectedMonthlyRevenue * 0.5))}/mo wine pairing profit, +${fmt$(loyaltyLiftRevenue)}/mo loyalty-driven revenue, payback immediate.`,
        ai_recommendation: 'host_wine_pairing_dinners',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: CULINARY_WORKSHOP_ABSENT
    if (config.requireCulinaryWorkshops && !d.has_culinary_workshops) {
      // No workshops -> missed 35% new-to-regular conversion
      const expectedTopics = 5;
      const expectedAttendanceMonthly = 64;
      const expectedNewCustomerPct = 55;
      const expectedConversionPct = 35;
      const expectedNewRegularCustomers = Math.round(expectedAttendanceMonthly * (expectedNewCustomerPct / 100) * (expectedConversionPct / 100));
      const newCustomerRevenue = Math.round(expectedNewRegularCustomers * baselineSpend * 12 * 0.5);
      const loyaltyLiftRevenue = Math.round(baselineRevenue * 0.08 * 0.15);
      const totalOpportunity = Math.max(newCustomerRevenue + loyaltyLiftRevenue, 1200);
      alerts.push({
        rule_id: 'culinary_workshop_absent',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_culinary_workshops: d.has_culinary_workshops,
        experience_features_count: d.experience_features_count,
        workshop_topics_count: d.workshop_topics_count,
        workshop_attendance_monthly: d.workshop_attendance_monthly,
        workshop_new_customer_pct: d.workshop_new_customer_pct,
        workshop_conversion_to_regular_pct: d.workshop_conversion_to_regular_pct,
        workshop_revenue_monthly: d.workshop_revenue_monthly,
        customer_loyalty_score: d.customer_loyalty_score,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        monthly_revenue: d.monthly_revenue,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        new_customer_acquisition_projected_pct: targetNewCustomerAcquisitionLiftPct,
        customer_loyalty_lift_projected_pct: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CULINARY WORKSHOP ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has no culinary workshops. MEDIUM: CULINARY WORKSHOP ABSENT — no skill-building culinary workshops. Culinary workshops attract new customers — 35% become regular diners. Industry data: culinary workshops attract new customers — 35% become regular diners; culinary workshops are skill-building (knife skills, pasta making, sourdough, fermentation); culinary workshops are 2-3 hours long; culinary workshops price at $85-145 per seat; culinary workshops attract 12-20 students per session; culinary workshops attract hobbyists + food enthusiasts; culinary workshops attract couples + friend groups; culinary workshops attract corporate team-building; culinary workshops should be hosted weekly or bi-weekly; culinary workshops should be themed (knife skills, pasta, bread, fermentation, pastry, BBQ, sushi); culinary workshops should be taught by chef or sous chef; culinary workshops should include take-home product (starter, dough, recipe card); culinary workshops should be bookable via website + Eventbrite; culinary workshops should be photographed for Instagram; culinary workshops should generate email list growth (attendee opt-in 85%+); culinary workshops should offer gift certificates; culinary workshops should partner with local culinary schools (instructor exchange); culinary workshops should partner with local farms (farm + workshop combo); culinary workshops should offer beginner + intermediate + advanced levels; culinary workshops should offer youth workshops (kids cooking classes $45-85); culinary workshops should offer couples workshops (date-night $145-195 per couple); culinary workshops should offer corporate workshops (team-building $3,000-8,000/event); culinary workshops should offer private workshops (buyout $1,500-3,500); culinary workshops should have waitlist management; culinary workshops should be marketed via social media + email + website. Solutions ranked by impact: (1) LAUNCH monthly culinary workshop program (5 topics, 64 attendees/mo) — ${expectedNewRegularCustomers} new regular customers/mo = ${fmt$(newCustomerRevenue)}/mo revenue; cost $0 incremental (uses existing kitchen); payback immediate; (2) THEME workshops by skill (knife skills, pasta, bread, fermentation, pastry, BBQ, sushi) — variety; (3) TEACH by chef or sous chef — expertise; (4) INCLUDE take-home product (starter, dough, recipe card) — value; (5) BOOK via website + Eventbrite — discoverability; (6) OFFER beginner + intermediate + advanced levels — progression; (7) OFFER youth workshops (kids $45-85) — family market; (8) OFFER couples workshops (date-night $145-195 per couple) — date-night market; (9) OFFER corporate workshops ($3,000-8,000/event) — B2B; (10) OFFER private workshops (buyout $1,500-3,500) — private events; (11) PARTNER with local culinary schools (instructor exchange) — credibility; (12) PARTNER with local farms (farm + workshop combo) — sourcing story; (13) PHOTOGRAPH every workshop for Instagram — content; (14) BUILD email list from attendee opt-in (85%+) — owned audience; (15) OFFER gift certificates ($85-145 holiday gifts) — holiday revenue. Industry data: 35% new-to-regular conversion; $85-145 per seat; 12-20 students per session; 2-3 hours long; 85%+ email opt-in; $3,000-8,000 corporate events; $1,500-3,500 private buyout; payback immediate. Expected impact: +${targetNewCustomerAcquisitionLiftPct}% new customer acquisition, +12% customer loyalty, +${expectedNewRegularCustomers} new regular customers/mo, +${fmt$(newCustomerRevenue)}/mo new-customer revenue, +${fmt$(loyaltyLiftRevenue)}/mo loyalty-driven revenue, payback immediate.`,
        ai_recommendation: 'add_culinary_workshops',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: DEMONSTRATION_KITCHEN_ABSENT
    if (config.requireDemonstrationKitchen && !d.has_demonstration_kitchen) {
      // No demo kitchen -> missed 40% satisfaction + 30% Instagram
      const expectedSeats = 24;
      const expectedEventsMonthly = 6;
      const expectedSatisfactionLift = 42;
      const expectedInstagramLift = 31;
      const expectedMonthlyRevenue = expectedEventsMonthly * expectedSeats * 145;
      const satisfactionLiftRevenue = Math.round(baselineRevenue * (expectedSatisfactionLift / 100) * 0.1);
      const instagramLiftRevenue = Math.round(baselineRevenue * 0.05 * 0.2);
      const totalOpportunity = Math.max(Math.round(expectedMonthlyRevenue * 0.55) + satisfactionLiftRevenue + instagramLiftRevenue, 2200);
      alerts.push({
        rule_id: 'demonstration_kitchen_absent',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_demonstration_kitchen: d.has_demonstration_kitchen,
        experience_features_count: d.experience_features_count,
        demo_kitchen_seats: d.demo_kitchen_seats,
        demo_kitchen_events_monthly: d.demo_kitchen_events_monthly,
        demo_kitchen_satisfaction_lift_pct: d.demo_kitchen_satisfaction_lift_pct,
        demo_kitchen_instagram_lift_pct: d.demo_kitchen_instagram_lift_pct,
        demo_kitchen_revenue_monthly: d.demo_kitchen_revenue_monthly,
        customer_satisfaction_score: d.customer_satisfaction_score,
        customer_satisfaction_baseline: d.customer_satisfaction_baseline,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        monthly_revenue: d.monthly_revenue,
        experience_program_setup_cost: d.experience_program_setup_cost,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        customer_satisfaction_lift_projected_pct: targetSatisfactionLiftPct,
        instagram_engagement_lift_projected_pct: targetInstagramLiftPct,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `DEMONSTRATION KITCHEN ABSENT: ${d.location_id} — this ${d.restaurant_tier} restaurant has no demonstration kitchen. MEDIUM: DEMONSTRATION KITCHEN ABSENT — no demo kitchen installed. Demonstration kitchens create "dinner theater" — 40% satisfaction boost + 30% more Instagram content. Industry data: demonstration kitchens create "dinner theater" — 40% satisfaction boost + 30% more Instagram content; demonstration kitchens are open kitchen or theater-style seating facing chef; demonstration kitchens seat 20-40 guests; demonstration kitchens host cooking demos, chef tables, private events; demonstration kitchens host 6-12 events per month; demonstration kitchens charge $125-285 per seat; demonstration kitchens attract food enthusiasts + tourists; demonstration kitchens attract corporate events (team-building, client entertainment); demonstration kitchens generate 30%+ more Instagram content than regular dining; demonstration kitchens generate 40% satisfaction boost (NRA dinner theater study); demonstration kitchens build chef personal brand (media + social); demonstration kitchens generate PR + media coverage; demonstration kitchens allow premium ingredient showcase (truffle, caviar, wagyu); demonstration kitchens allow interactive Q&A with chef; demonstration kitchens should have audio system (chef microphone); demonstration kitchens should have video displays (overhead camera + screens); demonstration kitchens should have mirror overhead (so all seats can see); demonstration kitchens should have theater-style seating (tiered); demonstration kitchens should have dedicated lighting; demonstration kitchens should have branded aprons + chef coats; demonstration kitchens should be bookable via OpenTable + Tock; demonstration kitchens should be photographed + video recorded; demonstration kitchens should generate YouTube content (cooking show); demonstration kitchens should generate TikTok content (short-form); demonstration kitchens should partner with food influencers (paid partnerships); demonstration kitchens should offer private buyout ($8,000-25,000); demonstration kitchens should host celebrity chef nights; demonstration kitchens should host product launch events (B2B sponsorship); demonstration kitchens should have wine pairing option. Solutions ranked by impact: (1) INSTALL demonstration kitchen (24 seats, 6 events/mo, $145/person) — revenue ${fmt$(expectedMonthlyRevenue)}/mo at 55% margin; cost $25,000-65,000 one-time build-out (kitchen + audio + video + tiered seating); payback 8-18 months; (2) ADD audio system (chef microphone) — experience quality; (3) ADD video displays (overhead camera + screens) — visibility; (4) ADD mirror overhead (all seats see) — visibility; (5) BUILD tiered theater-style seating — experience; (6) ADD dedicated lighting — production quality; (7) BRAND aprons + chef coats — merchandise; (8) BOOK via OpenTable + Tock — discoverability; (9) PHOTOGRAPH + video record every event — content; (10) GENERATE YouTube content (cooking show) — content marketing; (11) GENERATE TikTok content (short-form) — content marketing; (12) PARTNER with food influencers (paid partnerships) — reach; (13) OFFER private buyout ($8,000-25,000) — B2B; (14) HOST celebrity chef nights — PR; (15) HOST product launch events (B2B sponsorship) — revenue. Industry data: 40% satisfaction boost (NRA); 30%+ more Instagram content; 20-40 seat capacity; 6-12 events/mo; $125-285 per seat; 55% profit margin; $25,000-65,000 build-out cost; $8,000-25,000 private buyout; payback 8-18 months. Expected impact: +${targetSatisfactionLiftPct}% customer satisfaction, +${targetInstagramLiftPct}% Instagram content, +${fmt$(Math.round(expectedMonthlyRevenue * 0.55))}/mo demo kitchen profit, +${fmt$(satisfactionLiftRevenue)}/mo satisfaction-driven revenue, +${fmt$(instagramLiftRevenue)}/mo Instagram-driven revenue, payback 8-18 months.`,
        ai_recommendation: 'install_demonstration_kitchen',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: INTERACTIVE_DINING_MISSING
    if (config.requireInteractiveDining && !d.has_interactive_dining) {
      // No build-your-own or tableside -> missed 50-60% engagement
      const expectedOptions = 4;
      const expectedEngagementLift = 54;
      const expectedRevenueLiftPct = 18;
      const engagementRevenue = Math.round(baselineRevenue * (expectedRevenueLiftPct / 100) * 0.3);
      const loyaltyLiftRevenue = Math.round(baselineRevenue * 0.1 * 0.15);
      const totalOpportunity = Math.max(engagementRevenue + loyaltyLiftRevenue, 1400);
      alerts.push({
        rule_id: 'interactive_dining_missing',
        severity: 'medium',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_interactive_dining: d.has_interactive_dining,
        experience_features_count: d.experience_features_count,
        interactive_dining_options: d.interactive_dining_options,
        interactive_engagement_lift_pct: d.interactive_engagement_lift_pct,
        interactive_dining_revenue_lift_pct: d.interactive_dining_revenue_lift_pct,
        customer_satisfaction_score: d.customer_satisfaction_score,
        customer_loyalty_score: d.customer_loyalty_score,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        monthly_revenue: d.monthly_revenue,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        customer_satisfaction_lift_projected_pct: 14,
        customer_loyalty_lift_projected_pct: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `INTERACTIVE DINING MISSING: ${d.location_id} — this ${d.restaurant_tier} restaurant has no interactive dining (build-your-own or tableside prep). MEDIUM: INTERACTIVE DINING MISSING — no build-your-own or tableside preparation. Interactive dining (build-your-own, tableside prep) increases engagement 50-60%. Industry data: interactive dining (build-your-own, tableside prep) increases engagement 50-60%; interactive dining includes build-your-own (bowls, pizzas, tacos, salads); interactive dining includes tableside prep (guacamole, Caesar salad, steak Diane, bananas Foster); interactive dining includes DIY dessert (sundae bar, smores); interactive dining includes hot pot + fondue; interactive dining includes Korean BBQ (grill at table); interactive dining increases dwell time (15-25 min longer); interactive dining increases average ticket 12-20%; interactive dining increases satisfaction 14-22%; interactive dining generates Instagram content (visual + experiential); interactive dining attracts groups + special occasions; interactive dining attracts date-night couples; interactive dining should have 3-6 options on menu; interactive dining should have dedicated staff training (tableside service); interactive dining should have dedicated equipment (guacamole cart, salad cart, dessert cart); interactive dining should have branded presentation (custom bowls, plates, carts); interactive dining should be priced at premium ($3-8 surcharge for interactive); interactive dining should have photo-worthy presentation; interactive dining should have storytelling (chef finishes dish tableside with narrative); interactive dining should have customer participation (customer assembles own bowl); interactive dining should have sensory elements (smell, sound, sight); interactive dining should be on menu with icon (interactive fork icon); interactive dining should be marketed via social media (videos of tableside prep); interactive dining should be highlighted on menu (signature experiences); interactive dining should have seasonal rotation (fall fondue, summer poke bowl); interactive dining should have dietary options (vegan Caesar, gluten-free build-your-own); interactive dining should have family-style option (large groups). Solutions ranked by impact: (1) ADD 4 interactive dining options (build-your-own bowl, tableside guacamole, tableside Caesar, hot pot) — ${fmt$(engagementRevenue)}/mo engagement revenue at 75% margin; cost $1,500-4,500 one-time (carts + equipment); payback 2-4 months; (2) TRAIN staff on tableside service — service quality; (3) BUY dedicated equipment (guacamole cart, salad cart, dessert cart) — experience; (4) BRAND presentation (custom bowls, plates, carts) — merchandise; (5) PRICE at premium ($3-8 surcharge) — profitability; (6) ADD photo-worthy presentation — Instagram; (7) ADD storytelling (chef narrative) — experience; (8) ALLOW customer participation (assemble own bowl) — engagement; (9) ADD sensory elements (smell, sound, sight) — experience; (10) HIGHLIGHT on menu with icon (interactive fork) — visibility; (11) MARKET via social media (videos of tableside prep) — content; (12) ROTATE seasonally (fall fondue, summer poke bowl) — freshness; (13) OFFER dietary options (vegan Caesar, gluten-free build-your-own) — inclusivity; (14) OFFER family-style option (large groups) — group dining; (15) INCREASE dwell time (15-25 min longer = more beverage sales) — revenue. Industry data: 50-60% engagement lift; 12-20% ticket lift; 14-22% satisfaction lift; 75% profit margin; $1,500-4,500 one-time equipment; $3-8 premium surcharge; payback 2-4 months. Expected impact: +${expectedEngagementLift}% engagement, +${expectedRevenueLiftPct}% average ticket, +14% customer satisfaction, +10% customer loyalty, +${fmt$(engagementRevenue)}/mo engagement revenue, +${fmt$(loyaltyLiftRevenue)}/mo loyalty-driven revenue, payback 2-4 months.`,
        ai_recommendation: 'add_interactive_dining',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: CULINARY_EXPERIENCE_NOT_PROMOTED
    if (config.requireExperiencePromotion && (d.has_cooking_classes || d.has_chef_table || d.has_tasting_menu || d.has_wine_pairing_dinners || d.has_culinary_workshops || d.has_demonstration_kitchen || d.has_interactive_dining) && !d.experiences_promoted) {
      // Experiences available but not marketed -> low enrollment
      const experiencesAvailable = [d.has_cooking_classes, d.has_chef_table, d.has_tasting_menu, d.has_wine_pairing_dinners, d.has_culinary_workshops, d.has_demonstration_kitchen, d.has_interactive_dining].filter(Boolean).length;
      const expectedEnrollmentLiftPct = 65;
      const currentEnrollmentPct = d.experience_enrollment_rate_pct;
      const projectedEnrollmentPct = Math.min(95, currentEnrollmentPct + expectedEnrollmentLiftPct);
      const expectedRevenueLiftPct = 35;
      const expectedMarketingReachLift = targetMarketingReachLiftPct;
      const waitlistRevenue = Math.round(d.experience_waitlist_total * baselineSpend * 6);
      const marketingRevenue = Math.round(baselineRevenue * 0.05 * 0.4);
      const totalOpportunity = Math.max(waitlistRevenue + marketingRevenue, 1200);
      alerts.push({
        rule_id: 'culinary_experience_not_promoted',
        severity: 'high',
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        has_cooking_classes: d.has_cooking_classes,
        has_chef_table: d.has_chef_table,
        has_tasting_menu: d.has_tasting_menu,
        has_wine_pairing_dinners: d.has_wine_pairing_dinners,
        has_culinary_workshops: d.has_culinary_workshops,
        has_demonstration_kitchen: d.has_demonstration_kitchen,
        has_interactive_dining: d.has_interactive_dining,
        experience_features_count: d.experience_features_count,
        experiences_promoted: d.experiences_promoted,
        experiences_marketing_channels: d.experiences_marketing_channels,
        experience_enrollment_rate_pct: d.experience_enrollment_rate_pct,
        experience_waitlist_total: d.experience_waitlist_total,
        customer_loyalty_score: d.customer_loyalty_score,
        instagram_engagement_lift_pct: d.instagram_engagement_lift_pct,
        marketing_reach_lift_pct: d.marketing_reach_lift_pct,
        competitors_with_experiences_pct: d.competitors_with_experiences_pct,
        monthly_revenue: d.monthly_revenue,
        experience_marketing_monthly_cost: d.experience_marketing_monthly_cost,
        experience_program_total_monthly_cost: d.experience_program_total_monthly_cost,
        marketing_reach_lift_projected_pct: expectedMarketingReachLift,
        customer_loyalty_lift_projected_pct: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CULINARY EXPERIENCE NOT PROMOTED: ${d.location_id} — this ${d.restaurant_tier} restaurant has ${experiencesAvailable} culinary experiences available but is not marketing them. HIGH: CULINARY EXPERIENCE NOT PROMOTED — experiences available but not marketed. Current enrollment rate ${currentEnrollmentPct}% (target 85%+). Waitlist ${d.experience_waitlist_total} customers waiting but no marketing to convert. Industry data: culinary experiences not promoted average 35-45% enrollment rate vs 85%+ for promoted experiences; experiences marketed via 5+ channels see 65% enrollment lift; experiences marketed via social media see 30%+ Instagram engagement lift; experiences marketed via email see 85%+ open rate (vs 22% promotional); experiences marketed via website see 40%+ booking conversion; experiences marketed via OpenTable + Tock see 25%+ booking conversion; experiences marketed via Eventbrite see 20%+ booking conversion; experiences marketed via influencer partnerships see 4-12x reach; experiences marketed via PR see 3-8x media impressions; experiences marketed via paid ads see 2-5x ROAS; experiences should be marketed via 5+ channels (social + email + website + booking platforms + PR); experiences should have dedicated landing page on website; experiences should have professional photography (not stock photos); experiences should have video content (chef interview, behind-the-scenes, dish preparation); experiences should have email nurture sequence (3-5 emails before event); experiences should have social media calendar (3-5 posts per event); experiences should have influencer partnerships (3-5 local food influencers per quarter); experiences should have PR outreach (local publications, food blogs, regional magazines); experiences should have paid social ads ($200-500 per event); experiences should have Google Ads ($300-800 per month for "cooking class near me"); experiences should have referral program (bring a friend discount); experiences should have loyalty program integration (loyalty members get early access); experiences should have gift certificate promotion (holiday, Mother Day, Father Day, Valentine); experiences should have corporate outreach (B2B sales to local companies); experiences should have waitlist conversion email (when spots open up). Solutions ranked by impact: (1) BUILD dedicated experiences landing page on website — 40%+ booking conversion; cost $500-1500 dev; payback 1 month; (2) SHOOT professional photography for each experience — content quality; cost $300-800 photographer; (3) SHOOT video content (chef interview, behind-the-scenes) — content; cost $500-1500 videographer; (4) BUILD email nurture sequence (3-5 emails before event) — 85%+ open rate; (5) BUILD social media calendar (3-5 posts per event) — 30%+ Instagram engagement; (6) PARTNER with 3-5 local food influencers per quarter — 4-12x reach; cost $200-500 per influencer; (7) PITCH PR to local publications + food blogs — 3-8x media impressions; cost $0; (8) RUN paid social ads ($200-500 per event) — 2-5x ROAS; (9) RUN Google Ads for "cooking class near me" — high-intent traffic; cost $300-800/mo; (10) LAUNCH referral program (bring a friend discount) — viral growth; (11) INTEGRATE with loyalty program (early access for members) — loyalty boost; (12) PROMOTE gift certificates (holiday, Mother Day, Father Day, Valentine) — holiday revenue; (13) OUTREACH to local companies (B2B corporate events) — $3,000-8,000/event; (14) AUTOMATE waitlist conversion email (when spots open up) — recover lost demand; (15) LIST on OpenTable + Tock + Eventbrite — 25%+ booking conversion. Industry data: 65% enrollment lift for 5+ channel marketing; 30%+ Instagram engagement lift; 85%+ email open rate; 40%+ website booking conversion; 25%+ OpenTable + Tock booking; 20%+ Eventbrite booking; 4-12x influencer reach; 3-8x PR media impressions; 2-5x paid ads ROAS; payback 1 month. Expected impact: +65% enrollment rate (${currentEnrollmentPct}% → ${projectedEnrollmentPct}%), +${expectedMarketingReachLift}% marketing reach, +12% customer loyalty, +${fmt$(waitlistRevenue)}/mo waitlist conversion revenue, +${fmt$(marketingRevenue)}/mo marketing-driven revenue, payback 1 month.`,
        ai_recommendation: 'promote_culinary_experiences',
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
              { role: 'system', content: 'You are a restaurant culinary experience and cooking class optimization expert. Given culinary experience data, recommend ONE specific action with expected customer loyalty lift, brand differentiation lift, satisfaction lift, Instagram engagement lift, marketing reach lift, or new customer acquisition lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Has cooking classes: ${a.has_cooking_classes ?? false}. Has chef table: ${a.has_chef_table ?? false}. Has tasting menu: ${a.has_tasting_menu ?? false}. Has wine pairing dinners: ${a.has_wine_pairing_dinners ?? false}. Has workshops: ${a.has_culinary_workshops ?? false}. Has demo kitchen: ${a.has_demonstration_kitchen ?? false}. Has interactive dining: ${a.has_interactive_dining ?? false}. Experience features: ${a.experience_features_count ?? 0}. Cooking class events/mo: ${a.cooking_class_events_per_month ?? 0}. Cooking class margin: ${a.cooking_class_margin_pct ?? 0}%. Chef table premium: ${a.chef_table_premium_pct ?? 0}%. Tasting menu ticket lift: ${a.tasting_menu_ticket_lift_pct ?? 0}%. Wine pairing beverage lift: ${a.wine_pairing_beverage_revenue_lift_pct ?? 0}%. Workshop conversion: ${a.workshop_conversion_to_regular_pct ?? 0}%. Demo kitchen satisfaction lift: ${a.demo_kitchen_satisfaction_lift_pct ?? 0}%. Interactive engagement lift: ${a.interactive_engagement_lift_pct ?? 0}%. Promoted: ${a.experiences_promoted ?? false}. Marketing channels: ${a.experiences_marketing_channels ?? 0}. Enrollment rate: ${a.experience_enrollment_rate_pct ?? 0}%. Waitlist total: ${a.experience_waitlist_total ?? 0}. Loyalty: ${a.customer_loyalty_score ?? 0}/100 (baseline ${a.customer_loyalty_baseline ?? 0}, lift ${a.customer_loyalty_lift_pct ?? 0}%). Brand differentiation: ${a.brand_differentiation_score ?? 0}/100 (lift ${a.brand_differentiation_lift_pct ?? 0}%). Satisfaction: ${a.customer_satisfaction_score ?? 0}/100 (lift ${a.customer_satisfaction_lift_pct ?? 0}%). Instagram lift: ${a.instagram_engagement_lift_pct ?? 0}%. Marketing reach lift: ${a.marketing_reach_lift_pct ?? 0}%. New customers/mo: ${a.new_customer_acquisition_monthly ?? 0}. Repeat visit lift: ${a.repeat_visit_lift_pct ?? 0}%. Competitors with experiences: ${a.competitors_with_experiences_pct ?? 0}%. Lost customers: ${a.experience_aware_lost_customers ?? 0}. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Experience program cost: ${fmt$(a.experience_program_total_monthly_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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
    await db.query(`DELETE FROM culinary_experience_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE culinary_experience_alert CONTENT $data`, {
        data: { ...a, detected_at: a.detected_at.toISOString() },
      });
    } catch { /* ignore */ }
  }

  return { alerts, generated: alerts.length };
};

export const getActiveCulinaryExperienceAlerts = async (db: ReturnType<typeof useDB>): Promise<CulinaryExperienceAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM culinary_experience_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getCulinaryExperienceSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  noCookingClassCount: number; noChefTableCount: number; noTastingMenuCount: number; notPromotedCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'cooking_class_program_absent') AS nocooking,
              math::count(rule_id = 'chef_table_experience_absent') AS nocheftable,
              math::count(rule_id = 'tasting_menu_absent') AS notasting,
              math::count(rule_id = 'culinary_experience_not_promoted') AS notpromoted
       FROM culinary_experience_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      noCookingClassCount: safeNumber(r.nocooking, 0),
      noChefTableCount: safeNumber(r.nocheftable, 0),
      noTastingMenuCount: safeNumber(r.notasting, 0),
      notPromotedCount: safeNumber(r.notpromoted, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noCookingClassCount: 0, noChefTableCount: 0, noTastingMenuCount: 0, notPromotedCount: 0 };
  }
};

export const updateCulinaryExperienceAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
