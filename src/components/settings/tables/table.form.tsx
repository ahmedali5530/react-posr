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
import { Table } from "@/api/model/table.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Category } from "@/api/model/category.ts";
import { PaymentType } from "@/api/model/payment_type.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { Floor } from "@/api/model/floor.ts";
import { Switch } from "@/components/common/input/switch.tsx";
import { StringRecordId } from "surrealdb";

interface Props {
  open: boolean
  onClose: () => void;
  data?: Table
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  number: yup.string().required('This is required'),
  priority: yup.number().required("This is required").typeError('This should be a number'),
  background: yup.string().required('This is required'),
  color: yup.string().required('This is required'),
  floor: yup.object({
    label: yup.string().required(),
    value: yup.string().required(),
  }).default(undefined).required('This is required'),
  categories: yup.array(yup.object({
    label: yup.string(),
    value: yup.string()
  })),
  order_types: yup.array(yup.object({
    label: yup.string(),
    value: yup.string()
  })),
  payment_types: yup.array(yup.object({
    label: yup.string(),
    value: yup.string()
  })),
  ask_for_covers: yup.boolean().default(true),
});

export const TableForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      number: null,
      priority: null,
      background: null,
      color: null,
      floor: null,
      categories: [],
      order_types: [],
      payment_types: [],
      ask_for_covers: false,
    });
  }

  useEffect(() => {
    if(data){
      reset({
        ...data,
        name: data.name,
        number: data.number,
        priority: data.priority,
        background: data.background,
        color: data.color,
        floor: (data?.floor ? {label: data?.floor?.name, value: data?.floor?.id} : null),
        categories: data?.categories?.map(item => ({
          label: item.name,
          value: item.id
        })),
        order_types: data?.order_types?.map(item => ({
          label: item.name,
          value: item.id
        })),
        payment_types: data?.payment_types?.map(item => ({
          label: item.name,
          value: item.id
        })),
      });
    }
  }, [data]);

  const db = useDB();

  const { register, control, handleSubmit, formState: {errors}, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const {
    data: categories,
    fetchData: fetchCategories,
    isFetching: loadingCategories
  } = useApi<SettingsData<Category>>(Tables.categories, [], [], 0, 99999, [], {
    enabled: false
  });

  const {
    data: paymentTypes,
    fetchData: fetchPaymentTypes,
    isFetching: loadingPaymentTypes
  } = useApi<SettingsData<PaymentType>>(Tables.payment_types, [], [], 0, 99999, [], {
    enabled: false
  });

  const {
    data: orderTypes,
    fetchData: fetchOrderTypes,
    isFetching: loadingOrderTypes
  } = useApi<SettingsData<OrderType>>(Tables.order_types, [], [], 0, 99999, [], {
    enabled: false
  });

  const {
    data: floors,
    fetchData: fetchFloors,
    isFetching: loadingFloors
  } = useApi<SettingsData<Floor>>(Tables.floors, [], [], 0, 99999, [], {
    enabled: false
  });

  const onSubmit = async (values: any) => {
    const val = {...values};

    val.priority = parseInt(val.priority);
    if(val.floor){
      val.floor = new StringRecordId(val.floor.value);
    }
    if(val.categories){
      val.categories = val.categories.map(item => new StringRecordId(item.value));
    }
    if(val.order_types){
      val.order_types = val.order_types.map(item => new StringRecordId(item.value));
    }
    if(val.payment_types){
      val.payment_types = val.payment_types.map(item => new StringRecordId(item.value));
    }

    try {
      if(val.id){
        await db.update(val.id, {
          ...val
        })
      }else{
        await db.create(Tables.tables, {
          ...val
        });
      }

      closeModal();
      toast.success(`Table ${values.name}${values.number} saved`);
    }catch(e){
      toast.error(e);
      console.log(e)
    }
  }

  useEffect(() => {
    if(open){
      fetchFloors();
      fetchCategories();
      fetchPaymentTypes();
      fetchOrderTypes();
    }
  }, [open]);

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}${data?.number}` : 'Create new Table'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input label="Name of table" {...register('name')} autoFocus error={errors?.name?.message}/>
            </div>
            <div className="flex-1">
              <Input label="Number of table" {...register('number')} error={errors?.number?.message}/>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Controller
                name="ask_for_covers"
                control={control}
                render={({field}) => (
                  <Switch checked={field.value} onChange={field.onChange}>
                    Ask for number of covers
                  </Switch>
                )}
              />
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <Input type="color" label="Background color" {...register('background')}
                     error={errors?.background?.message}/>
            </div>
            <div className="flex-1">
              <Input type="color" label="Font color" {...register('color')} error={errors?.background?.message}/>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="">Floor</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={floors?.data?.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                    isLoading={loadingFloors}
                  />
                )}
                name="floor"
                control={control}
              />
              <InputError error={errors?.floor?.message} />
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
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="">Categories</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={categories?.data?.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                    isMulti
                    isLoading={loadingCategories}
                  />
                )}
                name="categories"
                control={control}
              />
            </div>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="">Order types</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={orderTypes?.data?.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                    isMulti
                    isLoading={loadingOrderTypes}
                  />
                )}
                name="order_types"
                control={control}
              />
            </div>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label htmlFor="">Payment types</label>
              <Controller
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={paymentTypes?.data?.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                    isMulti
                    isLoading={loadingPaymentTypes}
                  />
                )}
                name="payment_types"
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
