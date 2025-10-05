import { Button } from "@/components/common/input/button.tsx";
import React, {useState} from "react";
import {DiscountType} from "@/api/model/discount.ts";

interface Props {
  serviceCharge: number
  setServiceCharge: (charges: any) => void

  setServiceChargeType: (type: DiscountType) => void
  serviceChargeType: DiscountType
}

export const OrderPaymentServiceCharges = ({
  serviceCharge, setServiceCharge, serviceChargeType, setServiceChargeType
}: Props) => {
  const [quickPercentOptions] = useState([
    3, 5, 12
  ]);

  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="mb-5 flex justify-between flex-col gap-5">
        <Button
          className="min-w-[150px]"
          variant="danger"
          active={serviceCharge === 0}
          onClick={() => setServiceCharge(0)}
          size="lg"
        >
          No Service charge
        </Button>

        <div className="input-group">
          <Button
            size="lg" variant="primary" active={serviceChargeType === DiscountType.Percent}
            onClick={() => setServiceChargeType(DiscountType.Percent)}
            className="min-w-[150px] flex-1"
          >
            {DiscountType.Percent}
          </Button>
          <Button
            size="lg" variant="primary" active={serviceChargeType === DiscountType.Fixed}
            onClick={() => setServiceChargeType(DiscountType.Fixed)}
            className="min-w-[150px] flex-1"
          >
            {DiscountType.Fixed}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-3 justify-center">
        {quickPercentOptions.map(quickOption => (
          <Button
            size="lg" variant="primary" flat active={serviceChargeType === DiscountType.Percent && serviceCharge === quickOption}
            onClick={() => {
              setServiceChargeType(DiscountType.Percent);
              setServiceCharge(quickOption);
            }}
            className="min-w-[100px]"
            key={quickOption}
          >
            {quickOption}%
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {keyboardKeys.map(item => (
          <Button key={item} size="xl" flat variant="primary" onClick={() => {
            setServiceCharge(prev => {
              return Number(prev.toString() + item)
            });
          }}>
            {item}
          </Button>
        ))}
        <Button size="xl" flat variant="primary" onClick={() => {
          setServiceCharge(0)
        }}>
          C
        </Button>
      </div>
    </div>
  )
}
