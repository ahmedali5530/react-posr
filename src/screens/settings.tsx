import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useState } from "react";
import { useAtom } from "jotai";
import { appSettings } from "@/store/jotai.ts";

export const Settings = () => {
  const [settings, setSettings] = useAtom(appSettings);

  const [isLoading, setLoading] = useState(false);
  const loadData = async () => {
    setLoading(true);

    setSettings(prev => ({
      ...prev
    }));
    setLoading(false);
  }

  return (
    <Layout containerClassName="p-5">
      <div className="bg-white shadow p-5 rounded-lg">
        <h1 className="text-3xl">Device settings</h1>
        <p className="text-sm text-neutral-500">Settings will be saved on device not in database and will be same for all users logged into this device.</p>

        <div className="mt-5">
          <h4 className="text-xl">Default printer</h4>
        </div>
      </div>
    </Layout>
  );
}
