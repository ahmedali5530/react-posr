import { cn, formatNumber } from "@/lib/utils.ts";
import React from "react";
import { OrderItem, OrderItemModifier } from "@/api/model/order_item.ts";
import {calculateOrderItemPrice} from "@/lib/cart.ts";

export const OrderItemName = ({
  item, showGroups, showQuantity, showPrice
}: {
  item: OrderItem,
  showGroups?: boolean
  showQuantity?: boolean
  showPrice?: boolean
}) => {
  return (
    <div className="hover:bg-neutral-200">
      <div className="pl-x flex text-lg gap-2" style={{
        '--padding': (item.level * 0.875) + 'rem'
      } as any}>
        <span className="flex-1">{item.item.name}</span>
        {showQuantity && <span className="flex-0 w-[50px] text-right">{formatNumber(item.quantity)}</span>}
        {showPrice && <span className="flex-0 w-[70px] text-right">{formatNumber(calculateOrderItemPrice(item))}</span>}
      </div>
      {item?.modifiers?.length > 0 && (
        <div className="pl-3 flex flex-col">
          {item?.modifiers?.map(modifier => (
            <OrderItemModifiers modifier={modifier} key={modifier.id} showGroups={showGroups}/>
          ))}
        </div>
      )}
    </div>
  )
}

export const OrderItemModifiers = ({
  modifier, showGroups
}: { modifier: OrderItemModifier, showGroups?: boolean }) => {
  return (
    <div key={modifier.id} className="flex flex-col mb-1 kitchen-order-modifier-group">
      {showGroups && <strong>{modifier.out.name}</strong>}
      {modifier.selectedModifiers.map(selectedModifier => (
        <div key={selectedModifier.id} className="pl-3">
          {selectedModifier.dish.name}
          {selectedModifier?.selectedGroups?.map(selectedGroup => (
            <OrderItemModifiers modifier={selectedGroup} key={selectedGroup.id}/>
          ))}
        </div>
      ))}
    </div>
  )
}
