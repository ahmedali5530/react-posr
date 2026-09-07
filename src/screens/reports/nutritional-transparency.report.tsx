/**
 * AI Nutritional Transparency & Menu Calorie Display Optimizer — predicts how
 * nutritional transparency (calorie counts on menu, allergen labels, dietary
 * labels like vegan/gluten-free/keto, nutritional information availability,
 * ingredient sourcing transparency, health score displays, macronutrient
 * breakdowns) impacts customer trust, order confidence, dietary compliance,
 * and revenue from health-conscious segments.
 *
 * 187th POSR-exclusive differentiator.
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
  faHeartPulse, faRotate, faFire, faLeaf, faSeedling,
  faTag, faCircleInfo, faClipboardList, faScaleBalanced,
  faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runNutritionalTransparencyEngine, getActiveNutritionalTransparencyAlerts, getNutritionalTransparencySummary,
  updateNutritionalTransparencyAlertStatus, readNutritionalTransparencyConfig, DEFAULT_NUTRITIONAL_TRANSPARENCY_CONFIG,
  type NutritionalTransparencyAlert,
} from "@/lib/nutritional-transparency.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  calorie_count_absent:                { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faFire,            label: 'NO CALORIE COUNTS' },
  allergen_labeling_insufficient:      { bg: 'bg-red-50',      text: 'text-red-700',      icon: faTriangleExclamation, label: 'ALLERGEN LABELS' },
  dietary_labels_missing:              { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faSeedling,        label: 'DIETARY LABELS' },
  nutritional_info_unavailable:        { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faCircleInfo,      label: 'NO NUTRITION INFO' },
  health_score_absent:                 { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faHeartPulse,      label: 'NO HEALTH SCORE' },
  ingredient_sourcing_not_transparent: { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faLeaf,            label: 'SOURCING OPAQUE' },
  macronutrient_breakdown_absent:      { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faScaleBalanced,   label: 'NO MACROS' },
  fda_compliance_risk:                 { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faClipboardList,   label: 'FDA COMPLIANCE' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function NutritionalTransparencyScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<NutritionalTransparencyAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noCalorieCount: 0, insufficientAllergenCount: 0, missingDietaryCount: 0, fdaRiskCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_NUTRITIONAL_TRANSPARENCY_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readNutritionalTransparencyConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveNutritionalTransparencyAlerts(db), getNutritionalTransparencySummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[nutritional-transparency-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runNutritionalTransparencyEngine(db, config);
      toast.success(`Analyzed ${result.generated} nutritional transparency signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[nutritional-transparency-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateNutritionalTransparencyAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[nutritional-transparency-report] status failed', err);
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
      <DocumentTitle parts={["AI Nutritional Transparency & Menu Calorie Display Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faHeartPulse} className="text-rose-500" />
              AI Nutritional Transparency &amp; Menu Calorie Display Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how nutritional transparency (calorie counts, allergen labels, dietary labels, full nutrition info, health scores, ingredient sourcing, macronutrient breakdowns, FDA compliance) impacts customer trust + order confidence + dietary compliance + revenue — FDA requires calorie labeling for 20+ chains (2018); 68% want nutritional info (IFIC); 45% millennials choose by dietary (NRA); allergen labels reduce reactions 80% (FDA); dietary labels attract $3,000-8,000/mo niche markets; health scores 35-40% transparency; ingredient sourcing 25-30% quality; macros attract 15% fitness segment
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faHeartPulse} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze transparency'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faFire} label="No calorie counts" value={String(summary.noCalorieCount)} color={summary.noCalorieCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faTriangleExclamation} label="Allergen labels weak" value={String(summary.insufficientAllergenCount)} color={summary.insufficientAllergenCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
          <SummaryCard icon={faSeedling} label="Dietary labels missing" value={String(summary.missingDietaryCount)} color={summary.missingDietaryCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faClipboardList} label="FDA compliance risk" value={String(summary.fdaRiskCount)} color={summary.fdaRiskCount > 0 ? 'text-fuchsia-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faHeartPulse} spin className="text-4xl mb-3" />
            <p>Analyzing nutritional transparency &amp; menu calorie display opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No nutritional transparency alerts</p>
            <p className="text-sm mt-1">Calorie counts on 95%+ of menu items; allergen labels for all 8 major allergens + sesame on 95%+ items; dietary labels (vegan, gluten-free, keto, vegetarian) on 40%+ items; full nutritional info available via QR code + website; health score (A-F grade) displayed next to item name; ingredient sourcing disclosed for top 10 items with farm name + location; macronutrient breakdown (protein/carbs/fat) on 50%+ items; FDA-compliant for chains 20+ locations.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faHeartPulse, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_calorie_counts != null && (
                            <span className={`text-xs ${alert.has_calorie_counts ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_calorie_counts ? 'calories yes' : 'NO calories'}</span>
                          )}
                          {alert.has_allergen_labels != null && (
                            <span className={`text-xs ${alert.has_allergen_labels ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}`}>{alert.has_allergen_labels ? 'allergens yes' : 'NO allergen labels'}</span>
                          )}
                          {alert.has_dietary_labels != null && (
                            <span className={`text-xs ${alert.has_dietary_labels ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_dietary_labels ? 'dietary yes' : 'NO dietary labels'}</span>
                          )}
                          {alert.has_full_nutritional_info != null && (
                            <span className={`text-xs ${alert.has_full_nutritional_info ? 'text-emerald-600 font-medium' : 'text-sky-600 font-medium'}`}>{alert.has_full_nutritional_info ? 'full info yes' : 'NO full info'}</span>
                          )}
                          {alert.has_health_score_display != null && (
                            <span className={`text-xs ${alert.has_health_score_display ? 'text-emerald-600 font-medium' : 'text-violet-600 font-medium'}`}>{alert.has_health_score_display ? 'health score yes' : 'NO health score'}</span>
                          )}
                          {alert.has_ingredient_sourcing != null && (
                            <span className={`text-xs ${alert.has_ingredient_sourcing ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.has_ingredient_sourcing ? 'sourcing yes' : 'NO sourcing'}</span>
                          )}
                          {alert.has_macronutrient_breakdown != null && (
                            <span className={`text-xs ${alert.has_macronutrient_breakdown ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_macronutrient_breakdown ? 'macros yes' : 'NO macros'}</span>
                          )}
                          {alert.has_qr_nutrition_link != null && (
                            <span className={`text-xs ${alert.has_qr_nutrition_link ? 'text-emerald-600 font-medium' : 'text-neutral-400'}`}>{alert.has_qr_nutrition_link ? 'QR yes' : 'no QR'}</span>
                          )}
                          {alert.transparency_features_count != null && alert.transparency_features_count > 0 && (
                            <span className={`text-xs ${alert.transparency_features_count < 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.transparency_features_count} features</span>
                          )}
                          {alert.menu_item_count != null && alert.menu_item_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.menu_item_count} menu items</span>
                          )}
                          {alert.calorie_coverage_pct != null && alert.calorie_coverage_pct > 0 && (
                            <span className={`text-xs ${alert.calorie_coverage_pct < 95 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.calorie_coverage_pct}% calorie coverage</span>
                          )}
                          {alert.allergen_coverage_pct != null && alert.allergen_coverage_pct > 0 && (
                            <span className={`text-xs ${alert.allergen_coverage_pct < 95 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.allergen_coverage_pct}% allergen coverage</span>
                          )}
                          {alert.allergen_label_completeness != null && alert.allergen_label_completeness > 0 && (
                            <span className={`text-xs ${alert.allergen_label_completeness < 90 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}`}>allergen completeness {alert.allergen_label_completeness}/100</span>
                          )}
                          {alert.allergen_incidents_year != null && alert.allergen_incidents_year > 0 && (
                            <span className="text-xs text-red-600 font-medium">{alert.allergen_incidents_year} allergen incidents/yr</span>
                          )}
                          {alert.allergen_liability_risk && alert.allergen_liability_risk !== 'low' && (
                            <span className={`text-xs font-medium ${alert.allergen_liability_risk === 'critical' ? 'text-rose-600' : alert.allergen_liability_risk === 'high' ? 'text-red-600' : 'text-amber-600'}`}>allergen risk {alert.allergen_liability_risk}</span>
                          )}
                          {alert.vegan_options_count != null && (
                            <span className={`text-xs ${alert.vegan_options_count === 0 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.vegan_options_count} vegan</span>
                          )}
                          {alert.gluten_free_options_count != null && (
                            <span className={`text-xs ${alert.gluten_free_options_count === 0 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.gluten_free_options_count} GF</span>
                          )}
                          {alert.keto_options_count != null && (
                            <span className={`text-xs ${alert.keto_options_count === 0 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.keto_options_count} keto</span>
                          )}
                          {alert.health_score_grade && alert.health_score_grade !== 'F' && (
                            <span className={`text-xs font-medium ${alert.health_score_grade === 'A' || alert.health_score_grade === 'B' ? 'text-emerald-600' : 'text-amber-600'}`}>grade {alert.health_score_grade}</span>
                          )}
                          {alert.health_score_value != null && alert.health_score_value > 0 && (
                            <span className={`text-xs ${alert.health_score_value < 75 ? 'text-violet-600 font-medium' : 'text-emerald-600 font-medium'}`}>health {alert.health_score_value}/100</span>
                          )}
                          {alert.sourcing_transparency_score != null && alert.sourcing_transparency_score > 0 && (
                            <span className={`text-xs ${alert.sourcing_transparency_score < 60 ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}`}>sourcing {alert.sourcing_transparency_score}/100</span>
                          )}
                          {alert.local_supplier_count != null && (
                            <span className="text-xs text-neutral-500">{alert.local_supplier_count} local suppliers</span>
                          )}
                          {alert.sourcing_disclosed_items_pct != null && alert.sourcing_disclosed_items_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.sourcing_disclosed_items_pct}% sourcing disclosed</span>
                          )}
                          {alert.customer_trust_score != null && alert.customer_trust_score > 0 && (
                            <span className="text-xs text-neutral-500">trust {alert.customer_trust_score}/100</span>
                          )}
                          {alert.customer_trust_lift_pct != null && alert.customer_trust_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.customer_trust_lift_pct}% trust</span>
                          )}
                          {alert.order_confidence_score != null && alert.order_confidence_score > 0 && (
                            <span className="text-xs text-neutral-500">confidence {alert.order_confidence_score}/100</span>
                          )}
                          {alert.return_visit_rate_pct != null && alert.return_visit_rate_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.return_visit_rate_pct}% return</span>
                          )}
                          {alert.return_visit_lift_pct != null && alert.return_visit_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.return_visit_lift_pct}% return</span>
                          )}
                          {alert.avg_ticket_change_pct != null && alert.avg_ticket_change_pct !== 0 && (
                            <span className={`text-xs ${alert.avg_ticket_change_pct < 0 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_ticket_change_pct}% ticket</span>
                          )}
                          {alert.dietary_compliance_rate_pct != null && alert.dietary_compliance_rate_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.dietary_compliance_rate_pct}% dietary compliance</span>
                          )}
                          {alert.dietary_segment_revenue != null && alert.dietary_segment_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.dietary_segment_revenue}/mo dietary rev</span>
                          )}
                          {alert.chain_location_count != null && alert.chain_location_count > 0 && (
                            <span className={`text-xs ${alert.chain_location_count >= 20 ? 'text-fuchsia-600 font-medium' : 'text-neutral-500'}`}>{alert.chain_location_count} locations</span>
                          )}
                          {alert.fda_compliance_status && alert.fda_compliance_status !== 'compliant' && (
                            <span className={`text-xs font-medium ${alert.fda_compliance_status === 'non_compliant' ? 'text-fuchsia-600' : 'text-amber-600'}`}>FDA {alert.fda_compliance_status}</span>
                          )}
                          {alert.fda_fine_risk_monthly != null && alert.fda_fine_risk_monthly > 0 && (
                            <span className="text-xs text-fuchsia-600 font-medium">${alert.fda_fine_risk_monthly}/mo FDA fine risk</span>
                          )}
                          {alert.competitors_with_transparency_pct != null && alert.competitors_with_transparency_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_transparency_pct}% competitors transparent</span>
                          )}
                          {alert.transparency_aware_lost_customers != null && alert.transparency_aware_lost_customers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.transparency_aware_lost_customers} lost customers</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          {alert.transparency_software_cost != null && alert.transparency_software_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.transparency_software_cost} software</span>
                          )}
                          {alert.transparency_monthly_total_cost != null && alert.transparency_monthly_total_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.transparency_monthly_total_cost}/mo transparency cost</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.customer_trust_lift_projected_pct != null && alert.customer_trust_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.customer_trust_lift_projected_pct}% customer trust (target)</span>
                          )}
                          {alert.order_confidence_lift_projected_pct != null && alert.order_confidence_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.order_confidence_lift_projected_pct}% order confidence (target)</span>
                          )}
                          {alert.return_visit_lift_projected_pct != null && alert.return_visit_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.return_visit_lift_projected_pct}% return visits (target)</span>
                          )}
                          {alert.dietary_segment_revenue_lift_projected_pct != null && alert.dietary_segment_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.dietary_segment_revenue_lift_projected_pct}% dietary revenue (target)</span>
                          )}
                          {alert.perceived_quality_lift_projected_pct != null && alert.perceived_quality_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pct}% quality (target)</span>
                          )}
                          {alert.transparency_lift_projected_pct != null && alert.transparency_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.transparency_lift_projected_pct}% transparency (target)</span>
                          )}
                          {alert.fitness_segment_lift_projected_pct != null && alert.fitness_segment_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.fitness_segment_lift_projected_pct}% fitness segment (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct < 0 && (
                            <span className="text-rose-600">{alert.predicted_revenue_change_pct}% revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-rose-50 border border-rose-200 rounded px-3 py-2 text-xs text-rose-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faHeartPulse} className="mt-0.5 shrink-0" />
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
          <span>Calorie counts: <span className={config.requireCalorieCounts ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCalorieCounts ? 'required' : 'optional'}</span></span>
          <span>Allergen labels: <span className={config.requireAllergenLabels ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAllergenLabels ? 'required' : 'optional'}</span></span>
          <span>Dietary labels: <span className={config.requireDietaryLabels ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDietaryLabels ? 'required' : 'optional'}</span></span>
          <span>Full nutrition info: <span className={config.requireFullNutritionalInfo ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFullNutritionalInfo ? 'required' : 'optional'}</span></span>
          <span>Health score: <span className={config.requireHealthScore ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireHealthScore ? 'required' : 'optional'}</span></span>
          <span>Ingredient sourcing: <span className={config.requireIngredientSourcing ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireIngredientSourcing ? 'required' : 'optional'}</span></span>
          <span>Macronutrient breakdown: <span className={config.requireMacronutrientBreakdown ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMacronutrientBreakdown ? 'required' : 'optional'}</span></span>
          <span>FDA compliance: <span className={config.requireFdaCompliance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFdaCompliance ? 'required' : 'optional'}</span></span>
          <span>Min transparency features: {config.minTransparencyFeatures}</span>
          <span>Min calorie coverage: {config.minCalorieCoveragePct}%</span>
          <span>Min allergen coverage: {config.minAllergenCoveragePct}%</span>
          <span>Min dietary coverage: {config.minDietaryCoveragePct}%</span>
          <span>Min macro coverage: {config.minMacroCoveragePct}%</span>
          <span>Min allergen completeness: {config.minAllergenCompleteness}/100</span>
          <span>Min health score: {config.minHealthScore}/100</span>
          <span>Min sourcing transparency: {config.minSourcingTransparency}/100</span>
          <span>Min trust lift: {config.minTrustLiftPct}%</span>
          <span>Min return visit lift: {config.minReturnVisitLiftPct}%</span>
          <span>Min dietary rev lift: {config.minDietarySegmentRevenueLiftPct}%</span>
          <span className="text-neutral-400">187th POSR-exclusive differentiator</span>
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

export default NutritionalTransparencyScreen;
