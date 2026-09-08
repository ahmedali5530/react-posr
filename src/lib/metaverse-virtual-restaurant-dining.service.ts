/**
 * AI Metaverse & Virtual Restaurant Dining Experience Optimizer — predicts
 * how metaverse and virtual restaurant dining (virtual restaurant presence,
 * VR dining experiences, digital twin restaurants, NFT menu items, virtual
 * cooking classes, avatar dining, cross-reality loyalty, virtual event
 * hosting, metaverse real estate, digital food commerce, virtual brand
 * expansion, social VR dining) impacts brand reach, new revenue streams,
 * Gen Z acquisition, customer engagement, premium pricing, and competitive
 * advantage.
 *
 * Metaverse restaurant market = $10B+ by 2030 (McKinsey). Metaverse food
 * and beverage growing 40%+ CAGR. McDonald's filed trademarks for
 * metaverse restaurants (virtual McDelivery). Wendy's built Wendyverse
 * in Meta Horizon Worlds. Chipotle hosted Burrito Builder in Roblox
 * (60M+ visits). Starbucks Odyssey = $50M+ in NFT trades. 35% of Gen Z
 * own crypto and use metaverse platforms (Deloitte). Virtual restaurant
 * = no physical location, $0 rent, infinite scale. VR dining experiences
 * charge $15-50/cover for virtual gourmet. Digital twin restaurant =
 * mirror physical restaurant in VR for remote dining, training, menu
 * testing. NFT menu items = exclusive digital dishes sold as NFTs ($50-
 * 500 per dish). Virtual cooking classes = $50-200/session in VR.
 * Avatar dining = customers' avatars eat together virtually (social VR).
 * Cross-reality loyalty = earn rewards in metaverse, redeem in physical.
 * Virtual event hosting = corporate dining, birthdays, team building in
 * VR ($500-5,000/event). Metaverse real estate = $1,000-100,000 per
 * virtual lot (Decentraland, Sandbox, Horizon Worlds). Digital food
 * commerce = sell digital food that unlocks physical rewards. Virtual
 * brand expansion = launch virtual-only brand (no physical cost). 72%
 * of Gen Z interested in metaverse dining experiences (McKinsey). 45%
 * would pay for virtual dining experiences (PwC). Metaverse restaurant
 * ROI = $5-15 per $1 invested (virtual revenue + brand reach + Gen Z
 * acquisition + physical redemption). Platforms: Meta Horizon Worlds,
 * Roblox, Decentraland, Sandbox, VRChat, Spatial. VR dining devices:
 * Meta Quest 3, Apple Vision Pro, PSVR2.
 *
 * 217th POSR-exclusive differentiator. Distinct from:
 *   - ar-menu-immersive-dining.service (210th) — AR menu (physical
 *     restaurant + AR overlay). This optimizer focuses on METAVERSE
 *     (fully virtual restaurant, no physical presence required).
 *   - digital-menu-qr.service — QR code menu (2D physical). This
 *     optimizer focuses on VR menu (immersive 3D virtual).
 *   - ghost-kitchen-virtual-brand.service (203rd) — GHOST KITCHEN
 *     (physical kitchen, delivery-only). This optimizer focuses on
 *     VIRTUAL restaurant in metaverse (digital-only, no kitchen).
 *   - blockchain-loyalty-tokenized-rewards.service (213th) — BLOCKCHAIN
 *     loyalty (NFT tokens, crypto). This optimizer focuses on metaverse
 *     DINING experiences (VR/AR social dining, virtual restaurant).
 *   - influencer-outreach-optimizer.service (201st) — INFLUENCER
 *     marketing. This optimizer focuses on metaverse marketing
 *     (virtual restaurant as brand channel).
 *   - social-content.service (52nd) — social media CONTENT. This
 *     optimizer focuses on metaverse PRESENCE (virtual world).
 *   - mobile-app-ordering.service — MOBILE APP ordering. This optimizer
 *     focuses on metaverse ORDERING (in-world, avatar-based).
 *   - catering-optimizer.service — CATERING (physical events). This
 *     optimizer focuses on VIRTUAL events (metaverse-hosted).
 *
 * 8 AI rules:
 *   1. metaverse_strategy_absent -> no metaverse presence -> missed $10B market + Gen Z
 *   2. virtual_restaurant_presence_absent -> no virtual restaurant -> missed infinite scale
 *   3. vr_dining_experience_absent -> no VR dining -> missed $15-50/cover premium
 *   4. nft_menu_items_absent -> no NFT menu -> missed $50-500/dish digital revenue
 *   5. virtual_cooking_classes_absent -> no VR cooking -> missed $50-200/session
 *   6. avatar_social_dining_absent -> no avatar dining -> missed social VR engagement
 *   7. cross_reality_loyalty_absent -> no cross-reality -> missed physical redemption
 *   8. virtual_event_hosting_absent -> no virtual events -> missed $500-5k/event
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type MetaverseRuleId =
  | 'metaverse_strategy_absent'
  | 'virtual_restaurant_presence_absent'
  | 'vr_dining_experience_absent'
  | 'nft_menu_items_absent'
  | 'virtual_cooking_classes_absent'
  | 'avatar_social_dining_absent'
  | 'cross_reality_loyalty_absent'
  | 'virtual_event_hosting_absent';

export type MetaverseAiRec =
  'launch_metaverse_strategy'
  | 'establish_virtual_restaurant'
  | 'launch_vr_dining_experience'
  | 'launch_nft_menu_items'
  | 'launch_virtual_cooking_classes'
  | 'launch_avatar_social_dining'
  | 'implement_cross_reality_loyalty'
  | 'launch_virtual_event_hosting'
  | 'monitor'
  | 'skip';

export interface MetaverseAlert {
  id?: string;
  rule_id: MetaverseRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  has_metaverse_strategy?: boolean;
  metaverse_platforms?: string;
  metaverse_premium_willingness_pct?: number;
  has_virtual_restaurant_presence?: boolean;
  virtual_restaurant_platforms?: string;
  virtual_restaurant_visits_monthly?: number;
  virtual_restaurant_revenue_monthly?: number;
  virtual_restaurant_target_revenue_monthly?: number;
  has_vr_dining_experience?: boolean;
  vr_dining_covers_monthly?: number;
  vr_dining_revenue_per_cover?: number;
  vr_dining_revenue_monthly?: number;
  vr_devices_supported?: string;
  has_nft_menu_items?: boolean;
  nft_menu_items_count?: number;
  nft_menu_revenue_total?: number;
  nft_menu_avg_price?: number;
  nft_menu_redemption_rate_pct?: number;
  has_virtual_cooking_classes?: boolean;
  virtual_cooking_sessions_monthly?: number;
  virtual_cooking_revenue_per_session?: number;
  virtual_cooking_revenue_monthly?: number;
  has_avatar_social_dining?: boolean;
  avatar_dining_sessions_monthly?: number;
  avatar_dining_participants_avg?: number;
  avatar_dining_engagement_score?: number;
  has_cross_reality_loyalty?: boolean;
  cross_reality_redemption_rate_pct?: number;
  virtual_to_physical_conversion_pct?: number;
  cross_realty_members_count?: number;
  has_virtual_event_hosting?: boolean;
  virtual_events_monthly?: number;
  virtual_event_revenue_per_event?: number;
  virtual_event_revenue_monthly?: number;
  virtual_event_types?: string;
  metaverse_revenue_monthly?: number;
  metaverse_revenue_growth_pct?: number;
  metaverse_customer_acquisition_pct?: number;
  gen_z_metaverse_interest_pct?: number;
  metaverse_brand_reach_score?: number;
  competitor_metaverse_score?: number;
  monthly_revenue?: number;
  total_customers?: number;
  metaverse_investment_total?: number;
  metaverse_operating_cost_monthly?: number;
  metaverse_real_estate_cost?: number;
  virtual_revenue_projected?: number;
  brand_reach_projected_pct?: number;
  gen_z_acquisition_projected_pct?: number;
  engagement_lift_projected_pts?: number;
  premium_pricing_projected_pct?: number;
  cross_reality_conversion_projected_pct?: number;
  roi_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: MetaverseAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface MetaverseConfig {
  aiEnabled: boolean;
  requireMetaverseStrategy: boolean;
  requireVirtualRestaurantPresence: boolean;
  requireVrDiningExperience: boolean;
  requireNftMenuItems: boolean;
  requireVirtualCookingClasses: boolean;
  requireAvatarSocialDining: boolean;
  requireCrossRealityLoyalty: boolean;
  requireVirtualEventHosting: boolean;
  minVirtualRestaurantVisitsMonthly: number;
  minVrDiningCoversMonthly: number;
  minNftMenuItemsCount: number;
  minVirtualCookingSessionsMonthly: number;
  minAvatarDiningSessionsMonthly: number;
  minCrossRealityRedemptionRatePct: number;
  minVirtualEventsMonthly: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_METAVERSE_CONFIG: MetaverseConfig = {
  aiEnabled: true,
  requireMetaverseStrategy: true,
  requireVirtualRestaurantPresence: true,
  requireVrDiningExperience: true,
  requireNftMenuItems: true,
  requireVirtualCookingClasses: true,
  requireAvatarSocialDining: true,
  requireCrossRealityLoyalty: true,
  requireVirtualEventHosting: true,
  minVirtualRestaurantVisitsMonthly: 1000,
  minVrDiningCoversMonthly: 20,
  minNftMenuItemsCount: 3,
  minVirtualCookingSessionsMonthly: 4,
  minAvatarDiningSessionsMonthly: 2,
  minCrossRealityRedemptionRatePct: 10,
  minVirtualEventsMonthly: 2,
  preferCompetitorParity: true,
};

export const readMetaverseConfig = (settings: any): MetaverseConfig => ({
  aiEnabled: settings?.metaverse_ai_enabled ?? true,
  requireMetaverseStrategy: settings?.metaverse_require_strategy ?? true,
  requireVirtualRestaurantPresence: settings?.metaverse_require_virtual_restaurant ?? true,
  requireVrDiningExperience: settings?.metaverse_require_vr_dining ?? true,
  requireNftMenuItems: settings?.metaverse_require_nft_menu ?? true,
  requireVirtualCookingClasses: settings?.metaverse_require_cooking ?? true,
  requireAvatarSocialDining: settings?.metaverse_require_avatar_dining ?? true,
  requireCrossRealityLoyalty: settings?.metaverse_require_cross_reality ?? true,
  requireVirtualEventHosting: settings?.metaverse_require_events ?? true,
  minVirtualRestaurantVisitsMonthly: safeNumber(settings?.metaverse_min_vr_visits, 1000),
  minVrDiningCoversMonthly: safeNumber(settings?.metaverse_min_vr_covers, 20),
  minNftMenuItemsCount: safeNumber(settings?.metaverse_min_nft_items, 3),
  minVirtualCookingSessionsMonthly: safeNumber(settings?.metaverse_min_cooking, 4),
  minAvatarDiningSessionsMonthly: safeNumber(settings?.metaverse_min_avatar, 2),
  minCrossRealityRedemptionRatePct: safeNumber(settings?.metaverse_min_cross_reality, 10),
  minVirtualEventsMonthly: safeNumber(settings?.metaverse_min_events, 2),
  preferCompetitorParity: settings?.metaverse_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface MetaverseData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_metaverse_strategy: boolean;
  metaverse_platforms: string;
  metaverse_premium_willingness_pct: number;
  has_virtual_restaurant_presence: boolean;
  virtual_restaurant_platforms: string;
  virtual_restaurant_visits_monthly: number;
  virtual_restaurant_revenue_monthly: number;
  virtual_restaurant_target_revenue_monthly: number;
  has_vr_dining_experience: boolean;
  vr_dining_covers_monthly: number;
  vr_dining_revenue_per_cover: number;
  vr_dining_revenue_monthly: number;
  vr_devices_supported: string;
  has_nft_menu_items: boolean;
  nft_menu_items_count: number;
  nft_menu_revenue_total: number;
  nft_menu_avg_price: number;
  nft_menu_redemption_rate_pct: number;
  has_virtual_cooking_classes: boolean;
  virtual_cooking_sessions_monthly: number;
  virtual_cooking_revenue_per_session: number;
  virtual_cooking_revenue_monthly: number;
  has_avatar_social_dining: boolean;
  avatar_dining_sessions_monthly: number;
  avatar_dining_participants_avg: number;
  avatar_dining_engagement_score: number;
  has_cross_reality_loyalty: boolean;
  cross_reality_redemption_rate_pct: number;
  virtual_to_physical_conversion_pct: number;
  cross_realty_members_count: number;
  has_virtual_event_hosting: boolean;
  virtual_events_monthly: number;
  virtual_event_revenue_per_event: number;
  virtual_event_revenue_monthly: number;
  virtual_event_types: string;
  metaverse_revenue_monthly: number;
  metaverse_revenue_growth_pct: number;
  metaverse_customer_acquisition_pct: number;
  gen_z_metaverse_interest_pct: number;
  metaverse_brand_reach_score: number;
  competitor_metaverse_score: number;
  monthly_revenue: number;
  total_customers: number;
  metaverse_investment_total: number;
  metaverse_operating_cost_monthly: number;
  metaverse_real_estate_cost: number;
}

const MOCK_DATA: MetaverseData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_metaverse_strategy: false, metaverse_platforms: 'none',
    metaverse_premium_willingness_pct: 28,
    has_virtual_restaurant_presence: false, virtual_restaurant_platforms: 'none',
    virtual_restaurant_visits_monthly: 0, virtual_restaurant_revenue_monthly: 0,
    virtual_restaurant_target_revenue_monthly: 5000,
    has_vr_dining_experience: false, vr_dining_covers_monthly: 0,
    vr_dining_revenue_per_cover: 0, vr_dining_revenue_monthly: 0,
    vr_devices_supported: 'none',
    has_nft_menu_items: false, nft_menu_items_count: 0,
    nft_menu_revenue_total: 0, nft_menu_avg_price: 0,
    nft_menu_redemption_rate_pct: 0,
    has_virtual_cooking_classes: false, virtual_cooking_sessions_monthly: 0,
    virtual_cooking_revenue_per_session: 0, virtual_cooking_revenue_monthly: 0,
    has_avatar_social_dining: false, avatar_dining_sessions_monthly: 0,
    avatar_dining_participants_avg: 0, avatar_dining_engagement_score: 0,
    has_cross_reality_loyalty: false, cross_reality_redemption_rate_pct: 0,
    virtual_to_physical_conversion_pct: 0, cross_realty_members_count: 0,
    has_virtual_event_hosting: false, virtual_events_monthly: 0,
    virtual_event_revenue_per_event: 0, virtual_event_revenue_monthly: 0,
    virtual_event_types: 'none',
    metaverse_revenue_monthly: 0, metaverse_revenue_growth_pct: 0,
    metaverse_customer_acquisition_pct: 0, gen_z_metaverse_interest_pct: 42,
    metaverse_brand_reach_score: 22, competitor_metaverse_score: 58,
    monthly_revenue: 86000, total_customers: 2800,
    metaverse_investment_total: 0, metaverse_operating_cost_monthly: 0,
    metaverse_real_estate_cost: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_metaverse_strategy: true, metaverse_platforms: 'Roblox',
    metaverse_premium_willingness_pct: 35,
    has_virtual_restaurant_presence: true, virtual_restaurant_platforms: 'Roblox',
    virtual_restaurant_visits_monthly: 8200, virtual_restaurant_revenue_monthly: 800,
    virtual_restaurant_target_revenue_monthly: 5000,
    has_vr_dining_experience: false, vr_dining_covers_monthly: 0,
    vr_dining_revenue_per_cover: 0, vr_dining_revenue_monthly: 0,
    vr_devices_supported: 'none',
    has_nft_menu_items: false, nft_menu_items_count: 0,
    nft_menu_revenue_total: 0, nft_menu_avg_price: 0,
    nft_menu_redemption_rate_pct: 0,
    has_virtual_cooking_classes: false, virtual_cooking_sessions_monthly: 0,
    virtual_cooking_revenue_per_session: 0, virtual_cooking_revenue_monthly: 0,
    has_avatar_social_dining: false, avatar_dining_sessions_monthly: 0,
    avatar_dining_participants_avg: 0, avatar_dining_engagement_score: 0,
    has_cross_reality_loyalty: false, cross_reality_redemption_rate_pct: 0,
    virtual_to_physical_conversion_pct: 0, cross_realty_members_count: 0,
    has_virtual_event_hosting: false, virtual_events_monthly: 0,
    virtual_event_revenue_per_event: 0, virtual_event_revenue_monthly: 0,
    virtual_event_types: 'none',
    metaverse_revenue_monthly: 800, metaverse_revenue_growth_pct: 18,
    metaverse_customer_acquisition_pct: 4, gen_z_metaverse_interest_pct: 52,
    metaverse_brand_reach_score: 52, competitor_metaverse_score: 72,
    monthly_revenue: 152000, total_customers: 6200,
    metaverse_investment_total: 8000, metaverse_operating_cost_monthly: 200,
    metaverse_real_estate_cost: 0,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_metaverse_strategy: true, metaverse_platforms: 'Roblox + Meta Horizon + Sandbox',
    metaverse_premium_willingness_pct: 42,
    has_virtual_restaurant_presence: true, virtual_restaurant_platforms: 'Roblox + Meta Horizon',
    virtual_restaurant_visits_monthly: 28000, virtual_restaurant_revenue_monthly: 4200,
    virtual_restaurant_target_revenue_monthly: 5000,
    has_vr_dining_experience: true, vr_dining_covers_monthly: 48,
    vr_dining_revenue_per_cover: 28, vr_dining_revenue_monthly: 1344,
    vr_devices_supported: 'Meta Quest 3, Apple Vision Pro',
    has_nft_menu_items: true, nft_menu_items_count: 5,
    nft_menu_revenue_total: 12000, nft_menu_avg_price: 120,
    nft_menu_redemption_rate_pct: 28,
    has_virtual_cooking_classes: true, virtual_cooking_sessions_monthly: 8,
    virtual_cooking_revenue_per_session: 85, virtual_cooking_revenue_monthly: 680,
    has_avatar_social_dining: true, avatar_dining_sessions_monthly: 4,
    avatar_dining_participants_avg: 18, avatar_dining_engagement_score: 78,
    has_cross_reality_loyalty: true, cross_reality_redemption_rate_pct: 18,
    virtual_to_physical_conversion_pct: 12, cross_realty_members_count: 820,
    has_virtual_event_hosting: true, virtual_events_monthly: 3,
    virtual_event_revenue_per_event: 1200, virtual_event_revenue_monthly: 3600,
    virtual_event_types: 'corporate_dining,birthdays,team_building',
    metaverse_revenue_monthly: 10424, metaverse_revenue_growth_pct: 32,
    metaverse_customer_acquisition_pct: 12, gen_z_metaverse_interest_pct: 62,
    metaverse_brand_reach_score: 82, competitor_metaverse_score: 80,
    monthly_revenue: 201000, total_customers: 9800,
    metaverse_investment_total: 28000, metaverse_operating_cost_monthly: 500,
    metaverse_real_estate_cost: 5000,
  },
  {
    location_id: 'location_2', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_metaverse_strategy: true, metaverse_platforms: 'Meta Horizon + Sandbox + Decentraland + VRChat + Spatial',
    metaverse_premium_willingness_pct: 55,
    has_virtual_restaurant_presence: true, virtual_restaurant_platforms: 'Meta Horizon + Sandbox + Decentraland',
    virtual_restaurant_visits_monthly: 68000, virtual_restaurant_revenue_monthly: 12000,
    virtual_restaurant_target_revenue_monthly: 5000,
    has_vr_dining_experience: true, vr_dining_covers_monthly: 120,
    vr_dining_revenue_per_cover: 48, vr_dining_revenue_monthly: 5760,
    vr_devices_supported: 'Meta Quest 3, Apple Vision Pro, PSVR2',
    has_nft_menu_items: true, nft_menu_items_count: 12,
    nft_menu_revenue_total: 58000, nft_menu_avg_price: 280,
    nft_menu_redemption_rate_pct: 42,
    has_virtual_cooking_classes: true, virtual_cooking_sessions_monthly: 16,
    virtual_cooking_revenue_per_session: 150, virtual_cooking_revenue_monthly: 2400,
    has_avatar_social_dining: true, avatar_dining_sessions_monthly: 8,
    avatar_dining_participants_avg: 32, avatar_dining_engagement_score: 92,
    has_cross_reality_loyalty: true, cross_reality_redemption_rate_pct: 28,
    virtual_to_physical_conversion_pct: 18, cross_realty_members_count: 2400,
    has_virtual_event_hosting: true, virtual_events_monthly: 6,
    virtual_event_revenue_per_event: 2800, virtual_event_revenue_monthly: 16800,
    virtual_event_types: 'corporate_dining,birthdays,team_building,weddings,gala,charity',
    metaverse_revenue_monthly: 36960, metaverse_revenue_growth_pct: 48,
    metaverse_customer_acquisition_pct: 18, gen_z_metaverse_interest_pct: 68,
    metaverse_brand_reach_score: 94, competitor_metaverse_score: 84,
    monthly_revenue: 265000, total_customers: 5200,
    metaverse_investment_total: 65000, metaverse_operating_cost_monthly: 1200,
    metaverse_real_estate_cost: 25000,
  },
];

export const runMetaverseEngine = async (
  db: ReturnType<typeof useDB>,
  config: MetaverseConfig,
): Promise<{ alerts: MetaverseAlert[]; generated: number }> => {
  const alerts: MetaverseAlert[] = [];
  const now = new Date();

  let data: MetaverseData[] = [];
  try {
    const result = await db.query(`SELECT * FROM metaverse_log`);
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): MetaverseData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_metaverse_strategy: Boolean(r.has_metaverse_strategy ?? false),
      metaverse_platforms: String(r.metaverse_platforms ?? 'none'),
      metaverse_premium_willingness_pct: safeNumber(r.metaverse_premium_willingness_pct, 0),
      has_virtual_restaurant_presence: Boolean(r.has_virtual_restaurant_presence ?? false),
      virtual_restaurant_platforms: String(r.virtual_restaurant_platforms ?? 'none'),
      virtual_restaurant_visits_monthly: safeNumber(r.virtual_restaurant_visits_monthly, 0),
      virtual_restaurant_revenue_monthly: safeNumber(r.virtual_restaurant_revenue_monthly, 0),
      virtual_restaurant_target_revenue_monthly: safeNumber(r.virtual_restaurant_target_revenue_monthly, 0),
      has_vr_dining_experience: Boolean(r.has_vr_dining_experience ?? false),
      vr_dining_covers_monthly: safeNumber(r.vr_dining_covers_monthly, 0),
      vr_dining_revenue_per_cover: safeNumber(r.vr_dining_revenue_per_cover, 0),
      vr_dining_revenue_monthly: safeNumber(r.vr_dining_revenue_monthly, 0),
      vr_devices_supported: String(r.vr_devices_supported ?? 'none'),
      has_nft_menu_items: Boolean(r.has_nft_menu_items ?? false),
      nft_menu_items_count: safeNumber(r.nft_menu_items_count, 0),
      nft_menu_revenue_total: safeNumber(r.nft_menu_revenue_total, 0),
      nft_menu_avg_price: safeNumber(r.nft_menu_avg_price, 0),
      nft_menu_redemption_rate_pct: safeNumber(r.nft_menu_redemption_rate_pct, 0),
      has_virtual_cooking_classes: Boolean(r.has_virtual_cooking_classes ?? false),
      virtual_cooking_sessions_monthly: safeNumber(r.virtual_cooking_sessions_monthly, 0),
      virtual_cooking_revenue_per_session: safeNumber(r.virtual_cooking_revenue_per_session, 0),
      virtual_cooking_revenue_monthly: safeNumber(r.virtual_cooking_revenue_monthly, 0),
      has_avatar_social_dining: Boolean(r.has_avatar_social_dining ?? false),
      avatar_dining_sessions_monthly: safeNumber(r.avatar_dining_sessions_monthly, 0),
      avatar_dining_participants_avg: safeNumber(r.avatar_dining_participants_avg, 0),
      avatar_dining_engagement_score: safeNumber(r.avatar_dining_engagement_score, 0),
      has_cross_reality_loyalty: Boolean(r.has_cross_reality_loyalty ?? false),
      cross_reality_redemption_rate_pct: safeNumber(r.cross_reality_redemption_rate_pct, 0),
      virtual_to_physical_conversion_pct: safeNumber(r.virtual_to_physical_conversion_pct, 0),
      cross_realty_members_count: safeNumber(r.cross_realty_members_count, 0),
      has_virtual_event_hosting: Boolean(r.has_virtual_event_hosting ?? false),
      virtual_events_monthly: safeNumber(r.virtual_events_monthly, 0),
      virtual_event_revenue_per_event: safeNumber(r.virtual_event_revenue_per_event, 0),
      virtual_event_revenue_monthly: safeNumber(r.virtual_event_revenue_monthly, 0),
      virtual_event_types: String(r.virtual_event_types ?? 'none'),
      metaverse_revenue_monthly: safeNumber(r.metaverse_revenue_monthly, 0),
      metaverse_revenue_growth_pct: safeNumber(r.metaverse_revenue_growth_pct, 0),
      metaverse_customer_acquisition_pct: safeNumber(r.metaverse_customer_acquisition_pct, 0),
      gen_z_metaverse_interest_pct: safeNumber(r.gen_z_metaverse_interest_pct, 0),
      metaverse_brand_reach_score: safeNumber(r.metaverse_brand_reach_score, 0),
      competitor_metaverse_score: safeNumber(r.competitor_metaverse_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_customers: safeNumber(r.total_customers, 0),
      metaverse_investment_total: safeNumber(r.metaverse_investment_total, 0),
      metaverse_operating_cost_monthly: safeNumber(r.metaverse_operating_cost_monthly, 0),
      metaverse_real_estate_cost: safeNumber(r.metaverse_real_estate_cost, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;

    // Rule 1: METAVERSE_STRATEGY_ABSENT
    if (config.requireMetaverseStrategy && !d.has_metaverse_strategy) {
      const expectedVirtualRevenue = Math.round(baselineRevenue * 0.03);
      const expectedGenZAcquisition = Math.round(baselineRevenue * 0.025);
      const expectedBrandReach = Math.round(baselineRevenue * 0.02);
      const expectedCompetitive = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedVirtualRevenue + expectedGenZAcquisition + expectedBrandReach + expectedCompetitive, 3800);
      const severityLabel = d.competitor_metaverse_score > 65 ? 'high' : 'medium';
      const criticalNote = (d.competitor_metaverse_score > 65)
        ? 'HIGH: NO METAVERSE STRATEGY — competitor metaverse score ' + d.competitor_metaverse_score + '/100; metaverse restaurant market = $10B+ by 2030 (McKinsey); McDonald filed metaverse trademarks; Wendy built Wendyverse; Chipotle Burrito Builder = 60M+ visits; 72% of Gen Z interested in metaverse dining (McKinsey); 45% would pay for virtual dining (PwC); 35% of Gen Z own crypto + use metaverse (Deloitte); missing metaverse = missed virtual revenue + Gen Z acquisition + brand reach + competitive differentiation. '
        : `MEDIUM: NO METAVERSE STRATEGY — metaverse restaurant market $10B+ by 2030; 72% of Gen Z interested (McKinsey); 45% would pay (PwC); missing virtual revenue + Gen Z + brand reach. `;
      alerts.push({
        rule_id: 'metaverse_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_metaverse_strategy: d.has_metaverse_strategy,
        metaverse_platforms: d.metaverse_platforms,
        metaverse_premium_willingness_pct: d.metaverse_premium_willingness_pct,
        gen_z_metaverse_interest_pct: d.gen_z_metaverse_interest_pct,
        metaverse_brand_reach_score: d.metaverse_brand_reach_score,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue, total_customers: d.total_customers,
        metaverse_investment_total: d.metaverse_investment_total,
        metaverse_operating_cost_monthly: d.metaverse_operating_cost_monthly,
        virtual_revenue_projected: expectedVirtualRevenue,
        gen_z_acquisition_projected_pct: 15,
        brand_reach_projected_pct: 30,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `METAVERSE STRATEGY ABSENT: ${d.location_id} — metaverse strategy ABSENT; platforms: ${d.metaverse_platforms}; premium willingness ${d.metaverse_premium_willingness_pct}%; Gen Z interest ${d.gen_z_metaverse_interest_pct}%; brand reach ${d.metaverse_brand_reach_score}/100; competitor ${d.competitor_metaverse_score}/100; total customers ${d.total_customers}; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: metaverse restaurant market = $10B+ by 2030 (McKinsey); McDonald filed trademarks for metaverse restaurants (virtual McDelivery); Wendy built Wendyverse in Meta Horizon Worlds; Chipotle hosted Burrito Builder in Roblox (60M+ visits); Starbucks Odyssey = $50M+ in NFT trades; 35% of Gen Z own crypto and use metaverse platforms (Deloitte); 72% of Gen Z interested in metaverse dining (McKinsey); 45% would pay for virtual dining experiences (PwC); virtual restaurant = no physical location, $0 rent, infinite scale; VR dining experiences charge $15-50/cover; NFT menu items = $50-500 per dish; virtual cooking classes = $50-200/session; avatar dining = social VR; cross-reality loyalty = earn in metaverse, redeem in physical; virtual event hosting = $500-5,000/event; metaverse real estate = $1,000-100,000 per lot; metaverse restaurant ROI = $5-15 per $1; platforms: Meta Horizon Worlds, Roblox, Decentraland, Sandbox, VRChat, Spatial; VR devices: Meta Quest 3, Apple Vision Pro, PSVR2. Solutions ranked by impact: (1) LAUNCH metaverse strategy — virtual revenue ${fmt$(expectedVirtualRevenue)}/mo + Gen Z acquisition ${fmt$(expectedGenZAcquisition)}/mo + brand reach ${fmt$(expectedBrandReach)}/mo + competitive ${fmt$(expectedCompetitive)}/mo; cost ${fmt$(d.metaverse_investment_total || 12000)} setup + ${fmt$(d.metaverse_operating_cost_monthly || 300)}/mo; payback 3-6 months; (2) CHOOSE metaverse platform (Roblox — Gen Z, Meta Horizon — social VR, Sandbox/Decentraland — web3); (3) ESTABLISH virtual restaurant presence (build virtual location in metaverse); (4) LAUNCH VR dining experience ($15-50/cover); (5) CREATE NFT menu items ($50-500/dish, redeemable in physical); (6) LAUNCH virtual cooking classes ($50-200/session); (7) LAUNCH avatar social dining (social VR); (8) IMPLEMENT cross-reality loyalty (earn virtual, redeem physical); (9) LAUNCH virtual event hosting ($500-5k/event); (10) TRACK ROI (virtual revenue + Gen Z acquisition + brand reach); (11) BENCHMARK vs competitor metaverse. Industry data: $10B+ market by 2030; 72% Gen Z interested; 45% would pay; ROI $5-15 per $1; payback 3-6 months. Expected impact: +${fmt$(expectedVirtualRevenue)}/mo virtual revenue, +15% Gen Z acquisition, +30% brand reach, payback 3-6 months.`,
        ai_recommendation: 'launch_metaverse_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: VIRTUAL_RESTAURANT_PRESENCE_ABSENT
    if (d.has_metaverse_strategy && config.requireVirtualRestaurantPresence && (!d.has_virtual_restaurant_presence || d.virtual_restaurant_visits_monthly < config.minVirtualRestaurantVisitsMonthly)) {
      const visitGap = Math.max(config.minVirtualRestaurantVisitsMonthly - d.virtual_restaurant_visits_monthly, 0);
      const expectedVirtualRevenue = Math.round(d.virtual_restaurant_target_revenue_monthly * 0.6);
      const expectedBrandReach = Math.round(baselineRevenue * 0.02);
      const expectedGenZAcquisition = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedVirtualRevenue + expectedBrandReach + expectedGenZAcquisition + expectedCompetitiveLift, 2000);
      const severityLabel = !d.has_virtual_restaurant_presence ? 'high' : 'medium';
      const criticalNote = (!d.has_virtual_restaurant_presence)
        ? `HIGH: NO VIRTUAL RESTAURANT PRESENCE — virtual restaurant = no physical location, $0 rent, infinite scale; McDonald/Wendy/Chipotle already in metaverse; without virtual restaurant, missing infinite-scale revenue + brand reach + Gen Z acquisition. `
        : `MEDIUM: VIRTUAL RESTAURANT VISITS BELOW TARGET — ${d.virtual_restaurant_visits_monthly}/mo (min ${config.minVirtualRestaurantVisitsMonthly}); scale for more revenue. `;
      alerts.push({
        rule_id: 'virtual_restaurant_presence_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_virtual_restaurant_presence: d.has_virtual_restaurant_presence,
        virtual_restaurant_platforms: d.virtual_restaurant_platforms,
        virtual_restaurant_visits_monthly: d.virtual_restaurant_visits_monthly,
        virtual_restaurant_revenue_monthly: d.virtual_restaurant_revenue_monthly,
        virtual_restaurant_target_revenue_monthly: d.virtual_restaurant_target_revenue_monthly,
        metaverse_platforms: d.metaverse_platforms,
        gen_z_metaverse_interest_pct: d.gen_z_metaverse_interest_pct,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        metaverse_investment_total: d.metaverse_investment_total,
        virtual_revenue_projected: expectedVirtualRevenue,
        brand_reach_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VIRTUAL RESTAURANT PRESENCE ABSENT: ${d.location_id} — virtual restaurant ${d.has_virtual_restaurant_presence ? 'present' : 'ABSENT'}; platforms: ${d.virtual_restaurant_platforms}; visits ${d.virtual_restaurant_visits_monthly}/mo (min ${config.minVirtualRestaurantVisitsMonthly}); revenue ${fmt$(d.virtual_restaurant_revenue_monthly)}/mo (target ${fmt$(d.virtual_restaurant_target_revenue_monthly)}); metaverse platforms ${d.metaverse_platforms}; Gen Z interest ${d.gen_z_metaverse_interest_pct}%; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: virtual restaurant = no physical location, $0 rent, infinite scale (serve unlimited customers simultaneously); McDonald filed trademarks for metaverse restaurants (virtual McDelivery); Wendy built Wendyverse in Meta Horizon Worlds; Chipotle Burrito Builder in Roblox (60M+ visits); virtual restaurant types = brand presence (virtual location customers visit), game integration (restaurant mini-game, earn rewards), social hub (avatar meetup at virtual restaurant), digital commerce (sell digital food that unlocks physical rewards); virtual restaurant platforms = Roblox (Gen Z, 200M+ MAU), Meta Horizon Worlds (social VR, Meta Quest), Decentraland (web3, crypto-native), Sandbox (web3, gaming), VRChat (social VR), Spatial (AR/VR galleries); virtual restaurant cost = $5k-20k setup (3D design, development) + $100-500/month (maintenance); virtual restaurant ROI = $5-10 per $1 (virtual revenue + brand reach + Gen Z acquisition + physical redemption). Solutions ranked by impact: (1) ESTABLISH virtual restaurant — virtual revenue ${fmt$(expectedVirtualRevenue)}/mo + brand reach ${fmt$(expectedBrandReach)}/mo + Gen Z ${fmt$(expectedGenZAcquisition)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(8000)} setup (3D design + development); payback 3-6 months; (2) CHOOSE platform (Roblox — Gen Z, Meta Horizon — social VR, Sandbox — web3); (3) BUILD virtual restaurant (3D environment, menu, ordering); (4) INTEGRATE ordering (in-world purchase, redeem in physical); (5) INTEGRATE loyalty (earn virtual, redeem physical); (6) MARKET to Gen Z (in-platform, social media); (7) TRACK visits (target ${config.minVirtualRestaurantVisitsMonthly}+/mo); (8) TRACK revenue (target ${fmt$(d.virtual_restaurant_target_revenue_monthly)}/mo); (9) BENCHMARK vs competitor virtual restaurant. Industry data: $0 rent, infinite scale; 60M+ Chipotle Roblox visits; payback 3-6 months. Expected impact: +${fmt$(expectedVirtualRevenue)}/mo virtual revenue, +25% brand reach, payback 3-6 months.`,
        ai_recommendation: 'establish_virtual_restaurant',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: VR_DINING_EXPERIENCE_ABSENT
    if (d.has_metaverse_strategy && config.requireVrDiningExperience && (!d.has_vr_dining_experience || d.vr_dining_covers_monthly < config.minVrDiningCoversMonthly)) {
      const coverGap = Math.max(config.minVrDiningCoversMonthly - d.vr_dining_covers_monthly, 0);
      const expectedVrRevenue = Math.round(coverGap * (d.vr_dining_revenue_per_cover || 25));
      const expectedPremiumPricing = Math.round(baselineRevenue * 0.01);
      const expectedEngagementLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedVrRevenue + expectedPremiumPricing + expectedEngagementLift + expectedCompetitiveLift, 1200);
      const severityLabel = !d.has_vr_dining_experience ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO VR DINING EXPERIENCE — VR dining covers ${d.vr_dining_covers_monthly}/mo (min ${config.minVrDiningCoversMonthly}); revenue/cover ${fmt$(d.vr_dining_revenue_per_cover)}; VR devices ${d.vr_devices_supported}; VR dining charges $15-50/cover for virtual gourmet; 45% would pay for virtual dining (PwC); without VR dining, missing premium virtual revenue + engagement. `;
      alerts.push({
        rule_id: 'vr_dining_experience_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_vr_dining_experience: d.has_vr_dining_experience,
        vr_dining_covers_monthly: d.vr_dining_covers_monthly,
        vr_dining_revenue_per_cover: d.vr_dining_revenue_per_cover,
        vr_dining_revenue_monthly: d.vr_dining_revenue_monthly,
        vr_devices_supported: d.vr_devices_supported,
        metaverse_premium_willingness_pct: d.metaverse_premium_willingness_pct,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        virtual_revenue_projected: expectedVrRevenue,
        engagement_lift_projected_pts: 15,
        premium_pricing_projected_pct: 20,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VR DINING EXPERIENCE ABSENT: ${d.location_id} — VR dining ${d.has_vr_dining_experience ? 'present' : 'ABSENT'}; covers ${d.vr_dining_covers_monthly}/mo (min ${config.minVrDiningCoversMonthly}); revenue/cover ${fmt$(d.vr_dining_revenue_per_cover)}; revenue ${fmt$(d.vr_dining_revenue_monthly)}/mo; devices ${d.vr_devices_supported}; premium willingness ${d.metaverse_premium_willingness_pct}%; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: VR dining experiences charge $15-50/cover for virtual gourmet (chef-cooked meal consumed in VR with multi-sensory experience); 45% would pay for virtual dining experiences (PwC); VR dining types = virtual fine dining (multi-course VR experience with real food delivery), virtual tasting menu (wine/spirits tasting in VR), virtual cooking + dining (cook in VR then eat), celebrity chef VR dining (cook with famous chef in VR); VR dining devices = Meta Quest 3 ($499, most popular), Apple Vision Pro ($3,499, premium), PSVR2 ($549, gaming); VR dining experience = 3D environment (virtual restaurant, themed world), multi-sensory (visual + audio + haptic + real food delivery), social (dine with avatars of friends/family remotely), premium pricing ($15-50/cover); VR dining cost = $5k-15k setup (VR development, 3D assets) + $200-500/month (maintenance); VR dining ROI = $5-10 per $1 (cover revenue + premium + engagement). Solutions ranked by impact: (1) LAUNCH VR dining experience — VR revenue ${fmt$(expectedVrRevenue)}/mo + premium pricing ${fmt$(expectedPremiumPricing)}/mo + engagement ${fmt$(expectedEngagementLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(8000)} setup; payback 4-8 months; (2) CHOOSE VR device support (Meta Quest 3 — most popular, Apple Vision Pro — premium); (3) DESIGN VR dining experience (virtual restaurant, themed world, multi-course); (4) INTEGRATE real food delivery (VR experience + physical food delivered); (5) ADD multi-sensory (visual + audio + haptic); (6) ENABLE social dining (avatar friends/family); (7) SET premium pricing ($15-50/cover); (8) TRACK covers (target ${config.minVrDiningCoversMonthly}+/mo); (9) BENCHMARK vs competitor VR dining. Industry data: $15-50/cover; 45% would pay (PwC); payback 4-8 months. Expected impact: +${fmt$(expectedVrRevenue)}/mo VR revenue, +15pts engagement, payback 4-8 months.`,
        ai_recommendation: 'launch_vr_dining_experience',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: NFT_MENU_ITEMS_ABSENT
    if (d.has_metaverse_strategy && config.requireNftMenuItems && (!d.has_nft_menu_items || d.nft_menu_items_count < config.minNftMenuItemsCount)) {
      const itemGap = Math.max(config.minNftMenuItemsCount - d.nft_menu_items_count, 0);
      const expectedNftRevenue = Math.round(itemGap * (d.nft_menu_avg_price || 100) * 10);
      const expectedRedemptionRevenue = Math.round(baselineRevenue * 0.01);
      const expectedEngagementLift = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedNftRevenue / 12 + expectedRedemptionRevenue + expectedEngagementLift + expectedCompetitiveLift, 1000);
      const severityLabel = !d.has_nft_menu_items ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO NFT MENU ITEMS — NFT menu items ${d.nft_menu_items_count} (min ${config.minNftMenuItemsCount}); revenue ${fmt$(d.nft_menu_revenue_total)}; avg price ${fmt$(d.nft_menu_avg_price)}; redemption ${d.nft_menu_redemption_rate_pct}%; NFT menu items = $50-500/dish digital revenue; NFTs are tradable (secondary market value); NFTs redeemable in physical restaurant; without NFT menu, missing digital revenue + physical redemption. `;
      alerts.push({
        rule_id: 'nft_menu_items_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_nft_menu_items: d.has_nft_menu_items,
        nft_menu_items_count: d.nft_menu_items_count,
        nft_menu_revenue_total: d.nft_menu_revenue_total,
        nft_menu_avg_price: d.nft_menu_avg_price,
        nft_menu_redemption_rate_pct: d.nft_menu_redemption_rate_pct,
        metaverse_platforms: d.metaverse_platforms,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        virtual_revenue_projected: expectedNftRevenue / 12,
        engagement_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `NFT MENU ITEMS ABSENT: ${d.location_id} — NFT menu items ${d.has_nft_menu_items ? 'present' : 'ABSENT'}; items ${d.nft_menu_items_count} (min ${config.minNftMenuItemsCount}); revenue ${fmt$(d.nft_menu_revenue_total)}; avg price ${fmt$(d.nft_menu_avg_price)}; redemption ${d.nft_menu_redemption_rate_pct}%; platforms ${d.metaverse_platforms}; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: NFT menu items = $50-500 per dish digital revenue (exclusive digital dishes sold as NFTs); Starbucks Odyssey generated $50M+ in NFT trades; NFT menu types = exclusive dish NFT (digital-only dish, collector item), redeemable dish NFT (own NFT = redeem physical dish in restaurant), limited edition NFT (seasonal, numbered, collectible), chef signature NFT (famous chef dish, high value); NFT menu benefits = digital revenue ($50-500/dish), secondary market (NFTs tradable, additional royalty 5-10%), physical redemption (NFT holders visit physical restaurant = foot traffic), brand engagement (collectible, shareable), exclusivity (limited edition = high demand); NFT menu cost = $2k-8k setup (smart contract, artwork) + $100-300/month (platform); NFT menu ROI = $5-10 per $1 (digital revenue + redemption + engagement). Solutions ranked by impact: (1) LAUNCH NFT menu items — NFT revenue ${fmt$(expectedNftRevenue / 12)}/mo + redemption revenue ${fmt$(expectedRedemptionRevenue)}/mo + engagement ${fmt$(expectedEngagementLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(3000)} setup; payback 2-4 months; (2) CREATE ${config.minNftMenuItemsCount}+ NFT menu items (exclusive digital dishes); (3) SET price ($50-500 per dish); (4) ENABLE physical redemption (NFT holders redeem in restaurant); (5) MINT on blockchain (Polygon, Flow); (6) LIST on NFT marketplace (OpenSea); (7) ENABLE secondary market (tradable, 5-10% royalty); (8) MARKET to collectors + Gen Z; (9) TRACK items sold; (10) TRACK redemption rate; (11) BENCHMARK vs competitor NFT menu. Industry data: $50-500/dish; $50M+ Starbucks Odyssey; payback 2-4 months. Expected impact: +${fmt$(expectedNftRevenue / 12)}/mo NFT revenue, +12pts engagement, payback 2-4 months.`,
        ai_recommendation: 'launch_nft_menu_items',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: VIRTUAL_COOKING_CLASSES_ABSENT
    if (d.has_metaverse_strategy && config.requireVirtualCookingClasses && (!d.has_virtual_cooking_classes || d.virtual_cooking_sessions_monthly < config.minVirtualCookingSessionsMonthly)) {
      const sessionGap = Math.max(config.minVirtualCookingSessionsMonthly - d.virtual_cooking_sessions_monthly, 0);
      const expectedCookingRevenue = Math.round(sessionGap * (d.virtual_cooking_revenue_per_session || 75));
      const expectedEngagementLift = Math.round(baselineRevenue * 0.008);
      const expectedBrandLoyalty = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.005);
      const totalOpportunity = Math.max(expectedCookingRevenue + expectedEngagementLift + expectedBrandLoyalty + expectedCompetitiveLift, 800);
      const severityLabel = 'low';
      const criticalNote = `LOW: NO VIRTUAL COOKING CLASSES — sessions ${d.virtual_cooking_sessions_monthly}/mo (min ${config.minVirtualCookingSessionsMonthly}); revenue/session ${fmt$(d.virtual_cooking_revenue_per_session)}; revenue ${fmt$(d.virtual_cooking_revenue_monthly)}/mo; VR cooking classes = $50-200/session; 72% of Gen Z interested in metaverse (McKinsey); without VR cooking, missing engagement revenue + brand loyalty. `;
      alerts.push({
        rule_id: 'virtual_cooking_classes_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_virtual_cooking_classes: d.has_virtual_cooking_classes,
        virtual_cooking_sessions_monthly: d.virtual_cooking_sessions_monthly,
        virtual_cooking_revenue_per_session: d.virtual_cooking_revenue_per_session,
        virtual_cooking_revenue_monthly: d.virtual_cooking_revenue_monthly,
        vr_devices_supported: d.vr_devices_supported,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        virtual_revenue_projected: expectedCookingRevenue,
        engagement_lift_projected_pts: 10,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VIRTUAL COOKING CLASSES ABSENT: ${d.location_id} — virtual cooking classes ${d.has_virtual_cooking_classes ? 'present' : 'ABSENT'}; sessions ${d.virtual_cooking_sessions_monthly}/mo (min ${config.minVirtualCookingSessionsMonthly}); revenue/session ${fmt$(d.virtual_cooking_revenue_per_session)}; revenue ${fmt$(d.virtual_cooking_revenue_monthly)}/mo; devices ${d.vr_devices_supported}; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: virtual cooking classes = $50-200/session in VR (chef teaches in virtual kitchen, participants cook along in VR); 72% of Gen Z interested in metaverse experiences (McKinsey); virtual cooking class types = technique class (learn knife skills, cooking methods), cuisine class (Italian, Japanese, French), celebrity chef class (cook with famous chef in VR), team building (corporate cooking class in VR), kids cooking (family-friendly VR cooking); virtual cooking benefits = revenue ($50-200/session), engagement (interactive, hands-on), brand loyalty (customers learn from chef = deeper connection), reach (global — anyone with VR can join), upsell (ingredients kit delivered for hands-on cooking); virtual cooking cost = $2k-5k setup (VR kitchen, curriculum) + $100-300/month (platform); virtual cooking ROI = $5-8 per $1 (session revenue + engagement + loyalty). Solutions ranked by impact: (1) LAUNCH virtual cooking classes — cooking revenue ${fmt$(expectedCookingRevenue)}/mo + engagement ${fmt$(expectedEngagementLift)}/mo + brand loyalty ${fmt$(expectedBrandLoyalty)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(2000)} setup; payback 2-4 months; (2) DESIGN VR kitchen (virtual cooking environment); (3) CREATE curriculum (technique, cuisine, celebrity chef); (4) SET pricing ($50-200/session); (5) OFFER ingredient kit delivery (hands-on cooking at home); (6) ENABLE social cooking (cook together with avatars); (7) TRACK sessions (target ${config.minVirtualCookingSessionsMonthly}+/mo); (8) BENCHMARK vs competitor virtual cooking. Industry data: $50-200/session; 72% Gen Z interested; payback 2-4 months. Expected impact: +${fmt$(expectedCookingRevenue)}/mo cooking revenue, +10pts engagement, payback 2-4 months.`,
        ai_recommendation: 'launch_virtual_cooking_classes',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: AVATAR_SOCIAL_DINING_ABSENT
    if (d.has_metaverse_strategy && config.requireAvatarSocialDining && (!d.has_avatar_social_dining || d.avatar_dining_sessions_monthly < config.minAvatarDiningSessionsMonthly)) {
      const sessionGap = Math.max(config.minAvatarDiningSessionsMonthly - d.avatar_dining_sessions_monthly, 0);
      const expectedEngagementRevenue = Math.round(sessionGap * (d.avatar_dining_participants_avg || 10) * 15);
      const expectedSocialMediaValue = Math.round(baselineRevenue * 0.01);
      const expectedRetentionLift = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.005);
      const totalOpportunity = Math.max(expectedEngagementRevenue + expectedSocialMediaValue + expectedRetentionLift + expectedCompetitiveLift, 800);
      const severityLabel = 'low';
      const criticalNote = `LOW: NO AVATAR SOCIAL DINING — sessions ${d.avatar_dining_sessions_monthly}/mo (min ${config.minAvatarDiningSessionsMonthly}); participants avg ${d.avatar_dining_participants_avg}; engagement ${d.avatar_dining_engagement_score}/100; avatar dining = social VR (customers' avatars eat together virtually); without avatar dining, missing social VR engagement + retention. `;
      alerts.push({
        rule_id: 'avatar_social_dining_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_avatar_social_dining: d.has_avatar_social_dining,
        avatar_dining_sessions_monthly: d.avatar_dining_sessions_monthly,
        avatar_dining_participants_avg: d.avatar_dining_participants_avg,
        avatar_dining_engagement_score: d.avatar_dining_engagement_score,
        metaverse_platforms: d.metaverse_platforms,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        engagement_lift_projected_pts: 15,
        virtual_revenue_projected: expectedEngagementRevenue,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `AVATAR SOCIAL DINING ABSENT: ${d.location_id} — avatar social dining ${d.has_avatar_social_dining ? 'present' : 'ABSENT'}; sessions ${d.avatar_dining_sessions_monthly}/mo (min ${config.minAvatarDiningSessionsMonthly}); participants ${d.avatar_dining_participants_avg}/session; engagement ${d.avatar_dining_engagement_score}/100; platforms ${d.metaverse_platforms}; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: avatar dining = customers' avatars eat together virtually (social VR — friends/family dine together remotely through avatars); avatar dining types = friend dining (avatars of friends eat together), family dining (remote family gathers for virtual dinner), date night (couples dine virtually), corporate dining (team dinner in VR), themed dining (virtual restaurant themes — space, underwater, fantasy); avatar dining benefits = social engagement (dine with anyone, anywhere), retention (social bond = return), social media (screenshots of avatar dining = viral content), reach (global — no geographic limit), premium (charge for social VR dining experience); avatar dining cost = $2k-5k setup (VR environment) + $100-200/month (platform); avatar dining ROI = $5-8 per $1 (engagement + social media + retention). Solutions ranked by impact: (1) LAUNCH avatar social dining — engagement revenue ${fmt$(expectedEngagementRevenue)}/mo + social media ${fmt$(expectedSocialMediaValue)}/mo + retention ${fmt$(expectedRetentionLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(2000)} setup; payback 2-4 months; (2) BUILD avatar dining environment (virtual restaurant, themed); (3) ENABLE friend/family dining (avatars dine together); (4) ENABLE themed dining (space, underwater, fantasy); (5) CHARGE premium ($15-25/cover for social VR dining); (6) ENABLE screenshots (viral social media content); (7) TRACK sessions (target ${config.minAvatarDiningSessionsMonthly}+/mo); (8) TRACK engagement score (target 80+); (9) BENCHMARK vs competitor avatar dining. Industry data: social VR engagement; payback 2-4 months. Expected impact: +15pts engagement, +${fmt$(expectedEngagementRevenue)}/mo engagement revenue, payback 2-4 months.`,
        ai_recommendation: 'launch_avatar_social_dining',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: CROSS_REALITY_LOYALTY_ABSENT
    if (d.has_metaverse_strategy && config.requireCrossRealityLoyalty && (!d.has_cross_reality_loyalty || d.cross_reality_redemption_rate_pct < config.minCrossRealityRedemptionRatePct)) {
      const redemptionGap = Math.max(config.minCrossRealityRedemptionRatePct - d.cross_reality_redemption_rate_pct, 0);
      const expectedConversionRevenue = Math.round(d.cross_realty_members_count * (redemptionGap / 100) * 32);
      const expectedFootTraffic = Math.round(baselineRevenue * 0.01);
      const expectedLoyaltyLift = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedConversionRevenue + expectedFootTraffic + expectedLoyaltyLift + expectedCompetitiveLift, 800);
      const severityLabel = !d.has_cross_reality_loyalty ? 'medium' : 'low';
      const criticalNote = `MEDIUM: NO CROSS-REALITY LOYALTY — redemption rate ${d.cross_reality_redemption_rate_pct}% (min ${config.minCrossRealityRedemptionRatePct}%); virtual-to-physical conversion ${d.virtual_to_physical_conversion_pct}%; members ${d.cross_realty_members_count}; cross-reality loyalty = earn rewards in metaverse, redeem in physical; without cross-reality, virtual engagement doesn't convert to physical revenue. `;
      alerts.push({
        rule_id: 'cross_reality_loyalty_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_cross_reality_loyalty: d.has_cross_reality_loyalty,
        cross_reality_redemption_rate_pct: d.cross_reality_redemption_rate_pct,
        virtual_to_physical_conversion_pct: d.virtual_to_physical_conversion_pct,
        cross_realty_members_count: d.cross_realty_members_count,
        metaverse_platforms: d.metaverse_platforms,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        cross_reality_conversion_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CROSS-REALITY LOYALTY ABSENT: ${d.location_id} — cross-reality loyalty ${d.has_cross_reality_loyalty ? 'present' : 'ABSENT'}; redemption ${d.cross_reality_redemption_rate_pct}% (min ${config.minCrossRealityRedemptionRatePct}%); virtual-to-physical conversion ${d.virtual_to_physical_conversion_pct}%; members ${d.cross_realty_members_count}; platforms ${d.metaverse_platforms}; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: cross-reality loyalty = earn rewards in metaverse, redeem in physical restaurant (virtual engagement converts to physical foot traffic); cross-reality loyalty types = virtual reward -> physical redemption (earn virtual tokens, redeem for physical dish), NFT -> physical (own NFT, redeem in restaurant), virtual achievement -> physical perk (complete VR challenge, get physical discount), virtual event -> physical coupon (attend VR event, get physical coupon); cross-reality benefits = virtual-to-physical conversion (virtual users become physical customers = foot traffic), loyalty loop (virtual engagement -> physical visit -> more virtual engagement), new customer acquisition (virtual users who never visited physical), retention (cross-reality = deeper engagement); cross-reality loyalty cost = $1k-3k setup (integration) + $100-200/month (platform); cross-reality ROI = $5-10 per $1 (conversion revenue + foot traffic + loyalty). Solutions ranked by impact: (1) IMPLEMENT cross-reality loyalty — conversion revenue ${fmt$(expectedConversionRevenue)}/mo + foot traffic ${fmt$(expectedFootTraffic)}/mo + loyalty ${fmt$(expectedLoyaltyLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(1500)} setup; payback 1-2 months; (2) INTEGRATE virtual rewards with physical POS (redeem in restaurant); (3) ENABLE virtual-to-physical redemption (earn virtual, redeem physical); (4) ENABLE NFT -> physical (NFT holders redeem); (5) ENABLE virtual achievement -> physical perk; (6) ENABLE virtual event -> physical coupon; (7) TRACK redemption rate (target ${config.minCrossRealityRedemptionRatePct}%+); (8) TRACK virtual-to-physical conversion; (9) BENCHMARK vs competitor cross-reality. Industry data: virtual-to-physical conversion; payback 1-2 months. Expected impact: +15% conversion, +${fmt$(expectedConversionRevenue)}/mo conversion revenue, payback 1-2 months.`,
        ai_recommendation: 'implement_cross_reality_loyalty',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: VIRTUAL_EVENT_HOSTING_ABSENT
    if (d.has_metaverse_strategy && config.requireVirtualEventHosting && (!d.has_virtual_event_hosting || d.virtual_events_monthly < config.minVirtualEventsMonthly)) {
      const eventGap = Math.max(config.minVirtualEventsMonthly - d.virtual_events_monthly, 0);
      const expectedEventRevenue = Math.round(eventGap * (d.virtual_event_revenue_per_event || 1000));
      const expectedBrandReach = Math.round(baselineRevenue * 0.01);
      const expectedEngagementLift = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedEventRevenue + expectedBrandReach + expectedEngagementLift + expectedCompetitiveLift, 1000);
      const severityLabel = 'medium';
      const criticalNote = `MEDIUM: NO VIRTUAL EVENT HOSTING — events ${d.virtual_events_monthly}/mo (min ${config.minVirtualEventsMonthly}); revenue/event ${fmt$(d.virtual_event_revenue_per_event)}; revenue ${fmt$(d.virtual_event_revenue_monthly)}/mo; types: ${d.virtual_event_types}; virtual events = $500-5,000/event (corporate dining, birthdays, team building in VR); without virtual events, missing high-value event revenue + brand reach. `;
      alerts.push({
        rule_id: 'virtual_event_hosting_absent',
        severity: severityLabel as any,
        location_id: d.location_id, restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting, channel: d.channel,
        has_virtual_event_hosting: d.has_virtual_event_hosting,
        virtual_events_monthly: d.virtual_events_monthly,
        virtual_event_revenue_per_event: d.virtual_event_revenue_per_event,
        virtual_event_revenue_monthly: d.virtual_event_revenue_monthly,
        virtual_event_types: d.virtual_event_types,
        metaverse_platforms: d.metaverse_platforms,
        competitor_metaverse_score: d.competitor_metaverse_score,
        monthly_revenue: d.monthly_revenue,
        virtual_revenue_projected: expectedEventRevenue,
        brand_reach_projected_pct: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `VIRTUAL EVENT HOSTING ABSENT: ${d.location_id} — virtual event hosting ${d.has_virtual_event_hosting ? 'present' : 'ABSENT'}; events ${d.virtual_events_monthly}/mo (min ${config.minVirtualEventsMonthly}); revenue/event ${fmt$(d.virtual_event_revenue_per_event)}; revenue ${fmt$(d.virtual_event_revenue_monthly)}/mo; types: ${d.virtual_event_types}; platforms ${d.metaverse_platforms}; competitor ${d.competitor_metaverse_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: virtual event hosting = $500-5,000/event (corporate dining, birthdays, team building, weddings, galas, charity events hosted in VR); virtual event types = corporate dining (company dinner in VR, team across globe), birthday parties (virtual birthday dinner), team building (VR cooking competition), weddings (virtual wedding reception), gala (charity gala in VR), product launch (virtual launch event); virtual event benefits = high revenue ($500-5k/event), global reach (attendees from anywhere), no capacity limit (unlimited attendees), no physical cost (no venue, no catering, no cleanup), brand reach (event = marketing), premium pricing (exclusive VR experience); virtual event cost = $3k-10k setup (VR venue, event management) + $200-500/event (hosting); virtual event ROI = $5-10 per $1 (event revenue + brand reach). Solutions ranked by impact: (1) LAUNCH virtual event hosting — event revenue ${fmt$(expectedEventRevenue)}/mo + brand reach ${fmt$(expectedBrandReach)}/mo + engagement ${fmt$(expectedEngagementLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(3000)} setup; payback 1-2 months; (2) BUILD VR event venue (virtual event space); (3) LAUNCH corporate dining (company dinners in VR); (4) LAUNCH birthday parties (virtual birthday dinner); (5) LAUNCH team building (VR cooking competition); (6) LAUNCH weddings/galas (virtual wedding reception); (7) SET pricing ($500-5k/event); (8) TRACK events (target ${config.minVirtualEventsMonthly}+/mo); (9) BENCHMARK vs competitor virtual events. Industry data: $500-5k/event; payback 1-2 months. Expected impact: +${fmt$(expectedEventRevenue)}/mo event revenue, +15% brand reach, payback 1-2 months.`,
        ai_recommendation: 'launch_virtual_event_hosting',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM metaverse_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE metaverse_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant metaverse and virtual dining expert. Given metaverse data, recommend ONE specific action with expected virtual revenue, Gen Z acquisition, brand reach, or engagement lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Metaverse strategy: ${a.has_metaverse_strategy ?? false} (platforms: ${a.metaverse_platforms ?? 'none'}, premium willingness ${a.metaverse_premium_willingness_pct ?? 0}%). Virtual restaurant: ${a.has_virtual_restaurant_presence ?? false} (${a.virtual_restaurant_platforms ?? 'none'}, ${a.virtual_restaurant_visits_monthly ?? 0} visits, ${fmt$(a.virtual_restaurant_revenue_monthly ?? 0)}/${fmt$(a.virtual_restaurant_target_revenue_monthly ?? 0)} target). VR dining: ${a.has_vr_dining_experience ?? false} (${a.vr_dining_covers_monthly ?? 0} covers, ${fmt$(a.vr_dining_revenue_per_cover ?? 0)}/cover, ${fmt$(a.vr_dining_revenue_monthly ?? 0)}/mo, devices: ${a.vr_devices_supported ?? 'none'}). NFT menu: ${a.has_nft_menu_items ?? false} (${a.nft_menu_items_count ?? 0} items, ${fmt$(a.nft_menu_revenue_total ?? 0)} total, ${fmt$(a.nft_menu_avg_price ?? 0)} avg, ${a.nft_menu_redemption_rate_pct ?? 0}% redemption). Virtual cooking: ${a.has_virtual_cooking_classes ?? false} (${a.virtual_cooking_sessions_monthly ?? 0} sessions, ${fmt$(a.virtual_cooking_revenue_per_session ?? 0)}/session, ${fmt$(a.virtual_cooking_revenue_monthly ?? 0)}/mo). Avatar dining: ${a.has_avatar_social_dining ?? false} (${a.avatar_dining_sessions_monthly ?? 0} sessions, ${a.avatar_dining_participants_avg ?? 0} avg, engagement ${a.avatar_dining_engagement_score ?? 0}/100). Cross-reality: ${a.has_cross_reality_loyalty ?? false} (${a.cross_reality_redemption_rate_pct ?? 0}% redemption, ${a.virtual_to_physical_conversion_pct ?? 0}% conversion, ${a.cross_realty_members_count ?? 0} members). Virtual events: ${a.has_virtual_event_hosting ?? false} (${a.virtual_events_monthly ?? 0}/mo, ${fmt$(a.virtual_event_revenue_per_event ?? 0)}/event, ${fmt$(a.virtual_event_revenue_monthly ?? 0)}/mo, types: ${a.virtual_event_types ?? 'none'}). Metaverse revenue: ${fmt$(a.metaverse_revenue_monthly ?? 0)}/mo (${a.metaverse_revenue_growth_pct ?? 0}% growth). Customer acquisition: ${a.metaverse_customer_acquisition_pct ?? 0}%. Gen Z interest: ${a.gen_z_metaverse_interest_pct ?? 0}%. Brand reach: ${a.metaverse_brand_reach_score ?? 0}/100. Competitor: ${a.competitor_metaverse_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Customers: ${a.total_customers ?? 0}. Investment: ${fmt$(a.metaverse_investment_total ?? 0)}. Operating: ${fmt$(a.metaverse_operating_cost_monthly ?? 0)}/mo. Real estate: ${fmt$(a.metaverse_real_estate_cost ?? 0)}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveMetaverseAlerts = async (db: ReturnType<typeof useDB>): Promise<MetaverseAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM metaverse_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getMetaverseSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  metaverseStrategyAbsentCount: number;
  virtualRestaurantPresenceAbsentCount: number;
  vrDiningExperienceAbsentCount: number;
  nftMenuItemsAbsentCount: number;
  virtualCookingClassesAbsentCount: number;
  avatarSocialDiningAbsentCount: number;
  crossRealityLoyaltyAbsentCount: number;
  virtualEventHostingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'metaverse_strategy_absent') AS nostrategy,
              math::count(rule_id = 'virtual_restaurant_presence_absent') AS novirtualrestaurant,
              math::count(rule_id = 'vr_dining_experience_absent') AS novrdining,
              math::count(rule_id = 'nft_menu_items_absent') AS nonftmenu,
              math::count(rule_id = 'virtual_cooking_classes_absent') AS nocooking,
              math::count(rule_id = 'avatar_social_dining_absent') AS noavatardining,
              math::count(rule_id = 'cross_reality_loyalty_absent') AS nocrossreality,
              math::count(rule_id = 'virtual_event_hosting_absent') AS noevents
       FROM metaverse_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      metaverseStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      virtualRestaurantPresenceAbsentCount: safeNumber(r.novirtualrestaurant, 0),
      vrDiningExperienceAbsentCount: safeNumber(r.novrdining, 0),
      nftMenuItemsAbsentCount: safeNumber(r.nonftmenu, 0),
      virtualCookingClassesAbsentCount: safeNumber(r.nocooking, 0),
      avatarSocialDiningAbsentCount: safeNumber(r.noavatardining, 0),
      crossRealityLoyaltyAbsentCount: safeNumber(r.nocrossreality, 0),
      virtualEventHostingAbsentCount: safeNumber(r.noevents, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, metaverseStrategyAbsentCount: 0, virtualRestaurantPresenceAbsentCount: 0, vrDiningExperienceAbsentCount: 0, nftMenuItemsAbsentCount: 0, virtualCookingClassesAbsentCount: 0, avatarSocialDiningAbsentCount: 0, crossRealityLoyaltyAbsentCount: 0, virtualEventHostingAbsentCount: 0 };
  }
};

export const updateMetaverseAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
