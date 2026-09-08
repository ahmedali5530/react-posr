/**
 * AI Birthday, Anniversary & Celebration Service Optimizer — predicts how
 * celebration service (birthday dessert + candle, anniversary recognition +
 * toast, celebration photo service, reservation celebration flagging, group
 * celebration party packages, complimentary celebration treats, staff
 * celebration training, post-celebration follow-up) impacts revenue,
 * customer return rate, social media engagement, average check, loyalty.
 *
 * 200th POSR-exclusive differentiator (major milestone).
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
  faCakeCandles, faHeart, faCamera, faCalendarCheck, faUsers, faGift,
  faUserGraduate, faEnvelope, faChampagneGlasses,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runCelebrationServiceOptimizerEngine, getActiveCelebrationServiceAlerts, getCelebrationServiceSummary,
  updateCelebrationServiceAlertStatus, readCelebrationServiceConfig, DEFAULT_CELEBRATION_SERVICE_CONFIG,
  type CelebrationServiceAlert,
} from "@/lib/celebration-service-optimizer.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  birthday_service_absent:                       { bg: 'bg-pink-50',      text: 'text-pink-700',      icon: faCakeCandles,    label: 'NO BIRTHDAY' },
  anniversary_service_absent:                    { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faHeart,          label: 'NO ANNIVERSARY' },
  celebration_photo_service_absent:              { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faCamera,         label: 'NO PHOTO' },
  celebration_reservation_recognition_absent:    { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faCalendarCheck,  label: 'NO RES FLAG' },
  celebration_party_package_absent:              { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faUsers,          label: 'NO PARTY PKG' },
  celebration_complimentary_treat_absent:        { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faGift,           label: 'NO TREAT' },
  celebration_staff_training_absent:             { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faUserGraduate,   label: 'NO TRAINING' },
  celebration_followup_absent:                   { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faEnvelope,       label: 'NO FOLLOW-UP' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function CelebrationServiceOptimizerScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<CelebrationServiceAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, birthdayServiceAbsentCount: 0, anniversaryServiceAbsentCount: 0, celebrationPhotoServiceAbsentCount: 0, celebrationReservationRecognitionAbsentCount: 0, celebrationPartyPackageAbsentCount: 0, celebrationComplimentaryTreatAbsentCount: 0, celebrationStaffTrainingAbsentCount: 0, celebrationFollowupAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CELEBRATION_SERVICE_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readCelebrationServiceConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveCelebrationServiceAlerts(db), getCelebrationServiceSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[celebration-service-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runCelebrationServiceOptimizerEngine(db, config);
      toast.success(`Analyzed ${result.generated} celebration service signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[celebration-service-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateCelebrationServiceAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[celebration-service-report] status failed', err);
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
      <DocumentTitle parts={["AI Birthday, Anniversary & Celebration Service Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faChampagneGlasses} className="text-pink-600" />
              AI Birthday, Anniversary &amp; Celebration Service Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how celebration service (birthday dessert + candle + song, anniversary recognition + toast, celebration photo service, reservation celebration flagging, group party packages, complimentary treats, staff celebration training, post-celebration follow-up) impacts revenue, return rate, social media, average check, loyalty — celebrations = 15-20% of restaurant revenue (NRA); birthday is #1 celebrated occasion (60% of Americans celebrate at restaurant); complimentary birthday dessert = 3x return rate (Cornell SHA); anniversary diners spend 2x average check (Toast); 78% want occasion recognition (OpenTable); celebration tables spend 40% more; celebration photos = 40-60% more social shares ($300-1,500/mo free marketing); group parties = $400-1,500/table; missed recognition = 35% lower return rate; celebration tips 25% higher
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faChampagneGlasses} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze celebrations'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faCakeCandles} label="No birthday service" value={String(summary.birthdayServiceAbsentCount)} color={summary.birthdayServiceAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHeart} label="No anniversary service" value={String(summary.anniversaryServiceAbsentCount)} color={summary.anniversaryServiceAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUsers} label="No party package" value={String(summary.celebrationPartyPackageAbsentCount)} color={summary.celebrationPartyPackageAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faEnvelope} label="No follow-up / no photo / no training" value={String(summary.celebrationFollowupAbsentCount + summary.celebrationPhotoServiceAbsentCount + summary.celebrationStaffTrainingAbsentCount)} color={(summary.celebrationFollowupAbsentCount + summary.celebrationPhotoServiceAbsentCount + summary.celebrationStaffTrainingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faChampagneGlasses} spin className="text-4xl mb-3" />
            <p>Analyzing celebration service opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No celebration service alerts</p>
            <p className="text-sm mt-1">Healthy celebration service environment: birthday dessert + candle + song (complimentary); anniversary recognition + toast + dessert; celebration photo service (polaroid or staff phone with branded frame); reservation system flags celebrations (70%+ capture); group celebration party package (6+ guests, set menu, dedicated server); complimentary celebration treat (amuse bouche, digestif, petit four); staff trained on celebration protocol (85%+ completion); post-celebration follow-up (thank you + photo share + next-year nudge, 50%+ capture); celebrations = 15-20% of revenue (NRA); birthday = #1 occasion (60% of Americans); complimentary birthday dessert = 3x return rate (Cornell SHA); anniversary diners = 2x average check (Toast); 78% want recognition (OpenTable); celebration photos = 40-60% more social shares; group parties = $400-1,500/table.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faChampagneGlasses, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_birthday_service != null && (
                            <span className={`text-xs ${alert.has_birthday_service ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_birthday_service ? 'birthday yes' : 'NO birthday'}</span>
                          )}
                          {alert.has_anniversary_service != null && (
                            <span className={`text-xs ${alert.has_anniversary_service ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_anniversary_service ? 'anniversary yes' : 'NO anniversary'}</span>
                          )}
                          {alert.has_celebration_photo_service != null && (
                            <span className={`text-xs ${alert.has_celebration_photo_service ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_celebration_photo_service ? 'photo yes' : 'NO photo'}</span>
                          )}
                          {alert.celebration_photo_type && alert.celebration_photo_type !== 'none' && (
                            <span className="text-xs text-sky-600 font-medium">{alert.celebration_photo_type}</span>
                          )}
                          {alert.has_reservation_celebration_flag != null && (
                            <span className={`text-xs ${alert.has_reservation_celebration_flag ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_reservation_celebration_flag ? 'res flag yes' : 'NO res flag'}</span>
                          )}
                          {alert.reservation_celebration_capture_pct != null && alert.reservation_celebration_capture_pct >= 0 && (
                            <span className={`text-xs ${alert.reservation_celebration_capture_pct < 50 ? 'text-rose-600 font-medium' : alert.reservation_celebration_capture_pct < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.reservation_celebration_capture_pct}% capture</span>
                          )}
                          {alert.has_celebration_party_package != null && (
                            <span className={`text-xs ${alert.has_celebration_party_package ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_celebration_party_package ? 'party pkg yes' : 'NO party pkg'}</span>
                          )}
                          {alert.party_package_bookings_monthly != null && alert.party_package_bookings_monthly > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{alert.party_package_bookings_monthly} parties/mo</span>
                          )}
                          {alert.party_package_avg_revenue != null && alert.party_package_avg_revenue > 0 && (
                            <span className="text-xs text-violet-600 font-medium">{fmt$(alert.party_package_avg_revenue)}/party</span>
                          )}
                          {alert.has_complimentary_celebration_treat != null && (
                            <span className={`text-xs ${alert.has_complimentary_celebration_treat ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_complimentary_celebration_treat ? 'treat yes' : 'NO treat'}</span>
                          )}
                          {alert.complimentary_treat_type && alert.complimentary_treat_type !== 'none' && (
                            <span className="text-xs text-fuchsia-600 font-medium">{alert.complimentary_treat_type}</span>
                          )}
                          {alert.has_celebration_staff_training != null && (
                            <span className={`text-xs ${alert.has_celebration_staff_training ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_celebration_staff_training ? 'training yes' : 'NO training'}</span>
                          )}
                          {alert.celebration_training_completion_pct != null && alert.celebration_training_completion_pct >= 0 && (
                            <span className={`text-xs ${alert.celebration_training_completion_pct < 60 ? 'text-rose-600 font-medium' : alert.celebration_training_completion_pct < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.celebration_training_completion_pct}% trained</span>
                          )}
                          {alert.has_celebration_followup != null && (
                            <span className={`text-xs ${alert.has_celebration_followup ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_celebration_followup ? 'follow-up yes' : 'NO follow-up'}</span>
                          )}
                          {alert.followup_capture_rate_pct != null && alert.followup_capture_rate_pct >= 0 && (
                            <span className={`text-xs ${alert.followup_capture_rate_pct < 35 ? 'text-rose-600 font-medium' : alert.followup_capture_rate_pct < 50 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.followup_capture_rate_pct}% follow-up</span>
                          )}
                          {alert.birthday_celebrations_monthly != null && alert.birthday_celebrations_monthly > 0 && (
                            <span className="text-xs text-pink-600 font-medium">{alert.birthday_celebrations_monthly} birthdays/mo</span>
                          )}
                          {alert.birthday_celebrations_missed_monthly != null && alert.birthday_celebrations_missed_monthly > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.birthday_celebrations_missed_monthly} missed</span>
                          )}
                          {alert.anniversary_celebrations_monthly != null && alert.anniversary_celebrations_monthly > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.anniversary_celebrations_monthly} anniv/mo</span>
                          )}
                          {alert.avg_celebration_check != null && alert.avg_celebration_check > 0 && (
                            <span className={`text-xs ${alert.avg_celebration_check < 60 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{fmt$(alert.avg_celebration_check)} celebration check</span>
                          )}
                          {alert.instagram_photos_monthly != null && alert.instagram_photos_monthly > 0 && (
                            <span className={`text-xs ${alert.instagram_photos_monthly < (alert.instagram_photos_baseline_monthly ?? 20) ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.instagram_photos_monthly} IG/mo (base {alert.instagram_photos_baseline_monthly ?? 0})</span>
                          )}
                          {alert.return_rate_pct != null && alert.return_rate_pct >= 0 && (
                            <span className={`text-xs ${alert.return_rate_pct < 40 ? 'text-rose-600 font-medium' : alert.return_rate_pct < 65 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.return_rate_pct}% return (base {alert.return_rate_baseline_pct ?? 0}%)</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 sat</span>
                          )}
                          {alert.perceived_quality_score != null && alert.perceived_quality_score > 0 && (
                            <span className={`text-xs ${alert.perceived_quality_score < 60 ? 'text-rose-600 font-medium' : alert.perceived_quality_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.perceived_quality_score}/100 quality</span>
                          )}
                          {alert.competitor_celebration_score != null && alert.competitor_celebration_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_celebration_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.birthday_return_lift_projected_pct != null && alert.birthday_return_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.birthday_return_lift_projected_pct}% birthday return rate (target)</span>
                          )}
                          {alert.anniversary_check_lift_projected_pct != null && alert.anniversary_check_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.anniversary_check_lift_projected_pct}% anniversary check (target)</span>
                          )}
                          {alert.social_share_lift_projected_pct != null && alert.social_share_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.social_share_lift_projected_pct}% social shares (target)</span>
                          )}
                          {alert.reservation_recognition_lift_projected_pct != null && alert.reservation_recognition_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.reservation_recognition_lift_projected_pct}% recognition (target)</span>
                          )}
                          {alert.party_package_revenue_projected != null && alert.party_package_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.party_package_revenue_projected)}/mo party revenue (target)</span>
                          )}
                          {alert.complimentary_treat_satisfaction_lift_pts != null && alert.complimentary_treat_satisfaction_lift_pts > 0 && (
                            <span className="text-emerald-600">+{alert.complimentary_treat_satisfaction_lift_pts}pts treat satisfaction (target)</span>
                          )}
                          {alert.staff_training_review_lift_pts != null && alert.staff_training_review_lift_pts > 0 && (
                            <span className="text-emerald-600">+{alert.staff_training_review_lift_pts}pts review scores (target)</span>
                          )}
                          {alert.followup_loyalty_capture_projected != null && alert.followup_loyalty_capture_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.followup_loyalty_capture_projected)}/mo loyalty capture (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.perceived_quality_lift_projected_pts != null && alert.perceived_quality_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.perceived_quality_lift_projected_pts}pts perceived quality (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faChampagneGlasses} className="mt-0.5 shrink-0" />
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
          <span>Birthday service: <span className={config.requireBirthdayService ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBirthdayService ? 'required' : 'optional'}</span></span>
          <span>Anniversary service: <span className={config.requireAnniversaryService ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAnniversaryService ? 'required' : 'optional'}</span></span>
          <span>Photo service: <span className={config.requireCelebrationPhotoService ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCelebrationPhotoService ? 'required' : 'optional'}</span></span>
          <span>Reservation flag: <span className={config.requireReservationCelebrationFlag ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireReservationCelebrationFlag ? 'required' : 'optional'}</span></span>
          <span>Party package: <span className={config.requireCelebrationPartyPackage ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCelebrationPartyPackage ? 'required' : 'optional'}</span></span>
          <span>Complimentary treat: <span className={config.requireComplimentaryCelebrationTreat ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireComplimentaryCelebrationTreat ? 'required' : 'optional'}</span></span>
          <span>Staff training: <span className={config.requireCelebrationStaffTraining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCelebrationStaffTraining ? 'required' : 'optional'}</span></span>
          <span>Follow-up: <span className={config.requireCelebrationFollowup ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCelebrationFollowup ? 'required' : 'optional'}</span></span>
          <span>Min reservation capture: {config.minReservationCelebrationCapturePct}%</span>
          <span>Min training completion: {config.minCelebrationTrainingCompletionPct}%</span>
          <span>Min follow-up capture: {config.minFollowupCaptureRatePct}%</span>
          <span>Min return rate: {config.minReturnRatePct}%</span>
          <span className="text-neutral-400">200th POSR-exclusive differentiator</span>
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

export default CelebrationServiceOptimizerScreen;
