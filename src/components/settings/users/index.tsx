import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { User } from "@/api/model/user.ts";
import { UserForm } from "@/components/settings/users/user.form.tsx";

export const AdminUsers = () => {
  const loadHook = useApi<SettingsData<User>>(Tables.users);

  const [data, setData] = useState<User>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<User>();

  const columns: any = [
    columnHelper.accessor("first_name", {
      header: 'First name'
    }),
    columnHelper.accessor("last_name", {
      header: 'Last name'
    }),
    columnHelper.accessor("login", {
      header: 'Login'
    }),
    columnHelper.accessor("roles", {
      header: 'Roles',
      cell: info => info.getValue().map((item, index) => <span className="tag mr-2" key={index}>{item}</span>)
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
          }} icon={faPlus}> User</Button>
        ]}
      />

      <UserForm
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
