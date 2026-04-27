import {Button} from "@/components/common/input/button.tsx";
import React, {useMemo, useState} from "react";
import {DiscountType} from "@/api/model/discount.ts";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Tables} from "@/api/db/tables.ts";
import {Setting} from "@/api/model/setting.ts";
import {withCurrency} from "@/lib/utils.ts";

interface Props {
  serviceCharge: number
  setServiceCharge: (charges: any) => void

  setServiceChargeType: (type: DiscountType) => void
  serviceChargeType: DiscountType
}

export const OrderPaymentServiceCharges = ({
  serviceCharge, setServiceCharge, serviceChargeType, setServiceChargeType
}: Props) => {
  const [quickPercentOptions, setQuickPercentOptions] = useState([
    3, 5, 12
  ]);

  const keyboardKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0];

  const {
    data: serviceChargeSettings,
  } = useApi<SettingsData<Setting>>(Tables.settings, ["key = 'service_charges'", "and is_global = true"], [], 0, 1, ["values"]);

  const settingsLabel = useMemo(() => {
    const values = serviceChargeSettings?.data?.[0]?.values;
    const typeRaw = values?.type?.value ?? values?.type;
    const valueRaw = values?.value?.value ?? values?.value;
    const type = String(typeRaw || DiscountType.Percent);
    const value = Number(valueRaw || 0);

    setQuickPercentOptions(prev => {
      const optionsSet = new Set(prev);
      optionsSet.add(value);

      return Array.from(optionsSet);
    });

    setServiceCharge(value);
    setServiceChargeType(type === DiscountType.Fixed ? DiscountType.Fixed : DiscountType.Percent);

    return type === DiscountType.Fixed ? `${withCurrency(value)}` : `${value}%`;
  }, [serviceChargeSettings]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="mb-5 flex justify-between flex-col gap-5">
        <div className="text-xl bg-warning-500 px-3 py-5 text-white">
          Default from settings: <span className="font-semibold ">{settingsLabel}</span>
        </div>
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
            size="lg" variant="primary" flat active={serviceCharge === quickOption}
            onClick={() => {
              setServiceCharge(quickOption);
            }}
            className="min-w-[100px]"
            key={quickOption}
          >
            {quickOption}{serviceChargeType === DiscountType.Percent && '%'}
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
