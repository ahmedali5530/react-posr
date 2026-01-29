import {Layout} from "@/screens/partials/layout.tsx";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {Order as OrderModel, OrderStatus} from "@/api/model/order.ts";
import {Tables} from "@/api/db/tables.ts";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDB} from "@/api/db/db.ts";
import {OrderBox} from "@/components/orders/order.box.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import {Floor} from "@/api/model/floor.ts";
import {ReactSelect} from "@/components/common/input/custom.react.select.tsx";
import {User} from "@/api/model/user.ts";
import {useAtom} from "jotai";
import {appAlert, appPage, appSettings} from "@/store/jotai.ts";
import {OrderType} from "@/api/model/order_type.ts";
import {DatePicker} from "@/components/common/react-aria/datepicker.tsx";
import {getLocalTimeZone, today} from '@internationalized/date';
import {DateValue} from "react-aria-components";
import {Button} from "@/components/common/input/button.tsx";
import {faBars, faChair, faTableColumns} from "@fortawesome/free-solid-svg-icons";
import {OrderRow} from "@/components/orders/order.row.tsx";
import {Table} from "@/api/model/table.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Dropdown, DropdownItem} from "@/components/common/react-aria/dropdown.tsx";
import {RecordId, StringRecordId} from "surrealdb";
import {toast} from "sonner";
import {useQueryBuilder} from "@/api/db/query-builder.ts";

