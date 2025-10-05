import { withCurrency } from "@/lib/utils.ts";
import { Dish } from "@/api/model/dish.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { appState } from "@/store/jotai.ts";
import { MenuDishModifiers } from "@/components/menu/modifiers.tsx";
import { CartModifierGroup, MenuItem, MenuItemType } from "@/api/model/cart_item.ts";
import { nanoid } from "nanoid";
import { images } from "@/components/menu/image.ts";
import { Tables } from "@/api/db/tables.ts";
import { useDB } from "@/api/db/db.ts";
import { DishModifierGroup } from "@/api/model/dish_modifier_group.ts";


interface Props {
  onClick: (item: MenuItem, groups?: CartModifierGroup[]) => void
  item: Dish
  level: number
  isModifier?: boolean
  price: number
}

export const MenuDish = ({ onClick, item, level, isModifier, price }: Props) => {
  const db = useDB();
  const [state] = useAtom(appState);

  const [modifiersModal, setModifiersModal] = useState(false);

  const [modifierGroups, setModifierGroups] = useState<DishModifierGroup[]>([]);
  const loadModifierGroups = async () => {
    const record: any = await db.query(`SELECT * from ${Tables.dish_modifier_groups} where in = ${item.id} fetch out, out.modifiers, out.modifiers.modifier`);

    setModifierGroups(record[0]);
  }

  useEffect(() => {
    loadModifierGroups();
  }, [item.id]);

  const hasAutoOpen = useMemo(() => {
    return modifierGroups.filter(m => m.has_required_modifiers).length > 0;
  }, [modifierGroups]);


  const dishCount = useCallback((dish: Dish) => {
    if(isModifier){
      return null;
    }

    return state.cart.filter(item => item.dish === dish).reduce((prev, item) => prev + item.quantity, 0)
  }, [state.cart]);

  const image = useMemo(() => {
    return item.photo ? item.photo : images[Math.floor(Math.random() * images.length)]
  }, [item]);

  return (
    <>
      <div
        className="flex justify-center p-1 relative"
        onClick={() => {
          if( modifierGroups.length > 0 && hasAutoOpen ) {
            setModifiersModal(true)
          } else {
            onClick({
              quantity: 1,
              dish: item,
              seat: state.seat,
              id: nanoid(),
              level: level,
              selectedGroups: [],
              newOrOld: MenuItemType.new,
              category: state.category ? state.category?.name : (item.categories.length === 1 ? item.categories[0].name : ''),
              price: price
            })
          }
        }}
      >
        <div
          className="flex-1 bg-white w-fit rounded-xl shadow-lg pressable cursor-pointer menu-item active:shadow-none flex text-neutral-900 active:text-warning-500"
          style={{
            '--padding': '0',
          } as any}
        >
          <div className="flex-shrink-0">
            <img src={image} alt="card-image"
                 className="rounded-xl rounded-r-none pointer-events-none h-full w-[60px] xl:w-[90px] object-cover"/>
          </div>
          <div className="flex flex-col px-3 py-2">
            <span className="flex flex-row gap-2 mb-1">
              <span
                className="rounded-full border border-neutral-700 py-1 px-3 text-xs font-bold text-warning-700">{withCurrency(price)}</span>
            </span>
            <h6 className="text-ellipsis line-clamp-2 flex-shrink flex-grow-0 text-pretty"
                title={item.name}>
              {item.name}
            </h6>
          </div>
        </div>
        <span className="absolute bottom-2 right-2 text-primary-500 text-xs font-bold">{dishCount(item)}</span>
      </div>

      {modifierGroups.length > 0 && modifiersModal && (
        <MenuDishModifiers
          dish={item}
          isOpen={modifiersModal}
          groups={[...modifierGroups.map(grp => ({
            ...grp,
            selectedModifiers: [],
            modifiers: [...grp.out.modifiers.map(m => ({
              dish: m.modifier,
              price: m.price,
              id: m.id,
              quantity: 1,
              level: level,
              newOrOld: MenuItemType.new,
              category: state.category ? state.category?.name : (grp?.in?.categories?.length === 1 ? grp.in.categories[0].name : '')
            }))]
          }))]}
          onClose={(payload) => {
            if(payload.length > 0) {
              onClick({
                dish: item,
                seat: state.seat,
                quantity: 1,
                selectedGroups: payload,
                id: nanoid(),
                isModifier,
                level: level,
                newOrOld: MenuItemType.new,
                category: state.category ? state.category?.name : (item.categories.length === 1 ? item.categories[0].name : ''),
                price: price
              }, payload);
            }
            setModifiersModal(false);
          }}
          level={level + 1}
        />
      )}
    </>
  )
}
