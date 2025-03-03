import {Index} from "./screens";
import './assets/css/app.scss';
import 'react-indiana-drag-scroll/dist/style.css'
import {connect} from "@/api/db/db.ts";
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {Toaster} from "sonner";
import React from "react";
import {Alert} from "./components/common/alert/dialog.tsx";

// connect to surrealDB via websocket
console.log('connecting to database');
connect();

// react query client wrapper
const queryClient = new QueryClient();

// Wrapper for app
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Index/>
      <Alert/>
      <Toaster richColors position="top-right" closeButton={true}/>
    </QueryClientProvider>
  );
}

export default App
