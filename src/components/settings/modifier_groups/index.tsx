import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { ModifierGroup } from "@/api/model/modifier_group.ts";
import { ModifierGroupForm } from "@/components/settings/modifier_groups/modifier_group.form.tsx";

export const AdminModifierGroups = () => {
  const loadHook = useApi<SettingsData<ModifierGroup>>(Tables.modifier_groups, [], ['priority asc'], 0, 10, ['modifiers', 'modifiers.modifier']);

  const [data, setData] = useState<ModifierGroup>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<ModifierGroup>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("modifiers", {
      header: 'Modifiers',
      cell: info => info.getValue().map((item, index) => <span className="tag mr-2" key={index}>{item.modifier.name}</span>),
      enableSorting: false
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
          }} icon={faPlus}> Modifier group</Button>
        ]}
      />

      <ModifierGroupForm
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
