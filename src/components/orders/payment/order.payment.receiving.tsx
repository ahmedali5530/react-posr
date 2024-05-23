import ScrollContainer from "react-indiana-drag-scroll";
import { Button } from "@/components/common/input/button.tsx";
import { withCurrency } from "@/lib/utils.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace, faPrint } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order, OrderStatus } from "@/api/model/order.ts";
import { useDB } from "@/api/db/db.ts";

interface Props {
  order: Order
  total: number
  onComplete: () => void
  posFee: number
}
export const OrderPaymentReceiving = ({
  total, order, onComplete, posFee
}: Props) => {
  const db = useDB();

  const {
    data: paymentTypes
  } = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], ['priority asc'], 0, 99999);



  const [paymentType, setPaymentType] = useState<string>();

  const [tendered, setTendered] = useState(total);
  const quickAmounts = [5, 10, 20, 50, 100, 500, 1000, 5000];
  const keyboardKeys = [1,2,3,4,5,6,7,8,0,'.',0];

  const [closing, setClosing] = useState(false);

  const closeOrder = async () => {
    setClosing(true);

    try{
      // create payment
      const orderPayment = await db.create(Tables.order_payment, {
        amount: tendered,
        payment_type: paymentType,
        comments: '',
        payable: total
      });

      const extras = await db.create(Tables.order_extras, {
        name: 'POS Fee',
        value: posFee
      });

      await db.merge(order.id, {
        status: OrderStatus.Paid,
        payments: [orderPayment[0].id],
        extras: [extras[0].id]
      });

      onComplete();
    }catch(e){
      throw e;
    }finally {
      setClosing(false);
    }
  }

  useEffect(() => {
    if(paymentTypes?.total > 0 && paymentType === undefined){
      setPaymentType(paymentTypes?.data[0].id);
    }
  }, [paymentTypes?.total, paymentType]);

  return (
    <>
      <ScrollContainer className="gap-5 flex overflow-x-auto mb-5">
        {paymentTypes?.data?.map(item => (
          <Button
            className="min-w-[150px]"
            variant="primary"
            active={item.id === paymentType}
            key={item.id}
            onClick={() => setPaymentType(item.id)}
            size="lg"
          >
            {item.name}
          </Button>
        ))}
      </ScrollContainer>

      <div className="mb-3 text-5xl p-5 text-center">
        {withCurrency(tendered)}
      </div>
      <div>
        <ScrollContainer className="gap-3 flex overflow-x-auto mb-5">
          <span
            className="btn btn-primary w-[100px] lg"
            onClick={() => {
              setTendered(total)
            }}
          >{withCurrency(total)}</span>
          {quickAmounts.map(item => (
            <span
              key={item}
              className="btn btn-primary w-[100px] lg"
              onClick={() => {
                setTendered(item)
              }}
            >{withCurrency(item)}</span>
          ))}
        </ScrollContainer>
      </div>
      <div className="flex">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {keyboardKeys.map(item => (
              <Button key={item} size="xl" flat variant="primary">
                {item}
              </Button>
            ))}
            <Button size="xl" flat variant="primary">
              <FontAwesomeIcon icon={faBackspace}/>
            </Button>
          </div>
          <div className="flex gap-5">
            <Button variant="primary" className="flex-1" flat icon={faPrint} size="lg">Temp bill</Button>
            <Button
              variant="success"
              className="flex-1"
              filled size="lg"
              onClick={closeOrder}
              disabled={tendered < total || closing}
            >Complete</Button>
          </div>
        </div>
      </div>
    </>
  )
}
