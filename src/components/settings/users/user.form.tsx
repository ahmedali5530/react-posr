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
import { User } from "@/api/model/user.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";

interface Props {
  open: boolean
  onClose: () => void;
  data?: User
}

const validationSchema = yup.object({
  first_name: yup.string().required("This is required"),
  last_name: yup.string().required("This is required"),
  login: yup.string().required("This is required"),
  password: yup.string(),
  roles: yup.array(yup.object({
    label: yup.string(),
    value: yup.string(),
  })).default([]).min(1, 'This is required')
});

export const UserForm = ({
  open, onClose, data
}: Props) => {
  const closeModal = () => {
    onClose();
    reset({
      first_name: null,
      last_name: null,
      login: null,
      password: null,
      roles: []
    });
  }

  useEffect(() => {
    if( data ) {
      reset({
        ...data,
        first_name: data.first_name,
        last_name: data.last_name,
        login: data.login,
        roles: data?.roles?.map(item => ({
          label: item,
          value: item,
        })),
        password: null
      });
    }
  }, [data]);

  const db = useDB();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (values: any) => {
    const vals = { ...values };

    if(vals.roles){
      vals.roles = vals.roles.map(item => item.value);
    }

    try {
      if( vals.id ) {
        await db.query(`UPDATE ${vals.id} set first_name = $first_name, last_name = $last_name, login = $login, password = crypto::bcrypt::generate($password), roles = $roles`, {
          ...vals
        });
      } else {
        await db.query(`INSERT INTO user (first_name, last_name, login, password, roles) values ($first_name, $last_name, $login, crypto::bcrypt::generate($password), $roles)`, {
          ...vals
        });
      }

      closeModal();
      toast.success(`User ${values.first_name} ${values.last_name} saved`);
    } catch ( e ) {
      toast.error(e);
      console.log(e)
    }
  }

  return (
    <>
      <Modal
        title={data ? `Update ${data?.first_name} ${data?.last_name}` : 'Create new user'}
        open={open}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 flex-col mb-3">
            <div className="flex-1">
              <Input label="First name" {...register('first_name')} autoFocus error={errors?.first_name?.message}/>
            </div>
            <div className="flex-1">
              <Input label="Last name" {...register('last_name')} error={errors?.last_name?.message}/>
            </div>
            <div className="flex-1">
              <Input label="Login" {...register('login')} error={errors?.login?.message}/>
            </div>
            <div className="flex-1">
              <Input type="password" label="Password" {...register('password')} error={errors?.password?.message}/>
            </div>
            <div className="flex-1">
              <label htmlFor="roles">Roles</label>
              <Controller
                name="roles"
                control={control}
                render={({field}) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    isMulti
                    options={['Menu', 'Orders', 'Reports', 'Closing', 'Kitchen', 'Delivery', 'Admin', 'Riders'].map(item => ({
                      label: item,
                      value: item
                    }))}
                  />
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
