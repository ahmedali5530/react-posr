import { CartModifierGroup, MenuItem } from "@/api/model/cart_item.ts";
import { Order } from "@/api/model/order.ts";
import { OrderItem } from "@/api/model/order_item.ts";
import {getOrderFilteredItems} from "@/lib/order.ts";

export const calculateCartItemPrice = (item: MenuItem) => {
  let price =  item.price * item.quantity;
  if(item?.selectedGroups) {
    price += item?.selectedGroups?.reduce((prev, modifier) =>
        prev + modifier?.selectedModifiers.reduce((mPrev, mItem) => calculateCartItemPrice(mItem) + mPrev, 0)
      , 0);
  }

  return price;
}

export const calculateOrderItemPrice = (item: OrderItem) => {
  let price = item.price * item.quantity;
  if(item?.modifiers) {
    price += item?.modifiers?.reduce((prev, modifier) =>
      prev + modifier?.selectedModifiers?.reduce((smPrev, smG) => {
        if(smG) {
          return smPrev + calculateCartItemPrice(smG)
        }

        return 0;
      }, 0)
    , 0);
  }

  return price;
}

export const calculateOrderTotal = (order?: Order) => {
  let price = 0;
  if(!order){
    return price;
  }

  for(const item of getOrderFilteredItems(order)){
    price += calculateOrderItemPrice(item);
  }

  // TODO: calculate tax, service charges, discounts etc...
  return price;
}
