/**
 * AI Zero Waste & Circular Economy Restaurant Optimizer — predicts how
 * zero waste and circular economy practices (food waste prevention,
 * composting, upcycling food scraps, reusable packaging, closed-loop
 * supply chain, donation programs, byproduct utilization, edible
 * packaging, water recycling, energy recovery, carbon-negative
 * operations, zero-waste certification) impact food cost reduction,
 * waste disposal savings, brand reputation, customer acquisition.
 * 216th POSR-exclusive differentiator.
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
  faRecycle, faLeaf, faBroom, faUtensils, faSeedling,
  faTree, faCompass, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runZeroWasteEngine, getActiveZeroWasteAlerts, getZeroWasteSummary,
  updateZeroWasteAlertStatus, readZeroWasteConfig, DEFAULT_ZERO_WASTE_CONFIG,
  type ZeroWasteAlert,
} from "@/lib/zero-waste-circular-economy.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  zero_waste_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faRecycle,          label: 'NO DATA MONETIZATION' },
  food_waste_prevention_program_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faLeaf,              label: 'NO API PROGRAM' },
  upcycling_food_scraps_program_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faBroom,      label: 'NO LICENSING' },
  reusable_edible_packaging_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faUtensils,         label: 'THIN PARTNER ECOSYS' },
  closed_loop_supply_chain_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faSeedling,       label: 'NO BENCHMARKING' },
  food_donation_program_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faTree,             label: 'NO PREDICTIVE API' },
  byproduct_utilization_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faCompass,      label: 'WEAK PRIVACY' },
  zero_waste_certification_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function ZeroWasteCircularEconomyScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<ZeroWasteAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, zeroWasteStrategyAbsentCount: 0, foodWastePreventionProgramAbsentCount: 0, upcyclingFoodScrapsProgramAbsentCount: 0, reusableEdiblePackagingAbsentCount: 0, closedLoopSupplyChainAbsentCount: 0, foodDonationProgramAbsentCount: 0, byproductUtilizationAbsentCount: 0, zeroWasteCertificationAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_ZERO_WASTE_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readZeroWasteConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveZeroWasteAlerts(db), getZeroWasteSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runZeroWasteEngine(db, config);
      toast.success(`Analyzed ${result.generated} zero waste signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateZeroWasteAlertStatus(db, alertId, status);
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
      <DocumentTitle parts={["AI Zero Wasteization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faRecycle} className="text-violet-600" />
              AI Zero Wasteization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how zero waste and circular economy (waste prevention, upcycling, reusable packaging, closed-loop supply, food donation, byproduct utilization, zero-waste certification) impacts food cost reduction, waste savings, brand reputation, customer acquisition — zero waste market growing 25%+ YoY; restaurants waste 4-10% of food = $1.5k-5k/mo (NRA); zero waste reduces food waste 80-90% (EPA); upcycling recovers $500-2k/mo; reusable packaging saves $300-1k/mo; closed-loop = 15-25% cost reduction; donation = $2k-10k/yr tax deductions; 78% view zero-waste positively (Cone); 45% pay 10-15% more for eco (Nielsen); ROI $8-20 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faRecycle} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze zero waste'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faRecycle} label="No data monetization strategy" value={String(summary.zeroWasteStrategyAbsentCount)} color={summary.zeroWasteStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLeaf} label="No API / no licensing" value={String(summary.foodWastePreventionProgramAbsentCount + summary.upcyclingFoodScrapsProgramAbsentCount)} color={(summary.foodWastePreventionProgramAbsentCount + summary.upcyclingFoodScrapsProgramAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUtensils} label="Thin partners / no benchmarking / no predictive" value={String(summary.reusableEdiblePackagingAbsentCount + summary.closedLoopSupplyChainAbsentCount + summary.foodDonationProgramAbsentCount)} color={(summary.reusableEdiblePackagingAbsentCount + summary.closedLoopSupplyChainAbsentCount + summary.foodDonationProgramAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCompass} label="Weak privacy / no valuation" value={String(summary.byproductUtilizationAbsentCount + summary.zeroWasteCertificationAbsentCount)} color={(summary.byproductUtilizationAbsentCount + summary.zeroWasteCertificationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faRecycle} spin className="text-4xl mb-3" />
            <p>Analyzing zero waste &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy zero waste environment: active zero waste strategy (80%+ diversion); food waste prevention (under 2% of purchases, $1.5k-5k/mo savings); upcycling (3+ dishes, $500-2k/mo ingredient recovery); reusable/edible packaging (30%+ reusable, 20-30% premium); closed-loop supply chain (20%+ returnable, 15-25% cost reduction); food donation (1+/wk, $2k-10k/yr tax); byproduct utilization ($200-800/mo); zero-waste certification (TRUE/GRA, 80+ score); zero waste reduces food waste 80-90% (EPA); 78% view positively (Cone); 45% pay 10-15% more (Nielsen); ROI $8-20 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faRecycle, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_zero_waste_strategy != null && (
                            <span className={`text-xs ${alert.has_zero_waste_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_zero_waste_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.current_waste_diversion_pct != null && alert.current_waste_diversion_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.current_waste_diversion_pct)}/mo data rev ({alert.eco_customer_acquisition_pct ?? 0}%)</span>
                          )}
                          {alert.food_waste_pct_of_purchases != null && alert.food_waste_pct_of_purchases > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.food_waste_pct_of_purchases)}/mo API</span>
                          )}
                          {alert.upcycling_revenue_monthly != null && alert.upcycling_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.upcycling_revenue_monthly)}/mo licensing</span>
                          )}
                          {alert.certification_score != null && alert.certification_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.certification_score)}/mo partner</span>
                          )}
                          {alert.competitor_zero_waste_score != null && alert.competitor_zero_waste_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_zero_waste_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.brand_reputation_lift_projected_pts != null && alert.brand_reputation_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.brand_reputation_lift_projected_pts}% data revenue growth (target)</span>
                          )}
                          {alert.waste_reduction_projected_pct != null && alert.waste_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.waste_reduction_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.upcycling_revenue_projected != null && alert.upcycling_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.upcycling_revenue_projected)}/mo licensing (target)</span>
                          )}
                          {alert.customer_acquisition_projected_pct != null && alert.customer_acquisition_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.customer_acquisition_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.brand_reputation_lift_projected_pts != null && alert.brand_reputation_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">-{alert.brand_reputation_lift_projected_pts}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faRecycle} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireZeroWasteStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireZeroWasteStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requireFoodWastePreventionProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFoodWastePreventionProgram ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireUpcyclingFoodScrapsProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireUpcyclingFoodScrapsProgram ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireReusableEdiblePackaging ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireReusableEdiblePackaging ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireClosedLoopSupplyChain ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireClosedLoopSupplyChain ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireFoodDonationProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFoodDonationProgram ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireByproductUtilization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireByproductUtilization ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireZeroWasteCertification ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireZeroWasteCertification ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minWasteDiversionPct}</span>
          <span>Min API calls: {config.minFoodWasteTargetPct}/mo</span>
          <span>Min partners: {config.minUpcycledDishesCount}</span>
          <span>Min privacy: {config.minReusablePackagingPct}</span>
          <span>Min anonymization: {config.minReturnableContainersPct}</span>
          <span className="text-neutral-400">216th POSR-exclusive differentiator</span>
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

export default ZeroWasteCircularEconomyScreen;
