import {useMemo} from "react";
import {calculateOrderItemPrice, calculateOrderTotal} from "@/lib/cart.ts";
import {Order} from "@/api/model/order.ts";
import {formatNumber, withCurrency} from "@/lib/utils.ts";
import {getOrderFilteredItems} from "@/lib/order.ts";

interface Props {
  orders: { data?: Order[] }
  date: string
}

export const Summary = ({
  orders, date
}: Props) => {
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
    return 0; // TODO: get real refund values from db
  }, [exclusive]);

  const serviceCharges = useMemo(() => {
    return orders?.data?.filter(item => item.service_charge_amount !== undefined)
      ?.reduce((prev, order) => prev + Number(order?.service_charge_amount), 0);
  }, [orders]);

  const discounts = useMemo(() => {
    return orders?.data?.filter(item => item.discount_amount !== undefined)
      ?.reduce((prev, order) => prev + order.discount_amount, 0);
  }, [orders]);

  const tips = useMemo(() => {
    return orders?.data.reduce((prev, item) => prev + item.tip_amount, 0);
  }, [orders]);

  const discountsList = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      if (order?.discount) {
        if (!list[`${order?.discount?.name}`]) {
          list[`${order?.discount?.name}`] = 0;
        }

        list[`${order?.discount?.name}`] += order?.discount_amount;
      }
    });
    return list;
  }, [orders]);

  const taxes = useMemo(() => {
    return orders?.data?.filter(item => item.tax_amount !== undefined)?.reduce((prev, order) => prev + order.tax_amount, 0);
  }, [orders]);

  const taxesList = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      if (order?.tax) {
        if (!list[`${order?.tax?.name} ${order?.tax?.rate}`]) {
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
        if (!list[payment.payment_type.name]) {
          list[payment.payment_type.name] = 0;
        }

        list[payment.payment_type.name] += payment.payable;
      });
    });
    return list;
  }, [orders]);

  const extras = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      order?.extras?.forEach(extra => {
        if (!list[extra.name]) {
          list[extra.name] = 0;
        }

        list[extra.name] += extra.value;
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
      total += getOrderFilteredItems(order)
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
      getOrderFilteredItems(order).forEach(item => {
        if (item.category) {
          if (!list[item.category]) {
            list[item.category] = {
              total: 0,
              quantity: 0
            };
          }

          list[item.category].total += item.quantity * item.price;
          list[item.category].quantity += item.quantity;
        }
      })
    });

    return list;
  }, [orders]);

  const dishes = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      getOrderFilteredItems(order).forEach(item => {
        if (item.item.name) {
          if (!list[item.item.name]) {
            list[item.item.name] = {
              total: 0,
              quantity: 0
            };
          }

          list[item.item.name].total += item.quantity * item.price;
          list[item.item.name].quantity += item.quantity;
        }
      })
    });

    return list;
  }, [orders]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{textAlign: 'center', marginBottom: '16px', fontSize: '24px'}}>Summary of {date}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Exclusive amount</span>
          <span>{withCurrency(exclusive)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>G sales</span>
          <span>{withCurrency(gSales)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Gross</span>
          <span>{withCurrency(gross)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Refunds</span>
          <span>{withCurrency(refunds)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Service charges</span>
          <span>{withCurrency(serviceCharges)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Discount</span>
          <span>{withCurrency(discounts)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Taxes</span>
          <span>{withCurrency(taxes)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Net</span>
          <span>{withCurrency(net)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Amount due</span>
          <span>{withCurrency(amountDue)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Tip</span>
          <span>{withCurrency(tips)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Amount collected</span>
          <span>{withCurrency(amountCollected)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Rounding</span>
          <span>{withCurrency(rounding)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Voids</span>
          <span>{withCurrency(voids)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Covers</span>
          <span>{formatNumber(covers)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Average cover</span>
          <span>{withCurrency(amountDue / covers)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Orders/Checks</span>
          <span>{formatNumber(orders?.data?.length)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Average order/check</span>
          <span>{withCurrency(amountDue / orders?.data?.length)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Categories</span>
        </div>
        {Object.keys(categories).map(category => (
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }} key={category}>
            <span style={{ width: '40%', textAlign: 'left' }}>{category}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{categories[category].quantity}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{withCurrency(categories[category].total)}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{formatNumber(categories[category].total / exclusive * 100)}%</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Dishes</span>
        </div>
        {Object.keys(dishes).map(dish => (
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }} key={dish}>
            <span style={{ width: '40%', textAlign: 'left' }}>{dish}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{dishes[dish].quantity}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{withCurrency(dishes[dish].total)}</span>
            <span style={{ width: '20%', textAlign: 'right' }}>{formatNumber(dishes[dish].total / exclusive * 100)}%</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Payment types</span>
        </div>
        {Object.keys(paymentTypes).map(paymentType => (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }} key={paymentType}>
            <span>{paymentType}</span>
            <span>{withCurrency(paymentTypes[paymentType])}</span>
            <span>{formatNumber(paymentTypes[paymentType] / amountDue * 100)}%</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Taxes</span>
        </div>
        {Object.keys(taxesList).map(tax => (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }} key={tax}>
            <span>{tax}%</span>
            <span>{withCurrency(taxesList[tax])}</span>
            <span>{formatNumber(taxesList[tax] / taxes * 100)}%</span>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Discounts</span>
        </div>
        {Object.keys(discountsList).map(discount => (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }} key={discount}>
            <span>{discount}</span>
            <span>{withCurrency(discountsList[discount])}</span>
            <span>{formatNumber(discountsList[discount] / discounts * 100)}%</span>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Extras</span>
        </div>
        {Object.keys(extras).map(extra => (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }} key={extra}>
            <span>{extra}</span>
            <span>{withCurrency(extras[extra])}</span>
          </div>
        ))}
      </div>
    </>
  );
}