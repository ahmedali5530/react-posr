import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import React from "react";
import { Button } from "@/components/common/input/button.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import { Discount } from "@/api/model/discount.ts";

interface Props {
  discount?: Discount
  setDiscount: (discount?: Discount) => void
}

export const OrderPaymentDiscount = ({
  discount, setDiscount
}: Props) => {

  const {
    data: discounts
  } = useApi<SettingsData<Discount>>(Tables.discounts, [], ['priority asc'], 0, 99999);

  return (
    <>
      <ScrollContainer className="gap-5 flex overflow-x-auto mb-5">
        {discounts?.data?.map(item => (
          <Button
            className="min-w-[150px]"
            variant="primary"
            active={item.id === discount?.id}
            key={item.id}
            onClick={() => setDiscount(item)}
            size="lg"
          >
            {item.name} {item.rate}%
          </Button>
        ))}
      </ScrollContainer>
    </>
  );
}
