import { Order } from "@/api/model/order.ts";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { OrderHeader } from "@/components/orders/order.header.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { OrderTimes } from "@/components/orders/order.times.tsx";
import { useOrderTotal } from "@/lib/cart.ts";
import { cn, withCurrency } from "@/lib/utils.ts";
import { OrderPaymentReceiving } from "@/components/orders/payment/order.payment.receiving.tsx";
import { OrderPaymentTax } from "@/components/orders/payment/order.payment.tax.tsx";
import { Tax } from "@/api/model/tax.ts";
import { Discount } from "@/api/model/discount.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { OrderPaymentDiscount } from "@/components/orders/payment/order.payment.discount.tsx";
import { OrderPaymentServiceCharges } from "@/components/orders/payment/order.payment.service_charges.tsx";

interface Props {
  order: Order
  onClose: () => void
}

enum PaymentOptions {
  Payment = 'Payment',
  Discount = 'Discount',
  Coupon = 'Coupon',
  Tax = 'Tax',
  'Service Charges' = 'Service Charges'
}

export const OrderPayment = ({
  order, onClose
}: Props) => {
  const closeModal = () => {
    onClose();
  }

  const itemsTotal = useOrderTotal(order);
  const [posFee, setPosFee] = useState(1);

  const [tax, setTax] = useState<Tax>();
  const [taxAmount, setTaxAmount] = useState(0);

  const [discount, setDiscount] = useState<Discount>();
  const [discountAmount, setDiscountAmount] = useState(0);

  const [paymentType, setPaymentType] = useState<PaymentType>();

  const [serviceCharge, setServiceCharge] = useState(0);
  const [serviceChargeAmount, setServiceChargeAmount] = useState(0);

  useEffect(() => {
    if(tax){
      setTaxAmount(itemsTotal * tax.rate / 100)
    }else{
      setTaxAmount(0);
    }
  }, [tax, itemsTotal]);

  useEffect(() => {
    if(discount){
      setDiscountAmount(itemsTotal * discount.rate / 100)
    }else{
      setDiscountAmount(0);
    }
  }, [discount, itemsTotal]);

  useEffect(() => {
    if(serviceCharge){
      setServiceChargeAmount(itemsTotal * serviceCharge / 100)
    }else{
      setServiceChargeAmount(0);
    }
  }, [serviceCharge, itemsTotal]);

  const total = useMemo(() => {
    return itemsTotal + posFee + taxAmount + serviceChargeAmount - discountAmount;
  }, [itemsTotal, posFee, taxAmount, discountAmount, serviceChargeAmount]);

  const [mode, setMode] = useState(PaymentOptions.Payment);


  return (
    <Modal
      title={`Order#${order.invoice_number}`}
      open={true}
      onClose={closeModal}
    >
      <div className="grid grid-cols-2 ga-3">
        <div className="bg-neutral-100 rounded-xl flex gap-5 flex-col">
          <div className="p-3 flex gap-5 flex-col">
            <OrderHeader order={order}/>
            <OrderTimes order={order}/>
            <div className="separator h-[2px]" style={{ '--size': '10px', '--space': '5px' } as CSSProperties}></div>
            <ScrollContainer className="gap-1 flex flex-col">
              <div className="overflow-ellipsis max-h-[450px]">
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
          </div>
          <div className="flex flex-col font-bold text-lg">
            <div className="flex justify-between p-3">
              <div>Items ({order.items.length})</div>
              <div className="text-right">{withCurrency(itemsTotal)}</div>
            </div>
            <div className={
              cn(
                "flex justify-between p-3",
                mode === PaymentOptions.Tax && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Tax)}>
              <div>Tax</div>
              <div className="text-right">{withCurrency(taxAmount)}</div>
            </div>

            <div className={
              cn(
                "flex justify-between p-3",
                mode === PaymentOptions.Discount && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Discount)}>
              <div>Discount</div>
              <div className="text-right">{withCurrency(discountAmount)}</div>
            </div>

            <div className={
              cn(
                "flex justify-between p-3",
                mode === PaymentOptions['Service Charges'] && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions['Service Charges'])}>
              <div>Service charges ({serviceCharge}%)</div>
              <div className="text-right">{withCurrency(serviceChargeAmount)}</div>
            </div>

            <div className="flex justify-between p-3">
              <div>POS Fee</div>
              <div className="text-right">{withCurrency(posFee)}</div>
            </div>

            <div className={
              cn(
                "flex justify-between p-3",
                mode === PaymentOptions.Payment && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Payment)}>
              <div className="text-2xl">Total</div>
              <div className="text-right text-2xl">{withCurrency(total)}</div>
            </div>
          </div>
        </div>
        <div className="flex px-3 flex-col">
          {mode === PaymentOptions.Payment && (
            <OrderPaymentReceiving order={order} total={total} onComplete={closeModal} posFee={posFee}/>
          )}
          {mode === PaymentOptions.Tax && (
            <OrderPaymentTax tax={tax} setTax={setTax}/>
          )}
          {mode === PaymentOptions.Discount && (
            <OrderPaymentDiscount discount={discount} setDiscount={setDiscount} />
          )}
          {mode === PaymentOptions['Service Charges'] && (
            <OrderPaymentServiceCharges
              serviceCharge={serviceCharge}
              setServiceCharge={setServiceCharge}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
