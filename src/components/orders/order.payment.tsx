import {Order} from "@/api/model/order.ts";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import {OrderHeader} from "@/components/orders/order.header.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import {OrderTimes} from "@/components/orders/order.times.tsx";
import {calculateOrderTotal} from "@/lib/cart.ts";
import {cn, formatNumber, withCurrency} from "@/lib/utils.ts";
import {OrderPaymentReceiving} from "@/components/orders/payment/order.payment.receiving.tsx";
import {OrderPaymentTax} from "@/components/orders/payment/order.payment.tax.tsx";
import {Tax} from "@/api/model/tax.ts";
import {Discount, DiscountType} from "@/api/model/discount.ts";
import {OrderPaymentDiscount} from "@/components/orders/payment/order.payment.discount.tsx";
import {OrderPaymentServiceCharges} from "@/components/orders/payment/order.payment.service_charges.tsx";
import {OrderPaymentTip} from "@/components/orders/payment/order.payment.tip.tsx";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {OrderPayment as OrderPaymentModal} from "@/api/model/order_payment.ts";
import {dispatchPrint} from "@/lib/print.service.ts";
import {PRINT_TYPE} from "@/lib/print.registry.tsx";
import {useDB} from "@/api/db/db.ts";
import {OrderPaymentNotes} from "@/components/orders/payment/order.payment.notes.tsx";
import {getOrderFilteredItems} from "@/lib/order.ts";
import {useAtom} from "jotai";
import {appPage} from "@/store/jotai.ts";
import {Tables} from "@/api/db/tables.ts";

interface Props {
  order: Order
  onClose: () => void
}

enum PaymentOptions {
  Payment = 'Payment',
  Discount = 'Discount',
  Coupon = 'Coupon',
  Tax = 'Tax',
  'Service Charges' = 'Service Charges',
  Tip = 'Tip',
  Notes = 'Notes'
}

const extraItems = {
  'POS Fee': 1,
};

