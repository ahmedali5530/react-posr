import { Order as OrderModel, OrderStatus } from "@/api/model/order.ts";
import React, { CSSProperties, useMemo, useState } from "react";
import { calculateOrderTotal } from "@/lib/cart.ts";
import { withCurrency } from "@/lib/utils.ts";
import { Button } from "@/components/common/input/button.tsx";
import { OrderPayment } from "@/components/orders/order.payment.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import { OrderHeader } from "@/components/orders/order.header.tsx";
import { OrderTimes } from "@/components/orders/order.times.tsx";
import { faBars, faCreditCard, faPrint } from "@fortawesome/free-solid-svg-icons";

interface Props {
  order: OrderModel
}

export const Order = ({
  order
}: Props) => {
  const itemsTotal = calculateOrderTotal(order);
  const [payment, setPayment] = useState(false);

  const total = useMemo(() => {
    const extrasTotal = order?.extras ? order?.extras?.reduce((prev, item) => prev + item.value, 0) : 0;
    return itemsTotal + extrasTotal + Number(order?.tax_amount || 0) - Number(order?.discount_amount || 0);
  }, [itemsTotal, order]);

  return (
    <>
      <div className="rounded-xl p-3 bg-white gap-5 flex flex-col shadow">
        <OrderHeader order={order}/>
        <OrderTimes order={order}/>
        <div className="separator h-[2px]" style={{ '--size': '10px', '--space': '5px' } as CSSProperties}></div>
        <ScrollContainer>
          <div className="overflow-auto max-h-[450px]">
            {order.items.map(item => (
              <div className="flex gap-3 hover:bg-neutral-100" key={item.id}>
                <div className="flex-1 whitespace-break-spaces">{item.item.name}</div>
                <div className="text-right w-[50px] flex-shrink-0">{item.quantity}</div>
                <div className="text-right w-[80px] flex-shrink-0">{item.price}</div>
              </div>
            ))}
          </div>
        </ScrollContainer>
        <div className="separator h-[2px]" style={{ '--size': '10px', '--space': '5px' } as CSSProperties}></div>
        <div className="flex flex-col gap-1">
          <div className="flex font-bold">
            <div className="flex-1">Items ({order.items.length})</div>
            <div className="text-right">{withCurrency(itemsTotal)}</div>
          </div>
          {order?.tax && (
            <div className="flex">
              <div className="flex-1">Tax {order?.tax && <>({order?.tax?.name} {order?.tax?.rate}%)</>}</div>
              <div className="text-right">{withCurrency(order?.tax_amount)}</div>
            </div>
          )}
          {order?.discount && (
            <div className="flex">
              <div className="flex-1">Discount</div>
              <div className="text-right">{withCurrency(order?.discount_amount)}</div>
            </div>
          )}
          {order?.service_charges_amount && (
            <div className="flex">
              <div className="flex-1">Service charges ({order?.service_charges}%)</div>
              <div className="text-right">{withCurrency(order?.service_charges_amount)}</div>
            </div>
          )}
          {order?.extras && order?.extras?.map(item => (
            <div className="flex">
              <div className="flex-1">{item.name}</div>
              <div className="text-right">{withCurrency(item.value)}</div>
            </div>
          ))}
          <div className="flex font-bold">
            <div className="flex-1">Total</div>
            <div className="text-right">{withCurrency(total)}</div>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="primary" flat size="lg" className="flex-1" icon={faBars}>More</Button>
          {order.status === OrderStatus["In Progress"] && (
            <>
              <Button variant="primary" flat size="lg" className="flex-1" icon={faPrint}>Temp bill</Button>
              <Button variant="warning" filled size="lg" className="flex-1" onClick={() => setPayment(true)}
                      icon={faCreditCard}>
                Pay Now
              </Button>
            </>
          )}
        </div>
      </div>

      {payment && (
        <OrderPayment order={order} onClose={() => {
          setPayment(false)
        }}/>
      )}
    </>
  );
}
