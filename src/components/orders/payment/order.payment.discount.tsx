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
}

export const OrderPaymentDiscount = ({
  discount, setDiscount, setDiscountAmount, itemsTotal, discountAmount
}: Props) => {

  const {
    data: discounts
  } = useApi<SettingsData<Discount>>(Tables.discounts, [], ['priority asc'], 0, 99999);

  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];

  const [keyboard, setKeyboard] = useState(false);

  const addDiscount = (discount: Discount) => {
    setKeyboard(false);
    setDiscount(discount);
    setDiscountAmount(discount.min_rate);

    if(discount.type === DiscountType.Fixed){
      if(discount.min_rate === discount.max_rate){
        setDiscountAmount(discount.min_rate);
      }else{
        setKeyboard(true);
      }
    }else if(discount.type === DiscountType.Percent){
      if(discount.min_rate === discount.max_rate){
        setDiscountAmount(discount.min_rate * itemsTotal / 100);
      }else{
        setKeyboard(true);
      }
    }
  }

  const manualDiscount = (key: number|string) => {
    setDiscountAmount((prev: number) => {
      return Number(prev.toString() + key);
    })
  }

  useEffect(() => {
    if(discount && discount?.type === DiscountType.Percent && discount?.max_cap && discountAmount >= discount?.max_cap){
      setDiscountAmount(discount?.max_cap);
    }
  }, [discountAmount, discount]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex gap-5 flex-wrap">
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
        {discounts?.data?.map(item => (
          <Button
            className="min-w-[150px]"
            variant="primary"
            active={item.id === discount?.id}
            key={item.id}
            onClick={() => {
              addDiscount(item);
            }}
            size="lg"
          >
            {item.name}{' '}
            ({item.min_rate === item.max_rate ? (item.type === DiscountType.Fixed ? withCurrency(item.min_rate) : item.min_rate) : `${item.min_rate} - ${item.max_rate}`}
            {item.type === DiscountType.Percent && '%'})
          </Button>
        ))}
      </div>
      {discount && (
        <div className="text-2xl text-center">
          Discount {discount.min_rate === discount.max_rate ? (discount.type === DiscountType.Fixed ? withCurrency(discount.min_rate) : discount.min_rate) : `${discount.min_rate} - ${discount.max_rate}`}
          {discount.type === DiscountType.Percent && '%'}{' '}
          {!!discount.max_cap && `with max cap of ${withCurrency(discount.max_cap)}`}
        </div>
      )}
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
            }}>
              C
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
