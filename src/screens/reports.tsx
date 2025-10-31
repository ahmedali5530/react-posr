import { Layout } from "@/screens/partials/layout.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useState } from "react";
import { useAtom } from "jotai";
import { appSettings } from "@/store/jotai.ts";

export const Reports = () => {

  return (
    <Layout containerClassName="p-5">
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-1">
          <div className="bg-white shadow p-5 rounded-lg">
            <h1 className="text-3xl">Reports categories</h1>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow p-5 rounded-lg">
            <h1 className="text-3xl">Sub reports</h1>
          </div>
        </div>
        <div className="col-span-3">
          <div className="bg-white shadow p-5 rounded-lg">
            <h1 className="text-3xl">Report filters</h1>
          </div>
        </div>
      </div>

    </Layout>
  );
}
