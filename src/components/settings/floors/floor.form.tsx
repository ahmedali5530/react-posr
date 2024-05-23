import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { Controller, useForm } from "react-hook-form";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { toast } from 'sonner';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Floor } from "@/api/model/floor.ts";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Floor
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  priority: yup.number().required("This is required").typeError('This should be a number'),
  background: yup.string(),
  color: yup.string(),
});

export const FloorForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      priority: null,
      background: null,
      color: null,
    });
  }

  useEffect(() => {
    if( data ) {
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        background: data.background,
        color: data.color,
      });
    }
  }, [data]);

  const db = useDB();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (values: any) => {
    const vals = {...values};
    vals.priority = parseInt(vals.priority);

    try {
      if( vals.id ) {
        await db.update(vals.id, {
          ...vals
        })
      } else {
        await db.create(Tables.floors, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Floor ${values.name} saved`);
    } catch ( e ) {
      toast.error(e);
      console.log(e)
    }
  }

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new Floor'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input label="Name of table" {...register('name')} autoFocus error={errors?.name?.message}/>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input type="color" label="Background color" {...register('background')}
                     error={errors?.background?.message}/>
            </div>
            <div className="flex-1">
              <Input type="color" label="Font color" {...register('color')} error={errors?.color?.message}/>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Controller
                render={({ field }) => (
                  <Input
                    type="number"
                    label="Priority"
                    error={errors?.priority?.message}
                    value={field.value}
                    onChange={field.onChange}
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
