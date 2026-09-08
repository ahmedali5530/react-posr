/**
 * AI Franchise & Multi-Unit Operations Optimizer — predicts how franchise
 * and multi-unit operations (franchise royalty optimization, franchisee
 * support, brand consistency, franchise development, territory management,
 * multi-unit benchmarking, franchisee profitability, franchise compliance,
 * franchisee onboarding, unit economics) impact franchise revenue,
 * franchisee satisfaction, brand growth, system-wide profitability.
 *
 * 207th POSR-exclusive differentiator.
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
  faHandshake, faMoneyBillTrendUp, faLayerGroup, faUserGroup,
  faArrowTrendUp, faMapLocationDot, faClipboardCheck, faListCheck,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runFranchiseOperationsEngine, getActiveFranchiseOperationsAlerts, getFranchiseOperationsSummary,
  updateFranchiseOperationsAlertStatus, readFranchiseOperationsConfig, DEFAULT_FRANCHISE_OPERATIONS_CONFIG,
  type FranchiseOperationsAlert,
} from "@/lib/franchise-multi-unit-operations.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  franchise_strategy_absent:                { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faHandshake,        label: 'NO FRANCHISE' },
  franchisee_profitability_low:              { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faMoneyBillTrendUp, label: 'LOW PROFIT' },
  brand_consistency_across_units_low:        { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faLayerGroup,       label: 'LOW CONSISTENCY' },
  franchisee_support_program_absent:         { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faUserGroup,        label: 'NO SUPPORT' },
  franchise_development_pipeline_thin:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faArrowTrendUp,     label: 'THIN PIPELINE' },
  territory_management_cannibalization:      { bg: 'bg-red-50',       text: 'text-red-700',       icon: faMapLocationDot,   label: 'CANNIBALIZATION' },
  franchise_compliance_monitoring_absent:    { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faClipboardCheck,   label: 'NO COMPLIANCE' },
  franchisee_onboarding_program_weak:        { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faListCheck,        label: 'WEAK ONBOARDING' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function FranchiseMultiUnitOperationsScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<FranchiseOperationsAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, franchiseStrategyAbsentCount: 0, franchiseeProfitabilityLowCount: 0, brandConsistencyAcrossUnitsLowCount: 0, franchiseeSupportProgramAbsentCount: 0, franchiseDevelopmentPipelineThinCount: 0, territoryManagementCannibalizationCount: 0, franchiseComplianceMonitoringAbsentCount: 0, franchiseeOnboardingProgramWeakCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_FRANCHISE_OPERATIONS_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readFranchiseOperationsConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveFranchiseOperationsAlerts(db), getFranchiseOperationsSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[franchise-operations-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runFranchiseOperationsEngine(db, config);
      toast.success(`Analyzed ${result.generated} franchise operations signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[franchise-operations-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateFranchiseOperationsAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[franchise-operations-report] status failed', err);
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
      <DocumentTitle parts={["AI Franchise & Multi-Unit Operations Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faHandshake} className="text-violet-600" />
              AI Franchise &amp; Multi-Unit Operations Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how franchise and multi-unit operations (franchise royalty optimization, franchisee support, brand consistency, franchise development, territory management, multi-unit benchmarking, franchisee profitability, franchise compliance, franchisee onboarding, unit economics) impact franchise revenue, franchisee satisfaction, brand growth, system-wide profitability — US franchise restaurant market $280B+ (IFA); franchise employs 4M+ workers; average royalty 4-8%; franchise fee $25k-50k/unit; franchise failure rate 15-20% (vs 30-40% independent — franchises survive 2x more); multi-unit franchising growing 30% YoY; 55% of units owned by multi-unit franchisees; franchisee profitability benchmark 10-15% EBITDA; brands with 100+ units grow 3-5x faster; brand consistency drives 20-30% trust; franchisee support reduces failure 40-50%; franchise development = $50k-500k/unit royalty stream; territory management reduces cannibalization 30-50%; franchisee satisfaction = #1 predictor of growth; franchise ROI $5-15 per $1 support
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faHandshake} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze franchise ops'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faHandshake} label="No franchise / low profit" value={String(summary.franchiseStrategyAbsentCount + summary.franchiseeProfitabilityLowCount)} color={(summary.franchiseStrategyAbsentCount + summary.franchiseeProfitabilityLowCount) > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLayerGroup} label="Low consistency / no support" value={String(summary.brandConsistencyAcrossUnitsLowCount + summary.franchiseeSupportProgramAbsentCount)} color={(summary.brandConsistencyAcrossUnitsLowCount + summary.franchiseeSupportProgramAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faArrowTrendUp} label="Thin pipeline / cannibalization" value={String(summary.franchiseDevelopmentPipelineThinCount + summary.territoryManagementCannibalizationCount)} color={(summary.franchiseDevelopmentPipelineThinCount + summary.territoryManagementCannibalizationCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faClipboardCheck} label="No compliance / weak onboarding" value={String(summary.franchiseComplianceMonitoringAbsentCount + summary.franchiseeOnboardingProgramWeakCount)} color={(summary.franchiseComplianceMonitoringAbsentCount + summary.franchiseeOnboardingProgramWeakCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faHandshake} spin className="text-4xl mb-3" />
            <p>Analyzing franchise &amp; multi-unit operations opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No franchise operations alerts</p>
            <p className="text-sm mt-1">Healthy franchise environment: active franchise strategy (FDD, franchise agreement, operations manual); franchisee profitability 10%+ EBITDA; brand consistency 80+ (recipe 95%+, visual 90%+); franchisee support program (40-60h training, 4+ field visits/year, satisfaction 70+); franchise development pipeline (target new units/year, 8-12% conversion); territory management (exclusive territories, cannibalization under 5%); franchise compliance monitoring (2+ audits/year, violations under 3); franchisee onboarding (90-day ramp, ramp to profitability under 12 months, success rate 85%+); US franchise market $280B+ (IFA); franchises survive 2x more than independent; brands with 100+ units grow 3-5x faster; franchisee support reduces failure 40-50%; franchise ROI $5-15 per $1 support.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faHandshake, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_franchise_strategy != null && (
                            <span className={`text-xs ${alert.has_franchise_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_franchise_strategy ? 'franchise yes' : 'NO franchise'}</span>
                          )}
                          {alert.franchise_unit_count != null && alert.franchise_unit_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.franchise_unit_count} franchise units</span>
                          )}
                          {alert.company_owned_unit_count != null && alert.company_owned_unit_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.company_owned_unit_count} company</span>
                          )}
                          {alert.franchisee_count != null && alert.franchisee_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.franchisee_count} franchisees ({alert.multi_unit_franchisee_count ?? 0} multi-unit)</span>
                          )}
                          {alert.franchise_royalty_rate_pct != null && alert.franchise_royalty_rate_pct > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.franchise_royalty_rate_pct}% royalty</span>
                          )}
                          {alert.avg_franchisee_ebitda_pct != null && alert.avg_franchisee_ebitda_pct > 0 && (
                            <span className={`text-xs ${alert.avg_franchisee_ebitda_pct < 8 ? 'text-rose-600 font-medium' : alert.avg_franchisee_ebitda_pct < 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_franchisee_ebitda_pct}% EBITDA (target {alert.avg_franchisee_ebitda_target_pct ?? 12}%)</span>
                          )}
                          {alert.unprofitable_franchisee_count != null && alert.unprofitable_franchisee_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.unprofitable_franchisee_count} unprofitable</span>
                          )}
                          {alert.franchisee_churn_rate_pct != null && alert.franchisee_churn_rate_pct > 0 && (
                            <span className={`text-xs ${alert.franchisee_churn_rate_pct > 8 ? 'text-rose-600 font-medium' : alert.franchisee_churn_rate_pct > 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.franchisee_churn_rate_pct}% churn</span>
                          )}
                          {alert.brand_consistency_score != null && alert.brand_consistency_score > 0 && (
                            <span className={`text-xs ${alert.brand_consistency_score < 60 ? 'text-rose-600 font-medium' : alert.brand_consistency_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.brand_consistency_score}/100 consistency</span>
                          )}
                          {alert.recipe_compliance_pct != null && alert.recipe_compliance_pct > 0 && (
                            <span className={`text-xs ${alert.recipe_compliance_pct < 85 ? 'text-rose-600 font-medium' : alert.recipe_compliance_pct < 95 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.recipe_compliance_pct}% recipe</span>
                          )}
                          {alert.has_franchisee_support_program != null && (
                            <span className={`text-xs ${alert.has_franchisee_support_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_franchisee_support_program ? 'support yes' : 'NO support'}</span>
                          )}
                          {alert.training_hours_per_franchisee != null && alert.training_hours_per_franchisee > 0 && (
                            <span className={`text-xs ${alert.training_hours_per_franchisee < 30 ? 'text-rose-600 font-medium' : alert.training_hours_per_franchisee < 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.training_hours_per_franchisee}h training</span>
                          )}
                          {alert.field_support_visits_per_year != null && alert.field_support_visits_per_year > 0 && (
                            <span className={`text-xs ${alert.field_support_visits_per_year < 3 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.field_support_visits_per_year} visits/yr</span>
                          )}
                          {alert.franchisee_satisfaction_score != null && alert.franchisee_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.franchisee_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.franchisee_satisfaction_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.franchisee_satisfaction_score}/100 satisfaction</span>
                          )}
                          {alert.franchise_development_pipeline_count != null && alert.franchise_development_pipeline_count >= 0 && (
                            <span className={`text-xs ${alert.franchise_development_pipeline_count < 2 ? 'text-rose-600 font-medium' : alert.franchise_development_pipeline_count < 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.franchise_development_pipeline_count} pipeline (target {alert.franchise_development_target ?? 5})</span>
                          )}
                          {alert.franchise_conversion_rate_pct != null && alert.franchise_conversion_rate_pct > 0 && (
                            <span className={`text-xs ${alert.franchise_conversion_rate_pct < 5 ? 'text-rose-600 font-medium' : alert.franchise_conversion_rate_pct < 8 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.franchise_conversion_rate_pct}% conversion</span>
                          )}
                          {alert.cannibalization_rate_pct != null && alert.cannibalization_rate_pct > 0 && (
                            <span className={`text-xs ${alert.cannibalization_rate_pct > 10 ? 'text-rose-600 font-medium' : alert.cannibalization_rate_pct > 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.cannibalization_rate_pct}% cannibalization (max 5%)</span>
                          )}
                          {alert.has_franchise_compliance_monitoring != null && (
                            <span className={`text-xs ${alert.has_franchise_compliance_monitoring ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_franchise_compliance_monitoring ? 'compliance yes' : 'NO compliance'}</span>
                          )}
                          {alert.compliance_violation_count != null && alert.compliance_violation_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.compliance_violation_count} violations</span>
                          )}
                          {alert.has_franchisee_onboarding_program != null && (
                            <span className={`text-xs ${alert.has_franchisee_onboarding_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_franchisee_onboarding_program ? 'onboarding yes' : 'NO onboarding'}</span>
                          )}
                          {alert.ramp_to_profitability_months != null && alert.ramp_to_profitability_months > 0 && (
                            <span className={`text-xs ${alert.ramp_to_profitability_months > 15 ? 'text-rose-600 font-medium' : alert.ramp_to_profitability_months > 12 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ramp_to_profitability_months}mo ramp (max 12)</span>
                          )}
                          {alert.new_franchisee_success_rate_pct != null && alert.new_franchisee_success_rate_pct > 0 && (
                            <span className={`text-xs ${alert.new_franchisee_success_rate_pct < 70 ? 'text-rose-600 font-medium' : alert.new_franchisee_success_rate_pct < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.new_franchisee_success_rate_pct}% success</span>
                          )}
                          {alert.franchise_revenue_annual != null && alert.franchise_revenue_annual > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.franchise_revenue_annual)}/yr franchise rev ({alert.franchise_revenue_growth_pct ?? 0}% growth)</span>
                          )}
                          {alert.avg_unit_revenue != null && alert.avg_unit_revenue > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{fmt$(alert.avg_unit_revenue)}/unit</span>
                          )}
                          {alert.competitor_franchise_score != null && alert.competitor_franchise_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_franchise_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.franchise_revenue_growth_projected_pct != null && alert.franchise_revenue_growth_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.franchise_revenue_growth_projected_pct}% franchise revenue growth (target)</span>
                          )}
                          {alert.franchisee_profitability_lift_projected_pts != null && alert.franchisee_profitability_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.franchisee_profitability_lift_projected_pts}pts franchisee EBITDA (target)</span>
                          )}
                          {alert.brand_consistency_lift_projected_pts != null && alert.brand_consistency_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.brand_consistency_lift_projected_pts}pts brand consistency (target)</span>
                          )}
                          {alert.failure_rate_reduction_projected_pct != null && alert.failure_rate_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.failure_rate_reduction_projected_pct}% failure rate (target)</span>
                          )}
                          {alert.development_revenue_projected != null && alert.development_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.development_revenue_projected)}/yr development revenue (target)</span>
                          )}
                          {alert.cannibalization_reduction_projected_pct != null && alert.cannibalization_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.cannibalization_reduction_projected_pct}% cannibalization (target)</span>
                          )}
                          {alert.compliance_cost_reduction_projected_pct != null && alert.compliance_cost_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.compliance_cost_reduction_projected_pct}% compliance cost (target)</span>
                          )}
                          {alert.ramp_acceleration_projected_months != null && alert.ramp_acceleration_projected_months > 0 && (
                            <span className="text-emerald-600">-{alert.ramp_acceleration_projected_months}mo ramp (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faHandshake} className="mt-0.5 shrink-0" />
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
          <span>Franchise strategy: <span className={config.requireFranchiseStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFranchiseStrategy ? 'required' : 'optional'}</span></span>
          <span>Franchisee support: <span className={config.requireFranchiseeSupportProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFranchiseeSupportProgram ? 'required' : 'optional'}</span></span>
          <span>Territory mgmt: <span className={config.requireTerritoryManagement ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTerritoryManagement ? 'required' : 'optional'}</span></span>
          <span>Compliance: <span className={config.requireFranchiseComplianceMonitoring ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFranchiseComplianceMonitoring ? 'required' : 'optional'}</span></span>
          <span>Onboarding: <span className={config.requireFranchiseeOnboardingProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFranchiseeOnboardingProgram ? 'required' : 'optional'}</span></span>
          <span>Min EBITDA: {config.minFranchiseeEbitdaPct}%</span>
          <span>Min consistency: {config.minBrandConsistencyScore}</span>
          <span>Min training: {config.minTrainingHoursPerFranchisee}h</span>
          <span>Min visits: {config.minFieldSupportVisits}/yr</span>
          <span>Min satisfaction: {config.minFranchiseeSatisfactionScore}</span>
          <span>Max cannibalization: {config.maxCannibalizationRatePct}%</span>
          <span>Min audits: {config.minComplianceAuditFrequency}/yr</span>
          <span>Max ramp: {config.maxRampToProfitabilityMonths}mo</span>
          <span className="text-neutral-400">207th POSR-exclusive differentiator</span>
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

export default FranchiseMultiUnitOperationsScreen;
