import {DateRangePicker} from "@/components/common/react-aria/date.range.picker.tsx";
import {DateRangePickerProps as BaseDateRangePickerProps, DateValue, ValidationResult} from "react-aria-components";
import {useState} from "react";
import {DateTime} from "luxon";

interface DateRangePickerProps<T extends DateValue> extends BaseDateRangePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateRange<T extends DateValue>({
  startName = 'start', endName = 'end', ...props
}: DateRangePickerProps<T>) {
  const today = DateTime.now().toFormat(import.meta.env.VITE_DATE_FORMAT);
  const dates = {
    "All time": "to",
    "Today": `${today}to${today}`,
    "Yesterday": `${DateTime.now().minus({'day': 1}).toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().minus({'day': 1}).toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "This week": `${DateTime.now().startOf('week').toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().endOf('week').toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "Last week": `${DateTime.now().minus({week: 1}).startOf('week').toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().minus({week: 1}).endOf('week').toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "This month": `${DateTime.now().startOf('month').toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().endOf('month').toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "Last month": `${DateTime.now().minus({month: 1}).startOf('month').toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().minus({month: 1}).endOf('month').toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "This year": `${DateTime.now().startOf('year').toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().endOf('year').toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "Last year": `${DateTime.now().minus({year: 1}).startOf('year').toFormat(import.meta.env.VITE_DATE_FORMAT)}to${DateTime.now().minus({year: 1}).endOf('week').toFormat(import.meta.env.VITE_DATE_FORMAT)}`,
    "Custom": "CUS"
  }

  const [isCustom, setCustom] = useState(false);
  const [preset, setPreset] = useState(['', '']);

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="date-preset">Select a date</label>
      <select
        id="date-preset"
        onChange={(event) => {
          const value = event.target.value.split('to');
          if(value[0] === 'CUS') {
            setCustom(true);
          }else {
            setPreset(value);
            setCustom(false);
          }
        }}
        className="input bg-white self-center"
      >
        {Object.keys(dates).map(item => (
          <option key={item} value={dates[item]}>{item}</option>
        ))}
      </select>
      {!isCustom && (
        <>
          <input type="hidden" name="start" value={preset[0]}/>
          <input type="hidden" name="end" value={preset[1]}/>
        </>
      )}
      {isCustom && (
        <DateRangePicker
          startName={startName}
          endName={endName}
          {...props}
        />
      )}

    </div>
  );
}