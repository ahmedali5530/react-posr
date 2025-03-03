import {Order as OrderModel, OrderStatus} from "@/api/model/order.ts";
import React, {CSSProperties, useMemo, useState} from "react";
import {calculateOrderTotal} from "@/lib/cart.ts";
import {withCurrency} from "@/lib/utils.ts";
import {Button} from "@/components/common/input/button.tsx";
import {OrderPayment} from "@/components/orders/order.payment.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import {OrderHeader} from "@/components/orders/order.header.tsx";
import {OrderTimes} from "@/components/orders/order.times.tsx";
import {faBars, faCreditCard, faPrint} from "@fortawesome/free-solid-svg-icons";
import {OrderItemName} from "@/components/common/order/order.item.tsx";
import {Dropdown, DropdownItem} from "@/components/common/react-aria/dropdown.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TempBill} from "@/components/prints/temp.bill.tsx";

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

  const [print, setPrint] = useState(false);

  return (
    <>
      <div className="rounded-xl p-3 bg-white gap-5 flex flex-col shadow">
        <OrderHeader order={order}/>
        <OrderTimes order={order}/>
        <div className="separator h-[2px]" style={{'--size': '10px', '--space': '5px'} as CSSProperties}></div>
        <ScrollContainer>
          <div className="overflow-auto max-h-[400px]">
            {order.items.map(item => (
              <OrderItemName item={item} showPrice showQuantity key={item.id}/>
            ))}
          </div>
        </ScrollContainer>
        <div className="separator h-[2px]" style={{'--size': '10px', '--space': '5px'} as CSSProperties}></div>
        <div className="flex flex-col gap-1">
          <div className="flex font-bold">
            <div className="flex-1">Items ({order.items.length})</div>
            <div className="text-right">{withCurrency(itemsTotal)}</div>
          </div>
          {order?.tax && (
            <div className="flex">
              <div className="flex-1">
                Tax {order?.tax && <>({order?.tax?.name} {order?.tax?.rate}%)</>}
              </div>
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
          <Dropdown
            label={<><FontAwesomeIcon icon={faBars} className="mr-3"/> More</>}
            btnSize="lg"
            btnFlat={true}
            className="flex-1"
            onAction={(key) => {
              if (key === 'print') {
                setPrint(true)
              }
            }}
          >
            <DropdownItem id="print" key={order.id} className="min-w-[50px]">Print temp bill</DropdownItem>
          </Dropdown>
          {order.status === OrderStatus["In Progress"] && (
            <>
              <Button onClick={() => {
                setPrint(true)
              }} variant="primary" flat size="lg" className="flex-1" icon={faPrint}>Temp bill</Button>
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

      {print && (
        <TempBill order={order} onDone={() => {
          setPrint(false);
        }}/>
      )}
    </>
  );
}
