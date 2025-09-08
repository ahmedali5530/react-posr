import {registerPrintTemplate} from "@/lib/print.service.ts";
import React from "react";
import {PrintPresaleBill} from "@/components/prints/presale.bill.tsx";
import {PrintFinalBill} from "@/components/prints/final.bill.tsx";
import {Summary} from "@/components/summary/summary.tsx";

export enum PRINT_TYPE {
  presale_bill = 'presale.bill',
  final_bill = 'final.bill',
  summary = 'summary'
}

export function initializePrintTemplates() {
  registerPrintTemplate(PRINT_TYPE.presale_bill, (payload: any) => (
    <PrintPresaleBill order={payload?.order} />
  ));

  registerPrintTemplate(PRINT_TYPE.final_bill, (payload: any) => (
    <PrintFinalBill order={payload?.order} duplicate={payload?.duplicate} />
  ));

  registerPrintTemplate(PRINT_TYPE.summary, (payload: any) => (
    <Summary {...payload} />
  ));
}



