import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useState } from "react";
import { useAtom } from "jotai";
import { appSettings } from "@/store/jotai.ts";

export const Inventory = () => {

  return (
    <Layout containerClassName="p-5">
      <div className="bg-white shadow p-5 rounded-lg">
        <h1 className="text-3xl">Inventory</h1>

        <div className="mt-5">
          <h4 className="text-xl">Inventory</h4>
        </div>
      </div>
    </Layout>
  );
}
