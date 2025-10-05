import {Order} from "@/api/model/order.ts";
import {withCurrency} from "@/lib/utils.ts";
import React from "react";
import {calculateOrderItemPrice} from "@/lib/cart.ts";
import {DateTime} from "luxon";
import {DiscountType} from "@/api/model/discount.ts";

interface Props {
  order: Order
  itemsTotal: number
  total: number
}

export const CommonBillParts = ({
  order, itemsTotal, total
}: Props) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span>Invoice# {order.invoice_number}</span>
        <span>{DateTime.fromJSDate(order.created_at).toFormat('y-MM-dd hh:mm a')}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span>{order.table.name}{order.table.number}</span>
        <span>{order.user.first_name} {order.user.last_name}</span>
      </div>
      <hr/>
      <div>
        {order.items?.map((it, idx: number) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{it.item.name} x{it.quantity}</span>
            <span>{withCurrency(calculateOrderItemPrice(it))}</span>
          </div>
        ))}
      </div>
      <hr/>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          fontWeight: 'bold'
        }}>
          <div style={{ flex: 1 }}>Items ({order.items.length})</div>
          <div style={{ textAlign: 'right' }}>{withCurrency(itemsTotal)}</div>
        </div>
        {order?.tax && (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              Tax {order?.tax && <>({order?.tax?.name} {order?.tax?.rate}%)</>}
            </div>
            <div style={{ textAlign: 'right' }}>{withCurrency(order?.tax_amount)}</div>
          </div>
        )}
        {order?.discount && (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>Discount</div>
            <div style={{ textAlign: 'right' }}>{withCurrency(order?.discount_amount)}</div>
          </div>
        )}
        {order?.service_charge && order?.service_charge > 0 ? (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>Service charges ({order?.service_charge}%)</div>
            <div style={{ textAlign: 'right' }}>{withCurrency(order?.service_charge_amount)}</div>
          </div>
        ) : ''}
        {order?.extras && order?.extras?.map((item, idx: number) => (
          <div key={idx} style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>{item.name}</div>
            <div style={{ textAlign: 'right' }}>{withCurrency(item.value)}</div>
          </div>
        ))}
        {order?.tip_amount > 0 && (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>Tip {order?.tip_type === DiscountType.Percent ? '%' : ''}</div>
            <div style={{ textAlign: 'right' }}>{withCurrency(order?.tip_amount)}</div>
          </div>
        )}
        <hr/>
        <div style={{display: 'flex', fontWeight: 'bold'}}>
          <div style={{flex: 1}}>Total</div>
          <div style={{textAlign: 'right'}}>{withCurrency(total)}</div>
        </div>
      </div>
    </>
  );
}