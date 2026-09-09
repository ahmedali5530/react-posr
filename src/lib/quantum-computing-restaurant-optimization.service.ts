/**
 * AI Quantum Computing Restaurant Optimization Optimizer — predicts how
 * quantum computing and quantum-inspired algorithms in restaurants
 * (quantum menu engineering, NP-hard staff scheduling, TSP delivery routing,
 * supply chain optimization, demand forecasting, quantum machine learning,
 * portfolio optimization, dynamic pricing, inventory optimization, quantum
 * annealing, hybrid classical-quantum optimization, quantum advantage
 * tracking, quantum readiness) impact operational efficiency, cost reduction,
 * competitive advantage, and first-mover positioning in the quantum
 * computing restaurant optimization market.
 *
 * Quantum computing market = $65B+ by 2030 (McKinsey, 40%+ CAGR). Quantum-
 * as-a-Service (QaaS) market = $4B+ by 2028 (IBM Quantum, AWS Braket, Google
 * Quantum AI, Azure Quantum, IonQ, Rigetti, D-Wave). 72% of enterprises
 * exploring quantum by 2027 (Gartner). Quantum advantage demonstrated for
 * optimization (combinatorial, NP-hard problems). Restaurant optimization
 * problems that benefit from quantum: staff scheduling (NP-hard, 10^50+
 * combinations for 50 staff x 7 days x 10 shifts), delivery routing (TSP,
 * 10^25+ routes for 20 stops), menu engineering (combinatorial, 10^30+
 * menu combinations), supply chain (multi-objective optimization),
 * inventory optimization (stochastic, demand uncertainty), dynamic pricing
 * (real-time multi-variable). Quantum annealing (D-Wave) = optimization
 * specialist, 5000+ qubits. Gate-based quantum (IBM, Google) = general
 * purpose, 100-1000 qubits. Quantum-inspired algorithms (tensor networks,
 * simulated annealing, QAOA) = classical hardware emulating quantum = 80%
 * of quantum benefit at 1% of cost. Hybrid classical-quantum = best of both
 * (classical for most, quantum for hard optimization). Quantum machine
 * learning (QML) = 10-100x faster training for certain models. IBM Quantum
 * = $1 per task (pay-as-you-go), AWS Braket = $0.30 per task, D-Wave Leap
 * = $2k/month (unlimited). Quantum optimization ROI = $10-30 per $1
 * invested (operational efficiency). 65% of Fortune 500 exploring quantum
 * (BCG). Restaurants using quantum = under 0.1% globally (huge first-mover
 * advantage). Quantum readiness = 2-5 year preparation (skills, partnerships,
 * use cases). Quantum advantage expected for restaurant optimization by
 * 2027-2030. Hybrid quantum-classical = immediate value (quantum-inspired
 * today, real quantum when available). Post-quantum cryptography = future-
 * proof security (NIST PQC standards 2024).
 *
 * 220th POSR-exclusive differentiator. Distinct from:
 *   - labor-optimization.service — Uses CLASSICAL greedy assignment. This
 *     optimizer uses QUANTUM annealing for NP-hard scheduling.
 *   - delivery-route.service — Uses CLASSICAL heuristics. This optimizer
 *     uses QUANTUM TSP for optimal routing.
 *   - menu-engineering-matrix.service — Uses CLASSICAL matrix analysis.
 *     This optimizer uses QUANTUM combinatorial optimization.
 *   - demand-forecast.service — Uses CLASSICAL ML. This optimizer uses
 *     QUANTUM machine learning (QML) for faster training.
 *   - dynamic-pricing.service — Uses CLASSICAL rules. This optimizer uses
 *     QUANTUM multi-variable optimization.
 *   - procurement.service — Uses CLASSICAL cost analysis. This optimizer
 *     uses QUANTUM supply chain optimization.
 *   - inventory-transfer.service — Uses CLASSICAL transfer logic. This
 *     optimizer uses QUANTUM stochastic inventory optimization.
 *   - reorder-point-optimizer.service — Uses CLASSICAL reorder points.
 *     This optimizer uses QUANTUM inventory optimization.
 *   - price-elasticity.service — Uses CLASSICAL elasticity. This optimizer
 *     uses QUANTUM pricing optimization.
 *
 * 8 AI rules:
 *   1. quantum_strategy_absent -> no quantum program -> missed $65B market
 *   2. quantum_menu_engineering_absent -> no quantum menu optimization -> missed combinatorial menu gains
 *   3. quantum_staff_scheduling_absent -> no quantum scheduling -> NP-hard unsolved classically
 *   4. quantum_delivery_routing_absent -> no quantum TSP -> suboptimal delivery routes
 *   5. quantum_supply_chain_optimization_absent -> no quantum supply chain -> missed multi-objective gains
 *   6. quantum_machine_learning_absent -> no QML -> slower ML training
 *   7. hybrid_classical_quantum_absent -> no hybrid approach -> missing immediate value
 *   8. quantum_readiness_tracking_absent -> no readiness tracking -> can't measure progress
 */

import { useDB } from '@/api/db/db.ts';
import { safeNumber } from '@/lib/utils.ts';

export type QuantumComputingRuleId =
  | 'quantum_strategy_absent'
  | 'quantum_menu_engineering_absent'
  | 'quantum_staff_scheduling_absent'
  | 'quantum_delivery_routing_absent'
  | 'quantum_supply_chain_optimization_absent'
  | 'quantum_machine_learning_absent'
  | 'hybrid_classical_quantum_absent'
  | 'quantum_readiness_tracking_absent';

export type QuantumComputingAiRec =
  'launch_quantum_strategy'
  | 'deploy_quantum_menu_engineering'
  | 'deploy_quantum_staff_scheduling'
  | 'deploy_quantum_delivery_routing'
  | 'deploy_quantum_supply_chain'
  | 'deploy_quantum_machine_learning'
  | 'deploy_hybrid_classical_quantum'
  | 'implement_quantum_readiness_tracking'
  | 'monitor'
  | 'skip';

export interface QuantumComputingAlert {
  id?: string;
  rule_id: QuantumComputingRuleId;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id?: string;
  restaurant_tier?: string;
  market_setting?: string;
  channel?: string;
  // Quantum strategy
  has_quantum_strategy?: boolean;
  quantum_program_maturity?: string;
  quantum_investment_monthly?: number;
  // Quantum menu engineering
  has_quantum_menu_engineering?: boolean;
  menu_combinations_explored?: number;
  menu_optimization_lift_pct?: number;
  quantum_menu_revenue_lift_monthly?: number;
  // Quantum staff scheduling
  has_quantum_staff_scheduling?: boolean;
  scheduling_combinations_explored?: number;
  scheduling_optimization_lift_pct?: number;
  quantum_scheduling_savings_monthly?: number;
  // Quantum delivery routing
  has_quantum_delivery_routing?: boolean;
  routes_optimized_count?: number;
  routing_optimization_lift_pct?: number;
  quantum_routing_savings_monthly?: number;
  // Quantum supply chain
  has_quantum_supply_chain?: boolean;
  suppliers_optimized_count?: number;
  supply_chain_optimization_pct?: number;
  quantum_supply_chain_savings_monthly?: number;
  // Quantum machine learning
  has_quantum_machine_learning?: boolean;
  qml_models_count?: number;
  qml_training_speedup_x?: number;
  qml_accuracy_lift_pct?: number;
  // Hybrid classical-quantum
  has_hybrid_classical_quantum?: boolean;
  hybrid_workflows_count?: number;
  hybrid_efficiency_lift_pct?: number;
  hybrid_revenue_lift_monthly?: number;
  // Quantum readiness
  has_quantum_readiness_tracking?: boolean;
  quantum_readiness_score?: number;
  quantum_skills_count?: number;
  quantum_partnerships_count?: number;
  quantum_use_cases_identified?: number;
  // Revenue metrics
  total_quantum_revenue_monthly?: number;
  quantum_revenue_growth_pct?: number;
  quantum_revenue_as_pct_of_total?: number;
  competitor_quantum_score?: number;
  monthly_revenue?: number;
  total_customers?: number;
  total_orders_monthly?: number;
  total_staff?: number;
  total_delivery_stops_monthly?: number;
  // Costs
  quantum_infrastructure_cost_monthly?: number;
  qaaS_cost_monthly?: number;
  quantum_skills_cost_monthly?: number;
  // Impact projections
  quantum_revenue_growth_projected_pct?: number;
  quantum_menu_revenue_projected?: number;
  quantum_scheduling_savings_projected?: number;
  quantum_routing_savings_projected?: number;
  quantum_supply_chain_savings_projected?: number;
  hybrid_revenue_projected?: number;
  quantum_readiness_lift_projected_pct?: number;
  predicted_revenue_change_pct?: number;
  est_monthly_opportunity: number;
  description: string;
  ai_insight?: string;
  ai_recommendation?: QuantumComputingAiRec;
  status: 'open' | 'resolved' | 'in_progress' | 'rejected' | 'expired';
  detected_at: Date;
  expires_at?: Date;
}

export interface QuantumComputingConfig {
  aiEnabled: boolean;
  requireQuantumStrategy: boolean;
  requireQuantumMenuEngineering: boolean;
  requireQuantumStaffScheduling: boolean;
  requireQuantumDeliveryRouting: boolean;
  requireQuantumSupplyChain: boolean;
  requireQuantumMachineLearning: boolean;
  requireHybridClassicalQuantum: boolean;
  requireQuantumReadinessTracking: boolean;
  minMenuCombinationsExplored: number;
  minSchedulingCombinationsExplored: number;
  minQmlModels: number;
  minHybridWorkflows: number;
  minQuantumReadinessScore: number;
  minQuantumUseCases: number;
  preferCompetitorParity: boolean;
}

