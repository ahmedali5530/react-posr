/**
 * AI Smart Restaurant IoT & Connected Device Optimizer — predicts how
 * IoT and connected device ecosystems (smart sensors, occupancy tracking,
 * temperature monitoring, equipment predictive maintenance, energy IoT,
 * food safety IoT, customer behavior tracking, real-time alerts, unified
 * device dashboard, edge computing, 5G connectivity, device lifecycle
 * management, IoT security) impact operational efficiency, food safety,
 * energy savings, customer experience, labor optimization, decisions.
 * 215th POSR-exclusive differentiator.
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
  faMicrochip, faBolt, faTemperatureHigh, faEye, faGaugeHigh,
  faNetworkWired, faShieldHalved, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runSmartRestaurantIotEngine, getActiveSmartRestaurantIotAlerts, getSmartRestaurantIotSummary,
  updateSmartRestaurantIotAlertStatus, readSmartRestaurantIotConfig, DEFAULT_SMART_RESTAURANT_IOT_CONFIG,
  type SmartRestaurantIotAlert,
} from "@/lib/smart-restaurant-iot-connected-device.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  smart_iot_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faMicrochip,          label: 'NO DATA MONETIZATION' },
  predictive_maintenance_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faBolt,              label: 'NO API PROGRAM' },
  food_safety_iot_monitoring_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faTemperatureHigh,      label: 'NO LICENSING' },
  occupancy_tracking_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faEye,         label: 'THIN PARTNER ECOSYS' },
  energy_iot_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faGaugeHigh,       label: 'NO BENCHMARKING' },
  unified_iot_dashboard_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faNetworkWired,             label: 'NO PREDICTIVE API' },
  iot_security_program_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faShieldHalved,      label: 'WEAK PRIVACY' },
  iot_roi_tracking_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function SmartRestaurantIotConnectedDeviceScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<SmartRestaurantIotAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, smartIotStrategyAbsentCount: 0, predictiveMaintenanceAbsentCount: 0, foodSafetyIotMonitoringAbsentCount: 0, occupancyTrackingAbsentCount: 0, energyIotAbsentCount: 0, unifiedIotDashboardAbsentCount: 0, iotSecurityProgramAbsentCount: 0, iotRoiTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_SMART_RESTAURANT_IOT_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readSmartRestaurantIotConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveSmartRestaurantIotAlerts(db), getSmartRestaurantIotSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runSmartRestaurantIotEngine(db, config);
      toast.success(`Analyzed ${result.generated} smart IoT signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateSmartRestaurantIotAlertStatus(db, alertId, status);
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
      <DocumentTitle parts={["AI Smart IoTization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faMicrochip} className="text-violet-600" />
              AI Smart IoTization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how smart IoT and connected devices (predictive maintenance, food safety IoT, occupancy tracking, energy IoT, unified dashboard, edge computing, IoT security) impact operational efficiency, food safety, energy savings, labor optimization — smart restaurant IoT market $50B+ by 2030; 68% plan IoT by 2027; 40-50% downtime reduction; 60-80% food safety improvement; 15-25% staffing optimization; 15-30% energy savings; ROI $5-15 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faMicrochip} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze smart IoT'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faMicrochip} label="No data monetization strategy" value={String(summary.smartIotStrategyAbsentCount)} color={summary.smartIotStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBolt} label="No API / no licensing" value={String(summary.predictiveMaintenanceAbsentCount + summary.foodSafetyIotMonitoringAbsentCount)} color={(summary.predictiveMaintenanceAbsentCount + summary.foodSafetyIotMonitoringAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faEye} label="Thin partners / no benchmarking / no predictive" value={String(summary.occupancyTrackingAbsentCount + summary.energyIotAbsentCount + summary.unifiedIotDashboardAbsentCount)} color={(summary.occupancyTrackingAbsentCount + summary.energyIotAbsentCount + summary.unifiedIotDashboardAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="Weak privacy / no valuation" value={String(summary.iotSecurityProgramAbsentCount + summary.iotRoiTrackingAbsentCount)} color={(summary.iotSecurityProgramAbsentCount + summary.iotRoiTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faMicrochip} spin className="text-4xl mb-3" />
            <p>Analyzing smart IoT &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy smart IoT environment: active IoT strategy (20+ devices, platform: AWS/Azure/Google); predictive maintenance (80%+ accuracy, 40-50% downtime reduction); food safety IoT (60-80% incident reduction, real-time temp monitoring); occupancy tracking (15-25% staffing optimization, dwell time, traffic patterns); energy IoT (15-30% savings, smart HVAC/lighting/refrigeration); unified dashboard (70%+ integration, 2-4h/day manager time, edge computing); IoT security (80+ score, device auth, network segmentation); IoT ROI tracking (ROAS 3x+); smart IoT market $50B+ by 2030; 68% plan by 2027; ROI $5-15 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faMicrochip, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_smart_iot_strategy != null && (
                            <span className={`text-xs ${alert.has_smart_iot_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_smart_iot_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.downtime_savings_monthly != null && alert.downtime_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.downtime_savings_monthly)}/mo data rev ({alert.operational_efficiency_score ?? 0}%)</span>
                          )}
                          {alert.equipment_downtime_hours_monthly != null && alert.equipment_downtime_hours_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.equipment_downtime_hours_monthly)}/mo API</span>
                          )}
                          {alert.food_safety_incident_reduction_pct != null && alert.food_safety_incident_reduction_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.food_safety_incident_reduction_pct)}/mo licensing</span>
                          )}
                          {alert.decision_speed_score != null && alert.decision_speed_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.decision_speed_score)}/mo partner</span>
                          )}
                          {alert.competitor_iot_score != null && alert.competitor_iot_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_iot_score}/100 competitor</span>
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
                          {alert.downtime_reduction_projected_pct != null && alert.downtime_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.downtime_reduction_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.food_safety_improvement_projected_pct != null && alert.food_safety_improvement_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.food_safety_improvement_projected_pct)}/mo licensing (target)</span>
                          )}
                          {alert.staffing_optimization_projected_pct != null && alert.staffing_optimization_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.staffing_optimization_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.energy_savings_projected_pct != null && alert.energy_savings_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.energy_savings_projected_pct}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faMicrochip} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireSmartIotStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSmartIotStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requirePredictiveMaintenance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePredictiveMaintenance ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireFoodSafetyIotMonitoring ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFoodSafetyIotMonitoring ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireOccupancyTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOccupancyTracking ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireEnergyIot ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireEnergyIot ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireUnifiedIotDashboard ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireUnifiedIotDashboard ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireIotSecurityProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireIotSecurityProgram ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireIotRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireIotRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minIotDeviceCount}</span>
          <span>Min API calls: {config.minPredictiveMaintenanceAccuracyPct}/mo</span>
          <span>Min partners: {config.minFoodSafetyIncidentReductionPct}</span>
          <span>Min privacy: {config.minStaffingOptimizationPct}</span>
          <span>Min anonymization: {config.minEnergySavingsPct}</span>
          <span className="text-neutral-400">215th POSR-exclusive differentiator</span>
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

export default SmartRestaurantIotConnectedDeviceScreen;
