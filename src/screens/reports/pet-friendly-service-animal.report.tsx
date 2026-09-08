/**
 * AI Pet-Friendly & Service Animal Accommodation Optimizer — predicts how
 * pet-friendly policies and service animal accommodations (dog-friendly patio,
 * service animal protocols, pet water bowls, pet menu items, pet waste
 * stations, staff training on service animal law, ADA compliance, pet
 * photography spots, pet events/yappy hour) impacts customer acquisition from
 * pet owners, legal compliance, brand differentiation, and revenue.
 *
 * 197th POSR-exclusive differentiator.
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
  faDog, faPaw, faBowlRice, faWater, faCamera, faShieldHalved, faHand, faSignsPost,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runPetFriendlyServiceAnimalEngine, getActivePetFriendlyServiceAnimalAlerts, getPetFriendlyServiceAnimalSummary,
  updatePetFriendlyServiceAnimalAlertStatus, readPetFriendlyServiceAnimalConfig, DEFAULT_PET_FRIENDLY_SERVICE_ANIMAL_CONFIG,
  type PetFriendlyServiceAnimalAlert,
} from "@/lib/pet-friendly-service-animal.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  pet_friendly_patio_absent:           { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faDog,           label: 'NO PET PATIO' },
  service_animal_protocol_absent:      { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faShieldHalved,  label: 'NO ADA PROTOCOL' },
  pet_amenities_missing:               { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faWater,         label: 'NO AMENITIES' },
  pet_menu_items_absent:               { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faBowlRice,      label: 'NO PET MENU' },
  yappy_hour_event_absent:             { bg: 'bg-cyan-50',     text: 'text-cyan-700',     icon: faPaw,           label: 'NO YAPPY HOUR' },
  pet_policy_unclear:                  { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faSignsPost,     label: 'POLICY UNCLEAR' },
  pet_photography_spot_absent:         { bg: 'bg-emerald-50',  text: 'text-emerald-700',  icon: faCamera,        label: 'NO PHOTO SPOT' },
  service_animal_refusal_risk:         { bg: 'bg-red-50',      text: 'text-red-700',      icon: faHand,          label: 'REFUSAL RISK' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function PetFriendlyServiceAnimalScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<PetFriendlyServiceAnimalAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, petFriendlyPatioAbsentCount: 0, serviceAnimalProtocolAbsentCount: 0, petAmenitiesMissingCount: 0, petMenuItemsAbsentCount: 0, yappyHourEventAbsentCount: 0, petPolicyUnclearCount: 0, petPhotographySpotAbsentCount: 0, serviceAnimalRefusalRiskCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_PET_FRIENDLY_SERVICE_ANIMAL_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readPetFriendlyServiceAnimalConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActivePetFriendlyServiceAnimalAlerts(db), getPetFriendlyServiceAnimalSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[pet-friendly-service-animal-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runPetFriendlyServiceAnimalEngine(db, config);
      toast.success(`Analyzed ${result.generated} pet-friendly + service animal signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[pet-friendly-service-animal-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updatePetFriendlyServiceAnimalAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[pet-friendly-service-animal-report] status failed', err);
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
      <DocumentTitle parts={["AI Pet-Friendly & Service Animal Accommodation Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faDog} className="text-amber-600" />
              AI Pet-Friendly &amp; Service Animal Accommodation Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how pet-friendly + service animal accommodations (dog patio, ADA service animal protocol, pet amenities, pet menu, yappy hour, policy signage, photo spots, refusal risk) impact pet owner customer acquisition, legal compliance, brand differentiation — 70% households own pets (APPA 2024); 78% dog owners dine more at pet-friendly (AKC); pet patios increase weekend revenue 20-35%; service animal refusal = $55k-$200k ADA lawsuit (DOJ); yappy hour attracts 30-50 new customers; pet menu items $3-5 profit each; pet amenities = 90% complaint reduction; dog photos 40-60% more Instagram engagement
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faDog} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze pet-friendly'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faDog} label="No pet patio" value={String(summary.petFriendlyPatioAbsentCount)} color={summary.petFriendlyPatioAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faShieldHalved} label="No ADA protocol" value={String(summary.serviceAnimalProtocolAbsentCount)} color={summary.serviceAnimalProtocolAbsentCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
          <SummaryCard icon={faWater} label="No amenities" value={String(summary.petAmenitiesMissingCount)} color={summary.petAmenitiesMissingCount > 0 ? 'text-orange-600' : 'text-emerald-600'} />
          <SummaryCard icon={faHand} label="Refusal risk" value={String(summary.serviceAnimalRefusalRiskCount)} color={summary.serviceAnimalRefusalRiskCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faDog} spin className="text-4xl mb-3" />
            <p>Analyzing pet-friendly + service animal accommodation opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No pet-friendly + service animal alerts</p>
            <p className="text-sm mt-1">Healthy pet-friendly + service animal environment: dog-friendly patio (20-35% weekend revenue lift); ADA service animal protocol + staff training ($55k-$200k lawsuit avoidance); pet water bowls + waste stations (90% complaint reduction); pet menu items ($3-5 profit per pet-owning table); yappy hour events (30-50 new customers per event); visible pet policy signage (clarity + legal protection); Instagram-worthy pet photo spot (40-60% engagement lift); zero refusal incidents (ADA compliant); 70% households own pets (APPA 2024); 78% dog owners dine more at pet-friendly (AKC); 22% of restaurants now allow dogs on patios (NRA 2024, up from 8% in 2019).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faPaw, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_pet_friendly_patio != null && (
                            <span className={`text-xs ${alert.has_pet_friendly_patio ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pet_friendly_patio ? 'pet patio yes' : 'NO pet patio'}</span>
                          )}
                          {alert.pet_patio_score != null && alert.pet_patio_score > 0 && (
                            <span className={`text-xs ${alert.pet_patio_score < 40 ? 'text-rose-600 font-medium' : alert.pet_patio_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_patio_score}/100 patio</span>
                          )}
                          {alert.pet_patio_seats != null && alert.pet_patio_seats > 0 && (
                            <span className="text-xs text-neutral-500">{alert.pet_patio_seats} patio seats</span>
                          )}
                          {alert.has_service_animal_protocol != null && (
                            <span className={`text-xs ${alert.has_service_animal_protocol ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_service_animal_protocol ? 'ADA protocol yes' : 'NO ADA protocol'}</span>
                          )}
                          {alert.staff_ada_training_pct != null && alert.staff_ada_training_pct >= 0 && (
                            <span className={`text-xs ${alert.staff_ada_training_pct < 25 ? 'text-rose-600 font-medium' : alert.staff_ada_training_pct < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.staff_ada_training_pct}% ADA trained</span>
                          )}
                          {alert.trained_ada_staff_count != null && alert.total_staff_count != null && (
                            <span className="text-xs text-neutral-500">{alert.trained_ada_staff_count}/{alert.total_staff_count} staff</span>
                          )}
                          {alert.has_pet_water_bowls != null && (
                            <span className={`text-xs ${alert.has_pet_water_bowls ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pet_water_bowls ? 'water bowls yes' : 'NO bowls'}</span>
                          )}
                          {alert.has_pet_waste_station != null && (
                            <span className={`text-xs ${alert.has_pet_waste_station ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pet_waste_station ? 'waste station yes' : 'NO waste station'}</span>
                          )}
                          {alert.pet_amenity_score != null && alert.pet_amenity_score > 0 && (
                            <span className={`text-xs ${alert.pet_amenity_score < 40 ? 'text-rose-600 font-medium' : alert.pet_amenity_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_amenity_score}/100 amenity</span>
                          )}
                          {alert.pet_complaints_per_100 != null && alert.pet_complaints_per_100 > 0 && (
                            <span className={`text-xs ${alert.pet_complaints_per_100 > 8 ? 'text-rose-600 font-medium' : alert.pet_complaints_per_100 > 4 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_complaints_per_100}/100 complaints</span>
                          )}
                          {alert.has_pet_menu != null && (
                            <span className={`text-xs ${alert.has_pet_menu ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pet_menu ? 'pet menu yes' : 'NO pet menu'}</span>
                          )}
                          {alert.pet_menu_item_count != null && alert.pet_menu_item_count > 0 && (
                            <span className="text-xs text-neutral-500">{alert.pet_menu_item_count} items</span>
                          )}
                          {alert.pet_menu_items_sold_monthly != null && alert.pet_menu_items_sold_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.pet_menu_items_sold_monthly}/mo sold</span>
                          )}
                          {alert.has_yappy_hour != null && (
                            <span className={`text-xs ${alert.has_yappy_hour ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_yappy_hour ? 'yappy hour yes' : 'NO yappy hour'}</span>
                          )}
                          {alert.yappy_hour_events_per_month != null && alert.yappy_hour_events_per_month > 0 && (
                            <span className="text-xs text-neutral-500">{alert.yappy_hour_events_per_month}/mo events</span>
                          )}
                          {alert.has_pet_policy_signage != null && (
                            <span className={`text-xs ${alert.has_pet_policy_signage ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pet_policy_signage ? 'signage yes' : 'NO signage'}</span>
                          )}
                          {alert.pet_policy_clarity_score != null && alert.pet_policy_clarity_score > 0 && (
                            <span className={`text-xs ${alert.pet_policy_clarity_score < 50 ? 'text-rose-600 font-medium' : alert.pet_policy_clarity_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_policy_clarity_score}/100 policy</span>
                          )}
                          {alert.has_pet_photography_spot != null && (
                            <span className={`text-xs ${alert.has_pet_photography_spot ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_pet_photography_spot ? 'photo spot yes' : 'NO photo spot'}</span>
                          )}
                          {alert.pet_photo_spot_score != null && alert.pet_photo_spot_score > 0 && (
                            <span className={`text-xs ${alert.pet_photo_spot_score < 40 ? 'text-rose-600 font-medium' : alert.pet_photo_spot_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_photo_spot_score}/100 photo</span>
                          )}
                          {alert.instagram_engagement_pct != null && alert.instagram_engagement_pct > 0 && (
                            <span className={`text-xs ${alert.instagram_engagement_pct < 10 ? 'text-rose-600 font-medium' : alert.instagram_engagement_pct < 25 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.instagram_engagement_pct}% IG</span>
                          )}
                          {alert.service_animal_refusal_incidents != null && alert.service_animal_refusal_incidents > 0 && (
                            <span className="text-xs text-red-600 font-bold">{alert.service_animal_refusal_incidents} refusals!</span>
                          )}
                          {alert.ada_lawsuit_risk_score != null && alert.ada_lawsuit_risk_score > 0 && (
                            <span className={`text-xs ${alert.ada_lawsuit_risk_score > 70 ? 'text-red-600 font-bold' : alert.ada_lawsuit_risk_score > 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_lawsuit_risk_score}/100 lawsuit risk</span>
                          )}
                          {alert.ada_compliance_score != null && alert.ada_compliance_score > 0 && (
                            <span className={`text-xs ${alert.ada_compliance_score < 60 ? 'text-rose-600 font-medium' : alert.ada_compliance_score < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_compliance_score}/100 ADA</span>
                          )}
                          {alert.pet_owner_visit_pct != null && alert.pet_owner_visit_pct > 0 && (
                            <span className={`text-xs ${alert.pet_owner_visit_pct < 10 ? 'text-rose-600 font-medium' : alert.pet_owner_visit_pct < 20 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_owner_visit_pct}% pet owners</span>
                          )}
                          {alert.dog_owner_visit_pct != null && alert.dog_owner_visit_pct > 0 && (
                            <span className={`text-xs ${alert.dog_owner_visit_pct < 5 ? 'text-rose-600 font-medium' : alert.dog_owner_visit_pct < 12 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.dog_owner_visit_pct}% dog owners</span>
                          )}
                          {alert.pet_owner_satisfaction_score != null && alert.pet_owner_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.pet_owner_satisfaction_score < 50 ? 'text-rose-600 font-medium' : alert.pet_owner_satisfaction_score < 70 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.pet_owner_satisfaction_score}/100 pet sat</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 sat</span>
                          )}
                          {alert.negative_review_count != null && alert.negative_review_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.negative_review_count} neg reviews</span>
                          )}
                          {alert.competitor_pet_friendly_score != null && alert.competitor_pet_friendly_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_pet_friendly_score}/100 competitor</span>
                          )}
                          {alert.weekend_revenue != null && alert.weekend_revenue > 0 && (
                            <span className="text-xs text-neutral-500">${alert.weekend_revenue}/mo weekend</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.weekend_revenue_lift_projected_pct != null && alert.weekend_revenue_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.weekend_revenue_lift_projected_pct}% weekend revenue (target)</span>
                          )}
                          {alert.pet_owner_visit_lift_projected_pct != null && alert.pet_owner_visit_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.pet_owner_visit_lift_projected_pct}% pet owner visits (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.pet_complaint_reduction_projected_pct != null && alert.pet_complaint_reduction_projected_pct > 0 && (
                            <span className="text-emerald-600">-{alert.pet_complaint_reduction_projected_pct}% pet complaints (target)</span>
                          )}
                          {alert.instagram_engagement_lift_projected_pct != null && alert.instagram_engagement_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.instagram_engagement_lift_projected_pct}% IG engagement (target)</span>
                          )}
                          {alert.new_customer_acquisition_projected != null && alert.new_customer_acquisition_projected > 0 && (
                            <span className="text-emerald-600">+{alert.new_customer_acquisition_projected} new customers/mo (target)</span>
                          )}
                          {alert.ada_lawsuit_risk_reduction_projected_pts != null && alert.ada_lawsuit_risk_reduction_projected_pts > 0 && (
                            <span className="text-emerald-600">-{alert.ada_lawsuit_risk_reduction_projected_pts}pts lawsuit risk (target)</span>
                          )}
                          {alert.predicted_revenue_change_pct != null && alert.predicted_revenue_change_pct > 0 && (
                            <span className="text-emerald-600">{alert.predicted_revenue_change_pct}% total revenue</span>
                          )}
                        </div>
                        {alert.ai_insight && (
                          <div className="mt-2 bg-sky-50 border border-sky-200 rounded px-3 py-2 text-xs text-sky-800 flex items-start gap-2">
                            <FontAwesomeIcon icon={faDog} className="mt-0.5 shrink-0" />
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
          <span>Pet patio: <span className={config.requirePetFriendlyPatio ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePetFriendlyPatio ? 'required' : 'optional'}</span></span>
          <span>ADA protocol: <span className={config.requireServiceAnimalProtocol ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireServiceAnimalProtocol ? 'required' : 'optional'}</span></span>
          <span>Pet amenities: <span className={config.requirePetAmenities ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePetAmenities ? 'required' : 'optional'}</span></span>
          <span>Pet menu: <span className={config.requirePetMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePetMenu ? 'required' : 'optional'}</span></span>
          <span>Yappy hour: <span className={config.requireYappyHour ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireYappyHour ? 'required' : 'optional'}</span></span>
          <span>Signage: <span className={config.requirePetPolicySignage ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePetPolicySignage ? 'required' : 'optional'}</span></span>
          <span>Photo spot: <span className={config.requirePetPhotographySpot ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requirePetPhotographySpot ? 'required' : 'optional'}</span></span>
          <span>Min patio score: {config.minPetPatioScore}</span>
          <span>Min ADA training %: {config.minStaffAdaTrainingPct}</span>
          <span>Min amenity score: {config.minPetAmenityScore}</span>
          <span>Min pet menu items: {config.minPetMenuItemCount}</span>
          <span>Min yappy hour/mo: {config.minYappyHourEventsPerMonth}</span>
          <span>Min policy clarity: {config.minPetPolicyClarityScore}</span>
          <span>Min photo spot: {config.minPetPhotoSpotScore}</span>
          <span>Min ADA compliance: {config.minAdaComplianceScore}</span>
          <span>Max pet complaints/100: {config.maxPetComplaintsPer100}</span>
          <span className="text-neutral-400">197th POSR-exclusive differentiator</span>
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

export default PetFriendlyServiceAnimalScreen;
