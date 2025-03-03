import { Button } from "@/components/common/input/button.tsx";
import { faCancel, faCheck, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import React, { useMemo, useState } from "react";
import { useAtom } from "jotai/index";
import { appPage, appState } from "@/store/jotai.ts";
import { calculateCartItemPrice } from "@/lib/cart.ts";
import { useDB } from "@/api/db/db.ts";
import { DateTime } from "luxon";
import { Tables } from "@/api/db/tables.ts";
import { Order, OrderStatus } from "@/api/model/order.ts";
import { OrderPayment } from "@/components/orders/order.payment.tsx";
import { withCurrency } from "@/lib/utils.ts";
import { RecordId, StringRecordId } from "surrealdb";

export const Payment = () => {
  const db = useDB();
  const [state, setState] = useAtom(appState);
  const [page, setPage] = useAtom(appPage);

  const [isLoading, setLoading] = useState(false);

  const total = useMemo(() => {
    return state.cart.reduce((prev, item) => prev + calculateCartItemPrice(item), 0);
  }, [state.cart]);

  const nextInvoiceNumber = async () => {
    return await db.query(`SELECT math::max(invoice_number) as invoice_number from ${Tables.orders} group all`);
  }

  const createOrder = async () => {

    setLoading(true);
    const isNewOrder = state?.order?.id === 'new';

    let invoiceNumber = 1;

    if( isNewOrder ) {
      const invoiceNumberResult: any = await nextInvoiceNumber();
      if( invoiceNumberResult[0].length > 0 ) {
        invoiceNumber = invoiceNumberResult[0][0].invoice_number + 1;
      }
    } else {
      invoiceNumber = state?.order?.order?.invoice_number;
    }

    // create items and store their ids
    const items = [];
    for ( const item of state.cart ) {
      const itemData: any = {
        tax: 0,
        item: new StringRecordId(item.dish.id.toString()),
        price: item.dish.price,
        quantity: item.quantity,
        position: 0,
        comments: item.comments,
        service_charges: 0,
        discount: 0,
        modifiers: item.selectedGroups,
        seat: item.seat,
        is_suspended: item.isHold,
        level: item.level,
        category: item.category,
        is_addition: !isNewOrder
      };

      if( item.id.toString().includes('order_item:') ) {
        itemData.updated_at = DateTime.now().toJSDate();

        await db.merge(item.id, itemData);
        items.push(new StringRecordId(item.id.toString()));
      } else {
        itemData.created_at = DateTime.now().toJSDate();

        const record = await db.create(Tables.order_items, itemData);
        items.push(record[0].id);

        // add in kitchens
        const kitchen: any = await db.query(`SELECT * from ${Tables.kitchens} where items ?= ${item.dish.id.toString()}`);
        if(kitchen[0].length > 0){
          for(const k of kitchen[0]){
            await db.create(Tables.order_items_kitchen, {
              created_at: DateTime.now().toJSDate(),
              kitchen: new StringRecordId(k.id.toString()),
              order_item: new StringRecordId(record[0].id.toString())
            });
          }
        }
      }
    }

    const data: any = {
      floor: new StringRecordId(state?.floor?.id.toString()),
      covers: parseInt(state?.persons),
      tax: null,
      tax_amount: 0,
      tags: ['Normal'],
      discount: null,
      discount_amount: 0,
      customer: null,
      order_type: new StringRecordId(state?.orderType?.id.toString()),
      status: OrderStatus["In Progress"],
      invoice_number: invoiceNumber,
      items: items,
      table: new StringRecordId(state?.table?.id.toString()),
      user: new StringRecordId(page?.user?.id.toString()),
    };

    let orderObj: any;

    try {
      if( isNewOrder ) {
        data.created_at = DateTime.now().toJSDate();
        orderObj = await db.create(Tables.orders, data);

        // add order back in items
        for ( const item of items ) {
          await db.merge(item, {
            order: orderObj[0].id
          });
        }
      } else {
        data.updated_at = DateTime.now().toJSDate();

        orderObj = await db.merge(state?.order?.id, data);

        // add order back in items
        for ( const item of items ) {
          await db.merge(item, {
            order: orderObj.id
          });
        }
      }
    }catch(e){
      throw e;
    }finally {
      setLoading(false);
    }

    return orderObj;
  }

  const createOrderAndBack = async () => {
    await createOrder();
    await reset();
  }

  const reset = async () => {
    // release table
    await db.merge(state?.table?.id, {
      is_locked: false,
      locked_by: null,
      locked_at: null
    });

    // clear cart and go back to floor screen
    setState(prev => ({
      ...prev,
      cart: [],
      customer: undefined,
      showFloor: true,
      table: undefined,
      persons: '1',
      orderType: undefined,
      order: {
        id: 'new',
        order: undefined
      }
    }));
  }

  const [payment, setPayment] = useState(false);
  const [order, setOrder] = useState<Order>();
  const openPayment = async () => {
    const result = await createOrder();

    if(result){
      let orderId = result?.id;
      if(result[0]?.id){
        orderId = result[0].id;
      }

      const freshOrder = await db.query(`SELECT * FROM ${orderId} FETCH items, items.item, item.item.modifiers, table, user, order_type, customer, discount, tax`);
      setOrder(freshOrder[0][0]);
      setPayment(true);
    }
  }

  return (
    <>
      <div className="font-bold">
        <div className="p-3">
          <div className="flex justify-between items-center">
            <span>Sub Total ({state.cart.length})</span>
            <span>{withCurrency(total)}</span>
          </div>
        </div>
        <div className="h-[2px] separator"></div>
        <div className="p-3">
          <div className="flex justify-between items-center text-success-500 text-3xl">
            <span>Total</span>
            <span>{withCurrency(total)}</span>
          </div>
          <div className="flex gap-3 mt-3">
            <Button variant="success" className="flex-1" size="lg" icon={faCheck} onClick={createOrderAndBack}
                    disabled={isLoading || state.cart.length === 0} isLoading={isLoading}>To kitchen</Button>
            <Button variant="warning" filled className="flex-1" size="lg" icon={faCreditCard} onClick={openPayment}
                    disabled={isLoading || state.cart.length === 0} isLoading={isLoading}>Pay Now</Button>
            <Button variant="danger" className="flex-1" size="lg" icon={faCancel} onClick={() => setState(prev => ({
              ...prev,
              seats: [],
              cart: [],
              seat: undefined
            }))} disabled={isLoading}>Cancel</Button>
          </div>
        </div>
      </div>
      {payment && (
        <OrderPayment
          order={order}
          onClose={async () => {
            await reset();
            setPayment(false);
          }}
        />
      )}
    </>
  )
}
