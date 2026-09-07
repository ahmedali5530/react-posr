/**
 * AI Window Treatment & Curtain Design Optimizer — predicts how window
 * treatments and curtains (curtain type, drapery material, blind type,
 * opacity, motorization, seasonal rotation, color coordination, sound
 * absorption, thermal insulation, UV blocking) impact customer comfort,
 * perceived restaurant quality, energy efficiency, and ambiance control.
 *
 * 190th POSR-exclusive differentiator — MILESTONE.
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
  faWindowMaximize, faRotate, faSun, faTemperatureHalf, faVolumeHigh,
  faShieldHalved, faPalette, faBolt, faLayerGroup,
  faCircleInfo, faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runWindowTreatmentCurtainEngine, getActiveWindowTreatmentCurtainAlerts, getWindowTreatmentCurtainSummary,
  updateWindowTreatmentCurtainAlertStatus, readWindowTreatmentCurtainConfig, DEFAULT_WINDOW_TREATMENT_CURTAIN_CONFIG,
  type WindowTreatmentCurtainAlert,
} from "@/lib/window-treatment-curtain.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  window_treatment_absent:                 { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faWindowMaximize,  label: 'NO TREATMENTS' },
  curtain_material_wrong_for_concept:      { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faPalette,         label: 'WRONG MATERIAL' },
  motorization_absent:                     { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faBolt,            label: 'NO MOTORIZATION' },
  blackout_capability_absent:              { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faLayerGroup,      label: 'NO BLACKOUT' },
  curtain_wear_stain_detected:             { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faSun,             label: 'WEAR / STAINS' },
  uv_protection_missing:                   { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faShieldHalved,    label: 'NO UV PROTECTION' },
  seasonal_rotation_missing:               { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faTemperatureHalf, label: 'NO SEASONAL ROTATION' },
  sound_absorption_opportunity:            { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faVolumeHigh,      label: 'SOUND ABSORPTION' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function WindowTreatmentCurtainScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<WindowTreatmentCurtainAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, treatmentAbsentCount: 0, wrongMaterialCount: 0, motorizationAbsentCount: 0, blackoutAbsentCount: 0, wearStainCount: 0, uvMissingCount: 0, seasonalRotationMissingCount: 0, soundAbsorptionCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_WINDOW_TREATMENT_CURTAIN_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readWindowTreatmentCurtainConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveWindowTreatmentCurtainAlerts(db), getWindowTreatmentCurtainSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[window-treatment-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runWindowTreatmentCurtainEngine(db, config);
      toast.success(`Analyzed ${result.generated} window treatment signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[window-treatment-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateWindowTreatmentCurtainAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[window-treatment-report] status failed', err);
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
      <DocumentTitle parts={["AI Window Treatment & Curtain Design Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faWindowMaximize} className="text-sky-500" />
              AI Window Treatment &amp; Curtain Design Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how window treatments and curtains (curtain type, drapery material, blind type, opacity, motorization, seasonal rotation, color coordination, sound absorption, thermal insulation, UV blocking) impact customer comfort, perceived restaurant quality, energy efficiency, ambiance control — curtains reduce heat loss 25-40% winter (DOE); block solar gain 60-80% summer (DOE); heavy drapery absorbs 15-20% noise (ASA); motorized blinds $200-800/window; blackout for event spaces; sheers 35% quality boost (Cornell CHR); UV protection saves $500-2,000/yr; 45% notice treatments within 2 min (ASID)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faWindowMaximize} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze treatments'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faWindowMaximize} label="No treatments" value={String(summary.treatmentAbsentCount)} color={summary.treatmentAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faSun} label="Wear/stains" value={String(summary.wearStainCount)} color={summary.wearStainCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="UV missing" value={String(summary.uvMissingCount)} color={summary.uvMissingCount > 0 ? 'text-sky-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLayerGroup} label="No blackout" value={String(summary.blackoutAbsentCount)} color={summary.blackoutAbsentCount > 0 ? 'text-fuchsia-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faWindowMaximize} spin className="text-4xl mb-3" />
            <p>Analyzing window treatment &amp; curtain design opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No window treatment alerts</p>
            <p className="text-sm mt-1">Proper window treatments with 25-40% winter heat loss reduction (DOE) and 60-80% summer solar gain block (DOE); heavy drapery absorbs 15-20% ambient noise (ASA); motorized blinds for high windows ($200-800/window); blackout curtains in event spaces for corporate events; sheer curtains 35% perceived quality boost (Cornell CHR); UV-blocking treatments save $500-2,000/yr in furniture/art fading; seasonal rotation (sheers summer, heavy drapes winter); curtain material matches restaurant concept (silk/linen for fine dining, cotton for casual, velvet for steakhouse); curtains cleaned every 3-6 months and replaced every 5-7 years; 45% of customers notice window treatments within 2 minutes (ASID).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faWindowMaximize, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_window_treatments != null && (
                            <span className={`text-xs ${alert.has_window_treatments ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_window_treatments ? 'treatments yes' : 'NO treatments'}</span>
                          )}
                          {alert.has_curtains_drapery != null && (
                            <span className={`text-xs ${alert.has_curtains_drapery ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_curtains_drapery ? 'curtains yes' : 'NO curtains'}</span>
                          )}
                          {alert.has_blinds_shades != null && (
                            <span className={`text-xs ${alert.has_blinds_shades ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_blinds_shades ? 'blinds yes' : 'NO blinds'}</span>
                          )}
                          {alert.has_sheer_layer != null && alert.has_sheer_layer && (
                            <span className="text-xs text-emerald-600 font-medium">sheer layer</span>
                          )}
                          {alert.has_blackout_layer != null && alert.has_blackout_layer && (
                            <span className="text-xs text-emerald-600 font-medium">blackout layer</span>
                          )}
                          {alert.has_motorized_blinds != null && (
                            <span className={`text-xs ${alert.has_motorized_blinds ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_motorized_blinds ? 'motorized yes' : 'NO motorized'}</span>
                          )}
                          {alert.has_uv_blocking_treatment != null && (
                            <span className={`text-xs ${alert.has_uv_blocking_treatment ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_uv_blocking_treatment ? 'UV yes' : 'NO UV'}</span>
                          )}
                          {alert.has_seasonal_rotation != null && (
                            <span className={`text-xs ${alert.has_seasonal_rotation ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_seasonal_rotation ? 'rotation yes' : 'NO rotation'}</span>
                          )}
                          {alert.has_acoustic_drapery != null && (
                            <span className={`text-xs ${alert.has_acoustic_drapery ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_acoustic_drapery ? 'acoustic yes' : 'NO acoustic'}</span>
                          )}
                          {alert.primary_curtain_material && alert.primary_curtain_material !== 'none' && (
                            <span className={`text-xs ${alert.material_matches_concept ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.primary_curtain_material}</span>
                          )}
                          {alert.material_concept_match_score != null && alert.material_concept_match_score > 0 && (
                            <span className={`text-xs ${alert.material_concept_match_score < 75 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.material_concept_match_score}/100 match</span>
                          )}
                          {alert.curtain_color_coordination_score != null && alert.curtain_color_coordination_score > 0 && (
                            <span className={`text-xs ${alert.curtain_color_coordination_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.curtain_color_coordination_score}/100 color</span>
                          )}
                          {alert.window_count_high_windows != null && alert.window_count_high_windows > 0 && (
                            <span className="text-xs text-amber-600 font-medium">{alert.window_count_high_windows} high windows</span>
                          )}
                          {alert.motorization_coverage_pct != null && alert.motorization_coverage_pct < 80 && alert.window_count_high_windows != null && alert.window_count_high_windows > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.motorization_coverage_pct}% motorized</span>
                          )}
                          {alert.has_event_space != null && alert.has_event_space && (
                            <span className="text-xs text-emerald-600 font-medium">event space</span>
                          )}
                          {alert.has_blackout_capability_event != null && alert.has_blackout_capability_event && (
                            <span className="text-xs text-emerald-600 font-medium">blackout event</span>
                          )}
                          {alert.corporate_events_per_month != null && alert.corporate_events_per_month > 0 && (
                            <span className="text-xs text-neutral-500">{alert.corporate_events_per_month} events/mo</span>
                          )}
                          {alert.curtain_wear_stain_detected != null && alert.curtain_wear_stain_detected && (
                            <span className="text-xs text-rose-600 font-medium">WEAR/STAIN</span>
                          )}
                          {alert.curtain_age_years != null && alert.curtain_age_years > 0 && (
                            <span className="text-xs text-neutral-500">{alert.curtain_age_years}y old</span>
                          )}
                          {alert.perceived_quality_drop_pct != null && alert.perceived_quality_drop_pct > 0 && (
                            <span className="text-xs text-rose-600 font-medium">-{alert.perceived_quality_drop_pct}% quality</span>
                          )}
                          {alert.uv_blocking_pct != null && alert.uv_blocking_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.uv_blocking_pct}% UV block</span>
                          )}
                          {alert.furniture_art_fading_cost_yearly != null && alert.furniture_art_fading_cost_yearly > 0 && (
                            <span className="text-xs text-rose-600 font-medium">${alert.furniture_art_fading_cost_yearly}/yr fading</span>
                          )}
                          {alert.winter_heat_loss_reduction_pct != null && alert.winter_heat_loss_reduction_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">-{alert.winter_heat_loss_reduction_pct}% winter heat loss</span>
                          )}
                          {alert.summer_solar_gain_block_pct != null && alert.summer_solar_gain_block_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">-{alert.summer_solar_gain_block_pct}% summer solar</span>
                          )}
                          {alert.ambient_noise_level_db != null && alert.ambient_noise_level_db > 0 && (
                            <span className={`text-xs ${alert.ambient_noise_level_db > 75 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.ambient_noise_level_db} dB</span>
                          )}
                          {alert.noise_complaints_monthly != null && alert.noise_complaints_monthly > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.noise_complaints_monthly} noise complaints/mo</span>
                          )}
                          {alert.hvac_energy_cost_monthly != null && alert.hvac_energy_cost_monthly > 0 && (
                            <span className="text-xs text-neutral-500">${alert.hvac_energy_cost_monthly}/mo HVAC</span>
                          )}
                          {alert.hvac_energy_savings_pct != null && alert.hvac_energy_savings_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">-{alert.hvac_energy_savings_pct}% HVAC</span>
                          )}
                          {alert.total_energy_savings_monthly != null && alert.total_energy_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">${alert.total_energy_savings_monthly}/mo savings</span>
                          )}
                          {alert.perceived_quality_score != null && alert.perceived_quality_score > 0 && (
                            <span className={`text-xs ${alert.perceived_quality_score < 70 ? 'text-rose-600 font-medium' : alert.perceived_quality_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.perceived_quality_score}/100 quality</span>
                          )}
                          {alert.customer_comfort_score != null && alert.customer_comfort_score > 0 && (
                            <span className={`text-xs ${alert.customer_comfort_score < 70 ? 'text-rose-600 font-medium' : alert.customer_comfort_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_comfort_score}/100 comfort</span>
                          )}
                          {alert.ambiance_control_score != null && alert.ambiance_control_score > 0 && (
                            <span className={`text-xs ${alert.ambiance_control_score < 70 ? 'text-rose-600 font-medium' : alert.ambiance_control_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ambiance_control_score}/100 ambiance</span>
                          )}
                          {alert.competitors_with_premium_treatments_pct != null && alert.competitors_with_premium_treatments_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_premium_treatments_pct}% competitors premium</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.perceived_quality_lift_projected_pct != null && alert.perceived_quality_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pct}% perceived quality (target)</span>
                          )}
                          {alert.customer_comfort_lift_projected_pct != null && alert.customer_comfort_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.customer_comfort_lift_projected_pct}% customer comfort (target)</span>
                          )}
                          {alert.ambiance_control_lift_projected_pct != null && alert.ambiance_control_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.ambiance_control_lift_projected_pct}% ambiance control (target)</span>
                          )}
                          {alert.hvac_energy_savings_projected_pct != null && alert.hvac_energy_savings_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.hvac_energy_savings_projected_pct}% HVAC energy (target)</span>
                          )}
                          {alert.lighting_energy_savings_projected_pct != null && alert.lighting_energy_savings_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.lighting_energy_savings_projected_pct}% lighting energy (target)</span>
                          )}
                          {alert.noise_reduction_projected_pct != null && alert.noise_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.noise_reduction_projected_pct}% noise (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct < 0 && (
                            <span className="text-rose-600">{alert.predicted_revenue_change_pct}% revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faWindowMaximize} className="mt-0.5 shrink-0" />
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
          <span>Window treatments: <span className={config.requireWindowTreatments ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireWindowTreatments ? 'required' : 'optional'}</span></span>
          <span>Material concept match: <span className={config.requireMaterialConceptMatch ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMaterialConceptMatch ? 'required' : 'optional'}</span></span>
          <span>Motorization (high windows): <span className={config.requireMotorizationForHighWindows ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMotorizationForHighWindows ? 'required' : 'optional'}</span></span>
          <span>Blackout (event space): <span className={config.requireBlackoutForEventSpace ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBlackoutForEventSpace ? 'required' : 'optional'}</span></span>
          <span>No wear/stains: <span className={config.requireNoWearStains ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNoWearStains ? 'required' : 'optional'}</span></span>
          <span>UV protection: <span className={config.requireUvProtection ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireUvProtection ? 'required' : 'optional'}</span></span>
          <span>Seasonal rotation: <span className={config.requireSeasonalRotation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSeasonalRotation ? 'required' : 'optional'}</span></span>
          <span>Acoustic drapery (hard surfaces): <span className={config.requireAcousticDraperyForHardSurfaces ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAcousticDraperyForHardSurfaces ? 'required' : 'optional'}</span></span>
          <span>Min treatment types: {config.minTreatmentTypes}</span>
          <span>Min material match score: {config.minMaterialConceptMatchScore}</span>
          <span>Min motorization coverage: {config.minMotorizationCoveragePct}%</span>
          <span>Max cleaning frequency: {config.minCurtainCleaningFrequencyMonths} months</span>
          <span>Min UV blocking: {config.minUvBlockingPct}%</span>
          <span>Min winter heat loss reduction: {config.minWinterHeatLossReductionPct}%</span>
          <span>Min summer solar block: {config.minSummerSolarGainBlockPct}%</span>
          <span>Min noise reduction: {config.minNoiseReductionPct}%</span>
          <span>Min perceived quality lift: {config.minPerceivedQualityLiftPct}%</span>
          <span>Min comfort lift: {config.minCustomerComfortLiftPct}%</span>
          <span>Min ambiance score: {config.minAmbianceControlScore}</span>
          <span>Min color coordination: {config.minColorCoordinationScore}</span>
          <span className="text-neutral-400">190th POSR-exclusive differentiator — MILESTONE</span>
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

export default WindowTreatmentCurtainScreen;
