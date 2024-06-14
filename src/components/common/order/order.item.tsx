import { cn } from "@/lib/utils.ts";
import React from "react";
import { OrderItem, OrderItemModifier } from "@/api/model/order_item.ts";

export const OrderItemName = ({
  item, showGroups
}: {
  item: OrderItem,
  showGroups?: boolean
}) => {
  return (
    <>
      <div className={
        cn("pl-x flex justify-between", 'text-lg')
      } style={{
        '--padding': (item.level * 0.875) + 'rem'
      } as any}>
        <span>{item.item.name}</span>
        <span>{item.quantity}</span>
      </div>
      {item?.modifiers?.length > 0 && (
        <div className="pl-3 flex flex-col">
          {item?.modifiers?.map(modifier => (
            <OrderItemModifiers modifier={modifier} key={modifier.id} showGroups={showGroups}/>
          ))}
        </div>
      )}
    </>
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
