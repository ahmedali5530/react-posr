import { Layout } from "@/screens/partials/layout.tsx";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Order as OrderModel, OrderStatus } from "@/api/model/order.ts";
import { Tables } from "@/api/db/tables.ts";
import { useEffect, useMemo, useState } from "react";
import { DateValue } from "react-aria-components";
import { getLocalTimeZone, today } from "@internationalized/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { calculateOrderItemPrice, calculateOrderTotal } from "@/lib/cart.ts";
import { formatNumber, withCurrency } from "@/lib/utils.ts";
import { Calendar } from "@/components/common/react-aria/calendar.tsx";

export const Summary = () => {
  const {
    data: orders,
    isLoading,
    addFilter: addOrderFilter,
    resetFilters: resetOrdersFilters
  } = useApi<SettingsData<OrderModel>>(Tables.orders, [`status = '${OrderStatus.Paid}'`], ['created_at asc'], 0, 99999, ['items', 'items.item', 'item.item.modifiers', 'table', 'user', 'order_type', 'customer', 'discount', 'tax', 'payments', 'payments.order_payment', 'payments.payment_type', 'extras', 'extras.order_extras']);
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));

  console.log(orders?.data)

  useEffect(() => {
    resetOrdersFilters();

    if( date ) {
      addOrderFilter(`time::format(created_at, "%Y-%m-%d") = "${date?.toString()}"`);
    }
  }, [date]);

  const exclusive = useMemo(() => {
    let total = 0;
    orders?.data?.forEach(order => {
      total += calculateOrderTotal(order);
    });

    return total;
  }, [orders]);

  const gSales = useMemo(() => {
    return exclusive;
  }, [exclusive]);

  const gross = useMemo(() => {
    return exclusive;
  }, [exclusive]);

  const refunds = useMemo(() => {
    return exclusive;
  }, [exclusive]);

  const serviceCharges = useMemo(() => {
    return orders?.data?.filter(item => item.service_charges_amount !== undefined)
                 ?.reduce((prev, order) => prev + Number(order?.service_charges_amount), 0);
  }, [orders]);

  const discounts = useMemo(() => {
    return orders?.data?.filter(item => item.discount_amount !== undefined)
                 ?.reduce((prev, order) => prev + order.discount_amount, 0);
  }, [orders]);

  const taxes = useMemo(() => {
    return orders?.data?.filter(item => item.tax_amount !== undefined)?.reduce((prev, order) => prev + order.tax_amount, 0);
  }, [orders]);

  const taxesList = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      if( order?.tax ) {
        if( !list[`${order?.tax?.name} ${order?.tax?.rate}`] ) {
          list[`${order?.tax?.name} ${order?.tax?.rate}`] = 0;
        }

        list[`${order?.tax?.name} ${order?.tax?.rate}`] += order?.tax_amount;
      }
    });
    return list;
  }, [orders]);

  const net = useMemo(() => {
    return exclusive
  }, [exclusive]);

  const amountDue = useMemo(() => {
    let total = 0;
    orders?.data?.forEach(order => {
      total += order.payments.reduce((prev, payment) => prev + payment.payable, 0);
    });
    return total;
  }, [orders]);

  const amountCollected = useMemo(() => {
    let total = 0;
    orders?.data?.forEach(order => {
      total += order.payments.reduce((prev, payment) => prev + payment.amount, 0);
    });
    return total;
  }, [orders]);

  const paymentTypes = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      order.payments.forEach(payment => {
        if( !list[payment.payment_type.name] ) {
          list[payment.payment_type.name] = 0;
        }

        list[payment.payment_type.name] += payment.payable;
      });
    });
    return list;
  }, [orders]);

  const rounding = useMemo(() => {
    return amountDue - amountCollected
  }, [amountDue, amountCollected]);

  const voids = useMemo(() => {
    let total = 0;
    orders?.data?.forEach(order => {
      total += order.items.filter(item => item?.deleted_at !== undefined)
                    .reduce((prev, item) => prev + calculateOrderItemPrice(item), 0)
    });
    return total;
  }, [orders]);

  const covers = useMemo(() => {
    return orders?.data?.reduce((prev, order) => prev + order.covers, 0);
  }, [orders]);

  const categories = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      order.items.forEach(item => {
        if( item.category ) {
          if( !list[item.category] ) {
            list[item.category] = 0;
          }

          list[item.category] += item.quantity * item.price;
        }
      })
    });

    return list;
  }, [orders]);


  return (
    <Layout overflowHidden>
      <div className="flex gap-5 p-3 flex-col">
        <div className="bg-white rounded-xl flex gap-10 justify-center">
          <div className="flex justify-center items-center">
            <div>
              <Calendar onChange={setDate} value={date} maxValue={today(getLocalTimeZone())}/>
            </div>
          </div>
          <div className="max-h-[calc(100vh_-_30px)] overflow-y-auto w-[450px] py-10">
            {isLoading ? (
              <div className="flex h-screen w-full justify-center items-center flex-1">
                <FontAwesomeIcon icon={faSpinner} spin size="5x"/>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between border-b p-3">
                  <span>Exclusive amount</span>
                  <span>{withCurrency(exclusive)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>G sales</span>
                  <span>{withCurrency(gSales)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Gross</span>
                  <span>{withCurrency(gross)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Refunds</span>
                  <span>{withCurrency(refunds)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Service charges</span>
                  <span>{withCurrency(serviceCharges)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Discount</span>
                  <span>{withCurrency(discounts)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Taxes</span>
                  <span>{withCurrency(taxes)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Net</span>
                  <span>{withCurrency(net)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Amount due</span>
                  <span>{withCurrency(amountDue)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Amount collected</span>
                  <span>{withCurrency(amountCollected)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Rounding</span>
                  <span>{withCurrency(rounding)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span></span>
                  <span></span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Voids</span>
                  <span>{withCurrency(voids)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span></span>
                  <span></span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Covers</span>
                  <span>{formatNumber(covers)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Average cover</span>
                  <span>{withCurrency(amountDue / covers)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Orders/Checks</span>
                  <span>{formatNumber(orders?.data?.length)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span>Average order/check</span>
                  <span>{withCurrency(amountDue / orders?.data?.length)}</span>
                </div>
                <div className="flex justify-between border-b p-3">
                  <span></span>
                  <span></span>
                </div>
                <div className="flex justify-around border-b p-3">
                  <span>Categories</span>
                </div>
                {Object.keys(categories).map(category => (
                  <div className="flex justify-between border-b p-3" key={category}>
                    <span>{category}</span>
                    <span>{withCurrency(categories[category])}</span>
                    <span>{formatNumber(categories[category] / exclusive * 100)}%</span>
                  </div>
                ))}
                <div className="flex justify-between border-b p-3">
                  <span></span>
                  <span></span>
                </div>
                <div className="flex justify-around border-b p-3">
                  <span>Payment types</span>
                </div>
                {Object.keys(paymentTypes).map(paymentType => (
                  <div className="flex justify-between border-b p-3" key={paymentType}>
                    <span>{paymentType}</span>
                    <span>{withCurrency(paymentTypes[paymentType])}</span>
                    <span>{formatNumber(paymentTypes[paymentType] / amountDue * 100)}%</span>
                  </div>
                ))}
                <div className="flex justify-between border-b p-3">
                  <span></span>
                  <span></span>
                </div>
                <div className="flex justify-around border-b p-3">
                  <span>Taxes</span>
                </div>
                {Object.keys(taxesList).map(tax => (
                  <div className="flex justify-between border-b p-3" key={tax}>
                    <span>{tax}%</span>
                    <span>{withCurrency(taxesList[tax])}</span>
                    <span>{formatNumber(taxesList[tax] / taxes * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
