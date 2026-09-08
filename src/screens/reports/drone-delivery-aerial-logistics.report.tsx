/**
 * AI Drone Delivery & Autonomous Aerial Logistics Optimizer — predicts
 * how drone delivery and autonomous aerial logistics (drone fleet
 * management, delivery route optimization, regulatory compliance,
 * weather adaptation, payload optimization, battery management,
 * delivery speed, customer experience, cost per delivery) impacts
 * delivery revenue, speed, cost reduction, market reach, satisfaction.
 *
 * 211th POSR-exclusive differentiator.
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
  faRocket, faTruckFast, faRoute, faShieldHalved, faBolt,
  faMapLocationDot, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runDroneDeliveryEngine, getActiveDroneDeliveryAlerts, getDroneDeliverySummary,
  updateDroneDeliveryAlertStatus, readDroneDeliveryConfig, DEFAULT_DRONE_DELIVERY_CONFIG,
  type DroneDeliveryAlert,
} from "@/lib/drone-delivery-aerial-logistics.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  drone_delivery_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faRocket,          label: 'NO DATA MONETIZATION' },
  drone_fleet_management_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faTruckFast,              label: 'NO API PROGRAM' },
  drone_delivery_route_optimization_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faRoute,      label: 'NO LICENSING' },
  drone_regulatory_compliance_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faShieldHalved,         label: 'THIN PARTNER ECOSYS' },
  drone_weather_adaptation_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faBolt,       label: 'NO BENCHMARKING' },
  drone_payload_packaging_optimization_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faMapLocationDot,             label: 'NO PREDICTIVE API' },
  drone_battery_charging_infrastructure_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faShieldHalved,      label: 'WEAK PRIVACY' },
  drone_delivery_roi_tracking_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function DroneDeliveryAerialLogisticsScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<DroneDeliveryAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, droneDeliveryStrategyAbsentCount: 0, droneFleetManagementAbsentCount: 0, droneDeliveryRouteOptimizationAbsentCount: 0, droneRegulatoryComplianceAbsentCount: 0, droneWeatherAdaptationAbsentCount: 0, dronePayloadPackagingOptimizationAbsentCount: 0, droneBatteryChargingInfrastructureAbsentCount: 0, droneDeliveryRoiTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_DRONE_DELIVERY_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readDroneDeliveryConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveDroneDeliveryAlerts(db), getDroneDeliverySummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[drone-delivery-aerial-logistics-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runDroneDeliveryEngine(db, config);
      toast.success(`Analyzed ${result.generated} drone delivery signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[drone-delivery-aerial-logistics-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateDroneDeliveryAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[drone-delivery-aerial-logistics-report] status failed', err);
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
      <DocumentTitle parts={["AI Drone Delivery & Aerial Logistics Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faRocket} className="text-violet-600" />
              AI Data Monetization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how drone delivery and autonomous aerial logistics (fleet management, route optimization, regulatory compliance, weather adaptation, payload optimization, battery infrastructure, ROI tracking) impacts delivery revenue, speed, cost reduction, market reach — drone delivery market $30B+ by 2030 (Markets and Markets); 3-5 min delivery (vs 25-40 min ground); $1-5/delivery cost (vs $5-10 ground); 72% want faster; 45% would pay premium; 50-70% last-mile cost reduction; 20-40% radius expansion; ROI $5-15 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faRocket} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze drone delivery'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faRocket} label="No drone delivery strategy" value={String(summary.droneDeliveryStrategyAbsentCount)} color={summary.droneDeliveryStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faTruckFast} label="No fleet mgmt / no route opt" value={String(summary.droneFleetManagementAbsentCount + summary.droneDeliveryRouteOptimizationAbsentCount)} color={(summary.droneFleetManagementAbsentCount + summary.droneDeliveryRouteOptimizationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="Thin partners / no benchmarking / no predictive" value={String(summary.droneRegulatoryComplianceAbsentCount + summary.droneWeatherAdaptationAbsentCount + summary.dronePayloadPackagingOptimizationAbsentCount)} color={(summary.droneRegulatoryComplianceAbsentCount + summary.droneWeatherAdaptationAbsentCount + summary.dronePayloadPackagingOptimizationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="Weak privacy / no valuation" value={String(summary.droneBatteryChargingInfrastructureAbsentCount + summary.droneDeliveryRoiTrackingAbsentCount)} color={(summary.droneBatteryChargingInfrastructureAbsentCount + summary.droneDeliveryRoiTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faRocket} spin className="text-4xl mb-3" />
            <p>Analyzing drone delivery & aerial logistics opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No drone delivery alerts</p>
            <p className="text-sm mt-1">Healthy drone delivery environment: active drone delivery strategy (platform: Wing/Manna/Flytrex, fleet 3+ drones); fleet management (utilization 60%+, uptime 90%+); aerial route optimization (delivery under 8min, efficiency 80+); regulatory compliance (FAA Part 135, LAANC, BVLOS, score 85+); weather adaptation (cancellation under 15%, wind+rain monitoring); payload optimization (utilization 70%+, drone-specific packaging); battery infrastructure (charging stations, battery 20-30min, uptime 90%+); ROI tracking (ROAS 3x+, cost $1-3/delivery); drone market $30B+ by 2030; 50-70% last-mile cost reduction; 20-40% radius expansion; ROI $5-15 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faRocket, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_drone_delivery_strategy != null && (
                            <span className={`text-xs ${alert.has_drone_delivery_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_drone_delivery_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.drone_delivery_revenue_monthly != null && alert.drone_delivery_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.drone_delivery_revenue_monthly)}/mo data rev ({alert.drone_delivery_volume_monthly ?? 0}%)</span>
                          )}
                          {alert.drone_delivery_cost_per_delivery != null && alert.drone_delivery_cost_per_delivery > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.drone_delivery_cost_per_delivery)}/mo API</span>
                          )}
                          {alert.ground_delivery_cost_per_delivery != null && alert.ground_delivery_cost_per_delivery > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.ground_delivery_cost_per_delivery)}/mo licensing</span>
                          )}
                          {alert.avg_drone_delivery_time_minutes != null && alert.avg_drone_delivery_time_minutes > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.avg_drone_delivery_time_minutes)}/mo partner</span>
                          )}
                          {alert.competitor_drone_delivery_score != null && alert.competitor_drone_delivery_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_drone_delivery_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.cost_per_delivery_reduction_projected_pct != null && alert.cost_per_delivery_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.cost_per_delivery_reduction_projected_pct}% data revenue growth (target)</span>
                          )}
                          {alert.delivery_speed_lift_projected_pct != null && alert.delivery_speed_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.delivery_speed_lift_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.delivery_radius_lift_projected_pct != null && alert.delivery_radius_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.delivery_radius_lift_projected_pct)}/mo licensing (target)</span>
                          )}
                          {alert.fleet_utilization_lift_projected_pct != null && alert.fleet_utilization_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.fleet_utilization_lift_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">-{alert.satisfaction_lift_projected_pts}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faRocket} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireDroneDeliveryStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneDeliveryStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requireDroneFleetManagement ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneFleetManagement ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireDroneDeliveryRouteOptimization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneDeliveryRouteOptimization ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireDroneRegulatoryCompliance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneRegulatoryCompliance ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireDroneWeatherAdaptation ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneWeatherAdaptation ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireDronePayloadPackagingOptimization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDronePayloadPackagingOptimization ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireDroneBatteryChargingInfrastructure ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneBatteryChargingInfrastructure ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireDroneDeliveryRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDroneDeliveryRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Max time: {config.minDroneFleetSize}</span>
          <span>Min API calls: {config.minDroneFleetUtilizationPct}/mo</span>
          <span>Min partners: {config.maxDroneDeliveryTimeMinutes}</span>
          <span>Min privacy: {config.minRegulatoryComplianceScore}</span>
          <span>Min anonymization: {config.maxWeatherCancellationRatePct}</span>
          <span className="text-neutral-400">211th POSR-exclusive differentiator</span>
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

export default DroneDeliveryAerialLogisticsScreen;
