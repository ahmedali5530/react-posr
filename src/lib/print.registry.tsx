import {registerPrintTemplate} from "@/lib/print.service.ts";
import React from "react";
import {PrintPresaleBill} from "@/components/prints/presale.bill.tsx";
import {PrintFinalBill} from "@/components/prints/final.bill.tsx";
import {PrintRefundBill} from "@/components/prints/refund.bill.tsx";
import {Summary} from "@/components/summary/summary.tsx";

export enum PRINT_TYPE {
  presale_bill = 'temp',
  final_bill = 'final',
  refund_bill = 'refund',
  kitchen_bill = 'kitchen',
  delivery_bill = 'delivery',
  summary = 'summary'
}

export function initializePrintTemplates() {
  registerPrintTemplate(PRINT_TYPE.presale_bill, (payload: any) => (
    <PrintPresaleBill order={payload?.order} />
  ));

  registerPrintTemplate(PRINT_TYPE.final_bill, (payload: any) => (
    <PrintFinalBill order={payload?.order} duplicate={payload?.duplicate} />
  ));

  registerPrintTemplate(PRINT_TYPE.refund_bill, (payload: any) => (
    <PrintRefundBill order={payload?.order} originalOrder={payload?.originalOrder} />
  ));

  registerPrintTemplate(PRINT_TYPE.summary, (payload: any) => (
    <Summary {...payload} />
  ));
}



