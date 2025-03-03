import { Printer } from "@/api/model/printer.ts";
import { Kitchen } from "@/api/model/kitchen.ts";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Controller, useForm } from "react-hook-form";
import { transformValue } from "@/lib/utils.ts";
import { Button } from "@/components/common/input/button.tsx";
import { useEffect } from "react";
import { useDB } from "@/api/db/db.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tables } from "@/api/db/tables.ts";
import { toast } from "sonner";
import * as z from "zod";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Dish } from "@/api/model/dish.ts";
import { StringRecordId } from "surrealdb";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Kitchen
}

const validationSchema = z.object({
  name: z.string().min(1, "This is required"),
  printers: z.array(z.object({
    label: z.string(),
    value: z.string()
  })),
  items: z.array(z.object({
    label: z.string(),
    value: z.string()
  })),
  priority: z.number({message: "This is required"}),
});

export const KitchenForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      printers: [],
      priority: null,
      items: []
    });
  }

  useEffect(() => {
    if(data){
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        printers: data?.printers?.map(item => ({
          label: item.name,
          value: item.id.toString()
        })),
        items: data?.items?.map(item => ({
          label: item.name,
          value: item.id.toString()
        })),
      });
    }
  }, [data]);

  const db = useDB();

  const {
    data: printers,
    fetchData: fetchPrinters
  } = useApi<SettingsData<Printer>>(Tables.printers, [], ['priority asc'], 0, 99999, [], {
    enabled: false
  });

  const {
    data: dishes,
    fetchData: fetchDishes
  } = useApi<SettingsData<Dish>>(Tables.dishes, [], ['priority asc'], 0, 99999, [], {
    enabled: false
  });

  const { register, control, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: zodResolver(validationSchema)
  });

  const onSubmit = async (values: any) => {
    const vals = {...values};
    if(values.items){
      vals.items = values.items.map(item => new StringRecordId(item.value));
    }

    if(values.printers){
      vals.printers = values.printers.map(item => new StringRecordId(item.value));
    }

    try {
      if(data?.id){
        await db.update(data.id, {
          ...vals
        })
      }else{
        await db.create(Tables.kitchens, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Kitchen ${values.name} saved`);
    }catch(e){
      toast.error(e);
      console.log(e)
    }
  }

  useEffect(() => {
    if(open){
      fetchPrinters();
      fetchDishes();
    }
  }, [open]);

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new kitchen'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-3 flex-col">
            <div className="flex-1">
              <Input label="Name" {...register('name')} autoFocus error={errors?.name?.message}/>
            </div>

            <div className="flex-1">
              <label htmlFor="">Dishes</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={dishes?.data?.map(item => ({
                      label: item.name,
                      value: item.id.toString()
                    }))}
                    isMulti
                  />
                )}
                name="items"
                control={control}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="">Printers</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={printers?.data?.map(item => ({
                      label: item.name,
                      value: item.id.toString()
                    }))}
                    isMulti
                  />
                )}
                name="printers"
                control={control}
              />
            </div>
            <div className="flex-1">
              <Controller
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Priority"
                    error={errors?.priority?.message}
                    value={transformValue.input(field.value)}
                    onChange={(e) => field.onChange(transformValue.output(e))}
                  />
                )}
                name="priority"
                control={control}
              />
            </div>
          </div>
          <div>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
