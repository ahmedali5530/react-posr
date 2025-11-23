import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryIssueReturn} from "@/api/model/inventory_issue_return.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import {InventoryIssueReturnForm} from "@/components/inventory/issue_returns/form.tsx";

export const InventoryIssueReturns = () => {
  const loadHook = useApi<SettingsData<InventoryIssueReturn>>(
    Tables.inventory_issue_returns,
    [],
    ["created_at DESC"],
    0,
    10,
    ["issuance", "issuance.items", "issuance.items.item", "issued_to", "kitchen", "items", "items.item", "items.issued_item"]
  );

  const [data, setData] = useState<InventoryIssueReturn>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryIssueReturn>();

  const columns: any = [
    columnHelper.accessor(row => row.issuance?.invoice_number ?? "", {
      id: "invoice_number",
      header: "Return#"
    }),
    columnHelper.accessor(row => row.issuance?.invoice_number ?? "", {
      id: "issuance",
      header: "Issuance"
    }),
    columnHelper.accessor("created_at", {
      header: "Created at",
      cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ""
    }),
    columnHelper.accessor('issued_to', {
      id: "issued_to",
      header: "Issued to",
      cell: info => `${info.getValue()?.first_name} ${info.getValue()?.last_name}`
    }),
    columnHelper.accessor(row => row.kitchen?.name ?? "", {
      id: "kitchen",
      header: "Kitchen"
    }),
    columnHelper.accessor("items", {
      header: "Items",
      cell: info => (
        <div className="flex flex-wrap gap-2">
          {info.getValue()?.slice(0, 5)?.map((item, index) => (
            <span key={item.id ?? index} className="tag">
              {item.item?.name}-{item.item?.code} × {item.quantity}
            </span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        return (
          <Button
            variant="primary"
            onClick={() => {
              setData(info.row.original);
              setFormModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPencil}/>
          </Button>
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
          <Button
            key="issue-return-create"
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Issue return
          </Button>
        ]}
      />

      {formModal && (
        <InventoryIssueReturnForm
          open={true}
          data={data}
          onClose={() => {
            setFormModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
        />
      )}
    </>
  );
};

