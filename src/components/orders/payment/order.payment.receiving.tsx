import ScrollContainer from "react-indiana-drag-scroll";
import { Button } from "@/components/common/input/button.tsx";
import { cn, withCurrency } from "@/lib/utils.ts";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useMemo, useState } from "react";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order, OrderStatus } from "@/api/model/order.ts";
import { useDB } from "@/api/db/db.ts";
import { Table } from "@/api/model/table.ts";
import { Tax } from "@/api/model/tax.ts";
import { Discount, DiscountType } from "@/api/model/discount.ts";

interface Props {
  order: Order
  total: number
  onComplete: () => void

  extras: Record<string, number>

  setTax?: (tax?: Tax) => void;
  tax?: Tax
  taxAmount?: number

  discount?: Discount
  discountAmount?: number

  tip: number
  tipType?: DiscountType
  tipAmount: number

  paymentType?: PaymentType
  setPaymentType: (paymentType?: PaymentType) => void;
}

export const OrderPaymentReceiving = ({
  total, order, onComplete, extras, setTax, tax, taxAmount, discount, discountAmount, tipType, tip, tipAmount,
  paymentType, setPaymentType
}: Props) => {
  const db = useDB();

  const {
    data: allPaymentTypes
  } = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], ['priority asc'], 0, 99999, ['tax', 'discounts']);

  const {
    data: table
  } = useApi<SettingsData<Table>>(order.table.id as unknown as string, [], [], 0, 1, ['payment_types', 'payment_types.tax', 'payment_types.discounts']);

  const paymentTypes = useMemo(() => {
    if( table?.data?.[0]?.payment_types && table?.data?.[0]?.payment_types?.length > 0 ) {
      return table?.data?.[0]?.payment_types;
    }

    return allPaymentTypes?.data;
  }, [table, allPaymentTypes]);

  // const [paymentType, setPaymentType] = useState<string>();
  const [mode, setMode] = useState<'quick' | 'button'>('quick');

  const [tendered, setTendered] = useState(total);
  const quickAmounts = [5, 10, 20, 50, 100, 500, 1000, 5000];
  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];

  const [closing, setClosing] = useState(false);

  const closeOrder = async () => {
    setClosing(true);

    try {
      // create payment
      const orderPayment = await db.create(Tables.order_payment, {
        amount: tendered,
        payment_type: paymentType.id,
        comments: '',
        payable: total
      });

      const extraOptions = [];
      for ( const extra of Object.keys(extras) ) {
        const record = await db.create(Tables.order_extras, {
          name: extra,
          value: extras[extra]
        });

        extraOptions.push(record[0].id);
      }


      await db.merge(order.id, {
        status: OrderStatus.Paid,
        payments: [orderPayment[0].id],
        extras: extraOptions,
        tax: tax?.id,
        tax_amount: taxAmount,
        discount: discount?.id,
        discount_amount: discountAmount,
        tip: tip,
        tip_amount: tipAmount,
        tip_type: tipType
      });

      onComplete();
    } catch ( e ) {
      throw e;
    } finally {
      setClosing(false);
    }
  }

  useEffect(() => {
    if( paymentTypes?.length > 0 && paymentType === undefined ) {
      setPaymentType(paymentTypes[0]);
    }

    if( paymentType ) {
      const pt = paymentTypes?.find(item => item.id === paymentType?.id);
      if( pt && pt.tax ) {
        setTax && setTax(pt.tax);
      } else {
        // setTax && setTax(undefined);
      }
    }
  }, [setTax, paymentTypes, paymentType]);

  const changeDue = useMemo(() => {
    return tendered - total;
  }, [total, tendered]);

  const isCash = useMemo(() => {
    return paymentTypes?.find(item => item.id === paymentType?.id)?.type === 'Cash'
  }, [paymentTypes, paymentType]);

  useEffect(() => {
    // if(!isCash){
    setTendered(total);
    // }
  }, [isCash, total]);

  return (
    <>
      <ScrollContainer className="gap-5 flex overflow-x-auto mb-5">
        {paymentTypes?.map(item => (
          <Button
            className="min-w-[150px]"
            variant="primary"
            active={item.id === paymentType?.id}
            key={item.id}
            onClick={() => setPaymentType(item)}
            size="lg"
          >
            {item.name}
          </Button>
        ))}
      </ScrollContainer>

      <div className="mb-3 text-5xl p-5 text-center">
        {withCurrency(tendered)}
      </div>
      <div className={
        cn(
          "mb-3 text-3xl p-5 text-center",
          changeDue < 0 && 'text-danger-700',
          changeDue > 0 && 'text-success-700'
        )
      }>
        Change: {withCurrency(changeDue)}
      </div>
      <div className="relative">
        <ScrollContainer className="gap-3 flex overflow-x-auto mb-5">
          <span
            className="btn btn-primary w-[100px] lg"
            onClick={() => {
              setTendered(total);
              setMode('quick');
            }}
          >{withCurrency(total)}</span>
          {quickAmounts.reverse().map(item => (
            <span
              key={item}
              className="btn btn-primary w-[100px] lg"
              onClick={() => {
                setTendered(item);
                setMode('quick');
              }}
            >{withCurrency(item)}</span>
          ))}
        </ScrollContainer>
        {!isCash && <div className="payment-disabled absolute w-full z-10 top-0 bg-neutral-100/50 h-[48px]"></div>}
      </div>

      <div className="flex">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {keyboardKeys.map(item => (
              <Button key={item} size="xl" flat variant="primary" onClick={() => {
                if( mode === 'button' ) {
                  setTendered(prev => {
                    return Number(prev.toString() + item)
                  });
                } else {
                  setTendered(Number(item));
                }

                setMode('button');
              }} disabled={!isCash}>
                {item}
              </Button>
            ))}
            <Button size="xl" flat variant="primary" onClick={() => {
              setTendered(0)
            }} disabled={!isCash}>
              C
            </Button>
          </div>
          <div className="flex gap-5">
            <Button variant="primary" className="flex-1" flat icon={faPrint} size="lg">Temp bill</Button>
            <Button
              variant="success"
              className="flex-1"
              filled size="lg"
              onClick={closeOrder}
              disabled={changeDue < 0 || closing}
            >Complete</Button>
          </div>
        </div>
      </div>

    </>
  )
}
