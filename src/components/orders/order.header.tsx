import { Order, OrderStatus } from "@/api/model/order.ts";
import { cn } from "@/lib/utils.ts";

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
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
          <span className="p-3 text-lg rounded-xl min-w-[56px] flex justify-center items-center" style={{
            color: order.table.color,
            background: order.table.background
          }}>{order.table.name}{order.table.number}</span>

        <div className="flex flex-col">
          <span className="font-bold">Order# {order?.invoice_number} / {order.order_type.name}</span>
          <span className="text-neutral-500">{order?.user?.first_name}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={
          cn(
            "uppercase p-1 px-3 rounded-lg text-sm font-bold",
            colors[order.status]
          )
        }>{order.status}</span>
        <span></span>
      </div>
    </div>
  )
}
