/**
 * AI Drive-Thru & Pickup Window Optimizer — predicts how drive-thru and
 * pickup window operations (window design, order accuracy, speed of service,
 * speaker clarity, menu board visibility, payment speed, pickup timing,
 * order ahead integration, lane design, weather protection) impacts drive-thru
 * revenue, customer satisfaction, repeat visits, and operational efficiency.
 *
 * 195th POSR-exclusive differentiator.
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
  faCarSide, faClock, faVolumeHigh, faSignsPost, faCloudRain,
  faMobileScreenButton, faRoadSpikes, faCreditCard,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runDriveThruPickupWindowEngine, getActiveDriveThruPickupWindowAlerts, getDriveThruPickupWindowSummary,
  updateDriveThruPickupWindowAlertStatus, readDriveThruPickupWindowConfig, DEFAULT_DRIVE_THRU_PICKUP_WINDOW_CONFIG,
  type DriveThruPickupWindowAlert,
} from "@/lib/drive-thru-pickup-window.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  drive_thru_speed_too_slow:           { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faClock,             label: 'SPEED TOO SLOW' },
  order_error_rate_high:               { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faTriangleExclamation, label: 'ERROR RATE HIGH' },
  speaker_clarity_poor:                { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faVolumeHigh,        label: 'SPEAKER POOR' },
  menu_board_visibility_poor:          { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faSignsPost,         label: 'MENU BOARD POOR' },
  pickup_window_unprotected_weather:   { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faCloudRain,         label: 'NO WEATHER PROTECTION' },
  order_ahead_integration_absent:      { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faMobileScreenButton, label: 'NO ORDER-AHEAD' },
  lane_design_suboptimal:              { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faRoadSpikes,        label: 'LANE SUBOPTIMAL' },
  payment_speed_slow:                  { bg: 'bg-red-50',      text: 'text-red-700',      icon: faCreditCard,        label: 'PAYMENT SLOW' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function DriveThruPickupWindowScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<DriveThruPickupWindowAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, driveThruSpeedTooSlowCount: 0, orderErrorRateHighCount: 0, speakerClarityPoorCount: 0, menuBoardVisibilityPoorCount: 0, pickupWindowUnprotectedWeatherCount: 0, orderAheadIntegrationAbsentCount: 0, laneDesignSuboptimalCount: 0, paymentSpeedSlowCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_DRIVE_THRU_PICKUP_WINDOW_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readDriveThruPickupWindowConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveDriveThruPickupWindowAlerts(db), getDriveThruPickupWindowSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[drive-thru-pickup-window-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runDriveThruPickupWindowEngine(db, config);
      toast.success(`Analyzed ${result.generated} drive-thru + pickup window signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[drive-thru-pickup-window-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateDriveThruPickupWindowAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[drive-thru-pickup-window-report] status failed', err);
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
      <DocumentTitle parts={["AI Drive-Thru & Pickup Window Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faCarSide} className="text-amber-500" />
              AI Drive-Thru &amp; Pickup Window Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how drive-thru and pickup window operations (window design, order accuracy, speed of service, speaker clarity, menu board visibility, payment speed, pickup timing, order ahead integration, lane design, weather protection) impacts drive-thru revenue, satisfaction, repeat visits, operational efficiency — drive-thru = 40-70% QSR revenue (NRA); each second saved = $50-100/day; 30% error rate reduces returns 35%; speaker issues cause 15-20% errors; poor menu boards add 15-30sec; unprotected windows 40-60% slower in weather; order-ahead reduces wait 50-70%; dual lane 25-35% more throughput; contactless payment 73% faster; wait over 5min = 60% less likely to return
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faCarSide} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze drive-thru'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faClock} label="Speed too slow" value={String(summary.driveThruSpeedTooSlowCount)} color={summary.driveThruSpeedTooSlowCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faTriangleExclamation} label="Error rate high" value={String(summary.orderErrorRateHighCount)} color={summary.orderErrorRateHighCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faVolumeHigh} label="Speaker clarity poor" value={String(summary.speakerClarityPoorCount)} color={summary.speakerClarityPoorCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCloudRain} label="No weather protection" value={String(summary.pickupWindowUnprotectedWeatherCount)} color={summary.pickupWindowUnprotectedWeatherCount > 0 ? 'text-cyan-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faCarSide} spin className="text-4xl mb-3" />
            <p>Analyzing drive-thru + pickup window opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No drive-thru + pickup window alerts</p>
            <p className="text-sm mt-1">Healthy drive-thru + pickup window: service time under 5min (60% return visit lift); order error rate below 10% (35% return visit lift); clear speaker audio (15-20% error reduction); visible menu board (15-30sec saved per order); weather-protected pickup window (40-60% weather speed recovery); order-ahead integration (50-70% wait reduction); dual lane at high volume (25-35% throughput lift); contactless + mobile pay (73% faster payment); drive-thru = 40-70% QSR revenue (NRA); each second saved = $50-100/day; optimized windows add $2,000-8,000/day.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faCarSide, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'order_ahead' ? 'text-emerald-600' : alert.channel === 'pickup_window' ? 'text-cyan-600' : alert.channel === 'drive_thru' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.service_time_seconds != null && alert.service_time_seconds > 0 && (
                            <span className={`text-xs ${alert.service_time_seconds > 300 ? 'text-rose-600 font-medium' : alert.service_time_seconds > 180 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.service_time_seconds}s service</span>
                          )}
                          {alert.wait_time_minutes != null && alert.wait_time_minutes > 0 && (
                            <span className={`text-xs ${alert.wait_time_minutes > 5 ? 'text-rose-600 font-medium' : alert.wait_time_minutes > 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.wait_time_minutes}min wait</span>
                          )}
                          {alert.order_error_rate_pct != null && alert.order_error_rate_pct > 0 && (
                            <span className={`text-xs ${alert.order_error_rate_pct > 25 ? 'text-rose-600 font-medium' : alert.order_error_rate_pct > 15 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.order_error_rate_pct}% errors</span>
                          )}
                          {alert.speaker_clarity_score != null && alert.speaker_clarity_score > 0 && (
                            <span className={`text-xs ${alert.speaker_clarity_score < 50 ? 'text-rose-600 font-medium' : alert.speaker_clarity_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.speaker_clarity_score}/100 speaker</span>
                          )}
                          {alert.speaker_audio_quality && alert.speaker_audio_quality !== 'clear' && (
                            <span className={`text-xs font-medium ${alert.speaker_audio_quality === 'garbled' ? 'text-rose-600' : 'text-amber-600'}`}>{alert.speaker_audio_quality}</span>
                          )}
                          {alert.menu_board_visibility_score != null && alert.menu_board_visibility_score > 0 && (
                            <span className={`text-xs ${alert.menu_board_visibility_score < 50 ? 'text-rose-600 font-medium' : alert.menu_board_visibility_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.menu_board_visibility_score}/100 menu</span>
                          )}
                          {alert.menu_board_size && (
                            <span className={`text-xs font-medium ${alert.menu_board_size === 'digital' || alert.menu_board_size === 'large' ? 'text-emerald-600' : alert.menu_board_size === 'medium' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.menu_board_size}</span>
                          )}
                          {alert.menu_board_extra_seconds_per_order != null && alert.menu_board_extra_seconds_per_order > 0 && (
                            <span className="text-xs text-amber-600 font-medium">+{alert.menu_board_extra_seconds_per_order}s/order</span>
                          )}
                          {alert.has_weather_protection != null && (
                            <span className={`text-xs ${alert.has_weather_protection ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_weather_protection ? 'weather yes' : 'NO weather'}</span>
                          )}
                          {alert.weather_delay_pct != null && alert.weather_delay_pct > 0 && (
                            <span className={`text-xs ${alert.weather_delay_pct > 30 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.weather_delay_pct}% weather delay</span>
                          )}
                          {alert.has_order_ahead_integration != null && (
                            <span className={`text-xs ${alert.has_order_ahead_integration ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_order_ahead_integration ? 'order-ahead yes' : 'NO order-ahead'}</span>
                          )}
                          {alert.order_ahead_adoption_pct != null && alert.order_ahead_adoption_pct > 0 && (
                            <span className={`text-xs ${alert.order_ahead_adoption_pct < 30 ? 'text-rose-600 font-medium' : alert.order_ahead_adoption_pct < 45 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.order_ahead_adoption_pct}% adoption</span>
                          )}
                          {alert.lane_design && (
                            <span className={`text-xs font-medium ${alert.lane_design === 'dual' || alert.lane_design === 'multi' ? 'text-emerald-600' : 'text-amber-600'}`}>{alert.lane_design}</span>
                          )}
                          {alert.cars_per_hour != null && alert.cars_per_hour > 0 && (
                            <span className={`text-xs ${alert.cars_per_hour < alert.target_cars_per_hour ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.cars_per_hour}/{alert.target_cars_per_hour} cars/hr</span>
                          )}
                          {alert.payment_methods && (
                            <span className={`text-xs font-medium ${alert.payment_methods === 'mobile_pay' || alert.payment_methods === 'contactless' ? 'text-emerald-600' : alert.payment_methods === 'card' ? 'text-amber-600' : 'text-rose-600'}`}>{alert.payment_methods}</span>
                          )}
                          {alert.avg_payment_time_seconds != null && alert.avg_payment_time_seconds > 0 && (
                            <span className={`text-xs ${alert.avg_payment_time_seconds > 40 ? 'text-rose-600 font-medium' : alert.avg_payment_time_seconds > 20 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_payment_time_seconds}s pay</span>
                          )}
                          {alert.has_contactless_payment != null && (
                            <span className={`text-xs ${alert.has_contactless_payment ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_contactless_payment ? 'contactless yes' : 'NO contactless'}</span>
                          )}
                          {alert.has_mobile_pay != null && (
                            <span className={`text-xs ${alert.has_mobile_pay ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_mobile_pay ? 'mobile pay yes' : 'NO mobile pay'}</span>
                          )}
                          {alert.drive_thru_revenue_share_pct != null && alert.drive_thru_revenue_share_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.drive_thru_revenue_share_pct}% DT share</span>
                          )}
                          {alert.drive_thru_repeat_rate_pct != null && alert.drive_thru_repeat_rate_pct > 0 && (
                            <span className={`text-xs ${alert.drive_thru_repeat_rate_pct < 40 ? 'text-rose-600 font-medium' : alert.drive_thru_repeat_rate_pct < 55 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.drive_thru_repeat_rate_pct}% repeat</span>
                          )}
                          {alert.return_visit_likelihood_pct != null && alert.return_visit_likelihood_pct > 0 && (
                            <span className={`text-xs ${alert.return_visit_likelihood_pct < 50 ? 'text-rose-600 font-medium' : alert.return_visit_likelihood_pct < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.return_visit_likelihood_pct}/100 return</span>
                          )}
                          {alert.speed_complaints_per_100 != null && alert.speed_complaints_per_100 > 0 && (
                            <span className={`text-xs ${alert.speed_complaints_per_100 > 8 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.speed_complaints_per_100}/100 speed</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 70 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 satisfaction</span>
                          )}
                          {alert.competitor_speed_seconds != null && alert.competitor_speed_seconds > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_speed_seconds}s competitor</span>
                          )}
                          {alert.drive_thru_monthly_revenue != null && alert.drive_thru_monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.drive_thru_monthly_revenue}/mo DT</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.speed_improvement_projected_sec != null && alert.speed_improvement_projected_sec > 0 && (
                            <span className="text-emerald-600">-{alert.speed_improvement_projected_sec}s service time (target)</span>
                          )}
                          {alert.error_reduction_projected_pct != null && alert.error_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.error_reduction_projected_pct}% errors (target)</span>
                          )}
                          {alert.throughput_lift_projected_pct != null && alert.throughput_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.throughput_lift_projected_pct}% throughput (target)</span>
                          )}
                          {alert.drive_thru_revenue_lift_projected_pct != null && alert.drive_thru_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.drive_thru_revenue_lift_projected_pct}% DT revenue (target)</span>
                          )}
                          {alert.repeat_visit_lift_projected_pct != null && alert.repeat_visit_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.repeat_visit_lift_projected_pct}% return visits (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct < 0 && (
                            <span className="text-rose-600">{alert.predicted_revenue_change_pct}% revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faCarSide} className="mt-0.5 shrink-0" />
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
          <span>Fast service: <span className={config.requireFastService ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFastService ? 'required' : 'optional'}</span></span>
          <span>Low errors: <span className={config.requireLowErrorRate ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireLowErrorRate ? 'required' : 'optional'}</span></span>
          <span>Clear speaker: <span className={config.requireClearSpeakerAudio ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireClearSpeakerAudio ? 'required' : 'optional'}</span></span>
          <span>Visible menu: <span className={config.requireVisibleMenuBoard ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVisibleMenuBoard ? 'required' : 'optional'}</span></span>
          <span>Weather protection: <span className={config.requireWeatherProtection ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireWeatherProtection ? 'required' : 'optional'}</span></span>
          <span>Order-ahead: <span className={config.requireOrderAheadIntegration ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOrderAheadIntegration ? 'required' : 'optional'}</span></span>
          <span>Optimal lane: <span className={config.requireOptimalLaneDesign ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOptimalLaneDesign ? 'required' : 'optional'}</span></span>
          <span>Fast payment: <span className={config.requireFastPayment ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFastPayment ? 'required' : 'optional'}</span></span>
          <span>Max service time (s): {config.maxServiceTimeSeconds}</span>
          <span>Max error rate %: {config.maxOrderErrorRatePct}</span>
          <span>Min speaker clarity: {config.minSpeakerClarityScore}</span>
          <span>Min menu visibility: {config.minMenuBoardVisibilityScore}</span>
          <span>Max weather delay %: {config.maxWeatherDelayPct}</span>
          <span>Min order-ahead %: {config.minOrderAheadAdoptionPct}</span>
          <span>Dual-lane threshold (cars/hr): {config.minCarsPerHourDualLane}</span>
          <span>Max payment time (s): {config.maxPaymentTimeSeconds}</span>
          <span>Prefer contactless: <span className={config.preferContactlessPayment ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.preferContactlessPayment ? 'yes' : 'no'}</span></span>
          <span className="text-neutral-400">195th POSR-exclusive differentiator</span>
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

export default DriveThruPickupWindowScreen;
