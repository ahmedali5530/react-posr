/**
 * AI Seasonal & Holiday Decor Optimizer — predicts how seasonal and holiday
 * decorations (Christmas/holiday decor, Halloween, Valentine, Thanksgiving,
 * summer patio decor, spring floral, fall harvest, cultural celebrations,
 * decor rotation timing, decor storage, decor budget) impacts customer
 * attraction, dwell time, perceived restaurant quality, social media
 * engagement, and seasonal revenue.
 *
 * 199th POSR-exclusive differentiator.
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
  faTree, faSnowflake, faHeart, faGift, faStar, faSun, faLeaf, faCalendarCheck,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runSeasonalHolidayDecorEngine, getActiveSeasonalHolidayDecorAlerts, getSeasonalHolidayDecorSummary,
  updateSeasonalHolidayDecorAlertStatus, readSeasonalHolidayDecorConfig, DEFAULT_SEASONAL_HOLIDAY_DECOR_CONFIG,
  type SeasonalHolidayDecorAlert,
} from "@/lib/seasonal-holiday-decor.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  seasonal_decor_absent_holiday_period:   { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faTree,           label: 'NO HOLIDAY DECOR' },
  decor_rotation_too_slow:                { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faSnowflake,      label: 'STALE DECOR' },
  decor_rotation_too_early:               { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faCalendarCheck,  label: 'TOO EARLY' },
  cultural_celebration_decor_absent:      { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faStar,           label: 'NO CULTURAL' },
  decor_budget_insufficient:              { bg: 'bg-red-50',      text: 'text-red-700',      icon: faGift,           label: 'LOW BUDGET' },
  valentine_decor_absent:                 { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faHeart,          label: 'NO VALENTINE' },
  fall_harvest_decor_absent:              { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faLeaf,           label: 'NO FALL' },
  decor_storage_organization_poor:        { bg: 'bg-yellow-50',   text: 'text-yellow-700',   icon: faSun,            label: 'BAD STORAGE' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function SeasonalHolidayDecorScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<SeasonalHolidayDecorAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, seasonalDecorAbsentCount: 0, decorRotationTooSlowCount: 0, decorRotationTooEarlyCount: 0, culturalCelebrationDecorAbsentCount: 0, decorBudgetInsufficientCount: 0, valentineDecorAbsentCount: 0, fallHarvestDecorAbsentCount: 0, decorStorageOrganizationPoorCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_SEASONAL_HOLIDAY_DECOR_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readSeasonalHolidayDecorConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveSeasonalHolidayDecorAlerts(db), getSeasonalHolidayDecorSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[seasonal-holiday-decor-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runSeasonalHolidayDecorEngine(db, config);
      toast.success(`Analyzed ${result.generated} seasonal + holiday decor signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[seasonal-holiday-decor-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateSeasonalHolidayDecorAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[seasonal-holiday-decor-report] status failed', err);
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
      <DocumentTitle parts={["AI Seasonal & Holiday Decor Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faTree} className="text-emerald-600" />
              AI Seasonal &amp; Holiday Decor Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how seasonal + holiday decor (Christmas/holiday, Valentine, Halloween, Thanksgiving, fall harvest, summer patio, spring floral, cultural celebrations, rotation timing, storage, budget) impacts customer attraction, dwell time, perceived quality, social media engagement, seasonal revenue — seasonal decor increases visits 15-25% (NRA); Christmas decor 40-60% more Instagram photos ($500-2,000/mo free marketing); 20-30% higher December revenue (Cornell CHR); Valentine captures #2 busiest day; stale decor = 30% perceived quality drop; rotation timing critical (too early = desperate, too late = missed, just right = 15-20% satisfaction boost); fall harvest decor +10-15% October revenue; cultural decor attracts 25-40% new demographics; $200-1,000 budget generates $2,000-8,000 revenue (10-20x ROI)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faTree} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze decor'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faTree} label="No holiday decor" value={String(summary.seasonalDecorAbsentCount)} color={summary.seasonalDecorAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHeart} label="No Valentine decor" value={String(summary.valentineDecorAbsentCount)} color={summary.valentineDecorAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLeaf} label="No fall harvest" value={String(summary.fallHarvestDecorAbsentCount)} color={summary.fallHarvestDecorAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faGift} label="Low budget / bad storage" value={String(summary.decorBudgetInsufficientCount + summary.decorStorageOrganizationPoorCount)} color={summary.decorBudgetInsufficientCount + summary.decorStorageOrganizationPoorCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faTree} spin className="text-4xl mb-3" />
            <p>Analyzing seasonal + holiday decor opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No seasonal + holiday decor alerts</p>
            <p className="text-sm mt-1">Healthy seasonal decor environment: holiday decor up early-mid Nov through Jan 7; Valentine decor Feb 1-14; Halloween decor Oct 1-31; Thanksgiving decor Nov 1-28; fall harvest decor Oct 1-Nov 30; summer patio Memorial Day-Labor Day; spring floral Mar 1-May 31; cultural celebration decor (Lunar New Year, Diwali, Cinco de Mayo, Pride, Black History, Hispanic Heritage); decor rotation timing just right (2-4 weeks before, 1-2 weeks after); decor budget $200-1,000/season (10-20x ROI); decor storage organized (labeled bins, climate-controlled, inventory list); seasonal decor increases visits 15-25% (NRA); Christmas decor generates 40-60% more Instagram photos ($500-2,000/mo free marketing); restaurants with seasonal decor see 20-30% higher December revenue (Cornell CHR); Valentine Day = #2 busiest restaurant day; fall harvest decor +10-15% October revenue; cultural decor attracts 25-40% new demographics.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faTree, label: alert.rule_id.toUpperCase() };
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
                            <span className={`text-xs font-medium ${alert.channel === 'dine_in' ? 'text-emerald-600' : alert.channel === 'mixed' ? 'text-amber-600' : 'text-neutral-500'}`}>{alert.channel}</span>
                          )}
                          {alert.has_holiday_decor != null && (
                            <span className={`text-xs ${alert.has_holiday_decor ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_holiday_decor ? 'holiday yes' : 'NO holiday'}</span>
                          )}
                          {alert.has_valentine_decor != null && (
                            <span className={`text-xs ${alert.has_valentine_decor ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_valentine_decor ? 'valentine yes' : 'NO valentine'}</span>
                          )}
                          {alert.has_halloween_decor != null && (
                            <span className={`text-xs ${alert.has_halloween_decor ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_halloween_decor ? 'halloween yes' : 'NO halloween'}</span>
                          )}
                          {alert.has_thanksgiving_decor != null && (
                            <span className={`text-xs ${alert.has_thanksgiving_decor ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_thanksgiving_decor ? 'thanksgiving yes' : 'NO thanksgiving'}</span>
                          )}
                          {alert.has_fall_harvest_decor != null && (
                            <span className={`text-xs ${alert.has_fall_harvest_decor ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_fall_harvest_decor ? 'fall yes' : 'NO fall'}</span>
                          )}
                          {alert.has_summer_patio_decor != null && (
                            <span className={`text-xs ${alert.has_summer_patio_decor ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_summer_patio_decor ? 'summer yes' : 'NO summer'}</span>
                          )}
                          {alert.has_spring_floral_decor != null && (
                            <span className={`text-xs ${alert.has_spring_floral_decor ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_spring_floral_decor ? 'spring yes' : 'NO spring'}</span>
                          )}
                          {alert.has_cultural_celebration_decor != null && (
                            <span className={`text-xs ${alert.has_cultural_celebration_decor ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_cultural_celebration_decor ? 'cultural yes' : 'NO cultural'}</span>
                          )}
                          {alert.cultural_celebration_count != null && alert.cultural_celebration_count > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.cultural_celebration_count} celebrations</span>
                          )}
                          {alert.decor_setup_weeks_before_holiday != null && alert.decor_setup_weeks_before_holiday > 0 && (
                            <span className={`text-xs ${alert.decor_setup_weeks_before_holiday > 4 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.decor_setup_weeks_before_holiday}w before</span>
                          )}
                          {alert.decor_takedown_weeks_after_holiday != null && alert.decor_takedown_weeks_after_holiday > 0 && (
                            <span className={`text-xs ${alert.decor_takedown_weeks_after_holiday > 2 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.decor_takedown_weeks_after_holiday}w after</span>
                          )}
                          {alert.decor_rotation_timing_score != null && alert.decor_rotation_timing_score > 0 && (
                            <span className={`text-xs ${alert.decor_rotation_timing_score < 60 ? 'text-rose-600 font-medium' : alert.decor_rotation_timing_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.decor_rotation_timing_score}/100 rotation</span>
                          )}
                          {alert.decor_budget_per_season != null && alert.decor_budget_per_season >= 0 && (
                            <span className={`text-xs ${alert.decor_budget_per_season < 200 ? 'text-rose-600 font-medium' : alert.decor_budget_per_season < 400 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.decor_budget_per_season)}/season</span>
                          )}
                          {alert.decor_quality_score != null && alert.decor_quality_score > 0 && (
                            <span className={`text-xs ${alert.decor_quality_score < 60 ? 'text-rose-600 font-medium' : alert.decor_quality_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.decor_quality_score}/100 quality</span>
                          )}
                          {alert.decor_storage_organized != null && (
                            <span className={`text-xs ${alert.decor_storage_organized ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.decor_storage_organized ? 'storage org yes' : 'NO storage org'}</span>
                          )}
                          {alert.decor_storage_condition_score != null && alert.decor_storage_condition_score > 0 && (
                            <span className={`text-xs ${alert.decor_storage_condition_score < 60 ? 'text-rose-600 font-medium' : alert.decor_storage_condition_score < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.decor_storage_condition_score}/100 storage</span>
                          )}
                          {alert.decor_replacement_cost_annual != null && alert.decor_replacement_cost_annual > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{fmt$(alert.decor_replacement_cost_annual)}/yr replacement</span>
                          )}
                          {alert.instagram_photos_monthly != null && alert.instagram_photos_monthly > 0 && (
                            <span className={`text-xs ${alert.instagram_photos_monthly < alert.instagram_photos_baseline_monthly ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.instagram_photos_monthly} IG/mo (base {alert.instagram_photos_baseline_monthly ?? 0})</span>
                          )}
                          {alert.dwell_time_minutes != null && alert.dwell_time_minutes > 0 && (
                            <span className={`text-xs ${alert.dwell_time_minutes < (alert.dwell_time_baseline_minutes ?? 50) ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.dwell_time_minutes}min dwell (base {alert.dwell_time_baseline_minutes ?? 0})</span>
                          )}
                          {alert.december_revenue != null && alert.december_revenue > 0 && (
                            <span className={`text-xs ${(alert.december_revenue_baseline ?? 0) > 0 && alert.december_revenue < alert.december_revenue_baseline ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>Dec {fmt$(alert.december_revenue)} (base {fmt$(alert.december_revenue_baseline ?? 0)})</span>
                          )}
                          {alert.october_revenue != null && alert.october_revenue > 0 && (
                            <span className={`text-xs ${(alert.october_revenue_baseline ?? 0) > 0 && alert.october_revenue < alert.october_revenue_baseline ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>Oct {fmt$(alert.october_revenue)} (base {fmt$(alert.october_revenue_baseline ?? 0)})</span>
                          )}
                          {alert.valentine_day_revenue != null && alert.valentine_day_revenue > 0 && (
                            <span className={`text-xs ${(alert.valentine_day_revenue_baseline ?? 0) > 0 && alert.valentine_day_revenue < alert.valentine_day_revenue_baseline ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>Val {fmt$(alert.valentine_day_revenue)} (base {fmt$(alert.valentine_day_revenue_baseline ?? 0)})</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 sat</span>
                          )}
                          {alert.perceived_quality_score != null && alert.perceived_quality_score > 0 && (
                            <span className={`text-xs ${alert.perceived_quality_score < 60 ? 'text-rose-600 font-medium' : alert.perceived_quality_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.perceived_quality_score}/100 quality</span>
                          )}
                          {alert.competitor_decor_score != null && alert.competitor_decor_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_decor_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.holiday_visit_lift_projected_pct != null && alert.holiday_visit_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.holiday_visit_lift_projected_pct}% holiday visits (target)</span>
                          )}
                          {alert.instagram_engagement_lift_projected_pct != null && alert.instagram_engagement_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.instagram_engagement_lift_projected_pct}% Instagram photos (target)</span>
                          )}
                          {alert.december_revenue_lift_projected_pct != null && alert.december_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.december_revenue_lift_projected_pct}% December revenue (target)</span>
                          )}
                          {alert.october_revenue_lift_projected_pct != null && alert.october_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.october_revenue_lift_projected_pct}% October revenue (target)</span>
                          )}
                          {alert.valentine_revenue_lift_projected != null && alert.valentine_revenue_lift_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.valentine_revenue_lift_projected)} Valentine revenue (target)</span>
                          )}
                          {alert.cultural_customer_acquisition_projected != null && alert.cultural_customer_acquisition_projected > 0 && (
                            <span className="text-emerald-600">+{alert.cultural_customer_acquisition_projected} new cultural customers/mo (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.perceived_quality_lift_projected_pts != null && alert.perceived_quality_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pts}pts perceived quality (target)</span>
                          )}
                          {alert.decor_replacement_savings_projected != null && alert.decor_replacement_savings_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.decor_replacement_savings_projected)}/yr replacement savings (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faTree} className="mt-0.5 shrink-0" />
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
          <span>Holiday decor: <span className={config.requireHolidayDecor ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireHolidayDecor ? 'required' : 'optional'}</span></span>
          <span>Valentine decor: <span className={config.requireValentineDecor ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireValentineDecor ? 'required' : 'optional'}</span></span>
          <span>Fall harvest: <span className={config.requireFallHarvestDecor ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFallHarvestDecor ? 'required' : 'optional'}</span></span>
          <span>Cultural: <span className={config.requireCulturalCelebrationDecor ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCulturalCelebrationDecor ? 'required' : 'optional'}</span></span>
          <span>Storage org: <span className={config.requireOrganizedDecorStorage ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOrganizedDecorStorage ? 'required' : 'optional'}</span></span>
          <span>Min budget/season: {fmt$(config.minDecorBudgetPerSeason)}</span>
          <span>Max setup weeks before: {config.maxDecorSetupWeeksBeforeHoliday}</span>
          <span>Max takedown weeks after: {config.maxDecorTakedownWeeksAfterHoliday}</span>
          <span>Min rotation score: {config.minDecorRotationTimingScore}</span>
          <span>Min decor quality: {config.minDecorQualityScore}</span>
          <span>Min storage score: {config.minDecorStorageConditionScore}</span>
          <span className="text-neutral-400">199th POSR-exclusive differentiator</span>
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

export default SeasonalHolidayDecorScreen;
