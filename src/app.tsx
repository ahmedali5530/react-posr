import './assets/css/app.scss';
import 'react-indiana-drag-scroll/dist/style.css'
import {connect} from "@/api/db/db.ts";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {Toaster} from "sonner";
import {Alert} from "./components/common/alert/dialog.tsx";
import {Login} from "@/screens/login.tsx";
import {Menu} from "@/screens/menu";
import React, {useEffect} from "react";
import {PrintProvider} from "@/providers/print.provider.tsx";
import {initializePrintTemplates} from "@/lib/print.registry.tsx";
import {Orders} from "@/screens/orders.tsx";
import {Summary} from "@/screens/summary.tsx";
import {Closing} from "@/screens/closing.tsx";
import {KitchenScreen} from "@/screens/kitchen.tsx";
import {Delivery} from "@/screens/delivery.tsx";
import {Admin} from "@/screens/admin";
import {Reports} from "@/screens/reports.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import {ADMIN, CLOSING, DELIVERY, INVENTORY, KITCHEN, MENU, ORDERS, REPORTS, SETTINGS, SUMMARY} from "@/routes/posr.ts";
import {Settings} from "@/screens/settings.tsx";
import {Inventory} from "@/screens/inventory/";


// connect to surrealDB via websocket
console.log('connecting to database');
connect();

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
              <Route path={REPORTS} element={<Reports/>}/>
              <Route path={ADMIN} element={<Admin/>}/>
              <Route path={SETTINGS} element={<Settings/>}/>
              <Route path={INVENTORY} element={<Inventory/>}/>
            </Routes>
          </BrowserRouter>
        </PrintProvider>

        <Alert/>
        <Toaster richColors position="top-right" closeButton={true}/>
      </QueryClientProvider>
  );
}

export default App
