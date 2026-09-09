/**
 * AI Neuro-Emotion Biometric Dining Optimizer — predicts how affective
 * computing and biometric sensing in restaurants (facial emotion recognition,
 * EEG brainwave monitoring, heart-rate variability stress detection, gaze
 * tracking for menu engagement, biometric mood-adaptive ambiance, emotional
 * journey mapping, sentiment-driven service adaptation, privacy-compliant
 * biometric data handling, opt-in biometric loyalty, neuro-marketing
 * insights) impact customer experience, premium pricing, retention,
 * differentiation, emotional loyalty, and competitive advantage in the
 * affective computing and emotion AI market.
 *
 * 219th POSR-exclusive differentiator.
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
  faBrain, faEye, faHeartPulse, faWaveSquare,
  faHandSparkles, faFingerprint, faShieldHalved,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runNeuroEmotionEngine, getActiveNeuroEmotionAlerts, getNeuroEmotionSummary,
  updateNeuroEmotionAlertStatus, readNeuroEmotionConfig, DEFAULT_NEURO_EMOTION_CONFIG,
  type NeuroEmotionAlert,
} from "@/lib/neuro-emotion-biometric-dining.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  neuro_emotion_strategy_absent:                  { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faBrain,          label: 'NO NEURO-EMOTION' },
  facial_emotion_recognition_absent:              { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faEye,            label: 'NO FACIAL AI' },
  biometric_mood_ambiance_adaptation_absent:      { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faHeartPulse,     label: 'NO MOOD AMBIANCE' },
  gaze_tracking_menu_engagement_absent:           { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faWaveSquare,     label: 'NO GAZE TRACK' },
  emotional_journey_mapping_absent:               { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faHandSparkles,   label: 'NO JOURNEY MAP' },
  neuro_marketing_insights_absent:                { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faBrain,          label: 'NO NEURO-MKTG' },
  opt_in_biometric_loyalty_absent:                { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faFingerprint,    label: 'NO BIOMETRIC LOYALTY' },
  biometric_privacy_compliance_weak:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faShieldHalved,   label: 'WEAK BIOMETRIC PRIVACY' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function NeuroEmotionBiometricDiningScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<NeuroEmotionAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, neuroEmotionStrategyAbsentCount: 0, facialEmotionRecognitionAbsentCount: 0, biometricMoodAmbianceAdaptationAbsentCount: 0, gazeTrackingMenuEngagementAbsentCount: 0, emotionalJourneyMappingAbsentCount: 0, neuroMarketingInsightsAbsentCount: 0, optInBiometricLoyaltyAbsentCount: 0, biometricPrivacyComplianceWeakCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_NEURO_EMOTION_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readNeuroEmotionConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveNeuroEmotionAlerts(db), getNeuroEmotionSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[neuro-emotion-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runNeuroEmotionEngine(db, config);
      toast.success(`Analyzed ${result.generated} neuro-emotion signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[neuro-emotion-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateNeuroEmotionAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[neuro-emotion-report] status failed', err);
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
      <DocumentTitle parts={["AI Neuro-Emotion Biometric Dining Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faBrain} className="text-violet-600" />
              AI Neuro-Emotion &amp; Biometric Dining Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how affective computing and biometric sensing (facial emotion recognition, EEG brainwave monitoring, heart-rate variability stress detection, gaze tracking for menu engagement, biometric mood-adaptive ambiance, emotional journey mapping, neuro-marketing insights, opt-in biometric loyalty, privacy-compliant biometric data) impact customer experience, premium pricing, retention, emotional loyalty, differentiation — affective computing market $21.9B+ by 2028 (Grand View Research, 28%+ CAGR); emotion AI $4.6B+ by 2027; BCI $3.8B+ by 2028; biometric sensing $6.2B+ by 2026; 68% would pay 10-30% premium for emotionally-adaptive dining (PwC); emotion recognition 90%+ accuracy; mood-adaptive ambiance 25-40% satisfaction lift (Cornell); emotional loyalty = 3x retention (Bain); neuro-marketing 20-35% menu/pricing improvement (Nielsen); emotion-adaptive service reduces complaints 30-45% (J.D. Power); under 0.5% of restaurants globally offer this; affective dining ROI $6-18 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faBrain} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze neuro-emotion'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faBrain} label="No neuro-emotion strategy" value={String(summary.neuroEmotionStrategyAbsentCount)} color={summary.neuroEmotionStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faEye} label="No facial AI / no mood ambiance" value={String(summary.facialEmotionRecognitionAbsentCount + summary.biometricMoodAmbianceAdaptationAbsentCount)} color={(summary.facialEmotionRecognitionAbsentCount + summary.biometricMoodAmbianceAdaptationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faWaveSquare} label="No gaze / no journey / no neuro-mktg" value={String(summary.gazeTrackingMenuEngagementAbsentCount + summary.emotionalJourneyMappingAbsentCount + summary.neuroMarketingInsightsAbsentCount)} color={(summary.gazeTrackingMenuEngagementAbsentCount + summary.emotionalJourneyMappingAbsentCount + summary.neuroMarketingInsightsAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="No biometric loyalty / weak privacy" value={String(summary.optInBiometricLoyaltyAbsentCount + summary.biometricPrivacyComplianceWeakCount)} color={(summary.optInBiometricLoyaltyAbsentCount + summary.biometricPrivacyComplianceWeakCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faBrain} spin className="text-4xl mb-3" />
            <p>Analyzing neuro-emotion &amp; biometric dining opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No neuro-emotion alerts</p>
            <p className="text-sm mt-1">Healthy affective computing environment: active strategy (growing maturity, $1.9k+ investment/mo); facial emotion recognition (4+ cameras, 88%+ accuracy, 7+ emotions); mood-adaptive ambiance (4+ systems, 48+ adaptations/day, 28%+ satisfaction lift); gaze tracking (2+ devices, 18%+ menu optimization); emotional journey mapping (9+ touchpoints, 22%+ optimization, 32%+ complaint reduction); neuro-marketing (3+ studies, 24%+ menu improvement); opt-in biometric loyalty (380+ members, 82%+ retention); biometric privacy (score 90+, BIPA + GDPR + CCPA, encrypted, opt-in, retention limits); affective computing market $21.9B+ by 2028; ROI $6-18 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faBrain, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'mixed' ? 'text-emerald-600' : alert.channel === 'dine_in' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_neuro_emotion_strategy != null && (
                            <span className={`text-xs ${alert.has_neuro_emotion_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_neuro_emotion_strategy ? 'neuro-emotion yes' : 'NO neuro-emotion'}</span>
                          )}
                          {alert.affective_program_maturity && alert.affective_program_maturity !== 'none' && (
                            <span className="text-xs text-violet-600 font-medium">{alert.affective_program_maturity}</span>
                          )}
                          {alert.total_affective_revenue_monthly != null && alert.total_affective_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.total_affective_revenue_monthly)}/mo affective rev ({alert.affective_revenue_as_pct_of_total ?? 0}%)</span>
                          )}
                          {alert.mood_adaptive_revenue_lift_monthly != null && alert.mood_adaptive_revenue_lift_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.mood_adaptive_revenue_lift_monthly)}/mo mood-adaptive</span>
                          )}
                          {alert.gaze_driven_revenue_lift_monthly != null && alert.gaze_driven_revenue_lift_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.gaze_driven_revenue_lift_monthly)}/mo gaze</span>
                          )}
                          {alert.satisfaction_lift_pct != null && alert.satisfaction_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.satisfaction_lift_pct}% satisfaction lift</span>
                          )}
                          {alert.competitor_affective_score != null && alert.competitor_affective_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_affective_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.affective_revenue_growth_projected_pct != null && alert.affective_revenue_growth_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.affective_revenue_growth_projected_pct}% affective revenue growth (target)</span>
                          )}
                          {alert.mood_adaptive_revenue_projected != null && alert.mood_adaptive_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.mood_adaptive_revenue_projected)}/mo mood-adaptive (target)</span>
                          )}
                          {alert.gaze_revenue_projected != null && alert.gaze_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.gaze_revenue_projected)}/mo gaze (target)</span>
                          )}
                          {alert.neuro_marketing_revenue_projected != null && alert.neuro_marketing_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.neuro_marketing_revenue_projected)}/mo neuro-marketing (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pct != null && alert.satisfaction_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pct}% satisfaction (target)</span>
                          )}
                          {alert.complaint_reduction_projected_pct != null && alert.complaint_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.complaint_reduction_projected_pct}% complaints (target)</span>
                          )}
                          {alert.compliance_risk_reduction_projected_pct != null && alert.compliance_risk_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.compliance_risk_reduction_projected_pct}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faBrain} className="mt-0.5 shrink-0" />
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
          <span>Strategy: <span className={config.requireNeuroEmotionStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNeuroEmotionStrategy ? 'required' : 'optional'}</span></span>
          <span>Facial AI: <span className={config.requireFacialEmotionRecognition ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFacialEmotionRecognition ? 'required' : 'optional'}</span></span>
          <span>Mood ambiance: <span className={config.requireMoodAdaptiveAmbiance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMoodAdaptiveAmbiance ? 'required' : 'optional'}</span></span>
          <span>Gaze: <span className={config.requireGazeTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireGazeTracking ? 'required' : 'optional'}</span></span>
          <span>Journey: <span className={config.requireEmotionalJourneyMapping ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireEmotionalJourneyMapping ? 'required' : 'optional'}</span></span>
          <span>Neuro-mktg: <span className={config.requireNeuroMarketing ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNeuroMarketing ? 'required' : 'optional'}</span></span>
          <span>Biometric loyalty: <span className={config.requireOptInBiometricLoyalty ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOptInBiometricLoyalty ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireBiometricPrivacyCompliance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBiometricPrivacyCompliance ? 'required' : 'optional'}</span></span>
          <span>Min facial accuracy: {config.minFacialEmotionAccuracy}%</span>
          <span>Min emotions: {config.minEmotionsTracked}</span>
          <span>Min ambiance systems: {config.minMoodAdaptiveSystems}</span>
          <span>Min touchpoints: {config.minTouchpointsTracked}</span>
          <span>Min privacy: {config.minBiometricPrivacyScore}</span>
          <span>Min opt-in rate: {config.minOptInRate}%</span>
          <span className="text-neutral-400">219th POSR-exclusive differentiator</span>
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

export default NeuroEmotionBiometricDiningScreen;
