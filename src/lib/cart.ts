import {MenuItem} from "@/api/model/cart_item.ts";
import {Order} from "@/api/model/order.ts";
import {OrderItem} from "@/api/model/order_item.ts";
import {getOrderFilteredItems} from "@/lib/order.ts";
import {safeNumber} from "@/lib/utils.ts";

export const calculateCartItemPrice = (item: MenuItem) => {
  const quantity = safeNumber(item?.quantity || 1);
  const unitPrice = safeNumber(item?.price ?? item?.dish?.price ?? 0);
  const modifiersUnitTotal = (item?.selectedGroups ?? []).reduce((groupsTotal, group) => {
    const selectedModifiers = group?.selectedModifiers ?? [];
    return groupsTotal + selectedModifiers.reduce((modifiersTotal, modifier) => {
      const modifierTotal = calculateCartItemPrice(modifier);
      return modifiersTotal + modifierTotal;
    }, 0);
  }, 0);

  return (unitPrice + modifiersUnitTotal) * quantity;
}

export const calculateCartTotal = (items: MenuItem[]) => {
  return items.reduce((prev, item) => calculateCartItemPrice(item) + prev, 0);
}

export const calculateOrderItemPrice = (item: OrderItem) => {
  const quantity = safeNumber(item?.quantity || 1);
  const unitPrice = safeNumber(item?.price ?? item?.item?.price ?? 0);
  const modifiersUnitTotal = (item?.modifiers ?? []).reduce((groupsTotal, group) => {
    const selectedModifiers = group?.selectedModifiers ?? [];
    return groupsTotal + selectedModifiers.reduce((modifiersTotal, selectedModifier) => {
      if (!selectedModifier) {
        return modifiersTotal;
      }

      return modifiersTotal + calculateCartItemPrice(selectedModifier);
    }, 0);
  }, 0);

  return (unitPrice + modifiersUnitTotal) * quantity;
}

export const calculateOrderTotal = (order?: Order) => {
  let price = 0;
  if (!order) {
    return price;
  }

  for (const item of getOrderFilteredItems(order)) {
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
