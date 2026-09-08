/**
 * AI Augmented Reality (AR) Menu & Immersive Dining Experience Optimizer —
 * predicts how AR menu technology and immersive dining experiences (3D food
 * visualization, AR menu ordering, projection mapping, virtual ambiance,
 * AR allergen and nutrition overlay, AR multilingual, AR food photography,
 * immersive premium dining, AR engagement, AR content production)
 * impact order value, order accuracy, customer engagement, brand
 * differentiation, premium pricing, competitive advantage.
 * 210th POSR-exclusive differentiator.
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
  faWandMagicSparkles, faCube, faGlasses, faEye, faMobileScreenButton,
  faPalette, faChartLine, faStar,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runArMenuEngine, getActiveArMenuAlerts, getArMenuSummary,
  updateArMenuAlertStatus, readArMenuConfig, DEFAULT_AR_MENU_CONFIG,
  type ArMenuAlert,
} from "@/lib/ar-menu-immersive-dining.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  ar_menu_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faWandMagicSparkles,          label: 'NO DATA MONETIZATION' },
  ar_food_visualization_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faCube,              label: 'NO API PROGRAM' },
  ar_immersive_dining_experience_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faGlasses,      label: 'NO LICENSING' },
  ar_allergen_nutrition_overlay_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faEye,         label: 'THIN PARTNER ECOSYS' },
  ar_multilingual_visual_menu_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faMobileScreenButton,       label: 'NO BENCHMARKING' },
  ar_menu_platform_optimization_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faPalette,             label: 'NO PREDICTIVE API' },
  ar_content_production_program_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faChartLine,      label: 'WEAK PRIVACY' },
  ar_menu_roi_tracking_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faStar,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function ArMenuImmersiveDiningScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<ArMenuAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, arMenuStrategyAbsentCount: 0, arFoodVisualizationAbsentCount: 0, arImmersiveDiningExperienceAbsentCount: 0, arAllergenNutritionOverlayAbsentCount: 0, arMultilingualVisualMenuAbsentCount: 0, arMenuPlatformOptimizationAbsentCount: 0, arContentProductionProgramAbsentCount: 0, arMenuRoiTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_AR_MENU_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readArMenuConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveArMenuAlerts(db), getArMenuSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[ar-menu-immersive-dining-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runArMenuEngine(db, config);
      toast.success(`Analyzed ${result.generated} AR menu signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[ar-menu-immersive-dining-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateArMenuAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[ar-menu-immersive-dining-report] status failed', err);
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
      <DocumentTitle parts={["AI AR Menu & Immersive Dining Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-violet-600" />
              AI AR Menu &amp; Immersive Dining Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how data monetization strategies (API sales, data licensing, data marketplace, third-party integrations, benchmarking data, predictive models as API, privacy/compliance, pricing strategy, partner ecosystem) impact new recurring revenue, strategic partnerships, competitive advantage, data asset valuation — restaurant data monetization market $10B+ by 2025 (Gartner); API economy $4.2T by 2026 (McKinsey); 35% of enterprises monetize data (Forrester); average API revenue $100k-1M/year; data licensing $50k-500k/year; third-party integrations $10k-100k/partner/year; benchmarking $20k-100k/year; predictive models $50k-200k/year; restaurants collect terabytes daily; 72% expect personalization = data is valuable; data ROI $5-20 per $1 invested; 60% of revenue from API access, 25% licensing, 15% marketplace/benchmarking
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faWandMagicSparkles} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze AR menu'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faWandMagicSparkles} label="No AR menu strategy" value={String(summary.arMenuStrategyAbsentCount)} color={summary.arMenuStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCube} label="No 3D models / no immersive" value={String(summary.arFoodVisualizationAbsentCount + summary.arImmersiveDiningExperienceAbsentCount)} color={(summary.arFoodVisualizationAbsentCount + summary.arImmersiveDiningExperienceAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faEye} label="No allergen / no multilingual / no platform" value={String(summary.arAllergenNutritionOverlayAbsentCount + summary.arMultilingualVisualMenuAbsentCount + summary.arMenuPlatformOptimizationAbsentCount)} color={(summary.arAllergenNutritionOverlayAbsentCount + summary.arMultilingualVisualMenuAbsentCount + summary.arMenuPlatformOptimizationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faChartLine} label="No content prod / no ROI" value={String(summary.arContentProductionProgramAbsentCount + summary.arMenuRoiTrackingAbsentCount)} color={(summary.arContentProductionProgramAbsentCount + summary.arMenuRoiTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faWandMagicSparkles} spin className="text-4xl mb-3" />
            <p>Analyzing AR menu &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No AR menu alerts</p>
            <p className="text-sm mt-1">Healthy data monetization environment: active strategy (8+ data assets, quality 80+); API revenue program (10k+ calls/mo, $12k+ revenue, tiered pricing, 18+ developers); data licensing (3+ datasets, $8k+ revenue, 4+ customers); partner ecosystem (3+ partners, $4k+ revenue); benchmarking product (8+ customers, $3k+ revenue, quarterly); predictive model API (3+ models, $5k+ revenue); privacy compliance (score 85+, GDPR + CCPA, anonymization 90+); data valuation tracking ($480k+ asset, $0.04/record, quarterly); restaurant data monetization market $10B+ by 2025 (Gartner); API economy $4.2T by 2026 (McKinsey); 35% monetize data (Forrester); average API revenue $100k-1M/year; data licensing $50k-500k/year; ROI $5-20 per $1 invested.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faWandMagicSparkles, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_ar_menu_strategy != null && (
                            <span className={`text-xs ${alert.has_ar_menu_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_ar_menu_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.ar_menu_adoption_pct != null && alert.ar_menu_adoption_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.ar_menu_adoption_pct)}/mo data rev ({alert.ar_food_models_count ?? 0}%)</span>
                          )}
                          {alert.ar_engagement_rate_pct != null && alert.ar_engagement_rate_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.ar_engagement_rate_pct)}/mo API</span>
                          )}
                          {alert.ar_food_model_quality_score != null && alert.ar_food_model_quality_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.ar_food_model_quality_score)}/mo licensing</span>
                          )}
                          {alert.customer_satisfaction_ar_score != null && alert.customer_satisfaction_ar_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.customer_satisfaction_ar_score)}/mo partner</span>
                          )}
                          {alert.competitor_ar_menu_score != null && alert.competitor_ar_menu_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_ar_menu_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}% data revenue growth (target)</span>
                          )}
                          {alert.order_value_lift_projected_pct != null && alert.order_value_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.order_value_lift_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.immersive_revenue_projected != null && alert.immersive_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.immersive_revenue_projected)}/mo licensing (target)</span>
                          )}
                          {alert.engagement_lift_projected_pct != null && alert.engagement_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.engagement_lift_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.error_reduction_projected_pct != null && alert.error_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.error_reduction_projected_pct}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faWandMagicSparkles} className="mt-0.5 shrink-0" />
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
          <span>AR strategy: <span className={config.requireArMenuStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArMenuStrategy ? 'required' : 'optional'}</span></span>
          <span>3D models: <span className={config.requireArFoodVisualization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArFoodVisualization ? 'required' : 'optional'}</span></span>
          <span>Immersive: <span className={config.requireImmersiveDining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireImmersiveDining ? 'required' : 'optional'}</span></span>
          <span>Allergen: <span className={config.requireArAllergenNutritionOverlay ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArAllergenNutritionOverlay ? 'required' : 'optional'}</span></span>
          <span>Multilingual: <span className={config.requireArMultilingualVisualMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArMultilingualVisualMenu ? 'required' : 'optional'}</span></span>
          <span>Platform: <span className={config.requireArMenuPlatformOptimization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArMenuPlatformOptimization ? 'required' : 'optional'}</span></span>
          <span>Content: <span className={config.requireArContentProductionProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArContentProductionProgram ? 'required' : 'optional'}</span></span>
          <span>ROI: <span className={config.requireArMenuRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArMenuRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Min adoption: {config.minArMenuAdoptionPct}</span>
          <span>Min models: {config.minArFoodModelsCount}/mo</span>
          <span>Min quality: {config.minArFoodModelQualityScore}</span>
          <span>Max load: {config.maxArMenuLoadTimeSeconds}</span>
          <span>Min engagement: {config.minArEngagementRatePct}</span>
          <span className="text-neutral-400">210th POSR-exclusive differentiator</span>
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

export default ArMenuImmersiveDiningScreen;
