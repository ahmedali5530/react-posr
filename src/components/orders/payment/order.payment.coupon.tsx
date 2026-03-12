import { useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Coupon } from "@/api/model/coupon.ts";
import { withCurrency } from "@/lib/utils.ts";

interface Props {
  coupon?: Coupon;
  couponAmount: number;
  isApplying: boolean;
  onApply: (code: string) => void;
  onClear: () => void;
}

export const OrderPaymentCoupon = ({
  coupon,
  couponAmount,
  isApplying,
  onApply,
  onClear,
}: Props) => {
  const [code, setCode] = useState("");

  const handleApply = () => {
    onApply(code.trim());
  };

  const handleClear = () => {
    setCode("");
    onClear();
  };

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-4">
        <Input
          label="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          enableKeyboard={true}
        />
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleApply}
            isLoading={isApplying}
          >
            Apply
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={handleClear}
            disabled={!coupon && couponAmount === 0}
          >
            Clear
          </Button>
        </div>
        {coupon && (
          <div className="p-3 rounded bg-neutral-50 border border-neutral-200 text-sm">
            <div className="font-semibold mb-1">
              Applied coupon: {coupon.code}
            </div>
            {coupon.description && (
              <div className="mb-1 text-neutral-700">{coupon.description}</div>
            )}
            <div className="text-neutral-700">
              Discount: {withCurrency(couponAmount)}
            </div>
          </div>
        )}
        {!coupon && couponAmount > 0 && (
          <div className="p-3 rounded bg-neutral-50 border border-neutral-200 text-sm">
            Discount from coupon: {withCurrency(couponAmount)}
          </div>
        )}
      </div>
    </div>
  );
};

