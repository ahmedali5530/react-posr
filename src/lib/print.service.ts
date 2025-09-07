import React from "react";

export const PRINT_EVENT = 'posr:print';

export type PrintEventDetail<Payload = any> = {
  template: string;
  payload: Payload;
  title?: string;
  copies?: number;
};

export type PrintTemplateRenderer<Payload = any> = (payload: Payload) => React.ReactElement;

// Simple in-memory registry for print templates
const templateRegistry: Record<string, PrintTemplateRenderer<any>> = {};

export function registerPrintTemplate<Payload = any>(
  name: string,
  renderer: PrintTemplateRenderer<Payload>
): void {
  templateRegistry[name] = renderer as PrintTemplateRenderer<any>;
}

export function getPrintTemplate(name: string): PrintTemplateRenderer<any> | undefined {
  return templateRegistry[name];
}

export function dispatchPrint<Payload = any>(
  template: string,
  payload: Payload,
  options?: { title?: string; copies?: number }
): void {
  const eventDetail: PrintEventDetail<Payload> = {
    template,
    payload,
    title: options?.title,
    copies: options?.copies ?? 1,
  };

  window.dispatchEvent(new CustomEvent<PrintEventDetail<Payload>>(PRINT_EVENT, { detail: eventDetail } as any));
}



