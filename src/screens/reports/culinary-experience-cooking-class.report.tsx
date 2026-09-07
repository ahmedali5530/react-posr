/**
 * AI Culinary Experience & Cooking Class Optimizer — predicts how culinary
 * experiences and cooking classes (chef-led cooking classes, wine pairing
 * dinners, tasting menus, chef table experiences, culinary workshops, food
 * tours, demonstration kitchens, interactive dining) impact additional
 * revenue, brand differentiation, customer loyalty, and marketing reach.
 *
 * 188th POSR-exclusive differentiator.
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
  faUtensils, faRotate, faWineGlass, faFire, faBook,
  faGraduationCap, faUsers, faCamera, faBullhorn,
  faCircleInfo, faCheckCircle, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  runCulinaryExperienceEngine, getActiveCulinaryExperienceAlerts, getCulinaryExperienceSummary,
  updateCulinaryExperienceAlertStatus, readCulinaryExperienceConfig, DEFAULT_CULINARY_EXPERIENCE_CONFIG,
  type CulinaryExperienceAlert,
} from "@/lib/culinary-experience-cooking-class.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  cooking_class_program_absent:        { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faUtensils,        label: 'NO COOKING CLASSES' },
  chef_table_experience_absent:        { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faUsers,           label: 'NO CHEF TABLE' },
  tasting_menu_absent:                 { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faFire,            label: 'NO TASTING MENU' },
  wine_pairing_dinner_absent:          { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faWineGlass,       label: 'NO WINE PAIRING' },
  culinary_workshop_absent:            { bg: 'bg-sky-50',      text: 'text-sky-700',      icon: faGraduationCap,   label: 'NO WORKSHOPS' },
  demonstration_kitchen_absent:        { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faCamera,          label: 'NO DEMO KITCHEN' },
  interactive_dining_missing:          { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faBook,            label: 'NO INTERACTIVE' },
  culinary_experience_not_promoted:    { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faBullhorn,        label: 'NOT PROMOTED' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function CulinaryExperienceCookingClassScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<CulinaryExperienceAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, noCookingClassCount: 0, noChefTableCount: 0, noTastingMenuCount: 0, notPromotedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CULINARY_EXPERIENCE_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readCulinaryExperienceConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveCulinaryExperienceAlerts(db), getCulinaryExperienceSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[culinary-experience-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runCulinaryExperienceEngine(db, config);
      toast.success(`Analyzed ${result.generated} culinary experience signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[culinary-experience-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateCulinaryExperienceAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[culinary-experience-report] status failed', err);
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
      <DocumentTitle parts={["AI Culinary Experience & Cooking Class Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faUtensils} className="text-rose-500" />
              AI Culinary Experience &amp; Cooking Class Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how culinary experiences (cooking classes, chef table, tasting menu, wine pairing dinners, culinary workshops, demonstration kitchen, interactive dining, experience promotion) impact additional revenue + brand differentiation + customer loyalty + marketing reach — cooking classes $1,500-5,000/event at 80%+ margins (CIA); chef table 200-300% premium (OpenTable); tasting menu 150-250% ticket increase (Cornell CHR); wine pairing 300-400% beverage revenue; 55% of fine diners would attend cooking class (NRA); demo kitchen 40% satisfaction + 30% Instagram; interactive dining 50-60% engagement
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faUtensils} spin={analyzing} />
              {analyzing ? 'Analyzing…' : 'Analyze experiences'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faUtensils} label="No cooking classes" value={String(summary.noCookingClassCount)} color={summary.noCookingClassCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faUsers} label="No chef table" value={String(summary.noChefTableCount)} color={summary.noChefTableCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faFire} label="No tasting menu" value={String(summary.noTastingMenuCount)} color={summary.noTastingMenuCount > 0 ? 'text-violet-600' : 'text-emerald-600'} />
          <SummaryCard icon={faBullhorn} label="Not promoted" value={String(summary.notPromotedCount)} color={summary.notPromotedCount > 0 ? 'text-cyan-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faUtensils} spin className="text-4xl mb-3" />
            <p>Analyzing culinary experience &amp; cooking class opportunities…</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No culinary experience alerts</p>
            <p className="text-sm mt-1">Cooking classes running 4+ events per month at $1,500-5,000/event and 80%+ margins; chef table experience with 200-300% premium pricing and 8-10 seats; 9-course tasting menu with 150-250% average ticket lift; wine pairing dinners monthly with 300-400% beverage revenue lift; culinary workshops with 35% new-to-regular conversion; demonstration kitchen with 40% satisfaction boost and 30% Instagram content lift; interactive dining (build-your-own, tableside) with 50-60% engagement lift; experiences promoted via 5+ marketing channels with 85%+ enrollment rate.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faUtensils, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_cooking_classes != null && (
                            <span className={`text-xs ${alert.has_cooking_classes ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_cooking_classes ? 'classes yes' : 'NO classes'}</span>
                          )}
                          {alert.has_chef_table != null && (
                            <span className={`text-xs ${alert.has_chef_table ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}`}>{alert.has_chef_table ? 'chef table yes' : 'NO chef table'}</span>
                          )}
                          {alert.has_tasting_menu != null && (
                            <span className={`text-xs ${alert.has_tasting_menu ? 'text-emerald-600 font-medium' : 'text-violet-600 font-medium'}`}>{alert.has_tasting_menu ? 'tasting yes' : 'NO tasting'}</span>
                          )}
                          {alert.has_wine_pairing_dinners != null && (
                            <span className={`text-xs ${alert.has_wine_pairing_dinners ? 'text-emerald-600 font-medium' : 'text-fuchsia-600 font-medium'}`}>{alert.has_wine_pairing_dinners ? 'wine yes' : 'NO wine pairing'}</span>
                          )}
                          {alert.has_culinary_workshops != null && (
                            <span className={`text-xs ${alert.has_culinary_workshops ? 'text-emerald-600 font-medium' : 'text-sky-600 font-medium'}`}>{alert.has_culinary_workshops ? 'workshops yes' : 'NO workshops'}</span>
                          )}
                          {alert.has_demonstration_kitchen != null && (
                            <span className={`text-xs ${alert.has_demonstration_kitchen ? 'text-emerald-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.has_demonstration_kitchen ? 'demo yes' : 'NO demo kitchen'}</span>
                          )}
                          {alert.has_interactive_dining != null && (
                            <span className={`text-xs ${alert.has_interactive_dining ? 'text-emerald-600 font-medium' : 'text-orange-600 font-medium'}`}>{alert.has_interactive_dining ? 'interactive yes' : 'NO interactive'}</span>
                          )}
                          {alert.experiences_promoted != null && (
                            <span className={`text-xs ${alert.experiences_promoted ? 'text-emerald-600 font-medium' : 'text-cyan-600 font-medium'}`}>{alert.experiences_promoted ? 'promoted' : 'NOT promoted'}</span>
                          )}
                          {alert.experience_features_count != null && alert.experience_features_count > 0 && (
                            <span className={`text-xs ${alert.experience_features_count < 6 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.experience_features_count} features</span>
                          )}
                          {alert.cooking_class_events_per_month != null && alert.cooking_class_events_per_month > 0 && (
                            <span className="text-xs text-neutral-500">{alert.cooking_class_events_per_month} classes/mo</span>
                          )}
                          {alert.cooking_class_margin_pct != null && alert.cooking_class_margin_pct > 0 && (
                            <span className={`text-xs ${alert.cooking_class_margin_pct < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.cooking_class_margin_pct}% margin</span>
                          )}
                          {alert.chef_table_premium_pct != null && alert.chef_table_premium_pct > 0 && (
                            <span className={`text-xs ${alert.chef_table_premium_pct < 200 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.chef_table_premium_pct}% premium</span>
                          )}
                          {alert.tasting_menu_ticket_lift_pct != null && alert.tasting_menu_ticket_lift_pct > 0 && (
                            <span className={`text-xs ${alert.tasting_menu_ticket_lift_pct < 150 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.tasting_menu_ticket_lift_pct}% ticket lift</span>
                          )}
                          {alert.wine_pairing_beverage_revenue_lift_pct != null && alert.wine_pairing_beverage_revenue_lift_pct > 0 && (
                            <span className={`text-xs ${alert.wine_pairing_beverage_revenue_lift_pct < 300 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.wine_pairing_beverage_revenue_lift_pct}% bev lift</span>
                          )}
                          {alert.workshop_conversion_to_regular_pct != null && alert.workshop_conversion_to_regular_pct > 0 && (
                            <span className={`text-xs ${alert.workshop_conversion_to_regular_pct < 35 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.workshop_conversion_to_regular_pct}% workshop conversion</span>
                          )}
                          {alert.demo_kitchen_satisfaction_lift_pct != null && alert.demo_kitchen_satisfaction_lift_pct > 0 && (
                            <span className={`text-xs ${alert.demo_kitchen_satisfaction_lift_pct < 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.demo_kitchen_satisfaction_lift_pct}% satisfaction</span>
                          )}
                          {alert.interactive_engagement_lift_pct != null && alert.interactive_engagement_lift_pct > 0 && (
                            <span className={`text-xs ${alert.interactive_engagement_lift_pct < 50 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>+{alert.interactive_engagement_lift_pct}% engagement</span>
                          )}
                          {alert.experience_enrollment_rate_pct != null && alert.experience_enrollment_rate_pct > 0 && (
                            <span className={`text-xs ${alert.experience_enrollment_rate_pct < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.experience_enrollment_rate_pct}% enrollment</span>
                          )}
                          {alert.experience_waitlist_total != null && alert.experience_waitlist_total > 0 && (
                            <span className="text-xs text-cyan-600 font-medium">{alert.experience_waitlist_total} waitlist</span>
                          )}
                          {alert.customer_loyalty_score != null && alert.customer_loyalty_score > 0 && (
                            <span className="text-xs text-neutral-500">loyalty {alert.customer_loyalty_score}/100</span>
                          )}
                          {alert.customer_loyalty_lift_pct != null && alert.customer_loyalty_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.customer_loyalty_lift_pct}% loyalty</span>
                          )}
                          {alert.brand_differentiation_score != null && alert.brand_differentiation_score > 0 && (
                            <span className="text-xs text-neutral-500">brand {alert.brand_differentiation_score}/100</span>
                          )}
                          {alert.brand_differentiation_lift_pct != null && alert.brand_differentiation_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.brand_differentiation_lift_pct}% brand</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className="text-xs text-neutral-500">satisfaction {alert.customer_satisfaction_score}/100</span>
                          )}
                          {alert.customer_satisfaction_lift_pct != null && alert.customer_satisfaction_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.customer_satisfaction_lift_pct}% satisfaction</span>
                          )}
                          {alert.instagram_engagement_lift_pct != null && alert.instagram_engagement_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.instagram_engagement_lift_pct}% Instagram</span>
                          )}
                          {alert.marketing_reach_lift_pct != null && alert.marketing_reach_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.marketing_reach_lift_pct}% reach</span>
                          )}
                          {alert.new_customer_acquisition_monthly != null && alert.new_customer_acquisition_monthly > 0 && (
                            <span className="text-xs text-neutral-500">{alert.new_customer_acquisition_monthly} new/mo</span>
                          )}
                          {alert.repeat_visit_lift_pct != null && alert.repeat_visit_lift_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">+{alert.repeat_visit_lift_pct}% repeat</span>
                          )}
                          {alert.competitors_with_experiences_pct != null && alert.competitors_with_experiences_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitors_with_experiences_pct}% competitors experiential</span>
                          )}
                          {alert.experience_aware_lost_customers != null && alert.experience_aware_lost_customers > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.experience_aware_lost_customers} lost customers</span>
                          )}
                          {alert.monthly_revenue != null && alert.monthly_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.monthly_revenue}/mo revenue</span>
                          )}
                          {alert.experience_program_setup_cost != null && alert.experience_program_setup_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.experience_program_setup_cost} setup</span>
                          )}
                          {alert.experience_program_total_monthly_cost != null && alert.experience_program_total_monthly_cost > 0 && (
                            <span className="text-xs text-neutral-500">${alert.experience_program_total_monthly_cost}/mo program cost</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.customer_loyalty_lift_projected_pct != null && alert.customer_loyalty_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.customer_loyalty_lift_projected_pct}% customer loyalty (target)</span>
                          )}
                          {alert.brand_differentiation_lift_projected_pct != null && alert.brand_differentiation_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.brand_differentiation_lift_projected_pct}% brand differentiation (target)</span>
                          )}
                          {alert.customer_satisfaction_lift_projected_pct != null && alert.customer_satisfaction_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.customer_satisfaction_lift_projected_pct}% satisfaction (target)</span>
                          )}
                          {alert.instagram_engagement_lift_projected_pct != null && alert.instagram_engagement_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.instagram_engagement_lift_projected_pct}% Instagram (target)</span>
                          )}
                          {alert.marketing_reach_lift_projected_pct != null && alert.marketing_reach_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.marketing_reach_lift_projected_pct}% marketing reach (target)</span>
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
                          <div className="mt-2 bg-rose-50 border border-rose-200 rounded px-3 py-2 text-xs text-rose-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faUtensils} className="mt-0.5 shrink-0" />
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
          <span>Cooking classes: <span className={config.requireCookingClasses ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCookingClasses ? 'required' : 'optional'}</span></span>
          <span>Chef table: <span className={config.requireChefTable ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireChefTable ? 'required' : 'optional'}</span></span>
          <span>Tasting menu: <span className={config.requireTastingMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireTastingMenu ? 'required' : 'optional'}</span></span>
          <span>Wine pairing: <span className={config.requireWinePairingDinners ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireWinePairingDinners ? 'required' : 'optional'}</span></span>
          <span>Workshops: <span className={config.requireCulinaryWorkshops ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireCulinaryWorkshops ? 'required' : 'optional'}</span></span>
          <span>Demo kitchen: <span className={config.requireDemonstrationKitchen ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireDemonstrationKitchen ? 'required' : 'optional'}</span></span>
          <span>Interactive dining: <span className={config.requireInteractiveDining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireInteractiveDining ? 'required' : 'optional'}</span></span>
          <span>Experience promotion: <span className={config.requireExperiencePromotion ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireExperiencePromotion ? 'required' : 'optional'}</span></span>
          <span>Min experience features: {config.minExperienceFeatures}</span>
          <span>Min cooking class margin: {config.minCookingClassMarginPct}%</span>
          <span>Min chef table premium: {config.minChefTablePremiumPct}%</span>
          <span>Min tasting menu ticket lift: {config.minTastingMenuTicketLiftPct}%</span>
          <span>Min wine pairing bev lift: {config.minWinePairingBeverageLiftPct}%</span>
          <span>Min workshop conversion: {config.minWorkshopConversionPct}%</span>
          <span>Min demo kitchen satisfaction lift: {config.minDemoKitchenSatisfactionLiftPct}%</span>
          <span>Min interactive engagement lift: {config.minInteractiveEngagementLiftPct}%</span>
          <span>Min loyalty lift: {config.minLoyaltyLiftPct}%</span>
          <span>Min brand differentiation lift: {config.minBrandDifferentiationLiftPct}%</span>
          <span>Min new customer lift: {config.minNewCustomerAcquisitionLiftPct}%</span>
          <span className="text-neutral-400">188th POSR-exclusive differentiator</span>
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

export default CulinaryExperienceCookingClassScreen;
