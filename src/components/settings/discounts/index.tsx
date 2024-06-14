import { useState } from "react";
import { Tables } from "@/api/db/tables.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { Discount } from "@/api/model/discount.ts";
import { DiscountForm } from "@/components/settings/discounts/discount.form.tsx";

export const AdminDiscounts = () => {
  const loadHook = useApi<SettingsData<Discount>>(Tables.discounts);

  const [data, setData] = useState<Discount>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Discount>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name',

    }),
    columnHelper.accessor("min_rate", {
      header: 'Min Rate'
    }),
    columnHelper.accessor("max_rate", {
      header: 'Max Rate'
    }),
    columnHelper.accessor("max_cap", {
      header: 'Max Discount Cap'
    }),
    columnHelper.accessor("type", {
      header: 'Type'
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
          }} icon={faPlus}> Discount</Button>
        ]}
      />

      <DiscountForm
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
