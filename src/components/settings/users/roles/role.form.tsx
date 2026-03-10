import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { UserRole } from "@/api/model/user_role.ts";
import { ACCESS_RULE_MODULES } from "@/lib/access.rules.ts";

interface Props {
  open: boolean
  onClose: () => void
  data?: UserRole
}

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  roles: yup.array(
    yup.object({
      label: yup.string(),
      value: yup.string(),
    })
  ).default([]).min(1, "This is required"),
});

export const UserRoleForm = ({ open, onClose, data }: Props) => {
  const db = useDB();

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const closeModal = () => {
    onClose();
    reset({
      name: null,
      roles: [],
    });
  };

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        name: data.name,
        roles: (data.roles || []).map((item) => ({
          label: item,
          value: item,
        })),
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      roles: (values.roles || []).map((item: any) => item.value),
    };

    try {
      if (payload.id) {
        await db.update(payload.id, payload);
      } else {
        await db.create(Tables.user_roles, payload);
      }
      closeModal();
      toast.success(`Role ${values.name} saved`);
    } catch (e) {
      toast.error(String(e));
      console.log(e);
    }
  };

  return (
    <Modal
      title={data ? `Update ${data.name}` : "Create new role"}
      open={open}
      onClose={closeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex-1">
            <Input label="Role name" {...register("name")} autoFocus error={errors?.name?.message} />
          </div>
          <div className="flex-1">
            <label>Modules</label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={ACCESS_RULE_MODULES.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  isMulti
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
  );
};
