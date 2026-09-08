/**
 * AI Blockchain Loyalty & Tokenized Rewards Optimizer — predicts how
 * blockchain-based loyalty programs and tokenized rewards (NFT membership
 * cards, crypto token rewards, smart contract loyalty tiers, token-gated
 * experiences, on-chain achievement badges, tradable reward tokens,
 * decentralized loyalty network, blockchain receipt verification, crypto
 * payment integration, token staking for perks) impact customer retention,
 * engagement, brand differentiation, Gen Z acquisition, new revenue streams.
 * 213th POSR-exclusive differentiator.
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
  faBitcoinSign, faTicket, faFileContract, faCrown,
  faMedal, faKey, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runBlockchainLoyaltyEngine, getActiveBlockchainLoyaltyAlerts, getBlockchainLoyaltySummary,
  updateBlockchainLoyaltyAlertStatus, readBlockchainLoyaltyConfig, DEFAULT_BLOCKCHAIN_LOYALTY_CONFIG,
  type BlockchainLoyaltyAlert,
} from "@/lib/blockchain-loyalty-tokenized-rewards.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  blockchain_loyalty_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faBitcoinSign,          label: 'NO DATA MONETIZATION' },
  nft_membership_program_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faCoins,              label: 'NO API PROGRAM' },
  token_reward_system_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faTicket,      label: 'NO LICENSING' },
  smart_contract_loyalty_tiers_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faFileContract,         label: 'THIN PARTNER ECOSYS' },
  token_gated_experiences_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faCrown,       label: 'NO BENCHMARKING' },
  on_chain_achievement_badges_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faMedal,             label: 'NO PREDICTIVE API' },
  crypto_payment_integration_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faKey,      label: 'WEAK PRIVACY' },
  blockchain_loyalty_roi_tracking_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function BlockchainLoyaltyTokenizedRewardsScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<BlockchainLoyaltyAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, blockchainLoyaltyStrategyAbsentCount: 0, nftMembershipProgramAbsentCount: 0, tokenRewardSystemAbsentCount: 0, smartContractLoyaltyTiersAbsentCount: 0, tokenGatedExperiencesAbsentCount: 0, onChainAchievementBadgesAbsentCount: 0, cryptoPaymentIntegrationAbsentCount: 0, blockchainLoyaltyRoiTrackingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_BLOCKCHAIN_LOYALTY_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readBlockchainLoyaltyConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveBlockchainLoyaltyAlerts(db), getBlockchainLoyaltySummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runBlockchainLoyaltyEngine(db, config);
      toast.success(`Analyzed ${result.generated} blockchain loyalty signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateBlockchainLoyaltyAlertStatus(db, alertId, status);
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
      <DocumentTitle parts={["AI Blockchain Loyaltyization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faBitcoinSign} className="text-violet-600" />
              AI Blockchain Loyaltyization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how blockchain loyalty and tokenized rewards (NFT memberships, crypto tokens, smart contract tiers, token-gated experiences, on-chain badges, crypto payment) impact retention, engagement, brand differentiation, Gen Z acquisition — blockchain loyalty market $5B+ by 2030; Starbucks Odyssey $50M+ NFT trades; 35% of Gen Z own crypto; tokenized rewards = 25-40% higher avg ticket; 68% Gen Z/millennials interested (Deloitte); 45% plan blockchain loyalty by 2027; ROI $4-12 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faBitcoinSign} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze blockchain loyalty'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faBitcoinSign} label="No data monetization strategy" value={String(summary.blockchainLoyaltyStrategyAbsentCount)} color={summary.blockchainLoyaltyStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCoins} label="No API / no licensing" value={String(summary.nftMembershipProgramAbsentCount + summary.tokenRewardSystemAbsentCount)} color={(summary.nftMembershipProgramAbsentCount + summary.tokenRewardSystemAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faFileContract} label="Thin partners / no benchmarking / no predictive" value={String(summary.smartContractLoyaltyTiersAbsentCount + summary.tokenGatedExperiencesAbsentCount + summary.onChainAchievementBadgesAbsentCount)} color={(summary.smartContractLoyaltyTiersAbsentCount + summary.tokenGatedExperiencesAbsentCount + summary.onChainAchievementBadgesAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faKey} label="Weak privacy / no valuation" value={String(summary.cryptoPaymentIntegrationAbsentCount + summary.blockchainLoyaltyRoiTrackingAbsentCount)} color={(summary.cryptoPaymentIntegrationAbsentCount + summary.blockchainLoyaltyRoiTrackingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faBitcoinSign} spin className="text-4xl mb-3" />
            <p>Analyzing blockchain loyalty &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy blockchain loyalty environment: active blockchain loyalty strategy (platform: Polygon/Ethereum/Solana); NFT membership program (500+ minted, $20k+ revenue); token reward system (5+ tokens/visit, secondary market); smart contract loyalty tiers (80%+ automation, 4+ tiers); token-gated experiences (30%+ engagement, 3+ events/mo); on-chain achievement badges (5+ types, portable); crypto payment integration (5%+ of revenue); blockchain ROI tracking (ROAS 3x+); blockchain loyalty market $5B+ by 2030; 25-40% higher avg ticket; 60-80% retention; ROI $4-12 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faBitcoinSign, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_blockchain_loyalty_strategy != null && (
                            <span className={`text-xs ${alert.has_blockchain_loyalty_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_blockchain_loyalty_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.nft_revenue_monthly != null && alert.nft_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.nft_revenue_monthly)}/mo data rev ({alert.token_holder_retention_rate_pct ?? 0}%)</span>
                          )}
                          {alert.token_reward_per_visit != null && alert.token_reward_per_visit > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.token_reward_per_visit)}/mo API</span>
                          )}
                          {alert.token_secondary_market_price != null && alert.token_secondary_market_price > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.token_secondary_market_price)}/mo licensing</span>
                          )}
                          {alert.blockchain_brand_differentiation_score != null && alert.blockchain_brand_differentiation_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.blockchain_brand_differentiation_score)}/mo partner</span>
                          )}
                          {alert.competitor_blockchain_loyalty_score != null && alert.competitor_blockchain_loyalty_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_blockchain_loyalty_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.roi_lift_projected_pct != null && alert.roi_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.roi_lift_projected_pct}% data revenue growth (target)</span>
                          )}
                          {alert.gen_z_acquisition_projected_pct != null && alert.gen_z_acquisition_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.gen_z_acquisition_projected_pct)}/mo API revenue (target)</span>
                          )}
                          {alert.retention_lift_projected_pct != null && alert.retention_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.retention_lift_projected_pct)}/mo licensing (target)</span>
                          )}
                          {alert.ticket_lift_projected_pct != null && alert.ticket_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.ticket_lift_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.engagement_lift_projected_pct != null && alert.engagement_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.engagement_lift_projected_pct}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faBitcoinSign} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireBlockchainLoyaltyStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBlockchainLoyaltyStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requireNftMembershipProgram ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNftMembershipProgram ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireTokenRewardSystem ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTokenRewardSystem ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireSmartContractLoyaltyTiers ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireSmartContractLoyaltyTiers ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireTokenGatedExperiences ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTokenGatedExperiences ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireOnChainAchievementBadges ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireOnChainAchievementBadges ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireCryptoPaymentIntegration ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCryptoPaymentIntegration ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireBlockchainLoyaltyRoiTracking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBlockchainLoyaltyRoiTracking ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minNftMembershipMintedCount}</span>
          <span>Min API calls: {config.minTokenRewardPerVisit}/mo</span>
          <span>Min partners: {config.minTierAutomationRatePct}</span>
          <span>Min privacy: {config.minTokenGatedEngagementRatePct}</span>
          <span>Min anonymization: {config.minBadgeTypesCount}</span>
          <span className="text-neutral-400">213th POSR-exclusive differentiator</span>
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

export default BlockchainLoyaltyTokenizedRewardsScreen;
