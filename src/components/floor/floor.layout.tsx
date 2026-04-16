import { useAtom } from "jotai";
import {appAlert, appPage, appSettings, appState} from "@/store/jotai.ts";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import {cn, toRecordId} from "@/lib/utils.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Floor } from "@/api/model/floor.ts";
import { Tables } from "@/api/db/tables.ts";
import {Table, TABLE_FETCHES} from "@/api/model/table.ts";
import { FloorTable } from "@/components/settings/floors/layout/table.tsx";
import { Category } from "@/api/model/category.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { useDB } from "@/api/db/db.ts";
import { DateTime } from "luxon";
import {Order, ORDER_FETCHES, OrderStatus} from "@/api/model/order.ts";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChair, faTable } from "@fortawesome/free-solid-svg-icons";
import { LiveSubscription } from "surrealdb";


export const FloorLayout = () => {
  const [state, setState] = useAtom(appState);
  const [, setSettings] = useAtom(appSettings);
  const db = useDB();
  const [liveQuery, setLiveQuery] = useState<LiveSubscription | null>(null);
  const [tablesLiveQuery, setTablesLiveQuery] = useState<LiveSubscription | null>(null);
  const [page] = useAtom(appPage);
  const [, setAlert] = useAtom(appAlert);

  const {
    data: floors
  } = useApi<SettingsData<Floor>>(Tables.floors, [], ['priority asc'], 0, 99999);

  const {
    data: tables,
    handleFilterChange: onTablesFilterChange,
    fetchData: fetchTables
  } = useApi<SettingsData<Table>>(Tables.tables, [], ['priority asc'], 0, 99999, TABLE_FETCHES);

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
  } = useApi<SettingsData<Order>>(Tables.orders, [`status = "${OrderStatus["In Progress"]}"`], ['created_at asc'], undefined, undefined, ORDER_FETCHES);

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
      liveQuery?.kill().catch(() => undefined);
      tablesLiveQuery?.kill().catch(() => undefined);
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

  const tableOrders = (tableId: string) => {
    return orders?.data?.filter(item => item?.table?.id?.toString() === tableId.toString())
  }

  const tableOrder = (tableId: string) => {
    return orders?.data?.find(item =>
      item?.table?.id?.toString() === tableId.toString()
    )
  }

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

      if(state.switchTable){
        if(state.order.id !== 'new') {
          // update new table in order
          await db.merge(toRecordId(state.order.id), {
            table: toRecordId(item.id),
          });
        }
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
                  "flex-1 relative outline-none pressable",
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
