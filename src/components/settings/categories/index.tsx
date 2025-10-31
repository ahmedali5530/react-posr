import { useState } from "react";
import { Tables } from "@/api/db/tables.ts";
import { Category } from "@/api/model/category.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faPencil, faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { CategoryForm } from "@/components/settings/categories/category.form.tsx";
import {DeleteConfirm} from "@/components/common/table/delete.confirm.tsx";
import {useDB} from "@/api/db/db.ts";

export const AdminCategories = () => {
  const loadHook = useApi<SettingsData<Category>>(Tables.categories);
  const db = useDB();

  const [data, setData] = useState<Category>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Category>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("show_in_menu", {
      header: 'Show in menu',
      cell: info => info.getValue() ? <FontAwesomeIcon icon={faCheck} className="text-success-500" /> : <FontAwesomeIcon icon={faTimes} className="text-danger-500" />
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
          <div className="flex gap-3 items-center">
            <Button
              variant="primary"
              onClick={() => {
                setData(info.row.original);
                setFormModal(true);
              }}
            ><FontAwesomeIcon icon={faPencil}/></Button>
            <div className="separator"></div>
            <DeleteConfirm message={`Delete category ${info.row.original.name}`} onConfirm={async () => {
              const items = await db.query(`select count() from ${Tables.dishes} where categories ?= $category group all`, {
                'category': info.row.original.id
              });

              if(items[0].length === 0) {
                await db.delete(info.row.original.id);
                loadHook.fetchData();
              }
            }} />
          </div>
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
          }} icon={faPlus}> Category</Button>
        ]}
      />

      <CategoryForm
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
