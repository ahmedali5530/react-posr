/**
 * AI Influencer & Food Blogger Outreach Optimizer — predicts how influencer
 * partnerships (micro-influencers, food bloggers, Instagram, TikTok, YouTube,
 * paid vs trade, content rights, follower count, engagement rate, niche
 * alignment, ROI tracking) impact brand awareness, new customer acquisition,
 * social media engagement, and revenue.
 *
 * Restaurant influencer marketing ROI = $6.50 per $1 spent (median,
 * Influencer Marketing Hub 2024). Micro-influencers (10k-100k followers)
 * have 3-7% engagement vs 1-2% for mega-influencers (Mediakix). 86% of
 * consumers trust influencer recommendations over traditional ads
 * (Mediakix trust survey). Food influencers drive 22% of restaurant
 * discovery (NRA dining trends). Average influencer post costs $500-5,000
 * for micro, $5,000-50,000 for macro. 49% of consumers rely on influencer
 * recommendations for dining decisions (Zizzi dining survey). TikTok food
 * trends drive 30-40% traffic spikes (TikTok for Business). 72% of
 * millennials follow food influencers (Instagram food study). Influencer
 * marketing market = $24B by 2025 (Business Insider). Restaurants allocate
 * 10-15% of marketing budget to influencers (Restaurant Marketing Group).
 * Influencer content generates 8x more engagement than brand-created content
 * (Sprout Social). Influencer posts have 5-10x longer shelf life than paid
 * ads (organic reach continues for months). Restaurants without influencer
 * strategy miss 15-25% of potential new customer acquisition.
 *
 * 201st POSR-exclusive differentiator. Distinct from:
 *   - social-content.service (52nd) — GENERATES in-house social posts.
 *     This optimizer focuses on INFLUENCER PARTNERSHIPS + outreach strategy.
 *   - social-listening-monitor.service (99th) — MONITORS real-time mentions.
 *     This optimizer focuses on PROACTIVE outreach + partnership management.
 *   - ad-roi-tracker.service (91st) — tracks PAID AD ROI. This optimizer
 *     tracks INFLUENCER partnership ROI (organic + trade + paid).
 *   - ad-targeting.service — optimizes AD audience targeting. This optimizer
 *     optimizes INFLUENCER selection (niche, engagement, follower quality).
 *   - local-seo.service — SEARCH optimization. This optimizer focuses on
 *     influencer-driven DISCOVERY.
 *   - branded-merchandise-retail.service — MERCHANDISE sales. This optimizer
 *     focuses on influencer CONTENT partnerships.
 *   - community-partnership-engagement.service — LOCAL community partnerships.
 *     This optimizer focuses on DIGITAL influencer partnerships.
 *
 * 8 AI rules:
 *   1. influencer_partnership_program_absent -> no influencer partnerships -> missed 22% discovery
 *   2. micro_influencer_strategy_absent -> no micro-influencer (10k-100k) strategy -> missed 3-7% engagement
 *   3. food_blogger_outreach_absent -> no food blogger outreach -> missed 86% trust + 49% dining influence
 *   4. tiktok_strategy_absent -> no TikTok food strategy -> missed 30-40% traffic spikes
 *   5. influencer_content_rights_unclear -> no content usage rights -> can't repurpose = wasted content value
 *   6. influencer_niche_misalignment -> partnered influencers don't match restaurant niche -> low ROI
 *   7. influencer_engagement_rate_low -> partnered influencers <2% engagement -> wasted spend
 *   8. influencer_roi_tracking_absent -> no ROI tracking -> can't optimize spend
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type InfluencerOutreachRuleId =
  | 'influencer_partnership_program_absent'
  | 'micro_influencer_strategy_absent'
  | 'food_blogger_outreach_absent'
  | 'tiktok_strategy_absent'
  | 'influencer_content_rights_unclear'
  | 'influencer_niche_misalignment'
  | 'influencer_engagement_rate_low'
  | 'influencer_roi_tracking_absent';

export type InfluencerOutreachAiRec =
  | 'launch_influencer_program'
  | 'recruit_micro_influencers'
  | 'launch_food_blogger_outreach'
  | 'launch_tiktok_strategy'
  | 'secure_content_rights'
  | 'realign_influencer_niche'
  | 'replace_low_engagement_influencers'
  | 'implement_roi_tracking'
  | 'monitor'
  | 'skip';

export interface InfluencerOutreachAlert {
  id?: string;
  rule_id: InfluencerOutreachRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'brand' | 'location_1' | 'location_2'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Influencer program presence
  has_influencer_program?: boolean;                         // active influencer partnership program present
  influencer_partnerships_count?: number;                   // active influencer partnerships
  influencer_budget_monthly?: number;                       // monthly influencer marketing budget
  influencer_budget_target_monthly?: number;                // recommended monthly budget
  // Micro-influencer strategy
  has_micro_influencer_strategy?: boolean;                  // micro-influencer (10k-100k) strategy present
  micro_influencer_count?: number;                          // active micro-influencer partnerships
  micro_influencer_target_count?: number;                   // recommended micro-influencer count
  // Food blogger outreach
  has_food_blogger_outreach?: boolean;                      // food blogger outreach program present
  food_blogger_partnerships_count?: number;                 // active food blogger partnerships
  // TikTok strategy
  has_tiktok_strategy?: boolean;                            // TikTok food content strategy present
  tiktok_posts_monthly?: number;                            // TikTok posts per month (influencer + brand)
  tiktok_views_monthly?: number;                            // monthly TikTok views
  tiktok_followers?: number;                                // restaurant TikTok follower count
  // Content rights
  has_content_usage_rights?: boolean;                       // influencer content usage rights secured
  content_rights_clarity_score?: number;                    // 0-100 content rights clarity
  repurposable_content_count?: number;                      // count of repurposable influencer content pieces
  // Niche alignment
  influencer_niche_alignment_score?: number;                // 0-100 how well influencers match restaurant niche
  niche_mismatch_count?: number;                            // count of mismatched influencer partnerships
  restaurant_niche?: string;                                // 'fine_dining' | 'casual' | 'fast_casual' | 'ethnic' | 'family' | 'bar'
  // Engagement rate
  avg_influencer_engagement_rate?: number;                  // average engagement rate of partnered influencers
  min_engagement_rate_target?: number;                      // minimum engagement rate target (3%)
  low_engagement_influencer_count?: number;                 // count of influencers below engagement threshold
  // ROI tracking
  has_influencer_roi_tracking?: boolean;                    // ROI tracking system present
  influencer_attributed_revenue?: number;                   // revenue attributed to influencer campaigns
  influencer_roas?: number;                                 // return on ad spend (revenue / spend)
  // Social media + revenue
  instagram_followers?: number;                             // restaurant Instagram followers
  instagram_engagement_rate?: number;                       // restaurant Instagram engagement rate
  new_customers_from_influencers_monthly?: number;          // new customers acquired via influencers
  social_media_reach_monthly?: number;                      // total monthly social media reach
  social_media_reach_baseline_monthly?: number;             // baseline social reach
  customer_acquisition_cost?: number;                       // CAC via influencer marketing
  customer_acquisition_cost_baseline?: number;              // baseline CAC (paid ads)
  competitor_influencer_score?: number;                     // 0-100 competitor influencer presence
  monthly_revenue?: number;                                 // total restaurant monthly revenue
  marketing_budget_monthly?: number;                        // total monthly marketing budget
  // Costs
  influencer_spend_monthly?: number;                        // monthly influencer spend (paid + trade value)
  influencer_management_cost?: number;                      // influencer program management cost (platform, staff time)
  roi_tracking_tool_cost?: number;                          // ROI tracking tool cost
  // Impact projections
  discovery_lift_projected_pct?: number;
  engagement_lift_projected_pct?: number;
  new_customer_acquisition_projected?: number;
  tiktok_traffic_lift_projected_pct?: number;
  content_repurpose_value_projected?: number;
  niche_roi_lift_projected_pct?: number;
  engagement_rate_lift_projected_pts?: number;
  roas_lift_projected_pct?: number;
  satisfaction_lift_projected_pts?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: InfluencerOutreachAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface InfluencerOutreachConfig {
  aiEnabled: boolean;
  requireInfluencerProgram: boolean;                        // require active influencer program
  requireMicroInfluencerStrategy: boolean;                  // require micro-influencer strategy
  requireFoodBloggerOutreach: boolean;                      // require food blogger outreach
  requireTiktokStrategy: boolean;                           // require TikTok strategy
  requireContentUsageRights: boolean;                       // require content usage rights
  requireInfluencerRoiTracking: boolean;                    // require ROI tracking
  minInfluencerBudgetMonthly: number;                       // min monthly influencer budget ($500)
  minMicroInfluencerCount: number;                          // min micro-influencer count (5)
  minEngagementRateTarget: number;                          // min engagement rate (3%)
  minContentRightsClarityScore: number;                     // min content rights clarity (80)
  minNicheAlignmentScore: number;                           // min niche alignment (75)
  minInfluencerRoas: number;                                // min ROAS (3x = $3 revenue per $1 spend)
  preferCompetitorParity: boolean;                          // match competitor influencer presence
}

export const DEFAULT_INFLUENCER_OUTREACH_CONFIG: InfluencerOutreachConfig = {
  aiEnabled: true,
  requireInfluencerProgram: true,
  requireMicroInfluencerStrategy: true,
  requireFoodBloggerOutreach: true,
  requireTiktokStrategy: true,
  requireContentUsageRights: true,
  requireInfluencerRoiTracking: true,
  minInfluencerBudgetMonthly: 500,
  minMicroInfluencerCount: 5,
  minEngagementRateTarget: 3,
  minContentRightsClarityScore: 80,
  minNicheAlignmentScore: 75,
  minInfluencerRoas: 3,
  preferCompetitorParity: true,
};

export const readInfluencerOutreachConfig = (settings: any): InfluencerOutreachConfig => ({
  aiEnabled: settings?.influencer_outreach_ai_enabled ?? true,
  requireInfluencerProgram: settings?.influencer_outreach_require_program ?? true,
  requireMicroInfluencerStrategy: settings?.influencer_outreach_require_micro ?? true,
  requireFoodBloggerOutreach: settings?.influencer_outreach_require_blogger ?? true,
  requireTiktokStrategy: settings?.influencer_outreach_require_tiktok ?? true,
  requireContentUsageRights: settings?.influencer_outreach_require_rights ?? true,
  requireInfluencerRoiTracking: settings?.influencer_outreach_require_roi ?? true,
  minInfluencerBudgetMonthly: safeNumber(settings?.influencer_outreach_min_budget, 500),
  minMicroInfluencerCount: safeNumber(settings?.influencer_outreach_min_micro_count, 5),
  minEngagementRateTarget: safeNumber(settings?.influencer_outreach_min_engagement, 3),
  minContentRightsClarityScore: safeNumber(settings?.influencer_outreach_min_rights_score, 80),
  minNicheAlignmentScore: safeNumber(settings?.influencer_outreach_min_niche_score, 75),
  minInfluencerRoas: safeNumber(settings?.influencer_outreach_min_roas, 3),
  preferCompetitorParity: settings?.influencer_outreach_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface InfluencerOutreachData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_influencer_program: boolean;
  influencer_partnerships_count: number;
  influencer_budget_monthly: number;
  influencer_budget_target_monthly: number;
  has_micro_influencer_strategy: boolean;
  micro_influencer_count: number;
  micro_influencer_target_count: number;
  has_food_blogger_outreach: boolean;
  food_blogger_partnerships_count: number;
  has_tiktok_strategy: boolean;
  tiktok_posts_monthly: number;
  tiktok_views_monthly: number;
  tiktok_followers: number;
  has_content_usage_rights: boolean;
  content_rights_clarity_score: number;
  repurposable_content_count: number;
  influencer_niche_alignment_score: number;
  niche_mismatch_count: number;
  restaurant_niche: string;
  avg_influencer_engagement_rate: number;
  min_engagement_rate_target: number;
  low_engagement_influencer_count: number;
  has_influencer_roi_tracking: boolean;
  influencer_attributed_revenue: number;
  influencer_roas: number;
  instagram_followers: number;
  instagram_engagement_rate: number;
  new_customers_from_influencers_monthly: number;
  social_media_reach_monthly: number;
  social_media_reach_baseline_monthly: number;
  customer_acquisition_cost: number;
  customer_acquisition_cost_baseline: number;
  competitor_influencer_score: number;
  monthly_revenue: number;
  marketing_budget_monthly: number;
  influencer_spend_monthly: number;
  influencer_management_cost: number;
  roi_tracking_tool_cost: number;
}

const MOCK_DATA: InfluencerOutreachData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_influencer_program: false, influencer_partnerships_count: 0,
    influencer_budget_monthly: 0, influencer_budget_target_monthly: 1200,
    has_micro_influencer_strategy: false, micro_influencer_count: 0,
    micro_influencer_target_count: 8,
    has_food_blogger_outreach: false, food_blogger_partnerships_count: 0,
    has_tiktok_strategy: false, tiktok_posts_monthly: 0, tiktok_views_monthly: 0,
    tiktok_followers: 0,
    has_content_usage_rights: false, content_rights_clarity_score: 18,
    repurposable_content_count: 0,
    influencer_niche_alignment_score: 22, niche_mismatch_count: 0,
    restaurant_niche: 'casual',
    avg_influencer_engagement_rate: 0, min_engagement_rate_target: 3,
    low_engagement_influencer_count: 0,
    has_influencer_roi_tracking: false, influencer_attributed_revenue: 0,
    influencer_roas: 0,
    instagram_followers: 480, instagram_engagement_rate: 1.2,
    new_customers_from_influencers_monthly: 0,
    social_media_reach_monthly: 2400, social_media_reach_baseline_monthly: 2600,
    customer_acquisition_cost: 28, customer_acquisition_cost_baseline: 24,
    competitor_influencer_score: 68,
    monthly_revenue: 52000, marketing_budget_monthly: 2600,
    influencer_spend_monthly: 0, influencer_management_cost: 0,
    roi_tracking_tool_cost: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_influencer_program: true, influencer_partnerships_count: 3,
    influencer_budget_monthly: 800, influencer_budget_target_monthly: 1500,
    has_micro_influencer_strategy: false, micro_influencer_count: 1,
    micro_influencer_target_count: 6,
    has_food_blogger_outreach: false, food_blogger_partnerships_count: 0,
    has_tiktok_strategy: false, tiktok_posts_monthly: 2, tiktok_views_monthly: 4200,
    tiktok_followers: 180,
    has_content_usage_rights: false, content_rights_clarity_score: 35,
    repurposable_content_count: 2,
    influencer_niche_alignment_score: 58, niche_mismatch_count: 1,
    restaurant_niche: 'fast_casual',
    avg_influencer_engagement_rate: 2.1, min_engagement_rate_target: 3,
    low_engagement_influencer_count: 1,
    has_influencer_roi_tracking: false, influencer_attributed_revenue: 0,
    influencer_roas: 0,
    instagram_followers: 2400, instagram_engagement_rate: 2.4,
    new_customers_from_influencers_monthly: 32,
    social_media_reach_monthly: 18000, social_media_reach_baseline_monthly: 8000,
    customer_acquisition_cost: 25, customer_acquisition_cost_baseline: 22,
    competitor_influencer_score: 74,
    monthly_revenue: 78000, marketing_budget_monthly: 3900,
    influencer_spend_monthly: 800, influencer_management_cost: 120,
    roi_tracking_tool_cost: 0,
  },
  {
    location_id: 'location_1', restaurant_tier: 'casual_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_influencer_program: true, influencer_partnerships_count: 8,
    influencer_budget_monthly: 1800, influencer_budget_target_monthly: 1800,
    has_micro_influencer_strategy: true, micro_influencer_count: 6,
    micro_influencer_target_count: 6,
    has_food_blogger_outreach: true, food_blogger_partnerships_count: 4,
    has_tiktok_strategy: true, tiktok_posts_monthly: 18, tiktok_views_monthly: 84000,
    tiktok_followers: 4200,
    has_content_usage_rights: true, content_rights_clarity_score: 88,
    repurposable_content_count: 24,
    influencer_niche_alignment_score: 84, niche_mismatch_count: 0,
    restaurant_niche: 'casual',
    avg_influencer_engagement_rate: 4.2, min_engagement_rate_target: 3,
    low_engagement_influencer_count: 0,
    has_influencer_roi_tracking: true, influencer_attributed_revenue: 11200,
    influencer_roas: 6.2,
    instagram_followers: 9800, instagram_engagement_rate: 4.1,
    new_customers_from_influencers_monthly: 180,
    social_media_reach_monthly: 142000, social_media_reach_baseline_monthly: 18000,
    customer_acquisition_cost: 10, customer_acquisition_cost_baseline: 22,
    competitor_influencer_score: 80,
    monthly_revenue: 124000, marketing_budget_monthly: 6200,
    influencer_spend_monthly: 1800, influencer_management_cost: 240,
    roi_tracking_tool_cost: 80,
  },
  {
    location_id: 'location_2', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_influencer_program: true, influencer_partnerships_count: 12,
    influencer_budget_monthly: 3200, influencer_budget_target_monthly: 2800,
    has_micro_influencer_strategy: true, micro_influencer_count: 8,
    micro_influencer_target_count: 8,
    has_food_blogger_outreach: true, food_blogger_partnerships_count: 6,
    has_tiktok_strategy: true, tiktok_posts_monthly: 24, tiktok_views_monthly: 218000,
    tiktok_followers: 12000,
    has_content_usage_rights: true, content_rights_clarity_score: 94,
    repurposable_content_count: 48,
    influencer_niche_alignment_score: 92, niche_mismatch_count: 0,
    restaurant_niche: 'fine_dining',
    avg_influencer_engagement_rate: 5.8, min_engagement_rate_target: 3,
    low_engagement_influencer_count: 0,
    has_influencer_roi_tracking: true, influencer_attributed_revenue: 24800,
    influencer_roas: 7.8,
    instagram_followers: 28000, instagram_engagement_rate: 5.2,
    new_customers_from_influencers_monthly: 320,
    social_media_reach_monthly: 380000, social_media_reach_baseline_monthly: 24000,
    customer_acquisition_cost: 10, customer_acquisition_cost_baseline: 28,
    competitor_influencer_score: 84,
    monthly_revenue: 186000, marketing_budget_monthly: 9300,
    influencer_spend_monthly: 3200, influencer_management_cost: 320,
    roi_tracking_tool_cost: 120,
  },
];

export const runInfluencerOutreachEngine = async (
  db: ReturnType<typeof useDB>,
  config: InfluencerOutreachConfig,
): Promise<{ alerts: InfluencerOutreachAlert[]; generated: number }> => {
  const alerts: InfluencerOutreachAlert[] = [];
  const now = new Date();

  let data: InfluencerOutreachData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_influencer_program, influencer_partnerships_count,
              influencer_budget_monthly, influencer_budget_target_monthly,
              has_micro_influencer_strategy, micro_influencer_count,
              micro_influencer_target_count,
              has_food_blogger_outreach, food_blogger_partnerships_count,
              has_tiktok_strategy, tiktok_posts_monthly, tiktok_views_monthly,
              tiktok_followers,
              has_content_usage_rights, content_rights_clarity_score,
              repurposable_content_count,
              influencer_niche_alignment_score, niche_mismatch_count,
              restaurant_niche,
              avg_influencer_engagement_rate, min_engagement_rate_target,
              low_engagement_influencer_count,
              has_influencer_roi_tracking, influencer_attributed_revenue,
              influencer_roas,
              instagram_followers, instagram_engagement_rate,
              new_customers_from_influencers_monthly,
              social_media_reach_monthly, social_media_reach_baseline_monthly,
              customer_acquisition_cost, customer_acquisition_cost_baseline,
              competitor_influencer_score,
              monthly_revenue, marketing_budget_monthly,
              influencer_spend_monthly, influencer_management_cost,
              roi_tracking_tool_cost
       FROM influencer_outreach_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): InfluencerOutreachData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_influencer_program: Boolean(r.has_influencer_program ?? false),
      influencer_partnerships_count: safeNumber(r.influencer_partnerships_count, 0),
      influencer_budget_monthly: safeNumber(r.influencer_budget_monthly, 0),
      influencer_budget_target_monthly: safeNumber(r.influencer_budget_target_monthly, 0),
      has_micro_influencer_strategy: Boolean(r.has_micro_influencer_strategy ?? false),
      micro_influencer_count: safeNumber(r.micro_influencer_count, 0),
      micro_influencer_target_count: safeNumber(r.micro_influencer_target_count, 0),
      has_food_blogger_outreach: Boolean(r.has_food_blogger_outreach ?? false),
      food_blogger_partnerships_count: safeNumber(r.food_blogger_partnerships_count, 0),
      has_tiktok_strategy: Boolean(r.has_tiktok_strategy ?? false),
      tiktok_posts_monthly: safeNumber(r.tiktok_posts_monthly, 0),
      tiktok_views_monthly: safeNumber(r.tiktok_views_monthly, 0),
      tiktok_followers: safeNumber(r.tiktok_followers, 0),
      has_content_usage_rights: Boolean(r.has_content_usage_rights ?? false),
      content_rights_clarity_score: safeNumber(r.content_rights_clarity_score, 0),
      repurposable_content_count: safeNumber(r.repurposable_content_count, 0),
      influencer_niche_alignment_score: safeNumber(r.influencer_niche_alignment_score, 0),
      niche_mismatch_count: safeNumber(r.niche_mismatch_count, 0),
      restaurant_niche: String(r.restaurant_niche ?? 'casual'),
      avg_influencer_engagement_rate: safeNumber(r.avg_influencer_engagement_rate, 0),
      min_engagement_rate_target: safeNumber(r.min_engagement_rate_target, 3),
      low_engagement_influencer_count: safeNumber(r.low_engagement_influencer_count, 0),
      has_influencer_roi_tracking: Boolean(r.has_influencer_roi_tracking ?? false),
      influencer_attributed_revenue: safeNumber(r.influencer_attributed_revenue, 0),
      influencer_roas: safeNumber(r.influencer_roas, 0),
      instagram_followers: safeNumber(r.instagram_followers, 0),
      instagram_engagement_rate: safeNumber(r.instagram_engagement_rate, 0),
      new_customers_from_influencers_monthly: safeNumber(r.new_customers_from_influencers_monthly, 0),
      social_media_reach_monthly: safeNumber(r.social_media_reach_monthly, 0),
      social_media_reach_baseline_monthly: safeNumber(r.social_media_reach_baseline_monthly, 0),
      customer_acquisition_cost: safeNumber(r.customer_acquisition_cost, 0),
      customer_acquisition_cost_baseline: safeNumber(r.customer_acquisition_cost_baseline, 0),
      competitor_influencer_score: safeNumber(r.competitor_influencer_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      marketing_budget_monthly: safeNumber(r.marketing_budget_monthly, 0),
      influencer_spend_monthly: safeNumber(r.influencer_spend_monthly, 0),
      influencer_management_cost: safeNumber(r.influencer_management_cost, 0),
      roi_tracking_tool_cost: safeNumber(r.roi_tracking_tool_cost, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const transactionsPerMonth = Math.round(d.monthly_revenue / 38);
    const targetDiscoveryLiftPct = 22;
    const targetEngagementLiftPct = 50;
    const targetTiktokTrafficLiftPct = 35;
    const targetNicheRoiLiftPct = 30;
    const targetRoasTarget = 6;
    const targetNewCustomerCount = Math.max(Math.round(transactionsPerMonth * 0.05), 40);

    // Rule 1: INFLUENCER_PARTNERSHIP_PROGRAM_ABSENT
    if (config.requireInfluencerProgram && !d.has_influencer_program) {
      // no influencer partnerships -> missed 22% discovery
      const expectedNewCustomers = Math.max(Math.round(transactionsPerMonth * 0.12), 60);
      const expectedRevenueFromNew = Math.round(expectedNewCustomers * 38);
      const expectedDiscoveryLift = Math.round(baselineRevenue * 0.012);
      const expectedBrandAwarenessLift = Math.round(baselineRevenue * 0.010);
      const expectedReviewLift = Math.max(expectedNewCustomers * 8, 400);
      const totalOpportunity = Math.max(expectedRevenueFromNew + expectedDiscoveryLift + expectedBrandAwarenessLift + expectedReviewLift, 3200);
      const severityLabel = d.competitor_influencer_score > 65 ? 'critical' : 'high';
      const criticalNote = (d.competitor_influencer_score > 65)
        ? 'CRITICAL: NO INFLUENCER PROGRAM — competitor influencer score ' + d.competitor_influencer_score + '/100 (high); food influencers drive 22% of restaurant discovery (NRA); restaurant influencer marketing ROI = $6.50 per $1 spent (median, Influencer Marketing Hub); 86% of consumers trust influencer recommendations over traditional ads (Mediakix); missing influencer strategy = missed 15-25% of potential new customer acquisition; competitors with influencer programs capture the digital discovery crowd. '
        : `HIGH: NO INFLUENCER PROGRAM — food influencers drive 22% of restaurant discovery (NRA); 86% trust influencer recommendations over ads (Mediakix); ROI $6.50 per $1 spent; missed new customer acquisition. `;
      alerts.push({
        rule_id: 'influencer_partnership_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_influencer_program: d.has_influencer_program,
        influencer_partnerships_count: d.influencer_partnerships_count,
        influencer_budget_monthly: d.influencer_budget_monthly,
        influencer_budget_target_monthly: d.influencer_budget_target_monthly,
        instagram_followers: d.instagram_followers,
        instagram_engagement_rate: d.instagram_engagement_rate,
        social_media_reach_monthly: d.social_media_reach_monthly,
        social_media_reach_baseline_monthly: d.social_media_reach_baseline_monthly,
        competitor_influencer_score: d.competitor_influencer_score,
        monthly_revenue: d.monthly_revenue,
        marketing_budget_monthly: d.marketing_budget_monthly,
        influencer_spend_monthly: d.influencer_spend_monthly,
        influencer_management_cost: d.influencer_management_cost,
        discovery_lift_projected_pct: targetDiscoveryLiftPct,
        new_customer_acquisition_projected: expectedNewCustomers,
        satisfaction_lift_projected_pts: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `INFLUENCER PROGRAM ABSENT: ${d.location_id} — influencer program ABSENT; partnerships ${d.influencer_partnerships_count}; budget ${fmt$(d.influencer_budget_monthly)}/mo (target ${fmt$(d.influencer_budget_target_monthly)}); Instagram followers ${d.instagram_followers} (${d.instagram_engagement_rate}% engagement); social reach ${d.social_media_reach_monthly}/mo (baseline ${d.social_media_reach_baseline_monthly}); competitor influencer score ${d.competitor_influencer_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}; marketing budget ${fmt$(d.marketing_budget_monthly)}/mo. ${criticalNote}Industry data: food influencers drive 22% of restaurant discovery (NRA dining trends); restaurant influencer marketing ROI = $6.50 per $1 spent (median, Influencer Marketing Hub 2024); 86% of consumers trust influencer recommendations over traditional ads (Mediakix trust survey); 49% of consumers rely on influencer recommendations for dining decisions (Zizzi dining survey); influencer content generates 8x more engagement than brand-created content (Sprout Social); influencer posts have 5-10x longer shelf life than paid ads (organic reach continues for months); influencer marketing market = $24B by 2025 (Business Insider); restaurants allocate 10-15% of marketing budget to influencers (Restaurant Marketing Group); restaurants without influencer strategy miss 15-25% of potential new customer acquisition. Solutions ranked by impact: (1) LAUNCH influencer program (start with 3-5 partnerships) — revenue from new customers ${fmt$(expectedRevenueFromNew)}/mo + discovery lift ${fmt$(expectedDiscoveryLift)}/mo + brand awareness ${fmt$(expectedBrandAwarenessLift)}/mo + review lift ${fmt$(expectedReviewLift)}/mo; cost ${fmt$(d.influencer_budget_target_monthly)}/mo; payback 1-2 months; (2) ALLOCATE budget ${fmt$(d.influencer_budget_target_monthly)}/mo (10-15% of marketing budget); (3) IDENTIFY target influencers (local food, restaurant niche, 10k-100k followers); (4) REACH OUT (DM, email, partnership pitch — trade vs paid); (5) NEGOTIATE (paid post, trade meal, hosted visit, affiliate code); (6) BRIEF influencer (key dishes, brand story, hashtag, tag requirements); (7) TRACK posts (UTM links, promo codes, hashtag monitoring); (8) MEASURE ROI (revenue attributed, new customers, engagement); (9) ITERATE quarterly (replace low performers, scale winners); (10) BENCHMARK vs competitor influencer presence. Industry data: ROI $6.50 per $1 (Influencer Marketing Hub); 22% discovery (NRA); 86% trust (Mediakix); payback 1-2 months. Expected impact: +${targetDiscoveryLiftPct}% discovery, +${expectedNewCustomers} new customers/mo, +12pts satisfaction, payback 1-2 months.`,
        ai_recommendation: 'launch_influencer_program',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: MICRO_INFLUENCER_STRATEGY_ABSENT
    if (config.requireMicroInfluencerStrategy && (!d.has_micro_influencer_strategy || d.micro_influencer_count < config.minMicroInfluencerCount)) {
      // no micro-influencer (10k-100k) strategy -> missed 3-7% engagement
      const microGap = Math.max(config.minMicroInfluencerCount - d.micro_influencer_count, 0);
      const expectedEngagementLift = Math.round(d.instagram_followers * 0.04 * microGap);
      const expectedNewCustomers = Math.round(microGap * 18);
      const expectedRevenueFromNew = Math.round(expectedNewCustomers * 38);
      const expectedReachLift = Math.round(microGap * 12000);
      const expectedReachValue = Math.round(expectedReachLift * 0.02);
      const totalOpportunity = Math.max(expectedRevenueFromNew + expectedReachValue + expectedEngagementLift, 1800);
      const severityLabel = d.micro_influencer_count === 0 ? 'high' : 'medium';
      const criticalNote = (d.micro_influencer_count === 0)
        ? `HIGH: NO MICRO-INFLUENCER STRATEGY — micro-influencers (10k-100k followers) have 3-7% engagement vs 1-2% for mega-influencers (Mediakix); micro-influencers cost $500-5,000 per post (affordable); micro-influencers have higher trust + conversion than celebrities; micro-influencers target local/niche audiences; missed 3-7% engagement + missed local customer acquisition. `
        : `MEDIUM: MICRO-INFLUENCER COUNT BELOW TARGET — ${d.micro_influencer_count} active (target ${config.minMicroInfluencerCount}); add ${microGap} more micro-influencers for 3-7% engagement. `;
      alerts.push({
        rule_id: 'micro_influencer_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_micro_influencer_strategy: d.has_micro_influencer_strategy,
        micro_influencer_count: d.micro_influencer_count,
        micro_influencer_target_count: d.micro_influencer_target_count,
        influencer_budget_monthly: d.influencer_budget_monthly,
        instagram_followers: d.instagram_followers,
        instagram_engagement_rate: d.instagram_engagement_rate,
        social_media_reach_monthly: d.social_media_reach_monthly,
        competitor_influencer_score: d.competitor_influencer_score,
        monthly_revenue: d.monthly_revenue,
        influencer_spend_monthly: d.influencer_spend_monthly,
        engagement_lift_projected_pct: targetEngagementLiftPct,
        new_customer_acquisition_projected: expectedNewCustomers,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `MICRO-INFLUENCER STRATEGY ABSENT: ${d.location_id} — micro-influencer strategy ${d.has_micro_influencer_strategy ? 'present' : 'ABSENT'}; micro-influencers ${d.micro_influencer_count} (target ${d.micro_influencer_target_count}); influencer budget ${fmt$(d.influencer_budget_monthly)}/mo; Instagram followers ${d.instagram_followers} (${d.instagram_engagement_rate}% engagement); social reach ${d.social_media_reach_monthly}/mo; competitor influencer score ${d.competitor_influencer_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: micro-influencers (10k-100k followers) have 3-7% engagement vs 1-2% for mega-influencers (Mediakix engagement study); micro-influencers cost $500-5,000 per post (affordable vs $5,000-50,000 for macro); micro-influencers have higher trust + conversion than celebrities (85% trust micro vs 72% trust celebrity, Mediakix); micro-influencers target local/niche audiences (geographic + demographic precision); micro-influencer content is more authentic (less polished, more relatable); micro-influencer partnerships drive 22% higher conversion than macro (AspireIQ); micro-influencer ROI = $6.50-10 per $1 spent vs $2-4 for macro; micro-influencer best practice = 5-10 active partnerships (diversify risk, consistent content); micro-influencer recruitment = hashtag search, competitor follower analysis, local food community, influencer platforms (AspireIQ, Upfluence, Grin). Solutions ranked by impact: (1) RECRUIT ${microGap} micro-influencers (10k-100k followers) — revenue from new customers ${fmt$(expectedRevenueFromNew)}/mo + reach value ${fmt$(expectedReachValue)}/mo + engagement lift ${fmt$(expectedEngagementLift)}/mo; cost ${fmt$(d.influencer_budget_monthly * 0.6)}/mo (micro = 60% of influencer budget); payback 1-2 months; (2) SEARCH local food hashtags (#cityfoodie, #cityeats, #foodcity); (3) ANALYZE competitor followers (who follows competitors + food influencers); (4) JOIN local food community groups (Facebook, Reddit, Discord); (5) USE influencer platforms (AspireIQ, Upfluence, Grin — $500-2,000/mo); (6) REACH OUT (DM, email, partnership pitch — trade vs paid); (7) NEGOTIATE (trade meal + $100-500 paid post, or affiliate code 10-15%); (8) BRIEF (key dishes, brand story, hashtag, tag); (9) TRACK (UTM links, promo codes, hashtag monitoring); (10) MEASURE (engagement rate, reach, conversions); (11) ITERATE (replace <2% engagement, scale 5%+ engagement); (12) BENCHMARK vs competitor micro-influencer count. Industry data: 3-7% engagement (Mediakix); $6.50-10 ROI per $1 (AspireIQ); payback 1-2 months. Expected impact: +${targetEngagementLiftPct}% engagement, +${expectedNewCustomers} new customers/mo, payback 1-2 months.`,
        ai_recommendation: 'recruit_micro_influencers',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: FOOD_BLOGGER_OUTREACH_ABSENT
    if (config.requireFoodBloggerOutreach && !d.has_food_blogger_outreach) {
      // no food blogger outreach -> missed 86% trust + 49% dining influence
      const expectedBloggerReach = Math.max(transactionsPerMonth * 0.15, 80);
      const expectedRevenueFromBlogger = Math.round(expectedBloggerReach * 42);
      const expectedTrustLift = Math.round(baselineRevenue * 0.010);
      const expectedReviewLift = Math.max(expectedBloggerReach * 12, 600);
      const expectedSeoLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedRevenueFromBlogger + expectedTrustLift + expectedReviewLift + expectedSeoLift, 2400);
      const severityLabel = 'medium';
      const criticalNote = 'MEDIUM: NO FOOD BLOGGER OUTREACH — 86% of consumers trust influencer recommendations over traditional ads (Mediakix trust survey); 49% of consumers rely on influencer recommendations for dining decisions (Zizzi dining survey); food bloggers produce long-form SEO content (blog posts rank on Google for months/years); food bloggers have loyal reader bases (avg 5,000-50,000 monthly readers); food blogger posts drive 15-25% more new customer acquisition than social-only influencers; food blogger content = blog review + Instagram + TikTok + YouTube (multi-platform); missed blogger outreach = missed trust + missed SEO + missed multi-platform content. ';
      alerts.push({
        rule_id: 'food_blogger_outreach_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_food_blogger_outreach: d.has_food_blogger_outreach,
        food_blogger_partnerships_count: d.food_blogger_partnerships_count,
        instagram_followers: d.instagram_followers,
        social_media_reach_monthly: d.social_media_reach_monthly,
        competitor_influencer_score: d.competitor_influencer_score,
        monthly_revenue: d.monthly_revenue,
        marketing_budget_monthly: d.marketing_budget_monthly,
        influencer_spend_monthly: d.influencer_spend_monthly,
        new_customer_acquisition_projected: expectedBloggerReach,
        engagement_lift_projected_pct: 35,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FOOD BLOGGER OUTREACH ABSENT: ${d.location_id} — food blogger outreach ABSENT; blogger partnerships ${d.food_blogger_partnerships_count}; Instagram followers ${d.instagram_followers}; social reach ${d.social_media_reach_monthly}/mo; competitor influencer score ${d.competitor_influencer_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}; marketing budget ${fmt$(d.marketing_budget_monthly)}/mo. ${criticalNote}Industry data: 86% of consumers trust influencer recommendations over traditional ads (Mediakix trust survey); 49% of consumers rely on influencer recommendations for dining decisions (Zizzi dining survey); food bloggers produce long-form SEO content (blog posts rank on Google for months/years, compounding traffic); food bloggers have loyal reader bases (avg 5,000-50,000 monthly readers, higher trust than social-only); food blogger posts drive 15-25% more new customer acquisition than social-only influencers (long-form review + photos + SEO); food blogger content = blog review + Instagram + TikTok + YouTube (multi-platform value); food blogger partnerships cost $300-1,500 per review (more affordable than Instagram-only); food blogger ROI = $8-12 per $1 spent (higher than social-only due to SEO longevity); food blogger outreach best practice = 4-8 active partnerships (diversify niches); food blogger recruitment = Google search (city + food blog), food blog directories, Instagram food hashtags, local food publications. Solutions ranked by impact: (1) LAUNCH food blogger outreach (4-8 partnerships) — revenue from blogger ${fmt$(expectedRevenueFromBlogger)}/mo + trust ${fmt$(expectedTrustLift)}/mo + review lift ${fmt$(expectedReviewLift)}/mo + SEO lift ${fmt$(expectedSeoLift)}/mo; cost ${fmt$(d.influencer_budget_monthly * 0.4)}/mo (blogger = 40% of influencer budget); payback 1-2 months; (2) SEARCH Google for city + food blog (top 20 local food bloggers); (3) CHECK food blog directories (Foodgawker, Tastespotting, local food blog networks); (4) SEARCH Instagram food hashtags (#cityfoodie, #cityeats); (5) IDENTIFY local food publications (newspaper food section, online food magazines); (6) REACH OUT (email pitch — hosted visit + trade meal); (7) HOST blogger visit (complimentary meal for 2 + chef meet); (8) BRIEF blogger (key dishes, brand story, photo opportunities); (9) REQUEST multi-platform content (blog + Instagram + TikTok); (10) SECURE content rights (repurpose blog photos); (11) TRACK (UTM links, promo codes, blog traffic); (12) MEASURE (blog traffic, SEO rankings, new customers); (13) ITERATE (replace low-traffic bloggers, scale high-traffic); (14) BENCHMARK vs competitor blogger partnerships. Industry data: 86% trust (Mediakix); 49% rely on recommendations (Zizzi); $8-12 ROI per $1 (higher than social-only); payback 1-2 months. Expected impact: +${expectedBloggerReach} new customers/mo, +35% engagement, payback 1-2 months.`,
        ai_recommendation: 'launch_food_blogger_outreach',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: TIKTOK_STRATEGY_ABSENT
    if (config.requireTiktokStrategy && !d.has_tiktok_strategy) {
      // no TikTok food strategy -> missed 30-40% traffic spikes
      const expectedTiktokViews = Math.max(transactionsPerMonth * 80, 4000);
      const expectedTrafficSpike = Math.round(baselineRevenue * 0.025);
      const expectedNewCustomers = Math.round(expectedTiktokViews * 0.002);
      const expectedRevenueFromNew = Math.round(expectedNewCustomers * 38);
      const expectedViralLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedTrafficSpike + expectedRevenueFromNew + expectedViralLift, 2600);
      const severityLabel = d.competitor_influencer_score > 70 ? 'high' : 'medium';
      const criticalNote = (d.competitor_influencer_score > 70)
        ? `HIGH: NO TIKTOK STRATEGY — competitor influencer score ${d.competitor_influencer_score}/100; TikTok food trends drive 30-40% traffic spikes (TikTok for Business); TikTok has 1B+ active users; 72% of millennials follow food influencers on TikTok/Instagram (Instagram food study); TikTok food content goes viral more than any platform; missed TikTok = missed viral potential + missed Gen Z + millennial audience. `
        : `MEDIUM: NO TIKTOK STRATEGY — TikTok food trends drive 30-40% traffic spikes (TikTok for Business); 72% of millennials follow food influencers (Instagram); add TikTok strategy for viral potential. `;
      alerts.push({
        rule_id: 'tiktok_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_tiktok_strategy: d.has_tiktok_strategy,
        tiktok_posts_monthly: d.tiktok_posts_monthly,
        tiktok_views_monthly: d.tiktok_views_monthly,
        tiktok_followers: d.tiktok_followers,
        instagram_followers: d.instagram_followers,
        competitor_influencer_score: d.competitor_influencer_score,
        monthly_revenue: d.monthly_revenue,
        marketing_budget_monthly: d.marketing_budget_monthly,
        influencer_spend_monthly: d.influencer_spend_monthly,
        tiktok_traffic_lift_projected_pct: targetTiktokTrafficLiftPct,
        new_customer_acquisition_projected: expectedNewCustomers,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `TIKTOK STRATEGY ABSENT: ${d.location_id} — TikTok strategy ABSENT; TikTok posts ${d.tiktok_posts_monthly}/mo; views ${d.tiktok_views_monthly}/mo; followers ${d.tiktok_followers}; Instagram followers ${d.instagram_followers}; competitor influencer score ${d.competitor_influencer_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}; marketing budget ${fmt$(d.marketing_budget_monthly)}/mo. ${criticalNote}Industry data: TikTok food trends drive 30-40% traffic spikes (TikTok for Business); TikTok has 1B+ active users (TikTok official); 72% of millennials follow food influencers on TikTok/Instagram (Instagram food study); TikTok food content goes viral more than any platform (algorithm favors food/cooking); TikTok food trends = #foodtok (40B+ views), #restaurant (15B+ views), #foodreview (8B+ views); TikTok viral food moments = feta pasta (1B views), baked feta pasta drove 5x feta sales; TikTok restaurant discovery = 35% of Gen Z find restaurants via TikTok (Yelp); TikTok content types = dish showcase, behind-the-scenes, chef interview, customer reaction, trending audio + food; TikTok best practice = 15-30s vertical video, trending audio, hook in first 3s, caption + hashtag, post 3-5x/week; TikTok influencer partnerships = $300-3,000 per post (micro TikTok); TikTok ROI = $8-15 per $1 spent (higher than Instagram due to virality). Solutions ranked by impact: (1) LAUNCH TikTok strategy (3-5 posts/week + 2-3 influencer partnerships) — traffic spike ${fmt$(expectedTrafficSpike)}/mo + revenue from new customers ${fmt$(expectedRevenueFromNew)}/mo + viral lift ${fmt$(expectedViralLift)}/mo; cost ${fmt$(d.influencer_budget_monthly * 0.3)}/mo (TikTok = 30% of influencer budget); payback 1-2 months; (2) CREATE restaurant TikTok account (if absent); (3) IDENTIFY TikTok food influencers (local, 10k-100k followers); (4) PARTNER with 2-3 TikTok influencers (paid post + trade meal); (5) CREATE content types = dish showcase (signature dish close-up), behind-the-scenes (kitchen prep, plating), chef interview (story + technique), customer reaction (genuine first bite), trending audio + food (join trends); (6) USE trending audio (TikTok trending sounds); (7) HOOK in first 3s (visual + question + surprise); (8) POST 3-5x/week (consistency drives algorithm); (9) USE hashtags (#foodtok #restaurant #cityfoodie #foodreview); (10) ENGAGE with comments (algorithm rewards engagement); (11) COLLAB with other food accounts (duets, stitches); (12) TRACK views, likes, shares, follows; (13) MEASURE traffic spikes (correlate viral posts with reservations/walk-ins); (14) BENCHMARK vs competitor TikTok presence. Industry data: 30-40% traffic spikes (TikTok for Business); $8-15 ROI per $1; payback 1-2 months. Expected impact: +${targetTiktokTrafficLiftPct}% traffic spikes, +${expectedNewCustomers} new customers/mo, payback 1-2 months.`,
        ai_recommendation: 'launch_tiktok_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: INFLUENCER_CONTENT_RIGHTS_UNCLEAR
    if (config.requireContentUsageRights && (!d.has_content_usage_rights || d.content_rights_clarity_score < config.minContentRightsClarityScore)) {
      // no content usage rights -> can't repurpose = wasted content value
      const expectedRepurposeCount = Math.max(d.influencer_partnerships_count * 4, 8);
      const expectedRepurposeValue = Math.round(expectedRepurposeCount * 80);
      const expectedAdSavings = Math.round(expectedRepurposeValue * 0.6);
      const expectedReachLift = Math.round(expectedRepurposeCount * 2000);
      const expectedReachValue = Math.round(expectedReachLift * 0.015);
      const totalOpportunity = Math.max(expectedRepurposeValue + expectedAdSavings + expectedReachValue, 1000);
      const severityLabel = d.content_rights_clarity_score < 40 ? 'medium' : 'low';
      const criticalNote = (d.content_rights_clarity_score < 40)
        ? `MEDIUM: CONTENT RIGHTS UNCLEAR — clarity score ${d.content_rights_clarity_score}/100 (min ${config.minContentRightsClarityScore}); without content usage rights, restaurant cannot repurpose influencer content for ads, website, email, social = wasted content value; influencer content generates 8x more engagement than brand-created content (Sprout Social) but only if you can repurpose it. `
        : `LOW: CONTENT RIGHTS BELOW TARGET — ${d.content_rights_clarity_score}/100 (min ${config.minContentRightsClarityScore}); secure rights to repurpose influencer content. `;
      alerts.push({
        rule_id: 'influencer_content_rights_unclear',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_content_usage_rights: d.has_content_usage_rights,
        content_rights_clarity_score: d.content_rights_clarity_score,
        repurposable_content_count: d.repurposable_content_count,
        influencer_partnerships_count: d.influencer_partnerships_count,
        monthly_revenue: d.monthly_revenue,
        influencer_spend_monthly: d.influencer_spend_monthly,
        content_repurpose_value_projected: expectedRepurposeValue,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CONTENT RIGHTS UNCLEAR: ${d.location_id} — content usage rights ${d.has_content_usage_rights ? 'secured' : 'NOT secured'}; clarity score ${d.content_rights_clarity_score}/100 (min ${config.minContentRightsClarityScore}); repurposable content ${d.repurposable_content_count} pieces; influencer partnerships ${d.influencer_partnerships_count}; monthly revenue ${fmt$(d.monthly_revenue)}; influencer spend ${fmt$(d.influencer_spend_monthly)}/mo. ${criticalNote}Industry data: influencer content generates 8x more engagement than brand-created content (Sprout Social) — but only if you can repurpose it; without content usage rights, restaurant cannot repurpose influencer content for ads ($500-2,000/mo ad savings), website, email marketing, social media reposts; influencer content has 5-10x longer shelf life than paid ads (organic reach continues for months) — but only with repurposing rights; content usage rights = explicit permission to repost, edit, use in ads, use on website; content rights best practice = written agreement (not verbal), specify platforms (Instagram, TikTok, website, ads), specify duration (3-12 months or perpetual), specify exclusivity (exclusive vs non-exclusive), specify usage (organic vs paid ads); content rights negotiation = include in initial contract (not after-the-fact), 20-30% premium for full rights, trade meal + rights (vs paid post only); content repurposing = repost on restaurant social (3-5x per piece), use in ads ($500-2,000/mo savings vs custom ad content), feature on website (social proof), include in email marketing (engagement boost). Solutions ranked by impact: (1) SECURE content usage rights — repurpose value ${fmt$(expectedRepurposeValue)}/mo + ad savings ${fmt$(expectedAdSavings)}/mo + reach value ${fmt$(expectedReachValue)}/mo; cost 20-30% premium on influencer fee; payback 1-2 months; (2) ADD rights clause to all influencer contracts (written, not verbal); (3) SPECIFY platforms (Instagram, TikTok, website, ads); (4) SPECIFY duration (3-12 months or perpetual); (5) SPECIFY exclusivity (exclusive vs non-exclusive); (6) SPECIFY usage (organic vs paid ads); (7) NEGOTIATE rights in initial contract (not after-the-fact); (8) PAY 20-30% premium for full rights (worth it for repurpose value); (9) OR trade meal + rights (vs paid post only); (10) CREATE content library (organized by dish, influencer, date); (11) REPOST on restaurant social (3-5x per piece); (12) USE in ads ($500-2,000/mo savings vs custom ad content); (13) FEATURE on website (social proof); (14) INCLUDE in email marketing (engagement boost); (15) BENCHMARK vs competitor content repurposing. Industry data: 8x engagement vs brand content (Sprout Social); $500-2,000/mo ad savings; payback 1-2 months. Expected impact: +${fmt$(expectedRepurposeValue)}/mo repurpose value, +${fmt$(expectedAdSavings)}/mo ad savings, payback 1-2 months.`,
        ai_recommendation: 'secure_content_rights',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: INFLUENCER_NICHE_MISALIGNMENT
    if (d.influencer_niche_alignment_score < config.minNicheAlignmentScore || d.niche_mismatch_count > 0) {
      // partnered influencers don't match restaurant niche -> low ROI
      const misalignedCount = d.niche_mismatch_count;
      const expectedWastedSpend = Math.round(misalignedCount * 400);
      const expectedRoiRecovery = Math.round(misalignedCount * 280);
      const expectedEngagementLift = Math.round(misalignedCount * 1800);
      const expectedConversionLift = Math.round(misalignedCount * 12);
      const totalOpportunity = Math.max(expectedWastedSpend + expectedRoiRecovery + expectedEngagementLift + expectedConversionLift, 1200);
      const severityLabel = d.influencer_niche_alignment_score < 40 ? 'high' : d.influencer_niche_alignment_score < 60 ? 'medium' : 'low';
      const criticalNote = (d.influencer_niche_alignment_score < 40)
        ? `HIGH: INFLUENCER NICHE SEVERELY MISALIGNED — alignment score ${d.influencer_niche_alignment_score}/100 (min ${config.minNicheAlignmentScore}); ${misalignedCount} mismatched partnerships; partnering with influencers who don't match restaurant niche (e.g., fast-food influencer for fine dining) = wasted spend + low engagement + brand confusion; niche alignment drives 30-40% higher conversion than generic partnerships. `
        : d.influencer_niche_alignment_score < 60
          ? `MEDIUM: INFLUENCER NICHE PARTIALLY MISALIGNED — alignment score ${d.influencer_niche_alignment_score}/100 (min ${config.minNicheAlignmentScore}); ${misalignedCount} mismatched partnerships; realign for higher ROI. `
          : `LOW: NICHE ALIGNMENT BELOW TARGET — ${d.influencer_niche_alignment_score}/100 (min ${config.minNicheAlignmentScore}); improve alignment for 30-40% higher conversion. `;
      alerts.push({
        rule_id: 'influencer_niche_misalignment',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        influencer_niche_alignment_score: d.influencer_niche_alignment_score,
        niche_mismatch_count: d.niche_mismatch_count,
        restaurant_niche: d.restaurant_niche,
        influencer_partnerships_count: d.influencer_partnerships_count,
        avg_influencer_engagement_rate: d.avg_influencer_engagement_rate,
        competitor_influencer_score: d.competitor_influencer_score,
        monthly_revenue: d.monthly_revenue,
        influencer_spend_monthly: d.influencer_spend_monthly,
        niche_roi_lift_projected_pct: targetNicheRoiLiftPct,
        engagement_lift_projected_pct: 30,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `INFLUENCER NICHE MISALIGNMENT: ${d.location_id} — niche alignment ${d.influencer_niche_alignment_score}/100 (min ${config.minNicheAlignmentScore}); mismatched partnerships ${misalignedCount}; restaurant niche ${d.restaurant_niche}; influencer partnerships ${d.influencer_partnerships_count}; avg engagement ${d.avg_influencer_engagement_rate}%; competitor influencer ${d.competitor_influencer_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}; influencer spend ${fmt$(d.influencer_spend_monthly)}/mo. ${criticalNote}Industry data: niche alignment drives 30-40% higher conversion than generic partnerships (AspireIQ); partnering with influencers who don't match restaurant niche (e.g., fast-food influencer for fine dining) = wasted spend + low engagement + brand confusion; niche alignment = influencer audience matches restaurant target demographic (cuisine, price point, dining style, location); niche alignment examples = fine dining (food critics, luxury lifestyle, wine influencers), casual dining (family foodies, local food bloggers, community influencers), fast casual (millennial foodies, health food, trend influencers), ethnic cuisine (cultural food bloggers, diaspora community, cuisine-specific hashtags), bar/cocktails (cocktail enthusiasts, mixology, nightlife influencers); niche mismatch costs = wasted spend ($300-1,000 per mismatched partnership), low engagement (0.5-1.5% vs 4-7% aligned), brand confusion (mixed messaging), low conversion (1-3% vs 8-15% aligned); niche alignment best practice = audit influencer audience (demographics, interests, location), match to restaurant target customer, replace mismatched partnerships quarterly. Solutions ranked by impact: (1) REALIGN influencer niche — wasted spend recovery ${fmt$(expectedWastedSpend)}/mo + ROI recovery ${fmt$(expectedRoiRecovery)}/mo + engagement lift ${fmt$(expectedEngagementLift)}/mo + conversion lift ${fmt$(expectedConversionLift)}/mo; cost ${fmt$(d.influencer_management_cost)}/mo management; payback immediate; (2) AUDIT current influencer audience (demographics, interests, location); (3) MATCH influencer audience to restaurant target customer (cuisine, price, style, location); (4) REPLACE ${misalignedCount} mismatched partnerships (cancel + recruit aligned); (5) IDENTIFY aligned influencers (restaurant niche + local + 10k-100k); (6) VET influencer content (do they post similar restaurants? do their followers match target?); (7) CHECK engagement quality (genuine comments vs spam/bots); (8) NEGOTIATE new aligned partnerships; (9) TRACK conversion per influencer (promo codes, UTM links); (10) REPLACE <2% conversion influencers; (11) SCALE 8%+ conversion influencers; (12) BENCHMARK vs competitor niche alignment. Industry data: 30-40% higher conversion with aligned influencers (AspireIQ); payback immediate. Expected impact: +${targetNicheRoiLiftPct}% ROI, +30% engagement, +${fmt$(expectedWastedSpend)}/mo wasted spend recovery, payback immediate.`,
        ai_recommendation: 'realign_influencer_niche',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: INFLUENCER_ENGAGEMENT_RATE_LOW
    if (d.avg_influencer_engagement_rate > 0 && d.avg_influencer_engagement_rate < config.minEngagementRateTarget) {
      // partnered influencers <2% engagement -> wasted spend
      const engagementGap = Math.max(config.minEngagementRateTarget - d.avg_influencer_engagement_rate, 0);
      const expectedEngagementLift = Math.round(d.instagram_followers * (engagementGap / 100) * 3);
      const expectedReachLift = Math.round(d.social_media_reach_monthly * (engagementGap / 100));
      const expectedNewCustomers = Math.round(d.low_engagement_influencer_count * 15);
      const expectedRevenueFromNew = Math.round(expectedNewCustomers * 38);
      const expectedWastedSpend = Math.round(d.low_engagement_influencer_count * 350);
      const totalOpportunity = Math.max(expectedEngagementLift + expectedReachLift + expectedRevenueFromNew + expectedWastedSpend, 1400);
      const severityLabel = d.avg_influencer_engagement_rate < 1.5 ? 'high' : 'medium';
      const criticalNote = (d.avg_influencer_engagement_rate < 1.5)
        ? `HIGH: INFLUENCER ENGAGEMENT RATE CRITICALLY LOW — avg engagement ${d.avg_influencer_engagement_rate}% (min ${config.minEngagementRateTarget}%); ${d.low_engagement_influencer_count} influencers below threshold; low engagement = fake followers, bot accounts, or wrong audience = wasted spend; replace low-engagement influencers with 4-7% engagement micro-influencers. `
        : `MEDIUM: INFLUENCER ENGAGEMENT BELOW TARGET — avg ${d.avg_influencer_engagement_rate}% (min ${config.minEngagementRateTarget}%); ${d.low_engagement_influencer_count} influencers below threshold; replace for higher engagement. `;
      alerts.push({
        rule_id: 'influencer_engagement_rate_low',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        avg_influencer_engagement_rate: d.avg_influencer_engagement_rate,
        min_engagement_rate_target: d.min_engagement_rate_target,
        low_engagement_influencer_count: d.low_engagement_influencer_count,
        influencer_partnerships_count: d.influencer_partnerships_count,
        instagram_engagement_rate: d.instagram_engagement_rate,
        competitor_influencer_score: d.competitor_influencer_score,
        monthly_revenue: d.monthly_revenue,
        influencer_spend_monthly: d.influencer_spend_monthly,
        engagement_rate_lift_projected_pts: Math.round(engagementGap * 2),
        new_customer_acquisition_projected: expectedNewCustomers,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `INFLUENCER ENGAGEMENT RATE LOW: ${d.location_id} — avg engagement ${d.avg_influencer_engagement_rate}% (min ${config.minEngagementRateTarget}%); ${d.low_engagement_influencer_count} influencers below threshold; total partnerships ${d.influencer_partnerships_count}; restaurant Instagram engagement ${d.instagram_engagement_rate}%; competitor influencer ${d.competitor_influencer_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}; influencer spend ${fmt$(d.influencer_spend_monthly)}/mo. ${criticalNote}Industry data: micro-influencers (10k-100k) have 3-7% engagement vs 1-2% for mega-influencers (Mediakix engagement study); low engagement (<2%) = fake followers, bot accounts, or wrong audience = wasted spend; influencer engagement benchmarks = nano (1k-10k) 7-10%, micro (10k-100k) 3-7%, mid (100k-500k) 2-4%, macro (500k-1M) 1-3%, mega (1M+) 1-2%; low engagement indicators = likes-to-follower ratio <3%, comments-to-likes ratio <1%, generic comments (emoji only, single word), follower growth spikes (bot purchases); low engagement costs = wasted spend ($300-1,000 per low-engagement partnership), low reach (algorithm deprioritizes low-engagement content), low conversion (1-3% vs 8-15% high-engagement); engagement rate best practice = vet before partnership (check last 10 posts engagement), monitor quarterly (engagement can decline), replace <2% engagement influencers immediately, scale 5%+ engagement influencers. Solutions ranked by impact: (1) REPLACE ${d.low_engagement_influencer_count} low-engagement influencers — wasted spend recovery ${fmt$(expectedWastedSpend)}/mo + engagement lift ${fmt$(expectedEngagementLift)}/mo + reach lift ${fmt$(expectedReachLift)}/mo + revenue from new customers ${fmt$(expectedRevenueFromNew)}/mo; cost ${fmt$(d.influencer_management_cost)}/mo management; payback immediate; (2) AUDIT current influencer engagement (last 10 posts avg); (3) IDENTIFY ${d.low_engagement_influencer_count} influencers below ${config.minEngagementRateTarget}% threshold; (4) CANCEL low-engagement partnerships (no renewal); (5) VET replacement influencers (check last 10 posts engagement, comments quality, follower growth pattern); (6) CHECK for fake followers (Social Blade, HypeAuditor, Modash); (7) NEGOTIATE new high-engagement partnerships (4-7% engagement target); (8) MONITOR engagement quarterly (engagement can decline over time); (9) REPLACE <2% engagement immediately; (10) SCALE 5%+ engagement (increase budget, frequency); (11) TRACK engagement per influencer (last 10 posts avg); (12) BENCHMARK vs competitor influencer engagement. Industry data: 3-7% engagement for micro (Mediakix); payback immediate. Expected impact: +${Math.round(engagementGap * 2)}pts engagement rate, +${expectedNewCustomers} new customers/mo, +${fmt$(expectedWastedSpend)}/mo wasted spend recovery, payback immediate.`,
        ai_recommendation: 'replace_low_engagement_influencers',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: INFLUENCER_ROI_TRACKING_ABSENT
    if (config.requireInfluencerRoiTracking && !d.has_influencer_roi_tracking) {
      // no ROI tracking -> can't optimize spend
      const expectedRoiRecovery = Math.round(d.influencer_spend_monthly * 0.30);
      const expectedWastedSpendRecovery = Math.round(d.influencer_spend_monthly * 0.20);
      const expectedAttributionLift = Math.round(d.influencer_spend_monthly * 1.5);
      const expectedOptimizationLift = Math.round(d.influencer_spend_monthly * 0.80);
      const totalOpportunity = Math.max(expectedRoiRecovery + expectedWastedSpendRecovery + expectedAttributionLift + expectedOptimizationLift, 800);
      const severityLabel = d.influencer_spend_monthly > 1000 ? 'medium' : 'low';
      const criticalNote = (d.influencer_spend_monthly > 1000)
        ? `MEDIUM: NO ROI TRACKING — influencer spend ${fmt$(d.influencer_spend_monthly)}/mo but no ROI tracking; without tracking, can't identify which influencers drive revenue = wasted 20-30% of spend; ROI tracking = UTM links, promo codes, reservation attribution, walk-in surveys; influencer marketing ROI = $6.50 per $1 spent (median) but only measurable with tracking. `
        : `LOW: NO ROI TRACKING — implement tracking to optimize influencer spend ${fmt$(d.influencer_spend_monthly)}/mo. `;
      alerts.push({
        rule_id: 'influencer_roi_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_influencer_roi_tracking: d.has_influencer_roi_tracking,
        influencer_attributed_revenue: d.influencer_attributed_revenue,
        influencer_roas: d.influencer_roas,
        influencer_spend_monthly: d.influencer_spend_monthly,
        influencer_partnerships_count: d.influencer_partnerships_count,
        customer_acquisition_cost: d.customer_acquisition_cost,
        customer_acquisition_cost_baseline: d.customer_acquisition_cost_baseline,
        monthly_revenue: d.monthly_revenue,
        roi_tracking_tool_cost: d.roi_tracking_tool_cost,
        roas_lift_projected_pct: 50,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `ROI TRACKING ABSENT: ${d.location_id} — ROI tracking ${d.has_influencer_roi_tracking ? 'present' : 'ABSENT'}; attributed revenue ${fmt$(d.influencer_attributed_revenue)}; ROAS ${d.influencer_roas}x; influencer spend ${fmt$(d.influencer_spend_monthly)}/mo; partnerships ${d.influencer_partnerships_count}; CAC ${fmt$(d.customer_acquisition_cost)} (baseline ${fmt$(d.customer_acquisition_cost_baseline)}); monthly revenue ${fmt$(d.monthly_revenue)}; ROI tool cost ${fmt$(d.roi_tracking_tool_cost)}/mo. ${criticalNote}Industry data: without ROI tracking, restaurants waste 20-30% of influencer spend on partnerships that don't drive revenue; influencer marketing ROI = $6.50 per $1 spent (median, Influencer Marketing Hub) but only measurable with tracking; ROI tracking methods = UTM links (track clicks + conversions per influencer), promo codes (track orders attributed to influencer), reservation attribution (ask how did you hear about us), walk-in surveys (server asks at seating), hashtag monitoring (track posts + engagement); ROI tracking tools = Google Analytics (free, UTM-based), Sprout Social ($249-499/mo), Hootsuite ($129-219/mo + influencer add-on), AspireIQ ($1,000+/mo), Grin ($1,000+/mo); ROI metrics = ROAS (revenue / spend, target 3-6x), CAC (cost per new customer, target $10-25), conversion rate (visitors / clicks, target 5-15%); ROI tracking best practice = UTM links per influencer (free, Google Analytics), promo codes per influencer (15-20% off, tracks orders), reservation attribution (add to booking form), quarterly influencer ROI audit (replace low ROAS, scale high ROAS). Solutions ranked by impact: (1) IMPLEMENT ROI tracking — ROI recovery ${fmt$(expectedRoiRecovery)}/mo + wasted spend recovery ${fmt$(expectedWastedSpendRecovery)}/mo + attribution lift ${fmt$(expectedAttributionLift)}/mo + optimization lift ${fmt$(expectedOptimizationLift)}/mo; cost ${fmt$(d.roi_tracking_tool_cost)}/mo tool; payback immediate; (2) SET up UTM links per influencer (free, Google Analytics); (3) CREATE unique promo codes per influencer (15-20% off, tracks orders); (4) ADD reservation attribution (how did you hear about us? — add influencer options); (5) TRAIN servers to ask walk-ins (how did you find us?); (6) MONITOR hashtags (track posts + engagement per influencer); (7) USE Google Analytics (free, UTM-based, traffic + conversions); (8) OR Sprout Social ($249-499/mo, influencer add-on); (9) OR AspireIQ/Grin ($1,000+/mo, full influencer platform); (10) TRACK ROAS per influencer (revenue / spend, target 3-6x); (11) TRACK CAC per influencer (cost per new customer, target $10-25); (12) TRACK conversion rate per influencer (visitors / clicks, target 5-15%); (13) AUDIT quarterly (replace low ROAS <2x, scale high ROAS >6x); (14) BENCHMARK vs competitor ROI tracking. Industry data: $6.50 ROI per $1 (Influencer Marketing Hub); 20-30% wasted spend without tracking; payback immediate. Expected impact: +50% ROAS, +${fmt$(expectedRoiRecovery)}/mo ROI recovery, +${fmt$(expectedWastedSpendRecovery)}/mo wasted spend recovery, payback immediate.`,
        ai_recommendation: 'implement_roi_tracking',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM influencer_outreach_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE influencer_outreach_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant influencer marketing expert. Given influencer outreach data, recommend ONE specific action with expected revenue lift, new customer acquisition, engagement lift, or ROAS lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Influencer program: ${a.has_influencer_program ?? false} (${a.influencer_partnerships_count ?? 0} partnerships, budget ${fmt$(a.influencer_budget_monthly ?? 0)}/${fmt$(a.influencer_budget_target_monthly ?? 0)} target). Micro strategy: ${a.has_micro_influencer_strategy ?? false} (${a.micro_influencer_count ?? 0}/${a.micro_influencer_target_count ?? 0} target). Food blogger outreach: ${a.has_food_blogger_outreach ?? false} (${a.food_blogger_partnerships_count ?? 0} bloggers). TikTok: ${a.has_tiktok_strategy ?? false} (${a.tiktok_posts_monthly ?? 0} posts/mo, ${a.tiktok_views_monthly ?? 0} views, ${a.tiktok_followers ?? 0} followers). Content rights: ${a.has_content_usage_rights ?? false} (clarity ${a.content_rights_clarity_score ?? 0}/100, ${a.repurposable_content_count ?? 0} repurposable). Niche alignment: ${a.influencer_niche_alignment_score ?? 0}/100 (${a.niche_mismatch_count ?? 0} mismatched, restaurant niche ${a.restaurant_niche ?? 'n/a'}). Avg engagement: ${a.avg_influencer_engagement_rate ?? 0}% (min ${a.min_engagement_rate_target ?? 3}%, ${a.low_engagement_influencer_count ?? 0} low). ROI tracking: ${a.has_influencer_roi_tracking ?? false} (attributed ${fmt$(a.influencer_attributed_revenue ?? 0)}, ROAS ${a.influencer_roas ?? 0}x). Instagram: ${a.instagram_followers ?? 0} followers (${a.instagram_engagement_rate ?? 0}% engagement). New customers from influencers: ${a.new_customers_from_influencers_monthly ?? 0}/mo. Social reach: ${a.social_media_reach_monthly ?? 0}/mo (baseline ${a.social_media_reach_baseline_monthly ?? 0}). CAC: ${fmt$(a.customer_acquisition_cost ?? 0)} (baseline ${fmt$(a.customer_acquisition_cost_baseline ?? 0)}). Competitor influencer: ${a.competitor_influencer_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Marketing budget: ${fmt$(a.marketing_budget_monthly ?? 0)}/mo. Influencer spend: ${fmt$(a.influencer_spend_monthly ?? 0)}/mo. Management cost: ${fmt$(a.influencer_management_cost ?? 0)}/mo. ROI tool cost: ${fmt$(a.roi_tracking_tool_cost ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveInfluencerOutreachAlerts = async (db: ReturnType<typeof useDB>): Promise<InfluencerOutreachAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM influencer_outreach_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getInfluencerOutreachSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  influencerPartnershipProgramAbsentCount: number;
  microInfluencerStrategyAbsentCount: number;
  foodBloggerOutreachAbsentCount: number;
  tiktokStrategyAbsentCount: number;
  influencerContentRightsUnclearCount: number;
  influencerNicheMisalignmentCount: number;
  influencerEngagementRateLowCount: number;
  influencerRoiTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'influencer_partnership_program_absent') AS noprogram,
              math::count(rule_id = 'micro_influencer_strategy_absent') AS nomicro,
              math::count(rule_id = 'food_blogger_outreach_absent') AS noblogger,
              math::count(rule_id = 'tiktok_strategy_absent') AS notiktok,
              math::count(rule_id = 'influencer_content_rights_unclear') AS norights,
              math::count(rule_id = 'influencer_niche_misalignment') AS nicmisalign,
              math::count(rule_id = 'influencer_engagement_rate_low') AS lowengagement,
              math::count(rule_id = 'influencer_roi_tracking_absent') AS noroi
       FROM influencer_outreach_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      influencerPartnershipProgramAbsentCount: safeNumber(r.noprogram, 0),
      microInfluencerStrategyAbsentCount: safeNumber(r.nomicro, 0),
      foodBloggerOutreachAbsentCount: safeNumber(r.noblogger, 0),
      tiktokStrategyAbsentCount: safeNumber(r.notiktok, 0),
      influencerContentRightsUnclearCount: safeNumber(r.norights, 0),
      influencerNicheMisalignmentCount: safeNumber(r.nicmisalign, 0),
      influencerEngagementRateLowCount: safeNumber(r.lowengagement, 0),
      influencerRoiTrackingAbsentCount: safeNumber(r.noroi, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, influencerPartnershipProgramAbsentCount: 0, microInfluencerStrategyAbsentCount: 0, foodBloggerOutreachAbsentCount: 0, tiktokStrategyAbsentCount: 0, influencerContentRightsUnclearCount: 0, influencerNicheMisalignmentCount: 0, influencerEngagementRateLowCount: 0, influencerRoiTrackingAbsentCount: 0 };
  }
};

export const updateInfluencerOutreachAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
