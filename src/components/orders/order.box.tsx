import {Order as OrderModel, OrderStatus} from "@/api/model/order.ts";
import React, {CSSProperties, useMemo, useState} from "react";
import {calculateOrderTotal} from "@/lib/cart.ts";
import {withCurrency} from "@/lib/utils.ts";
import {Button} from "@/components/common/input/button.tsx";
import {OrderPayment} from "@/components/orders/order.payment.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import {OrderHeader} from "@/components/orders/order.header.tsx";
import {OrderTimes} from "@/components/orders/order.times.tsx";
import {faEllipsisV, faCodeBranch, faCreditCard, faPrint, faChair, faMoneyBillTransfer, faObjectGroup} from "@fortawesome/free-solid-svg-icons";
import {OrderItemName} from "@/components/common/order/order.item.tsx";
import {Dropdown, DropdownItem, DropdownSeparator} from "@/components/common/react-aria/dropdown.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {dispatchPrint} from "@/lib/print.service";
import {PRINT_TYPE} from "@/lib/print.registry.tsx";
import {DiscountType} from "@/api/model/discount.ts";

interface Props {
  order: OrderModel
}

export const OrderBox = ({
  order
}: Props) => {
  const itemsTotal = calculateOrderTotal(order);
  const [payment, setPayment] = useState(false);

  const total = useMemo(() => {
    const extrasTotal = order?.extras ? order?.extras?.reduce((prev, item) => prev + item.value, 0) : 0;
    return itemsTotal + extrasTotal + Number(order?.tax_amount ?? 0) - Number(order?.discount_amount ?? 0) + Number(order.service_charge_amount ?? 0) + Number(order?.tip_amount ?? 0);
  }, [itemsTotal, order]);

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
          {order?.discount ? (
            <div className="flex">
              <div className="flex-1">Discount</div>
              <div className="text-right">{withCurrency(order?.discount_amount)}</div>
            </div>
          ) : ''}
          {order?.service_charge && order?.service_charge > 0 ? (
            <div className="flex">
              <div className="flex-1">Service charges ({order?.service_charge}%)</div>
              <div className="text-right">{withCurrency(order?.service_charge_amount)}</div>
            </div>
          ) : ''}
          {order?.extras && order?.extras?.map(item => (
            <div className="flex">
              <div className="flex-1">{item.name}</div>
              <div className="text-right">{withCurrency(item.value)}</div>
            </div>
          ))}
          {order?.tip_amount > 0 && (
            <div className="flex">
              <div className="flex-1">Tip {order?.tip_type === DiscountType.Percent ? '%' : ''}</div>
              <div className="text-right">{withCurrency(order?.tip_amount)}</div>
            </div>
          )}
          {order?.payments?.length > 0 && (
            <div className="separator h-[2px]" style={{'--size': '10px', '--space': '5px'} as CSSProperties}></div>
          )}
          {order?.payments?.map((item, index) => (
            <div key={index} className="flex">
              <div className="flex-1">{item.payment_type.name}</div>
              <div className="text-right">{withCurrency(item.amount)}</div>
            </div>
          ))}
          <div className="separator h-[2px]" style={{'--size': '10px', '--space': '5px'} as CSSProperties}></div>
          <div className="flex font-bold">
            <div className="flex-1">Total</div>
            <div className="text-right">{withCurrency(total)}</div>
          </div>
        </div>
        <div className="flex gap-5">
          <Dropdown
            label={<><FontAwesomeIcon icon={faEllipsisV} className="mr-3"/> More</>}
            btnSize="lg"
            btnFlat={true}
            className="flex-1"
            onAction={(key) => {
              if (key === 'temp_bill') {
                dispatchPrint(PRINT_TYPE.presale_bill, {
                  order: order
                });
              }

              if (key === 'final_bill') {
                dispatchPrint(PRINT_TYPE.final_bill, {
                  order: order,
                  duplicate: true
                });
              }
            }}
          >
            {order.status === OrderStatus["In Progress"] && (
              <>
                <DropdownItem id="cancel" key={order.id} className="min-w-[50px] bg-danger-100 text-danger-500">
                  <FontAwesomeIcon icon={faMoneyBillTransfer} /> Cancel order
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem id="split_by_seats" key={order.id} className="min-w-[50px]">
                  <FontAwesomeIcon icon={faChair} /> Split by seats
                </DropdownItem>
                <DropdownItem id="split_manually" key={order.id} className="min-w-[50px]">
                  <FontAwesomeIcon icon={faCodeBranch} /> Split Manually
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem id="merge" key={order.id} className="min-w-[50px]">
                  <FontAwesomeIcon icon={faObjectGroup} /> Merge orders
                </DropdownItem>
              </>
            )}

            {order.status === OrderStatus["Paid"] && (
              <>
                <DropdownItem id="refund" key={order.id} className="min-w-[50px] bg-danger-100 text-danger-500">
                  <FontAwesomeIcon icon={faMoneyBillTransfer} /> Refund
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem id="final_bill" key={order.id} className="min-w-[50px]">
                  <FontAwesomeIcon icon={faPrint} /> Print final bill copy
                </DropdownItem>
              </>
            )}
          </Dropdown>
          {order.status === OrderStatus["In Progress"] && (
            <>
              <Button onClick={() => {
                dispatchPrint(PRINT_TYPE.presale_bill, {
                  order: order
                });
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
    </>
  );
}
