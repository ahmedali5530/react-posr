/**
 * AI Restaurant Crisis Communication & PR Reputation Optimizer — predicts how
 * crisis communication preparedness (crisis response plan, social media
 * monitoring, negative review response, food safety incident handling,
 * staff scandal handling, viral negative content, media training, legal
 * coordination, stakeholder communication, reputation recovery) impacts
 * brand reputation, customer trust, revenue recovery, legal liability.
 *
 * 206th POSR-exclusive differentiator.
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
  faTriangleExclamation, faEye, faBullhorn, faKitMedical,
  faUserNurse, faNewspaper, faFileShield, faShieldHeart,
  faCircleInfo, faCheckCircle, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runCrisisCommunicationEngine, getActiveCrisisCommunicationAlerts, getCrisisCommunicationSummary,
  updateCrisisCommunicationAlertStatus, readCrisisCommunicationConfig, DEFAULT_CRISIS_COMMUNICATION_CONFIG,
  type CrisisCommunicationAlert,
} from "@/lib/crisis-communication-pr-reputation.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  crisis_response_plan_absent:                { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faTriangleExclamation,  label: 'NO CRISIS PLAN' },
  social_media_crisis_monitoring_absent:      { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faEye,                  label: 'NO MONITORING' },
  negative_viral_content_response_slow:       { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faBullhorn,             label: 'SLOW VIRAL RESPONSE' },
  food_safety_incident_protocol_absent:       { bg: 'bg-red-50',       text: 'text-red-700',       icon: faKitMedical,           label: 'NO FOOD SAFETY PROTO' },
  staff_scandal_misconduct_protocol_absent:   { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faUserNurse,            label: 'NO STAFF SCANDAL PROTO' },
  media_training_absent:                      { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faNewspaper,            label: 'NO MEDIA TRAINING' },
  legal_coordination_absent:                  { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faFileShield,           label: 'NO LEGAL COORD' },
  reputation_recovery_program_absent:         { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faShieldHeart,          label: 'NO RECOVERY PROG' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function CrisisCommunicationPrReputationScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<CrisisCommunicationAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, crisisResponsePlanAbsentCount: 0, socialMediaCrisisMonitoringAbsentCount: 0, negativeViralContentResponseSlowCount: 0, foodSafetyIncidentProtocolAbsentCount: 0, staffScandalMisconductProtocolAbsentCount: 0, mediaTrainingAbsentCount: 0, legalCoordinationAbsentCount: 0, reputationRecoveryProgramAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CRISIS_COMMUNICATION_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readCrisisCommunicationConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveCrisisCommunicationAlerts(db), getCrisisCommunicationSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[crisis-communication-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runCrisisCommunicationEngine(db, config);
      toast.success(`Analyzed ${result.generated} crisis communication signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[crisis-communication-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateCrisisCommunicationAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[crisis-communication-report] status failed', err);
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
      <DocumentTitle parts={["AI Crisis Communication & PR Reputation Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-600" />
              AI Crisis Communication &amp; PR Reputation Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how crisis communication preparedness (crisis response plan, social media monitoring, negative review response, food safety incident handling, staff scandal handling, viral negative content, media training, legal coordination, stakeholder communication, reputation recovery) impacts brand reputation, customer trust, revenue recovery, legal liability — 70% of restaurants without crisis plan do not survive a major crisis (PR Week); restaurants lose $5,000-50,000/day during reputation crisis (Cornell CHR); food safety incidents cost $1M-10M+ in lawsuits (FDA); negative viral content reaches 2M+ in 24h (Sprout Social); 88% trust online reviews as much as personal recommendations (BrightLocal); 45% switch brands after poorly-handled crisis (Edelman); 60% of crisis damage occurs in first 2 hours (Sprinklr); social media monitoring catches 70% of crises before viral (Meltwater); 78% forgive restaurant that responds well (Edelman); media training reduces misquotes 60-80% (PRSA); legal coordination reduces lawsuit costs 30-50% (ABC); recovery takes 6-18 months without proactive PR (Reputation Institute); 50% faster recovery with dedicated PR (PR Week); ROI $10-50 per $1 spent
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze crisis readiness'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faTriangleExclamation} label="No crisis plan / slow viral response" value={String(summary.crisisResponsePlanAbsentCount + summary.negativeViralContentResponseSlowCount)} color={(summary.crisisResponsePlanAbsentCount + summary.negativeViralContentResponseSlowCount) > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faEye} label="No monitoring / no food safety proto" value={String(summary.socialMediaCrisisMonitoringAbsentCount + summary.foodSafetyIncidentProtocolAbsentCount)} color={(summary.socialMediaCrisisMonitoringAbsentCount + summary.foodSafetyIncidentProtocolAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUserNurse} label="No staff scandal proto / no media training" value={String(summary.staffScandalMisconductProtocolAbsentCount + summary.mediaTrainingAbsentCount)} color={(summary.staffScandalMisconductProtocolAbsentCount + summary.mediaTrainingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHeart} label="No legal coord / no recovery prog" value={String(summary.legalCoordinationAbsentCount + summary.reputationRecoveryProgramAbsentCount)} color={(summary.legalCoordinationAbsentCount + summary.reputationRecoveryProgramAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faTriangleExclamation} spin className="text-4xl mb-3" />
            <p>Analyzing crisis communication &amp; PR reputation opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No crisis communication alerts</p>
            <p className="text-sm mt-1">Healthy crisis readiness environment: complete crisis response plan (completeness 80+, updated annually, drilled quarterly); real-time social media monitoring (detection under 2h); fast viral response (under 2h, 70%+ handled well); food safety incident protocol (recall, health dept notification, legal coordination); staff scandal protocol (harassment, social media policy); media training (2+ trained staff, designated spokesperson); legal coordination (retainer, incident protocol); reputation recovery program (PR agency, proactive content, customer win-back, community engagement); 70% of restaurants without plan do not survive a major crisis (PR Week); 60% of damage occurs in first 2 hours (Sprinklr); social media monitoring catches 70% before viral (Meltwater); 78% forgive with good response (Edelman); legal coordination reduces lawsuit costs 30-50% (ABC); recovery 6-18 months without proactive PR (Reputation Institute); 50% faster recovery with dedicated PR.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faTriangleExclamation, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_crisis_response_plan != null && (
                            <span className={`text-xs ${alert.has_crisis_response_plan ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_crisis_response_plan ? 'crisis plan yes' : 'NO crisis plan'}</span>
                          )}
                          {alert.crisis_plan_completeness_score != null && alert.crisis_plan_completeness_score > 0 && (
                            <span className={`text-xs ${alert.crisis_plan_completeness_score < 50 ? 'text-rose-600 font-medium' : alert.crisis_plan_completeness_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.crisis_plan_completeness_score}/100 completeness</span>
                          )}
                          {alert.crisis_plan_last_updated_months != null && alert.crisis_plan_last_updated_months > 0 && (
                            <span className={`text-xs ${alert.crisis_plan_last_updated_months > 12 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>updated {alert.crisis_plan_last_updated_months}mo ago</span>
                          )}
                          {alert.crisis_drill_conducted != null && (
                            <span className={`text-xs ${alert.crisis_drill_conducted ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.crisis_drill_conducted ? 'drill yes' : 'NO drill'}</span>
                          )}
                          {alert.has_social_media_crisis_monitoring != null && (
                            <span className={`text-xs ${alert.has_social_media_crisis_monitoring ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_social_media_crisis_monitoring ? 'monitoring yes' : 'NO monitoring'}</span>
                          )}
                          {alert.crisis_detection_time_hours != null && alert.crisis_detection_time_hours > 0 && (
                            <span className={`text-xs ${alert.crisis_detection_time_hours > 8 ? 'text-rose-600 font-medium' : alert.crisis_detection_time_hours > 2 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.crisis_detection_time_hours}h detection (max 2h)</span>
                          )}
                          {alert.avg_viral_response_time_hours != null && alert.avg_viral_response_time_hours > 0 && (
                            <span className={`text-xs ${alert.avg_viral_response_time_hours > 12 ? 'text-rose-600 font-medium' : alert.avg_viral_response_time_hours > 2 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_viral_response_time_hours}h viral response (max 2h)</span>
                          )}
                          {alert.viral_incidents_last_year != null && alert.viral_incidents_last_year > 0 && (
                            <span className="text-xs text-orange-600 font-medium">{alert.viral_incidents_last_year} viral/yr ({alert.viral_incidents_handled_well_pct ?? 0}% well)</span>
                          )}
                          {alert.has_food_safety_incident_protocol != null && (
                            <span className={`text-xs ${alert.has_food_safety_incident_protocol ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_food_safety_incident_protocol ? 'food safety proto yes' : 'NO food safety proto'}</span>
                          )}
                          {alert.food_safety_lawsuit_risk_score != null && alert.food_safety_lawsuit_risk_score > 0 && (
                            <span className={`text-xs ${alert.food_safety_lawsuit_risk_score > 50 ? 'text-rose-600 font-medium' : alert.food_safety_lawsuit_risk_score > 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.food_safety_lawsuit_risk_score}/100 lawsuit risk</span>
                          )}
                          {alert.recall_protocol_present != null && (
                            <span className={`text-xs ${alert.recall_protocol_present ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.recall_protocol_present ? 'recall proto yes' : 'NO recall proto'}</span>
                          )}
                          {alert.has_staff_scandal_protocol != null && (
                            <span className={`text-xs ${alert.has_staff_scandal_protocol ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_staff_scandal_protocol ? 'staff scandal proto yes' : 'NO staff scandal proto'}</span>
                          )}
                          {alert.staff_misconduct_incidents_last_year != null && alert.staff_misconduct_incidents_last_year > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.staff_misconduct_incidents_last_year} misconduct/yr</span>
                          )}
                          {alert.has_media_training != null && (
                            <span className={`text-xs ${alert.has_media_training ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_media_training ? 'media training yes' : 'NO media training'}</span>
                          )}
                          {alert.media_trained_staff_count != null && alert.media_trained_staff_count >= 0 && (
                            <span className={`text-xs ${alert.media_trained_staff_count < 2 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.media_trained_staff_count} trained (min 2)</span>
                          )}
                          {alert.spokesperson_designated != null && (
                            <span className={`text-xs ${alert.spokesperson_designated ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.spokesperson_designated ? 'spokesperson yes' : 'NO spokesperson'}</span>
                          )}
                          {alert.has_legal_coordination != null && (
                            <span className={`text-xs ${alert.has_legal_coordination ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_legal_coordination ? 'legal coord yes' : 'NO legal coord'}</span>
                          )}
                          {alert.lawsuits_last_year != null && alert.lawsuits_last_year > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.lawsuits_last_year} lawsuits/yr (${fmt$(alert.lawsuit_cost_annual ?? 0)})</span>
                          )}
                          {alert.has_reputation_recovery_program != null && (
                            <span className={`text-xs ${alert.has_reputation_recovery_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_reputation_recovery_program ? 'recovery prog yes' : 'NO recovery prog'}</span>
                          )}
                          {alert.reputation_score != null && alert.reputation_score > 0 && (
                            <span className={`text-xs ${alert.reputation_score < 50 ? 'text-rose-600 font-medium' : alert.reputation_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.reputation_score}/100 reputation (min 70)</span>
                          )}
                          {alert.avg_recovery_time_months != null && alert.avg_recovery_time_months > 0 && (
                            <span className={`text-xs ${alert.avg_recovery_time_months > 12 ? 'text-rose-600 font-medium' : alert.avg_recovery_time_months > 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_recovery_time_months}mo recovery (max 6)</span>
                          )}
                          {alert.brand_sentiment_score != null && alert.brand_sentiment_score > 0 && (
                            <span className={`text-xs ${alert.brand_sentiment_score < 60 ? 'text-rose-600 font-medium' : alert.brand_sentiment_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.brand_sentiment_score}/100 sentiment</span>
                          )}
                          {alert.customer_trust_score != null && alert.customer_trust_score > 0 && (
                            <span className={`text-xs ${alert.customer_trust_score < 60 ? 'text-rose-600 font-medium' : alert.customer_trust_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_trust_score}/100 trust</span>
                          )}
                          {alert.crisis_count_last_year != null && alert.crisis_count_last_year > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.crisis_count_last_year} crises/yr (${fmt$(alert.crisis_cost_annual ?? 0)})</span>
                          )}
                          {alert.competitor_crisis_readiness_score != null && alert.competitor_crisis_readiness_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_crisis_readiness_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.survival_probability_lift_projected_pct != null && alert.survival_probability_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.survival_probability_lift_projected_pct}% survival probability (target)</span>
                          )}
                          {alert.crisis_detection_acceleration_projected_hours != null && alert.crisis_detection_acceleration_projected_hours > 0 && (
                            <span className="text-emerald-600">-{alert.crisis_detection_acceleration_projected_hours}h detection (target)</span>
                          )}
                          {alert.viral_response_acceleration_projected_hours != null && alert.viral_response_acceleration_projected_hours > 0 && (
                            <span className="text-emerald-600">-{alert.viral_response_acceleration_projected_hours}h viral response (target)</span>
                          )}
                          {alert.lawsuit_cost_reduction_projected_pct != null && alert.lawsuit_cost_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.lawsuit_cost_reduction_projected_pct}% lawsuit cost (target)</span>
                          )}
                          {alert.recovery_time_reduction_projected_months != null && alert.recovery_time_reduction_projected_months > 0 && (
                            <span className="text-emerald-600">-{alert.recovery_time_reduction_projected_months}mo recovery (target)</span>
                          )}
                          {alert.reputation_lift_projected_pts != null && alert.reputation_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.reputation_lift_projected_pts}pts reputation (target)</span>
                          )}
                          {alert.trust_lift_projected_pts != null && alert.trust_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.trust_lift_projected_pts}pts trust (target)</span>
                          )}
                          {alert.crisis_cost_reduction_projected_pct != null && alert.crisis_cost_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.crisis_cost_reduction_projected_pct}% crisis cost (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 shrink-0" />
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
          <span>Crisis plan: <span className={config.requireCrisisResponsePlan ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCrisisResponsePlan ? 'required' : 'optional'}</span></span>
          <span>Monitoring: <span className={config.requireSocialMediaCrisisMonitoring ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSocialMediaCrisisMonitoring ? 'required' : 'optional'}</span></span>
          <span>Food safety proto: <span className={config.requireFoodSafetyIncidentProtocol ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFoodSafetyIncidentProtocol ? 'required' : 'optional'}</span></span>
          <span>Staff scandal proto: <span className={config.requireStaffScandalProtocol ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireStaffScandalProtocol ? 'required' : 'optional'}</span></span>
          <span>Media training: <span className={config.requireMediaTraining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMediaTraining ? 'required' : 'optional'}</span></span>
          <span>Legal coord: <span className={config.requireLegalCoordination ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireLegalCoordination ? 'required' : 'optional'}</span></span>
          <span>Recovery prog: <span className={config.requireReputationRecoveryProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireReputationRecoveryProgram ? 'required' : 'optional'}</span></span>
          <span>Min plan score: {config.minCrisisPlanCompletenessScore}</span>
          <span>Max detection: {config.maxCrisisDetectionTimeHours}h</span>
          <span>Max viral response: {config.maxViralResponseTimeHours}h</span>
          <span>Min media trained: {config.minMediaTrainedStaffCount}</span>
          <span>Min reputation: {config.minReputationScore}</span>
          <span>Max recovery: {config.maxRecoveryTimeMonths}mo</span>
          <span className="text-neutral-400">206th POSR-exclusive differentiator</span>
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

export default CrisisCommunicationPrReputationScreen;
