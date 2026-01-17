import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { Printer } from "@/api/model/printer.ts";
import { PrinterForm } from "@/components/settings/printers/printer.form.tsx";

export const AdminPrinters = () => {
  const loadHook = useApi<SettingsData<Printer>>(Tables.printers, [], ['priority asc']);

  const [data, setData] = useState<Printer>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Printer>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("type", {
      header: 'Type'
    }),
    columnHelper.accessor("ip_address", {
      header: 'Path'
    }),
    columnHelper.accessor("port", {
      header: 'Port'
    }),
    // columnHelper.accessor("priority", {
    //   header: 'Priority'
    // }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        return (
          <>
            <Button
              variant="primary"
              onClick={() => {
                setData(info.row.original);
                setFormModal(true);
              }}
            ><FontAwesomeIcon icon={faPencil}/></Button>
          </>
        );
      },
    }),
  ];

  return (
    <>
      <TableComponent
        columns={columns}
        loaderHook={loadHook}
        loaderLineItems={columns.length}
        buttons={[
          <Button variant="primary" onClick={() => {
            setFormModal(true);
          }} icon={faPlus}> Printer</Button>
        ]}
      />

      <PrinterForm
        open={formModal}
        data={data}
        onClose={() => {
          setFormModal(false);
          setData(undefined);
          loadHook.fetchData();
        }}
      />
    </>
  )
}
