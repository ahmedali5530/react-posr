import {TabList, Tabs} from "react-aria-components";
import {Layout} from "@/screens/partials/layout.tsx";
import {Tab, TabPanel} from "@/components/common/react-aria/tabs";
import {useState} from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import {InventoryItems} from "@/components/inventory/items/index.tsx";
import {InventorySuppliers} from "@/components/inventory/suppliers/index.tsx";
import {InventoryCategories} from "@/components/inventory/categories/index.tsx";
import {InventoryStores} from "@/components/inventory/stores/index.tsx";
import {InventoryItemGroups} from "@/components/inventory/item_groups/index.tsx";
import {InventoryPurchaseOrders} from "@/components/inventory/purchase_orders/index.tsx";
import {InventoryPurchases} from "@/components/inventory/purchases/index.tsx";
import {InventoryPurchaseReturns} from "@/components/inventory/purchase_returns/index.tsx";
import {InventoryIssues} from "@/components/inventory/issues/index.tsx";
import {InventoryIssueReturns} from "@/components/inventory/issue_returns/index.tsx";
import {InventoryWastes} from "@/components/inventory/wastes/index.tsx";
import {InventorySummary} from "@/components/inventory/inventory/summary.tsx";

export const Inventory = () => {
  const [selected, setSelected] = useState('inventory');

  const pages = {
    'inventory': {component: <InventorySummary/>, title: 'Inventory'},
    'items': {component: <InventoryItems/>, title: 'Items'},
    'suppliers': {component: <InventorySuppliers/>, title: 'Suppliers'},
    'categories': {component: <InventoryCategories/>, title: 'Categories'},
    'stores': {component: <InventoryStores/>, title: 'Stores'},
    'item-groups': {component: <InventoryItemGroups/>, title: 'Item Groups'},
    'purchase-orders': {component: <InventoryPurchaseOrders/>, title: 'Purchase Orders'},
    'purchases': {component: <InventoryPurchases/>, title: 'Purchases'},
    'purchase-returns': {component: <InventoryPurchaseReturns/>, title: 'Purchase Returns'},
    'issues': {component: <InventoryIssues/>, title: 'Issues'},
    'issue-returns': {component: <InventoryIssueReturns/>, title: 'Issue Returns'},
    'wastes': {component: <InventoryWastes/>, title: 'Wastes'},
  };

  return (
    <Layout
      containerClassName=""
    >
      <Tabs
        className="w-full flex flex-col rounded-xl"
        selectedKey={selected}
        onSelectionChange={(key: string) => setSelected(key)}
      >
        <ScrollContainer mouseScroll hideScrollbars={false} className="flex-grow-0 flex-shrink bg-white">
          <TabList aria-label="Tabs"
                   className="flex flex-row gap-3 px-1 py-3 flex-nowrap">
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
