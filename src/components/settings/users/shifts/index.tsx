import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { Shift } from "@/api/model/shift.ts";
import { Button } from "@/components/common/input/button.tsx";
import { TableComponent } from "@/components/common/table/table.tsx";
import { ShiftForm } from "@/components/settings/users/shifts/shift.form.tsx";
import { shiftDisplayTime } from "@/lib/shift.utils.ts";

export const AdminShifts = () => {
  const loadHook = useApi<SettingsData<Shift>>(Tables.shifts, [], ["name asc"]);
  const [data, setData] = useState<Shift>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Shift>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("start_time", {
      header: "Shift hours",
      enableColumnFilter: false,
      cell: (info) => shiftDisplayTime(info.row.original),
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => (
        <Button
          variant="primary"
          onClick={() => {
            setData(info.row.original);
            setFormModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPencil} />
        </Button>
      ),
    }),
  ];

  return (
    <>
      <TableComponent
        columns={columns}
        loaderHook={loadHook}
        loaderLineItems={columns.length}
        buttons={[
          <Button
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Shift
          </Button>,
        ]}
      />
      <ShiftForm
        open={formModal}
        data={data}
        onClose={() => {
          setFormModal(false);
          setData(undefined);
          loadHook.fetchData();
        }}
      />
    </>
  );
};
