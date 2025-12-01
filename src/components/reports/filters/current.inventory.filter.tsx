import {REPORTS_CURRENT_INVENTORY} from "@/routes/posr.ts";
import {Button} from "@/components/common/input/button.tsx";
import {ReactSelect} from "@/components/common/input/custom.react.select.tsx";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {InventoryItem} from "@/api/model/inventory_item.ts";

const toOption = <T extends { id?: any }>(
  item: T | undefined,
  label: string
) => {
  if (!item?.id) {
    return null;
  }

  const value =
    typeof item.id === "string" ? item.id : item.id.toString?.() ?? String(item.id);

  return {
    label,
    value,
  };
};

const notNull = <T,>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const CurrentInventoryFilter = () => {
  const {data: itemsData, isLoading: loadingItems} = useApi<SettingsData<InventoryItem>>(
    Tables.inventory_items, 
    [], 
    ['name asc'], 
    0, 
    9999, 
    ['category']
  );

  return (
    <form
      action={REPORTS_CURRENT_INVENTORY}
      className="flex flex-col gap-3 items-start"
      target="_blank"
    >
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="current-inventory-items">Inventory Items</label>
        <ReactSelect
          id="current-inventory-items"
          name="items[]"
          isMulti
          isLoading={loadingItems}
          className="w-full"
          options={(itemsData?.data || [])
            .map(item => toOption(item, `${item.name}${item.code ? ` - ${item.code}` : ''}`.trim()))
            .filter(notNull)}
        />
      </div>

      <Button
        variant="primary"
        filled
        type="submit"
      >Generate</Button>
    </form>
  );
}