export const OrderPayment = ({
  order, onClose
}: Props) => {
  const db = useDB();
  const [page] = useAtom(appPage);

  const closeModal = () => {
    onClose();
  }

  const itemsTotal = calculateOrderTotal(order);
  const [extras, setExtras] = useState(extraItems);

  const [paymentTypes, setPaymentTypes] = useState<OrderPaymentModal[]>(order?.payments ?? []);

  const [tax, setTax] = useState<Tax>(order?.tax);
  const [taxAmount, setTaxAmount] = useState(order?.tax_amount);

  const [discount, setDiscount] = useState<Discount>(order?.discount);
  const [discountAmount, setDiscountAmount] = useState(order?.discount_amount);

  const [serviceCharge, setServiceCharge] = useState(order?.service_charge);
  const [serviceChargeAmount, setServiceChargeAmount] = useState(order?.service_charge_amount);
  const [serviceChargeType, setServiceChargeType] = useState<DiscountType>(order?.service_charge_type === DiscountType.Fixed ? DiscountType.Fixed : DiscountType.Percent);

  const [tip, setTip] = useState(order?.tip);
  const [tipType, setTipType] = useState<DiscountType>(order?.tip_type === DiscountType.Fixed ? DiscountType.Fixed : DiscountType.Percent);
  const [tipAmount, setTipAmount] = useState(order?.tip_amount);

  const [notes, setNotes] = useState(order?.notes);

  useEffect(() => {
    if(tax){
      setTaxAmount(itemsTotal * tax.rate / 100)
    }else{
      setTaxAmount(0);
    }
  }, [tax, itemsTotal]);

  useEffect(() => {
    if(tipType === DiscountType.Fixed){
      setTipAmount(tip);
    }else{
      setTipAmount(itemsTotal * tip / 100);
    }
  }, [tip, itemsTotal, tipType]);

  useEffect(() => {
    if(serviceCharge){
      setServiceChargeAmount(
        serviceChargeType === DiscountType.Percent ?
          itemsTotal * serviceCharge / 100 :
          serviceCharge
      )
    }else{
      setServiceChargeAmount(0);
    }
  }, [serviceCharge, itemsTotal, serviceChargeType]);

  const total = useMemo(() => {
    const extrasTotal = Object.values(extras).reduce((prev, item) => prev + item, 0);
    return itemsTotal + extrasTotal + taxAmount + serviceChargeAmount - discountAmount + tipAmount;
  }, [itemsTotal, taxAmount, discountAmount, serviceChargeAmount, extras, tipAmount]);

  const [mode, setMode] = useState(PaymentOptions.Tax);

  const print = async () => {
    // fetch latest order from database
    const o = await db.query<Order>(`select * from ${order.id} fetch items, items.item, item.item.modifiers, table, user, order_type, customer, discount, tax, payments, payments.payment_type, extras, extras.order_extras`);

    await dispatchPrint(db, PRINT_TYPE.final_bill, {
      order: o[0][0],
    }, { userId: page?.user?.id });
  }

  const onPayment = () => {
    closeModal();

    setTimeout(() => {
      print();
    }, 300)
  }

  const saveOrderProgress = async () => {
    // remove previously attached payments
    for(const payment of order?.payments ?? []){
      await db.delete(payment.id);
    }

    const orderPayments = [];
    for (const payment of paymentTypes) {
      const [orderPayment] = await db.create(Tables.order_payment, {
        amount: payment.amount,
        payment_type: payment.payment_type.id,
        comments: '',
        payable: total
      });

      orderPayments.push(orderPayment.id);
    }

    // remove previously attached extras from order
    for(const ext of order?.extras ?? []){
      await db.delete(ext.id);
    }

    const extraOptions = [];
    for (const extra of Object.keys(extras)) {
      const [record] = await db.create(Tables.order_extras, {
        name: extra,
        value: extras[extra]
      });

      extraOptions.push(record.id);
    }

    console.log(tax?.id, discount?.id)

    await db.merge(order.id, {
      payments: orderPayments,
      extras: extraOptions,
      tax: tax?.id,
      tax_amount: taxAmount,
      discount: discount?.id,
      discount_amount: discountAmount,
      tip: tip,
      tip_amount: tipAmount,
      tip_type: tipType,
      service_charge: serviceCharge,
      service_charge_amount: serviceChargeAmount,
      service_charge_type: serviceChargeType,
      notes: notes,
    });
  }

  useEffect(() => {
    saveOrderProgress();
  }, [
    paymentTypes, tax, taxAmount, discount, discountAmount, tip, tipAmount, tipType, serviceCharge, serviceChargeAmount,
    serviceChargeType, notes
  ]);

  return (
    <Modal
      title={`Order#${order.invoice_number}`}
      open={true}
      onClose={closeModal}
      size="full"
    >
      <div className="grid grid-cols-4 gap-5 mb-5 select-none">
        <div className="bg-white rounded-xl flex flex-col overflow-auto h-[calc(100vh_-_150px)]">
          <div className="p-3 flex gap-3 flex-col">
            <OrderHeader order={order}/>
            <OrderTimes order={order}/>
            <div className="separator h-[2px]" style={{'--size': '10px', '--space': '5px'} as CSSProperties}></div>
            <ScrollContainer className="gap-1 flex flex-col">
              <div className="overflow-ellipsis max-h-[250px]">
                {getOrderFilteredItems(order).map(item => (
                  <div className="flex gap-3 hover:bg-neutral-100" key={item.id}>
                    <div className="flex-1 whitespace-break-spaces">{item.item.name}</div>
                    <div className="text-right w-[50px] flex-shrink-0">{formatNumber(item.quantity)}</div>
                    <div className="text-right w-[80px] flex-shrink-0">{formatNumber(item.price)}</div>
                  </div>
                ))}
              </div>
            </ScrollContainer>
            <div className="separator h-[2px]" style={{'--size': '10px', '--space': '5px'} as CSSProperties}></div>
          </div>
          <div className="flex flex-col font-bold text-lg">
            <div className="flex justify-between p-3">
              <div>Items ({getOrderFilteredItems(order).length})</div>
              <div className="text-right">{withCurrency(itemsTotal)}</div>
            </div>
            <div className={
              cn(
                "flex justify-between p-3 cursor-pointer",
                mode === PaymentOptions.Tax && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Tax)}>
              <div>
                Tax {tax && <>({tax.name} {tax.rate}%)</>} <FontAwesomeIcon icon={faPencil}/>
              </div>
              <div className="text-right">{withCurrency(taxAmount)}</div>
            </div>

            <div className={
              cn(
                "flex justify-between p-3 cursor-pointer",
                mode === PaymentOptions.Discount && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Discount)}>
              <div>
                Discount <FontAwesomeIcon icon={faPencil}/>
              </div>
              <div className="text-right">{withCurrency(discountAmount)}</div>
            </div>

            <div className={
              cn(
                "flex justify-between p-3 cursor-pointer",
                mode === PaymentOptions['Service Charges'] && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions['Service Charges'])}>
              <div>Service charges ({serviceCharge}{serviceChargeType === DiscountType.Percent ? '%' : ''}) <FontAwesomeIcon icon={faPencil}/></div>
              <div className="text-right">{withCurrency(serviceChargeAmount)}</div>
            </div>

            <div className={
              cn(
                "flex justify-between p-3 cursor-pointer",
                mode === PaymentOptions.Tip && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Tip)}>
              <div>Tip ({tip}{tipType === DiscountType.Percent && '%'}) <FontAwesomeIcon icon={faPencil}/></div>
              <div className="text-right">{withCurrency(tipAmount)}</div>
            </div>

            {Object.keys(extras).map(extra => (
              <div
                className={
                  cn(
                    "flex justify-between p-3 cursor-pointer",
                    extras[extra] === 0 ? 'line-through decoration-2' : ''
                  )
                }
                key={extra}
                onClick={() => {
                  setExtras(prev => ({
                    ...prev,
                    [extra]: extras[extra] === 0 ? extraItems[extra] : 0
                  }))
                }}
              >
                <div>{extra}</div>
                <div className="text-right">{withCurrency(extras[extra])}</div>
              </div>
            ))}
            <div className={
              cn(
                "flex justify-between p-3 cursor-pointer",
                mode === PaymentOptions.Notes && 'bg-neutral-900 text-warning-500'
              )
            } onClick={() => setMode(PaymentOptions.Notes)}>
              <div>Notes <FontAwesomeIcon icon={faPencil}/></div>
              <div className="text-right">{notes}</div>
            </div>

            <div className="flex justify-between p-3">
              <div className="text-2xl">Total</div>
              <div className="text-right text-2xl">{withCurrency(total)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl flex flex-col p-3 h-[calc(100vh_-_150px)]">
          {mode === PaymentOptions.Tax && (
            <OrderPaymentTax tax={tax} setTax={setTax}/>
          )}
          {mode === PaymentOptions.Discount && (
            <OrderPaymentDiscount
              discount={discount} setDiscount={setDiscount}
              discountAmount={discountAmount} setDiscountAmount={setDiscountAmount}
              itemsTotal={itemsTotal}
            />
          )}
          {mode === PaymentOptions['Service Charges'] && (
            <OrderPaymentServiceCharges
              serviceCharge={serviceCharge}
              setServiceCharge={setServiceCharge}
              setServiceChargeType={setServiceChargeType}
              serviceChargeType={serviceChargeType}
            />
          )}
          {mode === PaymentOptions.Tip && (
            <OrderPaymentTip tip={tip} setTip={setTip} tipType={tipType} setTipType={setTipType}/>
          )}
          {mode === PaymentOptions.Notes && (
            <OrderPaymentNotes setNotes={setNotes} notes={notes} />
          )}
        </div>
        <div className="flex flex-col bg-neutral-100 rounded-xl col-span-2">
          <OrderPaymentReceiving
            order={order}
            total={total}
            onComplete={onPayment}
            extras={extras}
            setTax={setTax}
            discountAmount={discountAmount}
            discount={discount}
            setDiscount={setDiscount}
            setDiscountAmount={setDiscountAmount}
            tax={tax}
            taxAmount={taxAmount}
            tip={tip}
            tipAmount={tipAmount}
            tipType={tipType}
            payments={paymentTypes}
            setPayments={setPaymentTypes}
            itemsTotal={itemsTotal}
            serviceChargeAmount={serviceChargeAmount}
            setServiceChargeAmount={setServiceChargeAmount}
            serviceCharge={serviceCharge}
            serviceChargeType={serviceChargeType}
            notes={notes}
          />
        </div>
      </div>
    </Modal>
  )
}
