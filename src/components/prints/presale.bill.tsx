import React, {useMemo} from "react";
import {Order} from "@/api/model/order.ts";
import {withCurrency} from "@/lib/utils.ts";
import {calculateOrderTotal} from "@/lib/cart.ts";
import {CommonBillParts} from "@/components/prints/_common.bill.tsx";

type Props = {
  order: Order
}

export const PrintPresaleBill: React.FC<Props> = ({order}) => {
  const itemsTotal = calculateOrderTotal(order);
  const total = useMemo(() => {
    const extrasTotal = order?.extras ? order?.extras?.reduce((prev, item) => prev + item.value, 0) : 0;
    return itemsTotal + extrasTotal + Number(order?.tax_amount ?? 0) - Number(order?.discount_amount ?? 0) + Number(order.service_charge_amount ?? 0) + Number(order?.tip_amount ?? 0);
  }, [itemsTotal, order]);

  return (
    <div style={{padding: 12, fontFamily: 'monospace', width: 280}}>
      <div style={{textAlign: 'center', marginBottom: 8}}>
        <strong>Pre-Sale Bill</strong>
      </div>
      <CommonBillParts order={order} itemsTotal={itemsTotal} total={total}/>
    </div>
  );
}

