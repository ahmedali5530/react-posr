import {Layout} from "@/screens/partials/layout.tsx";
import {ReactNode, useMemo, useState} from "react";
import {SalesWeeklyFilter} from "@/components/reports/filters/sales.weekly.filter.tsx";
import {ProductMixWeeklyReportFilter} from "@/components/reports/filters/product.mix.weekly.filter.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCheckCircle, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {AuditFilter} from "@/components/reports/filters/audit.filter.tsx";
import {CashClosingFilter} from "@/components/reports/filters/cash.closing.filter.tsx";
import {DiscountsFilter} from "@/components/reports/filters/discounts.filter.tsx";
import {SalesHourlyLabourFilter} from "@/components/reports/filters/sales.hourly.labour.filter.tsx";
import {SalesHourlyLabourWeeklyFilter} from "@/components/reports/filters/sales.hourly.labour.weekly.filter.tsx";
import {SalesServerFilter} from "@/components/reports/filters/sales.server.filter.tsx";
import {SalesSummaryFilter} from "@/components/reports/filters/sales.summary.filter.tsx";
import {ProductMixSummaryFilter} from "@/components/reports/filters/product.mix.summary.filter.tsx";
import {ProductHourlyFilter} from "@/components/reports/filters/product.hourly.filter.tsx";
import {ProductListFilter} from "@/components/reports/filters/product.list.filter.tsx";
import {ProductSummaryFilter} from "@/components/reports/filters/product.summary.filter.tsx";
import {VoidsFilter} from "@/components/reports/filters/voids.filter.tsx";
import {TableSummaryFilter} from "@/components/reports/filters/table.summary.filter.tsx";
import {SalesAdvancedFilter} from "@/components/reports/filters/sales.advanced.filter.tsx";
import {SalesSummary2Filter} from "@/components/reports/filters/sales.summary2.filter.tsx";
import {CurrentInventoryFilter} from "@/components/reports/filters/current.inventory.filter.tsx";
import {DetailedInventoryFilter} from "@/components/reports/filters/detailed.inventory.filter.tsx";
import {PurchaseFilter} from "@/components/reports/filters/purchase.filter.tsx";
import {PurchaseReturnFilter} from "@/components/reports/filters/purchase.return.filter.tsx";
import {IssueFilter} from "@/components/reports/filters/issue.filter.tsx";
import {IssueReturnFilter} from "@/components/reports/filters/issue.return.filter.tsx";
import {WasteFilter} from "@/components/reports/filters/waste.filter.tsx";
import {ConsumptionFilter} from "@/components/reports/filters/consumption.filter.tsx";
import {SaleVsConsumptionFilter} from "@/components/reports/filters/sale.vs.consumption.filter.tsx";

export const Reports = () => {
  const reportCategories = useMemo(() => {
    return {
      // "Audit": {
      //   "Audit": <AuditFilter />
      // },
      // "Cash closing": {
      //   "Cash closing": <CashClosingFilter />
      // },
      "Sales": {
        "Sales Hourly Labour": <SalesHourlyLabourFilter />,
        "Sales Hourly Labour Weekly": <SalesHourlyLabourWeeklyFilter />,
        "Server Sales": <SalesServerFilter />,
        "Sales Summary": <SalesSummaryFilter />,
        "Sales Summary 2": <SalesSummary2Filter />,
        "Sales Weekly": <SalesWeeklyFilter />,
        "Advanced Sales": <SalesAdvancedFilter />,
        // "Discounts": <DiscountsFilter />,
        "Voids": <VoidsFilter />,
        // "Tables": <TableSummaryFilter />
      },
      "Products": {
        "Product Mix Weekly": <ProductMixWeeklyReportFilter/>,
        "Product Mix summary": <ProductMixSummaryFilter />,
        "Products Hourly": <ProductHourlyFilter />,
        // "Products list": <ProductListFilter />,
        "Products Summary": <ProductSummaryFilter />
      },
      "Inventory": {
        "Current Inventory": <CurrentInventoryFilter />,
        "Detailed Inventory": <DetailedInventoryFilter />,
        "Purchase": <PurchaseFilter />,
        "Purchase Return": <PurchaseReturnFilter />,
        "Issue": <IssueFilter />,
        "Issue Return": <IssueReturnFilter />,
        "Waste": <WasteFilter />,
        "Consumption": <ConsumptionFilter />,
        "Sale vs Inventory": <SaleVsConsumptionFilter />,
      }
    };
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategory, setSubCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [filter, setFilter] = useState<ReactNode>();

  return (
    <Layout containerClassName="p-5">
      <div className="grid grid-cols-9 gap-5">
        <div className="col-span-2">
          <div className="bg-white shadow py-5 rounded-lg">
            <h1 className="text-xl text-gray-600 px-5">Reports</h1>
            <div className="py-5">
              <ul>
                {Object.keys(reportCategories).map((key) => (
                  <li
                    className="border-b py-2 px-5 flex justify-between cursor-pointer hover:bg-gray-100 items-center"
                    onClick={() => {
                      setSelectedCategory(key);
                      setSubCategory(reportCategories[key]);
                    }}
                    key={key}
                  >
                    {key}
                    {selectedCategory === key && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-success-700" size="lg" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white shadow py-5 rounded-lg">
            <h1 className="text-xl text-gray-600 px-5">Sub reports</h1>
            <div className="py-5">
              <ul>
                {Object.keys(subCategory).map((key) => (
                  <li
                    className="border-b py-2 px-5 flex justify-between cursor-pointer hover:bg-gray-100 items-center"
                    onClick={() => {
                      setSelectedSubCategory(key);
                      setFilter(subCategory[key]);
                    }}
                    key={key}
                  >
                    {key}
                    {selectedSubCategory === key && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-success-700" size="lg" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-5">
          <div className="bg-white shadow p-5 rounded-lg">
            <h1 className="text-xl">
              {selectedCategory && selectedSubCategory ? (
                <span className="text-gray-600">{selectedCategory} <FontAwesomeIcon icon={faChevronRight} size="xs" /> {selectedSubCategory}</span>
              ) : 'Report filters'}
            </h1>
            <div className="py-5">
              {filter && filter}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}
