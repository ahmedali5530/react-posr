import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { Tables } from "@/api/db/tables.ts";
import React, { useState } from "react";
import { Tax } from "@/api/model/tax.ts";
import { Button } from "@/components/common/input/button.tsx";
import ScrollContainer from "react-indiana-drag-scroll";

interface Props {
  tax?: Tax
  setTax: (tax?: Tax) => void
}

export const OrderPaymentTax = ({
  tax, setTax
}: Props) => {

  const {
    data: taxes
  } = useApi<SettingsData<Tax>>(Tables.taxes, [], ['priority asc'], 0, 99999);

  return (
    <>
      <ScrollContainer className="gap-5 flex overflow-x-auto mb-5">
        {taxes?.data?.map(item => (
          <Button
            className="min-w-[150px]"
            variant="primary"
            active={item.id === tax?.id}
            key={item.id}
            onClick={() => setTax(item)}
            size="lg"
          >
            {item.name} {item.rate}%
          </Button>
        ))}
      </ScrollContainer>
    </>
  );
}
