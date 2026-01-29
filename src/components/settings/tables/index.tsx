import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "@/api/model/table.ts";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faLock, faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { TableForm } from "@/components/settings/tables/table.form.tsx";
import { useDB } from "@/api/db/db.ts";

export const AdminTables = () => {
  const loadHook = useApi<SettingsData<Table>>(Tables.tables, [], [], 0, 10, ['floor', 'categories', 'payment_types', 'order_types']);
  const db = useDB();

  const [data, setData] = useState<Table>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Table>();
  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("number", {
      header: 'Number'
    }),
    columnHelper.accessor("ask_for_covers", {
      header: 'Ask for number of covers',
      cell: info => info.getValue() ? <FontAwesomeIcon icon={faCheck} className="text-success-500" /> : null,
      enableColumnFilter: false
    }),
    columnHelper.accessor("floor", {
      header: 'Floor',
      cell: info => info.getValue()?.name
    }),
    columnHelper.accessor('payment_types', {
      header: 'Payment types',
      cell: info => info.getValue()?.map((paymentType, index) => <span className="tag mr-2" key={index}>{paymentType.name}</span>),
      enableColumnFilter: false,
      enableSorting: false
    }),
    columnHelper.accessor('order_types', {
      header: 'Order types',
      cell: info => info.getValue()?.map((orderType, index) => <span className="tag mr-2" key={index}>{orderType.name}</span>),
      enableColumnFilter: false,
      enableSorting: false
    }),
    columnHelper.accessor("priority", {
      header: 'Priority'
    }),
    columnHelper.accessor("is_locked", {
      header: 'Locked',
      cell: info => info.getValue() ? <FontAwesomeIcon icon={faLock} title="Click to unlock it" className="text-danger-500 cursor-pointer" onClick={() => releaseTable(info.row.original.id)} /> : null,
      enableColumnFilter: false,
      enableSorting: false
    }),
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

  const releaseTable = async (id: string) => {
    await db.merge(id, {
      is_locked: false
    });

    loadHook.fetchData();
  }

  return (
    <>
      <TableComponent
        columns={columns}
        loaderHook={loadHook}
        loaderLineItems={columns.length}
        buttons={[
          <Button variant="primary" onClick={() => {
            setFormModal(true);
          }} icon={faPlus}> Table</Button>
        ]}
      />

      {formModal && (
        <TableForm
          open={formModal}
          data={data}
          onClose={() => {
            setFormModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
        />
      )}

    </>
  )
}
