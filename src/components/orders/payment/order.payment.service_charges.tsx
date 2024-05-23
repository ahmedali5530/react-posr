import { Button } from "@/components/common/input/button.tsx";
import React from "react";

interface Props {
  serviceCharge: number
  setServiceCharge: (charges: number) => void
}

export const OrderPaymentServiceCharges = ({
  serviceCharge, setServiceCharge
}: Props) => {
  const serviceCharges = [5, 12];

  return (
    <div className="gap-5 flex flex-col mb-5">
      <Button
        className="min-w-[150px]"
        variant="danger"
        active={serviceCharge === 0}
        onClick={() => setServiceCharge(0)}
        size="lg"
      >
        0%
      </Button>

      {serviceCharges.map(item => (
        <Button
          className="min-w-[150px]"
          variant="primary"
          active={item === serviceCharge}
          key={item}
          onClick={() => setServiceCharge(item)}
          size="lg"
        >
          {item}%
        </Button>
      ))}
    </div>
  )
}
