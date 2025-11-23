import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryPurchaseOrder, PurchaseOrderStatus} from "@/api/model/inventory_purchase_order.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";
import {InventoryPurchaseOrderForm} from "@/components/inventory/purchase_orders/form.tsx";
import {DeleteConfirm} from "@/components/common/table/delete.confirm.tsx";
import {useDB} from "@/api/db/db.ts";

export const InventoryPurchaseOrders = () => {
  const loadHook = useApi<SettingsData<InventoryPurchaseOrder>>(
    Tables.inventory_purchase_orders,
    [],
    ["created_at DESC"],
    0,
    10,
    ["supplier", "items", "items.item", "items.supplier"]
  );
  const db = useDB();

  const [data, setData] = useState<InventoryPurchaseOrder>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryPurchaseOrder>();

  const columns: any = [
    columnHelper.accessor("po_number", {
      header: "PO #"
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor(row => row.supplier?.name ?? "", {
      id: "supplier",
      header: "Supplier"
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
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        const row = info.row.original;

        return (
          <div className="flex gap-3">
            {row.status === PurchaseOrderStatus.pending && (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    setData(row);
                    setFormModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPencil}/>
                </Button>

                <DeleteConfirm onConfirm={async () => {
                  await db.delete(row.id);
                  loadHook.fetchData();
                }} message={`Do you want to delete purchase order# ${row.po_number}`} />
              </>
            )}

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
            key="purchase-order-create"
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
          >
            Purchase order
          </Button>
        ]}
      />

      {formModal && (
        <InventoryPurchaseOrderForm
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

