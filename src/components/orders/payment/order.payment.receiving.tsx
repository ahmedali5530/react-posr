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
import {useAtom} from "jotai";
import {appAlert, appPage} from "@/store/jotai.ts";
import {dispatchPrint} from "@/lib/print.service.ts";
import {PRINT_TYPE} from "@/lib/print.registry.tsx";
import {StringRecordId} from "surrealdb";

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
  setDiscount?: (discount?: Discount) => void
  setDiscountAmount?: (amount: number) => void

  tip: number
  tipType?: DiscountType
  tipAmount: number

  payments: OrderPayment[]
  setPayments: (paymentType: OrderPayment[] | ((prev: OrderPayment[]) => OrderPayment[])) => void;

  itemsTotal: number

  setServiceChargeAmount: (amt: number) => void
  serviceChargeAmount: number
  serviceCharge: number
  serviceChargeType: DiscountType

  notes: string
}

export const OrderPaymentReceiving = ({
  total, order, onComplete, extras, setTax, tax, taxAmount, discount, discountAmount, setDiscount, setDiscountAmount, tipType, tip, tipAmount,
  payments, setPayments, itemsTotal, serviceChargeAmount, serviceCharge, serviceChargeType, notes
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
  const [page, setPage] = useAtom(appPage);

  const closeOrder = async () => {
    setClosing(true);

    try {
      // create payment
      const orderPayments = [];
      for (const payment of payments) {
        const orderPayment = await db.create(Tables.order_payment, {
          amount: payment.amount,
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
        tip_type: tipType,
        service_charge: serviceCharge,
        service_charge_amount: serviceChargeAmount,
        service_charge_type: serviceChargeType,
        cashier: new StringRecordId(page?.user?.id.toString()),
        notes: notes
      });

      onComplete();
    } catch (e) {
      throw e;
    } finally {
      setClosing(false);
    }
  }

  const [selectedAmount, setSelectedAmount] = useState('');

  // Track auto-applied discount originating from a payment type
  const [autoDiscountMeta, setAutoDiscountMeta] = useState<{
    paymentTypeId?: string
    discountId?: string
  }>();

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

  const addPayment = (amount: string|number, paymentType: PaymentType, payable: number) => {
    if(amount.toString().length === 0){
      return;
    }

    // Compute change due relative to this payable (may include tax for selected payment type)
    const localChangeDue = tendered - payable;

    if(paymentType.type === 'Card' && localChangeDue >= 0){
      setAlert(prev => ({
        ...prev,
        opened: true,
        type: 'error',
        message: 'Cannot add more payment for card'
      }));

      return;
    }

    if(paymentType.type === 'Card' && Number(amount) > Number(-1 * localChangeDue)){
      setAlert(prev => ({
        ...prev,
        opened: true,
        type: 'warning',
        message: 'Added exact amount for card based payment'
      }));

      amount = -1 * localChangeDue;
    }

    setPayments(prev => [
      ...prev,
      {
        payment_type: paymentType,
        amount: Number(amount),
        payable: payable,
        id: nanoid()
      }
    ])
    setSelectedAmount('');
  }

  const calculateTotal = (taxRate: number, overrideDiscountAmount?: number) => {
    const txAmount = itemsTotal * taxRate / 100;
    const extrasTotal = Object.values(extras).reduce((prev, item) => prev + item, 0);
    const effectiveDiscount = overrideDiscountAmount !== undefined ? overrideDiscountAmount : (discountAmount ?? 0);
    return itemsTotal + extrasTotal + txAmount + serviceChargeAmount - effectiveDiscount + tipAmount;
  }

  // Determine highest tax among existing payments, optionally considering a candidate tax
  const getHighestTaxRate = (candidateRate?: number) => {
    const existingRates = payments
      .filter(p => !!p.payment_type.tax)
      .map(p => (p.payment_type.tax as Tax).rate);
    const currentMax = existingRates.length > 0 ? Math.max(...existingRates) : 0;
    return candidateRate === undefined ? currentMax : Math.max(currentMax, candidateRate);
  }

  const getHighestTaxObject = (candidate?: Tax): Tax | undefined => {
    const existingTaxes = payments
      .filter(p => !!p.payment_type.tax)
      .map(p => p.payment_type.tax as Tax);
    let highest: Tax | undefined = existingTaxes.length > 0
      ? existingTaxes.reduce((acc, t) => (acc.rate >= t.rate ? acc : t))
      : undefined;
    if(candidate){
      if(!highest || candidate.rate >= highest.rate){
        highest = candidate;
      }
    }
    return highest;
  }

  const selectBestDiscount = (discounts?: Discount[]): Discount | undefined => {
    if(!discounts || discounts.length === 0){
      return undefined;
    }
    // Prefer lowest priority value if provided, fallback to first
    const withPriority = discounts.filter(d => (d as any).priority !== undefined) as (Discount & {priority: number})[];
    if(withPriority.length > 0){
      return withPriority.sort((a,b) => a.priority - b.priority)[0];
    }
    return discounts[0];
  }

  const computeDiscountAmountFor = (d?: Discount): number => {
    if(!d){
      return 0;
    }
    const hasVariableRates = (d.min_rate ?? 0) !== (d.max_rate ?? 0);
    let computed = 0;
    if(d.type === DiscountType.Percent){
      // Use min_rate as default for auto-apply if variable
      const rate = hasVariableRates ? (d.min_rate ?? 0) : (d.min_rate ?? 0);
      computed = (rate * itemsTotal) / 100;
    }else{ // Fixed
      const base = d.min_rate ?? 0;
      computed = base;
    }
    if(d.max_cap !== undefined && d.max_cap !== null){
      computed = Math.min(computed, d.max_cap);
    }
    // Never exceed itemsTotal
    computed = Math.min(computed, itemsTotal);
    return computed;
  }

  const clearAutoDiscountIfNeeded = (newPaymentTypeId?: string) => {
    if(autoDiscountMeta?.paymentTypeId && autoDiscountMeta.paymentTypeId !== newPaymentTypeId){
      setDiscount && setDiscount(undefined);
      setDiscountAmount && setDiscountAmount(0);
      setAutoDiscountMeta(undefined);
    }
  }

  const applyPaymentTypeDiscountIfAny = (paymentType: PaymentType): number => {
    clearAutoDiscountIfNeeded(paymentType.id.toString());
    const d = selectBestDiscount(paymentType.discounts);
    const amount = computeDiscountAmountFor(d);
    if(d){
      setDiscount && setDiscount(d);
      setDiscountAmount && setDiscountAmount(amount);
      setAutoDiscountMeta({ paymentTypeId: paymentType.id.toString(), discountId: d.id.toString() });
    }else{
      // If no discount on this PT, and previous was auto, ensure cleared
      if(autoDiscountMeta){
        setDiscount && setDiscount(undefined);
        setDiscountAmount && setDiscountAmount(0);
        setAutoDiscountMeta(undefined);
      }
    }
    return amount;
  }

  return (
    <div className="grid grid-cols-2 gap-5 h-[calc(100vh_-_150px)]">
      <div className="bg-white rounded-xl h-full">
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
          {changeDue < 0 ? 'Remaining' : 'Change'}: {withCurrency(changeDue)}
        </div>
        <div className="relative">
          <ScrollContainer className="gap-3 flex overflow-x-auto mb-5">
          <span
            className="btn btn-primary w-[100px] lg"
            onClick={() => {
              if(!paymentTypes || paymentTypes.length === 0){
                return;
              }
              const pt = paymentTypes[0];
              const hasTax = !!pt.tax;
              const highestTax = hasTax ? getHighestTaxObject(pt.tax) : getHighestTaxObject(undefined);
              if(hasTax){
                setTax && setTax(highestTax);
              }
              const highestRate = hasTax ? (highestTax ? highestTax.rate : 0) : (tax ? tax.rate : getHighestTaxRate());
              const autoDiscountAmount = applyPaymentTypeDiscountIfAny(pt);
              const payable = calculateTotal(highestRate, autoDiscountAmount);
              addPayment(total, pt, payable);
              setMode('quick');
            }}
          >{withCurrency(total)}</span>
            {quickAmounts.reverse().map(item => (
              <span
                key={item}
                className="btn btn-primary w-[100px] lg"
                onClick={() => {
                  if(!paymentTypes || paymentTypes.length === 0){
                    return;
                  }
                  const pt = paymentTypes[0];
                  const hasTax = !!pt.tax;
                  const highestTax = hasTax ? getHighestTaxObject(pt.tax) : getHighestTaxObject(undefined);
                  if(hasTax){
                    setTax && setTax(highestTax);
                  }
                  const highestRate = hasTax ? (highestTax ? highestTax.rate : 0) : (tax ? tax.rate : getHighestTaxRate());
                  const autoDiscountAmount = applyPaymentTypeDiscountIfAny(pt);
                  const payable = calculateTotal(highestRate, autoDiscountAmount);
                  addPayment(item, pt, payable);
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
                // Determine the effective highest tax after choosing this payment type
                const hasTax = !!item.tax;
                const candidateTax = item.tax;
                const highestTax = hasTax ? getHighestTaxObject(candidateTax) : getHighestTaxObject(undefined);
                // Only update global tax when this payment type has a tax attached
                if (hasTax) {
                  setTax && setTax(highestTax);
                }
                // For non-tax payment types, use current order-level tax (or highest among existing payments)
                const highestRate = hasTax
                  ? (highestTax ? highestTax.rate : 0)
                  : (tax ? tax.rate : getHighestTaxRate());

                // Apply discount(s) attached to the payment type (auto)
                const autoDiscountAmount = applyPaymentTypeDiscountIfAny(item);

                const payable = calculateTotal(highestRate, autoDiscountAmount);

                if(selectedAmount.trim().length > 0){
                  // Respect typed amount; add with proper payable (includes highest tax)
                  addPayment(selectedAmount, item, payable)
                }else if(changeDue < 0) {
                  // No typed amount: auto-fill remaining for convenience
                  const remaining = payable - tendered;
                  const amt = remaining.toString();
                  setSelectedAmount(amt);
                  addPayment(amt, item, payable)
                }else {
                  // Nothing typed and no remaining due – do nothing (card will be blocked inside addPayment)
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
              <Button
                variant="primary"
                className="flex-1"
                flat
                icon={faPrint}
                size="lg"
                onClick={() => {
                  dispatchPrint(PRINT_TYPE.presale_bill, {
                    order: order
                  });
                }}
              >Temp bill</Button>
              <Button
                variant="success"
                className="flex-1"
                filled
                size="lg"
                onClick={closeOrder}
                disabled={changeDue < 0 || closing}
                flat
              >Complete</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-3 bg-white rounded-xl h-full">
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
