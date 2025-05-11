import { KitchenOrder as KitchenOrderModel } from "@/api/model/kitchen.ts";
import { Countdown } from "@/components/floor/countdown.tsx";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/common/input/button.tsx";
import { useDB } from "@/api/db/db.ts";
import { OrderItemName } from "@/components/common/order/order.item.tsx";

interface Props {
  order: KitchenOrderModel
}

export const KitchenOrder = ({
  order
}: Props) => {
  const db = useDB();

  const diff = DateTime.now().diff(DateTime.fromJSDate(order.items[0]?.created_at)).as('minutes');

  const ready = async () => {
    for(const item of order.items){
      await db.merge(item.id, {
        completed_at: DateTime.now().toJSDate()
      });
    }
  }

  return (
    <div className="bg-white rounded-xl shadow">
      <div className={
        cn(
          "flex justify-between p-3 rounded-xl shadow-2xl",
          diff >= 30 && diff <= 59 && 'bg-warning-200 text-warning-700',
          diff >= 60 && 'bg-danger-200 text-danger-700',
        )
      }>
        <div className="flex gap-3">
          <span className="p-3 text-lg rounded-xl min-w-[56px] flex justify-center items-center" style={{
            color: order.order?.table.color,
            background: order.order?.table?.background
          }}>{order.order?.table?.name}{order.order?.table?.number}</span>

          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-xl">{order.order?.order_type?.name} / {order.order?.invoice_number}</span>
            <span className="text-xl font-bold">
              <Countdown time={order.items[0].created_at} />
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-lg font-bold px-1 rounded text-right">{order.order?.user?.first_name}</span>
          <span className="text-right text-xl text-primary-500"></span>
        </div>
      </div>
      <div className="p-3">
        {order.items.map(item => (
          <div className="flex flex-col" key={item.id}>
            <OrderItemName item={item.order_item} showQuantity />
          </div>
        ))}
      </div>
      <div className="p-3">
        <Button variant="success" filled className="w-full" size="lg" onClick={ready}>Ready</Button>
      </div>
    </div>
  )
}
