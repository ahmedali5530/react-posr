import {REPORTS_AUDIT, REPORTS_DISCOUNTS} from "@/routes/posr.ts";
import {DateRange} from "@/components/reports/filters/date.range.tsx";
import {Button} from "@/components/common/input/button.tsx";

export const DiscountsFilter = () => {
  return (
    <form
      action={REPORTS_DISCOUNTS}
      className="flex flex-col gap-3 items-start"
      target="_blank"
    >
      <DateRange isRequired label="Select a range" />

      <Button
        variant="primary"
        filled
        type="submit"
      >Generate</Button>
    </form>
  );
}