import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import React from "react";
import { Tax } from "@/api/model/tax.ts";
import { Button } from "@/components/common/input/button.tsx";

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
    <div className="flex flex-wrap gap-5">
      <Button
        className="min-w-[150px]"
        variant="danger"
        active={tax === undefined}
        onClick={() => setTax(undefined)}
        size="lg"
      >
        No Tax
      </Button>
      {taxes?.data?.map(item => (
        <Button
          className="min-w-[150px]"
          variant="primary"
          active={item.id.toString() === tax?.id.toString()}
          key={item.id}
          onClick={() => setTax(item)}
          size="lg"
        >
          {item.name} {item.rate}%
        </Button>
      ))}
    </div>
  );
}
