import { Printer } from "@/api/model/printer.ts";
import { useEffect } from "react";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import {Controller, useForm, useWatch} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import * as z from "zod";
import { transformValue } from "@/lib/utils.ts";
import {ReactSelect} from "@/components/common/input/custom.react.select.tsx";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Printer
}

const validationSchema = z.object({
  name: z.string().min(1, "This is required"),
  ip_address: z.string().optional(),
  port: z.number({message: "Invalid Port number"}).optional(),
  prints: z.number({message: "This is required"}).min(1, "This is required"),
  type: z.object({
    label: z.string(),
    value: z.string()
  }).nullable().optional(),
  vid: z.string().optional(),
  pid: z.string().optional()
});

export const PrinterForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
  }

  const { register, control, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: zodResolver(validationSchema)
  });

  useEffect(() => {
    if(data){
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        ip_address: data.ip_address,
        port: data.port,
        prints: data.prints,
        type: data.type ? {
          label: data.type,
          value: data.type
        } : null
      });
    }
  }, [data]);

  const db = useDB();

  const onSubmit = async (values: any) => {
    const vals = {
      ...values,
      type: values?.type ? values.type.value : null
    };

    try {
      if(data?.id){
        await db.update(data.id, {
          ...vals,
        })
      }else{
        await db.create(Tables.printers, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Printer ${values.name} saved`);
    }catch(e){
      toast.error(e);
      console.log(e)
    }
  }

  const type = useWatch({
    name: 'type',
    control: control
  })

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new printer'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-3 flex-col">
            <div className="flex-1">
              <Input label="Name" {...register('name')} autoFocus error={errors?.name?.message}/>
            </div>
            <div className="flex-1">
              <label htmlFor="type">Type</label>
              <Controller
                render={({field}) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={['Network', 'USB', 'Serial', 'Bluetooth'].map(item => ({
                      label: item,
                      value: item
                    }))}
                  />
                )}
                name="type"
                control={control}
              />
            </div>
            {type?.value === 'Network' && (
              <div className="flex-1 flex gap-3">
                <div className="flex-1">
                  <Controller
                    name="ip_address"
                    control={control}
                    render={({field}) => (
                      <Input
                        label="Path"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors?.ip_address?.message}/>
                    )}
                  />

                </div>
                <div className="flex-1">
                  <Controller
                    render={({ field }) => (
                      <Input
                        type="number"
                        label="Port"
                        error={errors?.port?.message}
                        value={transformValue.input(field.value)}
                        onChange={(e) => field.onChange(transformValue.output(e))}
                      />
                    )}
                    name="port"
                    control={control}
                  />
                </div>
              </div>
            )}

            {type?.value === 'USB' && (
              <div className="flex-1 flex gap-3">
                <div className="flex-1">
                  <Controller
                    name="vid"
                    control={control}
                    render={({field}) => (
                      <Input
                        label="VID"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors?.vid?.message}/>
                    )}
                  />

                </div>
                <div className="flex-1">
                  <Controller
                    render={({ field }) => (
                      <Input
                        label="PID"
                        error={errors?.pid?.message}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                    name="pid"
                    control={control}
                  />
                </div>
              </div>
            )}

            {(type?.value === 'Bluetooth' || type?.value === 'Serial') && (
              <div className="flex-1 flex gap-3">
                <div className="flex-1">
                  <Controller
                    name="path"
                    control={control}
                    render={({field}) => (
                      <Input
                        label="Path"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors?.path?.message}/>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <Controller
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Prints"
                    error={errors?.prints?.message}
                    value={transformValue.input(field.value)}
                    onChange={(e) => field.onChange(transformValue.output(e))}
                  />
                )}
                name="prints"
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
