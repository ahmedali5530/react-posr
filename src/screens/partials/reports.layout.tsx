import { ReactNode, useRef, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import {
  faPrint,
  faFile,
  faRefresh,
  faChevronLeft,
  faChevronRight, faImage,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils.ts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export interface ReportsLayoutProps {
  /** Report title */
  title: string;
  /** Subtitle, typically for date range */
  subtitle?: string;
  /** Restaurant name */
  restaurantName?: string;
  /** Restaurant address */
  restaurantAddress?: string;
  /** Report content */
  children: ReactNode;
  /** Optional pagination props */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  /** Custom action buttons */
  customActions?: ReactNode;
  /** Callback for print action */
  onPrint?: () => void;
  /** Callback for Excel export */
  onExportExcel?: () => void;
  /** Callback for PDF export */
  onExportPdf?: () => void;
  /** Callback for PDF export */
  onExportImage?: () => void;
  /** Callback for refresh action */
  onRefresh?: () => void;
  /** Additional className for the container */
  className?: string;
}

export const ReportsLayout = ({
  title,
  subtitle,
  restaurantName = "Test Restaurant",
  restaurantAddress = "Hawks bay, Seaview",
  children,
  pagination,
  customActions,
  onPrint,
  onExportExcel,
  onExportPdf,
  onExportImage,
  onRefresh,
  className,
}: ReportsLayoutProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [generatedAt] = useState(new Date().toLocaleString());

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print behavior
      window.print();
    }
  };

  const handleExportExcel = async () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Default: Export as CSV (can be opened in Excel)
      const table = reportRef.current?.querySelector("table");
      if(table) {
        // Convert HTML table to SheetJS worksheet
        const ws = XLSX.utils.table_to_sheet(table);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        // Download file
        XLSX.writeFile(wb, "report.xlsx");
      }
    }
  };

  const handleExportPdf = async () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      // Default: Use browser print to PDF
      const element = reportRef.current;

      // render element → canvas
      const canvas = await html2canvas(element, {
        scale: 2,        // better quality
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;

      // convert px → mm
      const imgWidth = pageWidth;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("report.pdf");
    }
  };

  const handleExportImage = async () => {
    if (onExportImage) {
      onExportImage();
    } else {
      const element = reportRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "report.png";
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Default: Reload the page
      window.location.reload();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 p-4 bg-white shadow-sm border-b print:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={handlePrint}
            icon={faPrint}
            size="sm"
          >
            Print
          </Button>
          <Button
            variant="primary"
            onClick={handleExportExcel}
            icon={faFile}
            size="sm"
          >
            Download as XLSX
          </Button>
          <Button
            variant="primary"
            onClick={handleExportPdf}
            icon={faFile}
            size="sm"
          >
            Download as PDF
          </Button>
          <Button
            variant="primary"
            onClick={handleExportImage}
            icon={faImage}
            size="sm"
          >
            Download as Image
          </Button>
          <Button
            variant="primary"
            onClick={handleRefresh}
            icon={faRefresh}
            size="sm"
          >
            Refresh
          </Button>
          {customActions}
        </div>
      </div>

      {/* Report Container */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-full">
          {/* Header Section */}
          <div className="bg-white shadow-sm rounded-lg p-3 mb-3 print:shadow-none text-center">
            <h1 className="text-3xl font-bold mb-1">{title}</h1>
            {subtitle && (
              <p className="text-lg text-gray-600 mb-1">{subtitle}</p>
            )}
            <div className="space-y-[3px] text-sm text-gray-700">
              {restaurantName && (
                <p className="font-semibold">{restaurantName}</p>
              )}
              {restaurantAddress && <p>{restaurantAddress}</p>}
              <p className="text-gray-500 mt-2">
                Generated at: {generatedAt}
              </p>
            </div>
          </div>

          {/* Report Content */}
          <div ref={reportRef} className="bg-white shadow-sm rounded-lg p-6 print:shadow-none">
            {children}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 bg-white shadow-sm rounded-lg p-4">
              <Button
                variant="primary"
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                icon={faChevronLeft}
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 px-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="primary"
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                rightIcon={faChevronRight}
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to convert table to CSV
function tableToCSV(table: HTMLTableElement): string {
  const rows: string[] = [];
  const trs = table.querySelectorAll("tr");

  trs.forEach((tr) => {
    const cells: string[] = [];
    const tds = tr.querySelectorAll("td, th");

    tds.forEach((td) => {
      let text = td.textContent || "";
      // Escape quotes and wrap in quotes if contains comma or quote
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        text = `"${text.replace(/"/g, '""')}"`;
      }
      cells.push(text);
    });

    rows.push(cells.join(","));
  });

  return rows.join("\n");
}

// Helper function to download CSV
function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}