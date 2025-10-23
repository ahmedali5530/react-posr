import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { Kitchen } from "@/api/model/kitchen.ts";
import { KitchenForm } from "@/components/settings/kitchens/kitchen.form.tsx";

export const AdminKitchens = () => {
  const loadHook = useApi<SettingsData<Kitchen>>(Tables.kitchens, [], ['priority asc'], 0, 10, ['items', 'printers']);

  const [data, setData] = useState<Kitchen>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Kitchen>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("printers", {
      header: 'Printers',
      cell: info => info.getValue()?.map(item => <span className="tag" key={item.id}>{item.name}</span>)
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
          }} icon={faPlus}> Kitchen</Button>
        ]}
      />

      <KitchenForm
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
