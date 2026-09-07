/**
 * AI Takeout Packaging & To-Go Container Optimizer — predicts how takeout
 * packaging and to-go containers (container material, size accuracy, leak
 * prevention, eco-friendly options, branded packaging, temperature
 * retention, compartment design, utensil inclusion, bag quality,
 * label/clarity) impacts takeout revenue, customer satisfaction, repeat
 * orders, brand awareness, and food quality perception.
 *
 * 194th POSR-exclusive differentiator.
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
  faBagShopping, faBox, faUtensils, faRecycle, faLeaf, faTag, faTemperatureHigh,
  faDroplet,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runTakeoutPackagingContainerEngine, getActiveTakeoutPackagingContainerAlerts, getTakeoutPackagingContainerSummary,
  updateTakeoutPackagingContainerAlertStatus, readTakeoutPackagingContainerConfig, DEFAULT_TAKEOUT_PACKAGING_CONTAINER_CONFIG,
  type TakeoutPackagingContainerAlert,
} from "@/lib/takeout-packaging-container.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  packaging_unbranded:              { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faBagShopping,      label: 'PACKAGING UNBRANDED' },
  container_leak_risk:              { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faDroplet,          label: 'LEAK RISK' },
  eco_friendly_absent:              { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faLeaf,             label: 'NO ECO OPTIONS' },
  temperature_retention_poor:       { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faTemperatureHigh,  label: 'POOR TEMP RETENTION' },
  container_size_mismatch:          { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faBox,              label: 'SIZE MISMATCH' },
  utensil_inclusion_inconsistent:   { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faUtensils,         label: 'UTENSILS INCONSISTENT' },
  labeling_unclear:                 { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faTag,              label: 'LABELING UNCLEAR' },
  packaging_premium_gap:            { bg: 'bg-red-50',      text: 'text-red-700',      icon: faRecycle,          label: 'PREMIUM GAP' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function TakeoutPackagingContainerScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<TakeoutPackagingContainerAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, packagingUnbrandedCount: 0, containerLeakRiskCount: 0, ecoFriendlyAbsentCount: 0, temperatureRetentionPoorCount: 0, containerSizeMismatchCount: 0, utensilInclusionInconsistentCount: 0, labelingUnclearCount: 0, packagingPremiumGapCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_TAKEOUT_PACKAGING_CONTAINER_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readTakeoutPackagingContainerConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveTakeoutPackagingContainerAlerts(db), getTakeoutPackagingContainerSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[takeout-packaging-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runTakeoutPackagingContainerEngine(db, config);
      toast.success(`Analyzed ${result.generated} takeout packaging signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[takeout-packaging-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateTakeoutPackagingContainerAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[takeout-packaging-report] status failed', err);
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
      <DocumentTitle parts={["AI Takeout Packaging & To-Go Container Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faBagShopping} className="text-amber-500" />
              AI Takeout Packaging &amp; To-Go Container Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how takeout packaging and to-go containers (container material, size accuracy, leak prevention, eco-friendly options, branded packaging, temperature retention, compartment design, utensil inclusion, bag quality, label/clarity) impacts takeout revenue, satisfaction, repeat orders, brand awareness, food quality perception — 60% of restaurant traffic is now off-premise (NRA 2024); packaging is the primary brand touchpoint; branded packaging increases brand recall 45% (8-12 viewers per container); leak-proof containers increase repeat orders 25-30%; eco-friendly attracts 35% millennials at 10-15% premium; thermal bags reduce cold-food complaints 60%; right-sized containers save $200-600/mo; 40% frustrated by forgotten utensils; clear labeling reduces wrong-order complaints 50%; premium packaging lifts perceived value 20-25%
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faBagShopping} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze packaging'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faBagShopping} label="Packaging unbranded" value={String(summary.packagingUnbrandedCount)} color={summary.packagingUnbrandedCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faDroplet} label="Leak risk" value={String(summary.containerLeakRiskCount)} color={summary.containerLeakRiskCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLeaf} label="No eco options" value={String(summary.ecoFriendlyAbsentCount)} color={summary.ecoFriendlyAbsentCount > 0 ? 'text-emerald-600' : 'text-emerald-600'} />
          <SummaryCard icon={faTemperatureHigh} label="Poor temp retention" value={String(summary.temperatureRetentionPoorCount)} color={summary.temperatureRetentionPoorCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faBagShopping} spin className="text-4xl mb-3" />
            <p>Analyzing takeout packaging &amp; to-go container opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No takeout packaging alerts</p>
            <p className="text-sm mt-1">Healthy takeout packaging: branded containers (70%+ branded, 45% brand recall lift); leak-proof containers with click-lock lids (25-30% repeat order lift); eco-friendly compostable options (35% millennial preference, 10-15% premium); thermal bags for hot food (60% cold complaint reduction); right-sized containers ($200-600/mo savings); ask-if-needed utensil policy (40% frustration reduction); clear labels with dish/modifications/allergens (50% wrong-order reduction); premium rigid packaging for fine dining (20-25% perceived value lift); 60% of traffic is off-premise (NRA 2024); each container is a mini billboard seen by 8-12 people during transport.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faBagShopping, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'catering' ? 'text-fuchsia-600' : alert.channel === 'delivery' ? 'text-amber-600' : alert.channel === 'takeout' ? 'text-cyan-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_branded_packaging != null && (
                            <span className={`text-xs ${alert.has_branded_packaging ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_branded_packaging ? 'branded' : 'NO brand'}</span>
                          )}
                          {alert.branded_packaging_pct != null && alert.branded_packaging_pct > 0 && (
                            <span className={`text-xs ${alert.branded_packaging_pct < 40 ? 'text-rose-600 font-medium' : alert.branded_packaging_pct < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.branded_packaging_pct}% branded</span>
                          )}
                          {alert.container_material && (
                            <span className={`text-xs font-medium ${alert.container_material === 'compostable' || alert.container_material === 'bioplastic' ? 'text-emerald-600' : alert.container_material === 'paper' || alert.container_material === 'aluminum' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.container_material}</span>
                          )}
                          {alert.container_leak_proof != null && (
                            <span className={`text-xs ${alert.container_leak_proof ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.container_leak_proof ? 'leak-proof' : 'NOT leak-proof'}</span>
                          )}
                          {alert.container_rigidity && (
                            <span className={`text-xs font-medium ${alert.container_rigidity === 'premium' || alert.container_rigidity === 'rigid' ? 'text-emerald-600' : alert.container_rigidity === 'standard' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.container_rigidity}</span>
                          )}
                          {alert.has_eco_friendly_options != null && (
                            <span className={`text-xs ${alert.has_eco_friendly_options ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_eco_friendly_options ? 'eco yes' : 'NO eco'}</span>
                          )}
                          {alert.compostable_pct != null && alert.compostable_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.compostable_pct}% compostable</span>
                          )}
                          {alert.has_thermal_bags != null && (
                            <span className={`text-xs ${alert.has_thermal_bags ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_thermal_bags ? 'thermal yes' : 'NO thermal'}</span>
                          )}
                          {alert.thermal_bag_count != null && alert.thermal_bag_count > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.thermal_bag_count} bags</span>
                          )}
                          {alert.food_hot_minutes_actual != null && alert.food_hot_minutes_actual > 0 && (
                            <span className={`text-xs ${alert.food_hot_minutes_actual < 30 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.food_hot_minutes_actual}min hot</span>
                          )}
                          {alert.container_size_match_pct != null && alert.container_size_match_pct > 0 && (
                            <span className={`text-xs ${alert.container_size_match_pct < 85 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.container_size_match_pct}% size match</span>
                          )}
                          {alert.container_size_oversized_pct != null && alert.container_size_oversized_pct > 0 && (
                            <span className="text-xs text-amber-600 font-medium">{alert.container_size_oversized_pct}% oversized</span>
                          )}
                          {alert.container_size_undersized_pct != null && alert.container_size_undersized_pct > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.container_size_undersized_pct}% undersized</span>
                          )}
                          {alert.utensil_policy && (
                            <span className={`text-xs font-medium ${alert.utensil_policy === 'ask_if_needed' ? 'text-emerald-600' : alert.utensil_policy === 'auto_include' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.utensil_policy}</span>
                          )}
                          {alert.utensils_forgotten_pct != null && alert.utensils_forgotten_pct > 0 && (
                            <span className={`text-xs ${alert.utensils_forgotten_pct > 5 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.utensils_forgotten_pct}% forgotten</span>
                          )}
                          {alert.utensils_unnecessary_pct != null && alert.utensils_unnecessary_pct > 0 && (
                            <span className="text-xs text-amber-600 font-medium">{alert.utensils_unnecessary_pct}% wasted</span>
                          )}
                          {alert.has_clear_labels != null && (
                            <span className={`text-xs ${alert.has_clear_labels ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_clear_labels ? 'labels yes' : 'NO labels'}</span>
                          )}
                          {alert.label_includes_allergens != null && (
                            <span className={`text-xs ${alert.label_includes_allergens ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.label_includes_allergens ? 'allergens yes' : 'NO allergens'}</span>
                          )}
                          {alert.bag_quality && (
                            <span className={`text-xs font-medium ${alert.bag_quality === 'premium_paper' || alert.bag_quality === 'reusable' ? 'text-emerald-600' : alert.bag_quality === 'paper' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.bag_quality}</span>
                          )}
                          {alert.premium_gap_score != null && alert.premium_gap_score > 0 && (
                            <span className={`text-xs ${alert.premium_gap_score > 50 ? 'text-rose-600 font-medium' : alert.premium_gap_score > 25 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>gap {alert.premium_gap_score}/100</span>
                          )}
                          {alert.takeout_revenue_share_pct != null && alert.takeout_revenue_share_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.takeout_revenue_share_pct}% takeout share</span>
                          )}
                          {alert.takeout_repeat_rate_pct != null && alert.takeout_repeat_rate_pct > 0 && (
                            <span className={`text-xs ${alert.takeout_repeat_rate_pct < 40 ? 'text-rose-600 font-medium' : alert.takeout_repeat_rate_pct < 55 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.takeout_repeat_rate_pct}% repeat</span>
                          )}
                          {alert.cold_food_complaints_per_100_orders != null && alert.cold_food_complaints_per_100_orders > 0 && (
                            <span className={`text-xs ${alert.cold_food_complaints_per_100_orders > 3 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.cold_food_complaints_per_100_orders}/100 cold</span>
                          )}
                          {alert.wrong_order_complaints_per_100_orders != null && alert.wrong_order_complaints_per_100_orders > 0 && (
                            <span className={`text-xs ${alert.wrong_order_complaints_per_100_orders > 2 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.wrong_order_complaints_per_100_orders}/100 wrong</span>
                          )}
                          {alert.leak_complaints_per_100_orders != null && alert.leak_complaints_per_100_orders > 0 && (
                            <span className={`text-xs ${alert.leak_complaints_per_100_orders > 4 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.leak_complaints_per_100_orders}/100 leaks</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 70 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 satisfaction</span>
                          )}
                          {alert.perceived_food_value_score != null && alert.perceived_food_value_score > 0 && (
                            <span className={`text-xs ${alert.perceived_food_value_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.perceived_food_value_score}/100 value</span>
                          )}
                          {alert.brand_recall_score != null && alert.brand_recall_score > 0 && (
                            <span className={`text-xs ${alert.brand_recall_score < 40 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.brand_recall_score}/100 recall</span>
                          )}
                          {alert.competitor_with_branded_packaging_pct != null && alert.competitor_with_branded_packaging_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_with_branded_packaging_pct}% competitors</span>
                          )}
                          {alert.takeout_monthly_revenue != null && alert.takeout_monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.takeout_monthly_revenue}/mo takeout</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.takeout_revenue_lift_projected_pct != null && alert.takeout_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.takeout_revenue_lift_projected_pct}% takeout revenue (target)</span>
                          )}
                          {alert.repeat_order_lift_projected_pct != null && alert.repeat_order_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.repeat_order_lift_projected_pct}% repeat orders (target)</span>
                          )}
                          {alert.perceived_value_lift_projected_pts != null && alert.perceived_value_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_value_lift_projected_pts}pts perceived value (target)</span>
                          )}
                          {alert.brand_recall_lift_projected_pts != null && alert.brand_recall_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.brand_recall_lift_projected_pts}pts brand recall (target)</span>
                          )}
                          {alert.cold_food_complaint_reduction_projected_pct != null && alert.cold_food_complaint_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.cold_food_complaint_reduction_projected_pct}% cold complaints (target)</span>
                          )}
                          {alert.wrong_order_complaint_reduction_projected_pct != null && alert.wrong_order_complaint_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.wrong_order_complaint_reduction_projected_pct}% wrong orders (target)</span>
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
                            <FontAwesomeIcon icon={faBagShopping} className="mt-0.5 shrink-0" />
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
          <span>Branded packaging: <span className={config.requireBrandedPackaging ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBrandedPackaging ? 'required' : 'optional'}</span></span>
          <span>Leak-proof: <span className={config.requireLeakProof ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireLeakProof ? 'required' : 'optional'}</span></span>
          <span>Eco-friendly: <span className={config.requireEcoFriendlyOptions ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireEcoFriendlyOptions ? 'required' : 'optional'}</span></span>
          <span>Thermal bags: <span className={config.requireThermalBags ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireThermalBags ? 'required' : 'optional'}</span></span>
          <span>Right-sized: <span className={config.requireRightSizedContainers ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRightSizedContainers ? 'required' : 'optional'}</span></span>
          <span>Smart utensils: <span className={config.requireSmartUtensilPolicy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSmartUtensilPolicy ? 'required' : 'optional'}</span></span>
          <span>Clear labels: <span className={config.requireClearLabels ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireClearLabels ? 'required' : 'optional'}</span></span>
          <span>Premium (fine dining): <span className={config.requirePremiumPackagingForFineDining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePremiumPackagingForFineDining ? 'required' : 'optional'}</span></span>
          <span>Min branded %: {config.minBrandedPackagingPct}</span>
          <span>Min compostable %: {config.minCompostablePct}</span>
          <span>Min size match %: {config.minContainerSizeMatchPct}</span>
          <span>Min food hot (min): {config.minFoodHotMinutes}</span>
          <span>Max utensils forgotten %: {config.maxUtensilsForgottenPct}</span>
          <span>Max cold complaints/100: {config.maxColdFoodComplaintsPer100}</span>
          <span>Max wrong-order/100: {config.maxWrongOrderComplaintsPer100}</span>
          <span>Prefer ask-if-needed: <span className={config.preferAskIfNeededUtensils ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.preferAskIfNeededUtensils ? 'yes' : 'no'}</span></span>
          <span className="text-neutral-400">194th POSR-exclusive differentiator</span>
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

export default TakeoutPackagingContainerScreen;
