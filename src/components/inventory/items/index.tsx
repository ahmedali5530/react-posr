import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {Button} from "@/components/common/input/button.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus, faUpload} from "@fortawesome/free-solid-svg-icons";
import {InventoryItem} from "@/api/model/inventory_item.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {InventoryItemForm} from "@/components/inventory/items/form.tsx";
import {CsvUploadModal} from "@/components/common/table/csv.uploader.tsx";
import {useDB} from "@/api/db/db.ts";

export const InventoryItems = () => {
  const loadHook = useApi<SettingsData<InventoryItem>>(Tables.inventory_items, [], [], 0, 10, ['category', 'suppliers', 'stores']);
  const db = useDB();

  const [data, setData] = useState<InventoryItem>();
  const [formModal, setFormModal] = useState(false);
  const [importModal, setImportModal] = useState(false);

  const columnHelper = createColumnHelper<InventoryItem>();

  const columns: any = [
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("code", {
      header: 'Code',
    }),
    columnHelper.accessor(row => row.category?.name ?? "", {
      id: "category",
      header: 'Category'
    }),
    columnHelper.accessor("uom", {
      header: 'Unit of measurement'
    }),
    columnHelper.accessor("base_quantity", {
      header: 'Base quantity'
    }),
    columnHelper.accessor("price", {
      header: 'Price'
    }),
    columnHelper.accessor("average_price", {
      header: 'Average price'
    }),
    columnHelper.accessor("stores", {
      header: 'Stores',
      cell: info => (
        <div className="flex flex-wrap gap-2">
          {info.getValue()?.map((store, index) => (
            <span className="tag" key={store.id ?? index}>{store.name}</span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("suppliers", {
      header: 'Suppliers',
      cell: info => (
        <div className="flex flex-wrap gap-2">
          {info.getValue()?.map((item, index) => (
            <span className="tag" key={item.id ?? index}>{item.name}</span>
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
          }} icon={faPlus}> Item</Button>,
          <Button variant="primary" onClick={() => {
            setImportModal(true);
          }} icon={faUpload}> Import</Button>
        ]}
      />

      {formModal && (
        <InventoryItemForm
          open={true}
          onClose={() => {
            setFormModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
          data={data}
        />
      )}

      {importModal && (
        <CsvUploadModal
          isOpen={true}
          onClose={() => {
            setImportModal(false);
            loadHook.fetchData();
          }}
          fields={[{
            name: 'name',
            label: 'Name'
          }, {
            name: 'code',
            label: 'Code'
          }, {
            name: 'category',
            label: 'Category'
          }, {
            name: 'uom',
            label: 'Unit of measurement'
          }, {
            name: 'base_quantity',
            label: 'Base quantity'
          }, {
            name: 'price',
            label: 'Price'
          }, {
            name: 'average_price',
            label: 'Avg Price'
          }, {
            name: 'stores',
            label: 'Stores'
          }, {
            name: 'suppliers',
            label: 'Suppliers'
          }]}
          onCreateRow={async (data) => {
            try{
              const [category] = await db.query(`select * from ${Tables.inventory_categories} where name = $name`, {
                name: data.category
              });

              if(category.length === 0){
                throw new Error(`Invalid category "${data.category}"`);
              }

              const stores = [];
              for(const store of data.stores.split(',')){
                const [dbStore] = await db.query(`select * from ${Tables.inventory_stores} where name = $name`, {
                  name: store.trim()
                });

                if(dbStore.length === 0){
                  throw new Error(`Invalid store "${store}"`);
                }

                stores.push(dbStore[0].id);
              }

              const suppliers = [];
              for(const supplier of data.suppliers.split(',')){
                const [dbSupplier] = await db.query(`select * from ${Tables.inventory_suppliers} where name = $name`, {
                  name: supplier.trim()
                });

                if(dbSupplier.length === 0){
                  throw new Error(`Invalid supplier "${supplier}"`);
                }

                suppliers.push(dbSupplier[0].id);
              }

              await db.create(Tables.inventory_items, {
                name: data.name,
                code: data.code,
                uom: data.uom,
                category: category[0].id,
                base_quantity: Number(data.base_quantity),
                suppliers: suppliers,
                stores: stores,
                price: Number(data.price),
                average_price: Number(data.average_price)
              });

            }catch(e){
              throw e;
            }
          }}
        />
      )}
    </>
  );
}