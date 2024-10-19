import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { toast } from 'sonner';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { ModifierGroup } from "@/api/model/modifier_group.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import { Dish } from "@/api/model/dish.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DishForm } from "@/components/settings/dishes/dish.form.tsx";
import { StringRecordId } from "surrealdb";

interface Props {
  open: boolean
  onClose: () => void;
  data?: ModifierGroup
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  priority: yup.number().required("This is required").typeError('This should be a number'),
  modifiers: yup.array(yup.object({
    modifier: yup.object({
      label: yup.string(),
      value: yup.string()
    }).default(undefined).required('This is required'),
    price: yup.number().required('This is required')
  })).min(1, 'This is required')
});

export const ModifierGroupForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      name: null,
      priority: null,
      modifiers: []
    });
  }

  useEffect(() => {
    if( data ) {
      reset({
        ...data,
        name: data.name,
        priority: data.priority,
        modifiers: data.modifiers.map(item => ({
          modifier: {
            label: item.modifier.name,
            value: item.modifier.id
          },
          id: item.id,
          price: item.price
        }))
      });
    }
  }, [data]);

  useEffect(() => {
    if(open){
      fetchDishes();
    }
  }, [open]);

  const db = useDB();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const {
    fields, append, remove
  } = useFieldArray({
    name: 'modifiers',
    control: control
  });

  const {
    data: dishes,
    isFetching: loadingDishes,
    fetchData: fetchDishes
  } = useApi<SettingsData<Dish>>(Tables.dishes, [], ['priority asc'], 0, 99999, [], {
    'enabled': false
  });

  const onSubmit = async (values: any) => {
    const vals = { ...values };

    vals.priority = parseInt(vals.priority);
    const modifiers = [];
    if(vals.modifiers){
      for(const m of vals.modifiers){
        if(m.id){
          await db.merge(m.id, {
            modifier: new StringRecordId(m.modifier.value),
            price: m.price
          });

          modifiers.push(m.id);

        }else{
          const record = await db.create(Tables.modifiers, {
            modifier: new StringRecordId(m.modifier.value),
            price: m.price
          });

          modifiers.push(record[0].id);
        }
      }

      vals.modifiers = modifiers;
    }

    try {
      if( vals.id ) {
        await db.update(vals.id, {
          ...vals
        })
      } else {
        await db.create(Tables.modifier_groups, {
          ...vals
        });
      }

      closeModal();
      toast.success(`Modifier group ${values.name} saved`);
    } catch ( e ) {
      toast.error(e);
      console.log(e)
    }
  }

  const [dishModal, setDishModal] = useState(false);

  return (
    <>
      <Modal
        title={data ? `Update ${data?.name}` : 'Create new modifier group'}
        open={open}
        onClose={closeModal}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3 flex gap-3">
            <div>
              <Input label="Name" {...register('name')} autoFocus error={errors?.name?.message}/>
            </div>
            <div>
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

          <div className="mb-3">
            <fieldset className="border-2 border-neutral-900 rounded-lg p-3">
              <legend>Modifiers</legend>

              <div className="flex gap-3 mb-3">
                <Button onClick={() => {
                  append({
                    modifier: null,
                    price: 0
                  })
                }} variant="primary" type="button" icon={faPlus}>modifier</Button>

                <Button onClick={() => {
                  setDishModal(true)
                }} variant="primary" type="button" icon={faPlus} flat>New modifier</Button>
              </div>

              {fields.map((item, index) => (
                <div className="flex gap-3 mb-3" key={item.id}>
                  <div className="flex-1">
                    <label htmlFor="modifier">Modifier</label>
                    <Controller
                      control={control}
                      name={`modifiers.${index}.modifier`}
                      render={({ field }) => (
                        <ReactSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={dishes?.data?.map(item => ({
                            label: item.name,
                            value: item.id
                          }))}
                          isLoading={loadingDishes}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name={`modifiers.${index}.price`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          label="Price"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1 self-end">
                    <Button iconButton variant="danger" onClick={() => remove(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              ))}
            </fieldset>
          </div>

          <div>
            <Button type="submit" variant="primary">Save</Button>
          </div>
        </form>
      </Modal>

      {dishModal && (
        <DishForm
          open={dishModal}
          onClose={() => {
            setDishModal(false);
            fetchDishes();
          }}
        />
      )}
    </>
  )
}