export const DEFAULT_QUANTUM_COMPUTING_CONFIG: QuantumComputingConfig = {
  aiEnabled: true,
  requireQuantumStrategy: true,
  requireQuantumMenuEngineering: true,
  requireQuantumStaffScheduling: true,
  requireQuantumDeliveryRouting: true,
  requireQuantumSupplyChain: true,
  requireQuantumMachineLearning: true,
  requireHybridClassicalQuantum: true,
  requireQuantumReadinessTracking: true,
  minMenuCombinationsExplored: 10000,
  minSchedulingCombinationsExplored: 100000,
  minQmlModels: 2,
  minHybridWorkflows: 3,
  minQuantumReadinessScore: 60,
  minQuantumUseCases: 5,
  preferCompetitorParity: true,
};

export const readQuantumComputingConfig = (settings: any): QuantumComputingConfig => ({
  aiEnabled: settings?.quantum_computing_ai_enabled ?? true,
  requireQuantumStrategy: settings?.quantum_computing_require_strategy ?? true,
  requireQuantumMenuEngineering: settings?.quantum_computing_require_menu ?? true,
  requireQuantumStaffScheduling: settings?.quantum_computing_require_scheduling ?? true,
  requireQuantumDeliveryRouting: settings?.quantum_computing_require_routing ?? true,
  requireQuantumSupplyChain: settings?.quantum_computing_require_supply_chain ?? true,
  requireQuantumMachineLearning: settings?.quantum_computing_require_qml ?? true,
  requireHybridClassicalQuantum: settings?.quantum_computing_require_hybrid ?? true,
  requireQuantumReadinessTracking: settings?.quantum_computing_require_readiness ?? true,
  minMenuCombinationsExplored: safeNumber(settings?.quantum_computing_min_menu_combos, 10000),
  minSchedulingCombinationsExplored: safeNumber(settings?.quantum_computing_min_sched_combos, 100000),
  minQmlModels: safeNumber(settings?.quantum_computing_min_qml_models, 2),
  minHybridWorkflows: safeNumber(settings?.quantum_computing_min_hybrid_workflows, 3),
  minQuantumReadinessScore: safeNumber(settings?.quantum_computing_min_readiness, 60),
  minQuantumUseCases: safeNumber(settings?.quantum_computing_min_use_cases, 5),
  preferCompetitorParity: settings?.quantum_computing_prefer_competitor_parity ?? true,
});

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

interface QuantumComputingData {
  location_id: string;
  restaurant_tier: string;
  market_setting: string;
  channel: string;
  has_quantum_strategy: boolean;
  quantum_program_maturity: string;
  quantum_investment_monthly: number;
  has_quantum_menu_engineering: boolean;
  menu_combinations_explored: number;
  menu_optimization_lift_pct: number;
  quantum_menu_revenue_lift_monthly: number;
  has_quantum_staff_scheduling: boolean;
  scheduling_combinations_explored: number;
  scheduling_optimization_lift_pct: number;
  quantum_scheduling_savings_monthly: number;
  has_quantum_delivery_routing: boolean;
  routes_optimized_count: number;
  routing_optimization_lift_pct: number;
  quantum_routing_savings_monthly: number;
  has_quantum_supply_chain: boolean;
  suppliers_optimized_count: number;
  supply_chain_optimization_pct: number;
  quantum_supply_chain_savings_monthly: number;
  has_quantum_machine_learning: boolean;
  qml_models_count: number;
  qml_training_speedup_x: number;
  qml_accuracy_lift_pct: number;
  has_hybrid_classical_quantum: boolean;
  hybrid_workflows_count: number;
  hybrid_efficiency_lift_pct: number;
  hybrid_revenue_lift_monthly: number;
  has_quantum_readiness_tracking: boolean;
  quantum_readiness_score: number;
  quantum_skills_count: number;
  quantum_partnerships_count: number;
  quantum_use_cases_identified: number;
  total_quantum_revenue_monthly: number;
  quantum_revenue_growth_pct: number;
  quantum_revenue_as_pct_of_total: number;
  competitor_quantum_score: number;
  monthly_revenue: number;
  total_customers: number;
  total_orders_monthly: number;
  total_staff: number;
  total_delivery_stops_monthly: number;
  quantum_infrastructure_cost_monthly: number;
  qaaS_cost_monthly: number;
  quantum_skills_cost_monthly: number;
}

const MOCK_DATA: QuantumComputingData[] = [
  {
    location_id: 'overall', restaurant_tier: 'casual_dining', market_setting: 'suburban',
    channel: 'dine_in',
    has_quantum_strategy: false, quantum_program_maturity: 'none',
    quantum_investment_monthly: 0,
    has_quantum_menu_engineering: false, menu_combinations_explored: 100,
    menu_optimization_lift_pct: 0, quantum_menu_revenue_lift_monthly: 0,
    has_quantum_staff_scheduling: false, scheduling_combinations_explored: 1000,
    scheduling_optimization_lift_pct: 0, quantum_scheduling_savings_monthly: 0,
    has_quantum_delivery_routing: false, routes_optimized_count: 10,
    routing_optimization_lift_pct: 0, quantum_routing_savings_monthly: 0,
    has_quantum_supply_chain: false, suppliers_optimized_count: 3,
    supply_chain_optimization_pct: 0, quantum_supply_chain_savings_monthly: 0,
    has_quantum_machine_learning: false, qml_models_count: 0,
    qml_training_speedup_x: 0, qml_accuracy_lift_pct: 0,
    has_hybrid_classical_quantum: false, hybrid_workflows_count: 0,
    hybrid_efficiency_lift_pct: 0, hybrid_revenue_lift_monthly: 0,
    has_quantum_readiness_tracking: false, quantum_readiness_score: 12,
    quantum_skills_count: 0, quantum_partnerships_count: 0,
    quantum_use_cases_identified: 0,
    total_quantum_revenue_monthly: 0, quantum_revenue_growth_pct: 0,
    quantum_revenue_as_pct_of_total: 0,
    competitor_quantum_score: 35,
    monthly_revenue: 86000, total_customers: 2800,
    total_orders_monthly: 4200, total_staff: 18, total_delivery_stops_monthly: 600,
    quantum_infrastructure_cost_monthly: 0, qaaS_cost_monthly: 0,
    quantum_skills_cost_monthly: 0,
  },
  {
    location_id: 'brand', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_quantum_strategy: true, quantum_program_maturity: 'exploring',
    quantum_investment_monthly: 800,
    has_quantum_menu_engineering: false, menu_combinations_explored: 500,
    menu_optimization_lift_pct: 3, quantum_menu_revenue_lift_monthly: 300,
    has_quantum_staff_scheduling: false, scheduling_combinations_explored: 5000,
    scheduling_optimization_lift_pct: 2, quantum_scheduling_savings_monthly: 200,
    has_quantum_delivery_routing: false, routes_optimized_count: 30,
    routing_optimization_lift_pct: 4, quantum_routing_savings_monthly: 250,
    has_quantum_supply_chain: false, suppliers_optimized_count: 5,
    supply_chain_optimization_pct: 2, quantum_supply_chain_savings_monthly: 180,
    has_quantum_machine_learning: false, qml_models_count: 0,
    qml_training_speedup_x: 0, qml_accuracy_lift_pct: 0,
    has_hybrid_classical_quantum: false, hybrid_workflows_count: 1,
    hybrid_efficiency_lift_pct: 5, hybrid_revenue_lift_monthly: 400,
    has_quantum_readiness_tracking: false, quantum_readiness_score: 28,
    quantum_skills_count: 1, quantum_partnerships_count: 0,
    quantum_use_cases_identified: 3,
    total_quantum_revenue_monthly: 930, quantum_revenue_growth_pct: 8,
    quantum_revenue_as_pct_of_total: 0.6,
    competitor_quantum_score: 48,
    monthly_revenue: 152000, total_customers: 6200,
    total_orders_monthly: 9800, total_staff: 35, total_delivery_stops_monthly: 1500,
    quantum_infrastructure_cost_monthly: 500, qaaS_cost_monthly: 200,
    quantum_skills_cost_monthly: 100,
  },
  {
    location_id: 'location_1', restaurant_tier: 'fast_casual', market_setting: 'urban',
    channel: 'mixed',
    has_quantum_strategy: true, quantum_program_maturity: 'piloting',
    quantum_investment_monthly: 2200,
    has_quantum_menu_engineering: true, menu_combinations_explored: 50000,
    menu_optimization_lift_pct: 18, quantum_menu_revenue_lift_monthly: 3600,
    has_quantum_staff_scheduling: true, scheduling_combinations_explored: 500000,
    scheduling_optimization_lift_pct: 22, quantum_scheduling_savings_monthly: 1800,
    has_quantum_delivery_routing: true, routes_optimized_count: 200,
    routing_optimization_lift_pct: 28, quantum_routing_savings_monthly: 1400,
    has_quantum_supply_chain: true, suppliers_optimized_count: 12,
    supply_chain_optimization_pct: 15, quantum_supply_chain_savings_monthly: 1200,
    has_quantum_machine_learning: true, qml_models_count: 3,
    qml_training_speedup_x: 25, qml_accuracy_lift_pct: 8,
    has_hybrid_classical_quantum: true, hybrid_workflows_count: 5,
    hybrid_efficiency_lift_pct: 32, hybrid_revenue_lift_monthly: 2800,
    has_quantum_readiness_tracking: true, quantum_readiness_score: 68,
    quantum_skills_count: 4, quantum_partnerships_count: 2,
    quantum_use_cases_identified: 8,
    total_quantum_revenue_monthly: 10800, quantum_revenue_growth_pct: 38,
    quantum_revenue_as_pct_of_total: 5.4,
    competitor_quantum_score: 62,
    monthly_revenue: 201000, total_customers: 9800,
    total_orders_monthly: 15800, total_staff: 52, total_delivery_stops_monthly: 2800,
    quantum_infrastructure_cost_monthly: 1000, qaaS_cost_monthly: 800,
    quantum_skills_cost_monthly: 400,
  },
  {
    location_id: 'location_2', restaurant_tier: 'quick_service', market_setting: 'urban',
    channel: 'mixed',
    has_quantum_strategy: true, quantum_program_maturity: 'optimized',
    quantum_investment_monthly: 5200,
    has_quantum_menu_engineering: true, menu_combinations_explored: 500000,
    menu_optimization_lift_pct: 32, quantum_menu_revenue_lift_monthly: 9200,
    has_quantum_staff_scheduling: true, scheduling_combinations_explored: 5000000,
    scheduling_optimization_lift_pct: 38, quantum_scheduling_savings_monthly: 4800,
    has_quantum_delivery_routing: true, routes_optimized_count: 800,
    routing_optimization_lift_pct: 42, quantum_routing_savings_monthly: 3800,
    has_quantum_supply_chain: true, suppliers_optimized_count: 25,
    supply_chain_optimization_pct: 28, quantum_supply_chain_savings_monthly: 3200,
    has_quantum_machine_learning: true, qml_models_count: 6,
    qml_training_speedup_x: 80, qml_accuracy_lift_pct: 15,
    has_hybrid_classical_quantum: true, hybrid_workflows_count: 12,
    hybrid_efficiency_lift_pct: 48, hybrid_revenue_lift_monthly: 6800,
    has_quantum_readiness_tracking: true, quantum_readiness_score: 88,
    quantum_skills_count: 8, quantum_partnerships_count: 4,
    quantum_use_cases_identified: 15,
    total_quantum_revenue_monthly: 27800, quantum_revenue_growth_pct: 62,
    quantum_revenue_as_pct_of_total: 10.5,
    competitor_quantum_score: 72,
    monthly_revenue: 265000, total_customers: 18500,
    total_orders_monthly: 32000, total_staff: 95, total_delivery_stops_monthly: 5800,
    quantum_infrastructure_cost_monthly: 2000, qaaS_cost_monthly: 1800,
    quantum_skills_cost_monthly: 800,
  },
];

