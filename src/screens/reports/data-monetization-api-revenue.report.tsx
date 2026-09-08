/**
 * AI Restaurant Data Monetization & API Revenue Optimizer — predicts how
 * data monetization strategies (API sales, data licensing, data marketplace,
 * third-party integrations, benchmarking data, predictive models as API,
 * privacy/compliance, pricing strategy, partner ecosystem) impact new
 * recurring revenue, strategic partnerships, competitive advantage, data
 * asset valuation.
 *
 * 209th POSR-exclusive differentiator.
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
  faDatabase, faPlug, faFileContract, faHandshake, faChartColumn,
  faBrain, faShieldHalved, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runDataMonetizationEngine, getActiveDataMonetizationAlerts, getDataMonetizationSummary,
  updateDataMonetizationAlertStatus, readDataMonetizationConfig, DEFAULT_DATA_MONETIZATION_CONFIG,
  type DataMonetizationAlert,
} from "@/lib/data-monetization-api-revenue.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  data_monetization_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faDatabase,          label: 'NO DATA MONETIZATION' },
  api_revenue_program_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faPlug,              label: 'NO API PROGRAM' },
  data_licensing_program_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faFileContract,      label: 'NO LICENSING' },
  third_party_integration_ecosystem_thin:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faHandshake,         label: 'THIN PARTNER ECOSYS' },
  benchmarking_data_product_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faChartColumn,       label: 'NO BENCHMARKING' },
  predictive_model_api_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faBrain,             label: 'NO PREDICTIVE API' },
  privacy_compliance_program_weak:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faShieldHalved,      label: 'WEAK PRIVACY' },
  data_valuation_tracking_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function DataMonetizationApiRevenueScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<DataMonetizationAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, dataMonetizationStrategyAbsentCount: 0, apiRevenueProgramAbsentCount: 0, dataLicensingProgramAbsentCount: 0, thirdPartyIntegrationEcosystemThinCount: 0, benchmarkingDataProductAbsentCount: 0, predictiveModelApiAbsentCount: 0, privacyComplianceProgramWeakCount: 0, dataValuationTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_DATA_MONETIZATION_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readDataMonetizationConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveDataMonetizationAlerts(db), getDataMonetizationSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runDataMonetizationEngine(db, config);
      toast.success(`Analyzed ${result.generated} data monetization signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateDataMonetizationAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] status failed', err);
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
      <DocumentTitle parts={["AI Data Monetization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faDatabase} className="text-violet-600" />
              AI Data Monetization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how data monetization strategies (API sales, data licensing, data marketplace, third-party integrations, benchmarking data, predictive models as API, privacy/compliance, pricing strategy, partner ecosystem) impact new recurring revenue, strategic partnerships, competitive advantage, data asset valuation — restaurant data monetization market $10B+ by 2025 (Gartner); API economy $4.2T by 2026 (McKinsey); 35% of enterprises monetize data (Forrester); average API revenue $100k-1M/year; data licensing $50k-500k/year; third-party integrations $10k-100k/partner/year; benchmarking $20k-100k/year; predictive models $50k-200k/year; restaurants collect terabytes daily; 72% expect personalization = data is valuable; data ROI $5-20 per $1 invested; 60% of revenue from API access, 25% licensing, 15% marketplace/benchmarking
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faDatabase} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze data monetization'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faDatabase} label="No data monetization strategy" value={String(summary.dataMonetizationStrategyAbsentCount)} color={summary.dataMonetizationStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faPlug} label="No API / no licensing" value={String(summary.apiRevenueProgramAbsentCount + summary.dataLicensingProgramAbsentCount)} color={(summary.apiRevenueProgramAbsentCount + summary.dataLicensingProgramAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHandshake} label="Thin partners / no benchmarking / no predictive" value={String(summary.thirdPartyIntegrationEcosystemThinCount + summary.benchmarkingDataProductAbsentCount + summary.predictiveModelApiAbsentCount)} color={(summary.thirdPartyIntegrationEcosystemThinCount + summary.benchmarkingDataProductAbsentCount + summary.predictiveModelApiAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="Weak privacy / no valuation" value={String(summary.privacyComplianceProgramWeakCount + summary.dataValuationTrackingAbsentCount)} color={(summary.privacyComplianceProgramWeakCount + summary.dataValuationTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faDatabase} spin className="text-4xl mb-3" />
            <p>Analyzing data monetization &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy data monetization environment: active strategy (8+ data assets, quality 80+); API revenue program (10k+ calls/mo, $12k+ revenue, tiered pricing, 18+ developers); data licensing (3+ datasets, $8k+ revenue, 4+ customers); partner ecosystem (3+ partners, $4k+ revenue); benchmarking product (8+ customers, $3k+ revenue, quarterly); predictive model API (3+ models, $5k+ revenue); privacy compliance (score 85+, GDPR + CCPA, anonymization 90+); data valuation tracking ($480k+ asset, $0.04/record, quarterly); restaurant data monetization market $10B+ by 2025 (Gartner); API economy $4.2T by 2026 (McKinsey); 35% monetize data (Forrester); average API revenue $100k-1M/year; data licensing $50k-500k/year; ROI $5-20 per $1 invested.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faDatabase, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_data_monetization_strategy != null && (
                            <span className={`text-xs ${alert.has_data_monetization_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_data_monetization_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.total_data_revenue_monthly != null && alert.total_data_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.total_data_revenue_monthly)}/mo data rev ({alert.data_revenue_as_pct_of_total ?? 0}%)</span>
                          )}
                          {alert.api_revenue_monthly != null && alert.api_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.api_revenue_monthly)}/mo API</span>
                          )}
                          {alert.licensing_revenue_monthly != null && alert.licensing_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.licensing_revenue_monthly)}/mo licensing</span>
                          )}
                          {alert.partner_revenue_monthly != null && alert.partner_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.partner_revenue_monthly)}/mo partner</span>
                          )}
                          {alert.competitor_data_monetization_score != null && alert.competitor_data_monetization_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_data_monetization_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.data_revenue_growth_projected_pct != null && alert.data_revenue_growth_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.data_revenue_growth_projected_pct}% data revenue growth (target)</span>
                          )}
                          {alert.api_revenue_projected != null && alert.api_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.api_revenue_projected)}/mo API revenue (target)</span>
                          )}
                          {alert.licensing_revenue_projected != null && alert.licensing_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.licensing_revenue_projected)}/mo licensing (target)</span>
                          )}
                          {alert.partner_revenue_projected != null && alert.partner_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.partner_revenue_projected)}/mo partner (target)</span>
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
                            <FontAwesomeIcon icon={faDatabase} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireDataMonetizationStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDataMonetizationStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requireApiRevenueProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireApiRevenueProgram ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireDataLicensingProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDataLicensingProgram ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requirePartnerEcosystem ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePartnerEcosystem ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireBenchmarkingProduct ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBenchmarkingProduct ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requirePredictiveModelApi ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePredictiveModelApi ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requirePrivacyComplianceProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePrivacyComplianceProgram ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireDataValuationTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDataValuationTracking ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minDataQualityScore}</span>
          <span>Min API calls: {config.minApiCallVolumeMonthly}/mo</span>
          <span>Min partners: {config.minPartnerCount}</span>
          <span>Min privacy: {config.minPrivacyComplianceScore}</span>
          <span>Min anonymization: {config.minAnonymizationScore}</span>
          <span className="text-neutral-400">209th POSR-exclusive differentiator</span>
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

export default DataMonetizationApiRevenueScreen;
