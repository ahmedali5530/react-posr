import {TabList, Tabs} from "react-aria-components";
import {Tab, TabPanel} from "@/components/common/react-aria/tabs.tsx";
import {useState} from "react";
import {Delivery} from "@/screens/delivery/delivery.tsx";
import {DeliverySettings} from "@/screens/delivery/settings.tsx";
import {Layout} from "@/screens/partials/layout.tsx";
import {DeliveryAreas} from "@/screens/delivery/delivery.areas.tsx";

export const Index = () => {
  const [selected, setSelected] = useState('delivery');

  const pages = {
    'delivery': {component: <Delivery/>, title: 'Delivery orders'},
    'areas': {component: <DeliveryAreas/>, title: 'Delivery areas'},
    'settings': {component: <DeliverySettings/>, title: 'Settings'},
  };

  return (
    <Layout>
      <Tabs
        className="w-full flex flex-col rounded-xl"
        selectedKey={selected}
        onSelectionChange={(key: string) => setSelected(key)}
      >
        <TabList aria-label="Tabs"
                 className="flex flex-row gap-3 px-1 py-3 flex-nowrap">
          {Object.keys(pages).map(key => (
            <Tab id={key} key={key}>{pages[key].title}</Tab>
          ))}
        </TabList>
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
