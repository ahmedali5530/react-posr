/**
 * AI On-Site Farm & Hyperlocal Agriculture Optimizer — predicts how
 * on-site farming and hyperlocal agriculture (hydroponic systems, vertical
 * farming, rooftop gardens, microgreen cultivation, herb walls,
 * aquaponics, composting, farm-to-table traceability, LED grow
 * optimization) impacts food cost reduction, ingredient freshness,
 * menu differentiation, sustainability marketing, premium pricing.
 *
 * 212th POSR-exclusive differentiator.
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
  faSeedling, faDroplet, faSun, faRecycle, faLeaf,
  faTree, faWrench, faCircleCheck,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runOnSiteFarmEngine, getActiveOnSiteFarmAlerts, getOnSiteFarmSummary,
  updateOnSiteFarmAlertStatus, readOnSiteFarmConfig, DEFAULT_ON_SITE_FARM_CONFIG,
  type OnSiteFarmAlert,
} from "@/lib/on-site-farm-hyperlocal-agriculture.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  on_site_farm_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faSeedling,          label: 'NO DATA MONETIZATION' },
  hydroponic_vertical_farming_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faDroplet,              label: 'NO API PROGRAM' },
  microgreen_herb_cultivation_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faSun,      label: 'NO LICENSING' },
  rooftop_garden_utilization_low:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faRecycle,         label: 'THIN PARTNER ECOSYS' },
  aquaponics_system_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faLeaf,       label: 'NO BENCHMARKING' },
  composting_waste_recycling_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faTree,             label: 'NO PREDICTIVE API' },
  farm_to_table_traceability_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faWrench,      label: 'WEAK PRIVACY' },
  led_grow_optimization_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCircleCheck,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function OnSiteFarmHyperlocalAgricultureScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<OnSiteFarmAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, onSiteFarmStrategyAbsentCount: 0, hydroponicVerticalFarmingAbsentCount: 0, microgreenHerbCultivationAbsentCount: 0, rooftopGardenUtilizationLowCount: 0, aquaponicsSystemAbsentCount: 0, compostingWasteRecyclingAbsentCount: 0, farmToTableTraceabilityAbsentCount: 0, ledGrowOptimizationAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_ON_SITE_FARM_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readOnSiteFarmConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveOnSiteFarmAlerts(db), getOnSiteFarmSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runOnSiteFarmEngine(db, config);
      toast.success(`Analyzed ${result.generated} on-site farm signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateOnSiteFarmAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] status failed', err);
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
      <DocumentTitle parts={["AI On-Site Farmization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faSeedling} className="text-violet-600" />
              AI On-Site Farmization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how on-site farming and hyperlocal agriculture (hydroponics, vertical farming, microgreens, herbs, rooftop garden, aquaponics, composting, farm-to-table traceability, LED grow optimization) impacts food cost reduction, ingredient freshness, menu differentiation, sustainability marketing, premium pricing — on-site farm market growing 30%+ YoY; hydroponics yield 10-20x per sqft (USDA); vertical farming 90% less water; microgreens $50-200/lb (7-14 day harvest); on-site herbs save $200-800/mo; rooftop gardens 500-2,000 lbs/yr per 1,000 sqft; aquaponics dual revenue $5k-20k/mo; composting saves $200-600/mo waste; farm-to-table traceability 78% value (IFMA); 45% pay 10-20% more for hyperlocal (Nielsen); on-site farm ROI $3-10 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faSeedling} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze on-site farm'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faSeedling} label="No data monetization strategy" value={String(summary.onSiteFarmStrategyAbsentCount)} color={summary.onSiteFarmStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faDroplet} label="No API / no licensing" value={String(summary.hydroponicVerticalFarmingAbsentCount + summary.microgreenHerbCultivationAbsentCount)} color={(summary.hydroponicVerticalFarmingAbsentCount + summary.microgreenHerbCultivationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faRecycle} label="Thin partners / no benchmarking / no predictive" value={String(summary.rooftopGardenUtilizationLowCount + summary.aquaponicsSystemAbsentCount + summary.compostingWasteRecyclingAbsentCount)} color={(summary.rooftopGardenUtilizationLowCount + summary.aquaponicsSystemAbsentCount + summary.compostingWasteRecyclingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faWrench} label="Weak privacy / no valuation" value={String(summary.farmToTableTraceabilityAbsentCount + summary.ledGrowOptimizationAbsentCount)} color={(summary.farmToTableTraceabilityAbsentCount + summary.ledGrowOptimizationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faSeedling} spin className="text-4xl mb-3" />
            <p>Analyzing on-site farm &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy on-site farm environment: active on-site farm strategy (200+ sqft); hydroponic/vertical farming (10-20x yield per sqft, 90% less water); microgreen/herb cultivation (10+ varieties, $200-800/mo savings); rooftop garden (500-2,000 lbs/yr per 1,000 sqft); aquaponics (dual revenue $5k-20k/mo fish + produce); composting ($200-600/mo waste savings, free fertilizer); farm-to-table traceability (QR codes, 78% customer value); LED grow optimization (year-round growing, 20-40% energy savings); on-site farm ROI $3-10 per $1; 15-30% premium for hyperlocal dishes (Cornell CHR); 68% prefer on-site gardens (NRA).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faSeedling, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_on_site_farm_strategy != null && (
                            <span className={`text-xs ${alert.has_on_site_farm_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_on_site_farm_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.farm_revenue_monthly != null && alert.farm_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.farm_revenue_monthly)}/mo data rev ({alert.food_cost_reduction_pct ?? 0}%)</span>
                          )}
                          {alert.hydroponic_yield_lbs_monthly != null && alert.hydroponic_yield_lbs_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.hydroponic_yield_lbs_monthly)}/mo API</span>
                          )}
                          {alert.microgreen_herb_savings_monthly != null && alert.microgreen_herb_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.microgreen_herb_savings_monthly)}/mo licensing</span>
                          )}
                          {alert.sustainability_marketing_score != null && alert.sustainability_marketing_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.sustainability_marketing_score)}/mo partner</span>
                          )}
                          {alert.competitor_on_site_farm_score != null && alert.competitor_on_site_farm_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_on_site_farm_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.freshness_lift_projected_pts != null && alert.freshness_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.freshness_lift_projected_pts}% data revenue growth (target)</span>
                          )}
                          {alert.food_cost_savings_projected_pct != null && alert.food_cost_savings_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.food_cost_savings_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.yield_lift_projected_pct != null && alert.yield_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.yield_lift_projected_pct)}/mo licensing (target)</span>
                          )}
                          {alert.premium_pricing_projected_pct != null && alert.premium_pricing_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.premium_pricing_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.sustainability_lift_projected_pts != null && alert.sustainability_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">-{alert.sustainability_lift_projected_pts}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faSeedling} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireOnSiteFarmStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOnSiteFarmStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requireHydroponicVerticalFarming ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireHydroponicVerticalFarming ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireMicrogreenHerbCultivation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMicrogreenHerbCultivation ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireRooftopGarden ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRooftopGarden ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireAquaponicsSystem ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAquaponicsSystem ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireCompostingWasteRecycling ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCompostingWasteRecycling ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireFarmToTableTraceability ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFarmToTableTraceability ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireLedGrowOptimization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireLedGrowOptimization ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minFarmSqft}</span>
          <span>Min API calls: {config.minHydroponicYieldLbsMonthly}/mo</span>
          <span>Min partners: {config.minMicrogreenHerbSavingsMonthly}</span>
          <span>Min privacy: {config.minRooftopGardenYieldLbsYearly}</span>
          <span>Min anonymization: {config.minCompostingVolumeLbsMonthly}</span>
          <span className="text-neutral-400">212th POSR-exclusive differentiator</span>
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

export default OnSiteFarmHyperlocalAgricultureScreen;