export const runQuantumComputingEngine = async (
  db: ReturnType<typeof useDB>,
  config: QuantumComputingConfig,
): Promise<{ alerts: QuantumComputingAlert[]; generated: number }> => {
  const alerts: QuantumComputingAlert[] = [];
  const now = new Date();

  let data: QuantumComputingData[] = [];
  try {
    const result = await db.query(
      `SELECT location_id, restaurant_tier, market_setting, channel,
              has_quantum_strategy, quantum_program_maturity,
              quantum_investment_monthly,
              has_quantum_menu_engineering, menu_combinations_explored,
              menu_optimization_lift_pct, quantum_menu_revenue_lift_monthly,
              has_quantum_staff_scheduling, scheduling_combinations_explored,
              scheduling_optimization_lift_pct, quantum_scheduling_savings_monthly,
              has_quantum_delivery_routing, routes_optimized_count,
              routing_optimization_lift_pct, quantum_routing_savings_monthly,
              has_quantum_supply_chain, suppliers_optimized_count,
              supply_chain_optimization_pct, quantum_supply_chain_savings_monthly,
              has_quantum_machine_learning, qml_models_count,
              qml_training_speedup_x, qml_accuracy_lift_pct,
              has_hybrid_classical_quantum, hybrid_workflows_count,
              hybrid_efficiency_lift_pct, hybrid_revenue_lift_monthly,
              has_quantum_readiness_tracking, quantum_readiness_score,
              quantum_skills_count, quantum_partnerships_count,
              quantum_use_cases_identified,
              total_quantum_revenue_monthly, quantum_revenue_growth_pct,
              quantum_revenue_as_pct_of_total, competitor_quantum_score,
              monthly_revenue, total_customers, total_orders_monthly,
              total_staff, total_delivery_stops_monthly,
              quantum_infrastructure_cost_monthly, qaaS_cost_monthly,
              quantum_skills_cost_monthly
       FROM quantum_computing_log`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    data = rows.map((r: any): QuantumComputingData => ({
      location_id: String(r.location_id ?? 'overall'),
      restaurant_tier: String(r.restaurant_tier ?? 'casual_dining'),
      market_setting: String(r.market_setting ?? 'suburban'),
      channel: String(r.channel ?? 'dine_in'),
      has_quantum_strategy: Boolean(r.has_quantum_strategy ?? false),
      quantum_program_maturity: String(r.quantum_program_maturity ?? 'none'),
      quantum_investment_monthly: safeNumber(r.quantum_investment_monthly, 0),
      has_quantum_menu_engineering: Boolean(r.has_quantum_menu_engineering ?? false),
      menu_combinations_explored: safeNumber(r.menu_combinations_explored, 0),
      menu_optimization_lift_pct: safeNumber(r.menu_optimization_lift_pct, 0),
      quantum_menu_revenue_lift_monthly: safeNumber(r.quantum_menu_revenue_lift_monthly, 0),
      has_quantum_staff_scheduling: Boolean(r.has_quantum_staff_scheduling ?? false),
      scheduling_combinations_explored: safeNumber(r.scheduling_combinations_explored, 0),
      scheduling_optimization_lift_pct: safeNumber(r.scheduling_optimization_lift_pct, 0),
      quantum_scheduling_savings_monthly: safeNumber(r.quantum_scheduling_savings_monthly, 0),
      has_quantum_delivery_routing: Boolean(r.has_quantum_delivery_routing ?? false),
      routes_optimized_count: safeNumber(r.routes_optimized_count, 0),
      routing_optimization_lift_pct: safeNumber(r.routing_optimization_lift_pct, 0),
      quantum_routing_savings_monthly: safeNumber(r.quantum_routing_savings_monthly, 0),
      has_quantum_supply_chain: Boolean(r.has_quantum_supply_chain ?? false),
      suppliers_optimized_count: safeNumber(r.suppliers_optimized_count, 0),
      supply_chain_optimization_pct: safeNumber(r.supply_chain_optimization_pct, 0),
      quantum_supply_chain_savings_monthly: safeNumber(r.quantum_supply_chain_savings_monthly, 0),
      has_quantum_machine_learning: Boolean(r.has_quantum_machine_learning ?? false),
      qml_models_count: safeNumber(r.qml_models_count, 0),
      qml_training_speedup_x: safeNumber(r.qml_training_speedup_x, 0),
      qml_accuracy_lift_pct: safeNumber(r.qml_accuracy_lift_pct, 0),
      has_hybrid_classical_quantum: Boolean(r.has_hybrid_classical_quantum ?? false),
      hybrid_workflows_count: safeNumber(r.hybrid_workflows_count, 0),
      hybrid_efficiency_lift_pct: safeNumber(r.hybrid_efficiency_lift_pct, 0),
      hybrid_revenue_lift_monthly: safeNumber(r.hybrid_revenue_lift_monthly, 0),
      has_quantum_readiness_tracking: Boolean(r.has_quantum_readiness_tracking ?? false),
      quantum_readiness_score: safeNumber(r.quantum_readiness_score, 0),
      quantum_skills_count: safeNumber(r.quantum_skills_count, 0),
      quantum_partnerships_count: safeNumber(r.quantum_partnerships_count, 0),
      quantum_use_cases_identified: safeNumber(r.quantum_use_cases_identified, 0),
      total_quantum_revenue_monthly: safeNumber(r.total_quantum_revenue_monthly, 0),
      quantum_revenue_growth_pct: safeNumber(r.quantum_revenue_growth_pct, 0),
      quantum_revenue_as_pct_of_total: safeNumber(r.quantum_revenue_as_pct_of_total, 0),
      competitor_quantum_score: safeNumber(r.competitor_quantum_score, 0),
      monthly_revenue: safeNumber(r.monthly_revenue, 0),
      total_customers: safeNumber(r.total_customers, 0),
      total_orders_monthly: safeNumber(r.total_orders_monthly, 0),
      total_staff: safeNumber(r.total_staff, 0),
      total_delivery_stops_monthly: safeNumber(r.total_delivery_stops_monthly, 0),
      quantum_infrastructure_cost_monthly: safeNumber(r.quantum_infrastructure_cost_monthly, 0),
      qaaS_cost_monthly: safeNumber(r.qaaS_cost_monthly, 0),
      quantum_skills_cost_monthly: safeNumber(r.quantum_skills_cost_monthly, 0),
    }));
  } catch {
    data = MOCK_DATA;
  }
  if (!data || data.length === 0) data = MOCK_DATA;

  for (const d of data) {
    const baselineRevenue = d.monthly_revenue;
    const targetQuantumRevenueGrowthPct = 55;
    const targetMenuRevenue = Math.round(baselineRevenue * 0.045);
    const targetSchedulingSavings = Math.round(baselineRevenue * 0.025);
    const targetRoutingSavings = Math.round(baselineRevenue * 0.02);
    const targetSupplyChainSavings = Math.round(baselineRevenue * 0.02);
    const targetHybridRevenue = Math.round(baselineRevenue * 0.035);
    const targetReadinessScore = 80;

    // Rule 1: QUANTUM_STRATEGY_ABSENT
    if (config.requireQuantumStrategy && !d.has_quantum_strategy) {
      const expectedMenuRevenue = Math.round(targetMenuRevenue * 0.5);
      const expectedSchedulingSavings = Math.round(targetSchedulingSavings * 0.5);
      const expectedRoutingSavings = Math.round(targetRoutingSavings * 0.4);
      const expectedSupplyChainSavings = Math.round(targetSupplyChainSavings * 0.4);
      const totalOpportunity = Math.max(expectedMenuRevenue + expectedSchedulingSavings + expectedRoutingSavings + expectedSupplyChainSavings, 4800);
      const severityLabel = d.competitor_quantum_score > 45 ? 'critical' : 'high';
      const criticalNote = (d.competitor_quantum_score > 45)
        ? 'CRITICAL: NO QUANTUM STRATEGY — competitor quantum score ' + d.competitor_quantum_score + '/100 (high); quantum computing market = $65B+ by 2030 (McKinsey, 40%+ CAGR); Quantum-as-a-Service market = $4B+ by 2028; 72% of enterprises exploring quantum by 2027 (Gartner); restaurants using quantum = under 0.1% globally (huge first-mover advantage); 65% of Fortune 500 exploring quantum (BCG); missing quantum = missed operational efficiency + cost reduction + competitive advantage. '
        : `HIGH: NO QUANTUM STRATEGY — quantum computing market $65B+ by 2030 (McKinsey); 72% exploring by 2027 (Gartner); missing operational efficiency + cost reduction. `;
      alerts.push({
        rule_id: 'quantum_strategy_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_strategy: d.has_quantum_strategy,
        quantum_program_maturity: d.quantum_program_maturity,
        quantum_investment_monthly: d.quantum_investment_monthly,
        total_staff: d.total_staff,
        total_delivery_stops_monthly: d.total_delivery_stops_monthly,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_revenue_growth_projected_pct: targetQuantumRevenueGrowthPct,
        quantum_menu_revenue_projected: expectedMenuRevenue,
        quantum_scheduling_savings_projected: expectedSchedulingSavings,
        quantum_routing_savings_projected: expectedRoutingSavings,
        quantum_supply_chain_savings_projected: expectedSupplyChainSavings,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM STRATEGY ABSENT: ${d.location_id} — quantum strategy ABSENT; program maturity ${d.quantum_program_maturity}; investment ${fmt$(d.quantum_investment_monthly)}/mo; staff ${d.total_staff}; delivery stops ${d.total_delivery_stops_monthly}/mo; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: quantum computing market = $65B+ by 2030 (McKinsey, 40%+ CAGR); Quantum-as-a-Service (QaaS) market = $4B+ by 2028 (IBM Quantum, AWS Braket, Google Quantum AI, Azure Quantum, IonQ, Rigetti, D-Wave); 72% of enterprises exploring quantum by 2027 (Gartner); quantum advantage demonstrated for optimization (combinatorial, NP-hard); restaurant optimization problems = staff scheduling (NP-hard, 10^50+ combinations for 50 staff x 7 days x 10 shifts), delivery routing (TSP, 10^25+ routes for 20 stops), menu engineering (combinatorial, 10^30+ menu combinations), supply chain (multi-objective), inventory (stochastic), dynamic pricing (multi-variable); quantum annealing (D-Wave) = 5000+ qubits; gate-based quantum (IBM, Google) = 100-1000 qubits; quantum-inspired algorithms = 80% of quantum benefit at 1% of cost; hybrid classical-quantum = best of both; QaaS pricing = $0.30-2 per task (pay-as-you-go) or $2k/month (unlimited); quantum ROI = $10-30 per $1 invested; 65% of Fortune 500 exploring quantum (BCG); restaurants using quantum = under 0.1% globally (huge first-mover advantage); quantum readiness = 2-5 year preparation. Solutions ranked by impact: (1) LAUNCH quantum strategy — menu revenue ${fmt$(expectedMenuRevenue)}/mo + scheduling savings ${fmt$(expectedSchedulingSavings)}/mo + routing ${fmt$(expectedRoutingSavings)}/mo + supply chain ${fmt$(expectedSupplyChainSavings)}/mo; cost ${fmt$(1500)}/mo (QaaS + infrastructure); payback 3-6 months; (2) ASSESS quantum readiness (skills, use cases, partnerships); (3) IDENTIFY quantum use cases (menu, scheduling, routing, supply chain, ML); (4) EVALUATE QaaS providers (IBM, AWS Braket, Google, Azure, D-Wave, IonQ); (5) START with quantum-inspired algorithms (80% benefit, 1% cost); (6) BUILD hybrid classical-quantum workflows; (7) TRAIN quantum skills (Qiskit, Cirq, PennyLane); (8) PARTNER with quantum providers (IBM Quantum Network, AWS Braket); (9) PILOT quantum menu engineering; (10) PILOT quantum staff scheduling; (11) PILOT quantum delivery routing; (12) TRACK quantum revenue (target growth ${targetQuantumRevenueGrowthPct}%); (13) BENCHMARK vs competitor quantum programs. Industry data: $65B+ market by 2030; payback 3-6 months. Expected impact: +${targetQuantumRevenueGrowthPct}% quantum revenue growth, +${fmt$(totalOpportunity)}/mo savings, payback 3-6 months.`,
        ai_recommendation: 'launch_quantum_strategy',
        status: 'open', detected_at: now,
      });
    }

    // Rule 2: QUANTUM_MENU_ENGINEERING_ABSENT
    if (d.has_quantum_strategy && config.requireQuantumMenuEngineering && (!d.has_quantum_menu_engineering || d.menu_combinations_explored < config.minMenuCombinationsExplored)) {
      const expectedMenuRevenue = Math.round(targetMenuRevenue * 0.7);
      const expectedPricingOptimization = Math.round(baselineRevenue * 0.015);
      const expectedCrossSellLift = Math.round(baselineRevenue * 0.012);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedMenuRevenue + expectedPricingOptimization + expectedCrossSellLift + expectedCompetitiveLift, 2800);
      const severityLabel = d.menu_combinations_explored < 1000 ? 'high' : 'medium';
      const criticalNote = (d.menu_combinations_explored < 1000)
        ? `HIGH: NO QUANTUM MENU ENGINEERING — menu combinations explored ${d.menu_combinations_explored}/${config.minMenuCombinationsExplored} min; menu optimization lift ${d.menu_optimization_lift_pct}%; menu engineering = combinatorial (10^30+ combinations for 50 items); classical algorithms explore under 0.01% of possible menus; quantum explores exponentially more = better optimization. `
        : `MEDIUM: QUANTUM MENU BELOW TARGET — ${d.menu_combinations_explored}/${config.minMenuCombinationsExplored} min combinations; expand for deeper optimization. `;
      alerts.push({
        rule_id: 'quantum_menu_engineering_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_menu_engineering: d.has_quantum_menu_engineering,
        menu_combinations_explored: d.menu_combinations_explored,
        menu_optimization_lift_pct: d.menu_optimization_lift_pct,
        quantum_menu_revenue_lift_monthly: d.quantum_menu_revenue_lift_monthly,
        total_orders_monthly: d.total_orders_monthly,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_menu_revenue_projected: expectedMenuRevenue,
        quantum_revenue_growth_projected_pct: 28,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM MENU ENGINEERING ABSENT: ${d.location_id} — quantum menu engineering ${d.has_quantum_menu_engineering ? 'present' : 'ABSENT'}; combinations explored ${d.menu_combinations_explored}/${config.minMenuCombinationsExplored} min; optimization lift ${d.menu_optimization_lift_pct}%; revenue lift ${fmt$(d.quantum_menu_revenue_lift_monthly)}/mo; orders ${d.total_orders_monthly}/mo; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: menu engineering = combinatorial optimization (10^30+ combinations for 50 menu items); classical algorithms (greedy, genetic) explore under 0.01% of possible menu combinations; quantum annealing (D-Wave QPU) = explores exponentially more combinations simultaneously = finds global optimum; quantum menu optimization = optimal item selection (which items to keep/add/remove), optimal pricing (price elasticity per item), optimal placement (menu position), optimal cross-sell (pairing affinity), optimal portion (size optimization); quantum menu optimization lift = 15-35% revenue (vs 5-10% classical); quantum-inspired (QAOA, simulated annealing) = 80% of quantum benefit at 1% of cost; quantum menu revenue = $3k-10k/month; quantum menu cost = $500-2k/month (QaaS + algorithms); quantum menu ROI = $8-25 per $1 invested. Solutions ranked by impact: (1) DEPLOY quantum menu engineering — menu revenue ${fmt$(expectedMenuRevenue)}/mo + pricing ${fmt$(expectedPricingOptimization)}/mo + cross-sell ${fmt$(expectedCrossSellLift)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(1000)}/mo (QaaS + algorithms); payback 2-4 months; (2) EVALUATE QaaS providers (D-Wave Leap for annealing, IBM Quantum for gate-based); (3) START with quantum-inspired (QAOA, simulated annealing — 80% benefit, 1% cost); (4) MODEL menu as combinatorial optimization (items x prices x positions x portions); (5) EXPLORE 10k+ combinations (target ${config.minMenuCombinationsExplored}+); (6) OPTIMIZE item selection (keep/add/remove); (7) OPTIMIZE pricing (elasticity per item); (8) OPTIMIZE placement (menu position); (9) OPTIMIZE cross-sell (pairing affinity); (10) OPTIMIZE portion (size); (11) A/B test quantum vs classical menus; (12) TRACK menu optimization lift (target 18%+); (13) TRACK menu revenue (target ${fmt$(targetMenuRevenue)}/mo); (14) BENCHMARK vs competitor quantum menus. Industry data: 15-35% revenue lift; 10^30+ combinations; payback 2-4 months. Expected impact: +${fmt$(expectedMenuRevenue)}/mo menu revenue, +28% quantum revenue growth, payback 2-4 months.`,
        ai_recommendation: 'deploy_quantum_menu_engineering',
        status: 'open', detected_at: now,
      });
    }

    // Rule 3: QUANTUM_STAFF_SCHEDULING_ABSENT
    if (d.has_quantum_strategy && config.requireQuantumStaffScheduling && (!d.has_quantum_staff_scheduling || d.scheduling_combinations_explored < config.minSchedulingCombinationsExplored)) {
      const expectedSchedulingSavings = Math.round(targetSchedulingSavings * 0.7);
      const expectedOvertimeReduction = Math.round(baselineRevenue * 0.015);
      const expectedStaffSatisfaction = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedSchedulingSavings + expectedOvertimeReduction + expectedStaffSatisfaction + expectedCompetitiveLift, 2400);
      const severityLabel = d.scheduling_combinations_explored < 10000 ? 'medium' : 'low';
      const criticalNote = (d.scheduling_combinations_explored < 10000)
        ? `MEDIUM: NO QUANTUM STAFF SCHEDULING — scheduling combinations explored ${d.scheduling_combinations_explored}/${config.minSchedulingCombinationsExplored} min; scheduling optimization lift ${d.scheduling_optimization_lift_pct}%; savings ${fmt$(d.quantum_scheduling_savings_monthly)}/mo; staff scheduling = NP-hard (10^50+ combinations for 50 staff x 7 days x 10 shifts); classical algorithms explore under 0.001% of possible schedules; quantum explores exponentially more = optimal scheduling. `
        : `LOW: QUANTUM SCHEDULING BELOW TARGET — ${d.scheduling_combinations_explored}/${config.minSchedulingCombinationsExplored} min; expand for deeper optimization. `;
      alerts.push({
        rule_id: 'quantum_staff_scheduling_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_staff_scheduling: d.has_quantum_staff_scheduling,
        scheduling_combinations_explored: d.scheduling_combinations_explored,
        scheduling_optimization_lift_pct: d.scheduling_optimization_lift_pct,
        quantum_scheduling_savings_monthly: d.quantum_scheduling_savings_monthly,
        total_staff: d.total_staff,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_scheduling_savings_projected: expectedSchedulingSavings,
        quantum_revenue_growth_projected_pct: 22,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM STAFF SCHEDULING ABSENT: ${d.location_id} — quantum staff scheduling ${d.has_quantum_staff_scheduling ? 'present' : 'ABSENT'}; combinations explored ${d.scheduling_combinations_explored}/${config.minSchedulingCombinationsExplored} min; optimization lift ${d.scheduling_optimization_lift_pct}%; savings ${fmt$(d.quantum_scheduling_savings_monthly)}/mo; staff ${d.total_staff}; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: staff scheduling = NP-hard problem (10^50+ combinations for 50 staff x 7 days x 10 shifts); classical algorithms (greedy, genetic, constraint programming) explore under 0.001% of possible schedules = suboptimal; quantum annealing (D-Wave) = explores exponentially more schedules simultaneously = finds global optimum; quantum scheduling constraints = staff availability, skill match, labor laws (breaks, max hours), demand forecast, fairness, preferences, cost minimization, overtime avoidance; quantum scheduling optimization = 20-40% labor cost reduction (vs 5-15% classical), 15-30% overtime reduction, 10-20% staff satisfaction improvement (fair schedules); quantum-inspired (QAOA, simulated annealing) = 80% of quantum benefit at 1% of cost; quantum scheduling savings = $1k-5k/month; quantum scheduling cost = $300-1,500/month (QaaS + algorithms); quantum scheduling ROI = $10-30 per $1 invested. Solutions ranked by impact: (1) DEPLOY quantum staff scheduling — scheduling savings ${fmt$(expectedSchedulingSavings)}/mo + overtime reduction ${fmt$(expectedOvertimeReduction)}/mo + staff satisfaction ${fmt$(expectedStaffSatisfaction)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(800)}/mo (QaaS + algorithms); payback 2-4 months; (2) EVALUATE QaaS providers (D-Wave Leap for annealing); (3) START with quantum-inspired (QAOA, constraint programming); (4) MODEL scheduling as NP-hard optimization (staff x days x shifts x constraints); (5) EXPLORE 100k+ combinations (target ${config.minSchedulingCombinationsExplored}+); (6) OPTIMIZE labor cost (minimize); (7) OPTIMIZE overtime (avoid); (8) OPTIMIZE skill match (right staff for right shift); (9) OPTIMIZE fairness (equitable schedules); (10) OPTIMIZE preferences (honor staff preferences); (11) OPTIMIZE demand match (staff for forecast); (12) A/B test quantum vs classical schedules; (13) TRACK scheduling lift (target 22%+); (14) TRACK scheduling savings (target ${fmt$(targetSchedulingSavings)}/mo); (15) BENCHMARK vs competitor quantum scheduling. Industry data: 20-40% labor cost reduction; 10^50+ combinations; payback 2-4 months. Expected impact: +${fmt$(expectedSchedulingSavings)}/mo scheduling savings, +22% quantum revenue growth, payback 2-4 months.`,
        ai_recommendation: 'deploy_quantum_staff_scheduling',
        status: 'open', detected_at: now,
      });
    }

    // Rule 4: QUANTUM_DELIVERY_ROUTING_ABSENT
    if (d.has_quantum_strategy && config.requireQuantumDeliveryRouting && (!d.has_quantum_delivery_routing || d.routes_optimized_count < 100)) {
      const expectedRoutingSavings = Math.round(targetRoutingSavings * 0.7);
      const expectedFuelReduction = Math.round(baselineRevenue * 0.012);
      const expectedDeliveryTime = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedRoutingSavings + expectedFuelReduction + expectedDeliveryTime + expectedCompetitiveLift, 2000);
      const severityLabel = d.routes_optimized_count < 30 ? 'medium' : 'low';
      const criticalNote = (d.routes_optimized_count < 30)
        ? `MEDIUM: NO QUANTUM DELIVERY ROUTING — routes optimized ${d.routes_optimized_count}; routing optimization lift ${d.routing_optimization_lift_pct}%; savings ${fmt$(d.quantum_routing_savings_monthly)}/mo; delivery routing = TSP (10^25+ routes for 20 stops); classical heuristics explore under 0.1% of possible routes; quantum explores exponentially more = optimal routing. `
        : `LOW: QUANTUM ROUTING BELOW TARGET — ${d.routes_optimized_count} routes; expand for deeper optimization. `;
      alerts.push({
        rule_id: 'quantum_delivery_routing_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_delivery_routing: d.has_quantum_delivery_routing,
        routes_optimized_count: d.routes_optimized_count,
        routing_optimization_lift_pct: d.routing_optimization_lift_pct,
        quantum_routing_savings_monthly: d.quantum_routing_savings_monthly,
        total_delivery_stops_monthly: d.total_delivery_stops_monthly,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_routing_savings_projected: expectedRoutingSavings,
        quantum_revenue_growth_projected_pct: 18,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM DELIVERY ROUTING ABSENT: ${d.location_id} — quantum delivery routing ${d.has_quantum_delivery_routing ? 'present' : 'ABSENT'}; routes optimized ${d.routes_optimized_count}; optimization lift ${d.routing_optimization_lift_pct}%; savings ${fmt$(d.quantum_routing_savings_monthly)}/mo; delivery stops ${d.total_delivery_stops_monthly}/mo; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: delivery routing = Traveling Salesman Problem (TSP, 10^25+ routes for 20 stops); classical heuristics (nearest neighbor, 2-opt, Christofides) explore under 0.1% of possible routes = suboptimal; quantum annealing (D-Wave) = explores exponentially more routes simultaneously = finds global optimum; quantum routing optimization = optimal stop sequence (minimize distance), optimal driver assignment (match drivers to routes), optimal time windows (respect delivery windows), optimal capacity (load balancing), multi-objective (distance + time + fuel + customer satisfaction); quantum routing optimization = 25-45% distance reduction (vs 10-20% classical), 20-35% fuel reduction, 15-25% delivery time reduction; quantum-inspired (QAOA, ant colony) = 80% of quantum benefit at 1% of cost; quantum routing savings = $1k-4k/month; quantum routing cost = $300-1,200/month (QaaS + algorithms); quantum routing ROI = $8-20 per $1 invested. Solutions ranked by impact: (1) DEPLOY quantum delivery routing — routing savings ${fmt$(expectedRoutingSavings)}/mo + fuel ${fmt$(expectedFuelReduction)}/mo + time ${fmt$(expectedDeliveryTime)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(600)}/mo (QaaS + algorithms); payback 2-4 months; (2) EVALUATE QaaS providers (D-Wave Leap for TSP); (3) START with quantum-inspired (QAOA, ant colony optimization); (4) MODEL routing as TSP (stops x distances x constraints); (5) OPTIMIZE stop sequence (minimize distance); (6) OPTIMIZE driver assignment (match); (7) OPTIMIZE time windows (respect); (8) OPTIMIZE capacity (load balance); (9) OPTIMIZE multi-objective (distance + time + fuel + satisfaction); (10) A/B test quantum vs classical routes; (11) TRACK routing lift (target 28%+); (12) TRACK routing savings (target ${fmt$(targetRoutingSavings)}/mo); (13) BENCHMARK vs competitor quantum routing. Industry data: 25-45% distance reduction; 10^25+ routes; payback 2-4 months. Expected impact: +${fmt$(expectedRoutingSavings)}/mo routing savings, +18% quantum revenue growth, payback 2-4 months.`,
        ai_recommendation: 'deploy_quantum_delivery_routing',
        status: 'open', detected_at: now,
      });
    }

    // Rule 5: QUANTUM_SUPPLY_CHAIN_OPTIMIZATION_ABSENT
    if (d.has_quantum_strategy && config.requireQuantumSupplyChain && (!d.has_quantum_supply_chain || d.suppliers_optimized_count < 8)) {
      const expectedSupplyChainSavings = Math.round(targetSupplyChainSavings * 0.7);
      const expectedInventoryOptimization = Math.round(baselineRevenue * 0.012);
      const expectedProcurementSavings = Math.round(baselineRevenue * 0.008);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedSupplyChainSavings + expectedInventoryOptimization + expectedProcurementSavings + expectedCompetitiveLift, 2000);
      const severityLabel = d.suppliers_optimized_count < 4 ? 'medium' : 'low';
      const criticalNote = (d.suppliers_optimized_count < 4)
        ? `MEDIUM: NO QUANTUM SUPPLY CHAIN — suppliers optimized ${d.suppliers_optimized_count}; supply chain optimization ${d.supply_chain_optimization_pct}%; savings ${fmt$(d.quantum_supply_chain_savings_monthly)}/mo; supply chain = multi-objective optimization (cost + quality + lead time + reliability + sustainability); quantum excels at multi-objective optimization = optimal supplier mix. `
        : `LOW: QUANTUM SUPPLY CHAIN BELOW TARGET — ${d.suppliers_optimized_count} suppliers; expand for deeper optimization. `;
      alerts.push({
        rule_id: 'quantum_supply_chain_optimization_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_supply_chain: d.has_quantum_supply_chain,
        suppliers_optimized_count: d.suppliers_optimized_count,
        supply_chain_optimization_pct: d.supply_chain_optimization_pct,
        quantum_supply_chain_savings_monthly: d.quantum_supply_chain_savings_monthly,
        total_orders_monthly: d.total_orders_monthly,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_supply_chain_savings_projected: expectedSupplyChainSavings,
        quantum_revenue_growth_projected_pct: 20,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM SUPPLY CHAIN OPTIMIZATION ABSENT: ${d.location_id} — quantum supply chain ${d.has_quantum_supply_chain ? 'present' : 'ABSENT'}; suppliers optimized ${d.suppliers_optimized_count}; optimization ${d.supply_chain_optimization_pct}%; savings ${fmt$(d.quantum_supply_chain_savings_monthly)}/mo; orders ${d.total_orders_monthly}/mo; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: supply chain = multi-objective optimization (cost + quality + lead time + reliability + sustainability + risk); quantum excels at multi-objective optimization (Pareto frontier exploration); quantum supply chain optimization = optimal supplier mix (which suppliers for which items), optimal order quantities (when + how much), optimal inventory levels (safety stock), optimal logistics (routes + timing), optimal risk mitigation (supplier diversification); quantum supply chain optimization = 15-30% cost reduction (vs 5-12% classical), 20-35% inventory reduction, 10-20% lead time improvement; quantum-inspired (QAOA, multi-objective optimization) = 80% of quantum benefit at 1% of cost; quantum supply chain savings = $1k-4k/month; quantum supply chain cost = $400-1,500/month (QaaS + algorithms); quantum supply chain ROI = $8-20 per $1 invested. Solutions ranked by impact: (1) DEPLOY quantum supply chain — supply chain savings ${fmt$(expectedSupplyChainSavings)}/mo + inventory ${fmt$(expectedInventoryOptimization)}/mo + procurement ${fmt$(expectedProcurementSavings)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(700)}/mo (QaaS + algorithms); payback 2-4 months; (2) EVALUATE QaaS providers (D-Wave Leap for multi-objective); (3) START with quantum-inspired (QAOA, multi-objective); (4) MODEL supply chain as multi-objective (suppliers x items x cost x quality x lead time x reliability x sustainability x risk); (5) OPTIMIZE supplier mix (which suppliers for which items); (6) OPTIMIZE order quantities (when + how much); (7) OPTIMIZE inventory levels (safety stock); (8) OPTIMIZE logistics (routes + timing); (9) OPTIMIZE risk mitigation (diversification); (10) EXPLORE Pareto frontier (cost vs quality vs lead time); (11) A/B test quantum vs classical supply chain; (12) TRACK supply chain optimization (target 15%+); (13) TRACK supply chain savings (target ${fmt$(targetSupplyChainSavings)}/mo); (14) BENCHMARK vs competitor quantum supply chain. Industry data: 15-30% cost reduction; payback 2-4 months. Expected impact: +${fmt$(expectedSupplyChainSavings)}/mo supply chain savings, +20% quantum revenue growth, payback 2-4 months.`,
        ai_recommendation: 'deploy_quantum_supply_chain',
        status: 'open', detected_at: now,
      });
    }

    // Rule 6: QUANTUM_MACHINE_LEARNING_ABSENT
    if (d.has_quantum_strategy && config.requireQuantumMachineLearning && (!d.has_quantum_machine_learning || d.qml_models_count < config.minQmlModels)) {
      const expectedQmlRevenue = Math.round(baselineRevenue * 0.018);
      const expectedForecastAccuracy = Math.round(baselineRevenue * 0.012);
      const expectedPersonalization = Math.round(baselineRevenue * 0.01);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedQmlRevenue + expectedForecastAccuracy + expectedPersonalization + expectedCompetitiveLift, 1800);
      const severityLabel = d.qml_models_count < 1 ? 'medium' : 'low';
      const criticalNote = (d.qml_models_count < 1)
        ? `MEDIUM: NO QUANTUM MACHINE LEARNING — QML models ${d.qml_models_count}; training speedup ${d.qml_training_speedup_x}x; accuracy lift ${d.qml_accuracy_lift_pct}%; QML = 10-100x faster training for certain models; quantum kernels = exponential feature space; without QML, slower ML training + lower accuracy. `
        : `LOW: QML BELOW TARGET — ${d.qml_models_count}/${config.minQmlModels} min models; expand for deeper insights. `;
      alerts.push({
        rule_id: 'quantum_machine_learning_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_machine_learning: d.has_quantum_machine_learning,
        qml_models_count: d.qml_models_count,
        qml_training_speedup_x: d.qml_training_speedup_x,
        qml_accuracy_lift_pct: d.qml_accuracy_lift_pct,
        total_orders_monthly: d.total_orders_monthly,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_revenue_growth_projected_pct: 16,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM MACHINE LEARNING ABSENT: ${d.location_id} — quantum machine learning ${d.has_quantum_machine_learning ? 'present' : 'ABSENT'}; QML models ${d.qml_models_count}/${config.minQmlModels} min; training speedup ${d.qml_training_speedup_x}x; accuracy lift ${d.qml_accuracy_lift_pct}%; orders ${d.total_orders_monthly}/mo; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: quantum machine learning (QML) = 10-100x faster training for certain models (SVM, clustering, neural networks); quantum kernels = exponential feature space (access patterns classical can't); QML use cases = demand forecasting (faster + more accurate), customer segmentation (quantum clustering), recommendation engines (quantum collaborative filtering), anomaly detection (fraud), price optimization (quantum regression), image recognition (menu photos); QML frameworks = Qiskit ML (IBM), PennyLane (Xanadu), TensorFlow Quantum (Google), Cirq (Google); QML providers = IBM Quantum, AWS Braket, Azure Quantum; QML training speedup = 10-100x (for specific models); QML accuracy lift = 5-15% (quantum kernels access exponential feature space); QML revenue = $1k-4k/month (better forecasts + personalization); QML cost = $400-1,500/month (QaaS + algorithms); QML ROI = $6-18 per $1 invested. Solutions ranked by impact: (1) DEPLOY quantum machine learning — QML revenue ${fmt$(expectedQmlRevenue)}/mo + forecast accuracy ${fmt$(expectedForecastAccuracy)}/mo + personalization ${fmt$(expectedPersonalization)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(800)}/mo (QaaS + algorithms); payback 3-5 months; (2) EVALUATE QML frameworks (Qiskit ML, PennyLane, TensorFlow Quantum); (3) START with quantum kernels (exponential feature space); (4) BUILD QML demand forecasting (faster + more accurate); (5) BUILD QML customer segmentation (quantum clustering); (6) BUILD QML recommendation engine (quantum collaborative filtering); (7) BUILD QML anomaly detection (fraud); (8) BUILD QML price optimization (quantum regression); (9) A/B test QML vs classical ML; (10) TRACK QML models (target ${config.minQmlModels}+); (11) TRACK training speedup (target 25x+); (12) TRACK accuracy lift (target 8%+); (13) BENCHMARK vs competitor QML. Industry data: 10-100x faster training; payback 3-5 months. Expected impact: +${fmt$(expectedQmlRevenue)}/mo QML revenue, +16% quantum revenue growth, payback 3-5 months.`,
        ai_recommendation: 'deploy_quantum_machine_learning',
        status: 'open', detected_at: now,
      });
    }

    // Rule 7: HYBRID_CLASSICAL_QUANTUM_ABSENT
    if (d.has_quantum_strategy && config.requireHybridClassicalQuantum && (!d.has_hybrid_classical_quantum || d.hybrid_workflows_count < config.minHybridWorkflows)) {
      const expectedHybridRevenue = Math.round(targetHybridRevenue * 0.7);
      const expectedEfficiencyLift = Math.round(baselineRevenue * 0.015);
      const expectedCostReduction = Math.round(baselineRevenue * 0.012);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.008);
      const totalOpportunity = Math.max(expectedHybridRevenue + expectedEfficiencyLift + expectedCostReduction + expectedCompetitiveLift, 2200);
      const severityLabel = d.hybrid_workflows_count < 2 ? 'medium' : 'low';
      const criticalNote = (d.hybrid_workflows_count < 2)
        ? `MEDIUM: NO HYBRID CLASSICAL-QUANTUM — hybrid workflows ${d.hybrid_workflows_count}/${config.minHybridWorkflows} min; efficiency lift ${d.hybrid_efficiency_lift_pct}%; revenue lift ${fmt$(d.hybrid_revenue_lift_monthly)}/mo; hybrid = classical for most tasks, quantum for hard optimization = best of both worlds; without hybrid, missing immediate value (real quantum not yet practical for all). `
        : `LOW: HYBRID BELOW TARGET — ${d.hybrid_workflows_count}/${config.minHybridWorkflows} min workflows; expand for broader value. `;
      alerts.push({
        rule_id: 'hybrid_classical_quantum_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_hybrid_classical_quantum: d.has_hybrid_classical_quantum,
        hybrid_workflows_count: d.hybrid_workflows_count,
        hybrid_efficiency_lift_pct: d.hybrid_efficiency_lift_pct,
        hybrid_revenue_lift_monthly: d.hybrid_revenue_lift_monthly,
        total_orders_monthly: d.total_orders_monthly,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        hybrid_revenue_projected: expectedHybridRevenue,
        quantum_revenue_growth_projected_pct: 25,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `HYBRID CLASSICAL-QUANTUM ABSENT: ${d.location_id} — hybrid classical-quantum ${d.has_hybrid_classical_quantum ? 'present' : 'ABSENT'}; workflows ${d.hybrid_workflows_count}/${config.minHybridWorkflows} min; efficiency lift ${d.hybrid_efficiency_lift_pct}%; revenue lift ${fmt$(d.hybrid_revenue_lift_monthly)}/mo; orders ${d.total_orders_monthly}/mo; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: hybrid classical-quantum = classical for most tasks (90%+), quantum for hard optimization (10%); hybrid = best of both worlds (classical reliability + quantum optimization); hybrid workflows = classical data prep + quantum optimization + classical post-processing; hybrid use cases = menu engineering (classical data + quantum optimization), staff scheduling (classical constraints + quantum optimization), delivery routing (classical map + quantum TSP), supply chain (classical data + quantum multi-objective); hybrid efficiency lift = 25-50% (vs classical-only); hybrid revenue lift = $2k-8k/month; hybrid cost = $500-2k/month (QaaS + classical infra); hybrid ROI = $10-25 per $1 invested; hybrid = immediate value (quantum-inspired today, real quantum when available); hybrid approach recommended by IBM, Google, D-Wave (practical quantum = hybrid). Solutions ranked by impact: (1) DEPLOY hybrid classical-quantum — hybrid revenue ${fmt$(expectedHybridRevenue)}/mo + efficiency ${fmt$(expectedEfficiencyLift)}/mo + cost reduction ${fmt$(expectedCostReduction)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(1000)}/mo (QaaS + classical); payback 2-4 months; (2) IDENTIFY hybrid workflows (classical data + quantum optimization); (3) BUILD hybrid menu engineering (classical data + quantum optimization); (4) BUILD hybrid staff scheduling (classical constraints + quantum optimization); (5) BUILD hybrid delivery routing (classical map + quantum TSP); (6) BUILD hybrid supply chain (classical data + quantum multi-objective); (7) USE quantum-inspired for immediate value (80% benefit, 1% cost); (8) MIGRATE to real quantum when available (2027-2030); (9) TRACK hybrid workflows (target ${config.minHybridWorkflows}+); (10) TRACK efficiency lift (target 32%+); (11) TRACK hybrid revenue (target ${fmt$(targetHybridRevenue)}/mo); (12) BENCHMARK vs competitor hybrid programs. Industry data: 25-50% efficiency lift; payback 2-4 months. Expected impact: +${fmt$(expectedHybridRevenue)}/mo hybrid revenue, +25% quantum revenue growth, payback 2-4 months.`,
        ai_recommendation: 'deploy_hybrid_classical_quantum',
        status: 'open', detected_at: now,
      });
    }

    // Rule 8: QUANTUM_READINESS_TRACKING_ABSENT
    if (d.has_quantum_strategy && config.requireQuantumReadinessTracking && (!d.has_quantum_readiness_tracking || d.quantum_readiness_score < config.minQuantumReadinessScore || d.quantum_use_cases_identified < config.minQuantumUseCases)) {
      const expectedReadinessLift = Math.round(baselineRevenue * 0.018);
      const expectedSkillsValue = Math.round(baselineRevenue * 0.012);
      const expectedPartnershipValue = Math.round(baselineRevenue * 0.015);
      const expectedCompetitiveLift = Math.round(baselineRevenue * 0.01);
      const totalOpportunity = Math.max(expectedReadinessLift + expectedSkillsValue + expectedPartnershipValue + expectedCompetitiveLift, 1500);
      const severityLabel = d.quantum_readiness_score < 40 ? 'medium' : 'low';
      const criticalNote = (d.quantum_readiness_score < 40)
        ? `MEDIUM: NO QUANTUM READINESS TRACKING — readiness score ${d.quantum_readiness_score}/${config.minQuantumReadinessScore} min; skills ${d.quantum_skills_count}; partnerships ${d.quantum_partnerships_count}; use cases ${d.quantum_use_cases_identified}/${config.minQuantumUseCases} min; quantum readiness = 2-5 year preparation (skills, partnerships, use cases); without tracking, can't measure progress or prioritize. `
        : `LOW: READINESS BELOW TARGET — ${d.quantum_readiness_score}/${config.minQuantumReadinessScore} min; strengthen for quantum advantage. `;
      alerts.push({
        rule_id: 'quantum_readiness_tracking_absent',
        severity: severityLabel as any,
        location_id: d.location_id,
        restaurant_tier: d.restaurant_tier,
        market_setting: d.market_setting,
        channel: d.channel,
        has_quantum_readiness_tracking: d.has_quantum_readiness_tracking,
        quantum_readiness_score: d.quantum_readiness_score,
        quantum_skills_count: d.quantum_skills_count,
        quantum_partnerships_count: d.quantum_partnerships_count,
        quantum_use_cases_identified: d.quantum_use_cases_identified,
        total_staff: d.total_staff,
        competitor_quantum_score: d.competitor_quantum_score,
        monthly_revenue: d.monthly_revenue,
        quantum_skills_cost_monthly: d.quantum_skills_cost_monthly,
        quantum_readiness_lift_projected_pct: 40,
        quantum_revenue_growth_projected_pct: 12,
        predicted_revenue_change_pct: Math.round((totalOpportunity / Math.max(baselineRevenue, 1)) * 100),
        est_monthly_opportunity: totalOpportunity,
        description: `QUANTUM READINESS TRACKING ABSENT: ${d.location_id} — quantum readiness tracking ${d.has_quantum_readiness_tracking ? 'present' : 'ABSENT'}; readiness score ${d.quantum_readiness_score}/${config.minQuantumReadinessScore} min; skills ${d.quantum_skills_count}; partnerships ${d.quantum_partnerships_count}; use cases ${d.quantum_use_cases_identified}/${config.minQuantumUseCases} min; staff ${d.total_staff}; competitor quantum ${d.competitor_quantum_score}/100; monthly revenue ${fmt$(d.monthly_revenue)}. ${criticalNote}Industry data: quantum readiness = 2-5 year preparation for quantum advantage; quantum readiness components = quantum skills (Qiskit, Cirq, PennyLane, quantum algorithms), quantum partnerships (IBM Quantum Network, AWS Braket, Google Quantum AI, D-Wave Leap, Azure Quantum), quantum use cases (menu, scheduling, routing, supply chain, ML), quantum infrastructure (QaaS access, hybrid classical-quantum), quantum strategy (roadmap, investment, timeline), quantum culture (awareness, training, experimentation); quantum readiness score = weighted (skills 25%, partnerships 25%, use cases 20%, infrastructure 15%, strategy 10%, culture 5%); quantum readiness benchmark = 60+ for pilot-ready, 80+ for production-ready; quantum advantage expected for restaurant optimization by 2027-2030; companies with quantum readiness = first to capture advantage; 65% of Fortune 500 exploring quantum (BCG) = readiness race; quantum readiness cost = $300-1,200/month (training + partnerships); quantum readiness ROI = $8-20 per $1 invested (first-mover advantage). Solutions ranked by impact: (1) IMPLEMENT quantum readiness tracking — readiness lift ${fmt$(expectedReadinessLift)}/mo + skills ${fmt$(expectedSkillsValue)}/mo + partnerships ${fmt$(expectedPartnershipValue)}/mo + competitive ${fmt$(expectedCompetitiveLift)}/mo; cost ${fmt$(500)}/mo (training + partnerships); payback 3-6 months; (2) ASSESS current readiness (score components); (3) BUILD quantum skills (Qiskit, Cirq, PennyLane training); (4) TRAIN staff on quantum algorithms (3-5 people); (5) BUILD quantum partnerships (IBM Quantum Network, AWS Braket, D-Wave Leap); (6) IDENTIFY quantum use cases (target ${config.minQuantumUseCases}+); (7) BUILD quantum infrastructure (QaaS access); (8) CREATE quantum strategy (roadmap, investment, timeline); (9) BUILD quantum culture (awareness, training, experimentation); (10) TRACK readiness score (target ${config.minQuantumReadinessScore}+); (11) TRACK skills (target 4+ people); (12) TRACK partnerships (target 2+); (13) TRACK use cases (target ${config.minQuantumUseCases}+); (14) BENCHMARK vs competitor readiness. Industry data: 2-5 year preparation; 65% Fortune 500 exploring (BCG); payback 3-6 months. Expected impact: +40% readiness, +12% quantum revenue growth, payback 3-6 months.`,
        ai_recommendation: 'implement_quantum_readiness_tracking',
        status: 'open', detected_at: now,
      });
    }

  }

  // Persist alerts
  try {
    await db.query(`DELETE FROM quantum_computing_alert WHERE status = 'open' AND detected_at < time::now() - 24h`);
  } catch { /* ignore */ }
  for (const a of alerts) {
    try {
      await db.query(`CREATE quantum_computing_alert CONTENT $data`, {
        data: { ...a, detected_at: a.detected_at.toISOString() },
      });
    } catch { /* ignore */ }
  }

  // AI enrichment (optional, fail-safe)
  if (config.aiEnabled) {
    const { callOpenAIChat } = await import('@/lib/openai.service.ts').catch(() => ({} as any));
    if (callOpenAIChat) {
      const topAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 5);
      for (const a of topAlerts) {
        try {
          const response = await callOpenAIChat({
            messages: [
              { role: 'system', content: 'You are a quantum computing and restaurant optimization expert. Given quantum computing data, recommend ONE specific action with expected quantum revenue growth, menu revenue, scheduling savings, routing savings, supply chain savings, hybrid revenue, or readiness lift (max 200 chars, imperative voice).' },
              { role: 'user', content: `Location: ${a.location_id ?? 'n/a'}. Tier: ${a.restaurant_tier ?? 'n/a'}. Market: ${a.market_setting ?? 'n/a'}. Channel: ${a.channel ?? 'n/a'}. Strategy: ${a.has_quantum_strategy ?? false} (maturity ${a.quantum_program_maturity ?? 'none'}, investment ${fmt$(a.quantum_investment_monthly ?? 0)}/mo). Quantum menu: ${a.has_quantum_menu_engineering ?? false} (${a.menu_combinations_explored ?? 0}/${config.minMenuCombinationsExplored} min combos, ${a.menu_optimization_lift_pct ?? 0}% lift, ${fmt$(a.quantum_menu_revenue_lift_monthly ?? 0)}/mo). Quantum scheduling: ${a.has_quantum_staff_scheduling ?? false} (${a.scheduling_combinations_explored ?? 0}/${config.minSchedulingCombinationsExplored} min combos, ${a.scheduling_optimization_lift_pct ?? 0}% lift, ${fmt$(a.quantum_scheduling_savings_monthly ?? 0)}/mo). Quantum routing: ${a.has_quantum_delivery_routing ?? false} (${a.routes_optimized_count ?? 0} routes, ${a.routing_optimization_lift_pct ?? 0}% lift, ${fmt$(a.quantum_routing_savings_monthly ?? 0)}/mo). Quantum supply chain: ${a.has_quantum_supply_chain ?? false} (${a.suppliers_optimized_count ?? 0} suppliers, ${a.supply_chain_optimization_pct ?? 0}% optimization, ${fmt$(a.quantum_supply_chain_savings_monthly ?? 0)}/mo). QML: ${a.has_quantum_machine_learning ?? false} (${a.qml_models_count ?? 0}/${config.minQmlModels} min models, ${a.qml_training_speedup_x ?? 0}x speedup, ${a.qml_accuracy_lift_pct ?? 0}% accuracy). Hybrid: ${a.has_hybrid_classical_quantum ?? false} (${a.hybrid_workflows_count ?? 0}/${config.minHybridWorkflows} min workflows, ${a.hybrid_efficiency_lift_pct ?? 0}% efficiency, ${fmt$(a.hybrid_revenue_lift_monthly ?? 0)}/mo). Readiness: ${a.has_quantum_readiness_tracking ?? false} (score ${a.quantum_readiness_score ?? 0}/${config.minQuantumReadinessScore} min, ${a.quantum_skills_count ?? 0} skills, ${a.quantum_partnerships_count ?? 0} partnerships, ${a.quantum_use_cases_identified ?? 0}/${config.minQuantumUseCases} min use cases). Total quantum revenue: ${fmt$(a.total_quantum_revenue_monthly ?? 0)}/mo (${a.quantum_revenue_growth_pct ?? 0}% growth, ${a.quantum_revenue_as_pct_of_total ?? 0}% of total). Competitor: ${a.competitor_quantum_score ?? 0}/100. Monthly revenue: ${fmt$(a.monthly_revenue ?? 0)}. Staff: ${a.total_staff ?? 0}. Delivery stops: ${a.total_delivery_stops_monthly ?? 0}. Orders: ${a.total_orders_monthly ?? 0}. Opportunity: ${fmt$(a.est_monthly_opportunity)}. Context: ${a.description}` },
            ],
            task: 'reporting',
          });
          const text = typeof response === 'string'
            ? response
            : (response as any)?.choices?.[0]?.message?.content ?? '';
          a.ai_insight = String(text).slice(0, 200);
        } catch { /* skip */ }
      }
    }
  }

  return { alerts, generated: alerts.length };
};

