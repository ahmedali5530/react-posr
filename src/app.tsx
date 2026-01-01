import './assets/css/app.scss';
import 'react-indiana-drag-scroll/dist/style.css'
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {Toaster} from "sonner";
import {Alert} from "./components/common/alert/dialog.tsx";
import {Login} from "@/screens/login.tsx";
import {Menu} from "@/screens/menu";
import React, {useEffect} from "react";
import {PrintProvider} from "@/providers/print.provider.tsx";
import {DatabaseProvider} from "@/providers/database.provider.tsx";
import {DeliveryOrdersProvider} from "@/providers/delivery-orders.provider.tsx";
import {initializePrintTemplates} from "@/lib/print.registry.tsx";
import {Orders} from "@/screens/orders.tsx";
import {Summary} from "@/screens/summary.tsx";
import {Closing} from "@/screens/closing.tsx";
import {KitchenScreen} from "@/screens/kitchen.tsx";
import {Index as Delivery} from "@/screens/delivery/";
import {Admin} from "@/screens/admin";
import {Reports} from "@/screens/reports/";
import {BrowserRouter, Route, Routes} from "react-router";
import {
  ADMIN,
  CLOCK,
  CLOSING,
  DELIVERY,
  INVENTORY,
  KITCHEN,
  MENU,
  ORDERS,
  REPORTS,
  REPORTS_AUDIT,
  REPORTS_CASH_CLOSING,
  REPORTS_DISCOUNTS,
  REPORTS_PRODUCT_HOURLY,
  REPORTS_PRODUCT_LIST,
  REPORTS_PRODUCT_MIX_SUMMARY,
  REPORTS_PRODUCT_MIX_WEEKLY,
  REPORTS_PRODUCT_SUMMARY,
  REPORTS_SALES_ADVANCED,
  REPORTS_SALES_HOURLY_LABOUR,
  REPORTS_SALES_HOURLY_LABOUR_WEEKLY,
  REPORTS_SALES_SERVER,
  REPORTS_SALES_SUMMARY,
  REPORTS_SALES_SUMMARY2,
  REPORTS_SALES_WEEKLY,
  REPORTS_TABLES_SUMMARY,
  REPORTS_VOIDS,
  REPORTS_CURRENT_INVENTORY,
  REPORTS_DETAILED_INVENTORY,
  REPORTS_PURCHASE,
  REPORTS_PURCHASE_RETURN,
  REPORTS_ISSUE,
  REPORTS_ISSUE_RETURN,
  REPORTS_WASTE,
  REPORTS_CONSUMPTION,
  REPORTS_SALE_VS_CONSUMPTION,
  SETTINGS,
  SUMMARY
} from "@/routes/posr.ts";
import {Settings} from "@/screens/settings.tsx";
import {Clock} from "@/screens/clock.tsx";
import {Inventory} from "@/screens/inventory/";
import {ProductMixWeeklyReport} from "@/screens/reports/product.mix.weekly.report.tsx";
import {AuditReport} from "@/screens/reports/audit.report.tsx";
import {CashClosingReport} from "@/screens/reports/cash.closing.report.tsx";
import {DiscountsReport} from "@/screens/reports/discounts.report.tsx";
import {ProductHourlyReport} from "@/screens/reports/product.hourly.report.tsx";
import {ProductListReport} from "@/screens/reports/product.list.report.tsx";
import {ProductMixSummaryReport} from "@/screens/reports/product.mix.summary.report.tsx";
import {ProductSummaryReport} from "@/screens/reports/product.summary.report.tsx";
import {SalesAdvancedReport} from "@/screens/reports/sales.advanced.report.tsx";
import {SalesHourlyLabourReport} from "@/screens/reports/sales.hourly.labour.report.tsx";
import {SalesHourlyLabourWeeklyReport} from "@/screens/reports/sales.hourly.labour.weekly.report.tsx";
import {SalesServerReport} from "@/screens/reports/sales.server.report.tsx";
import {SalesSummaryReport} from "@/screens/reports/sales.summary.report.tsx";
import {SalesSummary2Report} from "@/screens/reports/sales.summary2.report.tsx";
import {SalesWeeklyReport} from "@/screens/reports/sales.weekly.report.tsx";
import {TablesSummaryReport} from "@/screens/reports/tables.summary.report.tsx";
import {VoidsReport} from "@/screens/reports/voids.report.tsx";
import {CurrentInventoryReport} from "@/screens/reports/current.inventory.report.tsx";
import {DetailedInventoryReport} from "@/screens/reports/detailed.inventory.report.tsx";
import {PurchaseReport} from "@/screens/reports/purchase.report.tsx";
import {PurchaseReturnReport} from "@/screens/reports/purchase.return.report.tsx";
import {IssueReport} from "@/screens/reports/issue.report.tsx";
import {IssueReturnReport} from "@/screens/reports/issue.return.report.tsx";
import {WasteReport} from "@/screens/reports/waste.report.tsx";
import {ConsumptionReport} from "@/screens/reports/consumption.report.tsx";
import {SaleVsConsumptionReport} from "@/screens/reports/sale.vs.consumption.report.tsx";


