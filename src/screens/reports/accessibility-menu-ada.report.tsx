/**
 * AI Accessibility Menu & ADA Compliance Optimizer — predicts how accessibility
 * menu features and ADA compliance (large print menus, braille menus, audio
 * menu descriptions, ADA-compliant table heights, wheelchair accessible paths,
 * accessible restroom verification, visual impairment accommodations, hearing
 * impairment accommodations, staff disability training, accessible parking
 * verification) impacts legal compliance, customer acquisition from the
 * disability community, brand reputation, and lawsuit risk prevention.
 *
 * 198th POSR-exclusive differentiator.
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
  faUniversalAccess, faFont, faBraille, faQrcode, faWheelchair,
  faRestroom, faHand, faCarSide, faShieldHalved,
  faCircleInfo, faCheckCircle, faTriangleExclamation, faRotate,
} from "@fortawesome/free-solid-svg-icons";
import {
  runAccessibilityMenuAdaEngine, getActiveAccessibilityMenuAdaAlerts, getAccessibilityMenuAdaSummary,
  updateAccessibilityMenuAdaAlertStatus, readAccessibilityMenuAdaConfig, DEFAULT_ACCESSIBILITY_MENU_ADA_CONFIG,
  type AccessibilityMenuAdaAlert,
} from "@/lib/accessibility-menu-ada.service.ts";

const RULE_STYLE: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  large_print_menu_absent:              { bg: 'bg-rose-50',     text: 'text-rose-700',     icon: faFont,           label: 'NO LARGE PRINT' },
  braille_menu_absent:                  { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faBraille,        label: 'NO BRAILLE' },
  audio_menu_absent:                    { bg: 'bg-orange-50',   text: 'text-orange-700',   icon: faQrcode,         label: 'NO AUDIO MENU' },
  ada_table_noncompliant:               { bg: 'bg-red-50',      text: 'text-red-700',      icon: faWheelchair,     label: 'ADA TABLES' },
  wheelchair_path_obstructed:           { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700',  icon: faUniversalAccess, label: 'PATH BLOCKED' },
  accessible_restroom_noncompliant:     { bg: 'bg-red-50',      text: 'text-red-700',      icon: faRestroom,       label: 'RESTROOM' },
  staff_disability_training_absent:     { bg: 'bg-violet-50',   text: 'text-violet-700',   icon: faHand,           label: 'NO TRAINING' },
  accessible_parking_noncompliant:      { bg: 'bg-amber-50',    text: 'text-amber-700',    icon: faCarSide,        label: 'PARKING' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-400',
  low:      'bg-neutral-300',
};

const fmt$ = (n: number): string => `$${(n || 0).toFixed(2)}`;

export function AccessibilityMenuAdaScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const db = useDB();
  const [alerts, setAlerts] = useState<AccessibilityMenuAdaAlert[]>([]);
  const [summary, setSummary] = useState({ totalAlerts: 0, criticalCount: 0, totalOpportunity: 0, largePrintMenuAbsentCount: 0, brailleMenuAbsentCount: 0, audioMenuAbsentCount: 0, adaTableNoncompliantCount: 0, wheelchairPathObstructedCount: 0, accessibleRestroomNoncompliantCount: 0, staffDisabilityTrainingAbsentCount: 0, accessibleParkingNoncompliantCount: 0 });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_ACCESSIBILITY_MENU_ADA_CONFIG);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const settingsResult = await db.query('SELECT * FROM settings LIMIT 1');
      const settingsRows = Array.isArray(settingsResult) ? settingsResult.flat() : [];
      setConfig(readAccessibilityMenuAdaConfig(settingsRows[0] ?? {}));
      const [list, sum] = await Promise.all([getActiveAccessibilityMenuAdaAlerts(db), getAccessibilityMenuAdaSummary(db)]);
      setAlerts(list); setSummary(sum);
    } catch (err) { console.error('[accessibility-menu-ada-report] reload failed', err); toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [db]);

  useMemo(() => { reload(); }, [reload]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runAccessibilityMenuAdaEngine(db, config);
      toast.success(`Analyzed ${result.generated} accessibility + ADA compliance signals — ${fmt$(summary.totalOpportunity)}/mo opportunity`);
      await reload();
    } catch (err) {
      console.error('[accessibility-menu-ada-report] analyze failed', err);
      toast.error('Analysis failed');
    } finally { setAnalyzing(false); }
  }, [db, config, reload, summary.totalOpportunity]);

  const handleStatus = useCallback(async (alertId: string, status: 'resolved' | 'in_progress' | 'rejected') => {
    try {
      await updateAccessibilityMenuAdaAlertStatus(db, alertId, status);
      toast.success(`Marked as ${status}`);
      await reload();
    } catch (err) {
      console.error('[accessibility-menu-ada-report] status failed', err);
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
      <DocumentTitle parts={["AI Accessibility Menu & ADA Compliance Optimizer", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faUniversalAccess} className="text-violet-600" />
              AI Accessibility Menu &amp; ADA Compliance Optimizer
            </h1>
            <p className="text-sm text-neutral-500">
              Predicts how accessibility menu + ADA compliance features (large print menu, braille menu, audio menu QR, ADA tables, wheelchair paths, accessible restroom, staff disability training, accessible parking) impact legal compliance, customer acquisition from disability community, brand reputation, lawsuit risk — 1 in 4 US adults has a disability (CDC, 25% of customers); ADA non-compliance = $55k-$200k per violation (DOJ); 61M adults with disability; large print benefits 35% over 50; braille serves 1.3M legally blind; audio menu serves visually impaired + illiterate; ADA tables 28-34in + 30in approach; staff training lifts satisfaction 40-50%; parking non-compliance = $250-1,000/violation; 78% view disability-friendly businesses positively (Cone)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reload} variant="custom" className="gap-2 border border-neutral-300 px-3 py-2 text-sm">
              <FontAwesomeIcon icon={faRotate} /> Refresh
            </Button>
            <Button onClick={handleAnalyze} disabled={analyzing} variant="primary" className="gap-2">
              <FontAwesomeIcon icon={faUniversalAccess} spin={analyzing} />
              {analyzing ? 'Analyzing...' : 'Analyze accessibility'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard icon={faFont} label="No large print" value={String(summary.largePrintMenuAbsentCount)} color={summary.largePrintMenuAbsentCount > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          <SummaryCard icon={faWheelchair} label="ADA table issues" value={String(summary.adaTableNoncompliantCount)} color={summary.adaTableNoncompliantCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
          <SummaryCard icon={faRestroom} label="Restroom issues" value={String(summary.accessibleRestroomNoncompliantCount)} color={summary.accessibleRestroomNoncompliantCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
          <SummaryCard icon={faCarSide} label="Parking issues" value={String(summary.accessibleParkingNoncompliantCount)} color={summary.accessibleParkingNoncompliantCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">
            <FontAwesomeIcon icon={faUniversalAccess} spin className="text-4xl mb-3" />
            <p>Analyzing accessibility menu + ADA compliance opportunities...</p>
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3 text-emerald-500" />
            <p className="font-medium">No accessibility menu + ADA compliance alerts</p>
            <p className="text-sm mt-1">Healthy accessibility + ADA environment: large print menu 18pt+ (35% over 50 benefit); braille menu (1.3M legally blind served); audio menu QR (visually impaired + illiterate served); ADA-compliant tables 28-34in height + 30in approach; clear wheelchair paths 36in minimum; ADA-compliant restroom (grab bars, 32in door, 60in stall); staff trained in disability awareness (40-50% satisfaction lift); ADA-compliant parking 1 per 25 spaces (signage + access aisle); 1 in 4 US adults has a disability (CDC); ADA non-compliance = $55k-$200k per violation (DOJ); 78% view disability-friendly businesses positively (Cone Communications).</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, idx) => {
              const style = RULE_STYLE[alert.rule_id] ?? { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: faUniversalAccess, label: alert.rule_id.toUpperCase() };
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
                          {alert.has_large_print_menu != null && (
                            <span className={`text-xs ${alert.has_large_print_menu ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_large_print_menu ? 'large print yes' : 'NO large print'}</span>
                          )}
                          {alert.large_print_font_size_pt != null && alert.large_print_font_size_pt > 0 && (
                            <span className={`text-xs ${alert.large_print_font_size_pt < 14 ? 'text-rose-600 font-medium' : alert.large_print_font_size_pt < 18 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.large_print_font_size_pt}pt font</span>
                          )}
                          {alert.customer_over_50_visit_pct != null && alert.customer_over_50_visit_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.customer_over_50_visit_pct}% over 50</span>
                          )}
                          {alert.large_print_adoption_pct != null && alert.large_print_adoption_pct > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.large_print_adoption_pct}% adoption</span>
                          )}
                          {alert.has_braille_menu != null && (
                            <span className={`text-xs ${alert.has_braille_menu ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_braille_menu ? 'braille yes' : 'NO braille'}</span>
                          )}
                          {alert.legally_blind_visits_monthly != null && alert.legally_blind_visits_monthly > 0 && (
                            <span className="text-xs text-neutral-500">{alert.legally_blind_visits_monthly} blind visits/mo</span>
                          )}
                          {alert.has_audio_menu != null && (
                            <span className={`text-xs ${alert.has_audio_menu ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_audio_menu ? 'audio menu yes' : 'NO audio menu'}</span>
                          )}
                          {alert.audio_menu_uses_monthly != null && alert.audio_menu_uses_monthly > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">{alert.audio_menu_uses_monthly}/mo audio</span>
                          )}
                          {alert.visually_impaired_visit_pct != null && alert.visually_impaired_visit_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.visually_impaired_visit_pct}% visually impaired</span>
                          )}
                          {alert.illiteracy_rate_local_pct != null && alert.illiteracy_rate_local_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.illiteracy_rate_local_pct}% illiteracy</span>
                          )}
                          {alert.ada_compliant_tables_count != null && alert.total_tables_count != null && (
                            <span className={`text-xs ${alert.ada_table_height_compliance_pct != null && alert.ada_table_height_compliance_pct < 60 ? 'text-rose-600 font-medium' : alert.ada_table_height_compliance_pct != null && alert.ada_table_height_compliance_pct < 90 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_compliant_tables_count}/{alert.total_tables_count} ADA tables</span>
                          )}
                          {alert.ada_table_height_compliance_pct != null && alert.ada_table_height_compliance_pct > 0 && (
                            <span className={`text-xs ${alert.ada_table_height_compliance_pct < 60 ? 'text-rose-600 font-medium' : alert.ada_table_height_compliance_pct < 90 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_table_height_compliance_pct}% height</span>
                          )}
                          {alert.table_approach_clearance_in != null && alert.table_approach_clearance_in > 0 && (
                            <span className={`text-xs ${alert.table_approach_clearance_in < 28 ? 'text-rose-600 font-medium' : alert.table_approach_clearance_in < 30 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.table_approach_clearance_in}in approach</span>
                          )}
                          {alert.wheelchair_path_clear_pct != null && alert.wheelchair_path_clear_pct > 0 && (
                            <span className={`text-xs ${alert.wheelchair_path_clear_pct < 70 ? 'text-rose-600 font-medium' : alert.wheelchair_path_clear_pct < 90 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.wheelchair_path_clear_pct}% path clear</span>
                          )}
                          {alert.wheelchair_path_obstructions_count != null && alert.wheelchair_path_obstructions_count > 0 && (
                            <span className="text-xs text-rose-600 font-bold">{alert.wheelchair_path_obstructions_count} obstructions</span>
                          )}
                          {alert.wheelchair_user_visits_monthly != null && alert.wheelchair_user_visits_monthly > 0 && (
                            <span className="text-xs text-neutral-500">{alert.wheelchair_user_visits_monthly} chair visits/mo</span>
                          )}
                          {alert.has_ada_restroom != null && (
                            <span className={`text-xs ${alert.has_ada_restroom ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_ada_restroom ? 'ADA restroom yes' : 'NO ADA restroom'}</span>
                          )}
                          {alert.ada_restroom_grab_bars_compliant != null && (
                            <span className={`text-xs ${alert.ada_restroom_grab_bars_compliant ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.ada_restroom_grab_bars_compliant ? 'grab bars yes' : 'NO grab bars'}</span>
                          )}
                          {alert.ada_restroom_door_width_in != null && alert.ada_restroom_door_width_in > 0 && (
                            <span className={`text-xs ${alert.ada_restroom_door_width_in < 30 ? 'text-rose-600 font-medium' : alert.ada_restroom_door_width_in < 32 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_restroom_door_width_in}in door</span>
                          )}
                          {alert.ada_restroom_stall_depth_in != null && alert.ada_restroom_stall_depth_in > 0 && (
                            <span className={`text-xs ${alert.ada_restroom_stall_depth_in < 56 ? 'text-rose-600 font-medium' : alert.ada_restroom_stall_depth_in < 60 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_restroom_stall_depth_in}in stall</span>
                          )}
                          {alert.ada_restroom_violation_count != null && alert.ada_restroom_violation_count > 0 && (
                            <span className="text-xs text-red-600 font-bold">{alert.ada_restroom_violation_count} violations!</span>
                          )}
                          {alert.staff_disability_training_pct != null && alert.staff_disability_training_pct >= 0 && (
                            <span className={`text-xs ${alert.staff_disability_training_pct < 25 ? 'text-rose-600 font-medium' : alert.staff_disability_training_pct < 80 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.staff_disability_training_pct}% trained</span>
                          )}
                          {alert.trained_disability_staff_count != null && alert.total_staff_count != null && (
                            <span className="text-xs text-neutral-500">{alert.trained_disability_staff_count}/{alert.total_staff_count} staff</span>
                          )}
                          {alert.disability_customer_satisfaction_score != null && alert.disability_customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.disability_customer_satisfaction_score < 50 ? 'text-rose-600 font-medium' : alert.disability_customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.disability_customer_satisfaction_score}/100 disability sat</span>
                          )}
                          {alert.has_accessible_parking != null && (
                            <span className={`text-xs ${alert.has_accessible_parking ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.has_accessible_parking ? 'parking yes' : 'NO parking'}</span>
                          )}
                          {alert.ada_parking_spaces_count != null && alert.ada_parking_required_spaces != null && (
                            <span className={`text-xs ${alert.ada_parking_spaces_count < alert.ada_parking_required_spaces ? 'text-rose-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_parking_spaces_count}/{alert.ada_parking_required_spaces} spaces</span>
                          )}
                          {alert.ada_parking_signage_compliant != null && (
                            <span className={`text-xs ${alert.ada_parking_signage_compliant ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}`}>{alert.ada_parking_signage_compliant ? 'signage yes' : 'NO signage'}</span>
                          )}
                          {alert.ada_parking_violations_count != null && alert.ada_parking_violations_count > 0 && (
                            <span className="text-xs text-red-600 font-bold">{alert.ada_parking_violations_count} parking violations!</span>
                          )}
                          {alert.ada_compliance_score != null && alert.ada_compliance_score > 0 && (
                            <span className={`text-xs ${alert.ada_compliance_score < 60 ? 'text-rose-600 font-medium' : alert.ada_compliance_score < 85 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_compliance_score}/100 ADA</span>
                          )}
                          {alert.ada_lawsuit_risk_score != null && alert.ada_lawsuit_risk_score > 0 && (
                            <span className={`text-xs ${alert.ada_lawsuit_risk_score > 70 ? 'text-red-600 font-bold' : alert.ada_lawsuit_risk_score > 40 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.ada_lawsuit_risk_score}/100 lawsuit risk</span>
                          )}
                          {alert.disabled_customer_visit_pct != null && alert.disabled_customer_visit_pct > 0 && (
                            <span className="text-xs text-neutral-500">{alert.disabled_customer_visit_pct}% disabled visits</span>
                          )}
                          {alert.disabled_customer_satisfaction_score != null && alert.disabled_customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.disabled_customer_satisfaction_score < 50 ? 'text-rose-600 font-medium' : alert.disabled_customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.disabled_customer_satisfaction_score}/100 disabled sat</span>
                          )}
                          {alert.customer_satisfaction_score != null && alert.customer_satisfaction_score > 0 && (
                            <span className={`text-xs ${alert.customer_satisfaction_score < 60 ? 'text-rose-600 font-medium' : alert.customer_satisfaction_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.customer_satisfaction_score}/100 sat</span>
                          )}
                          {alert.brand_reputation_score != null && alert.brand_reputation_score > 0 && (
                            <span className={`text-xs ${alert.brand_reputation_score < 60 ? 'text-rose-600 font-medium' : alert.brand_reputation_score < 75 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}`}>{alert.brand_reputation_score}/100 brand</span>
                          )}
                          {alert.negative_review_count != null && alert.negative_review_count > 0 && (
                            <span className="text-xs text-rose-600 font-medium">{alert.negative_review_count} neg reviews</span>
                          )}
                          {alert.competitor_accessibility_score != null && alert.competitor_accessibility_score > 0 && (
                            <span className="text-xs text-neutral-500">{alert.competitor_accessibility_score}/100 competitor</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs ${alert.severity === 'critical' ? 'text-rose-600' : alert.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-neutral-500">
                          {alert.large_print_adoption_lift_projected_pct != null && alert.large_print_adoption_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.large_print_adoption_lift_projected_pct}% large print adoption (target)</span>
                          )}
                          {alert.braille_customer_acquisition_projected != null && alert.braille_customer_acquisition_projected > 0 && (
                            <span className="text-emerald-600">+{alert.braille_customer_acquisition_projected} legally blind customers/mo (target)</span>
                          )}
                          {alert.audio_menu_usage_lift_projected_pct != null && alert.audio_menu_usage_lift_projected_pct > 0 && (
                            <span className="text-emerald-600">+{alert.audio_menu_usage_lift_projected_pct}% audio menu usage (target)</span>
                          )}
                          {alert.ada_table_compliance_lift_projected_pts != null && alert.ada_table_compliance_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.ada_table_compliance_lift_projected_pts}pts table compliance (target)</span>
                          )}
                          {alert.wheelchair_path_clearance_lift_projected_pts != null && alert.wheelchair_path_clearance_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.wheelchair_path_clearance_lift_projected_pts}pts path clearance (target)</span>
                          )}
                          {alert.ada_restroom_compliance_lift_projected_pts != null && alert.ada_restroom_compliance_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.ada_restroom_compliance_lift_projected_pts}pts restroom compliance (target)</span>
                          )}
                          {alert.satisfaction_lift_projected_pts != null && alert.satisfaction_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.satisfaction_lift_projected_pts}pts satisfaction (target)</span>
                          )}
                          {alert.brand_reputation_lift_projected_pts != null && alert.brand_reputation_lift_projected_pts > 0 && (
                            <span className="text-emerald-600">+{alert.brand_reputation_lift_projected_pts}pts brand reputation (target)</span>
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
                            <FontAwesomeIcon icon={faUniversalAccess} className="mt-0.5 shrink-0" />
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
          <span>Large print: <span className={config.requireLargePrintMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireLargePrintMenu ? 'required' : 'optional'}</span></span>
          <span>Braille: <span className={config.requireBrailleMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireBrailleMenu ? 'required' : 'optional'}</span></span>
          <span>Audio menu: <span className={config.requireAudioMenu ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAudioMenu ? 'required' : 'optional'}</span></span>
          <span>ADA tables: <span className={config.requireAdaCompliantTables ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAdaCompliantTables ? 'required' : 'optional'}</span></span>
          <span>Wheelchair paths: <span className={config.requireClearWheelchairPaths ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireClearWheelchairPaths ? 'required' : 'optional'}</span></span>
          <span>ADA restroom: <span className={config.requireAdaRestroom ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAdaRestroom ? 'required' : 'optional'}</span></span>
          <span>Staff training: <span className={config.requireStaffDisabilityTraining ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireStaffDisabilityTraining ? 'required' : 'optional'}</span></span>
          <span>Accessible parking: <span className={config.requireAccessibleParking ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>{config.requireAccessibleParking ? 'required' : 'optional'}</span></span>
          <span>Min font size: {config.minLargePrintFontSizePt}pt</span>
          <span>Min staff training %: {config.minStaffDisabilityTrainingPct}</span>
          <span>Min table height %: {config.minAdaTableHeightCompliancePct}</span>
          <span>Min approach clearance: {config.minTableApproachClearanceIn}in</span>
          <span>Min path clear %: {config.minWheelchairPathClearPct}</span>
          <span>Min restroom door: {config.minAdaRestroomDoorWidthIn}in</span>
          <span>Min restroom stall: {config.minAdaRestroomStallDepthIn}in</span>
          <span>Min parking ratio: {config.minAdaParkingSpacesRatio}</span>
          <span>Min ADA compliance: {config.minAdaComplianceScore}</span>
          <span>Max lawsuit risk: {config.maxAdaLawsuitRiskScore}</span>
          <span className="text-neutral-400">198th POSR-exclusive differentiator</span>
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

export default AccessibilityMenuAdaScreen;
