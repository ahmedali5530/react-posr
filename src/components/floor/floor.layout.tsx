import { useAtom } from "jotai";
import { appSettings, appState } from "@/store/jotai.ts";
import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { cn } from "@/lib/utils.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Floor } from "@/api/model/floor.ts";
import { Tables } from "@/api/db/tables.ts";
import { Table } from "@/api/model/table.ts";
import { FloorTable } from "@/components/settings/floors/layout/table.tsx";
import { Category } from "@/api/model/category.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { useDB } from "@/api/db/db.ts";
import { DateTime } from "luxon";
import { Order, OrderStatus } from "@/api/model/order.ts";


export const FloorLayout = () => {
  const [state, setState] = useAtom(appState);
  const [settings, setSettings] = useAtom(appSettings);
  const db = useDB();
  const [liveQuery, setLiveQuery] = useState(null);

  const {
    data: floors
  } = useApi<SettingsData<Floor>>(Tables.floors, [], ['priority asc'], 0, 99999);

  const {
    data: tables,
    handleFilterChange: onTablesFilterChange,
  } = useApi<SettingsData<Table>>(Tables.tables, [], ['priority asc'], 0, 99999, ['floor', 'categories', 'payment_types', 'order_types']);

  const {
    data: categories
  } = useApi<SettingsData<Category>>(Tables.categories, [], ['priority asc'], 0, 99999);

  const {
    data: orderTypes
  } = useApi<SettingsData<OrderType>>(Tables.order_types, [], ['priority asc'], 0, 99999);

  const {
    data: paymentTypes
  } = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], ['priority asc'], 0, 99999);

  const {
    data: orders,
    fetchData: fetchOrders
  } = useApi<SettingsData<Order>>(Tables.orders, [`status = "${OrderStatus["In Progress"]}"`], ['created_at asc'], 0, 99999, ['items', 'items.item', 'item.item.modifiers', 'table', 'user', 'order_type', 'customer', 'discount', 'tax']);

  const runLiveQuery = async () => {
    const result = await db.live(Tables.orders, function(){
      fetchOrders();
    });

    setLiveQuery(result);
  }

  useEffect(() => {
    runLiveQuery().then();

    return () => {
      db.db.kill(liveQuery).then(() => console.log('live query killed'));
    }
  }, []);

  useEffect(() => {
    if( !state.floor && floors?.data?.length > 0 ) {
      setState(prev => ({
        ...prev,
        floor: floors?.data[0]
      }));
    }
  }, [floors?.data, state.floor]);

  useEffect(() => {
    if( state.floor ) {
      onTablesFilterChange([`floor = ${state.floor.id}`]);
    }
  }, [state.floor]);

  const tableOrders = useCallback((tableId: string) => {
    return orders?.data?.filter(item => item.table.id === tableId)
  }, [orders]);

  const tableOrder = useCallback((tableId: string) => {
    return orders?.data?.find(item => item.table.id === tableId)
  }, [orders])

  return (
    <>
      <div className="flex flex-col">
        <div className="h-[100px]"></div>
        <div className="layout relative h-[calc(100vh_-_80px_-_100px)] p-3 overflow-hidden">
          {state.floor && (
            <>
              {tables?.data?.map(item => (
                <FloorTable
                  order={tableOrder(item.id)}
                  table={item}
                  isEditing={false}
                  onClick={() => {
                    if( !item.is_block && !item.is_locked ) {
                      const order = tableOrder(item.id);

                      setState(prev => ({
                        ...prev,
                        table: item,
                        showFloor: false,
                        orders: tableOrders(item.id),
                        cart: [],
                        seat: undefined,
                        order: {
                          order: order,
                          id: order ? order.id : 'new'
                        }
                      }));

                      setSettings(prev => ({
                        ...prev,
                        categories: item.categories ? item.categories : categories?.data,
                        order_types: item.order_types ? item.order_types : orderTypes?.data,
                        payment_types: item.payment_types ? item.payment_types : paymentTypes?.data
                      }));

                      db.merge(item.id, {
                        is_locked: true,
                        locked_at: DateTime.now().toISO(),
                        locked_by: 'Kashif'
                      });
                    }
                  }}
                  key={item.id}
                />
              ))}
            </>
          )}
        </div>
        <div className="floor-btns flex gap-3 p-3">
          {floors?.data?.map(item => (
            <Button
              variant="custom"
              key={item.id}
              size="lg"
              className={
                cn(
                  "flex-1 relative z-10 outline-none",
                  item.id === state?.floor?.id && 'bg-gradient'
                )
              }
              onClick={() => setState(prev => ({
                ...prev,
                floor: item
              }))}
              style={{
                '--background': item.background,
                '--color': item.color,
                '--scale': 0.98
              } as CSSProperties}
            >{item.name}</Button>
          ))}
        </div>
      </div>
    </>
  );
}
