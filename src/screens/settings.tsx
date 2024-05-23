import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useState } from "react";
import { useAtom } from "jotai/index";
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
    <Layout>
      <Button variant="primary" onClick={loadData} isLoading={isLoading}>Load data from file</Button>
    </Layout>
  );
}
