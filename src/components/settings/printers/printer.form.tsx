import { Printer } from "@/api/model/printer.ts";
import { useEffect } from "react";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import * as z from "zod";
import { transformValue } from "@/lib/utils.ts";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Printer
}

const validationSchema = z.object({
  name: z.string().min(1, "This is required"),
  ip_address: z.string().ip({message: 'Invalid IP Address'}).min(1, "This is required"),
  port: z.number({message: "Invalid Port number"}).min(1, "This is required"),
  prints: z.number({message: "This is required"}).min(1, "This is required"),
  priority: z.number({message: "This is required"}),
});

export const PrinterForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      ip_address: null,
      port: null,
      prints: null,
      priority: null,
    });
  }

  useEffect(() => {
    if(data){
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        ip_address: data.ip_address,
        port: data.port,
        prints: data.prints,
      });
    }
  }, [data]);

  const db = useDB();

  const { register, control, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: zodResolver(validationSchema)
  });

  const onSubmit = async (values: any) => {
    const vals = {...values};

    try {
      if(data?.id){
        await db.update(data.id, {
          ...vals
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
            <div className="flex-1 flex gap-3">
              <div className="flex-1">
                <Input label="IP Address" {...register('ip_address')} error={errors?.ip_address?.message}/>
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
