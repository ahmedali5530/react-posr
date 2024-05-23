import { Button } from "@/components/common/input/button.tsx";
import { faCancel, faCheck, faPause } from "@fortawesome/free-solid-svg-icons";
import React, { useMemo, useState } from "react";
import { useAtom } from "jotai/index";
import { appPage, appState } from "@/store/jotai.ts";
import { calculateCartItemPrice } from "@/lib/cart.ts";
import { useDB } from "@/api/db/db.ts";
import { DateTime } from "luxon";
import { Tables } from "@/api/db/tables.ts";
import { OrderItem } from "@/api/model/order_item.ts";
import { OrderStatus } from "@/api/model/order.ts";

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

    if(isNewOrder) {
      const invoiceNumberResult: any = await nextInvoiceNumber();
      if( invoiceNumberResult[0].length > 0 ) {
        invoiceNumber = invoiceNumberResult[0][0].invoice_number + 1;
      }
    }else{
      invoiceNumber = state?.order?.order?.invoice_number;
    }

    // create items and store their ids
    const items = [];
    for ( const item of state.cart ) {
      const itemData: any = {
        created_at: DateTime.now().toISO(),
        tax: 0,
        item: item.dish.id,
        price: item.dish.price,
        quantity: item.quantity,
        position: 0,
        comments: item.comments,
        service_charges: 0,
        discount: 0,
        modifiers: item.selectedGroups,
        seat: item.seat,
        is_suspended: item.isHold,
        level: item.level
      };

      if(item.id.includes('order_item:')) {
        itemData.updated_at = DateTime.now().toISO();

        await db.update(item.id, itemData);
        items.push(item.id);
      }else {
        const record = await db.create(Tables.order_items, itemData);
        items.push(record[0].id);
      }
    }

    const data = {
      created_at: DateTime.now().toISO(),
      floor: state?.floor?.id,
      covers: parseInt(state?.persons),
      tax: null,
      tax_amount: 0,
      tags: ['Normal'],
      discount: null,
      discount_amount: 0,
      customer: null,
      order_type: state?.orderType?.id,
      status: OrderStatus["In Progress"],
      invoice_number: invoiceNumber,
      items: items,
      table: state?.table?.id,
      user: page?.user?.id,
    };

    if(isNewOrder) {
      const order = await db.create(Tables.orders, data);

      // add order back in items
      for(const item of items){
        await db.merge(item, {
          order: order[0].id
        });
      }
    }else{
      const order = await db.update(state?.order?.id, data);

      // add order back in items
      for(const item of items){
        await db.merge(item, {
          order: order[0].id
        });
      }
    }

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
      showFloor: true,
      table: undefined,
      persons: '1',
      orderType: undefined,
      order: {
        id: 'new',
        order: undefined
      }
    }));

    setLoading(false);
  }

  return (
    <div className="font-bold">
      <div className="p-3">
        <div className="flex justify-between items-center">
          <span>Sub Total</span>
          <span>{total}</span>
        </div>
        <div className="flex justify-between items-center text-warning-500">
          <span>Discount</span>
          <span>0</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Service charges</span>
          <span>0</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tax</span>
          <span>0</span>
        </div>
      </div>
        <div className="h-[2px] separator"></div>
      <div className="p-3">
        <div className="flex justify-between items-center text-success-500 text-3xl">
          <span>Total</span>
          <span>{total}</span>
        </div>
        <div className="flex gap-3 mt-3">
          <Button variant="success" className="flex-1" size="lg" icon={faCheck} onClick={createOrder}
                  disabled={isLoading} isLoading={isLoading}>Done</Button>
          <Button variant="danger" className="flex-1" size="lg" icon={faCancel} onClick={() => setState(prev => ({
            ...prev,
            seats: [],
            cart: [],
            seat: undefined
          }))} disabled={isLoading}>Cancel</Button>
          <Button variant="warning" className="flex-1" size="lg" icon={faPause} disabled={isLoading}>Hold</Button>
        </div>
      </div>
    </div>
  )
}
