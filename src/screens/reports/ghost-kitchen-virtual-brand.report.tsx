/**
 * AI Ghost Kitchen & Virtual Brand Optimizer — predicts how ghost kitchen
 * strategy (virtual brand portfolio, kitchen utilization, delivery platform
 * optimization, multi-brand operations, menu engineering for delivery,
 * cross-brand prep efficiency, ROI tracking, market expansion, quality
 * consistency) impacts revenue, profit margins, market reach, efficiency.
 *
 * 203rd POSR-exclusive differentiator.
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
  faGhost, faLayerGroup, faTruckFast, faBoxesStacked,
  faBowlFood, faChartLine, faRocket, faShieldHeart,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runGhostKitchenEngine, getActiveGhostKitchenAlerts, getGhostKitchenSummary,
  updateGhostKitchenAlertStatus, readGhostKitchenConfig, DEFAULT_GHOST_KITCHEN_CONFIG,
  type GhostKitchenAlert,
} from "@/lib/ghost-kitchen-virtual-brand.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  ghost_kitchen_strategy_absent:                { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faGhost,           label: 'NO GHOST KITCHEN' },
  virtual_brand_portfolio_thin:                 { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faLayerGroup,      label: 'THIN PORTFOLIO' },
  delivery_platform_optimization_absent:        { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faTruckFast,       label: 'NO PLATFORM OPT' },
  cross_brand_prep_efficiency_absent:           { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faBoxesStacked,    label: 'NO CROSS-BRAND' },
  virtual_brand_menu_delivery_unoptimized:      { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faBowlFood,        label: 'NO DELIVERY MENU' },
  ghost_kitchen_roi_tracking_absent:            { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faChartLine,       label: 'NO ROI TRACK' },
  virtual_brand_market_expansion_absent:        { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faRocket,          label: 'NO EXPANSION' },
  ghost_kitchen_quality_consistency_absent:     { bg: 'bg-emerald-50',   text: 'text-emerald-700',   icon: faShieldHeart,     label: 'NO QUALITY CONSIST' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function GhostKitchenVirtualBrandScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<GhostKitchenAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, ghostKitchenStrategyAbsentCount: 0, virtualBrandPortfolioThinCount: 0, deliveryPlatformOptimizationAbsentCount: 0, crossBrandPrepEfficiencyAbsentCount: 0, virtualBrandMenuDeliveryUnoptimizedCount: 0, ghostKitchenRoiTrackingAbsentCount: 0, virtualBrandMarketExpansionAbsentCount: 0, ghostKitchenQualityConsistencyAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_GHOST_KITCHEN_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readGhostKitchenConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveGhostKitchenAlerts(db), getGhostKitchenSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[ghost-kitchen-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runGhostKitchenEngine(db, config);
      toast.success(`Analyzed ${result.generated} ghost kitchen signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[ghost-kitchen-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateGhostKitchenAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[ghost-kitchen-report] status failed', err);
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
      <DocumentTitle parts={["AI Ghost Kitchen & Virtual Brand Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faGhost} className="text-violet-600" />
              AI Ghost Kitchen &amp; Virtual Brand Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how ghost kitchen strategy (virtual brand portfolio, kitchen utilization, delivery platform optimization, multi-brand operations, menu engineering for delivery, cross-brand prep efficiency, ROI tracking, market expansion, quality consistency) impacts revenue, profit margins, market reach, operational efficiency — ghost kitchen market $50B+ by 2030 (Allied Market Research); ghost kitchens reduce overhead 50-70% vs traditional (no dining room, no front-of-house staff); virtual brands launch in 2-4 weeks vs 6-12 months traditional; multi-brand kitchen utilization 60-80% vs 30-40% single-brand; average ghost kitchen revenue $200k-1M/year; virtual brand profit margins 15-25% vs 3-9% traditional; 35% of restaurants operate virtual brands (NRA 2024); cross-brand prep efficiency reduces food cost 10-15%; delivery platform fees 15-30% (Uber Eats, DoorDash, Grubhub) optimized with hybrid model; 60% ghost kitchen orders from delivery apps vs 40% direct; ghost kitchen investment $50k-200k vs $500k-2M traditional; ghost kitchen failure rate 30-40% (poor menu, poor platform, poor location, poor quality)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faGhost} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze ghost kitchen'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faGhost} label="No ghost kitchen strategy" value={String(summary.ghostKitchenStrategyAbsentCount)} color={summary.ghostKitchenStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLayerGroup} label="Thin virtual brand portfolio" value={String(summary.virtualBrandPortfolioThinCount)} color={summary.virtualBrandPortfolioThinCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faTruckFast} label="No platform opt / no cross-brand / no delivery menu" value={String(summary.deliveryPlatformOptimizationAbsentCount + summary.crossBrandPrepEfficiencyAbsentCount + summary.virtualBrandMenuDeliveryUnoptimizedCount)} color={(summary.deliveryPlatformOptimizationAbsentCount + summary.crossBrandPrepEfficiencyAbsentCount + summary.virtualBrandMenuDeliveryUnoptimizedCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faRocket} label="No ROI / no expansion / no quality" value={String(summary.ghostKitchenRoiTrackingAbsentCount + summary.virtualBrandMarketExpansionAbsentCount + summary.ghostKitchenQualityConsistencyAbsentCount)} color={(summary.ghostKitchenRoiTrackingAbsentCount + summary.virtualBrandMarketExpansionAbsentCount + summary.ghostKitchenQualityConsistencyAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faGhost} spin className="text-4xl mb-3" />
            <p>Analyzing ghost kitchen &amp; virtual brand opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No ghost kitchen alerts</p>
            <p className="text-sm mt-1">Healthy ghost kitchen environment: active ghost kitchen strategy (3+ virtual brands per kitchen); kitchen utilization 65%+ (multi-brand operations 60-80% vs 30-40% single-brand); delivery platform optimization (4-5 platforms, fees under 18%, direct orders 30%+); cross-brand prep efficiency (shared ingredients 40%+, shared equipment 60%+, food cost under 28%); delivery-optimized menus (complaint rate under 8%, travel time under 30min, insulated/vented/leak-proof packaging); ROI tracking per virtual brand (revenue, margin, complaint rate, ROAS); market expansion via virtual brands ($50k-200k ghost kitchen vs $500k-2M traditional); quality consistency across brands (consistency score 80+, avg rating 4.3+); ghost kitchens reduce overhead 50-70% vs traditional; virtual brand profit margins 15-25% vs 3-9% traditional; ghost kitchen market $50B+ by 2030; 35% of restaurants operate virtual brands (NRA 2024).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faGhost, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'delivery' ? 'text-emerald-600' : alert.channel === 'mixed' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_ghost_kitchen_strategy != null && (
                            <span className={`text-xs ${alert.has_ghost_kitchen_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_ghost_kitchen_strategy ? 'ghost kitchen yes' : 'NO ghost kitchen'}</span>
                          )}
                          {alert.ghost_kitchen_count != null && alert.ghost_kitchen_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.ghost_kitchen_count} kitchens</span>
                          )}
                          {alert.virtual_brand_count != null && alert.virtual_brand_count >= 0 && (
                            <span className={`text-xs ${alert.virtual_brand_count < 3 ? 'text-rose-600 font-medium' : alert.virtual_brand_count < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.virtual_brand_count} brands (target {alert.virtual_brand_target_count ?? 4})</span>
                          )}
                          {alert.kitchen_utilization_pct != null && alert.kitchen_utilization_pct >= 0 && (
                            <span className={`text-xs ${alert.kitchen_utilization_pct < 50 ? 'text-rose-600 font-medium' : alert.kitchen_utilization_pct < 65 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.kitchen_utilization_pct}% util (target {alert.kitchen_utilization_target_pct ?? 70}%)</span>
                          )}
                          {alert.revenue_per_sqft != null && alert.revenue_per_sqft > 0 && (
                            <span className={`text-xs ${alert.revenue_per_sqft < 60 ? 'text-rose-600 font-medium' : alert.revenue_per_sqft < 100 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.revenue_per_sqft)}/sqft</span>
                          )}
                          {alert.has_delivery_platform_optimization != null && (
                            <span className={`text-xs ${alert.has_delivery_platform_optimization ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_delivery_platform_optimization ? 'platform opt yes' : 'NO platform opt'}</span>
                          )}
                          {alert.delivery_platforms_count != null && alert.delivery_platforms_count > 0 && (
                            <span className="text-xs text-sky-600 font-medium">{alert.delivery_platforms_count} platforms</span>
                          )}
                          {alert.delivery_platform_fees_pct != null && alert.delivery_platform_fees_pct > 0 && (
                            <span className={`text-xs ${alert.delivery_platform_fees_pct > 25 ? 'text-rose-600 font-medium' : alert.delivery_platform_fees_pct > 18 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.delivery_platform_fees_pct}% fees (target {alert.delivery_platform_fee_target_pct ?? 18}%)</span>
                          )}
                          {alert.direct_order_pct != null && alert.direct_order_pct >= 0 && (
                            <span className={`text-xs ${alert.direct_order_pct < 20 ? 'text-rose-600 font-medium' : alert.direct_order_pct < 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.direct_order_pct}% direct (min {30}%)</span>
                          )}
                          {alert.has_cross_brand_prep_efficiency != null && (
                            <span className={`text-xs ${alert.has_cross_brand_prep_efficiency ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_cross_brand_prep_efficiency ? 'cross-brand yes' : 'NO cross-brand'}</span>
                          )}
                          {alert.shared_ingredients_pct != null && alert.shared_ingredients_pct >= 0 && (
                            <span className={`text-xs ${alert.shared_ingredients_pct < 30 ? 'text-rose-600 font-medium' : alert.shared_ingredients_pct < 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.shared_ingredients_pct}% shared ingredients</span>
                          )}
                          {alert.food_cost_pct != null && alert.food_cost_pct > 0 && (
                            <span className={`text-xs ${alert.food_cost_pct > 32 ? 'text-rose-600 font-medium' : alert.food_cost_pct > 28 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.food_cost_pct}% food cost (target {alert.food_cost_target_pct ?? 28}%)</span>
                          )}
                          {alert.has_delivery_optimized_menus != null && (
                            <span className={`text-xs ${alert.has_delivery_optimized_menus ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_delivery_optimized_menus ? 'delivery menu yes' : 'NO delivery menu'}</span>
                          )}
                          {alert.delivery_complaint_rate_pct != null && alert.delivery_complaint_rate_pct >= 0 && (
                            <span className={`text-xs ${alert.delivery_complaint_rate_pct > 12 ? 'text-rose-600 font-medium' : alert.delivery_complaint_rate_pct > 8 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.delivery_complaint_rate_pct}% complaints (max 8%)</span>
                          )}
                          {alert.has_ghost_kitchen_roi_tracking != null && (
                            <span className={`text-xs ${alert.has_ghost_kitchen_roi_tracking ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_ghost_kitchen_roi_tracking ? 'ROI track yes' : 'NO ROI track'}</span>
                          )}
                          {alert.ghost_kitchen_revenue_monthly != null && alert.ghost_kitchen_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.ghost_kitchen_revenue_monthly)}/mo GK revenue</span>
                          )}
                          {alert.ghost_kitchen_profit_margin_pct != null && alert.ghost_kitchen_profit_margin_pct > 0 && (
                            <span className={`text-xs ${alert.ghost_kitchen_profit_margin_pct < 15 ? 'text-rose-600 font-medium' : alert.ghost_kitchen_profit_margin_pct < 18 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ghost_kitchen_profit_margin_pct}% margin (target {alert.ghost_kitchen_profit_margin_target_pct ?? 20}%)</span>
                          )}
                          {alert.has_virtual_brand_market_expansion != null && (
                            <span className={`text-xs ${alert.has_virtual_brand_market_expansion ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_virtual_brand_market_expansion ? 'expansion yes' : 'NO expansion'}</span>
                          )}
                          {alert.markets_served_count != null && alert.markets_served_count > 0 && (
                            <span className={`text-xs ${alert.markets_served_count < 2 ? 'text-rose-600 font-medium' : alert.markets_served_count < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.markets_served_count} markets (target {alert.markets_target_count ?? 4})</span>
                          )}
                          {alert.virtual_brand_reach_potential != null && alert.virtual_brand_reach_potential > 0 && (
                            <span className="text-xs text-fuchsia-600 font-medium">{alert.virtual_brand_reach_potential} reach</span>
                          )}
                          {alert.has_quality_consistency_program != null && (
                            <span className={`text-xs ${alert.has_quality_consistency_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_quality_consistency_program ? 'quality consist yes' : 'NO quality consist'}</span>
                          )}
                          {alert.quality_consistency_score != null && alert.quality_consistency_score > 0 && (
                            <span className={`text-xs ${alert.quality_consistency_score < 60 ? 'text-rose-600 font-medium' : alert.quality_consistency_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.quality_consistency_score}/100 consist</span>
                          )}
                          {alert.avg_brand_rating != null && alert.avg_brand_rating > 0 && (
                            <span className={`text-xs ${alert.avg_brand_rating < 4.0 ? 'text-rose-600 font-medium' : alert.avg_brand_rating < 4.3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_brand_rating}/5 rating (min 4.3)</span>
                          )}
                          {alert.ghost_kitchen_revenue_growth_pct != null && alert.ghost_kitchen_revenue_growth_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.ghost_kitchen_revenue_growth_pct}% growth</span>
                          )}
                          {alert.competitor_ghost_kitchen_score != null && alert.competitor_ghost_kitchen_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_ghost_kitchen_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.overhead_reduction_projected_pct != null && alert.overhead_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.overhead_reduction_projected_pct}% overhead reduction (target)</span>
                          )}
                          {alert.kitchen_utilization_lift_projected_pct != null && alert.kitchen_utilization_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.kitchen_utilization_lift_projected_pct}% kitchen utilization (target)</span>
                          )}
                          {alert.food_cost_reduction_projected_pct != null && alert.food_cost_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.food_cost_reduction_projected_pct}% food cost (target)</span>
                          )}
                          {alert.delivery_complaint_reduction_projected_pct != null && alert.delivery_complaint_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.delivery_complaint_reduction_projected_pct}% delivery complaints (target)</span>
                          )}
                          {alert.profit_margin_lift_projected_pts != null && alert.profit_margin_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.profit_margin_lift_projected_pts}pts profit margin (target)</span>
                          )}
                          {alert.market_expansion_revenue_projected != null && alert.market_expansion_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.market_expansion_revenue_projected)}/mo market expansion (target)</span>
                          )}
                          {alert.quality_rating_lift_projected_pts != null && alert.quality_rating_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.quality_rating_lift_projected_pts}pts rating (target)</span>
                          )}
                          {alert.revenue_growth_projected_pct != null && alert.revenue_growth_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.revenue_growth_projected_pct}% revenue growth (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faGhost} className="mt-0.5 shrink-0" />
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
          <span>Ghost kitchen strategy: <span className={config.requireGhostKitchenStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireGhostKitchenStrategy ? 'required' : 'optional'}</span></span>
          <span>Platform opt: <span className={config.requireDeliveryPlatformOptimization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDeliveryPlatformOptimization ? 'required' : 'optional'}</span></span>
          <span>Cross-brand prep: <span className={config.requireCrossBrandPrepEfficiency ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCrossBrandPrepEfficiency ? 'required' : 'optional'}</span></span>
          <span>Delivery menus: <span className={config.requireDeliveryOptimizedMenus ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDeliveryOptimizedMenus ? 'required' : 'optional'}</span></span>
          <span>ROI tracking: <span className={config.requireGhostKitchenRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireGhostKitchenRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Market expansion: <span className={config.requireVirtualBrandMarketExpansion ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVirtualBrandMarketExpansion ? 'required' : 'optional'}</span></span>
          <span>Quality consist: <span className={config.requireQualityConsistencyProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQualityConsistencyProgram ? 'required' : 'optional'}</span></span>
          <span>Min virtual brands: {config.minVirtualBrandCount}</span>
          <span>Min utilization: {config.minKitchenUtilizationPct}%</span>
          <span>Min shared ingredients: {config.minSharedIngredientsPct}%</span>
          <span>Max complaints: {config.maxDeliveryComplaintRatePct}%</span>
          <span>Min direct orders: {config.minDirectOrderPct}%</span>
          <span>Min margin: {config.minGhostKitchenProfitMarginPct}%</span>
          <span>Min consist score: {config.minQualityConsistencyScore}</span>
          <span>Min rating: {config.minAvgBrandRating}</span>
          <span className="text-neutral-400">203rd POSR-exclusive differentiator</span>
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

export default GhostKitchenVirtualBrandScreen;
