/**
 * AI Quantum Computing Restaurant Optimization Optimizer — predicts how
 * quantum computing and quantum-inspired algorithms (quantum menu engineering,
 * NP-hard staff scheduling, TSP delivery routing, supply chain optimization,
 * quantum machine learning, hybrid classical-quantum, quantum readiness)
 * impact operational efficiency, cost reduction, competitive advantage,
 * and first-mover positioning in the quantum computing restaurant
 * optimization market.
 *
 * 220th POSR-exclusive differentiator.
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
  faAtom, faBowlFood, faCalendarWeek, faRoute,
  faBoxesStacked, faMicrochip, faInfinity, faGaugeHigh,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runQuantumComputingEngine, getActiveQuantumComputingAlerts, getQuantumComputingSummary,
  updateQuantumComputingAlertStatus, readQuantumComputingConfig, DEFAULT_QUANTUM_COMPUTING_CONFIG,
  type QuantumComputingAlert,
} from "@/lib/quantum-computing-restaurant-optimization.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  quantum_strategy_absent:                    { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faAtom,           label: 'NO QUANTUM' },
  quantum_menu_engineering_absent:            { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faBowlFood,       label: 'NO Q-MENU' },
  quantum_staff_scheduling_absent:            { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faCalendarWeek,   label: 'NO Q-SCHED' },
  quantum_delivery_routing_absent:            { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faRoute,          label: 'NO Q-ROUTE' },
  quantum_supply_chain_optimization_absent:   { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faBoxesStacked,   label: 'NO Q-SUPPLY' },
  quantum_machine_learning_absent:            { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faMicrochip,      label: 'NO QML' },
  hybrid_classical_quantum_absent:            { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faInfinity,       label: 'NO HYBRID' },
  quantum_readiness_tracking_absent:          { bg: 'bg-red-50',       text: 'text-red-700',       icon: faGaugeHigh,      label: 'NO READINESS' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function QuantumComputingRestaurantOptimizationScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<QuantumComputingAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, quantumStrategyAbsentCount: 0, quantumMenuEngineeringAbsentCount: 0, quantumStaffSchedulingAbsentCount: 0, quantumDeliveryRoutingAbsentCount: 0, quantumSupplyChainOptimizationAbsentCount: 0, quantumMachineLearningAbsentCount: 0, hybridClassicalQuantumAbsentCount: 0, quantumReadinessTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_QUANTUM_COMPUTING_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readQuantumComputingConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveQuantumComputingAlerts(db), getQuantumComputingSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[quantum-computing-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runQuantumComputingEngine(db, config);
      toast.success(`Analyzed ${result.generated} quantum computing signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[quantum-computing-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateQuantumComputingAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[quantum-computing-report] status failed', err);
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
      <DocumentTitle parts={["AI Quantum Computing Restaurant Optimization Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faAtom} className="text-violet-600" />
              AI Quantum Computing Restaurant Optimization Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how quantum computing and quantum-inspired algorithms (quantum menu engineering, NP-hard staff scheduling, TSP delivery routing, supply chain optimization, quantum machine learning, hybrid classical-quantum, quantum readiness tracking) impact operational efficiency, cost reduction, competitive advantage, first-mover positioning — quantum computing market $65B+ by 2030 (McKinsey, 40%+ CAGR); QaaS market $4B+ by 2028; 72% of enterprises exploring by 2027 (Gartner); quantum advantage for optimization (combinatorial, NP-hard); staff scheduling NP-hard (10^50+ combinations); delivery routing TSP (10^25+ routes); menu engineering combinatorial (10^30+); quantum annealing (D-Wave) 5000+ qubits; quantum-inspired 80% benefit at 1% cost; hybrid classical-quantum best of both; QML 10-100x faster training; quantum ROI $10-30 per $1; 65% Fortune 500 exploring (BCG); under 0.1% of restaurants use quantum globally
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faAtom} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze quantum'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faAtom} label="No quantum strategy" value={String(summary.quantumStrategyAbsentCount)} color={summary.quantumStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBowlFood} label="No Q-menu / no Q-scheduling" value={String(summary.quantumMenuEngineeringAbsentCount + summary.quantumStaffSchedulingAbsentCount)} color={(summary.quantumMenuEngineeringAbsentCount + summary.quantumStaffSchedulingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faRoute} label="No Q-routing / no Q-supply / no QML" value={String(summary.quantumDeliveryRoutingAbsentCount + summary.quantumSupplyChainOptimizationAbsentCount + summary.quantumMachineLearningAbsentCount)} color={(summary.quantumDeliveryRoutingAbsentCount + summary.quantumSupplyChainOptimizationAbsentCount + summary.quantumMachineLearningAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faGaugeHigh} label="No hybrid / no readiness" value={String(summary.hybridClassicalQuantumAbsentCount + summary.quantumReadinessTrackingAbsentCount)} color={(summary.hybridClassicalQuantumAbsentCount + summary.quantumReadinessTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faAtom} spin className="text-4xl mb-3" />
            <p>Analyzing quantum computing &amp; restaurant optimization opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No quantum computing alerts</p>
            <p className="text-sm mt-1">Healthy quantum computing environment: active strategy (piloting maturity, $2.2k+ investment/mo); quantum menu engineering (50k+ combinations, 18%+ lift); quantum staff scheduling (500k+ combinations, 22%+ lift); quantum delivery routing (200+ routes, 28%+ lift); quantum supply chain (12+ suppliers, 15%+ optimization); quantum machine learning (3+ models, 25x+ speedup, 8%+ accuracy); hybrid classical-quantum (5+ workflows, 32%+ efficiency); quantum readiness (score 68+, 4+ skills, 2+ partnerships, 8+ use cases); quantum computing market $65B+ by 2030 (McKinsey); ROI $10-30 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faAtom, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_quantum_strategy != null && (
                            <span className={`text-xs ${alert.has_quantum_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_quantum_strategy ? 'quantum yes' : 'NO quantum'}</span>
                          )}
                          {alert.quantum_program_maturity && alert.quantum_program_maturity !== 'none' && (
                            <span className="text-xs text-violet-600 font-medium">{alert.quantum_program_maturity}</span>
                          )}
                          {alert.total_quantum_revenue_monthly != null && alert.total_quantum_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.total_quantum_revenue_monthly)}/mo quantum rev ({alert.quantum_revenue_as_pct_of_total ?? 0}%)</span>
                          )}
                          {alert.quantum_menu_revenue_lift_monthly != null && alert.quantum_menu_revenue_lift_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.quantum_menu_revenue_lift_monthly)}/mo Q-menu</span>
                          )}
                          {alert.quantum_scheduling_savings_monthly != null && alert.quantum_scheduling_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.quantum_scheduling_savings_monthly)}/mo Q-sched</span>
                          )}
                          {alert.quantum_routing_savings_monthly != null && alert.quantum_routing_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.quantum_routing_savings_monthly)}/mo Q-route</span>
                          )}
                          {alert.hybrid_revenue_lift_monthly != null && alert.hybrid_revenue_lift_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.hybrid_revenue_lift_monthly)}/mo hybrid</span>
                          )}
                          {alert.competitor_quantum_score != null && alert.competitor_quantum_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_quantum_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.quantum_revenue_growth_projected_pct != null && alert.quantum_revenue_growth_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.quantum_revenue_growth_projected_pct}% quantum revenue growth (target)</span>
                          )}
                          {alert.quantum_menu_revenue_projected != null && alert.quantum_menu_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.quantum_menu_revenue_projected)}/mo Q-menu (target)</span>
                          )}
                          {alert.quantum_scheduling_savings_projected != null && alert.quantum_scheduling_savings_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.quantum_scheduling_savings_projected)}/mo Q-sched (target)</span>
                          )}
                          {alert.quantum_routing_savings_projected != null && alert.quantum_routing_savings_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.quantum_routing_savings_projected)}/mo Q-route (target)</span>
                          )}
                          {alert.quantum_supply_chain_savings_projected != null && alert.quantum_supply_chain_savings_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.quantum_supply_chain_savings_projected)}/mo Q-supply (target)</span>
                          )}
                          {alert.hybrid_revenue_projected != null && alert.hybrid_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.hybrid_revenue_projected)}/mo hybrid (target)</span>
                          )}
                          {alert.quantum_readiness_lift_projected_pct != null && alert.quantum_readiness_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.quantum_readiness_lift_projected_pct}% readiness (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faAtom} className="mt-0.5 shrink-0" />
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
          <span>Strategy: <span className={config.requireQuantumStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumStrategy ? 'required' : 'optional'}</span></span>
          <span>Q-menu: <span className={config.requireQuantumMenuEngineering ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumMenuEngineering ? 'required' : 'optional'}</span></span>
          <span>Q-scheduling: <span className={config.requireQuantumStaffScheduling ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumStaffScheduling ? 'required' : 'optional'}</span></span>
          <span>Q-routing: <span className={config.requireQuantumDeliveryRouting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumDeliveryRouting ? 'required' : 'optional'}</span></span>
          <span>Q-supply: <span className={config.requireQuantumSupplyChain ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumSupplyChain ? 'required' : 'optional'}</span></span>
          <span>QML: <span className={config.requireQuantumMachineLearning ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumMachineLearning ? 'required' : 'optional'}</span></span>
          <span>Hybrid: <span className={config.requireHybridClassicalQuantum ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireHybridClassicalQuantum ? 'required' : 'optional'}</span></span>
          <span>Readiness: <span className={config.requireQuantumReadinessTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireQuantumReadinessTracking ? 'required' : 'optional'}</span></span>
          <span>Min menu combos: {config.minMenuCombinationsExplored.toLocaleString()}</span>
          <span>Min sched combos: {config.minSchedulingCombinationsExplored.toLocaleString()}</span>
          <span>Min QML models: {config.minQmlModels}</span>
          <span>Min hybrid: {config.minHybridWorkflows}</span>
          <span>Min readiness: {config.minQuantumReadinessScore}</span>
          <span className="text-neutral-400">220th POSR-exclusive differentiator</span>
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

export default QuantumComputingRestaurantOptimizationScreen;
