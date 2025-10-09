import { TabList, Tabs } from "react-aria-components";
import { Layout } from "@/screens/partials/layout.tsx";
import { Tab, TabPanel } from "@/components/common/react-aria/tabs";
import { useState } from "react";
import { AdminFloors } from "@/components/settings/floors";
import { AdminTables } from "@/components/settings/tables";
import { AdminDishes } from "@/components/settings/dishes";
import { AdminCategories } from "@/components/settings/categories";
import { AdminModifierGroups } from "@/components/settings/modifier_groups";
import { AdminDiscounts } from "@/components/settings/discounts";
import { AdminKitchens } from "@/components/settings/kitchens";
import { AdminPrinters } from "@/components/settings/printers";
import { AdminOrderTypes } from "@/components/settings/order_types";
import { AdminPaymentTypes } from "@/components/settings/payment_types";
import { AdminTaxes } from "@/components/settings/taxes";
import { AdminUsers } from "@/components/settings/users";
import ScrollContainer from "react-indiana-drag-scroll";

export const Admin = () => {
  const [selected, setSelected] = useState('dishes');

  const pages = {
    'dishes': { component: <AdminDishes/>, title: 'Dishes' },
    'categories': { component: <AdminCategories/>, title: 'Categories' },
    'modifier_groups': { component: <AdminModifierGroups/>, title: 'Modifier Groups' },
    'tables': { component: <AdminTables/>, title: 'Tables' },
    'floors': { component: <AdminFloors/>, title: 'Floors' },
    'discounts': { component: <AdminDiscounts/>, title: 'Discounts' },
    'kitchens': { component: <AdminKitchens/>, title: 'Kitchens' },
    'Printers': { component: <AdminPrinters/>, title: 'Printers' },
    'order_types': { component: <AdminOrderTypes/>, title: 'Order Types' },
    'payment_types': { component: <AdminPaymentTypes/>, title: 'Payment types' },
    'Taxes': { component: <AdminTaxes/>, title: 'Taxes' },
    'Users': { component: <AdminUsers/>, title: 'Users' },
  };

  return (
    <Layout>
      <Tabs
        className="w-full flex flex-col"
        selectedKey={selected}
        onSelectionChange={(key: string) => setSelected(key)}
      >
        <ScrollContainer mouseScroll hideScrollbars={false} className="flex-grow-0 flex-shrink">
          <TabList aria-label="Tabs" className="flex flex-row gap-3 px-1 py-3 flex-nowrap border-t-0 border-x-0 border-4 bg-white">
            {Object.keys(pages).map(key => (
              <Tab id={key} key={key}>{pages[key].title}</Tab>
            ))}
          </TabList>
        </ScrollContainer>
        {Object.keys(pages).map((key) => (
          <TabPanel id={key} key={key} className="bg-white shadow flex-grow flex-shrink-0">
            <div>
              {pages[key].component}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </Layout>
  )
}
