/**
 * AI Live Music & Performance Booking Optimizer — predicts how live music
 * and performances (acoustic acts, jazz trios, solo performers, DJ nights,
 * open mic, karaoke, cultural performances) impact customer acquisition,
 * dwell time, beverage revenue, brand differentiation, and operational
 * considerations (noise levels, performance scheduling, artist booking,
 * stage setup).
 *
 * 189th POSR-exclusive differentiator.
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
  faMusic, faRotate, faGuitar, faMicrophoneLines, faHeadphones,
  faCompactDisc, faVolumeHigh, faCalendarCheck, faBullhorn,
  faCircleInfo, faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runLiveMusicPerformanceEngine, getActiveLiveMusicPerformanceAlerts, getLiveMusicPerformanceSummary,
  updateLiveMusicPerformanceAlertStatus, readLiveMusicPerformanceConfig, DEFAULT_LIVE_MUSIC_PERFORMANCE_CONFIG,
  type LiveMusicPerformanceAlert,
} from "@/lib/live-music-performance.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  live_music_absent_weekend_venue:           { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faMusic,             label: 'NO WEEKEND LIVE MUSIC' },
  performance_schedule_wrong:                { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faCalendarCheck,     label: 'WRONG SCHEDULE' },
  artist_budget_too_low:                     { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faGuitar,            label: 'LOW ARTIST BUDGET' },
  performance_area_inadequate:               { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faVolumeHigh,        label: 'POOR PERFORMANCE AREA' },
  genre_restaurant_mismatch:                 { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faCompactDisc,       label: 'GENRE MISMATCH' },
  dj_night_absent_young_demographic:         { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faHeadphones,        label: 'NO DJ NIGHT' },
  open_mic_karaoke_absent_community_venue:   { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faMicrophoneLines,   label: 'NO OPEN MIC/KARAOKE' },
  live_music_not_promoted:                   { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faBullhorn,          label: 'NOT PROMOTED' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function LiveMusicPerformanceScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<LiveMusicPerformanceAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noWeekendLiveMusicCount: 0, wrongScheduleCount: 0, lowBudgetCount: 0, notPromotedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_LIVE_MUSIC_PERFORMANCE_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readLiveMusicPerformanceConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveLiveMusicPerformanceAlerts(db), getLiveMusicPerformanceSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[live-music-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runLiveMusicPerformanceEngine(db, config);
      toast.success(`Analyzed ${result.generated} live music signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[live-music-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateLiveMusicPerformanceAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[live-music-report] status failed', err);
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
      <DocumentTitle parts={["AI Live Music & Performance Booking Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faMusic} className="text-violet-500" />
              AI Live Music &amp; Performance Booking Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how live music and performances (acoustic acts, jazz trios, solo performers, DJ nights, open mic, karaoke, cultural performances) impact beverage revenue, weekend reservations, dwell time, brand differentiation — live music +25-40% beverage (NRA); 30-45% weekend reservations (OpenTable); 58% extend stay (Cornell CHR); acoustic $150-400/night generates $1,500-4,000; jazz trios $400-1,200/night premium positioning; DJ nights 35% new acquisition; open mic/karaoke 20% regular conversion; poor scheduling -15-20% food sales
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faMusic} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze performances'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faMusic} label="No weekend live music" value={String(summary.noWeekendLiveMusicCount)} color={summary.noWeekendLiveMusicCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCalendarCheck} label="Wrong schedule" value={String(summary.wrongScheduleCount)} color={summary.wrongScheduleCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faGuitar} label="Low artist budget" value={String(summary.lowBudgetCount)} color={summary.lowBudgetCount > 0 ? 'text-violet-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBullhorn} label="Not promoted" value={String(summary.notPromotedCount)} color={summary.notPromotedCount > 0 ? 'text-cyan-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faMusic} spin className="text-4xl mb-3" />
            <p>Analyzing live music &amp; performance booking opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No live music alerts</p>
            <p className="text-sm mt-1">Weekend live music with 25-40% beverage lift (NRA) and 30-45% weekend reservation lift (OpenTable); 58% of customers extend stay for live music (Cornell CHR); performances scheduled after 21:00 (no dinner rush disruption); artist budgets at/above market rate ($150-400 acoustic, $400-1,200 jazz trio, $200-600 DJ); dedicated performance area with stage + lighting + professional sound system + monitor speakers; genre matches restaurant concept (jazz for steakhouse, mariachi for mexican, acoustic for italian); DJ nights for young demographic (35% new acquisition); open mic/karaoke weekly for community (20% regular conversion); performances promoted via 5+ channels with 75%+ fill rate.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faMusic, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_live_music != null && (
                            <span className={`text-xs ${alert.has_live_music ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_live_music ? 'live music yes' : 'NO live music'}</span>
                          )}
                          {alert.has_weekend_live_music != null && (
                            <span className={`text-xs ${alert.has_weekend_live_music ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_weekend_live_music ? 'weekend yes' : 'NO weekend music'}</span>
                          )}
                          {alert.has_dj_nights != null && (
                            <span className={`text-xs ${alert.has_dj_nights ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_dj_nights ? 'DJ yes' : 'NO DJ'}</span>
                          )}
                          {alert.has_open_mic_nights != null && (
                            <span className={`text-xs ${alert.has_open_mic_nights ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_open_mic_nights ? 'open mic yes' : 'NO open mic'}</span>
                          )}
                          {alert.has_karaoke_nights != null && (
                            <span className={`text-xs ${alert.has_karaoke_nights ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_karaoke_nights ? 'karaoke yes' : 'NO karaoke'}</span>
                          )}
                          {alert.performance_starts_during_dinner_rush != null && alert.performance_starts_during_dinner_rush && (
                            <span className="text-xs text-rose-600 font-medium">DINNER RUSH SCHEDULE</span>
                          )}
                          {alert.performances_after_dinner_only != null && alert.performances_after_dinner_only && (
                            <span className="text-xs text-emerald-600 font-medium">after-dinner only</span>
                          )}
                          {alert.avg_performance_start_time && (
                            <span className="text-xs text-neutral-500">start {alert.avg_performance_start_time}</span>
                          )}
                          {alert.artist_budget_per_night != null && alert.artist_budget_per_night > 0 && (
                            <span className={`text-xs ${alert.budget_below_market ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>${alert.artist_budget_per_night}/night</span>
                          )}
                          {alert.artist_quality_score != null && alert.artist_quality_score > 0 && (
                            <span className={`text-xs ${alert.artist_quality_score < 60 ? 'text-rose-600 font-medium' : alert.artist_quality_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.artist_quality_score}/100 artist quality</span>
                          )}
                          {alert.performance_area_score != null && alert.performance_area_score > 0 && (
                            <span className={`text-xs ${alert.performance_area_score < 60 ? 'text-rose-600 font-medium' : alert.performance_area_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.performance_area_score}/100 area</span>
                          )}
                          {alert.primary_music_genre && alert.primary_music_genre !== 'none' && (
                            <span className={`text-xs ${alert.genre_matches_concept ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.primary_music_genre}</span>
                          )}
                          {alert.genre_concept_match_score != null && alert.genre_concept_match_score > 0 && (
                            <span className={`text-xs ${alert.genre_concept_match_score < 75 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.genre_concept_match_score}/100 match</span>
                          )}
                          {alert.targets_young_demographic != null && alert.targets_young_demographic && (
                            <span className="text-xs text-emerald-600 font-medium">young demo</span>
                          )}
                          {alert.performance_fill_rate_pct != null && alert.performance_fill_rate_pct > 0 && (
                            <span className={`text-xs ${alert.performance_fill_rate_pct < 60 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.performance_fill_rate_pct}% fill</span>
                          )}
                          {alert.beverage_revenue_lift_pct != null && alert.beverage_revenue_lift_pct > 0 && (
                            <span className={`text-xs ${alert.beverage_revenue_lift_pct < 25 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.beverage_revenue_lift_pct}% bev</span>
                          )}
                          {alert.weekend_reservation_lift_pct != null && alert.weekend_reservation_lift_pct > 0 && (
                            <span className={`text-xs ${alert.weekend_reservation_lift_pct < 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.weekend_reservation_lift_pct}% reserv</span>
                          )}
                          {alert.dwell_time_lift_pct != null && alert.dwell_time_lift_pct > 0 && (
                            <span className={`text-xs ${alert.dwell_time_lift_pct < 25 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.dwell_time_lift_pct}% dwell</span>
                          )}
                          {alert.food_sales_during_performance_pct != null && alert.food_sales_during_performance_pct < 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.food_sales_during_performance_pct}% food sales</span>
                          )}
                          {alert.noise_complaints_monthly != null && alert.noise_complaints_monthly > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.noise_complaints_monthly} noise complaints/mo</span>
                          )}
                          {alert.new_customer_acquisition_monthly != null && alert.new_customer_acquisition_monthly > 0 && (
                            <span className="text-xs text-neutral-500">{alert.new_customer_acquisition_monthly} new/mo</span>
                          )}
                          {alert.competitors_with_live_music_pct != null && alert.competitors_with_live_music_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_live_music_pct}% competitors have music</span>
                          )}
                          {alert.music_aware_lost_customers != null && alert.music_aware_lost_customers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.music_aware_lost_customers} lost customers</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          {alert.live_music_program_total_monthly_cost != null && alert.live_music_program_total_monthly_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.live_music_program_total_monthly_cost}/mo program cost</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.beverage_revenue_lift_projected_pct != null && alert.beverage_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.beverage_revenue_lift_projected_pct}% beverage revenue (target)</span>
                          )}
                          {alert.weekend_reservation_lift_projected_pct != null && alert.weekend_reservation_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.weekend_reservation_lift_projected_pct}% weekend reservations (target)</span>
                          )}
                          {alert.dwell_time_lift_projected_pct != null && alert.dwell_time_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.dwell_time_lift_projected_pct}% dwell time (target)</span>
                          )}
                          {alert.brand_differentiation_lift_projected_pct != null && alert.brand_differentiation_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.brand_differentiation_lift_projected_pct}% brand differentiation (target)</span>
                          )}
                          {alert.new_customer_acquisition_projected_pct != null && alert.new_customer_acquisition_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.new_customer_acquisition_projected_pct}% new customer acquisition (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct < 0 && (
                            <span className="text-rose-600">{alert.predicted_revenue_change_pct}% revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-violet-50 border border-violet-200 rounded px-3 py-2 text-xs text-violet-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faMusic} className="mt-0.5 shrink-0" />
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
          <span>Weekend live music: <span className={config.requireWeekendLiveMusic ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireWeekendLiveMusic ? 'required' : 'optional'}</span></span>
          <span>Correct schedule: <span className={config.requireCorrectSchedule ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCorrectSchedule ? 'required' : 'optional'}</span></span>
          <span>Market-rate artist budget: <span className={config.requireMarketRateArtistBudget ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMarketRateArtistBudget ? 'required' : 'optional'}</span></span>
          <span>Performance area: <span className={config.requirePerformanceArea ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePerformanceArea ? 'required' : 'optional'}</span></span>
          <span>Genre match: <span className={config.requireGenreMatch ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireGenreMatch ? 'required' : 'optional'}</span></span>
          <span>DJ night (young demo): <span className={config.requireDjNightForYoungDemo ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDjNightForYoungDemo ? 'required' : 'optional'}</span></span>
          <span>Open mic/karaoke: <span className={config.requireOpenMicKaraokeForCommunity ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOpenMicKaraokeForCommunity ? 'required' : 'optional'}</span></span>
          <span>Performance promotion: <span className={config.requirePerformancePromotion ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePerformancePromotion ? 'required' : 'optional'}</span></span>
          <span>Min performance types: {config.minPerformanceTypes}</span>
          <span>Min acoustic/solo budget: ${config.minAcousticSoloBudget}/night</span>
          <span>Min jazz trio/band budget: ${config.minJazzTrioBandBudget}/night</span>
          <span>Min DJ budget: ${config.minDjBudget}/night</span>
          <span>Min performance area score: {config.minPerformanceAreaScore}</span>
          <span>Min genre match score: {config.minGenreMatchScore}</span>
          <span>Min beverage lift: {config.minBeverageLiftPct}%</span>
          <span>Min weekend reservation lift: {config.minWeekendReservationLiftPct}%</span>
          <span>Min dwell time lift: {config.minDwellTimeLiftPct}%</span>
          <span>Min fill rate: {config.minPerformanceFillRatePct}%</span>
          <span>Min DJ night new customer: {config.minDjNightNewCustomerPct}%</span>
          <span>Min open mic conversion: {config.minOpenMicConversionPct}%</span>
          <span className="text-neutral-400">189th POSR-exclusive differentiator</span>
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

export default LiveMusicPerformanceScreen;
