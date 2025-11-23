import { ReactNode, useRef, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faDownload,
  faFile,
  faRefresh,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils.ts";

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
  /** Callback for refresh action */
  onRefresh?: () => void;
  /** Additional className for the container */
  className?: string;
}

export const ReportsLayout = ({
  title,
  subtitle,
  restaurantName,
  restaurantAddress,
  children,
  pagination,
  customActions,
  onPrint,
  onExportExcel,
  onExportPdf,
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

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Default: Export as CSV (can be opened in Excel)
      const table = reportRef.current?.querySelector("table");
      if (table) {
        const csv = tableToCSV(table);
        downloadCSV(csv, `${title.replace(/\s+/g, "_")}_${Date.now()}.csv`);
      }
    }
  };

  const handleExportPdf = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      // Default: Use browser print to PDF
      handlePrint();
    }
  };

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
      <div className="flex items-center justify-between gap-3 p-4 bg-white shadow-sm border-b">
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
        <div className="max-w-full p-6">
          {/* Header Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6 print:shadow-none">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && (
              <p className="text-lg text-gray-600 mb-4">{subtitle}</p>
            )}
            <div className="space-y-1 text-sm text-gray-700">
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

