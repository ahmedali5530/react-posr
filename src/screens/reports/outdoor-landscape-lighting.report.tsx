/**
 * AI Outdoor & Landscape Lighting Optimizer — predicts how outdoor and
 * landscape lighting (pathway lights, facade lighting, parking lot lighting,
 * decorative string lights, tree uplighting, signage illumination, seasonal
 * lighting, security lighting) impacts customer safety, perceived restaurant
 * quality, walk-in attraction, and evening revenue.
 *
 * 185th POSR-exclusive differentiator.
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
  faLightbulb, faRotate, faRoad, faBuilding, faParking,
  faStar, faTree, faSignsPost, faSun, faShieldHalved,
  faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runOutdoorLightingEngine, getActiveOutdoorLightingAlerts, getOutdoorLightingSummary,
  updateOutdoorLightingAlertStatus, readOutdoorLightingConfig, DEFAULT_OUTDOOR_LIGHTING_CONFIG,
  type OutdoorLightingAlert,
} from "@/lib/outdoor-landscape-lighting.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  pathway_lighting_insufficient:        { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faRoad,         label: 'DARK PATHWAYS' },
  facade_lighting_poor:                 { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faBuilding,     label: 'POOR FACADE' },
  parking_lot_lighting_inadequate:      { bg: 'bg-red-50',      text: 'text-red-700',      icon: faParking,      label: 'DARK PARKING' },
  decorative_string_lights_absent:      { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faStar,         label: 'NO STRING LIGHTS' },
  tree_uplighting_opportunity:          { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faTree,         label: 'NO UPLIGHTING' },
  signage_illumination_poor:            { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faSignsPost,    label: 'POOR SIGNAGE' },
  seasonal_lighting_absent:             { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faSun,          label: 'NO SEASONAL' },
  security_lighting_gap:                { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faShieldHalved, label: 'SECURITY GAP' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function OutdoorLandscapeLightingScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<OutdoorLightingAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noPathwayCount: 0, darkParkingCount: 0, noSignageCount: 0, noSecurityCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_OUTDOOR_LIGHTING_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readOutdoorLightingConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveOutdoorLightingAlerts(db), getOutdoorLightingSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[outdoor-lighting-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runOutdoorLightingEngine(db, config);
      toast.success(`Analyzed ${result.generated} outdoor & landscape lighting signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[outdoor-lighting-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateOutdoorLightingAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[outdoor-lighting-report] status failed', err);
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
      <DocumentTitle parts={["AI Outdoor & Landscape Lighting Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              AI Outdoor &amp; Landscape Lighting Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how outdoor lighting (pathway, facade, parking, decorative string, tree uplighting, signage, seasonal, security) impacts safety + walk-in attraction + evening revenue — 70% walk-in decisions from street (NRA); dark pathways = 60% more slip/fall (OSHA); string lights 25-30% quality perception (Cornell CHR); tree uplighting 35-40% Instagram photos; dark signage = 40% fewer evening walk-ins; seasonal lighting 15-20% December revenue
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faLightbulb} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze lighting'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faRoad} label="Dark pathways" value={String(summary.noPathwayCount)} color={summary.noPathwayCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faParking} label="Dark parking" value={String(summary.darkParkingCount)} color={summary.darkParkingCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
          <SummaryCard icon={faSignsPost} label="Poor signage" value={String(summary.noSignageCount)} color={summary.noSignageCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="Security gaps" value={String(summary.noSecurityCount)} color={summary.noSecurityCount > 0 ? 'text-fuchsia-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faLightbulb} spin className="text-4xl mb-3" />
            <p>Analyzing outdoor &amp; landscape lighting opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No outdoor lighting alerts</p>
            <p className="text-sm mt-1">Pathway lights at 50+ lux with 3:1 uniformity, facade lighting at 150+ lux, parking lot lighting at 20+ lux (IESNA RP-20), decorative string lights on patio/pergola/entry, tree uplighting on 3-5 signature trees, illuminated signage at 300+ lux, seasonal lighting active November-January (15-20% December revenue lift), security lighting in alleys/dumpster/rear entrance with motion sensors + 50+ lux coverage.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faLightbulb, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_pathway_lights != null && (
                            <span className={`text-xs ${alert.has_pathway_lights ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pathway_lights ? 'pathway yes' : 'NO pathway'}</span>
                          )}
                          {alert.has_facade_lighting != null && (
                            <span className={`text-xs ${alert.has_facade_lighting ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_facade_lighting ? 'facade yes' : 'NO facade'}</span>
                          )}
                          {alert.has_parking_lot_lighting != null && (
                            <span className={`text-xs ${alert.has_parking_lot_lighting ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}`}>{alert.has_parking_lot_lighting ? 'parking yes' : 'NO parking'}</span>
                          )}
                          {alert.has_decorative_string_lights != null && (
                            <span className={`text-xs ${alert.has_decorative_string_lights ? 'text-emerald-600 font-medium' : 'text-violet-600 font-medium'}`}>{alert.has_decorative_string_lights ? 'string yes' : 'NO string'}</span>
                          )}
                          {alert.has_tree_uplighting != null && (
                            <span className={`text-xs ${alert.has_tree_uplighting ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.has_tree_uplighting ? 'uplight yes' : 'NO uplight'}</span>
                          )}
                          {alert.has_signage_illumination != null && (
                            <span className={`text-xs ${alert.has_signage_illumination ? 'text-emerald-600 font-medium' : 'text-sky-600 font-medium'}`}>{alert.has_signage_illumination ? 'signage yes' : 'NO signage'}</span>
                          )}
                          {alert.has_seasonal_lighting != null && (
                            <span className={`text-xs ${alert.has_seasonal_lighting ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_seasonal_lighting ? 'seasonal yes' : 'NO seasonal'}</span>
                          )}
                          {alert.has_security_lighting != null && (
                            <span className={`text-xs ${alert.has_security_lighting ? 'text-emerald-600 font-medium' : 'text-fuchsia-600 font-medium'}`}>{alert.has_security_lighting ? 'security yes' : 'NO security'}</span>
                          )}
                          {alert.lighting_features_count != null && alert.lighting_features_count > 0 && (
                            <span className={`text-xs ${alert.lighting_features_count < 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.lighting_features_count} features</span>
                          )}
                          {alert.pathway_lux_level != null && alert.pathway_lux_level > 0 && (
                            <span className={`text-xs ${alert.pathway_lux_level < 50 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pathway_lux_level} pathway lux</span>
                          )}
                          {alert.facade_lux_level != null && alert.facade_lux_level > 0 && (
                            <span className={`text-xs ${alert.facade_lux_level < 150 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.facade_lux_level} facade lux</span>
                          )}
                          {alert.parking_lot_lux_level != null && alert.parking_lot_lux_level > 0 && (
                            <span className={`text-xs ${alert.parking_lot_lux_level < 20 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.parking_lot_lux_level} parking lux</span>
                          )}
                          {alert.signage_lux_level != null && alert.signage_lux_level > 0 && (
                            <span className={`text-xs ${alert.signage_lux_level < 300 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.signage_lux_level} signage lux</span>
                          )}
                          {alert.lighting_uniformity_score != null && alert.lighting_uniformity_score > 0 && (
                            <span className={`text-xs ${alert.lighting_uniformity_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>uniformity {alert.lighting_uniformity_score}/100</span>
                          )}
                          {alert.lighting_glare_index != null && alert.lighting_glare_index > 0 && (
                            <span className={`text-xs ${alert.lighting_glare_index > 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>glare {alert.lighting_glare_index}</span>
                          )}
                          {alert.lighting_color_temp_k != null && alert.lighting_color_temp_k > 0 && (
                            <span className="text-xs text-neutral-500">{alert.lighting_color_temp_k}K</span>
                          )}
                          {alert.premises_liability_risk && alert.premises_liability_risk !== 'low' && (
                            <span className={`text-xs font-medium ${alert.premises_liability_risk === 'critical' ? 'text-rose-600' : alert.premises_liability_risk === 'high' ? 'text-amber-600' : 'text-yellow-600'}`}>liability {alert.premises_liability_risk}</span>
                          )}
                          {alert.evening_walk_in_pct != null && alert.evening_walk_in_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.evening_walk_in_pct}% evening walk-in</span>
                          )}
                          {alert.evening_walk_in_lost_pct != null && alert.evening_walk_in_lost_pct > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.evening_walk_in_lost_pct}% evening walk-in lost</span>
                          )}
                          {alert.perceived_quality_score != null && alert.perceived_quality_score > 0 && (
                            <span className="text-xs text-neutral-500">quality {alert.perceived_quality_score}/100</span>
                          )}
                          {alert.perceived_quality_lift_pct != null && alert.perceived_quality_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.perceived_quality_lift_pct}% quality</span>
                          )}
                          {alert.instagram_photos_per_month != null && alert.instagram_photos_per_month > 0 && (
                            <span className="text-xs text-neutral-500">{alert.instagram_photos_per_month} IG/mo</span>
                          )}
                          {alert.instagram_photos_lift_pct != null && alert.instagram_photos_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.instagram_photos_lift_pct}% IG</span>
                          )}
                          {alert.slip_fall_incidents_year != null && alert.slip_fall_incidents_year > 0 && (
                            <span className={`text-xs ${alert.slip_fall_incidents_year >= 3 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.slip_fall_incidents_year} slip/fall/yr</span>
                          )}
                          {alert.security_incidents_year != null && alert.security_incidents_year > 0 && (
                            <span className={`text-xs ${alert.security_incidents_year >= 3 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.security_incidents_year} security/yr</span>
                          )}
                          {alert.seasonal_revenue_lift_pct != null && alert.seasonal_revenue_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.seasonal_revenue_lift_pct}% Dec revenue</span>
                          )}
                          {alert.seasonal_active_months != null && alert.seasonal_active_months > 0 && (
                            <span className="text-xs text-neutral-500">{alert.seasonal_active_months}mo seasonal</span>
                          )}
                          {alert.competitors_with_quality_lighting_pct != null && alert.competitors_with_quality_lighting_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_quality_lighting_pct}% competitors lit</span>
                          )}
                          {alert.street_appearance_walk_in_pct != null && alert.street_appearance_walk_in_pct > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.street_appearance_walk_in_pct}% walk-in from street</span>
                          )}
                          {alert.lighting_aware_lost_customers != null && alert.lighting_aware_lost_customers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.lighting_aware_lost_customers} lost customers</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          {alert.lighting_hardware_cost != null && alert.lighting_hardware_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.lighting_hardware_cost} hardware</span>
                          )}
                          {alert.lighting_monthly_energy_total != null && alert.lighting_monthly_energy_total > 0 && (
                            <span className="text-xs text-neutral-500">${alert.lighting_monthly_energy_total}/mo energy</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.evening_walk_in_lift_projected_pct != null && alert.evening_walk_in_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.evening_walk_in_lift_projected_pct}% evening walk-in (target)</span>
                          )}
                          {alert.perceived_quality_lift_projected_pct != null && alert.perceived_quality_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pct}% quality (target)</span>
                          )}
                          {alert.instagram_lift_projected_pct != null && alert.instagram_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.instagram_lift_projected_pct}% Instagram (target)</span>
                          )}
                          {alert.slip_fall_reduction_projected_pct != null && alert.slip_fall_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.slip_fall_reduction_projected_pct}% slip/fall (target)</span>
                          )}
                          {alert.security_incident_reduction_projected_pct != null && alert.security_incident_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.security_incident_reduction_projected_pct}% security incidents (target)</span>
                          )}
                          {alert.seasonal_revenue_lift_projected_pct != null && alert.seasonal_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.seasonal_revenue_lift_projected_pct}% Dec revenue (target)</span>
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
                            <FontAwesomeIcon icon={faLightbulb} className="mt-0.5 shrink-0" />
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
          <span>Pathway lights: <span className={config.requirePathwayLights ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePathwayLights ? 'required' : 'optional'}</span></span>
          <span>Facade lighting: <span className={config.requireFacadeLighting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFacadeLighting ? 'required' : 'optional'}</span></span>
          <span>Parking lot lighting: <span className={config.requireParkingLotLighting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireParkingLotLighting ? 'required' : 'optional'}</span></span>
          <span>Decorative string lights: <span className={config.requireDecorativeStringLights ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDecorativeStringLights ? 'required' : 'optional'}</span></span>
          <span>Tree uplighting: <span className={config.requireTreeUplighting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTreeUplighting ? 'required' : 'optional'}</span></span>
          <span>Signage illumination: <span className={config.requireSignageIllumination ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSignageIllumination ? 'required' : 'optional'}</span></span>
          <span>Seasonal lighting: <span className={config.requireSeasonalLighting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSeasonalLighting ? 'required' : 'optional'}</span></span>
          <span>Security lighting: <span className={config.requireSecurityLighting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSecurityLighting ? 'required' : 'optional'}</span></span>
          <span>Min lighting features: {config.minLightingFeatures}</span>
          <span>Min pathway lux: {config.minPathwayLux}</span>
          <span>Min facade lux: {config.minFacadeLux}</span>
          <span>Min parking lot lux: {config.minParkingLotLux}</span>
          <span>Min signage lux: {config.minSignageLux}</span>
          <span>Min uniformity: {config.minLightingUniformity}/100</span>
          <span>Max glare: {config.maxGlareIndex}</span>
          <span>Min LED pct: {config.minLedPct}%</span>
          <span>Min quality lift: {config.minPerceivedQualityLiftPct}%</span>
          <span>Min walk-in lift: {config.minEveningWalkInLiftPct}%</span>
          <span className="text-neutral-400">185th POSR-exclusive differentiator</span>
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

export default OutdoorLandscapeLightingScreen;
