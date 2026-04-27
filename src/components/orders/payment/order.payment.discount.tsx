import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { Discount, DiscountType } from "@/api/model/discount.ts";
import { withCurrency } from "@/lib/utils.ts";

interface Props {
  discount?: Discount
  setDiscount: (discount?: Discount) => void
  discountAmount: number
  setDiscountAmount: (d: any) => void
  itemsTotal: number
  discountRate: number
  setDiscountRate: (rate?: number) => void
}

export const OrderPaymentDiscount = ({
  discount, setDiscount, setDiscountAmount, itemsTotal, discountAmount, setDiscountRate, discountRate
}: Props) => {

  const {
    data: discounts
  } = useApi<SettingsData<Discount>>(Tables.discounts, [], ['priority asc'], 0, 99999);

  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];

  const [keyboard, setKeyboard] = useState(false);
  const [percentInput, setPercentInput] = useState<number | undefined>(undefined);

  const addDiscount = (discount: Discount) => {
    setKeyboard(false);
    setDiscount(discount);
    setDiscountAmount(discount.min_rate);
    setDiscountRate(discount.min_rate);

    if(discount.type === DiscountType.Fixed){
      if(discount.min_rate === discount.max_rate){
        setDiscountAmount(discount.min_rate);

        setDiscountRate(discount.min_rate);
      }else{
        setKeyboard(true);
        setPercentInput(undefined);
      }
    }else if(discount.type === DiscountType.Percent){
      if(discount.min_rate === discount.max_rate){
        setDiscountAmount(discount.min_rate * itemsTotal / 100);
        setPercentInput(undefined);

        setDiscountRate(discount.min_rate);
      }else{
        setKeyboard(true);
        setPercentInput(discount.min_rate);
      }
    }
  }

  const manualDiscount = (key: number|string) => {
    if (discount?.type === DiscountType.Percent && discount.min_rate !== discount.max_rate) {
      setPercentInput((prev: number | undefined) => {
        const base = prev === undefined || prev === null ? '' : prev.toString();
        return Number(base + key);
      });

      setDiscountRate(Math.min(Number(discountRate.toString() + key), discount.max_rate));
    } else {
      setDiscountAmount((prev: number) => {
        return Number(prev.toString() + key);
      });
    }
  }

  useEffect(() => {
    console.log(discountRate, discount, percentInput, itemsTotal)
    if(discount){
      const hasVariableRates = discount.min_rate !== discount.max_rate;
      let dValue: number;

      if(discount.type === DiscountType.Percent){
        const rate = discountRate ? discountRate : (
          hasVariableRates ? (percentInput ?? 0) : discount.min_rate
        );

        dValue = rate * itemsTotal / 100;
      }else{
        dValue = discountAmount;
      }

      let finalDiscount = dValue;
      if (hasVariableRates && (discount.max_cap ?? undefined) !== undefined) {
        finalDiscount = Math.min(finalDiscount, discount.max_cap as number);
      }

      if(discount.type === DiscountType.Fixed) {
        finalDiscount = Math.min(finalDiscount, itemsTotal, discount.max_rate);
      }else{
        finalDiscount = Math.min(finalDiscount, itemsTotal);
      }

      setDiscountAmount(finalDiscount);
    }
  }, [discountAmount, discount, itemsTotal, percentInput, discountRate]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <Button
          className="min-w-[150px]"
          variant="danger"
          active={discount === undefined}
          onClick={() => {
            setDiscount(undefined);
            setDiscountAmount(0);
            setKeyboard(false);
          }}
          size="lg"
        >
          No discount
        </Button>
        <div className="flex gap-5 flex-wrap">
          {discounts?.data?.map(item => (
            <Button
              className="min-w-[150px]"
              variant="primary"
              active={item.id.toString() === discount?.id.toString()}
              key={item.id}
              onClick={() => {
                addDiscount(item);
              }}
              size="lg"
            >
              {item.name}{' '}
              {/*({item.min_rate === item.max_rate ? (item.type === DiscountType.Fixed ? withCurrency(item.min_rate) : item.min_rate) : `${item.min_rate} - ${item.max_rate}`}*/}
              {/*{item.type === DiscountType.Percent && '%'})*/}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-2xl text-center">
        {withCurrency(discountAmount)}{' '}
        {discount && discount.type === DiscountType.Percent && (
          <>({discountRate}%)</>
        )}
      </div>

      <div className="text-2xl text-center">
        {discount && (
          <>
            Discount {discount.min_rate === discount.max_rate ? (discount.type === DiscountType.Fixed ? withCurrency(discount.min_rate) : discount.min_rate) : `${discount.min_rate} - ${discount.max_rate}`}
            {discount.type === DiscountType.Percent && '%'}{' '}
            {!!discount.max_cap && `with max cap of ${withCurrency(discount.max_cap)}`}
          </>
        )}
      </div>
      <div>
        {keyboard && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {keyboardKeys.map(item => (
              <Button key={item} size="xl" flat variant="primary" onClick={() => manualDiscount(item)}>
                {item}
              </Button>
            ))}
            <Button size="xl" flat variant="primary" onClick={() => {
              setDiscountAmount(0);
              setPercentInput(undefined);
              setDiscountRate(0);
            }}>
              C
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
