import {useEffect, useMemo, useRef, useState} from "react";
import {ReportsLayout} from "@/screens/partials/reports.layout.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {Order, ORDER_FETCHES} from "@/api/model/order.ts";
import {withCurrency, formatNumber} from "@/lib/utils.ts";
import {calculateOrderItemPrice} from "@/lib/cart.ts";
import {ResponsiveLine} from "@nivo/line";
import {ResponsivePie} from "@nivo/pie";
import {DateTime} from "luxon";
import {
  Package,
  Tag,
  Table as TableIcon,
  UserCheck,
  Truck,
  Clock
} from "lucide-react";
import {TabList, Tabs} from "react-aria-components";
import {Tab, TabPanel} from "@/components/common/react-aria/tabs.tsx";
import { toJsDate, toLuxonDateTime } from "@/lib/datetime.ts";


// ==================== Types ====================
type SalesDataPoint = {
  x: string;
  y: number;
};

type TopItem = {
  name: string;
  quantity: number;
  revenue: number;
};

type CategorySales = {
  id: string;
  label: string;
  value: number;
  color: string;
};

type UserSales = {
  name: string;
  orders: number;
  revenue: number;
};

type TableSales = {
  table: string;
  orders: number;
  revenue: number;
};

type OrderTypeSales = {
  name: string;
  orders: number;
  revenue: number;
};

type PaymentTypeSales = {
  name: string;
  count: number;
  amount: number;
};

// ==================== Constants ====================
const COLORS = [
  '#0046FE', // primary.500
  '#3DE567', // success.500
  '#FFA514', // warning.500
  '#F43A30', // danger.500
  '#30C6E8', // info.500
  '#6598FE', // primary.300
  '#8AF790', // success.300
  '#FFD472', // warning.300
  '#FB9C82', // danger.300
  '#82F4F8', // info.300
];

const safeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateOrderNetSales = (order: Order): number => {
  const grossTotal = order.items?.reduce((sum, item) => sum + calculateOrderItemPrice(item), 0) ?? 0;
  const lineDiscounts = order.items?.reduce((sum, item) => sum + safeNumber(item?.discount), 0) ?? 0;
  const orderDiscount = safeNumber(order.discount_amount);
  const couponDiscount = safeNumber(order.coupon?.discount);
  const extraDiscount = Math.max(0, orderDiscount - lineDiscounts);
  const net = grossTotal - lineDiscounts - extraDiscount - couponDiscount;
  return net > 0 ? net : 0;
};

// ==================== Widget Components ====================

