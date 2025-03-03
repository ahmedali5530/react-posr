import ScrollContainer from "react-indiana-drag-scroll";
import {Button} from "@/components/common/input/button.tsx";
import {cn, withCurrency} from "@/lib/utils.ts";
import {faClose, faPrint} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useMemo, useState} from "react";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {PaymentType} from "@/api/model/payment_type.ts";
import {Tables} from "@/api/db/tables.ts";
import {Order, OrderStatus} from "@/api/model/order.ts";
import {useDB} from "@/api/db/db.ts";
import {Table} from "@/api/model/table.ts";
import {Tax} from "@/api/model/tax.ts";
import {Discount, DiscountType} from "@/api/model/discount.ts";
import {OrderPayment} from "@/api/model/order_payment.ts";
import {nanoid} from "nanoid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "sonner";
import {useAtom} from "jotai/index";
import {appAlert} from "@/store/jotai.ts";

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

  payments: OrderPayment[]
  setPayments: (paymentType: OrderPayment[] | ((prev: OrderPayment[]) => OrderPayment[])) => void;
}

export const OrderPaymentReceiving = ({
  total, order, onComplete, extras, setTax, tax, taxAmount, discount, discountAmount, tipType, tip, tipAmount,
  payments, setPayments
}: Props) => {
  const db = useDB();
  const [alert, setAlert] = useAtom(appAlert);

  const {
    data: allPaymentTypes
  } = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], ['priority asc'], 0, 99999, ['tax', 'discounts']);

  const {
    data: table
  } = useApi<SettingsData<Table>>(order.table.id as unknown as string, [], [], 0, 1, ['payment_types', 'payment_types.tax', 'payment_types.discounts']);

  const paymentTypes: PaymentType[] = useMemo(() => {
    if (table?.data?.[0]?.payment_types && table?.data?.[0]?.payment_types?.length > 0) {
      return table?.data?.[0]?.payment_types;
    }

    return allPaymentTypes?.data;
  }, [table, allPaymentTypes]);

  // const [paymentType, setPaymentType] = useState<string>();
  const [mode, setMode] = useState<'quick' | 'button'>('quick');

  const quickAmounts = [5, 10, 20, 50, 100, 500, 1000, 5000];
  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0];

  const [closing, setClosing] = useState(false);

  const closeOrder = async () => {
    setClosing(true);

    try {
      // create payment
      const orderPayments = [];
      for (const payment of payments) {
        const orderPayment = await db.create(Tables.order_payment, {
          amount: tendered,
          payment_type: payment.payment_type.id,
          comments: '',
          payable: total
        });

        orderPayments.push(orderPayment[0].id);
      }


      const extraOptions = [];
      for (const extra of Object.keys(extras)) {
        const record = await db.create(Tables.order_extras, {
          name: extra,
          value: extras[extra]
        });

        extraOptions.push(record[0].id);
      }

      await db.merge(order.id, {
        status: OrderStatus.Paid,
        payments: orderPayments,
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
    } catch (e) {
      throw e;
    } finally {
      setClosing(false);
    }
  }

  const [selectedAmount, setSelectedAmount] = useState('');

  useEffect(() => {
    if (paymentTypes?.length > 0 && payments.length === 0) {
      // setPayments([{
      //   id: nanoid(),
      //   payment_type: paymentTypes[0],
      //   payable: total,
      //   amount: total
      // }]);
    }

    if (payments.length > 0) {
      // find largest tax and apply it
      const paymentsWithTaxes = payments.filter(item => !!item.payment_type.tax);
      console.log(paymentsWithTaxes)
      let tax = null;
      if(paymentsWithTaxes.length > 0){
        paymentsWithTaxes.forEach(pt => {
          if(tax === null){
            tax = pt.payment_type.tax;
          }

          if(tax !== null && tax.rate < pt.payment_type.tax.rate){
            tax = pt.payment_type.tax;
          }
        });

        setTax && setTax(tax);
      }
    }
  }, [setTax, paymentTypes, payments]);

  const tendered = useMemo(() => {
    return payments.reduce((prev, item) => prev + item.amount, 0)
  }, [payments])

  const changeDue = useMemo(() => {
    return tendered - total;
  }, [total, tendered]);

  const addPayment = (amount: string|number, paymentType: PaymentType, total: number) => {
    if(amount.toString().length === 0){
      return;
    }

    if(paymentType.type === 'Card' && changeDue === 0){
      setAlert(prev => ({
        ...prev,
        opened: true,
        type: 'error',
        message: 'Cannot add more payment for card'
      }));

      // toast.warning("Cannot add more payment for card");
      return;
    }

    if(paymentType.type === 'Card' && Number(amount) > Number(-1 * changeDue)){
      setAlert(prev => ({
        ...prev,
        opened: true,
        type: 'warning',
        message: 'Added exact amount for card based payment'
      }));

      // toast.warning("Added exact amount for card based payment");
      amount = -1 * changeDue;
    }

    setPayments(prev => [
      ...prev,
      {
        payment_type: paymentType,
        amount: Number(amount),
        payable: total,
        id: nanoid()
      }
    ])
    setSelectedAmount('');
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
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
              addPayment(total, paymentTypes[0], total);
              setMode('quick');
            }}
          >{withCurrency(total)}</span>
            {quickAmounts.reverse().map(item => (
              <span
                key={item}
                className="btn btn-primary w-[100px] lg"
                onClick={() => {
                  addPayment(item, paymentTypes[0], total);
                  setMode('quick');
                }}
              >{withCurrency(item)}</span>
            ))}
          </ScrollContainer>
          {/*{!isCash && <div className="payment-disabled absolute w-full z-10 top-0 bg-neutral-100/50 h-[48px]"></div>}*/}
        </div>

        <ScrollContainer className="gap-5 flex overflow-x-auto mb-5">
          {paymentTypes?.map(item => (
            <Button
              className="min-w-[150px]"
              variant="primary"
              key={item.id}
              onClick={() => {
                if(selectedAmount.trim().length > 0){
                  addPayment(selectedAmount, item, total)
                }

                if(selectedAmount.trim().length === 0 && changeDue < 0) {
                  addPayment(-1 * changeDue, item, total)
                }
              }}
              size="lg"
            >
              {item.name}
            </Button>
          ))}
        </ScrollContainer>

        <div className="flex justify-center items-center mb-3 text-xl h-[28px]">
          {selectedAmount.trim().length > 0 && selectedAmount}
        </div>

        <div className="flex">
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-3 mb-3">
              {keyboardKeys.map(item => (
                <Button key={item} size="xl" flat variant="primary" onClick={() => {
                  if (mode === 'button') {
                    setSelectedAmount(prev => {
                      return prev + item
                    });
                  } else {
                    setSelectedAmount(item.toString());
                  }

                  setMode('button');
                }}>
                  {item}
                </Button>
              ))}
              <Button size="xl" flat variant="primary" onClick={() => {
                setSelectedAmount('')
              }}>
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
      </div>
      <div className="flex flex-col gap-2 p-3">
        {payments.map(payment => (
          <div
            className="flex justify-between text-lg cursor-pointer"
            key={payment.id}
            onClick={() => {
              setPayments(prev => prev.filter(item => item.id !== payment.id))
            }}
          >
            <strong className="flex gap-3 justify-center items-center">
              <FontAwesomeIcon icon={faClose} className="text-danger-500 p-2 px-3 rounded border border-danger-500" />
              {payment.payment_type.name}
            </strong>
            <span>{withCurrency(payment.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
