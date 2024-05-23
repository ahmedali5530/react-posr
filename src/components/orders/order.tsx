import { Order as OrderModel, OrderStatus } from "@/api/model/order.ts";
import React, { CSSProperties, useState } from "react";
import { useOrderTotal } from "@/lib/cart.ts";
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
  const total = useOrderTotal(order);
  const [payment, setPayment] = useState(false);

  return (
    <>
      <div className="rounded-xl p-3 bg-white gap-5 flex flex-col">
        <OrderHeader order={order}/>
        <OrderTimes order={order} />
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
        <div className="flex gap-3 font-bold">
          <div className="flex-1">Total</div>
          <div className="text-right">{withCurrency(total)}</div>
        </div>
        <div className="flex gap-5">
          <Button variant="primary" flat size="lg" className="flex-1" icon={faBars}>More</Button>
          {order.status === OrderStatus["In Progress"] && (
            <>
              <Button variant="primary" flat size="lg" className="flex-1" icon={faPrint}>Temp bill</Button>
              <Button variant="warning" filled size="lg" className="flex-1" onClick={() => setPayment(true)} icon={faCreditCard}>
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
