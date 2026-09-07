/**
 * AI Self-Serve Water Station & Beverage Bar Optimizer — predicts how
 * self-serve water stations and beverage bars (infused water, self-serve
 * tea/coffee, soda dispensers, water bottle stations, flavored water,
 * cup/drinkware quality, station placement, cleanliness, refill efficiency)
 * impacts customer satisfaction, perceived restaurant quality, water/beverage
 * revenue, and operational efficiency.
 *
 * 186th POSR-exclusive differentiator.
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
  faDroplet, faRotate, faFaucet, faMugHot, faGlassWater,
  faBottleWater, faSeedling, faSoap, faClock,
  faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runWaterStationEngine, getActiveWaterStationAlerts, getWaterStationSummary,
  updateWaterStationAlertStatus, readWaterStationConfig, DEFAULT_WATER_STATION_CONFIG,
  type WaterStationAlert,
} from "@/lib/water-station-beverage-bar.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  self_serve_water_absent:        { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faFaucet,      label: 'NO SELF-SERVE WATER' },
  infused_water_absent:           { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faSeedling,    label: 'NO INFUSED WATER' },
  station_placement_poor:         { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faDroplet,     label: 'POOR PLACEMENT' },
  station_cleanliness_poor:       { bg: 'bg-red-50',      text: 'text-red-700',      icon: faSoap,        label: 'POOR CLEANLINESS' },
  drinkware_quality_low:          { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faGlassWater,  label: 'LOW DRINKWARE' },
  coffee_tea_station_absent:      { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faMugHot,      label: 'NO COFFEE/TEA' },
  flavored_sparkling_absent:      { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faBottleWater, label: 'NO FLAVORED/SPARKLING' },
  station_refill_efficiency_poor: { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faClock,       label: 'REFILL EFFICIENCY' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function WaterStationBeverageBarScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<WaterStationAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noSelfServeCount: 0, noCoffeeTeaCount: 0, noFlavoredCount: 0, poorCleanlinessCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_WATER_STATION_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readWaterStationConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveWaterStationAlerts(db), getWaterStationSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[water-station-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runWaterStationEngine(db, config);
      toast.success(`Analyzed ${result.generated} water station & beverage bar signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[water-station-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateWaterStationAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[water-station-report] status failed', err);
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
      <DocumentTitle parts={["AI Self-Serve Water Station & Beverage Bar Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faDroplet} className="text-sky-500" />
              AI Self-Serve Water Station &amp; Beverage Bar Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how self-serve water stations (infused water, coffee/tea, soda, flavored, drinkware, placement, cleanliness, refill) impacts satisfaction + quality perception + beverage revenue + server efficiency — 82% prefer self-serve water (NRA); infused water 20-25% quality (Cornell CHR); self-serve reduces server workload 15-20%; premium drinkware 30% perception; coffee/tea station 18-22% dessert attachment; flavored water 25-35% beverage revenue; cleanliness is #1 perceived hygiene signal
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faDroplet} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze station'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faFaucet} label="No self-serve water" value={String(summary.noSelfServeCount)} color={summary.noSelfServeCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faSoap} label="Poor cleanliness" value={String(summary.poorCleanlinessCount)} color={summary.poorCleanlinessCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
          <SummaryCard icon={faMugHot} label="No coffee/tea" value={String(summary.noCoffeeTeaCount)} color={summary.noCoffeeTeaCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBottleWater} label="No flavored" value={String(summary.noFlavoredCount)} color={summary.noFlavoredCount > 0 ? 'text-emerald-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faDroplet} spin className="text-4xl mb-3" />
            <p>Analyzing self-serve water station &amp; beverage bar opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No water station alerts</p>
            <p className="text-sm mt-1">Self-serve water station near entrance (10-30 ft) with infused water (citrus/cucumber/mint rotating daily), self-serve coffee/tea station (regular + decaf + 2 tea options), flavored + sparkling water options, glass/ceramic premium drinkware, cleanliness 85+ with hourly cleaning, refill frequency 2+/hr during peak, 0-2 empty incidents per week.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faDroplet, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_self_serve_water != null && (
                            <span className={`text-xs ${alert.has_self_serve_water ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_self_serve_water ? 'self-serve yes' : 'NO self-serve'}</span>
                          )}
                          {alert.has_infused_water != null && (
                            <span className={`text-xs ${alert.has_infused_water ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_infused_water ? 'infused yes' : 'NO infused'}</span>
                          )}
                          {alert.has_coffee_tea_station != null && (
                            <span className={`text-xs ${alert.has_coffee_tea_station ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_coffee_tea_station ? 'coffee/tea yes' : 'NO coffee/tea'}</span>
                          )}
                          {alert.has_flavored_water != null && (
                            <span className={`text-xs ${alert.has_flavored_water ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.has_flavored_water ? 'flavored yes' : 'NO flavored'}</span>
                          )}
                          {alert.has_sparkling_water != null && (
                            <span className={`text-xs ${alert.has_sparkling_water ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.has_sparkling_water ? 'sparkling yes' : 'NO sparkling'}</span>
                          )}
                          {alert.has_premium_drinkware != null && (
                            <span className={`text-xs ${alert.has_premium_drinkware ? 'text-emerald-600 font-medium' : 'text-violet-600 font-medium'}`}>{alert.has_premium_drinkware ? 'glass yes' : 'paper cups'}</span>
                          )}
                          {alert.station_features_count != null && alert.station_features_count > 0 && (
                            <span className={`text-xs ${alert.station_features_count < 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.station_features_count} features</span>
                          )}
                          {alert.station_placement && alert.station_placement !== 'none' && (
                            <span className={`text-xs ${alert.station_placement === 'entrance' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.station_placement} placement</span>
                          )}
                          {alert.station_distance_from_entrance_ft != null && alert.station_distance_from_entrance_ft < 999 && (
                            <span className={`text-xs ${alert.station_distance_from_entrance_ft > 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.station_distance_from_entrance_ft} ft from entrance</span>
                          )}
                          {alert.station_cleanliness_score != null && alert.station_cleanliness_score > 0 && (
                            <span className={`text-xs ${alert.station_cleanliness_score < 85 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.station_cleanliness_score}/100 clean</span>
                          )}
                          {alert.station_refill_frequency_hr != null && alert.station_refill_frequency_hr > 0 && (
                            <span className={`text-xs ${alert.station_refill_frequency_hr < 2 ? 'text-fuchsia-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.station_refill_frequency_hr}/hr refill</span>
                          )}
                          {alert.station_empty_incidents_week != null && alert.station_empty_incidents_week > 0 && (
                            <span className={`text-xs ${alert.station_empty_incidents_week > 2 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.station_empty_incidents_week} empty/wk</span>
                          )}
                          {alert.drinkware_type && alert.drinkware_type !== 'none' && (
                            <span className={`text-xs ${alert.drinkware_type === 'glass' || alert.drinkware_type === 'ceramic' ? 'text-emerald-600 font-medium' : 'text-violet-600 font-medium'}`}>{alert.drinkware_type}</span>
                          )}
                          {alert.drinkware_quality_score != null && alert.drinkware_quality_score > 0 && (
                            <span className={`text-xs ${alert.drinkware_quality_score < 80 ? 'text-violet-600 font-medium' : 'text-emerald-600 font-medium'}`}>drinkware {alert.drinkware_quality_score}/100</span>
                          )}
                          {alert.hygiene_failure_risk && alert.hygiene_failure_risk !== 'low' && (
                            <span className={`text-xs font-medium ${alert.hygiene_failure_risk === 'critical' ? 'text-rose-600' : alert.hygiene_failure_risk === 'high' ? 'text-red-600' : 'text-amber-600'}`}>hygiene risk {alert.hygiene_failure_risk}</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className="text-xs text-neutral-500">satisfaction {alert.customer_satisfaction_score}/100</span>
                          )}
                          {alert.customer_satisfaction_lift_pct != null && alert.customer_satisfaction_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.customer_satisfaction_lift_pct}% satisfaction</span>
                          )}
                          {alert.perceived_quality_score != null && alert.perceived_quality_score > 0 && (
                            <span className="text-xs text-neutral-500">quality {alert.perceived_quality_score}/100</span>
                          )}
                          {alert.perceived_quality_lift_pct != null && alert.perceived_quality_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.perceived_quality_lift_pct}% quality</span>
                          )}
                          {alert.server_refill_trips_shift != null && alert.server_refill_trips_shift > 0 && (
                            <span className={`text-xs ${alert.server_refill_trips_shift > 50 ? 'text-rose-600 font-medium' : 'text-neutral-500'}`}>{alert.server_refill_trips_shift} refill trips/shift</span>
                          )}
                          {alert.server_workload_reduction_pct != null && alert.server_workload_reduction_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">-{alert.server_workload_reduction_pct}% workload</span>
                          )}
                          {alert.dessert_attachment_rate_pct != null && alert.dessert_attachment_rate_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.dessert_attachment_rate_pct}% dessert attach</span>
                          )}
                          {alert.beverage_revenue_per_customer != null && alert.beverage_revenue_per_customer > 0 && (
                            <span className="text-xs text-neutral-500">${alert.beverage_revenue_per_customer}/cust bev</span>
                          )}
                          {alert.beverage_revenue_lift_pct != null && alert.beverage_revenue_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.beverage_revenue_lift_pct}% bev revenue</span>
                          )}
                          {alert.perceived_hygiene_score != null && alert.perceived_hygiene_score > 0 && (
                            <span className="text-xs text-neutral-500">hygiene {alert.perceived_hygiene_score}/100</span>
                          )}
                          {alert.station_usage_rate_pct != null && alert.station_usage_rate_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.station_usage_rate_pct}% station usage</span>
                          )}
                          {alert.competitors_with_quality_stations_pct != null && alert.competitors_with_quality_stations_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_quality_stations_pct}% competitors have station</span>
                          )}
                          {alert.station_aware_lost_customers != null && alert.station_aware_lost_customers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.station_aware_lost_customers} lost customers</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          {alert.station_hardware_cost != null && alert.station_hardware_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.station_hardware_cost} hardware</span>
                          )}
                          {alert.station_monthly_total_cost != null && alert.station_monthly_total_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.station_monthly_total_cost}/mo station cost</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.satisfaction_lift_projected_pct != null && alert.satisfaction_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pct}% satisfaction (target)</span>
                          )}
                          {alert.perceived_quality_lift_projected_pct != null && alert.perceived_quality_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pct}% quality (target)</span>
                          )}
                          {alert.server_workload_reduction_projected_pct != null && alert.server_workload_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.server_workload_reduction_projected_pct}% server workload (target)</span>
                          )}
                          {alert.dessert_attachment_lift_projected_pct != null && alert.dessert_attachment_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.dessert_attachment_lift_projected_pct}% dessert attach (target)</span>
                          )}
                          {alert.beverage_revenue_lift_projected_pct != null && alert.beverage_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.beverage_revenue_lift_projected_pct}% bev revenue (target)</span>
                          )}
                          {alert.station_usage_lift_projected_pct != null && alert.station_usage_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.station_usage_lift_projected_pct}% station usage (target)</span>
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
                            <FontAwesomeIcon icon={faDroplet} className="mt-0.5 shrink-0" />
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
          <span>Self-serve water: <span className={config.requireSelfServeWater ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSelfServeWater ? 'required' : 'optional'}</span></span>
          <span>Infused water: <span className={config.requireInfusedWater ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireInfusedWater ? 'required' : 'optional'}</span></span>
          <span>Entrance placement: <span className={config.requireEntrancePlacement ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireEntrancePlacement ? 'required' : 'optional'}</span></span>
          <span>Cleanliness: <span className={config.requireCleanliness ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCleanliness ? 'required' : 'optional'}</span></span>
          <span>Premium drinkware: <span className={config.requirePremiumDrinkware ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePremiumDrinkware ? 'required' : 'optional'}</span></span>
          <span>Coffee/tea station: <span className={config.requireCoffeeTeaStation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCoffeeTeaStation ? 'required' : 'optional'}</span></span>
          <span>Flavored/sparkling: <span className={config.requireFlavoredSparkling ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFlavoredSparkling ? 'required' : 'optional'}</span></span>
          <span>Refill efficiency: <span className={config.requireRefillEfficiency ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRefillEfficiency ? 'required' : 'optional'}</span></span>
          <span>Min station features: {config.minStationFeatures}</span>
          <span>Min cleanliness: {config.minCleanlinessScore}/100</span>
          <span>Max distance from entrance: {config.maxStationDistanceFt} ft</span>
          <span>Min refill frequency: {config.minRefillFrequencyHr}/hr</span>
          <span>Max empty incidents: {config.maxEmptyIncidentsWeek}/wk</span>
          <span>Min drinkware quality: {config.minDrinkwareQuality}/100</span>
          <span>Min satisfaction lift: {config.minSatisfactionLiftPct}%</span>
          <span>Min quality lift: {config.minPerceivedQualityLiftPct}%</span>
          <span>Min bev revenue lift: {config.minBeverageRevenueLiftPct}%</span>
          <span className="text-neutral-400">186th POSR-exclusive differentiator</span>
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

export default WaterStationBeverageBarScreen;
