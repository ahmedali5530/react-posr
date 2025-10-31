import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { Controller, useForm } from "react-hook-form";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { Category } from "@/api/model/category.ts";
import { toast } from 'sonner';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import {Switch} from "@/components/common/input/switch.tsx";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Category
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  priority: yup.number().required("This is required").typeError('This should be a number'),
  show_in_menu: yup.boolean()
});

export const CategoryForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      priority: null,
      show_in_menu: null
    });
  }

  useEffect(() => {
    if(data){
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        show_in_menu: data.show_in_menu,
      });
    }
  }, [data]);

  const db = useDB();

  const { register, control, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (values: any) => {
    const vals = {...values};
    vals.priority = parseInt(vals.priority);

    try {
      if(vals.id){
        await db.update(vals.id, {
          ...vals
        })
      }else{
        await db.create(Tables.categories, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Category ${values.name} saved`);
    }catch(e){
      toast.error(e);
      console.log(e)
    }
  }

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new category'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input label="Name of category" {...register('name')} autoFocus error={errors?.name?.message} />
            </div>
            <div className="flex-1">
              <Controller
                render={({field}) => (
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
          <div className="mb-3">
            <div className="flex-1">
              <Controller
                name={`show_in_menu`}
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange}>
                    Show this category in menu
                  </Switch>
                )}
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