const KPIMetricWidget = ({
  title,
  value,
  gradientFrom,
  gradientTo,
  borderColor,
  textColor,
  labelColor,
}: {
  title: string;
  value: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  labelColor: string;
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} to-${gradientTo} p-4 rounded-lg border ${borderColor}`}>
      <p className={`text-sm font-medium ${labelColor} mb-1`}>{title}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

const SalesLineChart = ({
  data,
  isLoading
}: {
  data: SalesDataPoint[];
  isLoading: boolean;
}) => {
  const chartData = useMemo(() => [
    {
      id: 'Sales',
      data,
    },
  ], [data]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-700">Sales Trend</h2>
          <p className="text-sm text-neutral-500">Revenue over time</p>
        </div>
      </div>
      <div className="h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-sm text-neutral-500">Loading chart...</p>
            </div>
          </div>
        ) : null}
        {data.length > 0 ? (
          <ResponsiveLine
            data={chartData}
            margin={{top: 20, right: 20, bottom: 50, left: 60}}
            xScale={{type: 'point'}}
            yScale={{type: 'linear', min: 0, max: 'auto'}}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickRotation: -45,
              legend: 'Time',
              legendOffset: 40,
              legendPosition: 'middle',
              format: (value: any) => String(value).substring(0, 10),
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Revenue',
              legendOffset: -50,
              legendPosition: 'middle',
              format: (value: any) => withCurrency(value).replace(/\.00$/, ''),
            }}
            enableGridX={false}
            enableGridY={true}
            gridYValues={6}
            colors={['#0046FE']}
            lineWidth={3}
            pointSize={8}
            pointColor="#ffffff"
            pointBorderWidth={2}
            pointBorderColor={{from: 'serieColor'}}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            areaBlendMode="multiply"
            useMesh={true}
            enableSlices="x"
            tooltip={({point}) => (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium text-neutral-900">
                  {DateTime.fromISO(point.data.x || '').toFormat('MMM dd, HH:mm')}
                </p>
                <p className="text-sm text-primary-500 font-semibold">
                  {withCurrency(point.data.y || 0)}
                </p>
              </div>
            )}
            theme={{
              axis: {
                ticks: {
                  text: {fill: '#737373', fontSize: 11},
                },
              },
              grid: {
                line: {stroke: '#e5e5e5', strokeWidth: 1},
              },
              crosshair: {
                line: {stroke: '#0046FE', strokeWidth: 1, strokeDasharray: '4 4'},
              },
              tooltip: {
                container: {
                  background: '#ffffff',
                  borderRadius: '8px',
                },
              },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No sales data for this period
          </div>
        )}
      </div>
    </div>
  );
};

const OrdersPerHourChart = ({
  data,
  isLoading
}: {
  data: SalesDataPoint[];
  isLoading: boolean;
}) => {
  const chartData = useMemo(() => [
    {
      id: 'Orders',
      data,
    },
  ], [data]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-700">Orders Per Hour</h2>
          <p className="text-sm text-neutral-500">Order volume by hour</p>
        </div>
      </div>
      <div className="h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-sm text-neutral-500">Loading chart...</p>
            </div>
          </div>
        ) : null}
        {data.length > 0 ? (
          <ResponsiveLine
            data={chartData}
            margin={{top: 20, right: 20, bottom: 50, left: 60}}
            xScale={{type: 'point'}}
            yScale={{type: 'linear', min: 0, max: 'auto'}}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickRotation: -45,
              legend: 'Hour',
              legendOffset: 40,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Orders',
              legendOffset: -50,
              legendPosition: 'middle',
            }}
            enableGridX={false}
            enableGridY={true}
            gridYValues={6}
            colors={['#3DE567']}
            lineWidth={3}
            pointSize={8}
            pointColor="#ffffff"
            pointBorderWidth={2}
            pointBorderColor={{from: 'serieColor'}}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            areaBlendMode="multiply"
            useMesh={true}
            enableSlices="x"
            tooltip={({point}) => (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium text-neutral-900">
                  Hour: {point.data.x}
                </p>
                <p className="text-sm text-success-500 font-semibold">
                  {formatNumber(point.data.y || 0)} orders
                </p>
              </div>
            )}
            theme={{
              axis: {
                ticks: {
                  text: {fill: '#737373', fontSize: 11},
                },
              },
              grid: {
                line: {stroke: '#e5e5e5', strokeWidth: 1},
              },
              crosshair: {
                line: {stroke: '#3DE567', strokeWidth: 1, strokeDasharray: '4 4'},
              },
              tooltip: {
                container: {
                  background: '#ffffff',
                  borderRadius: '8px',
                },
              },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No orders data
          </div>
        )}
      </div>
    </div>
  );
};

const DayPartsWidget = ({dayParts}: {dayParts: {label: string; orders: number; revenue: number}[]}) => {
  const DAY_PART_COLORS = [
    '#FFA514', // breakfast - warning
    '#3DE567', // lunch - success
    '#0046FE', // dinner - primary
    '#30C6E8', // late night - info
  ];

  const chartData = useMemo(() => [
    {
      id: 'Day Parts',
      data: dayParts.map((part) => ({
        x: part.label,
        y: part.revenue,
      })),
    },
  ], [dayParts]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-warning-100">
          <Clock className="w-5 h-5 text-warning-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Sales by Day Part</h2>
          <p className="text-xs text-neutral-500">Breakfast, Lunch, Dinner, Late Night</p>
        </div>
      </div>
      <div className="h-[250px]">
        {dayParts.length > 0 ? (
          <ResponsivePie
            data={dayParts.map((part, idx) => ({
              id: part.label,
              label: part.label,
              value: part.revenue,
              color: DAY_PART_COLORS[idx % DAY_PART_COLORS.length],
            }))}
            margin={{top: 20, right: 20, bottom: 60, left: 20}}
            innerRadius={0.6}
            padAngle={2}
            cornerRadius={4}
            colors={{datum: 'data.color'}}
            borderWidth={2}
            borderColor={{from: 'color', modifiers: [['darker', 1.2]]}}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            tooltip={({datum}) => {
              const dayPartData = dayParts.find(p => p.label === datum.label);
              return (
                <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{backgroundColor: datum.color}}
                    />
                    <p className="text-sm font-medium text-neutral-900">{datum.label}</p>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {formatNumber(dayPartData?.orders || 0)} orders • {withCurrency(datum.value)}
                  </p>
                </div>
              );
            }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 40,
                itemsSpacing: 10,
                itemWidth: 90,
                itemHeight: 14,
                itemTextColor: '#525252',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 10,
                symbolShape: 'circle',
              },
            ]}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No day part data
          </div>
        )}
      </div>
    </div>
  );
};

const TopSellingItemsWidget = ({items}: {items: TopItem[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-primary-100">
          <Package className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Top Selling Items</h2>
          <p className="text-xs text-neutral-500">By revenue</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.length > 0 ? items.slice(0, 5).map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-500">{formatNumber(item.quantity)} sold</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{withCurrency(item.revenue)}</p>
          </div>
        )) : (
          <p className="text-sm text-neutral-500 text-center py-4">No items sold yet</p>
        )}
      </div>
    </div>
  );
};

const CategoryPieWidget = ({categories}: {categories: CategorySales[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-success-100">
          <Tag className="w-5 h-5 text-success-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Sales by Category</h2>
          <p className="text-xs text-neutral-500">Distribution</p>
        </div>
      </div>
      <div className="h-[250px]">
        {categories.length > 0 ? (
          <ResponsivePie
            data={categories}
            margin={{top: 20, right: 20, bottom: 60, left: 20}}
            innerRadius={0.6}
            padAngle={2}
            cornerRadius={4}
            colors={{datum: 'data.color'}}
            borderWidth={2}
            borderColor={{from: 'color', modifiers: [['darker', 1.2]]}}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            tooltip={({datum}) => (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{backgroundColor: datum.color}}
                  />
                  <p className="text-sm font-medium text-neutral-900">{datum.label}</p>
                </div>
                <p className="text-sm text-neutral-600">
                  {formatNumber(datum.value)} items • {withCurrency(datum.value)}
                </p>
              </div>
            )}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 40,
                itemsSpacing: 10,
                itemWidth: 80,
                itemHeight: 14,
                itemTextColor: '#525252',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 10,
                symbolShape: 'circle',
              },
            ]}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No category data
          </div>
        )}
      </div>
    </div>
  );
};

const TopUsersWidget = ({users}: {users: UserSales[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-info-100">
          <UserCheck className="w-5 h-5 text-info-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Top Cashiers</h2>
          <p className="text-xs text-neutral-500">By performance</p>
        </div>
      </div>
      <div className="space-y-3">
        {users.length > 0 ? users.slice(0, 5).map((user, idx) => (
          <div key={user.name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                idx === 0 ? 'bg-primary-500' : idx === 1 ? 'bg-success-500' : idx === 2 ? 'bg-warning-500' : 'bg-neutral-400'
              }`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                <p className="text-xs text-neutral-500">{formatNumber(user.orders)} orders</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{withCurrency(user.revenue)}</p>
          </div>
        )) : (
          <p className="text-sm text-neutral-500 text-center py-4">No user data</p>
        )}
      </div>
    </div>
  );
};

