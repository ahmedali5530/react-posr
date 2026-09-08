/**
 * AI Voice Ordering & Conversational AI Optimizer — predicts how voice
 * ordering and conversational AI (drive-thru voice AI, phone voice
 * assistant, smart speaker ordering, in-restaurant voice kiosks,
 * multi-language support, accent adaptation, voice biometrics, order
 * accuracy, speed of service, upsell automation, handoff to human)
 * impacts order accuracy, speed, labor cost, customer satisfaction,
 * average ticket, accessibility.
 *
 * 205th POSR-exclusive differentiator.
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
  faMicrophoneLines, faGaugeHigh, faWandMagicSparkles, faLanguage,
  faGlobe, faFingerprint, faHeadset, faAssistiveListeningSystems,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runVoiceOrderingEngine, getActiveVoiceOrderingAlerts, getVoiceOrderingSummary,
  updateVoiceOrderingAlertStatus, readVoiceOrderingConfig, DEFAULT_VOICE_ORDERING_CONFIG,
  type VoiceOrderingAlert,
} from "@/lib/voice-ordering-conversational-ai.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  voice_ai_strategy_absent:                { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faMicrophoneLines,                label: 'NO VOICE AI' },
  voice_order_accuracy_low:                { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faGaugeHigh,                      label: 'LOW ACCURACY' },
  voice_ai_upsell_automation_absent:       { bg: 'bg-emerald-50',   text: 'text-emerald-700',   icon: faWandMagicSparkles,              label: 'NO UPSELL' },
  voice_ai_multilingual_absent:            { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faLanguage,                       label: 'NO MULTILINGUAL' },
  voice_ai_accent_adaptation_absent:       { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faGlobe,                          label: 'NO ACCENT ADAPT' },
  voice_biometrics_absent:                 { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faFingerprint,                    label: 'NO BIOMETRICS' },
  voice_ai_human_handoff_absent:           { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faHeadset,                        label: 'NO HANDOFF' },
  voice_ai_accessibility_absent:           { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faAssistiveListeningSystems,      label: 'NO ACCESSIBILITY' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function VoiceOrderingConversationalAiScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<VoiceOrderingAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, voiceAiStrategyAbsentCount: 0, voiceOrderAccuracyLowCount: 0, voiceAiUpsellAutomationAbsentCount: 0, voiceAiMultilingualAbsentCount: 0, voiceAiAccentAdaptationAbsentCount: 0, voiceBiometricsAbsentCount: 0, voiceAiHumanHandoffAbsentCount: 0, voiceAiAccessibilityAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_VOICE_ORDERING_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readVoiceOrderingConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveVoiceOrderingAlerts(db), getVoiceOrderingSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[voice-ordering-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runVoiceOrderingEngine(db, config);
      toast.success(`Analyzed ${result.generated} voice ordering signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[voice-ordering-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateVoiceOrderingAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[voice-ordering-report] status failed', err);
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
      <DocumentTitle parts={["AI Voice Ordering & Conversational AI Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faMicrophoneLines} className="text-sky-600" />
              AI Voice Ordering &amp; Conversational AI Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how voice ordering and conversational AI (drive-thru voice AI, phone voice assistant, smart speaker ordering, in-restaurant voice kiosks, multi-language support, accent adaptation, voice biometrics, order accuracy, speed of service, upsell automation, handoff to human) impacts order accuracy, speed, labor cost, customer satisfaction, average ticket, accessibility — voice AI reduces order time 20-30s/order = $50-100/day additional revenue (QSR Magazine); McDonald AI drive-thru 85% accuracy (vs 80% human); voice AI phone 24/7 no hold (35% abandon if over 30s hold); 60% prefer voice over IVR (Nuance); smart speaker ordering 40% YoY growth, 15% US households; voice AI reduces labor 25-40% peak (NRA); accuracy benchmark 90-95%; voice upsell 35-45% acceptance vs 15-20% human; voice biometrics 78% prefer voice ID; 22% non-English households (Census); accent adaptation reduces errors 40-60%; 45% QSRs plan voice AI by 2026; voice AI accessibility serves 61M disabled Americans (CDC); ROI $3-8 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faMicrophoneLines} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze voice AI'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faMicrophoneLines} label="No voice AI strategy" value={String(summary.voiceAiStrategyAbsentCount)} color={summary.voiceAiStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faGaugeHigh} label="Low accuracy / no upsell" value={String(summary.voiceOrderAccuracyLowCount + summary.voiceAiUpsellAutomationAbsentCount)} color={(summary.voiceOrderAccuracyLowCount + summary.voiceAiUpsellAutomationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLanguage} label="No multilingual / no accent" value={String(summary.voiceAiMultilingualAbsentCount + summary.voiceAiAccentAdaptationAbsentCount)} color={(summary.voiceAiMultilingualAbsentCount + summary.voiceAiAccentAdaptationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faAssistiveListeningSystems} label="No biometrics / no handoff / no accessibility" value={String(summary.voiceBiometricsAbsentCount + summary.voiceAiHumanHandoffAbsentCount + summary.voiceAiAccessibilityAbsentCount)} color={(summary.voiceBiometricsAbsentCount + summary.voiceAiHumanHandoffAbsentCount + summary.voiceAiAccessibilityAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faMicrophoneLines} spin className="text-4xl mb-3" />
            <p>Analyzing voice ordering &amp; conversational AI opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No voice ordering alerts</p>
            <p className="text-sm mt-1">Healthy voice AI environment: active voice AI strategy (drive-thru, phone, kiosk, smart speaker); order accuracy 90%+; automated upsell (35-45% acceptance); multi-language support (2+ languages for 22% non-English households); accent adaptation (reduce non-native errors 40-60%); voice biometrics (78% prefer voice ID, 95-99% accuracy); human handoff (8-15% rate, sentiment detection 70%+); voice accessibility (61M disabled Americans, 56M elderly); voice AI reduces order time 20-30s/order ($50-100/day); reduces labor 25-40% peak; ROI $3-8 per $1; 45% QSRs plan deployment by 2026; McDonald AI drive-thru 85% accuracy.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faMicrophoneLines, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'takeout' ? 'text-emerald-600' : alert.channel === 'mixed' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_voice_ai_strategy != null && (
                            <span className={`text-xs ${alert.has_voice_ai_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_voice_ai_strategy ? 'voice AI yes' : 'NO voice AI'}</span>
                          )}
                          {alert.voice_ai_channels && alert.voice_ai_channels !== 'none' && (
                            <span className="text-xs text-sky-600 font-medium">{alert.voice_ai_channels}</span>
                          )}
                          {alert.voice_ai_provider && alert.voice_ai_provider !== 'none' && (
                            <span className="text-xs text-sky-600 font-medium">{alert.voice_ai_provider}</span>
                          )}
                          {alert.voice_ai_deployment_pct != null && alert.voice_ai_deployment_pct > 0 && (
                            <span className={`text-xs ${alert.voice_ai_deployment_pct < 50 ? 'text-rose-600 font-medium' : alert.voice_ai_deployment_pct < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.voice_ai_deployment_pct}% deployed</span>
                          )}
                          {alert.voice_order_accuracy_pct != null && alert.voice_order_accuracy_pct > 0 && (
                            <span className={`text-xs ${alert.voice_order_accuracy_pct < 88 ? 'text-rose-600 font-medium' : alert.voice_order_accuracy_pct < 90 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.voice_order_accuracy_pct}% voice accuracy (target {alert.voice_order_accuracy_target_pct ?? 92}%)</span>
                          )}
                          {alert.human_order_accuracy_pct != null && alert.human_order_accuracy_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.human_order_accuracy_pct}% human accuracy</span>
                          )}
                          {alert.order_error_rate_pct != null && alert.order_error_rate_pct > 0 && (
                            <span className={`text-xs ${alert.order_error_rate_pct > 12 ? 'text-rose-600 font-medium' : alert.order_error_rate_pct > 8 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.order_error_rate_pct}% errors (${fmt$(alert.error_cost_monthly ?? 0)}/mo)</span>
                          )}
                          {alert.has_voice_ai_upsell != null && (
                            <span className={`text-xs ${alert.has_voice_ai_upsell ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_voice_ai_upsell ? 'upsell yes' : 'NO upsell'}</span>
                          )}
                          {alert.voice_upsell_acceptance_pct != null && alert.voice_upsell_acceptance_pct > 0 && (
                            <span className={`text-xs ${alert.voice_upsell_acceptance_pct < 35 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.voice_upsell_acceptance_pct}% upsell accept</span>
                          )}
                          {alert.upsell_revenue_monthly != null && alert.upsell_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.upsell_revenue_monthly)}/mo upsell</span>
                          )}
                          {alert.has_multilingual_voice != null && (
                            <span className={`text-xs ${alert.has_multilingual_voice ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_multilingual_voice ? 'multilingual yes' : 'NO multilingual'}</span>
                          )}
                          {alert.languages_supported_count != null && alert.languages_supported_count > 0 && (
                            <span className={`text-xs ${alert.languages_supported_count < 2 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.languages_supported_count} languages</span>
                          )}
                          {alert.non_english_customer_pct != null && alert.non_english_customer_pct > 0 && (
                            <span className="text-xs text-sky-600 font-medium">{alert.non_english_customer_pct}% non-English</span>
                          )}
                          {alert.has_accent_adaptation != null && (
                            <span className={`text-xs ${alert.has_accent_adaptation ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_accent_adaptation ? 'accent adapt yes' : 'NO accent adapt'}</span>
                          )}
                          {alert.accent_error_rate_pct != null && alert.accent_error_rate_pct > 0 && (
                            <span className={`text-xs ${alert.accent_error_rate_pct > 15 ? 'text-rose-600 font-medium' : alert.accent_error_rate_pct > 8 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.accent_error_rate_pct}% accent errors (max 8%)</span>
                          )}
                          {alert.non_native_speaker_pct != null && alert.non_native_speaker_pct > 0 && (
                            <span className="text-xs text-orange-600 font-medium">{alert.non_native_speaker_pct}% non-native</span>
                          )}
                          {alert.has_voice_biometrics != null && (
                            <span className={`text-xs ${alert.has_voice_biometrics ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_voice_biometrics ? 'biometrics yes' : 'NO biometrics'}</span>
                          )}
                          {alert.loyalty_identification_rate_pct != null && alert.loyalty_identification_rate_pct > 0 && (
                            <span className={`text-xs ${alert.loyalty_identification_rate_pct < 30 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.loyalty_identification_rate_pct}% loyalty ID</span>
                          )}
                          {alert.has_human_handoff != null && (
                            <span className={`text-xs ${alert.has_human_handoff ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_human_handoff ? 'handoff yes' : 'NO handoff'}</span>
                          )}
                          {alert.handoff_rate_pct != null && alert.handoff_rate_pct > 0 && (
                            <span className={`text-xs ${alert.handoff_rate_pct > 15 ? 'text-rose-600 font-medium' : alert.handoff_rate_pct > 12 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.handoff_rate_pct}% handoff (max 15%)</span>
                          )}
                          {alert.sentiment_detection_accuracy != null && alert.sentiment_detection_accuracy > 0 && (
                            <span className={`text-xs ${alert.sentiment_detection_accuracy < 60 ? 'text-rose-600 font-medium' : alert.sentiment_detection_accuracy < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.sentiment_detection_accuracy}/100 sentiment</span>
                          )}
                          {alert.has_voice_accessibility != null && (
                            <span className={`text-xs ${alert.has_voice_accessibility ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_voice_accessibility ? 'accessibility yes' : 'NO accessibility'}</span>
                          )}
                          {alert.disabled_customer_pct != null && alert.disabled_customer_pct > 0 && (
                            <span className="text-xs text-fuchsia-600 font-medium">{alert.disabled_customer_pct}% disabled</span>
                          )}
                          {alert.avg_voice_order_time_seconds != null && alert.avg_voice_order_time_seconds > 0 && (
                            <span className={`text-xs ${alert.avg_voice_order_time_seconds > 70 ? 'text-rose-600 font-medium' : alert.avg_voice_order_time_seconds > 60 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_voice_order_time_seconds}s voice (vs {alert.avg_human_order_time_seconds ?? 90}s human)</span>
                          )}
                          {alert.voice_ai_uptime_pct != null && alert.voice_ai_uptime_pct > 0 && (
                            <span className={`text-xs ${alert.voice_ai_uptime_pct < 95 ? 'text-rose-600 font-medium' : alert.voice_ai_uptime_pct < 98 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.voice_ai_uptime_pct}% uptime</span>
                          )}
                          {alert.labor_savings_monthly != null && alert.labor_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.labor_savings_monthly)}/mo labor saved</span>
                          )}
                          {alert.avg_ticket_voice != null && alert.avg_ticket_voice > 0 && (
                            <span className={`text-xs ${alert.avg_ticket_voice < (alert.avg_ticket_human ?? 10) ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.avg_ticket_voice)} voice ticket (vs {fmt$(alert.avg_ticket_human ?? 0)} human)</span>
                          )}
                          {alert.customer_satisfaction_voice_score != null && alert.customer_satisfaction_voice_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_voice_score < 70 ? 'text-rose-600 font-medium' : alert.customer_satisfaction_voice_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_voice_score}/100 voice sat (vs {alert.customer_satisfaction_human_score ?? 0} human)</span>
                          )}
                          {alert.voice_orders_monthly != null && alert.voice_orders_monthly > 0 && (
                            <span className="text-xs text-sky-600 font-medium">{alert.voice_orders_monthly} voice orders/mo</span>
                          )}
                          {alert.competitor_voice_ai_score != null && alert.competitor_voice_ai_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_voice_ai_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.speed_lift_projected_seconds != null && alert.speed_lift_projected_seconds > 0 && (
                            <span className="text-emerald-600">-{alert.speed_lift_projected_seconds}s/order (target)</span>
                          )}
                          {alert.accuracy_lift_projected_pts != null && alert.accuracy_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.accuracy_lift_projected_pts}pts accuracy (target)</span>
                          )}
                          {alert.upsell_revenue_projected != null && alert.upsell_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.upsell_revenue_projected)}/mo upsell (target)</span>
                          )}
                          {alert.labor_savings_projected != null && alert.labor_savings_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.labor_savings_projected)}/mo labor savings (target)</span>
                          )}
                          {alert.multilingual_revenue_projected != null && alert.multilingual_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.multilingual_revenue_projected)}/mo multilingual (target)</span>
                          )}
                          {alert.accessibility_revenue_projected != null && alert.accessibility_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.accessibility_revenue_projected)}/mo accessibility (target)</span>
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
                            <FontAwesomeIcon icon={faMicrophoneLines} className="mt-0.5 shrink-0" />
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
          <span>Voice AI strategy: <span className={config.requireVoiceAiStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVoiceAiStrategy ? 'required' : 'optional'}</span></span>
          <span>Upsell: <span className={config.requireVoiceAiUpsell ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVoiceAiUpsell ? 'required' : 'optional'}</span></span>
          <span>Multilingual: <span className={config.requireMultilingualVoice ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMultilingualVoice ? 'required' : 'optional'}</span></span>
          <span>Accent adapt: <span className={config.requireAccentAdaptation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAccentAdaptation ? 'required' : 'optional'}</span></span>
          <span>Biometrics: <span className={config.requireVoiceBiometrics ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVoiceBiometrics ? 'required' : 'optional'}</span></span>
          <span>Handoff: <span className={config.requireHumanHandoff ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireHumanHandoff ? 'required' : 'optional'}</span></span>
          <span>Accessibility: <span className={config.requireVoiceAccessibility ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVoiceAccessibility ? 'required' : 'optional'}</span></span>
          <span>Min accuracy: {config.minVoiceOrderAccuracyPct}%</span>
          <span>Min upsell accept: {config.minVoiceUpsellAcceptancePct}%</span>
          <span>Min languages: {config.minLanguagesSupported}</span>
          <span>Max accent errors: {config.maxAccentErrorRatePct}%</span>
          <span>Min loyalty ID: {config.minLoyaltyIdentificationPct}%</span>
          <span>Max handoff: {config.maxHandoffRatePct}%</span>
          <span>Min uptime: {config.minVoiceAiUptimePct}%</span>
          <span className="text-neutral-400">205th POSR-exclusive differentiator</span>
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

export default VoiceOrderingConversationalAiScreen;
