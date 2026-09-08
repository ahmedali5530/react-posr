/**
 * AI Restaurant Subscription & Membership Program Optimizer — predicts how
 * subscription/membership programs (Panera Sip Club, Sweetgreen Pass, monthly
 * dining passes, tiered membership, benefit value, sign-up friction, churn
 * prevention, cross-sell, usage tracking, pricing optimization) impact
 * recurring revenue, customer LTV, visit frequency, brand loyalty.
 *
 * 204th POSR-exclusive differentiator.
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
  faRepeat, faLayerGroup, faGift, faUserPlus, faRotate,
  faShareNodes, faChartLine, faMoneyCheck,
  faCircleInfo, faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runSubscriptionProgramEngine, getActiveSubscriptionProgramAlerts, getSubscriptionProgramSummary,
  updateSubscriptionProgramAlertStatus, readSubscriptionProgramConfig, DEFAULT_SUBSCRIPTION_PROGRAM_CONFIG,
  type SubscriptionProgramAlert,
} from "@/lib/subscription-membership-program.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  subscription_program_absent:                { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faRepeat,          label: 'NO PROGRAM' },
  subscription_tier_structure_suboptimal:     { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faLayerGroup,      label: 'POOR TIERS' },
  subscription_benefit_value_low:             { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faGift,            label: 'LOW BENEFIT' },
  subscription_sign_up_friction_high:         { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faUserPlus,        label: 'HIGH FRICTION' },
  subscription_retention_churn_high:          { bg: 'bg-red-50',       text: 'text-red-700',       icon: faRotate,          label: 'HIGH CHURN' },
  subscription_cross_sell_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faShareNodes,      label: 'NO CROSS-SELL' },
  subscription_usage_tracking_absent:         { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faChartLine,       label: 'NO USAGE TRACK' },
  subscription_pricing_optimization_absent:   { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faMoneyCheck,      label: 'NO PRICE OPT' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function SubscriptionMembershipProgramScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<SubscriptionProgramAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, subscriptionProgramAbsentCount: 0, subscriptionTierStructureSuboptimalCount: 0, subscriptionBenefitValueLowCount: 0, subscriptionSignUpFrictionHighCount: 0, subscriptionRetentionChurnHighCount: 0, subscriptionCrossSellAbsentCount: 0, subscriptionUsageTrackingAbsentCount: 0, subscriptionPricingOptimizationAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_SUBSCRIPTION_PROGRAM_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readSubscriptionProgramConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveSubscriptionProgramAlerts(db), getSubscriptionProgramSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[subscription-program-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runSubscriptionProgramEngine(db, config);
      toast.success(`Analyzed ${result.generated} subscription program signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[subscription-program-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateSubscriptionProgramAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[subscription-program-report] status failed', err);
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
      <DocumentTitle parts={["AI Subscription & Membership Program Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faRepeat} className="text-violet-600" />
              AI Subscription &amp; Membership Program Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how subscription/membership programs (Panera Sip Club, Sweetgreen Pass, monthly dining passes, tiered membership, benefit value, sign-up friction, churn prevention, cross-sell, usage tracking, pricing optimization) impact recurring revenue, customer LTV, visit frequency, brand loyalty — Panera Sip Club: 1M+ subscribers, $108-144M/year recurring revenue; subscription programs increase LTV 40-60% (McKinsey); subscribers visit 2-3x more frequently; 40% of subscribers never cancel; subscription reduces CAC (locked-in customers); subscribers spend $15-40 more per visit; subscription market $5-15B by 2028, growing 20%+ YoY; 5-15% monthly churn industry avg; reducing churn 5% increases revenue 25-95% (HBR); 60% abandon sign-up if over 2 min (Baymard); benefit value must exceed fee 2-3x; pricing optimization lifts revenue 10-20%
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faRepeat} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze subscriptions'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faRepeat} label="No subscription program" value={String(summary.subscriptionProgramAbsentCount)} color={summary.subscriptionProgramAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faRotate} label="High churn / low benefit" value={String(summary.subscriptionRetentionChurnHighCount + summary.subscriptionBenefitValueLowCount)} color={(summary.subscriptionRetentionChurnHighCount + summary.subscriptionBenefitValueLowCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUserPlus} label="High friction / poor tiers" value={String(summary.subscriptionSignUpFrictionHighCount + summary.subscriptionTierStructureSuboptimalCount)} color={(summary.subscriptionSignUpFrictionHighCount + summary.subscriptionTierStructureSuboptimalCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShareNodes} label="No cross-sell / no usage / no pricing" value={String(summary.subscriptionCrossSellAbsentCount + summary.subscriptionUsageTrackingAbsentCount + summary.subscriptionPricingOptimizationAbsentCount)} color={(summary.subscriptionCrossSellAbsentCount + summary.subscriptionUsageTrackingAbsentCount + summary.subscriptionPricingOptimizationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faRepeat} spin className="text-4xl mb-3" />
            <p>Analyzing subscription &amp; membership program opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No subscription program alerts</p>
            <p className="text-sm mt-1">Healthy subscription environment: active subscription program (Panera Sip Club model, 2-3 tiers basic/premium/elite); conversion rate 8%+; benefit value 2-3x fee; sign-up under 2 minutes (2-3 steps); monthly churn under 8%; cross-sell to non-subscribers (8-15% conversion per campaign); usage tracking (benefit utilization 50%+); pricing optimization (A/B testing, price elasticity 70+); subscribers visit 2-3x more frequently; subscriber LTV 40-60% higher than non-subscribers; Panera Sip Club: 1M+ subscribers, $108-144M/year recurring revenue; subscription market $5-15B by 2028, growing 20%+ YoY; 40% of subscribers never cancel; reducing churn 5% increases revenue 25-95% (HBR); 60% abandon sign-up if over 2 min (Baymard); pricing optimization lifts revenue 10-20%.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faRepeat, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'mixed' ? 'text-emerald-600' : alert.channel === 'delivery' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_subscription_program != null && (
                            <span className={`text-xs ${alert.has_subscription_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_subscription_program ? 'program yes' : 'NO program'}</span>
                          )}
                          {alert.subscription_program_name && alert.subscription_program_name !== 'none' && (
                            <span className="text-xs text-violet-600 font-medium">{alert.subscription_program_name}</span>
                          )}
                          {alert.subscriber_count != null && alert.subscriber_count >= 0 && (
                            <span className={`text-xs ${alert.subscriber_count < 100 ? 'text-rose-600 font-medium' : alert.subscriber_count < 300 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.subscriber_count} subs (target {alert.subscriber_target_count ?? 0})</span>
                          )}
                          {alert.subscription_tier_count != null && alert.subscription_tier_count >= 0 && (
                            <span className={`text-xs ${alert.subscription_tier_count < 2 ? 'text-rose-600 font-medium' : alert.subscription_tier_count < 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.subscription_tier_count} tiers ({alert.subscription_tiers ?? 'none'})</span>
                          )}
                          {alert.tier_conversion_rate_pct != null && alert.tier_conversion_rate_pct >= 0 && (
                            <span className={`text-xs ${alert.tier_conversion_rate_pct < 5 ? 'text-rose-600 font-medium' : alert.tier_conversion_rate_pct < 8 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.tier_conversion_rate_pct}% conversion (target {alert.tier_conversion_target_pct ?? 10}%)</span>
                          )}
                          {alert.subscription_monthly_fee != null && alert.subscription_monthly_fee > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{fmt$(alert.subscription_monthly_fee)}/mo fee</span>
                          )}
                          {alert.benefit_value_per_month != null && alert.benefit_value_per_month > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.benefit_value_per_month)} value/mo</span>
                          )}
                          {alert.benefit_value_ratio != null && alert.benefit_value_ratio > 0 && (
                            <span className={`text-xs ${alert.benefit_value_ratio < 1.5 ? 'text-rose-600 font-medium' : alert.benefit_value_ratio < 2 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.benefit_value_ratio}x ratio</span>
                          )}
                          {alert.benefit_types && alert.benefit_types !== 'none' && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.benefit_types}</span>
                          )}
                          {alert.sign_up_time_minutes != null && alert.sign_up_time_minutes > 0 && (
                            <span className={`text-xs ${alert.sign_up_time_minutes > 3 ? 'text-rose-600 font-medium' : alert.sign_up_time_minutes > 2 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.sign_up_time_minutes}min sign-up ({alert.sign_up_steps_count ?? 0} steps, {alert.sign_up_abandonment_rate_pct ?? 0}% abandon)</span>
                          )}
                          {alert.monthly_churn_rate_pct != null && alert.monthly_churn_rate_pct > 0 && (
                            <span className={`text-xs ${alert.monthly_churn_rate_pct > 12 ? 'text-rose-600 font-medium' : alert.monthly_churn_rate_pct > 8 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.monthly_churn_rate_pct}% churn (max 8%, lifetime {alert.avg_subscriber_lifetime_months ?? 0}mo)</span>
                          )}
                          {alert.has_cross_sell_campaign != null && (
                            <span className={`text-xs ${alert.has_cross_sell_campaign ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_cross_sell_campaign ? 'cross-sell yes' : 'NO cross-sell'}</span>
                          )}
                          {alert.non_subscriber_count != null && alert.non_subscriber_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.non_subscriber_count} non-subs</span>
                          )}
                          {alert.cross_sell_conversion_rate_pct != null && alert.cross_sell_conversion_rate_pct > 0 && (
                            <span className={`text-xs ${alert.cross_sell_conversion_rate_pct < 5 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.cross_sell_conversion_rate_pct}% cross-sell conv</span>
                          )}
                          {alert.has_usage_tracking != null && (
                            <span className={`text-xs ${alert.has_usage_tracking ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_usage_tracking ? 'usage track yes' : 'NO usage track'}</span>
                          )}
                          {alert.avg_usage_per_subscriber_monthly != null && alert.avg_usage_per_subscriber_monthly > 0 && (
                            <span className={`text-xs ${alert.avg_usage_per_subscriber_monthly < 6 ? 'text-rose-600 font-medium' : alert.avg_usage_per_subscriber_monthly < 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_usage_per_subscriber_monthly} uses/sub/mo</span>
                          )}
                          {alert.benefit_utilization_rate_pct != null && alert.benefit_utilization_rate_pct > 0 && (
                            <span className={`text-xs ${alert.benefit_utilization_rate_pct < 30 ? 'text-rose-600 font-medium' : alert.benefit_utilization_rate_pct < 50 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.benefit_utilization_rate_pct}% benefit util</span>
                          )}
                          {alert.has_pricing_optimization != null && (
                            <span className={`text-xs ${alert.has_pricing_optimization ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pricing_optimization ? 'price opt yes' : 'NO price opt'}</span>
                          )}
                          {alert.price_elasticity_score != null && alert.price_elasticity_score > 0 && (
                            <span className={`text-xs ${alert.price_elasticity_score < 40 ? 'text-rose-600 font-medium' : alert.price_elasticity_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.price_elasticity_score}/100 elasticity</span>
                          )}
                          {alert.optimal_monthly_fee != null && alert.optimal_monthly_fee > 0 && (
                            <span className="text-xs text-fuchsia-600 font-medium">{fmt$(alert.optimal_monthly_fee)} optimal fee</span>
                          )}
                          {alert.subscription_revenue_monthly != null && alert.subscription_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.subscription_revenue_monthly)}/mo sub revenue</span>
                          )}
                          {alert.subscriber_avg_spend_per_visit != null && alert.subscriber_avg_spend_per_visit > 0 && (
                            <span className={`text-xs ${alert.subscriber_avg_spend_per_visit < (alert.non_subscriber_avg_spend_per_visit ?? 10) ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.subscriber_avg_spend_per_visit)} sub spend (vs {fmt$(alert.non_subscriber_avg_spend_per_visit ?? 0)} non-sub)</span>
                          )}
                          {alert.subscriber_visit_frequency_monthly != null && alert.subscriber_visit_frequency_monthly > 0 && (
                            <span className={`text-xs ${alert.subscriber_visit_frequency_monthly < 4 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.subscriber_visit_frequency_monthly} sub visits/mo (vs {alert.non_subscriber_visit_frequency_monthly ?? 0})</span>
                          )}
                          {alert.subscriber_ltv != null && alert.subscriber_ltv > 0 && (
                            <span className={`text-xs ${alert.subscriber_ltv < 600 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.subscriber_ltv)} sub LTV (vs {fmt$(alert.non_subscriber_ltv ?? 0)}, +{alert.subscriber_ltv_lift_pct ?? 0}%)</span>
                          )}
                          {alert.competitor_subscription_score != null && alert.competitor_subscription_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_subscription_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.recurring_revenue_projected != null && alert.recurring_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.recurring_revenue_projected)}/mo recurring revenue (target)</span>
                          )}
                          {alert.conversion_lift_projected_pct != null && alert.conversion_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.conversion_lift_projected_pct}% conversion (target)</span>
                          )}
                          {alert.churn_reduction_projected_pct != null && alert.churn_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.churn_reduction_projected_pct}% churn (target)</span>
                          )}
                          {alert.cross_sell_revenue_projected != null && alert.cross_sell_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.cross_sell_revenue_projected)}/mo cross-sell revenue (target)</span>
                          )}
                          {alert.ltv_lift_projected_pct != null && alert.ltv_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.ltv_lift_projected_pct}% LTV (target)</span>
                          )}
                          {alert.pricing_revenue_lift_projected_pct != null && alert.pricing_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.pricing_revenue_lift_projected_pct}% pricing revenue (target)</span>
                          )}
                          {alert.visit_frequency_lift_projected_pct != null && alert.visit_frequency_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.visit_frequency_lift_projected_pct}% visit frequency (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faRepeat} className="mt-0.5 shrink-0" />
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
          <span>Subscription program: <span className={config.requireSubscriptionProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSubscriptionProgram ? 'required' : 'optional'}</span></span>
          <span>Cross-sell: <span className={config.requireCrossSellCampaign ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCrossSellCampaign ? 'required' : 'optional'}</span></span>
          <span>Usage tracking: <span className={config.requireUsageTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireUsageTracking ? 'required' : 'optional'}</span></span>
          <span>Pricing opt: <span className={config.requirePricingOptimization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePricingOptimization ? 'required' : 'optional'}</span></span>
          <span>Min tiers: {config.minSubscriptionTiers}</span>
          <span>Min conversion: {config.minTierConversionRatePct}%</span>
          <span>Min benefit ratio: {config.minBenefitValueRatio}x</span>
          <span>Max sign-up time: {config.maxSignUpTimeMinutes}min</span>
          <span>Max churn: {config.maxMonthlyChurnRatePct}%</span>
          <span>Min cross-sell conv: {config.minCrossSellConversionRatePct}%</span>
          <span>Min benefit util: {config.minBenefitUtilizationRatePct}%</span>
          <span className="text-neutral-400">204th POSR-exclusive differentiator</span>
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

export default SubscriptionMembershipProgramScreen;
