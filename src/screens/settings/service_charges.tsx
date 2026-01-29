import { Button } from "@/components/common/input/button.tsx";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { StringRecordId } from "surrealdb";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Printer } from "@/api/model/printer.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import { toast } from "sonner";
import { appPage } from "@/store/jotai.ts";
import {Setting} from "@/api/model/setting.ts";
import {Input} from "@/components/common/input/input.tsx";

export const ServiceChargesSettings = () => {
  const db = useDB();
  const [page] = useAtom(appPage);
  const [settings, setSettings] = useState<Setting>();


  const {control, handleSubmit, reset} = useForm();

  const loadSettings = async () => {
    const [s] = await db.query(`SELECT * FROM ${Tables.settings} where key = $key and is_global = true FETCH values`, {
      key: 'service_charges'
    });

    setSettings(s![0]);
  }

  const saveSettings = async (values: any) => {
    await db.merge(settings.id, {
      values: values
    });
  }

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if(settings){
      reset({
        type: {
          label: settings.values?.type,
          value: settings.values?.type
        },
        value: settings.values?.value
      });
    }
  }, [reset, settings]);

  return (
    <div className="shadow p-5 rounded bg-white">
      <h2 className="text-xl font-semibold mb-1">Service charges</h2>
      <form onSubmit={handleSubmit(saveSettings)}>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <Controller
            render={({field}) => (
              <div>
                <label htmlFor="type">Type</label>
                <ReactSelect
                  options={['fixed', 'percent'].map(item => ({
                    label: item,
                    value: item
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
            name="type"
            control={control}
          />
          <div>
            <Controller
              render={({field}) => (
                <Input
                  label="Value"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                />
              )}
              name="value"
              control={control}
            />

          </div>

        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}