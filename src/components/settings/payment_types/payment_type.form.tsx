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
import { PaymentType } from "@/api/model/payment_type.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tax } from "@/api/model/tax.ts";
import { StringRecordId } from "surrealdb";

interface Props {
  open: boolean
  onClose: () => void;
  data?: PaymentType
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  priority: yup.number().required("This is required").typeError('This should be a number'),
  type: yup.object({
    label: yup.string(),
    value: yup.string()
  }).required('This is required'),
  tax: yup.object({
    label: yup.string(),
    value: yup.string()
  }).nullable()
});

export const PaymentTypeForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      type: null,
      priority: null,
      tax: null
    });
  }

  useEffect(() => {
    if(data){
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        type: {
          label: data.type,
          value: data.type
        },
        tax: {
          label: `${data?.tax?.name} ${data?.tax?.rate}%`,
          value: data?.tax?.id
        }
      });
    }
  }, [data]);

  const db = useDB();

  const {
    data: taxes,
    fetch: fetchTaxes
  } = useApi<SettingsData<Tax>>(Tables.taxes, [], ['priority asc'], 0, 99999, [], {
    enabled: false
  });

  const { register, control, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const types = [
    'Cash', 'Card', 'Points'
  ];

  console.log(errors)

  const onSubmit = async (values: any) => {
    const vals = {...values};

    vals.priority = parseInt(vals.priority);
    vals.type = values.type.value;
    if(values.tax){
      vals.tax = new StringRecordId(values.tax.value);
    }

    try {
      if(vals.id){
        await db.update(vals.id, {
          ...vals
        })
      }else{
        await db.create(Tables.payment_types, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Payment type ${values.name} saved`);
    }catch(e){
      toast.error(e);
      console.log(e)
    }
  }

  useEffect(() => {
    if(open){
      fetchTaxes();
    }
  }, [open]);

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new payment type'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input label="Name" {...register('name')} autoFocus error={errors?.name?.message}/>
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

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="">Type</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={types.map(item => ({
                      label: item,
                      value: item
                    }))}
                  />
                )}
                name="type"
                control={control}
              />
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="">Tax</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={taxes?.data?.map(item => ({
                      label: `${item.name} ${item.rate}%`,
                      value: item.id
                    }))}
                    isClearable
                  />
                )}
                name="tax"
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
