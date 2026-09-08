/**
 * AI Staff Mental Health, Burnout & Wellness Support Optimizer — predicts how
 * mental health support programs (EAP, burnout prevention, mindfulness, mental
 * health days, work-life balance, flexible scheduling, manager training,
 * mental health benefits, wellness programs) impact staff turnover,
 * productivity, absenteeism, healthcare costs, brand reputation.
 *
 * 202nd POSR-exclusive differentiator.
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
  faKitMedical, faHeartPulse, faHandsPraying, faBed, faPersonWalking,
  faUserNurse, faShieldHeart, faSpa,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runStaffMentalHealthEngine, getActiveStaffMentalHealthAlerts, getStaffMentalHealthSummary,
  updateStaffMentalHealthAlertStatus, readStaffMentalHealthConfig, DEFAULT_STAFF_MENTAL_HEALTH_CONFIG,
  type StaffMentalHealthAlert,
} from "@/lib/staff-mental-health-wellness.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  eap_program_absent:                                   { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faKitMedical,       label: 'NO EAP' },
  burnout_prevention_program_absent:                    { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faHeartPulse,       label: 'NO BURNOUT PREV' },
  mindfulness_stress_management_absent:                 { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faHandsPraying,     label: 'NO MINDFULNESS' },
  mental_health_days_absent:                            { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faBed,              label: 'NO MH DAYS' },
  work_life_balance_flexible_scheduling_absent:         { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faPersonWalking,    label: 'NO FLEX SCHED' },
  manager_mental_health_training_absent:                { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faUserNurse,        label: 'NO MGR TRAINING' },
  mental_health_benefits_insurance_absent:              { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faShieldHeart,      label: 'NO MH BENEFITS' },
  wellness_program_participation_low:                   { bg: 'bg-emerald-50',   text: 'text-emerald-700',   icon: faSpa,              label: 'LOW WELLNESS' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function StaffMentalHealthWellnessScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<StaffMentalHealthAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, eapProgramAbsentCount: 0, burnoutPreventionProgramAbsentCount: 0, mindfulnessStressManagementAbsentCount: 0, mentalHealthDaysAbsentCount: 0, workLifeBalanceFlexibleSchedulingAbsentCount: 0, managerMentalHealthTrainingAbsentCount: 0, mentalHealthBenefitsInsuranceAbsentCount: 0, wellnessProgramParticipationLowCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_STAFF_MENTAL_HEALTH_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readStaffMentalHealthConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveStaffMentalHealthAlerts(db), getStaffMentalHealthSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[staff-mental-health-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runStaffMentalHealthEngine(db, config);
      toast.success(`Analyzed ${result.generated} mental health signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[staff-mental-health-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateStaffMentalHealthAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[staff-mental-health-report] status failed', err);
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
      <DocumentTitle parts={["AI Staff Mental Health, Burnout & Wellness Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldHeart} className="text-rose-600" />
              AI Staff Mental Health, Burnout &amp; Wellness Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how mental health support programs (EAP, burnout prevention, mindfulness/meditation, mental health days, work-life balance, flexible scheduling, manager mental health training, mental health benefits/insurance, wellness program participation) impact staff turnover, productivity, absenteeism, healthcare costs, brand reputation — restaurant industry 2x higher depression rate (SAMHSA); 73% report stress (ROC); burnout costs $5k-15k/employee (Cornell ILR); EAP reduces turnover 20-30% (SHRM); mental health benefits attract 86% of job seekers (SHRM); $1 invested returns $4 productivity (WHO); 1 in 5 adults mental illness (NAMI); restaurant highest substance abuse 15.3% vs 8.9% national (SAMHSA); mindfulness reduces stress 30-40% (Aetna); flexible scheduling reduces burnout 25-35% (Gallup); mental health days reduce turnover 15-20% (HBR); 60% restaurant workers report burnout (Restaurant Business); EAP utilization 7% nationally but 30-40% with manager training; wellness programs save $200-600/employee/yr healthcare (Harvard); burnout employees 2.6x more likely to leave (Gallup); industry loses $15B/yr to mental health (NRAEF)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faShieldHeart} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze wellness'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faKitMedical} label="No EAP program" value={String(summary.eapProgramAbsentCount)} color={summary.eapProgramAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHeartPulse} label="No burnout prevention" value={String(summary.burnoutPreventionProgramAbsentCount)} color={summary.burnoutPreventionProgramAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHeart} label="No benefits / no Mgr training" value={String(summary.mentalHealthBenefitsInsuranceAbsentCount + summary.managerMentalHealthTrainingAbsentCount)} color={(summary.mentalHealthBenefitsInsuranceAbsentCount + summary.managerMentalHealthTrainingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faSpa} label="No mindfulness / no MH days / no flex / low wellness" value={String(summary.mindfulnessStressManagementAbsentCount + summary.mentalHealthDaysAbsentCount + summary.workLifeBalanceFlexibleSchedulingAbsentCount + summary.wellnessProgramParticipationLowCount)} color={(summary.mindfulnessStressManagementAbsentCount + summary.mentalHealthDaysAbsentCount + summary.workLifeBalanceFlexibleSchedulingAbsentCount + summary.wellnessProgramParticipationLowCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faShieldHeart} spin className="text-4xl mb-3" />
            <p>Analyzing staff mental health &amp; wellness opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No staff mental health alerts</p>
            <p className="text-sm mt-1">Healthy mental health support environment: EAP program (25-40% utilization, $30-50/employee/year); burnout prevention program (burnout rate under 40%, quarterly screening, manager check-ins, peer support); mindfulness/stress program (30-40% stress reduction, Headspace/Calm, pre-shift meditation, on-site yoga); mental health days (3-5 days/year, no-questions-asked, separate from PTO); work-life balance + flexible scheduling (WLB score 70+, 2-3 weeks schedule posted ahead, shift swapping, overtime under 5h/week); manager mental health training (85%+ completion, MHFA, 4-6x EAP utilization boost); mental health benefits/insurance (coverage 70+, 20+ therapy sessions/year, parity, telehealth, substance abuse treatment, employer pays 75-85%); wellness program (40%+ participation, fitness, nutrition, smoking cessation, sleep, biometric screening, $200-600/employee/year healthcare savings); restaurant industry 2x higher depression rate (SAMHSA); 73% report stress (ROC); burnout costs $5k-15k/employee (Cornell ILR); EAP reduces turnover 20-30% (SHRM); mental health benefits attract 86% of job seekers; $1 invested returns $4 productivity (WHO).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faShieldHeart, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_eap_program != null && (
                            <span className={`text-xs ${alert.has_eap_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_eap_program ? 'EAP yes' : 'NO EAP'}</span>
                          )}
                          {alert.eap_utilization_rate != null && alert.eap_utilization_rate >= 0 && (
                            <span className={`text-xs ${alert.eap_utilization_rate < 15 ? 'text-rose-600 font-medium' : alert.eap_utilization_rate < 25 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.eap_utilization_rate}% EAP util (target {alert.eap_utilization_target ?? 30}%)</span>
                          )}
                          {alert.has_burnout_prevention_program != null && (
                            <span className={`text-xs ${alert.has_burnout_prevention_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_burnout_prevention_program ? 'burnout prev yes' : 'NO burnout prev'}</span>
                          )}
                          {alert.burnout_rate_pct != null && alert.burnout_rate_pct > 0 && (
                            <span className={`text-xs ${alert.burnout_rate_pct > 55 ? 'text-rose-600 font-medium' : alert.burnout_rate_pct > 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.burnout_rate_pct}% burnout (base {alert.burnout_rate_baseline_pct ?? 60}%)</span>
                          )}
                          {alert.has_mindfulness_stress_program != null && (
                            <span className={`text-xs ${alert.has_mindfulness_stress_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_mindfulness_stress_program ? 'mindfulness yes' : 'NO mindfulness'}</span>
                          )}
                          {alert.stress_level_score != null && alert.stress_level_score > 0 && (
                            <span className={`text-xs ${alert.stress_level_score > 70 ? 'text-rose-600 font-medium' : alert.stress_level_score > 60 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.stress_level_score}/100 stress (base {alert.stress_level_baseline ?? 65})</span>
                          )}
                          {alert.has_mental_health_days != null && (
                            <span className={`text-xs ${alert.has_mental_health_days ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_mental_health_days ? 'MH days yes' : 'NO MH days'}</span>
                          )}
                          {alert.mental_health_days_per_year != null && alert.mental_health_days_per_year > 0 && (
                            <span className="text-xs text-sky-600 font-medium">{alert.mental_health_days_per_year} MH days/yr</span>
                          )}
                          {alert.has_flexible_scheduling != null && (
                            <span className={`text-xs ${alert.has_flexible_scheduling ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_flexible_scheduling ? 'flex sched yes' : 'NO flex sched'}</span>
                          )}
                          {alert.work_life_balance_score != null && alert.work_life_balance_score > 0 && (
                            <span className={`text-xs ${alert.work_life_balance_score < 50 ? 'text-rose-600 font-medium' : alert.work_life_balance_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.work_life_balance_score}/100 WLB</span>
                          )}
                          {alert.avg_hours_per_week != null && alert.avg_hours_per_week > 0 && (
                            <span className={`text-xs ${alert.avg_hours_per_week > 42 ? 'text-rose-600 font-medium' : alert.avg_hours_per_week > 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.avg_hours_per_week}h/week (OT {alert.overtime_hours_per_week ?? 0}h)</span>
                          )}
                          {alert.has_manager_mental_health_training != null && (
                            <span className={`text-xs ${alert.has_manager_mental_health_training ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_manager_mental_health_training ? 'mgr training yes' : 'NO mgr training'}</span>
                          )}
                          {alert.manager_training_completion_pct != null && alert.manager_training_completion_pct >= 0 && (
                            <span className={`text-xs ${alert.manager_training_completion_pct < 60 ? 'text-rose-600 font-medium' : alert.manager_training_completion_pct < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.manager_training_completion_pct}% mgr trained</span>
                          )}
                          {alert.has_mental_health_benefits != null && (
                            <span className={`text-xs ${alert.has_mental_health_benefits ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_mental_health_benefits ? 'MH benefits yes' : 'NO MH benefits'}</span>
                          )}
                          {alert.mental_health_coverage_score != null && alert.mental_health_coverage_score >= 0 && (
                            <span className={`text-xs ${alert.mental_health_coverage_score < 50 ? 'text-rose-600 font-medium' : alert.mental_health_coverage_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.mental_health_coverage_score}/100 coverage (employer {alert.insurance_premium_contribution_pct ?? 0}%)</span>
                          )}
                          {alert.has_wellness_program != null && (
                            <span className={`text-xs ${alert.has_wellness_program ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_wellness_program ? 'wellness yes' : 'NO wellness'}</span>
                          )}
                          {alert.wellness_participation_rate != null && alert.wellness_participation_rate >= 0 && (
                            <span className={`text-xs ${alert.wellness_participation_rate < 25 ? 'text-rose-600 font-medium' : alert.wellness_participation_rate < 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.wellness_participation_rate}% wellness part</span>
                          )}
                          {alert.wellness_program_types && alert.wellness_program_types !== 'none' && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.wellness_program_types}</span>
                          )}
                          {alert.total_staff != null && alert.total_staff > 0 && (
                            <span className="text-xs text-neutral-500">{alert.total_staff} staff</span>
                          )}
                          {alert.turnover_rate_pct != null && alert.turnover_rate_pct > 0 && (
                            <span className={`text-xs ${alert.turnover_rate_pct > 100 ? 'text-rose-600 font-medium' : alert.turnover_rate_pct > 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.turnover_rate_pct}% turnover (base {alert.turnover_rate_baseline_pct ?? 75}%)</span>
                          )}
                          {alert.absenteeism_rate_pct != null && alert.absenteeism_rate_pct > 0 && (
                            <span className={`text-xs ${alert.absenteeism_rate_pct > 8 ? 'text-rose-600 font-medium' : alert.absenteeism_rate_pct > 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.absenteeism_rate_pct}% absent</span>
                          )}
                          {alert.productivity_score != null && alert.productivity_score > 0 && (
                            <span className={`text-xs ${alert.productivity_score < 60 ? 'text-rose-600 font-medium' : alert.productivity_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.productivity_score}/100 productivity</span>
                          )}
                          {alert.employee_satisfaction_score != null && alert.employee_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.employee_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.employee_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.employee_satisfaction_score}/100 satisfaction</span>
                          )}
                          {alert.substance_abuse_rate_pct != null && alert.substance_abuse_rate_pct > 0 && (
                            <span className={`text-xs ${alert.substance_abuse_rate_pct > 15 ? 'text-rose-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.substance_abuse_rate_pct}% substance abuse</span>
                          )}
                          {alert.competitor_wellness_score != null && alert.competitor_wellness_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_wellness_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.turnover_reduction_projected_pct != null && alert.turnover_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.turnover_reduction_projected_pct}% turnover reduction (target)</span>
                          )}
                          {alert.burnout_reduction_projected_pct != null && alert.burnout_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.burnout_reduction_projected_pct}% burnout (target)</span>
                          )}
                          {alert.stress_reduction_projected_pts != null && alert.stress_reduction_projected_pts > 0 && (
                            <span className="text-emerald-600">-{alert.stress_reduction_projected_pts}pts stress (target)</span>
                          )}
                          {alert.productivity_lift_projected_pct != null && alert.productivity_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.productivity_lift_projected_pct}% productivity (target)</span>
                          )}
                          {alert.absenteeism_reduction_projected_pct != null && alert.absenteeism_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.absenteeism_reduction_projected_pct}% absenteeism (target)</span>
                          )}
                          {alert.healthcare_savings_projected != null && alert.healthcare_savings_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.healthcare_savings_projected)}/mo healthcare savings (target)</span>
                          )}
                          {alert.eap_utilization_lift_projected_pct != null && alert.eap_utilization_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.eap_utilization_lift_projected_pct}% EAP utilization (target)</span>
                          )}
                          {alert.talent_attraction_lift_projected_pct != null && alert.talent_attraction_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.talent_attraction_lift_projected_pct}% talent attraction (target)</span>
                          )}
                          {alert.wellness_participation_lift_projected_pts != null && alert.wellness_participation_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.wellness_participation_lift_projected_pts}pts wellness participation (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faShieldHeart} className="mt-0.5 shrink-0" />
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
          <span>EAP: <span className={config.requireEapProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireEapProgram ? 'required' : 'optional'}</span></span>
          <span>Burnout prev: <span className={config.requireBurnoutPreventionProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBurnoutPreventionProgram ? 'required' : 'optional'}</span></span>
          <span>Mindfulness: <span className={config.requireMindfulnessStressProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMindfulnessStressProgram ? 'required' : 'optional'}</span></span>
          <span>MH days: <span className={config.requireMentalHealthDays ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMentalHealthDays ? 'required' : 'optional'}</span></span>
          <span>Flex sched: <span className={config.requireFlexibleScheduling ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireFlexibleScheduling ? 'required' : 'optional'}</span></span>
          <span>Mgr training: <span className={config.requireManagerMentalHealthTraining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireManagerMentalHealthTraining ? 'required' : 'optional'}</span></span>
          <span>MH benefits: <span className={config.requireMentalHealthBenefits ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMentalHealthBenefits ? 'required' : 'optional'}</span></span>
          <span>Wellness: <span className={config.requireWellnessProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireWellnessProgram ? 'required' : 'optional'}</span></span>
          <span>Min EAP util: {config.minEapUtilizationRate}%</span>
          <span>Min mgr training: {config.minManagerTrainingCompletionPct}%</span>
          <span>Min wellness part: {config.minWellnessParticipationRate}%</span>
          <span>Max burnout: {config.maxBurnoutRatePct}%</span>
          <span>Max stress: {config.maxStressLevelScore}</span>
          <span>Min WLB: {config.minWorkLifeBalanceScore}</span>
          <span>Min coverage: {config.minMentalHealthCoverageScore}</span>
          <span className="text-neutral-400">202nd POSR-exclusive differentiator</span>
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

export default StaffMentalHealthWellnessScreen;
