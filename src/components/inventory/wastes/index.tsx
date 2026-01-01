import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryWaste} from "@/api/model/inventory_waste.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import {InventoryWasteForm} from "@/components/inventory/wastes/form.tsx";
import {useDB} from "@/api/db/db.ts";
import {DeleteConfirm} from "@/components/common/table/delete.confirm.tsx";
import {detectMimeType, downloadArrayBuffer, toArrayBuffer} from "@/utils/files.ts";

export const InventoryWastes = () => {
  const loadHook = useApi<SettingsData<InventoryWaste>>(
    Tables.inventory_wastes,
    [],
    ["created_at DESC"],
    0,
    10,
    ["purchase", "purchase.items", "purchase.items.item", "issue", "issue.items", "issue.items.item", "items", "items.item", "items.purchase_item", "items.issue_item"]
  );
  const db = useDB();

  const [data, setData] = useState<InventoryWaste>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryWaste>();

  const columns: any = [
    columnHelper.accessor("invoice_number", {
      header: "Invoice #"
    }),
    columnHelper.accessor(row => row.purchase?.invoice_number ?? row.issue?.id ?? "", {
      id: "source",
      header: "Source",
      cell: info => {
        const waste = info.row.original;
        if (waste.purchase) {
          return `Purchase #${waste.purchase.invoice_number}`;
        }
        if (waste.issue) {
          return `Issue #${waste.issue.id}`;
        }
        return "";
      }
    }),
    columnHelper.accessor("created_at", {
      header: "Created at",
      cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ""
    }),
    columnHelper.accessor("items", {
      header: "Items",
      cell: info => (
        <div className="flex flex-wrap gap-2">
          {info.getValue()?.map((item, index) => (
            <span key={item.id ?? index} className="tag">
              {item.item?.name ?? "Unknown"} × {item.quantity}
            </span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("documents", {
      header: "Documents",
      cell: info => {
        const documents = info.getValue() as (ArrayBuffer | string)[] | undefined;
        if (!documents || documents.length === 0) {
          return <span className="text-neutral-500">No documents</span>;
        }
        return (
          <div className="flex flex-wrap gap-2">
            {documents.map((doc, index) => {
              const buffer = toArrayBuffer(doc);
              const mimeType = detectMimeType(buffer);
              const extension = mimeType.split('/')[1] || 'bin';
              return (
                <span
                  title={`Download document ${index + 1}`}
                >
                  <Button
                    key={index}
                    variant="primary"
                    size="sm"
                    iconButton
                    onClick={() => {
                      downloadArrayBuffer(buffer, `document-${info.row.original.invoice_number}-${index + 1}.${extension}`, mimeType);
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload}/>
                  </Button>
                </span>
              );
            })}
          </div>
        );
      }
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        return (
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setData(info.row.original);
                setFormModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPencil}/>
            </Button>

            <DeleteConfirm onConfirm={async () => {
              await db.delete(info.getValue());
              await db.query(`DELETE
                              FROM ${Tables.inventory_waste_items}
                              where waste = $waste`, {
                waste: info.getValue()
              });

              loadHook.fetchData();
            }}/>
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
          <Button
            key="waste-create"
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Waste
          </Button>
        ]}
      />

      {formModal && (
        <InventoryWasteForm
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

