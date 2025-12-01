import {REPORTS_SALES_SUMMARY2} from "@/routes/posr.ts";
import {DateRange} from "@/components/reports/filters/date.range.tsx";
import {Button} from "@/components/common/input/button.tsx";

export const SalesSummary2Filter = () => {
  return (
    <form
      action={REPORTS_SALES_SUMMARY2}
      className="flex flex-col gap-3 items-start"
      target="_blank"
    >
      <DateRange isRequired label="Select a range"/>

      <Button
        variant="primary"
        filled
        type="submit"
      >Generate</Button>
    </form>
  );
}