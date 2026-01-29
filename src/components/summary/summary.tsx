import {useMemo} from "react";
import {calculateOrderItemPrice, calculateOrderTotal} from "@/lib/cart.ts";
import {Order, OrderStatus} from "@/api/model/order.ts";
import {formatNumber, withCurrency} from "@/lib/utils.ts";
import {getOrderFilteredItems} from "@/lib/order.ts";

interface Props {
  orders: Order[]
  date: string
}

const safeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const Summary = ({
  orders, date
}: Props) => {
  // Calculate sale price without tax (items total)
  const salePriceWithoutTax = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        const itemsTotal = safeNumber(
          order.items?.reduce((itemSum, item) => {
            const price = calculateOrderItemPrice(item);
            return itemSum + safeNumber(price);
          }, 0) ?? 0
        );
        return sum + itemsTotal;
      }, 0) ?? 0
    );
  }, [orders]);

  const exclusive = salePriceWithoutTax;

  // Tax collected
  const taxCollected = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => sum + safeNumber(order.tax_amount), 0) ?? 0
    );
  }, [orders]);

  // Service charges
  const serviceCharges = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => sum + safeNumber(order.service_charge_amount), 0) ?? 0
    );
  }, [orders]);

  // Item-level discounts
  const itemDiscounts = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        return sum + safeNumber(order.items?.reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0) ?? 0);
      }, 0) ?? 0
    );
  }, [orders]);

  // Subtotal-level discounts (order discounts minus item discounts)
  const subtotalDiscounts = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        const lineDiscounts = safeNumber(
          order.items?.reduce((itemSum, item) => itemSum + safeNumber(item?.discount), 0) ?? 0
        );
        const orderDiscount = safeNumber(order.discount_amount);
        const extraDiscount = Math.max(0, safeNumber(orderDiscount - lineDiscounts));
        return sum + extraDiscount;
      }, 0) ?? 0
    );
  }, [orders]);

  // Total discounts
  const discounts = safeNumber(itemDiscounts + subtotalDiscounts);

  // Total extras
  const totalExtras = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        return sum + safeNumber(
          order?.extras?.reduce((extraSum, extra) => extraSum + safeNumber(extra.value), 0) ?? 0
        );
      }, 0) ?? 0
    );
  }, [orders]);

  // Amount due (including extras)
  const amountDue = useMemo(() => {
    return safeNumber(salePriceWithoutTax + taxCollected + serviceCharges + totalExtras - itemDiscounts - subtotalDiscounts);
  }, [salePriceWithoutTax, taxCollected, serviceCharges, totalExtras, itemDiscounts, subtotalDiscounts]);

  // Amount collected
  const amountCollected = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        return sum + safeNumber(order.payments?.reduce((paySum, payment) => paySum + safeNumber(payment?.amount), 0) ?? 0);
      }, 0) ?? 0
    );
  }, [orders]);

  // Rounding (difference between amount collected and amount due)
  const rounding = useMemo(() => {
    return safeNumber(amountCollected - amountDue);
  }, [amountCollected, amountDue]);

  // Net (amount collected minus service charges and taxes)
  const net = useMemo(() => {
    return safeNumber(amountCollected - serviceCharges - taxCollected);
  }, [amountCollected, serviceCharges, taxCollected]);

  // Refunds (from negative payment amounts or cancelled orders)
  const refunds = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        if (order.status === OrderStatus.Cancelled) {
          return sum + safeNumber(
            order.payments?.reduce((paySum, payment) => {
              const amount = safeNumber(payment?.amount);
              return paySum + Math.abs(Math.min(0, amount));
            }, 0) ?? 0
          );
        }
        return sum + safeNumber(
          order.payments?.reduce((paySum, payment) => {
            const amount = safeNumber(payment?.amount);
            return paySum + (amount < 0 ? Math.abs(amount) : 0);
          }, 0) ?? 0
        );
      }, 0) ?? 0
    );
  }, [orders]);

  // Gross (amount collected + refunds + total discounts)
  const gross = useMemo(() => {
    return safeNumber(amountCollected + refunds + discounts);
  }, [amountCollected, refunds, discounts]);

  // G Sales (Gross Sales) = sale price without tax
  const gSales = salePriceWithoutTax;

  // Tips
  const tips = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((prev, item) => prev + safeNumber(item.tip_amount), 0) ?? 0
    );
  }, [orders]);

  const discountsList = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      if (order?.discount) {
        if (!list[`${order?.discount?.name}`]) {
          list[`${order?.discount?.name}`] = 0;
        }

        list[`${order?.discount?.name}`] += safeNumber(order?.discount_amount);
      }
    });
    return list;
  }, [orders]);

  const taxes = taxCollected;

  const taxesList = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      if (order?.tax) {
        if (!list[`${order?.tax?.name} ${order?.tax?.rate}`]) {
          list[`${order?.tax?.name} ${order?.tax?.rate}`] = 0;
        }

        list[`${order?.tax?.name} ${order?.tax?.rate}`] += safeNumber(order?.tax_amount);
      }
    });
    return list;
  }, [orders]);

  const paymentTypes = useMemo(() => {
    const list = {};
    orders?.data?.forEach(order => {
      order.payments?.forEach(payment => {
        const paymentTypeName = payment.payment_type?.name || 'Unknown';
        if (!list[paymentTypeName]) {
          list[paymentTypeName] = 0;
        }

        list[paymentTypeName] += safeNumber(payment.payable);
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

        list[extra.name] += safeNumber(extra.value);
      });
    });
    return list;
  }, [orders]);

  // Voids - calculate from items that are deleted/voided (items not in getOrderFilteredItems)
  const voids = useMemo(() => {
    return safeNumber(
      orders?.data?.reduce((sum, order) => {
        // Get all items including voided/deleted ones
        const allItems = order.items || [];
        // Get filtered items (non-voided)
        const filteredItems = getOrderFilteredItems(order);
        // Find voided items
        const voidedItems = allItems.filter(item => 
          !filteredItems.some(filtered => filtered.id === item.id)
        );
        // Calculate total for voided items
        return sum + safeNumber(
          voidedItems.reduce((itemSum, item) => {
            const price = calculateOrderItemPrice(item);
            return itemSum + safeNumber(price);
          }, 0)
        );
      }, 0) ?? 0
    );
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
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>G sales</span>
            <span>{withCurrency(gSales)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Items total (before tax)
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Gross</span>
            <span>{withCurrency(gross)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Amount collected + Refunds + Discounts
          </div>
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
          <span>Discounts</span>
          <span>{withCurrency(discounts)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Taxes</span>
          <span>{withCurrency(taxes)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Net</span>
            <span>{withCurrency(net)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Amount collected - Service charges - Taxes
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Amount due</span>
            <span>{withCurrency(amountDue)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Items total + Taxes + Service charges + Extras - Discounts
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Amount collected</span>
          <span>{withCurrency(amountCollected)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Extras</span>
          <span>{withCurrency(totalExtras)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Rounding</span>
            <span>{withCurrency(rounding)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Amount collected - Amount due
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Voids</span>
          <span>{withCurrency(voids)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span></span>
          <span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #e5e7eb', padding: '0.75rem', fontWeight: 700 }}>
          <span>Tips</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Total Tips</span>
          <span>{withCurrency(tips)}</span>
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
          <span>{withCurrency(covers > 0 ? amountDue / covers : 0)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Orders/Checks</span>
          <span>{formatNumber(orders?.data?.length ?? 0)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '0.75rem' }}>
          <span>Average order/check</span>
          <span>{withCurrency((orders?.data?.length ?? 0) > 0 ? amountDue / (orders?.data?.length ?? 1) : 0)}</span>
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
            <span style={{ width: '20%', textAlign: 'right' }}>{formatNumber(exclusive > 0 ? categories[category].total / exclusive * 100 : 0)}%</span>
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
            <span style={{ width: '20%', textAlign: 'right' }}>{formatNumber(exclusive > 0 ? dishes[dish].total / exclusive * 100 : 0)}%</span>
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
            <span>{formatNumber(amountDue > 0 ? paymentTypes[paymentType] / amountDue * 100 : 0)}%</span>
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
            <span>{formatNumber(taxes > 0 ? taxesList[tax] / taxes * 100 : 0)}%</span>
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
            <span>{formatNumber(discounts > 0 ? discountsList[discount] / discounts * 100 : 0)}%</span>
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