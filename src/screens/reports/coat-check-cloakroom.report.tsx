/**
 * AI Coat Check & Cloakroom Optimizer — predicts how coat check and
 * cloakroom service (coat check availability, staffed hours, capacity,
 * ticket system, security, winter demand, event night demand,
 * accessibility, self-serve vs attended) impacts customer satisfaction,
 * perceived quality, dwell time, and winter/event revenue.
 *
 * 193rd POSR-exclusive differentiator.
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
  faShirt, faTicket, faKey, faLock, faDoorClosed, faSnowflake, faTemperatureLow,
  faUserClock,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runCoatCheckCloakroomEngine, getActiveCoatCheckCloakroomAlerts, getCoatCheckCloakroomSummary,
  updateCoatCheckCloakroomAlertStatus, readCoatCheckCloakroomConfig, DEFAULT_COAT_CHECK_CLOAKROOM_CONFIG,
  type CoatCheckCloakroomAlert,
} from "@/lib/coat-check-cloakroom.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  coat_check_absent_cold_climate:    { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faSnowflake,         label: 'NO COAT CHECK (COLD)' },
  coat_check_unstaffed_peak_hours:   { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faUserClock,         label: 'UNSTAFFED PEAK HOURS' },
  coat_check_capacity_insufficient:  { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faShirt,             label: 'CAPACITY OVERFLOW' },
  ticket_system_inadequate:          { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faTicket,            label: 'NO TICKET SYSTEM' },
  coat_check_placement_poor:         { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faDoorClosed,        label: 'POOR PLACEMENT' },
  coat_check_absent_fine_dining:     { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faShirt,             label: 'NO COAT CHECK (FINE DINING)' },
  coat_security_insufficient:        { bg: 'bg-red-50',      text: 'text-red-700',      icon: faLock,              label: 'SECURITY INSUFFICIENT' },
  seasonal_staffing_mismatch:        { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faTemperatureLow,    label: 'SEASONAL MISMATCH' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function CoatCheckCloakroomScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<CoatCheckCloakroomAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, absentColdClimateCount: 0, unstaffedPeakHoursCount: 0, capacityInsufficientCount: 0, ticketSystemInadequateCount: 0, placementPoorCount: 0, absentFineDiningCount: 0, securityInsufficientCount: 0, seasonalStaffingMismatchCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_COAT_CHECK_CLOAKROOM_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readCoatCheckCloakroomConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveCoatCheckCloakroomAlerts(db), getCoatCheckCloakroomSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[coat-check-cloakroom-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runCoatCheckCloakroomEngine(db, config);
      toast.success(`Analyzed ${result.generated} coat check signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[coat-check-cloakroom-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateCoatCheckCloakroomAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[coat-check-cloakroom-report] status failed', err);
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
      <DocumentTitle parts={["AI Coat Check & Cloakroom Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faShirt} className="text-rose-500" />
              AI Coat Check &amp; Cloakroom Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how coat check and cloakroom service (availability, staffed hours, capacity, ticket system, security, winter demand, event night demand, accessibility, self-serve vs attended) impacts satisfaction, perceived quality, dwell time, winter/event revenue — 78% of customers in cold-climate cities prefer restaurants with coat check (Cornell CHR); coat check increases winter evening revenue 15-20%; event nights generate 3-5x normal demand; lost coat liability $200-2,000 without ticket system; 65% of fine dining customers expect coat check; digital QR tickets reduce disputes 95%; coat check near entrance = 40% better flow; self-serve racks reduce perceived quality but save $50-100/night labor
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faShirt} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze coat check'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faSnowflake} label="No coat check (cold)" value={String(summary.absentColdClimateCount)} color={summary.absentColdClimateCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUserClock} label="Unstaffed peak hours" value={String(summary.unstaffedPeakHoursCount)} color={summary.unstaffedPeakHoursCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faTicket} label="No ticket system" value={String(summary.ticketSystemInadequateCount)} color={summary.ticketSystemInadequateCount > 0 ? 'text-violet-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLock} label="Security insufficient" value={String(summary.securityInsufficientCount)} color={summary.securityInsufficientCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faShirt} spin className="text-4xl mb-3" />
            <p>Analyzing coat check &amp; cloakroom opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No coat check alerts</p>
            <p className="text-sm mt-1">Healthy coat check &amp; cloakroom: attended coat check near entrance with 80+ hooks covering peak demand + event night surge (3-5x); staffed during dinner rush 5pm-10pm + event nights; paper or digital QR ticket system (95% dispute reduction); valuables locker + security cameras ($200-2,000 coat liability); seasonal hours aligned (winter max, summer min); ADA accessible; 65% of fine dining customers expect coat check (Cornell CHR); 78% of cold-climate customers prefer restaurants with coat check; coat check increases winter revenue 15-20%.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faShirt, label: alert.rule_id.toUpperCase() };
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
                          {alert.climate_zone && (
                            <span className={`text-xs font-medium ${alert.climate_zone === 'cold' ? 'text-sky-600' : alert.climate_zone === 'temperate' ? 'text-emerald-600' : 'text-amber-600'}`}>{alert.climate_zone}</span>
                          )}
                          {alert.has_coat_check != null && (
                            <span className={`text-xs ${alert.has_coat_check ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_coat_check ? 'coat check yes' : 'NO coat check'}</span>
                          )}
                          {alert.coat_check_type && alert.coat_check_type !== 'none' && (
                            <span className={`text-xs font-medium ${alert.coat_check_type === 'full_cloakroom' ? 'text-emerald-600' : alert.coat_check_type === 'attended_counter' ? 'text-emerald-600' : alert.coat_check_type === 'self_serve_rack' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.coat_check_type}</span>
                          )}
                          {alert.coat_check_location && alert.coat_check_location !== 'none' && (
                            <span className={`text-xs font-medium ${alert.coat_check_location === 'entrance' || alert.coat_check_location === 'host_stand' ? 'text-emerald-600' : 'text-rose-600'}`}>{alert.coat_check_location}</span>
                          )}
                          {alert.coat_check_attended != null && (
                            <span className={`text-xs ${alert.coat_check_attended ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.coat_check_attended ? 'attended' : 'self-serve'}</span>
                          )}
                          {alert.coat_check_hooks != null && alert.coat_check_hooks > 0 && (
                            <span className={`text-xs ${alert.coat_check_hooks < 40 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.coat_check_hooks} hooks</span>
                          )}
                          {alert.coat_check_peak_demand_per_night != null && alert.coat_check_peak_demand_per_night > 0 && (
                            <span className="text-xs text-neutral-500">{alert.coat_check_peak_demand_per_night}/night peak</span>
                          )}
                          {alert.coat_check_event_night_demand != null && alert.coat_check_event_night_demand > 0 && (
                            <span className="text-xs text-amber-600 font-medium">{alert.coat_check_event_night_demand} event</span>
                          )}
                          {alert.coat_check_overflow_per_week != null && alert.coat_check_overflow_per_week > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.coat_check_overflow_per_week} overflow/wk</span>
                          )}
                          {alert.coat_check_staffed_hours_per_day != null && alert.coat_check_staffed_hours_per_day > 0 && (
                            <span className={`text-xs ${alert.coat_check_staffed_hours_per_day < 4 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.coat_check_staffed_hours_per_day}h/day</span>
                          )}
                          {alert.coat_check_peak_hours_covered != null && (
                            <span className={`text-xs ${alert.coat_check_peak_hours_covered ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.coat_check_peak_hours_covered ? 'peak covered' : 'peak NOT covered'}</span>
                          )}
                          {alert.coat_check_winter_hours != null && alert.coat_check_summer_hours != null && alert.coat_check_winter_hours > 0 && (
                            <span className={`text-xs ${alert.coat_check_winter_hours === alert.coat_check_summer_hours ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>winter {alert.coat_check_winter_hours}h / summer {alert.coat_check_summer_hours}h</span>
                          )}
                          {alert.has_ticket_system != null && (
                            <span className={`text-xs ${alert.has_ticket_system ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_ticket_system ? 'tickets yes' : 'NO tickets'}</span>
                          )}
                          {alert.ticket_system_type && alert.ticket_system_type !== 'none' && (
                            <span className={`text-xs font-medium ${alert.ticket_system_type === 'digital_qr' || alert.ticket_system_type === 'rfid' ? 'text-emerald-600' : 'text-amber-600'}`}>{alert.ticket_system_type}</span>
                          )}
                          {alert.has_digital_tickets != null && (
                            <span className={`text-xs ${alert.has_digital_tickets ? 'text-emerald-600 font-medium' : 'text-neutral-500'}`}>{alert.has_digital_tickets ? 'digital QR' : 'no digital'}</span>
                          )}
                          {alert.has_coat_security != null && (
                            <span className={`text-xs ${alert.has_coat_security ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_coat_security ? 'security yes' : 'NO security'}</span>
                          )}
                          {alert.coat_security_type && alert.coat_security_type !== 'none' && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.coat_security_type}</span>
                          )}
                          {alert.has_valuables_locker != null && (
                            <span className={`text-xs ${alert.has_valuables_locker ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_valuables_locker ? 'locker yes' : 'no locker'}</span>
                          )}
                          {alert.has_security_cameras_coat_check != null && (
                            <span className={`text-xs ${alert.has_security_cameras_coat_check ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_security_cameras_coat_check ? 'cameras yes' : 'no cameras'}</span>
                          )}
                          {alert.event_nights_per_week != null && alert.event_nights_per_week > 0 && (
                            <span className="text-xs text-amber-600 font-medium">{alert.event_nights_per_week} event nights/wk</span>
                          )}
                          {alert.coat_check_ada_accessible != null && (
                            <span className={`text-xs ${alert.coat_check_ada_accessible ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.coat_check_ada_accessible ? 'ADA yes' : 'NO ADA'}</span>
                          )}
                          {alert.winter_revenue_share_pct != null && alert.winter_revenue_share_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.winter_revenue_share_pct}% winter rev</span>
                          )}
                          {alert.avg_dwell_time_min != null && alert.avg_dwell_time_min > 0 && (
                            <span className="text-xs text-neutral-500">{alert.avg_dwell_time_min}min dwell</span>
                          )}
                          {alert.coat_check_usage_rate_pct != null && alert.coat_check_usage_rate_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.coat_check_usage_rate_pct}% usage</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 70 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 satisfaction</span>
                          )}
                          {alert.perceived_quality_score != null && alert.perceived_quality_score > 0 && (
                            <span className={`text-xs ${alert.perceived_quality_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.perceived_quality_score}/100 quality</span>
                          )}
                          {alert.brand_quality_score != null && alert.brand_quality_score > 0 && (
                            <span className={`text-xs ${alert.brand_quality_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.brand_quality_score}/100 brand</span>
                          )}
                          {alert.competitor_with_coat_check_pct != null && alert.competitor_with_coat_check_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_with_coat_check_pct}% competitors</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.winter_revenue_lift_projected_pct != null && alert.winter_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.winter_revenue_lift_projected_pct}% winter revenue (target)</span>
                          )}
                          {alert.dwell_time_lift_projected_min != null && alert.dwell_time_lift_projected_min > 0 && (
                            <span className="text-emerald-600">+{alert.dwell_time_lift_projected_min}min dwell (target)</span>
                          )}
                          {alert.perceived_quality_lift_projected_pts != null && alert.perceived_quality_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pts}pts perceived quality (target)</span>
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
                            <FontAwesomeIcon icon={faShirt} className="mt-0.5 shrink-0" />
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
          <span>Cold climate: <span className={config.requireCoatCheckColdClimate ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCoatCheckColdClimate ? 'required' : 'optional'}</span></span>
          <span>Staffed peak hours: <span className={config.requireStaffedPeakHours ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireStaffedPeakHours ? 'required' : 'optional'}</span></span>
          <span>Capacity: <span className={config.requireSufficientCapacity ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSufficientCapacity ? 'required' : 'optional'}</span></span>
          <span>Ticket system: <span className={config.requireTicketSystem ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTicketSystem ? 'required' : 'optional'}</span></span>
          <span>Placement near entrance: <span className={config.requirePlacementNearEntrance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePlacementNearEntrance ? 'required' : 'optional'}</span></span>
          <span>Fine dining: <span className={config.requireCoatCheckFineDining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCoatCheckFineDining ? 'required' : 'optional'}</span></span>
          <span>Security: <span className={config.requireCoatSecurity ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCoatSecurity ? 'required' : 'optional'}</span></span>
          <span>Seasonal staffing match: <span className={config.requireSeasonalStaffingMatch ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSeasonalStaffingMatch ? 'required' : 'optional'}</span></span>
          <span>Min coat hooks: {config.minCoatCheckHooks}</span>
          <span>Min staffed hours/day: {config.minStaffedHoursPerDay}</span>
          <span>Min attendants: {config.minAttendantsCount}</span>
          <span>Max overflow/wk: {config.maxOverflowPerWeek}</span>
          <span>ADA accessible: <span className={config.minAdaAccessible ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.minAdaAccessible ? 'required' : 'optional'}</span></span>
          <span>Digital tickets: <span className={config.requireDigitalTickets ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDigitalTickets ? 'preferred' : 'optional'}</span></span>
          <span className="text-neutral-400">193rd POSR-exclusive differentiator</span>
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

export default CoatCheckCloakroomScreen;
