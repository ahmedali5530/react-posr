import { useAtom } from "jotai";
import {appAlert, appPage, appSettings, appState} from "@/store/jotai.ts";
import { CSSProperties, useCallback, useEffect, useState } from "react";
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
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChair, faTable } from "@fortawesome/free-solid-svg-icons";
import { StringRecordId } from "surrealdb";


export const FloorLayout = () => {
  const [state, setState] = useAtom(appState);
  const [settings, setSettings] = useAtom(appSettings);
  const db = useDB();
  const [liveQuery, setLiveQuery] = useState(null);
  const [tablesLiveQuery, setTablesLiveQuery] = useState(null);
  const [page] = useAtom(appPage);
  const [, setAlert] = useAtom(appAlert);

  const {
    data: floors
  } = useApi<SettingsData<Floor>>(Tables.floors, [], ['priority asc'], 0, 99999);

  const {
    data: tables,
    handleFilterChange: onTablesFilterChange,
    fetchData: fetchTables
  } = useApi<SettingsData<Table>>(Tables.tables, [], ['priority asc'], 0, 99999, ['floor', 'categories', 'payment_types', 'order_types']);

  const {
    data: categories
  } = useApi<SettingsData<Category>>(Tables.categories, ['show_in_menu = true'], ['priority asc'], 0, 99999);

  const {
    data: orderTypes
  } = useApi<SettingsData<OrderType>>(Tables.order_types, [], ['priority asc'], 0, 99999);

  const {
    data: paymentTypes
  } = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], ['priority asc'], 0, 99999);

  const {
    data: orders,
    fetchData: fetchOrders
  } = useApi<SettingsData<Order>>(Tables.orders, [`status = "${OrderStatus["In Progress"]}"`], ['created_at asc'], 0, 99999, ['items', 'items.item', 'item.item.modifiers', 'table', 'user', 'order_type', 'customer', 'discount', 'tax', 'categories']);

  const runLiveQuery = async () => {
    const result = await db.live(Tables.orders, function () {
      fetchOrders();
    });

    setLiveQuery(result);
  }

  const runTablesLiveQuery = async () => {
    const result = await db.live(Tables.tables, function () {
      fetchTables();
    });

    setTablesLiveQuery(result);
  }

  useEffect(() => {
    runLiveQuery().then();
    runTablesLiveQuery().then();

    return () => {
      db.db.kill(liveQuery).then();
      db.db.kill(tablesLiveQuery).then();
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
    return orders?.data?.filter(item => item?.table?.id?.toString() === tableId.toString())
  }, [orders]);

  const tableOrder = useCallback((tableId: string) => {
    return orders?.data?.find(item =>
      item?.table?.id?.toString() === tableId.toString()
    )
  }, [orders]);

  const onClick = async (item: Table) => {
    if( item.is_locked ) {
      setAlert(prev => ({
        ...prev,
        message: `${item.locked_by} is already taking order on this table`,
        type: 'error',
        opened: true
      }))
    }

    if( !item.is_block && !item.is_locked ) {
      const order = tableOrder(item.id);
      let cart = state.cart;
      if(order && state.switchTable){
        // update new table in order
        await db.merge(order.id, {
          table: new StringRecordId(item?.id.toString()),
        });
        cart = [];
      }
      if(order){
        cart = [];
      }

      const seats = new Map();
      order?.items.forEach(item => {
        if (item.seat) {
          seats.set(item.seat, item.seat);
        }
      });

      const seatsArray = Array.from(seats.values());

      const noSeat = state.cart.some(item => item.seat === undefined);

      setState(prev => ({
        ...prev,
        table: item,
        showFloor: false,
        showPersons: tableOrder(item.id) ? false : item.ask_for_covers,
        persons: tableOrder(item.id) ? tableOrder(item.id)?.covers?.toString() : '1',
        orders: tableOrders(item.id),
        cart: cart,
        seats: seatsArray,
        seat: noSeat ? undefined : (seatsArray.length > 0 ? seatsArray[0] : undefined),
        order: {
          order: order,
          id: order ? order.id : 'new'
        },
        switchTable: false, // turn off switch table flag
        customer: order?.customer, // clear customer
        orderType: (item.order_types?.length > 0 ? item.order_types : orderTypes?.data)[0]
      }));

      setSettings(prev => ({
        ...prev,
        categories: item.categories?.length > 0 ? item.categories : categories?.data,
        order_types: item.order_types?.length > 0 ? item.order_types : orderTypes?.data,
        payment_types: item.payment_types?.length > 0 ? item.payment_types : paymentTypes?.data,
      }));

      await db.merge(item.id, {
        is_locked: true,
        locked_at: DateTime.now().toJSDate(),
        locked_by: `${page.user.first_name} ${page.user.last_name}`
      });
    }
  }

  return (
    <>
      <div className="flex flex-col transition-all delay-75" style={{
        background: state.floor?.background
      }}>
        <div className="h-[80px] bg-white p-3 flex items-center">
          {state.switchTable && <div className="text-xl"><FontAwesomeIcon icon={faChair} /> Switch from Table {state?.table?.name}{state?.table?.number} to another</div>}
        </div>
        <div className="layout relative h-[calc(100vh_-_80px_-_80px)] p-3 overflow-hidden">
          {state.floor && (
            <>
              {tables?.data?.map(item => (
                <FloorTable
                  order={tableOrder(item.id)}
                  table={item}
                  isEditing={false}
                  isLocked={item.is_locked}
                  onClick={() => onClick(item)}
                  key={item.id}
                  numberOfOrders={tableOrders(item.id)?.length}
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
                  state?.floor && item.id.toString() === state?.floor?.id?.toString() && 'bg-gradient'
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
