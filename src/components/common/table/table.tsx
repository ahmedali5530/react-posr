import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { FC, ReactNode, useEffect, useState, } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRefresh, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/common/input/input.tsx";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import { Loader } from "@/components/common/loader/loader.tsx";
import { UseApiResult } from "@/api/db/use.api.ts";

interface ButtonProps {
  title?: ReactNode;
  html: ReactNode;
}

interface TableComponentProps {
  columns: any;
  sort?: SortingState;
  buttons?: ReactNode[];
  // selectionButtons?: ButtonProps[];
  enableSearch?: boolean;
  loaderHook: UseApiResult;
  loaderLines?: number
  loaderLineItems?: number
}

export const TableComponent: FC<TableComponentProps> = ({
  columns,
  buttons,
  enableSearch,
  loaderHook,
  loaderLines, loaderLineItems
}) => {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);
  useEffect(() => {
    if( sorting.length === 1 && sorting[0]?.id !== '' ) {
      handleSortChange!([`${sorting[0].id} ${sorting[0].desc === true ? 'DESC' : 'ASC'}`]);
    } else {
      handleSortChange!([]);
    }
  }, [sorting]);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  useEffect(() => {
    handlePageChange!(pageIndex * pageSize);
    handleLimitChange!(pageSize);
  }, [pageIndex, pageSize]);

  const [rowSelection, setRowSelection] = React.useState({});

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const {
    data,
    handlePageChange,
    handleFilterChange,
    handleParameterChange,
    filters,
    handlePageSizeChange: handleLimitChange,
    handleSortChange,
    fetchData,
    resetFilters,
    isLoading
  } = loaderHook;

  const total = data?.total || 0;

  const table = useReactTable({
    data: data?.data || [], //data.data[0],
    pageCount: Math.ceil(total / pageSize), // total pages
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      pagination,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    enableMultiSort: false,
    manualSorting: true,
    manualFiltering: true,
  });

  // const ids = useMemo(() => {
  // return table.getSelectedRowModel().rows.map(item => (item.original as any).uuid)

  // return [];
  // }, [rowSelection]);

  // const renderButton = (button: ButtonProps) => {
  //   if( button.html ) {
  //     return button.html;
  //   }
  // };

  const pageSizes: { [key: string | number]: any } = {
    10: 10,
    20: 20,
    25: 25,
    50: 50,
    100: 100,
  };

  const {
    handleSubmit,
    control,
    setValue
  } = useForm();

  const filterOptions = table
    .getAllColumns()
    .filter((column) => column.getCanFilter())
    .map((column) => ({ label: column.columnDef.header, value: column.id }));

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if( !loaded ) {
      setValue("column", filterOptions[0]); // set first column as default
      setLoaded(true);
    }
  }, [table.getAllColumns()]);

  const handleColumnFilter = (values: any) => {
    if( values.value && values.value.trim() !== '' ) {
      handleFilterChange([
        `string::startsWith(string::lowercase($this[$column]), $value)`
      ]);
      handleParameterChange({
        'column': values.column.value,
        'value': values.value
      });
    } else {
      handleFilterChange([]);
    }
  };

  return (
    <>
      <div className="my-5 flex justify-between">
        <div className="inline-flex justify-start">
          {enableSearch !== false && (
            <form
              className="flex gap-3"
              onSubmit={handleSubmit(handleColumnFilter)}>
              <Controller
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search..."
                    type="search"
                  />
                )}
                name="value"
                control={control}
              />

              <Controller
                name="column"
                render={({ field }) => (
                  <ReactSelect
                    onChange={field.onChange}
                    options={filterOptions}
                    className="w-72"
                    value={field.value}
                  />
                )}
                control={control}
              />
              <button className="btn btn-primary w-12" type="submit">
                <FontAwesomeIcon icon={faSearch}/>
              </button>
              {Object.keys(filters).length > 0 && (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    resetFilters()
                    setValue('value', undefined)
                  }}>
                  <FontAwesomeIcon icon={faClose}/>
                </button>
              )}
            </form>
          )}
        </div>
        <div className="inline-flex justify-end">
          <div className="flex gap-3">
            <button className="btn btn-primary w-12" onClick={fetchData}>
              <FontAwesomeIcon icon={faRefresh}/>
            </button>
            {Object.keys(rowSelection).length > 0 && (
              <>
                {/*{selectionButtons?.map((button) => (*/}
                {/*  <>{button}</>*/}
                {/*))}*/}
              </>
            )}
            <>
              {buttons?.map((button, buttonIdx) => (
                <React.Fragment key={buttonIdx}>{button}</React.Fragment>
              ))}
            </>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table
          className={classNames(
            "table table-hover table-background table-sm",
            isLoading && "table-fixed"
          )}>
          <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={Math.random() + headerGroup.id}
              id={Math.random() + headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ▲",
                      desc: " ▼",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={table.getFlatHeaders().length}>
                <div className="flex justify-center items-center">
                  <Loader
                    lines={loaderLines || 10}
                    lineItems={loaderLineItems || 5}
                  />
                </div>
              </td>
            </tr>
          ) : (
            <>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={Math.random() + cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <nav className="input-group">
          <button
            className="btn btn-primary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            {"<<"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            {"<"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            {">"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            {">>"}
          </button>
        </nav>
        &bull;
        <span className="flex items-center gap-1">
          <div>{t("Page")}</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
            {table.getPageCount()}
          </strong>
        </span>
        &bull; <span>{t("Go to page")}</span>
        <span className="flex items-center gap-2">
          <select
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              table.setPageIndex(Number(e.target.value) - 1);
            }}
            className="w-auto form-control">
            {_.range(0, table.getPageCount()).map((pageSize) => (
              <option key={pageSize} value={pageSize + 1}>
                {pageSize + 1}
              </option>
            ))}
          </select>
        </span>
        &bull;
        <span className="flex items-center gap-2">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="w-auto form-control">
            {Object.keys(pageSizes).map((pageSize: string | number) => (
              <option key={pageSize} value={pageSizes[pageSize]}>
                {t("Show")} {pageSize}
              </option>
            ))}
          </select>{" "}
          &bull; <span>{t("Total records")}</span>{" "}
          <strong>{total}</strong>
        </span>
      </div>
    </>
  );
};
