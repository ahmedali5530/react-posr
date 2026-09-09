/**
 * AI Feature Hub — unified search and discovery for all 312 POSR reports.
 * Lets users find any report by keyword, browse by category, and see
 * which reports exist across the 13 categories.
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/screens/partials/layout.tsx";
import { DocumentTitle } from "@/components/common/document-title.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faChartLine, faUtensils, faUsers, faDollarSign,
  faBoxesStacked, faFire, faTruckFast, faHeart, faBullhorn,
  faShieldHalved, faBuilding, faCashRegister, faChartBar,
  faLayerGroup, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FEATURE_HUB_REPORTS, FEATURE_HUB_CATEGORIES, type FeatureHubReport } from "@/lib/feature-hub-data.ts";

const ICON_MAP: Record<string, any> = {
  chartLine: faChartLine,
  utensils: faUtensils,
  users: faUsers,
  dollarSign: faDollarSign,
  boxesStacked: faBoxesStacked,
  fire: faFire,
  truckFast: faTruckFast,
  heart: faHeart,
  bullhorn: faBullhorn,
  shieldHalved: faShieldHalved,
  building: faBuilding,
  cashRegister: faCashRegister,
  chartBar: faChartBar,
};

export function FeatureHubScreen() {
  const { t } = useTranslation(["reports", "common"]);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = FEATURE_HUB_REPORTS;
    if (activeCategory) {
      list = list.filter(r => r.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, FeatureHubReport[]>();
    for (const r of filtered) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const handleOpen = useCallback((path: string) => {
    navigate(`/reports/${path}`);
  }, [navigate]);

  const totalReports = FEATURE_HUB_REPORTS.length;
  const totalCategories = FEATURE_HUB_CATEGORIES.length;

  return (
    <Layout>
      <DocumentTitle parts={["AI Feature Hub", t('reports:title', { defaultValue: 'Reports' })]} />
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faLayerGroup} className="text-violet-600" />
              AI Feature Hub
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Search and discover all {totalReports} POSR reports across {totalCategories} categories.
              Find any feature by keyword — from AI forecasting to staff scheduling, menu engineering to compliance.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 312 reports by name, keyword, or category…"
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? "bg-violet-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All ({totalReports})
          </button>
          {FEATURE_HUB_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.name
                  ? "bg-violet-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-xs text-neutral-500">
          Showing <span className="font-semibold text-neutral-700">{filtered.length}</span> of {totalReports} reports
          {activeCategory && <> in <span className="font-semibold text-violet-600">{activeCategory}</span></>}
          {query && <> matching "<span className="font-semibold text-neutral-700">{query}</span>"</>}
        </div>

        {/* Grouped results */}
        {grouped.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
            <FontAwesomeIcon icon={faSearch} className="text-4xl mb-3" />
            <p className="font-medium">No reports found</p>
            <p className="text-sm mt-1">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([category, reports]) => {
              const iconKey = reports[0]?.icon ?? "chartBar";
              const icon = ICON_MAP[iconKey] ?? faChartBar;
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={icon} className="text-violet-600" />
                    <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
                      {category}
                    </h2>
                    <span className="text-xs text-neutral-400">({reports.length})</span>
                    <div className="flex-1 border-b border-neutral-200 ml-2" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {reports.map((report) => (
                      <button
                        key={report.name}
                        onClick={() => handleOpen(report.path)}
                        className="group flex items-center justify-between gap-2 p-3 bg-white border border-neutral-200 rounded-lg hover:border-violet-400 hover:shadow-md transition-all text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-neutral-800 truncate group-hover:text-violet-700">
                            {report.title}
                          </div>
                          <div className="text-xs text-neutral-400 truncate">
                            /{report.path}
                          </div>
                        </div>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-neutral-300 group-hover:text-violet-600 transition-colors shrink-0"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FeatureHubScreen;
