import { Layout } from "@/screens/partials/layout.tsx";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Order as OrderModel, OrderStatus } from "@/api/model/order.ts";
import { Tables } from "@/api/db/tables.ts";
import { useEffect, useState } from "react";
import { DateValue } from "react-aria-components";
import { getLocalTimeZone, today } from "@internationalized/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPrint, faSpinner} from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "@/components/common/react-aria/calendar.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {Summary as SummaryComponent} from '@/components/summary/summary.tsx';
import {dispatchPrint} from "@/lib/print.service.ts";
import {PRINT_TYPE} from "@/lib/print.registry.tsx";

export const Summary = () => {
  const {
    data: orders,
    isLoading,
    addFilter: addOrderFilter,
    resetFilters: resetOrdersFilters
  } = useApi<SettingsData<OrderModel>>(Tables.orders, [`status = '${OrderStatus.Paid}'`], ['created_at asc'], 0, 99999, ['items', 'items.item', 'item.item.modifiers', 'table', 'user', 'order_type', 'customer', 'discount', 'tax', 'payments', 'payments.order_payment', 'payments.payment_type', 'extras', 'extras.order_extras']);
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));

  useEffect(() => {
    resetOrdersFilters();

    if( date ) {
      addOrderFilter(`time::format(created_at, "%Y-%m-%d") = "${date?.toString()}"`);
    }
  }, [date]);

  return (
    <Layout overflowHidden>
      <div className="flex gap-5 p-3 flex-col">
        <div className="bg-white rounded-xl flex gap-10 justify-center">
          <div className="flex justify-center items-center flex-col">
            <div>
              <Calendar
                onChange={setDate}
                value={date}
                maxValue={today(getLocalTimeZone())}
                pageBehavior="visible"
              />
            </div>
            <div className="flex gap-3 mt-3">
              <Button
                icon={faArrowLeft} size="lg" variant="primary" filled
                onClick={() => {
                  setDate(prevState => {
                    return prevState.subtract({
                      days: 1
                    })
                  })
                }}
              >
                Previous date</Button>
              <Button
                rightIcon={faArrowRight} size="lg" variant="primary" filled
                onClick={() => {
                  setDate(prevState => {
                    return prevState.add({
                      days: 1
                    })
                  })
                }}
              >
                Next date</Button>
            </div>
            <div className="flex gap-3 mt-3">
              <Button
                icon={faPrint}
                variant="lg"
                onClick={() => {
                  dispatchPrint(PRINT_TYPE.summary, {
                    orders: orders,
                    date: date.toString()
                  })
                }}
              >Print</Button>
            </div>
          </div>
          <div className="max-h-[calc(100vh_-_30px)] overflow-y-auto flex-1 flex-basis-[500px] py-10">
            {isLoading ? (
              <div className="flex h-screen w-full justify-center items-center flex-1">
                <FontAwesomeIcon icon={faSpinner} spin size="5x"/>
              </div>
            ) : (
              <SummaryComponent orders={orders} date={date.toString()} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