export const Orders = () => {
  const db = useDB();
  const [liveQuery, setLiveQuery] = useState(null);

  const [params, setParams] = useAtom(appSettings);
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));
  const [view, setView] = useState<'row' | 'column'>('column');

  const [merging, setMerging] = useState<boolean>(false);
  const [mergingOrders, setMergingOrders] = useState<OrderModel[]>([]);
  const [mergingTable, setMergingTable] = useState<string>();

  const [, setAlert] = useAtom(appAlert);
  const [app, ] = useAtom(appPage);

  const [orders, setOrders] = useState<OrderModel[]>([]);

  const orderFilters = useMemo(() => {
    const floorFilters = [];
    const userFilters = [];
    const orderTypeFilters = [];
    const statusFilters = [];

    const f = [];

    params.ordersFilters.floors.forEach(floor => {
      floorFilters.push(`floor = ${floor.value}`);
    });
    if (floorFilters.length > 0) {
      f.push(`(${floorFilters.join(' or ')})`);
    }

    params.ordersFilters.users.forEach(user => {
      userFilters.push(`user = ${user.value}`);
    });
    if (userFilters.length > 0) {
      f.push(`(${userFilters.join(' or ')})`);
    }

    params.ordersFilters.statuses.forEach(status => {
      statusFilters.push(`status = "${status.value}"`);
    });
    if (statusFilters.length > 0) {
      f.push(`(${statusFilters.join(' or ')})`);
    }

    params.ordersFilters.orderTypes.forEach(order_type => {
      orderTypeFilters.push(`order_type = ${order_type.value}`);
    });
    if (orderTypeFilters.length > 0) {
      f.push(`(${orderTypeFilters.join(' or ')})`);
    }

    if (date) {
      f.push(`(time::format(created_at, "%Y-%m-%d") = "${date?.toString()}")`);
    }

    return f;
  }, [params.ordersFilters, date]);


  const ordersQb = useQueryBuilder(
    Tables.orders, '*', orderFilters.map(item => `and ${item}`), 99999, 0, ['created_at desc'],
    ['items', 'items.item', 'item.item.modifiers', 'table', 'user', 'order_type', 'customer', 'discount', 'tax', 'payments', 'payments.payment_type', 'extras', 'extras.order_extras']
  );

  useEffect(() => {
    ordersQb.setWheres(orderFilters.map(item => `and ${item}`));
  }, [orderFilters]);

  const fetchOrders = useCallback(async () => {
    const [listQuery] = await db.query(ordersQb.queryString, ordersQb.parameters);

    setOrders(listQuery as OrderModel[]);
  }, [ordersQb.queryString, ordersQb.parameters]);

  useEffect(() => {
    fetchOrders();
  }, [ordersQb.queryString, ordersQb.parameters]);

  const {
    data: floors,
  } = useApi<SettingsData<Floor>>(Tables.floors, [], ['priority asc'], 0, 99999);

  const {
    data: tables,
  } = useApi<SettingsData<Table>>(Tables.tables, [], ['floor.name asc'], 0, 99999);

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

  const selectedTable = useMemo(() => {
    return tables?.data.find(item => item.id.toString() === mergingTable);
  }, [mergingTable, tables?.data]);

  const nextInvoiceNumber = async () => {
    return await db.query(
      `SELECT math::max(invoice_number) as invoice_number from ${Tables.orders} group all`
    );
  }

  const [isSaving, setIsSaving] = useState(false);
  const confirmMerge = async () => {

    if (!mergingTable) {
      setAlert(prev => ({
        ...prev,
        opened: true,
        type: 'error',
        message: 'Please choose a new table'
      }))

      return;
    }

    setIsSaving(true);

    try {

      let items = [];
      for (const order of mergingOrders) {

        // Create order items for this split
        items = [
          ...items,
          ...order.items.map(item => item.id)
        ];

        // Mark orders as merged
        await db.merge(order.id, {
          status: OrderStatus['Merged'],
          tags: [...(order.tags || []), OrderStatus['Merged']]
        });
      }

      const baseInvoiceNumber = await nextInvoiceNumber();

      const orderData = {
        floor: new RecordId('floor', selectedTable.floor.id),
        covers: mergingOrders.reduce((prev, item) => prev + item.covers, 0) || 1, // Distribute covers
        // tax: order.tax ? new StringRecordId(order.tax.id.toString()) : null,
        // tax_amount: 0, // Will be calculated per split
        tags: ['Merge order'],
        // discount: order.discount ? new StringRecordId(order.discount.id.toString()) : null,
        // discount_amount: 0, // Will be calculated per split
        // customer: order.customer ? new StringRecordId(order.customer.id.toString()) : null,
        order_type: mergingOrders[0].order_type.id,
        status: OrderStatus["In Progress"],
        invoice_number: baseInvoiceNumber[0][0].invoice_number,
        items: items,
        table: new StringRecordId(mergingTable),
        user: mergingOrders[0].user.id,
        created_at: mergingOrders[0].created_at,
      };

      const mergedOrder = await db.create(Tables.orders, orderData);

      for (const item of items) {
        await db.merge(item, {
          order: mergedOrder[0].id
        });
      }

      // create merge entry
      await db.create(Tables.order_merge, {
        created_at: new Date(),
        created_by: app.user.id,
        new_order: mergedOrder[0].id,
        old_orders: mergingOrders.map(item => item.id),
      })

      toast.success(`Successfully merged into ${mergedOrder[0].invoice_number}`);

      // reset to default
      setMerging(false);
      setMergingTable(undefined);
      setMergingOrders([]);

    } catch (error) {
      console.error('Error creating merging orders:', error);
      toast.error('Failed to create merging orders');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout containerClassName="overflow-hidden">
      <div className="flex gap-5 p-3 flex-col">
        <div className="h-[60px] flex-0 rounded-xl bg-white flex items-center px-3 gap-3">
          <div className="min-w-[200px]">
            <ReactSelect
              options={[OrderStatus["In Progress"], OrderStatus.Paid, OrderStatus.Cancelled, OrderStatus.Spilt, OrderStatus.Merged].map(item => ({
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
            <Button icon={faTableColumns} variant="primary" onClick={() => setView('column')}
                    active={view === 'column'}>
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
              {orders.map(item => (
                <div className="w-[400px] flex-shrink-0" key={item.id}>
                  <OrderBox
                    order={item}
                    merging={merging}
                    mergingOrders={mergingOrders}
                    onMergeSelect={(order, status) => {
                      if (status) {
                        setMerging(true);

                        setMergingOrders(prev => [
                          ...prev,
                          order
                        ]);
                      } else {
                        setMergingOrders(prev => prev.filter(order => order.id.toString() !== item.id.toString()));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </ScrollContainer>
        )}

        {view === 'row' && (
          <ScrollContainer className="max-h-[calc(100vh_-_190px)]">
            <div className="flex-1 rounded-xl flex flex-col">
              {orders.map(item => (
                <OrderRow order={item} key={item.id}/>
              ))}
            </div>
          </ScrollContainer>
        )}

        <div className="h-[60px] flex-0 rounded-xl bg-white flex items-center px-3 gap-3">
          {merging && (
            <div className="flex gap-5">
              <Dropdown
                label={<><FontAwesomeIcon icon={faChair} className="mr-3"/> Choose a
                  table {selectedTable ? `(${selectedTable.name}${selectedTable.number})` : ''}</>}
                btnSize="lg"
                className="flex-1"
                onAction={(key) => {
                  setMergingTable(key.toString());
                }}
              >
                {tables?.data?.map(item => (
                  <DropdownItem isActive={item.id.toString() === mergingTable} id={item.id.toString()}
                                key={item.id.toString()} className="min-w-[200px]">
                    {item.name + '' + item.number}
                  </DropdownItem>
                ))}
              </Dropdown>

              <Button
                variant="success"
                size="lg"
                disabled={mergingOrders.length <= 1 || isSaving}
                onClick={confirmMerge}
                isLoading={isSaving}
              >
                {mergingOrders.length <= 1 ? 'Select 2 or more orders' : <>Confirm merging
                  of {mergingOrders.length} orders</>}
              </Button>

              <Button flat size="lg" variant="danger" onClick={() => {
                setMerging(false);
                setMergingOrders([]);
              }}>
                Cancel merging
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
