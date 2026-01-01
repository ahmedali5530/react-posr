import { Order, OrderStatus } from "@/api/model/order.ts";
import { cn } from "@/lib/utils.ts";
import {getInvoiceNumber} from "@/lib/order.ts";

interface Props {
  order: Order
}

export const OrderHeader = ({
  order
}: Props) => {

  const colors = {
    [OrderStatus["In Progress"]]: 'bg-warning-100 text-warning-700',
    [OrderStatus["Paid"]]: 'bg-success-100 text-success-700',
    [OrderStatus["Completed"]]: 'bg-success-100 text-success-700',
    [OrderStatus['Merged']]: 'bg-info-100 text-info-700',
    [OrderStatus['Spilt']]: 'bg-info-100 text-info-700',
    [OrderStatus['Cancelled']]: 'bg-danger-100 text-danger-700',
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        {order?.table && (
          <span className="p-3 text-lg rounded-xl min-w-[56px] flex justify-center items-center" style={{
            color: order?.table?.color,
            background: order?.table?.background
          }}>{order?.table?.name}{order?.table?.number}</span>
        )}

        <div className="flex flex-col items-start gap-1">
          <span className="font-bold">Order# {getInvoiceNumber(order)} / {order?.order_type?.name}</span>
          <span className={
            cn(
              "uppercase p-1 px-3 rounded-lg text-sm font-bold flex-grow-0 flex-shrink",
              colors[order?.status]
            )
          }>{order?.status}</span>

        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold bg-neutral-100 px-1 rounded">{order?.user?.first_name}</span>
        <span></span>
      </div>
    </div>
  )
}
