/**
 * AI 3D Food Printing & Customized Cuisine Optimizer — predicts how
 * 3D food printing technology (personalized nutrition printing, customized
 * shape/texture, dietary restriction printing, multi-ingredient extrusion,
 * precision portion control, novel food creation, aesthetic plating
 * automation, ingredient efficiency, customer co-creation, premium
 * pricing, ROI tracking) impacts menu differentiation, food cost
 * reduction, customer personalization, dietary compliance, premium pricing.
 * 214th POSR-exclusive differentiator.
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
  faCube, faPrint, faFlask, faGears, faShapes,
  faUtensils, faMicrochip, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runFood3dPrintingEngine, getActiveFood3dPrintingAlerts, getFood3dPrintingSummary,
  updateFood3dPrintingAlertStatus, readFood3dPrintingConfig, DEFAULT_FOOD_3D_PRINTING_CONFIG,
  type Food3dPrintingAlert,
} from "@/lib/3d-food-printing-customized-cuisine.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  food_3d_printing_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faCube,          label: 'NO DATA MONETIZATION' },
  personalized_nutrition_printing_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faPrint,              label: 'NO API PROGRAM' },
  dietary_restriction_printing_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faFlask,      label: 'NO LICENSING' },
  novel_food_creation_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faGears,         label: 'THIN PARTNER ECOSYS' },
  precision_portion_control_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faShapes,       label: 'NO BENCHMARKING' },
  automated_plating_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faUtensils,             label: 'NO PREDICTIVE API' },
  customer_co_creation_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faMicrochip,      label: 'WEAK PRIVACY' },
  food_3d_printing_roi_tracking_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function Food3dPrintingCustomizedCuisineScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<Food3dPrintingAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, food3dPrintingStrategyAbsentCount: 0, personalizedNutritionPrintingAbsentCount: 0, dietaryRestrictionPrintingAbsentCount: 0, novelFoodCreationAbsentCount: 0, precisionPortionControlAbsentCount: 0, automatedPlatingAbsentCount: 0, customerCoCreationAbsentCount: 0, food3dPrintingRoiTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_FOOD_3D_PRINTING_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readFood3dPrintingConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveFood3dPrintingAlerts(db), getFood3dPrintingSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runFood3dPrintingEngine(db, config);
      toast.success(`Analyzed ${result.generated} 3D food printing signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateFood3dPrintingAlertStatus(db, alertId, status);
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
      <DocumentTitle parts={["AI 3D Food Printingization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faCube} className="text-violet-600" />
              AI 3D Food Printingization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how 3D food printing (personalized nutrition, dietary restriction, novel shapes, precision portioning, automated plating, customer co-creation) impacts premium pricing, waste reduction, differentiation, social media — 3D food printing market $5B+ by 2030; 30-50% premium pricing; 65% would try 3D printed food (Mintel); 20-30% waste reduction; $500-2,000/mo social media; 40% fine dining plan by 2028; ROI $4-12 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faCube} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze 3D food printing'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faCube} label="No data monetization strategy" value={String(summary.food3dPrintingStrategyAbsentCount)} color={summary.food3dPrintingStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faPrint} label="No API / no licensing" value={String(summary.personalizedNutritionPrintingAbsentCount + summary.dietaryRestrictionPrintingAbsentCount)} color={(summary.personalizedNutritionPrintingAbsentCount + summary.dietaryRestrictionPrintingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faGears} label="Thin partners / no benchmarking / no predictive" value={String(summary.novelFoodCreationAbsentCount + summary.precisionPortionControlAbsentCount + summary.automatedPlatingAbsentCount)} color={(summary.novelFoodCreationAbsentCount + summary.precisionPortionControlAbsentCount + summary.automatedPlatingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faMicrochip} label="Weak privacy / no valuation" value={String(summary.customerCoCreationAbsentCount + summary.food3dPrintingRoiTrackingAbsentCount)} color={(summary.customerCoCreationAbsentCount + summary.food3dPrintingRoiTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faCube} spin className="text-4xl mb-3" />
            <p>Analyzing 3D food printing &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy 3D food printing environment: active 3D printing strategy (Foodini/byFlow/ChefJet, 1+ printers); personalized nutrition printing (exact macros, $5-15 premium); dietary restriction printing (allergen-free, GF, vegan, 3+ dishes); novel food creation (2+ novel dishes, $500-2,000/mo social media); precision portion control (20-30% waste reduction); automated plating (30%+ automation, 60s/dish, 90+ consistency); customer co-creation (10%+ participation, viral social media); ROI tracking (ROAS 3x+); 3D food printing market $5B+ by 2030; 30-50% premium pricing; 65% would try (Mintel); 20-30% waste reduction; ROI $4-12 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faCube, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_food_3d_printing_strategy != null && (
                            <span className={`text-xs ${alert.has_food_3d_printing_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_food_3d_printing_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.novel_dish_revenue_monthly != null && alert.novel_dish_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.novel_dish_revenue_monthly)}/mo data rev ({alert.food_waste_reduction_pct ?? 0}%)</span>
                          )}
                          {alert.plating_automation_pct != null && alert.plating_automation_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.plating_automation_pct)}/mo API</span>
                          )}
                          {alert.ingredient_efficiency_score != null && alert.ingredient_efficiency_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.ingredient_efficiency_score)}/mo licensing</span>
                          )}
                          {alert.customer_satisfaction_3d_score != null && alert.customer_satisfaction_3d_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.customer_satisfaction_3d_score)}/mo partner</span>
                          )}
                          {alert.competitor_3d_printing_score != null && alert.competitor_3d_printing_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_3d_printing_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.roi_lift_projected_pct != null && alert.roi_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.roi_lift_projected_pct}% data revenue growth (target)</span>
                          )}
                          {alert.premium_pricing_projected_pct != null && alert.premium_pricing_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.premium_pricing_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.social_media_value_projected != null && alert.social_media_value_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.social_media_value_projected)}/mo licensing (target)</span>
                          )}
                          {alert.differentiation_lift_projected_pts != null && alert.differentiation_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.differentiation_lift_projected_pts)}/mo partner (target)</span>
                          )}
                          {alert.waste_reduction_projected_pct != null && alert.waste_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.waste_reduction_projected_pct}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faCube} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireFood3dPrintingStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFood3dPrintingStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requirePersonalizedNutritionPrinting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePersonalizedNutritionPrinting ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireDietaryRestrictionPrinting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDietaryRestrictionPrinting ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireNovelFoodCreation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNovelFoodCreation ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requirePrecisionPortionControl ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePrecisionPortionControl ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireAutomatedPlating ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAutomatedPlating ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireCustomerCoCreation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCustomerCoCreation ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireFood3dPrintingRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFood3dPrintingRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minPrinterCount}</span>
          <span>Min API calls: {config.minPersonalizedNutritionTargetPct}/mo</span>
          <span>Min partners: {config.minDietaryRestrictionDishesCount}</span>
          <span>Min privacy: {config.minNovelDishesCount}</span>
          <span>Min anonymization: {config.minFoodWasteReductionPct}</span>
          <span className="text-neutral-400">214th POSR-exclusive differentiator</span>
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

export default Food3dPrintingCustomizedCuisineScreen;
