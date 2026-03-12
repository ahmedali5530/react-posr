import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input, InputError } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { Controller, useForm } from "react-hook-form";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { toast } from "sonner";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Coupon, CouponType, WeekDay } from "@/api/model/coupon.ts";
import { ReactSelect } from "@/components/common/input/custom.react.select.tsx";

interface Props {
  open: boolean;
  onClose: () => void;
  data?: Coupon;
}

const weekDayOptions: { label: string; value: WeekDay }[] = [
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
  { label: "Fri", value: "fri" },
  { label: "Sat", value: "sat" },
  { label: "Sun", value: "sun" },
];

const validationSchema = yup.object({
  code: yup.string().required("This is required"),
  description: yup.string().nullable(),
  coupon_type: yup
    .object({
      label: yup.string(),
      value: yup.mixed<CouponType>(),
    })
    .required("This is required"),
  discount_type: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .required("This is required"),
  discount_value: yup
    .number()
    .typeError("This should be a number")
    .required("This is required"),
  min_order_amount: yup
    .number()
    .typeError("This should be a number")
    .nullable(),
  max_discount_amount: yup
    .number()
    .typeError("This should be a number")
    .nullable(),
  usage_limit: yup.number().typeError("This should be a number").nullable(),
  usage_limit_per_user: yup
    .number()
    .typeError("This should be a number")
    .nullable(),
  priority: yup
    .number()
    .typeError("This should be a number")
    .required("This is required"),
  valid_days: yup.array().of(
    yup.object({
      label: yup.string(),
      value: yup.mixed<WeekDay>(),
    })
  ),
  stackable: yup.boolean().default(false),
  first_order_only: yup.boolean().default(false),
  is_active: yup.boolean().default(true),
  start_time: yup.string().nullable(),
  end_time: yup.string().nullable(),
  start_date: yup.string().nullable(),
  end_date: yup.string().nullable(),
});

export const CouponForm = ({ open, onClose, data }: Props) => {
  const db = useDB();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const closeModal = () => {
    onClose();
    reset({});
  };

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        coupon_type: data.coupon_type
          ? { label: data.coupon_type, value: data.coupon_type }
          : undefined,
        discount_type: data.discount_type
          ? { label: data.discount_type, value: data.discount_type }
          : undefined,
        valid_days: (data.valid_days || []).map((d) => ({
          label: d,
          value: d,
        })),
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: any) => {
    const vals = { ...values };

    if (vals.coupon_type) {
      vals.coupon_type = vals.coupon_type.value;
    }
    if (vals.discount_type) {
      vals.discount_type = vals.discount_type.value;
    }
    if (Array.isArray(vals.valid_days)) {
      vals.valid_days = vals.valid_days.map(
        (item: { value: WeekDay }) => item.value
      );
    }

    // Normalize date/time fields to JS Date objects before sending to DB
    const toDateTime = (input?: string | null) => {
      if (!input) return undefined;
      const d = new Date(input);
      return Number.isNaN(d.getTime()) ? undefined : d;
    };

    const toTimeOfDayDate = (input?: string | null) => {
      if (!input) return undefined;
      const [hh, mm] = input.split(":").map((v) => Number(v) || 0);
      const d = new Date();
      d.setHours(hh, mm, 0, 0);
      return d;
    };

    vals.start_date = toDateTime(vals.start_date);
    vals.end_date = toDateTime(vals.end_date);
    vals.start_time = toTimeOfDayDate(vals.start_time);
    vals.end_time = toTimeOfDayDate(vals.end_time);

    try {
      if (vals.id) {
        await db.update(vals.id, {
          ...vals,
          updated_at: new Date(),
        });
      } else {
        await db.create(Tables.coupons, {
          ...vals,
          used_count: 0,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      closeModal();
      toast.success(`Coupon ${values.code} saved`);
    } catch (e) {
      toast.error(e);
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  return (
    <Modal
      title={data ? `Update coupon ${data.code}` : "Create new coupon"}
      open={open}
      onClose={closeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-3">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  label="Code"
                  autoFocus
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.code?.message as string}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  label="Description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.description?.message as string}
                />
              )}
            />
            <div>
              <label>Coupon type</label>
              <Controller
                name="coupon_type"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={(["order", "product", "shipping"] as CouponType[]).map(
                      (item) => ({
                        label: item,
                        value: item,
                      })
                    )}
                  />
                )}
              />
              <InputError error={errors?.coupon_type?.message as string} />
            </div>
            <div>
              <label>Discount type</label>
              <Controller
                name="discount_type"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={["Fixed", "Percent"].map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                )}
              />
              <InputError error={errors?.discount_type?.message as string} />
            </div>
            <Controller
              name="discount_value"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Discount value"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.discount_value?.message as string}
                />
              )}
            />
            <Controller
              name="min_order_amount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Min order amount"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.min_order_amount?.message as string}
                />
              )}
            />
            <Controller
              name="max_discount_amount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Max discount amount"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.max_discount_amount?.message as string}
                />
              )}
            />
            <Controller
              name="usage_limit"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Usage limit (overall)"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.usage_limit?.message as string}
                />
              )}
            />
            <Controller
              name="usage_limit_per_user"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Usage limit per user"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.usage_limit_per_user?.message as string}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Priority"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors?.priority?.message as string}
                />
              )}
            />
            <div>
              <label>Valid days</label>
              <Controller
                name="valid_days"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    isMulti
                    value={field.value}
                    onChange={field.onChange}
                    options={weekDayOptions}
                  />
                )}
              />
              <InputError error={errors?.valid_days?.message as string} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => {
                  const value = field.value
                    ? typeof field.value === "string"
                      ? field.value
                      : new Date(field.value as any).toTimeString().slice(0, 5)
                    : "";
                  return (
                    <Input
                      type="time"
                      label="Start time"
                      value={value}
                      onChange={field.onChange}
                      error={errors?.start_time?.message as string}
                    />
                  );
                }}
              />
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => {
                  const value = field.value
                    ? typeof field.value === "string"
                      ? field.value
                      : new Date(field.value as any).toTimeString().slice(0, 5)
                    : "";
                  return (
                    <Input
                      type="time"
                      label="End time"
                      value={value}
                      onChange={field.onChange}
                      error={errors?.end_time?.message as string}
                    />
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => {
                  const value = field.value
                    ? typeof field.value === "string"
                      ? field.value
                      : new Date(field.value as any).toISOString().slice(0, 16)
                    : "";
                  return (
                    <Input
                      type="datetime-local"
                      label="Start date"
                      value={value}
                      onChange={field.onChange}
                      error={errors?.start_date?.message as string}
                    />
                  );
                }}
              />
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => {
                  const value = field.value
                    ? typeof field.value === "string"
                      ? field.value
                      : new Date(field.value as any).toISOString().slice(0, 16)
                    : "";
                  return (
                    <Input
                      type="datetime-local"
                      label="End date"
                      value={value}
                      onChange={field.onChange}
                      error={errors?.end_date?.message as string}
                    />
                  );
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("stackable")} id="stackable" />
              <label htmlFor="stackable">Stackable with other discounts</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("first_order_only")}
                id="first_order_only"
              />
              <label htmlFor="first_order_only">First order only</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("is_active")} id="is_active" />
              <label htmlFor="is_active">Active</label>
            </div>
          </div>
        </div>
        <div>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

