import {createRoot} from "react-dom/client";

export const usePrint = (children: any) => {
  const printWindow: any = window.open('','', 'height: 500;width:500');

  const container = printWindow.document.body;
  const root = createRoot(container);
  root.render(children);

  printWindow.document.close();

  printWindow.focus();
  // printWindow.print();
  // printWindow.close();
}