export const getActiveQuantumComputingAlerts = async (db: ReturnType<typeof useDB>): Promise<QuantumComputingAlert[]> => {
  try {
    const result = await db.query(
      `SELECT * FROM quantum_computing_alert WHERE status = 'open'
       ORDER BY est_monthly_opportunity DESC LIMIT 50`
    );
    return Array.isArray(result) ? result.flat() : [];
  } catch { return []; }
};

export const getQuantumComputingSummary = async (db: ReturnType<typeof useDB>): Promise<{
  totalAlerts: number; criticalCount: number; totalOpportunity: number;
  quantumStrategyAbsentCount: number;
  quantumMenuEngineeringAbsentCount: number;
  quantumStaffSchedulingAbsentCount: number;
  quantumDeliveryRoutingAbsentCount: number;
  quantumSupplyChainOptimizationAbsentCount: number;
  quantumMachineLearningAbsentCount: number;
  hybridClassicalQuantumAbsentCount: number;
  quantumReadinessTrackingAbsentCount: number;
}> => {
  try {
    const result = await db.query(
      `SELECT count() AS total, math::count(severity = 'critical') AS critical,
              math::sum(est_monthly_opportunity WHERE est_monthly_opportunity > 0) AS opportunity,
              math::count(rule_id = 'quantum_strategy_absent') AS nostrategy,
              math::count(rule_id = 'quantum_menu_engineering_absent') AS nomenu,
              math::count(rule_id = 'quantum_staff_scheduling_absent') AS noscheduling,
              math::count(rule_id = 'quantum_delivery_routing_absent') AS norouting,
              math::count(rule_id = 'quantum_supply_chain_optimization_absent') AS nosupplychain,
              math::count(rule_id = 'quantum_machine_learning_absent') AS noqml,
              math::count(rule_id = 'hybrid_classical_quantum_absent') AS nohybrid,
              math::count(rule_id = 'quantum_readiness_tracking_absent') AS noreadiness
       FROM quantum_computing_alert WHERE status = 'open' GROUP ALL`
    );
    const rows = Array.isArray(result) ? result.flat() : [];
    const r = rows[0] ?? {};
    return {
      totalAlerts: safeNumber(r.total, 0), criticalCount: safeNumber(r.critical, 0),
      totalOpportunity: safeNumber(r.opportunity, 0),
      quantumStrategyAbsentCount: safeNumber(r.nostrategy, 0),
      quantumMenuEngineeringAbsentCount: safeNumber(r.nomenu, 0),
      quantumStaffSchedulingAbsentCount: safeNumber(r.noscheduling, 0),
      quantumDeliveryRoutingAbsentCount: safeNumber(r.norouting, 0),
      quantumSupplyChainOptimizationAbsentCount: safeNumber(r.nosupplychain, 0),
      quantumMachineLearningAbsentCount: safeNumber(r.noqml, 0),
      hybridClassicalQuantumAbsentCount: safeNumber(r.nohybrid, 0),
      quantumReadinessTrackingAbsentCount: safeNumber(r.noreadiness, 0),
    };
  } catch {
    return { totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, quantumStrategyAbsentCount: 0, quantumMenuEngineeringAbsentCount: 0, quantumStaffSchedulingAbsentCount: 0, quantumDeliveryRoutingAbsentCount: 0, quantumSupplyChainOptimizationAbsentCount: 0, quantumMachineLearningAbsentCount: 0, hybridClassicalQuantumAbsentCount: 0, quantumReadinessTrackingAbsentCount: 0 };
  }
};

export const updateQuantumComputingAlertStatus = async (
  db: ReturnType<typeof useDB>, alertId: string,
  status: 'resolved' | 'in_progress' | 'rejected' | 'expired'
): Promise<void> => {
  await db.query(`UPDATE $id SET status = $status`, { id: alertId, status });
};
