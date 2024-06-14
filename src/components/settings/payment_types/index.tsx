import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { PaymentType } from "@/api/model/payment_type.ts";
import { TableComponent } from "@/components/common/table/table.tsx";
import { PaymentTypeForm } from "@/components/settings/payment_types/payment_type.form.tsx";

export const AdminPaymentTypes = () => {
  const loadHook = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], ['priority asc'], 0, 10, ['tax', 'discounts']);

  const [data, setData] = useState<PaymentType>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<PaymentType>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("type", {
      header: 'Type'
    }),
    columnHelper.accessor("tax", {
      header: 'Tax',
      cell: info => info.getValue() && <span className="tag">{info.getValue()?.name} {info.getValue()?.rate}%</span>
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
          }} icon={faPlus}> Payment type</Button>
        ]}
      />

      <PaymentTypeForm
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
