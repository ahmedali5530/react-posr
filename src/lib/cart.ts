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

  return price;
}

export const calculateExtrasTotalFromRecord = (extras: Record<string, number> | undefined | null) => {
  if (!extras) {
    return 0;
  }
  return Object.values(extras).reduce((prev, value) => prev + Number(value || 0), 0);
};

export interface OrderTotalsInput {
  itemsTotal: number;
  extrasTotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  serviceChargeAmount?: number;
  couponAmount?: number;
  tipAmount?: number;
}

export const calculateOrderGrandTotal = ({
  itemsTotal,
  extrasTotal = 0,
  taxAmount = 0,
  discountAmount = 0,
  serviceChargeAmount = 0,
  couponAmount = 0,
  tipAmount = 0,
}: OrderTotalsInput) => {
  return (
    itemsTotal +
    extrasTotal +
    taxAmount +
    serviceChargeAmount -
    discountAmount -
    couponAmount +
    tipAmount
  );
};

export const calculateChangeDue = (tendered: number, total: number) => {
  return tendered - total;
};
