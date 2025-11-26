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
import {initializePrintTemplates} from "@/lib/print.registry.tsx";
import {Orders} from "@/screens/orders.tsx";
import {Summary} from "@/screens/summary.tsx";
import {Closing} from "@/screens/closing.tsx";
import {KitchenScreen} from "@/screens/kitchen.tsx";
import {Delivery} from "@/screens/delivery.tsx";
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
  REPORTS_SALES_WEEKLY,
  REPORTS_TABLES_SUMMARY,
  REPORTS_VOIDS,
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
import {SalesWeeklyReport} from "@/screens/reports/sales.weekly.report.tsx";
import {TablesSummaryReport} from "@/screens/reports/tables.summary.report.tsx";
import {VoidsReport} from "@/screens/reports/voids.report.tsx";


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
              <Route path={REPORTS_SALES_WEEKLY} element={<SalesWeeklyReport/>}/>
              <Route path={REPORTS_TABLES_SUMMARY} element={<TablesSummaryReport/>}/>
              <Route path={REPORTS_VOIDS} element={<VoidsReport/>}/>
            </Routes>
          </BrowserRouter>
        </PrintProvider>

        <Alert/>
        <Toaster richColors position="top-right" closeButton={true}/>
      </DatabaseProvider>
    </QueryClientProvider>
  );
}

export default App
