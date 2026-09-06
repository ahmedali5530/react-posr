/**
 * AI Tabletop Entertainment & Activity Optimizer — predicts how tabletop
 * entertainment (board games, trivia nights, conversation starter cards,
 * digital tablet games, kids activity sheets, tableside food prep) impacts
 * customer dwell time, satisfaction, spend per head, and return rate.
 *
 * 184th POSR-exclusive differentiator.
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
  faDiceThree, faRotate, faChildren, faQuestion, faPencil, faKitchenSet,
  faTabletScreenButton, faDiceFive, faPuzzlePiece, faWrench,
  faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runTabletopEntertainmentEngine, getActiveTabletopEntertainmentAlerts, getTabletopEntertainmentSummary,
  updateTabletopEntertainmentAlertStatus, readTabletopEntertainmentConfig, DEFAULT_TABLETOP_ENTERTAINMENT_CONFIG,
  type TabletopEntertainmentAlert,
} from "@/lib/tabletop-entertainment-activity.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  entertainment_absent_family_venue:    { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faChildren,           label: 'NO KIDS ACTIVITIES' },
  trivia_night_absent:                  { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faQuestion,           label: 'NO TRIVIA NIGHT' },
  conversation_starters_absent:         { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faPencil,             label: 'NO CONVO CARDS' },
  tableside_entertainment_missing:      { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faKitchenSet,         label: 'NO TABLESIDE PREP' },
  digital_tabletop_absent:              { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faTabletScreenButton, label: 'NO TABLET GAMES' },
  board_games_bar_absent:               { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faDiceFive,           label: 'NO BAR GAMES' },
  entertainment_not_segment_matched:    { bg: 'bg-yellow-50',   text: 'text-yellow-700',   icon: faPuzzlePiece,        label: 'SEGMENT MISMATCH' },
  entertainment_maintenance_poor:       { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faWrench,             label: 'BROKEN GAMES' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function TabletopEntertainmentActivityScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<TabletopEntertainmentAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noKidsCount: 0, noTriviaCount: 0, noTablesideCount: 0, maintenancePoorCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_TABLETOP_ENTERTAINMENT_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readTabletopEntertainmentConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveTabletopEntertainmentAlerts(db), getTabletopEntertainmentSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[tabletop-entertainment-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runTabletopEntertainmentEngine(db, config);
      toast.success(`Analyzed ${result.generated} tabletop entertainment + activity signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[tabletop-entertainment-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateTabletopEntertainmentAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[tabletop-entertainment-report] status failed', err);
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
      <DocumentTitle parts={["AI Tabletop Entertainment & Activity Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faDiceThree} className="text-fuchsia-600" />
              AI Tabletop Entertainment &amp; Activity Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how tabletop entertainment (board games, trivia nights, conversation starter cards, digital tablet games, kids activities, tableside prep, bar games, segment-matched entertainment, maintenance) impacts customer dwell + satisfaction + spend — tabletop entertainment extends dwell 20-30% (Cornell CHR); 55% of families choose restaurants with kids activities (NRA); trivia nights boost weeknight revenue 25-40%; tableside prep 30% satisfaction boost; digital games increase spend 12-18%; bar board games increase dwell 35% + drinks 20%
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faDiceThree} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze entertainment'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faChildren} label="No kids activities" value={String(summary.noKidsCount)} color={summary.noKidsCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faQuestion} label="No trivia night" value={String(summary.noTriviaCount)} color={summary.noTriviaCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faKitchenSet} label="No tableside prep" value={String(summary.noTablesideCount)} color={summary.noTablesideCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
          <SummaryCard icon={faWrench} label="Broken games" value={String(summary.maintenancePoorCount)} color={summary.maintenancePoorCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faDiceThree} spin className="text-4xl mb-3" />
            <p>Analyzing tabletop entertainment + activity opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No tabletop entertainment alerts</p>
            <p className="text-sm mt-1">Family-venue kids activities deployed, weekly trivia night with 30+ attendees, conversation starter cards rotating every 1-3 months, tableside prep dishes (guacamole, Caesar salad, flambé) at casual_dining + fine_dining, tablet games at 8+ tables with 12-18% spend lift, bar board game library with 4+ titles driving 35% bar dwell + 20% drink lift, segment match score 80+ across primary + secondary segments, monthly game maintenance audit with piece loss rate below 5% and cleanliness score 75+.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faDiceThree, label: alert.rule_id.toUpperCase() };
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
                          {alert.primary_segment && (
                            <span className="text-xs text-violet-600 font-medium">segment: {alert.primary_segment}</span>
                          )}
                          {alert.has_kids_activities != null && (
                            <span className={`text-xs ${alert.has_kids_activities ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_kids_activities ? 'kids yes' : 'NO kids'}</span>
                          )}
                          {alert.has_trivia_night != null && (
                            <span className={`text-xs ${alert.has_trivia_night ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_trivia_night ? 'trivia yes' : 'NO trivia'}</span>
                          )}
                          {alert.has_conversation_cards != null && (
                            <span className={`text-xs ${alert.has_conversation_cards ? 'text-emerald-600 font-medium' : 'text-sky-600 font-medium'}`}>{alert.has_conversation_cards ? 'cards yes' : 'NO cards'}</span>
                          )}
                          {alert.has_digital_tablet_games != null && (
                            <span className={`text-xs ${alert.has_digital_tablet_games ? 'text-emerald-600 font-medium' : 'text-violet-600 font-medium'}`}>{alert.has_digital_tablet_games ? 'tablets yes' : 'NO tablets'}</span>
                          )}
                          {alert.has_tableside_prep != null && (
                            <span className={`text-xs ${alert.has_tableside_prep ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_tableside_prep ? 'tableside yes' : 'NO tableside'}</span>
                          )}
                          {alert.has_bar_board_games != null && (
                            <span className={`text-xs ${alert.has_bar_board_games ? 'text-emerald-600 font-medium' : 'text-fuchsia-600 font-medium'}`}>{alert.has_bar_board_games ? 'bar games yes' : 'NO bar games'}</span>
                          )}
                          {alert.entertainment_types_count != null && alert.entertainment_types_count > 0 && (
                            <span className={`text-xs ${alert.entertainment_types_count < 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.entertainment_types_count} types</span>
                          )}
                          {alert.segment_match_score != null && alert.segment_match_score > 0 && (
                            <span className={`text-xs ${alert.segment_match_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>match {alert.segment_match_score}/100</span>
                          )}
                          {alert.trivia_night_frequency && alert.trivia_night_frequency !== 'none' && (
                            <span className="text-xs text-emerald-600 font-medium">trivia {alert.trivia_night_frequency}</span>
                          )}
                          {alert.trivia_night_weekday && alert.trivia_night_weekday !== 'none' && (
                            <span className="text-xs text-neutral-500">{alert.trivia_night_weekday}</span>
                          )}
                          {alert.trivia_attendance_avg != null && alert.trivia_attendance_avg > 0 && (
                            <span className="text-xs text-neutral-500">{alert.trivia_attendance_avg} avg attendance</span>
                          )}
                          {alert.trivia_revenue_lift_pct != null && alert.trivia_revenue_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.trivia_revenue_lift_pct}% wknight revenue</span>
                          )}
                          {alert.conversation_card_decks_count != null && alert.conversation_card_decks_count > 0 && (
                            <span className="text-xs text-sky-600 font-medium">{alert.conversation_card_decks_count} card decks</span>
                          )}
                          {alert.conversation_card_refresh_months != null && alert.conversation_card_refresh_months > 0 && (
                            <span className={`text-xs ${alert.conversation_card_refresh_months > 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.conversation_card_refresh_months}mo refresh</span>
                          )}
                          {alert.conversation_card_usage_pct != null && alert.conversation_card_usage_pct > 0 && (
                            <span className={`text-xs ${alert.conversation_card_usage_pct < 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.conversation_card_usage_pct}% usage</span>
                          )}
                          {alert.kids_activity_types && alert.kids_activity_types.length > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.kids_activity_types.join(', ')}</span>
                          )}
                          {alert.kids_activity_count != null && alert.kids_activity_count > 0 && (
                            <span className={`text-xs ${alert.kids_activity_count < 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.kids_activity_count} kids types</span>
                          )}
                          {alert.family_segment_pct != null && alert.family_segment_pct > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.family_segment_pct}% family</span>
                          )}
                          {alert.families_choosing_for_activities_pct != null && alert.families_choosing_for_activities_pct > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.families_choosing_for_activities_pct}% families choose</span>
                          )}
                          {alert.tablet_games_count != null && alert.tablet_games_count > 0 && (
                            <span className={`text-xs ${alert.tablet_games_count < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.tablet_games_count} tablets</span>
                          )}
                          {alert.tablet_games_titles && alert.tablet_games_titles.length > 0 && (
                            <span className="text-xs text-neutral-500">{alert.tablet_games_titles.join(', ')}</span>
                          )}
                          {alert.tablet_games_spend_lift_pct != null && alert.tablet_games_spend_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.tablet_games_spend_lift_pct}% tablet spend</span>
                          )}
                          {alert.tablet_games_dwell_lift_pct != null && alert.tablet_games_dwell_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.tablet_games_dwell_lift_pct}% tablet dwell</span>
                          )}
                          {alert.tableside_prep_items_count != null && alert.tableside_prep_items_count > 0 && (
                            <span className={`text-xs ${alert.tableside_prep_items_count < 2 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.tableside_prep_items_count} tableside dishes</span>
                          )}
                          {alert.tableside_prep_satisfaction_lift_pct != null && alert.tableside_prep_satisfaction_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.tableside_prep_satisfaction_lift_pct}% tableside CSAT</span>
                          )}
                          {alert.tableside_prep_spend_lift_pct != null && alert.tableside_prep_spend_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.tableside_prep_spend_lift_pct}% tableside spend</span>
                          )}
                          {alert.bar_board_games_count != null && alert.bar_board_games_count > 0 && (
                            <span className={`text-xs ${alert.bar_board_games_count < 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.bar_board_games_count} bar games</span>
                          )}
                          {alert.bar_board_games_dwell_lift_pct != null && alert.bar_board_games_dwell_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.bar_board_games_dwell_lift_pct}% bar dwell</span>
                          )}
                          {alert.bar_drinks_lift_pct != null && alert.bar_drinks_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.bar_drinks_lift_pct}% drinks</span>
                          )}
                          {alert.entertainment_pieces_total != null && alert.entertainment_pieces_total > 0 && (
                            <span className="text-xs text-neutral-500">{alert.entertainment_pieces_total} pieces</span>
                          )}
                          {alert.entertainment_pieces_missing != null && alert.entertainment_pieces_missing > 0 && (
                            <span className={`text-xs ${alert.entertainment_pieces_missing > 3 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.entertainment_pieces_missing} missing</span>
                          )}
                          {alert.entertainment_piece_loss_rate_pct != null && alert.entertainment_piece_loss_rate_pct > 0 && (
                            <span className={`text-xs ${alert.entertainment_piece_loss_rate_pct > 10 ? 'text-rose-600 font-medium' : alert.entertainment_piece_loss_rate_pct > 5 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.entertainment_piece_loss_rate_pct}% loss rate</span>
                          )}
                          {alert.entertainment_cleanliness_score != null && alert.entertainment_cleanliness_score > 0 && (
                            <span className={`text-xs ${alert.entertainment_cleanliness_score < 50 ? 'text-rose-600 font-medium' : alert.entertainment_cleanliness_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>cleanliness {alert.entertainment_cleanliness_score}/100</span>
                          )}
                          {alert.entertainment_refresh_months != null && alert.entertainment_refresh_months > 0 && (
                            <span className={`text-xs ${alert.entertainment_refresh_months > 6 ? 'text-rose-600 font-medium' : alert.entertainment_refresh_months > 3 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>refresh {alert.entertainment_refresh_months}mo ago</span>
                          )}
                          {alert.avg_dwell_time_min != null && alert.avg_dwell_time_min > 0 && (
                            <span className="text-xs text-neutral-500">{alert.avg_dwell_time_min} min dwell</span>
                          )}
                          {alert.avg_dwell_no_entertainment_min != null && alert.avg_dwell_no_entertainment_min > 0 && (
                            <span className="text-xs text-neutral-500">baseline {alert.avg_dwell_no_entertainment_min} min</span>
                          )}
                          {alert.avg_dwell_with_entertainment_min != null && alert.avg_dwell_with_entertainment_min > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">entertainment {alert.avg_dwell_with_entertainment_min} min</span>
                          )}
                          {alert.dwell_lift_min != null && alert.dwell_lift_min > 0 && (
                            <span className={`text-xs ${alert.dwell_lift_min < 15 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.dwell_lift_min} min dwell</span>
                          )}
                          {alert.dwell_lift_pct != null && alert.dwell_lift_pct > 0 && (
                            <span className={`text-xs ${alert.dwell_lift_pct < 20 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.dwell_lift_pct}% dwell</span>
                          )}
                          {alert.avg_spend_no_entertainment != null && alert.avg_spend_no_entertainment > 0 && (
                            <span className="text-xs text-neutral-500">${alert.avg_spend_no_entertainment} baseline spend</span>
                          )}
                          {alert.avg_spend_with_entertainment != null && alert.avg_spend_with_entertainment > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">${alert.avg_spend_with_entertainment} entertainment spend</span>
                          )}
                          {alert.spend_lift_pct != null && alert.spend_lift_pct > 0 && (
                            <span className={`text-xs ${alert.spend_lift_pct < 12 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.spend_lift_pct}% spend</span>
                          )}
                          {alert.return_rate_with_entertainment_pct != null && alert.return_rate_with_entertainment_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.return_rate_with_entertainment_pct}% return w/ entertainment</span>
                          )}
                          {alert.return_rate_without_entertainment_pct != null && alert.return_rate_without_entertainment_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.return_rate_without_entertainment_pct}% return baseline</span>
                          )}
                          {alert.return_rate_lift_pct != null && alert.return_rate_lift_pct > 0 && (
                            <span className={`text-xs ${alert.return_rate_lift_pct < 10 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.return_rate_lift_pct}% return lift</span>
                          )}
                          {alert.customer_satisfaction_with_entertainment != null && alert.customer_satisfaction_with_entertainment > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.customer_satisfaction_with_entertainment}/100 CSAT w/ entertainment</span>
                          )}
                          {alert.customer_satisfaction_without_entertainment != null && alert.customer_satisfaction_without_entertainment > 0 && (
                            <span className="text-xs text-neutral-500">{alert.customer_satisfaction_without_entertainment}/100 baseline CSAT</span>
                          )}
                          {alert.satisfaction_lift_pct != null && alert.satisfaction_lift_pct > 0 && (
                            <span className={`text-xs ${alert.satisfaction_lift_pct < 15 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.satisfaction_lift_pct}% CSAT</span>
                          )}
                          {alert.competitors_with_entertainment_pct != null && alert.competitors_with_entertainment_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_entertainment_pct}% competitors have</span>
                          )}
                          {alert.entertainment_aware_lost_customers != null && alert.entertainment_aware_lost_customers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.entertainment_aware_lost_customers} lost customers</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          {alert.entertainment_hardware_cost != null && alert.entertainment_hardware_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.entertainment_hardware_cost} hardware</span>
                          )}
                          {alert.entertainment_monthly_refresh_cost != null && alert.entertainment_monthly_refresh_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.entertainment_monthly_refresh_cost}/mo refresh</span>
                          )}
                          {alert.entertainment_staff_time_cost != null && alert.entertainment_staff_time_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.entertainment_staff_time_cost}/mo staff</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.dwell_lift_projected_min != null && alert.dwell_lift_projected_min > 0 && (
                            <span className="text-emerald-600">+{alert.dwell_lift_projected_min} min dwell (target)</span>
                          )}
                          {alert.dwell_lift_projected_pct != null && alert.dwell_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.dwell_lift_projected_pct}% dwell (target)</span>
                          )}
                          {alert.spend_lift_projected_pct != null && alert.spend_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.spend_lift_projected_pct}% spend (target)</span>
                          )}
                          {alert.return_rate_lift_projected_pct != null && alert.return_rate_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.return_rate_lift_projected_pct}% return rate (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pct != null && alert.satisfaction_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pct}% satisfaction (target)</span>
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
                            <FontAwesomeIcon icon={faDiceThree} className="mt-0.5 shrink-0" />
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
          <span>Kids activities: <span className={config.requireKidsActivities ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireKidsActivities ? 'required' : 'optional'}</span></span>
          <span>Trivia night: <span className={config.requireTriviaNight ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTriviaNight ? 'required' : 'optional'}</span></span>
          <span>Conversation cards: <span className={config.requireConversationCards ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireConversationCards ? 'required' : 'optional'}</span></span>
          <span>Tableside prep: <span className={config.requireTablesidePrep ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTablesidePrep ? 'required' : 'optional'}</span></span>
          <span>Digital tablet games: <span className={config.requireDigitalTabletGames ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDigitalTabletGames ? 'required' : 'optional'}</span></span>
          <span>Bar board games: <span className={config.requireBarBoardGames ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBarBoardGames ? 'required' : 'optional'}</span></span>
          <span>Segment match: <span className={config.requireSegmentMatch ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSegmentMatch ? 'required' : 'optional'}</span></span>
          <span>Maintenance: <span className={config.requireEntertainmentMaintenance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireEntertainmentMaintenance ? 'required' : 'optional'}</span></span>
          <span>Min entertainment types: {config.minEntertainmentTypes}</span>
          <span>Min segment match: {config.minSegmentMatchScore}/100</span>
          <span>Max piece loss rate: {config.maxPieceLossRate}%</span>
          <span>Min cleanliness: {config.minCleanlinessScore}/100</span>
          <span>Max refresh months: {config.maxRefreshMonths}</span>
          <span>Min dwell lift: {config.minDwellLiftPct}%</span>
          <span>Min spend lift: {config.minSpendLiftPct}%</span>
          <span>Min satisfaction lift: {config.minSatisfactionLiftPct}%</span>
          <span className="text-neutral-400">184th POSR-exclusive differentiator</span>
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

export default TabletopEntertainmentActivityScreen;
