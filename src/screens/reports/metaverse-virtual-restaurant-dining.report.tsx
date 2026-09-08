/**
 * AI Metaverse & Virtual Restaurant Dining Experience Optimizer — predicts how
 * metaverse and virtual restaurant dining (virtual restaurant presence,
 * VR dining experiences, digital twin restaurants, NFT menu items,
 * virtual cooking classes, avatar dining, cross-reality loyalty,
 * virtual event hosting, metaverse real estate, digital food
 * commerce, virtual brand expansion, social VR dining) impacts brand
 * reach, new revenue streams, Gen Z acquisition, engagement, premium.
 * 217th POSR-exclusive differentiator.
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
  faGlobe, faHeadset, faVrCardboard, faLayerGroup, faRocket,
  faUserGroup, faNetworkWired, faCoins,
  faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runMetaverseEngine, getActiveMetaverseAlerts, getMetaverseSummary,
  updateMetaverseAlertStatus, readMetaverseConfig, DEFAULT_METAVERSE_CONFIG,
  type MetaverseAlert,
} from "@/lib/metaverse-virtual-restaurant-dining.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  metaverse_strategy_absent:            { bg: 'bg-rose-50',      text: 'text-rose-700',      icon: faGlobe,          label: 'NO DATA MONETIZATION' },
  virtual_restaurant_presence_absent:                   { bg: 'bg-amber-50',     text: 'text-amber-700',     icon: faHeadset,              label: 'NO API PROGRAM' },
  vr_dining_experience_absent:                { bg: 'bg-orange-50',    text: 'text-orange-700',    icon: faVrCardboard,      label: 'NO LICENSING' },
  nft_menu_items_absent:       { bg: 'bg-sky-50',       text: 'text-sky-700',       icon: faLayerGroup,         label: 'THIN PARTNER ECOSYS' },
  virtual_cooking_classes_absent:             { bg: 'bg-violet-50',    text: 'text-violet-700',    icon: faRocket,       label: 'NO BENCHMARKING' },
  avatar_social_dining_absent:                  { bg: 'bg-fuchsia-50',   text: 'text-fuchsia-700',   icon: faUserGroup,             label: 'NO PREDICTIVE API' },
  cross_reality_loyalty_absent:              { bg: 'bg-red-50',       text: 'text-red-700',       icon: faNetworkWired,      label: 'WEAK PRIVACY' },
  virtual_event_hosting_absent:               { bg: 'bg-teal-50',      text: 'text-teal-700',      icon: faCoins,             label: 'NO VALUATION TRACK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function MetaverseVirtualRestaurantDiningScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<MetaverseAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, metaverseStrategyAbsentCount: 0, virtualRestaurantPresenceAbsentCount: 0, vrDiningExperienceAbsentCount: 0, nftMenuItemsAbsentCount: 0, virtualCookingClassesAbsentCount: 0, avatarSocialDiningAbsentCount: 0, crossRealityLoyaltyAbsentCount: 0, virtualEventHostingAbsentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_METAVERSE_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readMetaverseConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveMetaverseAlerts(db), getMetaverseSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[data-monetization-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runMetaverseEngine(db, config);
      toast.success(`Analyzed ${result.generated} metaverse signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[data-monetization-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateMetaverseAlertStatus(db, alertId, status);
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
      <DocumentTitle parts={["AI Metaverseization & API Revenue Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="text-violet-600" />
              AI Metaverseization &amp; API Revenue Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how metaverse and virtual restaurant dining (virtual restaurant, VR dining, NFT menu, virtual cooking, avatar dining, cross-reality loyalty, virtual events) impacts brand reach, revenue, Gen Z acquisition, engagement — metaverse restaurant market $10B+ by 2030 (McKinsey); 72% Gen Z interested; 45% would pay; McDonald/Wendy/Chipotle in metaverse; VR dining $15-50/cover; NFT menu $50-500/dish; virtual events $500-5k; ROI $5-15 per $1
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faGlobe} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze metaverse'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faGlobe} label="No data monetization strategy" value={String(summary.metaverseStrategyAbsentCount)} color={summary.metaverseStrategyAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHeadset} label="No API / no licensing" value={String(summary.virtualRestaurantPresenceAbsentCount + summary.vrDiningExperienceAbsentCount)} color={(summary.virtualRestaurantPresenceAbsentCount + summary.vrDiningExperienceAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faLayerGroup} label="Thin partners / no benchmarking / no predictive" value={String(summary.nftMenuItemsAbsentCount + summary.virtualCookingClassesAbsentCount + summary.avatarSocialDiningAbsentCount)} color={(summary.nftMenuItemsAbsentCount + summary.virtualCookingClassesAbsentCount + summary.avatarSocialDiningAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faNetworkWired} label="Weak privacy / no valuation" value={String(summary.crossRealityLoyaltyAbsentCount + summary.virtualEventHostingAbsentCount)} color={(summary.crossRealityLoyaltyAbsentCount + summary.virtualEventHostingAbsentCount) > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faGlobe} spin className="text-4xl mb-3" />
            <p>Analyzing metaverse &amp; API revenue opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No data monetization alerts</p>
            <p className="text-sm mt-1">Healthy metaverse environment: active metaverse strategy (platforms: Roblox/Meta Horizon/Sandbox); virtual restaurant (1000+ visits/mo, $5k+ revenue); VR dining (20+ covers/mo, $15-50/cover, Meta Quest 3/Vision Pro); NFT menu (3+ items, $50-500/dish, tradable); virtual cooking (4+ sessions/mo, $50-200/session); avatar social dining (2+ sessions/mo, social VR); cross-reality loyalty (10%+ redemption, virtual-to-physical conversion); virtual events (2+/mo, $500-5k/event); metaverse market $10B+ by 2030; 72% Gen Z interested; 45% would pay; ROI $5-15 per $1.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faGlobe, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_metaverse_strategy != null && (
                            <span className={`text-xs ${alert.has_metaverse_strategy ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_metaverse_strategy ? 'data mon yes' : 'NO data mon'}</span>
                          )}
                          {alert.metaverse_revenue_monthly != null && alert.metaverse_revenue_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.metaverse_revenue_monthly)}/mo data rev ({alert.metaverse_customer_acquisition_pct ?? 0}%)</span>
                          )}
                          {alert.virtual_restaurant_visits_monthly != null && alert.virtual_restaurant_visits_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.virtual_restaurant_visits_monthly)}/mo API</span>
                          )}
                          {alert.vr_dining_covers_monthly != null && alert.vr_dining_covers_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.vr_dining_covers_monthly)}/mo licensing</span>
                          )}
                          {alert.metaverse_brand_reach_score != null && alert.metaverse_brand_reach_score > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{fmt$(alert.metaverse_brand_reach_score)}/mo partner</span>
                          )}
                          {alert.competitor_metaverse_score != null && alert.competitor_metaverse_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_metaverse_score}/100 competitor</span>
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
                          {alert.virtual_revenue_projected != null && alert.virtual_revenue_projected > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.virtual_revenue_projected)}/mo API revenue (target)</span>
                          )}
                          {alert.brand_reach_projected_pct != null && alert.brand_reach_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.brand_reach_projected_pct)}/mo licensing (target)</span>
                          )}
                          {alert.gen_z_acquisition_projected_pct != null && alert.gen_z_acquisition_projected_pct > 0 && (
                            <span className="text-emerald-600">+{fmt$(alert.gen_z_acquisition_projected_pct)}/mo partner (target)</span>
                          )}
                          {alert.engagement_lift_projected_pts != null && alert.engagement_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">-{alert.engagement_lift_projected_pts}% compliance risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faGlobe} className="mt-0.5 shrink-0" />
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
          <span>Data strategy: <span className={config.requireMetaverseStrategy ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireMetaverseStrategy ? 'required' : 'optional'}</span></span>
          <span>API program: <span className={config.requireVirtualRestaurantPresence ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVirtualRestaurantPresence ? 'required' : 'optional'}</span></span>
          <span>Licensing: <span className={config.requireVrDiningExperience ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVrDiningExperience ? 'required' : 'optional'}</span></span>
          <span>Partners: <span className={config.requireNftMenuItems ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireNftMenuItems ? 'required' : 'optional'}</span></span>
          <span>Benchmarking: <span className={config.requireVirtualCookingClasses ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVirtualCookingClasses ? 'required' : 'optional'}</span></span>
          <span>Predictive: <span className={config.requireAvatarSocialDining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAvatarSocialDining ? 'required' : 'optional'}</span></span>
          <span>Privacy: <span className={config.requireCrossRealityLoyalty ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCrossRealityLoyalty ? 'required' : 'optional'}</span></span>
          <span>Valuation: <span className={config.requireVirtualEventHosting ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireVirtualEventHosting ? 'required' : 'optional'}</span></span>
          <span>Min quality: {config.minVirtualRestaurantVisitsMonthly}</span>
          <span>Min API calls: {config.minVrDiningCoversMonthly}/mo</span>
          <span>Min partners: {config.minNftMenuItemsCount}</span>
          <span>Min privacy: {config.minVirtualCookingSessionsMonthly}</span>
          <span>Min anonymization: {config.minAvatarDiningSessionsMonthly}</span>
          <span className="text-neutral-400">217th POSR-exclusive differentiator</span>
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

export default MetaverseVirtualRestaurantDiningScreen;
