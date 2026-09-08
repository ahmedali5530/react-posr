/**
 * AI Personalized Nutrition & DNA Genomic Dining Optimizer — predicts how
 * DNA-based personalized nutrition programs (genomic menu personalization,
 * nutrigenomic dietary targeting, DNA testing partnerships, biomarker
 * integration, health outcome tracking, genetic counselor partnerships,
 * microbiome profiling, genomic privacy compliance) impact premium pricing,
 * customer retention, health-conscious customer acquisition, differentiation,
 * new revenue streams, and competitive advantage in the precision nutrition
 * market.
 *
 * 218th POSR-exclusive differentiator.
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
  faDna, faVial, faBowlFood, faMicroscope, faFlask,
  faHeartPulse, faUserDoctor, faShieldHalved,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runPersonalizedNutritionEngine, getActivePersonalizedNutritionAlerts, getPersonalizedNutritionSummary,
  updatePersonalizedNutritionAlertStatus, readPersonalizedNutritionConfig, DEFAULT_PERSONALIZED_NUTRITION_CONFIG,
  type PersonalizedNutritionAlert,
} from "@/lib/personalized-nutrition-dna-genomic-dining.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  personalized_nutrition_strategy_absent:   { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faDna,            label: 'NO DNA NUTRITION' },
  dna_testing_partnership_absent:            { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faVial,           label: 'NO DNA TESTING' },
  genomic_menu_personalization_absent:       { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faBowlFood,       label: 'NO GENOMIC MENU' },
  nutrigenomic_dietary_targeting_absent:     { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faMicroscope,     label: 'NO NUTRIGENOMIC' },
  biomarker_integration_absent:              { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faFlask,          label: 'NO BIOMARKER' },
  health_outcome_tracking_absent:            { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faHeartPulse,     label: 'NO OUTCOME TRACK' },
  genetic_counselor_partnership_absent:      { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faUserDoctor,     label: 'NO COUNSELOR' },
  privacy_genomic_data_compliance_weak:      { bg: 'bg-red-50',       text: 'text-red-700',       icon: faShieldHalved,   label: 'WEAK GENOMIC PRIVACY' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function PersonalizedNutritionDnaGenomicDiningScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<PersonalizedNutritionAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, personalizedNutritionStrategyAbsentCount: 0, dnaTestingPartnershipAbsentCount: 0, genomicMenuPersonalizationAbsentCount: 0, nutrigenomicDietaryTargetingAbsentCount: 0, biomarkerIntegrationAbsentCount: 0, healthOutcomeTrackingAbsentCount: 0, geneticCounselorPartnershipAbsentCount: 0, privacyGenomicDataComplianceWeakCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_PERSONALIZED_NUTRITION_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readPersonalizedNutritionConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActivePersonalizedNutritionAlerts(db), getPersonalizedNutritionSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[personalized-nutrition-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runPersonalizedNutritionEngine(db, config);
      toast.success(`Analyzed ${result.generated} personalized nutrition signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[personalized-nutrition-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updatePersonalizedNutritionAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[personalized-nutrition-report] status failed', err);
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
      <DocumentTitle parts={["AI Personalized Nutrition & DNA Genomic Dining Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faDna} className="text-violet-600" />
              AI Personalized Nutrition &amp; DNA Genomic Dining Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how DNA-based personalized nutrition programs (genomic menu personalization, nutrigenomic dietary targeting, DNA testing partnerships, biomarker integration, health outcome tracking, genetic counselor partnerships, microbiome profiling, genomic privacy compliance) impact premium pricing, customer retention, health-conscious customer acquisition, differentiation, new revenue streams — personalized nutrition market $11.5B+ by 2028 (Grand View Research, 25%+ CAGR); nutrigenomics market $1.8B+ by 2027; DNA testing market $2.8B+ by 2026 (120M+ tested); 65% of consumers interested (IFIC); 78% would pay 10-25% premium (Mintel); DNA-personalized menu items 15-35% premium; genomic dining $50-200/cover (vs $20-50 standard); 82% would switch to DNA-personalized restaurant (Nielsen); under 1% of restaurants globally offer this; precision nutrition ROI $8-25 per $1; DNA-based dining reduces dietary health issues 15-30% (NIH)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faDna} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze DNA nutrition'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faDna} label="No personalized nutrition strategy" value={String(summary.personalizedNutritionStrategyAbsentCount)} color={summary.personalizedNutritionStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faVial} label="No DNA testing / no genomic menu" value={String(summary.dnaTestingPartnershipAbsentCount + summary.genomicMenuPersonalizationAbsentCount)} color={(summary.dnaTestingPartnershipAbsentCount + summary.genomicMenuPersonalizationAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faMicroscope} label="No nutrigenomic / no biomarker / no outcomes" value={String(summary.nutrigenomicDietaryTargetingAbsentCount + summary.biomarkerIntegrationAbsentCount + summary.healthOutcomeTrackingAbsentCount)} color={(summary.nutrigenomicDietaryTargetingAbsentCount + summary.biomarkerIntegrationAbsentCount + summary.healthOutcomeTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="No counselor / weak privacy" value={String(summary.geneticCounselorPartnershipAbsentCount + summary.privacyGenomicDataComplianceWeakCount)} color={(summary.geneticCounselorPartnershipAbsentCount + summary.privacyGenomicDataComplianceWeakCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faDna} spin className="text-4xl mb-3" />
            <p>Analyzing personalized nutrition &amp; DNA genomic dining opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No personalized nutrition alerts</p>
            <p className="text-sm mt-1">Healthy precision nutrition environment: active strategy (growing maturity, $1.8k+ investment/mo); DNA testing partnership (35+ tests/mo, $120+/test, 23andMe Pro + NutriGenome); genomic menu personalization (12+ items, 22%+ premium, $3.8k+ revenue); nutrigenomic targeting (14+ gene variants: MTHFR, APOE, FTO, TCF7L2, MCM6, ACE, CYP1A2, TAS2R38, FADS1, AMY1, CETP, GC, NOS3, SLC23A1); biomarker integration (glucose, cholesterol, vitamin D, inflammation, 28+ tests/mo); health outcome tracking (6+ outcomes, 18%+ improvement, 78%+ retention); genetic counselor partnership (12+ sessions/mo); genomic privacy (score 88+, GINA + HIPAA + GDPR genetic, encrypted, consent); personalized nutrition market $11.5B+ by 2028 (Grand View Research); precision nutrition ROI $8-25 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faDna, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_personalized_nutrition_strategy != null && (
                            <span className={`text-xs ${alert.has_personalized_nutrition_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_personalized_nutrition_strategy ? 'DNA nutrition yes' : 'NO DNA nutrition'}</span>
                          )}
                          {alert.genomic_program_maturity && alert.genomic_program_maturity !== 'none' && (
                            <span className="text-xs text-violet-600 font-medium">{alert.genomic_program_maturity}</span>
                          )}
                          {alert.total_precision_nutrition_revenue_monthly != null && alert.total_precision_nutrition_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.total_precision_nutrition_revenue_monthly)}/mo precision rev ({alert.precision_nutrition_as_pct_of_total ?? 0}%)</span>
                          )}
                          {alert.genomic_menu_revenue_monthly != null && alert.genomic_menu_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.genomic_menu_revenue_monthly)}/mo genomic menu</span>
                          )}
                          {alert.biomarker_revenue_monthly != null && alert.biomarker_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.biomarker_revenue_monthly)}/mo biomarker</span>
                          )}
                          {alert.customer_health_retention_rate != null && alert.customer_health_retention_rate > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.customer_health_retention_rate}% health retention</span>
                          )}
                          {alert.competitor_precision_nutrition_score != null && alert.competitor_precision_nutrition_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_precision_nutrition_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.precision_revenue_growth_projected_pct != null && alert.precision_revenue_growth_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.precision_revenue_growth_projected_pct}% precision revenue growth (target)</span>
                          )}
                          {alert.genomic_menu_revenue_projected != null && alert.genomic_menu_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.genomic_menu_revenue_projected)}/mo genomic menu (target)</span>
                          )}
                          {alert.biomarker_revenue_projected != null && alert.biomarker_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.biomarker_revenue_projected)}/mo biomarker (target)</span>
                          )}
                          {alert.health_retention_lift_projected_pct != null && alert.health_retention_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.health_retention_lift_projected_pct}% health retention (target)</span>
                          )}
                          {alert.customer_acquisition_lift_projected_pct != null && alert.customer_acquisition_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.customer_acquisition_lift_projected_pct}% customer acquisition (target)</span>
                          )}
                          {alert.compliance_risk_reduction_projected_pct != null && alert.compliance_risk_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.compliance_risk_reduction_projected_pct}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faDna} className="mt-0.5 shrink-0" />
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
          <span>Strategy: <span className={config.requirePersonalizedNutritionStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePersonalizedNutritionStrategy ? 'required' : 'optional'}</span></span>
          <span>DNA testing: <span className={config.requireDnaTestingPartnership ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDnaTestingPartnership ? 'required' : 'optional'}</span></span>
          <span>Genomic menu: <span className={config.requireGenomicMenuPersonalization ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireGenomicMenuPersonalization ? 'required' : 'optional'}</span></span>
          <span>Nutrigenomic: <span className={config.requireNutrigenomicTargeting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNutrigenomicTargeting ? 'required' : 'optional'}</span></span>
          <span>Biomarker: <span className={config.requireBiomarkerIntegration ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBiomarkerIntegration ? 'required' : 'optional'}</span></span>
          <span>Outcomes: <span className={config.requireHealthOutcomeTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireHealthOutcomeTracking ? 'required' : 'optional'}</span></span>
          <span>Counselor: <span className={config.requireGeneticCounselorPartnership ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireGeneticCounselorPartnership ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requirePrivacyGenomicDataCompliance ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePrivacyGenomicDataCompliance ? 'required' : 'optional'}</span></span>
          <span>Min gene variants: {config.minGeneVariantsTracked}</span>
          <span>Min DNA tests: {config.minDnaTestsMonthly}/mo</span>
          <span>Min menu items: {config.minGenomicMenuItems}</span>
          <span>Min privacy: {config.minGenomicPrivacyScore}</span>
          <span className="text-neutral-400">218th POSR-exclusive differentiator</span>
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

export default PersonalizedNutritionDnaGenomicDiningScreen;
