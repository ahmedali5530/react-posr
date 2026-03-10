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
import { TabList, Tabs } from "react-aria-components";
import { Tab, TabPanel } from "@/components/common/react-aria/tabs";
import { AdminUserRoles } from "@/components/settings/users/roles";
import { AdminShifts } from "@/components/settings/users/shifts";
import { shiftDisplayTime } from "@/lib/shift.utils.ts";
import { AdminTipDistribution } from "@/components/settings/users/tip_distribution";

const AdminUsersList = () => {
  const loadHook = useApi<SettingsData<User>>(Tables.users, [], [], 0, 10, ["user_role", "user_shift"]);

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
    columnHelper.accessor("user_role", {
      header: 'Role',
      enableColumnFilter: false,
      cell: info => {
        const role = info.getValue();
        return role ? <span className="tag mr-2">{role?.name}</span> : '-';
      }
    }),
    columnHelper.accessor("user_shift", {
      header: 'Shift',
      enableColumnFilter: false,
      cell: info => {
        const shift = info.getValue();
        return shift ? <span className="tag mr-2">{shift.name} ({shiftDisplayTime(shift)})</span> : '-';
      }
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

export const AdminUsers = () => {
  return (
    <Tabs className="w-full flex flex-col" defaultSelectedKey="users">
      <TabList aria-label="Manage users tabs" className="flex gap-3 p-3 bg-white border-b border-neutral-200">
        <Tab id="users">Users</Tab>
        <Tab id="roles">Roles</Tab>
        <Tab id="shifts">Shifts</Tab>
        <Tab id="tip_distribution">Tip distribution</Tab>
      </TabList>
      <TabPanel id="users" className="bg-white">
        <AdminUsersList />
      </TabPanel>
      <TabPanel id="roles" className="bg-white">
        <AdminUserRoles />
      </TabPanel>
      <TabPanel id="shifts" className="bg-white">
        <AdminShifts />
      </TabPanel>
      <TabPanel id="tip_distribution" className="bg-white">
        <AdminTipDistribution />
      </TabPanel>
    </Tabs>
  );
};
