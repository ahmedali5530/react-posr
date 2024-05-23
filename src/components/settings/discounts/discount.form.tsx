import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input, InputError } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { Controller, useForm } from "react-hook-form";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { toast } from 'sonner';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Discount } from "@/api/model/discount.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Discount
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  type: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }).default(undefined).required('This is required'),
  rate: yup.number().required("This is required"),
  priority: yup.number().required("This is required").typeError('This should be a number'),
});

export const DiscountForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      rate: null,
      type: null,
      priority: null
    });
  }

  useEffect(() => {
    if( data ) {
      reset({
        ...data,
        name: data.name,
        rate: data.rate,
        type: { label: data.type, value: data.type },
        priority: data.priority
      });
    }
  }, [data]);

  const db = useDB();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (values: any) => {
    const vals = { ...values };
    vals.priority = parseInt(vals.priority);
    if(vals.type){
      vals.type = vals.type.value;
    }

    try {
      if( vals.id ) {
        await db.update(vals.id, {
          ...vals
        })
      } else {
        await db.create(Tables.discounts, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Discount ${values.name} saved`);
    } catch ( e ) {
      toast.error(e);
      console.log(e)
    }
  }

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new discount'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 flex-col mb-3">
            <div className="flex-1">
              <Input label="Name" {...register('name')} autoFocus error={errors?.name?.message}/>
            </div>
            <div className="flex-1">
              <label htmlFor="">Type</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={['Fixed', 'Percent'].map(item => ({
                      label: item,
                      value: item
                    }))}
                  />
                )}
                name="type"
                control={control}
              />
              <InputError error={errors?.type?.message}/>
            </div>
            <div className="flex-1">
              <Controller
                render={({ field }) => (
                  <Input
                    label="Rate"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.rate?.message}
                  />
                )}
                name="rate"
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
