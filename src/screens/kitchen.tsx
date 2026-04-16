import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars, faClose, faTableColumns} from "@fortawesome/free-solid-svg-icons";
import ScrollContainer from "react-indiana-drag-scroll";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Kitchen, KitchenOrder as KitchenOrderModel } from "@/api/model/kitchen.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order } from "@/api/model/order.ts";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useDB } from "@/api/db/db.ts";
import { OrderItemKitchen } from "@/api/model/order_item_kitchen.ts";
import { KitchenOrder } from "@/components/kitchen/kitchen.order.tsx";
import { DateTime } from "luxon";
import {cn, formatNumber, safeNumber, toRecordId} from "@/lib/utils.ts";
import {Customers} from "@/components/customer/customer.tsx";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import {LiveSubscription} from "surrealdb";



export const KitchenScreen = () => {
  const db = useDB();

  const [kitchen, setKitchen] = useState<Kitchen>();
  const {
    data: kitchens
  } = useApi<SettingsData<Kitchen>>(Tables.kitchens, [], ['priority asc'], 0, 10, ['items', 'printers']);
  const [allOrders, setOrders] = useState<KitchenOrderModel[]>([]);
  const orders = useMemo(() => {
    return allOrders.filter(item => {
      return item.items.filter(iitem => {
        return !!iitem.completed_at || !!iitem.order_item.deleted_at
      }).length != item.items.length
    })
  }, [allOrders]);
  const [avgTime, setAvgTime] = useState('-');

  const loadOrders = useCallback(async (kitchenId: string) => {
    const [kitchenOrderItemsRecord]: any = await db.query(`
      select *,
             time::format(created_at, '%F %T') as batch_created_at
      from ${Tables.order_items_kitchen}
      where 
--           order_item.order.status = 'In Progress'
--         and 
          kitchen = $kitchen
        and created_at >= $startDate
        and order_item.is_suspended != true
      order by created_at desc
      fetch order_item, order_item.item, order_item.order, order_item.order.table, order_item.order.user, order_item.order.order_type
    `, {
      kitchen: toRecordId(kitchenId),
      startDate: DateTime.now().startOf('day').toJSDate()
    });

    const groupedOrders = new Map<string, KitchenOrderModel>();
    for (const item of kitchenOrderItemsRecord ?? []) {
      const order = item.order_item?.order as Order | undefined;
      const orderId = order?.id ?? String(item.order_item?.order ?? '');
      const createdAtKey = item.batch_created_at ?? '';
      const groupKey = `${orderId}_${createdAtKey}`;

      if (!groupedOrders.has(groupKey)) {
        groupedOrders.set(groupKey, {
          order,
          items: []
        });
      }

      groupedOrders.get(groupKey)?.items.push(item);
    }

    setOrders(Array.from(groupedOrders.values()));

    await calculateAverageTime(kitchenId);
  }, []);

  useEffect(() => {
    if(!kitchen && kitchens?.total > 0){
      setKitchen(kitchens?.data?.[0]);
    }
  }, [kitchens, kitchen]);

  const [ordersLiveQuery, setOrdersLiveQuery] = useState<LiveSubscription | null>(null);
  const [kitchenItemsLiveQuery, setKitchenItemsLiveQuery] = useState<LiveSubscription | null>(null);
  const runLiveQuery = async () => {
    const result = await db.live(Tables.orders, function (action) {
      if(action === 'CREATE'){
        loadOrders(kitchen.id);
      }
    });

    const kitchenItems = await db.live(Tables.order_items_kitchen, function(action){
      if(action === 'UPDATE'){
        loadOrders(kitchen.id);
      }
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
      ordersLiveQuery?.kill().catch(() => undefined);
      kitchenItemsLiveQuery?.kill().catch(() => undefined);
    }
  }, [kitchen]);

  const calculateAverageTime = useCallback(async (kitchenId: string) => {
    const completedOrders  = await db.query(`select math::sum(time::unix(completed_at) - time::unix(created_at)) AS diff, count() from ${Tables.order_items_kitchen} where kitchen = $kitchen and completed_at != None and time::format(created_at, "${import.meta.env.VITE_DB_DATABASE_FORMAT}") = $date group all`, {
      kitchen: kitchenId,
      date: DateTime.now().toFormat(import.meta.env.VITE_DATE_FORMAT)
    });

    if(completedOrders[0].length > 0) {
      const duration: any = await db.query(`return duration::mins(duration::from_secs(math::floor(${safeNumber(completedOrders[0][0].diff / completedOrders[0][0].count, 0)})))`);

      setAvgTime(`${formatNumber(duration[0])} mins`);
    }else{
      setAvgTime('-');
    }
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
                active={item.id.toString() === kitchen?.id?.toString()}
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
