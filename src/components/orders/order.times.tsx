import { DateTime } from "luxon";
import React from "react";
import { Order } from "@/api/model/order.ts";

interface Props {
  order: Order
}

export const OrderTimes = ({
  order
}: Props) => {
  return (
    <div className="flex justify-between text-neutral-600">
      <span>{DateTime.fromJSDate(order.created_at).toFormat('DDDD')}</span>
      <span>{DateTime.fromJSDate(order.created_at).toFormat('hh:mm a')}</span>
    </div>
  )
}
