/**
 * AI Influencer & Food Blogger Outreach Optimizer — predicts how influencer
 * partnerships (micro-influencers, food bloggers, Instagram, TikTok, YouTube,
 * paid vs trade, content rights, follower count, engagement rate, niche
 * alignment, ROI tracking) impact brand awareness, new customer acquisition,
 * social media engagement, and revenue.
 *
 * 201st POSR-exclusive differentiator.
 */

import { useState, useCallback, useMemo } from "react";
import { useDB } from "@/api/db/db.ts";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/common/input/button.tsx";
import { DocumentTitle } from "@/components/common/document-title.tsx";
import { Layout } from "@/screens/partials/layout.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes, faUserGroup, faPenFancy, faVideo, faLink, faHashtag,
  faChartLine, faSackDollar,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runInfluencerOutreachEngine, getActiveInfluencerOutreachAlerts, getInfluencerOutreachSummary,
  updateInfluencerOutreachAlertStatus, readInfluencerOutreachConfig, DEFAULT_INFLUENCER_OUTREACH_CONFIG,
  type InfluencerOutreachAlert,
} from "@/lib/influencer-outreach-optimizer.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  influencer_partnership_program_absent:    { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faShareNodes,    label: 'NO PROGRAM' },
  micro_influencer_strategy_absent:         { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faUserGroup,     label: 'NO MICRO' },
  food_blogger_outreach_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faPenFancy,      label: 'NO BLOGGER' },
  tiktok_strategy_absent:                   { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faVideo,         label: 'NO TIKTOK' },
  influencer_content_rights_unclear:        { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faLink,          label: 'NO RIGHTS' },
  influencer_niche_misalignment:            { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faHashtag,       label: 'NICHE MISMATCH' },
  influencer_engagement_rate_low:           { bg: 'bg-yellow-50',    text: 'text-yellow-700',    icon: faChartLine,     label: 'LOW ENGAGEMENT' },
  influencer_roi_tracking_absent:           { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faSackDollar,    label: 'NO ROI TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function InfluencerOutreachOptimizerScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<InfluencerOutreachAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, influencerPartnershipProgramAbsentCount: 0, microInfluencerStrategyAbsentCount: 0, foodBloggerOutreachAbsentCount: 0, tiktokStrategyAbsentCount: 0, influencerContentRightsUnclearCount: 0, influencerNicheMisalignmentCount: 0, influencerEngagementRateLowCount: 0, influencerRoiTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_INFLUENCER_OUTREACH_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readInfluencerOutreachConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveInfluencerOutreachAlerts(db), getInfluencerOutreachSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[influencer-outreach-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runInfluencerOutreachEngine(db, config);
      toast.success(`Analyzed ${result.generated} influencer outreach signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[influencer-outreach-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateInfluencerOutreachAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[influencer-outreach-report] status failed', err);
      toast.error('Update failed');
    }
  }, [db, reload]);

  const sortedAlerts = useMemo(() =>
    [...alerts].sort((a, b) => {
      const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const s = sevOrder[a.severity as keyof typeof sevOrder] - sevOrder[b.severity as keyof typeof sevOrder];
      if (s !== 0) return s;
      return (b.est_monthly_opportunity ?? 0) - (a.est_monthly_opportunity ?? 0);
    }),
  [alerts]);

  return (
    <Layout>
      <DocumentTitle parts={["AI Influencer & Food Blogger Outreach Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faShareNodes} className="text-rose-600" />
              AI Influencer &amp; Food Blogger Outreach Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how influencer partnerships (micro-influencers 10k-100k, food bloggers, Instagram, TikTok, YouTube, paid vs trade, content rights, follower count, engagement rate, niche alignment, ROI tracking) impact brand awareness, new customer acquisition, social media engagement, revenue — influencer marketing ROI = $6.50 per $1 spent (Influencer Marketing Hub); micro-influencers 3-7% engagement vs 1-2% mega (Mediakix); 86% trust influencer recommendations over ads; food influencers drive 22% of restaurant discovery (NRA); 49% rely on influencer recommendations for dining (Zizzi); TikTok food trends drive 30-40% traffic spikes; 72% of millennials follow food influencers; influencer content 8x more engagement than brand content (Sprout Social); 5-10x longer shelf life than paid ads; restaurants without influencer strategy miss 15-25% of new customer acquisition
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faShareNodes} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze outreach'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faShareNodes} label="No influencer program" value={String(summary.influencerPartnershipProgramAbsentCount)} color={summary.influencerPartnershipProgramAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUserGroup} label="No micro strategy" value={String(summary.microInfluencerStrategyAbsentCount)} color={summary.microInfluencerStrategyAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faPenFancy} label="No blogger / no TikTok" value={String(summary.foodBloggerOutreachAbsentCount + summary.tiktokStrategyAbsentCount)} color={(summary.foodBloggerOutreachAbsentCount + summary.tiktokStrategyAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faSackDollar} label="No rights / no ROI / low engagement" value={String(summary.influencerContentRightsUnclearCount + summary.influencerRoiTrackingAbsentCount + summary.influencerEngagementRateLowCount)} color={(summary.influencerContentRightsUnclearCount + summary.influencerRoiTrackingAbsentCount + summary.influencerEngagementRateLowCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faShareNodes} spin className="text-4xl mb-3" />
            <p>Analyzing influencer outreach opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No influencer outreach alerts</p>
            <p className="text-sm mt-1">Healthy influencer outreach environment: active influencer program (5+ partnerships); micro-influencer strategy (10k-100k followers, 3-7% engagement); food blogger outreach (4-8 partnerships, long-form SEO content); TikTok strategy (3-5 posts/week, trending audio); content usage rights secured (repurpose for ads, website, email); influencer niche alignment 75+ (match restaurant niche); avg engagement rate 3%+ (replace under-2%); ROI tracking (UTM links, promo codes, ROAS 3-6x); influencer marketing ROI = $6.50 per $1 spent (Influencer Marketing Hub); micro-influencers 3-7% engagement vs 1-2% mega (Mediakix); 86% trust influencer recommendations over ads; food influencers drive 22% of restaurant discovery (NRA); 49% rely on influencer recommendations (Zizzi); TikTok food trends drive 30-40% traffic spikes; 72% of millennials follow food influencers; influencer content 8x more engagement than brand content (Sprout Social); restaurants without influencer strategy miss 15-25% of new customer acquisition.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faShareNodes, label: alert.rule_id.toUpperCase() };
              return (
                <div key={alert.id ?? idx} className="border border-neutral-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${style.bg} ${style.text} shrink-0`}>
                        <FontAwesomeIcon icon={style.icon} />
                        {style.label}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {alert.location_id && (
                            <span className="text-sm font-semibold text-neutral-800 uppercase">{alert.location_id}</span>
                          )}
                          {alert.restaurant_tier && (
                            <span className="text-xs text-neutral-500">{alert.restaurant_tier}</span>
                          )}
                          {alert.market_setting && (
                            <span className="text-xs text-neutral-500">{alert.market_setting}</span>
                          )}
                          {alert.channel && (
                            <span className={`text-xs font-medium ${alert.channel === 'dine_in' ? 'text-emerald-600' : alert.channel === 'mixed' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_influencer_program != null && (
                            <span className={`text-xs ${alert.has_influencer_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_influencer_program ? 'program yes' : 'NO program'}</span>
                          )}
                          {alert.influencer_partnerships_count != null && alert.influencer_partnerships_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.influencer_partnerships_count} partnerships</span>
                          )}
                          {alert.influencer_budget_monthly != null && alert.influencer_budget_monthly >= 0 && (
                            <span className={`text-xs ${alert.influencer_budget_monthly < 500 ? 'text-rose-600 font-medium' : alert.influencer_budget_monthly < 1500 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.influencer_budget_monthly)}/mo budget</span>
                          )}
                          {alert.has_micro_influencer_strategy != null && (
                            <span className={`text-xs ${alert.has_micro_influencer_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_micro_influencer_strategy ? 'micro yes' : 'NO micro'}</span>
                          )}
                          {alert.micro_influencer_count != null && alert.micro_influencer_count >= 0 && (
                            <span className={`text-xs ${alert.micro_influencer_count < 3 ? 'text-rose-600 font-medium' : alert.micro_influencer_count < 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.micro_influencer_count} micro</span>
                          )}
                          {alert.has_food_blogger_outreach != null && (
                            <span className={`text-xs ${alert.has_food_blogger_outreach ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_food_blogger_outreach ? 'blogger yes' : 'NO blogger'}</span>
                          )}
                          {alert.food_blogger_partnerships_count != null && alert.food_blogger_partnerships_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.food_blogger_partnerships_count} bloggers</span>
                          )}
                          {alert.has_tiktok_strategy != null && (
                            <span className={`text-xs ${alert.has_tiktok_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_tiktok_strategy ? 'tiktok yes' : 'NO tiktok'}</span>
                          )}
                          {alert.tiktok_followers != null && alert.tiktok_followers > 0 && (
                            <span className="text-xs text-fuchsia-600 font-medium">{alert.tiktok_followers} tiktok</span>
                          )}
                          {alert.tiktok_views_monthly != null && alert.tiktok_views_monthly > 0 && (
                            <span className="text-xs text-fuchsia-600 font-medium">{alert.tiktok_views_monthly} views/mo</span>
                          )}
                          {alert.has_content_usage_rights != null && (
                            <span className={`text-xs ${alert.has_content_usage_rights ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_content_usage_rights ? 'rights yes' : 'NO rights'}</span>
                          )}
                          {alert.content_rights_clarity_score != null && alert.content_rights_clarity_score >= 0 && (
                            <span className={`text-xs ${alert.content_rights_clarity_score < 60 ? 'text-rose-600 font-medium' : alert.content_rights_clarity_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.content_rights_clarity_score}/100 rights</span>
                          )}
                          {alert.influencer_niche_alignment_score != null && alert.influencer_niche_alignment_score > 0 && (
                            <span className={`text-xs ${alert.influencer_niche_alignment_score < 60 ? 'text-rose-600 font-medium' : alert.influencer_niche_alignment_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.influencer_niche_alignment_score}/100 niche</span>
                          )}
                          {alert.niche_mismatch_count != null && alert.niche_mismatch_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.niche_mismatch_count} mismatched</span>
                          )}
                          {alert.restaurant_niche && (
                            <span className="text-xs text-neutral-500">{alert.restaurant_niche}</span>
                          )}
                          {alert.avg_influencer_engagement_rate != null && alert.avg_influencer_engagement_rate > 0 && (
                            <span className={`text-xs ${alert.avg_influencer_engagement_rate < 2 ? 'text-rose-600 font-medium' : alert.avg_influencer_engagement_rate < 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_influencer_engagement_rate}% engagement</span>
                          )}
                          {alert.low_engagement_influencer_count != null && alert.low_engagement_influencer_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.low_engagement_influencer_count} low eng</span>
                          )}
                          {alert.has_influencer_roi_tracking != null && (
                            <span className={`text-xs ${alert.has_influencer_roi_tracking ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_influencer_roi_tracking ? 'ROI track yes' : 'NO ROI track'}</span>
                          )}
                          {alert.influencer_roas != null && alert.influencer_roas > 0 && (
                            <span className={`text-xs ${alert.influencer_roas < 3 ? 'text-rose-600 font-medium' : alert.influencer_roas < 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.influencer_roas}x ROAS</span>
                          )}
                          {alert.instagram_followers != null && alert.instagram_followers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.instagram_followers} IG followers</span>
                          )}
                          {alert.instagram_engagement_rate != null && alert.instagram_engagement_rate > 0 && (
                            <span className={`text-xs ${alert.instagram_engagement_rate < 2 ? 'text-rose-600 font-medium' : alert.instagram_engagement_rate < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.instagram_engagement_rate}% IG eng</span>
                          )}
                          {alert.new_customers_from_influencers_monthly != null && alert.new_customers_from_influencers_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.new_customers_from_influencers_monthly} new customers/mo</span>
                          )}
                          {alert.social_media_reach_monthly != null && alert.social_media_reach_monthly > 0 && (
                            <span className={`text-xs ${alert.social_media_reach_monthly < (alert.social_media_reach_baseline_monthly ?? 5000) ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.social_media_reach_monthly} reach/mo (base {alert.social_media_reach_baseline_monthly ?? 0})</span>
                          )}
                          {alert.customer_acquisition_cost != null && alert.customer_acquisition_cost > 0 && (
                            <span className={`text-xs ${alert.customer_acquisition_cost > 25 ? 'text-rose-600 font-medium' : alert.customer_acquisition_cost > 15 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.customer_acquisition_cost)} CAC (base {fmt$(alert.customer_acquisition_cost_baseline ?? 0)})</span>
                          )}
                          {alert.competitor_influencer_score != null && alert.competitor_influencer_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_influencer_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.discovery_lift_projected_pct != null && alert.discovery_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.discovery_lift_projected_pct}% discovery (target)</span>
                          )}
                          {alert.engagement_lift_projected_pct != null && alert.engagement_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.engagement_lift_projected_pct}% engagement (target)</span>
                          )}
                          {alert.new_customer_acquisition_projected != null && alert.new_customer_acquisition_projected > 0 && (
                            <span className="text-emerald-600">+{alert.new_customer_acquisition_projected} new customers/mo (target)</span>
                          )}
                          {alert.tiktok_traffic_lift_projected_pct != null && alert.tiktok_traffic_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.tiktok_traffic_lift_projected_pct}% TikTok traffic (target)</span>
                          )}
                          {alert.content_repurpose_value_projected != null && alert.content_repurpose_value_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.content_repurpose_value_projected)}/mo repurpose value (target)</span>
                          )}
                          {alert.niche_roi_lift_projected_pct != null && alert.niche_roi_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.niche_roi_lift_projected_pct}% niche ROI (target)</span>
                          )}
                          {alert.engagement_rate_lift_projected_pts != null && alert.engagement_rate_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.engagement_rate_lift_projected_pts}pts engagement rate (target)</span>
                          )}
                          {alert.roas_lift_projected_pct != null && alert.roas_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.roas_lift_projected_pct}% ROAS (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faShareNodes} className="mt-0.5 shrink-0" />
                            <span>{alert.ai_insight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {alert.est_monthly_opportunity > 0 && (
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-emerald-600">{fmt$(alert.est_monthly_opportunity)}</div>
                        <div className="text-xs text-neutral-400">/mo opportunity</div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Button size="sm" variant="primary" className="gap-1.5" onClick={() => alert.id && handleStatus(alert.id, 'resolved')}>
                      <FontAwesomeIcon icon={faCheckCircle} /> Action taken
                    </Button>
                    <Button size="sm" variant="custom" className="gap-1.5 border border-neutral-300" onClick={() => alert.id && handleStatus(alert.id, 'in_progress')}>
                      <FontAwesomeIcon icon={faRotate} /> In progress
                    </Button>
                    <Button size="sm" variant="custom" className="gap-1.5 border border-neutral-300 text-neutral-500" onClick={() => alert.id && handleStatus(alert.id, 'rejected')}>
                      Skip
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-neutral-200 pt-3 text-xs text-neutral-500 flex flex-wrap gap-x-6 gap-y-1">
          <span>AI: <span className={config.aiEnabled ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.aiEnabled ? 'enabled' : 'disabled'}</span></span>
          <span>Influencer program: <span className={config.requireInfluencerProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireInfluencerProgram ? 'required' : 'optional'}</span></span>
          <span>Micro strategy: <span className={config.requireMicroInfluencerStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMicroInfluencerStrategy ? 'required' : 'optional'}</span></span>
          <span>Food blogger: <span className={config.requireFoodBloggerOutreach ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFoodBloggerOutreach ? 'required' : 'optional'}</span></span>
          <span>TikTok: <span className={config.requireTiktokStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTiktokStrategy ? 'required' : 'optional'}</span></span>
          <span>Content rights: <span className={config.requireContentUsageRights ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireContentUsageRights ? 'required' : 'optional'}</span></span>
          <span>ROI tracking: <span className={config.requireInfluencerRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireInfluencerRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Min budget/mo: {fmt$(config.minInfluencerBudgetMonthly)}</span>
          <span>Min micro count: {config.minMicroInfluencerCount}</span>
          <span>Min engagement: {config.minEngagementRateTarget}%</span>
          <span>Min rights score: {config.minContentRightsClarityScore}</span>
          <span>Min niche score: {config.minNicheAlignmentScore}</span>
          <span>Min ROAS: {config.minInfluencerRoas}x</span>
          <span className="text-neutral-400">201st POSR-exclusive differentiator</span>
        </div>
      </div>
    </Layout>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center gap-3">
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-neutral-500">{label}</div>
      </div>
    </div>
  );
}

export default InfluencerOutreachOptimizerScreen;
