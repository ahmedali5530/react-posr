import {useState} from "react";
import {Dish} from "@/api/model/dish.ts";
import {Tables} from "@/api/db/tables.ts";
import {Button} from "@/components/common/input/button.tsx";
import {DishForm} from "@/components/settings/dishes/dish.form.tsx";
import {faImage, faPencil, faPlus, faUpload} from "@fortawesome/free-solid-svg-icons";
import {createColumnHelper} from "@tanstack/react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {TableComponent} from "@/components/common/table/table.tsx";
import {detectMimeType} from "@/utils/files.ts";
import {CsvUploadModal} from "@/components/common/table/csv.uploader.tsx";
import {useDB} from "@/api/db/db.ts";
import {toRecordId} from "@/lib/utils.ts";

export const AdminDishes = () => {
  const db = useDB();

  const loadHook = useApi<SettingsData<Dish & { modifiers: [] }>>(
    Tables.dishes, [], [], 0, 10, ['categories', 'items', 'items.item'], {}, [
      '*',
      '(SELECT out.name from menu_item_modifier_group where in = $parent.id) as modifiers',
      '(SELECT name from modifier_group where array::any(modifiers.modifier.id ?? [], $parent.id)) as modifier_items'
    ]
  );

  const [data, setData] = useState<Dish>();
  const [formModal, setFormModal] = useState(false);
  const [dishImportModal, setImportModal] = useState(false);

  const columnHelper = createColumnHelper<Dish & {
    modifiers: [{ out: { name: string } }],
    modifier_items: [{ name: string }]
  }>();

  const columns: any = [
    columnHelper.accessor("photo", {
      header: 'Photo',
      cell: info => {
        if(info.getValue()) {
          const buffer = info.getValue();
          const mimeType = detectMimeType(buffer, "image/png");
          const blob = new Blob([buffer], { type: mimeType });
          return <a href={URL.createObjectURL(blob)} target="_blank"><img alt={info.row.original.name} src={URL.createObjectURL(blob)} className="w-[50px] h-[50px]" /></a>
        }
      }
    }),
    columnHelper.accessor("name", {
      header: 'Name'
    }),
    columnHelper.accessor("number", {
      header: 'Number',
    }),
    columnHelper.accessor("priority", {
      header: 'Priority'
    }),
    columnHelper.accessor("price", {
      header: 'Sale price'
    }),
    columnHelper.accessor("cost", {
      header: 'Cost price'
    }),
    columnHelper.accessor("categories", {
      header: 'Categories',
      cell: info => <div className="flex gap-2 flex-wrap">
        {info.getValue()?.map((item, index) => (
          <span className="tag" key={`${item.id}-${index}`}>{item.name}</span>
        ))}
      </div>,
    }),
    columnHelper.accessor('id', {
      id: 'modifier_groups',
      header: 'Modifier groups',
      cell: info => (
        <div className="flex gap-2 flex-wrap">
          {info.row.original.modifiers.map((item, index) => (
            <span className="tag" key={index}>{item.out.name}</span>
          ))}
        </div>
      ),
      enableColumnFilter: false,
      enableSorting: false,
    }),
    columnHelper.accessor('id', {
      id: 'modifier_items',
      header: 'Used as modifier',
      cell: info => (
        <div className="flex gap-2 flex-wrap">
          {info.row.original.modifier_items.map((item, index) => (
            <span className="tag" key={index}>{item.name}</span>
          ))}
        </div>
      ),
      enableColumnFilter: false,
      enableSorting: false,
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
            setImportModal(true);
          }} icon={faUpload}> Import Dishes</Button>,
          <Button variant="primary" onClick={() => {
            setFormModal(true);
          }} icon={faPlus}> Dish</Button>
        ]}
      />

      {dishImportModal && (
        <CsvUploadModal
          isOpen={true}
          onClose={() => setImportModal(false)}
          fields={[{
            name: 'name',
            label: 'Name'
          },{
            name: 'number',
            label: 'Number'
          },{
            name: 'priority',
            label: 'Priority'
          },{
            name: 'sale_price',
            label: 'Sale price'
          },{
            name: 'cost_price',
            label: 'Cost price'
          },{
            name: 'categories',
            label: 'Categories'
          }]}
          onCreateRow={async (rowData) => {
            try{
              const [categories] = await db.query(`SELECT id from ${Tables.categories} where name IN $names`, {
                names: rowData.categories.split('|')
              });

              if(categories.length !== rowData?.categories?.split('|')?.filter(item => item !== '')?.length){
                throw new Error('Categories are invalid');
              }

              const dishData: any = {
                name: rowData.name,
                number: rowData.number,
                // position: data.position,
                priority: Number(rowData.priority),
                price: Number(rowData.sale_price),
                cost: Number(rowData.cost_price),
                categories: categories.map(item => toRecordId(item.id))
              };

              await db.insert(Tables.dishes, dishData);

            }catch(e){
              throw new Error(e)
            }
          }}
          onDone={() => loadHook.fetchData()}
        />
      )}

      {formModal && (
        <DishForm
          open={formModal}
          data={data}
          onClose={() => {
            setFormModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
        />
      )}

    </>
  )
}
