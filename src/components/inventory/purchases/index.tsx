import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryPurchase} from "@/api/model/inventory_purchase.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus, faUpload, faDownload, faFile} from "@fortawesome/free-solid-svg-icons";
import {InventoryPurchaseForm} from "@/components/inventory/purchases/form.tsx";
import {InventoryPurchaseUpload} from "@/components/inventory/purchases/upload.tsx";
import {downloadArrayBuffer, detectMimeType, toArrayBuffer} from "@/utils/files.ts";

export const InventoryPurchases = () => {
  const loadHook = useApi<SettingsData<InventoryPurchase>>(
    Tables.inventory_purchases,
    [],
    ["created_at DESC"],
    0,
    10,
    ["supplier", "purchase_order", "items", "items.item", "items.supplier", 'items.store']
  );

  const [data, setData] = useState<InventoryPurchase>();
  const [formModal, setFormModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryPurchase>();

  const columns: any = [
    columnHelper.accessor("invoice_number", {
      header: "Invoice #"
    }),
    columnHelper.accessor(row => row.supplier?.name ?? "", {
      id: "supplier",
      header: "Supplier"
    }),
    columnHelper.accessor(row => row.purchase_order?.po_number ?? "", {
      id: "purchase_order",
      header: "PO #"
    }),
    columnHelper.accessor("created_at", {
      header: "Created at",
      cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : ""
    }),
    columnHelper.accessor("items", {
      header: "Items",
      cell: info => (
        <div className="flex flex-wrap gap-2">
          {info.getValue()?.slice(0, 5).map((item, index) => (
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
                <div
                  title={`Download document ${index + 1}`}
                  key={index}
                >
                <Button

                  size="sm"
                  flat
                  onClick={() => {
                    downloadArrayBuffer(buffer, `document-${info.row.original.invoice_number}-${index + 1}.${extension}`, mimeType);
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" /> Download
                </Button>
                </div>
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
            key="purchase-create"
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Purchase
          </Button>
        ]}
      />

      {formModal && (
        <InventoryPurchaseForm
          open={true}
          data={data}
          onClose={() => {
            setFormModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
        />
      )}

      {uploadModal && (
        <InventoryPurchaseUpload
          onClose={() => {
            setUploadModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
        />
      )}
    </>
  );
};

