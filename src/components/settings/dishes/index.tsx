import { useState } from "react";
import { Dish } from "@/api/model/dish.ts";
import { Tables } from "@/api/db/tables.ts";
import { Button } from "@/components/common/input/button.tsx";
import { DishForm } from "@/components/settings/dishes/dish.form.tsx";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { createColumnHelper } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { TableComponent } from "@/components/common/table/table.tsx";

export const AdminDishes = () => {
  const loadHook = useApi<SettingsData<Dish>>(Tables.dishes, [], [], 0, 10, ['categories']);

  const [data, setData] = useState<Dish>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Dish>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("number", {
      header: 'Number',
    }),
    // columnHelper.accessor("position", {
    //   header: 'Position'
    // }),
    columnHelper.accessor("priority", {
      header: 'Priority'
    }),
    columnHelper.accessor("price", {
      header: 'Sale price'
    }),
    columnHelper.accessor("cost", {
      header: 'Cost price'
    }),
    columnHelper.accessor("categories", {
      header: 'Categories',
      cell: info => info.getValue().map((item, index) => <span className="tag mr-2" key={index}>{item.name}</span>)
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
          }} icon={faPlus}> Dish</Button>
        ]}
      />

      <DishForm
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
