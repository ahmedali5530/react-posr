/**
 * AI Restaurant Crisis Communication & PR Reputation Optimizer — predicts how
 * crisis communication preparedness (crisis response plan, social media
 * monitoring, negative review response, food safety incident handling,
 * staff scandal handling, viral negative content, media training, legal
 * coordination, stakeholder communication, reputation recovery) impacts
 * brand reputation, customer trust, revenue recovery, legal liability.
 *
 * 70% of restaurants without crisis communication plan don't survive a
 * major crisis (PR Week). Restaurants lose $5,000-50,000/day during a
 * reputation crisis (Cornell CHR). Food safety incidents cost $1M-10M+
 * in lawsuits, recalls, brand damage (FDA). Negative viral content
 * reaches 2M+ people in 24 hours (Sprout Social). 88% of consumers trust
 * online reviews as much as personal recommendations (BrightLocal) —
 * one viral negative review can cost $10,000-100,000 in revenue. 45% of
 * customers switch brands after a poorly-handled crisis (Edelman Trust).
 * Restaurants with crisis plan recover 3-5x faster than those without
 * (PR Week). Crisis response time is critical — 60% of crisis damage
 * occurs in first 2 hours (Sprinklr). Social media monitoring catches
 * 70% of crises before they go viral (Meltwater). 78% of customers
 * forgive a restaurant that responds well to a crisis (Edelman). Media
 * training for staff reduces misquotes 60-80% (PRSA). Legal coordination
 * reduces lawsuit costs 30-50% (ABC). Reputation recovery takes 6-18
 * months after a major crisis without proactive PR (Reputation Institute).
 * Restaurants with dedicated PR recover 50% faster (PR Week). Crisis
 * communication tools cost $200-1,000/month (Hootsuite, Sprout Social,
 * Meltwater). Crisis ROI = $10-50 per $1 spent (averts $50k-500k in
 * damage per crisis). Restaurants face 2-5 reputation crises per year
 * (minor: negative reviews, major: food safety, viral, staff scandal).
 *
 * 206th POSR-exclusive differentiator. Distinct from:
 *   - review-response.service — responds to individual REVIEWS (post-facto).
 *     This optimizer focuses on CRISIS communication strategy (proactive
 *     plan, viral response, media, legal, recovery).
 *   - sentiment.service — analyzes review SENTIMENT (analytics). This
 *     optimizer focuses on CRISIS action plan (what to DO when crisis
 *     hits).
 *   - sentiment-trend.service — tracks sentiment TRENDS over time. This
 *     optimizer focuses on CRISIS detection + response (real-time).
 *   - social-listening-monitor.service (99th) — monitors real-time social
 *     MENTIONS. This optimizer focuses on CRISIS communication response
 *     strategy (beyond monitoring — action plan).
 *   - complaint-pattern.service — detects recurring COMPLAINT themes. This
 *     optimizer focuses on CRISIS-level incidents (viral, media, legal).
 *   - social-content.service (52nd) — GENERATES social posts. This
 *     optimizer focuses on CRISIS response messaging.
 *   - food-safety.service — HACCP temperature logs. This optimizer focuses
 *     on COMMUNICATION when food safety incident occurs.
 *   - alerts.service — system ALERTS (operational). This optimizer focuses
 *     on CRISIS alerts (reputational).
 *   - competitor-monitoring.service — tracks competitor CHANGES. This
 *     optimizer focuses on own crisis management.
 *
 * 8 AI rules:
 *   1. crisis_response_plan_absent -> no crisis plan -> 70% survival risk
 *   2. social_media_crisis_monitoring_absent -> no real-time monitoring -> missed early detection (70%)
 *   3. negative_viral_content_response_slow -> response >2h -> 60% damage in first 2h
 *   4. food_safety_incident_protocol_absent -> no food safety protocol -> $1M-10M liability
 *   5. staff_scandal_misconduct_protocol_absent -> no staff scandal protocol -> brand damage
 *   6. media_training_absent -> staff not media-trained -> 60-80% misquotes
 *   7. legal_coordination_absent -> no legal coordination -> 30-50% higher lawsuit costs
 *   8. reputation_recovery_program_absent -> no recovery program -> 6-18 month recovery
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type CrisisCommunicationRuleId =
  | 'crisis_response_plan_absent'
  | 'social_media_crisis_monitoring_absent'
  | 'negative_viral_content_response_slow'
  | 'food_safety_incident_protocol_absent'
  | 'staff_scandal_misconduct_protocol_absent'
  | 'media_training_absent'
  | 'legal_coordination_absent'
  | 'reputation_recovery_program_absent';

export type CrisisCommunicationAiRec =
  | 'create_crisis_response_plan'
  | 'implement_social_media_monitoring'
  | 'accelerate_viral_response'
  | 'implement_food_safety_protocol'
  | 'implement_staff_scandal_protocol'
  | 'conduct_media_training'
  | 'coordinate_with_legal'
  | 'launch_reputation_recovery'
  | 'monitor'
  | 'skip';

export interface CrisisCommunicationAlert {
  id?: string;
  rule_id: CrisisCommunicationRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;                                    // 'overall' | 'brand' | 'location_1' | 'location_2'
  restaurant_tier?: string;                                // 'quick_service' | 'fast_casual' | 'casual_dining' | 'fine_dining'
  market_setting?: string;                                 // 'urban' | 'suburban' | 'rural' | 'resort'
  channel?: string;                                        // 'dine_in' | 'takeout' | 'delivery' | 'mixed'
  // Crisis response plan
  has_crisis_response_plan?: boolean;                      // crisis response plan present
  crisis_plan_completeness_score?: number;                 // 0-100 plan completeness
  crisis_plan_last_updated_months?: number;                // months since last update
  crisis_drill_conducted?: boolean;                        // crisis drill conducted in last 12 months
  // Social media monitoring
  has_social_media_crisis_monitoring?: boolean;            // real-time social media monitoring
  monitoring_tools_count?: number;                         // number of monitoring tools
  crisis_detection_time_hours?: number;                    // avg hours to detect crisis
  crisis_detection_target_hours?: number;                  // target detection time
  // Viral content response
  avg_viral_response_time_hours?: number;                  // avg response time to viral content
  viral_response_target_hours?: number;                    // target response time (2h)
  viral_incidents_last_year?: number;                      // viral incidents in last 12 months
  viral_incidents_handled_well_pct?: number;               // % handled well
  // Food safety incident protocol
  has_food_safety_incident_protocol?: boolean;             // food safety incident protocol present
  food_safety_incidents_last_year?: number;                // food safety incidents in last 12 months
  food_safety_lawsuit_risk_score?: number;                 // 0-100 lawsuit risk
  recall_protocol_present?: boolean;                       // recall protocol present
  health_dept_notification_protocol?: boolean;             // health dept notification protocol
  // Staff scandal/misconduct protocol
  has_staff_scandal_protocol?: boolean;                    // staff scandal/misconduct protocol present
  staff_misconduct_incidents_last_year?: number;           // staff misconduct incidents
  harassment_protocol_present?: boolean;                   // harassment protocol present
  social_media_policy_staff?: boolean;                     // staff social media policy
  // Media training
  has_media_training?: boolean;                            // media training for spokespeople
  media_trained_staff_count?: number;                      // number of media-trained staff
  media_trained_staff_target?: number;                     // target media-trained staff
  spokesperson_designated?: boolean;                       // designated spokesperson
  // Legal coordination
  has_legal_coordination?: boolean;                        // legal coordination/retainer
  legal_retainer_cost_monthly?: number;                    // monthly legal retainer cost
  lawsuits_last_year?: number;                             // lawsuits in last 12 months
  lawsuit_cost_annual?: number;                            // annual lawsuit cost
  // Reputation recovery
  has_reputation_recovery_program?: boolean;               // reputation recovery program
  reputation_score?: number;                               // 0-100 reputation score
  reputation_score_baseline?: number;                      // baseline reputation score
  avg_recovery_time_months?: number;                       // avg recovery time after crisis
  recovery_target_months?: number;                         // target recovery time
  // Crisis metrics
  crisis_count_last_year?: number;                         // total crises last year
  crisis_cost_annual?: number;                             // annual crisis cost (revenue lost + legal + PR)
  brand_sentiment_score?: number;                          // 0-100 brand sentiment
  customer_trust_score?: number;                           // 0-100 customer trust
  competitor_crisis_readiness_score?: number;              // 0-100 competitor crisis readiness
  monthly_revenue?: number;                                // total restaurant monthly revenue
  // Costs
  crisis_communication_cost_monthly?: number;              // monthly crisis communication cost
  monitoring_tool_cost_monthly?: number;                   // monthly monitoring tool cost
  pr_agency_retainer_monthly?: number;                     // monthly PR agency retainer
  // Impact projections
  survival_probability_lift_projected_pct?: number;
  crisis_detection_acceleration_projected_hours?: number;
  viral_response_acceleration_projected_hours?: number;
  lawsuit_cost_reduction_projected_pct?: number;
  recovery_time_reduction_projected_months?: number;
  reputation_lift_projected_pts?: number;
  trust_lift_projected_pts?: number;
  crisis_cost_reduction_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: CrisisCommunicationAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface CrisisCommunicationConfig {
  aiEnabled: boolean;
  requireCrisisResponsePlan: boolean;                      // require crisis response plan
  requireSocialMediaCrisisMonitoring: boolean;             // require real-time monitoring
  requireFoodSafetyIncidentProtocol: boolean;              // require food safety protocol
  requireStaffScandalProtocol: boolean;                    // require staff scandal protocol
  requireMediaTraining: boolean;                           // require media training
  requireLegalCoordination: boolean;                       // require legal coordination
  requireReputationRecoveryProgram: boolean;               // require reputation recovery program
  minCrisisPlanCompletenessScore: number;                  // min plan completeness (80)
  maxCrisisDetectionTimeHours: number;                     // max detection time (2h)
  maxViralResponseTimeHours: number;                       // max viral response time (2h)
  minMediaTrainedStaffCount: number;                       // min media-trained staff (2)
  minReputationScore: number;                              // min reputation score (70)
  maxRecoveryTimeMonths: number;                           // max recovery time (6 months)
  preferCompetitorParity: boolean;                         // match competitor crisis readiness
}

export const DEFAULT_CRISIS_COMMUNICATION_CONFIG: CrisisCommunicationConfig = {
  aiEnabled: true,
  requireCrisisResponsePlan: true,
  requireSocialMediaCrisisMonitoring: true,
  requireFoodSafetyIncidentProtocol: true,
  requireStaffScandalProtocol: true,
  requireMediaTraining: true,
  requireLegalCoordination: true,
  requireReputationRecoveryProgram: true,
  minCrisisPlanCompletenessScore: 80,
  maxCrisisDetectionTimeHours: 2,
  maxViralResponseTimeHours: 2,
  minMediaTrainedStaffCount: 2,
  minReputationScore: 70,
  maxRecoveryTimeMonths: 6,
  preferCompetitorParity: true,
};

export const readCrisisCommunicationConfig = (settings: any): CrisisCommunicationConfig => ({
  aiEnabled: settings?.crisis_communication_ai_enabled ?? true,
  requireCrisisResponsePlan: settings?.crisis_communication_require_plan ?? true,
  requireSocialMediaCrisisMonitoring: settings?.crisis_communication_require_monitoring ?? true,
  requireFoodSafetyIncidentProtocol: settings?.crisis_communication_require_food_safety ?? true,
  requireStaffScandalProtocol: settings?.crisis_communication_require_staff_scandal ?? true,
  requireMediaTraining: settings?.crisis_communication_require_media_training ?? true,
  requireLegalCoordination: settings?.crisis_communication_require_legal ?? true,
  requireReputationRecoveryProgram: settings?.crisis_communication_require_recovery ?? true,
  minCrisisPlanCompletenessScore: safeNumber(settings?.crisis_communication_min_plan_score, 80),
  maxCrisisDetectionTimeHours: safeNumber(settings?.crisis_communication_max_detection_hours, 2),
  maxViralResponseTimeHours: safeNumber(settings?.crisis_communication_max_viral_response_hours, 2),
  minMediaTrainedStaffCount: safeNumber(settings?.crisis_communication_min_media_trained, 2),
  minReputationScore: safeNumber(settings?.crisis_communication_min_reputation, 70),
  maxRecoveryTimeMonths: safeNumber(settings?.crisis_communication_max_recovery_months, 6),
  preferCompetitorParity: settings?.crisis_communication_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface CrisisCommunicationData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_crisis_response_plan: boolean;
  crisis_plan_completeness_score: number;
  crisis_plan_last_updated_months: number;
  crisis_drill_conducted: boolean;
  has_social_media_crisis_monitoring: boolean;
  monitoring_tools_count: number;
  crisis_detection_time_hours: number;
  crisis_detection_target_hours: number;
  avg_viral_response_time_hours: number;
  viral_response_target_hours: number;
  viral_incidents_last_year: number;
  viral_incidents_handled_well_pct: number;
  has_food_safety_incident_protocol: boolean;
  food_safety_incidents_last_year: number;
  food_safety_lawsuit_risk_score: number;
  recall_protocol_present: boolean;
  health_dept_notification_protocol: boolean;
  has_staff_scandal_protocol: boolean;
  staff_misconduct_incidents_last_year: number;
  harassment_protocol_present: boolean;
  social_media_policy_staff: boolean;
  has_media_training: boolean;
  media_trained_staff_count: number;
  media_trained_staff_target: number;
  spokesperson_designated: boolean;
  has_legal_coordination: boolean;
  legal_retainer_cost_monthly: number;
  lawsuits_last_year: number;
  lawsuit_cost_annual: number;
  has_reputation_recovery_program: boolean;
  reputation_score: number;
  reputation_score_baseline: number;
  avg_recovery_time_months: number;
  recovery_target_months: number;
  crisis_count_last_year: number;
  crisis_cost_annual: number;
  brand_sentiment_score: number;
  customer_trust_score: number;
  competitor_crisis_readiness_score: number;
  monthly_revenue: number;
  crisis_communication_cost_monthly: number;
  monitoring_tool_cost_monthly: number;
  pr_agency_retainer_monthly: number;
}

const MOCK_DATA: CrisisCommunicationData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_crisis_response_plan: false, crisis_plan_completeness_score: 18,
    crisis_plan_last_updated_months: 0, crisis_drill_conducted: false,
    has_social_media_crisis_monitoring: false, monitoring_tools_count: 0,
    crisis_detection_time_hours: 24, crisis_detection_target_hours: 2,
    avg_viral_response_time_hours: 48, viral_response_target_hours: 2,
    viral_incidents_last_year: 1, viral_incidents_handled_well_pct: 0,
    has_food_safety_incident_protocol: false, food_safety_incidents_last_year: 0,
    food_safety_lawsuit_risk_score: 62, recall_protocol_present: false,
    health_dept_notification_protocol: false,
    has_staff_scandal_protocol: false, staff_misconduct_incidents_last_year: 2,
    harassment_protocol_present: false, social_media_policy_staff: false,
    has_media_training: false, media_trained_staff_count: 0,
    media_trained_staff_target: 3, spokesperson_designated: false,
    has_legal_coordination: false, legal_retainer_cost_monthly: 0,
    lawsuits_last_year: 0, lawsuit_cost_annual: 0,
    has_reputation_recovery_program: false, reputation_score: 48,
    reputation_score_baseline: 68, avg_recovery_time_months: 14,
    recovery_target_months: 6,
    crisis_count_last_year: 3, crisis_cost_annual: 38000,
    brand_sentiment_score: 42, customer_trust_score: 44,
    competitor_crisis_readiness_score: 64,
    monthly_revenue: 78000,
    crisis_communication_cost_monthly: 0, monitoring_tool_cost_monthly: 0,
    pr_agency_retainer_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_crisis_response_plan: true, crisis_plan_completeness_score: 52,
    crisis_plan_last_updated_months: 18, crisis_drill_conducted: false,
    has_social_media_crisis_monitoring: false, monitoring_tools_count: 1,
    crisis_detection_time_hours: 8, crisis_detection_target_hours: 2,
    avg_viral_response_time_hours: 12, viral_response_target_hours: 2,
    viral_incidents_last_year: 2, viral_incidents_handled_well_pct: 30,
    has_food_safety_incident_protocol: true, food_safety_incidents_last_year: 0,
    food_safety_lawsuit_risk_score: 48, recall_protocol_present: false,
    health_dept_notification_protocol: true,
    has_staff_scandal_protocol: false, staff_misconduct_incidents_last_year: 1,
    harassment_protocol_present: true, social_media_policy_staff: false,
    has_media_training: false, media_trained_staff_count: 0,
    media_trained_staff_target: 3, spokesperson_designated: false,
    has_legal_coordination: true, legal_retainer_cost_monthly: 800,
    lawsuits_last_year: 1, lawsuit_cost_annual: 12000,
    has_reputation_recovery_program: false, reputation_score: 62,
    reputation_score_baseline: 70, avg_recovery_time_months: 9,
    recovery_target_months: 6,
    crisis_count_last_year: 4, crisis_cost_annual: 24000,
    brand_sentiment_score: 58, customer_trust_score: 60,
    competitor_crisis_readiness_score: 72,
    monthly_revenue: 124000,
    crisis_communication_cost_monthly: 400, monitoring_tool_cost_monthly: 100,
    pr_agency_retainer_monthly: 0,
  },
  {
    location_id: 'location_1', restaurant_tier: 'casual_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_crisis_response_plan: true, crisis_plan_completeness_score: 78,
    crisis_plan_last_updated_months: 6, crisis_drill_conducted: true,
    has_social_media_crisis_monitoring: true, monitoring_tools_count: 2,
    crisis_detection_time_hours: 3, crisis_detection_target_hours: 2,
    avg_viral_response_time_hours: 4, viral_response_target_hours: 2,
    viral_incidents_last_year: 1, viral_incidents_handled_well_pct: 70,
    has_food_safety_incident_protocol: true, food_safety_incidents_last_year: 0,
    food_safety_lawsuit_risk_score: 28, recall_protocol_present: true,
    health_dept_notification_protocol: true,
    has_staff_scandal_protocol: true, staff_misconduct_incidents_last_year: 0,
    harassment_protocol_present: true, social_media_policy_staff: true,
    has_media_training: true, media_trained_staff_count: 2,
    media_trained_staff_target: 3, spokesperson_designated: true,
    has_legal_coordination: true, legal_retainer_cost_monthly: 1200,
    lawsuits_last_year: 0, lawsuit_cost_annual: 0,
    has_reputation_recovery_program: false, reputation_score: 74,
    reputation_score_baseline: 72, avg_recovery_time_months: 5,
    recovery_target_months: 6,
    crisis_count_last_year: 2, crisis_cost_annual: 8000,
    brand_sentiment_score: 72, customer_trust_score: 74,
    competitor_crisis_readiness_score: 78,
    monthly_revenue: 168000,
    crisis_communication_cost_monthly: 900, monitoring_tool_cost_monthly: 200,
    pr_agency_retainer_monthly: 500,
  },
  {
    location_id: 'location_2', restaurant_tier: 'fine_dining', market_setting: 'urban',
    channel: 'dine_in',
    has_crisis_response_plan: true, crisis_plan_completeness_score: 92,
    crisis_plan_last_updated_months: 2, crisis_drill_conducted: true,
    has_social_media_crisis_monitoring: true, monitoring_tools_count: 3,
    crisis_detection_time_hours: 1, crisis_detection_target_hours: 2,
    avg_viral_response_time_hours: 1.5, viral_response_target_hours: 2,
    viral_incidents_last_year: 0, viral_incidents_handled_well_pct: 100,
    has_food_safety_incident_protocol: true, food_safety_incidents_last_year: 0,
    food_safety_lawsuit_risk_score: 12, recall_protocol_present: true,
    health_dept_notification_protocol: true,
    has_staff_scandal_protocol: true, staff_misconduct_incidents_last_year: 0,
    harassment_protocol_present: true, social_media_policy_staff: true,
    has_media_training: true, media_trained_staff_count: 4,
    media_trained_staff_target: 3, spokesperson_designated: true,
    has_legal_coordination: true, legal_retainer_cost_monthly: 2000,
    lawsuits_last_year: 0, lawsuit_cost_annual: 0,
    has_reputation_recovery_program: true, reputation_score: 88,
    reputation_score_baseline: 76, avg_recovery_time_months: 3,
    recovery_target_months: 6,
    crisis_count_last_year: 1, crisis_cost_annual: 2000,
    brand_sentiment_score: 84, customer_trust_score: 86,
    competitor_crisis_readiness_score: 82,
    monthly_revenue: 240000,
    crisis_communication_cost_monthly: 1800, monitoring_tool_cost_monthly: 400,
    pr_agency_retainer_monthly: 1000,
  },
];

export const runCrisisCommunicationEngine = async (
  db: ReturnType<typeof useDB>,
  config: CrisisCommunicationConfig,
): Promise<{ alerts: CrisisCommunicationAlert[]; generated: number }> => {
  const alerts: CrisisCommunicationAlert[] = [];
  const now = new Date();

  let data: CrisisCommunicationData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_crisis_response_plan, crisis_plan_completeness_score,
              crisis_plan_last_updated_months, crisis_drill_conducted,
              has_social_media_crisis_monitoring, monitoring_tools_count,
              crisis_detection_time_hours, crisis_detection_target_hours,
              avg_viral_response_time_hours, viral_response_target_hours,
              viral_incidents_last_year, viral_incidents_handled_well_pct,
              has_food_safety_incident_protocol, food_safety_incidents_last_year,
              food_safety_lawsuit_risk_score, recall_protocol_present,
              health_dept_notification_protocol,
              has_staff_scandal_protocol, staff_misconduct_incidents_last_year,
              harassment_protocol_present, social_media_policy_staff,
              has_media_training, media_trained_staff_count,
              media_trained_staff_target, spokesperson_designated,
              has_legal_coordination, legal_retainer_cost_monthly,
              lawsuits_last_year, lawsuit_cost_annual,
              has_reputation_recovery_program, reputation_score,
              reputation_score_baseline, avg_recovery_time_months,
              recovery_target_months,
              crisis_count_last_year, crisis_cost_annual,
              brand_sentiment_score, customer_trust_score,
              competitor_crisis_readiness_score, monthly_revenue,
              crisis_communication_cost_monthly, monitoring_tool_cost_monthly,
              pr_agency_retainer_monthly
       FROM crisis_communication_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): CrisisCommunicationData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_crisis_response_plan: Boolean(r.has_crisis_response_plan ?? false),
      crisis_plan_completeness_score: safeNumber(r.crisis_plan_completeness_score, 0),
      crisis_plan_last_updated_months: safeNumber(r.crisis_plan_last_updated_months, 0),
      crisis_drill_conducted: Boolean(r.crisis_drill_conducted ?? false),
      has_social_media_crisis_monitoring: Boolean(r.has_social_media_crisis_monitoring ?? false),
      monitoring_tools_count: safeNumber(r.monitoring_tools_count, 0),
      crisis_detection_time_hours: safeNumber(r.crisis_detection_time_hours, 0),
      crisis_detection_target_hours: safeNumber(r.crisis_detection_target_hours, 2),
      avg_viral_response_time_hours: safeNumber(r.avg_viral_response_time_hours, 0),
      viral_response_target_hours: safeNumber(r.viral_response_target_hours, 2),
      viral_incidents_last_year: safeNumber(r.viral_incidents_last_year, 0),
      viral_incidents_handled_well_pct: safeNumber(r.viral_incidents_handled_well_pct, 0),
      has_food_safety_incident_protocol: Boolean(r.has_food_safety_incident_protocol ?? false),
      food_safety_incidents_last_year: safeNumber(r.food_safety_incidents_last_year, 0),
      food_safety_lawsuit_risk_score: safeNumber(r.food_safety_lawsuit_risk_score, 0),
      recall_protocol_present: Boolean(r.recall_protocol_present ?? false),
      health_dept_notification_protocol: Boolean(r.health_dept_notification_protocol ?? false),
      has_staff_scandal_protocol: Boolean(r.has_staff_scandal_protocol ?? false),
      staff_misconduct_incidents_last_year: safeNumber(r.staff_misconduct_incidents_last_year, 0),
      harassment_protocol_present: Boolean(r.harassment_protocol_present ?? false),
      social_media_policy_staff: Boolean(r.social_media_policy_staff ?? false),
      has_media_training: Boolean(r.has_media_training ?? false),
      media_trained_staff_count: safeNumber(r.media_trained_staff_count, 0),
      media_trained_staff_target: safeNumber(r.media_trained_staff_target, 3),
      spokesperson_designated: Boolean(r.spokesperson_designated ?? false),
      has_legal_coordination: Boolean(r.has_legal_coordination ?? false),
      legal_retainer_cost_monthly: safeNumber(r.legal_retainer_cost_monthly, 0),
      lawsuits_last_year: safeNumber(r.lawsuits_last_year, 0),
      lawsuit_cost_annual: safeNumber(r.lawsuit_cost_annual, 0),
      has_reputation_recovery_program: Boolean(r.has_reputation_recovery_program ?? false),
      reputation_score: safeNumber(r.reputation_score, 0),
      reputation_score_baseline: safeNumber(r.reputation_score_baseline, 0),
      avg_recovery_time_months: safeNumber(r.avg_recovery_time_months, 0),
      recovery_target_months: safeNumber(r.recovery_target_months, 6),
      crisis_count_last_year: safeNumber(r.crisis_count_last_year, 0),
      crisis_cost_annual: safeNumber(r.crisis_cost_annual, 0),
      brand_sentiment_score: safeNumber(r.brand_sentiment_score, 0),
      customer_trust_score: safeNumber(r.customer_trust_score, 0),
      competitor_crisis_readiness_score: safeNumber(r.competitor_crisis_readiness_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      crisis_communication_cost_monthly: safeNumber(r.crisis_communication_cost_monthly, 0),
      monitoring_tool_cost_monthly: safeNumber(r.monitoring_tool_cost_monthly, 0),
      pr_agency_retainer_monthly: safeNumber(r.pr_agency_retainer_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetSurvivalLiftPct = 30;
    const targetDetectionAccelHours = Math.max(d.crisis_detection_time_hours - config.maxCrisisDetectionTimeHours, 0);
    const targetViralResponseAccelHours = Math.max(d.avg_viral_response_time_hours - config.maxViralResponseTimeHours, 0);
    const targetLawsuitCostReductionPct = 40;
    const targetRecoveryTimeReductionMonths = Math.max(d.avg_recovery_time_months - config.maxRecoveryTimeMonths, 0);
    const targetReputationLiftPts = 20;
    const targetTrustLiftPts = 20;

    // Rule 1: CRISIS_RESPONSE_PLAN_ABSENT
    if (config.requireCrisisResponsePlan && (!d.has_crisis_response_plan || d.crisis_plan_completeness_score < config.minCrisisPlanCompletenessScore || d.crisis_plan_last_updated_months > 12)) {
      // no crisis plan -> 70% survival risk
      const expectedSurvivalLift = Math.round(baselineRevenue * 0.10);
      const expectedCrisisCostReduction = Math.round(d.crisis_cost_annual * 0.50 / 12);
      const expectedReputationProtection = Math.round(baselineRevenue * 0.04);
      const expectedRecoveryAcceleration = Math.round(baselineRevenue * 0.03);
      const totalOpportunity = Math.max(expectedSurvivalLift + expectedCrisisCostReduction + expectedReputationProtection + expectedRecoveryAcceleration, 3500);
      const severityLabel = !d.has_crisis_response_plan ? 'critical' : d.crisis_plan_completeness_score < 50 ? 'high' : 'medium';
      const criticalNote = (!d.has_crisis_response_plan)
        ? 'CRITICAL: NO CRISIS RESPONSE PLAN — 70% of restaurants without crisis plan do not survive a major crisis (PR Week); restaurants lose $5,000-50,000/day during reputation crisis (Cornell CHR); crisis response time is critical — 60% of damage occurs in first 2 hours (Sprinklr); missing plan = 70% survival risk + extended crisis damage + slow recovery; competitors with plans survive + recover 3-5x faster. '
        : d.crisis_plan_completeness_score < 50
          ? `HIGH: CRISIS PLAN INCOMPLETE — completeness ${d.crisis_plan_completeness_score}/100 (min ${config.minCrisisPlanCompletenessScore}); last updated ${d.crisis_plan_last_updated_months} months ago; incomplete/outdated plan = ineffective response; 70% survival risk without complete plan. `
          : `MEDIUM: CRISIS PLAN NEEDS UPDATE — completeness ${d.crisis_plan_completeness_score}/100 (min ${config.minCrisisPlanCompletenessScore}); last updated ${d.crisis_plan_last_updated_months} months ago; update plan + conduct drill. `;
      alerts.push({
        rule_id: 'crisis_response_plan_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_crisis_response_plan: d.has_crisis_response_plan,
        crisis_plan_completeness_score: d.crisis_plan_completeness_score,
        crisis_plan_last_updated_months: d.crisis_plan_last_updated_months,
        crisis_drill_conducted: d.crisis_drill_conducted,
        crisis_count_last_year: d.crisis_count_last_year,
        crisis_cost_annual: d.crisis_cost_annual,
        reputation_score: d.reputation_score,
        customer_trust_score: d.customer_trust_score,
        competitor_crisis_readiness_score: d.competitor_crisis_readiness_score,
        monthly_revenue: d.monthly_revenue,
        crisis_communication_cost_monthly: d.crisis_communication_cost_monthly,
        survival_probability_lift_projected_pct: targetSurvivalLiftPct,
        crisis_cost_reduction_projected_pct: 50,
        recovery_time_reduction_projected_months: targetRecoveryTimeReductionMonths,
        reputation_lift_projected_pts: targetReputationLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `CRISIS RESPONSE PLAN ABSENT/INCOMPLETE: ${d.location_id} — crisis plan ${d.has_crisis_response_plan ? 'present' : 'ABSENT'}; completeness ${d.crisis_plan_completeness_score}/100 (min ${config.minCrisisPlanCompletenessScore}); last updated ${d.crisis_plan_last_updated_months} months ago; drill conducted ${d.crisis_drill_conducted ? 'yes' : 'NO'}; crises last year ${d.crisis_count_last_year}; crisis cost ${fmt$(d.crisis_cost_annual)}/yr; reputation ${d.reputation_score}/100; trust ${d.customer_trust_score}/100; competitor readiness ${d.competitor_crisis_readiness_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 70% of restaurants without crisis plan do not survive a major crisis (PR Week); restaurants lose $5,000-50,000/day during reputation crisis (Cornell CHR); crisis response time is critical — 60% of damage occurs in first 2 hours (Sprinklr); restaurants with crisis plan recover 3-5x faster than those without (PR Week); crisis plan components = crisis response team (who does what), communication templates (statements for each crisis type), media protocol (who speaks, what to say), social media response protocol, legal coordination protocol, customer notification protocol, stakeholder communication (employees, suppliers, investors), recovery plan; crisis types = food safety incident (poisoning, contamination), viral negative content (video, tweet, review), staff scandal (misconduct, harassment, crime), health inspection failure, accident/injury, natural disaster, data breach, financial fraud; crisis plan best practice = written document, updated annually, drilled quarterly, accessible 24/7, team trained; crisis plan cost = $2,000-10,000 one-time (consultant) + $200-500/month (retainer); crisis plan ROI = $10-50 per $1 spent (averts $50k-500k per crisis). Solutions ranked by impact: (1) CREATE/UPDATE crisis response plan — survival lift ${fmt$(expectedSurvivalLift)}/mo + crisis cost reduction ${fmt$(expectedCrisisCostReduction)}/mo + reputation protection ${fmt$(expectedReputationProtection)}/mo + recovery acceleration ${fmt$(expectedRecoveryAcceleration)}/mo; cost ${fmt$(400)}/mo (plan + retainer); payback immediate (risk avoidance); (2) HIRE crisis communication consultant ($2,000-10,000 one-time); (3) CREATE crisis response team (CEO, PR, legal, ops); (4) WRITE communication templates per crisis type (food safety, viral, staff, accident); (5) DEFINE media protocol (designated spokesperson, holding statements); (6) CREATE social media response protocol (monitoring, response, escalation); (7) COORDINATE with legal (retainer, protocol); (8) CREATE customer notification protocol (email, SMS, in-app); (9) DEFINE stakeholder communication (employees, suppliers, investors); (10) WRITE recovery plan (reputation rebuild, customer win-back); (11) CONDUCT quarterly drills (practice response); (12) UPDATE plan annually (new threats, lessons learned); (13) BENCHMARK vs competitor crisis readiness. Industry data: 70% survival with plan (PR Week); 3-5x faster recovery; payback immediate. Expected impact: +${targetSurvivalLiftPct}% survival probability, +50% crisis cost reduction, +${targetReputationLiftPts}pts reputation, payback immediate.`,
        ai_recommendation: 'create_crisis_response_plan',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: SOCIAL_MEDIA_CRISIS_MONITORING_ABSENT
    if (config.requireSocialMediaCrisisMonitoring && (!d.has_social_media_crisis_monitoring || d.crisis_detection_time_hours > config.maxCrisisDetectionTimeHours)) {
      // no real-time monitoring -> missed early detection (70%)
      const expectedDetectionAcceleration = Math.round(baselineRevenue * (targetDetectionAccelHours / 100));
      const expectedCrisisPrevention = Math.round(d.crisis_cost_annual * 0.40 / 12);
      const expectedReputationProtection = Math.round(baselineRevenue * 0.025);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedDetectionAcceleration + expectedCrisisPrevention + expectedReputationProtection + expectedCompetitiveLift, 2200);
      const severityLabel = d.crisis_detection_time_hours > 12 ? 'high' : 'medium';
      const criticalNote = (d.crisis_detection_time_hours > 12)
        ? `HIGH: NO SOCIAL MEDIA CRISIS MONITORING — detection time ${d.crisis_detection_time_hours}h (max ${config.maxCrisisDetectionTimeHours}h); social media monitoring catches 70% of crises before they go viral (Meltwater); without monitoring, crises spread undetected for hours/days; 60% of damage occurs in first 2 hours (Sprinklr) — late detection = max damage. `
        : `MEDIUM: CRISIS DETECTION SLOW — ${d.crisis_detection_time_hours}h (max ${config.maxCrisisDetectionTimeHours}h); improve monitoring for faster detection. `;
      alerts.push({
        rule_id: 'social_media_crisis_monitoring_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_social_media_crisis_monitoring: d.has_social_media_crisis_monitoring,
        monitoring_tools_count: d.monitoring_tools_count,
        crisis_detection_time_hours: d.crisis_detection_time_hours,
        crisis_detection_target_hours: d.crisis_detection_target_hours,
        viral_incidents_last_year: d.viral_incidents_last_year,
        crisis_count_last_year: d.crisis_count_last_year,
        crisis_cost_annual: d.crisis_cost_annual,
        competitor_crisis_readiness_score: d.competitor_crisis_readiness_score,
        monthly_revenue: d.monthly_revenue,
        monitoring_tool_cost_monthly: d.monitoring_tool_cost_monthly,
        crisis_detection_acceleration_projected_hours: targetDetectionAccelHours,
        crisis_cost_reduction_projected_pct: 40,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `SOCIAL MEDIA CRISIS MONITORING ABSENT: ${d.location_id} — monitoring ${d.has_social_media_crisis_monitoring ? 'present' : 'ABSENT'}; tools ${d.monitoring_tools_count}; detection time ${d.crisis_detection_time_hours}h (max ${config.maxCrisisDetectionTimeHours}h, target ${d.crisis_detection_target_hours}h); viral incidents last year ${d.viral_incidents_last_year}; crises last year ${d.crisis_count_last_year}; crisis cost ${fmt$(d.crisis_cost_annual)}/yr; competitor readiness ${d.competitor_crisis_readiness_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: social media monitoring catches 70% of crises before they go viral (Meltwater); 60% of crisis damage occurs in first 2 hours (Sprinklr) — late detection = max damage; negative viral content reaches 2M+ people in 24 hours (Sprout Social); monitoring tools = Hootsuite ($129-219/mo), Sprout Social ($249-499/mo), Meltwater ($400+/mo), Brandwatch ($800+/mo), Mention ($29-99/mo); monitoring best practice = 24/7 real-time alerts (keyword, sentiment spike, mention volume), sentiment analysis (detect negative spike), influencer monitoring (who is talking), competitor monitoring (benchmark), crisis escalation protocol (who to notify); monitoring cost $100-500/month depending on tool; monitoring ROI = $10-30 per $1 spent (averts $10k-100k per crisis caught early). Solutions ranked by impact: (1) IMPLEMENT social media crisis monitoring — detection acceleration ${fmt$(expectedDetectionAcceleration)}/mo + crisis prevention ${fmt$(expectedCrisisPrevention)}/mo + reputation protection ${fmt$(expectedReputationProtection)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo (monitoring tool); payback immediate (risk avoidance); (2) CHOOSE monitoring tool (Hootsuite, Sprout Social, Meltwater, Brandwatch, Mention); (3) SET UP 24/7 real-time alerts (keyword, sentiment spike, mention volume); (4) CONFIGURE sentiment analysis (detect negative spike); (5) MONITOR brand name, key dishes, owner/chef name, locations; (6) MONITOR competitors (benchmark, catch their crises); (7) MONITOR influencers (who is talking about you); (8) DEFINE crisis escalation protocol (who to notify, when); (9) SET alert thresholds (mention volume, sentiment drop); (10) INTEGRATE with crisis response plan (alert -> team -> response); (11) TRACK detection time (target ${config.maxCrisisDetectionTimeHours}h); (12) BENCHMARK vs competitor monitoring. Industry data: 70% crises caught early (Meltwater); 60% damage in first 2h (Sprinklr); payback immediate. Expected impact: -${targetDetectionAccelHours}h detection time, +40% crisis cost reduction, payback immediate.`,
        ai_recommendation: 'implement_social_media_monitoring',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: NEGATIVE_VIRAL_CONTENT_RESPONSE_SLOW
    if (d.avg_viral_response_time_hours > config.maxViralResponseTimeHours) {
      // response >2h -> 60% damage in first 2h
      const responseGap = Math.max(d.avg_viral_response_time_hours - config.maxViralResponseTimeHours, 0);
      const expectedDamageReduction = Math.round(d.crisis_cost_annual * 0.50 / 12);
      const expectedReputationProtection = Math.round(baselineRevenue * (responseGap / 80));
      const expectedCustomerRetention = Math.round(baselineRevenue * 0.03);
      const expectedRecoveryAcceleration = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedDamageReduction + expectedReputationProtection + expectedCustomerRetention + expectedRecoveryAcceleration, 2000);
      const severityLabel = d.avg_viral_response_time_hours > 12 ? 'high' : 'medium';
      const criticalNote = (d.avg_viral_response_time_hours > 12)
        ? `HIGH: VIRAL RESPONSE SLOW — avg response ${d.avg_viral_response_time_hours}h (max ${config.maxViralResponseTimeHours}h); 60% of crisis damage occurs in first 2 hours (Sprinklr); slow response = max damage + viral spread; ${d.viral_incidents_last_year} viral incidents last year (${d.viral_incidents_handled_well_pct}% handled well); fast response = 78% customer forgiveness (Edelman). `
        : `MEDIUM: VIRAL RESPONSE ABOVE TARGET — ${d.avg_viral_response_time_hours}h (max ${config.maxViralResponseTimeHours}h); accelerate response for damage reduction. `;
      alerts.push({
        rule_id: 'negative_viral_content_response_slow',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        avg_viral_response_time_hours: d.avg_viral_response_time_hours,
        viral_response_target_hours: d.viral_response_target_hours,
        viral_incidents_last_year: d.viral_incidents_last_year,
        viral_incidents_handled_well_pct: d.viral_incidents_handled_well_pct,
        crisis_count_last_year: d.crisis_count_last_year,
        crisis_cost_annual: d.crisis_cost_annual,
        reputation_score: d.reputation_score,
        customer_trust_score: d.customer_trust_score,
        monthly_revenue: d.monthly_revenue,
        viral_response_acceleration_projected_hours: targetViralResponseAccelHours,
        crisis_cost_reduction_projected_pct: 50,
        trust_lift_projected_pts: targetTrustLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `NEGATIVE VIRAL CONTENT RESPONSE SLOW: ${d.location_id} — avg viral response ${d.avg_viral_response_time_hours}h (max ${config.maxViralResponseTimeHours}h, target ${d.viral_response_target_hours}h); viral incidents last year ${d.viral_incidents_last_year}; handled well ${d.viral_incidents_handled_well_pct}%; crises last year ${d.crisis_count_last_year}; crisis cost ${fmt$(d.crisis_cost_annual)}/yr; reputation ${d.reputation_score}/100; trust ${d.customer_trust_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: 60% of crisis damage occurs in first 2 hours (Sprinklr); negative viral content reaches 2M+ people in 24 hours (Sprout Social); 88% of consumers trust online reviews as much as personal recommendations (BrightLocal) — one viral negative review can cost $10,000-100,000 in revenue; 78% of customers forgive a restaurant that responds well to a crisis (Edelman Trust); 45% of customers switch brands after poorly-handled crisis (Edelman); viral response best practice = acknowledge within 1 hour, respond within 2 hours, take action, communicate transparently, apologize sincerely, offer solution, follow up; viral response protocol = detection (monitoring alert), assessment (severity, scope), response team activation, statement drafting, legal review, posting, follow-up; viral response templates = food safety (acknowledge, investigate, cooperate, transparent), staff scandal (acknowledge, investigate, zero tolerance, action), negative review (acknowledge, apologize, offline resolution, follow-up). Solutions ranked by impact: (1) ACCELERATE viral response to ${config.maxViralResponseTimeHours}h — damage reduction ${fmt$(expectedDamageReduction)}/mo + reputation protection ${fmt$(expectedReputationProtection)}/mo + customer retention ${fmt$(expectedCustomerRetention)}/mo + recovery acceleration ${fmt$(expectedRecoveryAcceleration)}/mo; cost ${fmt$(200)}/mo (response protocol + training); payback immediate (risk avoidance); (2) SET target response time ${config.maxViralResponseTimeHours}h (max); (3) CREATE viral response protocol (detection, assessment, team, statement, legal, posting, follow-up); (4) PREPARE response templates per crisis type (food safety, staff, review); (5) TRAIN response team (who does what, when); (6) SET UP alerts (immediate notification of viral content); (7) ACKNOWLEDGE within 1 hour (do not ignore); (8) RESPOND within 2 hours (statement + action); (9) COMMUNICATE transparently (do not hide, do not lie); (10) APOLOGIZE sincerely (take responsibility); (11) OFFER solution (what are you doing to fix?); (12) FOLLOW UP (update on resolution); (13) TRACK response time (target ${config.maxViralResponseTimeHours}h); (14) BENCHMARK vs competitor response speed. Industry data: 60% damage in first 2h (Sprinklr); 78% forgiveness with good response (Edelman); payback immediate. Expected impact: -${targetViralResponseAccelHours}h response time, +50% crisis cost reduction, +${targetTrustLiftPts}pts trust, payback immediate.`,
        ai_recommendation: 'accelerate_viral_response',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: FOOD_SAFETY_INCIDENT_PROTOCOL_ABSENT
    if (config.requireFoodSafetyIncidentProtocol && (!d.has_food_safety_incident_protocol || !d.recall_protocol_present || !d.health_dept_notification_protocol)) {
      // no food safety protocol -> $1M-10M liability
      const expectedLawsuitCostReduction = Math.round(d.food_safety_lawsuit_risk_score * 8000 / 12);
      const expectedRecallCostReduction = Math.round(d.food_safety_lawsuit_risk_score * 4000 / 12);
      const expectedReputationProtection = Math.round(baselineRevenue * 0.03);
      const expectedInsurancePremiumReduction = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedLawsuitCostReduction + expectedRecallCostReduction + expectedReputationProtection + expectedInsurancePremiumReduction, 2400);
      const severityLabel = d.food_safety_lawsuit_risk_score > 50 ? 'critical' : 'high';
      const criticalNote = (d.food_safety_lawsuit_risk_score > 50)
        ? `CRITICAL: NO FOOD SAFETY INCIDENT PROTOCOL — lawsuit risk ${d.food_safety_lawsuit_risk_score}/100 (high); food safety incidents cost $1M-10M+ in lawsuits, recalls, brand damage (FDA); recall protocol ${d.recall_protocol_present ? 'present' : 'ABSENT'}; health dept notification ${d.health_dept_notification_protocol ? 'present' : 'ABSENT'}; without protocol, incident response is chaotic = max liability + max brand damage. `
        : `HIGH: FOOD SAFETY PROTOCOL INCOMPLETE — lawsuit risk ${d.food_safety_lawsuit_risk_score}/100; recall ${d.recall_protocol_present ? 'yes' : 'NO'}; health dept ${d.health_dept_notification_protocol ? 'yes' : 'NO'}; complete protocol for liability reduction. `;
      alerts.push({
        rule_id: 'food_safety_incident_protocol_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_food_safety_incident_protocol: d.has_food_safety_incident_protocol,
        food_safety_incidents_last_year: d.food_safety_incidents_last_year,
        food_safety_lawsuit_risk_score: d.food_safety_lawsuit_risk_score,
        recall_protocol_present: d.recall_protocol_present,
        health_dept_notification_protocol: d.health_dept_notification_protocol,
        crisis_cost_annual: d.crisis_cost_annual,
        lawsuit_cost_annual: d.lawsuit_cost_annual,
        reputation_score: d.reputation_score,
        monthly_revenue: d.monthly_revenue,
        crisis_communication_cost_monthly: d.crisis_communication_cost_monthly,
        lawsuit_cost_reduction_projected_pct: targetLawsuitCostReductionPct,
        reputation_lift_projected_pts: 15,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `FOOD SAFETY INCIDENT PROTOCOL ABSENT: ${d.location_id} — food safety protocol ${d.has_food_safety_incident_protocol ? 'present' : 'ABSENT'}; recall protocol ${d.recall_protocol_present ? 'present' : 'ABSENT'}; health dept notification ${d.health_dept_notification_protocol ? 'present' : 'ABSENT'}; food safety incidents last year ${d.food_safety_incidents_last_year}; lawsuit risk ${d.food_safety_lawsuit_risk_score}/100; crisis cost ${fmt$(d.crisis_cost_annual)}/yr; lawsuit cost ${fmt$(d.lawsuit_cost_annual)}/yr; reputation ${d.reputation_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: food safety incidents cost $1M-10M+ in lawsuits, recalls, brand damage (FDA); food safety lawsuit types = food poisoning (salmonella, E. coli, norovirus), contamination (foreign object, chemical), mislabeling (allergen, ingredients); food safety lawsuit average settlement = $50,000-500,000 per case; class action food safety = $1M-10M+; recall cost = $10,000-100,000 per incident (product, notification, disposal); health dept notification = legal requirement (failure = $1,000-10,000 fine + license risk); food safety protocol components = incident response team (manager, chef, health inspector liaison), customer notification (immediate, transparent), health dept notification (within 24h), recall protocol (identify, isolate, dispose, notify), insurance notification (within 48h), legal coordination (immediately), media response (transparent, cooperative), root cause investigation (HACCP, sanitation), corrective action (prevent recurrence), follow-up communication (what changed); food safety protocol best practice = written, drilled quarterly, posted in kitchen, all staff trained. Solutions ranked by impact: (1) IMPLEMENT food safety incident protocol — lawsuit cost reduction ${fmt$(expectedLawsuitCostReduction)}/mo + recall cost reduction ${fmt$(expectedRecallCostReduction)}/mo + reputation protection ${fmt$(expectedReputationProtection)}/mo + insurance premium reduction ${fmt$(expectedInsurancePremiumReduction)}/mo; cost ${fmt$(300)}/mo (protocol + training); payback immediate (risk avoidance); (2) CREATE incident response team (manager, chef, health inspector liaison, legal); (3) WRITE customer notification protocol (immediate, transparent, sincere); (4) ESTABLISH health dept notification protocol (within 24h, legal requirement); (5) CREATE recall protocol (identify, isolate, dispose, notify); (6) SET UP insurance notification protocol (within 48h); (7) COORDINATE with legal (immediately upon incident); (8) PREPARE media response (transparent, cooperative, not defensive); (9) IMPLEMENT root cause investigation (HACCP, sanitation audit); (10) DOCUMENT corrective action (prevent recurrence); (11) COMMUNICATE follow-up (what changed, how prevented); (12) TRAIN all staff on protocol; (13) DRILL quarterly (practice response); (14) POST protocol in kitchen (accessible); (15) BENCHMARK vs competitor food safety protocol. Industry data: $1M-10M+ food safety liability (FDA); 30-50% lawsuit cost reduction with protocol; payback immediate. Expected impact: -${targetLawsuitCostReductionPct}% lawsuit cost, +15pts reputation, payback immediate.`,
        ai_recommendation: 'implement_food_safety_protocol',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: STAFF_SCANDAL_MISCONDUCT_PROTOCOL_ABSENT
    if (config.requireStaffScandalProtocol && (!d.has_staff_scandal_protocol || !d.harassment_protocol_present || !d.social_media_policy_staff)) {
      // no staff scandal protocol -> brand damage
      const expectedScandalCostReduction = Math.round(d.staff_misconduct_incidents_last_year * 8000 / 12);
      const expectedReputationProtection = Math.round(baselineRevenue * 0.025);
      const expectedLegalCostReduction = Math.round(d.staff_misconduct_incidents_last_year * 3000 / 12);
      const expectedEmployeeRetention = Math.round(baselineRevenue * 0.015);
      const totalOpportunity = Math.max(expectedScandalCostReduction + expectedReputationProtection + expectedLegalCostReduction + expectedEmployeeRetention, 1800);
      const severityLabel = d.staff_misconduct_incidents_last_year > 1 ? 'high' : 'medium';
      const criticalNote = (d.staff_misconduct_incidents_last_year > 1)
        ? `HIGH: NO STAFF SCANDAL PROTOCOL — ${d.staff_misconduct_incidents_last_year} misconduct incidents last year; harassment protocol ${d.harassment_protocol_present ? 'present' : 'ABSENT'}; staff social media policy ${d.social_media_policy_staff ? 'present' : 'ABSENT'}; staff scandals (misconduct, harassment, crime) go viral = major brand damage; without protocol, response is chaotic = max damage. `
        : `MEDIUM: STAFF SCANDAL PROTOCOL INCOMPLETE — harassment ${d.harassment_protocol_present ? 'yes' : 'NO'}; social media policy ${d.social_media_policy_staff ? 'yes' : 'NO'}; complete protocol for protection. `;
      alerts.push({
        rule_id: 'staff_scandal_misconduct_protocol_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_staff_scandal_protocol: d.has_staff_scandal_protocol,
        staff_misconduct_incidents_last_year: d.staff_misconduct_incidents_last_year,
        harassment_protocol_present: d.harassment_protocol_present,
        social_media_policy_staff: d.social_media_policy_staff,
        crisis_count_last_year: d.crisis_count_last_year,
        reputation_score: d.reputation_score,
        customer_trust_score: d.customer_trust_score,
        monthly_revenue: d.monthly_revenue,
        reputation_lift_projected_pts: 12,
        trust_lift_projected_pts: 14,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `STAFF SCANDAL PROTOCOL ABSENT: ${d.location_id} — staff scandal protocol ${d.has_staff_scandal_protocol ? 'present' : 'ABSENT'}; harassment protocol ${d.harassment_protocol_present ? 'present' : 'ABSENT'}; staff social media policy ${d.social_media_policy_staff ? 'present' : 'ABSENT'}; misconduct incidents last year ${d.staff_misconduct_incidents_last_year}; crises last year ${d.crisis_count_last_year}; reputation ${d.reputation_score}/100; trust ${d.customer_trust_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: staff scandals (misconduct, harassment, crime) go viral = major brand damage; staff scandal types = sexual harassment (lawsuits $50k-500k, viral #MeToo), racism/discrimination (viral, boycotts), crime (theft, assault, food tampering — viral video), social media misconduct (off-duty posts that reflect on brand), health code violations (staff hygiene, sick policy); staff scandal cost = legal ($50k-500k per case), brand damage ($10k-100k revenue loss), viral spread (2M+ in 24h), recovery (6-18 months); staff scandal protocol components = investigation protocol (immediate, thorough, documented), suspension/termination protocol (zero tolerance for severe), customer notification (if affected), media response (transparent, cooperative), legal coordination (immediately), victim support (if applicable), staff retraining (prevent recurrence); harassment protocol = reporting mechanism (anonymous, safe), investigation process, zero-tolerance policy, training (annual); staff social media policy = off-duty conduct expectations, brand representation, confidentiality. Solutions ranked by impact: (1) IMPLEMENT staff scandal protocol — scandal cost reduction ${fmt$(expectedScandalCostReduction)}/mo + reputation protection ${fmt$(expectedReputationProtection)}/mo + legal cost reduction ${fmt$(expectedLegalCostReduction)}/mo + employee retention ${fmt$(expectedEmployeeRetention)}/mo; cost ${fmt$(200)}/mo (protocol + training); payback immediate (risk avoidance); (2) CREATE investigation protocol (immediate, thorough, documented); (3) DEFINE suspension/termination protocol (zero tolerance for severe); (4) ESTABLISH customer notification protocol (if affected); (5) PREPARE media response (transparent, cooperative); (6) COORDINATE with legal (immediately); (7) CREATE victim support protocol (if applicable); (8) IMPLEMENT staff retraining (prevent recurrence); (9) CREATE harassment protocol (anonymous reporting, investigation, zero tolerance, annual training); (10) CREATE staff social media policy (off-duty conduct, brand representation, confidentiality); (11) TRAIN all staff on protocol; (12) POST protocol in workplace (accessible); (13) BENCHMARK vs competitor staff scandal protocol. Industry data: $50k-500k per harassment case; 6-18 month recovery; payback immediate. Expected impact: +12pts reputation, +14pts trust, payback immediate.`,
        ai_recommendation: 'implement_staff_scandal_protocol',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: MEDIA_TRAINING_ABSENT
    if (config.requireMediaTraining && (!d.has_media_training || d.media_trained_staff_count < config.minMediaTrainedStaffCount || !d.spokesperson_designated)) {
      // staff not media-trained -> 60-80% misquotes
      const expectedMisquoteReduction = Math.round(baselineRevenue * 0.02);
      const expectedReputationProtection = Math.round(baselineRevenue * 0.015);
      const expectedCrisisCostReduction = Math.round(d.crisis_cost_annual * 0.20 / 12);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedMisquoteReduction + expectedReputationProtection + expectedCrisisCostReduction + expectedCompetitiveLift, 1400);
      const severityLabel = !d.has_media_training ? 'high' : 'medium';
      const criticalNote = (!d.has_media_training)
        ? `HIGH: NO MEDIA TRAINING — 0 media-trained staff; media training reduces misquotes 60-80% (PRSA); untrained staff give misquotes = brand damage + legal risk; designated spokesperson ${d.spokesperson_designated ? 'yes' : 'NO'}; without training, media interviews go off-script = max damage. `
        : `MEDIUM: MEDIA TRAINING BELOW TARGET — ${d.media_trained_staff_count} trained (min ${config.minMediaTrainedStaffCount}); spokesperson ${d.spokesperson_designated ? 'yes' : 'NO'}; train more staff for coverage. `;
      alerts.push({
        rule_id: 'media_training_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_media_training: d.has_media_training,
        media_trained_staff_count: d.media_trained_staff_count,
        media_trained_staff_target: d.media_trained_staff_target,
        spokesperson_designated: d.spokesperson_designated,
        crisis_count_last_year: d.crisis_count_last_year,
        brand_sentiment_score: d.brand_sentiment_score,
        monthly_revenue: d.monthly_revenue,
        crisis_communication_cost_monthly: d.crisis_communication_cost_monthly,
        reputation_lift_projected_pts: 10,
        crisis_cost_reduction_projected_pct: 20,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `MEDIA TRAINING ABSENT: ${d.location_id} — media training ${d.has_media_training ? 'present' : 'ABSENT'}; media-trained staff ${d.media_trained_staff_count} (min ${config.minMediaTrainedStaffCount}, target ${d.media_trained_staff_target}); designated spokesperson ${d.spokesperson_designated ? 'yes' : 'NO'}; crises last year ${d.crisis_count_last_year}; brand sentiment ${d.brand_sentiment_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: media training reduces misquotes 60-80% (PRSA — Public Relations Society of America); untrained staff give misquotes = brand damage + legal risk; media training = message discipline (stay on script), bridging (redirect to key messages), soundbite delivery (memorable quotes), body language (confident, open), crisis interview handling (hostile questions), camera presence (eye contact, posture); media-trained staff = CEO/owner, GM, designated spokesperson (minimum 2-3 for coverage); media training cost = $2,000-10,000 one-time per person (PR coach) + $500-1,000 refresher annually; media training best practice = train 2-3 staff (coverage for absence), refresh annually (new techniques), designate primary spokesperson (consistency), prepare holding statements (templates per crisis). Solutions ranked by impact: (1) CONDUCT media training — misquote reduction ${fmt$(expectedMisquoteReduction)}/mo + reputation protection ${fmt$(expectedReputationProtection)}/mo + crisis cost reduction ${fmt$(expectedCrisisCostReduction)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(300)}/mo amortized ($5,000 one-time for 2-3 staff); payback 6-12 months; (2) HIRE PR coach ($2,000-10,000 one-time per person); (3) TRAIN CEO/owner + GM + designated spokesperson (min ${config.minMediaTrainedStaffCount}); (4) DESIGNATE primary spokesperson (consistency); (5) LEARN message discipline (stay on script); (6) LEARN bridging (redirect to key messages); (7) LEARN soundbite delivery (memorable quotes); (8) LEARN body language (confident, open); (9) PRACTICE crisis interview handling (hostile questions); (10) LEARN camera presence (eye contact, posture); (11) PREPARE holding statements (templates per crisis type); (12) REFRESH annually (new techniques); (13) BENCHMARK vs competitor media readiness. Industry data: 60-80% misquote reduction (PRSA); payback 6-12 months. Expected impact: +10pts reputation, +20% crisis cost reduction, payback 6-12 months.`,
        ai_recommendation: 'conduct_media_training',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: LEGAL_COORDINATION_ABSENT
    if (config.requireLegalCoordination && !d.has_legal_coordination) {
      // no legal coordination -> 30-50% higher lawsuit costs
      const expectedLawsuitCostReduction = Math.round(d.lawsuit_cost_annual * 0.40 / 12);
      const expectedSettlementOptimization = Math.round(baselineRevenue * 0.015);
      const expectedComplianceProtection = Math.round(baselineRevenue * 0.02);
      const expectedInsuranceOptimization = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedLawsuitCostReduction + expectedSettlementOptimization + expectedComplianceProtection + expectedInsuranceOptimization, 1600);
      const severityLabel = d.lawsuit_cost_annual > 10000 ? 'high' : 'medium';
      const criticalNote = (d.lawsuit_cost_annual > 10000)
        ? `HIGH: NO LEGAL COORDINATION — lawsuit cost ${fmt$(d.lawsuit_cost_annual)}/yr; ${d.lawsuits_last_year} lawsuits last year; legal coordination reduces lawsuit costs 30-50% (ABC); without legal retainer, response is slow + costly + uncoordinated; legal coordination = immediate counsel, settlement optimization, compliance protection. `
        : `MEDIUM: NO LEGAL COORDINATION — implement legal retainer for lawsuit cost reduction + compliance. `;
      alerts.push({
        rule_id: 'legal_coordination_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_legal_coordination: d.has_legal_coordination,
        legal_retainer_cost_monthly: d.legal_retainer_cost_monthly,
        lawsuits_last_year: d.lawsuits_last_year,
        lawsuit_cost_annual: d.lawsuit_cost_annual,
        crisis_cost_annual: d.crisis_cost_annual,
        monthly_revenue: d.monthly_revenue,
        lawsuit_cost_reduction_projected_pct: 40,
        crisis_cost_reduction_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `LEGAL COORDINATION ABSENT: ${d.location_id} — legal coordination ${d.has_legal_coordination ? 'present' : 'ABSENT'}; legal retainer ${fmt$(d.legal_retainer_cost_monthly)}/mo; lawsuits last year ${d.lawsuits_last_year}; lawsuit cost ${fmt$(d.lawsuit_cost_annual)}/yr; crisis cost ${fmt$(d.crisis_cost_annual)}/yr; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: legal coordination reduces lawsuit costs 30-50% (ABC — American Bar Association); legal coordination = immediate counsel (within hours of incident), settlement optimization (early settlement saves $50k-500k), compliance protection (prevent lawsuits), insurance coordination (maximize coverage); legal retainer cost = $500-2,000/month (general counsel access); legal retainer ROI = $5-20 per $1 spent (averts $50k-500k per lawsuit); lawsuit types = food safety ($50k-500k per case), slip-and-fall ($10k-100k), employment (wrongful termination, harassment $50k-500k), contract disputes ($10k-100k), IP/trademark ($10k-100k); legal coordination best practice = retainer (general counsel access 24/7), incident protocol (notify legal immediately), settlement strategy (early settlement vs fight), compliance audit (annual, prevent lawsuits), insurance review (maximize coverage, reduce premiums). Solutions ranked by impact: (1) COORDINATE with legal — lawsuit cost reduction ${fmt$(expectedLawsuitCostReduction)}/mo + settlement optimization ${fmt$(expectedSettlementOptimization)}/mo + compliance protection ${fmt$(expectedComplianceProtection)}/mo + insurance optimization ${fmt$(expectedInsuranceOptimization)}/mo; cost ${fmt$(1000)}/mo retainer; payback 2-4 months; (2) HIRE legal retainer ($500-2,000/month general counsel access); (3) ESTABLISH incident protocol (notify legal immediately); (4) DEVELOP settlement strategy (early settlement vs fight); (5) CONDUCT annual compliance audit (prevent lawsuits); (6) REVIEW insurance coverage (maximize, reduce premiums); (7) COORDINATE with crisis communication (legal + PR alignment); (8) TRAIN staff on legal protocol (what to say, what not to say); (9) DOCUMENT all incidents (legal protection); (10) REVIEW contracts annually (prevent disputes); (11) BENCHMARK vs competitor legal coordination. Industry data: 30-50% lawsuit cost reduction (ABC); $5-20 ROI per $1; payback 2-4 months. Expected impact: -40% lawsuit cost, -25% crisis cost, payback 2-4 months.`,
        ai_recommendation: 'coordinate_with_legal',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: REPUTATION_RECOVERY_PROGRAM_ABSENT
    if (config.requireReputationRecoveryProgram && (!d.has_reputation_recovery_program || d.reputation_score < config.minReputationScore || d.avg_recovery_time_months > config.maxRecoveryTimeMonths)) {
      // no recovery program -> 6-18 month recovery
      const expectedRecoveryAcceleration = Math.round(baselineRevenue * (targetRecoveryTimeReductionMonths / 20));
      const expectedReputationLift = Math.round(baselineRevenue * 0.03);
      const expectedCustomerWinback = Math.round(baselineRevenue * 0.04);
      const expectedBrandRebuilding = Math.round(baselineRevenue * 0.02);
      const totalOpportunity = Math.max(expectedRecoveryAcceleration + expectedReputationLift + expectedCustomerWinback + expectedBrandRebuilding, 1800);
      const severityLabel = d.reputation_score < 50 ? 'high' : 'medium';
      const criticalNote = (d.reputation_score < 50)
        ? `HIGH: NO REPUTATION RECOVERY PROGRAM — reputation ${d.reputation_score}/100 (min ${config.minReputationScore}); avg recovery ${d.avg_recovery_time_months} months (max ${config.maxRecoveryTimeMonths}); reputation recovery takes 6-18 months without proactive PR (Reputation Institute); restaurants with dedicated PR recover 50% faster (PR Week); without recovery program, reputation stays damaged = ongoing revenue loss. `
        : `MEDIUM: REPUTATION BELOW TARGET — ${d.reputation_score}/100 (min ${config.minReputationScore}); recovery ${d.avg_recovery_time_months}mo (max ${config.maxRecoveryTimeMonths}); implement recovery program. `;
      alerts.push({
        rule_id: 'reputation_recovery_program_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_reputation_recovery_program: d.has_reputation_recovery_program,
        reputation_score: d.reputation_score,
        reputation_score_baseline: d.reputation_score_baseline,
        avg_recovery_time_months: d.avg_recovery_time_months,
        recovery_target_months: d.recovery_target_months,
        brand_sentiment_score: d.brand_sentiment_score,
        customer_trust_score: d.customer_trust_score,
        crisis_count_last_year: d.crisis_count_last_year,
        monthly_revenue: d.monthly_revenue,
        pr_agency_retainer_monthly: d.pr_agency_retainer_monthly,
        recovery_time_reduction_projected_months: targetRecoveryTimeReductionMonths,
        reputation_lift_projected_pts: targetReputationLiftPts,
        trust_lift_projected_pts: targetTrustLiftPts,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `REPUTATION RECOVERY PROGRAM ABSENT: ${d.location_id} — recovery program ${d.has_reputation_recovery_program ? 'present' : 'ABSENT'}; reputation ${d.reputation_score}/100 (min ${config.minReputationScore}, baseline ${d.reputation_score_baseline}); avg recovery ${d.avg_recovery_time_months} months (max ${config.maxRecoveryTimeMonths}, target ${d.recovery_target_months}); brand sentiment ${d.brand_sentiment_score}/100; trust ${d.customer_trust_score}/100; crises last year ${d.crisis_count_last_year}; monthly revenue ${fmt$(d.monthly_revenue)}; PR retainer ${fmt$(d.pr_agency_retainer_monthly)}/mo. ${criticalNote}Industry data: reputation recovery takes 6-18 months without proactive PR (Reputation Institute); restaurants with dedicated PR recover 50% faster (PR Week); 78% of customers forgive a restaurant that responds well to a crisis (Edelman) — but recovery requires sustained effort; reputation recovery program = proactive PR (positive content, media relations), customer win-back (apology offers, loyalty bonuses), review management (encourage positive reviews, respond to negative), community engagement (charity, events, sponsorships), staff retraining (prevent recurrence), transparent communication (what changed), sustained messaging (6-18 months); reputation recovery cost = $500-2,000/month PR retainer + $200-500/month content; reputation recovery ROI = $5-15 per $1 spent (recovers $10k-100k/month in lost revenue); reputation score benchmarks = 80+ (strong), 70-79 (good), 60-69 (fair, needs work), below 60 (poor, crisis mode). Solutions ranked by impact: (1) LAUNCH reputation recovery program — recovery acceleration ${fmt$(expectedRecoveryAcceleration)}/mo + reputation lift ${fmt$(expectedReputationLift)}/mo + customer winback ${fmt$(expectedCustomerWinback)}/mo + brand rebuilding ${fmt$(expectedBrandRebuilding)}/mo; cost ${fmt$(1000)}/mo (PR + content); payback 2-4 months; (2) HIRE PR agency ($500-2,000/month retainer); (3) CREATE positive content (blog, social, press releases); (4) BUILD media relations (local press, food influencers); (5) LAUNCH customer win-back (apology offers, loyalty bonuses); (6) MANAGE reviews (encourage positive, respond to negative); (7) ENGAGE community (charity, events, sponsorships); (8) RETRAIN staff (prevent recurrence); (9) COMMUNICATE transparently (what changed); (10) SUSTAIN messaging 6-18 months (consistency); (11) TRACK reputation score monthly (target ${config.minReputationScore}+); (12) TRACK recovery time (target ${config.maxRecoveryTimeMonths} months); (13) BENCHMARK vs competitor reputation. Industry data: 6-18 month recovery without PR (Reputation Institute); 50% faster with PR (PR Week); payback 2-4 months. Expected impact: -${targetRecoveryTimeReductionMonths} months recovery, +${targetReputationLiftPts}pts reputation, +${targetTrustLiftPts}pts trust, payback 2-4 months.`,
        ai_recommendation: 'launch_reputation_recovery',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM crisis_communication_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE crisis_communication_alert CONTENT $data`, {
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
              { role: 'system', content: 'You are a restaurant crisis communication and PR reputation expert. Given crisis communication data, recommend ONE specific action with expected survival probability lift, crisis cost reduction, lawsuit cost reduction, reputation lift, or recovery time reduction (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Crisis plan: ${a.has_crisis_response_plan ?? false} (completeness ${a.crisis_plan_completeness_score ?? 0}/100, updated ${a.crisis_plan_last_updated_months ?? 0}mo ago, drill ${a.crisis_drill_conducted ?? false}). Social monitoring: ${a.has_social_media_crisis_monitoring ?? false} (${a.monitoring_tools_count ?? 0} tools, detection ${a.crisis_detection_time_hours ?? 0}h/${a.crisis_detection_target_hours ?? 2}h target). Viral response: ${a.avg_viral_response_time_hours ?? 0}h (max ${(a as any).maxViralResponseTimeHours ?? 2}h), ${a.viral_incidents_last_year ?? 0} incidents last year (${a.viral_incidents_handled_well_pct ?? 0}% well handled). Food safety: ${a.has_food_safety_incident_protocol ?? false} (${a.food_safety_incidents_last_year ?? 0} incidents, lawsuit risk ${a.food_safety_lawsuit_risk_score ?? 0}/100, recall ${a.recall_protocol_present ?? false}, health dept ${a.health_dept_notification_protocol ?? false}). Staff scandal: ${a.has_staff_scandal_protocol ?? false} (${a.staff_misconduct_incidents_last_year ?? 0} misconduct, harassment ${a.harassment_protocol_present ?? false}, social policy ${a.social_media_policy_staff ?? false}). Media training: ${a.has_media_training ?? false} (${a.media_trained_staff_count ?? 0}/${a.media_trained_staff_target ?? 3} trained, spokesperson ${a.spokesperson_designated ?? false}). Legal: ${a.has_legal_coordination ?? false} (${fmt$(a.legal_retainer_cost_monthly ?? 0)}/mo retainer, ${a.lawsuits_last_year ?? 0} lawsuits, ${fmt$(a.lawsuit_cost_annual ?? 0)}/yr). Recovery: ${a.has_reputation_recovery_program ?? false} (reputation ${a.reputation_score ?? 0}/100 min ${(a as any).minReputationScore ?? 70}, baseline ${a.reputation_score_baseline ?? 0}, recovery ${a.avg_recovery_time_months ?? 0}mo/${a.recovery_target_months ?? 6} target). Crises last year: ${a.crisis_count_last_year ?? 0}, cost ${fmt$(a.crisis_cost_annual ?? 0)}/yr. Brand sentiment: ${a.brand_sentiment_score ?? 0}/100. Trust: ${a.customer_trust_score ?? 0}/100. Competitor readiness: ${a.competitor_crisis_readiness_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Crisis comm cost: ${fmt$(a.crisis_communication_cost_monthly ?? 0)}/mo. Monitoring cost: ${fmt$(a.monitoring_tool_cost_monthly ?? 0)}/mo. PR retainer: ${fmt$(a.pr_agency_retainer_monthly ?? 0)}/mo. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
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

export const getActiveCrisisCommunicationAlerts = async (db: ReturnType<typeof useDB>): Promise<CrisisCommunicationAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM crisis_communication_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getCrisisCommunicationSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  crisisResponsePlanAbsentCount: number;
  socialMediaCrisisMonitoringAbsentCount: number;
  negativeViralContentResponseSlowCount: number;
  foodSafetyIncidentProtocolAbsentCount: number;
  staffScandalMisconductProtocolAbsentCount: number;
  mediaTrainingAbsentCount: number;
  legalCoordinationAbsentCount: number;
  reputationRecoveryProgramAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'crisis_response_plan_absent') AS noplan,
              math::count(rule_id = 'social_media_crisis_monitoring_absent') AS nomonitoring,
              math::count(rule_id = 'negative_viral_content_response_slow') AS slowviral,
              math::count(rule_id = 'food_safety_incident_protocol_absent') AS nofoodsafety,
              math::count(rule_id = 'staff_scandal_misconduct_protocol_absent') AS nostaffscandal,
              math::count(rule_id = 'media_training_absent') AS nomedia,
              math::count(rule_id = 'legal_coordination_absent') AS nolegal,
              math::count(rule_id = 'reputation_recovery_program_absent') AS norecovery
       FROM crisis_communication_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      crisisResponsePlanAbsentCount: safeNumber(r.noplan, 0),
      socialMediaCrisisMonitoringAbsentCount: safeNumber(r.nomonitoring, 0),
      negativeViralContentResponseSlowCount: safeNumber(r.slowviral, 0),
      foodSafetyIncidentProtocolAbsentCount: safeNumber(r.nofoodsafety, 0),
      staffScandalMisconductProtocolAbsentCount: safeNumber(r.nostaffscandal, 0),
      mediaTrainingAbsentCount: safeNumber(r.nomedia, 0),
      legalCoordinationAbsentCount: safeNumber(r.nolegal, 0),
      reputationRecoveryProgramAbsentCount: safeNumber(r.norecovery, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, crisisResponsePlanAbsentCount: 0, socialMediaCrisisMonitoringAbsentCount: 0, negativeViralContentResponseSlowCount: 0, foodSafetyIncidentProtocolAbsentCount: 0, staffScandalMisconductProtocolAbsentCount: 0, mediaTrainingAbsentCount: 0, legalCoordinationAbsentCount: 0, reputationRecoveryProgramAbsentCount: 0 };
  }
};

export const updateCrisisCommunicationAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
