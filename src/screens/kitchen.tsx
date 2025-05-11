import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars, faClose, faTableColumns} from "@fortawesome/free-solid-svg-icons";
import ScrollContainer from "react-indiana-drag-scroll";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Kitchen, KitchenOrder as KitchenOrderModel } from "@/api/model/kitchen.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order, OrderStatus } from "@/api/model/order.ts";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useDB } from "@/api/db/db.ts";
import { OrderItemKitchen } from "@/api/model/order_item_kitchen.ts";
import { KitchenOrder } from "@/components/kitchen/kitchen.order.tsx";
import { DateTime } from "luxon";
import {cn, formatNumber} from "@/lib/utils.ts";
import {Customers} from "@/components/customer/customer.tsx";
import {Modal} from "@/components/common/react-aria/modal.tsx";



export const KitchenScreen = () => {
  const db = useDB();

  const [kitchen, setKitchen] = useState<Kitchen>();
  const {
    data: kitchens
  } = useApi<SettingsData<Kitchen>>(Tables.kitchens, [], ['priority asc'], 0, 10, ['items', 'printers']);
  const [orders, setOrders] = useState<KitchenOrderModel[]>([]);
  const [avgTime, setAvgTime] = useState('-');

  const loadOrders = useCallback(async (kitchenId: string) => {
    const result: any = await db.query(`
        SELECT array::distinct(order_item.order.id) as order_id, time::format(created_at, '%F %T') as created_at from ${Tables.order_items_kitchen} where order_item.order.status = 'In Progress' and kitchen = $kitchen and completed_at = None group by order_id, created_at order by created_at desc
    `, {
      'kitchen': kitchenId
    });

    const ordersList: KitchenOrderModel[] = [];
    for(const item of result[0]){
      const kitchenOrderItemsRecord: any = await db.query(`
        select * from ${Tables.order_items_kitchen} where order_item.order = $orderId and completed_at = None and kitchen = $kitchen and time::format(created_at, '%F %T') = $createdAt fetch order_item, order_item.item
      `, {
        'kitchen': kitchenId,
        'orderId': item.order_id[0],
        'createdAt': item.created_at
      });

      const orderRecord: any = await db.query(`select * from $order fetch table, user, order_type`, {
        order: item.order_id[0]
      });

      ordersList.push({
        order: orderRecord[0][0],
        items: kitchenOrderItemsRecord[0]
      });
    }

    setOrders(ordersList);

    await calculateAverageTime(kitchenId);
  }, []);

  useEffect(() => {
    if(!kitchen && kitchens?.total > 0){
      setKitchen(kitchens?.data?.[0]);
    }
  }, [kitchens, kitchen]);

  const [ordersLiveQuery, setOrdersLiveQuery] = useState(null);
  const [kitchenItemsLiveQuery, setKitchenItemsLiveQuery] = useState(null);
  const runLiveQuery = async () => {
    const result = await db.live(Tables.orders, function () {
      loadOrders(kitchen.id);
    });

    const kitchenItems = await db.live(Tables.order_items_kitchen, function(){
      loadOrders(kitchen.id);
    });

    setOrdersLiveQuery(result);
    setKitchenItemsLiveQuery(kitchenItems);
  }

  useEffect(() => {
    if(kitchen){
      loadOrders(kitchen.id);
      runLiveQuery();
    }

    return () => {
      db.db.kill(ordersLiveQuery).then();
      db.db.kill(kitchenItemsLiveQuery).then();
    }
  }, [kitchen]);

  const calculateAverageTime = useCallback(async (kitchenId: string) => {
    const completedOrders = await db.query(`select math::sum(time::unix(completed_at) - time::unix(created_at)) AS diff, count() from ${Tables.order_items_kitchen} where kitchen = $kitchen and completed_at != None group all`, {
      kitchen: kitchenId,
    });

    const duration: any = await db.query(`return duration::mins(duration::from::secs(math::floor(${completedOrders[0][0].diff/completedOrders[0][0].count})))`);

    setAvgTime(`${formatNumber(duration[0])} mins`);
  }, []);

  const completeAllOrders = async () => {
    await db.query(`update ${Tables.order_items_kitchen} set completed_at = $time where kitchen = $kitchen and completed_at = None`, {
      kitchen: kitchen.id,
      time: DateTime.now().toJSDate()
    });
  }

  const allDishes = useMemo(() => {
    const itemsMap = new Map();
    orders.forEach(item => {
      item.items.forEach(orderItem => {
        const itemName = orderItem.order_item.item.name;
        itemsMap.set(itemName, (itemsMap.get(itemName) ?? 0) + orderItem.order_item.quantity);
      })
    });

    return Array.from(itemsMap);
  }, [orders]);

  const [dishesModal, setDishesModal] = useState(false);

  console.log(allDishes);

  return(
    <Layout containerClassName="overflow-hidden">
      <div className="flex gap-5 p-3 flex-col">
        <div className="h-[60px] flex-0 rounded-xl bg-white flex items-center px-3 gap-3 justify-between">
          <div className="input-group flex-1">
            {kitchens?.data?.map(item => (
              <Button
                size="lg"
                variant="primary"
                onClick={() => setKitchen(item)}
                active={item.id === kitchen?.id}
                key={item.id}
                className="min-w-[200px]"
              >
                {item.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="warning" size="lg" filled onClick={completeAllOrders}>Complete all open orders</Button>
            <Button variant="warning" size="lg" filled onClick={() => setDishesModal(!dishesModal)}>View all dishes</Button>
          </div>
          <div className="input-group flex-1 justify-end flex gap-3 items-center h-full">
            <span className="bg-neutral-900 text-warning-500 text-2xl h-full flex items-center px-3">Avg time: {avgTime}</span>
            {/*<span>timer</span>*/}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-5">
          <ScrollContainer className={cn(
            'h-[calc(100vh_-_110px)]',
            dishesModal ? 'col-span-4' : 'col-span-5'
          )}>
            <div className="flex-1 rounded-xl flex gap-3 flex-row">
              {orders.map((item, index) => (
                <div className="w-[400px] flex-shrink-0" key={index}>
                  <KitchenOrder order={item} />
                </div>
              ))}
            </div>
          </ScrollContainer>

          {dishesModal && (
            <div className="flex flex-col col-span-1 bg-white">
              <button
                onClick={() => setDishesModal(false)}
                className="bg-black text-white self-end mb-5 inline-flex h-12 w-12 justify-center items-center">
                <FontAwesomeIcon icon={faClose} />
              </button>
              {allDishes.map((item, index) => (
                <div className="flex justify-between text-2xl odd:bg-gray-200 p-3" key={index}>
                  <strong>{item[0]}</strong>
                  <span className="bg-black text-warning-500 w-12 text-center">{item[1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
