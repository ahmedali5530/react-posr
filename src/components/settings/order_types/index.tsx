import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { OrderType } from "@/api/model/order_type.ts";
import { OrderTypeForm } from "@/components/settings/order_types/order_type.form.tsx";

export const AdminOrderTypes = () => {
  const loadHook = useApi<SettingsData<OrderType>>(Tables.order_types);

  const [data, setData] = useState<OrderType>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<OrderType>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("priority", {
      header: 'Priority'
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

  return (
    <>
      <TableComponent
        columns={columns}
        loaderHook={loadHook}
        loaderLineItems={columns.length}
        buttons={[
          <Button variant="primary" onClick={() => {
            setFormModal(true);
          }} icon={faPlus}> Order type</Button>
        ]}
      />

      <OrderTypeForm
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
