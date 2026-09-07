/**
 * AI Sensory-Friendly & Low-Stimulus Space Optimizer — predicts how
 * sensory-friendly and low-stimulus spaces (quiet zones, dim lighting areas,
 * noise-reduced seating, sensory-friendly hours, visual schedule menus,
 * fidget/stim tools, staff sensory training, low-aroma zones, predictable
 * environment) impacts customer acquisition from neurodivergent community,
 * family satisfaction, brand reputation, and competitive differentiation.
 *
 * 196th POSR-exclusive differentiator.
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
  faUniversalAccess, faVolumeLow, faLightbulb, faClock,
  faBrain, faHand, faEye, faShieldHalved, faCalendarCheck,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runSensoryFriendlySpaceEngine, getActiveSensoryFriendlySpaceAlerts, getSensoryFriendlySpaceSummary,
  updateSensoryFriendlySpaceAlertStatus, readSensoryFriendlySpaceConfig, DEFAULT_SENSORY_FRIENDLY_SPACE_CONFIG,
  type SensoryFriendlySpaceAlert,
} from "@/lib/sensory-friendly-space.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  sensory_friendly_zone_absent:        { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faVolumeLow,         label: 'NO QUIET ZONE' },
  sensory_friendly_hours_absent:       { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faClock,             label: 'NO SENSORY HOURS' },
  staff_sensory_training_absent:       { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faBrain,             label: 'NO STAFF TRAINING' },
  visual_menu_absent:                  { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faEye,               label: 'NO VISUAL MENU' },
  lighting_too_harsh_everywhere:       { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faLightbulb,         label: 'HARSH LIGHTING' },
  noise_level_uniformly_high:          { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faVolumeLow,         label: 'HIGH NOISE' },
  sensory_certification_absent:        { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faShieldHalved,      label: 'NO CERTIFICATION' },
  predictable_environment_missing:     { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faCalendarCheck,     label: 'NO PREDICTABILITY' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function SensoryFriendlySpaceScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<SensoryFriendlySpaceAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, sensoryFriendlyZoneAbsentCount: 0, sensoryFriendlyHoursAbsentCount: 0, staffSensoryTrainingAbsentCount: 0, visualMenuAbsentCount: 0, lightingTooHarshEverywhereCount: 0, noiseLevelUniformlyHighCount: 0, sensoryCertificationAbsentCount: 0, predictableEnvironmentMissingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_SENSORY_FRIENDLY_SPACE_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readSensoryFriendlySpaceConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveSensoryFriendlySpaceAlerts(db), getSensoryFriendlySpaceSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[sensory-friendly-space-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runSensoryFriendlySpaceEngine(db, config);
      toast.success(`Analyzed ${result.generated} sensory-friendly + low-stimulus signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[sensory-friendly-space-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateSensoryFriendlySpaceAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[sensory-friendly-space-report] status failed', err);
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
      <DocumentTitle parts={["AI Sensory-Friendly & Low-Stimulus Space Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faUniversalAccess} className="text-violet-500" />
              AI Sensory-Friendly &amp; Low-Stimulus Space Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how sensory-friendly + low-stimulus spaces (quiet zones, sensory hours, staff training, visual menus, dim lighting, noise-reduced seating, certification, predictable environment) impact neurodivergent customer acquisition, family satisfaction, brand reputation — 1 in 36 children autistic (CDC 2023); 20% population neurodivergent; 85% autism families avoid restaurants (ARI); sensory-friendly zones increase family visits 30-40%; sensory hours boost off-peak revenue 15-25%; staff training 35-40% satisfaction; visual menus help 20% cognitive accessibility; quiet zones reduce noise complaints 25-30% for ALL customers; certification = $2,000-5,000 free PR; 65% of all customers prefer quieter/dimmer
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faUniversalAccess} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze sensory'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faVolumeLow} label="No quiet zone" value={String(summary.sensoryFriendlyZoneAbsentCount)} color={summary.sensoryFriendlyZoneAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faClock} label="No sensory hours" value={String(summary.sensoryFriendlyHoursAbsentCount)} color={summary.sensoryFriendlyHoursAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBrain} label="No staff training" value={String(summary.staffSensoryTrainingAbsentCount)} color={summary.staffSensoryTrainingAbsentCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLightbulb} label="Harsh lighting" value={String(summary.lightingTooHarshEverywhereCount)} color={summary.lightingTooHarshEverywhereCount > 0 ? 'text-cyan-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faUniversalAccess} spin className="text-4xl mb-3" />
            <p>Analyzing sensory-friendly + low-stimulus opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No sensory-friendly + low-stimulus alerts</p>
            <p className="text-sm mt-1">Healthy sensory-friendly + low-stimulus environment: designated quiet zone (30-40% family visit lift); sensory-friendly hours (15-25% off-peak revenue lift); staff sensory training (35-40% satisfaction lift); visual pictogram menu (20% cognitive accessibility); dim/soft lighting option (65% of all customers prefer); noise-reduced seating (25-30% noise complaint reduction for ALL); sensory-friendly certification ($2,000-5,000 free PR); predictable environment with visual schedules (reduced anxiety); 1 in 36 children autistic (CDC 2023); 20% population neurodivergent; 85% autism families avoid restaurants (ARI).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faUniversalAccess, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_sensory_friendly_zone != null && (
                            <span className={`text-xs ${alert.has_sensory_friendly_zone ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_sensory_friendly_zone ? 'quiet zone yes' : 'NO quiet zone'}</span>
                          )}
                          {alert.quiet_zone_score != null && alert.quiet_zone_score > 0 && (
                            <span className={`text-xs ${alert.quiet_zone_score < 40 ? 'text-rose-600 font-medium' : alert.quiet_zone_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.quiet_zone_score}/100 quiet</span>
                          )}
                          {alert.quiet_zone_seats != null && alert.quiet_zone_seats > 0 && (
                            <span className="text-xs text-neutral-500">{alert.quiet_zone_seats} quiet seats</span>
                          )}
                          {alert.has_sensory_friendly_hours != null && (
                            <span className={`text-xs ${alert.has_sensory_friendly_hours ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_sensory_friendly_hours ? 'sensory hrs yes' : 'NO sensory hrs'}</span>
                          )}
                          {alert.sensory_hours_per_week != null && alert.sensory_hours_per_week > 0 && (
                            <span className={`text-xs ${alert.sensory_hours_per_week < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.sensory_hours_per_week}/wk</span>
                          )}
                          {alert.sensory_hours_revenue_lift_pct != null && alert.sensory_hours_revenue_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.sensory_hours_revenue_lift_pct}% lift</span>
                          )}
                          {alert.staff_sensory_training_pct != null && alert.staff_sensory_training_pct >= 0 && (
                            <span className={`text-xs ${alert.staff_sensory_training_pct < 20 ? 'text-rose-600 font-medium' : alert.staff_sensory_training_pct < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.staff_sensory_training_pct}% trained</span>
                          )}
                          {alert.trained_staff_count != null && alert.total_staff_count != null && (
                            <span className="text-xs text-neutral-500">{alert.trained_staff_count}/{alert.total_staff_count} staff</span>
                          )}
                          {alert.has_visual_menu != null && (
                            <span className={`text-xs ${alert.has_visual_menu ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_visual_menu ? 'visual menu yes' : 'NO visual menu'}</span>
                          )}
                          {alert.pictogram_count != null && alert.pictogram_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.pictogram_count} pictograms</span>
                          )}
                          {alert.cognitive_accessibility_score != null && alert.cognitive_accessibility_score > 0 && (
                            <span className={`text-xs ${alert.cognitive_accessibility_score < 40 ? 'text-rose-600 font-medium' : alert.cognitive_accessibility_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.cognitive_accessibility_score}/100 cognitive</span>
                          )}
                          {alert.lighting_options && (
                            <span className={`text-xs font-medium ${alert.lighting_options === 'dimmable' || alert.lighting_options === 'multi_zone' ? 'text-emerald-600' : alert.lighting_options === 'single_soft' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.lighting_options}</span>
                          )}
                          {alert.has_dim_option != null && (
                            <span className={`text-xs ${alert.has_dim_option ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_dim_option ? 'dim yes' : 'NO dim'}</span>
                          )}
                          {alert.lighting_harshness_score != null && alert.lighting_harshness_score > 0 && (
                            <span className={`text-xs ${alert.lighting_harshness_score > 60 ? 'text-rose-600 font-medium' : alert.lighting_harshness_score > 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.lighting_harshness_score}/100 harsh</span>
                          )}
                          {alert.noise_level_db != null && alert.noise_level_db > 0 && (
                            <span className={`text-xs ${alert.noise_level_db > 75 ? 'text-rose-600 font-medium' : alert.noise_level_db > 65 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.noise_level_db}dB</span>
                          )}
                          {alert.has_noise_reduced_seating != null && (
                            <span className={`text-xs ${alert.has_noise_reduced_seating ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_noise_reduced_seating ? 'noise seating yes' : 'NO noise seating'}</span>
                          )}
                          {alert.noise_complaints_per_100 != null && alert.noise_complaints_per_100 > 0 && (
                            <span className={`text-xs ${alert.noise_complaints_per_100 > 10 ? 'text-rose-600 font-medium' : alert.noise_complaints_per_100 > 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.noise_complaints_per_100}/100 noise</span>
                          )}
                          {alert.has_sensory_certification != null && (
                            <span className={`text-xs ${alert.has_sensory_certification ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_sensory_certification ? 'certified yes' : 'NO cert'}</span>
                          )}
                          {alert.certification_pr_value != null && alert.certification_pr_value > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">${alert.certification_pr_value} PR</span>
                          )}
                          {alert.has_predictable_environment != null && (
                            <span className={`text-xs ${alert.has_predictable_environment ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_predictable_environment ? 'predictable yes' : 'NO predictable'}</span>
                          )}
                          {alert.visual_schedule_count != null && alert.visual_schedule_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.visual_schedule_count} schedules</span>
                          )}
                          {alert.neurodivergent_household_visits_pct != null && alert.neurodivergent_household_visits_pct > 0 && (
                            <span className={`text-xs ${alert.neurodivergent_household_visits_pct < 8 ? 'text-rose-600 font-medium' : alert.neurodivergent_household_visits_pct < 15 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.neurodivergent_household_visits_pct}% ND visits</span>
                          )}
                          {alert.family_visit_frequency_score != null && alert.family_visit_frequency_score > 0 && (
                            <span className={`text-xs ${alert.family_visit_frequency_score < 40 ? 'text-rose-600 font-medium' : alert.family_visit_frequency_score < 60 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.family_visit_frequency_score}/100 family freq</span>
                          )}
                          {alert.family_satisfaction_score != null && alert.family_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.family_satisfaction_score < 50 ? 'text-rose-600 font-medium' : alert.family_satisfaction_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.family_satisfaction_score}/100 family sat</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 sat</span>
                          )}
                          {alert.competitor_sensory_score != null && alert.competitor_sensory_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_sensory_score}/100 competitor</span>
                          )}
                          {alert.off_peak_revenue != null && alert.off_peak_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.off_peak_revenue}/mo off-peak</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.neurodivergent_family_visit_lift_projected_pct != null && alert.neurodivergent_family_visit_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.neurodivergent_family_visit_lift_projected_pct}% ND family visits (target)</span>
                          )}
                          {alert.off_peak_revenue_lift_projected_pct != null && alert.off_peak_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.off_peak_revenue_lift_projected_pct}% off-peak revenue (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.noise_complaint_reduction_projected_pct != null && alert.noise_complaint_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.noise_complaint_reduction_projected_pct}% noise complaints (target)</span>
                          )}
                          {alert.pr_value_projected != null && alert.pr_value_projected > 0 && (
                            <span className="text-emerald-600">+${alert.pr_value_projected} PR value (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faUniversalAccess} className="mt-0.5 shrink-0" />
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
          <span>Quiet zone: <span className={config.requireSensoryFriendlyZone ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSensoryFriendlyZone ? 'required' : 'optional'}</span></span>
          <span>Sensory hours: <span className={config.requireSensoryFriendlyHours ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSensoryFriendlyHours ? 'required' : 'optional'}</span></span>
          <span>Staff training: <span className={config.requireStaffSensoryTraining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireStaffSensoryTraining ? 'required' : 'optional'}</span></span>
          <span>Visual menu: <span className={config.requireVisualMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVisualMenu ? 'required' : 'optional'}</span></span>
          <span>Dim lighting: <span className={config.requireDimLightingOption ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDimLightingOption ? 'required' : 'optional'}</span></span>
          <span>Noise seating: <span className={config.requireNoiseReducedSeating ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNoiseReducedSeating ? 'required' : 'optional'}</span></span>
          <span>Certification: <span className={config.requireSensoryCertification ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSensoryCertification ? 'required' : 'optional'}</span></span>
          <span>Predictable: <span className={config.requirePredictableEnvironment ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePredictableEnvironment ? 'required' : 'optional'}</span></span>
          <span>Min quiet score: {config.minQuietZoneScore}</span>
          <span>Min sensory hours/wk: {config.minSensoryHoursPerWeek}</span>
          <span>Min staff training %: {config.minStaffSensoryTrainingPct}</span>
          <span>Min cognitive score: {config.minCognitiveAccessibilityScore}</span>
          <span>Max lighting harshness: {config.maxLightingHarshnessScore}</span>
          <span>Max noise (dB): {config.maxNoiseLevelDb}</span>
          <span>Min competitor sensory: {config.minCompetitorSensoryScore}</span>
          <span>Min visual schedules: {config.minVisualScheduleCount}</span>
          <span>Prefer certified: <span className={config.preferCertifiedSensory ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.preferCertifiedSensory ? 'yes' : 'no'}</span></span>
          <span className="text-neutral-400">196th POSR-exclusive differentiator</span>
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

export default SensoryFriendlySpaceScreen;
