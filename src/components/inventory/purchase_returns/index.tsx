import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryPurchaseReturn} from "@/api/model/inventory_purchase_return.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus, faDownload} from "@fortawesome/free-solid-svg-icons";
import {InventoryPurchaseReturnForm} from "@/components/inventory/purchase_returns/form.tsx";
import {downloadArrayBuffer, detectMimeType, toArrayBuffer} from "@/utils/files.ts";

export const InventoryPurchaseReturns = () => {
  const loadHook = useApi<SettingsData<InventoryPurchaseReturn>>(
    Tables.inventory_purchase_returns,
    [],
    ["created_at DESC"],
    0,
    10,
    ["purchase", "purchase.items", "purchase.items.item", "items", "items.item", "items.purchase_item", "items.purchase_item.store", "items.purchase_item.supplier", "items.store", "items.supplier"]
  );

  const [data, setData] = useState<InventoryPurchaseReturn>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryPurchaseReturn>();

  const columns: any = [
    columnHelper.accessor("invoice_number", {
      header: "Invoice #"
    }),
    columnHelper.accessor(row => row.purchase?.invoice_number ?? "", {
      id: "purchase",
      header: "Purchase invoice #"
    }),
    columnHelper.accessor("created_at", {
      header: "Created at",
      cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ""
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
                <Button
                  key={index}
                  variant="primary"
                  size="sm"
                  iconButton
                  onClick={() => {
                    downloadArrayBuffer(buffer, `document-${info.row.original.invoice_number}-${index + 1}.${extension}`, mimeType);
                  }}
                  title={`Download document ${index + 1}`}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
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
            key="purchase-return-create"
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Purchase return
          </Button>
        ]}
      />

      {formModal && (
        <InventoryPurchaseReturnForm
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

