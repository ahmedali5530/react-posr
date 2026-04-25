import { Layout } from "@/screens/partials/layout.tsx";
import {Printersettings} from "@/screens/settings/printers.tsx";
import {ServiceChargesSettings} from "@/screens/settings/service_charges.tsx";
import {CacheSettings} from "@/screens/settings/cache.tsx";
import {TouchSettings} from "@/screens/settings/touch.tsx";

export const Settings = () => {

  return (
    <Layout containerClassName="p-5 gap-5 grid grid-cols-2">
      <Printersettings />
      <CacheSettings />
      <ServiceChargesSettings />
      <TouchSettings />
    </Layout>
  );
}
