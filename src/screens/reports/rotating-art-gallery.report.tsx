/**
 * AI Rotating Art Gallery & Exhibition Optimizer — predicts how rotating
 * art exhibitions and gallery partnerships (monthly artist features, art
 * rotation schedule, artist commission structure, exhibition opening
 * events, art sale revenue, customer engagement with art, Instagram-worthy
 * installations, local artist partnerships, seasonal art themes) impact
 * additional revenue, customer acquisition, brand differentiation, and
 * marketing reach.
 *
 * 191st POSR-exclusive differentiator.
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
  faPalette, faRotate, faCalendarCheck, faHandshake, faStar,
  faBullhorn, faCamera, faLeaf,
  faCircleInfo, faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runRotatingArtGalleryEngine, getActiveRotatingArtGalleryAlerts, getRotatingArtGallerySummary,
  updateRotatingArtGalleryAlertStatus, readRotatingArtGalleryConfig, DEFAULT_ROTATING_ART_GALLERY_CONFIG,
  type RotatingArtGalleryAlert,
} from "@/lib/rotating-art-gallery.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  rotating_exhibition_absent:           { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faPalette,        label: 'NO EXHIBITION' },
  art_rotation_too_slow:                { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faRotate,         label: 'SLOW ROTATION' },
  artist_commission_structure_absent:   { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faStar,           label: 'NO COMMISSION' },
  exhibition_opening_event_absent:      { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faCalendarCheck,  label: 'NO OPENINGS' },
  local_artist_partnership_absent:      { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faHandshake,      label: 'NO LOCAL ARTISTS' },
  seasonal_art_theme_missing:           { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faLeaf,           label: 'NO SEASONAL' },
  art_not_instagram_worthy:             { bg: 'bg-pink-50',     text: 'text-pink-700',     icon: faCamera,         label: 'NOT INSTAGRAM' },
  art_promotion_insufficient:           { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faBullhorn,       label: 'WEAK PROMOTION' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function RotatingArtGalleryScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<RotatingArtGalleryAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, exhibitionAbsentCount: 0, rotationTooSlowCount: 0, commissionAbsentCount: 0, openingAbsentCount: 0, localArtistAbsentCount: 0, seasonalThemeMissingCount: 0, notInstagramWorthyCount: 0, promotionInsufficientCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_ROTATING_ART_GALLERY_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readRotatingArtGalleryConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveRotatingArtGalleryAlerts(db), getRotatingArtGallerySummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[rotating-art-gallery-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runRotatingArtGalleryEngine(db, config);
      toast.success(`Analyzed ${result.generated} rotating art signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[rotating-art-gallery-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateRotatingArtGalleryAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[rotating-art-gallery-report] status failed', err);
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
      <DocumentTitle parts={["AI Rotating Art Gallery & Exhibition Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faPalette} className="text-rose-500" />
              AI Rotating Art Gallery &amp; Exhibition Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how rotating art exhibitions and gallery partnerships (monthly artist features, art rotation schedule, artist commission structure, exhibition opening events, art sale revenue, customer engagement with art, Instagram-worthy installations, local artist partnerships, seasonal art themes) impact additional revenue, customer acquisition, brand differentiation, marketing reach — rotating exhibitions drive 15-25% repeat visit lift (Americans for the Arts); commission on art sales $500-3,000/mo passive revenue (10-20%); opening events attract 50-100+ new customers; 68% of art buyers are high-income ($100k+); free PR worth $1,000-5,000/event; Instagram-worthy installations 40-60% social boost; local artist partnerships community goodwill; seasonal art themes align with marketing; art events increase beverage sales 20-30% during openings
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faPalette} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze exhibitions'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faPalette} label="No exhibition" value={String(summary.exhibitionAbsentCount)} color={summary.exhibitionAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCalendarCheck} label="No openings" value={String(summary.openingAbsentCount)} color={summary.openingAbsentCount > 0 ? 'text-fuchsia-600' : 'text-emerald-600'} />
          <SummaryCard icon={faStar} label="No commission" value={String(summary.commissionAbsentCount)} color={summary.commissionAbsentCount > 0 ? 'text-violet-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHandshake} label="No local artists" value={String(summary.localArtistAbsentCount)} color={summary.localArtistAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faPalette} spin className="text-4xl mb-3" />
            <p>Analyzing rotating art gallery &amp; exhibition opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No rotating art alerts</p>
            <p className="text-sm mt-1">Healthy rotating art program: monthly artist features driving 15-25% repeat visit lift (Americans for the Arts); 1-2 month rotation cadence (max 3 months); 10-20% commission structure on art sales generating $500-3,000/mo passive revenue (zero inventory cost); quarterly opening receptions attracting 50-100+ new customers each; local artist partnerships with 3+ artists building community goodwill; seasonal art themes aligned with marketing calendar (holiday art, summer local landscapes, autumn harvest); Instagram-worthy installations driving 40-60% social mention boost; art promotion via email + social + in-house signage driving engagement score 70+; 68% of art buyers are high-income ($100k+ income); free PR/media coverage worth $1,000-5,000 per event; beverage sales 20-30% lift during opening receptions.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faPalette, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_rotating_exhibition != null && (
                            <span className={`text-xs ${alert.has_rotating_exhibition ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_rotating_exhibition ? 'exhibition yes' : 'NO exhibition'}</span>
                          )}
                          {alert.rotation_frequency_months != null && alert.rotation_frequency_months > 0 && (
                            <span className={`text-xs ${alert.rotation_frequency_months > 3 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.rotation_frequency_months}mo rotation</span>
                          )}
                          {alert.current_exhibition_weeks_active != null && alert.current_exhibition_weeks_active > 0 && (
                            <span className={`text-xs ${alert.current_exhibition_weeks_active > 12 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.current_exhibition_weeks_active}w active</span>
                          )}
                          {alert.has_commission_structure != null && (
                            <span className={`text-xs ${alert.has_commission_structure ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_commission_structure ? 'commission yes' : 'NO commission'}</span>
                          )}
                          {alert.commission_pct != null && alert.commission_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.commission_pct}% commission</span>
                          )}
                          {alert.monthly_commission_revenue != null && alert.monthly_commission_revenue > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">${alert.monthly_commission_revenue}/mo commission</span>
                          )}
                          {alert.has_opening_receptions != null && (
                            <span className={`text-xs ${alert.has_opening_receptions ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_opening_receptions ? 'openings yes' : 'NO openings'}</span>
                          )}
                          {alert.openings_per_quarter != null && alert.openings_per_quarter > 0 && (
                            <span className="text-xs text-neutral-500">{alert.openings_per_quarter} openings/qtr</span>
                          )}
                          {alert.avg_attendance_per_opening != null && alert.avg_attendance_per_opening > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.avg_attendance_per_opening}/opening</span>
                          )}
                          {alert.new_customers_per_opening != null && alert.new_customers_per_opening > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.new_customers_per_opening} new/opening</span>
                          )}
                          {alert.beverage_sales_lift_pct != null && alert.beverage_sales_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.beverage_sales_lift_pct}% beverage</span>
                          )}
                          {alert.has_local_artist_partnerships != null && (
                            <span className={`text-xs ${alert.has_local_artist_partnerships ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_local_artist_partnerships ? 'local yes' : 'NO local'}</span>
                          )}
                          {alert.local_artists_count != null && alert.local_artists_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.local_artists_count} artists</span>
                          )}
                          {alert.has_seasonal_themes != null && (
                            <span className={`text-xs ${alert.has_seasonal_themes ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_seasonal_themes ? 'seasonal yes' : 'NO seasonal'}</span>
                          )}
                          {alert.current_seasonal_theme && alert.current_seasonal_theme !== 'none' && (
                            <span className="text-xs text-cyan-700 font-medium">{alert.current_seasonal_theme}</span>
                          )}
                          {alert.seasonal_marketing_alignment_score != null && alert.seasonal_marketing_alignment_score > 0 && (
                            <span className={`text-xs ${alert.seasonal_marketing_alignment_score < 75 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.seasonal_marketing_alignment_score}/100 alignment</span>
                          )}
                          {alert.is_instagram_worthy != null && (
                            <span className={`text-xs ${alert.is_instagram_worthy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.is_instagram_worthy ? 'instagram yes' : 'NOT instagram'}</span>
                          )}
                          {alert.social_mentions_with_art != null && alert.social_mentions_with_art > 0 && (
                            <span className="text-xs text-neutral-500">{alert.social_mentions_with_art} mentions/mo</span>
                          )}
                          {alert.social_mention_lift_pct != null && alert.social_mention_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.social_mention_lift_pct}% social</span>
                          )}
                          {alert.instagram_posts_per_month != null && alert.instagram_posts_per_month > 0 && (
                            <span className="text-xs text-neutral-500">{alert.instagram_posts_per_month} IG posts/mo</span>
                          )}
                          {alert.has_art_promotion != null && (
                            <span className={`text-xs ${alert.has_art_promotion ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_art_promotion ? 'promo yes' : 'NO promo'}</span>
                          )}
                          {alert.email_promotion_count != null && alert.email_promotion_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.email_promotion_count} emails</span>
                          )}
                          {alert.social_promotion_count != null && alert.social_promotion_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.social_promotion_count} social posts</span>
                          )}
                          {alert.in_house_promotion != null && alert.in_house_promotion && (
                            <span className="text-xs text-emerald-600 font-medium">in-house</span>
                          )}
                          {alert.art_engagement_score != null && alert.art_engagement_score > 0 && (
                            <span className={`text-xs ${alert.art_engagement_score < 70 ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.art_engagement_score}/100 engagement</span>
                          )}
                          {alert.repeat_visit_lift_pct != null && alert.repeat_visit_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.repeat_visit_lift_pct}% repeat visits</span>
                          )}
                          {alert.new_customer_acquisition_monthly != null && alert.new_customer_acquisition_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.new_customer_acquisition_monthly} new/mo</span>
                          )}
                          {alert.high_income_customer_acquisition_monthly != null && alert.high_income_customer_acquisition_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.high_income_customer_acquisition_monthly} high-income/mo</span>
                          )}
                          {alert.pr_media_coverage_value_monthly != null && alert.pr_media_coverage_value_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">${alert.pr_media_coverage_value_monthly}/mo PR</span>
                          )}
                          {alert.brand_differentiation_score != null && alert.brand_differentiation_score > 0 && (
                            <span className={`text-xs ${alert.brand_differentiation_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.brand_differentiation_score}/100 brand</span>
                          )}
                          {alert.community_goodwill_score != null && alert.community_goodwill_score > 0 && (
                            <span className={`text-xs ${alert.community_goodwill_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.community_goodwill_score}/100 goodwill</span>
                          )}
                          {alert.competitor_with_rotating_art_pct != null && alert.competitor_with_rotating_art_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_with_rotating_art_pct}% competitors</span>
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
                          {alert.repeat_visit_lift_projected_pct != null && alert.repeat_visit_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.repeat_visit_lift_projected_pct}% repeat visits (target)</span>
                          )}
                          {alert.commission_revenue_projected_monthly != null && alert.commission_revenue_projected_monthly > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.commission_revenue_projected_monthly)}/mo commission (target)</span>
                          )}
                          {alert.new_customer_acquisition_projected_monthly != null && alert.new_customer_acquisition_projected_monthly > 0 && (
                            <span className="text-emerald-600">+{alert.new_customer_acquisition_projected_monthly} new customers/mo (target)</span>
                          )}
                          {alert.social_mention_lift_projected_pct != null && alert.social_mention_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.social_mention_lift_projected_pct}% social mentions (target)</span>
                          )}
                          {alert.beverage_lift_projected_pct != null && alert.beverage_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.beverage_lift_projected_pct}% beverage during openings (target)</span>
                          )}
                          {alert.pr_value_projected_monthly != null && alert.pr_value_projected_monthly > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.pr_value_projected_monthly)}/mo PR value (target)</span>
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
                            <FontAwesomeIcon icon={faPalette} className="mt-0.5 shrink-0" />
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
          <span>Rotating exhibition: <span className={config.requireRotatingExhibition ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRotatingExhibition ? 'required' : 'optional'}</span></span>
          <span>Rotation cadence: <span className={config.requireRotationCadence ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireRotationCadence ? 'required' : 'optional'}</span></span>
          <span>Commission structure: <span className={config.requireCommissionStructure ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCommissionStructure ? 'required' : 'optional'}</span></span>
          <span>Opening receptions: <span className={config.requireOpeningReceptions ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOpeningReceptions ? 'required' : 'optional'}</span></span>
          <span>Local artist partnerships: <span className={config.requireLocalArtistPartnerships ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireLocalArtistPartnerships ? 'required' : 'optional'}</span></span>
          <span>Seasonal themes: <span className={config.requireSeasonalThemes ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSeasonalThemes ? 'required' : 'optional'}</span></span>
          <span>Instagram-worthy: <span className={config.requireInstagramWorthyDesign ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireInstagramWorthyDesign ? 'required' : 'optional'}</span></span>
          <span>Art promotion: <span className={config.requireArtPromotion ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireArtPromotion ? 'required' : 'optional'}</span></span>
          <span>Max rotation months: {config.maxRotationMonths}</span>
          <span>Min commission %: {config.minCommissionPct}%</span>
          <span>Min openings/quarter: {config.minOpeningsPerQuarter}</span>
          <span>Min attendance/opening: {config.minAttendancePerOpening}</span>
          <span>Min local artists: {config.minLocalArtistsCount}</span>
          <span>Min seasonal alignment: {config.minSeasonalMarketingAlignmentScore}</span>
          <span>Min social mention lift: {config.minSocialMentionLiftPct}%</span>
          <span>Min art engagement: {config.minArtEngagementScore}</span>
          <span>Min repeat visit lift: {config.minRepeatVisitLiftPct}%</span>
          <span>Min email promos: {config.minEmailPromotionPerExhibition}</span>
          <span>Min social promos: {config.minSocialPromotionPerExhibition}</span>
          <span className="text-neutral-400">191st POSR-exclusive differentiator</span>
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

export default RotatingArtGalleryScreen;