const TopTablesWidget = ({tables}: {tables: TableSales[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-warning-100">
          <TableIcon className="w-5 h-5 text-warning-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Top Tables</h2>
          <p className="text-xs text-neutral-500">By revenue</p>
        </div>
      </div>
      <div className="space-y-3">
        {tables.length > 0 ? tables.slice(0, 5).map((table, idx) => (
          <div key={table.table} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                idx === 0 ? 'bg-warning-100 text-warning-600' : 'bg-neutral-100 text-neutral-600'
              }`}>
                <TableIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{table.table}</p>
                <p className="text-xs text-neutral-500">{formatNumber(table.orders)} orders</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{withCurrency(table.revenue)}</p>
          </div>
        )) : (
          <p className="text-sm text-neutral-500 text-center py-4">No table data</p>
        )}
      </div>
    </div>
  );
};

const OrderTypeWidget = ({orderTypes}: {orderTypes: OrderTypeSales[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-primary-100">
          <Package className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Order Types</h2>
          <p className="text-xs text-neutral-500">Distribution</p>
        </div>
      </div>
      <div className="space-y-3">
        {orderTypes.length > 0 ? orderTypes.map((type, idx) => (
          <div key={type.name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{type.name}</p>
                <p className="text-xs text-neutral-500">{formatNumber(type.orders)} orders</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{withCurrency(type.revenue)}</p>
          </div>
        )) : (
          <p className="text-sm text-neutral-500 text-center py-4">No order type data</p>
        )}
      </div>
    </div>
  );
};

const PaymentTypeWidget = ({paymentTypes}: {paymentTypes: PaymentTypeSales[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-success-100">
          <Tag className="w-5 h-5 text-success-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Payment Methods</h2>
          <p className="text-xs text-neutral-500">By volume</p>
        </div>
      </div>
      <div className="space-y-3">
        {paymentTypes.length > 0 ? paymentTypes.map((payment, idx) => (
          <div key={payment.name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                idx === 0 ? 'bg-success-100 text-success-600' : 'bg-neutral-100 text-neutral-600'
              }`}>
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{payment.name}</p>
                <p className="text-xs text-neutral-500">{formatNumber(payment.count)} transactions</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{withCurrency(payment.amount)}</p>
          </div>
        )) : (
          <p className="text-sm text-neutral-500 text-center py-4">No payment data</p>
        )}
      </div>
    </div>
  );
};

