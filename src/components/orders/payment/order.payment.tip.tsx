import { DiscountType } from "@/api/model/discount.ts";
import { Button } from "@/components/common/input/button.tsx";
import React, { useState } from "react";

interface Props {
  tip: number;
  setTip: (tip: any) => void;

  tipType: DiscountType;
  setTipType: (type: DiscountType) => void;
}

export const OrderPaymentTip = ({
  setTip, tipType, tip, setTipType
}: Props) => {
  const [quickPercentOptions] = useState([
    5, 10, 15, 20, 30, 50, 100
  ]);
  const [quickFixedOptions] = useState([
    50, 100, 500, 1000
  ]);
  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="mb-5 flex justify-between flex-col gap-5">
        <Button variant="danger" active={tip === 0} onClick={() => setTip(0)} size="lg">No Tip</Button>
        <div className="input-group">
          <Button
            size="lg" variant="primary" active={tipType === DiscountType.Percent}
            onClick={() => setTipType(DiscountType.Percent)}
            className="min-w-[150px] flex-1"
          >
            {DiscountType.Percent}
          </Button>
          <Button
            size="lg" variant="primary" active={tipType === DiscountType.Fixed}
            onClick={() => setTipType(DiscountType.Fixed)}
            className="min-w-[150px] flex-1"
          >
            {DiscountType.Fixed}
          </Button>
        </div>
      </div>
      {tipType === DiscountType.Percent && (
        <div className="flex flex-wrap gap-3 mb-3 justify-center">
          {quickPercentOptions.map(quickOption => (
            <Button
              size="lg" variant="primary" flat active={tipType === DiscountType.Percent && tip === quickOption}
              onClick={() => {
                setTipType(DiscountType.Percent);
                setTip(quickOption);
              }}
              className="min-w-[100px]"
              key={quickOption}
            >
              {quickOption}%
            </Button>
          ))}
        </div>
      )}

      {tipType === DiscountType.Fixed && (
        <div className="flex flex-wrap gap-3 mb-3 justify-center">
          {quickFixedOptions.map(quickOption => (
            <Button
              size="lg" variant="primary" flat active={tipType === DiscountType.Fixed && tip === quickOption}
              onClick={() => {
                setTipType(DiscountType.Fixed);
                setTip(quickOption);
              }}
              className="min-w-[100px]"
              key={quickOption}
            >
              {quickOption}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-3">
        {keyboardKeys.map(item => (
          <Button key={item} size="xl" flat variant="primary" onClick={() => {
            setTip(prev => {
              return Number(prev.toString() + item)
            });
          }}>
            {item}
          </Button>
        ))}
        <Button size="xl" flat variant="primary" onClick={() => {
          setTip(0)
        }}>
          C
        </Button>
      </div>

    </div>
  )
}
