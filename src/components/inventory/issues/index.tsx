import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryIssue} from "@/api/model/inventory_issue.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import {InventoryIssueForm} from "@/components/inventory/issues/form.tsx";

export const InventoryIssues = () => {
  const loadHook = useApi<SettingsData<InventoryIssue>>(
    Tables.inventory_issues,
    [],
    ["created_at DESC"],
    0,
    10,
    ["issued_to", "created_by", "kitchen", "items", "items.item"]
  );

  const [data, setData] = useState<InventoryIssue>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryIssue>();

  const columns: any = [
    columnHelper.accessor("invoice_number", {
      header: "Issue#",
    }),
    columnHelper.accessor("created_at", {
      header: "Created at",
      cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ""
    }),
    columnHelper.accessor(row => row.created_by?.first_name ?? "", {
      id: "created_by",
      header: "Created by"
    }),
    columnHelper.accessor(row => row.issued_to?.first_name ?? "", {
      id: "issued_to",
      header: "Issued to"
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
            key="issue-create"
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Issue
          </Button>
        ]}
      />

      {formModal && (
        <InventoryIssueForm
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

