import { Layout } from "@/screens/partials/layout.tsx";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Order as OrderModel, OrderStatus } from "@/api/model/order.ts";
import { Tables } from "@/api/db/tables.ts";
import { useEffect, useState } from "react";
import { useDB } from "@/api/db/db.ts";
import { OrderBox } from "@/components/orders/order.box.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import { Floor } from "@/api/model/floor.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import { User } from "@/api/model/user.ts";
import { useAtom } from "jotai/index";
import { appSettings } from "@/store/jotai.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { DatePicker } from "@/components/common/react-aria/datepicker.tsx";
import { getLocalTimeZone, today } from '@internationalized/date';
import { DateValue } from "react-aria-components";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import {OrderRow} from "@/components/orders/order.row.tsx";

export const Orders = () => {
  const db = useDB();
  const [liveQuery, setLiveQuery] = useState(null);

  const [params, setParams] = useAtom(appSettings);
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));
  const [view, setView] = useState<'row' | 'column'>('column');


  const {
    data: orders,
    fetchData: fetchOrders,
    addFilter: addOrderFilter,
    resetFilters: resetOrdersFilters
  } = useApi<SettingsData<OrderModel>>(Tables.orders, [], ['created_at desc'], 0, 99999, ['items', 'items.item', 'item.item.modifiers', 'table', 'user', 'order_type', 'customer', 'discount', 'tax', 'payments', 'payments.payment_type', 'extras', 'extras.order_extras']);

  const {
    data: floors,
  } = useApi<SettingsData<Floor>>(Tables.floors, [], ['priority asc'], 0, 99999);

  const {
    data: users,
  } = useApi<SettingsData<User>>(Tables.users, [], [], 0, 99999);

  const {
    data: orderTypes,

  } = useApi<SettingsData<OrderType>>(Tables.order_types, [], [], 0, 99999);

  const runLiveQuery = async () => {
    const result = await db.live(Tables.orders, function () {
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
    resetOrdersFilters();

    const floorFilters = [];
    const userFilters = [];
    const orderTypeFilters = [];
    const statusFilters = [];

    params.ordersFilters.floors.forEach(floor => {
      floorFilters.push(`floor = ${floor.value}`);
    });
    if( floorFilters.length > 0 ) {
      addOrderFilter(`(${floorFilters.join(' or ')})`);
    }

    params.ordersFilters.users.forEach(user => {
      userFilters.push(`user = ${user.value}`);
    });
    if( userFilters.length > 0 ) {
      addOrderFilter(`(${userFilters.join(' or ')})`);
    }

    params.ordersFilters.statuses.forEach(status => {
      statusFilters.push(`status = "${status.value}"`);
    });
    if( statusFilters.length > 0 ) {
      addOrderFilter(`(${statusFilters.join(' or ')})`);
    }

    params.ordersFilters.orderTypes.forEach(order_type => {
      orderTypeFilters.push(`order_type = ${order_type.value}`);
    });
    if( orderTypeFilters.length > 0 ) {
      addOrderFilter(`(${orderTypeFilters.join(' or ')})`);
    }

    if( date ) {
      addOrderFilter(`time::format(created_at, "%Y-%m-%d") = "${date?.toString()}"`);
    }
  }, [params.ordersFilters, date]);

  return (
    <Layout containerClassName="overflow-hidden">
        <div className="flex gap-5 p-3 flex-col">
          <div className="h-[60px] flex-0 rounded-xl bg-white flex items-center px-3 gap-3">
            <div className="min-w-[200px]">
              <ReactSelect
                options={[OrderStatus["In Progress"], OrderStatus.Paid, OrderStatus.Completed].map(item => ({
                  label: item,
                  value: item
                }))}
                isMulti
                placeholder="Select order status"
                value={params.ordersFilters.statuses}
                onChange={(value: any) => {
                  setParams(prev => ({
                    ...prev,
                    ordersFilters: {
                      ...prev.ordersFilters,
                      statuses: value,
                    }
                  }))
                }}
              />
            </div>
            <div className="min-w-[200px]">
              <ReactSelect
                options={orderTypes?.data.map(item => ({
                  label: item.name,
                  value: item.id
                }))}
                isMulti
                placeholder="Select order types"
                value={params.ordersFilters.orderTypes}
                onChange={(value: any) => {
                  setParams(prev => ({
                    ...prev,
                    ordersFilters: {
                      ...prev.ordersFilters,
                      orderTypes: value,
                    }
                  }))
                }}
              />
            </div>
            <div className="min-w-[200px]">
              <ReactSelect
                options={floors?.data?.map(item => ({
                  label: item.name,
                  value: item.id
                }))}
                isMulti
                placeholder="Select floors"
                value={params.ordersFilters.floors}
                onChange={(value: any) => {
                  setParams(prev => ({
                    ...prev,
                    ordersFilters: {
                      ...prev.ordersFilters,
                      floors: value,
                    }
                  }))
                }}
              />
            </div>
            <div className="min-w-[200px]">
              <ReactSelect
                options={users?.data?.map(item => ({
                  label: item.first_name + ' ' + item.last_name,
                  value: item.id
                }))}
                isMulti
                placeholder="Select users"
                value={params.ordersFilters.users}
                onChange={(value: any) => {
                  setParams(prev => ({
                    ...prev,
                    ordersFilters: {
                      ...prev.ordersFilters,
                      users: value,
                    }
                  }))
                }}
              />
            </div>
            <div>
              <DatePicker value={date} onChange={setDate} maxValue={today(getLocalTimeZone())} isClearable/>
            </div>
            <div className="input-group flex-1 justify-end">
              <Button icon={faTableColumns} variant="primary" onClick={() => setView('column')} active={view === 'column'}>
                Blocks
              </Button>
              <Button icon={faBars} variant="primary" onClick={() => setView('row')} active={view === 'row'}>
                Table
              </Button>
            </div>
          </div>
          {view === 'column' && (
            <ScrollContainer className="h-[calc(100vh_-_190px)]">
              <div className="flex-1 rounded-xl flex gap-3 flex-row">
                {orders?.data?.map(item => (
                  <div className="w-[400px] flex-shrink-0" key={item.id}>
                    <OrderBox order={item}/>
                  </div>
                ))}
              </div>
            </ScrollContainer>
          )}

          {view === 'row' && (
            <ScrollContainer className="max-h-[calc(100vh_-_190px)]">
              <div className="flex-1 rounded-xl flex flex-col">
                {orders?.data?.map(item => (
                  <OrderRow order={item} key={item.id} />
                ))}
              </div>
            </ScrollContainer>
          )}

          <div className="h-[60px] flex-0 rounded-xl bg-white flex items-center px-3 gap-3"></div>
        </div>
    </Layout>
  );
}
