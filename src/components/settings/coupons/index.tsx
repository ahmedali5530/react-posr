import { useState } from "react";
import { Tables } from "@/api/db/tables.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TableComponent } from "@/components/common/table/table.tsx";
import { Coupon } from "@/api/model/coupon.ts";
import { CouponForm } from "@/components/settings/coupons/coupon.form.tsx";

export const AdminCoupons = () => {
  const loadHook = useApi<SettingsData<Coupon>>(Tables.coupons);

  const [data, setData] = useState<Coupon>();
  const [formModal, setFormModal] = useState(false);

  const columnHelper = createColumnHelper<Coupon>();

  const columns: any = [
    columnHelper.accessor("code", {
      header: "Code",
    }),
    columnHelper.accessor("description", {
      header: "Description",
    }),
    columnHelper.accessor("coupon_type", {
      header: "Type",
    }),
    columnHelper.accessor("discount_type", {
      header: "Discount type",
    }),
    columnHelper.accessor("discount_value", {
      header: "Value",
    }),
    columnHelper.accessor("min_order_amount", {
      header: "Min order",
    }),
    columnHelper.accessor("max_discount_amount", {
      header: "Max discount",
    }),
    columnHelper.accessor("usage_limit", {
      header: "Usage limit",
    }),
    columnHelper.accessor("usage_limit_per_user", {
      header: "Per user limit",
    }),
    columnHelper.accessor("used_count", {
      header: "Used",
    }),
    columnHelper.accessor("stackable", {
      header: "Stackable",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("first_order_only", {
      header: "First order only",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
    }),
    columnHelper.accessor("is_active", {
      header: "Active",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: (info) => {
        return (
          <Button
            variant="primary"
            onClick={() => {
              setData(info.row.original);
              setFormModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPencil} />
          </Button>
        );
      },
    }),
  ];

  return (
    <>
      <TableComponent
        columns={columns}
        loaderHook={loadHook}
        loaderLineItems={columns.length}
        buttons={[
          <Button
            variant="primary"
            onClick={() => {
              setFormModal(true);
            }}
            icon={faPlus}
            key="new-coupon"
          >
            Coupon
          </Button>,
        ]}
      />

      {formModal && (
        <CouponForm
          open={formModal}
          data={data}
          onClose={() => {
            setFormModal(false);
            setData(undefined);
            loadHook.fetchData();
          }}
        />
      )}

    </>
  );
};