const DeliverySection = ({orders}: {orders: Order[]}) => {
  const db = useDB();
  const [selectedTab, setSelectedTab] = useState<'map' | 'table'>('map');
  const [mapCenter, setMapCenter] = useState({lat: 0, lng: 0});
  const [mapLoading, setMapLoading] = useState(true);

  // Create custom icon for delivery markers - same as delivery.tsx
  // Load map center from settings - same as delivery.tsx
  useEffect(() => {
    const loadMapCenter = async () => {
      try {
        setMapLoading(true);
        const [r] = await db.query(
          `SELECT * FROM ${Tables.settings} WHERE key = 'map_center' LIMIT 1`
        );

        if (r.length > 0 && r[0].values) {
          setMapCenter({
            lat: r[0].values.lat,
            lng: r[0].values.lng
          });
        }
      } catch (error) {
        console.error("Error loading map center:", error);
      } finally {
        setMapLoading(false);
      }
    };

    loadMapCenter();
  }, []);

  useEffect(() => {
    if(orders.length > 0){
      setMapCenter({
        lat: orders[0].delivery.lat,
        lng: orders[0].delivery.lng,
      });
    }
  }, [orders]);

  const tabs = {
    'map': {
      title: 'Map View',
      component: mapLoading ? (
        <div className="h-[400px] w-full rounded-lg bg-neutral-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
            <p className="text-sm text-neutral-500">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
          {/*<MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={11}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {orders.map(order => {
              // Check for location in delivery object first, then customer (same as delivery.tsx)
              const lat = order.delivery?.lat || order.customer?.lat;
              const lng = order.delivery?.lng || order.customer?.lng;
              const address = order.delivery?.address || order.customer?.address;
              const customerName = order.customer?.name || "Walk-in";

              if (!lat || !lng) return null;

              const icon = order.status === 'Paid' ? completedIcon : deliveryIcon;

              return (
                <Marker
                  key={order.id.toString()}
                  position={[Number(lat), Number(lng)]}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <p className="font-bold text-sm mb-1">Order #{order.invoice_number}</p>
                      <p className="text-xs text-gray-600 mb-1">
                        Status: <span className="font-semibold">{order.status}</span>
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        Customer: <span className="font-semibold">{customerName}</span>
                      </p>
                      {address && (
                        <p className="text-xs text-gray-600 mb-1">
                          Address: <span className="font-semibold">{address}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Total: <span className="font-bold text-primary-500">{withCurrency(calculateOrderNetSales(order))}</span>
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>*/}
        </div>
      )
    },
    'table': {
      title: 'Table View',
      component: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Order #</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Type</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Time</th>
                <th className="py-3 pr-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {orders.length > 0 ? orders.slice(0, 10).map(order => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 pl-4 pr-3 text-sm">
                    <span className="font-mono text-sm font-semibold text-primary-500">#{order.invoice_number}</span>
                  </td>
                  <td className="py-3 px-3 text-sm text-neutral-700">
                    {order.customer?.name || 'Walk-in'}
                  </td>
                  <td className="py-3 px-3 text-sm text-neutral-600">
                    {order.order_type?.name || 'Dine-in'}
                  </td>
                  <td className="py-3 px-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Pending' ? 'bg-warning-100 text-warning-700' :
                      order.status === 'In Progress' ? 'bg-info-100 text-info-700' :
                      'bg-success-100 text-success-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-neutral-600">
                    {toLuxonDateTime(order.created_at).toFormat('HH:mm')}
                  </td>
                  <td className="py-3 pr-4 text-right text-sm font-semibold text-neutral-900">
                    {withCurrency(calculateOrderNetSales(order))}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-neutral-500">
                    No active delivery orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-full bg-primary-100">
            <Truck className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-700">Delivery Orders</h2>
            <p className="text-xs text-neutral-500">Active deliveries</p>
          </div>
        </div>
        <span className="bg-primary-100 text-primary-500 text-xs font-semibold px-3 py-1.5 rounded-full">
          {orders.length} active
        </span>
      </div>
      
      <Tabs
        className="w-full"
        selectedKey={selectedTab}
        onSelectionChange={(key: string) => setSelectedTab(key as 'map' | 'table')}
      >
        <TabList aria-label="Delivery tabs" className="flex flex-row gap-3 mb-4">
          <Tab activeClass="bg-neutral-900 text-warning-500" id="map" key="map">Map View</Tab>
          <Tab activeClass="bg-neutral-900 text-warning-500" id="table" key="table">Table View</Tab>
        </TabList>
        <TabPanel id="map" key="map">
          {tabs.map.component}
        </TabPanel>
        <TabPanel id="table" key="table">
          {tabs.table.component}
        </TabPanel>
      </Tabs>
    </div>
  );
};

const UserSessionsWidget = () => {
  const db = useDB();
  const [sessions, setSessions] = useState<{
    user: string;
    role: string;
    clockIn: string;
    clockOut: string | null;
    duration: string;
    isActive: boolean;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        // Get all users first
        const usersQuery = `
          SELECT * FROM user
          FETCH user_role
        `;
        const usersResult: any = await db.query(usersQuery);
        const users = usersResult?.[0] || [];

        // For each user, get their latest time entry
        const sessionsPromises = users.map(async (user: any) => {
          const entryQuery = `
            SELECT * FROM time_entry
            WHERE user = $userId
            ORDER BY clock_in DESC
            LIMIT 1
          `;
          const entryResult: any = await db.query(entryQuery, {
            userId: user.id
          });
          return {
            user,
            entry: entryResult?.[0]?.[0] || null
          };
        });

        const sessionsResults = await Promise.all(sessionsPromises);

        const sessionsData = sessionsResults
          .filter(({entry}) => entry) // Only users with time entries
          .map(({user, entry}) => {
            const clockIn = toJsDate(entry.clock_in);
            const clockOut = entry.clock_out ? toJsDate(entry.clock_out) : null;
            const durationSeconds = entry.duration_seconds || 0;

            // Format duration
            const hours = Math.floor(durationSeconds / 3600);
            const minutes = Math.floor((durationSeconds % 3600) / 60);
            const duration = clockOut
              ? `${hours}h ${minutes}m`
              : 'Active';

            const firstName = user?.first_name || 'Unknown';
            const lastName = user?.last_name || '';
            const roleName = user?.user_role?.name || 'N/A';

            return {
              user: `${firstName} ${lastName}`.trim(),
              role: roleName,
              clockIn: DateTime.fromJSDate(clockIn).toFormat('MMM dd, HH:mm'),
              clockOut: clockOut ? DateTime.fromJSDate(clockOut).toFormat('MMM dd, HH:mm') : null,
              duration,
              isActive: !clockOut,
            };
          });

        setSessions(sessionsData);
      } catch (error) {
        console.error('Failed to load user sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-full bg-info-100">
            <UserCheck className="w-5 h-5 text-info-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-700">User Sessions</h2>
            <p className="text-xs text-neutral-500">Latest time entries</p>
          </div>
        </div>
        <span className="bg-info-100 text-info-500 text-xs font-semibold px-3 py-1.5 rounded-full">
          {sessions.filter(s => s.isActive).length} active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">User</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Role</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Clock In</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Clock Out</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Duration</th>
              <th className="py-3 pr-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mr-2"></div>
                    <span className="text-sm text-neutral-500">Loading sessions...</span>
                  </div>
                </td>
              </tr>
            ) : sessions.length > 0 ? sessions.map((session, idx) => (
              <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                <td className="py-3 pl-4 pr-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold">
                      {session.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-neutral-900">{session.user}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-neutral-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700">
                    {session.role}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-neutral-700 font-medium">
                  {session.clockIn}
                </td>
                <td className="py-3 px-3 text-sm text-neutral-600">
                  {session.clockOut || '-'}
                </td>
                <td className="py-3 px-3 text-sm">
                  <span className={`font-semibold ${session.isActive ? 'text-success-600' : 'text-neutral-700'}`}>
                    {session.duration}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm">
                  {session.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                      <span className="w-2 h-2 bg-success-500 rounded-full mr-1.5 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-600">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-neutral-500">
                  No user sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LatestOrdersTable = ({orders}: {orders: Order[]}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl border">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-3 rounded-full bg-neutral-100">
          <Clock className="w-5 h-5 text-neutral-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-700">Latest Orders</h2>
          <p className="text-xs text-neutral-500">Last 10 orders</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Invoice #</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Cashier</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Type</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Table</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Items</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Time</th>
              <th className="py-3 pr-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {orders.length > 0 ? orders.slice(0, 10).map(order => (
              <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                <td className="py-3 pl-4 pr-3 text-sm">
                  <span className="font-mono text-sm font-semibold text-primary-500">#{order.invoice_number}</span>
                </td>
                <td className="py-3 px-3 text-sm text-neutral-700">
                  <span>
                    {order.cashier?.first_name || 'Unknown'}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700">
                    {order.order_type?.name || 'Dine-in'}
                  </span>
                </td>
                <td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Pending' ? 'bg-warning-100 text-warning-700' :
                      order.status === 'In Progress' ? 'bg-info-100 text-info-700' :
                        'bg-success-100 text-success-700'
                  }`}>
                      {order.status}
                    </span>
                </td>
                <td className="py-3 px-3 text-sm text-neutral-600">
                  {order?.table?.name || '-'}{order?.table?.number}
                </td>
                <td className="py-3 px-3 text-sm text-neutral-600">
                  {order.items?.length || 0}
                </td>
                <td className="py-3 px-3 text-sm text-neutral-600">
                  {toLuxonDateTime(order.created_at).toFormat(import.meta.env.VITE_DATE_FORMAT)}
                  <br/>
                  {toLuxonDateTime(order.created_at).toFormat(import.meta.env.VITE_TIME_FORMAT)}
                </td>
                <td className="py-3 pr-4 text-right text-sm font-semibold text-neutral-900">
                  {withCurrency(calculateOrderNetSales(order))}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-neutral-500">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
export const SalesDashboardReport = () => {
  const db = useDB();
  const queryRef = useRef(db.query);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse date range from query strings - same pattern as sales.summary.report.tsx
  const filters = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const startDate = params.get('start_date') || params.get('start') || null;
    const endDate = params.get('end_date') || params.get('end') || null;
    return {startDate, endDate};
  }, []);

  useEffect(() => {
    queryRef.current = db.query;
  }, [db]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const conditions: string[] = [];
        const params: Record<string, string> = {};

        if (filters.startDate) {
          conditions.push(`time::format(created_at, "%Y-%m-%d") >= $startDate`);
          params.startDate = filters.startDate;
        }

        if (filters.endDate) {
          conditions.push(`time::format(created_at, "%Y-%m-%d") <= $endDate`);
          params.endDate = filters.endDate;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const ordersQuery = `
          SELECT * FROM ${Tables.orders}
          ${whereClause}
          FETCH ${ORDER_FETCHES.join(', ')}
        `;

        const ordersResult: any = await queryRef.current(ordersQuery, params);
        setOrders((ordersResult?.[0] ?? []) as Order[]);
      } catch (err) {
        console.error("Failed to load sales dashboard", err);
        setError(err instanceof Error ? err.message : "Unable to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // ==================== Data Processing ====================
  const kpis = useMemo(() => {
    const paidOrders = orders.filter(o => o.status === 'Paid');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + calculateOrderNetSales(order), 0);
    const totalOrders = paidOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItems = orders.reduce((sum, order) => {
      return sum + (order.items?.reduce((itemSum, item) => itemSum + safeNumber(item.quantity), 0) || 0);
    }, 0);
    const totalDiscounts = orders.reduce((sum, order) => sum + safeNumber(order.discount_amount), 0);
    const totalTaxes = orders.reduce((sum, order) => sum + safeNumber(order.tax_amount), 0);
    const totalServiceCharges = orders.reduce((sum, order) => sum + safeNumber(order.service_charge_amount), 0);
    const totalTips = orders.reduce((sum, order) => sum + safeNumber(order.tip_amount), 0);
    const totalCoupons = orders.reduce((sum, order) => sum + safeNumber(order.coupon?.discount), 0);
    
    // Calculate voids
    const totalVoids = orders.reduce((sum, order) => {
      const allItems = order.items || [];
      const voidedItems = allItems.filter(item => item.is_refunded);
      return sum + safeNumber(
        voidedItems.reduce((itemSum, item) => {
          const price = calculateOrderItemPrice(item);
          return itemSum + safeNumber(price);
        }, 0)
      );
    }, 0);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalItems,
      totalDiscounts,
      totalTaxes,
      totalServiceCharges,
      totalTips,
      totalCoupons,
      totalVoids,
    };
  }, [orders]);

  const salesTrendData = useMemo((): SalesDataPoint[] => {
    const grouped = new Map<string, number>();

    orders.filter(o => o.status === 'Paid').forEach(order => {
      const date = toLuxonDateTime(order.created_at);
      const key = date.toFormat('yyyy-MM-dd HH:00');

      grouped.set(key, (grouped.get(key) || 0) + calculateOrderNetSales(order));
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([x, y]) => ({x, y}));
  }, [orders]);

  const ordersPerHourData = useMemo((): SalesDataPoint[] => {
    const grouped = new Map<string, number>();

    orders.forEach(order => {
      const date = toLuxonDateTime(order.created_at);
      const key = date.toFormat('HH:00');

      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([x, y]) => ({x, y}));
  }, [orders]);

  const dayParts = useMemo(() => {
    const DAY_PARTS = [
      {label: 'Breakfast', startHour: 5, endHour: 11},
      {label: 'Lunch', startHour: 11, endHour: 16},
      {label: 'Dinner', startHour: 16, endHour: 22},
      {label: 'Late Night', startHour: 22, endHour: 5},
    ];

    const getDayPart = (date: Date) => {
      const hour = date.getHours();
      for (const part of DAY_PARTS) {
        const wrapsMidnight = part.startHour > part.endHour;
        if (
          (!wrapsMidnight && hour >= part.startHour && hour < part.endHour) ||
          (wrapsMidnight && (hour >= part.startHour || hour < part.endHour))
        ) {
          return part.label;
        }
      }
      return DAY_PARTS[0].label;
    };

    const map = new Map<string, {orders: number; revenue: number}>();

    orders.filter(o => o.status === 'Paid').forEach(order => {
      const dayPart = getDayPart(toJsDate(order.created_at));
      const current = map.get(dayPart) || {orders: 0, revenue: 0};
      current.orders += 1;
      current.revenue += calculateOrderNetSales(order);
      map.set(dayPart, current);
    });

    return DAY_PARTS
      .map(part => ({
        label: part.label,
        orders: map.get(part.label)?.orders || 0,
        revenue: map.get(part.label)?.revenue || 0,
      }))
      .filter(part => part.orders > 0);
  }, [orders]);

  const topItems = useMemo((): TopItem[] => {
    const map = new Map<string, {quantity: number; revenue: number}>();

    orders.forEach(order => {
      order.items?.forEach(item => {
        const name = item.item?.name || 'Unknown';
        const current = map.get(name) || {quantity: 0, revenue: 0};
        current.quantity += safeNumber(item.quantity ?? 1);
        current.revenue += calculateOrderItemPrice(item);
        map.set(name, current);
      });
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({name, ...data}))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const categorySales = useMemo((): CategorySales[] => {
    const map = new Map<string, number>();

    orders.forEach(order => {
      order.items?.forEach(item => {
        const category = item.item?.categories?.[0]?.name || item.category || 'Other';
        map.set(category, (map.get(category) || 0) + safeNumber(item.quantity));
      });
    });

    return Array.from(map.entries())
      .map(([label, value], idx) => ({
        id: label,
        label,
        value,
        color: COLORS[idx % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  const topUsers = useMemo((): UserSales[] => {
    const map = new Map<string, {orders: number; revenue: number}>();

    orders.filter(o => o.status === 'Paid').forEach(order => {
      const name = `${order.cashier?.first_name || 'U'} ${order.cashier?.last_name || ''}`.trim() || 'Unknown';
      const current = map.get(name) || {orders: 0, revenue: 0};
      current.orders += 1;
      current.revenue += calculateOrderNetSales(order);
      map.set(name, current);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({name, ...data}))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const topTables = useMemo((): TableSales[] => {
    const map = new Map<string, {orders: number; revenue: number}>();

    orders.filter(o => o.status === 'Paid').forEach(order => {
      const table = order?.table ? `${order.table?.name}${order.table?.number}` : 'Delivery';
      const current = map.get(table) || {orders: 0, revenue: 0};
      current.orders += 1;
      current.revenue += calculateOrderNetSales(order);
      map.set(table, current);
    });

    return Array.from(map.entries())
      .map(([table, data]) => ({table, ...data}))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const orderTypes = useMemo((): OrderTypeSales[] => {
    const map = new Map<string, {orders: number; revenue: number}>();

    orders.filter(o => o.status === 'Paid').forEach(order => {
      const type = order.order_type?.name || 'Dine-in';
      const current = map.get(type) || {orders: 0, revenue: 0};
      current.orders += 1;
      current.revenue += calculateOrderNetSales(order);
      map.set(type, current);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({name, ...data}))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const paymentTypes = useMemo((): PaymentTypeSales[] => {
    const map = new Map<string, {count: number; amount: number}>();

    orders.filter(o => o.status === 'Paid').forEach(order => {
      order.payments?.forEach(payment => {
        const typeName = payment.payment_type?.name || 'Cash';
        const current = map.get(typeName) || {count: 0, amount: 0};
        current.count += 1;
        current.amount += safeNumber(payment.amount);
        map.set(typeName, current);
      });
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({name, ...data}))
      .sort((a, b) => b.amount - a.amount);
  }, [orders]);

  const deliveryOrders = useMemo(() => {
    return orders.filter(o =>
      o.delivery && o.status !== 'Paid' && o.status !== 'Cancelled'
    ).sort((a, b) =>
      toJsDate(b.created_at).getTime() - toJsDate(a.created_at).getTime()
    );
  }, [orders]);

  const latestOrders = useMemo(() => {
    return orders.sort((a, b) =>
      toJsDate(b.created_at).getTime() - toJsDate(a.created_at).getTime()
    );
  }, [orders]);

  const reportTitle = useMemo(() => {
    if (filters.startDate && filters.endDate) {
      return `Sales Dashboard - ${filters.startDate} to ${filters.endDate}`;
    } else if (filters.startDate) {
      return `Sales Dashboard - From ${filters.startDate}`;
    } else if (filters.endDate) {
      return `Sales Dashboard - Until ${filters.endDate}`;
    }
    return 'Sales Dashboard - All Time';
  }, [filters]);

  if (error) {
    return (
      <ReportsLayout title="Sales dashboard">
        <div className="py-12 text-center text-danger-500">Failed to load dashboard: {error}</div>
      </ReportsLayout>
    );
  }

  return (
    <ReportsLayout title="Sales dashboard" subtitle={reportTitle}>
      <div className="space-y-5">
        {/* KPI Metrics Grid - Matching clock.tsx style */}
        <div className="rounded-lg shadow-xl border">
          {/*<h2 className="bg-gradient-to-br from-info-100 to-primary-100 text-2xl font-bold mb-4 text-neutral-700 border-b p-5">Key Metrics</h2>*/}
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 p-5">
            <KPIMetricWidget
              title="Total Revenue"
              value={withCurrency(kpis.totalRevenue)}
              gradientFrom="from-success-100"
              gradientTo="success-200"
              borderColor="border-success-300"
              textColor="text-success-900"
              labelColor="text-success-700"
            />
            <KPIMetricWidget
              title="Total Orders"
              value={formatNumber(kpis.totalOrders)}
              gradientFrom="from-primary-100"
              gradientTo="primary-200"
              borderColor="border-primary-300"
              textColor="text-primary-900"
              labelColor="text-primary-700"
            />
            <KPIMetricWidget
              title="Avg Order Value"
              value={withCurrency(kpis.avgOrderValue)}
              gradientFrom="from-info-100"
              gradientTo="info-200"
              borderColor="border-info-300"
              textColor="text-info-900"
              labelColor="text-info-700"
            />
            <KPIMetricWidget
              title="Items Sold"
              value={formatNumber(kpis.totalItems)}
              gradientFrom="from-warning-100"
              gradientTo="warning-200"
              borderColor="border-warning-300"
              textColor="text-warning-900"
              labelColor="text-warning-700"
            />
            <KPIMetricWidget
              title="Total Discounts"
              value={withCurrency(kpis.totalDiscounts)}
              gradientFrom="from-danger-100"
              gradientTo="danger-200"
              borderColor="border-danger-300"
              textColor="text-danger-900"
              labelColor="text-danger-700"
            />
            <KPIMetricWidget
              title="Taxes Collected"
              value={withCurrency(kpis.totalTaxes)}
              gradientFrom="from-primary-100"
              gradientTo="primary-200"
              borderColor="border-primary-300"
              textColor="text-primary-900"
              labelColor="text-primary-700"
            />
            <KPIMetricWidget
              title="Service Charges"
              value={withCurrency(kpis.totalServiceCharges)}
              gradientFrom="from-info-100"
              gradientTo="info-200"
              borderColor="border-info-300"
              textColor="text-info-900"
              labelColor="text-info-700"
            />
            <KPIMetricWidget
              title="Tips"
              value={withCurrency(kpis.totalTips)}
              gradientFrom="from-success-100"
              gradientTo="success-200"
              borderColor="border-success-300"
              textColor="text-success-900"
              labelColor="text-success-700"
            />
            <KPIMetricWidget
              title="Coupons"
              value={withCurrency(kpis.totalCoupons)}
              gradientFrom="from-warning-100"
              gradientTo="warning-200"
              borderColor="border-warning-300"
              textColor="text-warning-900"
              labelColor="text-warning-700"
            />
            <KPIMetricWidget
              title="Voids"
              value={withCurrency(kpis.totalVoids)}
              gradientFrom="from-danger-100"
              gradientTo="danger-200"
              borderColor="border-danger-300"
              textColor="text-danger-900"
              labelColor="text-danger-700"
            />
          </div>
        </div>

        {/* Sales Chart and Delivery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <SalesLineChart
              data={salesTrendData}
              isLoading={loading}
            />
          </div>
          <div className="lg:col-span-1">
            <DeliverySection orders={deliveryOrders} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Orders Per Hour Chart */}
          <div className="lg:col-span-2">
            <OrdersPerHourChart
              data={ordersPerHourData}
              isLoading={loading}
            />
          </div>
          <CategoryPieWidget categories={categorySales} />
        </div>

        {/* Top Items and Day Parts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TopSellingItemsWidget items={topItems} />
          <DayPartsWidget dayParts={dayParts} />
        </div>

        {/* Users and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TopUsersWidget users={topUsers} />
          <TopTablesWidget tables={topTables} />
        </div>

        {/* Order Types and Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <OrderTypeWidget orderTypes={orderTypes} />
          <PaymentTypeWidget paymentTypes={paymentTypes} />
        </div>

        {/* User Sessions */}
        <UserSessionsWidget />

        {/* Latest Orders */}
        <LatestOrdersTable orders={latestOrders} />
      </div>
    </ReportsLayout>
  );
};