// react query client wrapper
const queryClient = new QueryClient();


// Wrapper for app
function App() {
  // initialize print templates once
  useEffect(() => {
    initializePrintTemplates();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider>
        <DeliveryOrdersProvider>
          <PrintProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path={MENU} element={<Menu/>}/>
                <Route path={ORDERS} element={<Orders/>}/>
                <Route path={SUMMARY} element={<Summary/>}/>
                <Route path={CLOSING} element={<Closing/>}/>
                <Route path={KITCHEN} element={<KitchenScreen/>}/>
                <Route path={DELIVERY} element={<Delivery/>}/>
                <Route path={ADMIN} element={<Admin/>}/>
                <Route path={SETTINGS} element={<Settings/>}/>
                <Route path={CLOCK} element={<Clock/>}/>
                <Route path={INVENTORY} element={<Inventory/>}/>

                <Route path={REPORTS} element={<Reports/>}/>
                <Route path={REPORTS_AUDIT} element={<AuditReport/>}/>
                <Route path={REPORTS_CASH_CLOSING} element={<CashClosingReport/>}/>
                <Route path={REPORTS_DISCOUNTS} element={<DiscountsReport/>}/>
                <Route path={REPORTS_PRODUCT_HOURLY} element={<ProductHourlyReport/>}/>
                <Route path={REPORTS_PRODUCT_LIST} element={<ProductListReport/>}/>
                <Route path={REPORTS_PRODUCT_MIX_SUMMARY} element={<ProductMixSummaryReport/>}/>
                <Route path={REPORTS_PRODUCT_MIX_WEEKLY} element={<ProductMixWeeklyReport/>}/>
                <Route path={REPORTS_PRODUCT_SUMMARY} element={<ProductSummaryReport/>}/>
                <Route path={REPORTS_SALES_ADVANCED} element={<SalesAdvancedReport/>}/>
                <Route path={REPORTS_SALES_HOURLY_LABOUR} element={<SalesHourlyLabourReport/>}/>
                <Route path={REPORTS_SALES_HOURLY_LABOUR_WEEKLY} element={<SalesHourlyLabourWeeklyReport/>}/>
                <Route path={REPORTS_SALES_SERVER} element={<SalesServerReport/>}/>
                <Route path={REPORTS_SALES_SUMMARY} element={<SalesSummaryReport/>}/>
                <Route path={REPORTS_SALES_SUMMARY2} element={<SalesSummary2Report/>}/>
                <Route path={REPORTS_SALES_WEEKLY} element={<SalesWeeklyReport/>}/>
                <Route path={REPORTS_TABLES_SUMMARY} element={<TablesSummaryReport/>}/>
                <Route path={REPORTS_VOIDS} element={<VoidsReport/>}/>
                <Route path={REPORTS_DETAILED_INVENTORY} element={<DetailedInventoryReport/>}/>
                <Route path={REPORTS_CURRENT_INVENTORY} element={<CurrentInventoryReport/>}/>
                <Route path={REPORTS_PURCHASE} element={<PurchaseReport/>}/>
                <Route path={REPORTS_PURCHASE_RETURN} element={<PurchaseReturnReport/>}/>
                <Route path={REPORTS_ISSUE} element={<IssueReport/>}/>
                <Route path={REPORTS_ISSUE_RETURN} element={<IssueReturnReport/>}/>
                <Route path={REPORTS_WASTE} element={<WasteReport/>}/>
                <Route path={REPORTS_CONSUMPTION} element={<ConsumptionReport/>}/>
                <Route path={REPORTS_SALE_VS_CONSUMPTION} element={<SaleVsConsumptionReport/>}/>
              </Routes>
            </BrowserRouter>
          </PrintProvider>
        </DeliveryOrdersProvider>

        <Alert/>
        <Toaster richColors position="top-right" closeButton={true}/>
      </DatabaseProvider>
    </QueryClientProvider>
  );
}

export default App
