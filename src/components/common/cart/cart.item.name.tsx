import {MenuItem} from "@/api/model/cart_item.ts";
import {cn, formatNumber} from "@/lib/utils.ts";
import React from "react";

interface Props {
  item: MenuItem
  index: number
}

export const CartItemName = ({ item }: Omit<Props, "index">) => {
  return (
    <>
      <div className={
        cn("pl-x flex justify-between", item.isModifier ? 'text-sm' : 'text-lg')
      } style={{
        '--padding': (item.level * 0.875) + 'rem'
      } as any}>
        <span>{item.dish.name}</span>
        <span>{formatNumber(item.price)}</span>
      </div>
      {item.comments && (
        <div className="italic text-sm">({item.comments})</div>
      )}
      {item?.selectedGroups?.map(group =>
        <div className="border-[3px] border-l-warning-500 border-r-0 border-y-0 mb-2" key={group.out?.id}>
          {group?.selectedModifiers?.map(modifier => (
            <React.Fragment key={modifier.id}>
              {CartItemName({ item: modifier })}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}
