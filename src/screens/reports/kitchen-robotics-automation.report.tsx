/**
 * AI Kitchen Robotics & Automation Optimizer — predicts how kitchen
 * robotics and automation (robotic fryers/flippy, automated grills,
 * robotic dishwashers, automated prep stations, smart ovens, conveyor
 * cooking, robotic beverage dispensers, inventory automation, cleaning
 * automation, labor displacement, consistency improvement, ROI tracking,
 * maintenance planning, staff retraining) impacts labor cost, food
 * consistency, speed of service, kitchen throughput, food safety,
 * profitability.
 *
 * 208th POSR-exclusive differentiator.
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
  faRobot, faFire, faBowlFood, faBoxesStacked, faBroom,
  faChartLine, faScrewdriverWrench, faUsers,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runKitchenRoboticsEngine, getActiveKitchenRoboticsAlerts, getKitchenRoboticsSummary,
  updateKitchenRoboticsAlertStatus, readKitchenRoboticsConfig, DEFAULT_KITCHEN_ROBOTICS_CONFIG,
  type KitchenRoboticsAlert,
} from "@/lib/kitchen-robotics-automation.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  kitchen_robotics_strategy_absent:       { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faRobot,           label: 'NO ROBOTICS' },
  robotic_cooking_automation_low:         { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faFire,            label: 'LOW COOKING AUTO' },
  robotic_prep_automation_absent:         { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faBowlFood,        label: 'NO PREP AUTO' },
  inventory_automation_absent:            { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faBoxesStacked,    label: 'NO INV AUTO' },
  cleaning_automation_absent:             { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faBroom,           label: 'NO CLEAN AUTO' },
  robotics_roi_tracking_absent:           { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faChartLine,       label: 'NO ROI TRACK' },
  robotics_maintenance_program_absent:    { bg: 'bg-red-50',       text: 'text-red-700',       icon: faScrewdriverWrench, label: 'NO MAINTENANCE' },
  staff_robotics_retraining_absent:       { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faUsers,           label: 'NO RETRAINING' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function KitchenRoboticsAutomationScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<KitchenRoboticsAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, kitchenRoboticsStrategyAbsentCount: 0, roboticCookingAutomationLowCount: 0, roboticPrepAutomationAbsentCount: 0, inventoryAutomationAbsentCount: 0, cleaningAutomationAbsentCount: 0, roboticsRoiTrackingAbsentCount: 0, roboticsMaintenanceProgramAbsentCount: 0, staffRoboticsRetrainingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_KITCHEN_ROBOTICS_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readKitchenRoboticsConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveKitchenRoboticsAlerts(db), getKitchenRoboticsSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[kitchen-robotics-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runKitchenRoboticsEngine(db, config);
      toast.success(`Analyzed ${result.generated} kitchen robotics signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[kitchen-robotics-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateKitchenRoboticsAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[kitchen-robotics-report] status failed', err);
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
      <DocumentTitle parts={["AI Kitchen Robotics & Automation Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faRobot} className="text-violet-600" />
              AI Kitchen Robotics &amp; Automation Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how kitchen robotics and automation (robotic fryers/flippy, automated grills, robotic dishwashers, automated prep stations, smart ovens, conveyor cooking, robotic beverage dispensers, inventory automation, cleaning automation, labor displacement, consistency improvement, ROI tracking, maintenance planning, staff retraining) impacts labor cost, food consistency, speed of service, kitchen throughput, food safety, profitability — restaurant robotics market $4B+ by 2030 (Allied Market Research), growing 25%+ CAGR; Miso Robotics Flippy flips 150+ burgers/hour = 2-3x human; White Castle deployed Flippy at 100+ locations; robotic fryers reduce oil waste 30-40%; automated grills reduce cook time 20-30%; conveyor cooking 99%+ consistency vs 85-90% human; each robot replaces 1-3 FTE ($30k-90k/year savings); robots work 24/7 (no breaks, no sick days); food consistency improves 10-20%; speed increases 15-30%; throughput increases 20-40%; robotics ROI $3-8 per $1 (2-4 year payback); 35% of QSRs plan robotics by 2027 (Restaurant Business); 60% of ROI from labor savings, 25% consistency/waste, 15% speed/throughput
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faRobot} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze robotics'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faRobot} label="No robotics strategy" value={String(summary.kitchenRoboticsStrategyAbsentCount)} color={summary.kitchenRoboticsStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faFire} label="Low cooking / no prep auto" value={String(summary.roboticCookingAutomationLowCount + summary.roboticPrepAutomationAbsentCount)} color={(summary.roboticCookingAutomationLowCount + summary.roboticPrepAutomationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBoxesStacked} label="No inv auto / no clean auto" value={String(summary.inventoryAutomationAbsentCount + summary.cleaningAutomationAbsentCount)} color={(summary.inventoryAutomationAbsentCount + summary.cleaningAutomationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faChartLine} label="No ROI / no maintenance / no retraining" value={String(summary.roboticsRoiTrackingAbsentCount + summary.roboticsMaintenanceProgramAbsentCount + summary.staffRoboticsRetrainingAbsentCount)} color={(summary.roboticsRoiTrackingAbsentCount + summary.roboticsMaintenanceProgramAbsentCount + summary.staffRoboticsRetrainingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faRobot} spin className="text-4xl mb-3" />
            <p>Analyzing kitchen robotics &amp; automation opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No kitchen robotics alerts</p>
            <p className="text-sm mt-1">Healthy kitchen robotics environment: active robotics strategy (4+ robots deployed); cooking automation 30%+ (robotic fryers, grills, ovens, conveyors); prep automation 20%+ (automated chopping, portioning); inventory automation (smart shelves, RFID, stockouts under 5%); cleaning automation (2+ hours/day saved); ROI tracking (ROAS 3x+, per-robot metrics); maintenance program (downtime under 10h/month, 4+ preventive visits/year); staff retraining (85%+ completion, certified operators); robotics market $4B+ by 2030 (Allied Market Research); Miso Robotics Flippy 150+ burgers/hour; White Castle 100+ locations; 30-40% oil waste reduction; 20-30% cook time reduction; 99%+ conveyor consistency; each robot replaces 1-3 FTE ($30k-90k/year); robots work 24/7; ROI $3-8 per $1 (2-4 year payback); 35% QSRs plan robotics by 2027.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faRobot, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_kitchen_robotics_strategy != null && (
                            <span className={`text-xs ${alert.has_kitchen_robotics_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_kitchen_robotics_strategy ? 'robotics yes' : 'NO robotics'}</span>
                          )}
                          {alert.robot_count != null && alert.robot_count >= 0 && (
                            <span className={`text-xs ${alert.robot_count < 2 ? 'text-rose-600 font-medium' : alert.robot_count < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.robot_count} robots (target {alert.robot_target_count ?? 4})</span>
                          )}
                          {alert.robot_types_deployed && alert.robot_types_deployed !== 'none' && (
                            <span className="text-xs text-violet-600 font-medium">{alert.robot_types_deployed}</span>
                          )}
                          {alert.has_robotic_cooking != null && (
                            <span className={`text-xs ${alert.has_robotic_cooking ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_robotic_cooking ? 'cooking auto yes' : 'NO cooking auto'}</span>
                          )}
                          {alert.cooking_automation_pct != null && alert.cooking_automation_pct >= 0 && (
                            <span className={`text-xs ${alert.cooking_automation_pct < 15 ? 'text-rose-600 font-medium' : alert.cooking_automation_pct < 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.cooking_automation_pct}% cooking auto (min 30%)</span>
                          )}
                          {alert.robotic_fryer_count != null && alert.robotic_fryer_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.robotic_fryer_count} fryers</span>
                          )}
                          {alert.robotic_grill_count != null && alert.robotic_grill_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.robotic_grill_count} grills</span>
                          )}
                          {alert.conveyor_cooking_count != null && alert.conveyor_cooking_count > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.conveyor_cooking_count} conveyors</span>
                          )}
                          {alert.has_robotic_prep != null && (
                            <span className={`text-xs ${alert.has_robotic_prep ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_robotic_prep ? 'prep auto yes' : 'NO prep auto'}</span>
                          )}
                          {alert.prep_automation_pct != null && alert.prep_automation_pct >= 0 && (
                            <span className={`text-xs ${alert.prep_automation_pct < 10 ? 'text-rose-600 font-medium' : alert.prep_automation_pct < 20 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.prep_automation_pct}% prep auto</span>
                          )}
                          {alert.has_inventory_automation != null && (
                            <span className={`text-xs ${alert.has_inventory_automation ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_inventory_automation ? 'inv auto yes' : 'NO inv auto'}</span>
                          )}
                          {alert.inventory_stockout_rate_pct != null && alert.inventory_stockout_rate_pct > 0 && (
                            <span className={`text-xs ${alert.inventory_stockout_rate_pct > 10 ? 'text-rose-600 font-medium' : alert.inventory_stockout_rate_pct > 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.inventory_stockout_rate_pct}% stockout (max 5%)</span>
                          )}
                          {alert.rfid_enabled != null && (
                            <span className={`text-xs ${alert.rfid_enabled ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.rfid_enabled ? 'RFID yes' : 'NO RFID'}</span>
                          )}
                          {alert.has_cleaning_automation != null && (
                            <span className={`text-xs ${alert.has_cleaning_automation ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_cleaning_automation ? 'clean auto yes' : 'NO clean auto'}</span>
                          )}
                          {alert.cleaning_automation_hours_saved_daily != null && alert.cleaning_automation_hours_saved_daily > 0 && (
                            <span className="text-xs text-teal-600 font-medium">{alert.cleaning_automation_hours_saved_daily}h/day saved</span>
                          )}
                          {alert.has_robotics_roi_tracking != null && (
                            <span className={`text-xs ${alert.has_robotics_roi_tracking ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_robotics_roi_tracking ? 'ROI track yes' : 'NO ROI track'}</span>
                          )}
                          {alert.robotics_roas != null && alert.robotics_roas > 0 && (
                            <span className={`text-xs ${alert.robotics_roas < 3 ? 'text-rose-600 font-medium' : alert.robotics_roas < 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.robotics_roas}x ROAS</span>
                          )}
                          {alert.robotics_labor_savings_monthly != null && alert.robotics_labor_savings_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.robotics_labor_savings_monthly)}/mo labor saved</span>
                          )}
                          {alert.has_robotics_maintenance_program != null && (
                            <span className={`text-xs ${alert.has_robotics_maintenance_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_robotics_maintenance_program ? 'maintenance yes' : 'NO maintenance'}</span>
                          )}
                          {alert.robot_downtime_hours_monthly != null && alert.robot_downtime_hours_monthly > 0 && (
                            <span className={`text-xs ${alert.robot_downtime_hours_monthly > 15 ? 'text-rose-600 font-medium' : alert.robot_downtime_hours_monthly > 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.robot_downtime_hours_monthly}h downtime/mo (max 10)</span>
                          )}
                          {alert.has_staff_robotics_retraining != null && (
                            <span className={`text-xs ${alert.has_staff_robotics_retraining ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_staff_robotics_retraining ? 'retraining yes' : 'NO retraining'}</span>
                          )}
                          {alert.retraining_completion_pct != null && alert.retraining_completion_pct >= 0 && (
                            <span className={`text-xs ${alert.retraining_completion_pct < 50 ? 'text-rose-600 font-medium' : alert.retraining_completion_pct < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.retraining_completion_pct}% retrained (min 85%)</span>
                          )}
                          {alert.food_consistency_score != null && alert.food_consistency_score > 0 && (
                            <span className={`text-xs ${alert.food_consistency_score < 75 ? 'text-rose-600 font-medium' : alert.food_consistency_score < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.food_consistency_score}/100 consistency</span>
                          )}
                          {alert.speed_of_service_seconds != null && alert.speed_of_service_seconds > 0 && (
                            <span className={`text-xs ${alert.speed_of_service_seconds > 300 ? 'text-rose-600 font-medium' : alert.speed_of_service_seconds > 240 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.speed_of_service_seconds}s service (target 240s)</span>
                          )}
                          {alert.kitchen_throughput_orders_hour != null && alert.kitchen_throughput_orders_hour > 0 && (
                            <span className={`text-xs ${alert.kitchen_throughput_orders_hour < 90 ? 'text-rose-600 font-medium' : alert.kitchen_throughput_orders_hour < 120 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.kitchen_throughput_orders_hour} orders/hr</span>
                          )}
                          {alert.labor_cost_monthly != null && alert.labor_cost_monthly > 0 && (
                            <span className="text-xs text-neutral-500">{fmt$(alert.labor_cost_monthly)}/mo labor</span>
                          )}
                          {alert.competitor_robotics_score != null && alert.competitor_robotics_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_robotics_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.labor_savings_projected_pct != null && alert.labor_savings_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.labor_savings_projected_pct}% labor savings (target)</span>
                          )}
                          {alert.consistency_lift_projected_pts != null && alert.consistency_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.consistency_lift_projected_pts}pts consistency (target)</span>
                          )}
                          {alert.speed_lift_projected_pct != null && alert.speed_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.speed_lift_projected_pct}% speed (target)</span>
                          )}
                          {alert.throughput_lift_projected_pct != null && alert.throughput_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.throughput_lift_projected_pct}% throughput (target)</span>
                          )}
                          {alert.waste_reduction_projected_pct != null && alert.waste_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.waste_reduction_projected_pct}% waste (target)</span>
                          )}
                          {alert.stockout_reduction_projected_pct != null && alert.stockout_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.stockout_reduction_projected_pct}% stockouts (target)</span>
                          )}
                          {alert.cleaning_labor_savings_projected_hours != null && alert.cleaning_labor_savings_projected_hours > 0 && (
                            <span className="text-emerald-600">+{alert.cleaning_labor_savings_projected_hours}h/day cleaning saved (target)</span>
                          )}
                          {alert.downtime_reduction_projected_pct != null && alert.downtime_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.downtime_reduction_projected_pct}% downtime (target)</span>
                          )}
                          {alert.roi_lift_projected_pct != null && alert.roi_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.roi_lift_projected_pct}% ROI (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faRobot} className="mt-0.5 shrink-0" />
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
          <span>Robotics strategy: <span className={config.requireKitchenRoboticsStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireKitchenRoboticsStrategy ? 'required' : 'optional'}</span></span>
          <span>ROI tracking: <span className={config.requireRoboticsRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRoboticsRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Maintenance: <span className={config.requireRoboticsMaintenanceProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRoboticsMaintenanceProgram ? 'required' : 'optional'}</span></span>
          <span>Retraining: <span className={config.requireStaffRoboticsRetraining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireStaffRoboticsRetraining ? 'required' : 'optional'}</span></span>
          <span>Min cooking auto: {config.minCookingAutomationPct}%</span>
          <span>Min prep auto: {config.minPrepAutomationPct}%</span>
          <span>Max stockout: {config.maxInventoryStockoutRatePct}%</span>
          <span>Min cleaning saved: {config.minCleaningAutomationHoursSavedDaily}h/day</span>
          <span>Min consistency: {config.minFoodConsistencyScore}</span>
          <span>Max downtime: {config.maxRobotDowntimeHoursMonthly}h/mo</span>
          <span>Min ROAS: {config.minRoboticsRoas}x</span>
          <span>Min retraining: {config.minRetrainingCompletionPct}%</span>
          <span className="text-neutral-400">208th POSR-exclusive differentiator</span>
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

export default KitchenRoboticsAutomationScreen;
